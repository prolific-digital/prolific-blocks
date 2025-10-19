# Tabbed Content Block - Implementation Documentation

## Overview

A comprehensive tabbed content block system for the Prolific Blocks plugin with advanced features including multiple positioning options, mobile responsiveness, accessibility, and interactive behaviors.

## Block Structure

The implementation consists of two blocks:

### 1. Parent Block: `prolific/tabbed-content`
**Location:** `/src/tabbed-content/`

The main container block that manages tabs and controls the overall behavior.

### 2. Child Block: `prolific/tabbed-content-panel`
**Location:** `/src/tabbed-content-panel/`

Individual content panels that correspond to each tab.

## Features Implemented

### Tab Management
- ✅ Add, remove, and reorder tabs via Inspector Controls
- ✅ Each tab has a customizable label
- ✅ Each tab contains its own content via InnerBlocks
- ✅ Minimum 1 tab enforced
- ✅ Default: 2 tabs on initialization
- ✅ Up/down arrows to reorder tabs
- ✅ Remove button for each tab (disabled when only 1 tab remains)

### Tab Positioning
- ✅ **Top** - Tabs above content (default)
- ✅ **Bottom** - Tabs below content
- ✅ **Left** - Vertical tabs on left side
- ✅ **Right** - Vertical tabs on right side

### Tab Styles
- ✅ **Default** - Underline style with active tab indicator
- ✅ **Boxed** - Tabs look like connected boxes
- ✅ **Pills** - Rounded pill-shaped buttons
- ✅ **Minimal** - Simple text-only tabs

### Tab Alignment
- ✅ **Left** - Tabs aligned to the left
- ✅ **Center** - Tabs centered
- ✅ **Right** - Tabs aligned to the right
- ✅ **Justified** - Tabs spread across full width

### Mobile Responsiveness
- ✅ **Same as Desktop** - Keep layout unchanged on mobile
- ✅ **Stack Vertically** - Convert horizontal tabs to vertical on mobile
- ✅ **Accordion Style** - Convert to accordion on mobile with expandable sections
- ✅ Mobile breakpoint control (default: 768px, range: 320-1024px)

### Tab Behavior
- ✅ Click to switch tabs
- ✅ Keyboard navigation:
  - Arrow keys (Left/Right/Up/Down) - Navigate between tabs
  - Home - Jump to first tab
  - End - Jump to last tab
  - Tab key - Standard focus navigation
- ✅ URL hash support - Link to specific tabs via #tab-id
- ✅ Smooth CSS transitions between tabs
- ✅ Remember last active tab using localStorage
- ✅ Initial active tab selector

### Accessibility (ARIA)
- ✅ Proper `role="tablist"`, `role="tab"`, `role="tabpanel"` attributes
- ✅ `aria-selected` for active tabs
- ✅ `aria-controls` linking tabs to panels
- ✅ `aria-labelledby` linking panels to tabs
- ✅ `aria-hidden` for inactive panels
- ✅ Focus management for keyboard navigation
- ✅ Proper tabindex values

### Color & Typography Support
- ✅ Background color support
- ✅ Text color support
- ✅ Link color support
- ✅ Gradient support
- ✅ Font size control
- ✅ Line height control

### Spacing Support
- ✅ Margin controls
- ✅ Padding controls
- ✅ Block gap control

### Additional Features
- ✅ Block alignment (wide, full)
- ✅ Anchor support for deep linking
- ✅ Custom class names
- ✅ RTL (Right-to-Left) language support

## File Structure

### Parent Block (`tabbed-content`)
```
/src/tabbed-content/
├── block.json           - Block configuration and metadata
├── index.js            - Block registration and style import
├── edit.js             - Editor component (React)
├── save.js             - Frontend save function
├── editor.scss         - Editor-only styles
├── style.scss          - Frontend styles (and editor)
└── view.js             - Frontend JavaScript behavior
```

### Child Block (`tabbed-content-panel`)
```
/src/tabbed-content-panel/
├── block.json          - Block configuration and metadata
├── index.js            - Block registration and style import
├── edit.js             - Editor component (React)
├── save.js             - Frontend save function
├── editor.scss         - Editor-only styles
└── style.scss          - Frontend styles (and editor)
```

## Block Attributes

### Parent Block Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `blockId` | string | "" | Unique block identifier |
| `tabs` | array | [2 tabs] | Array of tab objects with id and label |
| `activeTab` | number | 0 | Index of currently active tab |
| `tabPosition` | string | "top" | Position of tabs (top/bottom/left/right) |
| `tabAlignment` | string | "left" | Horizontal alignment (left/center/right/justified) |
| `tabStyle` | string | "default" | Visual style (default/boxed/pills/minimal) |
| `mobileBreakpoint` | number | 768 | Screen width for mobile behavior (px) |
| `mobileBehavior` | string | "stack" | Mobile display mode (same/stack/accordion) |
| `enableUrlHash` | boolean | false | Enable URL hash navigation |
| `rememberTab` | boolean | false | Remember active tab in localStorage |

### Child Panel Block Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `tabId` | string | "" | Reference to parent tab ID |
| `panelIndex` | number | 0 | Index in parent tabs array |

## Context API

The parent block provides context to child panels:

```javascript
providesContext: {
  "prolific/tabbedContent/blockId": "blockId",
  "prolific/tabbedContent/tabs": "tabs",
  "prolific/tabbedContent/activeTab": "activeTab"
}
```

