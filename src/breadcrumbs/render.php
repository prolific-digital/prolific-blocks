<?php
/**
 * Render callback for Breadcrumbs block.
 *
 * @param array    $attributes Block attributes.
 * @param string   $content    Block content.
 * @param WP_Block $block      Block instance.
 * @return string Rendered block HTML.
 */

// Get attributes with defaults
$divider = isset($attributes['divider']) ? $attributes['divider'] : 'slash';
$show_home = isset($attributes['showHome']) ? $attributes['showHome'] : true;
$home_label = isset($attributes['homeLabel']) ? $attributes['homeLabel'] : __('Home', 'prolific-blocks');
$show_current = isset($attributes['showCurrent']) ? $attributes['showCurrent'] : true;

// Divider symbols map
$divider_symbols = array(
  'slash' => '/',
  'arrow' => '>',
  'double-arrow' => '»',
  'pipe' => '|',
  'dot' => '·',
  'right-arrow' => '→',
  'dash' => '-',
);

$divider_symbol = isset($divider_symbols[$divider]) ? $divider_symbols[$divider] : '/';

// Build breadcrumb trail
$breadcrumbs = array();

// Add home
if ($show_home) {
  $breadcrumbs[] = array(
    'url' => home_url('/'),
    'title' => $home_label,
  );
}

// Get current post/page
global $post;

if (is_singular()) {
  // Get post type
  $post_type = get_post_type();
  $post_type_object = get_post_type_object($post_type);

  // For pages, add parent pages
  if ($post_type === 'page' && $post->post_parent) {
    $parent_id = $post->post_parent;
    $parents = array();

    while ($parent_id) {
      $page = get_post($parent_id);
      $parents[] = array(
        'url' => get_permalink($page->ID),
        'title' => get_the_title($page->ID),
      );
      $parent_id = $page->post_parent;
    }

    // Reverse to show in correct order
    $parents = array_reverse($parents);
    $breadcrumbs = array_merge($breadcrumbs, $parents);
  }

  // For posts, add post type archive
  if ($post_type !== 'page' && $post_type !== 'post' && $post_type_object->has_archive) {
    $breadcrumbs[] = array(
      'url' => get_post_type_archive_link($post_type),
      'title' => $post_type_object->labels->name,
    );
  }

  // For posts, add categories
  if ($post_type === 'post') {
    $categories = get_the_category();
    if (!empty($categories)) {
      $category = $categories[0]; // Use primary category
      $breadcrumbs[] = array(
        'url' => get_category_link($category->term_id),
        'title' => $category->name,
      );
    }
  }

  // Add current post/page if enabled
  if ($show_current) {
    $breadcrumbs[] = array(
      'url' => '',
      'title' => get_the_title(),
      'current' => true,
    );
  }
} elseif (is_category()) {
  $category = get_queried_object();
  $breadcrumbs[] = array(
    'url' => '',
    'title' => $category->name,
    'current' => true,
  );
} elseif (is_tag()) {
  $tag = get_queried_object();
  $breadcrumbs[] = array(
    'url' => '',
    'title' => $tag->name,
    'current' => true,
  );
} elseif (is_archive()) {
  $breadcrumbs[] = array(
    'url' => '',
    'title' => get_the_archive_title(),
    'current' => true,
  );
} elseif (is_search()) {
  $breadcrumbs[] = array(
    'url' => '',
    'title' => sprintf(__('Search Results for: %s', 'prolific-blocks'), get_search_query()),
    'current' => true,
  );
} elseif (is_404()) {
  $breadcrumbs[] = array(
    'url' => '',
    'title' => __('404 Not Found', 'prolific-blocks'),
    'current' => true,
  );
}

// Don't render if only home is in breadcrumbs
if (count($breadcrumbs) <= 1) {
  return '';
}

?>

<nav <?php echo get_block_wrapper_attributes(['class' => 'wp-block-prolific-breadcrumbs']); ?> aria-label="<?php esc_attr_e('Breadcrumbs', 'prolific-blocks'); ?>">
  <ol class="breadcrumbs-list">
    <?php foreach ($breadcrumbs as $index => $crumb): ?>
      <?php if ($index > 0): ?>
        <li class="breadcrumb-divider" aria-hidden="true"><?php echo esc_html($divider_symbol); ?></li>
      <?php endif; ?>

      <li class="breadcrumb-item <?php echo !empty($crumb['current']) ? 'breadcrumb-current' : ''; ?>">
        <?php if (!empty($crumb['url'])): ?>
          <a href="<?php echo esc_url($crumb['url']); ?>"><?php echo esc_html($crumb['title']); ?></a>
        <?php else: ?>
          <span <?php echo !empty($crumb['current']) ? 'aria-current="page"' : ''; ?>><?php echo esc_html($crumb['title']); ?></span>
        <?php endif; ?>
      </li>
    <?php endforeach; ?>
  </ol>
</nav>
