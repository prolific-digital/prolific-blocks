<?php
/**
 * Render callback for Table of Contents block.
 *
 * @param array    $attributes Block attributes.
 * @param string   $content    Block content.
 * @param WP_Block $block      Block instance.
 * @return string Rendered block HTML.
 */

// Get attributes with defaults
$title = isset($attributes['title']) ? $attributes['title'] : __('Table of Contents', 'prolific-blocks');
$show_title = isset($attributes['showTitle']) ? $attributes['showTitle'] : true;
$include_h1 = isset($attributes['includeH1']) ? $attributes['includeH1'] : false;
$include_h2 = isset($attributes['includeH2']) ? $attributes['includeH2'] : true;
$include_h3 = isset($attributes['includeH3']) ? $attributes['includeH3'] : true;
$include_h4 = isset($attributes['includeH4']) ? $attributes['includeH4'] : false;
$include_h5 = isset($attributes['includeH5']) ? $attributes['includeH5'] : false;
$include_h6 = isset($attributes['includeH6']) ? $attributes['includeH6'] : false;
$numbered = isset($attributes['numbered']) ? $attributes['numbered'] : false;
$collapsible = isset($attributes['collapsible']) ? $attributes['collapsible'] : false;
$smooth_scroll = isset($attributes['smoothScroll']) ? $attributes['smoothScroll'] : true;
$scroll_offset = isset($attributes['scrollOffset']) ? $attributes['scrollOffset'] : 0;

/**
 * Helper function to slugify heading text into anchor IDs
 *
 * @param string $text The heading text to slugify
 * @return string Slugified text suitable for use as an anchor ID
 */
if (!function_exists('prolific_toc_slugify')) {
	function prolific_toc_slugify($text) {
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
 *
 * @param string $content Post content
 * @param array $levels Heading levels to include
 * @return array Array of headings with text, level, and anchor
 */
if (!function_exists('prolific_toc_extract_headings')) {
	function prolific_toc_extract_headings($content, $levels) {
		$headings = array();
		$anchor_counts = array();

		// Parse blocks from the post content
		$blocks = parse_blocks($content);

		// Recursive function to find headings in blocks
		$find_headings = function($blocks) use (&$find_headings, &$headings, &$anchor_counts, $levels) {
			foreach ($blocks as $block) {
				if ($block['blockName'] === 'core/heading') {
					$level = isset($block['attrs']['level']) ? $block['attrs']['level'] : 2;

					// Extract text content from the heading
					$text = strip_tags($block['innerHTML']);
					$text = trim($text);

					if (!empty($text)) {
						// Get or generate anchor
						$base_anchor = isset($block['attrs']['anchor']) ? $block['attrs']['anchor'] : prolific_toc_slugify($text);

						// CRITICAL: Track anchor counts for ALL headings, not just filtered ones
						// This ensures ID generation matches what happens in the frontend view.js
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

						// NOW check if this level should be included in TOC
						// We generate anchors for ALL headings, but only add filtered ones to the list
						if (in_array($level, $levels)) {
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

// Build array of levels to include
$levels = array();
if ($include_h1) $levels[] = 1;
if ($include_h2) $levels[] = 2;
if ($include_h3) $levels[] = 3;
if ($include_h4) $levels[] = 4;
if ($include_h5) $levels[] = 5;
if ($include_h6) $levels[] = 6;

// Get the post content
global $post;
$post_content = '';

if (isset($post) && isset($post->post_content)) {
	$post_content = $post->post_content;
}

// Extract headings from content
$headings = prolific_toc_extract_headings($post_content, $levels);

// If no headings found, don't render the block
if (empty($headings)) {
	return '';
}

/**
 * Build nested list structure from flat array of headings
 *
 * @param array $headings Flat array of headings
 * @return array Nested array of headings
 */
if (!function_exists('prolific_toc_build_nested')) {
	function prolific_toc_build_nested($headings) {
		$result = array();
		$stack = array();

		foreach ($headings as $heading) {
			$item = array(
				'text' => $heading['text'],
				'level' => $heading['level'],
				'anchor' => $heading['anchor'],
				'children' => array()
			);

			// Find the parent level
			while (!empty($stack) && end($stack)['level'] >= $heading['level']) {
				array_pop($stack);
			}

			if (empty($stack)) {
				$result[] = &$item;
			} else {
				$stack[count($stack) - 1]['children'][] = &$item;
			}

			$stack[] = &$item;
			unset($item);
		}

		return $result;
	}
}

/**
 * Render nested list of headings
 *
 * @param array $items Nested array of headings
 * @param bool $numbered Whether to use numbered list
 * @param int $depth Current nesting depth
 * @return string HTML for the list
 */
if (!function_exists('prolific_toc_render_list')) {
	function prolific_toc_render_list($items, $numbered = false, $depth = 0) {
		if (empty($items)) {
			return '';
		}

		$list_tag = $numbered ? 'ol' : 'ul';
		$html = sprintf('<' . $list_tag . ' class="toc-list toc-list-level-%d">', $depth);

		foreach ($items as $item) {
			$html .= '<li class="toc-item">';
			$html .= sprintf(
				'<a href="#%s" class="toc-link">%s</a>',
				esc_attr($item['anchor']),
				esc_html($item['text'])
			);

			if (!empty($item['children'])) {
				$html .= prolific_toc_render_list($item['children'], $numbered, $depth + 1);
			}

			$html .= '</li>';
		}

		$html .= '</' . $list_tag . '>';
		return $html;
	}
}

$nested_headings = prolific_toc_build_nested($headings);

// Build data attributes for JavaScript
$data_attrs = array(
	'data-smooth-scroll' => $smooth_scroll ? 'true' : 'false',
	'data-scroll-offset' => $scroll_offset,
	'data-collapsible' => $collapsible ? 'true' : 'false'
);

$wrapper_attrs = get_block_wrapper_attributes(array(
	'class' => 'wp-block-prolific-table-of-contents' . ($collapsible ? ' toc-collapsible' : ''),
	'data-smooth-scroll' => $smooth_scroll ? 'true' : 'false',
	'data-scroll-offset' => $scroll_offset,
	'data-collapsible' => $collapsible ? 'true' : 'false'
));

?>

<div <?php echo $wrapper_attrs; ?>>
	<?php if ($show_title && !empty($title)): ?>
		<div class="toc-header">
			<h2 class="toc-title"><?php echo esc_html($title); ?></h2>
			<?php if ($collapsible): ?>
				<button
					class="toc-toggle"
					aria-label="<?php esc_attr_e('Toggle table of contents', 'prolific-blocks'); ?>"
					aria-expanded="true"
					type="button"
				>
					<span class="toc-toggle-icon"></span>
				</button>
			<?php endif; ?>
		</div>
	<?php endif; ?>

	<div class="toc-content">
		<nav class="toc-navigation" aria-label="<?php esc_attr_e('Table of contents', 'prolific-blocks'); ?>">
			<?php echo prolific_toc_render_list($nested_headings, $numbered); ?>
		</nav>
	</div>
</div>
