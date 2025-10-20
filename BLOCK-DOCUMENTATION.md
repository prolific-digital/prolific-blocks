# Prolific Blocks - Complete Documentation

This document contains public-facing, non-technical documentation for all Prolific Blocks. Each section below should be created as a separate sub-page on the main Prolific Blocks Notion page.

**Main Documentation Page:** https://www.notion.so/prolificdigital/Prolific-Blocks-19f5efcd8c5f807f951ac38f50e90f0d

---

## Carousel Block

### Overview
Create beautiful, responsive image and content carousels with smooth transitions and customizable controls. Perfect for showcasing products, portfolios, testimonials, or any content that benefits from a slideshow presentation.

### Key Features
- **Flexible Content:** Each slide can contain images, text, headings, buttons, or any combination of WordPress blocks
- **Responsive Design:** Automatically adjusts to look great on desktop, tablet, and mobile devices
- **Multiple Slides Per View:** Show multiple slides at once for a gallery-style presentation
- **Autoplay Options:** Set slides to advance automatically with customizable timing
- **Custom Navigation:** Upload your own SVG icons for previous/next buttons
- **Pagination Styles:** Choose from bullets, fractions, or progress bars
- **Smooth Effects:** Select from slide, fade, cube, coverflow, and flip transition effects

### Common Use Cases
- Product galleries for e-commerce sites
- Portfolio showcases for creative professionals
- Client testimonials and reviews
- Image galleries for photography or design work
- Feature highlights for services or products
- Before/after comparisons

### Getting Started
1. Add the Carousel block to your page
2. The block starts with 2 slides by default
3. Click into each slide to add your content (images, text, buttons, etc.)
4. Use "Add New Slide" in the block settings to add more slides
5. Customize appearance, transitions, and controls in the right sidebar

### Settings Guide

**Layout Settings:**
- **Slides Per View:** How many slides to show at once (desktop, tablet, mobile)
- **Space Between:** Gap between slides in pixels
- **Content Alignment:** Align content within slides (left, center, right)

**Autoplay:**
- **Enable Autoplay:** Automatically advance through slides
- **Delay:** Time each slide stays visible (in milliseconds)
- **Pause on Hover:** Stop autoplay when user hovers over carousel
- **Pause on Interaction:** Stop autoplay after user manually changes slides

**Navigation & Pagination:**
- **Show Navigation Arrows:** Display previous/next buttons
- **Show Pagination:** Display slide indicators
- **Pagination Type:** Choose bullets, fraction (1/5), or progress bar style
- **Custom Navigation Icons:** Upload SVG files for unique arrow designs

**Effects & Behavior:**
- **Transition Effect:** Choose slide, fade, cube, coverflow, or flip
- **Transition Speed:** How fast slides change (in milliseconds)
- **Loop:** Return to first slide after the last one
- **Centered Slides:** Keep active slide centered
- **Free Mode:** Allow slides to scroll freely without snapping

### Tips & Best Practices
- **Image Sizes:** Use consistently sized images for the best appearance
- **Text Readability:** Add background colors or overlays to ensure text is readable over images
- **Mobile Testing:** Preview on different devices to ensure content fits well
- **Performance:** Limit very large carousels to 10-15 slides for best performance
- **Accessibility:** Add descriptive alt text to all images for screen readers

---

## Carousel New Block

### Overview
An enhanced version of the Carousel block with advanced positioning controls for navigation and pagination elements. Offers maximum flexibility in how you display carousel controls.

### Key Features
Everything from the Carousel block, plus:
- **Navigation Positioning:** Place navigation arrows at top, center, or bottom
- **Pagination Positioning:** Place pagination indicators at top or bottom
- **Grouped Controls:** Combine navigation and pagination in a single control bar
- **Control Layouts:** Choose from split, left, or right layouts for grouped controls
- **Enhanced Customization:** More granular control over every aspect of the carousel

### Control Positioning Options

**Ungrouped Mode:**
- Position navigation arrows independently (top, center, bottom)
- Position pagination separately (top, bottom)
- Maximum flexibility for custom layouts

**Grouped Mode:**
- Combine navigation and pagination in one control bar
- **Split Layout:** Prev button | Pagination | Next button
- **Left Layout:** Prev/Next buttons together on left, pagination on right
- **Right Layout:** Pagination on left, prev/next buttons together on right
- Place grouped controls at top or bottom of carousel

### When to Use Carousel New
- You need precise control over where navigation appears
- You want grouped controls for a cleaner interface
- Your design requires navigation outside the carousel area
- You're creating a unique carousel layout

### Settings Unique to Carousel New

**Navigation Position:**
- Top: Arrows appear above the carousel
- Center: Arrows overlay the carousel sides (default)
- Bottom: Arrows appear below the carousel

**Pagination Position:**
- Top: Indicators appear above the carousel
- Bottom: Indicators appear below the carousel (default)

**Group Controls:**
- Enable to combine navigation and pagination
- Choose top or bottom position for the control group
- Select layout (split, left, or right)

---

## Tabs Block

### Overview
Organize content into tabbed sections, allowing users to switch between different content areas without leaving the page. Perfect for organizing related information in a compact, user-friendly format.

### Key Features
- **Flexible Content:** Each tab can contain any WordPress blocks
- **Customizable Tab Labels:** Edit tab names to match your content
- **Add/Remove Tabs:** Easily manage the number of tabs
- **Smooth Transitions:** Content changes smoothly when switching tabs
- **Keyboard Navigation:** Users can navigate tabs with keyboard arrows

### Common Use Cases
- Product specifications and details
- FAQ sections with categorized questions
- Service descriptions with multiple offerings
- Step-by-step instructions or tutorials
- Comparison tables with different options
- Portfolio items with different categories

### Getting Started
1. Add the Tabs block to your page
2. The block starts with 3 tabs by default
3. Click into each tab panel to add content
4. Edit tab labels in the block settings
5. Use "Add New Tab" to create additional tabs

### Settings Guide

**Tab Management:**
- **Current Tabs:** View list of all your tabs with their labels
- **Add New Tab:** Create a new tab panel
- **Edit Labels:** Click to rename any tab
- **Remove Tabs:** Delete tabs you don't need

### Tips & Best Practices
- **Logical Organization:** Group related content together in each tab
- **Balanced Content:** Try to keep tab content somewhat similar in length
- **Clear Labels:** Use descriptive tab names so users know what to expect
- **Mobile Consideration:** Test how tabs appear on mobile devices
- **Default Tab:** The first tab is shown by default when the page loads

