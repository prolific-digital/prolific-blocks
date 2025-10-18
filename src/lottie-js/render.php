<?php
/**
 * Render callback for Lottie block.
 *
 * @param array    $attributes Block attributes.
 * @param string   $content    Block content.
 * @param WP_Block $block      Block instance.
 * @return string Rendered block HTML.
 */

// Create id attribute allowing for custom "anchor" value.
$id = 'prolific-lottie-' . $attributes['blockId'];
if (!empty($attributes['anchor'])) {
  $id = 'prolific-lottie-' . $attributes['anchor'];
}

// Get attributes with defaults
$lottie_file = isset($attributes['lottieFile']) ? $attributes['lottieFile'] : '';
$loop = isset($attributes['loop']) ? $attributes['loop'] : false;
$autoplay = isset($attributes['autoplay']) ? $attributes['autoplay'] : false;
$speed = isset($attributes['speed']) ? $attributes['speed'] : 1;
$direction = isset($attributes['direction']) ? $attributes['direction'] : 1;
$mode = isset($attributes['mode']) ? $attributes['mode'] : 'normal';
$start_on_view = isset($attributes['startOnView']) ? $attributes['startOnView'] : false;
$intermission = isset($attributes['intermission']) ? $attributes['intermission'] : 0;
$width = isset($attributes['width']) ? $attributes['width'] : '400px';
$height = isset($attributes['height']) ? $attributes['height'] : '400px';
$background_color = isset($attributes['backgroundColor']) ? $attributes['backgroundColor'] : '';
$object_fit = isset($attributes['objectFit']) ? $attributes['objectFit'] : 'contain';
$use_frame_interpolation = isset($attributes['useFrameInterpolation']) ? $attributes['useFrameInterpolation'] : true;
$segment = isset($attributes['segment']) ? $attributes['segment'] : array();
$marker = isset($attributes['marker']) ? $attributes['marker'] : '';

// Convert booleans to strings for data attributes
$loop_str = $loop ? 'true' : 'false';
$autoplay_str = $autoplay ? 'true' : 'false';
$start_on_view_str = $start_on_view ? 'true' : 'false';
$use_frame_interpolation_str = $use_frame_interpolation ? 'true' : 'false';

// Container styles
$container_styles = array(
  'width: ' . esc_attr($width),
  'height: ' . esc_attr($height),
  'display: flex',
  'align-items: center',
  'justify-content: center',
  'position: relative',
);

if (!empty($background_color)) {
  $container_styles[] = 'background-color: ' . esc_attr($background_color);
}

$container_style_attr = implode('; ', $container_styles);

// Canvas styles
$canvas_styles = array(
  'width: 100%',
  'height: 100%',
  'object-fit: ' . esc_attr($object_fit),
);

$canvas_style_attr = implode('; ', $canvas_styles);

// Build data attributes for canvas
$data_attrs = array(
  'data-lottie-loop="' . $loop_str . '"',
  'data-lottie-autoplay="' . $autoplay_str . '"',
  'data-lottie-src="' . esc_url($lottie_file) . '"',
  'data-lottie-speed="' . esc_attr($speed) . '"',
  'data-lottie-direction="' . esc_attr($direction) . '"',
  'data-lottie-mode="' . esc_attr($mode) . '"',
  'data-lottie-start-on-view="' . $start_on_view_str . '"',
  'data-lottie-intermission="' . esc_attr($intermission) . '"',
  'data-lottie-use-frame-interpolation="' . $use_frame_interpolation_str . '"',
);

// Add segment if specified
if (!empty($segment) && is_array($segment) && count($segment) === 2) {
  $data_attrs[] = 'data-lottie-segment="' . esc_attr(json_encode($segment)) . '"';
}

// Add marker if specified
if (!empty($marker)) {
  $data_attrs[] = 'data-lottie-marker="' . esc_attr($marker) . '"';
}

$data_attrs_str = implode(' ', $data_attrs);

?>

<div id="<?php echo esc_attr($id); ?>" <?php echo get_block_wrapper_attributes(); ?>>
  <div class="lottie-container" style="<?php echo $container_style_attr; ?>">
    <canvas
      class="lottie-canvas"
      style="<?php echo $canvas_style_attr; ?>"
      <?php echo $data_attrs_str; ?>
    ></canvas>
  </div>
</div>
