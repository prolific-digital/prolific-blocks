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
require_once plugin_dir_path(__FILE__) . 'inc/query-posts-ajax.php';

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

	if (!$should_load && (has_block('prolific/carousel') || has_block('prolific/carousel-new') || has_block('prolific/query-posts'))) {
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

/**
 * Register third-party global attributes server-side for REST API compatibility.
 *
 * Plugins like AnimateWP inject attributes into all blocks via client-side JS filters
 * (blocks.registerBlockType) but do NOT register them server-side. This causes the
 * REST API block-renderer endpoint to reject ServerSideRender requests with 400 errors
 * because the extra attributes fail schema validation.
 *
 * This filter mirrors those attributes server-side so the REST API accepts them.
 */
function prolific_register_third_party_block_attributes($args, $block_type) {
	// Only run if animatewp plugin is active
	if (!function_exists('is_plugin_active')) {
		include_once ABSPATH . 'wp-admin/includes/plugin.php';
	}
	if (!is_plugin_active('animatewp/animatewp.php')) {
		return $args;
	}

	$animation_attributes = [
		'enableAnimation'          => ['type' => 'boolean', 'default' => false],
		'animateLoop'              => ['type' => 'boolean', 'default' => false],
		'animateAutoPlay'          => ['type' => 'boolean', 'default' => false],
		'animateDuration'          => ['type' => 'number',  'default' => 1],
		'animateDelay'             => ['type' => 'number',  'default' => 0],
		'animateEasing'            => ['type' => 'string',  'default' => 'power1.inOut'],
		'animateX'                 => ['type' => 'number',  'default' => 0],
		'animateY'                 => ['type' => 'number',  'default' => 0],
		'animateXPercent'          => ['type' => 'number',  'default' => 0],
		'animateYPercent'          => ['type' => 'number',  'default' => 0],
		'animateScale'             => ['type' => 'number',  'default' => 1],
		'animateRotation'          => ['type' => 'number',  'default' => 0],
		'animateSkew'              => ['type' => 'number',  'default' => 0],
		'animateAutoAlpha'         => ['type' => 'number',  'default' => 1],
		'animateRepeat'            => ['type' => 'number',  'default' => 0],
		'animateYoYo'              => ['type' => 'boolean', 'default' => false],
		'enableScrollTrigger'      => ['type' => 'boolean', 'default' => false],
		'scrollTriggerStart'       => ['type' => 'string',  'default' => 'top bottom'],
		'scrollTriggerEnd'         => ['type' => 'string',  'default' => 'bottom top'],
		'scrollTriggerToggleActions' => ['type' => 'string', 'default' => 'play none none none'],
		'scrollTriggerStartOffset' => ['type' => 'number',  'default' => 0],
		'animateDirection'         => ['type' => 'string',  'default' => 'from'],
	];

	if (!isset($args['attributes'])) {
		$args['attributes'] = [];
	}

	foreach ($animation_attributes as $key => $config) {
		if (!isset($args['attributes'][$key])) {
			$args['attributes'][$key] = $config;
		}
	}

	return $args;
}
add_filter('register_block_type_args', 'prolific_register_third_party_block_attributes', 10, 2);

/**
 * Move aria-label from wrapper div to inner anchor tag on core/button blocks.
 *
 * The Global Custom HTML Attributes feature applies attributes to the block wrapper element,
 * but for core/button the aria-label belongs on the interactive <a> element. This filter
 * also injects a screen-reader-text span inside the anchor with the label text.
 *
 * @param string $block_content The block's rendered HTML.
 * @param array  $parsed_block  The parsed block data.
 * @return string Modified HTML.
 */
function prolific_button_move_aria_label($block_content, $parsed_block) {
	// Check if the wrapper div has an aria-label attribute
	if (!preg_match('/<div\b[^>]*\saria-label="([^"]*)"[^>]*>/i', $block_content, $matches)) {
		return $block_content;
	}

	$aria_label = $matches[1];

	// Remove aria-label from the wrapper div
	$block_content = preg_replace(
		'/(<div\b[^>]*)\s+aria-label="[^"]*"([^>]*>)/i',
		'$1$2',
		$block_content,
		1
	);

	// Add aria-label to the <a> tag and prepend a screen-reader-text span inside it
	$sr_span = '<span class="screen-reader-text">' . esc_html($aria_label) . '</span>';
	$block_content = preg_replace(
		'/(<a\b[^>]*)(>)/i',
		'$1 aria-label="' . esc_attr($aria_label) . '"$2' . $sr_span,
		$block_content,
		1
	);

	return $block_content;
}
add_filter('render_block_core/button', 'prolific_button_move_aria_label', 10, 2);

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
