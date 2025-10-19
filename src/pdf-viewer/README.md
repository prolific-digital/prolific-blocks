# PDF Viewer Block

Display PDF files inline on your WordPress pages with a fully configurable viewer. Upload PDFs directly from the WordPress Media Library and customize the viewing experience.

## Features

- **Media Library Integration**: Upload and select PDFs directly from WordPress
- **Multiple Display Methods**: Choose between embed, object, or iframe rendering
- **Configurable Dimensions**: Preset aspect ratios or custom height
- **Download Button**: Optional download button for visitors
- **Toolbar Controls**: Show/hide PDF toolbar and controls (iframe mode)
- **Responsive Design**: Mobile-friendly with breakpoint adjustments
- **Accessibility**: ARIA labels, alt text, and keyboard navigation
- **Browser Fallback**: Automatic fallback for unsupported browsers
- **Alignment Support**: Left, center, right, wide, and full width

## Installation

1. The block is automatically available after installing the Prolific Blocks plugin
2. Look for "PDF Viewer" in the block inserter under the "Prolific" category

## Usage

### Basic Setup

1. Add the PDF Viewer block to your page/post
2. Click "Upload PDF" or "Select from Library"
3. Choose a PDF file from your media library
4. The PDF will display immediately in the editor

### PDF Settings

**Upload/Select PDF**:
- Click "Upload PDF" to add a new PDF to your media library
- Click "Replace PDF" to choose a different PDF
- Click "Remove PDF" to clear the current selection

**Alternative Text**:
- Add descriptive text for screen readers
- Important for accessibility compliance
- Auto-filled with PDF filename if empty

### Display Settings

**Display Method**:
- **Embed (Most Compatible)**: Uses HTML `<embed>` tag, works in most browsers
- **Object (With Fallback)**: Uses `<object>` tag with download link fallback
- **Iframe (Toolbar Control)**: Uses `<iframe>` for advanced toolbar controls

**Aspect Ratio**:
- **16:9 (Widescreen)**: Best for presentations and wide documents
- **4:3 (Standard)**: Traditional aspect ratio
- **A4 (Document)**: Optimized for standard document size
- **Custom Height**: Set specific pixel height (300-1200px)

**Additional Options**:
- **Show Download Button**: Display a button below the PDF
- **Enable Fullscreen**: Allow PDF to open in fullscreen mode (browser dependent)

### Toolbar Settings (Iframe Mode Only)

When using the iframe display method, you can control:
- **Show Toolbar**: Display/hide the PDF viewer toolbar
- **Enable Zoom Controls**: Allow users to zoom in/out
- **Enable Page Navigation**: Show page navigation panel

**Note**: Toolbar controls may not work in all browsers and PDF viewers due to browser security policies.

## Block Supports

- **Alignment**: Left, center, right, wide, full
- **Spacing**: Padding and margin
- **Border**: Color, radius, style, and width

## Display Methods Explained

### Embed (Recommended)
```html
<embed src="file.pdf" type="application/pdf" width="100%" height="600px" />
```
- Most compatible across browsers
- Simple and reliable
- Limited control over viewer features
- Works in Chrome, Firefox, Safari, Edge

### Object (Fallback Support)
```html
<object data="file.pdf" type="application/pdf" width="100%" height="600px">
  <p>Browser doesn't support PDFs. <a href="file.pdf">Download</a></p>
</object>
```
- Provides fallback download link
- Better for older browsers
- Graceful degradation
- Accessibility friendly

### Iframe (Advanced Controls)
```html
<iframe src="file.pdf#toolbar=0&navpanes=0" width="100%" height="600px"></iframe>
```
- Allows toolbar customization via URL parameters
- More control over viewer appearance
- May have security restrictions in some browsers
- Best for modern browsers

## Aspect Ratios

| Ratio | Percentage | Best For |
|-------|-----------|----------|
| 16:9 | 56.25% | Presentations, wide documents |
| 4:3 | 75% | Traditional documents |
| A4 | 141.4% | Standard letter/document size |
| Custom | Variable | Specific height requirements |

## Mobile Behavior

On mobile devices (< 640px):
- Aspect ratios automatically adjust for better readability
- Download button becomes full width
- Increased padding for touch targets
- Responsive iframe/embed scaling

