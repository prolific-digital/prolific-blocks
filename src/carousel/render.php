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
if (!function_exists('pb_carousel_get_attribute')) {
  function pb_carousel_get_attribute($attributes, $name) {
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
if (!function_exists('pb_carousel_camel_to_kebab')) {
  function pb_carousel_camel_to_kebab($string) {
    return strtolower(preg_replace('/([a-z])([A-Z])/', '$1-$2', $string));
  }
}

/**
 * Sanitizes SVG content to prevent XSS vulnerabilities.
 *
 * Removes potentially malicious content from SVG files including:
 * - JavaScript events (on*)
 * - <script> tags
 * - javascript: URLs
 * - data: URLs
 * 
 * @param string $svg The SVG content to sanitize
 * @return string The sanitized SVG
 */
if (!function_exists('pb_carousel_sanitize_svg')) {
  function pb_carousel_sanitize_svg($svg) {
  // Skip if empty
  if (empty($svg)) {
    return '';
  }
  
  // Remove PHP tags
  $svg = preg_replace('/<\?(=|php)(.+?)\?>/si', '', $svg);
  
  // Remove script tags
  $svg = preg_replace('/<script\b[^>]*>(.*?)<\/script>/is', '', $svg);
  
  // Remove JavaScript event attributes (on*)
  $svg = preg_replace('/on\w+\s*=\s*(["\'])?[^"\']*\1/i', '', $svg);
  
  // Remove potentially dangerous attributes
  $svg = preg_replace('/(xlink:href|href)\s*=\s*(["\'])\s*(javascript|data):/i', '$1=$2#$3:', $svg);
  
  // Only allow specific tags
  if (class_exists('\\DOMDocument')) {
    $dom = new \DOMDocument();
    $dom->loadXML($svg, LIBXML_NOERROR | LIBXML_NOWARNING);
    
    // Define allowed tags and attributes
    $allowed_tags = ['svg', 'g', 'path', 'circle', 'ellipse', 'line', 'polygon', 'polyline', 'rect', 'title', 'desc'];
    $allowed_attrs = ['viewBox', 'xmlns', 'xmlns:xlink', 'preserveAspectRatio', 'width', 'height', 'x', 'y', 'd', 'cx', 'cy', 'r', 'rx', 'ry', 'x1', 'x2', 'y1', 'y2', 'points', 'fill', 'stroke', 'stroke-width'];
    
    // Helper function to recursively clean nodes
    $clean_node = function($node) use (&$clean_node, $allowed_tags, $allowed_attrs) {
      if ($node->nodeType === XML_ELEMENT_NODE) {
        // Remove node if not in allowed tags
        if (!in_array(strtolower($node->nodeName), $allowed_tags)) {
          $node->parentNode->removeChild($node);
          return;
        }
        
        // Remove disallowed attributes
        for ($i = $node->attributes->length - 1; $i >= 0; $i--) {
          $attr = $node->attributes->item($i);
          if (!in_array(strtolower($attr->name), $allowed_attrs)) {
            $node->removeAttribute($attr->name);
          }
        }
      }
      
      // Process child nodes
      if ($node->hasChildNodes()) {
        $children = [];
        foreach ($node->childNodes as $child) {
          $children[] = $child;
        }
        foreach ($children as $child) {
          $clean_node($child);
        }
      }
    };
    
    // Clean the DOM
    $clean_node($dom->documentElement);
    
    // Convert back to string
    $svg = $dom->saveXML($dom->documentElement);
  }
  
  return $svg;
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
if (pb_carousel_get_attribute($attributes, 'enableAutoSlidesPerView')) {
  $attributes['slidesPerView'] = 'auto';
}

/**
 * Constructs a string of Swiper attributes in kebab-case format.
 *
 * This loop iterates over a predefined list of attribute names ($attributes_list), retrieves the corresponding
 * value from the attributes array using the pb_carousel_get_attribute helper function, and converts the attribute name
 * from camelCase to kebab-case using the pb_carousel_camel_to_kebab helper function. If the attribute value is a boolean,
 * it is converted to a string ('true' or 'false'). Each attribute is then appended to the $swiper_attributes
 * string in the format 'attribute-name="value" '.
 *
 * @param array $attributes_list The list of attribute names to process.
 * @param array $attributes The array of attributes.
 * @return string The constructed string of Swiper attributes in kebab-case format.
 */
// Handle autoplay on hover feature - check before processing regular autoplay
$autoplayOnHover = pb_carousel_get_attribute($attributes, 'autoplayOnHover');
if ($autoplayOnHover) {
  // Remove autoplay from the attributes list to prevent it from being processed
  $attributes_list = array_diff($attributes_list, ['autoplay']);
}

$swiper_attributes = '';
foreach ($attributes_list as $attr) {
  $value = pb_carousel_get_attribute($attributes, $attr);
  if ($value !== '') {
    if (is_bool($value)) {
      $value = $value ? 'true' : 'false';
    }
    $kebab_case_attr = pb_carousel_camel_to_kebab($attr);
    $swiper_attributes .= $kebab_case_attr . '="' . esc_attr($value) . '" ';
  }
}

// Handle special case for autoplay delay (only if regular autoplay is enabled)
if (!$autoplayOnHover && pb_carousel_get_attribute($attributes, 'autoplay') && $delay = pb_carousel_get_attribute($attributes, 'delay')) {
  $swiper_attributes .= 'autoplay-delay="' . esc_attr($delay) . '" ';
}

// Add autoplay on hover data attributes if enabled
if ($autoplayOnHover) {
  $hoverTransitionSpeed = pb_carousel_get_attribute($attributes, 'hoverTransitionSpeed');
  $swiper_attributes .= 'data-autoplay-on-hover="true" ';
  if ($hoverTransitionSpeed) {
    $swiper_attributes .= 'data-hover-transition-speed="' . esc_attr($hoverTransitionSpeed) . '" ';
  }
}

// Handle special case for effect fade
$effect = pb_carousel_get_attribute($attributes, 'effect');
if ($effect && $effect === 'fade') {
  $swiper_attributes .= 'fade-effect-cross-fade="true" ';
}

$slidesPerViewDesktop = pb_carousel_get_attribute($attributes, 'enableAutoSlidesPerView') ? '"auto"' : (int) pb_carousel_get_attribute($attributes, 'slidesPerView');

// Define the breakpoints as a properly escaped JSON string
$breakpoints_json = json_encode(array(
    "0" => array(
        "slidesPerView" => (int) pb_carousel_get_attribute($attributes, 'slidesPerViewMobile'),
        "spaceBetween" => (int) pb_carousel_get_attribute($attributes, 'spaceBetweenMobile')
    ),
    "768" => array(
        "slidesPerView" => (int) pb_carousel_get_attribute($attributes, 'slidesPerViewTablet'),
        "spaceBetween" => (int) pb_carousel_get_attribute($attributes, 'spaceBetweenTablet')
    ),
    "1024" => array(
        "slidesPerView" => pb_carousel_get_attribute($attributes, 'enableAutoSlidesPerView') ? 'auto' : (int) pb_carousel_get_attribute($attributes, 'slidesPerView'),
        "spaceBetween" => (int) pb_carousel_get_attribute($attributes, 'spaceBetween')
    )
));

$breakpoints = 'breakpoints=\'' . esc_attr($breakpoints_json) . '\'';

// Combine swiper attributes and breakpoints into a single settings string
$swiper_settings = $swiper_attributes . $breakpoints;

// Strip the beginning . from the class
$navigationNextClass = ltrim($attributes['navigationNextEl'] ?? '', '.');
$navigationPrevClass = ltrim($attributes['navigationPrevEl'] ?? '', '.');
?>


<section 
  id="<?php echo esc_attr($id); ?>" 
  <?php echo get_block_wrapper_attributes(['class' => 'wp-block-prolific-carousel']); ?>
>
  <swiper-container 
    <?php echo $swiper_settings; ?>
    role="region"
    aria-label="<?php esc_attr_e('Carousel', 'prolific-blocks'); ?>"
    class="prolific-carousel-container"
  >
    <?php echo $content; ?>
  </swiper-container>

  <?php if (isset($attributes['customNav']) && $attributes['customNav']) : ?>
    <button 
      class="custom-prev <?php echo esc_attr($navigationPrevClass); ?>"
      aria-label="<?php esc_attr_e('Previous slide', 'prolific-blocks'); ?>"
      role="button"
    >
      <?php if (isset($attributes['customNavPrevSvg']) && $attributes['customNavPrevSvg']) : ?>
        <span><?php echo pb_carousel_sanitize_svg($attributes['customNavPrevSvg']); ?></span>
      <?php else : ?>
        <span aria-hidden="true">&#10094;</span>
      <?php endif; ?>
      <span class="screen-reader-text"><?php esc_html_e('Previous', 'prolific-blocks'); ?></span>
    </button>
    <button 
      class="custom-next <?php echo esc_attr($navigationNextClass); ?>"
      aria-label="<?php esc_attr_e('Next slide', 'prolific-blocks'); ?>"
      role="button"
    >
      <?php if (isset($attributes['customNavNextSvg']) && $attributes['customNavNextSvg']) : ?>
        <span><?php echo pb_carousel_sanitize_svg($attributes['customNavNextSvg']); ?></span>
      <?php else : ?>
        <span aria-hidden="true">&#10095;</span>
      <?php endif; ?>
      <span class="screen-reader-text"><?php esc_html_e('Next', 'prolific-blocks'); ?></span>
    </button>
  <?php endif; ?>
  
  <?php if (isset($attributes['autoplay']) && $attributes['autoplay'] && isset($attributes['pauseButton']) && $attributes['pauseButton']) : ?>
    <button 
      class="carousel-pause-button"
      aria-label="<?php esc_attr_e('Pause carousel', 'prolific-blocks'); ?>"
      aria-pressed="false"
      role="button"
    >
      <span aria-hidden="true">⏸</span>
      <span class="screen-reader-text"><?php esc_html_e('Pause', 'prolific-blocks'); ?></span>
    </button>
  <?php endif; ?>

</section>