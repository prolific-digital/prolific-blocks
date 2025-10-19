<?php
/**
 * Query Loop Carousel Extension
 *
 * Extends the core/query block with carousel functionality using Swiper.js
 *
 * @package Prolific_Blocks
 * @since 1.0.0
 */

if (!defined('ABSPATH')) {
	exit; // Exit if accessed directly.
}

/**
 * Register custom attributes for core/query block
 *
 * @return void
 */
function prolific_register_query_carousel_attributes() {
	// Check if WP_Block_Type_Registry exists
	if (!class_exists('WP_Block_Type_Registry')) {
		return;
	}

	$registry = WP_Block_Type_Registry::get_instance();
	$query_block = $registry->get_registered('core/query');

	if (!$query_block) {
		return;
	}

	// Define carousel attributes
	$carousel_attributes = array(
		'carouselEnabled' => array(
			'type' => 'boolean',
			'default' => false,
		),
		'carouselSlidesPerViewDesktop' => array(
			'type' => 'number',
			'default' => 3,
		),
		'carouselSlidesPerViewTablet' => array(
			'type' => 'number',
			'default' => 2,
		),
		'carouselSlidesPerViewMobile' => array(
			'type' => 'number',
			'default' => 1,
		),
		'carouselSpaceBetweenDesktop' => array(
			'type' => 'number',
			'default' => 30,
		),
		'carouselSpaceBetweenTablet' => array(
			'type' => 'number',
			'default' => 20,
		),
		'carouselSpaceBetweenMobile' => array(
			'type' => 'number',
			'default' => 10,
		),
		'carouselNavigation' => array(
			'type' => 'boolean',
			'default' => true,
		),
		'carouselPagination' => array(
			'type' => 'boolean',
			'default' => true,
		),
		'carouselPaginationType' => array(
			'type' => 'string',
			'default' => 'bullets',
		),
		'carouselAutoplay' => array(
			'type' => 'boolean',
			'default' => false,
		),
		'carouselAutoplayDelay' => array(
			'type' => 'number',
			'default' => 3000,
		),
		'carouselLoop' => array(
			'type' => 'boolean',
			'default' => false,
		),
		'carouselEffect' => array(
			'type' => 'string',
			'default' => 'slide',
		),
		'carouselSpeed' => array(
			'type' => 'number',
			'default' => 300,
		),
	);

	// Merge with existing attributes
	$query_block->attributes = array_merge(
		$query_block->attributes,
		$carousel_attributes
	);
}
add_action('init', 'prolific_register_query_carousel_attributes', 999);

/**
 * Modify Query Loop block output to add carousel markup when carousel mode is enabled
 *
 * @param string $block_content The block content.
 * @param array  $block The full block, including name and attributes.
 * @return string Modified block content.
 */
