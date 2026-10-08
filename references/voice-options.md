# Voice-over options

Present these before generating the final audio, with cost for this script. Count characters with:
`python3 -c "import json;print(sum(len(l.get('say',l['t'])) for s in json.load(open('script.json')) for l in s['lines']))"`

| Option | Quality | Cost | Notes |
|---|---|---|---|
| macOS Premium voices (`say`) | good, slightly synthetic | free | macOS only. Download in System Settings > Accessibility > Spoken Content > System Voice > Manage Voices. Pick voices marked Premium or Enhanced (for example Ava, Zoe, Matilda, Jamie). Siri voices cannot be used from the command line. |
| ElevenLabs | best for natural English, strong in 30+ languages | free tier about 10k characters a month (non-commercial, attribution); paid plans from about $6 a month with commercial rights; API about $0.10 per 1,000 characters | Library voices, voices designed from a text description, or a clone of the user's own voice on higher plans. Check current plans on elevenlabs.io/pricing before quoting. |
| OpenAI TTS (`gpt-4o-mini-tts`) | good, steerable with an instruction like "warm, clear explainer" | roughly $15 per million characters, so cents per video | Needs an OpenAI API key. |
| User's own recordings | most authentic | free | Best when the user presents the video themselves. |

## How each option plugs in

`voice.json` in the project picks the engine:

```json
{"engine": "say", "voice": "Ava (Premium)", "rate": 185}
{"engine": "elevenlabs", "voice_id": "<id>", "model": "eleven_multilingual_v2"}
{"engine": "openai", "voice": "coral", "model": "gpt-4o-mini-tts", "instructions": "Warm, clear explainer tone.", "trim": true, "tempo": 1.05}
{"engine": "files"}
```

Optional keys for every engine:

- `trim` cuts silence at the start and end of each clip (on by default for `openai` and `elevenlabs`, whose clips carry about 0.2 s of padding on each side). The pauses between lines come from `lead`, `gap` and `tail` in `config.json`, so padding inside the clips only makes the video longer.
- `tempo` speeds the voice up or down without changing its pitch (ffmpeg `atempo`). 1.03 to 1.08 tightens a slow voice without sounding rushed.

Generated clips are cached: `make_audio.py` writes `audio/<scene>_<line>.tts.key` next to each clip and reuses the clip while the spoken text and the voice settings are unchanged. Editing one line re-voices only that line, and changing `trim`, `tempo` or `config.json` timing costs nothing.

- **Keys.** The user creates `<project>/.env` with `ELEVENLABS_API_KEY=...` or `OPENAI_API_KEY=...`. ElevenLabs keys need the Text to Speech permission (and Voices read, for `--list-voices`). Never ask for a key in chat.
- **Own recordings.** One file per line, named `audio/<sceneId>_<lineIndex>.wav` (or mp3, m4a, aiff), for example `audio/intro_0.wav`. Record in a quiet room, leave half a second of silence at the start and end, and keep the same distance from the mic. `make_audio.py` measures each clip, so drawings follow the real timing automatically.
- **Speed.** macOS rate 180 to 195 sounds natural for most Premium voices. Faster than 200 starts to sound rushed.
- **Pronunciation.** Use the `say` field: spell out acronyms (`S.E.C.`), numbers (`thirty-seven billion`), and brand names that the voice mangles (`BUIDL` spoken as `Build`). For macOS, `[[slnc 250]]` inserts a 250 ms pause. Neural voices (OpenAI, ElevenLabs) read plain text better: keep `ECDSA` or `AI` as written and put hints in the OpenAI `instructions` instead ("Say ECDSA as letters. Hegotá is pronounced heh-go-TAH."). Spellings like `A.I.` or `E-C-D-S-A` that help macOS can sound odd on them.
- **OpenAI voices.** `gpt-4o-mini-tts` offers alloy, ash, ballad, coral, echo, fable, nova, onyx, sage, shimmer, verse, marin and cedar; OpenAI recommends marin or cedar for quality. A 3.5-minute script costs about $0.05 (audio output is priced at $12 per million tokens as of October 2026). OpenAI's usage policies require telling viewers the voice is AI-generated: add a small note on the last board and in the post.
- **Certificates.** The python.org macOS installers ship without CA certificates, so HTTPS calls fail with `CERTIFICATE_VERIFY_FAILED`. `make_audio.py` then retries with the system bundle at `/etc/ssl/cert.pem`.

## Samples first

Render one sentence with two to four candidate voices and send the combined file, so the user chooses by ear:

```bash
python3 scripts/make_audio.py <project> --samples "One representative sentence from the script." \
  --voices "say:Ava (Premium):185" "say:Matilda (Premium):185" "elevenlabs:<voice_id>"
python3 scripts/make_audio.py <project> --samples "One representative sentence from the script." \
  --voices "openai:marin" "openai:cedar" "openai:coral" --instructions "Warm, clear explainer tone."
```

`--instructions` applies to the `openai` voices, so the samples sound like the final render. Pick a sentence that contains the hardest words in the script (acronyms, names), so pronunciation is checked at the same time.
