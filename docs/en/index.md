---
title: Nunifuchisaka Custom Fields
---

[日本語](../) | [GitHub repository](https://github.com/Nunifuchisaka/nunifuchisaka-custom-fields) | [Changelog](changelog)

# Nunifuchisaka Custom Fields

A lightweight WordPress plugin that adds custom fields (meta boxes) to the post editing screen.
Field definitions are not stored in the plugin. Instead, themes register them through a filter hook.

Built for theme developers. The author is a theme developer too, and made this plugin after wanting exactly this — the ability to manage field definitions in code — while building themes.

## Features — what sets it apart

### Field definitions live in code

Unlike plugins where you configure everything by clicking through an admin screen, field definitions here are written in your theme's `functions.php` (PHP code). Nothing is stored in the database, which means:

* Changes are tracked in Git
* Settings never drift between production, staging, and local (no per-environment reconfiguration)
* Field definitions can go through code review

### Repeater fields are free

Fields that let you add, remove, and drag-reorder rows (e.g. a member list or a set of related links) are often a paid-tier feature in other popular plugins. Here, repeaters are included for free.

### Auto-generated template output code

Open the "Get output code for all fields" panel on the edit screen, and it generates ready-to-use PHP output code (using safe patterns like `get_post_meta` and `esc_html`) for every registered field. Copy it straight into your template — no more hand-writing the same boilerplate every time.

### Safer saved data

Choice-based fields (`select` / `radio` / `checkbox`) only save values that match the defined options, and image/post-selector fields only save IDs of attachments or posts that actually exist. This validation runs automatically on save, so tampered or stale values never make it into the database.

### Lightweight, no extra dependencies

It only uses features already built into WordPress (the media uploader, color picker, jQuery UI) — no additional libraries are loaded, keeping the admin screen fast.

### Extensible via hooks

Developer-facing hooks like the `ncf_after_save` action let you hook in cache invalidation or external integrations after fields are saved.

## Where to get it

* [BOOTH](https://nunifuchisaka.booth.pm/) (product page coming soon)
* [GitHub Releases](https://github.com/Nunifuchisaka/nunifuchisaka-custom-fields/releases)

## Basic Usage

Return field configuration arrays from the `ncf_register_fields` filter in your theme's `functions.php`.

```php
add_filter( 'ncf_register_fields', function( $configs ) {
  $configs['my_meta_box'] = [
    'title'  => 'Additional Post Info',
    'screen' => 'post',
    'fields' => [
      [
        'key'   => 'subtitle',
        'label' => 'Subtitle',
        'type'  => 'text',
        'desc'  => 'Shown below the post title.',
      ],
      [
        'key'   => 'main_visual',
        'label' => 'Main Visual',
        'type'  => 'image',
      ],
    ],
  ];
  return $configs;
} );
```

This displays a meta box on the target post editing screen and automatically handles saving and sanitization.

## Meta Box Configuration

The key in `$configs` becomes the meta box ID. Each value is a configuration array.

| Key | Default | Description |
| --- | --- | --- |
| `title` | `Custom Fields` | Meta box title |
| `screen` | `post` | Target post type. Arrays such as `[ 'post', 'page' ]` are supported |
| `context` | `advanced` | Display position: `normal`, `side`, or `advanced` |
| `priority` | `default` | Display priority |
| `fields` | `[]` | Field definition array |

## Field Definitions

Each item in `fields` supports the following keys.

| Key | Required | Description |
| --- | --- | --- |
| `key` | Yes | Identifier used for the meta key. Actual keys are prefixed with `ncf_`, such as `ncf_subtitle` |
| `label` | Yes | Label shown in the editor |
| `type` | No | Field type. Default is `text` |
| `desc` | No | Help text shown below the field |
| `options` | No | Choices for `select`, `radio`, and `checkbox` fields as `value => label` |
| `post_type` | No | Target post type for `post` fields. Default is `post` |
| `posts_per_page` | No | Maximum choices for `post` fields. Default is 50 |
| `sub_fields` | No | Nested field definitions for `repeater` fields |
| `sanitize_callback` | No | Custom save-time sanitizer called as `function( $value, $field )` |

## Supported Field Types

| Type | UI | Saved Value |
| --- | --- | --- |
| `text` | Text input | String |
| `textarea` | Multiline text | String with line breaks |
| `select` | Select box | Selected value |
| `radio` | Radio buttons | Selected value |
| `checkbox` | Checkboxes | Array of selected values |
| `image` | Media library picker | Attachment ID as an integer |
| `post` | Post select box | Post ID as an integer |
| `number` | Number input | Number |
| `url` | URL input | String sanitized with `esc_url_raw` |
| `email` | Email input | String sanitized with `sanitize_email` |
| `date` | Browser date picker | `YYYY-MM-DD` string, or empty for invalid values |
| `color` | WordPress color picker | `#rrggbb` string |
| `repeater` | Add, remove, and drag-sort rows | Array of associative row arrays |

## Repeater Fields

Use `sub_fields` to define a repeatable set of fields. Rows can be reordered by dragging the handle. Rows where every sub-field is empty are skipped on save.

```php
[
  'key'        => 'members',
  'label'      => 'Members',
  'type'       => 'repeater',
  'sub_fields' => [
    [ 'key' => 'name',  'label' => 'Name',  'type' => 'text' ],
    [ 'key' => 'photo', 'label' => 'Photo', 'type' => 'image' ],
    [ 'key' => 'sns',   'label' => 'SNS',   'type' => 'url' ],
  ],
],
```

Nested repeaters are not supported.

## Reading Values in Templates

Meta keys use the `ncf_` prefix followed by the field `key`. Retrieve values with `get_post_meta`.

```php
$subtitle = get_post_meta( get_the_ID(), 'ncf_subtitle', true );
echo esc_html( $subtitle );

$img_id = get_post_meta( get_the_ID(), 'ncf_main_visual', true );
if ( $img_id ) {
  echo wp_get_attachment_image( $img_id, 'full' );
}

$members = get_post_meta( get_the_ID(), 'ncf_members', true );
if ( ! empty( $members ) && is_array( $members ) ) {
  foreach ( $members as $row ) {
    echo esc_html( $row['name'] ?? '' );
  }
}
```

## Generated Output Code

Open the "Get output code for all fields" panel at the bottom of the meta box to generate PHP output code for all fields in that meta box. Copy it into your template and adjust it as needed.

Generated repeater code uses `foreach ( $rows as $i => $row )`, so `$i` can be used for odd/even styling or ID attributes.

This panel is intended for developers. Hide it in production with the `ncf_show_output_code` filter.

## Hooks

| Hook | Type | Description |
| --- | --- | --- |
| `ncf_register_fields` | Filter | Registers field definitions |
| `ncf_show_output_code` | Filter | Return `false` to hide the generated output code panel. Called as `function( $show, $post )` |
| `ncf_show_promo` | Filter | Return `false` to hide the promo panel. Called as `function( $show, $post )` |
| `ncf_promo_url` | Filter | Replaces the URL used by the promo panel |
| `ncf_after_save` | Action | Fires after NCF saves fields. Called as `function( $post_id, $saved )`; `$saved` contains saved meta keys and values, with deleted keys set to `null` |

```php
if ( wp_get_environment_type() === 'production' ) {
  add_filter( 'ncf_show_output_code', '__return_false' );
}

// Hide the BOOTH promo panel.
// add_filter( 'ncf_show_promo', '__return_false' );

add_action( 'ncf_after_save', function( $post_id, $saved ) {
  if ( array_key_exists( 'ncf_demo_repeater', $saved ) ) {
    delete_transient( 'my_repeater_cache_' . $post_id );
  }
}, 10, 2 );
```

## Notes

* Values are automatically sanitized according to field type. Use `sanitize_callback` only when custom processing is needed.
* `select`, `radio`, and `checkbox` save only values defined in `options`.
* `image` saves only existing image attachment IDs.
* `post` saves only existing posts of the configured `post_type`.
* Saved `post` values remain selectable even when they are outside the `posts_per_page` limit.
* WYSIWYG fields are not supported. Use `textarea` for long text or manage rich content in the main editor.
