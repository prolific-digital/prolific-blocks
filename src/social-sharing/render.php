<?php
/**
 * Render callback for Social Sharing block.
 *
 * @param array    $attributes Block attributes.
 * @param string   $content    Block content.
 * @param WP_Block $block      Block instance.
 * @return string Rendered block HTML.
 */

// Get attributes with defaults
$platforms = isset($attributes['platforms']) ? $attributes['platforms'] : array('facebook', 'twitter', 'linkedin', 'email');
$show_labels = isset($attributes['showLabels']) ? $attributes['showLabels'] : true;
$open_in_new_tab = isset($attributes['openInNewTab']) ? $attributes['openInNewTab'] : true;

// Don't render if no platforms selected
if (empty($platforms)) {
  return '';
}

// Get current page URL and title
$current_url = esc_url(get_permalink());
$page_title = rawurlencode(get_the_title());

// Get excerpt or generate one for description
$excerpt = get_the_excerpt();
if (empty($excerpt)) {
  $excerpt = wp_trim_words(get_the_content(), 20);
}
$description = rawurlencode(wp_strip_all_tags($excerpt));

// Platform data with labels and share URLs
$platform_data = array(
  'facebook' => array(
    'label' => __('Facebook', 'prolific-blocks'),
    'icon' => '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M10 1.25C5.17 1.25 1.25 5.17 1.25 10c0 4.36 3.21 7.98 7.4 8.66v-6.14H6.46V10h2.19V8.27c0-2.16 1.29-3.35 3.25-3.35.94 0 1.93.17 1.93.17v2.12h-1.09c-1.07 0-1.4.66-1.40 1.34V10h2.39l-.38 2.52h-2.01v6.14c4.19-.68 7.41-4.3 7.41-8.66 0-4.83-3.92-8.75-8.75-8.75z"/></svg>',
    'url' => 'https://www.facebook.com/sharer/sharer.php?u=' . $current_url,
  ),
  'twitter' => array(
    'label' => __('X (Twitter)', 'prolific-blocks'),
    'icon' => '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M13.5 3.5h1.5l-3.3 3.7L15.5 16h-3l-2.4-3.1L7.5 16H6l3.5-4L6 3.5h3.1l2.2 2.9 2.7-2.9zm-.5 11.3h.8L7.7 4.3H6.9l6.1 10.5z"/></svg>',
    'url' => 'https://twitter.com/intent/tweet?url=' . $current_url . '&text=' . $page_title,
  ),
  'linkedin' => array(
    'label' => __('LinkedIn', 'prolific-blocks'),
    'icon' => '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M5.5 7.8H3v8h2.5v-8zM4.2 3.5c-.8 0-1.4.6-1.4 1.4s.6 1.4 1.4 1.4 1.4-.6 1.4-1.4-.6-1.4-1.4-1.4zM17 15.8h-2.5v-3.9c0-.9 0-2.1-1.3-2.1-1.3 0-1.5 1-1.5 2v4h-2.5v-8h2.4v1.1h.0c.3-.6 1.1-1.3 2.3-1.3 2.5 0 2.9 1.6 2.9 3.7v4.5h.2z"/></svg>',
    'url' => 'https://www.linkedin.com/shareArticle?mini=true&url=' . $current_url . '&title=' . $page_title,
  ),
  'pinterest' => array(
    'label' => __('Pinterest', 'prolific-blocks'),
    'icon' => '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M10 1.25C5.17 1.25 1.25 5.17 1.25 10c0 3.72 2.33 6.88 5.61 8.13-.08-.7-.15-1.77.03-2.53.16-.69 1.04-4.41 1.04-4.41s-.27-.53-.27-1.32c0-1.23.71-2.15 1.6-2.15.76 0 1.12.57 1.12 1.25 0 .76-.48 1.9-.73 2.95-.21.88.44 1.6 1.31 1.6 1.58 0 2.79-1.66 2.79-4.05 0-2.12-1.52-3.6-3.69-3.6-2.52 0-4 1.89-4 3.84 0 .76.29 1.58.66 2.02.07.09.08.17.06.25l-.25 1c-.04.16-.13.2-.3.12-1.11-.52-1.8-2.13-1.8-3.43 0-2.79 2.03-5.36 5.85-5.36 3.07 0 5.46 2.19 5.46 5.11 0 3.05-1.92 5.51-4.59 5.51-.9 0-1.74-.47-2.03-1.02l-.55 2.11c-.2.77-.74 1.74-1.1 2.32.83.26 1.71.40 2.63.40 4.83 0 8.75-3.92 8.75-8.75S14.83 1.25 10 1.25z"/></svg>',
    'url' => 'https://pinterest.com/pin/create/button/?url=' . $current_url . '&description=' . $page_title,
  ),
  'email' => array(
    'label' => __('Email', 'prolific-blocks'),
    'icon' => '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M15 4H5c-.83 0-1.49.67-1.49 1.5L3.5 14c0 .83.67 1.5 1.5 1.5h10c.83 0 1.5-.67 1.5-1.5V5.5c0-.83-.67-1.5-1.5-1.5zm0 3l-5 3.12L5 7V5.5l5 3.12 5-3.12V7z"/></svg>',
    'url' => 'mailto:?subject=' . $page_title . '&body=' . $description . '%0A%0A' . $current_url,
  ),
  'whatsapp' => array(
    'label' => __('WhatsApp', 'prolific-blocks'),
    'icon' => '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M14.56 11.98c-.25-.12-1.46-.72-1.69-.81-.23-.08-.39-.12-.56.12-.16.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-.12-.74.66-1.23 1.47-1.38 1.72-.14.25-.02.38.11.5.11.11.25.29.37.43.12.15.16.25.25.41.08.17.04.31-.02.43-.06.12-.56 1.34-.76 1.84-.2.48-.41.42-.56.42-.14 0-.31-.01-.48-.01-.16 0-.43.06-.66.31-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.46-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.23-.17-.48-.29m-4.35 6.17h-.01c-.77 0-1.53-.21-2.19-.6l-.16-.09-1.62.43.43-1.58-.1-.16c-.43-.69-.66-1.48-.66-2.29 0-2.38 1.94-4.32 4.32-4.32 1.15 0 2.24.45 3.06 1.27.82.82 1.27 1.91 1.27 3.06-.01 2.38-1.95 4.32-4.33 4.32m7.37-15.03C15.94 1.48 13.52.42 10.88.42 4.95.42.13 5.23.13 11.16c0 1.89.49 3.73 1.43 5.36L.04 19.58l3.15-1.49c1.57.86 3.34 1.31 5.14 1.31h.01c5.93 0 10.75-4.82 10.75-10.75 0-2.87-1.12-5.57-3.15-7.59"/></svg>',
    'url' => 'https://wa.me/?text=' . $page_title . '%20' . $current_url,
  ),
  'reddit' => array(
    'label' => __('Reddit', 'prolific-blocks'),
    'icon' => '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M10 1.25A8.75 8.75 0 001.25 10 8.75 8.75 0 0010 18.75 8.75 8.75 0 0018.75 10 8.75 8.75 0 0010 1.25zm3.65 3.12c.5 0 .91.41.91.91s-.41.91-.91.91l-1.9-.4-.58 2.74c1.33.05 2.54.46 3.41 1.09.22-.23.53-.36.88-.36.71 0 1.28.57 1.28 1.28 0 .52-.32.97-.74 1.18.03.13.03.27.03.38 0 1.97-2.29 3.56-5.12 3.56s-5.12-1.59-5.12-3.56c0-.13.01-.27.03-.39-.42-.2-.74-.65-.74-1.17 0-.71.57-1.28 1.28-1.28.34 0 .66.14.88.36.88-.65 2.1-1.05 3.46-1.09l.65-3.06c.02-.07.06-.13.10-.14.05-.02.10-.03.17-.03l2.13.45c.07-.32.36-.51.65-.51zm-3.15 5.88c-.5 0-.91.41-.91.91s.41.91.91.91.91-.41.91-.91-.41-.91-.91-.91zm4.01 0c-.5 0-.91.41-.91.91s.41.91.91.91.91-.41.91-.91-.41-.91-.91-.91zm-4 2.92c-.06 0-.11.02-.17.07-.08.08-.08.21 0 .29.62.62 1.82.67 2.16.67s1.54-.04 2.16-.67c.08-.08.08-.21 0-.29s-.21-.08-.29 0c-.4.39-1.23.53-1.84.53s-1.45-.14-1.84-.53c-.05-.05-.11-.07-.17-.07z"/></svg>',
    'url' => 'https://reddit.com/submit?url=' . $current_url . '&title=' . $page_title,
  ),
  'telegram' => array(
    'label' => __('Telegram', 'prolific-blocks'),
    'icon' => '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M9.95 1.67A8.33 8.33 0 001.67 10c0 4.6 3.73 8.33 8.33 8.33s8.33-3.73 8.33-8.33-3.73-8.33-8.33-8.33zm4.14 5.52c.08-.01.27.02.39.12.08.06.13.16.14.27.01.08.03.26.02.39-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.21-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.13-.05-.18s-.14-.03-.21-.02c-.09.02-1.49.95-4.22 2.79-.4.28-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.15 3.35-1.36 3.73-1.36z"/></svg>',
    'url' => 'https://t.me/share/url?url=' . $current_url . '&text=' . $page_title,
  ),
);

$target = $open_in_new_tab ? ' target="_blank" rel="noopener noreferrer"' : '';

?>

<div <?php echo get_block_wrapper_attributes(); ?>>
  <div class="social-sharing-buttons">
    <?php foreach ($platforms as $platform): ?>
      <?php if (isset($platform_data[$platform])): ?>
        <?php $data = $platform_data[$platform]; ?>
        <a
          href="<?php echo esc_url($data['url']); ?>"
          class="social-share-button social-<?php echo esc_attr($platform); ?>"
          aria-label="<?php echo esc_attr(sprintf(__('Share on %s', 'prolific-blocks'), $data['label'])); ?>"
          <?php echo $target; ?>
        >
          <span class="share-icon"><?php echo $data['icon']; ?></span>
          <?php if ($show_labels): ?>
            <span class="share-label"><?php echo esc_html($data['label']); ?></span>
          <?php endif; ?>
        </a>
      <?php endif; ?>
    <?php endforeach; ?>
  </div>
</div>
