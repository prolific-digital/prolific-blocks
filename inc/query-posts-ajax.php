<?php
/**
 * AJAX handlers for Query Posts block
 *
 * Provides server-side AJAX endpoints for search, filtering, load-more,
 * and AJAX pagination. Also contains the shared render function used by
 * both render.php (SSR) and AJAX responses.
 *
 * @package prolific-blocks
 */

if (!defined('ABSPATH')) {
	exit;
}

/**
 * Render a single post item for the Query Posts block.
 *
 * Shared between render.php (server-side render) and AJAX handlers
 * to ensure identical HTML output in both contexts.
 *
 * @param int   $post_id         The post ID to render.
 * @param array $attributes      Block attributes for display settings.
 * @param bool  $enable_carousel Whether carousel mode is active.
 * @return string HTML markup for the post item.
 */
if (!function_exists('prolific_query_posts_render_item')) {
	function prolific_query_posts_render_item($post_id, $attributes, $enable_carousel = false) {
		setup_postdata(get_post($post_id));

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
		$show_tags_display = $attributes['showTags'] ?? false;
		$show_read_more = $attributes['showReadMore'] ?? true;
		$read_more_text = $attributes['readMoreText'] ?? __('Read More', 'prolific-blocks');
		$post_type = $attributes['postType'] ?? 'post';
		$display_mode = $attributes['displayMode'] ?? 'grid';

		$item_class = $enable_carousel ? 'swiper-slide post-item' : 'post-item';
		$post_classes = [$item_class];
		if ($display_mode === 'list' && $show_featured_image) {
			$post_classes[] = 'image-position-' . $image_position;
		}

		ob_start();

		// Opening tag
		if ($enable_carousel) {
			echo '<swiper-slide class="' . esc_attr(implode(' ', $post_classes)) . '">';
		} else {
			echo '<article class="' . esc_attr(implode(' ', $post_classes)) . '" id="post-' . esc_attr($post_id) . '">';
		}

		// Check if custom CPT layout exists
		// prolific_render_cpt_layout() is defined in render.php which is only
		// loaded during SSR, not during AJAX requests to admin-ajax.php
		$custom_layout = function_exists('prolific_render_cpt_layout')
			? prolific_render_cpt_layout($post_id, $attributes)
			: null;

		if ($custom_layout !== null) {
			echo $custom_layout;
		} else {
			// Default layout
			if ($show_featured_image && has_post_thumbnail($post_id)) {
				echo '<div class="post-thumbnail">';
				echo '<a href="' . esc_url(get_permalink($post_id)) . '" aria-label="' . esc_attr(get_the_title($post_id)) . '">';
				echo get_the_post_thumbnail($post_id, $image_size);
				echo '</a>';
				echo '</div>';
			}

			echo '<div class="post-content">';

			if ($show_title) {
				echo '<' . esc_attr($title_tag) . ' class="post-title">';
				echo '<a href="' . esc_url(get_permalink($post_id)) . '">';
				echo esc_html(get_the_title($post_id));
				echo '</a>';
				echo '</' . esc_attr($title_tag) . '>';
			}

			if ($show_meta) {
				echo '<div class="post-meta">';

				if ($show_author) {
					echo '<span class="post-author">';
					echo esc_html__('By', 'prolific-blocks') . ' ';
					echo '<a href="' . esc_url(get_author_posts_url(get_the_author_meta('ID'))) . '">';
					echo esc_html(get_the_author());
					echo '</a>';
					echo '</span>';
				}

				if ($show_date) {
					echo '<span class="post-date">';
					echo '<time datetime="' . esc_attr(get_the_date('c')) . '">';
					echo esc_html(get_the_date());
					echo '</time>';
					echo '</span>';
				}

				if ($post_type === 'post' && $show_categories) {
					$post_categories = get_the_category($post_id);
					if (!empty($post_categories)) {
						echo '<span class="post-categories">';
						foreach ($post_categories as $cat) {
							echo '<a href="' . esc_url(get_category_link($cat->term_id)) . '">' . esc_html($cat->name) . '</a>';
						}
						echo '</span>';
					}
				}

				if ($post_type === 'post' && $show_tags_display) {
					$post_tags = get_the_tags();
					if (!empty($post_tags)) {
						echo '<span class="post-tags">';
						foreach ($post_tags as $tag) {
							echo '<a href="' . esc_url(get_tag_link($tag->term_id)) . '">' . esc_html($tag->name) . '</a>';
						}
						echo '</span>';
					}
				}

				echo '</div>';
			}

			if ($show_excerpt) {
				echo '<div class="post-excerpt">';
				$excerpt = get_the_excerpt($post_id);
				$excerpt = wp_trim_words($excerpt, $excerpt_length, '...');
				echo wp_kses_post($excerpt);
				echo '</div>';
			}

			if ($show_read_more) {
				echo '<div class="post-read-more">';
				echo '<a href="' . esc_url(get_permalink($post_id)) . '" class="read-more-link">';
				echo esc_html($read_more_text);
				echo '<span class="screen-reader-text">' . esc_html(get_the_title($post_id)) . '</span>';
				echo '</a>';
				echo '</div>';
			}

			echo '</div>'; // .post-content
		}

		// Closing tag
		if ($enable_carousel) {
			echo '</swiper-slide>';
		} else {
			echo '</article>';
		}

		return ob_get_clean();
	}
}

