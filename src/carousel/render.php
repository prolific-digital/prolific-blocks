<?php

/**
 * Safely retrieves an attribute value from the attributes array.
 *
 * This helper function checks if the specified attribute exists in the attributes array
 * and returns its value. If the attribute does not exist, it returns an empty string.
 *
 * @param array $attributes The array of attributes.
 * @param string $name The name of the attribute to retrieve.
 * @return mixed The value of the attribute or an empty string if the attribute is not set.
 */
if (!function_exists('get_attribute')) {
  // Helper function to safely get attribute values
  function get_attribute($attributes, $name) {
    return isset($attributes[$name]) ? $attributes[$name] : '';
  }
}

/**
 * Converts a camelCase string to kebab-case.
 *
 * This helper function takes a camelCase string and converts it to kebab-case by
 * inserting hyphens between lowercase and uppercase letters and converting all characters to lowercase.
 *
 * @param string $string The camelCase string to convert.
 * @return string The converted kebab-case string.
 */
if (!function_exists('camel_to_kebab')) {
  // Helper function to convert camelCase to kebab-case
  function camel_to_kebab($string) {
    return strtolower(preg_replace('/([a-z])([A-Z])/', '$1-$2', $string));
  }
}

// List of attributes to be processed
$attributes_list = [
  'spaceBetween',
  'slidesPerView',
  'navigation',
  'pagination',
  'scrollbar',
  'allowTouchMove',
  'keyboard',
  'grabCursor',
  'autoplay',
  'delay',
  'loop',
  'pauseOnHover',
  'transitionSpeed',
  'a11yEnabled',
  'autoHeight',
  'centeredSlides',
  'direction',
  'freeMode',
  'effect',
];

// Conditionally include 'navigationNextEl' and 'navigationPrevEl' based on 'customNav'
if ($attributes['customNav']) {
  $attributes_list[] = 'navigationNextEl';
  $attributes_list[] = 'navigationPrevEl';
}

// Create id attribute allowing for custom "anchor" value.
$id = 'prolific-carousel-' . $attributes['blockId'];
if (!empty($attributes['anchor'])) {
  $id = 'prolific-carousel-' . $attributes['anchor'];
}

// Before setting swiper attributes
if (get_attribute($attributes, 'enableAutoSlidesPerView')) {
  $attributes['slidesPerView'] = 'auto';
}

/**
 * Constructs a string of Swiper attributes in kebab-case format.
 *
 * This loop iterates over a predefined list of attribute names ($attributes_list), retrieves the corresponding
 * value from the attributes array using the get_attribute helper function, and converts the attribute name
 * from camelCase to kebab-case using the camel_to_kebab helper function. If the attribute value is a boolean,
 * it is converted to a string ('true' or 'false'). Each attribute is then appended to the $swiper_attributes
 * string in the format 'attribute-name="value" '.
 *
 * @param array $attributes_list The list of attribute names to process.
 * @param array $attributes The array of attributes.
 * @return string The constructed string of Swiper attributes in kebab-case format.
 */
$swiper_attributes = '';
foreach ($attributes_list as $attr) {
  $value = get_attribute($attributes, $attr);
  if ($value !== '') {
    if (is_bool($value)) {
      $value = $value ? 'true' : 'false';
    }
    $kebab_case_attr = camel_to_kebab($attr);
    $swiper_attributes .= $kebab_case_attr . '="' . esc_attr($value) . '" ';
  }
}

// Handle special case for autoplay delay
if (get_attribute($attributes, 'autoplay') && $delay = get_attribute($attributes, 'delay')) {
  $swiper_attributes .= 'autoplay-delay="' . esc_attr($delay) . '" ';
}

// Handle special case for effect fade
$effect = get_attribute($attributes, 'effect');
if ($effect && $effect === 'fade') {
  $swiper_attributes .= 'fade-effect-cross-fade="true" ';
}

$slidesPerViewDesktop = get_attribute($attributes, 'enableAutoSlidesPerView') ? '"auto"' : (int) get_attribute($attributes, 'slidesPerView');

// Define the breakpoints as a PHP variable
$breakpoints = 'breakpoints=\'{
    "0": {
        "slidesPerView": ' . (int) get_attribute($attributes, 'slidesPerViewMobile') . ',
        "spaceBetween": ' . (int) get_attribute($attributes, 'spaceBetweenMobile') . '
    },
    "768": {
        "slidesPerView": ' . (int) get_attribute($attributes, 'slidesPerViewTablet') . ',
        "spaceBetween": ' . (int) get_attribute($attributes, 'spaceBetweenTablet') . '
    }, 
    "1024": {
        "slidesPerView": ' . $slidesPerViewDesktop . ',
        "spaceBetween": ' . (int) get_attribute($attributes, 'spaceBetween') . '
    }
}\'';

// Combine swiper attributes and breakpoints into a single settings string
$swiper_settings = $swiper_attributes . $breakpoints;

// Strip the beginning . from the class
$navigationNextClass = ltrim($attributes['navigationNextEl'], '.');
$navigationPrevClass = ltrim($attributes['navigationPrevEl'], '.');
?>


<section id="<?php echo esc_attr($id); ?>" <?php echo get_block_wrapper_attributes(); ?>>
  <swiper-container <?php echo $swiper_settings; ?>>
    <?php echo $content; ?>
  </swiper-container>

  <?php if ($attributes['customNav']) : ?>
    <button class="custom-prev <?php echo esc_attr($navigationPrevClass); ?>">
      <span><?php echo $attributes['customNavPrevSvg']; ?></span>
      <span class="screen-reader-text">Previous</span>
    </button>
    <button class="custom-next <?php echo esc_attr($navigationNextClass); ?>">
      <span><?php echo $attributes['customNavNextSvg']; ?></span>
      <span class="screen-reader-text">Next</span>
    </button>
  <?php endif; ?>

</section>