<?php

// Create id attribute allowing for custom "anchor" value.
$id = !empty($attributes['anchor']) ? $attributes['anchor'] : '';

// Create class attribute allowing for custom "className" and "align" values.
$classes = 'prolific-block-single';

if (!empty($attributes['className'])) {
  $classes .= ' ' . $attributes['className'];
}
if (!empty($attributes['align'])) {
  $classes .= ' align' . $attributes['align'];
}

// Add hamburger class from attributes.
$hamburger_class = !empty($attributes['hamburgerClass']) ? $attributes['hamburgerClass'] : 'hamburger--3dx';
?>

<div id="<?php echo $id; ?>" <?php echo get_block_wrapper_attributes(); ?>>
  <button class="hamburger <?php echo esc_attr($hamburger_class); ?>" type="button" aria-label="Menu" aria-controls="navigation">
    <span class="hamburger-box">
      <span class="hamburger-inner"></span>
    </span>
  </button>
</div>