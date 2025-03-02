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
  <?php echo $content; ?>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.3/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.3/ScrollTrigger.min.js"></script>
<script>
  gsap.registerPlugin(ScrollTrigger);

  gsap.utils.toArray('.wp-block-prolific-timeline-item').forEach((item) => {
    // Animate the group inside each item
    gsap.from(item.querySelector('.wp-block-group'), {
      scrollTrigger: {
        trigger: item,
        start: 'top 80%',
        end: 'bottom 60%',
        scrub: true,
      },
      opacity: 0,
      y: 50,
      duration: 1,
    });

    // Animate the after pseudo-element background color
    gsap.to(item, {
      scrollTrigger: {
        trigger: item,
        start: 'top 80%',
        end: 'center center',
        scrub: true,
      },
      '--pseudo-after-bg': 'white',
      duration: 1,
      onUpdate: function() {
        item.style.setProperty('--pseudo-after-bg', this.targets()[0].style.getPropertyValue('--pseudo-after-bg'));
      }
    });
  });
</script>