<?php
/**
 * Server-side rendering for Query Posts block
 *
 * @package prolific-blocks
 *
 * @var array $attributes Block attributes
 * @var string $content Block content
 * @var WP_Block $block Block instance
 */

if (!defined('ABSPATH')) {
	exit;
}

/**
 * Sanitizes SVG content to prevent XSS vulnerabilities.
 *
 * @param string $svg The SVG content to sanitize.
 * @return string The sanitized SVG.
 */
if (!function_exists('pb_query_posts_sanitize_svg')) {
	function pb_query_posts_sanitize_svg($svg) {
		if (empty($svg)) {
			return '';
		}

		// Remove PHP tags
		$svg = preg_replace('/<\?(=|php)(.+?)\?>/si', '', $svg);

		// Remove script tags
		$svg = preg_replace('/<script\b[^>]*>(.*?)<\/script>/is', '', $svg);

		// Remove JavaScript event attributes
		$svg = preg_replace('/on\w+\s*=\s*(["\'])?[^"\']*\1/i', '', $svg);

		// Remove potentially dangerous attributes
		$svg = preg_replace('/(xlink:href|href)\s*=\s*(["\'])\s*(javascript|data):/i', '$1=$2#$3:', $svg);

		return $svg;
	}
}

/**
 * Returns SVG icon for location pin (outline style).
 *
 * @return string SVG markup.
 */
if (!function_exists('prolific_icon_location_pin')) {
	function prolific_icon_location_pin() {
		return '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>';
	}
}

/**
 * Returns SVG icon for calendar (outline style).
 *
 * @return string SVG markup.
 */
if (!function_exists('prolific_icon_calendar')) {
	function prolific_icon_calendar() {
		return '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>';
	}
}

/**
 * Returns SVG icon for clock (outline style).
 *
 * @return string SVG markup.
 */
if (!function_exists('prolific_icon_clock')) {
	function prolific_icon_clock() {
		return '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>';
	}
}

/**
 * Renders Places CPT custom layout.
 *
 * @param int   $post_id     The post ID.
 * @param array $attributes  Block attributes.
 * @return string HTML markup.
 */
if (!function_exists('prolific_render_places_layout')) {
	function prolific_render_places_layout($post_id, $attributes) {
		$output = '';

		// Get primary hierarchical taxonomy for category label
		$taxonomies = get_object_taxonomies('places', 'objects');
		$primary_taxonomy = '';
		$category_term = null;
		$category_label = ''; // Will hold the final label text

		// Find hierarchical, public taxonomy (prioritize those with show_in_rest)
		foreach ($taxonomies as $tax) {
			if ($tax->hierarchical && $tax->public) {
				// Prefer taxonomies with REST support
				if (!empty($tax->rest_base)) {
					$primary_taxonomy = $tax->name;
					break;
				}
				// Fallback to first hierarchical public taxonomy
				if (empty($primary_taxonomy)) {
					$primary_taxonomy = $tax->name;
				}
			}
		}

		// Get first term from primary taxonomy
		if ($primary_taxonomy) {
			$terms = get_the_terms($post_id, $primary_taxonomy);
			if ($terms && !is_wp_error($terms)) {
				$category_term = $terms[0];
				$category_label = $category_term->name;
			}
		}

		// Fallback: If no term assigned, show post type label
		if (empty($category_label)) {
			$post_type_obj = get_post_type_object('places');
			$category_label = $post_type_obj ? $post_type_obj->labels->singular_name : __('Place', 'prolific-blocks');
		}

		// Get ACF fields
		$address_field = get_field('address', $post_id);
		$hours_display = get_field('hours_display', $post_id);

		// Handle address field - could be string, array (Google Maps), or field group
		$address = '';
		if (!empty($address_field)) {
			if (is_array($address_field)) {
				// Check if it's a Google Maps field (has 'address' key)
				if (isset($address_field['address'])) {
					$address = $address_field['address'];
				}
				// Check if it's a field group with common address field names
				elseif (isset($address_field['street_address'])) {
					$parts = [];
					if (!empty($address_field['street_address'])) $parts[] = $address_field['street_address'];
					if (!empty($address_field['city'])) $parts[] = $address_field['city'];
					if (!empty($address_field['state'])) $parts[] = $address_field['state'];
					if (!empty($address_field['zip'])) $parts[] = $address_field['zip'];
					$address = implode(', ', $parts);
				}
				// Try common alternative field names
				elseif (isset($address_field['street']) || isset($address_field['line_1'])) {
					$parts = [];
					if (!empty($address_field['street'])) $parts[] = $address_field['street'];
					if (!empty($address_field['line_1'])) $parts[] = $address_field['line_1'];
					if (!empty($address_field['city'])) $parts[] = $address_field['city'];
					if (!empty($address_field['state'])) $parts[] = $address_field['state'];
					if (!empty($address_field['zip']) || !empty($address_field['postal_code'])) {
						$parts[] = $address_field['zip'] ?? $address_field['postal_code'];
					}
					$address = implode(', ', $parts);
				}
			} else {
				// Simple string field
				$address = $address_field;
			}
		}

		// Get read more text from attributes
		$read_more_text = $attributes['readMoreText'] ?? __('Read More', 'prolific-blocks');
		$show_excerpt = $attributes['showExcerpt'] ?? true;
		$excerpt_length = $attributes['excerptLength'] ?? 55;

		// Start output
		$output .= '<div class="entry-head">';

		// Category label (always show - either term or post type)
		if (!empty($category_label)) {
			$output .= '<div class="entry-head__label">' . esc_html($category_label) . '</div>';
		}

		// Title
		$title_tag = $attributes['titleTag'] ?? 'h2';
		$output .= '<' . esc_attr($title_tag) . ' class="entry-head__title">';
		$output .= '<a href="' . esc_url(get_permalink($post_id)) . '">';
		$output .= esc_html(get_the_title($post_id));
		$output .= '</a>';
		$output .= '</' . esc_attr($title_tag) . '>';

		$output .= '</div>'; // .entry-head

		// Content group
		$output .= '<div class="entry-meta">';

		// Excerpt
		if ($show_excerpt) {
			$excerpt = get_the_excerpt($post_id);
			if (!empty($excerpt)) {
				$excerpt = wp_trim_words($excerpt, $excerpt_length, '...');
				$output .= '<div class="entry-meta__excerpt">' . wp_kses_post($excerpt) . '</div>';
			}
		}

		// Address
		if (!empty($address)) {
			$output .= '<div class="entry-meta__row entry-meta__row--address">';
			$output .= '<span class="entry-meta__icon">' . prolific_icon_location_pin() . '</span>';
			$output .= '<span class="entry-meta__text">' . esc_html($address) . '</span>';
			$output .= '</div>';
		}

		// Hours (can be multiple lines)
		if (!empty($hours_display)) {
			$output .= '<div class="entry-meta__row entry-meta__row--hours">';
			$output .= '<span class="entry-meta__icon">' . prolific_icon_clock() . '</span>';

			// Check if hours_display is an array (repeater) or string
			if (is_array($hours_display)) {
				$output .= '<div class="entry-meta__text-group">';
				foreach ($hours_display as $hours_line) {
					if (is_string($hours_line)) {
						$output .= '<span class="entry-meta__text">' . esc_html($hours_line) . '</span>';
					} elseif (isset($hours_line['hours'])) {
						$output .= '<span class="entry-meta__text">' . esc_html($hours_line['hours']) . '</span>';
					}
				}
				$output .= '</div>';
			} else {
				// Single line or textarea
				$output .= '<span class="entry-meta__text">' . wp_kses_post(wpautop($hours_display)) . '</span>';
			}

			$output .= '</div>';
		}

		// Read More link
		$output .= '<a class="entry-meta__more" href="' . esc_url(get_permalink($post_id)) . '">';
		$output .= esc_html($read_more_text);
		$output .= '<span class="screen-reader-text"> ' . esc_html(get_the_title($post_id)) . '</span>';
		$output .= '</a>';

		$output .= '</div>'; // .entry-meta

		return $output;
	}
}