---

## Tabbed Content Block

### Overview
An advanced tabs block with flexible positioning options, mobile-specific behavior, and enhanced accessibility features. Offers complete control over how tabbed content appears across all devices.

### Key Features
All features from Tabs block, plus:
- **Flexible Tab Positioning:** Place tabs on top, bottom, left, or right of content
- **Mobile Behavior Options:** Choose how tabs display on mobile (stack, accordion, or same)
- **Custom Breakpoints:** Define exactly when mobile behavior kicks in
- **URL Hash Support:** Link directly to specific tabs using #tab-id in URL
- **Remember Last Tab:** Optionally save user's last viewed tab
- **Keyboard Navigation:** Full arrow key support for accessibility
- **ARIA Implementation:** Screen reader friendly with proper accessibility attributes

### Tab Positioning

**Top (Default):**
- Tabs appear above content
- Most familiar pattern for users
- Best for desktop-centric sites

**Bottom:**
- Tabs appear below content
- Unique visual style
- Good for certain design aesthetics

**Left:**
- Tabs appear as a vertical sidebar on the left
- Great for content-heavy tabs
- Professional, documentation-style layout

**Right:**
- Tabs appear as a vertical sidebar on the right
- Alternative to left positioning
- Good for asymmetric designs

### Mobile Behavior

**Stack:**
- Tabs stack vertically on mobile
- Content appears below selected tab
- Clean, simple mobile experience

**Accordion:**
- Tabs transform into an accordion
- Each tab becomes a collapsible section
- Space-efficient on mobile

**Same:**
- Maintains desktop layout on mobile
- May require horizontal scrolling for many tabs
- Use when mobile experience should match desktop

### Advanced Features

**URL Hash Linking:**
- Enable to allow direct links to tabs
- Users can bookmark specific tabs
- Share links that open a particular tab
- Format: yourpage.com/page/#tab-name

**Remember Last Tab:**
- Browser remembers which tab user last viewed
- Tab persists across page reloads
- Improves user experience for returning visitors

**Custom Breakpoints:**
- Define exactly when mobile behavior activates
- Default is 768px (typical tablet breakpoint)
- Adjust based on your content and design needs

### When to Use Tabbed Content
- You need tabs on the side instead of top
- Mobile experience needs to differ from desktop
- You want URL hash support for bookmarking
- Accessibility is a priority
- Your design requires custom breakpoints

---

## Timeline Block

### Overview
Create vertical timelines to display events, milestones, or processes in chronological order. Perfect for company histories, project roadmaps, process flows, or any sequential information.

### Key Features
- **Visual Timeline:** Clean vertical layout with connecting lines
- **Flexible Items:** Each timeline item can contain any content
- **Customizable Styling:** Control colors, spacing, and appearance
- **Add/Remove Items:** Easily manage timeline events
- **Responsive Design:** Adapts beautifully to all screen sizes

### Common Use Cases
- Company history and milestones
- Project timelines and roadmaps
- Process steps and workflows
- Event schedules and agendas
- Product development stages
- Career progression displays
- Historical events and dates

### Getting Started
1. Add the Timeline block to your page
2. The block starts with 3 timeline items
3. Click into each item to add content (dates, descriptions, images)
4. Use "Add New Item" to add more events
5. Customize the timeline appearance in settings

### Timeline Item Structure
Each timeline item typically includes:
- **Date or Title:** When the event occurred
- **Description:** Details about the event
- **Optional Images:** Visual elements to enhance the story
- **Links or Buttons:** Connect to related pages

### Tips & Best Practices
- **Chronological Order:** Arrange items from oldest to newest (or vice versa)
- **Consistent Formatting:** Use similar structure for each item
- **Concise Descriptions:** Keep text brief and focused
- **Visual Elements:** Add images or icons to make items engaging
- **Dates Format:** Use a consistent date format throughout

---

## Hamburger Menu Block

### Overview
Add an animated hamburger menu button to your site with multiple animation styles. Perfect for mobile navigation or creating compact menu triggers.

### Key Features
- **20+ Animation Styles:** Choose from various hamburger transformations
- **Customizable Appearance:** Control size, colors, and spacing
- **Smooth Animations:** Professional CSS-based transitions
- **Accessibility Ready:** Proper ARIA labels for screen readers
- **Mobile Optimized:** Perfect for responsive navigation

### Animation Styles
- **3DX, 3DY, 3DXY:** Three-dimensional rotations
- **Arrow, Arrow Right, Arrow Left:** Transform into arrows
- **Boring:** Simple fade transition
- **Collapse:** Collapse into a single line
- **Elastic:** Bouncy, playful animation
- **Emphatic:** Bold, attention-grabbing movement
- **Minus:** Simplify to a minus sign
- **Slider:** Sliding transformation
- **Spin:** Rotating animation
- **Spring:** Spring-loaded effect
- **Squeeze:** Squeezing motion
- **Stand:** Standing transformation
- **Vortex:** Swirling effect

### Common Use Cases
- Mobile menu toggles
- Drawer navigation triggers
- Compact navigation for smaller screens
- Off-canvas menu buttons
- Filter panel toggles
- Settings menu buttons

### Settings Guide
- **Animation Type:** Choose from 20+ styles
- **Button Size:** Adjust hamburger button dimensions
- **Line Thickness:** Control how thick the lines appear
- **Spacing:** Gap between the three lines
- **Colors:** Customize line color and hover effects
- **Active State:** Color when menu is open

### Tips & Best Practices
- **Match Your Brand:** Choose an animation style that fits your site's personality
- **Sufficient Size:** Make the button large enough to tap easily on mobile (minimum 44x44px)
- **Clear Indication:** Ensure users understand this is a menu button
- **Consistent Placement:** Position in expected locations (top right or left)

---

## Breadcrumbs Block

### Overview
Automatically generate breadcrumb navigation trails showing the user's location in your site hierarchy. Improves navigation and SEO.

### Key Features
- **Automatic Generation:** Creates breadcrumbs based on page hierarchy
- **Home Link:** Always includes link back to homepage
- **Current Page:** Shows current page (non-linked)
- **SEO Friendly:** Implements proper schema markup
- **Customizable Styling:** Control colors, separators, and appearance

### Benefits
- **Improved Navigation:** Users can easily navigate up the hierarchy
- **Better UX:** Shows where users are in site structure
- **SEO Boost:** Search engines use breadcrumbs for better understanding
- **Reduced Bounce Rate:** Easier navigation keeps users on site
- **Mobile Friendly:** Compact navigation suitable for small screens

