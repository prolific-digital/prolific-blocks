<?php

/**
 * Plugin Name:       Prolific Blocks
 * Description:       A collection of advanced blocks to enhance your website's functionality and design.
 * Requires at least: 6.3
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            Prolific Digital
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       prolific-blocks
 *
 * @package CreateBlock
 */

if (!defined('ABSPATH')) {
	exit; // Exit if accessed directly.
}

require_once plugin_dir_path(__FILE__) . 'inc/helpers.php';

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function prolific_blocks_init() {
	register_block_type(__DIR__ . '/build/carousel');
	register_block_type(__DIR__ . '/build/carousel-slide');
	register_block_type(__DIR__ . '/build/hamburger');
	register_block_type(__DIR__ . '/build/timeline');
	register_block_type(__DIR__ . '/build/timeline-item');
}
add_action('init', 'prolific_blocks_init');

/**
 * Enqueue Swiper JS script for block assets.
 *
 * This function registers and enqueues the Swiper JS script, ensuring it is loaded
 * when block assets are enqueued. The script is loaded from the plugin's build directory.
 *
 * @return void
 */
function enqueue_swiper_scripts() {
	wp_enqueue_script('swiper-script', plugins_url('build/swiper/index.js', __FILE__), array(), null, true);
}
add_action('enqueue_block_assets', 'enqueue_swiper_scripts');