/**
 * Renders Events CPT custom layout (from The Events Calendar plugin).
 *
 * @param int   $post_id     The post ID.
 * @param array $attributes  Block attributes.
 * @return string HTML markup.
 */
if (!function_exists('prolific_render_events_layout')) {
	function prolific_render_events_layout($post_id, $attributes) {
		$output = '';

		// Get post type label (singular name)
		$post_type_obj = get_post_type_object('tribe_events');
		$post_type_label = $post_type_obj ? $post_type_obj->labels->singular_name : __('Event', 'prolific-blocks');

		// Get event meta from The Events Calendar
		$event_date = '';
		$event_time = '';
		$event_venue = '';

		// Check if The Events Calendar functions exist
		if (function_exists('tribe_get_start_date')) {
			$event_date = tribe_get_start_date($post_id, false, 'F j, Y');
		}

		if (function_exists('tribe_get_start_time') && function_exists('tribe_get_end_time')) {
			$start_time = tribe_get_start_time($post_id, 'g:i A');
			$end_time = tribe_get_end_time($post_id, 'g:i A');
			if ($start_time && $end_time) {
				$event_time = $start_time . ' – ' . $end_time;
			} elseif ($start_time) {
				$event_time = $start_time;
			}
		}

		if (function_exists('tribe_get_venue')) {
			$event_venue = tribe_get_venue($post_id);
		}

		// Get settings from attributes
		$read_more_text = $attributes['readMoreText'] ?? __('Read More', 'prolific-blocks');
		$show_excerpt = $attributes['showExcerpt'] ?? true;
		$excerpt_length = $attributes['excerptLength'] ?? 55;

		// Start output
		$output .= '<div class="entry-head">';

		// Post type label (always "Event")
		$output .= '<div class="entry-head__label">' . esc_html($post_type_label) . '</div>';

		// Title
		$title_tag = $attributes['titleTag'] ?? 'h2';
		$output .= '<' . esc_attr($title_tag) . ' class="entry-head__title">';
		$output .= '<a href="' . esc_url(get_permalink($post_id)) . '">';
		$output .= esc_html(get_the_title($post_id));
		$output .= '</a>';
		$output .= '</' . esc_attr($title_tag) . '>';

		$output .= '</div>'; // .entry-head

		// Content group
		$output .= '<div class="entry-meta">';

		// Excerpt
		if ($show_excerpt) {
			$excerpt = get_the_excerpt($post_id);
			if (!empty($excerpt)) {
				$excerpt = wp_trim_words($excerpt, $excerpt_length, '...');
				$output .= '<div class="entry-meta__excerpt">' . wp_kses_post($excerpt) . '</div>';
			}
		}

		// Event Date
		if (!empty($event_date)) {
			$output .= '<div class="entry-meta__row entry-meta__row--date">';
			$output .= '<span class="entry-meta__icon">' . prolific_icon_calendar() . '</span>';
			$output .= '<span class="entry-meta__text">' . esc_html($event_date) . '</span>';
			$output .= '</div>';
		}

		// Event Time
		if (!empty($event_time)) {
			$output .= '<div class="entry-meta__row entry-meta__row--time">';
			$output .= '<span class="entry-meta__icon">' . prolific_icon_clock() . '</span>';
			$output .= '<span class="entry-meta__text">' . esc_html($event_time) . '</span>';
			$output .= '</div>';
		}

		// Event Venue
		if (!empty($event_venue)) {
			$output .= '<div class="entry-meta__row entry-meta__row--venue">';
			$output .= '<span class="entry-meta__icon">' . prolific_icon_location_pin() . '</span>';
			$output .= '<span class="entry-meta__text">' . esc_html($event_venue) . '</span>';
			$output .= '</div>';
		}

		// Read More link
		$output .= '<a class="entry-meta__more" href="' . esc_url(get_permalink($post_id)) . '">';
		$output .= esc_html($read_more_text);
		$output .= '<span class="screen-reader-text"> ' . esc_html(get_the_title($post_id)) . '</span>';
		$output .= '</a>';

		$output .= '</div>'; // .entry-meta

		return $output;
	}
}