function prolific_render_query_carousel($block_content, $block) {
	// Only process core/query blocks
	if ($block['blockName'] !== 'core/query') {
		return $block_content;
	}

	// Check if carousel is enabled
	$carousel_enabled = isset($block['attrs']['carouselEnabled']) && $block['attrs']['carouselEnabled'];

	if (!$carousel_enabled) {
		return $block_content;
	}

	// Get carousel settings with defaults
	$settings = array(
		'slidesPerViewDesktop' => isset($block['attrs']['carouselSlidesPerViewDesktop']) ? intval($block['attrs']['carouselSlidesPerViewDesktop']) : 3,
		'slidesPerViewTablet' => isset($block['attrs']['carouselSlidesPerViewTablet']) ? intval($block['attrs']['carouselSlidesPerViewTablet']) : 2,
		'slidesPerViewMobile' => isset($block['attrs']['carouselSlidesPerViewMobile']) ? intval($block['attrs']['carouselSlidesPerViewMobile']) : 1,
		'spaceBetweenDesktop' => isset($block['attrs']['carouselSpaceBetweenDesktop']) ? intval($block['attrs']['carouselSpaceBetweenDesktop']) : 30,
		'spaceBetweenTablet' => isset($block['attrs']['carouselSpaceBetweenTablet']) ? intval($block['attrs']['carouselSpaceBetweenTablet']) : 20,
		'spaceBetweenMobile' => isset($block['attrs']['carouselSpaceBetweenMobile']) ? intval($block['attrs']['carouselSpaceBetweenMobile']) : 10,
		'navigation' => isset($block['attrs']['carouselNavigation']) ? $block['attrs']['carouselNavigation'] : true,
		'pagination' => isset($block['attrs']['carouselPagination']) ? $block['attrs']['carouselPagination'] : true,
		'paginationType' => isset($block['attrs']['carouselPaginationType']) ? $block['attrs']['carouselPaginationType'] : 'bullets',
		'autoplay' => isset($block['attrs']['carouselAutoplay']) ? $block['attrs']['carouselAutoplay'] : false,
		'autoplayDelay' => isset($block['attrs']['carouselAutoplayDelay']) ? intval($block['attrs']['carouselAutoplayDelay']) : 3000,
		'loop' => isset($block['attrs']['carouselLoop']) ? $block['attrs']['carouselLoop'] : false,
		'effect' => isset($block['attrs']['carouselEffect']) ? $block['attrs']['carouselEffect'] : 'slide',
		'speed' => isset($block['attrs']['carouselSpeed']) ? intval($block['attrs']['carouselSpeed']) : 300,
	);

	// Build breakpoints configuration
	$breakpoints = array(
		0 => array(
			'slidesPerView' => $settings['slidesPerViewMobile'],
			'spaceBetween' => $settings['spaceBetweenMobile'],
		),
		768 => array(
			'slidesPerView' => $settings['slidesPerViewTablet'],
			'spaceBetween' => $settings['spaceBetweenTablet'],
		),
		1024 => array(
			'slidesPerView' => $settings['slidesPerViewDesktop'],
			'spaceBetween' => $settings['spaceBetweenDesktop'],
		),
	);

	// Build Swiper configuration
	$swiper_config = array(
		'navigation' => $settings['navigation'],
		'pagination' => $settings['pagination'] ? array('type' => $settings['paginationType']) : false,
		'loop' => $settings['loop'],
		'effect' => $settings['effect'],
		'speed' => $settings['speed'],
		'breakpoints' => $breakpoints,
		'grabCursor' => true,
		'keyboard' => array('enabled' => true),
	);

	if ($settings['autoplay']) {
		$swiper_config['autoplay'] = array(
			'delay' => $settings['autoplayDelay'],
			'disableOnInteraction' => false,
		);
	}

	// Generate unique ID for this carousel
	$carousel_id = 'query-carousel-' . wp_unique_id();

	// Parse the existing block content to wrap posts in swiper-slide
	$dom = new DOMDocument();
	$dom->encoding = 'UTF-8';

	// Suppress warnings for invalid HTML
	libxml_use_internal_errors(true);

	// Load HTML with UTF-8 encoding
	$dom->loadHTML('<?xml encoding="UTF-8">' . $block_content, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);

	// Clear errors
	libxml_clear_errors();

	// Find the post template (ul.wp-block-post-template)
	$xpath = new DOMXPath($dom);
	$post_template = $xpath->query('//ul[contains(@class, "wp-block-post-template")]')->item(0);

	if ($post_template) {
		// Get all list items (posts)
		$posts = $xpath->query('.//li', $post_template);

		if ($posts->length > 0) {
			// Add swiper-slide class to each post
			foreach ($posts as $post) {
				$classes = $post->getAttribute('class');
				$post->setAttribute('class', $classes . ' swiper-slide');
			}

			// Add swiper-wrapper class to the post template
			$classes = $post_template->getAttribute('class');
			$post_template->setAttribute('class', $classes . ' swiper-wrapper');

			// Get the modified content
			$modified_content = $dom->saveHTML();

			// Build the carousel wrapper
			$carousel_html = sprintf(
				'<div class="wp-block-query is-carousel" id="%s" data-carousel-config="%s">',
				esc_attr($carousel_id),
				esc_attr(wp_json_encode($swiper_config))
			);

			$carousel_html .= '<div class="swiper">';
			$carousel_html .= $modified_content;

			// Add navigation
			if ($settings['navigation']) {
				$carousel_html .= '<div class="swiper-button-prev" aria-label="' . esc_attr__('Previous', 'prolific-blocks') . '"></div>';
				$carousel_html .= '<div class="swiper-button-next" aria-label="' . esc_attr__('Next', 'prolific-blocks') . '"></div>';
			}

			// Add pagination
			if ($settings['pagination']) {
				$carousel_html .= '<div class="swiper-pagination"></div>';
			}

			$carousel_html .= '</div>'; // Close .swiper
			$carousel_html .= '</div>'; // Close .wp-block-query

			return $carousel_html;
		}
	}

	// If we couldn't parse the content, return original
	return $block_content;
}
add_filter('render_block', 'prolific_render_query_carousel', 10, 2);

/**
 * Enqueue scripts and styles for Query Loop Carousel
 *
 * @return void
 */
function prolific_enqueue_query_carousel_assets() {
	$asset_file = include plugin_dir_path(__FILE__) . '../../build/query-loop-carousel/index.asset.php';

	// Enqueue editor script
	wp_register_script(
		'prolific-query-carousel-editor',
		plugins_url('../../build/query-loop-carousel/index.js', __FILE__),
		$asset_file['dependencies'],
		$asset_file['version'],
		false
	);

	// Enqueue editor styles
	wp_register_style(
		'prolific-query-carousel-editor-style',
		plugins_url('../../build/query-loop-carousel/index.css', __FILE__),
		array('wp-edit-blocks'),
		$asset_file['version']
	);

	// Enqueue frontend view script
	wp_register_script(
		'prolific-query-carousel-view',
		plugins_url('../../build/query-loop-carousel/view.js', __FILE__),
		array('swiper-script'),
		$asset_file['version'],
		true
	);

	// Enqueue frontend styles
	wp_register_style(
		'prolific-query-carousel-style',
		plugins_url('../../build/query-loop-carousel/style-index.css', __FILE__),
		array(),
		$asset_file['version']
	);

	// Register assets with block editor
	if (is_admin()) {
		wp_enqueue_script('prolific-query-carousel-editor');
		wp_enqueue_style('prolific-query-carousel-editor-style');
	}

	// Enqueue frontend assets if Query block is present
	if (has_block('core/query')) {
		wp_enqueue_script('prolific-query-carousel-view');
		wp_enqueue_style('prolific-query-carousel-style');

		// Ensure Swiper is loaded
		wp_enqueue_script('swiper-script');
	}
}
add_action('enqueue_block_assets', 'prolific_enqueue_query_carousel_assets');
