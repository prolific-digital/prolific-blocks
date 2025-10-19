<?php
/**
 * Anchor Navigation Block - Server-side render
 *
 * @package prolific-blocks
 *
 * @param array $attributes Block attributes.
 * @param string $content Block default content.
 * @param WP_Block $block Block instance.
 */

// Exit if accessed directly.
if (!defined('ABSPATH')) {
	exit;
}

// Extract attributes
$include_h1 = isset($attributes['includeH1']) ? $attributes['includeH1'] : false;
$include_h2 = isset($attributes['includeH2']) ? $attributes['includeH2'] : true;
$include_h3 = isset($attributes['includeH3']) ? $attributes['includeH3'] : true;
$include_h4 = isset($attributes['includeH4']) ? $attributes['includeH4'] : false;
$include_h5 = isset($attributes['includeH5']) ? $attributes['includeH5'] : false;
$include_h6 = isset($attributes['includeH6']) ? $attributes['includeH6'] : false;
$smooth_scroll = isset($attributes['smoothScroll']) ? $attributes['smoothScroll'] : true;
$scroll_offset = isset($attributes['scrollOffset']) ? $attributes['scrollOffset'] : 0;
$sticky = isset($attributes['sticky']) ? $attributes['sticky'] : false;
$sticky_offset = isset($attributes['stickyOffset']) ? $attributes['stickyOffset'] : 0;
$style_variation = isset($attributes['styleVariation']) ? $attributes['styleVariation'] : 'pills';
$alignment = isset($attributes['alignment']) ? $attributes['alignment'] : 'center';
$mobile_style = isset($attributes['mobileStyle']) ? $attributes['mobileStyle'] : 'scroll';

/**
 * Helper function to slugify heading text into anchor IDs
 */
if (!function_exists('prolific_anchor_nav_slugify')) {
	function prolific_anchor_nav_slugify($text) {
		$text = strtolower(trim($text));
		$text = preg_replace('/\s+/', '-', $text);
		$text = preg_replace('/[^\w\-]+/', '', $text);
		$text = preg_replace('/\-\-+/', '-', $text);
		$text = trim($text, '-');
		return $text;
	}
}

/**
 * Extract headings from post content
 */
if (!function_exists('prolific_anchor_nav_extract_headings')) {
	function prolific_anchor_nav_extract_headings($content, $levels) {
		$headings = array();
		$anchor_counts = array();

		// Parse blocks from the post content
		$blocks = parse_blocks($content);

		// Recursive function to find headings in blocks
		$find_headings = function($blocks) use (&$find_headings, &$headings, &$anchor_counts, $levels) {
			foreach ($blocks as $block) {
				if ($block['blockName'] === 'core/heading') {
					$level = isset($block['attrs']['level']) ? $block['attrs']['level'] : 2;

					// Check if this level should be included
					if (in_array($level, $levels)) {
						// Extract text content from the heading
						$text = strip_tags($block['innerHTML']);
						$text = trim($text);

						if (!empty($text)) {
							// Get or generate anchor
							$base_anchor = isset($block['attrs']['anchor']) ? $block['attrs']['anchor'] : prolific_anchor_nav_slugify($text);

							// Handle duplicate anchors by appending counter
							// Start counting from 1 for the first occurrence
							if (!isset($anchor_counts[$base_anchor])) {
								$anchor_counts[$base_anchor] = 0;
							}

							$anchor_counts[$base_anchor]++;

							// Only append number if this is a duplicate (count > 1)
							if ($anchor_counts[$base_anchor] > 1) {
								$anchor = $base_anchor . '-' . $anchor_counts[$base_anchor];
							} else {
								$anchor = $base_anchor;
							}

							$headings[] = array(
								'text' => $text,
								'level' => $level,
								'anchor' => $anchor
							);
						}
					}
				}

				// Recursively process inner blocks
				if (!empty($block['innerBlocks'])) {
					$find_headings($block['innerBlocks']);
				}
			}
		};

		$find_headings($blocks);
		return $headings;
	}
}

// Build array of included heading levels
$levels = array();
if ($include_h1) $levels[] = 1;
if ($include_h2) $levels[] = 2;
if ($include_h3) $levels[] = 3;
if ($include_h4) $levels[] = 4;
if ($include_h5) $levels[] = 5;
if ($include_h6) $levels[] = 6;

// Get post content
$post_id = get_the_ID();
if (!$post_id) {
	return '';
}

$post_content = get_post_field('post_content', $post_id);
$headings = prolific_anchor_nav_extract_headings($post_content, $levels);

// Return empty if no headings found
if (empty($headings)) {
	return '';
}

// Get block wrapper attributes
$wrapper_attributes = get_block_wrapper_attributes(array(
	'class' => 'anchor-nav-style-' . esc_attr($style_variation) . ' anchor-nav-align-' . esc_attr($alignment) . ' anchor-nav-mobile-' . esc_attr($mobile_style) . ($sticky ? ' is-sticky' : ''),
	'data-smooth-scroll' => $smooth_scroll ? 'true' : 'false',
	'data-scroll-offset' => esc_attr($scroll_offset),
	'data-sticky' => $sticky ? 'true' : 'false',
	'data-sticky-offset' => esc_attr($sticky_offset)
));

?>

<div <?php echo $wrapper_attributes; ?>>
	<nav class="anchor-navigation" aria-label="<?php esc_attr_e('Jump to section', 'prolific-blocks'); ?>">
		<ul class="anchor-nav-list">
			<?php foreach ($headings as $heading) : ?>
				<li class="anchor-nav-item">
					<a href="#<?php echo esc_attr($heading['anchor']); ?>" class="anchor-nav-link" data-anchor="<?php echo esc_attr($heading['anchor']); ?>">
						<?php echo esc_html($heading['text']); ?>
					</a>
				</li>
			<?php endforeach; ?>
		</ul>
	</nav>
</div>
