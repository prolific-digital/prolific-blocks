# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.1.0] - 2026-09-29

### Changed
- Updates now come from the Prolific Digital license server (`api.prolificdigital.io`) instead of GitHub releases. Set `PROLIFIC_LICENSE_KEY_PROLIFIC_BLOCKS` in `wp-config.php` (or use the `prolific_license_key` filter) to receive updates.
- plugin-update-checker is now installed with Composer (^5.7) instead of the 5.5 copy bundled in `updater/`.
- The Tabs and Hamburger block editor strings used the placeholder text domain `text-domain`; they now use `prolific-blocks`. Translations load from `languages/`.
- Requires WordPress 6.5+ and PHP 8.4+.
- License file is now GPL-2.0 (the plugin header already said GPL-2.0-or-later; the repository shipped the GPL-3.0 text).

### Added
- `PROLIFIC_BLOCKS_VERSION` constant.
- `README.md` development notes, this changelog, coding-standards config and CI/release workflows.

## [1.0.1] - 2025-03-02

### Changed
- Build workflow fix; plugin updater moved to `updater/`. (Tagged on a side commit; `main` kept the 1.0.0 header.)

## [1.0.0] - 2025-03-01

### Added
- Initial release with Hamburger, Carousel, Lottie, Timeline and Tabs blocks.
- ARIA controls in the Hamburger block.
- Play-on-scroll for Lottie animations.

[Unreleased]: https://github.com/prolific-digital/prolific-blocks/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/prolific-digital/prolific-blocks/compare/v1.0.1...v1.1.0
[1.0.1]: https://github.com/prolific-digital/prolific-blocks/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/prolific-digital/prolific-blocks/releases/tag/v1.0.0
