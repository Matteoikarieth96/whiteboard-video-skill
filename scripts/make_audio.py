#!/usr/bin/env python3
"""Voiceover for a whiteboard video project.

Usage:
  make_audio.py <project>                     build narration.wav + timeline.json from script.json and voice.json
  make_audio.py <project> --list-voices       list usable voices (macOS premium/enhanced voices, ElevenLabs voices if a key is set)
  make_audio.py <project> --samples "text" --voices "say:Samantha:185" "say:Ava (Premium):180" "elevenlabs:<voice_id>"
                                              render the same sentence with several voices into <project>/voice-samples/
                                              (--instructions "Warm, clear explainer tone." applies to openai voices)

voice.json examples:
  {"engine": "say", "voice": "Ava (Premium)", "rate": 185}
  {"engine": "elevenlabs", "voice_id": "<id>", "model": "eleven_multilingual_v2"}
  {"engine": "openai", "voice": "coral", "model": "gpt-4o-mini-tts", "instructions": "Warm, clear explainer tone."}
  {"engine": "files"}   # your own recordings: audio/<sceneId>_<lineIndex>.wav|mp3|m4a|aiff

API keys are read from the environment or from <project>/.env (ELEVENLABS_API_KEY, OPENAI_API_KEY).
Keys are never written anywhere else and never printed.
"""
import argparse, array, json, os, ssl, subprocess, sys, urllib.request, urllib.error, wave

SR = 48000


def load_env(project):
    env = dict(os.environ)
    p = os.path.join(project, ".env")
    if os.path.exists(p):
        for line in open(p):
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                env.setdefault(k.strip(), v.strip().strip('"').strip("'"))
    return env


def http_post(url, headers, body, ctx=None):
    req = urllib.request.Request(url, data=json.dumps(body).encode(), headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=120, context=ctx) as r:
            return r.read()
    except urllib.error.HTTPError as e:
        msg = e.read().decode(errors="replace")[:400]
        sys.exit(f"TTS request failed ({e.code}): {msg}")
    except urllib.error.URLError as e:
        # python.org builds on macOS ship without CA certificates: retry with the system bundle
        if ctx is None and "CERTIFICATE_VERIFY_FAILED" in str(e) and os.path.exists("/etc/ssl/cert.pem"):
            return http_post(url, headers, body, ssl.create_default_context(cafile="/etc/ssl/cert.pem"))
        raise


def synth(spec, text, out_base, env):
    """Write one spoken line to out_base.<ext>; return the file path."""
    eng = spec.get("engine", "say")
    if eng == "say":
        path = out_base + ".aiff"
        cmd = ["say", "-v", spec.get("voice", "Samantha"), "-r", str(spec.get("rate", 185)), "-o", path, text]
        subprocess.run(cmd, check=True)
        return path
    if eng == "elevenlabs":
        key = env.get("ELEVENLABS_API_KEY") or sys.exit("ELEVENLABS_API_KEY missing (put it in <project>/.env)")
        vid = spec.get("voice_id") or sys.exit("voice.json needs voice_id for ElevenLabs")
        body = {"text": text, "model_id": spec.get("model", "eleven_multilingual_v2")}
        if "voice_settings" in spec:
            body["voice_settings"] = spec["voice_settings"]
        data = http_post(f"https://api.elevenlabs.io/v1/text-to-speech/{vid}?output_format=mp3_44100_128",
                         {"xi-api-key": key, "Content-Type": "application/json", "Accept": "audio/mpeg"}, body)
        path = out_base + ".mp3"
        open(path, "wb").write(data)
        return path
    if eng == "openai":
        key = env.get("OPENAI_API_KEY") or sys.exit("OPENAI_API_KEY missing (put it in <project>/.env)")
        body = {"model": spec.get("model", "gpt-4o-mini-tts"), "voice": spec.get("voice", "coral"),
                "input": text, "response_format": "wav"}
        if spec.get("instructions"):
            body["instructions"] = spec["instructions"]
        data = http_post("https://api.openai.com/v1/audio/speech",
                         {"Authorization": f"Bearer {key}", "Content-Type": "application/json"}, body)
        path = out_base + ".wav"
        open(path, "wb").write(data)
        return path
    sys.exit(f"unknown engine {eng}")


