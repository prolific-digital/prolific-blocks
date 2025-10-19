# SVG Block

A powerful SVG manipulation block for WordPress that allows users to upload SVG files and customize them with color changes, rotation, flipping, and sizing controls.

## Features

### SVG Upload & Management
- Upload SVG files from the WordPress media library
- Drag-and-drop SVG upload support
- Replace existing SVGs easily
- Remove SVGs with one click
- Preview SVG in the editor and inspector controls

### Color Manipulation
- Change SVG colors dynamically using a color picker
- Automatically replaces `fill` and `stroke` attributes
- Works with SVGs that have inline styles
- Applies colors to the entire SVG or specific elements
- Clear color button to reset to original

### Rotation Controls
- Rotate SVG by any angle using the angle picker
- Quick rotation buttons for common angles (0°, 90°, 180°, 270°)
- Smooth CSS transform animations
- Precise angle control with drag interface

### Flip Transformations
- Horizontal flip toggle
- Vertical flip toggle
- Can be used independently or together
- CSS-based transforms for optimal performance

### Sizing & Dimensions
- Width control with multiple units (px, %, vw, em, rem)
- Height control with multiple units (px, %, vh, em, rem)
- Maintain aspect ratio option (enabled by default)
- Responsive sizing support
- Max-width constraints for better mobile display

### Alignment & Layout
- Left, center, right alignment
- Wide and full-width alignment options
- Block-level alignment controls in toolbar
- Responsive alignment handling

### Accessibility
- Alt text field for screen readers
- ARIA label support
- Proper role attributes for images
- Keyboard navigation support
- Focus styles for accessibility

## Block Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `svgUrl` | string | "" | URL to the uploaded SVG file |
| `svgContent` | string | "" | Inline SVG content fetched from URL |
| `svgColor` | string | "" | Primary color override for SVG |
| `secondaryColor` | string | "" | Secondary color (reserved for future use) |
| `rotation` | number | 0 | Rotation angle in degrees |
| `flipHorizontal` | boolean | false | Horizontal flip state |
| `flipVertical` | boolean | false | Vertical flip state |
| `width` | number | 100 | Width value |
| `widthUnit` | string | "%" | Width unit (px, %, vw, em, rem) |
| `height` | number | 0 | Height value |
| `heightUnit` | string | "px" | Height unit (px, %, vh, em, rem) |
| `maintainAspectRatio` | boolean | true | Whether to maintain aspect ratio |
| `altText` | string | "" | Accessibility description |
| `alignment` | string | "center" | Block alignment |
| `mediaId` | number | 0 | WordPress media library ID |

## Inspector Controls

### SVG Settings Panel
- **SVG File**: Preview thumbnail with replace/remove buttons
- **Alt Text**: Accessibility description field

### Color Settings Panel
- **Primary Color**: Color picker with alpha support
- **Clear Color**: Reset button to remove color override

### Dimensions Panel
- **Width**: Unit control with multiple unit options
- **Maintain Aspect Ratio**: Toggle to lock proportions
- **Height**: Unit control (only visible when aspect ratio is unlocked)

### Transformations Panel
- **Rotation**: Angle picker with drag interface
- **Quick Rotation**: Buttons for 0°, 90°, 180°, 270°
- **Flip Horizontal**: Toggle for horizontal flip
- **Flip Vertical**: Toggle for vertical flip

## Usage Examples

### Basic SVG Upload
1. Add the SVG block to your page
2. Click "Upload an SVG file" or drag and drop an SVG
3. The SVG will be displayed inline with default settings

### Change SVG Color
1. Upload an SVG
2. Open the "Color Settings" panel in the inspector
3. Click the color picker and select your desired color
4. The SVG's fill and stroke colors will update automatically

### Rotate and Flip
1. Upload an SVG
2. Open the "Transformations" panel
3. Use the angle picker or quick rotation buttons to rotate
4. Toggle flip horizontal/vertical as needed

### Responsive Sizing
1. Upload an SVG
2. Open the "Dimensions" panel
3. Set width to "100" with unit "%"
4. Enable "Maintain Aspect Ratio" for responsive scaling

## Technical Details

### Color Manipulation
The block uses a sophisticated color replacement algorithm that:
- Replaces all `fill` attributes with the custom color
- Replaces all `stroke` attributes with the custom color
- Handles inline style attributes with `fill:` and `stroke:`
- Adds fill attribute to root SVG element if none exists

### Transforms
All transforms (rotation, flips) are applied via CSS `transform` property:
- Rotation: `rotate(Xdeg)`
- Horizontal flip: `scaleX(-1)`
- Vertical flip: `scaleY(-1)`
- Multiple transforms are combined in order

### SVG Loading
1. User selects SVG from media library
2. SVG URL is stored in `svgUrl` attribute
3. JavaScript fetches the SVG content via `fetch()` API
4. Content is stored in `svgContent` attribute
5. Content is rendered inline using `dangerouslySetInnerHTML`
6. Color manipulations are applied to the inline content

### Security
- SVG uploads are enabled via WordPress `upload_mimes` filter
- MIME type is properly validated
- Content is sanitized by WordPress media handling
- Inline rendering allows for color manipulation while maintaining security

## Browser Compatibility
- Modern browsers with SVG support
- CSS transforms support
- Flexbox layout support
- ES6 JavaScript features

## Performance
- SVG content is fetched once and cached in block attributes
- CSS transforms are hardware-accelerated
- No external dependencies for SVG manipulation
- Inline SVG for optimal rendering performance

## Styling Hooks

### CSS Classes
- `.wp-block-prolific-svg` - Main block wrapper
- `.prolific-svg-container` - Inner container with flexbox
- `.prolific-svg-wrapper` - SVG wrapper with transforms
- `.alignleft`, `.alignright`, `.aligncenter` - Alignment classes
- `.alignwide`, `.alignfull` - Wide/full alignment classes

### Custom Styling Example
```css
.wp-block-prolific-svg {
  /* Custom wrapper styles */
}

.wp-block-prolific-svg .prolific-svg-wrapper {
  /* Custom SVG wrapper styles */
}

.wp-block-prolific-svg svg {
  /* Custom SVG element styles */
}
```

## WordPress Support
- **Requires**: WordPress 6.3+
- **Requires PHP**: 7.4+
- **API Version**: 3
- **Block Registration**: Dynamic via `register_block_type()`

## File Structure
```
src/svg/
├── block.json          # Block metadata and configuration
├── index.js            # Block registration
├── edit.js             # Editor component
├── save.js             # Frontend save function
├── editor.scss         # Editor-only styles
├── style.scss          # Frontend and editor styles
└── README.md           # This file
```

## Support & Issues
For issues, feature requests, or contributions, please contact Prolific Digital.

## License
GPL-2.0-or-later
