<?php
/**
 * Countdown Timer Block - Server-side render
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
$target_date = isset($attributes['targetDate']) ? $attributes['targetDate'] : '';
$target_time = isset($attributes['targetTime']) ? $attributes['targetTime'] : '23:59';
$show_days = isset($attributes['showDays']) ? $attributes['showDays'] : true;
$show_hours = isset($attributes['showHours']) ? $attributes['showHours'] : true;
$show_minutes = isset($attributes['showMinutes']) ? $attributes['showMinutes'] : true;
$show_seconds = isset($attributes['showSeconds']) ? $attributes['showSeconds'] : true;
$label_days = isset($attributes['labelDays']) ? $attributes['labelDays'] : __('Days', 'prolific-blocks');
$label_day = isset($attributes['labelDay']) ? $attributes['labelDay'] : __('Day', 'prolific-blocks');
$label_hours = isset($attributes['labelHours']) ? $attributes['labelHours'] : __('Hours', 'prolific-blocks');
$label_hour = isset($attributes['labelHour']) ? $attributes['labelHour'] : __('Hour', 'prolific-blocks');
$label_minutes = isset($attributes['labelMinutes']) ? $attributes['labelMinutes'] : __('Minutes', 'prolific-blocks');
$label_minute = isset($attributes['labelMinute']) ? $attributes['labelMinute'] : __('Minute', 'prolific-blocks');
$label_seconds = isset($attributes['labelSeconds']) ? $attributes['labelSeconds'] : __('Seconds', 'prolific-blocks');
$label_second = isset($attributes['labelSecond']) ? $attributes['labelSecond'] : __('Second', 'prolific-blocks');
$expired_message = isset($attributes['expiredMessage']) ? $attributes['expiredMessage'] : __('This offer has expired', 'prolific-blocks');
$auto_hide = isset($attributes['autoHide']) ? $attributes['autoHide'] : false;
$leading_zeros = isset($attributes['leadingZeros']) ? $attributes['leadingZeros'] : true;
$separator = isset($attributes['separator']) ? $attributes['separator'] : 'colon';
$size = isset($attributes['size']) ? $attributes['size'] : 'medium';
$evergreen_mode = isset($attributes['evergreenMode']) ? $attributes['evergreenMode'] : false;
$evergreen_hours = isset($attributes['evergreenHours']) ? $attributes['evergreenHours'] : 24;

// Get block wrapper attributes
$wrapper_attributes = get_block_wrapper_attributes([
	'class' => 'countdown-size-' . esc_attr($size),
	'data-target-date' => esc_attr($target_date),
	'data-target-time' => esc_attr($target_time),
	'data-show-days' => $show_days ? 'true' : 'false',
	'data-show-hours' => $show_hours ? 'true' : 'false',
	'data-show-minutes' => $show_minutes ? 'true' : 'false',
	'data-show-seconds' => $show_seconds ? 'true' : 'false',
	'data-label-days' => esc_attr($label_days),
	'data-label-day' => esc_attr($label_day),
	'data-label-hours' => esc_attr($label_hours),
	'data-label-hour' => esc_attr($label_hour),
	'data-label-minutes' => esc_attr($label_minutes),
	'data-label-minute' => esc_attr($label_minute),
	'data-label-seconds' => esc_attr($label_seconds),
	'data-label-second' => esc_attr($label_second),
	'data-expired-message' => esc_attr($expired_message),
	'data-auto-hide' => $auto_hide ? 'true' : 'false',
	'data-leading-zeros' => $leading_zeros ? 'true' : 'false',
	'data-separator' => esc_attr($separator),
	'data-evergreen-mode' => $evergreen_mode ? 'true' : 'false',
	'data-evergreen-hours' => esc_attr($evergreen_hours)
]);

// Get separator symbol
$separator_symbols = [
	'colon' => ':',
	'dash' => '-',
	'dot' => '·',
	'slash' => '/',
	'none' => ''
];
$separator_symbol = isset($separator_symbols[$separator]) ? $separator_symbols[$separator] : ':';

?>

<div <?php echo $wrapper_attributes; ?>>
	<div class="countdown-container">
		<?php if ($show_days) : ?>
			<div class="countdown-unit countdown-days">
				<span class="countdown-number" data-unit="days">00</span>
				<?php if ($separator !== 'none' && $show_hours) : ?>
					<span class="countdown-separator"><?php echo esc_html($separator_symbol); ?></span>
				<?php endif; ?>
				<span class="countdown-label" data-singular="<?php echo esc_attr($label_day); ?>" data-plural="<?php echo esc_attr($label_days); ?>">
					<?php echo esc_html($label_days); ?>
				</span>
			</div>
		<?php endif; ?>

		<?php if ($show_hours) : ?>
			<div class="countdown-unit countdown-hours">
				<span class="countdown-number" data-unit="hours">00</span>
				<?php if ($separator !== 'none' && $show_minutes) : ?>
					<span class="countdown-separator"><?php echo esc_html($separator_symbol); ?></span>
				<?php endif; ?>
				<span class="countdown-label" data-singular="<?php echo esc_attr($label_hour); ?>" data-plural="<?php echo esc_attr($label_hours); ?>">
					<?php echo esc_html($label_hours); ?>
				</span>
			</div>
		<?php endif; ?>

		<?php if ($show_minutes) : ?>
			<div class="countdown-unit countdown-minutes">
				<span class="countdown-number" data-unit="minutes">00</span>
				<?php if ($separator !== 'none' && $show_seconds) : ?>
					<span class="countdown-separator"><?php echo esc_html($separator_symbol); ?></span>
				<?php endif; ?>
				<span class="countdown-label" data-singular="<?php echo esc_attr($label_minute); ?>" data-plural="<?php echo esc_attr($label_minutes); ?>">
					<?php echo esc_html($label_minutes); ?>
				</span>
			</div>
		<?php endif; ?>

		<?php if ($show_seconds) : ?>
			<div class="countdown-unit countdown-seconds">
				<span class="countdown-number" data-unit="seconds">00</span>
				<span class="countdown-label" data-singular="<?php echo esc_attr($label_second); ?>" data-plural="<?php echo esc_attr($label_seconds); ?>">
					<?php echo esc_html($label_seconds); ?>
				</span>
			</div>
		<?php endif; ?>
	</div>
	<div class="countdown-expired" style="display: none;">
		<?php echo esc_html($expired_message); ?>
	</div>
</div>
