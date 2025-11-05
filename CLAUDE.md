# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Prolific Blocks is a WordPress plugin that extends the block editor with advanced custom blocks. The plugin includes multiple blocks covering various functionality: layout, navigation, media, utilities, and social features. All blocks are built using modern WordPress block development practices with React/JSX and the WordPress Scripts build tooling.

### Available Blocks

**Layout & Display:**
- Carousel (with Carousel Slide child blocks) - Swiper.js-based image/content carousel (v1)
- Carousel New (with Carousel New Slide child blocks) - Enhanced Swiper.js carousel with advanced controls
- Tabs (with Tabs Panel child blocks) - Original tabbed content organization
- Tabbed Content (with Tabbed Content Panel child blocks) - Advanced tabs with flexible positioning and mobile options
- Timeline (with Timeline Item child blocks) - Vertical event timeline with customizable styling

**Navigation:**
- Hamburger Menu - Animated hamburger toggle button with optional text labels and 29 animation styles
- Breadcrumbs - Auto-generated breadcrumb navigation
- Table of Contents - Dynamic TOC from page headings (H1-H6) with filtering and scroll offset
- Anchor Navigation - Horizontal jump-link menu with sticky support and scroll offset

**Media & Content:**
- Lottie Animation - @lottiefiles/dotlottie-web based animations with comprehensive playback controls
- Icon - 120+ Font Awesome icons with customization
- SVG - Upload SVG files with rotation and flip controls (displays original SVG colors)
- PDF Viewer - Native inline PDF display
- Responsive Image - Device-specific images (desktop/tablet/mobile) with HTML5 picture element
- Social Sharing - Share buttons for major platforms with native style variations
- Charts - D3.js-powered data visualizations with multiple chart types

**Utilities:**
- Countdown Timer - Event/promotion countdowns with evergreen mode and native style variations
- Reading Time Indicator - Auto-calculated from post content with Font Awesome icons
- Weather - National Weather Service API integration with current and forecast data

**Text Formatting:**
- Text Highlight Format - RichText format extension for highlighting text with customizable background

**Query Blocks:**
- Query Posts - Advanced query block with post type selection, taxonomy filters, carousel mode, AJAX search/filters, and multiple display modes (Grid/List/Masonry/Carousel)

**Disabled Extensions:**
- Query Loop Carousel - Disabled (replaced by Query Posts block with superior functionality)

## Development Commands

### Building
- `npm run build` - Production build of all blocks
- `npm start` - Development build with watch mode and hot reload

### Code Quality
- `npm run lint:js` - Lint JavaScript/JSX files
- `npm run lint:css` - Lint SCSS/CSS files
- `npm run format` - Format code using wp-scripts formatter

### Plugin Distribution
- `npm run plugin-zip` - Create distributable plugin ZIP file

### Package Management
- `npm run packages-update` - Update WordPress packages to latest compatible versions

## Architecture

### Block Structure
Each block follows a consistent structure in `src/[block-name]/`:
- `block.json` - Block metadata, attributes, and asset registration
- `index.js` - Block registration entry point
- `edit.js` - Block editor component (React)
- `save.js` - Saved output (usually returns null for dynamic blocks)
- `render.php` - Server-side rendering for dynamic blocks
- `view.js` - Frontend JavaScript for interactivity
- `style.scss` - Frontend styles (loaded in both editor and frontend)
- `editor.scss` - Editor-only styles

### Parent-Child Block Relationships
- **Carousel** (`prolific/carousel`) contains **Carousel Slide** (`prolific/carousel-slide`)
- **Carousel New** (`prolific/carousel-new`) contains **Carousel New Slide** (`prolific/carousel-new-slide`)
- **Timeline** (`prolific/timeline`) contains **Timeline Item** (`prolific/timeline-item`)
- **Tabs** (`prolific/tabs`) contains **Tabs Panel** (`prolific/tabs-panel`)
- **Tabbed Content** (`prolific/tabbed-content`) contains **Tabbed Content Panel** (`prolific/tabbed-content-panel`)