EXT = {"say": ".aiff", "elevenlabs": ".mp3", "openai": ".wav"}
SYNTH_KEYS = ("engine", "voice", "voice_id", "model", "rate", "instructions", "voice_settings")


def cached_synth(spec, text, out_base, env):
    """Reuse the previous clip when the spoken text and voice settings are unchanged (saves paid API calls)."""
    key = json.dumps({"text": text, **{k: spec[k] for k in SYNTH_KEYS if k in spec}}, sort_keys=True, ensure_ascii=False)
    path, kfile = out_base + EXT.get(spec.get("engine", "say"), ".wav"), out_base + ".key"
    if os.path.exists(path) and os.path.exists(kfile) and open(kfile).read() == key:
        return path
    path = synth(spec, text, out_base, env)
    open(kfile, "w").write(key)
    return path


def to_raw(src, raw, trim=False, tempo=1.0):
    """Convert a clip to mono 48 kHz raw PCM; optionally trim edge silence and change speed (pitch kept)."""
    af = []
    if trim:
        edge = "silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.05"
        af += [edge, "areverse", edge, "areverse"]
    if abs(tempo - 1.0) > 1e-3:
        af.append(f"atempo={tempo}")
    cmd = ["ffmpeg", "-y", "-loglevel", "error", "-i", src] + (["-af", ",".join(af)] if af else []) + ["-ar", str(SR), "-ac", "1", "-f", "s16le", raw]
    subprocess.run(cmd, check=True)
    return os.path.getsize(raw) / 2 / SR


def find_recording(audio_dir, sid, li):
    for ext in ("wav", "mp3", "m4a", "aiff", "aif"):
        p = os.path.join(audio_dir, f"{sid}_{li}.{ext}")
        if os.path.exists(p):
            return p
    sys.exit(f"missing recording {sid}_{li}.(wav|mp3|m4a|aiff) in {audio_dir}")


def build(project):
    cfg = json.load(open(os.path.join(project, "config.json"))) if os.path.exists(os.path.join(project, "config.json")) else {}
    spec = json.load(open(os.path.join(project, "voice.json")))
    script = json.load(open(os.path.join(project, "script.json")))
    env = load_env(project)
    fps = cfg.get("fps", 30)
    lead, gap, tail, hold = cfg.get("lead", .35), cfg.get("gap", .22), cfg.get("tail", .55), cfg.get("endHold", .8)
    audio = os.path.join(project, "audio")
    os.makedirs(audio, exist_ok=True)
    t, clips, scenes = 0.0, [], []
    for si, sc in enumerate(script):
        s0, lines = t, []
        t += lead
        for li, ln in enumerate(sc["lines"]):
            base = os.path.join(audio, f"{sc['id']}_{li}")
            src = find_recording(audio, sc["id"], li) if spec.get("engine") == "files" else cached_synth(spec, ln.get("say", ln["t"]), base + ".tts", env)
            d = to_raw(src, base + ".raw", spec.get("trim", spec.get("engine") in ("openai", "elevenlabs")), spec.get("tempo", 1.0))
            lines.append({"text": ln["t"], "start": round(t, 3), "end": round(t + d, 3)})
            clips.append((t, base + ".raw"))
            t += d + (gap if li < len(sc["lines"]) - 1 else 0)
        t += tail + (hold if si == len(script) - 1 else 0)
        t = round(t * fps) / fps
        scenes.append({"id": sc["id"], "start": round(s0, 3), "end": round(t, 3), "lines": lines})
    buf = array.array("h", [0]) * (int(t * SR) + SR)
    for start, raw in clips:
        a = array.array("h"); a.frombytes(open(raw, "rb").read())
        o = int(start * SR)
        buf[o:o + len(a)] = a
    buf = buf[:int(t * SR)]
    w = wave.open(os.path.join(project, "narration.wav"), "wb")
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(buf.tobytes()); w.close()
    json.dump({"total": t, "scenes": scenes}, open(os.path.join(project, "timeline.json"), "w"), indent=1)
    print(f"total {t:.2f}s")
    for s in scenes:
        print(f"  {s['id']:<14} {s['start']:7.2f} -> {s['end']:7.2f}  ({s['end'] - s['start']:.2f}s, {len(s['lines'])} lines)")