Child blocks consume this context:

```javascript
usesContext: [
  "prolific/tabbedContent/blockId",
  "prolific/tabbedContent/tabs",
  "prolific/tabbedContent/activeTab"
]
```

## Inspector Controls

### Tab Settings Panel
- Tab label input for each tab
- Reorder buttons (Up/Down arrows)
- Remove button for each tab
- "Add Tab" button

### Layout Settings Panel
- Tab Position selector
- Tab Alignment selector
- Tab Style selector
- Initial Active Tab selector

### Mobile Settings Panel
- Mobile Behavior selector
- Mobile Breakpoint range control

### Advanced Settings Panel
- Enable URL Hash Navigation toggle
- Remember Active Tab toggle

## Frontend JavaScript Behavior

The `view.js` file handles all frontend interactivity:

### Features:
1. **Tab Switching** - Click to activate tabs
2. **Keyboard Navigation** - Arrow keys, Home, End support
3. **URL Hash Navigation** - Read and update URL hash when enabled
4. **localStorage** - Save/restore active tab when enabled
5. **Mobile Accordion** - Convert to accordion on mobile when configured
6. **Focus Management** - Proper focus handling for accessibility

### Event Listeners:
- Tab click events
- Tab keyboard events (keydown)
- Window resize (for mobile behavior)
- Hash change (for URL navigation)

## Styling Architecture

### CSS Custom Properties
The blocks use CSS custom properties for themeable values, allowing easy customization:

- Color properties inherit from WordPress color system
- Spacing follows WordPress spacing scale
- Transitions use consistent timing functions

### Responsive Design
- Mobile-first approach
- Flexible layouts using Flexbox
- Media queries for breakpoint handling
- Touch-friendly button sizes

### Style Variations

#### Default Style
- Clean underline on active tab
- Subtle hover states
- Border bottom on tab container

#### Boxed Style
- Box-shaped tabs
- Connected to content area
- Background color differentiation

#### Pills Style
- Rounded pill buttons
- Solid background for active state
- Spaced apart with gaps

#### Minimal Style
- Text-only tabs
- No borders or backgrounds
- Font weight for active state

## Usage Examples

### Basic Usage
1. Add "Tabbed Content" block to your page
2. Configure tab labels in Inspector Controls
3. Add content to each panel using InnerBlocks
4. Adjust styling and positioning as needed

### Advanced Usage

#### Deep Linking with URL Hash
```
Enable "URL Hash Navigation" in Advanced Settings
Access specific tab: https://yoursite.com/page#tab-1
```

#### Persistent Tab Selection
```
Enable "Remember Active Tab" in Advanced Settings
Uses localStorage to remember user's last selected tab
```

#### Mobile Accordion
```
Set "Mobile Behavior" to "Accordion Style"
Adjust "Mobile Breakpoint" to your preferred width
Tabs convert to expandable accordion on mobile
```

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- IE11 support via CSS fallbacks
- Mobile browsers (iOS Safari, Chrome Mobile)
- Keyboard navigation support
- Screen reader compatible

## Performance Considerations

- CSS animations use transform/opacity for GPU acceleration
- JavaScript event delegation for efficiency
- Minimal DOM manipulation
- Lazy initialization (only when block present on page)
- LocalStorage access is debounced

## Accessibility Features

### Keyboard Navigation
- Full keyboard support without mouse
- Logical tab order
- Focus indicators
- Skip links compatibility

### Screen Readers
- Proper ARIA roles and attributes
- Meaningful labels
- State announcements
- Relationship semantics

### Visual Accessibility
- Sufficient color contrast
- Focus indicators
- No color-only information
- Scalable text

## Comparison with Existing Tabs Block

### Existing `prolific/tabs` block:
- Basic tab functionality
- Simple top-only positioning
- Limited styling options
- No mobile-specific behavior
- Basic accessibility

### New `prolific/tabbed-content` block:
- ✅ Advanced tab management
- ✅ 4 positioning options (top/bottom/left/right)
- ✅ 4 style variations
- ✅ 4 alignment options
- ✅ 3 mobile behaviors
- ✅ URL hash navigation
- ✅ localStorage support
- ✅ Full keyboard navigation
- ✅ Complete ARIA implementation
- ✅ Mobile accordion mode
- ✅ Customizable breakpoints

## Build Commands

### Development Build (with watch)
```bash
npm start
```

### Production Build
```bash
npm run build
```

## Integration

The blocks are registered in `/prolific-blocks.php`:

```php
register_block_type(__DIR__ . '/build/tabbed-content');
register_block_type(__DIR__ . '/build/tabbed-content-panel');
```

## Future Enhancement Possibilities

- Animation options (slide, fade, none)
- Icon support for tab labels
- Tab badges/notifications
- Lazy loading for tab content
- Drag-and-drop tab reordering in editor
- Vertical tab alignment options
- Custom tab template patterns
- Tab duplication feature
- Export/import tab configurations

## Credits

**Created for:** Prolific Blocks Plugin
**Block Name:** Tabbed Content
**Version:** 1.0.0
**API Version:** 3
**WordPress Version:** 6.3+
**PHP Version:** 7.4+

## Support

For issues or questions regarding this block implementation, please refer to the Prolific Digital support channels.