/**
 * Router function to determine which layout to use based on post type.
 * Extensible registry pattern for adding new CPT layouts.
 *
 * @param int   $post_id     The post ID.
 * @param array $attributes  Block attributes.
 * @return string|null HTML markup or null if no custom layout exists.
 */
if (!function_exists('prolific_render_cpt_layout')) {
	function prolific_render_cpt_layout($post_id, $attributes) {
		$post_type = get_post_type($post_id);

		/**
		 * CPT Layout Registry
		 * Add new CPT layouts here by mapping post type slug to renderer function.
		 *
		 * Example:
		 * 'rental' => 'prolific_render_rental_layout',
		 */
		$cpt_registry = apply_filters('prolific_query_posts_cpt_registry', [
			'places'       => 'prolific_render_places_layout',
			'tribe_events' => 'prolific_render_events_layout',
		]);

		// Check if custom layout exists for this post type
		if (isset($cpt_registry[$post_type]) && function_exists($cpt_registry[$post_type])) {
			return call_user_func($cpt_registry[$post_type], $post_id, $attributes);
		}

		return null; // No custom layout, use default
	}
}

// Extract attributes
$block_id = $attributes['blockId'] ?? 'query-posts-' . wp_unique_id();
$post_type = $attributes['postType'] ?? 'post';
$show_all_posts = $attributes['showAllPosts'] ?? false;
$posts_per_page = $show_all_posts ? -1 : ($attributes['postsPerPage'] ?? 10);
$order_by = $attributes['orderBy'] ?? 'date';
$order = $attributes['order'] ?? 'desc';
$offset = $attributes['offset'] ?? 0;
$include_ids = $attributes['includeIds'] ?? '';
$exclude_ids = $attributes['excludeIds'] ?? '';
$categories = $attributes['categories'] ?? [];
$tags = $attributes['tags'] ?? [];
$author_ids = $attributes['authorIds'] ?? [];
$post_status = $attributes['postStatus'] ?? 'publish';
$sticky_posts = $attributes['stickyPosts'] ?? 'include';
$display_mode = $attributes['displayMode'] ?? 'grid';
$enable_carousel = $attributes['enableCarousel'] ?? false;

// Carousel control attributes
$has_navigation = ($attributes['carouselNavigation'] ?? true) && $enable_carousel;
$has_pagination = ($attributes['carouselPagination'] ?? true) && $enable_carousel;
$has_scrollbar = ($attributes['scrollbar'] ?? false) && $enable_carousel;
$navigation_position = $attributes['navigationPosition'] ?? 'center';
$pagination_position = $attributes['paginationPosition'] ?? 'bottom';
$group_controls = $attributes['groupControls'] ?? false;
$grouped_position = $attributes['groupedPosition'] ?? 'bottom';
$grouped_layout = $attributes['groupedLayout'] ?? 'split';
$has_custom_nav = $attributes['customNavigation'] ?? false;
$custom_nav_prev = $attributes['customNavPrev'] ?? '';
$custom_nav_next = $attributes['customNavNext'] ?? '';

// Build WP_Query arguments
$query_args = [
	'post_type' => $post_type,
	'posts_per_page' => $posts_per_page,
	'orderby' => $order_by,
	'order' => $order,
	'offset' => $offset,
	'post_status' => $post_status,
	'ignore_sticky_posts' => false,
];

