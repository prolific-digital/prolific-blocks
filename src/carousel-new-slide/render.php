<?php
/**
 * Render template for Carousel New Slide block.
 *
 * @package Prolific_Blocks
 * @var array $attributes Block attributes.
 * @var string $content Block inner content.
 * @var WP_Block $block Block instance.
 */

// Get block wrapper attributes.
$wrapper_attributes = get_block_wrapper_attributes([
	'class' => 'swiper-slide',
]);
?>

<swiper-slide <?php echo $wrapper_attributes; ?>>
	<div class="carousel-new-slide-inner">
		<?php echo $content; ?>
	</div>
</swiper-slide>
