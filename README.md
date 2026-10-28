# Tesseract.js OCR Web Engine

A small static web page that extracts text from images in the browser using
[Tesseract.js](https://github.com/naptha/tesseract.js) (WebAssembly in a Web Worker).
Images are processed locally and are never uploaded.

## Features

- Choose an image by clicking, drag and drop, or pasting from the clipboard
- Recognition language selector (English, German, French, Spanish, Italian, Portuguese, Hindi, Arabic)
- Progress bar and confidence score; clear errors for non-image, empty, or oversized (over 20 MB) files
- Copy the result to the clipboard
- Keyboard accessible, screen reader status updates, light and dark themes, responsive layout

## Usage

The page loads its script as an ES module, so it must be served over HTTP rather than opened
from `file://`:

```bash
npm install     # only needed for lint and tests
npm start       # serves the folder at http://localhost:3000 (needs python3)
```

Any static server works, for example `npx serve .`.

Notes:

- The Tesseract.js script, worker, WASM core and language data are fetched from public CDNs
  (jsDelivr and tessdata.projectnaptha.com), so an internet connection is required on first use.
  Language data is downloaded the first time each language is used.
- The CDN script is pinned to `tesseract.js@5.1.1` with a Subresource Integrity hash. When upgrading,
  recompute it, for example:
  `openssl dgst -sha384 -binary tesseract.min.js | openssl base64 -A`

## Development

```bash
npm run lint          # ESLint
npm run format:check  # Prettier (use `npm run format` to fix)
npm test              # Vitest unit tests for the pure logic in lib.js
```

## Project layout

```text
index.html   Page markup
style.css    Styles (CSS variables, light/dark)
app.js       DOM wiring and the Tesseract worker lifecycle
lib.js       Pure helpers (file validation, progress formatting, language list)
tests/       Unit tests
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Changes are listed in [CHANGELOG.md](CHANGELOG.md).

## License

[MIT](LICENSE) © Mohammed Aqib
