# Content schema

Each category is an array of item objects. Theme categories may instead contain IDs referencing the main item files. `index.json` lists the category filenames without `.json`.

```json
{"id":"it-greetings-021","category":"greetings","target":"A presto","native":"See you soon","transliteration":null,"ipa":null,"gender":null,"partOfSpeech":"expression","example":{"target":"A presto, Marco!","native":"See you soon, Marco!"},"notes":"Friendly farewell.","tags":["beginner"],"audio":"audio/it/it-greetings-021.mp3","needsReview":false}
```

`audio`, pronunciation, examples, gender, plurals, notes, and conjugations are optional. IDs must be unique and stable; progress is keyed by ID. `targetNoDiacritics` is required for Arabic. Store fully vowelled Arabic in `target` where possible. `needsReview` flags provisional language, vowels, translation, or morphology. Do not hide uncertainty.

Nouns may have `article`, `indefiniteArticle`, `gender`, and `plural`. Italian `target` includes its definite article. Arabic plurals must be authored explicitly. Verb `conjugations` maps tense labels to person/form dictionaries. Grammar is an array of `{id,title,body,examples:[item]}`. Arabic alphabet rows include `forms` in isolated/initial/medial/final order and `nonConnecting`; Italian sound rows include example text and a short sound explanation.

Only original or appropriately licensed material belongs here. Add source and license information to CREDITS.md for contributed content/audio. Adding a word to a category requires editing only JSON; adding a new category also requires updating index.json and the service-worker file list.
