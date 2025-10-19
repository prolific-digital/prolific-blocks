# Lottie Block

Display beautiful, lightweight Lottie animations on your WordPress site with full control over playback, appearance, and behavior.

## Features

- **Upload Lottie Animations** - Support for .json and .lottie animation files
- **Comprehensive Playback Controls** - Speed, direction, loop, and play modes
- **Viewport Triggers** - Start animations when scrolled into view
- **Flexible Sizing** - Configure width and height with multiple units (px, %, vw, vh)
- **Visual Customization** - Background colors, object fit options
- **Animation Markers** - Jump to specific points in your animation
- **Performance Options** - Frame interpolation control
- **Alignment Controls** - Left, center, right justify alignment

## Getting Started

### Adding a Lottie Animation

1. Click the **+** button to add a new block
2. Search for "Lottie" in the block inserter
3. Select the **Lottie** block from the Prolific category
4. Click **Upload Animation** in the inspector panel
5. Upload your .json or .lottie animation file

### Where to Find Lottie Animations

- **LottieFiles**: https://lottiefiles.com - Thousands of free animations
- **Create Your Own**: Use Adobe After Effects with the Bodymovin plugin
- **Design Tools**: Figma, Haiku Animator, or other animation tools

## Block Settings

Access all settings through the inspector panel (right sidebar) when the block is selected.

### Animation File Panel

**Upload/Replace Animation**
- Upload .json or .lottie files from your media library
- Preview shows current filename
- Remove button to clear the animation

**Supported Formats:**
- JSON (.json) - Standard Lottie format
- DotLottie (.lottie) - Compressed format with embedded assets

### Playback Settings Panel

**Autoplay**
- Toggle: Enable/disable automatic playback
- When enabled, animation plays immediately on page load
- Disabled by default

**Loop**
- Toggle: Enable/disable continuous looping
- When enabled, animation repeats indefinitely
- Disabled by default

**Speed**
- Range: 0.1x to 5x
- Default: 1x (normal speed)
- Higher values = faster playback
- Lower values = slower playback

**Direction**
- Forward: Play animation from start to end
- Reverse: Play animation from end to start
- Useful for creating rewind effects

**Play Mode**
- Normal: Standard one-way playback
- Bounce: Play forward, then reverse (ping-pong effect)
- Bounce mode works with loop enabled

**Intermission (Bounce Mode Only)**
- Range: 0-5000ms
- Delay between each bounce cycle
- Only visible when Bounce mode is selected

### Timing & Triggers Panel

**Start on View**
- Toggle: Play when scrolled into viewport
- Uses IntersectionObserver for efficient detection
- Overrides autoplay setting
- Animation pauses until user scrolls to it

**Animation Information**
- Displays total frames in your animation
- Shows duration in seconds
- Automatically detected from your animation file

**Start from Marker**
- Dropdown: Select from markers in your animation
- Only appears if your animation contains markers
- Jump to specific animation segments
- Useful for complex, multi-scene animations

### Appearance Panel

**Width**
- Default: 400px
- Units: px, %, vw
- Control horizontal size of animation container

**Height**
- Default: 400px
- Units: px, %, vh
- Control vertical size of animation container

**Background Color**
- Color picker with alpha/transparency support
- Add background behind your animation
- Clear button to remove color
- Useful for animations with transparency

**Object Fit**
- **Contain** (default): Fit entire animation within container
- **Cover**: Fill container, may crop animation
- **Fill**: Stretch to fill container (may distort)
- **None**: Use original animation dimensions

### Advanced Panel

**Frame Interpolation**
- Toggle: Enable/disable smooth frame transitions
- Enabled by default
- Provides smoother animations
- Slight performance cost on lower-end devices

**Performance Note:**
Frame interpolation improves visual quality but uses slightly more CPU. Disable for better performance on mobile devices or when using multiple animations on one page.

## Toolbar Controls

**Alignment**
- Use the justify alignment buttons in the block toolbar
- Left, Center, Right alignment options
- Controls the position of the animation container
- Independent from width settings

