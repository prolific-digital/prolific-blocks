# Query Posts Block

A comprehensive, feature-rich block for displaying posts with advanced query options, multiple display modes including carousel, and powerful search and filter capabilities.

## Features

### Query Settings
- **Post Type Selection**: Choose from Posts, Pages, or any registered custom post type
- **Posts Per Page**: Display 1-100 posts
- **Order By**: Date, Title, Modified, Menu Order, Random, Author, Comment Count
- **Order**: Ascending or Descending
- **Offset**: Skip first N posts
- **Include/Exclude**: Filter specific post IDs
- **Post Status**: Published, Draft, Pending, Private, or Any
- **Sticky Posts**: Include, Exclude, or Only show sticky posts

### Taxonomy Filters
- **Categories**: Multi-select category filter (for posts)
- **Tags**: Multi-select tag filter (for posts)
- **Authors**: Filter by multiple authors
- **Custom Taxonomies**: Support for custom post type taxonomies

### Display Modes
1. **Grid** - Responsive grid layout with customizable columns
2. **List** - Vertical list with optional image positioning (top, left, right)
3. **Masonry** - Pinterest-style masonry grid
4. **Carousel** - Swiper.js powered carousel with full controls

### Carousel Features
When carousel mode is enabled, you get:
- **Responsive Slides**: Different slides per view for Desktop, Tablet, Mobile
- **Customizable Spacing**: Control space between slides for each breakpoint
- **Loop Mode**: Infinite scrolling
- **Autoplay**: With customizable delay and pause on hover
- **Navigation**: Previous/Next arrows
- **Pagination**: Bullets, Fraction, or Progress bar
- **Speed Control**: Transition speed control
- **Advanced Options**: Centered slides, grab cursor, keyboard navigation

### Layout Controls
For Grid/List modes:
- **Columns**: 1-6 columns for Desktop, Tablet, Mobile
- **Gap**: Customizable spacing between items
- **Equal Height**: Make all cards the same height (grid only)
- **Image Position**: Top, Left, or Right (list only)

### Content Display
Customize what to show for each post:
- **Featured Image**: Show/hide with size selection
- **Title**: Show/hide with heading level (H1-H6)
- **Excerpt**: Show/hide with word count control (10-200 words)
- **Meta Data**: Author, Date, Categories, Tags
- **Read More Link**: Customizable button text

### Search & Filters (AJAX-Powered)
Enable powerful frontend filtering:
- **Search Box**: Filter posts by title/content (with debouncing)
- **Category Filter**: Dropdown to filter by category
- **Tag Filter**: Dropdown to filter by tag
- **Date Filter**: Filter by year and month
- **Sort Dropdown**: Allow users to change post ordering
- **Load More**: AJAX load more posts button
- **Pagination**: Traditional numbered pagination

## Block Attributes

### Query Attributes
```json
{
  "postType": "post",
  "postsPerPage": 10,
  "orderBy": "date",
  "order": "desc",
  "offset": 0,
  "includeIds": "",
  "excludeIds": "",
  "categories": [],
  "tags": [],
  "authorIds": [],
  "postStatus": "publish",
  "stickyPosts": "include"
}
```

### Display Attributes
```json
{
  "displayMode": "grid",
  "columns": 3,
  "columnsTablet": 2,
  "columnsMobile": 1,
  "gap": 20,
  "equalHeight": false
}
```

### Carousel Attributes
```json
{
  "enableCarousel": false,
  "slidesPerViewDesktop": 3,
  "slidesPerViewTablet": 2,
  "slidesPerViewMobile": 1,
  "spaceBetweenDesktop": 30,
  "spaceBetweenTablet": 20,
  "spaceBetweenMobile": 10,
  "carouselLoop": false,
  "carouselAutoplay": false,
  "autoplayDelay": 3000,
  "carouselNavigation": true,
  "carouselPagination": true,
  "paginationType": "bullets",
  "carouselSpeed": 300,
  "centeredSlides": false,
  "pauseOnHover": true,
  "grabCursor": true,
  "keyboard": true
}
```

### Content Attributes
```json
{
  "showFeaturedImage": true,
  "imageSizeSlug": "large",
  "imagePosition": "top",
  "showTitle": true,
  "titleTag": "h2",
  "showExcerpt": true,
  "excerptLength": 55,
  "showMeta": true,
  "showAuthor": true,
  "showDate": true,
  "showCategories": true,
  "showTags": false,
  "showReadMore": true,
  "readMoreText": "Read More"
}
```

