# Repository Guidelines

## Project Structure & Module Organization

This repository contains a lightweight WordPress plugin. Source files live in `src/`: the main PHP plugin file is `src/nunifuchisaka-custom-fields.php`, admin JavaScript is under `src/js/`, and SCSS is under `src/css/`. Build output is written to `dist/` and is kept in the repository for plugin distribution, so do not clean or delete it during routine work. Release ZIPs are generated under `releases/`. WordPress.org-facing assets, if needed, belong in `wporg-assets/`. `.wp-env.json` and `.wp-env/` hold a local WordPress dev/test environment (see below) and are not part of the distributed plugin.

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

There is no lint command configured.

Run a local WordPress instance with the plugin active (via [`@wordpress/env`](https://www.npmjs.com/package/@wordpress/env), requires Docker Desktop):

```sh
npm run env:start
```

This maps `./dist` in as the active plugin (run `npm run build` first so `dist/` is current) and loads `.wp-env/mu-plugins/ncf-demo-fields.php`, a must-use plugin that registers a sample meta box (one field of every type, including `wysiwyg` and `repeater`) via `ncf_register_fields` — since this plugin has no fields of its own, nothing renders without it. The site is at `http://localhost:8888/wp-admin` (`admin` / `password`). Stop with `npm run env:stop`, or fully remove the containers/volumes with `npm run env:destroy`.

`.wp-env/mu-plugins/ncf-demo-fields.php` is dev-only scaffolding, not part of the distributed plugin (webpack's `CopyPlugin` never touches it).

## Architecture

This plugin (`nunifuchisaka-custom-fields`, meta key prefix `ncf_`) adds custom-field meta boxes to the post edit screen. It holds no field definitions itself — a theme (or another plugin) registers fields via the `ncf_register_fields` filter, and this plugin handles rendering, sanitizing, and saving. Full usage/API docs (field types, hooks, repeater behavior) live in [README.md](README.md) (Japanese) / [README.en.md](README.en.md) — read those before changing field-rendering or sanitization behavior, since they document the public contract.

- **`src/nunifuchisaka-custom-fields.php`** — the entire plugin logic lives in one class, `NCF\Custom_Fields` (instantiated once at the bottom of the file). Key responsibilities, each roughly one method:
  - `register_meta_boxes` — reads the `ncf_register_fields` filter output and calls `add_meta_box` per config entry.
  - `render_meta_box` / `render_single_field` / `render_repeater_field` / `render_repeater_row` — HTML output per field type. Repeater rows are rendered once per saved value plus one hidden `{index}` template row that JS clones (`src/js/ncf-admin.js`) and does string-replaces `{index}` with a timestamp.
  - `render_all_code_snippet` — generates copy-pasteable PHP template code for each field (the "▶ まとめて出力コードを取得" panel); when adding a new field type, both this method and `render_single_field`/`sanitize_field_value` need matching `case` branches or the generated snippet will be wrong.
  - `sanitize_field_value` — per-type sanitize/validate rules, called from `save_meta_data`. `select`/`radio`/`checkbox` values are validated against `options`; `image`/`post` values are validated against real attachments/posts of the expected type, so stale or tampered IDs are dropped rather than trusted.
  - `save_meta_data` — hooked to `save_post`; nonce/autosave/capability-checked, iterates registered configs filtered by the current post's `post_type` against each box's `screen`, and fires `ncf_after_save( $post_id, $saved )` when done.
  - Public filters/actions: `ncf_register_fields`, `ncf_show_output_code`, `ncf_show_promo`, `ncf_promo_url`, `ncf_after_save` — treat these as the plugin's API surface; don't rename or change their signatures without checking README.md's hook table.
- **`src/js/ncf-admin.js`** — jQuery, event-delegated (`$(document).on(...)`) so it works with dynamically added repeater rows. Handles: repeater add/remove/sort (`jquery-ui-sortable`), WP color picker init (skips `.ncf-repeater-template` to avoid breaking the clone source), copy-to-clipboard for the generated code snippet, and the media-library image picker (`wp.media`).
- **`src/css/ncf-admin.scss`** — admin styling only; no frontend CSS (this plugin has no public-facing output of its own).
- Build (`webpack.config.js`): SCSS/JS from `src/` are compiled into `dist/js/ncf-admin.js` and `dist/css/ncf-admin.css`; `CopyPlugin` also copies the main PHP file, `readme.txt`, `LICENSE`, and `languages/` straight into `dist/` unmodified. `clean: false` — build never wipes `dist/`.
- Versioning: bump `version` in `package.json` (drives the release zip name) and the `Version:` header in `src/nunifuchisaka-custom-fields.php` together; `npm run package` reads the version from `package.json`.

## Coding Style & Naming Conventions

Follow `.editorconfig`: UTF-8, LF line endings, final newline, trimmed trailing whitespace, and 2-space indentation. Keep PHP, JavaScript, SCSS, and PowerShell changes consistent with nearby code. Use descriptive, plugin-scoped names; the project slug is `nunifuchisaka-custom-fields`, and admin asset names should remain aligned with the webpack output paths in `webpack.config.js`. All metadata keys are prefixed `ncf_` (`Custom_Fields::$prefix`); field definitions use unprefixed `key`. This plugin has no build-time templating, so escaping is manual per `echo` — sanitize/escape on both write (`sanitize_field_value`) and read/render (`esc_html`/`esc_attr`/`esc_url` etc.).

## Testing Guidelines

No automated test suite is currently configured. For now, verify changes by running `npm run build` and testing the plugin manually in a local WordPress install — `npm run env:start` (see above) spins one up with a demo meta box already registered. Check the admin custom-fields UI, saved metadata behavior, and generated files under `dist/`. If adding tests later, place them in a clear `tests/` directory and document the runner command here.

## Commit & Pull Request Guidelines

The current history starts with a simple descriptive commit style, for example `Initial plugin project structure`. Use short, imperative commit subjects that describe the change, such as `Add admin field validation` or `Update release packaging`.

Pull requests should include a concise summary, manual test notes, and screenshots or screen recordings for visible admin UI changes. Link related issues when available. Mention any changes to release assets, plugin metadata, or WordPress compatibility.

## Security & Configuration Tips

Do not commit local WordPress credentials, generated environment files, or private release notes. Prefer WordPress APIs for nonce checks, capability checks, metadata access, and asset enqueueing (see Coding Style for sanitize/escape conventions already used throughout `save_meta_data`/`enqueue_admin_assets`).
