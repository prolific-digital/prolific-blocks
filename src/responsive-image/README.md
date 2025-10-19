# Responsive Image Block

A powerful WordPress block that allows you to display different images for desktop, tablet, and mobile devices with customizable breakpoints. This solves the common problem where an image looks great on desktop but poorly cropped on mobile.

## Features

### Multi-Device Image Selection
- **Desktop Image** (required): The primary image that serves as fallback for all devices
- **Tablet Image** (optional): Custom image for tablet devices, falls back to desktop
- **Mobile Image** (optional): Custom image for mobile devices, falls back to tablet or desktop
- Each device image can be independently selected from the media library

### Core Image Block Feature Parity
- Alt text (shared across all devices for accessibility)
- Caption support with rich text formatting
- Image dimensions (width/height) customizable per device
- Link settings (URL, open in new tab, rel attribute)
- Alignment support (left, center, right, wide, full)
- Border, padding, and margin controls
- Lazy loading option

### Customizable Breakpoints
- **Desktop Breakpoint** (default: 1024px and above)
- **Tablet Breakpoint** (default: 768px to 1023px)
- **Mobile Breakpoint** (default: below 768px)
- Fully customizable breakpoints in the inspector controls

### Advanced Editor Features
- **Device Preview Toolbar**: Switch between desktop, tablet, and mobile previews in the editor
- **Device Badges**: Visual indicators showing which device images are currently set
- **Aspect Ratio Lock**: Lock aspect ratio per device when resizing images
- **Fallback Notifications**: Clear indicators when optional device images aren't set

## Technical Implementation

### HTML5 Picture Element
The block uses the modern HTML5 `<picture>` element with responsive `<source>` media queries:

```html
<picture class="prolific-responsive-picture">
  <source media="(max-width: 767px)" srcset="mobile-image.jpg" width="375" height="250">
  <source media="(min-width: 768px) and (max-width: 1023px)" srcset="tablet-image.jpg" width="768" height="512">
  <img src="desktop-image.jpg" alt="Description" width="1200" height="800" loading="lazy" />
</picture>
```

### Performance Benefits
- Browser only loads the appropriate image for the current screen size
- Lazy loading support for improved page load performance
- Proper width and height attributes prevent layout shift
- Optimized srcset usage

### Accessibility
- Shared alt text across all device images
- Proper semantic HTML with `<picture>` and `<img>` elements
- ARIA attributes support
- Keyboard navigation support for linked images
- Focus states for better usability

## Usage Instructions

### Basic Setup
1. Insert the "Responsive Image" block from the Prolific category
2. Upload or select a desktop image from the media library
3. (Optional) Add tablet and mobile images in the sidebar panels
4. Configure alt text and other settings

### Inspector Controls

#### Desktop Image Panel
- Upload/replace desktop image (required)
- Set custom width and height
- Lock aspect ratio option

#### Tablet Image Panel
- Upload/replace tablet image (optional)
- Remove tablet image if not needed
- Set custom width and height
- Lock aspect ratio option

#### Mobile Image Panel
- Upload/replace mobile image (optional)
- Remove mobile image if not needed
- Set custom width and height
- Lock aspect ratio option

#### Breakpoints Panel
- Customize desktop breakpoint (min-width in pixels)
- Customize tablet breakpoint (min-width in pixels)
- View current breakpoint ranges

#### Image Settings Panel
- Alt text (applies to all devices)
- Title attribute
- Lazy loading toggle

#### Link Settings Panel
- Add/remove link
- Link URL
- Open in new tab option
- Link rel attribute (e.g., nofollow, noopener)

### Block Controls Toolbar
- **Alignment**: Left, center, right, wide, full
- **Device Preview**: Toggle between desktop, tablet, and mobile previews

## Use Cases

### Art Direction
Show completely different compositions for different screen sizes:
- Desktop: Wide landscape shot
- Tablet: Slightly cropped version
- Mobile: Portrait or square crop focusing on main subject

### Text Readability
Ensure text in images remains readable:
- Desktop: Full infographic with small text
- Tablet: Zoomed version focusing on key points
- Mobile: Further zoomed or simplified version

