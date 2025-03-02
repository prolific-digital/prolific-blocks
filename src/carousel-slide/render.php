<?php
// Create id attribute allowing for custom "anchor" value.
$id = 'prolific-carousel-slide-' . $attributes['blockId'];

if (!empty($attributes['anchor'])) {
  $id = 'prolific-carousel-slide-' . $attributes['anchor'];
}

?>

<swiper-slide id="<?php echo esc_attr($id); ?>" <?php echo get_block_wrapper_attributes(['class' => 'prolific-carousel-slide']); ?>>
  <div class="prolific-carousel-slide-inner">
    <?php echo $content; ?>
  </div>
</swiper-slide>