/**
 * Build display attributes array from AJAX request parameters.
 *
 * @return array Attributes array matching block attribute structure.
 */
if (!function_exists('prolific_query_posts_build_ajax_attributes')) {
	function prolific_query_posts_build_ajax_attributes() {
		return [
			'postType'         => sanitize_text_field($_GET['post_type'] ?? 'post'),
			'showFeaturedImage' => ($_GET['show_featured_image'] ?? 'true') === 'true',
			'imageSizeSlug'    => sanitize_text_field($_GET['image_size_slug'] ?? 'large'),
			'showTitle'        => ($_GET['show_title'] ?? 'true') === 'true',
			'titleTag'         => sanitize_text_field($_GET['title_tag'] ?? 'h2'),
			'showExcerpt'      => ($_GET['show_excerpt'] ?? 'true') === 'true',
			'excerptLength'    => intval($_GET['excerpt_length'] ?? 55),
			'showMeta'         => ($_GET['show_meta'] ?? 'true') === 'true',
			'showAuthor'       => ($_GET['show_author'] ?? 'true') === 'true',
			'showDate'         => ($_GET['show_date'] ?? 'true') === 'true',
			'showCategories'   => ($_GET['show_categories'] ?? 'true') === 'true',
			'showTags'         => ($_GET['show_tags'] ?? 'false') === 'true',
			'showReadMore'     => ($_GET['show_read_more'] ?? 'true') === 'true',
			'readMoreText'     => sanitize_text_field($_GET['read_more_text'] ?? __('Read More', 'prolific-blocks')),
			'displayMode'      => sanitize_text_field($_GET['display_mode'] ?? 'grid'),
			'imagePosition'    => sanitize_text_field($_GET['image_position'] ?? 'top'),
		];
	}
}

/**
 * Build WP_Query arguments from AJAX request parameters.
 *
 * @param string $post_type     Post type slug.
 * @param int    $posts_per_page Posts per page.
 * @param int    $offset        Post offset.
 * @param int    $page          Current page number.
 * @param string $order_by      Order by field.
 * @param string $order         Order direction.
 * @return array WP_Query arguments.
 */
