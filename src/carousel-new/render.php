<?php
/**
 * Render template for Carousel New block.
 *
 * @package Prolific_Blocks
 * @var array $attributes Block attributes.
 * @var string $content Block inner content.
 * @var WP_Block $block Block instance.
 */

/**
 * Safely retrieves an attribute value from the attributes array.
 *
 * @param array $attributes The array of attributes.
 * @param string $name The name of the attribute to retrieve.
 * @return mixed The value of the attribute or an empty string if not set.
 */
if (!function_exists('pb_carousel_new_get_attribute')) {
	function pb_carousel_new_get_attribute($attributes, $name) {
		return isset($attributes[$name]) ? $attributes[$name] : '';
	}
}

/**
 * Converts a camelCase string to kebab-case.
 *
 * @param string $string The camelCase string to convert.
 * @return string The converted kebab-case string.
 */
if (!function_exists('pb_carousel_new_camel_to_kebab')) {
	function pb_carousel_new_camel_to_kebab($string) {
		return strtolower(preg_replace('/([a-z])([A-Z])/', '$1-$2', $string));
	}
}

/**
 * Sanitizes SVG content to prevent XSS vulnerabilities.
 *
 * @param string $svg The SVG content to sanitize.
 * @return string The sanitized SVG.
 */
if (!function_exists('pb_carousel_new_sanitize_svg')) {
	function pb_carousel_new_sanitize_svg($svg) {
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

		// Only allow specific tags
		if (class_exists('\\DOMDocument')) {
			$dom = new \DOMDocument();
			@$dom->loadXML($svg, LIBXML_NOERROR | LIBXML_NOWARNING);

			$allowed_tags = ['svg', 'g', 'path', 'circle', 'ellipse', 'line', 'polygon', 'polyline', 'rect', 'title', 'desc', 'defs', 'use'];
			$allowed_attrs = ['viewBox', 'xmlns', 'xmlns:xlink', 'preserveAspectRatio', 'width', 'height', 'x', 'y', 'd', 'cx', 'cy', 'r', 'rx', 'ry', 'x1', 'x2', 'y1', 'y2', 'points', 'fill', 'stroke', 'stroke-width', 'stroke-linecap', 'stroke-linejoin', 'transform', 'id', 'class'];

			$clean_node = function($node) use (&$clean_node, $allowed_tags, $allowed_attrs) {
				if ($node->nodeType === XML_ELEMENT_NODE) {
					if (!in_array(strtolower($node->nodeName), $allowed_tags)) {
						$node->parentNode->removeChild($node);
						return;
					}

					for ($i = $node->attributes->length - 1; $i >= 0; $i--) {
						$attr = $node->attributes->item($i);
						if (!in_array(strtolower($attr->name), $allowed_attrs)) {
							$node->removeAttribute($attr->name);
						}
					}
				}

				if ($node->hasChildNodes()) {
					$children = [];
					foreach ($node->childNodes as $child) {
						$children[] = $child;
					}
					foreach ($children as $child) {
						$clean_node($child);
					}
				}
			};

			if ($dom->documentElement) {
				$clean_node($dom->documentElement);
				$svg = $dom->saveXML($dom->documentElement);
			}
		}

		return $svg;
	}
}

// Create unique ID for this carousel instance
$carousel_id = 'carousel-new-' . $attributes['blockId'];
if (!empty($attributes['anchor'])) {
	$carousel_id = 'carousel-new-' . $attributes['anchor'];
}

// Create unique pagination ID for this carousel instance
$pagination_id = 'swiper-pagination-' . $attributes['blockId'];

// Build responsive breakpoints configuration
$breakpoints = [
	0 => [
		'slidesPerView' => (int) pb_carousel_new_get_attribute($attributes, 'slidesPerViewMobile'),
		'spaceBetween' => (int) pb_carousel_new_get_attribute($attributes, 'spaceBetweenMobile'),
	],
	768 => [
		'slidesPerView' => (int) pb_carousel_new_get_attribute($attributes, 'slidesPerViewTablet'),
		'spaceBetween' => (int) pb_carousel_new_get_attribute($attributes, 'spaceBetweenTablet'),
	],
	1024 => [
		'slidesPerView' => (int) pb_carousel_new_get_attribute($attributes, 'slidesPerViewDesktop'),
		'spaceBetween' => (int) pb_carousel_new_get_attribute($attributes, 'spaceBetweenDesktop'),
	],
];

