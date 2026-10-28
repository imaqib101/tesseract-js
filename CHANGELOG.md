# Changelog

All notable changes are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added

- Language selector, clipboard paste, and file validation (type, empty, size limit of 20 MB).
- Light theme, focus styles, responsive layout, reduced-motion support.
- Unit tests, ESLint, Prettier, and a CI workflow.
- MIT license, contributing guide, and this changelog.

### Changed

- Tesseract.js is pinned to 5.1.1 with a Subresource Integrity hash (was floating `@4`).
- The Tesseract worker is reused between images of the same language.
- Copy falls back to selection-based copy when the Clipboard API is unavailable.
- `app.js` is now an ES module, so the page must be served over HTTP.

### Fixed

- Errors are shown in an alert region, and a failed run no longer leaves a broken worker.
- The progress bar color is reset after an error.
- Input is ignored while a recognition is running; image preview URLs are released.
- The drop zone is operable from the keyboard and announces progress to screen readers.
