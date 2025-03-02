<?php

// Create id attribute allowing for custom "anchor" value.
$id = 'prolific-tabs-panel-' . $attributes['blockId'];
if (!empty($attributes['anchor'])) {
  $id = 'prolific-tabs-panel-' . $attributes['anchor'];
}

?>

<div id="<?php echo esc_attr($id); ?>" <?php echo get_block_wrapper_attributes(); ?>>
  <div class="tab-panel">
    <?php echo $content; ?>
  </div>
</div>