### Common Use Cases
- E-commerce product pages
- Blog category hierarchies
- Documentation sites
- Multi-level service pages
- Knowledge bases
- Directory listings

### Breadcrumb Structure Examples
- Home > Shop > Category > Product
- Home > Blog > Category > Post Title
- Home > Services > Service Type > Service Name
- Home > About > Team > Person Name

### Settings Guide
- **Show Home Link:** Toggle homepage link on/off
- **Separator:** Choose between > / | · or custom
- **Colors:** Customize link colors, hover states
- **Typography:** Font size and weight options

### Tips & Best Practices
- **Strategic Placement:** Place at top of content area, below header
- **Consistent Use:** Use on all pages except homepage
- **Clear Hierarchy:** Ensure your page structure makes sense
- **Don't Duplicate:** Avoid if you have prominent navigation already

---

## Table of Contents Block

### Overview
Automatically generate an interactive table of contents from the headings (H1-H6) on your page. Helps readers navigate long-form content quickly.

### Key Features
- **Automatic Generation:** Scans page for headings and creates links
- **Heading Filtering:** Choose which heading levels to include (H1-H6)
- **Smooth Scrolling:** Animated scroll to clicked section
- **Collapsible Option:** Allow users to expand/collapse the TOC
- **Numbered Lists:** Optional numbered list format
- **Scroll Offset:** Account for sticky headers
- **Anchor IDs:** Automatically generates clean anchor links

### Benefits
- **Improved Readability:** Users can jump to relevant sections
- **Better UX:** Long articles become easier to navigate
- **SEO Benefits:** Search engines may display jump links in results
- **Engagement:** Users can quickly find what they need
- **Professional Appearance:** Adds structure to long content

### Common Use Cases
- Long-form blog posts and articles
- Documentation pages
- Guides and tutorials
- Legal documents and policies
- Research papers and reports
- Product documentation
- Knowledge base articles

### Settings Guide

**Heading Levels:**
- **Include H1-H6:** Check which heading levels to include
- **Common Settings:** H2-H3 for most articles, H2-H4 for documentation

**Display Options:**
- **Collapsible:** Allow users to hide/show TOC
- **Numbered List:** Add 1. 2. 3. numbering
- **Smooth Scroll:** Enable animated scrolling
- **Scroll Offset:** Pixels to offset scroll (for sticky headers)

**Styling:**
- **Title:** Customize "Table of Contents" heading
- **List Style:** Bullets or numbers
- **Indentation:** Nest sub-headings visually

### Tips & Best Practices
- **Use Clear Headings:** Make headings descriptive and specific
- **Proper Hierarchy:** Use heading levels in order (H2, then H3, not H2 then H4)
- **Consistent Structure:** Apply heading styles consistently throughout content
- **Top Placement:** Place TOC at the beginning of content
- **Update Headings:** If you edit headings, TOC updates automatically
- **Sticky Headers:** Set scroll offset to match your header height

### Anchor ID Format
The block automatically generates clean anchor IDs:
- "How to Get Started" becomes `#how-to-get-started`
- Handles duplicates: second "Introduction" becomes `#introduction-2`
- Removes special characters for clean URLs

---

## Anchor Navigation Block

### Overview
Create a horizontal navigation menu with smooth-scrolling jump links to sections on the same page. Perfect for one-page sites or long-form content.

### Key Features
- **Sticky Option:** Menu stays visible while scrolling
- **Smooth Scrolling:** Animated scroll to clicked sections
- **Scroll Offset:** Account for sticky headers
- **4 Style Variations:** Pills, Underline, Bordered, Minimal
- **Mobile Responsive:** Horizontal scroll or stack options
- **Custom Styling:** Colors, spacing, alignment controls

### Style Variations

**Pills:**
- Rounded button style
- Background color on active item
- Bold, prominent appearance
- Best for marketing pages

**Underline:**
- Simple underline on active item
- Clean, minimal look
- Professional and subtle
- Good for corporate sites

**Bordered:**
- Border around active item
- Boxed appearance
- Clear visual indication
- Works well with boxy designs

**Minimal:**
- Text-only style
- Color change on active
- Most subtle option
- Best for content-heavy pages

### Common Use Cases
- One-page landing pages
- Long-form sales pages
- Conference or event pages
- Restaurant menus with sections
- Portfolio sections
- About pages with team/services/contact
- Product feature pages

### Settings Guide

**Links:**
- **Add Links:** Create menu items with text and anchor targets
- **Edit Links:** Modify text or target anchors
- **Reorder Links:** Drag to change order
- **Remove Links:** Delete unwanted items

**Behavior:**
- **Enable Sticky:** Menu follows user while scrolling
- **Sticky Offset:** Distance from top when sticky (pixels)
- **Scroll Offset:** Space above target when scrolling to section
- **Smooth Scroll Speed:** How fast the scroll animation plays

**Mobile:**
- **Horizontal Scroll:** Swipe to see all menu items
- **Stack Vertically:** Items stack in a column
- **Breakpoint:** When mobile behavior activates (default 768px)

### Tips & Best Practices
- **Clear Labels:** Use concise, descriptive link text
- **Logical Order:** Arrange links in the order sections appear
- **Appropriate Offset:** Match scroll offset to your header height
- **Test Sticky Behavior:** Ensure sticky menu doesn't cover content
- **Mobile Usability:** Ensure links are tappable on small screens (minimum 44px height)
- **Section IDs:** Ensure target sections have proper ID attributes

### Setting Up Sections
To use anchor navigation, your page sections need IDs:
1. Add blocks to your page (Group, Column, etc.)
2. In block settings > Advanced > HTML Anchor, enter an ID (e.g., "services")
3. In Anchor Navigation, create link targeting that ID ("#services")
4. Link will smooth-scroll to that section when clicked

---

## Lottie Animation Block

### Overview
Add lightweight, scalable Lottie animations to your WordPress site. Lottie files are vector-based animations that load quickly and look sharp at any size.

### Key Features
- **Upload Lottie Files:** Support for .json and .lottie formats
- **Playback Controls:** Play, pause, loop, autoplay options
- **Speed Control:** Adjust animation speed (0.5x to 3x)
- **Size Control:** Responsive width/height settings
- **Trigger Options:** Play on scroll, click, or hover
- **Direction Control:** Play forward or reverse
- **Frame Control:** Set start and end frames

### Benefits
- **Small File Size:** Vector animations are much smaller than videos
- **Scalable:** Look perfect at any size, from mobile to 4K
- **Interactive:** Trigger animations based on user actions
- **Performance:** Hardware-accelerated and optimized
- **Cross-Platform:** Works consistently across all browsers