Use `useInnerBlocksProps` for parent blocks and appropriate `allowedBlocks` restrictions.

**Context Sharing:** Parent blocks can share data with child blocks using `providesContext` and `usesContext`:
```json
// In parent block.json
"providesContext": {
    "prolific/tabbedContent/blockId": "blockId",
    "prolific/tabbedContent/tabs": "tabs"
}
// In child block.json
"usesContext": ["prolific/tabbedContent/blockId", "prolific/tabbedContent/tabs"]
```

### PHP Rendering Pattern
Dynamic blocks use `render.php` files with helper functions:
- `pb_carousel_get_attribute($attributes, $name)` - Safely retrieve attribute values
- `pb_carousel_camel_to_kebab($string)` - Convert camelCase to kebab-case for HTML attributes
- `pb_carousel_sanitize_svg($svg)` - Sanitize SVG content to prevent XSS (used in Carousel block)

Helper functions are prefixed with `pb_[block]_` or `prolific_[block]_` and defined in individual render.php files.

**IMPORTANT - Function Redeclaration Prevention:**
All helper functions in render.php files MUST be wrapped with `if (!function_exists())` checks to prevent fatal errors when multiple instances of the same block appear on a page:

```php
if (!function_exists('prolific_toc_slugify')) {
    function prolific_toc_slugify($text) {
        // Function implementation
    }
}
```

This pattern is critical for blocks like Table of Contents, Reading Time, and any block with helper functions in render.php.

### Build Output
Source files in `src/` compile to `build/` directory:
- JavaScript bundles
- CSS files
- PHP render templates (copied as-is)
- `.asset.php` files with dependencies (auto-generated)

### Plugin Initialization
Main plugin file `prolific-blocks.php`:
- Registers all blocks via `register_block_type()` pointing to `build/` directories
- Creates custom "Prolific" block category
- Enables JSON, Lottie, and SVG file uploads via `upload_mimes` filter
- Configures GitHub-based automatic updates using Plugin Update Checker library
- Conditionally loads Swiper.js library only when Carousel block is present

### Global Block Enhancements
The plugin includes a **Global Custom HTML Attributes** feature (`src/global-attributes/`) that extends ALL WordPress blocks:
- Appears in the **Advanced** section of block inspector controls (bottom of sidebar)
- Uses `InspectorAdvancedControls` instead of `InspectorControls` for proper placement
- No nested PanelBody - controls live directly in Advanced section
- Allows adding custom attributes for accessibility (aria-*, role), SEO (rel), and performance (loading, fetchpriority)
- Helps pass Lighthouse audits and improve accessibility scores
- Includes security features: blocks dangerous attributes (onclick, onerror), sanitizes values, prevents XSS
- Uses WordPress hooks: `blocks.registerBlockType`, `editor.BlockEdit`, `blocks.getSaveContent.extraProps`
- See `GLOBAL-ATTRIBUTES-DOCUMENTATION.md` for full details

### External Dependencies
- **Swiper.js** - Carousel functionality (v11.1.9), registered separately via `enqueue_swiper_scripts()`
- **@lottiefiles/dotlottie-web** - Lottie animation player (v0.30.2)
- **D3.js** - Data visualization library for Charts block (v7.9.0)
- **Hamburgers** - Hamburger button animations (v1.2.1)
- **@wordpress/scripts** - Build tooling (v27.9.0)
- **Font Awesome 6** - Icon library (inline SVG paths in Icon, Reading Time, and SVG blocks - no external dependency)
- **National Weather Service API** - Weather data (free, no API key required)

### SVG Security
The Carousel block allows custom SVG navigation icons. All SVG content is sanitized through `pb_carousel_sanitize_svg()` which:
- Removes script tags and JavaScript event handlers
- Filters dangerous attributes (javascript:, data: URLs)
- Whitelists specific SVG elements and attributes
- Uses DOMDocument for robust parsing

