# Verification record

## Automated checks

Run `npm test` from the project root. Covers SRS first/second/later intervals, ease floor, lapses and Again timing, strict vs forgiving Italian/Arabic matching, double-consonant detection, deterministic daily shuffle, seed content counts, unique stable IDs, valid themed ID references, progress JSON round-trip and invalid versions, and no hardcoded third-party runtime URLs/eval.

All JavaScript files were also checked with `node --check`.

## Browser checks

Checked in the connected Chromium preview:

- Dashboard renders; theme follows device and manual Light selection works.
- Searching `caffe` finds `caffè`, including matching phrasebook rows.
- Flashcard flips; Good rating advances to the next card and saves XP/progress.
- Header language switch changes to the Arabic track.
- Arabic spelling accepts keyboard input, shows incorrect-answer/character feedback, and exposes the on-screen letter/diacritic keyboard.
- Grammar examples, conjugation tables and four-form Arabic letter dialogs render.
- A full ten-question multiple-choice quiz reaches a result screen with accuracy, XP, elapsed time and mistakes.
- Missing voice Test produces the device-install guidance, not a silent failure. The preview browser reports no Italian/Arabic voice.
- Settings confirms service-worker control and a 71-file offline cache.
- Stopped the local HTTP server, performed a full reload successfully, then opened the Arabic alphabet and a letter-form dialog from cached data (28 letters).
- 360px viewport checked for dashboard and Arabic alphabet; no horizontal page overflow observed.

## Limits

Real microphone capture requires the user's permission and was not activated. Actual Italian/Arabic voice playback could not be verified because those voices are not installed in the preview browser. Safari/iOS, Firefox, Android installation, and platform-specific TTS have not been tested. No native-speaker audio is bundled. Native linguistic review remains outstanding, as listed in REVIEW-QUEUE.tsv. Optional dialect tracks/handwriting and comprehensive Arabic conjugations are outside this starter content release.
