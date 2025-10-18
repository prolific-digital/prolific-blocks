/**
 * Frontend JavaScript for Carousel New block.
 *
 * Handles:
 * - Swiper initialization and custom navigation
 * - Pause button functionality
 * - Focus management for accessibility
 * - ARIA attributes for screen readers
 * - Browser compatibility
 *
 * @since 1.0.0
 */
(function () {
	'use strict';

	/**
	 * Initialize all carousel instances when DOM is ready.
	 */
	function initCarousels() {
		const carousels = document.querySelectorAll(
			'section[id^="carousel-new-"]'
		);
		if (!carousels.length) return;

		carousels.forEach(setupCarousel);
	}

	/**
	 * Set up a single carousel instance.
	 *
	 * @param {HTMLElement} carousel - The carousel container element.
	 */
	function setupCarousel(carousel) {
		const swiperContainer = carousel.querySelector('swiper-container');
		if (!swiperContainer) return;

		// Wait for Swiper to be fully initialized
		swiperContainer.addEventListener('swiperready', function () {
			const swiper = this.swiper;
			if (!swiper) return;

			setupCustomNavigation(carousel, swiper);
			setupPauseButton(carousel, swiper);
			setupFocusManagement(swiper);
			setupA11yAttributes(swiper);
			setupBrowserCompatibility(swiper);
		});
	}

	/**
	 * Set up custom navigation buttons.
	 *
	 * @param {HTMLElement} carousel - The carousel container.
	 * @param {Object} swiper - The Swiper instance.
	 */
	function setupCustomNavigation(carousel, swiper) {
		const prevButton = carousel.querySelector('.carousel-new-nav-prev');
		const nextButton = carousel.querySelector('.carousel-new-nav-next');

		if (!prevButton || !nextButton) return;

		prevButton.addEventListener('click', function () {
			swiper.slidePrev();
		});

		nextButton.addEventListener('click', function () {
			swiper.slideNext();
		});

		// Update button states
		updateNavigationState(swiper, prevButton, nextButton);

		swiper.on('slideChange', function () {
			updateNavigationState(swiper, prevButton, nextButton);
		});
	}

	/**
	 * Update navigation button states (disabled/enabled).
	 *
	 * @param {Object} swiper - The Swiper instance.
	 * @param {HTMLElement} prevButton - Previous button element.
	 * @param {HTMLElement} nextButton - Next button element.
	 */
	function updateNavigationState(swiper, prevButton, nextButton) {
		// If loop is enabled, buttons are always active
		if (swiper.params.loop) {
			prevButton.disabled = false;
			nextButton.disabled = false;
			prevButton.setAttribute('aria-disabled', 'false');
			nextButton.setAttribute('aria-disabled', 'false');
			return;
		}

		// Disable prev button on first slide
		if (swiper.isBeginning) {
			prevButton.disabled = true;
			prevButton.setAttribute('aria-disabled', 'true');
		} else {
			prevButton.disabled = false;
			prevButton.setAttribute('aria-disabled', 'false');
		}

		// Disable next button on last slide
		if (swiper.isEnd) {
			nextButton.disabled = true;
			nextButton.setAttribute('aria-disabled', 'true');
		} else {
			nextButton.disabled = false;
			nextButton.setAttribute('aria-disabled', 'false');
		}
	}

	/**
	 * Set up pause button functionality for autoplay.
	 *
	 * @param {HTMLElement} carousel - The carousel container.
	 * @param {Object} swiper - The Swiper instance.
	 */
	function setupPauseButton(carousel, swiper) {
		const pauseButton = carousel.querySelector('.carousel-new-pause-button');
		if (!pauseButton || !swiper.autoplay || !swiper.autoplay.running)
			return;

		pauseButton.setAttribute('aria-pressed', 'false');

		pauseButton.addEventListener('click', function () {
			if (swiper.autoplay.running) {
				swiper.autoplay.stop();
				this.setAttribute('aria-pressed', 'true');
				this.querySelector('span[aria-hidden="true"]').textContent =
					'▶';
				this.querySelector('.screen-reader-text').textContent = 'Play';
				this.setAttribute('aria-label', 'Play carousel');
			} else {
				swiper.autoplay.start();
				this.setAttribute('aria-pressed', 'false');
				this.querySelector('span[aria-hidden="true"]').textContent =
					'⏸';
				this.querySelector('.screen-reader-text').textContent =
					'Pause';
				this.setAttribute('aria-label', 'Pause carousel');
			}
		});
	}

	/**
	 * Set up focus management for slides.
	 *
	 * @param {Object} swiper - The Swiper instance.
	 */
	function setupFocusManagement(swiper) {
		let lastActiveIndex = swiper.activeIndex;

		swiper.on('slideChangeTransitionEnd', function () {
			const activeSlide = swiper.slides[swiper.activeIndex];
			if (!activeSlide) return;

			// Find focusable elements in the active slide
			const focusableElements = activeSlide.querySelectorAll(
				'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
			);

			if (focusableElements.length > 0) {
				// Focus the first interactive element
				focusableElements[0].focus();
			} else {
				// If no focusable elements, focus the slide itself
				activeSlide.setAttribute('tabindex', '-1');
				activeSlide.focus();
			}

			// Update ARIA attributes
			activeSlide.setAttribute('aria-hidden', 'false');

			if (swiper.slides[lastActiveIndex]) {
				swiper.slides[lastActiveIndex].setAttribute(
					'aria-hidden',
					'true'
				);
			}

			lastActiveIndex = swiper.activeIndex;
		});
	}

	/**
	 * Set up accessibility attributes for the carousel.
	 *
	 * @param {Object} swiper - The Swiper instance.
	 */
	function setupA11yAttributes(swiper) {
		if (!swiper.slides || !swiper.slides.length) return;

		// Add role and labels to slides
		swiper.slides.forEach((slide, index) => {
			slide.setAttribute('role', 'group');
			slide.setAttribute(
				'aria-label',
				'Slide ' + (index + 1) + ' of ' + swiper.slides.length
			);
			slide.setAttribute(
				'aria-hidden',
				index === swiper.activeIndex ? 'false' : 'true'
			);
		});

		// Announce slide changes to screen readers
		swiper.on('slideChange', function () {
			// Create or update live region for announcements
			let liveRegion = document.getElementById(
				'swiper-notification-' + swiper.el.id
			);

			if (!liveRegion) {
				liveRegion = document.createElement('div');
				liveRegion.id = 'swiper-notification-' + swiper.el.id;
				liveRegion.setAttribute('aria-live', 'polite');
				liveRegion.setAttribute('aria-atomic', 'true');
				liveRegion.className = 'screen-reader-text';
				document.body.appendChild(liveRegion);
			}

			liveRegion.textContent =
				'Slide ' +
				(swiper.activeIndex + 1) +
				' of ' +
				swiper.slides.length;
		});
	}

	/**
	 * Set up browser compatibility features.
	 *
	 * @param {Object} swiper - The Swiper instance.
	 */
	function setupBrowserCompatibility(swiper) {
		// Fallback for browsers without ResizeObserver
		if (!('ResizeObserver' in window)) {
			let resizeTimer;
			window.addEventListener('resize', function () {
				clearTimeout(resizeTimer);
				resizeTimer = setTimeout(function () {
					if (swiper && !swiper.destroyed) {
						swiper.update();
					}
				}, 250);
			});
		}

		// Ensure proper cleanup on page unload
		window.addEventListener('beforeunload', function () {
			if (swiper && !swiper.destroyed) {
				swiper.destroy(true, true);
			}
		});
	}

	// Initialize when DOM is ready
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initCarousels);
	} else {
		initCarousels();
	}
})();