### Common Use Cases
- Hero section animations
- Loading indicators
- Icon animations
- Process illustrations
- Explainer diagrams
- Interactive infographics
- Micro-interactions
- Success/error states

### Settings Guide

**File:**
- **Upload Animation:** Choose .json or .lottie file from media library
- **Preview:** See animation in editor

**Playback:**
- **Autoplay:** Start playing when page loads
- **Loop:** Repeat animation continuously
- **Speed:** 0.5x (slow) to 3x (fast)
- **Direction:** Forward or reverse

**Triggers:**
- **On Load:** Play when page loads (with autoplay)
- **On Scroll:** Play when scrolled into view
- **On Hover:** Play when user hovers over animation
- **On Click:** Play when user clicks animation

**Size:**
- **Width:** Set in px, %, vw, or other units
- **Height:** Set in px, %, vh, or other units
- **Max Width:** Limit maximum size
- **Alignment:** Left, center, right, wide, or full

### Where to Find Lottie Files
- **LottieFiles.com:** Thousands of free and premium animations
- **After Effects:** Export from Adobe After Effects with Bodymovin plugin
- **Custom Creation:** Hire animators to create custom Lottie files
- **Design Tools:** Some design tools support Lottie export

### Tips & Best Practices
- **Optimize Files:** Keep animations under 100KB when possible
- **Test Performance:** Check animation performance on mobile devices
- **Purposeful Use:** Use animations to enhance, not distract
- **Loading States:** Consider showing placeholder while loading
- **Accessibility:** Provide alternative text or description
- **Battery Consideration:** Looping animations can drain battery on mobile

---

## Icon Block

### Overview
Add scalable vector icons from a library of 120+ Font Awesome icons. Perfect for enhancing visual communication and creating more engaging content.

### Key Features
- **120+ Icons:** Extensive library covering all common needs
- **Category Filter:** Browse by Social, UI, Arrows, Business, Media, E-commerce
- **Search Function:** Quickly find the icon you need
- **Customizable Size:** Any size from tiny to huge
- **Color Control:** Match icons to your brand
- **Rotation:** Rotate icons 0-360 degrees
- **Alignment:** Left, center, right, wide, full

### Icon Categories

**Social:**
Facebook, Twitter, Instagram, LinkedIn, YouTube, and more

**UI & Controls:**
Checkmarks, X's, menu icons, settings, search, user profiles

**Arrows:**
All directions, curved, circular, bold, outline styles

**Business:**
Charts, briefcases, buildings, money, calendars, documents

**Media:**
Play, pause, volume, camera, image, video controls

**E-commerce:**
Shopping carts, credit cards, tags, shipping, stores

**Communication:**
Email, phone, messages, comments, notifications

**Other:**
Weather, food, transportation, health, education, and more

### Common Use Cases
- Feature lists with icons
- Service offerings visualization
- Step-by-step process indicators
- Social media links
- Contact information display
- Call-to-action buttons
- Navigation elements
- Status indicators

### Settings Guide

**Icon Selection:**
- **Browse Categories:** Click category tabs to filter
- **Search:** Type to find specific icons
- **Preview:** Icons display in a grid for easy selection

**Styling:**
- **Size:** Adjust icon size (16px to 200px+)
- **Color:** Choose any color to match your design
- **Background:** Optional background color
- **Padding:** Space around icon
- **Border Radius:** Round corners (for circular icons)

**Transform:**
- **Rotation:** Rotate 0-360 degrees using angle picker
- **Alignment:** Position icon on page

### Tips & Best Practices
- **Consistent Size:** Use similar-sized icons for related items
- **Color Meaning:** Use color intentionally (green for success, red for error)
- **Don't Overuse:** Too many icons can be distracting
- **Pair with Text:** Icons work best alongside descriptive text
- **Visual Hierarchy:** Larger icons draw more attention
- **Brand Consistency:** Stick to a set of icons that match your style
- **Accessibility:** Ensure icons are large enough to see clearly

---

## SVG Block

### Overview
Upload and display SVG (Scalable Vector Graphics) files with transform controls. SVG files are vector images that stay sharp at any size.

### Key Features
- **Upload SVG Files:** Add SVG graphics from media library
- **Original Colors:** Displays SVG with its designed colors
- **Rotation Control:** Rotate 0-360 degrees
- **Flip Controls:** Horizontal and vertical flip toggles
- **Size Controls:** Width/height with multiple units (px, %, vw, vh, em, rem)
- **Aspect Ratio:** Maintain proportions by default
- **Full Alignment:** All WordPress alignment options

### Benefits of SVG
- **Infinite Scaling:** Looks perfect at any size
- **Small File Size:** Usually smaller than PNG/JPG
- **Sharp Display:** Crystal clear on retina/high-DPI screens
- **Editable:** Can be edited in design software
- **Transparent:** Supports transparency without jagged edges

### Common Use Cases
- Logos and branding
- Decorative graphics
- Infographics and diagrams
- Icons and symbols
- Illustrations
- Dividers and separators
- Background patterns
- Technical diagrams

### Settings Guide

**File:**
- **Upload SVG:** Choose SVG file from media library
- **Preview:** See SVG in editor with real colors

**Transform:**
- **Rotation:** 0-360 degrees using angle picker
- **Flip Horizontal:** Mirror image left-to-right
- **Flip Vertical:** Mirror image top-to-bottom

**Size:**
- **Width:** Set with units (px, %, vw, vh, em, rem)
- **Height:** Set with units (auto maintains aspect ratio)
- **Lock Aspect Ratio:** Keep proportions (enabled by default)

**Alignment:**
- Left, Center, Right: Standard alignments
- Wide: Extends beyond content width
- Full: Full browser width

### Where to Find SVG Files
- **Design Software:** Create in Adobe Illustrator, Inkscape, Figma
- **Stock Sites:** Many stock sites offer SVG downloads
- **Icon Libraries:** Font Awesome, Material Icons, Heroicons
- **Custom Design:** Hire designers to create custom SVGs

### Tips & Best Practices
- **Optimize Files:** Use SVGO or similar tools to reduce file size
- **Clean Paths:** Remove unnecessary elements before uploading
- **Test Display:** Ensure SVG looks correct after upload
- **Fallback:** Consider PNG fallback for email
- **Naming:** Use descriptive filenames for organization
- **Security:** Only upload SVGs from trusted sources

