# Prolific Blocks WordPress Plugin

## Project Overview
This is a comprehensive WordPress Gutenberg blocks plugin that provides 9 custom blocks for enhanced content creation. The plugin uses @wordpress/scripts for building and development.

## Build Process
```bash
npm install
npm run build
```

## Development
```bash
npm run start
```

## Complete Blocks Documentation

### 1. Carousel Block (`prolific-blocks/carousel`)
- **Main Features:**
  - Image/content carousel with Swiper.js integration
  - Configurable autoplay with speed control (3000ms default)
  - Navigation arrows and pagination dots
  - Responsive breakpoints for different screen sizes
  - Loop functionality for continuous scrolling
  - Slides per view configuration (1-5 slides)
  - Space between slides customization
  - **✅ Autoplay on Hover** - Carousel starts playing when user hovers over it
    - Configurable transition speed (default: 2000ms)
    - Mutually exclusive with regular autoplay
    - Successfully implemented using polling-based approach for reliable Swiper integration
- **Icon:** slides
- **Attributes:** autoplay, autoplaySpeed, navigation, pagination, loop, slidesPerView, spaceBetween, breakpoints, autoplayOnHover, hoverTransitionSpeed

### 2. Carousel Slide Block (`prolific-blocks/carousel-slide`)
- **Purpose:** Child block for individual carousel content
- **Features:**
  - Works exclusively within carousel block structure
  - Supports any inner content blocks
  - Flexible content container for images, text, or mixed media
- **Icon:** format-image
- **Parent Block:** prolific-blocks/carousel

### 3. Hamburger Block (`prolific-blocks/hamburger`)
- **Purpose:** Mobile-friendly navigation toggle
- **Features:**
  - Customizable hamburger menu icon
  - Mobile menu toggle functionality
  - Responsive design integration
  - Click/tap interaction handling
- **Icon:** block-default
- **Attributes:** label (default: "Menu")

### 4. Lottie JS Block (`prolific-blocks/lottie-js`)
- **Purpose:** Advanced animation integration
- **Features:**
  - JSON animation file support
  - Lottie library integration for complex animations
  - Lightweight vector animations
  - Interactive animation controls
- **Icon:** block-default
- **Attributes:** label (default: "Menu")

### 5. Tabs Block (`prolific/tabs`)
- **Purpose:** Tabbed content organization
- **Features:**
  - Multi-tab content container
  - Default tab configuration (Tab 1, Tab 2)
  - Dynamic tab management
  - Nested content support via tabs-panel children
- **Icon:** block-default
- **Attributes:**
  - blockId (string)
  - tabs (array with label properties)

### 6. Tabs Panel Block (`prolific/tabs-panel`)
- **Purpose:** Individual tab content container
- **Features:**
  - Child block of tabs block
  - Dedicated content area for each tab
  - Supports any inner content blocks
  - Unique block identification
- **Icon:** block-default
- **Parent Block:** prolific/tabs
- **Attributes:** blockId (string)

### 7. Timeline Block (`prolific/timeline`)
- **Purpose:** Sequential content presentation
- **Features:**
  - Vertical timeline layout
  - Container for timeline items
  - Chronological content organization
  - Responsive timeline design
- **Icon:** block-default
- **Attributes:** label (default: "Menu")

### 8. Timeline Item Block (`prolific/timeline-item`)
- **Purpose:** Individual timeline entry
- **Features:**
  - Child block of timeline block
  - Individual timeline point/event
  - Customizable content for each timeline entry
  - Supports rich content within each item
- **Icon:** block-default
- **Parent Block:** prolific/timeline
- **Attributes:** label (default: "Menu")

### 9. Swiper Block (`prolific-blocks/swiper`)
- **Purpose:** Alternative carousel implementation
- **Features:**
  - Robust and flexible carousel functionality
  - Swiper.js integration
  - Alternative to main carousel block
  - Customizable carousel behavior
- **Title:** "Carousel Content"
- **Icon:** block-default

## Architecture Overview

### Block Structure
All blocks follow WordPress Gutenberg architecture:
- `block.json` - Block configuration, attributes, and metadata
- `edit.js` - Editor-side functionality and inspector controls
- `render.php` - Frontend HTML rendering (server-side)
- `view.js` - Frontend JavaScript functionality
- `style-index.css` - Frontend styles
- `index.css` - Editor styles

### Block Relationships
- **Parent-Child Blocks:**
  - `carousel` → `carousel-slide`
  - `tabs` → `tabs-panel`
  - `timeline` → `timeline-item`

### Key Features Across All Blocks
- Consistent branding under "prolific" category
- ARIA label support for accessibility
- Custom className support
- HTML editing disabled for security
- Proper textdomain for internationalization

## Recent Implementation Success

### ✅ Autoplay on Hover Feature (Completed)
Successfully implemented for the carousel block:
- **Problem Solved:** Swiper initialization failure due to complex attribute-based approach
- **Solution:** Simplified polling-based approach that reliably detects when Swiper is ready
- **Implementation:** Uses `setInterval` to check for `swiperContainer.swiper` availability
- **User Feedback:** "Great this works now" - confirmed working in production

### Technical Solutions Applied
1. **Swiper Integration**: Uses custom elements (`<swiper-container>`) with polling to ensure proper initialization
2. **Attribute Processing**: Proper JSON encoding and HTML escaping in render.php
3. **Mutual Exclusivity**: UI controls prevent conflicting autoplay modes
4. **Polling Approach**: Reliable alternative to event-driven initialization
5. **Block Organization**: Logical parent-child relationships for complex content structures

### Architecture Understanding Gained
The plugin follows WordPress Gutenberg block architecture:
- `render.php` - Frontend HTML rendering (server-side)
- `view.js` - Frontend JavaScript functionality
- `edit.js` - Editor-side functionality and controls
- Polling-based JavaScript is more reliable than event-driven for Swiper integration

## Development Notes
- Plugin uses @wordpress/scripts build toolchain
- Swiper.js integrated as custom elements
- Block registration in main plugin file (prolific-blocks.php)
- Consistent naming convention across all 9 blocks
- Comprehensive block ecosystem for various content needs
- Proven polling approach for reliable JavaScript initialization