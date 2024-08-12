<?php

// Create id attribute allowing for custom "anchor" value.
$id = 'prolific-carousel-' . $attributes['blockId'];
if (!empty($attributes['anchor'])) {
  $id = 'prolific-carousel-' . $attributes['anchor'];
}

// Assuming these are your boolean values stored in variables
$loop = $attributes['loop']; // This might return 1 or 0
$autoplay = $attributes['autoplay']; // This might return 1 or 0

// Convert 1 to 'true' and 0 to 'false'
$loop = $loop ? 'true' : 'false';
$autoplay = $autoplay ? 'true' : 'false';

?>

<div id="<?php echo esc_attr($id); ?>" <?php echo get_block_wrapper_attributes(); ?>>
  <canvas
    data-lottie-loop="<?php echo $loop; ?>"
    data-lottie-autoplay="<?php echo $autoplay; ?>"
    data-lottie-src="<?php echo $attributes['lottieFile']; ?>"
    data-lottie-speed="<?php echo $attributes['speed']; ?>"></canvas>
</div>