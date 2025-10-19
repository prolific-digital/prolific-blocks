# Global Custom HTML Attributes

**Add custom HTML attributes to ANY WordPress block for accessibility, SEO, and Lighthouse optimization.**

## Quick Start

1. **Activate** the Prolific Blocks plugin
2. **Edit** any post or page in the Block Editor
3. **Select** any block (Paragraph, Image, Button, etc.)
4. **Open** the block settings sidebar (right panel)
5. **Find** the "Custom HTML Attributes" panel
6. **Click** "+ Add Attribute" and enter your attribute name and value
7. **Save** your post

That's it! Your custom attributes are now applied to the block.

## Common Use Cases

### 1. Fix Lighthouse Security Warnings

**Problem:** "Links to cross-origin destinations are unsafe"

**Solution:** Add `rel="noopener noreferrer"` to external links

```
Attribute Name: rel
Attribute Value: noopener noreferrer
```

### 2. Improve Accessibility

**Problem:** Buttons without accessible names

**Solution:** Add `aria-label` to icon buttons

```
Attribute Name: aria-label
Attribute Value: Open navigation menu
```

### 3. Optimize Image Loading

**Problem:** Slow page load due to images

**Solution:** Add `loading="lazy"` to images

```
Attribute Name: loading
Attribute Value: lazy
```

### 4. Add Custom Data Attributes

**Problem:** Need to track clicks with custom analytics

**Solution:** Add `data-*` attributes

```
Attribute Name: data-analytics-id
Attribute Value: hero-cta-button
```

### 5. Set Resource Priority

**Problem:** Critical hero image loads too slowly

**Solution:** Add `fetchpriority="high"`

```
Attribute Name: fetchpriority
Attribute Value: high
```

## Features

- ✅ Works with **ALL blocks** (core, third-party, and custom)
- ✅ **Security built-in** - blocks dangerous attributes like `onclick`
- ✅ **User-friendly UI** with helpful examples and warnings
- ✅ **No coding required** - point and click interface
- ✅ **No performance impact** - pure HTML, no JavaScript
- ✅ **Lighthouse friendly** - helps improve scores
- ✅ **Accessibility first** - optimized for ARIA attributes

## Supported Attributes

Common attributes you can add:

- **Accessibility:** `aria-label`, `aria-labelledby`, `aria-describedby`, `aria-hidden`, `role`
- **SEO/Security:** `rel`, `target`, `title`
- **Performance:** `loading`, `fetchpriority`
- **Forms:** `autocomplete`
- **Custom Data:** `data-*` (any custom data attribute)
- **Microdata:** `itemtype`, `itemprop`, `itemscope`
- **Language:** `lang`, `translate`
- **And many more!**

## What's Blocked (For Security)

- ❌ Event handlers: `onclick`, `onload`, `onerror`, etc.
- ❌ WordPress-managed: `class`, `id`, `style` (use block controls instead)

## File Locations

- **Source:** `/src/global-attributes/index.js`
- **Built:** `/build/global-attributes/index.js`
- **Styles:** `/build/global-attributes/index.css`
- **Documentation:** `GLOBAL-ATTRIBUTES-DOCUMENTATION.md` (detailed guide)
- **Testing:** `GLOBAL-ATTRIBUTES-TESTING.md` (30-point test checklist)

## Example Results

### Before:
```html
<a class="wp-block-button__link" href="https://example.com">Visit Site</a>
```

### After Adding rel="noopener noreferrer":
```html
<a class="wp-block-button__link" href="https://example.com" rel="noopener noreferrer">Visit Site</a>
```

## Screenshots

### Custom Attributes Panel
The panel appears in the block settings sidebar for ALL blocks:

```
┌─────────────────────────────────────┐
│ Custom HTML Attributes              │
├─────────────────────────────────────┤
│ Add custom HTML attributes to this  │
│ block for accessibility, SEO, and   │
│ performance optimization.           │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Attribute Name                  │ │
│ │ aria-label                      │ │
│ │ Example: "Click to learn more"  │ │
│ │                                 │ │
│ │ Attribute Value                 │ │
│ │ Open navigation menu            │ │
│ │                                 │ │
│ │ [Remove Attribute]              │ │
│ └─────────────────────────────────┘ │
│                                     │
│ [+ Add Attribute]                   │
│                                     │
│ Common Use Cases:                   │
│ • rel="noopener noreferrer"        │
│ • aria-label="..."                 │
│ • loading="lazy"                   │
│ • role="button"                    │
│ • data-*="..."                     │
└─────────────────────────────────────┘
```

## Requirements

- WordPress 6.3 or later
- Prolific Blocks plugin activated
- Modern browser (Chrome, Firefox, Safari, Edge)

## Troubleshooting

### Attributes not showing?
1. Save/update your post
2. Clear browser and WordPress cache
3. Check browser console for errors

### Panel not appearing?
1. Make sure Prolific Blocks is activated
2. Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)
3. Check for plugin conflicts

### Attributes being removed?
1. Check attribute name is valid (letters, numbers, hyphens, underscores)
2. Make sure you're not using blocked attributes (onclick, class, etc.)
3. Verify values don't contain javascript: or data: protocols

## Documentation

- **Full Documentation:** `GLOBAL-ATTRIBUTES-DOCUMENTATION.md`
- **Testing Guide:** `GLOBAL-ATTRIBUTES-TESTING.md`
- **Plugin Docs:** See main plugin documentation

## Support

For questions or issues:
- Check the full documentation in `GLOBAL-ATTRIBUTES-DOCUMENTATION.md`
- Review testing guide in `GLOBAL-ATTRIBUTES-TESTING.md`
- Contact Prolific Digital support
- Submit issues on GitHub repository

## Credits

Developed by **Prolific Digital** as part of the Prolific Blocks plugin.

## License

GPL-2.0-or-later (same as WordPress)

---

## Quick Reference Card

Print this or keep it handy:

| Task | Attribute | Value |
|------|-----------|-------|
| External link security | `rel` | `noopener noreferrer` |
| No-follow link | `rel` | `nofollow` |
| Sponsored link | `rel` | `sponsored` |
| Screen reader label | `aria-label` | "Your description" |
| Hide from screen readers | `aria-hidden` | `true` |
| Lazy load image | `loading` | `lazy` |
| Priority load | `fetchpriority` | `high` |
| ARIA role | `role` | `button`, `navigation`, etc. |
| Custom tracking | `data-analytics` | "your-id" |
| Form autocomplete | `autocomplete` | `email`, `name`, `tel` |
| Open in new tab | `target` | `_blank` |

---

**Ready to optimize your WordPress site?** Open the block editor and start adding custom attributes! 🚀
