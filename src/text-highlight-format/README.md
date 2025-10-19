# Text Highlight Format Extension

A custom RichText format extension for the Prolific Blocks WordPress plugin that adds a "Highlight/Wrapper" format option to text-based blocks. This extension allows users to wrap selected text in a span tag for custom styling, appearing alongside Bold, Italic, Strikethrough, and other formatting options in the toolbar.

## Features

- **Toolbar Integration**: Appears in the RichText formatting toolbar of all text-based blocks
- **Keyboard Shortcut**: `Ctrl+Shift+H` (Windows/Linux) or `Cmd+Shift+H` (Mac)
- **5 Style Presets**: Highlight, Accent, Underline, Badge, and Custom
- **Advanced Controls**: Color pickers, typography options, and real-time preview
- **Popover Interface**: Intuitive popover with tabbed color controls
- **Full Customization**: Custom colors, font weight, font style, and text transform
- **Responsive**: Works seamlessly on desktop, tablet, and mobile
- **Accessible**: Keyboard navigation, ARIA labels, and screen reader support
- **Dark Mode**: Automatic dark mode adjustments
- **Print-Friendly**: Optimized print styles

## Compatible Blocks

The text highlight format works with any block that uses the RichText component, including:

- **core/paragraph** - Paragraphs
- **core/heading** - Headings (H1-H6)
- **core/list** - Lists
- **core/list-item** - List items
- **core/quote** - Quotes
- **core/pullquote** - Pull quotes
- Any custom block using RichText

## Installation

The format extension is automatically loaded when the Prolific Blocks plugin is active. No additional setup required.

### Build Files

The format is compiled into the following files:

```
build/text-highlight-format/
├── index.js           - Format registration and controls (8.8 KB)
├── index.css          - All styles (editor + frontend, 3.9 KB)
├── index-rtl.css      - RTL language support
├── block.json         - Metadata for build system
└── index.asset.php    - Dependency and version info
```

## Usage

### Basic Usage

1. **Select Text**: In any text block, select the text you want to highlight
2. **Click Highlight Button**: Click the brush icon in the formatting toolbar
3. **Text is Highlighted**: Selected text is wrapped with default yellow highlight
4. **Customize** (optional): Popover appears with style options

### Using Keyboard Shortcut

1. Select text in any text block
2. Press `Ctrl+Shift+H` (or `Cmd+Shift+H` on Mac)
3. Text is instantly highlighted with default style

### Removing Highlight

1. Place cursor in highlighted text or select it
2. Click the brush icon again (or press `Ctrl+Shift+H`)
3. Highlight format is removed

## Style Presets