### SVG vs. Other Formats
- **vs PNG:** SVG scales infinitely, PNG becomes pixelated
- **vs JPG:** SVG supports transparency, better for graphics
- **vs GIF:** SVG has smoother colors, smaller file size
- **Best Use:** Logos, icons, illustrations, graphics with solid colors

---

## PDF Viewer Block

### Overview
Embed PDF documents directly in your WordPress pages for inline viewing. Visitors can read PDFs without downloading or leaving your site.

### Key Features
- **Inline Display:** PDFs display directly on the page
- **Native Browser Viewer:** Uses browser's built-in PDF rendering
- **Upload from Library:** Choose PDFs from media library
- **Size Control:** Set width and height
- **Mobile Responsive:** Adapts to different screen sizes

### Benefits
- **No Downloads Required:** Users can view without downloading
- **Keeps Users on Site:** No external PDF readers needed
- **Easy Updates:** Update PDF, changes reflect automatically
- **Cross-Platform:** Works on desktop and mobile browsers

### Common Use Cases
- Product catalogs and brochures
- Menus for restaurants
- Price lists and rate cards
- Terms and conditions documents
- User manuals and guides
- Reports and whitepapers
- Certificates and credentials
- Forms and applications

### Settings Guide

**File:**
- **Upload PDF:** Choose PDF from media library
- **Preview:** See PDF in editor

**Display:**
- **Width:** Set viewer width (%, px, vw)
- **Height:** Set viewer height (px, vh)
- **Default Size:** 100% width, 600px height

### Tips & Best Practices
- **File Size:** Keep PDFs under 5MB for faster loading
- **Optimization:** Compress PDFs before uploading
- **Height Setting:** Set sufficient height to show first page
- **Download Link:** Consider adding a download button alongside viewer
- **Mobile Testing:** Test viewing experience on phones/tablets
- **Accessibility:** Ensure PDFs are accessible with proper structure
- **Fallback:** Some browsers may show download button instead of inline view

### Browser Compatibility
- **Modern Browsers:** Chrome, Firefox, Safari, Edge support inline viewing
- **Mobile:** iOS Safari and Chrome support inline viewing
- **Older Browsers:** May show download button instead

---

## Responsive Image Block

### Overview
Display different images for desktop, tablet, and mobile devices using HTML5 picture element. Optimize user experience by showing device-appropriate images.

### Key Features
- **Device-Specific Images:** Different image for desktop, tablet, mobile
- **Custom Breakpoints:** Define exactly when each image shows
- **Independent Sizing:** Different dimensions for each device
- **Aspect Ratio Locking:** Maintain proportions per device
- **Smart Fallback:** Automatic fallback chain if images missing
- **Full Alignment:** All WordPress alignment options

### Benefits
- **Optimized Loading:** Smaller images on mobile save bandwidth
- **Better UX:** Show images designed for each screen size
- **Art Direction:** Different crops/compositions per device
- **Performance:** Reduce mobile data usage
- **Flexibility:** Complete control over responsive behavior

### Common Use Cases
- Hero images with different crops for mobile
- Product images showing different details
- Graphics that need different layouts per device
- Banner images with varying text placement
- Photography requiring different crops
- Infographics reformatted for mobile

### Settings Guide

**Desktop Image:**
- **Upload:** Choose desktop image
- **Dimensions:** Width and height
- **Breakpoint:** Minimum width for desktop (default 1024px)

**Tablet Image:**
- **Upload:** Choose tablet image
- **Dimensions:** Width and height
- **Breakpoint:** Minimum width for tablet (default 768px)

**Mobile Image:**
- **Upload:** Choose mobile image
- **Dimensions:** Width and height
- **Breakpoint:** Maximum width for mobile (default 767px)

**Common Settings:**
- **Alt Text:** Accessibility description
- **Alignment:** Image position on page
- **Link:** Optional link destination

### Fallback Behavior
If an image is missing:
1. Mobile users get tablet image (or desktop if no tablet)
2. Tablet users get desktop image (or mobile if no desktop)
3. Desktop users get tablet image (or mobile if no tablet)

### Tips & Best Practices
- **All Devices:** Upload images for all three sizes
- **Consistent Subject:** Show same subject/product across devices
- **Appropriate Crops:** Crop strategically for vertical mobile screens
- **File Size:** Compress mobile images more aggressively
- **Aspect Ratios:** Consider different aspect ratios per device
- **Testing:** View on actual devices to verify appearance

### Image Optimization
- **Desktop:** Larger file acceptable, high quality
- **Tablet:** Moderate compression, medium quality
- **Mobile:** Aggressive compression, prioritize file size

---

## Social Sharing Block

### Overview
Add social media sharing buttons to your content, allowing visitors to easily share your pages on major platforms.

### Key Features
- **Multiple Platforms:** Facebook, Twitter, LinkedIn, Pinterest, Email, WhatsApp, Reddit
- **3 Style Variations:** Outlined, Filled, Minimal
- **Platform Selection:** Choose which platforms to display
- **Customizable Colors:** Match buttons to your brand
- **Icon + Text or Icon Only:** Display options
- **Mobile Optimized:** Touch-friendly button sizes

### Supported Platforms

**Facebook:**
Share to Facebook timeline

**Twitter (X):**
Tweet with optional hashtags

**LinkedIn:**
Share to LinkedIn network

**Pinterest:**
Pin images to boards

**Email:**
Share via email client

**WhatsApp:**
Share via WhatsApp (mobile-optimized)

**Reddit:**
Submit to Reddit

### Style Variations

**Outlined:**
- Border around each button
- Transparent background
- Clean, professional look
- Platform-colored borders

**Filled:**
- Solid background colors
- White icons and text
- Bold, attention-grabbing
- Platform brand colors

**Minimal:**
- Icon only, no backgrounds
- Subtle, text-integrated
- Platform-colored icons
- Most compact option

### Common Use Cases
- Blog posts and articles
- Product pages
- Portfolio items
- News and announcements
- Events and promotions
- Case studies
- Resources and downloads

### Settings Guide

**Platforms:**
- **Enable/Disable:** Toggle each platform on/off
- **Order:** Arrange platforms in desired order
- **Common Combinations:**
  - Blog: Facebook, Twitter, LinkedIn, Email
  - E-commerce: Facebook, Pinterest, WhatsApp
  - News: Twitter, Facebook, Reddit, Email

**Display:**
- **Style:** Outlined, Filled, or Minimal
- **Show Labels:** Display platform names or icons only
- **Button Size:** Small, medium, or large
- **Alignment:** Left, center, right, full

