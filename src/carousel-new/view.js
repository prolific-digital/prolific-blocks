/**
 * Frontend JavaScript for Carousel New block.
 *
 * Handles:
 * - Swiper initialization and custom navigation
 * - Virtual active index for multi-slide carousels
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
	 * Store for carousel state (virtual active index per carousel)
	 */
	const carouselStates = new Map();

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

		// Function to initialize all features
		function initializeFeatures(swiper) {
			// Get slide count and initialize state
			let actualSlideCount = parseInt(carousel.dataset.slideCount, 10);
			if (!actualSlideCount || isNaN(actualSlideCount)) {
				const originalSlides = swiperContainer.querySelectorAll(
					'swiper-slide:not(.swiper-slide-duplicate)'
				);
				actualSlideCount = originalSlides.length;
			}

			const slidesPerView = Math.floor(swiper.params.slidesPerView) || 1;

			// Initialize carousel state with virtual active index
			carouselStates.set(carousel.id, {
				virtualActiveIndex: 0,
				actualSlideCount: actualSlideCount,
				slidesPerView: slidesPerView,
				maxPhysicalIndex: Math.max(0, actualSlideCount - slidesPerView)
			});

			setupVirtualNavigation(carousel, swiper);
			setupPauseButton(carousel, swiper);
			setupFocusManagement(swiper);
			setupA11yAttributes(swiper);
			setupBrowserCompatibility(swiper);
			setupVirtualPagination(carousel, swiper);

			// Set initial active states
			updateActiveStates(carousel, swiper);
		}

		// Check if Swiper is already initialized
		if (swiperContainer.swiper) {
			initializeFeatures(swiperContainer.swiper);
		} else {
			// Wait for Swiper to initialize - try multiple approaches
			let initialized = false;

			// Approach 1: Listen for swiperready event
			swiperContainer.addEventListener('swiperready', function () {
				if (this.swiper && !initialized) {
					initialized = true;
					initializeFeatures(this.swiper);
				}
			});

			// Approach 2: Poll for swiper property (fallback)
			const checkSwiper = setInterval(function () {
				if (swiperContainer.swiper && !initialized) {
					initialized = true;
					clearInterval(checkSwiper);
					initializeFeatures(swiperContainer.swiper);
				}
			}, 100);

			// Approach 3: Timeout fallback (stop polling after 5 seconds)
			setTimeout(function () {
				clearInterval(checkSwiper);
			}, 5000);
		}
	}

	/**
	 * Update all active states (slides, bullets, navigation) based on virtual active index.
	 *
	 * @param {HTMLElement} carousel - The carousel container.
	 * @param {Object} swiper - The Swiper instance.
	 */
	function updateActiveStates(carousel, swiper) {
		const state = carouselStates.get(carousel.id);
		if (!state) return;

		const { virtualActiveIndex, actualSlideCount } = state;

		// Update slide active classes
		const swiperContainer = carousel.querySelector('swiper-container');
		if (swiperContainer) {
			const slides = swiperContainer.querySelectorAll('swiper-slide:not(.swiper-slide-duplicate)');
			slides.forEach(function (slide, index) {
				if (index === virtualActiveIndex) {
					slide.classList.add('swiper-slide-active');
				} else {
					slide.classList.remove('swiper-slide-active');
				}
			});
		}

		// Update bullet active states
		const paginationEl = swiper.pagination && swiper.pagination.el;
		if (paginationEl) {
			const bullets = paginationEl.querySelectorAll('.swiper-pagination-bullet');
			bullets.forEach(function (bullet, index) {
				if (index === virtualActiveIndex) {
					bullet.classList.add('swiper-pagination-bullet-active');
				} else {
					bullet.classList.remove('swiper-pagination-bullet-active');
				}
			});
		}

		// Update navigation button states
		updateVirtualNavigationState(carousel, swiper);
	}

	/**
	 * Set up custom navigation with virtual active index support.
	 * Navigation continues to work even when carousel reaches physical end.
	 *
	 * @param {HTMLElement} carousel - The carousel container.
	 * @param {Object} swiper - The Swiper instance.
	 */
	function setupVirtualNavigation(carousel, swiper) {
		// Look for nav buttons in both regular wrapper and grouped controls
		let prevButton = carousel.querySelector('.carousel-new-nav-wrapper .carousel-new-nav-prev');
		let nextButton = carousel.querySelector('.carousel-new-nav-wrapper .carousel-new-nav-next');

		// If not found in wrapper, check grouped controls
		if (!prevButton || !nextButton) {
			prevButton = carousel.querySelector('.carousel-new-controls-group .carousel-new-nav-prev');
			nextButton = carousel.querySelector('.carousel-new-controls-group .carousel-new-nav-next');
		}

		if (!prevButton || !nextButton) return;

		// Store button references in state
		const state = carouselStates.get(carousel.id);
		if (state) {
			state.prevButton = prevButton;
			state.nextButton = nextButton;
		}

		// Next button click handler with virtual index support
		nextButton.addEventListener('click', function (e) {
			e.preventDefault();
			e.stopPropagation();

			const state = carouselStates.get(carousel.id);
			if (!state) return;

			const { virtualActiveIndex, actualSlideCount, maxPhysicalIndex } = state;
			const currentPhysicalIndex = swiper.realIndex !== undefined ? swiper.realIndex : swiper.activeIndex;

			// If we can still physically move AND virtual index matches physical position
			if (currentPhysicalIndex < maxPhysicalIndex && virtualActiveIndex <= currentPhysicalIndex) {
				// Normal slide - move carousel and update virtual index
				swiper.slideNext();
				state.virtualActiveIndex = (swiper.realIndex !== undefined ? swiper.realIndex : swiper.activeIndex);
			} else if (virtualActiveIndex < actualSlideCount - 1) {
				// At physical end but can still increment virtual index
				state.virtualActiveIndex++;
			}

			updateActiveStates(carousel, swiper);
		});

		// Previous button click handler with virtual index support
		prevButton.addEventListener('click', function (e) {
			e.preventDefault();
			e.stopPropagation();

			const state = carouselStates.get(carousel.id);
			if (!state) return;

			const { virtualActiveIndex } = state;
			const currentPhysicalIndex = swiper.realIndex !== undefined ? swiper.realIndex : swiper.activeIndex;

			// If virtual index is ahead of physical position, just decrement virtual
			if (virtualActiveIndex > currentPhysicalIndex) {
				state.virtualActiveIndex--;
			} else if (currentPhysicalIndex > 0) {
				// Can physically move backward
				swiper.slidePrev();
				state.virtualActiveIndex = (swiper.realIndex !== undefined ? swiper.realIndex : swiper.activeIndex);
			}

			updateActiveStates(carousel, swiper);
		});

		// Sync virtual index when Swiper physically moves (e.g., via drag)
		swiper.on('slideChange', function () {
			const state = carouselStates.get(carousel.id);
			if (!state) return;

			const newPhysicalIndex = swiper.realIndex !== undefined ? swiper.realIndex : swiper.activeIndex;

			// If user drags/swipes, reset virtual index to match physical
			if (state.virtualActiveIndex < newPhysicalIndex) {
				state.virtualActiveIndex = newPhysicalIndex;
			}
			// If moving backward and virtual was ahead, keep virtual ahead but within visible range
			else if (newPhysicalIndex < state.virtualActiveIndex) {
				// Ensure virtual index is at least the physical index
				// This handles backward swipes/drags
				const maxVisibleIndex = newPhysicalIndex + state.slidesPerView - 1;
				if (state.virtualActiveIndex > maxVisibleIndex) {
					state.virtualActiveIndex = newPhysicalIndex;
				}
			}

			updateActiveStates(carousel, swiper);
		});

		// Initial state update
		updateVirtualNavigationState(carousel, swiper);
	}

	/**
	 * Update navigation button states based on virtual active index.
	 *
	 * @param {HTMLElement} carousel - The carousel container.
	 * @param {Object} swiper - The Swiper instance.
	 */
	function updateVirtualNavigationState(carousel, swiper) {
		const state = carouselStates.get(carousel.id);
		if (!state || !state.prevButton || !state.nextButton) return;

		const { prevButton, nextButton, virtualActiveIndex, actualSlideCount } = state;

		// If loop is enabled, buttons are always active
		if (swiper.params.loop) {
			prevButton.disabled = false;
			nextButton.disabled = false;
			prevButton.setAttribute('aria-disabled', 'false');
			nextButton.setAttribute('aria-disabled', 'false');
			return;
		}

		// Disable prev button when at virtual beginning (index 0)
		if (virtualActiveIndex === 0) {
			prevButton.disabled = true;
			prevButton.setAttribute('aria-disabled', 'true');
		} else {
			prevButton.disabled = false;
			prevButton.setAttribute('aria-disabled', 'false');
		}

		// Disable next button when at virtual end (last slide)
		if (virtualActiveIndex >= actualSlideCount - 1) {
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
	 * Set up pagination with virtual active index support.
	 * Creates one bullet per slide, with clicking navigating to make that slide active.
	 *
	 * @param {HTMLElement} carousel - The carousel container.
	 * @param {Object} swiper - The Swiper instance.
	 */
	function setupVirtualPagination(carousel, swiper) {
		if (!swiper.pagination || !swiper.pagination.el) return;

		const state = carouselStates.get(carousel.id);
		if (!state) return;

		const { actualSlideCount, maxPhysicalIndex } = state;
		const isLoop = swiper.params.loop;

		// If using bullets pagination, ensure correct count and attach handlers
		if (swiper.params.pagination && swiper.params.pagination.type === 'bullets') {
			const paginationEl = swiper.pagination.el;

			// Always recreate bullets to ensure our custom click handlers are attached
			// Clear existing bullets
			paginationEl.innerHTML = '';

			// Create one bullet per slide
			for (let i = 0; i < actualSlideCount; i++) {
				const bullet = document.createElement('span');
				bullet.className = 'swiper-pagination-bullet';
				if (i === 0) {
					bullet.classList.add('swiper-pagination-bullet-active');
				}
				bullet.setAttribute('role', 'button');
				bullet.setAttribute('aria-label', 'Go to slide ' + (i + 1));
				bullet.setAttribute('tabindex', '0');
				bullet.dataset.index = i;

				// Make bullet clickable - navigates to make that slide the active one
				bullet.addEventListener('click', function (e) {
					e.preventDefault();
					e.stopPropagation();

					const targetSlideIndex = parseInt(this.dataset.index, 10);
					const state = carouselStates.get(carousel.id);
					if (!state) return;

					if (isLoop) {
						swiper.slideToLoop(targetSlideIndex);
						state.virtualActiveIndex = targetSlideIndex;
					} else {
						// Calculate physical position needed to show this slide
						// If target is beyond maxPhysicalIndex, go to max and set virtual
						const physicalTarget = Math.min(targetSlideIndex, maxPhysicalIndex);
						swiper.slideTo(physicalTarget);
						state.virtualActiveIndex = targetSlideIndex;
					}

					updateActiveStates(carousel, swiper);
				});

				// Keyboard support
				bullet.addEventListener('keydown', function (e) {
					if (e.key === 'Enter' || e.key === ' ') {
						e.preventDefault();
						this.click();
					}
				});

				paginationEl.appendChild(bullet);
			}
		}
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

		// Note: We intentionally do NOT destroy Swiper on beforeunload.
		// Destroying Swiper breaks the layout when using browser back/forward navigation
		// (bfcache restoration). The browser will clean up resources automatically on
		// actual page unload, and keeping Swiper intact allows proper restoration.
	}

	// Initialize when DOM is ready
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initCarousels);
	} else {
		initCarousels();
	}

	// Handle page restoration from bfcache (back/forward navigation)
	window.addEventListener('pageshow', function (event) {
		if (event.persisted) {
			// Page was restored from bfcache, reinitialize carousels
			const carousels = document.querySelectorAll(
				'section[id^="carousel-new-"]'
			);
			carousels.forEach(function (carousel) {
				const swiperContainer = carousel.querySelector('swiper-container');
				if (swiperContainer && swiperContainer.swiper) {
					// Swiper exists, just update it to recalculate dimensions
					swiperContainer.swiper.update();
				}
			});
		}
	});
})();
