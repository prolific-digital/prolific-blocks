<?php

/**
 * Plugin Name:       Prolific Blocks
 * Description:       A collection of advanced blocks to enhance your website's functionality and design.
 * Requires at least: 6.3
 * Requires PHP:      7.0
 * Version:           1.0
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

require 'plugin-update-checker/plugin-update-checker.php';

use YahnisElsts\PluginUpdateChecker\v5\PucFactory;

$myUpdateChecker = PucFactory::buildUpdateChecker(
	'https://github.com/prolific-digital/prolific-blocks/',
	__FILE__,
	'prolific-blocks'
);

$myUpdateChecker->getVcsApi()->enableReleaseAssets();

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
	register_block_type(__DIR__ . '/build/lottie-js');
	register_block_type(__DIR__ . '/build/tabs');
	register_block_type(__DIR__ . '/build/tabs-panel');
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

function allow_json_uploads($mime_types) {
	$mime_types['json'] = 'application/json'; // Adding .json extension to allowed mime types
	return $mime_types;
}
add_filter('upload_mimes', 'allow_json_uploads');

function allow_lottie_uploads($mime_types) {
	$mime_types['lottie'] = 'application/json'; // Adding .lottie extension to allowed mime types
	return $mime_types;
}
add_filter('upload_mimes', 'allow_lottie_uploads');
