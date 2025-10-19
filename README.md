# Prolific Blocks

**Version:** 1.0.0
**Requires at least:** WordPress 6.3
**Tested up to:** WordPress 6.7
**Requires PHP:** 7.4
**License:** GPL-2.0-or-later
**Author:** Prolific Digital

## Description

Prolific Blocks is a comprehensive WordPress plugin that extends the block editor with 28+ advanced custom blocks. From interactive carousels and weather displays to data visualizations and content management tools, Prolific Blocks provides everything you need to create engaging, professional websites without touching code.

## Key Features

- **28+ Custom Blocks** across 6 categories
- **Native WordPress Integration** - Built with modern WordPress block development standards
- **Font Awesome Icons** - Inline SVG icons (no external dependencies)
- **Responsive Design** - Mobile-optimized across all blocks
- **Accessibility** - ARIA labels, keyboard navigation, screen reader support
- **Performance Optimized** - Transient caching, conditional asset loading
- **Automatic Updates** - GitHub-based update system
- **No jQuery** - Modern vanilla JavaScript

## Available Blocks

### Layout & Display

#### Carousel & Carousel New
- Swiper.js-powered image/content carousels
- Responsive breakpoints (desktop, tablet, mobile)
- Custom navigation with SVG support
- Multiple transition effects (slide, fade, cube, flip, coverflow, cards)
- Autoplay with pause controls
- Full accessibility support

#### Tabbed Content
- Flexible tab positioning (top, bottom, left, right)
- Mobile behavior options (stack, accordion, same)
- URL hash support for direct tab linking
- localStorage for remembering active tab
- Full keyboard navigation
- ARIA implementation

#### Timeline
- Vertical event timeline
- Customizable styling per item
- Native scrolling animations
- Unlimited timeline items

### Navigation

#### Anchor Navigation
- Horizontal jump-link menu
- CSS sticky positioning
- Smooth scroll with offset control
- 4 style variations (pills, underline, bordered, minimal)
- Mobile responsive layouts

#### Breadcrumbs
- Auto-generated breadcrumb navigation
- Customizable separators and styling
- Schema.org markup for SEO

#### Table of Contents
- Dynamic TOC from H1-H6 headings
- Filterable heading levels
- Collapsible sections
- Numbered list support
- Smooth scroll with offset

#### Hamburger Menu
- Animated hamburger button (13 animation styles)
- Toggles 'active' class on body
- ARIA accessibility controls

### Media & Content

#### Weather
- National Weather Service API integration
- 3 display modes (compact, current, full)
- Font Awesome weather icons
- Horizontal scrollable forecast
- Location override and hide options
- Configurable caching (hourly/daily)

#### Lottie Animation
- @lottiefiles/dotlottie-web player
- Comprehensive playback controls
- Play on view/scroll triggers
- Marker selection
- Speed and direction controls

#### Charts
- D3.js-powered visualizations
- 5 chart types (bar, line, pie, area, scatter)
- Custom color schemes
- Responsive sizing
- Legend and tooltip controls

#### Icon
- 120+ Font Awesome icons
- Searchable by category
- Rotation control (0-360°)
- Size and color customization

#### SVG
- Upload SVG files
- Rotation and flip controls
- Maintains original colors
- Aspect ratio locking

#### PDF Viewer
- Native inline PDF display
- No external dependencies
- Responsive sizing

#### Responsive Image
- Device-specific images (desktop/tablet/mobile)
- HTML5 picture element
- Custom breakpoints
- Fallback chain

#### Social Sharing
- 7 style variations
- Major platforms supported
- currentColor theming
- Optimized share URLs

### Utilities

#### Countdown Timer
- Event/promotion countdowns
- Evergreen mode (localStorage)
- 3 native style variations
- Expiry message with auto-hide

#### Reading Time
- Auto-calculated from post content
- Font Awesome icons (book, clock, eye)
- Image time calculation option
- 3 rounding methods
- Transient caching

### Text Formatting

#### Text Highlight
- RichText format extension
- Customizable background color
- Inline text highlighting

### Query Blocks

#### Query Posts
- Advanced WP_Query interface
- Post type and taxonomy filters
- 4 display modes (Grid, List, Masonry, Carousel)
- AJAX search and filtering
- Swiper.js carousel integration
- No page reload

### Global Features

#### Custom HTML Attributes
- Adds "Advanced > Custom Attributes" to ALL blocks
- Support for aria-*, role, rel, loading, etc.
- Passes Lighthouse audits
- XSS protection and sanitization

## Installation

### From WordPress Dashboard

1. Navigate to **Plugins > Add New**
2. Click **Upload Plugin**
3. Select `prolific-blocks.zip`
4. Click **Install Now**
5. Click **Activate Plugin**

### Manual Installation

1. Download the plugin ZIP file
2. Extract to `/wp-content/plugins/prolific-blocks/`
3. Activate through the WordPress **Plugins** menu

## Configuration

### File Upload Settings

The plugin automatically enables uploads for:
- `.json` files (Lottie animations)
- `.lottie` files (Lottie animations)
- `.svg` files (SVG block)

### Swiper.js Library

The Swiper.js library (v11.1.9) is conditionally loaded only when Carousel or Query Posts blocks are present on a page.

### Weather API

The Weather block uses the National Weather Service API (no API key required). US locations only.

## Development

### Build Commands

- `npm run build` - Production build
- `npm start` - Development build with watch mode
- `npm run lint:js` - Lint JavaScript
- `npm run lint:css` - Lint CSS
- `npm run format` - Format code
- `npm run plugin-zip` - Create distribution ZIP

### Block Structure

Each block follows WordPress block development best practices:
- `block.json` - Block metadata
- `edit.js` - Editor component
- `save.js` - Saved output
- `render.php` - Dynamic rendering (when needed)
- `view.js` - Frontend JavaScript
- `style.scss` - Shared styles
- `editor.scss` - Editor-only styles

## Technical Details

### Dependencies

- **WordPress 6.3+**
- **PHP 7.4+**
- **@wordpress/scripts 27.9.0**
- **Swiper.js 11.1.9** (bundled, conditionally loaded)
- **@lottiefiles/dotlottie-web 0.30.2** (bundled)
- **D3.js 7.9.0** (bundled)
- **Hamburgers 1.2.1** (bundled)

### Performance

- Transient caching for API-based blocks (Weather, Reading Time)
- Conditional asset loading (Swiper.js only when needed)
- No jQuery dependency
- Optimized bundle sizes

### Accessibility

- ARIA labels and roles
- Keyboard navigation
- Screen reader support
- Focus management
- Semantic HTML

### Security

- SVG sanitization (XSS prevention)
- Input validation and escaping
- Nonce verification for AJAX
- WordPress coding standards

## Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

## Known Limitations

- Weather block: US locations only (National Weather Service API limitation)
- Query Loop Carousel: Disabled (use Query Posts block instead)

## Support

For bug reports, feature requests, or support:
- GitHub: https://github.com/prolific-digital/prolific-blocks
- Website: https://prolificdigital.com

## Changelog

### 1.0.0
- Initial public release
- 28 custom blocks
- Font Awesome integration
- Swiper.js carousel system
- Weather API integration
- D3.js charts
- Global custom attributes
- Comprehensive accessibility features

## Credits

Developed by Prolific Digital

**Third-Party Libraries:**
- Swiper.js - MIT License
- Font Awesome - Font Awesome Free License
- @lottiefiles/dotlottie-web - MIT License
- D3.js - ISC License
- Hamburgers - MIT License

## License

GPL-2.0-or-later
https://www.gnu.org/licenses/gpl-2.0.html
