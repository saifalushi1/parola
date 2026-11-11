# Optional free, local audio generation

No paid services or API keys are used. Speech generation happens on your computer before deployment. Review each model's license separately; a permissive engine license does not guarantee the same license for every voice model.

## eSpeak NG

Install [eSpeak NG](https://github.com/espeak-ng/espeak-ng) from its official project, then add its executable to PATH. It supports both `it` and `ar`; output is intelligible synthetic speech, not native recording quality.

From the project root:

```powershell
python tools/generate-audio.py --language it
python tools/generate-audio.py --language ar
```

This reads JSON, writes WAV files under `dist/audio/<code>/<id>.wav`, and skips existing files. Commit generated files with your static site. The app automatically probes that exact filename. It does not need a data-field change for WAV. Generate shorter item utterances to avoid long-speech truncation.

## Piper

Install an official local Piper distribution and download an Italian or Arabic model plus its configuration. Model availability and redistribution permissions depend on the voice release; check its model card first. With the `piper` executable on PATH:

```powershell
python tools/generate-audio.py --language it --piper-model C:/voices/italian.onnx
python tools/generate-audio.py --language ar --piper-model C:/voices/arabic.onnx
```

Optional conversion with FFmpeg: `ffmpeg -i input.wav output.ogg`. For OGG or MP3, add the corresponding `audio` path to the item JSON. Keep filenames tied to stable IDs.

## Friends, recorded locally

You can record a consenting native-speaker friend and save their recording as the same ID-based filename. No upload service is required. For contributed recordings, record the speaker's permission and chosen license in CREDITS.md. In-app microphone recordings are temporary; use an audio editor or recorder to create files you want to commit.

Tatoeba and Mozilla Common Voice may offer suitably licensed downloadable audio. Check the exact recording/dataset license, attribution and redistribution terms before including any clip; do not assume every Tatoeba recording uses the same license. Attribute every included clip. This release includes no third-party audio. Never call these projects as runtime APIs.

After adding files, deploy and select Settings → Download bundled audio. This uses a separate audio cache. The app shell precache intentionally excludes audio.
