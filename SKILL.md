---
name: whiteboard-video
description: Make hand-drawn whiteboard explainer videos (animated marker drawings, voice-over, burned-in captions, MP4) on any topic. Use this whenever the user wants an explainer video, a whiteboard or "drawn" animation, an animated explainer for a talk, a short video for X/LinkedIn/YouTube that explains a concept, or asks to turn a script, article, slide deck or topic into a narrated video, even if they don't say "whiteboard". It interviews the user for context, writes and fact-checks a scene-by-scene script for approval, offers voice-over options with audio samples (free macOS voices, ElevenLabs, OpenAI, or the user's own recordings), then draws, voices and renders the video locally with headless Chrome and ffmpeg.
---

# Whiteboard video

Turn a topic into a narrated whiteboard video: a marker draws each scene in sync with the voice, the board slides to the next scene, captions run at the bottom, and the result is an MP4.

Paths below are relative to this skill's folder. The engine lives in `scripts/`, a starter project in `assets/template/`, two complete examples in `examples/`.

## Why the workflow looks like this

A whiteboard video is cheap to re-render and expensive to re-think. Most wasted effort comes from drawing scenes for a script the user did not want, or from a voice they dislike. So the order is: context, then script approval, then voice choice, then drawing. Each gate is short, and each one saves a render.

## Step 0: one-time setup check

Run these once per machine and fix what is missing before promising a video:

```bash
node --version        # 18 or newer
python3 --version     # 3.9 or newer
ffmpeg -version       # brew install ffmpeg / apt install ffmpeg
cd scripts && npm install   # installs puppeteer-core (uses the local Chrome, no browser download)
```

Chrome, Chromium or Edge must be installed. If it is somewhere unusual, set `CHROME_PATH`.

## Step 1: gather context

Read `references/interview.md` for the full question list. First harvest everything the user already said in this conversation, and only ask what is still missing. Use the question tool when available so the user can answer quickly. The essentials:

- topic and the one idea the viewer should leave with
- audience and how much they already know
- length (30 s, 60 s, 2 min) and format (16:9 for talks and YouTube, 9:16 for Reels/Shorts/TikTok)
- language of the voice-over
- facts, numbers, sources or documents that must be used; claims to avoid
- tone, brand colors, captions on or off, call to action at the end

Once the project folder exists (Step 4 creates it), write the answers and any assumptions into `<project>/brief.md`. The script is regenerated fresh every time the skill runs, so the brief plus the project files are what make a video reproducible by someone else.

If the topic involves facts that change (markets, laws, products, prices), research before writing. Check every number and named claim in two independent sources, prefer primary sources, and note the date. Subagents are a good fit for parallel research.

## Step 2: write the script and get it approved

Read `references/script-writing.md`. Deliver a table with one row per scene: scene name, on-screen title, estimated seconds, voice-over text, what gets drawn. Add a short "facts and sources" list under it, and a note on total duration.

Budget about 2.6 spoken words per second at a natural pace (about 150 per minute). A 60-second video holds roughly 140 words once you allow for pauses. If the requested content does not fit the requested length, say so and offer both a full version and a cut.

Ask for approval. Apply edits and re-show only the changed scenes. Do not start drawing before the script is approved, unless the user explicitly asked you to go straight to a video; in that case state the assumptions you made and deliver the script together with the video.

## Step 3: offer voice-over options before building

Read `references/voice-options.md`, then:

1. Run `python3 scripts/make_audio.py <project> --list-voices` to see which macOS voices are installed, and ElevenLabs voices if a key is present.
2. Present the options with honest trade-offs: free macOS Premium voices, ElevenLabs, OpenAI TTS, or the user's own recordings. Include cost for this script's length (count its characters).
3. Render the same representative sentence with two to four candidate voices:
   `python3 scripts/make_audio.py <project> --samples "<sentence>" --voices "say:Ava (Premium):185" "say:Samantha:190"`
   and send the user `<project>/voice-samples/all-samples.m4a`.
4. Write the chosen voice into `<project>/voice.json`.

API keys belong in `<project>/.env`, created by the user. Never ask the user to paste a key into the chat, never print one, never commit one.

## Step 4: build the project

```bash
scripts/new_project.sh <project-dir>              # 1920x1080
scripts/new_project.sh <project-dir> --vertical   # 1080x1920
```

Then fill three files:

- `script.json`: one entry per scene, one line per spoken sentence. `t` is the caption text; add `say` when the pronunciation must differ, for example `$5.5 trillion` in the caption and `five and a half trillion` spoken, or `SEC` spelled `S.E.C.` for macOS voices.
- `scenes.js`: one drawing function per scene id. Read `references/drawing-api.md` before writing it.
- `config.json`: size, captions, palette.

Generate the audio first, because every drawing is timed against the real spoken lines:

```bash
python3 scripts/make_audio.py <project>
```

This writes `narration.wav` and `timeline.json` with the exact start and end of every line.

## Step 5: preview, fix, render

```bash
node scripts/render.js <project> check      # timing and layout warnings only
node scripts/render.js <project> preview    # one PNG at the end of every scene, in <project>/previews/
node scripts/render.js <project> sheet      # the same PNGs plus previews/sheet.png: every scene on one image
node scripts/render.js <project> full       # all frames + audio -> <project>/out/<name>.mp4
```

Look at `previews/sheet.png` (or every preview image) before the full render. Check that every board has a title at the top, nothing overlaps, nothing touches the edges or the caption strip, text fits inside its shapes, and each scene reads at a glance. Fix every `WARN` line: an item that ends after the scene cut will be chopped by the slide transition, and text that "runs off the board" is clipped.

After the full render, check the duration with ffprobe and grab one or two frames from the MP4 to confirm audio and drawings are in sync.

## Step 6: deliver

Send the MP4. Tell the user its length, the voice used, and anything you assumed. Offer the cheap iterations: change a line (re-run make_audio and render), change a voice (re-run make_audio and render), change a drawing (edit scenes.js and render). A 2-minute video renders in about 3 minutes.

## Examples

- `examples/how-it-works/`: 33 s, six scenes, explains this skill. Good template for short social videos.
- `examples/rwa-on-ethereum/`: about 2 minutes, nine scenes with charts, columns, icons and a custom logo helper. Good reference for dense, fact-heavy explainers.
- `examples/sec-innovation-exemption/`: 1:53 news explainer. Its README records the brief given at the interview step and the sources, which is the pattern to follow when a video must be reproducible by others.

Render either one with `python3 scripts/make_audio.py examples/<name>` then `node scripts/render.js examples/<name> full`. Both use a macOS voice; change `voice.json` on other systems.
