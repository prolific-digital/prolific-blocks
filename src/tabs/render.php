<?php

// Create id attribute allowing for custom "anchor" value.
$id = 'prolific-tabs-' . $attributes['blockId'];
if (!empty($attributes['anchor'])) {
  $id = 'prolific-tabs-' . $attributes['anchor'];
}

?>

<div id="<?php echo esc_attr($id); ?>" <?php echo get_block_wrapper_attributes(); ?>>
  <div class="tabs">
    <?php foreach ($attributes['tabs'] as $index => $tab): ?>
      <button class="tab">
        <?php echo esc_html($tab['label']); ?>
      </button>
    <?php endforeach; ?>
  </div>

  <?php echo $content; ?>
</div>