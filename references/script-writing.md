# Writing the script

## Shape

- **One idea per scene.** A scene is one board. If you need to erase half the board, it is two scenes.
- **Every scene has a title.** Give each board a short on-screen title (two to five words) that names its idea, and list it in the approval table. Viewers who look away or watch muted use the titles to follow the story.
- **One sentence per line.** Each line in `script.json` is one spoken sentence and one caption. Captions over about 90 characters wrap to two lines; that is fine, over three lines is not.
- **Draw what is said, when it is said.** Plan each drawing against a specific line and a moment inside it ("the coin appears when she says *token*").
- **Open with a hook, close with a takeaway.** First scene: the question or the promise. Last scene: one short line the viewer can repeat.

A reliable structure for explainers: hook, what it is, why it matters, how it works or the numbers, the catch, what happens next, takeaway.

## Length budget

| Video length | Spoken words (natural pace) | Scenes |
|---|---|---|
| 30 s | 60 to 70 | 3 to 4 |
| 60 s | 130 to 145 | 5 to 7 |
| 2 min | 260 to 290 | 8 to 10 |

macOS voices at rate 185 to 200 speak slightly faster than this; ElevenLabs and human voices slightly slower. After `make_audio.py` runs you know the real length, so adjust there rather than guessing.

## Plain language

- Short words, active voice, one number per sentence.
- Say numbers the way people say them: "thirty-seven billion dollars" in `say`, "$37 billion" in the caption.
- Explain every acronym the first time, or draw it next to its meaning.
- Prefer a concrete named example over a category ("BlackRock's BUIDL fund" rather than "some asset managers").

## Facts

- Check every number and named claim in two independent sources. Prefer primary sources: regulators, company documentation, filings, official press releases.
- Date the claim. "About $37 billion as of August 2026" survives longer than "$37 billion".
- When sources disagree, pick the more conservative claim or say "about", and tell the user what you chose.
- Put a "Facts and sources" list under the script so the user can review it.

## Presenting the script for approval

Use a table: scene, board title, seconds, voice-over, drawing. Then the facts list, then the total word count and estimated duration. Keep drawing descriptions concrete enough that the user can picture the board.
