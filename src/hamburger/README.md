# Hamburger Menu Block

An animated hamburger menu toggle button for WordPress Gutenberg with extensive animation styles and optional text labels.

## Overview

The Hamburger Menu block provides a professional, accessible menu toggle button with 29 different animation styles from the Hamburgers library. The block supports optional text labels that can display different text for open and closed states, making it perfect for navigation menus and toggleable content.

## Features

### Animation Styles (29 Options)

All 29 animations from the [Hamburgers](https://github.com/jonsuh/hamburgers) library:
- 3D X / 3D X Reverse
- 3D Y / 3D Y Reverse
- 3D XY / 3D XY Reverse
- Arrow / Arrow Reverse
- Arrow Alt / Arrow Alt Reverse
- Arrow Turn / Arrow Turn Reverse
- Boring (default)
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

### Optional Text Labels

- **Show/Hide Toggle** - Enable or disable text labels
- **Customizable Text** - Different text for each state
  - Default text when menu is closed (e.g., "Menu")
  - Active text when menu is open (e.g., "Close")
- **Label Position** - Contained inside button element for flexible styling
- **Smooth Transitions** - 0.3s fade transition between states

### Customization Options

#### Hamburger Settings Panel
- **Animation Style** - Dropdown with all 29 animation styles
- **ARIA Controls ID** - Associate button with controlled menu element

#### Label Settings Panel
- **Show Label** - Toggle to display text alongside icon
- **Default Label Text** - Text shown when menu is closed
- **Active Label Text** - Text shown when menu is open

### Frontend Features

- Click to toggle active state
- Adds `is-active` class to button
- Adds `menu-is-active` class to body element
- Automatic ARIA attribute updates
- Label text automatically switches on toggle
- Compatible with any menu/navigation system

### Accessibility

- **ARIA Labels** - Dynamic `aria-label` updates to match current state
- **ARIA Expanded** - Toggles between "true"/"false" to announce menu state
- **ARIA Controls** - Associates button with controlled menu element via ID
- **ARIA Hidden** - Visible label marked `aria-hidden="true"` to prevent duplicate announcements
- Screen reader friendly with proper state announcements

## File Structure

```
/src/hamburger/
├── block.json          # Block configuration and attributes
├── edit.js             # Block editor component
├── save.js             # Save function (returns null for dynamic block)
├── render.php          # PHP render template
├── style.scss          # Frontend styles
├── editor.scss         # Editor-specific styles
├── view.js             # Frontend JavaScript
├── index.js            # Block registration
└── README.md           # This file
```

## Attributes

```json
{
  "label": "string (default: 'Menu') - Legacy attribute",
  "icon": "string (default: 'menu') - Legacy attribute",
  "hamburgerClass": "string (default: 'hamburger--boring') - Animation style class",
  "ariaControls": "string (default: '') - ID of controlled element",
  "showLabel": "boolean (default: false) - Enable text label display",
  "labelText": "string (default: 'Menu') - Text when closed",
  "labelTextActive": "string (default: 'Close') - Text when open"
}
```

## Usage Examples

### Basic Usage

Add the Hamburger Menu block to your template or page. The default settings provide a classic "boring" animation hamburger menu icon.

### Select Animation Style

1. Click the block to select it
2. In the Block Inspector sidebar, open "Hamburger Settings"
3. Choose from 29 animation styles in the dropdown
4. Preview the animation by clicking the button in the editor

### With ARIA Controls

1. In "Hamburger Settings", enter the ID of your menu element in "ARIA Controls ID" (e.g., "main-navigation")
2. The button will automatically set `aria-controls` attribute
3. ARIA states (`aria-expanded`) will be managed automatically on toggle

### With Text Labels

1. In the Block Inspector sidebar, open "Label Settings"
2. Enable "Show Label" toggle
3. Customize the default text (shown when closed) - default: "Menu"
4. Customize the active text (shown when open) - default: "Close"
5. Labels will appear inside the button alongside the hamburger icon

## HTML Output

### Without Label
```html
<div class="wp-block-prolific-hamburger">
  <button class="hamburger hamburger--boring"
          type="button"
          aria-label="Menu"
          aria-expanded="false">
    <span class="hamburger-box">
      <span class="hamburger-inner"></span>
    </span>
  </button>
</div>
```

### With Label
```html
<div class="wp-block-prolific-hamburger">
  <button class="hamburger hamburger--boring"
          type="button"
          aria-label="Menu"
          aria-expanded="false">
    <span class="hamburger-box">
      <span class="hamburger-inner"></span>
    </span>
    <span class="hamburger-label" aria-hidden="true">
      <span class="hamburger-label-text">Menu</span>
      <span class="hamburger-label-text hamburger-label-text-active is-hidden">Close</span>
    </span>
  </button>
</div>
```

## CSS Classes

The block applies the following classes:
- `.hamburger` - Base button class
- `.hamburger--{style}` - Animation style (e.g., `.hamburger--elastic`)
- `.is-active` - Active state (toggled on click)
- `.hamburger-label` - Label container
- `.hamburger-label-text` - Label text elements
- `.is-hidden` - Hidden state for inactive label text

Body class:
- `.menu-is-active` - Added to `<body>` when hamburger is active

## Custom Styling

The label is contained inside the button element, making it easy to style:

```css
/* Style the button with label */
.hamburger:has(.hamburger-label) {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

/* Style the label text */
.hamburger-label {
  font-size: 1rem;
  font-weight: 600;
  color: inherit;
}

/* Style active state */
.hamburger.is-active {
  color: #ff0000;
}
```

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
- CSS `:has()` selector for conditional label styling (graceful degradation in older browsers)
- CSS transitions support

## Technical Details

### JavaScript Behavior (`view.js`)

On click, the hamburger button:
1. Toggles `is-active` class on the button
2. Toggles `menu-is-active` class on the body element
3. Updates `aria-expanded` attribute
4. If label exists, toggles visibility of label texts
5. Updates `aria-label` to match the currently visible text

### CSS Implementation

Uses modern CSS `:has()` pseudo-class to conditionally apply flexbox:
```scss
.hamburger:has(.hamburger-label) {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}
```

Label text switching uses absolute positioning to prevent layout shift:
```scss
.hamburger-label-text.is-hidden {
  opacity: 0;
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
}
```

## Credits

- Hamburger animations from [hamburgers](https://github.com/jonsuh/hamburgers) by Jonathan Suh (v1.2.1)
- Developed by Prolific Digital

## License

GPL-2.0-or-later
