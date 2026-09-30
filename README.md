# Prolific Blocks - WordPress Plugin

## Overview

Prolific Blocks is a WordPress plugin designed to expand the functionality of the block editor by introducing additional customizable blocks. Whether you want to integrate stylish hamburger menus, carousels, interactive Lottie animations, dynamic timelines, or tabbed content, Prolific Blocks has the tools you need to create engaging web experiences.

## Current Blocks

### 1. Hamburger Block

- Add a customizable hamburger button to your page.
- Clicking the button toggles an `active` class on the `<body>` tag, enabling interaction with menus or other elements.
- Supports various animation styles for the hamburger button.
- Manage ARIA controls for accessibility.

### 2. Carousel Block

- Create responsive carousels with unlimited slides.
- Configure slides per view, spacing between slides, and device-specific settings for desktop, tablet, and mobile.
- Flexible options to customize the appearance and behavior of your carousel.
- Full accessibility support with keyboard navigation, screen reader announcements, and pause controls.
- Enhanced security with robust SVG sanitization for custom navigation icons.
- Mobile-optimized with touch support enabled by default.
- Built using the Swiper.js library for smooth performance.

### 3. Lottie Block

- Upload Lottie animations (JSON files) directly to your WordPress media library.
- Customize playback options such as speed, autoplay, looping, and more.
- Enable "play on scroll" to trigger animations as users scroll through your page.
- Support for starting animation when it becomes visible in the viewport.

### 4. Timeline Block

- Build vertical timelines with unlimited items.
- Supports native scrolling animations for a smooth user experience.
- Easily customize each timeline item's appearance.

### 5. Tabs Block

- Create tabbed content sections with customizable appearance.
- Add any block content within each tab panel.
- Improve content organization and user experience.

## Installation

### Step 1: Download the Plugin

Download `prolific-blocks.zip` from the latest [GitHub release](https://github.com/prolific-digital/prolific-blocks/releases).

### Step 2: Install the Plugin

1. In your WordPress dashboard, navigate to **Plugins > Add New**.
2. Click on **Upload Plugin** and select the `prolific-blocks.zip` file.
3. Click **Install Now**.

### Step 3: Activate the Plugin

Once installed, click **Activate Plugin** to start using Prolific Blocks.

## Usage

After activation, you can start using the available blocks in the WordPress block editor.

### How to Use the Blocks

#### Hamburger Block

1. Add the Hamburger Block to your page.
2. Customize the button's animation style and design in the block settings.
3. When clicked, it will toggle an `active` class on the `<body>` tag, allowing you to reveal hidden menus or other elements.
4. Set ARIA controls to enhance accessibility.

#### Carousel Block

1. Insert the Carousel Block into any page or post.
2. Add as many slides as needed.
3. Adjust settings for slide spacing, slides per view, and responsive behavior for different devices.
4. Enable accessibility features like keyboard navigation and screen reader support.
5. Add custom navigation arrows using SVG files from your media library.
6. Configure autoplay settings with pause on hover and pause controls.

#### Lottie Block

1. Upload a Lottie JSON file through the block editor.
2. Customize animation options such as autoplay, loop, and animation speed.
3. Enable "play on scroll" or "start on view" to enhance user interaction.

#### Timeline Block

1. Add the Timeline Block to display a vertical timeline.
2. Customize the content and appearance of each timeline item.
3. Enable scrolling animations to enhance the user experience.

#### Tabs Block

1. Add the Tabs Block to your page.
2. Insert Tab Panel blocks within it to organize your content.
3. Customize the appearance and behavior of the tabs.

## Requirements

WordPress 6.5+, PHP 8.4+. Text domain `prolific-blocks`.

## Automatic Updates

Updates are served by the Prolific Digital license server. Add the site's license key to `wp-config.php`:

```php
define( 'PROLIFIC_LICENSE_KEY_PROLIFIC_BLOCKS', 'your-key' );
```

You can also supply the key with the `prolific_license_key` filter, which receives `( $key, 'prolific-blocks' )`.

## Stored data

None. The plugin stores no options or tables.

## Development

`build/` is not committed. Build it from `src/` with `@wordpress/scripts`:

```sh
npm ci
npm run build        # or: npm start
ddev exec -d /var/www/html/wp-content/plugins/prolific-blocks composer install
ddev exec -d /var/www/html/wp-content/plugins/prolific-blocks composer lint
ddev exec -d /var/www/html/wp-content/plugins/prolific-blocks composer phpcs
```

`vendor/` is not committed either. A git checkout needs `composer install` before the updater loads (the plugin still runs without it).

## Releasing

1. Bump the version in the plugin header, `PROLIFIC_BLOCKS_VERSION`, `readme.txt` `Stable tag`, `package.json` and `package-lock.json`.
2. Add a `## [x.y.z] - YYYY-MM-DD` section to `CHANGELOG.md` and a `= x.y.z =` entry to `readme.txt`.
3. Merge to `main`, then push a `vx.y.z` tag. The shared release workflow runs `composer install --no-dev` and `npm ci && npm run build`, then builds `prolific-blocks.zip` (honoring `.distignore`, which keeps `build/` and drops `src/`) and attaches it to a GitHub Release.

## Upcoming Features

We're constantly improving Prolific Blocks and plan to introduce more block types and features in future updates. Stay tuned for exciting new functionality.

## License

Prolific Blocks is licensed under GPL-2.0-or-later.
