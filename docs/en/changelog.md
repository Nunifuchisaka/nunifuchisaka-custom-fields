---
title: Changelog
---

[日本語](../changelog) | [Back to top](.)

# Changelog

## 1.3.0-beta.1

* Beta release, not yet verified by the author — please report issues before it is promoted to stable.
* Added a `wysiwyg` field type (rich editor via `wp_editor()`), sanitized with `wp_kses_post` on save. Not available inside repeater `sub_fields` (falls back to `textarea`).

## 1.2.0

* Added field types for URL, email, date, color, and repeater fields.
* Added code snippet generation for registered fields.
* Improved field sanitization and validation.
