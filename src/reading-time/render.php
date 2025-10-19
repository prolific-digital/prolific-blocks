<?php
/**
 * Reading Time Block - Server-side render
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

/**
 * Calculate reading time from post content
 *
 * @param string $content Post content.
 * @param int $wpm Words per minute.
 * @param bool $include_images Whether to include images.
 * @param int $seconds_per_image Seconds per image.
 * @param string $rounding_method Rounding method.
 * @return int Reading time in minutes.
 */
if (!function_exists('prolific_calculate_reading_time')) {
	function prolific_calculate_reading_time($content, $wpm, $include_images, $seconds_per_image, $rounding_method) {
		if (empty($content)) {
			return 0;
		}

		// Strip HTML tags and shortcodes
		$text = strip_tags($content);
		$text = strip_shortcodes($text);

		// Count words
		$word_count = str_word_count($text);

		// Calculate base reading time
		$time_in_minutes = $word_count / $wpm;

		// Add time for images if enabled
		if ($include_images) {
			preg_match_all('/<img/', $content, $matches);
			$image_count = count($matches[0]);
			$time_in_minutes += ($image_count * $seconds_per_image) / 60;
		}

		// Apply rounding method
		switch ($rounding_method) {
			case 'ceil':
				return ceil($time_in_minutes);
			case 'floor':
				return floor($time_in_minutes);
			case 'round':
			default:
				return round($time_in_minutes);
		}
	}
}

/**
 * Format reading time display
 *
 * @param int $time Reading time in minutes.
 * @param string $format Display format.
 * @param string $custom_format Custom format string.
 * @return string Formatted reading time.
 */
if (!function_exists('prolific_format_reading_time')) {
	function prolific_format_reading_time($time, $format, $custom_format) {
		if ($format === 'custom') {
			return str_replace('{time}', $time, $custom_format);
		}

		$formats = array(
			'X min read' => sprintf('%d min read', $time),
			'X minute read' => sprintf('%d minute read', $time),
			'X minutes' => sprintf('%d %s', $time, $time === 1 ? 'minute' : 'minutes')
		);

		return isset($formats[$format]) ? $formats[$format] : $formats['X min read'];
	}
}

// Get post ID
$post_id = get_the_ID();
if (!$post_id) {
	return '';
}

// Extract attributes
$words_per_minute = isset($attributes['wordsPerMinute']) ? intval($attributes['wordsPerMinute']) : 200;
$display_format = isset($attributes['displayFormat']) ? $attributes['displayFormat'] : 'X min read';
$custom_format = isset($attributes['customFormat']) ? $attributes['customFormat'] : 'Reading time: {time} minutes';
$include_images = isset($attributes['includeImages']) ? $attributes['includeImages'] : false;
$seconds_per_image = isset($attributes['secondsPerImage']) ? intval($attributes['secondsPerImage']) : 12;
$rounding_method = isset($attributes['roundingMethod']) ? $attributes['roundingMethod'] : 'round';
$prefix_text = isset($attributes['prefixText']) ? $attributes['prefixText'] : '';
$suffix_text = isset($attributes['suffixText']) ? $attributes['suffixText'] : '';
$show_icon = isset($attributes['showIcon']) ? $attributes['showIcon'] : true;
$icon_type = isset($attributes['iconType']) ? $attributes['iconType'] : 'book';
$minimum_time = isset($attributes['minimumTime']) ? intval($attributes['minimumTime']) : 0;

// Get post content
$post_content = get_post_field('post_content', $post_id);

// Check for cached reading time
$cache_key = 'reading_time_' . md5($post_content . $words_per_minute . $include_images . $seconds_per_image . $rounding_method);
$reading_time = get_transient($cache_key);

if ($reading_time === false) {
	// Calculate reading time
	$reading_time = prolific_calculate_reading_time(
		$post_content,
		$words_per_minute,
		$include_images,
		$seconds_per_image,
		$rounding_method
	);

	// Cache for 1 hour
	set_transient($cache_key, $reading_time, HOUR_IN_SECONDS);
}