## Security

The block includes security measures:
- Only allows PDF mime type (`application/pdf`)
- Validates file extensions
- Uses WordPress `esc_url()` for URL sanitization
- Respects WordPress media upload permissions

## Styling

### Default Styles

The block includes:
- Clean container with rounded corners
- Light gray background
- Download button with brand colors
- Hover states and transitions
- Responsive grid layout

### Custom CSS Examples

**Dark theme**:
```css
.wp-block-prolific-pdf-viewer .pdf-viewer-container {
  background: #2c3e50;
}

.wp-block-prolific-pdf-viewer .pdf-download-button {
  background: #e74c3c;
}
```

**Remove background**:
```css
.wp-block-prolific-pdf-viewer .pdf-viewer-container {
  background: transparent;
  box-shadow: none;
}
```

**Increase height on mobile**:
```css
@media (max-width: 640px) {
  .wp-block-prolific-pdf-viewer .pdf-viewer-wrapper {
    min-height: 500px;
  }
}
```

## Browser Compatibility

### Desktop Support
- Chrome/Edge: Full support (all display methods)
- Firefox: Full support (all display methods)
- Safari: Full support (embed/object recommended)

### Mobile Support
- iOS Safari: Embed/Object work well, iframe may have limitations
- Chrome Mobile: Full support
- Firefox Mobile: Full support

### Toolbar Control Support
Toolbar parameters (`toolbar=0`, `zoom=100`, etc.) work reliably in:
- Adobe Acrobat Reader plugin
- Chrome/Edge built-in PDF viewer
- Firefox built-in PDF viewer

May not work in:
- Safari (ignores URL parameters)
- Mobile browsers (limited controls)

## Accessibility

- **ARIA Labels**: Proper labeling for assistive technologies
- **Alt Text**: Customizable description for screen readers
- **Keyboard Navigation**: Tab and arrow key support
- **Fallback Content**: Download link for unsupported browsers
- **Color Contrast**: WCAG AA compliant button styles

## Performance

- **Static Block**: Renders directly to HTML (fast)
- **No External Dependencies**: Pure HTML/CSS
- **Lazy Loading**: Browser-native PDF loading
- **Minimal JavaScript**: No heavy libraries required

## Known Limitations

1. **Browser PDF Viewers**: Appearance varies by browser's built-in PDF viewer
2. **Mobile Toolbar**: Limited toolbar control on mobile devices
3. **Large Files**: Very large PDFs may load slowly
4. **Safari Restrictions**: Safari ignores many iframe URL parameters
5. **Print Support**: Print functionality depends on browser implementation

## Best Practices

### For Best Performance
- Optimize PDFs before uploading (compress images, remove unnecessary data)
- Use appropriate aspect ratio for content type
- Enable download button for large documents

### For Accessibility
- Always add meaningful alternative text
- Test with screen readers
- Provide download option for users who prefer external viewers

### For Mobile Users
- Use A4 or 4:3 aspect ratio for documents
- Enable download button
- Test on actual mobile devices

## Troubleshooting

**PDF not displaying**:
- Verify file is actually a PDF (check mime type)
- Check file isn't corrupted
- Try different display method
- Clear browser cache

**Toolbar controls not working**:
- Switch to iframe display method
- Note that Safari doesn't support toolbar parameters
- Try in different browser

**Mobile issues**:
- Use embed or object method instead of iframe
- Reduce custom height for better mobile fit
- Enable download button as fallback

**Alignment issues**:
- Check block alignment setting
- Verify theme supports wide/full alignment
- Review custom CSS conflicts

## File Size Recommendations

- **Small**: < 1MB (fast loading, good for all connections)
- **Medium**: 1-5MB (acceptable for most users)
- **Large**: 5-10MB (consider splitting or providing download only)
- **Very Large**: > 10MB (provide download link instead of inline viewer)

## SEO Considerations

- PDFs are crawlable by search engines when embedded
- Proper alt text helps with accessibility and SEO
- Consider adding text summary above PDF for better indexing
- File name affects SEO (use descriptive names)

## Version

1.0.0

## License

GPL-2.0-or-later
