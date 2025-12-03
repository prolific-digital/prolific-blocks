/**
 * Frontend JavaScript for Query Posts block
 * Handles carousel initialization, search, filtering, and AJAX loading
 */

(function () {
	'use strict';

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
	 * Set up custom navigation buttons for Query Posts carousel
	 */
	function setupCustomNavigation(blockElement, carouselElement) {
		// Wait for Swiper to be ready
		const checkSwiper = () => {
			if (carouselElement.swiper) {
				const swiper = carouselElement.swiper;

				// Find custom navigation buttons
				let prevButton = blockElement.querySelector(
					'.query-posts-nav-wrapper .query-posts-nav-prev, .query-posts-controls-group .query-posts-nav-prev'
				);
				let nextButton = blockElement.querySelector(
					'.query-posts-nav-wrapper .query-posts-nav-next, .query-posts-controls-group .query-posts-nav-next'
				);

				if (prevButton && nextButton) {
					// Add click handlers
					prevButton.addEventListener('click', function (e) {
						e.preventDefault();
						e.stopPropagation();
						swiper.slidePrev();
					});

					nextButton.addEventListener('click', function (e) {
						e.preventDefault();
						e.stopPropagation();
						swiper.slideNext();
					});

					// Update button states
					const updateNavigationState = () => {
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
					};

					// Initial state
					updateNavigationState();

					// Update on slide change
					swiper.on('slideChange', updateNavigationState);
				}
			} else {
				// Swiper not ready yet, try again
				setTimeout(checkSwiper, 100);
			}
		};

		// Start checking
		checkSwiper();
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