### Performance Optimization
Serve appropriately sized images:
- Desktop: High-resolution 2000px wide image
- Tablet: Medium-resolution 1024px wide image
- Mobile: Optimized 500px wide image

### Different Focal Points
Adjust focus for different aspect ratios:
- Desktop: Wide shot showing full scene
- Tablet: Medium crop
- Mobile: Tight crop on main subject

## Browser Support

The `<picture>` element is supported in all modern browsers:
- Chrome 38+
- Firefox 38+
- Safari 9.1+
- Edge 13+
- Opera 25+

For older browsers, the fallback `<img>` element (desktop image) is displayed.

## Best Practices

1. **Always Set Alt Text**: Provide descriptive alt text for accessibility
2. **Optimize Image Sizes**: Upload images at appropriate resolutions for each device
3. **Test Breakpoints**: Preview at different screen sizes to verify image switching
4. **Use WebP Format**: Modern image formats provide better compression
5. **Set Dimensions**: Always specify width and height to prevent layout shift
6. **Consider File Size**: Balance image quality with file size for performance
7. **Use Lazy Loading**: Enable lazy loading for below-the-fold images

## Edge Cases Handled

- **Missing Device Images**: Automatic fallback to desktop image
- **Image Deletion**: Graceful handling if media library images are deleted
- **RTL Layouts**: Proper support for right-to-left languages
- **Print Media**: Desktop image used for printing
- **Responsive Editor**: Preview adapts to editor width

## Code Structure

```
responsive-image/
├── block.json          # Block configuration and attributes
├── index.js            # Block registration and style import
├── edit.js             # Editor component with device controls
├── save.js             # Frontend save with picture element
├── editor.scss         # Editor-only styles
├── style.scss          # Frontend styles (compiled to style-index.css)
└── README.md           # This file
```

## Attributes Reference

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `desktopImageId` | number | 0 | Desktop image media library ID |
| `desktopImageUrl` | string | "" | Desktop image URL |
| `desktopWidth` | number | - | Desktop image width in pixels |
| `desktopHeight` | number | - | Desktop image height in pixels |
| `tabletImageId` | number | 0 | Tablet image media library ID |
| `tabletImageUrl` | string | "" | Tablet image URL |
| `tabletWidth` | number | - | Tablet image width in pixels |
| `tabletHeight` | number | - | Tablet image height in pixels |
| `mobileImageId` | number | 0 | Mobile image media library ID |
| `mobileImageUrl` | string | "" | Mobile image URL |
| `mobileWidth` | number | - | Mobile image width in pixels |
| `mobileHeight` | number | - | Mobile image height in pixels |
| `altText` | string | "" | Alt text for accessibility |
| `title` | string | "" | Title attribute |
| `caption` | string | "" | Image caption |
| `linkUrl` | string | "" | Link URL |
| `linkTarget` | boolean | false | Open link in new tab |
| `linkRel` | string | "" | Link rel attribute |
| `lazyLoad` | boolean | true | Enable lazy loading |
| `desktopBreakpoint` | number | 1024 | Desktop min-width breakpoint |
| `tabletBreakpoint` | number | 768 | Tablet min-width breakpoint |
| `lockDesktopRatio` | boolean | false | Lock desktop aspect ratio |
| `lockTabletRatio` | boolean | false | Lock tablet aspect ratio |
| `lockMobileRatio` | boolean | false | Lock mobile aspect ratio |
| `currentPreviewDevice` | string | "desktop" | Current preview device in editor |

## Styling Customization

You can customize the block appearance with CSS:

```css
/* Target the block wrapper */
.wp-block-prolific-responsive-image {
  /* Your custom styles */
}

/* Target the picture element */
.prolific-responsive-picture {
  /* Your custom styles */
}

/* Target images */
.prolific-responsive-picture img {
  /* Your custom styles */
}

/* Target captions */
.prolific-responsive-image figcaption {
  /* Your custom styles */
}
```

## Support

For issues, feature requests, or questions about the Responsive Image block, please contact Prolific Digital support.

## Version

Version: 1.0.0