**Advanced:**
- **Custom Colors:** Override platform default colors
- **Border Radius:** Rounded corners for buttons
- **Spacing:** Gap between buttons

### Tips & Best Practices
- **Strategic Placement:** Place near content end or at natural stopping points
- **Platform Selection:** Choose platforms your audience actually uses
- **Don't Overwhelm:** 3-5 platforms is usually sufficient
- **Match Style:** Choose style that fits your site design
- **Mobile Usability:** Ensure buttons are tappable (minimum 44x44px)
- **Test Sharing:** Verify share text and images appear correctly

### Privacy Considerations
- Sharing buttons don't track users until clicked
- No cookies or tracking scripts loaded
- Privacy-friendly implementation
- Users control what they share

---

## Charts Block

### Overview
Create beautiful, interactive data visualizations powered by D3.js. Transform your data into engaging charts and graphs.

### Key Features
- **5 Chart Types:** Bar, Line, Pie, Area, Scatter
- **Custom Colors:** Color schemes and individual data point colors
- **Responsive:** Automatically adapts to screen size
- **Interactive:** Hover tooltips show data values
- **Animations:** Smooth entrance and transition effects
- **Legend:** Optional legend display
- **Grid Lines:** Customizable axis grid

### Chart Types

**Bar Chart:**
- Compare values across categories
- Vertical or horizontal orientation
- Grouped or stacked options
- Best for: Comparing discrete values

**Line Chart:**
- Show trends over time
- Multiple data series support
- Smooth or straight lines
- Best for: Time-series data, trends

**Pie Chart:**
- Show proportions of a whole
- Donut chart option
- Percentage labels
- Best for: Part-to-whole relationships

**Area Chart:**
- Similar to line chart but filled
- Stacked area option
- Emphasizes magnitude
- Best for: Cumulative totals, volume

**Scatter Plot:**
- Show relationships between variables
- Multiple data series
- Trend lines optional
- Best for: Correlation, distribution

### Common Use Cases
- Sales and revenue reporting
- Website analytics dashboards
- Survey results visualization
- Performance metrics
- Progress tracking
- Comparison data
- Statistical analysis
- Financial reports

### Settings Guide

**Data:**
- **Add Data Points:** Enter labels and values
- **Multiple Series:** Add multiple datasets
- **Import CSV:** Upload data from CSV file (if available)
- **Edit Values:** Click to modify data

**Chart Type:**
- **Select Type:** Bar, Line, Pie, Area, Scatter
- **Orientation:** Vertical/horizontal (bar charts)
- **Style Options:** Grouped, stacked, donut, etc.

**Appearance:**
- **Color Scheme:** Choose preset or custom colors
- **Individual Colors:** Override specific data point colors
- **Background:** Chart background color
- **Borders:** Show/hide chart borders

**Elements:**
- **Legend:** Show/hide, position (top, bottom, left, right)
- **Grid Lines:** Show/hide, customize style
- **Axis Labels:** Show/hide, customize text
- **Data Labels:** Display values on chart
- **Tooltips:** Enable hover tooltips

**Size:**
- **Width:** Chart width (%, px, vw)
- **Height:** Chart height (px, vh)
- **Responsive:** Auto-adjust to container

**Animation:**
- **Enable Animation:** Smooth entrance effect
- **Duration:** Animation speed
- **Easing:** Animation timing function

### Tips & Best Practices
- **Clear Labels:** Use descriptive axis and data labels
- **Color Meaning:** Choose colors intentionally
- **Data Accuracy:** Double-check data before publishing
- **Appropriate Type:** Match chart type to data relationship
- **Simplicity:** Don't overcomplicate visualizations
- **Mobile Testing:** Ensure charts work on small screens
- **Legend Placement:** Position legend where it doesn't obscure data
- **Accessibility:** Provide text alternative for data

### Chart Selection Guide
- **Comparing Categories:** Bar chart
- **Showing Trends:** Line or area chart
- **Parts of Whole:** Pie chart
- **Relationships:** Scatter plot
- **Multiple Metrics:** Grouped bar or multi-line
- **Time Series:** Line or area chart

---

## Countdown Timer Block

### Overview
Create countdown timers for events, promotions, product launches, or any time-sensitive occasion. Includes evergreen mode for per-visitor countdowns.

### Key Features
- **Event Countdown:** Count down to specific date/time
- **Evergreen Mode:** Per-visitor countdown using browser storage
- **3 Layout Styles:** Grid (default), Inline, Stacked
- **Expiry Message:** Custom message when countdown ends
- **Auto-hide:** Optionally hide timer after expiration
- **Time Units:** Days, Hours, Minutes, Seconds
- **Live Updates:** Real-time countdown display

### Countdown Modes

**Event Mode:**
- Set specific end date and time
- Counts down to that moment
- Same for all visitors
- Best for: Product launches, sales end dates, events

**Evergreen Mode:**
- Countdown starts when visitor first sees it
- Duration-based (e.g., 24 hours from first view)
- Unique per visitor using localStorage
- Best for: Limited-time offers, trial periods, urgency

### Layout Styles

**Grid (Default):**
- 4-column grid layout
- Days | Hours | Minutes | Seconds
- Boxed appearance
- Best for prominent display

**Inline:**
- Horizontal row
- Compact presentation
- Separated by colons or separators
- Best for in-content use

**Stacked:**
- Vertical arrangement
- Units stack on top of each other
- Space-efficient
- Best for sidebars

### Common Use Cases
- Product launch countdowns
- Sale end date timers
- Event registration deadlines
- Webinar start times
- Limited-time offers
- Special promotion periods
- Pre-order deadlines
- Contest entry periods

### Settings Guide

**Countdown Type:**
- **Event:** Specific date and time
- **Evergreen:** Duration from first view

**End Date & Time (Event Mode):**
- **Date:** Select calendar date
- **Time:** Set specific time
- **Timezone:** Set timezone (uses WordPress setting)

**Duration (Evergreen Mode):**
- **Days:** Number of days
- **Hours:** Number of hours
- **Minutes:** Number of minutes

**Display:**
- **Layout:** Grid, Inline, or Stacked
- **Show/Hide Units:** Toggle Days, Hours, Minutes, Seconds
- **Labels:** Customize unit labels
- **Separators:** Colon, pipe, or custom (inline layout)

**Styling:**
- **Number Size:** Large countdown numbers
- **Label Size:** Small unit labels
- **Colors:** Numbers, labels, backgrounds
- **Box Style:** Borders, backgrounds, spacing (grid layout)

