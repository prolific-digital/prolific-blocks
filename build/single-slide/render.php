<?php

// Create id attribute allowing for custom "anchor" value.
$id = 'swiper-single-slide' . $attributes['blockId'];
if (!empty($attributes['anchor'])) {
  $id = $attributes['anchor'];
}

// Create class attribute allowing for custom "className" and "align" values.
$classes = 'prolific-block-single';

if (!empty($attributes['className'])) {
  $classes .= ' ' . $attributes['className'];
}
if (!empty($attributes['align'])) {
  $classes .= ' align' . $attributes['align'];
}

?>

<swiper-slide id="<?php echo esc_attr($id); ?>" class="<?php echo esc_attr($classes); ?>">
  <?php echo $content; ?>
</swiper-slide>