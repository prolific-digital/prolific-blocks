<?php

/**
 * Plugin Name:       Prolific Blocks
 * Description:       Prolific Blocks is a collection of custom Gutenberg blocks.
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            The WordPress Contributors
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       prolific-blocks
 *
 * @package CreateBlock
 */

if (!defined('ABSPATH')) {
	exit; // Exit if accessed directly.
}

function enqueue_swiper_scripts() {
	// wp_enqueue_style('swiper-styles', 'https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.css');
	// wp_enqueue_script('swiper-script', 'https://cdn.jsdelivr.net/npm/swiper@10/swiper-element-bundle.min.js', array(), null, true);
	wp_enqueue_script('swiper-script', plugins_url('build/swiper/index.js', __FILE__), array(), null, true);
}
add_action('enqueue_block_assets', 'enqueue_swiper_scripts');

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function create_block_prolific_blocks_block_init() {
	register_block_type(__DIR__ . '/build/carousel-content');
	register_block_type(__DIR__ . '/build/single-slide');
	register_block_type(__DIR__ . '/build/hamburger');
}
add_action('init', 'create_block_prolific_blocks_block_init');

function add_svg_to_upload_mimes($upload_mimes) {
	$upload_mimes['svg'] = 'image/svg+xml';
	return $upload_mimes;
}
add_filter('upload_mimes', 'add_svg_to_upload_mimes');
