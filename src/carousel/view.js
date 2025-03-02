/**
 * Handles carousel functionality on the frontend.
 * - Initializes pause button for autoplay controls
 * - Adds focus management for accessibility
 * - Implements keyboard navigation
 * - Adds browser compatibility checks
 * - Enhances carousel accessibility
 *
 * @since 1.1.0
 */
(function() {
  'use strict';
  
  /**
   * Initialize all carousels when DOM is fully loaded
   */
  function initCarousels() {
    // Find all carousel instances
    const carousels = document.querySelectorAll('section[id^="prolific-carousel-"]');
    if (!carousels.length) return;
    
    carousels.forEach(setupCarousel);
  }
  
  /**
   * Set up a single carousel instance
   * @param {HTMLElement} carousel - The carousel container element
   */
  function setupCarousel(carousel) {
    const swiperContainer = carousel.querySelector('swiper-container');
    if (!swiperContainer) return;
    
    // Wait for swiper to be fully initialized
    swiperContainer.addEventListener('swiperready', function() {
      const swiper = this.swiper;
      if (!swiper) return;
      
      setupPauseButton(carousel, swiper);
      setupFocusManagement(swiper);
      setupA11yAttributes(swiper);
      setupBrowserCompatibility(swiper);
    });
  }
  
  /**
   * Set up pause button functionality
   * @param {HTMLElement} carousel - The carousel container
   * @param {Object} swiper - The Swiper instance
   */
  function setupPauseButton(carousel, swiper) {
    const pauseButton = carousel.querySelector('.carousel-pause-button');
    if (!pauseButton || !swiper.autoplay || !swiper.autoplay.running) return;
    
    pauseButton.setAttribute('aria-pressed', 'false');
    
    pauseButton.addEventListener('click', function() {
      if (swiper.autoplay.running) {
        swiper.autoplay.stop();
        this.setAttribute('aria-pressed', 'true');
        this.querySelector('span[aria-hidden="true"]').textContent = '▶';
        this.querySelector('.screen-reader-text').textContent = 'Play';
        this.setAttribute('aria-label', 'Play carousel');
      } else {
        swiper.autoplay.start();
        this.setAttribute('aria-pressed', 'false');
        this.querySelector('span[aria-hidden="true"]').textContent = '⏸';
        this.querySelector('.screen-reader-text').textContent = 'Pause';
        this.setAttribute('aria-label', 'Pause carousel');
      }
    });
  }
  
  /**
   * Set up focus management for slides
   * @param {Object} swiper - The Swiper instance
   */
  function setupFocusManagement(swiper) {
    let lastActiveIndex = swiper.activeIndex;
    
    swiper.on('slideChangeTransitionEnd', function() {
      const activeSlide = swiper.slides[swiper.activeIndex];
      if (!activeSlide) return;
      
      const focusableElements = activeSlide.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements.length > 0) {
        // Focus the first interactive element in the new slide
        focusableElements[0].focus();
      } else {
        // If no focusable elements, focus the slide itself
        activeSlide.setAttribute('tabindex', '-1');
        activeSlide.focus();
      }
      
      // Update ARIA attributes for screen readers
      activeSlide.setAttribute('aria-hidden', 'false');
      
      if (swiper.slides[lastActiveIndex]) {
        swiper.slides[lastActiveIndex].setAttribute('aria-hidden', 'true');
      }
      
      lastActiveIndex = swiper.activeIndex;
    });
  }
  
  /**
   * Set up accessibility attributes for the carousel
   * @param {Object} swiper - The Swiper instance
   */
  function setupA11yAttributes(swiper) {
    if (!swiper.slides || !swiper.slides.length) return;
    
    // Add role and labels to slides
    swiper.slides.forEach((slide, index) => {
      slide.setAttribute('role', 'group');
      slide.setAttribute('aria-label', 'Slide ' + (index + 1) + ' of ' + swiper.slides.length);
      slide.setAttribute('aria-hidden', index === swiper.activeIndex ? 'false' : 'true');
    });
  }
  
  /**
   * Set up browser compatibility features
   * @param {Object} swiper - The Swiper instance
   */
  function setupBrowserCompatibility(swiper) {
    // Feature detection for browser compatibility
    if (!('ResizeObserver' in window)) {
      // Fallback for browsers without ResizeObserver
      let resizeTimer;
      window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
          if (swiper) {
            swiper.update();
          }
        }, 250);
      });
    }
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCarousels);
  } else {
    initCarousels();
  }
})();