# Parola — Your language garden

A static, offline-first Italian and Modern Standard Arabic study app. Plain HTML, CSS, and JavaScript modules; no build, account, database, key, analytics, or runtime third-party API.

## Run locally

From this folder, with Python 3 installed:

```powershell
python -m http.server 4173 --directory dist
```

Open `http://localhost:4173`. Opening `index.html` as a file does not support module/data loading or service workers. To run the core checks, install Node 20 or later and run `npm test`. No npm installation is needed.

## What is included

- Responsive dashboard and 17-unit learning path; short introductions, mixed exercises, tests, placement shortcut, mastery, strength decay, XP and streaks.
- Each language has 569 original seed items: 119 numbers/counting expressions, 50 time/date items, 150 nouns, 60 verbs, 40 adjectives, 100 phrases, 20 greetings, 20 basic function words, and 10 colors. Themed units reference those stable IDs.
- Searchable phrasebook, favorites, mistakes, personal flashcards, custom decks, and tab-separated vocabulary import/export.
- Spaced repetition with Again/Hard/Good/Easy, daily new-card limits and per-session review limits; configurable direction, touch gestures, and keyboard shortcuts.
- Multiple choice, listening, typing, sentence tiles, blanks, self-assessed speaking, true/false, scrambled letters, and matching pairs.
- Arabic keyboard, Arabic letter forms, recognition games, Italian letter/sound guides, 27 short grammar lessons, conjugation tables, dialogues, tap-to-translate reader, and daily fixed-seed challenge/scorecards.
- Light/dark/device appearance, local-only progress, JSON export/import, weekly activity, heatmap, achievements, and earned streak freezes.
- Local Noto Naskh Arabic and Nunito fonts; installable PWA with all study data cached, original illustrations/icons, and no CDN dependencies.

## Audio and microphone

All controls use `js/audio.js`. A bundled item audio file is preferred; otherwise an installed browser speech voice is used. If neither is available, the app shows a pronunciation guide and installation instructions. The default library **does not include native-speaker recordings**. Browser voice availability/quality varies; remote browser voices are explicitly identified and may need a connection. Install local voices for offline speech. Font and study content caching do not install a speech voice.

The app probes `audio/<code>/<id>.wav` automatically. For MP3/OGG, add an explicit relative `audio` field in the item JSON. Use Settings → Download bundled audio to cache files for the active language. See `tools/generate-audio.md` for optional local generation. Microphone recordings stay in memory in the current tab, require permission and HTTPS/localhost, and are not included in progress backups. No speech recognition service is used.

## Content review and remaining limitations

See `REVIEW-QUEUE.tsv` for every entry requiring native review. All Arabic vocabulary, letter guides, and grammar examples are deliberately flagged: the transliterations are provisional, and fully inflected forms, broken plurals, number agreement, and diacritics should be checked before treating this as an authoritative course. Some practice phrases are generated from original patterns. Region-specific Gregorian months and Hijri-calendar distinctions are explained in Grammar.

Conjugation coverage is currently a starter set: Italian present tense for supported verbs and Arabic past/present tables for 36 common verbs (including **kataba**, to write). The remaining Arabic verbs retain the dictionary past form; more native-reviewed tables can be added in JSON. Arabic script practice assembles letters but does not include handwriting tracing. Dialect tracks, cloud speech recognition, notifications, and image quizzes are not included. The alphabet badge records exploration, not demonstrated proficiency. Unit mastery is based on repeat unit-test passes. Typo feedback is intentionally conservative: “Almost” counts as a mistake. Custom vocabulary imports support TSV, not general quoted CSV. Review limits are per session, rather than a hard all-day cap.

## Offline and installation

Visit once on HTTPS (or localhost) and keep the app open while the service worker caches its files. In Settings, select **Check offline readiness**. Reload once after installation. Browser menu → Install app / Add to Home Screen makes it standalone. A speech voice or recording is needed separately for offline pronunciation. Storage eviction or clearing site data removes local progress; keep a JSON export.

`sw.js` is cache-first and precaches a file list. **When changing static assets or adding files, refresh the cache version and list**: run `python tools/refresh-offline.py`. This is an authoring maintenance command, not a runtime build requirement. Audio stays a separate opt-in cache to keep the initial installation smaller. An app update becomes visible after the new service worker activates and you reload. The first screen lazily requests noun data; the offline installation then fetches both language libraries in the background.

## Add or edit content

Read `dist/data/README.md`. Add an item to an existing category JSON file; no view changes are needed. Keep its ID stable forever. Add a theme reference by ID rather than copying an item. Add `conjugations: {"Present": {"io": "parlo"}}` to a verb; the grammar screen discovers supported tables automatically. Mark uncertain forms `needsReview: true`.

For a language, add a `languages.json` entry (code, name, locale, direction, keyboard, flag, variety) and a folder with `index.json`, category files, `alphabet.json`, and `grammar.json`. The UI uses configuration and shared schemas. The two shipping tracks have some specialized explanations and normalization rules (Arabic/Italian); a new writing system may require additional normalization and teaching notes.

## Deploy to GitHub Pages

The simplest path is publishing **the contents of `dist`** as a repository root:

1. Create an empty GitHub repository, such as `parola`. Do not include credentials or progress exports.
2. Copy the contents of `dist` into a fresh local folder. Keep `.nojekyll`.
3. From that folder, run:

```powershell
git init
git add .
git commit -m "Publish Parola static app"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/parola.git
git push -u origin main
```

4. GitHub repository → **Settings → Pages → Build and deployment → Deploy from a branch**. Select `main`, `/(root)`, and Save.
5. Open `https://YOUR-USERNAME.github.io/parola/` after deployment completes. All asset URLs, the manifest, service-worker scope, and hash routes are relative; no base-path rewrite is needed. Keep the trailing slash.

Official reference: [Configure a GitHub Pages publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

Alternatively, push this complete project and use the included `.github/workflows/pages.yml` after selecting **GitHub Actions** in Pages settings. The workflow uploads `dist` directly with no build.

Cloudflare Pages: choose a static/no-framework project, no build command, output directory `dist`. Netlify: drag the `dist` folder into manual deploy, or connect a repository with publish directory `dist` and an empty build command. Hosts supply HTTPS, which PWA/microphone features require. There are no environment variables.

## Privacy and security

All learning state uses the versioned `parola.progress.v1` local-storage key. Writes are debounced and flushed on page hide. An in-memory fallback warns when storage is unavailable. JSON import validates the supported schema and asks before replacement. User content is escaped before HTML rendering. The CSP restricts scripts, fonts, media, and requests to this origin; inline styling is permitted for progress bars, while inline scripts and event attributes are blocked. Speech synthesis itself is managed by the operating system/browser; choose a local voice to avoid its remote speech service.

## Verification

`npm test` checks interval scheduling, lapse behavior, strict/forgiving matching, deterministic challenges, data volumes, unique IDs, valid theme references, backup round-trips, and absence of hardcoded runtime service URLs. Browser verification and limits are recorded in `QA.md`.
