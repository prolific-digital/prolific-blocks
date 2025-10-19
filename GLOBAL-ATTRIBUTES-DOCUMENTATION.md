# Global Custom HTML Attributes

## Overview

The Global Custom HTML Attributes feature adds a powerful "Custom HTML Attributes" panel to **ALL blocks** (WordPress core blocks, third-party blocks, and Prolific custom blocks). This allows you to add any HTML attribute needed for accessibility, SEO, performance optimization, and Lighthouse scoring improvements.

## Features

- **Universal Compatibility**: Works with ALL registered blocks in WordPress
- **Accessibility First**: Add ARIA attributes for screen readers and assistive technologies
- **SEO Optimization**: Add rel attributes for link management and search engine optimization
- **Performance**: Add loading and fetchpriority attributes for resource optimization
- **Security**: Built-in validation prevents XSS attacks and dangerous attributes
- **User-Friendly**: Intuitive UI with helpful examples and warnings

## Installation

The Global Custom Attributes feature is automatically enabled when you install and activate the Prolific Blocks plugin. No additional configuration is required.

## How to Use

### Accessing the Custom Attributes Panel

1. Select any block in the WordPress Block Editor
2. Open the block settings sidebar (right panel)
3. Scroll to find the "Custom HTML Attributes" panel
4. Click to expand the panel

### Adding Attributes

1. Click the "**+ Add Attribute**" button
2. Enter the **Attribute Name** (e.g., `aria-label`, `rel`, `data-custom`)
3. Enter the **Attribute Value** (e.g., `Click to learn more`, `noopener noreferrer`)
4. Click "**Add Attribute**" again to add more attributes
5. Click "**Remove Attribute**" to delete an attribute

### Example Use Cases

#### 1. Adding rel="noopener noreferrer" to Buttons/Links

**Problem**: External links without proper rel attributes can fail Lighthouse security audits.

**Solution**:
- Select your Button or Link block
- Add attribute: `rel` with value `noopener noreferrer`
- This prevents the new page from accessing the window.opener property

#### 2. Adding ARIA Labels for Accessibility

**Problem**: Icon buttons or images without text labels fail accessibility audits.

**Solution**:
- Select your Icon or Button block
- Add attribute: `aria-label` with value `Open menu` or `Search button`
- Screen readers will now announce the button purpose

#### 3. Adding Loading Attributes to Images

**Problem**: Images without lazy loading can slow down page load times.

**Solution**:
- Select your Image block
- Add attribute: `loading` with value `lazy` (for below-fold images) or `eager` (for critical images)
- Browsers will optimize image loading automatically

#### 4. Adding Fetchpriority for Critical Resources

**Problem**: Critical images (like hero images) load too slowly.

**Solution**:
- Select your critical Image block
- Add attribute: `fetchpriority` with value `high`
- Browser will prioritize loading this resource

#### 5. Adding Custom Data Attributes

**Problem**: Need to attach custom data to blocks for JavaScript functionality.

**Solution**:
- Select any block
- Add attribute: `data-analytics-id` with value `hero-cta-button`
- Use these in your custom JavaScript or analytics tracking

#### 6. Adding ARIA Roles

**Problem**: Block doesn't have the correct semantic role for assistive technologies.

**Solution**:
- Select your block (e.g., a Group block used as navigation)
- Add attribute: `role` with value `navigation`
- Assistive technologies will correctly identify the block's purpose

#### 7. Adding Autocomplete for Forms

**Problem**: Form inputs don't have autocomplete attributes for better UX.

**Solution**:
- Select your Input block (if using a form plugin)
- Add attribute: `autocomplete` with value `email`, `name`, `tel`, etc.
- Browsers will offer appropriate autocomplete suggestions

## Common Attributes Reference