// Check if should display
if ($reading_time < $minimum_time) {
	return '';
}

// Format display text
$display_text = prolific_format_reading_time($reading_time, $display_format, $custom_format);

// Font Awesome icon paths (SVG path data)
$icon_paths = array(
	'book' => 'M96 0C43 0 0 43 0 96V416c0 53 43 96 96 96H384h32c17.7 0 32-14.3 32-32s-14.3-32-32-32V384c17.7 0 32-14.3 32-32V32c0-17.7-14.3-32-32-32H384 96zm0 384H352v64H96c-17.7 0-32-14.3-32-32s14.3-32 32-32zm32-240c0-8.8 7.2-16 16-16H336c8.8 0 16 7.2 16 16s-7.2 16-16 16H144c-8.8 0-16-7.2-16-16zm16 48H336c8.8 0 16 7.2 16 16s-7.2 16-16 16H144c-8.8 0-16-7.2-16-16s7.2-16 16-16z',
	'clock' => 'M256 0a256 256 0 1 1 0 512A256 256 0 1 1 256 0zM232 120V256c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2V120c0-13.3-10.7-24-24-24s-24 10.7-24 24z',
	'visibility' => 'M288 80c-65.2 0-118.8 29.6-159.9 67.7C89.6 183.5 63 226 49.4 256c13.6 30 40.2 72.5 78.6 108.3C169.2 402.4 222.8 432 288 432s118.8-29.6 159.9-67.7C486.4 328.5 513 286 526.6 256c-13.6-30-40.2-72.5-78.6-108.3C406.8 109.6 353.2 80 288 80zM95.4 112.6C142.5 68.8 207.2 32 288 32s145.5 36.8 192.6 80.6c46.8 43.5 78.1 95.4 93 131.1c3.3 7.9 3.3 16.7 0 24.6c-14.9 35.7-46.2 87.7-93 131.1C433.5 443.2 368.8 480 288 480s-145.5-36.8-192.6-80.6C48.6 356 17.3 304 2.5 268.3c-3.3-7.9-3.3-16.7 0-24.6C17.3 208 48.6 156 95.4 112.6zM288 336c44.2 0 80-35.8 80-80s-35.8-80-80-80c-.7 0-1.3 0-2 0c1.3 5.1 2 10.5 2 16c0 35.3-28.7 64-64 64c-5.5 0-10.9-.7-16-2c0 .7 0 1.3 0 2c0 44.2 35.8 80 80 80zm0-208a128 128 0 1 1 0 256 128 128 0 1 1 0-256z'
);

// Get the icon path, default to book if not found
$icon_path = isset($icon_paths[$icon_type]) ? $icon_paths[$icon_type] : $icon_paths['book'];

// Get the correct viewBox for the icon
// Eye icon uses 576x512, others use 512x512
$view_box = ($icon_type === 'visibility') ? '0 0 576 512' : '0 0 512 512';

// Get block wrapper attributes
$wrapper_attributes = get_block_wrapper_attributes();

?>

<div <?php echo $wrapper_attributes; ?>>
	<div class="reading-time-display">
		<?php if ($show_icon) : ?>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="<?php echo esc_attr($view_box); ?>" class="reading-time-icon" aria-hidden="true">
				<path d="<?php echo esc_attr($icon_path); ?>"/>
			</svg>
		<?php endif; ?>
		<span class="reading-time-text">
			<?php if (!empty($prefix_text)) : ?>
				<span class="reading-time-prefix"><?php echo esc_html($prefix_text); ?> </span>
			<?php endif; ?>
			<?php echo esc_html($display_text); ?>
			<?php if (!empty($suffix_text)) : ?>
				<span class="reading-time-suffix"> <?php echo esc_html($suffix_text); ?></span>
			<?php endif; ?>
		</span>
	</div>
</div>