// Handle include/exclude IDs
if (!empty($include_ids)) {
	$include_array = array_map('trim', explode(',', $include_ids));
	$include_array = array_filter($include_array, 'is_numeric');
	if (!empty($include_array)) {
		$query_args['post__in'] = $include_array;
	}
}

if (!empty($exclude_ids)) {
	$exclude_array = array_map('trim', explode(',', $exclude_ids));
	$exclude_array = array_filter($exclude_array, 'is_numeric');
	if (!empty($exclude_array)) {
		$query_args['post__not_in'] = $exclude_array;
	}
}

// Handle sticky posts
if ($sticky_posts === 'exclude') {
	$query_args['post__not_in'] = array_merge(
		$query_args['post__not_in'] ?? [],
		get_option('sticky_posts')
	);
} elseif ($sticky_posts === 'only') {
	$query_args['post__in'] = get_option('sticky_posts');
}

// Handle taxonomy filters
$tax_query = [];

// New dynamic taxonomy filtering (works for any post type)
$taxonomy_filters = $attributes['taxonomyFilters'] ?? [];
if (!empty($taxonomy_filters) && is_array($taxonomy_filters)) {
	$selected_taxonomy = $taxonomy_filters['taxonomy'] ?? '';
	$selected_terms = $taxonomy_filters['terms'] ?? [];

	if (!empty($selected_taxonomy) && !empty($selected_terms) && is_array($selected_terms)) {
		$tax_query[] = [
			'taxonomy' => $selected_taxonomy,
			'field' => 'term_id',
			'terms' => $selected_terms,
			'operator' => 'IN', // OR behavior - match ANY selected term
		];
	}
}

// Legacy category/tag filtering for backward compatibility
if ($post_type === 'post') {
	if (!empty($categories) && is_array($categories)) {
		$tax_query[] = [
			'taxonomy' => 'category',
			'field' => 'term_id',
			'terms' => $categories,
		];
	}

	if (!empty($tags) && is_array($tags)) {
		$tax_query[] = [
			'taxonomy' => 'post_tag',
			'field' => 'term_id',
			'terms' => $tags,
		];
	}
}

// Add multiple taxonomy queries if present
if (!empty($tax_query)) {
	if (count($tax_query) > 1) {
		// If multiple tax queries, use AND relation
		$query_args['tax_query'] = array_merge(['relation' => 'AND'], $tax_query);
	} else {
		$query_args['tax_query'] = $tax_query;
	}
}

// Handle author filter
if (!empty($author_ids) && is_array($author_ids)) {
	$query_args['author__in'] = $author_ids;
}

// Execute query
$query = new WP_Query($query_args);

// Get wrapper classes
$wrapper_classes = ['prolific-query-posts'];
$wrapper_classes[] = 'display-mode-' . $display_mode;

if ($enable_carousel) {
	$wrapper_classes[] = 'carousel-enabled';
}

if ($attributes['align'] ?? false) {
	$wrapper_classes[] = 'align' . $attributes['align'];
}

if ($attributes['equalHeight'] ?? false) {
	$wrapper_classes[] = 'equal-height';
}

// Get block wrapper attributes
$wrapper_attributes = get_block_wrapper_attributes([
	'class' => implode(' ', $wrapper_classes),
	'id' => $block_id,
	'data-block-id' => $block_id,
	'data-post-type' => $post_type,
	'data-display-mode' => $display_mode,
]);

// Build data attributes for frontend JS
$data_attrs = [
	'data-carousel-enabled' => $enable_carousel ? 'true' : 'false',
	'data-show-search' => ($attributes['showSearch'] ?? false) ? 'true' : 'false',
	'data-show-category-filter' => ($attributes['showCategoryFilter'] ?? false) ? 'true' : 'false',
	'data-show-tag-filter' => ($attributes['showTagFilter'] ?? false) ? 'true' : 'false',
	'data-enable-load-more' => ($attributes['enableLoadMore'] ?? false) ? 'true' : 'false',
];

