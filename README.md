# whiteboard-video

A Claude Code skill that turns any topic into a hand-drawn whiteboard explainer video: a marker draws each scene in sync with the voice-over, the board slides to the next idea, captions run along the bottom, and you get an MP4.

![demo](docs/demo.gif)

[Watch the demo with sound](docs/demo.mp4). It was written, voiced and drawn by this skill.

## What it does

1. **Asks for context.** Topic, audience, length, format, language, facts to include.
2. **Writes the script.** Scene by scene, with what gets drawn and the facts behind every claim, checked in two sources. You approve it before anything is drawn.
3. **Lets you pick a voice.** It renders the same sentence with a few voices so you choose by ear: free macOS Premium voices, ElevenLabs, OpenAI TTS, or your own recordings.
4. **Draws and renders.** Hand-drawn SVG scenes timed to each spoken line, previews for review, then a 1080p MP4 in 16:9 or 9:16.

Everything runs locally: headless Chrome draws the frames, ffmpeg makes the video.

## Install

Requirements: [Claude Code](https://claude.com/claude-code), Node 18+, Python 3.9+, ffmpeg, and Google Chrome (or Chromium/Edge).

```bash
git clone https://github.com/Matteoikarieth96/whiteboard-video-skill ~/.claude/skills/whiteboard-video
cd ~/.claude/skills/whiteboard-video/scripts && npm install
brew install ffmpeg   # macOS; use your package manager elsewhere
```

Then just ask Claude Code:

> Make a 60-second whiteboard video explaining how interest rates affect mortgages, for first-time buyers.

## Use it without Claude

```bash
S=~/.claude/skills/whiteboard-video/scripts
$S/new_project.sh my-video              # or: --vertical for 1080x1920
# edit my-video/script.json (what is said) and my-video/scenes.js (what is drawn)
python3 $S/make_audio.py my-video       # voice-over + exact timing of every line
node $S/render.js my-video sheet        # one PNG per scene + previews/sheet.png with all of them
node $S/render.js my-video full         # my-video/out/my-video.mp4
```

## Voices

| Voice | Cost | Setup |
|---|---|---|
| macOS Premium voices | free | System Settings > Accessibility > Spoken Content > Manage Voices |
| ElevenLabs | free tier or paid plan | `ELEVENLABS_API_KEY` in the project's `.env` |
| OpenAI TTS | cents per video | `OPENAI_API_KEY` in the project's `.env` |
| Your own recordings | free | one audio file per sentence in `audio/` |

Keys stay in a local `.env` that is git-ignored. Compare voices before committing to one:

```bash
python3 $S/make_audio.py my-video --samples "A sentence from your script." \
  --voices "say:Ava (Premium):185" "say:Samantha:190"
```

## Share it

Social platforms take the MP4 directly. For a GIF (the one at the top of this page was made this way):

```bash
ffmpeg -i my-video/out/my-video.mp4 -t 34 \
  -vf "fps=12,scale=800:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=64[p];[b][p]paletteuse=dither=bayer" my-video.gif
```

`docs/demo.mp4` is `examples/how-it-works` rendered with `render.js full`.

## How it works

- `script.json` lists scenes and spoken lines. Each line becomes one caption.
- `make_audio.py` voices every line separately and records exactly when it starts and ends.
- `scenes.js` draws each scene with a small API (`T` for text, `P` for paths, plus lines, arrows, circles, icons) and times every stroke against those lines, for example "draw the coin halfway through the second sentence".
- `render.js` checks timing and layout, makes previews, renders every frame deterministically and muxes the audio.

See `references/drawing-api.md` for the full drawing API and `examples/` for two complete videos.

## Examples

- `examples/how-it-works`: the 33-second demo above.
- `examples/rwa-on-ethereum`: a 2-minute explainer on tokenized stocks and bonds, with charts, three-column comparisons and a custom logo.
- `examples/sec-innovation-exemption`: a 1:53 news explainer on the SEC Innovation Exemption, with the brief given to the skill and the sources behind every claim.

## License

Code: MIT. The Caveat font is under the SIL Open Font License, included in `assets/fonts/OFL.txt`.

Built with Claude Code.
