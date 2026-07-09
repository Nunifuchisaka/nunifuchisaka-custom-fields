=== Nunifuchisaka Custom Fields ===
Contributors: nunifuchisaka
Tags: custom fields, meta box, custom meta, developer tools, repeater
Requires at least: 6.0
Tested up to: 7.0
Stable tag: 1.3.0-beta.1
Requires PHP: 7.4
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Register lightweight custom fields from your theme with a simple filter, including image, post, color, and repeater fields.

== Description ==

Nunifuchisaka Custom Fields is a lightweight custom fields plugin for developers who prefer defining fields in theme code.

Field definitions are registered through the `ncf_register_fields` filter. The plugin adds meta boxes to the post editing screen, renders field UIs, verifies nonces and capabilities, sanitizes saved values by field type, and stores values as post meta with the `ncf_` prefix.

Supported field types:

* Text
* Textarea
* Select
* Radio
* Checkbox
* Image
* Post selector
* Number
* URL
* Email
* Date
* Color
* Repeater
* WYSIWYG (rich editor)

The plugin also includes a developer-oriented code snippet panel that can be hidden with the `ncf_show_output_code` filter.

== Installation ==

1. Upload the plugin files to the `/wp-content/plugins/nunifuchisaka-custom-fields/` directory, or install the plugin through the WordPress Plugins screen.
2. Activate the plugin through the Plugins screen in WordPress.
3. Add field definitions from your theme or another plugin using the `ncf_register_fields` filter.

== Frequently Asked Questions ==

= Does this plugin create fields from the admin screen? =

No. Fields are registered in code with the `ncf_register_fields` filter.

= Where are values stored? =

Values are stored as post meta. The actual meta key is `ncf_` followed by the field key.

= Can I hide the generated output code panel? =

Yes. Return `false` from the `ncf_show_output_code` filter.

== Changelog ==

= 1.3.0-beta.1 =

* Beta release, not yet verified by the author — please report issues before it is promoted to stable.
* Added a `wysiwyg` field type (rich editor via `wp_editor()`), sanitized with `wp_kses_post`. Not available inside repeater `sub_fields` (falls back to `textarea`).

= 1.2.0 =

* Added field types for URL, email, date, color, and repeater fields.
* Added code snippet generation for registered fields.
* Improved field sanitization and validation.

== Upgrade Notice ==

= 1.3.0-beta.1 =

Beta release adding a WYSIWYG field type. Not yet verified by the author; test before relying on it in production.

= 1.2.0 =

Adds more field types, repeater support, and improved sanitization.