if ($enable_carousel) {
	$data_attrs['data-slides-desktop'] = $attributes['slidesPerViewDesktop'] ?? 3;
	$data_attrs['data-slides-tablet'] = $attributes['slidesPerViewTablet'] ?? 2;
	$data_attrs['data-slides-mobile'] = $attributes['slidesPerViewMobile'] ?? 1;
	$data_attrs['data-space-desktop'] = $attributes['spaceBetweenDesktop'] ?? 30;
	$data_attrs['data-space-tablet'] = $attributes['spaceBetweenTablet'] ?? 20;
	$data_attrs['data-space-mobile'] = $attributes['spaceBetweenMobile'] ?? 10;
	$data_attrs['data-carousel-loop'] = ($attributes['carouselLoop'] ?? false) ? 'true' : 'false';
	$data_attrs['data-carousel-autoplay'] = ($attributes['carouselAutoplay'] ?? false) ? 'true' : 'false';
	$data_attrs['data-autoplay-delay'] = $attributes['autoplayDelay'] ?? 3000;
	$data_attrs['data-carousel-navigation'] = ($attributes['carouselNavigation'] ?? true) ? 'true' : 'false';
	$data_attrs['data-carousel-pagination'] = ($attributes['carouselPagination'] ?? true) ? 'true' : 'false';
	$data_attrs['data-pagination-type'] = $attributes['paginationType'] ?? 'bullets';
	$data_attrs['data-dynamic-bullets'] = ($attributes['dynamicBullets'] ?? true) ? 'true' : 'false';
	$data_attrs['data-carousel-speed'] = $attributes['carouselSpeed'] ?? 300;
	$data_attrs['data-centered-slides'] = ($attributes['centeredSlides'] ?? false) ? 'true' : 'false';
	$data_attrs['data-pause-on-hover'] = ($attributes['pauseOnHover'] ?? true) ? 'true' : 'false';
	$data_attrs['data-grab-cursor'] = ($attributes['grabCursor'] ?? true) ? 'true' : 'false';
	$data_attrs['data-keyboard'] = ($attributes['keyboard'] ?? true) ? 'true' : 'false';

	// Control Positioning attributes (from Carousel New)
	$data_attrs['data-navigation-position'] = $attributes['navigationPosition'] ?? 'center';
	$data_attrs['data-pagination-position'] = $attributes['paginationPosition'] ?? 'bottom';
	$data_attrs['data-group-controls'] = ($attributes['groupControls'] ?? false) ? 'true' : 'false';
	$data_attrs['data-grouped-position'] = $attributes['groupedPosition'] ?? 'bottom';
	$data_attrs['data-grouped-layout'] = $attributes['groupedLayout'] ?? 'split';

	// Additional Navigation Controls (from Carousel New)
	$data_attrs['data-scrollbar'] = ($attributes['scrollbar'] ?? false) ? 'true' : 'false';
	$data_attrs['data-custom-navigation'] = ($attributes['customNavigation'] ?? false) ? 'true' : 'false';

	// Custom navigation SVG content
	if (!empty($attributes['customNavPrev'])) {
		$data_attrs['data-custom-nav-prev'] = esc_attr($attributes['customNavPrev']);
	}
	if (!empty($attributes['customNavNext'])) {
		$data_attrs['data-custom-nav-next'] = esc_attr($attributes['customNavNext']);
	}
}

$data_attrs_string = '';
foreach ($data_attrs as $key => $value) {
	$data_attrs_string .= sprintf(' %s="%s"', esc_attr($key), esc_attr($value));
}

// Output custom CSS for grid layout
$custom_css = '';
if (!$enable_carousel && $display_mode === 'grid') {
	$columns = $attributes['columns'] ?? 3;
	$columns_tablet = $attributes['columnsTablet'] ?? 2;
	$columns_mobile = $attributes['columnsMobile'] ?? 1;
	$gap = $attributes['gap'] ?? 20;

	$custom_css = sprintf(
		'<style>
			#%s .posts-grid {
				display: grid;
				grid-template-columns: repeat(%d, 1fr);
				gap: %dpx;
			}
			@media (max-width: 1024px) {
				#%s .posts-grid {
					grid-template-columns: repeat(%d, 1fr);
				}
			}
			@media (max-width: 768px) {
				#%s .posts-grid {
					grid-template-columns: repeat(%d, 1fr);
				}
			}
		</style>',
		esc_attr($block_id),
		$columns,
		$gap,
		esc_attr($block_id),
		$columns_tablet,
		esc_attr($block_id),
		$columns_mobile
	);
}

if (!$enable_carousel && $display_mode === 'list') {
	$gap = $attributes['gap'] ?? 20;
	$custom_css = sprintf(
		'<style>
			#%s .posts-list {
				display: flex;
				flex-direction: column;
				gap: %dpx;
			}
		</style>',
		esc_attr($block_id),
		$gap
	);
}

echo $custom_css;
?>