| Attribute | Values | Use Case |
|-----------|--------|----------|
| `rel` | `noopener`, `noreferrer`, `nofollow`, `sponsored`, `ugc` | Link relationships for security and SEO |
| `aria-label` | Any descriptive text | Accessible labels for screen readers |
| `aria-labelledby` | Element ID | Points to element containing the label |
| `aria-describedby` | Element ID | Points to element containing description |
| `aria-hidden` | `true`, `false` | Hide decorative elements from screen readers |
| `role` | `button`, `navigation`, `banner`, `complementary`, etc. | ARIA landmark roles |
| `loading` | `lazy`, `eager`, `auto` | Image/iframe loading behavior |
| `fetchpriority` | `high`, `low`, `auto` | Resource loading priority |
| `autocomplete` | `email`, `name`, `tel`, `street-address`, etc. | Form field autocomplete hints |
| `target` | `_blank`, `_self`, `_parent`, `_top` | Link target window |
| `data-*` | Any value | Custom data attributes |
| `title` | Any text | Tooltip text (use sparingly, prefer aria-label) |
| `lang` | Language code (e.g., `en`, `es`, `fr`) | Language of content |
| `translate` | `yes`, `no` | Whether content should be translated |
| `itemtype` | Schema.org URL | Microdata type |
| `itemprop` | Property name | Microdata property |

## Security Features

### Protected Attributes

The following attributes are managed by WordPress and **cannot be modified** through this panel:
- `class` / `classname`
- `id`
- `style`

These are controlled through WordPress's standard block controls to maintain compatibility.

### Dangerous Attributes Blocked

The following event handler attributes are **blocked** to prevent XSS attacks:
- All `on*` attributes (`onclick`, `onload`, `onerror`, `onmouseover`, etc.)

If you attempt to use these, you'll see a warning message and the attribute will not be applied.

### Validation and Sanitization

- **Attribute Names**: Must start with a letter and contain only letters, numbers, hyphens, underscores, and colons
- **Attribute Values**: HTML tags are stripped, and `javascript:` and `data:` protocols are removed
- All inputs are trimmed and validated before being applied to blocks

## Lighthouse Optimization Examples

### 1. Links to Cross-Origin Destinations Are Unsafe

**Lighthouse Error**: "Links to cross-origin destinations are unsafe"

**Fix**: Add `rel="noopener noreferrer"` to all external links
```
Attribute: rel
Value: noopener noreferrer
```

### 2. Image Elements Do Not Have Explicit Width and Height

**Note**: This is typically handled by WordPress image blocks, but you can add:
```
Attribute: loading
Value: lazy
```

### 3. Buttons Do Not Have an Accessible Name

**Fix**: Add aria-label to icon buttons
```
Attribute: aria-label
Value: Open navigation menu
```

### 4. [aria-*] Attributes Do Not Match Their Roles

**Fix**: Add appropriate role attribute
```
Attribute: role
Value: button
```

### 5. Links Do Not Have a Discernible Name

**Fix**: Add aria-label to link blocks with only icons
```
Attribute: aria-label
Value: Read more about our services
```

## Best Practices

### 1. Don't Override WordPress Features

Use WordPress's native block controls for:
- Colors (use block color settings)
- Spacing (use block spacing settings)
- Typography (use block typography settings)
- Alignment (use block alignment settings)

Use Custom Attributes for HTML-level enhancements that aren't available in the block controls.

### 2. Validate Your Changes

After adding attributes:
- **Preview your page** to ensure attributes are applied correctly
- **View page source** to verify attributes in HTML
- **Run Lighthouse audit** to check improvements
- **Test with screen reader** for accessibility attributes

### 3. Be Consistent

- Use the same attribute values across similar blocks (e.g., all external links should have `rel="noopener noreferrer"`)
- Document your attribute usage if working in a team
- Create reusable block patterns with pre-configured attributes

### 4. Minimize Attribute Usage

- Only add attributes when necessary
- Don't duplicate attributes that WordPress already provides
- Remove attributes if you're using a plugin that adds them automatically

### 5. Test Accessibility

When adding ARIA attributes:
- Test with screen readers (NVDA, JAWS, VoiceOver)
- Use browser accessibility inspection tools
- Validate with WAVE or axe DevTools
- Follow WCAG 2.1 guidelines

## Technical Details

### How It Works

The Global Custom Attributes feature uses WordPress Block Editor filters to:

1. **Add Attribute Storage**: Registers a `customAttributes` array attribute on all block types
2. **Add UI Controls**: Injects the "Custom HTML Attributes" panel into all block InspectorControls
3. **Apply on Save**: Applies validated attributes to the block wrapper element on save
4. **Apply in Editor**: Shows attributes in the editor preview for accurate WYSIWYG editing

### Filter Hooks Used