$breakpoints_json = json_encode($breakpoints);

// Build Swiper configuration attributes
$swiper_attrs = [];

// Basic settings
$swiper_attrs['direction'] = pb_carousel_new_get_attribute($attributes, 'direction');
$swiper_attrs['speed'] = (int) pb_carousel_new_get_attribute($attributes, 'speed');

// Boolean settings (excluding navigation and pagination - we use custom controls)
$boolean_attrs = [
	'centeredSlides',
	'autoHeight',
	'freeMode',
	'scrollbar',
	'loop',
	'allowTouchMove',
	'grabCursor',
	'keyboard',
	'mousewheel',
];

foreach ($boolean_attrs as $attr) {
	$value = pb_carousel_new_get_attribute($attributes, $attr);
	if ($value !== '') {
		$kebab_attr = pb_carousel_new_camel_to_kebab($attr);
		$swiper_attrs[$kebab_attr] = $value ? 'true' : 'false';
	}
}

// Always disable built-in navigation - we use custom controls
$swiper_attrs['navigation'] = 'false';

// Count actual slides in the content
$slide_count = 0;
if (!empty($content)) {
	// Count swiper-slide elements in the content
	$slide_count = substr_count($content, '<swiper-slide');
}

// Configure pagination
if (pb_carousel_new_get_attribute($attributes, 'pagination')) {
	$swiper_attrs['pagination'] = 'true';
	$pagination_type = pb_carousel_new_get_attribute($attributes, 'paginationType');
	if ($pagination_type) {
		$swiper_attrs['pagination-type'] = $pagination_type;
	}
	// Tell Swiper which element to use for pagination - use unique ID for this carousel instance
	$swiper_attrs['pagination-el'] = '#' . $pagination_id;
	$swiper_attrs['pagination-clickable'] = 'true';
	// Pass dynamic bullets setting to help with pagination
	$swiper_attrs['pagination-dynamic-bullets'] = 'false';
} else {
	$swiper_attrs['pagination'] = 'false';
}

// Effect
$effect = pb_carousel_new_get_attribute($attributes, 'effect');
if ($effect && $effect !== 'slide') {
	$swiper_attrs['effect'] = $effect;

	// Effect-specific settings
	if ($effect === 'fade') {
		$swiper_attrs['fade-effect-cross-fade'] = 'true';
	}
}

// Autoplay settings
if (pb_carousel_new_get_attribute($attributes, 'autoplay')) {
	$swiper_attrs['autoplay'] = 'true';
	$swiper_attrs['autoplay-delay'] = (int) pb_carousel_new_get_attribute($attributes, 'autoplayDelay');

	if (pb_carousel_new_get_attribute($attributes, 'pauseOnHover')) {
		$swiper_attrs['autoplay-pause-on-mouse-enter'] = 'true';
	}

	if (pb_carousel_new_get_attribute($attributes, 'pauseOnInteraction')) {
		$swiper_attrs['autoplay-disable-on-interaction'] = 'true';
	}

	if (pb_carousel_new_get_attribute($attributes, 'autoplayReverseDirection')) {
		$swiper_attrs['autoplay-reverse-direction'] = 'true';
	}

	if (pb_carousel_new_get_attribute($attributes, 'stopOnLastSlide')) {
		$swiper_attrs['autoplay-stop-on-last-slide'] = 'true';
	}
}

// Resistance ratio
$resistance = pb_carousel_new_get_attribute($attributes, 'resistanceRatio');
if ($resistance !== '') {
	$swiper_attrs['resistance-ratio'] = floatval($resistance);
}

// Convert attributes to HTML data attributes
$swiper_html_attrs = '';
foreach ($swiper_attrs as $key => $value) {
	$swiper_html_attrs .= sprintf(' %s="%s"', esc_attr($key), esc_attr($value));
}

// Add breakpoints
$swiper_html_attrs .= sprintf(' breakpoints=\'%s\'', esc_attr($breakpoints_json));

// Get content alignment
$content_align = pb_carousel_new_get_attribute($attributes, 'contentAlign');

// Set default if empty
if (empty($content_align)) {
	$content_align = 'center';
}