if (!function_exists('prolific_query_posts_build_query_args')) {
	function prolific_query_posts_build_query_args($post_type, $posts_per_page, $offset, $page, $order_by, $order) {
		// Use post_status from block attributes (passed via data attr),
		// but restrict non-logged-in users to 'publish' only
		$post_status = sanitize_text_field($_GET['post_status'] ?? 'publish');
		if (!is_user_logged_in() && $post_status !== 'publish') {
			$post_status = 'publish';
		}

		$query_args = [
			'post_type'      => $post_type,
			'posts_per_page' => $posts_per_page,
			'orderby'        => $order_by,
			'order'          => $order,
			'post_status'    => $post_status,
			'ignore_sticky_posts' => false,
		];

		// Handle offset + paged interaction
		if ($offset > 0) {
			$query_args['offset'] = $offset + (($page - 1) * $posts_per_page);
		} else {
			$query_args['paged'] = $page;
		}

		// Search
		$search = sanitize_text_field($_GET['search'] ?? '');
		if (!empty($search)) {
			$query_args['s'] = $search;
		}

		// Tax query
		$tax_query = [];
		$category = sanitize_text_field($_GET['category'] ?? '');
		$tag = sanitize_text_field($_GET['tag'] ?? '');

		if (!empty($category)) {
			$term_ids = array_map('intval', array_filter(explode(',', $category)));
			if (!empty($term_ids)) {
				$tax_query[] = [
					'taxonomy' => 'category',
					'field'    => 'term_id',
					'terms'    => $term_ids,
					'operator' => 'IN',
				];
			}
		}

		if (!empty($tag)) {
			$term_ids = array_map('intval', array_filter(explode(',', $tag)));
			if (!empty($term_ids)) {
				$tax_query[] = [
					'taxonomy' => 'post_tag',
					'field'    => 'term_id',
					'terms'    => $term_ids,
					'operator' => 'IN',
				];
			}
		}

		// Dynamic taxonomy filter (for CPTs)
		$dynamic_taxonomy = sanitize_text_field($_GET['taxonomy'] ?? '');
		$dynamic_terms = sanitize_text_field($_GET['terms'] ?? '');

		if (!empty($dynamic_taxonomy) && !empty($dynamic_terms) && taxonomy_exists($dynamic_taxonomy)) {
			$term_ids = array_map('intval', array_filter(explode(',', $dynamic_terms)));
			if (!empty($term_ids)) {
				$tax_query[] = [
					'taxonomy' => $dynamic_taxonomy,
					'field'    => 'term_id',
					'terms'    => $term_ids,
					'operator' => 'IN',
				];
			}
		}

		if (!empty($tax_query)) {
			if (count($tax_query) > 1) {
				$query_args['tax_query'] = array_merge(['relation' => 'AND'], $tax_query);
			} else {
				$query_args['tax_query'] = $tax_query;
			}
		}

		// Date filter
		$date = sanitize_text_field($_GET['date'] ?? '');
		if (!empty($date)) {
			$date_parts = explode('-', $date);
			if (count($date_parts) === 2) {
				$query_args['year'] = intval($date_parts[0]);
				$query_args['monthnum'] = intval($date_parts[1]);
			}
		}

		return $query_args;
	}
}

/**
 * AJAX handler for filtering, searching, sorting, and paginating posts.
 *
 * Handles both standard filtering and AJAX pagination.
 * Registered on both wp_ajax_ and wp_ajax_nopriv_ hooks.
 */
