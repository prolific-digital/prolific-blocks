<?php
/**
 * Charts Block - Server-side render
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
 * Safely get attribute value with default
 */
if (!function_exists('prolific_charts_get_attribute')) {
	function prolific_charts_get_attribute($attributes, $key, $default = '') {
		return isset($attributes[$key]) ? $attributes[$key] : $default;
	}
}

// Extract attributes
$block_id = prolific_charts_get_attribute($attributes, 'blockId', '');
$chart_type = prolific_charts_get_attribute($attributes, 'chartType', 'bar');
$orientation = prolific_charts_get_attribute($attributes, 'orientation', 'vertical');
$chart_data = prolific_charts_get_attribute($attributes, 'chartData', []);
$chart_width = prolific_charts_get_attribute($attributes, 'chartWidth', '100%');
$chart_height = prolific_charts_get_attribute($attributes, 'chartHeight', 400);
$margin_top = prolific_charts_get_attribute($attributes, 'marginTop', 20);
$margin_right = prolific_charts_get_attribute($attributes, 'marginRight', 20);
$margin_bottom = prolific_charts_get_attribute($attributes, 'marginBottom', 50);
$margin_left = prolific_charts_get_attribute($attributes, 'marginLeft', 60);
$responsive = prolific_charts_get_attribute($attributes, 'responsive', true);
$color_scheme = prolific_charts_get_attribute($attributes, 'colorScheme', 'blue');
$custom_colors = prolific_charts_get_attribute($attributes, 'customColors', []);
$show_data_labels = prolific_charts_get_attribute($attributes, 'showDataLabels', false);
$show_legend = prolific_charts_get_attribute($attributes, 'showLegend', true);
$legend_position = prolific_charts_get_attribute($attributes, 'legendPosition', 'top');
$font_size = prolific_charts_get_attribute($attributes, 'fontSize', 12);
$show_x_axis = prolific_charts_get_attribute($attributes, 'showXAxis', true);
$show_y_axis = prolific_charts_get_attribute($attributes, 'showYAxis', true);
$x_axis_label = prolific_charts_get_attribute($attributes, 'xAxisLabel', '');
$y_axis_label = prolific_charts_get_attribute($attributes, 'yAxisLabel', '');
$show_grid_lines = prolific_charts_get_attribute($attributes, 'showGridLines', true);
$enable_animations = prolific_charts_get_attribute($attributes, 'enableAnimations', true);
$animation_duration = prolific_charts_get_attribute($attributes, 'animationDuration', 800);
$easing_function = prolific_charts_get_attribute($attributes, 'easingFunction', 'easeQuadInOut');
$show_tooltips = prolific_charts_get_attribute($attributes, 'showTooltips', true);
$chart_title = prolific_charts_get_attribute($attributes, 'chartTitle', '');
$chart_description = prolific_charts_get_attribute($attributes, 'chartDescription', '');

// Get block wrapper attributes
$wrapper_attributes = get_block_wrapper_attributes([
	'class' => 'prolific-chart-block',
	'data-chart-type' => esc_attr($chart_type),
	'data-orientation' => esc_attr($orientation),
	'data-chart-data' => esc_attr(wp_json_encode($chart_data)),
	'data-chart-width' => esc_attr($chart_width),
	'data-chart-height' => esc_attr($chart_height),
	'data-margin-top' => esc_attr($margin_top),
	'data-margin-right' => esc_attr($margin_right),
	'data-margin-bottom' => esc_attr($margin_bottom),
	'data-margin-left' => esc_attr($margin_left),
	'data-responsive' => $responsive ? 'true' : 'false',
	'data-color-scheme' => esc_attr($color_scheme),
	'data-custom-colors' => esc_attr(wp_json_encode($custom_colors)),
	'data-show-data-labels' => $show_data_labels ? 'true' : 'false',
	'data-show-legend' => $show_legend ? 'true' : 'false',
	'data-legend-position' => esc_attr($legend_position),
	'data-font-size' => esc_attr($font_size),
	'data-show-x-axis' => $show_x_axis ? 'true' : 'false',
	'data-show-y-axis' => $show_y_axis ? 'true' : 'false',
	'data-x-axis-label' => esc_attr($x_axis_label),
	'data-y-axis-label' => esc_attr($y_axis_label),
	'data-show-grid-lines' => $show_grid_lines ? 'true' : 'false',
	'data-enable-animations' => $enable_animations ? 'true' : 'false',
	'data-animation-duration' => esc_attr($animation_duration),
	'data-easing-function' => esc_attr($easing_function),
	'data-show-tooltips' => $show_tooltips ? 'true' : 'false'
]);

?>

<div <?php echo $wrapper_attributes; ?>>
	<?php if (!empty($chart_title)) : ?>
		<h3 class="chart-title"><?php echo esc_html($chart_title); ?></h3>
	<?php endif; ?>

	<?php if (!empty($chart_description)) : ?>
		<p class="chart-description"><?php echo esc_html($chart_description); ?></p>
	<?php endif; ?>

	<div class="chart-container" role="img" aria-label="<?php echo esc_attr($chart_title ? $chart_title : __('Data visualization chart', 'prolific-blocks')); ?>">
		<?php if (empty($chart_data)) : ?>
			<div class="chart-placeholder">
				<?php echo esc_html__('No data available. Please add data in the block settings.', 'prolific-blocks'); ?>
			</div>
		<?php else : ?>
			<!-- Chart will be rendered here by view.js -->
			<div class="chart-loading">
				<?php echo esc_html__('Loading chart...', 'prolific-blocks'); ?>
			</div>
		<?php endif; ?>
	</div>
</div>
