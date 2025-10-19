/**
 * Frontend JavaScript for Query Loop Carousel
 *
 * Initializes Swiper for Query Loop blocks with carousel mode enabled
 *
 * @since 1.0.0
 */

// Import Swiper from the Swiper element bundle
import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay, EffectFade, EffectCoverflow } from 'swiper/modules';

(function () {
	'use strict';

	/**
	 * Initialize all Query Loop carousels when DOM is ready
	 */
	function initQueryCarousels() {
		const carousels = document.querySelectorAll('.wp-block-query.is-carousel');

		if (!carousels.length) {
			return;
		}

		carousels.forEach(setupQueryCarousel);
	}

	/**
	 * Set up a single Query Loop carousel instance
	 *
	 * @param {HTMLElement} carouselWrapper - The carousel wrapper element
	 */
	function setupQueryCarousel(carouselWrapper) {
		const configAttr = carouselWrapper.getAttribute('data-carousel-config');

		if (!configAttr) {
			return;
		}

		// Parse configuration
		let config;
		try {
			config = JSON.parse(configAttr);
		} catch (e) {
			console.error('Failed to parse carousel config:', e);
			return;
		}

		// Find the Swiper container
		const swiperContainer = carouselWrapper.querySelector('.swiper');

		if (!swiperContainer) {
			console.error('Swiper container not found');
			return;
		}

		// Prepare Swiper modules
		const modules = [Navigation, Pagination];

		// Add effect modules if needed
		if (config.effect === 'fade') {
			modules.push(EffectFade);
		} else if (config.effect === 'coverflow') {
			modules.push(EffectCoverflow);
		}

		// Add autoplay module if enabled
		if (config.autoplay) {
			modules.push(Autoplay);
		}

		// Build Swiper options
		const swiperOptions = {
			modules,
			slidesPerView: 1,
			spaceBetween: 10,
			speed: config.speed || 300,
			loop: config.loop || false,
			effect: config.effect || 'slide',
			grabCursor: config.grabCursor !== false,
			keyboard: config.keyboard || { enabled: true },
		};

		// Add breakpoints
		if (config.breakpoints) {
			swiperOptions.breakpoints = config.breakpoints;
		}

		// Add navigation
		if (config.navigation) {
			swiperOptions.navigation = {
				nextEl: carouselWrapper.querySelector('.swiper-button-next'),
				prevEl: carouselWrapper.querySelector('.swiper-button-prev'),
			};
		}

		// Add pagination
		if (config.pagination) {
			swiperOptions.pagination = {
				el: carouselWrapper.querySelector('.swiper-pagination'),
				type: config.pagination.type || 'bullets',
				clickable: true,
			};
		}

		// Add autoplay
		if (config.autoplay) {
			swiperOptions.autoplay = {
				delay: config.autoplay.delay || 3000,
				disableOnInteraction: config.autoplay.disableOnInteraction !== false,
				pauseOnMouseEnter: true,
			};
		}

		// Effect-specific settings
		if (config.effect === 'fade') {
			swiperOptions.fadeEffect = {
				crossFade: true,
			};
		} else if (config.effect === 'coverflow') {
			swiperOptions.coverflowEffect = {
				rotate: 50,
				stretch: 0,
				depth: 100,
				modifier: 1,
				slideShadows: true,
			};
		}

		// Initialize Swiper
		try {
			const swiper = new Swiper(swiperContainer, swiperOptions);

			// Set up accessibility features
			setupA11yFeatures(swiper, carouselWrapper);

			// Set up focus management
			setupFocusManagement(swiper);

			// Store swiper instance on the element for potential external access
			carouselWrapper.swiperInstance = swiper;
		} catch (e) {
			console.error('Failed to initialize Swiper:', e);
		}
	}

	/**
	 * Set up accessibility features for the carousel
	 *
	 * @param {Object} swiper - The Swiper instance
	 * @param {HTMLElement} wrapper - The carousel wrapper element
	 */
	function setupA11yFeatures(swiper, wrapper) {
		if (!swiper.slides || !swiper.slides.length) {
			return;
		}

		// Add role and labels to slides
		swiper.slides.forEach((slide, index) => {
			slide.setAttribute('role', 'group');
			slide.setAttribute(
				'aria-label',
				`Slide ${index + 1} of ${swiper.slides.length}`
			);
			slide.setAttribute(
				'aria-hidden',
				index === swiper.activeIndex ? 'false' : 'true'
			);
		});

		// Update aria-hidden on slide change
		swiper.on('slideChange', function () {
			swiper.slides.forEach((slide, index) => {
				slide.setAttribute(
					'aria-hidden',
					index === swiper.activeIndex ? 'false' : 'true'
				);
			});

			// Announce slide changes to screen readers
			announceSlideChange(swiper, wrapper);
		});
	}

	/**
	 * Announce slide changes to screen readers
	 *
	 * @param {Object} swiper - The Swiper instance
	 * @param {HTMLElement} wrapper - The carousel wrapper element
	 */
	function announceSlideChange(swiper, wrapper) {
		let liveRegion = wrapper.querySelector('.swiper-live-region');

		if (!liveRegion) {
			liveRegion = document.createElement('div');
			liveRegion.className = 'swiper-live-region';
			liveRegion.setAttribute('aria-live', 'polite');
			liveRegion.setAttribute('aria-atomic', 'true');
			liveRegion.style.position = 'absolute';
			liveRegion.style.left = '-10000px';
			liveRegion.style.width = '1px';
			liveRegion.style.height = '1px';
			liveRegion.style.overflow = 'hidden';
			wrapper.appendChild(liveRegion);
		}

		liveRegion.textContent = `Slide ${swiper.activeIndex + 1} of ${
			swiper.slides.length
		}`;
	}

	/**
	 * Set up focus management for slides
	 *
	 * @param {Object} swiper - The Swiper instance
	 */
	function setupFocusManagement(swiper) {
		swiper.on('slideChangeTransitionEnd', function () {
			const activeSlide = swiper.slides[swiper.activeIndex];

			if (!activeSlide) {
				return;
			}

			// Find focusable elements in the active slide
			const focusableElements = activeSlide.querySelectorAll(
				'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
			);

			if (focusableElements.length > 0) {
				// Don't auto-focus to avoid disrupting user navigation
				// Elements are already keyboard accessible
			}
		});
	}

	/**
	 * Initialize when DOM is ready
	 */
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initQueryCarousels);
	} else {
		initQueryCarousels();
	}

	// Also initialize on window load to catch any late-loaded content
	window.addEventListener('load', initQueryCarousels);

	// Re-initialize when WordPress block editor updates (for block preview)
	if (window.wp && window.wp.domReady) {
		window.wp.domReady(initQueryCarousels);
	}
})();