function prolific_filter_query_posts_handler() {
	check_ajax_referer('prolific_query_posts_nonce', 'nonce');

	$post_type = sanitize_text_field($_GET['post_type'] ?? 'post');
	if (!post_type_exists($post_type)) {
		wp_send_json_error(['message' => __('Invalid post type.', 'prolific-blocks')]);
	}

	$posts_per_page = intval($_GET['posts_per_page'] ?? 10);
	$offset = intval($_GET['offset'] ?? 0);
	$order_by = sanitize_text_field($_GET['orderBy'] ?? 'date');
	$order = sanitize_text_field($_GET['order'] ?? 'desc');
	$page = absint($_GET['page'] ?? 1);
	if ($page < 1) $page = 1;
	$ajax_pagination = sanitize_text_field($_GET['ajax_pagination'] ?? 'false');
	$enable_carousel = ($_GET['carousel_enabled'] ?? 'false') === 'true';

	// Build attributes for render function
	$attributes = prolific_query_posts_build_ajax_attributes();

	// Build and execute query
	$query_args = prolific_query_posts_build_query_args($post_type, $posts_per_page, $offset, $page, $order_by, $order);
	$query = new WP_Query($query_args);

	// Fix max_num_pages when offset is used
	if ($offset > 0 && $posts_per_page > 0) {
		$query->max_num_pages = ceil(max(0, $query->found_posts - $offset) / $posts_per_page);
	}

	// Render post items
	$html = '';
	if ($query->have_posts()) {
		while ($query->have_posts()) {
			$query->the_post();
			$html .= prolific_query_posts_render_item(get_the_ID(), $attributes, $enable_carousel);
		}
		wp_reset_postdata();
	}

	// Build pagination HTML if AJAX pagination is requested
	$pagination_html = '';
	if ($ajax_pagination === 'true' && $query->max_num_pages > 1) {
		$pagination_html = paginate_links([
			'total'     => $query->max_num_pages,
			'current'   => $page,
			'prev_text' => __('&laquo; Previous', 'prolific-blocks'),
			'next_text' => __('Next &raquo;', 'prolific-blocks'),
			'format'    => '?paged=%#%',
		]);
	}

	wp_send_json_success([
		'html'       => $html,
		'max_pages'  => $query->max_num_pages,
		'pagination' => $pagination_html,
	]);
}
add_action('wp_ajax_prolific_filter_query_posts', 'prolific_filter_query_posts_handler');
add_action('wp_ajax_nopriv_prolific_filter_query_posts', 'prolific_filter_query_posts_handler');

/**
 * AJAX handler for loading more posts (append mode).
 *
 * Same query logic as filter handler, but intended for appending
 * new items to existing content rather than replacing.
 */
function prolific_load_more_posts_handler() {
	check_ajax_referer('prolific_query_posts_nonce', 'nonce');

	$post_type = sanitize_text_field($_GET['post_type'] ?? 'post');
	if (!post_type_exists($post_type)) {
		wp_send_json_error(['message' => __('Invalid post type.', 'prolific-blocks')]);
	}

	$posts_per_page = intval($_GET['posts_per_page'] ?? 10);
	$offset = intval($_GET['offset'] ?? 0);
	$order_by = sanitize_text_field($_GET['orderBy'] ?? 'date');
	$order = sanitize_text_field($_GET['order'] ?? 'desc');
	$page = absint($_GET['page'] ?? 1);
	if ($page < 1) $page = 1;
	$enable_carousel = ($_GET['carousel_enabled'] ?? 'false') === 'true';

	// Build attributes for render function
	$attributes = prolific_query_posts_build_ajax_attributes();

	// Build and execute query
	$query_args = prolific_query_posts_build_query_args($post_type, $posts_per_page, $offset, $page, $order_by, $order);
	$query = new WP_Query($query_args);

	// Fix max_num_pages when offset is used
	if ($offset > 0 && $posts_per_page > 0) {
		$query->max_num_pages = ceil(max(0, $query->found_posts - $offset) / $posts_per_page);
	}

	// Render only the new page's post items
	$html = '';
	if ($query->have_posts()) {
		while ($query->have_posts()) {
			$query->the_post();
			$html .= prolific_query_posts_render_item(get_the_ID(), $attributes, $enable_carousel);
		}
		wp_reset_postdata();
	}

	wp_send_json_success([
		'html'      => $html,
		'max_pages' => $query->max_num_pages,
	]);
}
add_action('wp_ajax_prolific_load_more_posts', 'prolific_load_more_posts_handler');
add_action('wp_ajax_nopriv_prolific_load_more_posts', 'prolific_load_more_posts_handler');

/**
 * Localize the Query Posts view script with AJAX URL and nonce.
 *
 * The script handle is auto-generated by WordPress from block.json:
 * block name "prolific/query-posts" + viewScript "file:./view.js"
 * produces handle "prolific-query-posts-view-script".
 */
function prolific_query_posts_localize_script() {
	wp_localize_script('prolific-query-posts-view-script', 'prolific_query_posts', [
		'ajax_url' => admin_url('admin-ajax.php'),
		'nonce'    => wp_create_nonce('prolific_query_posts_nonce'),
	]);
}
add_action('wp_enqueue_scripts', 'prolific_query_posts_localize_script');
