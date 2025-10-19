<?php

/**
 * Plugin Name:       Prolific Blocks
 * Plugin URI:				https://prolificdigital.com/
 * Author URI:        https://prolificdigital.com/
 * Description:       A collection of advanced blocks to enhance your website's functionality and design.
 * Requires at least: 6.3
 * Requires PHP:      7.4
 * Version:           1.0.0
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

require 'updater/plugin-update-checker.php';

use YahnisElsts\PluginUpdateChecker\v5\PucFactory;

$myUpdateChecker = PucFactory::buildUpdateChecker(
	'https://github.com/prolific-digital/prolific-blocks/',
	__FILE__,
	'prolific-blocks'
);

$myUpdateChecker->getVcsApi()->enableReleaseAssets();

require_once plugin_dir_path(__FILE__) . 'inc/helpers.php';

/**
 * Register custom block category for Prolific blocks
 * 
 * @param array $categories Existing block categories.
 * @return array Modified block categories.
 */
function prolific_block_categories($categories) {
	return array_merge(
		[
			[
				'slug' => 'prolific',
				'title' => 'Prolific',
			]
		],
		$categories
	);
}
add_filter('block_categories_all', 'prolific_block_categories', 10, 1);

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function prolific_blocks_init() {
	// Layout & Display Blocks
	register_block_type(__DIR__ . '/build/carousel');
	register_block_type(__DIR__ . '/build/carousel-slide');
	register_block_type(__DIR__ . '/build/carousel-new');
	register_block_type(__DIR__ . '/build/carousel-new-slide');
	register_block_type(__DIR__ . '/build/tabs');
	register_block_type(__DIR__ . '/build/tabs-panel');
	register_block_type(__DIR__ . '/build/tabbed-content');
	register_block_type(__DIR__ . '/build/tabbed-content-panel');
	register_block_type(__DIR__ . '/build/timeline');
	register_block_type(__DIR__ . '/build/timeline-item');

	// Navigation Blocks
	register_block_type(__DIR__ . '/build/hamburger');
	register_block_type(__DIR__ . '/build/breadcrumbs');
	register_block_type(__DIR__ . '/build/table-of-contents');
	register_block_type(__DIR__ . '/build/anchor-navigation');

	// Media & Content Blocks
	register_block_type(__DIR__ . '/build/lottie-js');
	register_block_type(__DIR__ . '/build/icon');
	register_block_type(__DIR__ . '/build/svg');
	register_block_type(__DIR__ . '/build/pdf-viewer');
	register_block_type(__DIR__ . '/build/responsive-image');
	register_block_type(__DIR__ . '/build/social-sharing');
	register_block_type(__DIR__ . '/build/charts');

	// Utility Blocks
	register_block_type(__DIR__ . '/build/countdown-timer');
	register_block_type(__DIR__ . '/build/reading-time');
	register_block_type(__DIR__ . '/build/weather');

	// Text Formatting
	register_block_type(__DIR__ . '/build/text-highlight-format');

	// Query Blocks
	register_block_type(__DIR__ . '/build/query-posts');
	register_block_type(__DIR__ . '/build/query-loop-carousel');

	// Global Features
	register_block_type(__DIR__ . '/build/global-attributes');
}
add_action('init', 'prolific_blocks_init');

/**
 * Enqueue Swiper JS script for block assets.
 *
 * This function registers and enqueues the Swiper JS script, ensuring it is loaded
 * when block assets are enqueued. The script is loaded from the plugin's build directory.
 * 
 * We register the script with a version number based on the plugin version to avoid caching issues.
 * We also conditionally load the script only when required blocks are on the page.
 *
 * @return void
 */
function enqueue_swiper_scripts() {
	$plugin_data = get_file_data(__FILE__, array('Version' => 'Version'), 'plugin');
	$version = $plugin_data['Version'];

	// Check if we should load Swiper - if running in admin, or if the page has carousel blocks
	$should_load = is_admin();

	if (!$should_load && (has_block('prolific/carousel') || has_block('prolific/carousel-new'))) {
		$should_load = true;
	}

	if ($should_load) {
		// Register the script with proper dependencies
		wp_register_script(
			'swiper-script',
			plugins_url('build/swiper/index.js', __FILE__),
			array('wp-element', 'wp-blocks'),
			$version,
			true
		);

		// Enqueue the script
		wp_enqueue_script('swiper-script');
	}
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
