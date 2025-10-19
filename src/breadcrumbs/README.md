# Breadcrumbs Block

Display a breadcrumb navigation trail showing users their current location within your site's hierarchy. Improves navigation and SEO.

## Features

- **Automatic Trail Generation** - Dynamically builds breadcrumb path based on current page
- **7 Divider Styles** - Choose from multiple separator styles
- **Smart Hierarchy Detection** - Handles pages, posts, categories, and custom post types
- **Customizable Labels** - Configure home link text
- **SEO Friendly** - Semantic HTML with proper schema markup
- **Fully Responsive** - Adapts to all screen sizes
- **Styling Support** - Full color, typography, and spacing controls

## Getting Started

### Adding Breadcrumbs

1. Click the **+** button to add a new block
2. Search for "Breadcrumbs" in the block inserter
3. Select the **Breadcrumbs** block from the Prolific category
4. The breadcrumb trail displays automatically based on current page

### Preview in Editor

The editor shows a preview with example breadcrumbs:
- Home → Parent Page → Current Page

The actual breadcrumb trail will display dynamically on the frontend based on the page being viewed.

## Block Settings

Access settings through the inspector panel (right sidebar) when the block is selected.

### Breadcrumb Settings Panel

**Divider Style**
- Choose the separator between breadcrumb items
- 7 options available:
  - `/` - Slash (default)
  - `>` - Arrow
  - `»` - Double Arrow
  - `|` - Pipe
  - `·` - Dot
  - `→` - Right Arrow
  - `-` - Dash

**Show Home Link**
- Toggle: Display/hide link to homepage
- Enabled by default
- First item in breadcrumb trail
- Links to site homepage

**Home Label**
- Text field: Customize homepage link text
- Default: "Home"
- Common alternatives: "Homepage", site name, house icon
- Only visible when "Show Home Link" is enabled

**Show Current Page**
- Toggle: Display/hide current page in trail
- Enabled by default
- Appears as non-clickable text at end of trail
- Helps users understand where they are

## Toolbar Controls

**Alignment**
- Wide: Extends beyond content width
- Full: Full viewport width, edge to edge
- Default: Standard content width

## Block Supports

The breadcrumbs block supports WordPress core features:

### Color Settings
- **Text Color**: Change breadcrumb text color
- **Background Color**: Add background to breadcrumb area
- **Link Color**: Customize link colors

### Typography Settings
- **Font Size**: Adjust text size
- **Line Height**: Control vertical spacing

### Spacing Settings
- **Padding**: Inner spacing around breadcrumbs
- **Margin**: Outer spacing around block

## Breadcrumb Trail Examples

### Regular Page Hierarchy
```
Home > About > Our Team
```

### Blog Post
```
Home > News > Category Name > Post Title
```

### Custom Post Type with Archive
```
Home > Products > Product Name
```

### Nested Pages
```
Home > Services > Web Design > Portfolio
```

### Category Archive
```
Home > Category: Web Development
```

### Search Results
```
Home > Search Results for: wordpress
```

## How Breadcrumbs Are Generated

### For Pages
- Shows parent page hierarchy
- Example: Home → Parent → Child → Current Page

### For Blog Posts
- Shows category (if assigned)
- Example: Home → Category → Post Title

### For Custom Post Types
- Shows post type archive (if available)
- Example: Home → Products → Product Name

### For Archives
- Shows archive title
- Example: Home → Category Name
- Example: Home → Tag Name
- Example: Home → Author Name

### For Search Results
- Shows search query
- Example: Home → Search Results for: keyword

### For 404 Pages
- Shows error message
- Example: Home → 404 Not Found

## Placement Recommendations

### Common Locations

**Below Header**
- Place after site header/navigation
- Helps users understand location immediately
- Most common placement

**Above Page Title**
- Place before main content
- Good for blogs and documentation sites

**In Template Parts**
- Add to header template part
- Automatically appears on all pages

### Best Practices

**Consistent Placement**
- Use same location across your site
- Don't move breadcrumbs between pages

**Above the Fold**
- Keep breadcrumbs visible without scrolling
- Part of primary navigation

**One Per Page**
- Only use one breadcrumb block per page
- Multiple instances can confuse users and search engines

## SEO Benefits

### Search Engine Optimization

**Structured Data**
- Uses semantic HTML `<nav>` element
- Proper ARIA labels for accessibility
- List structure (`<ol>` and `<li>`)