// Build wrapper classes
$wrapper_classes = [
	'wp-block-prolific-carousel-new',
	'has-content-align-' . $content_align,
];

// Get virtual active index setting
$virtual_active_index = pb_carousel_new_get_attribute($attributes, 'virtualActiveIndex');
// Default to true if not set (backward compatibility)
if ($virtual_active_index === '') {
	$virtual_active_index = true;
}

// Get wrapper attributes
$wrapper_attributes = get_block_wrapper_attributes([
	'class' => implode(' ', $wrapper_classes),
	'id' => $carousel_id,
	'data-slide-count' => $slide_count,
	'data-virtual-active-index' => $virtual_active_index ? 'true' : 'false',
]);

// Check for custom navigation
$has_custom_nav = pb_carousel_new_get_attribute($attributes, 'customNavigation');
$custom_nav_prev = pb_carousel_new_get_attribute($attributes, 'customNavPrevSvg');
$custom_nav_next = pb_carousel_new_get_attribute($attributes, 'customNavNextSvg');

// Check for autoplay pause button
$has_autoplay = pb_carousel_new_get_attribute($attributes, 'autoplay');
$show_pause_button = pb_carousel_new_get_attribute($attributes, 'pauseButton');

// Get positioning attributes
$navigation_position = pb_carousel_new_get_attribute($attributes, 'navigationPosition') ?: 'center';
$pagination_position = pb_carousel_new_get_attribute($attributes, 'paginationPosition') ?: 'bottom';
$group_controls = pb_carousel_new_get_attribute($attributes, 'groupControls');
$grouped_position = pb_carousel_new_get_attribute($attributes, 'groupedPosition') ?: 'bottom';
$grouped_layout = pb_carousel_new_get_attribute($attributes, 'groupedLayout') ?: 'split';

// Check if navigation and pagination are enabled
$has_navigation = pb_carousel_new_get_attribute($attributes, 'navigation');
$has_pagination = pb_carousel_new_get_attribute($attributes, 'pagination');
?>

