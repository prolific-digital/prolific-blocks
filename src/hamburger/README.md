# Menu Icon Block

A versatile and feature-rich menu icon block for WordPress Gutenberg, offering multiple icon types, extensive animations, and comprehensive customization options.

## Overview

The Menu Icon block (formerly "Hamburger" block) provides a professional, accessible menu toggle button with support for various icon styles including hamburger, close (X), dots menus, grid, plus, and chevron icons. Each icon type comes with its own set of animations and full customization capabilities.

## Features

### Icon Types

1. **Hamburger (3 Lines)** - Classic hamburger menu icon with 29+ animation styles
2. **Close (X)** - X/Close icon with spin, collapse, and fade animations
3. **Dots Vertical (Kebab)** - 3 vertical dots with fade, scale, and slide animations
4. **Dots Horizontal (Meatballs)** - 3 horizontal dots with fade, scale, and slide animations
5. **Grid (3x3)** - 9-dot grid with morph and rotate animations
6. **Plus (+)** - Plus icon with rotate and morph to X animations
7. **Chevron (Arrow)** - Arrow/chevron with rotate up/down animations

### Customization Options

#### Icon Type Panel
- Radio control for selecting icon type
- Visual preview of selected icon in editor

#### Animation Panel
- Dynamic animation options based on icon type
- Animation speed control (100-1000ms)
- All 29 original hamburger animations preserved

#### Size & Spacing Panel
- Icon size: 16-80px (default: 32px)
- Icon thickness/stroke width: 1-6px (default: 2px)
- Line spacing for hamburger: 3-12px (default: 6px)

#### Colors Panel
- Theme color support (default)
- Custom icon color
- Custom hover color
- Custom active state color
- Full WordPress color palette integration

#### Accessibility Panel
- Customizable ARIA label (default: "Toggle menu")
- ARIA controls ID for associating with menu element
- Optional visible label with text customization
- Label position options (left, right, top, bottom)

### Frontend Features

- Click to toggle active state
- Keyboard support (Enter and Space keys)
- Escape key to close menu
- State persistence via sessionStorage
- Automatic controlled element visibility management
- Focus management and proper focus styles
- Custom event dispatching for integration
- Minimum 44x44px touch target size

### Accessibility

- Proper ARIA labels and roles
- ARIA-controls for associating with menu elements
- ARIA-expanded state management
- Keyboard navigation support
- Focus-visible styles
- Screen reader friendly

## File Structure

```
/src/menu-icon/
├── block.json          # Block configuration and attributes
├── edit.js             # Block editor component
├── save.js             # Save function (returns null for dynamic block)
├── render.php          # PHP render template
├── style.scss          # Frontend styles
├── editor.scss         # Editor-specific styles
├── view.js             # Frontend JavaScript
├── index.js            # Block registration with deprecation
└── README.md           # This file
```

## Attributes

```json
{
  "iconType": "string (default: 'hamburger')",
  "animationStyle": "string (default: 'hamburger--boring')",
  "animationSpeed": "number (default: 300)",
  "iconSize": "number (default: 32)",
  "iconThickness": "number (default: 2)",
  "lineSpacing": "number (default: 6)",
  "iconColor": "string (default: '')",
  "iconColorHover": "string (default: '')",
  "iconColorActive": "string (default: '')",
  "useThemeColors": "boolean (default: true)",
  "ariaLabel": "string (default: 'Toggle menu')",
  "ariaControls": "string (default: '')",
  "showLabel": "boolean (default: false)",
  "labelText": "string (default: 'Menu')",
  "labelPosition": "string (default: 'right')",
  "hamburgerClass": "string (deprecated, for backward compatibility)"
}
```

## Hamburger Animation Styles

All 29 original hamburger animations are preserved:

- 3D X / 3D X Reverse
- 3D Y / 3D Y Reverse
- 3D XY / 3D XY Reverse
- Arrow / Arrow Reverse
- Arrow Alt / Arrow Alt Reverse
- Arrow Turn / Arrow Turn Reverse
- Boring
- Collapse / Collapse Reverse
- Elastic / Elastic Reverse
- Emphatic / Emphatic Reverse
- Minus
- Slider / Slider Reverse
- Spin / Spin Reverse
- Spring / Spring Reverse
- Stand / Stand Reverse
- Squeeze
- Vortex / Vortex Reverse

## New Icon Animations

### Close Icon
- Spin - Rotates 180°
- Collapse - Scales in/out
- Fade - Opacity change

### Dots Icons
- Fade - Dots fade in/out
- Scale - Dots scale up/down
- Slide - Dots slide position

### Grid Icon
- Morph - Grid morphs to X shape
- Rotate - Grid rotates 90°

### Plus Icon
- Rotate - Rotates to X
- Morph - Morphs to X

### Chevron Icon
- Rotate Up - Arrow points up
- Rotate Down - Arrow points down

## Usage Examples

### Basic Usage

Add the Menu Icon block to your template or page. The default settings provide a classic hamburger menu icon.

### With ARIA Controls

1. Set the "ARIA Controls ID" to the ID of your menu element (e.g., "main-navigation")
2. The block will automatically toggle visibility of the controlled element
3. Proper ARIA states will be managed automatically

### Custom Colors

1. Disable "Use Theme Colors" in the Colors panel
2. Select custom colors for default, hover, and active states
3. Colors will be applied using CSS custom properties

### With Visible Label

1. Enable "Include Visible Label" in Accessibility panel
2. Enter your label text (e.g., "Menu")
3. Choose label position (left, right, top, bottom)

## CSS Custom Properties

The block uses CSS custom properties for easy theming:

```css
.menu-icon-button {
  --menu-icon-size: 32px;
  --menu-icon-thickness: 2px;
  --menu-icon-spacing: 6px;
  --menu-icon-animation-speed: 300ms;
  --menu-icon-color: currentColor;
  --menu-icon-color-hover: currentColor;
  --menu-icon-color-active: currentColor;
}
```

## JavaScript Events

The block dispatches a custom event when toggled:

```javascript
document.addEventListener('menuIconToggle', (event) => {
  console.log('Menu toggled:', event.detail);
  // event.detail contains: { button, isActive, controlsId }
});
```

## Backward Compatibility

The block includes a deprecation layer to automatically migrate old `prolific/hamburger` blocks to the new `prolific/menu-icon` namespace. All existing hamburger blocks will continue to work without any manual intervention.

### Migration

When WordPress detects an old hamburger block, it will:
1. Automatically migrate to the new menu-icon namespace
2. Preserve all existing settings and animations
3. Convert old attributes to the new structure
4. Maintain visual appearance and functionality

## Development

### Build Process

```bash
npm run build
```

### Watch Mode

```bash
npm run start
```

## Browser Support

- Modern browsers with ES6 support
- CSS Grid support for grid icon
- CSS Custom Properties support
- sessionStorage API support

## Version History

### Version 1.0.0
- Renamed from "Hamburger" to "Menu Icon"
- Added 6 new icon types (close, dots-vertical, dots-horizontal, grid, plus, chevron)
- Added comprehensive animation library for all icon types
- Enhanced customization with size, spacing, and color controls
- Improved accessibility with better ARIA support and keyboard navigation
- Added visible label option with positioning
- Implemented state persistence via sessionStorage
- Added controlled element visibility management
- Included deprecation support for backward compatibility

## Credits

- Original hamburger animations from [hamburgers](https://github.com/jonsuh/hamburgers) by Jonathan Suh
- Enhanced and extended by Prolific Digital

## License

GPL-2.0-or-later