**Internal Linking**
- Creates additional internal links
- Helps search engines understand site structure
- Improves crawlability

**User Experience Signals**
- Reduces bounce rate
- Increases pages per session
- Better user engagement metrics

**Google Search Results**
- May appear in search result snippets
- Shows site hierarchy in SERPs
- Improves click-through rates

## Styling Examples

### Minimalist Style
```
Settings:
- Divider: /
- Text Color: #666
- Background: Transparent
- Font Size: 14px
```

### Highlighted Style
```
Settings:
- Divider: >
- Background Color: #f5f5f5
- Padding: 12px 20px
- Border Radius: 4px (via Additional CSS)
```

### Accent Color Style
```
Settings:
- Divider: →
- Link Color: Your theme color
- Current Page: Bold weight
- Font Size: 15px
```

## Accessibility

### Built-in Features

**ARIA Labels**
- `aria-label="Breadcrumbs"` on navigation
- `aria-current="page"` on current page

**Semantic HTML**
- Proper `<nav>` landmark
- Ordered list structure
- Clear link text

**Keyboard Navigation**
- All links focusable
- Visual focus indicators
- Logical tab order

### Best Practices

**Link Text**
- Use descriptive page titles
- Avoid generic text like "Click here"
- Keep labels concise

**Visual Separation**
- Dividers use `aria-hidden="true"`
- Don't rely solely on color
- Maintain good contrast ratios

## Responsive Behavior

### Mobile Optimization

**Automatic Adjustments**
- Smaller font size on mobile
- Reduced spacing on narrow screens
- Text wraps to multiple lines if needed

**Considerations**
- Long page titles may wrap
- Consider shorter "Home" label on mobile
- Test on actual devices

## Customization

### Custom CSS Examples

**Add Border**
```css
.wp-block-prolific-breadcrumbs {
  border: 1px solid #ddd;
  padding: 12px 20px;
  border-radius: 4px;
}
```

**Change Divider Color**
```css
.breadcrumb-divider {
  color: #999;
  opacity: 1;
}
```

**Hover Effects**
```css
.breadcrumb-item a:hover {
  color: #007cba;
  text-decoration: underline;
}
```

**Uppercase Style**
```css
.breadcrumbs-list {
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-size: 12px;
}
```

## Troubleshooting

### Breadcrumbs Not Showing
- Block doesn't display when only "Home" would show
- Requires at least 2 levels (Home + another page)
- Check "Show Home Link" is enabled

### Wrong Hierarchy
- Verify parent pages are set correctly
- Check post category assignments
- Ensure custom post type has archive enabled

### Styling Issues
- Check theme doesn't override breadcrumb styles
- Use browser inspector to identify conflicts
- Add custom CSS with higher specificity

### Missing on Some Pages
- Homepage doesn't show breadcrumbs by default
- Add block to template parts, not individual pages
- Use theme's template editor for site-wide placement

## Use Cases

### E-commerce Sites
```
Home > Shop > Category > Subcategory > Product
```
Helps customers navigate product hierarchies

### Documentation Sites
```
Home > Docs > Section > Article
```
Essential for multi-level documentation

### Blog/Magazine
```
Home > Blog > Category > Article
```
Helps readers find related content

### Corporate Websites
```
Home > About > Team > Team Member
```
Shows organizational structure

## Technical Details

- **Dynamic Rendering**: PHP-based, updates per page
- **Performance**: Minimal overhead, no JavaScript required
- **Caching**: Compatible with page caching plugins
- **Schema Ready**: Structured for schema markup plugins
- **RTL Support**: Works with right-to-left languages

## Integration Tips

### With SEO Plugins

**Yoast SEO**
- Use this block instead of Yoast breadcrumbs
- Or use both with different styling
- Test which appears in search results

**Rank Math**
- Compatible with Rank Math schema
- Can coexist with Rank Math breadcrumbs

### With Themes

**Block Themes**
- Add to header template part
- Use in site editor
- Reusable patterns for consistency

**Classic Themes**
- Add to page templates
- Use in widget areas
- Hook into theme actions

## Support

For issues or questions:
1. Check this documentation
2. Verify page hierarchy is correct
3. Test on different page types
4. Contact Prolific Digital support

---

**Version**: 1.0.0
**Last Updated**: October 2025
