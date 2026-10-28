# Contributing

Thanks for helping out. This is a small project, so the process is light.

1. Fork and create a topic branch (`feat/...`, `fix/...`, `docs/...`).
2. `npm install`, then `npm start` to run the page locally.
3. Keep changes focused. Put logic that does not touch the DOM in `lib.js` and add tests in `tests/`.
4. Before opening a pull request, make sure these pass (CI runs the same checks):

   ```bash
   npm run lint
   npm run format:check
   npm test
   ```

5. Use [Conventional Commits](https://www.conventionalcommits.org/) for commit messages
   (for example `fix: handle empty files`) and add a line to `CHANGELOG.md` for user-visible changes.

When reporting a bug, include your browser and version, the image type and size, and any message
shown in the page or in the browser console.
