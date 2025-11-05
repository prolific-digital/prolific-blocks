# Query Posts Custom CPT Layouts

## Overview

The Query Posts block supports custom frontend layouts for specific Custom Post Types (CPTs). This feature allows you to display specialized content layouts for CPTs like **Places** and **Events** with custom field data, icons, and structured markup.

## Supported CPTs

### 1. Places (`places`)
- **Plugin:** WP Places
- **Layout:** Category/Type label + Title, Excerpt, Address (ACF), Hours (ACF), Read More
- **Icons:** Location pin (address), Clock (hours)
- **Label Behavior:**
  - Shows first term from primary hierarchical taxonomy (e.g., "Park", "Facility")
  - Falls back to post type singular name ("Place") if no term assigned
- **ACF Fields Used:**
  - `address` - Place address (supports string, Google Maps field, or field group)
  - `hours_display` - Operating hours (supports string, textarea, or repeater array)

### 2. Events (`tribe_events`)
- **Plugin:** The Events Calendar
- **Layout:** "Event" label + Title, Excerpt, Date, Time, Venue, Read More
- **Icons:** Calendar (date), Clock (time), Location pin (venue)
- **Data Sources:**
  - `tribe_get_start_date()` - Event date
  - `tribe_get_start_time()` / `tribe_get_end_time()` - Event time range
  - `tribe_get_venue()` - Venue name

## Architecture

### Registry Pattern

The system uses a registry pattern with a filter hook for extensibility:

```php
// Located in src/query-posts/render.php, line 319
$cpt_registry = apply_filters('prolific_query_posts_cpt_registry', [
    'places'       => 'prolific_render_places_layout',
    'tribe_events' => 'prolific_render_events_layout',
]);
```

### Routing Function

`prolific_render_cpt_layout($post_id, $attributes)` checks the registry and calls the appropriate renderer function. If no custom layout exists for a post type, it returns `null` and the default layout is used.

## Layout Structure

All custom CPT layouts follow a consistent BEM-style structure:

### HTML Markup

```html
<div class="entry-head">
  <div class="entry-head__label">Category or Type Label</div>
  <h2 class="entry-head__title">
    <a href="[permalink]">Post Title</a>
  </h2>
</div>

<div class="entry-meta">
  <div class="entry-meta__excerpt">Excerpt text...</div>

  <div class="entry-meta__row entry-meta__row--field-name">
    <span class="entry-meta__icon" aria-hidden="true">[SVG Icon]</span>
    <span class="entry-meta__text">Field value</span>
  </div>

  <!-- More rows as needed -->

  <a class="entry-meta__more" href="[permalink]">
    Read More
    <span class="screen-reader-text">Post Title</span>
  </a>
</div>
```

### BEM Classes

#### `.entry-head` Group
- `.entry-head__label` - Category or post type label (badge style)
- `.entry-head__title` - Post title with link

#### `.entry-meta` Group
- `.entry-meta__excerpt` - Post excerpt
- `.entry-meta__row` - Individual field row
  - `.entry-meta__row--address` - Address field
  - `.entry-meta__row--venue` - Venue field
  - `.entry-meta__row--date` - Date field
  - `.entry-meta__row--time` - Time field
  - `.entry-meta__row--hours` - Hours field
- `.entry-meta__icon` - Icon container (flexbox)
- `.entry-meta__text` - Field text content
- `.entry-meta__text-group` - Container for multiple text lines (e.g., multi-line hours)
- `.entry-meta__more` - Read more button/link

## Adding a New CPT Layout

### Step 1: Create Renderer Function

Add a new renderer function in `src/query-posts/render.php` after the existing renderer functions:

```php
/**
 * Renders [Your CPT Name] custom layout.
 *
 * @param int   $post_id     The post ID.
 * @param array $attributes  Block attributes.
 * @return string HTML markup.
 */
if (!function_exists('prolific_render_your_cpt_layout')) {
    function prolific_render_your_cpt_layout($post_id, $attributes) {
        $output = '';

        // Get custom fields or meta
        $custom_field = get_field('custom_field', $post_id);

        // Get settings from attributes
        $read_more_text = $attributes['readMoreText'] ?? __('Read More', 'prolific-blocks');
        $show_excerpt = $attributes['showExcerpt'] ?? true;
        $excerpt_length = $attributes['excerptLength'] ?? 55;

        // Get taxonomy term for label (optional)
        $terms = get_the_terms($post_id, 'your_taxonomy');
        $term_label = (!empty($terms) && !is_wp_error($terms)) ? $terms[0]->name : '';

        // Build entry-head
        $output .= '<div class="entry-head">';

        if ($term_label) {
            $output .= '<div class="entry-head__label">' . esc_html($term_label) . '</div>';
        }

        $title_tag = $attributes['titleTag'] ?? 'h2';
        $output .= '<' . esc_attr($title_tag) . ' class="entry-head__title">';
        $output .= '<a href="' . esc_url(get_permalink($post_id)) . '">';
        $output .= esc_html(get_the_title($post_id));
        $output .= '</a>';
        $output .= '</' . esc_attr($title_tag) . '>';

        $output .= '</div>'; // .entry-head

        // Build entry-meta
        $output .= '<div class="entry-meta">';

        // Excerpt
        if ($show_excerpt) {
            $excerpt = get_the_excerpt($post_id);
            if (!empty($excerpt)) {
                $excerpt = wp_trim_words($excerpt, $excerpt_length, '...');
                $output .= '<div class="entry-meta__excerpt">' . wp_kses_post($excerpt) . '</div>';
            }
        }

        // Custom field with icon
        if (!empty($custom_field)) {
            $output .= '<div class="entry-meta__row entry-meta__row--custom">';
            $output .= '<span class="entry-meta__icon">' . prolific_icon_location_pin() . '</span>'; // Choose appropriate icon
            $output .= '<span class="entry-meta__text">' . esc_html($custom_field) . '</span>';
            $output .= '</div>';
        }

        // Read More link
        $output .= '<a class="entry-meta__more" href="' . esc_url(get_permalink($post_id)) . '">';
        $output .= esc_html($read_more_text);
        $output .= '<span class="screen-reader-text"> ' . esc_html(get_the_title($post_id)) . '</span>';
        $output .= '</a>';

        $output .= '</div>'; // .entry-meta

        return $output;
    }
}
```

### Step 2: Register in CPT Registry

Add your CPT to the registry using the filter hook. You can do this in your theme's `functions.php` or in a custom plugin:

```php
add_filter('prolific_query_posts_cpt_registry', function($registry) {
    $registry['your_cpt_slug'] = 'prolific_render_your_cpt_layout';
    return $registry;
});
```

**OR** add directly in `src/query-posts/render.php` at line 319:

```php
$cpt_registry = apply_filters('prolific_query_posts_cpt_registry', [
    'places'         => 'prolific_render_places_layout',
    'tribe_events'   => 'prolific_render_events_layout',
    'your_cpt_slug'  => 'prolific_render_your_cpt_layout', // Add this line
]);
```

### Step 3: Add Custom Styles (Optional)

If you need CPT-specific styles beyond the base BEM classes, add them to `src/query-posts/style.scss`:

```scss
// Custom styles for your CPT
.entry-meta {
    &__row--your-custom-field {
        // Custom styling
    }
}
```

### Step 4: Rebuild

```bash
npm run build
```

## Available Icon Functions

Three inline SVG icon functions are available:

```php
prolific_icon_location_pin()  // Location/address/venue
prolific_icon_calendar()       // Dates
prolific_icon_clock()          // Time/hours
```

To add more icons, follow the pattern in `render.php` lines 44-75.

## Data Access Patterns

### ACF Fields
```php
$field_value = get_field('field_name', $post_id);
```

### Handling Complex ACF Fields

**Address Fields (Array Support):**
The Places layout handles various address field formats:

```php
// Google Maps field
if (isset($address_field['address'])) {
    $address = $address_field['address'];
}

// Field group with standard names
elseif (isset($address_field['street_address'])) {
    $parts = [];
    if (!empty($address_field['street_address'])) $parts[] = $address_field['street_address'];
    if (!empty($address_field['city'])) $parts[] = $address_field['city'];
    if (!empty($address_field['state'])) $parts[] = $address_field['state'];
    if (!empty($address_field['zip'])) $parts[] = $address_field['zip'];
    $address = implode(', ', $parts);
}

// Alternative field names
elseif (isset($address_field['street']) || isset($address_field['line_1'])) {
    // Similar logic with street, line_1, postal_code variations
}
```

**Repeater/Array Fields:**
```php
if (is_array($hours_display)) {
    foreach ($hours_display as $hours_line) {
        // Handle each line
    }
}
```

### Custom Post Meta
```php
$meta_value = get_post_meta($post_id, 'meta_key', true);
```

