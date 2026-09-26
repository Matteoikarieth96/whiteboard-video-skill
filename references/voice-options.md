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
{"engine": "openai", "voice": "coral", "model": "gpt-4o-mini-tts", "instructions": "Warm, clear explainer tone."}
{"engine": "files"}
```

- **Keys.** The user creates `<project>/.env` with `ELEVENLABS_API_KEY=...` or `OPENAI_API_KEY=...`. ElevenLabs keys need the Text to Speech permission (and Voices read, for `--list-voices`). Never ask for a key in chat.
- **Own recordings.** One file per line, named `audio/<sceneId>_<lineIndex>.wav` (or mp3, m4a, aiff), for example `audio/intro_0.wav`. Record in a quiet room, leave half a second of silence at the start and end, and keep the same distance from the mic. `make_audio.py` measures each clip, so drawings follow the real timing automatically.
- **Speed.** macOS rate 180 to 195 sounds natural for most Premium voices. Faster than 200 starts to sound rushed.
- **Pronunciation.** Use the `say` field: spell out acronyms (`S.E.C.`), numbers (`thirty-seven billion`), and brand names that the voice mangles (`BUIDL` spoken as `Build`). For macOS, `[[slnc 250]]` inserts a 250 ms pause.

## Samples first

Render one sentence with two to four candidate voices and send the combined file, so the user chooses by ear:

```bash
python3 scripts/make_audio.py <project> --samples "One representative sentence from the script." \
  --voices "say:Ava (Premium):185" "say:Matilda (Premium):185" "elevenlabs:<voice_id>"
```