### Auto-Update System
Plugin uses YahnisElsts\PluginUpdateChecker library (`updater/` directory) to:
- Check GitHub releases for new versions
- Display update notifications in WordPress admin
- Support release assets for distribution

## File Upload Configuration

The plugin enables uploading of non-standard file types:
- `.json` files (for Lottie animations) - `prolific-blocks.php:113-117`
- `.lottie` files - `prolific-blocks.php:119-123`
- `.svg` files - `inc/helpers.php:12-16`

## Common Patterns & Best Practices

### Native Style Variations Pattern
**IMPORTANT:** When adding style/layout options to blocks, use WordPress native "styles" instead of custom SelectControl dropdowns:

**In block.json:**
```json
"styles": [
    { "name": "default", "label": "Default", "isDefault": true },
    { "name": "filled", "label": "Filled" },
    { "name": "outlined", "label": "Outlined" }
]
```

**Benefits:**
- Appears in block toolbar (more discoverable)
- Consistent with WordPress core blocks
- No custom JavaScript needed for UI
- WordPress handles the UI automatically
- Uses `.is-style-{name}` CSS classes

**Blocks using this pattern:**
- Social Sharing (Outlined, Filled, Minimal)
- Countdown Timer (Grid, Inline, Stacked)
- Anchor Navigation (Pills, Underline, Bordered, Minimal)

**Do NOT create custom layout/style dropdowns in InspectorControls** - use native styles instead.

### Icon Picker Component
The Icon block implements a reusable icon picker pattern with:
- Searchable icon grid modal
- Category tabs (All, Social, UI & Controls, Arrows, Business, Media, E-commerce, Communication, Other)
- 120+ Font Awesome icons as inline SVG paths
- `AnglePickerControl` for rotation dial (not `SelectControl`)

### Sticky Navigation
Anchor Navigation block uses CSS `position: sticky` with Intersection Observer for smooth sticky behavior:
```scss
&.is-sticky {
    position: sticky;
    z-index: 1000;
    background: inherit;
    transition: box-shadow 0.3s ease;
}
```
Avoids JavaScript position toggling which causes page jumps.

### Countdown Timer
- Evergreen mode uses localStorage for per-visitor countdown
- Supports multiple layouts (inline, stacked, grid)
- CSS flexbox `order` property for proper separator positioning
- JavaScript interval scoping: declare `let countdownInterval` at function scope, not inside conditional

### Smooth Scrolling
For anchor/jump links, calculate offset including:
- Sticky nav height
- Sticky offset position
- Custom scroll offset
```javascript
const navHeight = isSticky ? navBlock.offsetHeight + stickyOffset : 0;
const offsetPosition = targetPosition - navHeight - scrollOffset;
```

### Dashicons in Editor
To display Dashicons in block editor, add to editor.scss:
```scss
.dashicons {
    font-family: dashicons;
    display: inline-block;
    // ... other dashicons properties
}
```

## Documentation

### Public-Facing Documentation
Complete user documentation for all 20 blocks is maintained in Notion:

**Main Documentation Page:**
- Edit URL: https://www.notion.so/prolificdigital/Prolific-Blocks-19f5efcd8c5f807f951ac38f50e90f0d
- Public URL: https://prolificdigital.notion.site/Prolific-Blocks-19f5efcd8c5f807f951ac38f50e90f0d?pvs=74

**Individual Block Pages:**
Each block has its own sub-page with comprehensive documentation including overview, features, use cases, settings guide, and best practices. All blocks link to this documentation via the SupportCard component.

**Local Documentation:**
- `BLOCK-DOCUMENTATION.md` - Complete markdown documentation for all blocks (source for Notion pages)
- `GLOBAL-ATTRIBUTES-DOCUMENTATION.md` - Documentation for Global Custom HTML Attributes feature

### SupportCard Component
Reusable component (`src/components/SupportCard.js`) that provides "Need help?" documentation links in all block inspector panels:
- Default URL points to main Notion documentation page
- Accepts optional `docUrl` prop for block-specific documentation
- Used by all 19 main custom blocks (Layout, Navigation, Media, Utility, Query blocks)
- Consistent card-based UI following WordPress design patterns