<section <?php echo $wrapper_attributes; ?>>
	<div class="carousel-new-swiper-wrapper">
		<swiper-container
			<?php echo $swiper_html_attrs; ?>
			role="region"
			aria-label="<?php esc_attr_e('Carousel', 'prolific-blocks'); ?>"
			class="carousel-new-swiper-container"
		>
			<?php echo $content; ?>
		</swiper-container>

		<?php if (!$group_controls && $has_navigation) : ?>
			<div class="carousel-new-nav-wrapper nav-position-<?php echo esc_attr($navigation_position); ?>">
				<div class="carousel-new-nav-buttons">
					<button
						class="carousel-new-nav-prev"
						aria-label="<?php esc_attr_e('Previous slide', 'prolific-blocks'); ?>"
						role="button"
					>
						<?php if ($has_custom_nav && $custom_nav_prev) : ?>
							<span class="carousel-new-nav-icon">
								<?php echo pb_carousel_new_sanitize_svg($custom_nav_prev); ?>
							</span>
						<?php else : ?>
							<span class="carousel-new-nav-icon" aria-hidden="true">‹</span>
						<?php endif; ?>
						<span class="screen-reader-text"><?php esc_html_e('Previous', 'prolific-blocks'); ?></span>
					</button>

					<button
						class="carousel-new-nav-next"
						aria-label="<?php esc_attr_e('Next slide', 'prolific-blocks'); ?>"
						role="button"
					>
						<?php if ($has_custom_nav && $custom_nav_next) : ?>
							<span class="carousel-new-nav-icon">
								<?php echo pb_carousel_new_sanitize_svg($custom_nav_next); ?>
							</span>
						<?php else : ?>
							<span class="carousel-new-nav-icon" aria-hidden="true">›</span>
						<?php endif; ?>
						<span class="screen-reader-text"><?php esc_html_e('Next', 'prolific-blocks'); ?></span>
					</button>
				</div>
			</div>
		<?php endif; ?>

		<?php if (!$group_controls && $has_pagination) : ?>
			<div id="<?php echo esc_attr($pagination_id); ?>" class="swiper-pagination pagination-position-<?php echo esc_attr($pagination_position); ?>"></div>
		<?php endif; ?>

		<?php if ($group_controls && ($has_navigation || $has_pagination)) : ?>
			<div class="carousel-new-controls-group grouped grouped-position-<?php echo esc_attr($grouped_position); ?> grouped-layout-<?php echo esc_attr($grouped_layout); ?>">
				<?php if ($grouped_layout === 'split') : ?>
					<?php // Split layout: individual buttons for proper ordering ?>
					<?php if ($has_navigation) : ?>
						<button
							class="carousel-new-nav-prev"
							aria-label="<?php esc_attr_e('Previous slide', 'prolific-blocks'); ?>"
							role="button"
						>
							<?php if ($has_custom_nav && $custom_nav_prev) : ?>
								<span class="carousel-new-nav-icon">
									<?php echo pb_carousel_new_sanitize_svg($custom_nav_prev); ?>
								</span>
							<?php else : ?>
								<span class="carousel-new-nav-icon" aria-hidden="true">‹</span>
							<?php endif; ?>
							<span class="screen-reader-text"><?php esc_html_e('Previous', 'prolific-blocks'); ?></span>
						</button>
					<?php endif; ?>

					<?php if ($has_pagination) : ?>
						<div id="<?php echo esc_attr($pagination_id); ?>" class="swiper-pagination grouped"></div>
					<?php endif; ?>

					<?php if ($has_navigation) : ?>
						<button
							class="carousel-new-nav-next"
							aria-label="<?php esc_attr_e('Next slide', 'prolific-blocks'); ?>"
							role="button"
						>
							<?php if ($has_custom_nav && $custom_nav_next) : ?>
								<span class="carousel-new-nav-icon">
									<?php echo pb_carousel_new_sanitize_svg($custom_nav_next); ?>
								</span>
							<?php else : ?>
								<span class="carousel-new-nav-icon" aria-hidden="true">›</span>
							<?php endif; ?>
							<span class="screen-reader-text"><?php esc_html_e('Next', 'prolific-blocks'); ?></span>
						</button>
					<?php endif; ?>
				<?php else : ?>
					<?php // Left/Right layouts: buttons grouped in wrapper ?>
					<?php if ($has_navigation) : ?>
						<div class="carousel-new-nav-buttons">
							<button
								class="carousel-new-nav-prev"
								aria-label="<?php esc_attr_e('Previous slide', 'prolific-blocks'); ?>"
								role="button"
							>
								<?php if ($has_custom_nav && $custom_nav_prev) : ?>
									<span class="carousel-new-nav-icon">
										<?php echo pb_carousel_new_sanitize_svg($custom_nav_prev); ?>
									</span>
								<?php else : ?>
									<span class="carousel-new-nav-icon" aria-hidden="true">‹</span>
								<?php endif; ?>
								<span class="screen-reader-text"><?php esc_html_e('Previous', 'prolific-blocks'); ?></span>
							</button>

							<button
								class="carousel-new-nav-next"
								aria-label="<?php esc_attr_e('Next slide', 'prolific-blocks'); ?>"
								role="button"
							>
								<?php if ($has_custom_nav && $custom_nav_next) : ?>
									<span class="carousel-new-nav-icon">
										<?php echo pb_carousel_new_sanitize_svg($custom_nav_next); ?>
									</span>
								<?php else : ?>
									<span class="carousel-new-nav-icon" aria-hidden="true">›</span>
								<?php endif; ?>
								<span class="screen-reader-text"><?php esc_html_e('Next', 'prolific-blocks'); ?></span>
							</button>
						</div>
					<?php endif; ?>

					<?php if ($has_pagination) : ?>
						<div id="<?php echo esc_attr($pagination_id); ?>" class="swiper-pagination grouped"></div>
					<?php endif; ?>
				<?php endif; ?>
			</div>
		<?php endif; ?>
	</div>

	<?php if ($has_autoplay && $show_pause_button) : ?>
		<button
			class="carousel-new-pause-button"
			aria-label="<?php esc_attr_e('Pause carousel', 'prolific-blocks'); ?>"
			aria-pressed="false"
			role="button"
		>
			<span aria-hidden="true">⏸</span>
			<span class="screen-reader-text"><?php esc_html_e('Pause', 'prolific-blocks'); ?></span>
		</button>
	<?php endif; ?>
</section>
