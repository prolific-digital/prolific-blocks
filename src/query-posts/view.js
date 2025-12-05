/**
 * Frontend JavaScript for Query Posts block
 * Handles carousel initialization, search, filtering, and AJAX loading
 */

(function () {
	'use strict';

	/**
	 * Store for carousel state (virtual active index per carousel)
	 */
	const carouselStates = new Map();

	/**
	 * Initialize carousel for a query posts block using Swiper Element
	 */
	function initCarousel(blockElement) {
		const carouselElement = blockElement.querySelector('swiper-container');
		if (!carouselElement) {
			return;
		}

		// Get carousel settings from data attributes
		const slidesPerViewMobile = parseInt(blockElement.dataset.slidesMobile) || 1;
		const slidesPerViewTablet = parseInt(blockElement.dataset.slidesTablet) || 2;
		const slidesPerViewDesktop = parseInt(blockElement.dataset.slidesDesktop) || 3;
		const spaceBetweenMobile = parseInt(blockElement.dataset.spaceMobile) || 10;
		const spaceBetweenTablet = parseInt(blockElement.dataset.spaceTablet) || 20;
		const spaceBetweenDesktop = parseInt(blockElement.dataset.spaceDesktop) || 30;
		const speed = parseInt(blockElement.dataset.carouselSpeed) || 300;
		const loop = blockElement.dataset.carouselLoop === 'true';
		const centeredSlides = blockElement.dataset.centeredSlides === 'true';
		const grabCursor = blockElement.dataset.grabCursor === 'true';
		const keyboardEnabled = blockElement.dataset.keyboard === 'true';
		const autoplayEnabled = blockElement.dataset.carouselAutoplay === 'true';
		const autoplayDelay = parseInt(blockElement.dataset.autoplayDelay) || 3000;
		const pauseOnHover = blockElement.dataset.pauseOnHover === 'true';
		const navigationEnabled = blockElement.dataset.carouselNavigation === 'true';
		const paginationEnabled = blockElement.dataset.carouselPagination === 'true';
		const paginationType = blockElement.dataset.paginationType || 'bullets';
		const dynamicBullets = blockElement.dataset.dynamicBullets === 'true';

		// New carousel controls from Carousel New
		const scrollbarEnabled = blockElement.dataset.scrollbar === 'true';

		// Configure Swiper Element parameters
		const swiperParams = {
			slidesPerView: slidesPerViewMobile,
			spaceBetween: spaceBetweenMobile,
			speed: speed,
			loop: loop,
			centeredSlides: centeredSlides,
			grabCursor: grabCursor,
			keyboard: {
				enabled: keyboardEnabled,
			},
			breakpoints: {
				768: {
					slidesPerView: slidesPerViewTablet,
					spaceBetween: spaceBetweenTablet,
				},
				1024: {
					slidesPerView: slidesPerViewDesktop,
					spaceBetween: spaceBetweenDesktop,
				},
			},
		};

		// Add autoplay if enabled
		if (autoplayEnabled) {
			swiperParams.autoplay = {
				delay: autoplayDelay,
				disableOnInteraction: false,
				pauseOnMouseEnter: pauseOnHover,
			};
		}

		// Only enable built-in navigation if custom navigation is NOT being used
		// Custom navigation is detected by presence of custom nav wrapper or grouped controls
		const hasCustomNavWrapper = blockElement.querySelector('.query-posts-nav-wrapper');
		const hasGroupedControls = blockElement.querySelector('.query-posts-controls-group');
		const hasCustomNav = hasCustomNavWrapper || hasGroupedControls;

		if (navigationEnabled && !hasCustomNav) {
			swiperParams.navigation = true;
		} else {
			swiperParams.navigation = false;
		}

		// Handle pagination - always use custom pagination element when it exists
		if (paginationEnabled) {
			const paginationEl = hasGroupedControls
				? '.query-posts-controls-group .swiper-pagination'
				: '.swiper-pagination.pagination-position-' + (blockElement.dataset.paginationPosition || 'bottom');

			swiperParams.pagination = {
				clickable: true,
				el: paginationEl,
			};

			// Set pagination type
			if (paginationType === 'fraction') {
				swiperParams.pagination.type = 'fraction';
			} else if (paginationType === 'progressbar') {
				swiperParams.pagination.type = 'progressbar';
			} else {
				swiperParams.pagination.type = 'bullets';
				if (dynamicBullets) {
					swiperParams.pagination.dynamicBullets = true;
					swiperParams.pagination.dynamicMainBullets = 3;
				}
			}
		} else {
			swiperParams.pagination = false;
		}

		// Add scrollbar if enabled
		if (scrollbarEnabled) {
			swiperParams.scrollbar = {
				draggable: true,
			};
		}

		// Assign parameters to swiper-container element
		Object.assign(carouselElement, swiperParams);

		// Initialize the swiper
		carouselElement.initialize();

		// Set up custom navigation after initialization
		setupCustomNavigation(blockElement, carouselElement);
	}

	/**
	 * Set up custom navigation buttons for Query Posts carousel with virtual active index
	 */
	function setupCustomNavigation(blockElement, carouselElement) {
		// Wait for Swiper to be ready
		const checkSwiper = () => {
			if (carouselElement.swiper) {
				const swiper = carouselElement.swiper;

				// Get slide count and initialize state
				let actualSlideCount = parseInt(blockElement.dataset.slideCount, 10);
				if (!actualSlideCount || isNaN(actualSlideCount)) {
					const originalSlides = carouselElement.querySelectorAll(
						'swiper-slide:not(.swiper-slide-duplicate)'
					);
					actualSlideCount = originalSlides.length;
				}

				const slidesPerView = Math.floor(swiper.params.slidesPerView) || 1;

				// Initialize carousel state with virtual active index
				carouselStates.set(blockElement.id, {
					virtualActiveIndex: 0,
					actualSlideCount: actualSlideCount,
					slidesPerView: slidesPerView,
					maxPhysicalIndex: Math.max(0, actualSlideCount - slidesPerView),
				});

				// Find custom navigation buttons
				let prevButton = blockElement.querySelector(
					'.query-posts-nav-wrapper .query-posts-nav-prev, .query-posts-controls-group .query-posts-nav-prev'
				);
				let nextButton = blockElement.querySelector(
					'.query-posts-nav-wrapper .query-posts-nav-next, .query-posts-controls-group .query-posts-nav-next'
				);

				if (prevButton && nextButton) {
					// Store button references in state
					const state = carouselStates.get(blockElement.id);
					if (state) {
						state.prevButton = prevButton;
						state.nextButton = nextButton;
					}

					// Next button click handler with virtual index support
					nextButton.addEventListener('click', function (e) {
						e.preventDefault();
						e.stopPropagation();

						const state = carouselStates.get(blockElement.id);
						if (!state) return;

						const { virtualActiveIndex, actualSlideCount, maxPhysicalIndex } =
							state;
						const currentPhysicalIndex =
							swiper.realIndex !== undefined
								? swiper.realIndex
								: swiper.activeIndex;

						// If we can still physically move AND virtual index matches physical position
						if (
							currentPhysicalIndex < maxPhysicalIndex &&
							virtualActiveIndex <= currentPhysicalIndex
						) {
							// Normal slide - move carousel and update virtual index
							swiper.slideNext();
							state.virtualActiveIndex =
								swiper.realIndex !== undefined
									? swiper.realIndex
									: swiper.activeIndex;
						} else if (virtualActiveIndex < actualSlideCount - 1) {
							// At physical end but can still increment virtual index
							state.virtualActiveIndex++;
						}

						updateActiveStates(blockElement, swiper);
					});

					// Previous button click handler with virtual index support
					prevButton.addEventListener('click', function (e) {
						e.preventDefault();
						e.stopPropagation();

						const state = carouselStates.get(blockElement.id);
						if (!state) return;

						const { virtualActiveIndex } = state;
						const currentPhysicalIndex =
							swiper.realIndex !== undefined
								? swiper.realIndex
								: swiper.activeIndex;

						// If virtual index is ahead of physical position, just decrement virtual
						if (virtualActiveIndex > currentPhysicalIndex) {
							state.virtualActiveIndex--;
						} else if (currentPhysicalIndex > 0) {
							// Can physically move backward
							swiper.slidePrev();
							state.virtualActiveIndex =
								swiper.realIndex !== undefined
									? swiper.realIndex
									: swiper.activeIndex;
						}

						updateActiveStates(blockElement, swiper);
					});

					// Sync virtual index when Swiper physically moves (e.g., via drag)
					swiper.on('slideChange', function () {
						const state = carouselStates.get(blockElement.id);
						if (!state) return;

						const newPhysicalIndex =
							swiper.realIndex !== undefined
								? swiper.realIndex
								: swiper.activeIndex;

						// If user drags/swipes, reset virtual index to match physical
						if (state.virtualActiveIndex < newPhysicalIndex) {
							state.virtualActiveIndex = newPhysicalIndex;
						}
						// If moving backward and virtual was ahead, keep virtual ahead but within visible range
						else if (newPhysicalIndex < state.virtualActiveIndex) {
							// Ensure virtual index is at least the physical index
							// This handles backward swipes/drags
							const maxVisibleIndex =
								newPhysicalIndex + state.slidesPerView - 1;
							if (state.virtualActiveIndex > maxVisibleIndex) {
								state.virtualActiveIndex = newPhysicalIndex;
							}
						}

						updateActiveStates(blockElement, swiper);
					});

					// Initial state update
					updateActiveStates(blockElement, swiper);
				}

				// Set up virtual keyboard navigation
				setupVirtualKeyboardNavigation(blockElement, swiper);

				// Set up virtual pagination
				setupVirtualPagination(blockElement, swiper);
			} else {
				// Swiper not ready yet, try again
				setTimeout(checkSwiper, 100);
			}
		};

		// Start checking
		checkSwiper();
	}

	/**
	 * Update all active states (slides, bullets, navigation) based on virtual active index.
	 */
	function updateActiveStates(blockElement, swiper) {
		const state = carouselStates.get(blockElement.id);
		if (!state) return;

		const { virtualActiveIndex } = state;

		// Update slide active classes
		const swiperContainer = blockElement.querySelector('swiper-container');
		if (swiperContainer) {
			const slides = swiperContainer.querySelectorAll(
				'swiper-slide:not(.swiper-slide-duplicate)'
			);
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
			const bullets = paginationEl.querySelectorAll(
				'.swiper-pagination-bullet'
			);
			bullets.forEach(function (bullet, index) {
				if (index === virtualActiveIndex) {
					bullet.classList.add('swiper-pagination-bullet-active');
				} else {
					bullet.classList.remove('swiper-pagination-bullet-active');
				}
			});
		}

		// Update navigation button states
		updateVirtualNavigationState(blockElement, swiper);
	}

	/**
	 * Update navigation button states based on virtual active index.
	 */
	function updateVirtualNavigationState(blockElement, swiper) {
		const state = carouselStates.get(blockElement.id);
		if (!state || !state.prevButton || !state.nextButton) return;

		const { prevButton, nextButton, virtualActiveIndex, actualSlideCount } =
			state;

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
	 * Set up keyboard navigation with virtual active index support.
	 * Intercepts arrow key presses to use virtual navigation instead of Swiper's native keyboard.
	 */
	function setupVirtualKeyboardNavigation(blockElement, swiper) {
		// Disable Swiper's built-in keyboard navigation to prevent conflicts
		if (swiper.keyboard) {
			swiper.keyboard.disable();
		}

		// Add keyboard event listener to the block element
		blockElement.addEventListener('keydown', function (e) {
			// Only handle arrow keys
			if (
				!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)
			) {
				return;
			}

			const state = carouselStates.get(blockElement.id);
			if (!state) return;

			const { virtualActiveIndex, actualSlideCount, maxPhysicalIndex } = state;
			const currentPhysicalIndex =
				swiper.realIndex !== undefined ? swiper.realIndex : swiper.activeIndex;
			const isHorizontal = swiper.params.direction !== 'vertical';

			// Determine if this is a "next" or "prev" action based on direction
			const isNextKey = isHorizontal
				? e.key === 'ArrowRight'
				: e.key === 'ArrowDown';
			const isPrevKey = isHorizontal
				? e.key === 'ArrowLeft'
				: e.key === 'ArrowUp';

			if (isNextKey) {
				e.preventDefault();
				e.stopPropagation();

				// Same logic as next button click
				if (
					currentPhysicalIndex < maxPhysicalIndex &&
					virtualActiveIndex <= currentPhysicalIndex
				) {
					swiper.slideNext();
					state.virtualActiveIndex =
						swiper.realIndex !== undefined
							? swiper.realIndex
							: swiper.activeIndex;
				} else if (virtualActiveIndex < actualSlideCount - 1) {
					state.virtualActiveIndex++;
				}

				updateActiveStates(blockElement, swiper);
			} else if (isPrevKey) {
				e.preventDefault();
				e.stopPropagation();

				// Same logic as prev button click
				if (virtualActiveIndex > currentPhysicalIndex) {
					state.virtualActiveIndex--;
				} else if (currentPhysicalIndex > 0) {
					swiper.slidePrev();
					state.virtualActiveIndex =
						swiper.realIndex !== undefined
							? swiper.realIndex
							: swiper.activeIndex;
				}

				updateActiveStates(blockElement, swiper);
			}
		});

		// Make block element focusable if not already
		if (!blockElement.hasAttribute('tabindex')) {
			blockElement.setAttribute('tabindex', '0');
		}
	}

	/**
	 * Set up pagination with virtual active index support.
	 */
	function setupVirtualPagination(blockElement, swiper) {
		if (!swiper.pagination || !swiper.pagination.el) return;

		const state = carouselStates.get(blockElement.id);
		if (!state) return;

		const { actualSlideCount, maxPhysicalIndex } = state;
		const isLoop = swiper.params.loop;

		// If using bullets pagination, ensure correct count and attach handlers
		if (
			swiper.params.pagination &&
			swiper.params.pagination.type === 'bullets'
		) {
			const paginationEl = swiper.pagination.el;
			let bullets = paginationEl.querySelectorAll('.swiper-pagination-bullet');

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
					const state = carouselStates.get(blockElement.id);
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

					updateActiveStates(blockElement, swiper);
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
	 * Initialize search functionality
	 */
	function initSearch(blockElement) {
		const searchInput = blockElement.querySelector('.search-input');
		if (!searchInput) return;

		let searchTimeout;

		searchInput.addEventListener('input', function (e) {
			clearTimeout(searchTimeout);

			searchTimeout = setTimeout(() => {
				const searchTerm = e.target.value.trim();
				filterPosts(blockElement, { search: searchTerm });
			}, 500); // Debounce search
		});
	}

	/**
	 * Initialize category filter
	 */
	function initCategoryFilter(blockElement) {
		const categorySelect = blockElement.querySelector('.category-filter');
		if (!categorySelect) return;

		categorySelect.addEventListener('change', function (e) {
			const categoryId = e.target.value;
			filterPosts(blockElement, { category: categoryId });
		});
	}

	/**
	 * Initialize tag filter
	 */
	function initTagFilter(blockElement) {
		const tagSelect = blockElement.querySelector('.tag-filter');
		if (!tagSelect) return;

		tagSelect.addEventListener('change', function (e) {
			const tagId = e.target.value;
			filterPosts(blockElement, { tag: tagId });
		});
	}

	/**
	 * Initialize date filter
	 */
	function initDateFilter(blockElement) {
		const dateSelect = blockElement.querySelector('.date-filter');
		if (!dateSelect) return;

		dateSelect.addEventListener('change', function (e) {
			const dateValue = e.target.value;
			filterPosts(blockElement, { date: dateValue });
		});
	}

	/**
	 * Initialize sort dropdown
	 */
	function initSortDropdown(blockElement) {
		const sortSelect = blockElement.querySelector('.sort-dropdown');
		if (!sortSelect) return;

		sortSelect.addEventListener('change', function (e) {
			const sortValue = e.target.value;
			const [orderBy, order] = sortValue.split('-');
			filterPosts(blockElement, { orderBy, order });
		});
	}

	/**
	 * Initialize load more functionality
	 */
	function initLoadMore(blockElement) {
		const loadMoreButton = blockElement.querySelector('.load-more-button');
		if (!loadMoreButton) return;

		loadMoreButton.addEventListener('click', function () {
			const currentPage = parseInt(this.dataset.page) || 1;
			const maxPages = parseInt(this.dataset.maxPages) || 1;

			if (currentPage >= maxPages) {
				this.disabled = true;
				this.textContent = 'No more posts';
				return;
			}

			loadMorePosts(blockElement, currentPage + 1, this);
		});
	}

	/**
	 * Filter posts via AJAX
	 */
	function filterPosts(blockElement, filters = {}) {
		const blockId = blockElement.dataset.blockId;
		const postType = blockElement.dataset.postType;
		const displayMode = blockElement.dataset.displayMode;

		// Get current filter values
		const currentFilters = {
			search: blockElement.querySelector('.search-input')?.value || '',
			category: blockElement.querySelector('.category-filter')?.value || '',
			tag: blockElement.querySelector('.tag-filter')?.value || '',
			date: blockElement.querySelector('.date-filter')?.value || '',
			orderBy: 'date',
			order: 'desc',
		};

		// Merge with new filters
		const allFilters = { ...currentFilters, ...filters };

		// Get posts container - for carousel, we target swiper-container
		let postsContainer;
		if (blockElement.dataset.carouselEnabled === 'true') {
			postsContainer = blockElement.querySelector('swiper-container');
		} else {
			postsContainer = blockElement.querySelector('.posts-grid, .posts-list, .posts-masonry');
		}
		if (!postsContainer) return;

		// Show loading state
		postsContainer.classList.add('loading');

		// Build query parameters
		const params = new URLSearchParams({
			action: 'prolific_filter_query_posts',
			block_id: blockId,
			post_type: postType,
			...allFilters,
		});

		// Make AJAX request
		fetch(prolific_query_posts.ajax_url + '?' + params.toString(), {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.success) {
					// Update posts
					postsContainer.innerHTML = data.data.html;

					// Reinitialize carousel if needed
					if (blockElement.dataset.carouselEnabled === 'true') {
						setTimeout(() => {
							initCarousel(blockElement);
						}, 100);
					}

					// Update load more button
					const loadMoreButton = blockElement.querySelector('.load-more-button');
					if (loadMoreButton) {
						loadMoreButton.dataset.page = '1';
						loadMoreButton.dataset.maxPages = data.data.max_pages || 1;
						loadMoreButton.disabled = false;
						loadMoreButton.textContent =
							blockElement.dataset.loadMoreText || 'Load More';
					}
				} else {
					console.error('Error filtering posts:', data.data.message);
				}
			})
			.catch((error) => {
				console.error('AJAX error:', error);
			})
			.finally(() => {
				postsContainer.classList.remove('loading');
			});
	}

	/**
	 * Load more posts via AJAX
	 */
	function loadMorePosts(blockElement, page, button) {
		const blockId = blockElement.dataset.blockId;

		button.disabled = true;
		button.classList.add('loading');
		button.textContent = 'Loading...';

		// Get current filters
		const filters = {
			search: blockElement.querySelector('.search-input')?.value || '',
			category: blockElement.querySelector('.category-filter')?.value || '',
			tag: blockElement.querySelector('.tag-filter')?.value || '',
			date: blockElement.querySelector('.date-filter')?.value || '',
		};

		const params = new URLSearchParams({
			action: 'prolific_load_more_posts',
			block_id: blockId,
			page: page,
			...filters,
		});

		fetch(prolific_query_posts.ajax_url + '?' + params.toString(), {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.success) {
					// Get posts container
					let postsContainer;
					if (blockElement.dataset.carouselEnabled === 'true') {
						postsContainer = blockElement.querySelector('swiper-container');
					} else {
						postsContainer = blockElement.querySelector('.posts-grid, .posts-list, .posts-masonry');
					}

					if (postsContainer) {
						// Append new posts
						postsContainer.insertAdjacentHTML('beforeend', data.data.html);

						// Update button
						button.dataset.page = page;
						button.disabled = false;
						button.classList.remove('loading');
						button.textContent =
							blockElement.dataset.loadMoreText || 'Load More';

						// Check if we've reached the last page
						const maxPages = parseInt(button.dataset.maxPages) || 1;
						if (page >= maxPages) {
							button.disabled = true;
							button.textContent = 'No more posts';
						}

						// Reinitialize carousel if needed
						if (blockElement.dataset.carouselEnabled === 'true') {
							setTimeout(() => {
								initCarousel(blockElement);
							}, 100);
						}
					}
				}
			})
			.catch((error) => {
				console.error('Load more error:', error);
				button.disabled = false;
				button.classList.remove('loading');
				button.textContent = 'Error - Try Again';
			});
	}

	/**
	 * Initialize masonry layout if needed
	 */
	function initMasonry(blockElement) {
		const masonryContainer = blockElement.querySelector('.posts-masonry');
		if (!masonryContainer) return;

		// Simple masonry implementation using CSS Grid
		// For a more robust solution, consider using a library like Masonry.js
		const items = masonryContainer.querySelectorAll('.post-item');
		items.forEach((item) => {
			const height = item.offsetHeight;
			const rowSpan = Math.ceil(height / 10);
			item.style.gridRowEnd = `span ${rowSpan}`;
		});
	}

	/**
	 * Initialize all query posts blocks
	 */
	function initQueryPostsBlocks() {
		const blocks = document.querySelectorAll('.prolific-query-posts');

		blocks.forEach((block) => {
			// Initialize carousel if enabled
			if (block.dataset.carouselEnabled === 'true') {
				initCarousel(block);
			}

			// Initialize search
			if (block.dataset.showSearch === 'true') {
				initSearch(block);
			}

			// Initialize filters
			if (block.dataset.showCategoryFilter === 'true') {
				initCategoryFilter(block);
			}

			if (block.dataset.showTagFilter === 'true') {
				initTagFilter(block);
			}

			if (block.querySelector('.date-filter')) {
				initDateFilter(block);
			}

			if (block.querySelector('.sort-dropdown')) {
				initSortDropdown(block);
			}

			// Initialize load more
			if (block.dataset.enableLoadMore === 'true') {
				initLoadMore(block);
			}

			// Initialize masonry
			if (block.dataset.displayMode === 'masonry') {
				initMasonry(block);

				// Reinit on window resize
				let resizeTimeout;
				window.addEventListener('resize', () => {
					clearTimeout(resizeTimeout);
					resizeTimeout = setTimeout(() => {
						initMasonry(block);
					}, 250);
				});
			}
		});
	}

	// Initialize on DOM ready
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initQueryPostsBlocks);
	} else {
		initQueryPostsBlocks();
	}

	// Also initialize on window load for images
	window.addEventListener('load', () => {
		const blocks = document.querySelectorAll('.prolific-query-posts');
		blocks.forEach((block) => {
			if (block.dataset.displayMode === 'masonry') {
				initMasonry(block);
			}
		});
	});
})();