### 1. Highlight (Default)
- Yellow background (#ffeb3b)
- Black text (#000)
- Subtle box shadow
- **Use case**: Emphasizing important text

```html
<span class="prolific-text-highlight" data-style="highlight" style="background-color: #ffeb3b; color: #000;">highlighted text</span>
```

### 2. Accent
- Theme primary color background
- White text (#fff)
- Medium padding
- **Use case**: Call-to-action text, key terms

```html
<span class="prolific-text-highlight" data-style="accent" style="background-color: #2196f3; color: #fff;">accented text</span>
```

### 3. Underline
- Colored bottom border
- No background
- Hover effect
- **Use case**: Subtle emphasis, links alternative

```html
<span class="prolific-text-highlight" data-style="underline" style="border-bottom: 2px solid #2196f3;">underlined text</span>
```

### 4. Badge
- Pill-shaped (border-radius: 999px)
- Theme primary background
- White text, medium weight
- Smaller font size
- **Use case**: Labels, tags, status indicators

```html
<span class="prolific-text-highlight" data-style="badge" style="background-color: #2196f3; color: #fff;">NEW</span>
```

### 5. Custom
- User-defined colors
- Custom typography
- Full control
- **Use case**: Brand-specific styling, unique designs

```html
<span class="prolific-text-highlight prolific-text-highlight--custom" style="background-color: #e91e63; color: #fff; font-weight: bold;">custom text</span>
```

## Popover Controls

When the format is active, a popover appears with the following controls:

### Style Preset Selector
- Quick buttons for all 5 presets
- Instant preview in editor
- Hover descriptions

### Color Pickers (Tabbed)

#### Background Tab
- Full color picker with alpha support
- Color indicator showing current color
- Clear color button

#### Text Tab
- Full color picker for text color
- Alpha channel support
- Visual color indicator

### Typography Options

- **Font Weight**: Normal, Bold, 600, 700, 800
- **Italic Toggle**: Normal or italic font style
- **Text Transform**: None, Uppercase, Lowercase, Capitalize

### Apply Button
- Saves all settings to the format
- Closes popover
- Updates immediately in editor and frontend

## Technical Details

### Format Registration

```javascript
registerFormatType('prolific/text-highlight', {
  title: 'Highlight Text',
  tagName: 'span',
  className: 'prolific-text-highlight',
  attributes: {
    'data-style': 'data-style',
    'style': 'style',
    'class': 'class'
  },
  edit: TextHighlightEdit
});
```

### HTML Output Structure

The format wraps selected text in a `<span>` tag with the following attributes:

```html
<span
  class="prolific-text-highlight [prolific-text-highlight--custom]"
  data-style="[preset-name]"
  style="[inline-css]"
>
  Selected text here
</span>
```

### Attributes Stored

- **class**: Base class `prolific-text-highlight` + optional `prolific-text-highlight--custom`
- **data-style**: Preset name (`highlight`, `accent`, `underline`, `badge`, `custom`)
- **style**: Inline CSS for colors and typography

### CSS Variables Support

The format uses WordPress theme color variables when available:

- `--wp--preset--color--primary`: Used for accent and badge presets
- `--wp--preset--color--secondary`: Used for hover states
- Falls back to default values if variables not available

## Styling

### Frontend Styles

All preset styles are defined in `editor.scss` (compiled to `index.css`). Key features:

- Smooth transitions (0.2s ease)
- Proper line height handling
- Responsive padding and sizing
- Print-friendly overrides
- Dark mode automatic adjustments

### Editor Styles

Additional editor-only styles:

- Subtle bottom indicator for all highlights
- Active state styling for toolbar button
- Hover effects for better UX
- Popover styling and positioning

### Customization

To customize styles, edit `/src/text-highlight-format/editor.scss` and rebuild:

```bash
npm run build
```

## Accessibility

The format extension follows WCAG 2.1 guidelines:

- **Keyboard Navigation**: Full keyboard support in popover
- **ARIA Labels**: Descriptive labels for all controls
- **Focus Indicators**: Visible focus outlines
- **Color Contrast**: Ensures sufficient contrast in presets
- **Screen Readers**: Announces format application and removal

## Browser Support

The format works in all modern browsers supported by WordPress:

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

## Performance

- **JavaScript Bundle**: 8.8 KB (minified)
- **CSS Bundle**: 3.9 KB (minified)
- **Dependencies**: WordPress core packages only
- **Load Time**: Negligible impact

## Troubleshooting

### Format Button Not Appearing

1. Ensure Prolific Blocks plugin is active
2. Clear browser cache and reload editor
3. Check browser console for JavaScript errors
4. Verify `build/text-highlight-format/` directory exists

### Styles Not Applying

1. Clear WordPress object cache
2. Hard refresh browser (Ctrl+Shift+R)
3. Check if `index.css` is enqueued in page source
4. Verify no theme CSS conflicts

### Popover Not Showing

1. Check if clicking toolbar button toggles format
2. Verify contentRef is available
3. Check z-index conflicts with theme
4. Try disabling other plugins

### Colors Not Saving

1. Ensure you click "Apply Style" button
2. Check browser console for errors
3. Verify format is active before changing colors
4. Try selecting text again and reapplying

## Development

### File Structure

```
src/text-highlight-format/
├── index.js                      - Format registration & controls
├── editor.scss                   - All styles (editor + frontend)
├── style.scss                    - (Kept for reference, not used)
├── text-highlight-format.php     - PHP enqueue & setup
├── block.json                    - Build system metadata
└── README.md                     - This file
```

### Building

```bash
# Development build with watch mode
npm run start

# Production build
npm run build
```

### Code Style

- **JavaScript**: ES6+, React hooks
- **CSS**: SCSS with BEM-like naming
- **PHP**: WordPress coding standards
- **Comments**: JSDoc for functions

## Future Enhancements

Potential features for future versions:

- [ ] Animation effects (fade, slide, bounce)
- [ ] Gradient backgrounds
- [ ] Icon integration before/after text
- [ ] Saved custom presets
- [ ] Copy/paste style between highlights
- [ ] Keyboard-only color adjustment
- [ ] More preset templates
- [ ] Export/import style presets

## Support

For issues, questions, or feature requests:

1. Check the troubleshooting section above
2. Review WordPress and plugin documentation
3. Contact Prolific Digital support

## Changelog

### Version 1.0.0
- Initial release
- 5 style presets (Highlight, Accent, Underline, Badge, Custom)
- Full color customization
- Typography controls
- Keyboard shortcut support
- Responsive design
- Accessibility features
- Dark mode support
- Print styles

## Credits

- **Developer**: Prolific Digital
- **Format API**: WordPress Core Team
- **Components**: @wordpress/components
- **Icons**: @wordpress/icons

## License

GPL-2.0-or-later

---

**Made with by Prolific Digital**