## Version Information

Current version: 1.0.0 (managed in both `package.json` and `prolific-blocks.php`)

When updating versions, update both files and create corresponding GitHub release for auto-update system.

## Block-Specific Notes

### Hamburger Menu
- **29 Animation Styles** - Full hamburgers library (v1.2.1) integration with styles like 3DX, Arrow, Collapse, Elastic, Spin, Squeeze, Vortex, etc.
- **Optional Text Labels** - Display customizable text alongside hamburger icon
  - Separate text for default and active states
  - Default text when menu is closed (e.g., "Menu")
  - Active text when menu is open (e.g., "Close")
  - Toggle to show/hide labels completely
- **HTML Structure** - Label is contained INSIDE the button element for styling control:
  ```html
  <button class="hamburger">
    <span class="hamburger-box">
      <span class="hamburger-inner"></span>
    </span>
    <span class="hamburger-label">
      <span class="hamburger-label-text">Menu</span>
      <span class="hamburger-label-text-active is-hidden">Close</span>
    </span>
  </button>
  ```
- **CSS Styling** - Uses `:has()` selector for conditional flexbox layout
  - Only applies flex layout when label is present: `.hamburger:has(.hamburger-label)`
  - Smooth opacity transitions (0.3s) between label states
  - Absolute positioning for hidden text prevents layout shift
- **Accessibility Features**:
  - `aria-label` dynamically updates to match visible text state
  - `aria-expanded` toggles between "true"/"false" to announce menu state
  - `aria-controls` to associate button with controlled menu element
  - `aria-hidden="true"` on visible label prevents duplicate screen reader announcements
- **Frontend Behavior** (`view.js`):
  - Toggles `is-active` class on button
  - Toggles `menu-is-active` class on body element
  - Switches label text visibility by toggling `.is-hidden` class
  - Updates ARIA attributes for screen reader support
- **Block Attributes** (`block.json`):
  - `hamburgerClass` - Animation style (default: "hamburger--boring")
  - `ariaControls` - ID of controlled element
  - `showLabel` - Enable/disable label display (default: false)
  - `labelText` - Default state text (default: "Menu")
  - `labelTextActive` - Active state text (default: "Close")

### Table of Contents
- Automatically generates from H1-H6 headings
- Uses `parse_blocks()` to extract heading blocks
- Auto-generates anchor IDs using slugify function
- Handles duplicate anchors with counter suffix
- Supports smooth scroll, collapsible, numbered lists

### Reading Time
- Calculates from `get_the_content()` word count
- Caches results using WordPress transients (1 hour)
- Includes image time calculation option
- Three rounding methods: round, ceil, floor

### Social Sharing
- Uses `esc_url()` for URLs, `rawurlencode()` for titles
- Platform-specific share URLs
- currentColor for themeable button styles
- WordPress Dashicons for platform icons

### Icon Block
- Font Awesome 6 Free Solid inline SVG paths
- No external CSS/font files needed
- All category filter for browsing all icons
- Search across all categories

### Countdown Timer
- Three layouts: inline, stacked, grid (grid default)
- Evergreen mode with localStorage
- Separator CSS order: label (1), number (2), separator (3)
- Expiry message with auto-hide option

### Anchor Navigation
- CSS sticky positioning (not JS fixed)
- Intersection Observer for stuck state detection
- Mobile responsive: horizontal scroll or stack
- Four style variations: pills, underline, bordered, minimal

