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

// Get the ariaControls attribute.
$aria_controls = !empty($attributes['ariaControls']) ? $attributes['ariaControls'] : '';

// Get label attributes.
$show_label = !empty($attributes['showLabel']) ? $attributes['showLabel'] : false;
$label_text = !empty($attributes['labelText']) ? $attributes['labelText'] : 'Menu';
$label_text_active = !empty($attributes['labelTextActive']) ? $attributes['labelTextActive'] : 'Close';
?>

<div id="<?php echo $id; ?>" <?php echo get_block_wrapper_attributes(); ?>>
  <button class="hamburger <?php echo esc_attr($hamburger_class); ?>"
    type="button"
    aria-label="<?php echo esc_attr($label_text); ?>"
    <?php if (! empty($aria_controls)) : ?>
    aria-controls="<?php echo esc_attr($aria_controls); ?>"
    <?php endif; ?>
    aria-expanded="false">
    <span class="hamburger-box">
      <span class="hamburger-inner"></span>
    </span>
    <?php if ($show_label) : ?>
      <span class="hamburger-label" aria-hidden="true">
        <span class="hamburger-label-text">
          <?php echo esc_html($label_text); ?>
        </span>
        <span class="hamburger-label-text hamburger-label-text-active is-hidden">
          <?php echo esc_html($label_text_active); ?>
        </span>
      </span>
    <?php endif; ?>
  </button>
</div>