**Expiry:**
- **Expiry Message:** Text shown when countdown ends
- **Auto-hide:** Hide timer after expiration
- **Redirect URL:** Optional page to redirect to

### Tips & Best Practices
- **Clear Purpose:** Explain what the countdown is for
- **Visible Placement:** Put countdown where users will see it
- **Appropriate Duration:** Match countdown length to offer importance
- **Test Expiry:** Verify expiry message displays correctly
- **Timezone Awareness:** Set correct timezone for accuracy
- **Mobile Display:** Test layout on mobile devices
- **Urgency Balance:** Don't overuse countdown timers

### Evergreen Mode Use Cases
- "24 hours to claim your discount"
- "Your free trial expires in 7 days"
- "Limited-time offer - 3 hours remaining"
- "Early bird pricing ends in 48 hours"

### Technical Notes
- Evergreen countdown uses browser localStorage
- Clearing browser data resets evergreen timer
- Event countdown uses server time
- Updates every second while visible

---

## Reading Time Block

### Overview
Automatically calculate and display estimated reading time for your content. Helps users decide if they have time to read your article.

### Key Features
- **Automatic Calculation:** Counts words in post content
- **Customizable WPM:** Adjust words-per-minute rate
- **Image Time:** Optionally add time for viewing images
- **Icon Options:** Font Awesome icons (book, clock, eye)
- **Rounding Methods:** Round, ceil, or floor
- **Caching:** WordPress transients for performance
- **Custom Format:** Customize display text

### Benefits
- **User Expectation:** Users know time commitment
- **Engagement:** May increase completions of shorter articles
- **UX Enhancement:** Professional touch to articles
- **SEO:** Some studies suggest impact on dwell time

### Common Use Cases
- Blog posts and articles
- Long-form content
- Documentation pages
- News articles
- Tutorials and guides
- Case studies
- Research papers

### Settings Guide

**Reading Speed:**
- **Words Per Minute:** Default 200 (average adult reading speed)
- **Adjust for Audience:**
  - Technical content: 150-175 WPM
  - General content: 200-250 WPM
  - Light reading: 250-300 WPM

**Images:**
- **Include Images:** Add time for image viewing
- **Seconds Per Image:** Default 12 seconds
- **Large Images:** Consider adding more time

**Display:**
- **Icon:** Book, Clock, Eye, or none
- **Format:** "X min read", "Reading time: X minutes", custom
- **Rounding:**
  - Round: 7.5 min → 8 min
  - Ceil: 7.1 min → 8 min
  - Floor: 7.9 min → 7 min

**Styling:**
- **Font Size:** Adjust text size
- **Color:** Icon and text color
- **Alignment:** Left, center, right

**Caching:**
- **Cache Duration:** Default 1 hour
- **Clear Cache:** When post updated
- **Performance:** Improves page load speed

### Tips & Best Practices
- **Strategic Placement:** Top of article, near title/date
- **Accurate Estimate:** Test with actual reading
- **Consistency:** Use across all posts
- **Realistic Numbers:** Don't inflate to seem more substantial
- **Consider Content:** Technical content takes longer
- **Mobile Display:** Ensure readable on small screens

### Reading Time Accuracy
**Factors Affecting Reading Time:**
- Technical jargon and complexity
- Reader familiarity with topic
- Number of images/media
- Code blocks or special formatting
- Reader's native language
- Scanning vs. deep reading

**Average WPM by Content:**
- Light fiction: 300 WPM
- General articles: 200-250 WPM
- Technical articles: 150-200 WPM
- Academic papers: 100-150 WPM

---

## Weather Block

### Overview
Display real-time weather information and forecasts using the National Weather Service API. Show current conditions and upcoming weather for any US location.

### Key Features
- **Current Weather:** Temperature, conditions, humidity, wind
- **Forecast:** Up to 7 days ahead, day and night periods
- **Font Awesome Icons:** Beautiful weather condition icons
- **Location Control:** Custom location name or auto-detected
- **3 Display Modes:** Compact, Current, Full
- **Data Caching:** Hourly, daily, or manual refresh
- **Temperature Units:** Fahrenheit or Celsius
- **No API Key:** Free National Weather Service data

### Display Modes

**Compact:**
- Icon + temperature only
- Minimal inline display
- Best for: Sidebars, headers, footers

**Current:**
- Expanded weather card
- All current conditions
- Location, temp, conditions, humidity, wind
- Best for: Main content areas

**Full:**
- Current weather + forecast
- Horizontal scrollable forecast cards
- Day/night forecasts optional
- Best for: Dedicated weather sections

### Weather Data Displayed

**Current Conditions:**
- Temperature (with "feels like")
- Weather condition description
- Humidity percentage
- Wind speed and direction
- Weather icon

**Forecast:**
- Daily high/low temperatures
- Conditions for each period
- Day and night forecasts
- Weather icons for each period

### Common Use Cases
- Local business websites
- Event planning sites
- Outdoor recreation sites
- Travel and tourism sites
- Agricultural sites
- Weather-dependent services
- News/media sites
- Community portals

### Settings Guide

**Location:**
- **Latitude/Longitude:** Coordinates for weather location
- **Custom Location Name:** Override API location name
- **Show Location:** Toggle location display on/off

**Display Mode:**
- **Compact:** Minimal display
- **Current:** Expanded current weather
- **Full:** Current + forecast

**Forecast Options (Full Mode):**
- **Number of Days:** 1-7 days
- **Show Night Forecasts:** Include night periods
- **Forecast Layout:** Horizontal scroll with snap

**Data:**
- **Temperature Unit:** Fahrenheit or Celsius
- **Show Humidity:** Toggle humidity display
- **Show Wind:** Toggle wind speed display
- **Show Precipitation:** Toggle precipitation chance

**Caching:**
- **Refresh Rate:** Hourly, daily, or manual
- **Cache Duration:** How long to store data
- **Manual Refresh:** Update on demand

**Styling:**
- **Colors:** Temperature, text, background
- **Icon Size:** Weather icon dimensions
- **Font Sizes:** Temperature, labels, forecast
- **Spacing:** Padding and gaps

### Weather Icons

**Conditions Covered:**
- Clear/Sunny (sun icon)
- Clear Night (moon icon)
- Cloudy (cloud icon)
- Partly Cloudy (sun behind cloud)
- Rain (cloud with rain)
- Snow (cloud with snowflakes)
- Thunderstorm (cloud with lightning)
- Fog (cloud with horizontal lines)
- Wind (wind icon)
- Hot (thermometer sun)
- Cold (thermometer snowflake)
- Freezing Rain (icicles)
- Tornado/Severe (tornado icon)