### Search & Filter Attributes
```json
{
  "showSearch": false,
  "searchPlaceholder": "Search posts...",
  "showCategoryFilter": false,
  "showTagFilter": false,
  "showDateFilter": false,
  "showSortDropdown": false,
  "enableLoadMore": false,
  "loadMoreText": "Load More",
  "enablePagination": false,
  "noResultsText": "No posts found."
}
```

## Usage Examples

### Example 1: Simple Post Grid
```
Display the 6 most recent posts in a 3-column grid:
- Post Type: Post
- Posts Per Page: 6
- Display Mode: Grid
- Columns: 3
- Show Featured Image: Yes
- Show Excerpt: Yes
```

### Example 2: Category-Filtered Carousel
```
Show posts from "News" category in a carousel:
- Post Type: Post
- Categories: News
- Display Mode: Grid
- Enable Carousel: Yes
- Slides Per View (Desktop): 3
- Autoplay: Yes
- Navigation: Yes
```

### Example 3: Searchable Portfolio
```
Custom post type with search and filters:
- Post Type: Portfolio
- Posts Per Page: 12
- Display Mode: Masonry
- Show Search: Yes
- Show Category Filter: Yes
- Enable Load More: Yes
```

### Example 4: Featured Posts List
```
Show only sticky posts in a list:
- Post Type: Post
- Sticky Posts: Only Sticky
- Display Mode: List
- Image Position: Left
- Show Meta: Yes
```

## Inspector Controls Panels

The block provides organized settings in the sidebar:

1. **Query Settings** - Basic query configuration
2. **Filters** - Taxonomy and ID-based filters
3. **Display Mode** - Choose layout type and carousel toggle
4. **Carousel Settings** - All carousel options (conditional)
5. **Layout** - Columns and spacing (non-carousel only)
6. **Content Display** - Control what's shown for each post
7. **Search & Filters** - Frontend search and filter options

## Frontend Features

### Carousel Initialization
The carousel automatically initializes with Swiper.js when enabled, supporting:
- Touch/swipe navigation
- Keyboard arrow keys
- Mouse wheel scrolling (if enabled)
- Responsive breakpoints
- Autoplay with pause on hover

### AJAX Search & Filtering
When search/filter options are enabled:
- Real-time search with 500ms debounce
- Smooth filtering without page reload
- Loading states during fetch
- Error handling
- Maintains current selections

### Load More
The load more button:
- Appends new posts to existing content
- Updates to show "No more posts" when exhausted
- Loading state during fetch
- Works with filters and search

## Styling

### CSS Classes
The block uses BEM-style classes:
- `.prolific-query-posts` - Main wrapper
- `.query-controls` - Search/filter controls
- `.posts-grid` / `.posts-list` / `.posts-masonry` - Layout containers
- `.post-item` - Individual post card
- `.post-thumbnail` - Featured image wrapper
- `.post-content` - Content wrapper
- `.post-title` - Title element
- `.post-meta` - Meta information
- `.post-excerpt` - Excerpt text
- `.post-read-more` - Read more link

### Customization
The block includes comprehensive styles but can be customized via:
1. **Theme CSS**: Override block classes in your theme
2. **Custom CSS**: Use Additional CSS in Customizer
3. **CSS Variables**: The block respects theme colors where applicable

### Dark Mode
The block includes dark mode support via `prefers-color-scheme: dark`

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- IE11+ for basic functionality
- Swiper.js web component requires modern browser for carousel mode

## Performance

### Optimizations
- Server-side rendering via PHP (no client-side post fetching on load)
- Lazy loading can be added via theme/plugin
- Debounced search prevents excessive requests
- Efficient DOM updates for AJAX operations

### Best Practices
- Limit posts per page for better performance
- Use appropriate image sizes
- Enable caching for query results (via plugin)
- Consider pagination over load more for very large datasets

## Accessibility

The block is built with accessibility in mind:
- Semantic HTML structure
- ARIA labels for controls
- Keyboard navigation support
- Screen reader friendly
- Focus management
- Color contrast compliant

## Known Limitations

1. AJAX filtering requires the REST API to be enabled
2. Masonry layout uses CSS Grid (basic implementation)
3. Custom taxonomies require manual configuration
4. Load more pagination is simulated (not true pagination)

## Future Enhancements

Potential features for future versions:
- Advanced custom taxonomy support UI
- Query by meta fields
- Save query presets
- Export/import block settings
- Additional carousel effects
- Infinite scroll option
- Isotope.js integration for masonry

## Support

For issues or feature requests, please contact Prolific Digital or submit an issue on the plugin repository.

## Credits

- Built with WordPress Block API v3
- Uses Swiper.js for carousel functionality
- Developed by Prolific Digital
