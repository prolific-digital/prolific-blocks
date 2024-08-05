<?php

// Extract attributes
$images = isset($attributes['images']) ? $attributes['images'] : array();
$spaceBetween = isset($attributes['spaceBetween']) ? $attributes['spaceBetween'] : 10;
$slidesPerView = isset($attributes['slidesPerView']) ? $attributes['slidesPerView'] : 1;
$spaceBetweenTablet = isset($attributes['spaceBetweenTablet']) ? $attributes['spaceBetweenTablet'] : 10;
$slidesPerViewTablet = isset($attributes['slidesPerViewTablet']) ? $attributes['slidesPerViewTablet'] : 1;
$spaceBetweenMobile = isset($attributes['spaceBetweenMobile']) ? $attributes['spaceBetweenMobile'] : 10;
$slidesPerViewMobile = isset($attributes['slidesPerViewMobile']) ? $attributes['slidesPerViewMobile'] : 1;
$navigation = isset($attributes['navigation']) ? $attributes['navigation'] : false;
$pagination = isset($attributes['pagination']) ? $attributes['pagination'] : false;
$scrollbar = isset($attributes['scrollbar']) ? $attributes['scrollbar'] : false;
$allowTouchMove = isset($attributes['allowTouchMove']) ? $attributes['allowTouchMove'] : false;
$keyboard = isset($attributes['keyboard']) ? $attributes['keyboard'] : false;
$grabCursor = isset($attributes['grabCursor']) ? $attributes['grabCursor'] : false;
$autoplay = isset($attributes['autoplay']) ? $attributes['autoplay'] : false;
$delay = isset($attributes['delay']) ? $attributes['delay'] : 3000;
$loop = isset($attributes['loop']) ? $attributes['loop'] : false;
$pauseOnHover = isset($attributes['pauseOnHover']) ? $attributes['pauseOnHover'] : false;
$transitionSpeed = isset($attributes['transitionSpeed']) ? $attributes['transitionSpeed'] : 300;
$a11yEnabled = isset($attributes['a11yEnabled']) ? $attributes['a11yEnabled'] : false;
$thumbs = isset($attributes['thumbs']) ? $attributes['thumbs'] : false;
$autoHeight = isset($attributes['autoHeight']) ? $attributes['autoHeight'] : false;
$centeredSlides = isset($attributes['centeredSlides']) ? $attributes['centeredSlides'] : false;
$direction = isset($attributes['direction']) ? $attributes['direction'] : 'horizontal';
$freeMode = isset($attributes['freeMode']) ? $attributes['freeMode'] : false;

// Create id attribute allowing for custom "anchor" value.
$id = 'swiper-' . $attributes['blockId'];
if (!empty($attributes['anchor'])) {
  $id = $attributes['anchor'];
}

// Create class attribute allowing for custom "className" and "align" values.
$classes = 'prolific-block-carousel';

if (!empty($attributes['className'])) {
  $classes .= ' ' . $attributes['className'];
}
if (!empty($attributes['align'])) {
  $classes .= ' align' . $attributes['align'];
}

?>

<section id="<?php echo esc_attr($id); ?>" class="<?php echo esc_attr($classes); ?>">
  <div class="main-swiper-container" data-swiper='{
  "spaceBetween": <?php echo $spaceBetween; ?>,
  "slidesPerView": <?php echo $slidesPerView; ?>,
  "spaceBetweenTablet": <?php echo $spaceBetweenTablet; ?>,
  "slidesPerViewTablet": <?php echo $slidesPerViewTablet; ?>,
  "spaceBetweenMobile": <?php echo $spaceBetweenMobile; ?>,
  "slidesPerViewMobile": <?php echo $slidesPerViewMobile; ?>,
  "navigation": <?php echo $navigation ? 'true' : 'false'; ?>,
  "pagination": <?php echo $pagination ? 'true' : 'false'; ?>,
  "scrollbar": <?php echo $scrollbar ? 'true' : 'false'; ?>,
  "allowTouchMove": <?php echo $allowTouchMove ? 'true' : 'false'; ?>,
  "keyboard": <?php echo $keyboard ? 'true' : 'false'; ?>,
  "grabCursor": <?php echo $grabCursor ? 'true' : 'false'; ?>,
  "autoplay": <?php echo $autoplay ? 'true' : 'false'; ?>,
  "delay": <?php echo $delay; ?>,
  "loop": <?php echo $loop ? 'true' : 'false'; ?>,
  "pauseOnHover": <?php echo $pauseOnHover ? 'true' : 'false'; ?>,
  "transitionSpeed": <?php echo $transitionSpeed; ?>,
  "a11yEnabled": <?php echo $a11yEnabled ? 'true' : 'false'; ?>,
  "autoHeight": <?php echo $autoHeight ? 'true' : 'false'; ?>,
  "centeredSlides": <?php echo $centeredSlides ? 'true' : 'false'; ?>,
  "direction": "<?php echo $direction; ?>",
  "freeMode": <?php echo $freeMode ? 'true' : 'false'; ?>,
  "thumbs": <?php echo $thumbs ? 'true' : 'false'; ?>
}'>
    <div class="swiper-wrapper">
      <?php foreach ($images as $image) : ?>
        <div class="swiper-slide">
          <?php echo wp_get_attachment_image($image['id'], 'full'); ?>
        </div>
      <?php endforeach; ?>
    </div>

    <?php if ($navigation) : ?>
      <div class="swiper-button-next"></div>
      <div class="swiper-button-prev"></div>
    <?php endif; ?>

    <?php if ($pagination) : ?>
      <div class="swiper-pagination"></div>
    <?php endif; ?>

    <?php if ($scrollbar) : ?>
      <div class="swiper-scrollbar"></div>
    <?php endif; ?>
  </div>

  <?php if ($thumbs) : ?>
    <div class="swiper-container thumbs-swiper">
      <div class="swiper-wrapper">
        <?php foreach ($images as $image) : ?>
          <div class="swiper-slide">
            <?php echo wp_get_attachment_image($image['id'], 'full'); ?>
          </div>
        <?php endforeach; ?>
      </div>
    </div>
  <?php endif; ?>
</section>