<div <?php echo $wrapper_attributes . $data_attrs_string; ?>>
	<?php
	// Render search and filter controls if enabled
	$show_search = $attributes['showSearch'] ?? false;
	$show_category_filter = $attributes['showCategoryFilter'] ?? false;
	$show_tag_filter = $attributes['showTagFilter'] ?? false;
	$show_date_filter = $attributes['showDateFilter'] ?? false;
	$show_sort_dropdown = $attributes['showSortDropdown'] ?? false;

	if ($show_search || $show_category_filter || $show_tag_filter || $show_date_filter || $show_sort_dropdown) :
	?>
		<div class="query-controls">
			<?php if ($show_search) : ?>
				<div class="search-control">
					<input
						type="search"
						class="search-input"
						placeholder="<?php echo esc_attr($attributes['searchPlaceholder'] ?? __('Search posts...', 'prolific-blocks')); ?>"
						aria-label="<?php echo esc_attr__('Search posts', 'prolific-blocks'); ?>"
					/>
				</div>
			<?php endif; ?>

			<?php if ($post_type === 'post' && $show_category_filter) : ?>
				<div class="category-filter-control">
					<select class="category-filter" aria-label="<?php echo esc_attr__('Filter by category', 'prolific-blocks'); ?>">
						<option value=""><?php echo esc_html__('All Categories', 'prolific-blocks'); ?></option>
						<?php
						$all_categories = get_categories(['hide_empty' => true]);
						foreach ($all_categories as $cat) :
						?>
							<option value="<?php echo esc_attr($cat->term_id); ?>">
								<?php echo esc_html($cat->name); ?>
							</option>
						<?php endforeach; ?>
					</select>
				</div>
			<?php endif; ?>

			<?php if ($post_type === 'post' && $show_tag_filter) : ?>
				<div class="tag-filter-control">
					<select class="tag-filter" aria-label="<?php echo esc_attr__('Filter by tag', 'prolific-blocks'); ?>">
						<option value=""><?php echo esc_html__('All Tags', 'prolific-blocks'); ?></option>
						<?php
						$all_tags = get_tags(['hide_empty' => true]);
						foreach ($all_tags as $tag) :
						?>
							<option value="<?php echo esc_attr($tag->term_id); ?>">
								<?php echo esc_html($tag->name); ?>
							</option>
						<?php endforeach; ?>
					</select>
				</div>
			<?php endif; ?>

			<?php if ($show_date_filter) : ?>
				<div class="date-filter-control">
					<select class="date-filter" aria-label="<?php echo esc_attr__('Filter by date', 'prolific-blocks'); ?>">
						<option value=""><?php echo esc_html__('All Dates', 'prolific-blocks'); ?></option>
						<?php
						global $wpdb;
						$months = $wpdb->get_results(
							$wpdb->prepare(
								"SELECT DISTINCT YEAR(post_date) AS year, MONTH(post_date) AS month
								FROM $wpdb->posts
								WHERE post_type = %s AND post_status = 'publish'
								ORDER BY post_date DESC",
								$post_type
							)
						);
						foreach ($months as $month_data) :
							$month_num = str_pad($month_data->month, 2, '0', STR_PAD_LEFT);
							$month_name = date_i18n('F Y', strtotime($month_data->year . '-' . $month_num . '-01'));
						?>
							<option value="<?php echo esc_attr($month_data->year . '-' . $month_num); ?>">
								<?php echo esc_html($month_name); ?>
							</option>
						<?php endforeach; ?>
					</select>
				</div>
			<?php endif; ?>

			<?php if ($show_sort_dropdown) : ?>
				<div class="sort-control">
					<select class="sort-dropdown" aria-label="<?php echo esc_attr__('Sort posts', 'prolific-blocks'); ?>">
						<option value="date-desc"><?php echo esc_html__('Newest First', 'prolific-blocks'); ?></option>
						<option value="date-asc"><?php echo esc_html__('Oldest First', 'prolific-blocks'); ?></option>
						<option value="title-asc"><?php echo esc_html__('Title A-Z', 'prolific-blocks'); ?></option>
						<option value="title-desc"><?php echo esc_html__('Title Z-A', 'prolific-blocks'); ?></option>
					</select>
				</div>
			<?php endif; ?>
		</div>
	<?php endif; ?>

	<?php if ($query->have_posts()) : ?>
		<?php
		// Determine wrapper tag and classes based on display mode
		if ($enable_carousel) {
			$wrapper_tag = 'swiper-container';
			$wrapper_class = 'query-posts-carousel';
			$items_wrapper = 'swiper-wrapper';
			$item_class = 'swiper-slide post-item';
		} else {
			$wrapper_tag = 'div';
			if ($display_mode === 'grid') {
				$wrapper_class = 'posts-grid';
			} elseif ($display_mode === 'list') {
				$wrapper_class = 'posts-list';
			} else {
				$wrapper_class = 'posts-masonry';
			}
			$items_wrapper = $wrapper_class;
			$item_class = 'post-item';
		}
		?>

		<?php if ($enable_carousel) : ?>
			<swiper-container
				class="query-posts-carousel"
				init="false"
				data-block-id="<?php echo esc_attr($block_id); ?>"
			>
		<?php else : ?>
			<div class="<?php echo esc_attr($wrapper_class); ?>">
		<?php endif; ?>

			<?php
			while ($query->have_posts()) :
				$query->the_post();
				$post_id = get_the_ID();

				// Get display settings
				$show_featured_image = $attributes['showFeaturedImage'] ?? true;
				$image_size = $attributes['imageSizeSlug'] ?? 'large';
				$image_position = $attributes['imagePosition'] ?? 'top';
				$show_title = $attributes['showTitle'] ?? true;
				$title_tag = $attributes['titleTag'] ?? 'h2';
				$show_excerpt = $attributes['showExcerpt'] ?? true;
				$excerpt_length = $attributes['excerptLength'] ?? 55;
				$show_meta = $attributes['showMeta'] ?? true;
				$show_author = $attributes['showAuthor'] ?? true;
				$show_date = $attributes['showDate'] ?? true;
				$show_categories = $attributes['showCategories'] ?? true;
				$show_tags = $attributes['showTags'] ?? false;
				$show_read_more = $attributes['showReadMore'] ?? true;
				$read_more_text = $attributes['readMoreText'] ?? __('Read More', 'prolific-blocks');

				$post_classes = [$item_class];
				if ($display_mode === 'list' && $show_featured_image) {
					$post_classes[] = 'image-position-' . $image_position;
				}
			?>
				<?php if ($enable_carousel) : ?>
					<swiper-slide class="<?php echo esc_attr(implode(' ', $post_classes)); ?>">
				<?php else : ?>
					<article class="<?php echo esc_attr(implode(' ', $post_classes)); ?>" id="post-<?php echo esc_attr($post_id); ?>">
				<?php endif; ?>

					<?php
					// Check if custom CPT layout exists
					$custom_layout = prolific_render_cpt_layout($post_id, $attributes);

					if ($custom_layout !== null) :
						// Use custom CPT layout
						echo $custom_layout;
					else :
						// Use default layout
					?>
						<?php if ($show_featured_image && has_post_thumbnail()) : ?>
							<div class="post-thumbnail">
								<a href="<?php echo esc_url(get_permalink()); ?>" aria-label="<?php echo esc_attr(get_the_title()); ?>">
									<?php the_post_thumbnail($image_size); ?>
								</a>
							</div>
						<?php endif; ?>

						<div class="post-content">
							<?php if ($show_title) : ?>
								<<?php echo esc_attr($title_tag); ?> class="post-title">
									<a href="<?php echo esc_url(get_permalink()); ?>">
										<?php the_title(); ?>
									</a>
								</<?php echo esc_attr($title_tag); ?>>
							<?php endif; ?>

							<?php if ($show_meta) : ?>
								<div class="post-meta">
									<?php if ($show_author) : ?>
										<span class="post-author">
											<?php echo esc_html__('By', 'prolific-blocks'); ?>
											<a href="<?php echo esc_url(get_author_posts_url(get_the_author_meta('ID'))); ?>">
												<?php echo esc_html(get_the_author()); ?>
											</a>
										</span>
									<?php endif; ?>

									<?php if ($show_date) : ?>
										<span class="post-date">
											<time datetime="<?php echo esc_attr(get_the_date('c')); ?>">
												<?php echo esc_html(get_the_date()); ?>
											</time>
										</span>
									<?php endif; ?>

									<?php if ($post_type === 'post' && $show_categories) : ?>
										<?php
										$post_categories = get_the_category();
										if (!empty($post_categories)) :
										?>
											<span class="post-categories">
												<?php
												foreach ($post_categories as $cat) {
													echo '<a href="' . esc_url(get_category_link($cat->term_id)) . '">' . esc_html($cat->name) . '</a>';
												}
												?>
											</span>
										<?php endif; ?>
									<?php endif; ?>

									<?php if ($post_type === 'post' && $show_tags) : ?>
										<?php
										$post_tags = get_the_tags();
										if (!empty($post_tags)) :
										?>
											<span class="post-tags">
												<?php
												foreach ($post_tags as $tag) {
													echo '<a href="' . esc_url(get_tag_link($tag->term_id)) . '">' . esc_html($tag->name) . '</a>';
												}
												?>
											</span>
										<?php endif; ?>
									<?php endif; ?>
								</div>
							<?php endif; ?>

							<?php if ($show_excerpt) : ?>
								<div class="post-excerpt">
									<?php
									$excerpt = get_the_excerpt();
									$excerpt = wp_trim_words($excerpt, $excerpt_length, '...');
									echo wp_kses_post($excerpt);
									?>
								</div>
							<?php endif; ?>

							<?php if ($show_read_more) : ?>
								<div class="post-read-more">
									<a href="<?php echo esc_url(get_permalink()); ?>" class="read-more-link">
										<?php echo esc_html($read_more_text); ?>
										<span class="screen-reader-text"><?php the_title(); ?></span>
									</a>
								</div>
							<?php endif; ?>
						</div>
					<?php endif; ?>

				<?php if ($enable_carousel) : ?>
					</swiper-slide>
				<?php else : ?>
					</article>
				<?php endif; ?>
			<?php endwhile; ?>

		<?php if ($enable_carousel) : ?>
			</swiper-container>

			<?php // Custom navigation (not grouped) ?>
			<?php if (!$group_controls && $has_navigation) : ?>
				<div class="query-posts-nav-wrapper nav-position-<?php echo esc_attr($navigation_position); ?>">
					<div class="query-posts-nav-buttons">
						<button
							class="query-posts-nav-prev"
							aria-label="<?php esc_attr_e('Previous slide', 'prolific-blocks'); ?>"
							role="button"
						>
							<?php if ($has_custom_nav && $custom_nav_prev) : ?>
								<span class="query-posts-nav-icon">
									<?php echo pb_query_posts_sanitize_svg($custom_nav_prev); ?>
								</span>
							<?php else : ?>
								<span class="query-posts-nav-icon" aria-hidden="true">‹</span>
							<?php endif; ?>
							<span class="screen-reader-text"><?php esc_html_e('Previous', 'prolific-blocks'); ?></span>
						</button>

						<button
							class="query-posts-nav-next"
							aria-label="<?php esc_attr_e('Next slide', 'prolific-blocks'); ?>"
							role="button"
						>
							<?php if ($has_custom_nav && $custom_nav_next) : ?>
								<span class="query-posts-nav-icon">
									<?php echo pb_query_posts_sanitize_svg($custom_nav_next); ?>
								</span>
							<?php else : ?>
								<span class="query-posts-nav-icon" aria-hidden="true">›</span>
							<?php endif; ?>
							<span class="screen-reader-text"><?php esc_html_e('Next', 'prolific-blocks'); ?></span>
						</button>
					</div>
				</div>
			<?php endif; ?>

			<?php // Custom pagination (not grouped) ?>
			<?php if (!$group_controls && $has_pagination) : ?>
				<div class="swiper-pagination pagination-position-<?php echo esc_attr($pagination_position); ?>"></div>
			<?php endif; ?>

			<?php // Scrollbar ?>
			<?php if ($has_scrollbar) : ?>
				<div class="swiper-scrollbar"></div>
			<?php endif; ?>

			<?php // Grouped controls ?>
			<?php if ($group_controls && ($has_navigation || $has_pagination)) : ?>
				<div class="query-posts-controls-group grouped grouped-position-<?php echo esc_attr($grouped_position); ?> grouped-layout-<?php echo esc_attr($grouped_layout); ?>">
					<?php if ($grouped_layout === 'split') : ?>
						<?php // Split layout: individual buttons for proper ordering ?>
						<?php if ($has_navigation) : ?>
							<button
								class="query-posts-nav-prev"
								aria-label="<?php esc_attr_e('Previous slide', 'prolific-blocks'); ?>"
								role="button"
							>
								<?php if ($has_custom_nav && $custom_nav_prev) : ?>
									<span class="query-posts-nav-icon">
										<?php echo pb_query_posts_sanitize_svg($custom_nav_prev); ?>
									</span>
								<?php else : ?>
									<span class="query-posts-nav-icon" aria-hidden="true">‹</span>
								<?php endif; ?>
								<span class="screen-reader-text"><?php esc_html_e('Previous', 'prolific-blocks'); ?></span>
							</button>
						<?php endif; ?>

						<?php if ($has_pagination) : ?>
							<div class="swiper-pagination grouped"></div>
						<?php endif; ?>

						<?php if ($has_navigation) : ?>
							<button
								class="query-posts-nav-next"
								aria-label="<?php esc_attr_e('Next slide', 'prolific-blocks'); ?>"
								role="button"
							>
								<?php if ($has_custom_nav && $custom_nav_next) : ?>
									<span class="query-posts-nav-icon">
										<?php echo pb_query_posts_sanitize_svg($custom_nav_next); ?>
									</span>
								<?php else : ?>
									<span class="query-posts-nav-icon" aria-hidden="true">›</span>
								<?php endif; ?>
								<span class="screen-reader-text"><?php esc_html_e('Next', 'prolific-blocks'); ?></span>
							</button>
						<?php endif; ?>
					<?php else : ?>
						<?php // Left/Right layouts: buttons grouped in wrapper ?>
						<?php if ($has_navigation) : ?>
							<div class="query-posts-nav-buttons">
								<button
									class="query-posts-nav-prev"
									aria-label="<?php esc_attr_e('Previous slide', 'prolific-blocks'); ?>"
									role="button"
								>
									<?php if ($has_custom_nav && $custom_nav_prev) : ?>
										<span class="query-posts-nav-icon">
											<?php echo pb_query_posts_sanitize_svg($custom_nav_prev); ?>
										</span>
									<?php else : ?>
										<span class="query-posts-nav-icon" aria-hidden="true">‹</span>
									<?php endif; ?>
									<span class="screen-reader-text"><?php esc_html_e('Previous', 'prolific-blocks'); ?></span>
								</button>

								<button
									class="query-posts-nav-next"
									aria-label="<?php esc_attr_e('Next slide', 'prolific-blocks'); ?>"
									role="button"
								>
									<?php if ($has_custom_nav && $custom_nav_next) : ?>
										<span class="query-posts-nav-icon">
											<?php echo pb_query_posts_sanitize_svg($custom_nav_next); ?>
										</span>
									<?php else : ?>
										<span class="query-posts-nav-icon" aria-hidden="true">›</span>
									<?php endif; ?>
									<span class="screen-reader-text"><?php esc_html_e('Next', 'prolific-blocks'); ?></span>
								</button>
							</div>
						<?php endif; ?>

						<?php if ($has_pagination) : ?>
							<div class="swiper-pagination grouped"></div>
						<?php endif; ?>
					<?php endif; ?>
				</div>
			<?php endif; ?>

		<?php else : ?>
			</div>
		<?php endif; ?>

		<?php
		// Load More or Pagination
		if ($attributes['enableLoadMore'] ?? false) :
		?>
			<div class="load-more-wrapper">
				<button
					class="load-more-button"
					data-page="1"
					data-max-pages="<?php echo esc_attr($query->max_num_pages); ?>"
				>
					<?php echo esc_html($attributes['loadMoreText'] ?? __('Load More', 'prolific-blocks')); ?>
				</button>
			</div>
		<?php elseif ($attributes['enablePagination'] ?? false) : ?>
			<div class="pagination-wrapper">
				<?php
				echo paginate_links([
					'total' => $query->max_num_pages,
					'prev_text' => __('&laquo; Previous', 'prolific-blocks'),
					'next_text' => __('Next &raquo;', 'prolific-blocks'),
				]);
				?>
			</div>
		<?php endif; ?>

	<?php else : ?>
		<div class="no-posts-found">
			<p><?php echo esc_html($attributes['noResultsText'] ?? __('No posts found.', 'prolific-blocks')); ?></p>
		</div>
	<?php endif; ?>

	<?php wp_reset_postdata(); ?>
</div>