- `blocks.registerBlockType` - Adds customAttributes to all blocks
- `editor.BlockEdit` - Adds the UI panel to block settings
- `blocks.getSaveContent.extraProps` - Applies attributes to saved HTML
- `editor.BlockListBlock` - Applies attributes in editor preview

### Attribute Storage

Attributes are stored as an array in the block's `customAttributes` attribute:

```json
{
  "customAttributes": [
    {
      "name": "aria-label",
      "value": "Click to learn more",
      "id": 1634567890123
    },
    {
      "name": "rel",
      "value": "noopener noreferrer",
      "id": 1634567890456
    }
  ]
}
```

### Browser Compatibility

The feature works with all modern browsers:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- All browsers supported by WordPress 6.3+

## Troubleshooting

### Attributes Not Appearing in HTML

**Problem**: Added attributes don't show up in the page source

**Solutions**:
1. Make sure you've **saved/updated** the post/page
2. **Clear your browser cache** and WordPress cache plugins
3. Check if attribute names are valid (no spaces, start with letter)
4. Verify you're not using a protected or dangerous attribute
5. Test in a different block to rule out block-specific issues

### Attributes Removed After Saving

**Problem**: Attributes disappear after saving the post

**Solutions**:
1. Check the browser console for JavaScript errors
2. Verify attribute names don't contain invalid characters
3. Ensure values don't contain blocked protocols (javascript:, data:)
4. Check if another plugin is conflicting (disable plugins one by one)

### Panel Not Showing

**Problem**: Can't find the "Custom HTML Attributes" panel

**Solutions**:
1. Make sure Prolific Blocks plugin is **activated**
2. Clear your browser cache and hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
3. Make sure you're using WordPress 6.3 or later
4. Check browser console for JavaScript errors
5. Try deactivating other plugins that modify the block editor

### Conflicts with Other Plugins

**Problem**: Attributes conflict with other plugins

**Solutions**:
1. Check if other plugins add the same attributes
2. Disable conflicting plugins or coordinate attribute usage
3. Use block-specific attributes through custom CSS classes instead
4. Contact plugin authors about potential conflicts

## Performance Considerations

### Impact on Editor

The Global Custom Attributes panel adds minimal overhead:
- **JavaScript**: ~6KB minified
- **CSS**: ~3KB
- **Load Time**: Negligible impact on editor loading

### Impact on Frontend

- **No frontend JavaScript**: Attributes are purely HTML
- **No frontend CSS**: No styling added to frontend
- **No performance impact**: Attributes are static HTML attributes
- **May improve performance**: When using loading="lazy" and fetchpriority

## Developer Notes

### Extending the Feature

If you're a developer, you can extend this feature:

#### Programmatically Add Attributes

```php
// Add attributes to a block programmatically
add_filter('render_block', function($block_content, $block) {
    if ($block['blockName'] === 'core/image') {
        // Add fetchpriority to all images
        $block_content = str_replace('<img', '<img fetchpriority="high"', $block_content);
    }
    return $block_content;
}, 10, 2);
```

#### Add Custom Validation

```javascript
// Add custom validation logic
import { addFilter } from '@wordpress/hooks';

addFilter(
    'prolific.customAttributes.validate',
    'my-plugin/custom-validation',
    (isValid, attributeName, attributeValue) => {
        // Add custom validation logic
        if (attributeName === 'my-custom-attr') {
            return /^[0-9]+$/.test(attributeValue);
        }
        return isValid;
    }
);
```

### Database Storage

Attributes are stored in the WordPress post_content as part of the block's attributes:

```html
<!-- wp:core/button {"customAttributes":[{"name":"rel","value":"nofollow","id":123456}]} -->
<div class="wp-block-button"><a class="wp-block-button__link" rel="nofollow">Click Me</a></div>
<!-- /wp:core/button -->
```

## Changelog

### Version 1.0.0 (October 2025)
- Initial release
- Support for all block types
- Security validation and sanitization
- Helpful UI with examples and warnings
- Complete documentation

## Support

For questions, issues, or feature requests:
- **Documentation**: This file
- **Plugin Support**: Contact Prolific Digital
- **GitHub Issues**: Report bugs on the Prolific Blocks repository

## Credits

Developed by Prolific Digital as part of the Prolific Blocks plugin.

## License

This feature is part of Prolific Blocks and is licensed under GPL-2.0-or-later.
