# Repository Guidelines

## Project Structure & Module Organization

This repository contains a lightweight WordPress plugin. Source files live in `src/`: the main PHP plugin file is `src/nunifuchisaka-custom-fields.php`, admin JavaScript is under `src/js/`, and SCSS is under `src/css/`. Build output is written to `dist/` and is kept in the repository for plugin distribution, so do not clean or delete it during routine work. Release ZIPs are generated under `releases/`. WordPress.org-facing assets, if needed, belong in `wporg-assets/`.

## Build, Test, and Development Commands

Install dependencies with:

```sh
npm install
```

Build production assets and copy distributable files to `dist/`:

```sh
npm run build
```

Watch source files during development:

```sh
npm run watch
```

Create a versioned release ZIP from `dist/`:

```sh
npm run package
```

Run `npm run build` before packaging so the release contains current assets.

## Coding Style & Naming Conventions

Follow `.editorconfig`: UTF-8, LF line endings, final newline, trimmed trailing whitespace, and 2-space indentation. Keep PHP, JavaScript, SCSS, and PowerShell changes consistent with nearby code. Use descriptive, plugin-scoped names; the project slug is `nunifuchisaka-custom-fields`, and admin asset names should remain aligned with the webpack output paths in `webpack.config.js`.

## Testing Guidelines

No automated test suite is currently configured. For now, verify changes by running `npm run build` and testing the plugin manually in a local WordPress install. Check the admin custom-fields UI, saved metadata behavior, and generated files under `dist/`. If adding tests later, place them in a clear `tests/` directory and document the runner command here.

## Commit & Pull Request Guidelines

The current history starts with a simple descriptive commit style, for example `Initial plugin project structure`. Use short, imperative commit subjects that describe the change, such as `Add admin field validation` or `Update release packaging`.

Pull requests should include a concise summary, manual test notes, and screenshots or screen recordings for visible admin UI changes. Link related issues when available. Mention any changes to release assets, plugin metadata, or WordPress compatibility.

## Security & Configuration Tips

Do not commit local WordPress credentials, generated environment files, or private release notes. Sanitize and escape WordPress input/output in PHP changes, and prefer WordPress APIs for nonce checks, capability checks, metadata access, and asset enqueueing.