## Use Cases

### Hero Section Animation
```
Settings:
- Autoplay: On
- Loop: On
- Speed: 1x
- Start on View: Off
- Width: 100%
- Height: 600px
```

### Scroll-Triggered Feature Icon
```
Settings:
- Autoplay: Off
- Loop: Off
- Start on View: On
- Speed: 1x
- Width: 200px
- Height: 200px
```

### Loading Indicator
```
Settings:
- Autoplay: On
- Loop: On
- Speed: 1.5x
- Width: 100px
- Height: 100px
```

### Interactive Button Hover Effect
```
Settings:
- Autoplay: Off
- Loop: Off
- Play Mode: Bounce
- Speed: 2x
```

## Best Practices

### Performance

**File Size**
- Keep animation files under 200KB for best performance
- Use DotLottie (.lottie) format for smaller file sizes
- Optimize in LottieFiles before downloading

**Multiple Animations**
- Limit to 3-5 animations per page
- Use "Start on View" to prevent all animations from playing at once
- Consider disabling frame interpolation for multiple animations

**Mobile Optimization**
- Test animations on mobile devices
- Use smaller dimensions for mobile screens
- Consider simpler animations for mobile

### Design

**Accessibility**
- Provide text alternatives for informational animations
- Avoid autoplay with sound
- Consider users with motion sensitivity
- Use "Start on View" instead of autoplay when possible

**Visual Consistency**
- Match animation colors to your site's color scheme
- Use consistent sizing across similar animations
- Maintain aspect ratios to prevent distortion

**Loading States**
- Block shows loading indicator while animation loads
- Placeholder displays when no file uploaded
- Error messages for failed loads

## Troubleshooting

### Animation Not Displaying
- Verify the animation file uploaded successfully
- Check browser console for errors
- Ensure file is valid JSON or .lottie format
- Try downloading and re-uploading the animation

### Animation Playing Too Fast/Slow
- Adjust the Speed setting (0.1x - 5x)
- Default is 1x (normal speed)
- Some animations are designed to play at different speeds

### Animation Not Looping
- Enable the Loop toggle in Playback Settings
- Check that the animation file supports looping
- Verify play mode is set correctly

### Background Showing Through Animation
- Add a background color in Appearance panel
- Check if animation has transparent areas
- Use object-fit: cover if needed

### Animation Not Starting on Scroll
- Enable "Start on View" toggle
- Disable "Autoplay" (Start on View overrides autoplay)
- Check that animation is actually scrolled into view
- Test scroll detection works in your theme

### Performance Issues
- Reduce animation complexity
- Decrease file size
- Disable frame interpolation
- Limit number of animations per page
- Use smaller dimensions

## Technical Details

- **Library**: DotLottie Web (@lottiefiles/dotlottie-web)
- **Rendering**: Canvas-based rendering for optimal performance
- **File Support**: JSON (.json), DotLottie (.lottie)
- **Browser Support**: All modern browsers (Chrome, Firefox, Safari, Edge)
- **Accessibility**: Semantic HTML, ARIA labels, keyboard support
- **Responsive**: Configurable sizing with multiple units

## Advanced Tips

### Creating Custom Markers
1. Add markers in After Effects during export
2. Name markers descriptively
3. Use "Start from Marker" dropdown to jump to specific scenes
4. Great for complex, multi-section animations

### Optimizing Animation Files
1. Remove unnecessary layers in After Effects
2. Simplify paths and shapes
3. Reduce keyframes where possible
4. Export at optimal frame rate (usually 30fps)
5. Use LottieFiles optimizer before uploading

### Combining with Other Blocks
- Use in Group blocks for layout control
- Combine with Spacer blocks for positioning
- Add in Columns for side-by-side animations
- Nest in Cover blocks for overlays

## Support

For issues or questions:
1. Check this documentation first
2. Visit LottieFiles documentation: https://lottiefiles.com/documentation
3. Test animation file at https://lottiefiles.com/preview
4. Contact Prolific Digital support

---

**Version**: 1.0.0
**Last Updated**: October 2025
