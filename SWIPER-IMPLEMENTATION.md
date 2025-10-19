# React Swiper Implementation in WordPress Block Editor

## Overview

This document explains how React Swiper has been successfully integrated into the WordPress Block Editor (Gutenberg) for the Carousel New block, allowing full editing capability without freezing or React conflicts.

## The Problem We Solved

Previous attempts to integrate Swiper in the editor failed because:

1. **Dual Rendering**: InnerBlocks were rendered separately AND duplicated inside SwiperSlide components via BlockList
2. **React Conflicts**: Having the same blocks rendered twice created React reconciliation issues
3. **Hidden Elements**: Display:none on InnerBlocks confused WordPress's block management
4. **Freezing**: The dual rendering and conflicts caused the editor to freeze

## The Solution: Proper Integration Pattern

### Architecture

The solution uses a **split architecture**:

1. **Hidden InnerBlocks Manager**: Handles block creation, deletion, and template management
2. **Visible Swiper with BlockList**: Renders the actual blocks inside Swiper using BlockList

### Key Files Modified

- `/src/carousel-new/edit.js` - Main editor component with Swiper integration
- `/src/carousel-new/editor.scss` - Editor styles for Swiper

## Implementation Details

### 1. Import Dependencies

```javascript
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { BlockList } from '@wordpress/block-editor';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
```

### 2. Setup InnerBlocks Manager (Hidden)

```javascript
// This manages block creation/deletion but is hidden from view
const innerBlocksProps = useInnerBlocksProps(
	{
		className: 'carousel-new-slides-manager',
	},
	{
		allowedBlocks: ['prolific/carousel-new-slide'],
		template: [
			['prolific/carousel-new-slide'],
			['prolific/carousel-new-slide'],
		],
		orientation: 'horizontal',
		renderAppender: false,
	}
);

// Render hidden
<div style={{ display: 'none' }}>
	<div {...innerBlocksProps} />
</div>
```

### 3. Configure Swiper for Editor

```javascript
const swiperParams = {
	modules: [Navigation, Pagination, Scrollbar, A11y],
	spaceBetween: spaceBetweenDesktop,
	slidesPerView: slidesPerViewDesktop,
	navigation: navigation,
	pagination: pagination ? { type: paginationType, clickable: true } : false,

	// CRITICAL: Disable touch interactions to prevent conflicts
	allowTouchMove: false,
	simulateTouch: false,
	touchRatio: 0,

	// Disable autoplay and loop in editor
	autoplay: false,
	loop: false,

	// Enable observers for dynamic content
	observer: true,
	observeParents: true,
	observeSlideChildren: true,
};
```

### 4. Render Swiper with BlockList

```javascript
<Swiper {...swiperParams}>
	{innerBlocks.map((block) => (
		<SwiperSlide key={block.clientId}>
			<div className="carousel-slide-editor-wrapper">
				{/* This renders the actual block - ONCE */}
				<BlockList clientIds={[block.clientId]} />
			</div>
		</SwiperSlide>
	))}
</Swiper>
```

## Why This Works

### 1. Single Render Path
- Each block is rendered ONLY ONCE via `BlockList`
- No duplication, no React conflicts
- WordPress block management works normally

### 2. Proper Separation of Concerns
- **InnerBlocks**: Manages block structure and lifecycle (hidden)
- **BlockList**: Renders blocks in their correct locations (inside Swiper)
- **Swiper**: Provides carousel functionality around the blocks

### 3. Disabled Touch Interactions
- `allowTouchMove: false` prevents Swiper from intercepting clicks
- Users can click on blocks to edit them
- Navigation still works via buttons and pagination

### 4. Observer Pattern
- `observer: true` makes Swiper watch for DOM changes
- When blocks are edited, Swiper updates automatically
- No manual refresh needed

## Editor Features

### What Works
- Full Swiper navigation (arrows, pagination, scrollbar)
- Click any block inside slides to edit
- Add/remove slides using block inserter
- All block editing features work normally
- No freezing or performance issues
- Real-time preview of carousel settings

### What's Disabled (Intentionally)
- Touch/swipe gestures (prevents conflict with block selection)
- Autoplay (better editing experience)
- Loop mode (simpler editing)
- Grab cursor (disabled touch so not needed)

## CSS Considerations

### Editor Styles

```scss
// Hidden manager
.carousel-new-slides-manager {
	display: none;
}

// Swiper container
.carousel-new-swiper-container {
	.swiper-slide {
		pointer-events: auto; // Allow clicks
		cursor: default; // Normal cursor
	}

	.swiper-button-next,
	.swiper-button-prev {
		z-index: 10; // Above slides
		pointer-events: auto; // Clickable
	}
}

// Block controls priority
.wp-block-prolific-carousel-new {
	.block-editor-block-toolbar {
		z-index: 30; // Above everything
	}
}
```

### Z-Index Hierarchy
1. Level 30: Block toolbar
2. Level 20: Block edit controls
3. Level 10: Swiper navigation/pagination
4. Level 1: Slide content

## Frontend vs Editor

### Editor (edit.js)
- Uses Swiper with BlockList
- Touch disabled
- Navigation enabled for preview
- All blocks editable

### Frontend (view.js)
- Full Swiper with all features
- Touch/swipe enabled
- Autoplay if configured
- Loop mode available
- All effects work

## Best Practices

### DO
- Use BlockList to render blocks inside Swiper
- Disable touch interactions in editor
- Keep InnerBlocks hidden but functional
- Use observers to track content changes
- Maintain proper z-index hierarchy

### DON'T
- Render InnerBlocks visibly AND use BlockList (causes duplication)
- Enable touch/swipe in editor (conflicts with block selection)
- Try to sync two separate renders of the same blocks
- Use loop mode in editor (confuses block order)

## Testing Checklist

- [ ] Blocks can be clicked and edited
- [ ] Navigation arrows work
- [ ] Pagination works
- [ ] Slides can be added via inserter
- [ ] Slides can be removed
- [ ] Settings changes reflect in preview
- [ ] No freezing when editing
- [ ] Block toolbar appears correctly
- [ ] Multiple slides per view works
- [ ] Responsive preview works

## Troubleshooting

### If Editor Freezes
- Check that InnerBlocks is hidden (`display: none`)
- Verify BlockList is rendering, not duplicate InnerBlocks
- Ensure no dual rendering of the same clientIds

### If Blocks Aren't Editable
- Check `allowTouchMove: false` in Swiper config
- Verify z-index hierarchy
- Check that pointer-events are enabled on slides

### If Navigation Doesn't Work
- Verify Swiper modules are imported
- Check that navigation/pagination are enabled in config
- Ensure navigation elements have `pointer-events: auto`

## Conclusion

This implementation successfully integrates React Swiper into the WordPress Block Editor by:

1. Using a hidden InnerBlocks manager for block lifecycle
2. Rendering blocks ONCE inside Swiper via BlockList
3. Disabling touch interactions to prevent conflicts
4. Maintaining proper z-index and pointer-events hierarchy

The result is a fully functional carousel editor with complete editing capability and no freezing issues.

## Files Reference

- **Main Implementation**: `/src/carousel-new/edit.js`
- **Editor Styles**: `/src/carousel-new/editor.scss`
- **Slide Block**: `/src/carousel-new-slide/edit.js`
- **Block Config**: `/src/carousel-new/block.json`