### Tabbed Content
- Flexible tab positioning: top, bottom, left, right
- Mobile behavior options: stack, accordion, or same
- Customizable breakpoints for responsive behavior
- URL hash support for direct tab linking (#tab-id)
- localStorage option to remember last active tab
- Full keyboard navigation with Arrow keys
- Context API to share data between parent and child blocks
- Complete ARIA implementation for accessibility

### Responsive Image
- Device-specific images: desktop, tablet, mobile
- HTML5 `<picture>` element with responsive sources
- Customizable breakpoints for each device
- Independent dimensions for each image
- Aspect ratio locking per device
- Fallback chain: mobile→tablet→desktop
- Browser loads only appropriate image for screen size
- Device preview switcher in editor toolbar

### SVG Block
- Upload SVG files from media library
- Displays original SVG colors (no color manipulation)
- Rotation control (0-360° with angle picker)
- Horizontal and vertical flip toggles
- Width/height controls with multiple units (px, %, vw, vh, em, rem)
- Maintains aspect ratio by default
- Full alignment support
- Transform-only approach preserves SVG integrity

### Charts Block
- D3.js-powered data visualizations
- Multiple chart types: bar, line, pie, area, scatter
- Custom color schemes and individual data point colors
- Responsive sizing with customizable dimensions
- Legend, tooltips, and axis controls
- Animation support with easing functions
- Grid lines and data label options

### Weather Block
- National Weather Service API integration with comprehensive weather condition coverage
- **Data Caching:** WordPress transients with configurable refresh (hourly, daily, manual)
- **Font Awesome Icons:** Inline SVG icons for all weather conditions (no API images)
  - Intelligent icon mapping: sun, moon, clouds, rain, snow, thunderstorms, tornado, fog, wind
  - Temperature icons for hot/cold conditions, icicles for freezing rain
  - Smart night detection (shows moon instead of sun)
- **Location Display:**
  - Auto-fetched from NWS API (nearest weather station)
  - Custom location name override field to fix inaccurate API names
  - Toggle to show/hide location name completely
- **Three Display Modes:**
  - compact: Icon + temperature only (minimal inline)
  - current: Expanded weather card with all details
  - full: Current weather + horizontal scrollable forecast
- **Forecast Display:**
  - CSS-only horizontal scroll with snap points
  - Optional night forecasts (disabled by default)
  - Configurable number of forecast days
- **Customization:** Temperature units (F/C), show/hide toggles for humidity/wind/precipitation
- **Error Handling:** Helpful placeholders, error messages, empty states

### Reading Time Block
- Font Awesome SVG icons (book, clock, visibility/eye)
- Dynamic viewBox per icon: book/clock use 512x512, eye uses 576x512
- Icons defined locally (not imported from Icon block)
- `fill: currentColor` for proper color inheritance
- Icon display in both editor and frontend

### Carousel New Block
- Enhanced Swiper.js carousel with advanced controls
- **Navigation Buttons Always Grouped:** Prev/next buttons always wrapped in `.carousel-new-nav-buttons` div
- **Navigation Position Control:** Position navigation buttons (top/center/bottom) when not grouped
- **Control Grouping:** Option to group navigation and pagination together with `groupControls` attribute
- **Grouped Controls Position:** Place grouped controls on top or bottom of carousel
- **Grouped Controls Layouts:**
  - Split: `[← Prev] [Pagination] [Next →]` - arrows on sides, pagination center
  - Left: `[←→ Arrows] [Pagination]` - arrows grouped left, pagination right
  - Right: `[Pagination] [←→ Arrows]` - pagination left, arrows grouped right
- **Custom Navigation:** Upload SVG icons for prev/next buttons
- **Frontend Functionality (view.js):**
  - Triple-fallback Swiper initialization: immediate check, event listener, polling
  - Prevents race conditions between Swiper auto-init and script execution
  - Custom navigation buttons properly connected via `swiper.slidePrev()` / `slideNext()`
  - Pagination element targeting via `pagination-el` attribute
  - Duplicate prevention flag ensures features initialize only once
- **Swiper Configuration (render.php):**
  - Disables built-in Swiper navigation (`navigation="false"`)
  - Configures pagination with `pagination-el=".swiper-pagination"` for custom positioning
  - Data attributes for all settings (pagination type, autoplay, loop, etc.)
- Pagination styles display in editor preview (all types: bullets, fraction, progress bar)
- Responsive behavior on all screen sizes
- **CSS Classes for Styling:**
  - `.nav-position-{top|center|bottom}` - navigation positioning
  - `.pagination-position-{top|bottom}` - pagination positioning
  - `.grouped` - when controls are grouped
  - `.grouped-layout-{split|left|right}` - grouped layout style
  - `.grouped-position-{top|bottom}` - grouped controls position
- **Default Image Alignment:** Carousel New Slide blocks default to no alignment (not center) for flexibility

### Table of Contents Block
- **Scroll Offset Fix:** CSS `scroll-margin-top: 100px` + JavaScript offset for proper heading visibility
- **Heading Filter Logic:** All headings get unique IDs, but only filtered heading levels appear in TOC
- Duplicate heading support with proper ID numbering (hello, hello-2, hello-3)
- DOMDocument for parsing and ID generation
- Synchronized client and server-side ID generation

### Query Posts Block
- **Advanced Query Capabilities:** Post type selection, dynamic taxonomy filters, author filtering, post status
- **Display Modes:** Grid, List, Masonry, Carousel (Swiper.js integration)
- **Dynamic Taxonomy Filtering:**
  - Automatically detects hierarchical taxonomies for any custom post type
  - Filters show only taxonomies with `show_in_rest => true` and associated with selected post type
  - Multi-select terms with OR behavior in queries
  - Auto-clears filters when switching post types to prevent stale data
  - For standard posts: shows category/tags
  - For CPTs: auto-detects primary hierarchical taxonomies (e.g., location_category for places)
- **Carousel Integration:** Uses Swiper Element web component with responsive slides per view
  - Proper initialization via `Object.assign()` to swiper-container parameters
  - Data attributes for configuration (pagination type, autoplay, loop, etc.)
  - Reinitializes after AJAX operations (search, filter, load more)
  - **Custom Navigation Controls:** Similar to Carousel New block
    - Upload custom SVG icons for prev/next buttons
    - Navigation positioning (top/center/bottom)
    - Control grouping with 3 layout options (split/left/right)
    - Scrollbar support
  - **Smart Control Management:**
    - Detects presence of custom navigation elements
    - Automatically disables built-in Swiper controls when custom controls exist
    - Prevents duplicate navigation/pagination showing simultaneously
    - Proper pagination targeting for grouped vs non-grouped layouts
- **AJAX Features:** Search with debouncing, dynamic taxonomy filtering, date filtering, sort dropdown
- **Frontend Interactivity:** No page reload for search/filter operations
- **WP_Query Integration:** Server-side rendering with proper query args from attributes
- **Swiper Element Pattern:** Uses modern web component, not legacy Swiper API
- **Custom Navigation Setup (view.js):**
  - setupCustomNavigation() connects buttons to Swiper instance
  - Button state management with proper ARIA attributes
  - Loop detection for always-active navigation
  - Begin/end detection for disabling buttons at boundaries
- **Custom CPT Layouts:**
  - Extensible registry pattern for CPT-specific frontend layouts
  - **Places CPT (`places`):**
    - Label: Shows term from primary hierarchical taxonomy (e.g., "Park", "Facility") or falls back to "Place"
    - Fields: Title, excerpt, address (ACF - supports string/Google Maps/field groups), hours (ACF - supports string/array), read more
    - Address field handling: Automatically detects and formats Google Maps fields, field groups, or simple strings
  - **Events CPT (`tribe_events`):**
    - Label: Always shows "Event" (post type label)
    - Fields: Title, excerpt, date, time, venue (from The Events Calendar plugin functions), read more
  - Inline SVG icons for location (pin), time (clock), and dates (calendar)
  - BEM-style markup with `.entry-head` and `.entry-meta` groups
  - Automatic routing via `prolific_render_cpt_layout()` function
  - Filter hook `prolific_query_posts_cpt_registry` for adding new CPTs
  - Comprehensive accessibility: ARIA labels, focus states, semantic HTML
  - Dark mode support and responsive design built-in
  - Graceful fallbacks: Empty fields omitted, always shows a label even without terms
  - See `QUERY-POSTS-CPT-LAYOUTS.md` for full implementation guide