def parse_voice(v):
    parts = v.split(":")
    if parts[0] == "say":
        return {"engine": "say", "voice": parts[1], "rate": int(parts[2]) if len(parts) > 2 else 185}
    if parts[0] == "elevenlabs":
        return {"engine": "elevenlabs", "voice_id": parts[1], "model": parts[2] if len(parts) > 2 else "eleven_multilingual_v2"}
    if parts[0] == "openai":
        return {"engine": "openai", "voice": parts[1], "model": parts[2] if len(parts) > 2 else "gpt-4o-mini-tts"}
    sys.exit(f"bad voice spec {v}")


def samples(project, text, voices, instructions=None):
    env = load_env(project)
    out = os.path.join(project, "voice-samples")
    os.makedirs(out, exist_ok=True)
    listing, gap = [], os.path.join(out, "_gap.wav")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "lavfi", "-i", f"anullsrc=r={SR}:cl=mono", "-t", "1.2", gap], check=True)
    for i, v in enumerate(voices, 1):
        spec = parse_voice(v)
        if instructions and spec["engine"] == "openai":
            spec["instructions"] = instructions
        name = f"{i:02d}-" + "".join(c for c in v if c.isalnum() or c in "-_")[:40]
        src = synth(spec, text, os.path.join(out, name), env)
        wav = os.path.join(out, name + ".norm.wav")
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", src, "-ar", str(SR), "-ac", "1", "-af", "loudnorm=I=-16", wav], check=True)
        dur = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", wav]).decode())
        print(f"{i}. {v}  ({dur:.1f}s)")
        listing += [f"file '{wav}'", f"file '{gap}'"]
    lst = os.path.join(out, "_list.txt")
    open(lst, "w").write("\n".join(listing) + "\n")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", lst, "-c:a", "aac", "-b:a", "160k",
                    os.path.join(out, "all-samples.m4a")], check=True)
    print("wrote", os.path.join(out, "all-samples.m4a"))


def list_voices(project):
    env = load_env(project)
    if sys.platform == "darwin":
        out = subprocess.check_output(["say", "-v", "?"]).decode()
        good = [l for l in out.splitlines() if any(k in l for k in ("Premium", "Enhanced", "Avanzata", "Samantha", "Daniel"))]
        print("macOS voices (Premium/Enhanced sound best; download more in System Settings > Accessibility > Spoken Content):")
        for l in good:
            print("  ", l.split("#")[0].rstrip())
    if env.get("ELEVENLABS_API_KEY"):
        req = urllib.request.Request("https://api.elevenlabs.io/v1/voices", headers={"xi-api-key": env["ELEVENLABS_API_KEY"]})
        try:
            data = json.load(urllib.request.urlopen(req, timeout=60))
            print("ElevenLabs voices:")
            for v in data.get("voices", [])[:40]:
                lab = v.get("labels") or {}
                print(f"   {v['voice_id']}  {v['name']:<20} {lab.get('accent', '')} {lab.get('gender', '')} {lab.get('description', '')}")
        except urllib.error.HTTPError as e:
            print(f"ElevenLabs voice list failed ({e.code}); check the key has Voices read permission")


if __name__ == "__main__":
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("project")
    ap.add_argument("--samples")
    ap.add_argument("--voices", nargs="+")
    ap.add_argument("--instructions", help="tone instruction applied to openai sample voices, as in voice.json")
    ap.add_argument("--list-voices", action="store_true")
    a = ap.parse_args()
    proj = os.path.abspath(a.project)
    if a.list_voices:
        list_voices(proj)
    elif a.samples:
        samples(proj, a.samples, a.voices or ["say:Samantha:185"], a.instructions)
    else:
        build(proj)