### Taxonomy Terms
```php
$terms = get_the_terms($post_id, 'taxonomy_slug');
if ($terms && !is_wp_error($terms)) {
    $term = $terms[0]; // First term
    $term_name = $term->name;
}
```

### Plugin-Specific Functions
Always check function existence:
```php
if (function_exists('plugin_specific_function')) {
    $value = plugin_specific_function($post_id);
}
```

## Styling Notes

- All styles use BEM methodology for maintainability
- Dark mode support via `.prolific-query-posts.is-style-dark` wrapper
- Responsive breakpoints at 768px (mobile)
- Focus states and keyboard navigation built-in
- Icons use `stroke: currentColor` for theme compatibility
- Card-style containers with hover effects for custom layouts
- Uses `:has()` selector for detecting custom layouts

## Accessibility Features

1. **Icons:** All SVG icons have `aria-hidden="true"` - text provides context
2. **Screen Reader Text:** Read more links include hidden post title for context
3. **Semantic HTML:** Proper heading hierarchy, semantic elements
4. **Keyboard Navigation:** All interactive elements are keyboard accessible
5. **Focus States:** Visible focus indicators on all focusable elements
6. **Empty States:** Fields with no data are gracefully omitted

## Block Attribute Integration

Custom layouts respect these Query Posts block attributes:

- `titleTag` - Heading level for post titles
- `showExcerpt` - Whether to show excerpt
- `excerptLength` - Word count for excerpt
- `readMoreText` - Custom read more button text

## Testing Checklist

- [ ] Custom layout renders correctly in grid mode
- [ ] Custom layout renders correctly in list mode
- [ ] Custom layout renders correctly in carousel mode
- [ ] All custom fields display when populated
- [ ] Empty fields are omitted gracefully
- [ ] Icons align properly with text
- [ ] Read more button is keyboard accessible
- [ ] Focus states are visible
- [ ] Dark mode styles work correctly
- [ ] Responsive layout works on mobile
- [ ] No PHP warnings or errors in logs
- [ ] Post type label is correct
- [ ] Taxonomy terms display correctly

## Troubleshooting

### Custom layout not appearing
- Verify post type slug matches registry key exactly
- Check that function exists: `function_exists('prolific_render_your_cpt_layout')`
- Clear WordPress object cache if using caching plugins

### Label not showing
- For Places: Ensure posts have terms assigned in hierarchical taxonomy, or fallback "Place" label will show
- For Events: "Event" label always shows from post type object
- Check taxonomy is public and hierarchical
- Verify `show_in_rest` is enabled for REST API support (preferred but not required)

### Missing ACF fields
- Verify ACF field keys match `get_field()` calls
- Check that ACF fields are assigned to the correct post type
- Ensure ACF plugin is active

### "Array to string conversion" error
- This occurs when an ACF field returns an array (Google Maps, field group)
- The Places layout handles common array structures automatically
- Check field structure and adjust handling in renderer function if needed

### Icons not displaying
- Icons should use inline SVG, not external files
- Check browser console for any errors
- Verify icon function returns valid SVG markup

### Styles not applying
- Run `npm run build` after style changes
- Hard refresh browser (Cmd+Shift+R or Ctrl+Shift+R)
- Check selector specificity in browser dev tools

## Future CPT Candidates

The following CPTs could be added using this system:

- **Rentals** - Equipment/property rental listings with pricing, availability
- **Team Members** - Staff profiles with role, contact, social links
- **Testimonials** - Reviews with rating, author, date
- **Portfolio Items** - Projects with client, tech stack, links
- **Products** - Simple product cards with price, category

## Performance Considerations

- Custom layouts avoid additional database queries where possible
- Functions check existence before calling plugin-specific functions
- No external asset dependencies (inline SVGs)
- CSS uses efficient selectors and minimal nesting
- Registry pattern allows for easy extension without core modifications

## Version History

- **v1.0.0** - Initial implementation with Places and Events CPT support

---

## Quick Reference

### Function Locations
- **Icon Functions:** `render.php` lines 44-75
- **Places Renderer:** `render.php` lines 77-190
- **Events Renderer:** `render.php` lines 192-298
- **Router Function:** `render.php` lines 300-331
- **CPT Registry:** `render.php` line 319
- **Loop Integration:** `render.php` line 750

### CSS Locations
- **Custom Layout Styles:** `style.scss` lines 844-1086

### Key Files
- `src/query-posts/render.php` - Renderer functions and routing
- `src/query-posts/style.scss` - BEM-style CSS
- `QUERY-POSTS-CPT-LAYOUTS.md` - This documentation
