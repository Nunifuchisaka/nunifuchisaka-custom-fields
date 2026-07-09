<?php
/**
 * Plugin Name: NCF Demo Fields (dev only)
 * Description: wp-env上でNunifuchisaka Custom Fieldsの見た目を確認するためのサンプル登録。本番配布物には含まれない。
 */

if ( ! defined( 'ABSPATH' ) ) {
  exit;
}

add_filter( 'ncf_register_fields', function ( $configs ) {
  $configs['ncf_demo'] = [
    'title'  => '記事の追加情報',
    'screen' => 'post',
    'fields' => [
      [
        'key'   => 'subtitle',
        'label' => 'サブタイトル',
        'type'  => 'text',
        'desc'  => '記事タイトルの下に表示されます',
      ],
      [
        'key'   => 'main_visual',
        'label' => 'メインビジュアル',
        'type'  => 'image',
      ],
      [
        'key'     => 'category_tag',
        'label'   => 'カテゴリタグ',
        'type'    => 'select',
        'options' => [
          'news'   => 'お知らせ',
          'column' => 'コラム',
          'event'  => 'イベント',
        ],
      ],
      [
        'key'   => 'body_detail',
        'label' => '詳細本文（WYSIWYG）',
        'type'  => 'wysiwyg',
      ],
      [
        'key'        => 'members',
        'label'      => 'メンバー',
        'type'       => 'repeater',
        'sub_fields' => [
          [ 'key' => 'name',  'label' => '名前', 'type' => 'text' ],
          [ 'key' => 'photo', 'label' => '写真', 'type' => 'image' ],
          [ 'key' => 'sns',   'label' => 'SNS',  'type' => 'url' ],
        ],
      ],
    ],
  ];
  return $configs;
} );
