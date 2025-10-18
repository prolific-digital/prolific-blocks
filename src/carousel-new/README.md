# Carousel Block

A powerful, accessible carousel block powered by Swiper.js that lets you create beautiful, responsive carousels with full editing capabilities.

## Features

- **Full Block Editor Integration** - Edit carousel content directly in the WordPress editor with live preview
- **Unlimited Slides** - Add as many slides as you need, each containing any WordPress blocks
- **Responsive Design** - Configure different settings for desktop, tablet, and mobile devices
- **Accessibility First** - Built with ARIA labels and keyboard navigation support
- **Multiple Effects** - Choose from slide, fade, cube, flip, coverflow, and cards transitions
- **Custom Navigation** - Use default arrows or upload your own custom SVG icons
- **Flexible Pagination** - Bullets, fraction, or progress bar styles
- **Autoplay Support** - Optional autoplay with configurable speed and pause on interaction

## Getting Started

### Adding a Carousel

1. Click the **+** button to add a new block
2. Search for "Carousel" in the block inserter
3. Select the **Carousel** block from the Prolific category
4. The carousel starts with 2 default slides

### Adding Slides

Click the **Add New Slide** button above the carousel to add a new slide. The carousel will automatically navigate to your new slide so you can start editing.

Each new slide includes a default template with:
- Image block (centered)
- Heading block (level 3, centered)
- Paragraph block (centered)

You can remove these blocks and add any WordPress blocks you want.

### Editing Slide Content

1. Click through the carousel using the navigation arrows to view different slides
2. Click inside any slide to edit its content
3. Add, remove, or modify blocks within each slide as needed

### Accessing Carousel Settings

Click the **Carousel Settings** button above the carousel to select the parent block and access the inspector panel settings.

## Carousel Settings

Access all carousel settings through the inspector panel (right sidebar) when the carousel block is selected.

### Layout Panel

**Slides Per View**
- Configure how many slides display at once on different devices
- Desktop: Default 1 slide
- Tablet: Default 1 slide
- Mobile: Default 1 slide

**Space Between Slides**
- Set the gap between slides in pixels
- Desktop: Default 20px
- Tablet: Default 15px
- Mobile: Default 10px

**Direction**
- Horizontal: Slides move left/right (default)
- Vertical: Slides move up/down

**Content Alignment**
- Left: Align content to the left
- Center: Center content (default)
- Right: Align content to the right

### Navigation Panel

**Enable Navigation**
- Toggle to show/hide navigation arrows
- Enabled by default

**Custom Navigation Icons**
- Upload your own SVG files for previous/next arrows
- Use default Swiper arrows when disabled
- Supports custom styling and branding

### Pagination Panel

**Enable Pagination**
- Toggle to show/hide pagination indicators
- Enabled by default

**Pagination Type**
- Bullets: Clickable dots (default)
- Fraction: Shows current slide number (e.g., "1 / 5")
- Progressbar: Horizontal progress indicator

### Scrollbar Panel

**Enable Scrollbar**
- Toggle to show/hide draggable scrollbar
- Disabled by default
- Provides visual progress indicator

### Autoplay Panel

**Enable Autoplay**
- Toggle automatic slide progression
- Disabled by default

**Delay Between Slides**
- Set milliseconds between auto-transitions
- Default: 3000ms (3 seconds)
- Range: 1000ms - 10000ms

**Pause on Interaction**
- Auto-pause when user interacts with carousel
- Enabled by default
- Prevents jarring experience during manual navigation

### Behavior Panel

**Loop Mode**
- Enable continuous loop (slide 1 follows last slide)
- Disabled by default

**Centered Slides**
- Center the active slide in the viewport
- Disabled by default
- Useful for previewing adjacent slides

**Transition Speed**
- Set slide transition duration in milliseconds
- Default: 300ms
- Range: 100ms - 2000ms

**Keyboard Navigation**
- Enable arrow key navigation
- Enabled by default
- Improves accessibility

### Effects Panel

**Transition Effect**
- Slide: Standard horizontal/vertical sliding (default)
- Fade: Smooth cross-fade between slides
- Cube: 3D cube rotation effect
- Flip: 3D flip transition
- Coverflow: Apple Cover Flow-style effect
- Cards: Stacked cards effect

## Block Width Alignment

Use the block toolbar alignment options to control the carousel container width:

- **Left/Center/Right**: Standard content width positioning
- **Wide**: Extends beyond content width for more impact
- **Full**: Full viewport width, edge to edge

This is separate from the Content Alignment setting which controls text/content positioning within slides.

## Best Practices

### Performance

- **Optimize Images**: Use appropriately sized images for faster loading
- **Limit Autoplay**: Consider disabling autoplay for better user control
- **Responsive Settings**: Reduce slides per view on mobile for better performance

### Accessibility

- **Meaningful Content**: Ensure slide content is accessible and meaningful
- **Keyboard Navigation**: Keep keyboard navigation enabled
- **Autoplay Consideration**: Provide pause controls when using autoplay
- **Alt Text**: Add descriptive alt text to all images

### Design

- **Consistent Heights**: Use similar content amounts for even slide heights
- **Readable Text**: Ensure sufficient contrast between text and backgrounds
- **Touch Targets**: Keep navigation buttons easily tappable on mobile
- **Test Responsively**: Preview on different devices and screen sizes

## Troubleshooting

### Carousel Not Displaying
- Ensure you've added at least one slide
- Check that the block is not hidden by theme CSS
- Verify Swiper.js is loading (check browser console)

### Content Not Saving
- Make sure to save the page/post after editing
- Check for JavaScript errors in browser console
- Ensure proper permissions for saving content

### Custom Navigation Not Showing
- Verify SVG files are valid and not corrupted
- Check that custom navigation is enabled in settings
- Ensure SVGs don't contain scripts or malicious code

### Slides Not Transitioning Smoothly
- Reduce transition speed for smoother effects
- Ensure slides have consistent heights
- Try different effect types (slide vs fade)

## Technical Details

- **Powered by**: Swiper.js v11.1.9
- **Web Components**: Uses `<swiper-container>` and `<swiper-slide>` custom elements
- **Accessibility**: ARIA labels, keyboard navigation, semantic HTML
- **Responsive**: Mobile-first design with breakpoint support
- **Performance**: Lazy loading, optimized rendering, minimal dependencies

## Need Help?

For more detailed documentation and advanced usage examples, visit:
[View Full Documentation](https://prolificdigital.notion.site/Carousel-2905efcd8c5f8046bfbcc568c0144038?source=copy_link)

## Support

If you encounter issues or have questions:
1. Check the troubleshooting section above
2. Review the full documentation
3. Contact Prolific Digital support

---

**Version**: 1.0.0
**Last Updated**: October 2025