### Tips & Best Practices
- **Location Accuracy:** Use precise coordinates for accurate weather
- **Custom Names:** Override inaccurate API location names
- **Cache Settings:** Hourly refresh balances freshness and performance
- **Compact for Global:** Use compact mode in headers/footers
- **Full for Local:** Use full mode for location-specific pages
- **Mobile Testing:** Verify horizontal scroll works on touch devices
- **Loading States:** Ensure placeholders display while loading

### API & Data Source
- **Provider:** National Weather Service (NOAA)
- **Coverage:** United States locations
- **Cost:** Free, no API key required
- **Update Frequency:** Hourly for current, twice daily for forecast
- **Reliability:** Official government data source

### Finding Coordinates
1. Google Maps: Right-click location, copy coordinates
2. GPS device: Use device coordinates
3. Address lookup: Use geocoding service to convert address

### Troubleshooting
- **No Data:** Check coordinates are in US
- **Inaccurate Location:** Set custom location name
- **Stale Data:** Reduce cache duration or manually refresh
- **Missing Icons:** Ensure Font Awesome loading correctly

---

## Query Posts Block

### Overview
Display WordPress posts with advanced filtering, searching, and layout options. The most powerful block for showcasing blog content, products, or any custom post type.

### Key Features
- **Post Type Selection:** Posts, pages, custom post types
- **Taxonomy Filters:** Filter by categories, tags, or custom taxonomies
- **AJAX Search:** Real-time search without page reload
- **AJAX Filtering:** Dynamic category/tag filtering
- **4 Display Modes:** Grid, List, Masonry, Carousel
- **Pagination:** Load more button or standard pagination
- **Carousel Mode:** Swiper.js integration with all carousel features
- **Sort Options:** Date, title, modified date, random
- **Author Filtering:** Show posts from specific authors
- **Date Filtering:** Posts from specific date ranges

### Display Modes

**Grid:**
- Equal-height cards in rows
- Customizable columns (1-6)
- Responsive breakpoints
- Best for: Even content lengths

**List:**
- Vertical stacked layout
- Full-width items
- Clean, traditional blog style
- Best for: Text-heavy content

**Masonry:**
- Pinterest-style layout
- Items fit naturally
- Varying heights accommodate content
- Best for: Mixed content lengths

**Carousel:**
- Swiper.js slideshow
- All carousel features available
- Navigation and pagination
- Best for: Featured content, highlights

### AJAX Features

**Search:**
- Real-time search as user types
- Debounced for performance
- Searches titles and content
- No page reload required

**Category/Tag Filtering:**
- Click to filter by taxonomy term
- Multiple term selection
- AND/OR logic options
- Updates instantly

**Date Filtering:**
- Filter by year and/or month
- Dropdown selectors
- Combine with other filters

**Sort Dropdown:**
- Change sort order on-the-fly
- Options: Date (newest/oldest), title (A-Z/Z-A), modified, random
- Instant reordering

### Common Use Cases
- Blog post archives
- Product catalogs
- Portfolio galleries
- News sections
- Event listings
- Team member directories
- Case study showcases
- Resource libraries
- Documentation archives

### Settings Guide

**Query:**
- **Post Type:** Posts, pages, or custom post type
- **Posts Per Page:** Number to display
- **Order By:** Date, title, modified, random
- **Order:** Ascending or descending
- **Post Status:** Published, draft, future, etc.

**Filters:**
- **Categories:** Include/exclude specific categories
- **Tags:** Include/exclude specific tags
- **Custom Taxonomies:** Filter by any taxonomy
- **Authors:** Show posts from specific authors
- **Date Range:** Posts between dates
- **Sticky Posts:** Include/exclude sticky posts

**Display:**
- **Layout:** Grid, List, Masonry, Carousel
- **Columns:** Number of columns (Grid/Masonry)
- **Show Featured Image:** Toggle image display
- **Show Title:** Toggle title display
- **Show Excerpt:** Toggle excerpt display
- **Show Meta:** Date, author, categories
- **Show Read More:** Link to full post

**AJAX:**
- **Enable Search:** Real-time search box
- **Enable Filters:** Category/tag filter buttons
- **Enable Date Filter:** Year/month dropdowns
- **Enable Sort:** Sort dropdown
- **Debounce Delay:** Search typing delay (ms)

**Carousel Settings (when Carousel mode selected):**
- All standard carousel settings available
- Slides per view, autoplay, navigation
- Pagination, effects, loop, etc.

**Pagination:**
- **Type:** Load more button, numbered, or none
- **Text:** Customize button text
- **Position:** Center, left, right

### Tips & Best Practices
- **Clear Filters:** Make filter options clear to users
- **Performance:** Limit posts per page to 12-24 for good performance
- **Image Optimization:** Use appropriate image sizes for display mode
- **Excerpt Length:** Keep excerpts concise and consistent
- **Mobile Layout:** Test grid columns on mobile (2 max recommended)
- **Loading States:** Show loading indicator during AJAX operations
- **Empty States:** Display helpful message when no posts match filters
- **Accessibility:** Ensure filters and navigation are keyboard accessible

### Carousel Mode Tips
- **Slides Per View:** 1-3 for posts with images
- **Autoplay:** Consider if appropriate for content type
- **Navigation:** Enable for user control
- **Loop:** Enable for continuous browsing
- **Mobile:** Show 1 slide on mobile for readability

### Advanced Use Cases
- **Related Posts:** Filter by same category as current post
- **Author Archives:** Filter by specific author ID
- **Recent Updates:** Order by modified date
- **Random Features:** Random order with limit of 3-5
- **Date Archives:** Combine date filter with specific post type

---

## Summary

This comprehensive documentation covers all 20 main Prolific Blocks, organized by category:

**Layout Blocks:**
- Carousel, Carousel New, Tabs, Tabbed Content, Timeline

**Navigation Blocks:**
- Hamburger Menu, Breadcrumbs, Table of Contents, Anchor Navigation

**Media & Content Blocks:**
- Lottie Animation, Icon, SVG, PDF Viewer, Responsive Image, Social Sharing, Charts

**Utility Blocks:**
- Countdown Timer, Reading Time, Weather

**Query Blocks:**
- Query Posts

Each block's documentation includes:
- Overview and key features
- Benefits and use cases
- Complete settings guide
- Tips and best practices
- Technical details where relevant

All documentation is written in non-technical, public-facing language suitable for end users.
