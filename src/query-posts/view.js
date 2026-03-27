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
	 * Set up custom navigation buttons for Query Posts carousel
	 * Uses virtual active index if enabled, otherwise standard Swiper navigation
	 */
	function setupCustomNavigation(blockElement, carouselElement) {
		// Check if virtual active index is enabled (defaults to true for backward compatibility)
		const virtualActiveIndexEnabled = blockElement.dataset.virtualActiveIndex !== 'false';

		// Wait for Swiper to be ready
		const checkSwiper = () => {
			if (carouselElement.swiper) {
				const swiper = carouselElement.swiper;

				if (virtualActiveIndexEnabled) {
					// Use virtual active index navigation
					setupVirtualActiveIndexNavigation(blockElement, carouselElement, swiper);
				} else {
					// Use standard Swiper navigation
					setupStandardNavigation(blockElement, swiper);
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
	 * Set up virtual active index navigation for Query Posts carousel
	 */
	function setupVirtualActiveIndexNavigation(blockElement, carouselElement, swiper) {
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

				if (swiper.params.loop) {
					// In loop mode, use slideToLoop for reliable navigation
					// slideNext() breaks after a full cycle in Swiper v11
					const nextIndex =
						(currentPhysicalIndex + 1) % actualSlideCount;
					swiper.slideToLoop(nextIndex);
					state.virtualActiveIndex = nextIndex;
				} else if (
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

				const { virtualActiveIndex, actualSlideCount } = state;
				const currentPhysicalIndex =
					swiper.realIndex !== undefined
						? swiper.realIndex
						: swiper.activeIndex;

				if (swiper.params.loop) {
					// In loop mode, use slideToLoop for reliable navigation
					// slidePrev() breaks after a full cycle in Swiper v11
					const prevIndex =
						(currentPhysicalIndex - 1 + actualSlideCount) %
						actualSlideCount;
					swiper.slideToLoop(prevIndex);
					state.virtualActiveIndex = prevIndex;
				} else if (virtualActiveIndex > currentPhysicalIndex) {
					// If virtual index is ahead of physical position, just decrement virtual
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
	}

	/**
	 * Set up standard navigation without virtual active index.
	 * Uses Swiper's native navigation behavior.
	 */
	function setupStandardNavigation(blockElement, swiper) {
		// Find custom navigation buttons
		let prevButton = blockElement.querySelector(
			'.query-posts-nav-wrapper .query-posts-nav-prev, .query-posts-controls-group .query-posts-nav-prev'
		);
		let nextButton = blockElement.querySelector(
			'.query-posts-nav-wrapper .query-posts-nav-next, .query-posts-controls-group .query-posts-nav-next'
		);

		if (!prevButton || !nextButton) return;

		// Get slide count for loop navigation
		const slideCount = parseInt(blockElement.dataset.slideCount, 10) || swiper.slides.length;

		// Click handlers - use slideToLoop in loop mode to avoid Swiper v11 bug
		nextButton.addEventListener('click', function (e) {
			e.preventDefault();
			e.stopPropagation();
			if (swiper.params.loop) {
				const nextIndex = (swiper.realIndex + 1) % slideCount;
				swiper.slideToLoop(nextIndex);
			} else {
				swiper.slideNext();
			}
		});

		prevButton.addEventListener('click', function (e) {
			e.preventDefault();
			e.stopPropagation();
			if (swiper.params.loop) {
				const prevIndex =
					(swiper.realIndex - 1 + slideCount) % slideCount;
				swiper.slideToLoop(prevIndex);
			} else {
				swiper.slidePrev();
			}
		});

		// Update button states using Swiper's native properties
		function updateButtonStates() {
			if (swiper.params.loop) {
				prevButton.disabled = false;
				nextButton.disabled = false;
				prevButton.setAttribute('aria-disabled', 'false');
				nextButton.setAttribute('aria-disabled', 'false');
			} else {
				prevButton.disabled = swiper.isBeginning;
				nextButton.disabled = swiper.isEnd;
				prevButton.setAttribute('aria-disabled', swiper.isBeginning ? 'true' : 'false');
				nextButton.setAttribute('aria-disabled', swiper.isEnd ? 'true' : 'false');
			}
		}

		swiper.on('slideChange', updateButtonStates);
		swiper.on('reachBeginning', updateButtonStates);
		swiper.on('reachEnd', updateButtonStates);
		updateButtonStates();
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
			const isLoop = swiper.params.loop;

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
				if (isLoop) {
					const nextIndex =
						(currentPhysicalIndex + 1) % actualSlideCount;
					swiper.slideToLoop(nextIndex);
					state.virtualActiveIndex = nextIndex;
				} else if (
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
				if (isLoop) {
					const prevIndex =
						(currentPhysicalIndex - 1 + actualSlideCount) %
						actualSlideCount;
					swiper.slideToLoop(prevIndex);
					state.virtualActiveIndex = prevIndex;
				} else if (virtualActiveIndex > currentPhysicalIndex) {
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
	 * Initialize dynamic taxonomy filter dropdown (for CPTs)
	 */
	function initTaxonomyFilter(blockElement) {
		const taxonomySelect = blockElement.querySelector('.taxonomy-filter');
		if (!taxonomySelect) return;

		taxonomySelect.addEventListener('change', function () {
			filterPosts(blockElement);
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
	 * Get active term IDs from pill filters for a given taxonomy.
	 */
	function getPillFilterValues(blockElement, taxonomy) {
		const className = taxonomy === 'category' ? 'category-pills' : 'tag-pills';
		const container = blockElement.querySelector('.' + className);
		if (!container) return '';

		return Array.from(
			container.querySelectorAll('.filter-pill.active[data-term-id]:not([data-term-id=""])')
		)
			.map((p) => p.dataset.termId)
			.join(',');
	}

	/**
	 * Get active term IDs from dynamic taxonomy pill filters (for CPTs).
	 */
	function getDynamicPillFilterValues(blockElement, taxonomySlug) {
		const container = blockElement.querySelector(
			`.filter-pills[data-taxonomy="${taxonomySlug}"]`
		);
		if (!container) return '';

		return Array.from(
			container.querySelectorAll('.filter-pill.active[data-term-id]:not([data-term-id=""])')
		)
			.map((p) => p.dataset.termId)
			.join(',');
	}

	/**
	 * Read display attributes from block element dataset for AJAX requests.
	 */
	function getDisplayAttributes(blockElement) {
		return {
			posts_per_page: blockElement.dataset.postsPerPage || '10',
			offset: blockElement.dataset.offset || '0',
			show_featured_image: blockElement.dataset.showFeaturedImage || 'true',
			image_size_slug: blockElement.dataset.imageSizeSlug || 'large',
			show_title: blockElement.dataset.showTitle || 'true',
			title_tag: blockElement.dataset.titleTag || 'h2',
			show_excerpt: blockElement.dataset.showExcerpt || 'true',
			excerpt_length: blockElement.dataset.excerptLength || '55',
			show_meta: blockElement.dataset.showMeta || 'true',
			show_author: blockElement.dataset.showAuthor || 'true',
			show_date: blockElement.dataset.showDate || 'true',
			show_categories: blockElement.dataset.showCategoriesDisplay || 'true',
			show_tags: blockElement.dataset.showTagsDisplay || 'false',
			show_read_more: blockElement.dataset.showReadMore || 'true',
			read_more_text: blockElement.dataset.readMoreText || 'Read More',
			image_position: blockElement.dataset.imagePosition || 'top',
			display_mode: blockElement.dataset.displayMode || 'grid',
			carousel_enabled: blockElement.dataset.carouselEnabled || 'false',
			post_status: blockElement.dataset.postStatus || 'publish',
		};
	}

	/**
	 * Filter posts via AJAX
	 *
	 * All HTML returned from the server is generated by WordPress PHP functions
	 * (esc_html, esc_url, wp_kses_post, etc.) and protected by nonce verification,
	 * making it safe to render directly.
	 */
	function filterPosts(blockElement, filters = {}) {
		const blockId = blockElement.dataset.blockId;
		const postType = blockElement.dataset.postType;
		const hasPills = blockElement.dataset.filterDisplayMode === 'pills';

		// Determine current orderBy/order from sort dropdown (if changed)
		// or block data attributes (matching SSR query)
		let currentOrderBy = blockElement.dataset.orderBy || 'date';
		let currentOrder = blockElement.dataset.order || 'desc';
		const sortDropdown = blockElement.querySelector('.sort-dropdown');
		if (sortDropdown && sortDropdown.value) {
			const parts = sortDropdown.value.split('-');
			currentOrderBy = parts[0];
			currentOrder = parts[1];
		}

		// Get current filter values - check pills first, then dropdowns
		const currentFilters = {
			search: blockElement.querySelector('.search-input')?.value || '',
			category: hasPills
				? getPillFilterValues(blockElement, 'category')
				: blockElement.querySelector('.category-filter')?.value || '',
			tag: hasPills
				? getPillFilterValues(blockElement, 'post_tag')
				: blockElement.querySelector('.tag-filter')?.value || '',
			date: blockElement.querySelector('.date-filter')?.value || '',
			orderBy: currentOrderBy,
			order: currentOrder,
		};

		// Add dynamic taxonomy filter for CPTs
		const taxonomySlug = blockElement.dataset.taxonomySlug;
		if (taxonomySlug) {
			const taxonomyTerms = hasPills
				? getDynamicPillFilterValues(blockElement, taxonomySlug)
				: blockElement.querySelector('.taxonomy-filter')?.value || '';
			if (taxonomyTerms) {
				currentFilters.taxonomy = taxonomySlug;
				currentFilters.terms = taxonomyTerms;
			}
		}

		// Merge with new filters
		const allFilters = { ...currentFilters, ...filters };

		// Get posts container - for carousel, we target swiper-container
		let postsContainer;
		if (blockElement.dataset.carouselEnabled === 'true') {
			postsContainer = blockElement.querySelector('swiper-container');
		} else {
			postsContainer = blockElement.querySelector(
				'.posts-grid, .posts-list, .posts-masonry'
			);
		}
		if (!postsContainer) return;

		// Show loading state
		postsContainer.classList.add('loading');

		// Build query parameters with nonce and display attributes
		const displayAttrs = getDisplayAttributes(blockElement);
		const params = new URLSearchParams({
			action: 'prolific_filter_query_posts',
			nonce: prolific_query_posts.nonce,
			block_id: blockId,
			post_type: postType,
			...displayAttrs,
			...allFilters,
		});

		// Make AJAX request
		// Server response HTML is sanitized via WordPress escaping functions
		fetch(prolific_query_posts.ajax_url + '?' + params.toString(), {
			method: 'GET',
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.success) {
					const noResults =
						!data.data.html || data.data.html.trim() === '';

					if (noResults) {
						// Build no-results message using safe DOM methods
						const noResultsDiv =
							document.createElement('div');
						noResultsDiv.className = 'no-posts-found';
						const noResultsP =
							document.createElement('p');
						noResultsP.textContent =
							blockElement.dataset.noResultsText ||
							'No posts found.';
						noResultsDiv.appendChild(noResultsP);
						postsContainer.replaceChildren(noResultsDiv);
					} else {
						// Update posts with server-sanitized HTML
						// Server response is generated by WordPress PHP escaping functions
						postsContainer.innerHTML = data.data.html;
					}

					// Reinitialize carousel if needed
					if (
						!noResults &&
						blockElement.dataset.carouselEnabled === 'true'
					) {
						setTimeout(() => {
							initCarousel(blockElement);
						}, 100);
					}

					// Update load more button — hide when no results
					const loadMoreButton =
						blockElement.querySelector('.load-more-button');
					if (loadMoreButton) {
						if (noResults) {
							loadMoreButton.style.display = 'none';
						} else {
							loadMoreButton.style.display = '';
							loadMoreButton.dataset.page = '1';
							loadMoreButton.dataset.maxPages =
								data.data.max_pages || 1;
							loadMoreButton.disabled = false;
							loadMoreButton.textContent =
								blockElement.dataset.loadMoreText ||
								'Load More';
						}
					}

					// Update pagination wrapper — hide when no results
					const paginationWrapper =
						blockElement.querySelector('.pagination-wrapper');
					if (paginationWrapper) {
						if (noResults || data.data.max_pages <= 1) {
							paginationWrapper.style.display = 'none';
						} else {
							paginationWrapper.style.display = '';
							if (
								allFilters.ajax_pagination === 'true' &&
								data.data.pagination
							) {
								// Pagination HTML generated by WordPress paginate_links()
								paginationWrapper.innerHTML =
									data.data.pagination;
								paginationWrapper.dataset.currentPage =
									allFilters.page || '1';
							}
						}
					}
				} else {
					console.error(
						'Error filtering posts:',
						data.data?.message
					);
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
	 *
	 * Appends new post items to existing content. Server response HTML
	 * is sanitized via WordPress escaping functions.
	 */
	function loadMorePosts(blockElement, page, button) {
		const blockId = blockElement.dataset.blockId;
		const postType = blockElement.dataset.postType;
		const hasPills = blockElement.dataset.filterDisplayMode === 'pills';

		button.disabled = true;
		button.classList.add('loading');
		button.textContent = 'Loading...';

		// Get current filters - support pill filters
		const filters = {
			search: blockElement.querySelector('.search-input')?.value || '',
			category: hasPills
				? getPillFilterValues(blockElement, 'category')
				: blockElement.querySelector('.category-filter')?.value || '',
			tag: hasPills
				? getPillFilterValues(blockElement, 'post_tag')
				: blockElement.querySelector('.tag-filter')?.value || '',
			date: blockElement.querySelector('.date-filter')?.value || '',
		};

		const displayAttrs = getDisplayAttributes(blockElement);
		const params = new URLSearchParams({
			action: 'prolific_load_more_posts',
			nonce: prolific_query_posts.nonce,
			block_id: blockId,
			post_type: postType,
			page: page,
			...displayAttrs,
			...filters,
		});

		// Server response HTML is sanitized via WordPress escaping functions
		fetch(prolific_query_posts.ajax_url + '?' + params.toString(), {
			method: 'GET',
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.success) {
					// Get posts container
					let postsContainer;
					if (blockElement.dataset.carouselEnabled === 'true') {
						postsContainer =
							blockElement.querySelector('swiper-container');
					} else {
						postsContainer = blockElement.querySelector(
							'.posts-grid, .posts-list, .posts-masonry'
						);
					}

					if (postsContainer) {
						// Append server-sanitized HTML
						postsContainer.insertAdjacentHTML(
							'beforeend',
							data.data.html
						);

						// Update button
						button.dataset.page = page;
						button.disabled = false;
						button.classList.remove('loading');
						button.textContent =
							blockElement.dataset.loadMoreText || 'Load More';

						// Check if we've reached the last page
						const maxPages =
							parseInt(button.dataset.maxPages) || 1;
						if (page >= maxPages) {
							button.disabled = true;
							button.textContent = 'No more posts';
						}

						// Reinitialize carousel if needed
						if (
							blockElement.dataset.carouselEnabled === 'true'
						) {
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
	 * Initialize pill filter buttons with toggle and multi-select behavior.
	 */
	function initPillFilters(blockElement) {
		const pillContainers = blockElement.querySelectorAll('.filter-pills');
		if (!pillContainers.length) return;

		pillContainers.forEach((container) => {
			const taxonomy = container.dataset.taxonomy;

			container.addEventListener('click', function (e) {
				const pill = e.target.closest('.filter-pill');
				if (!pill) return;

				const termId = pill.dataset.termId;

				if (termId === '') {
					// "All" pill clicked - deactivate all others
					container.querySelectorAll('.filter-pill').forEach((p) => {
						p.classList.remove('active');
						p.setAttribute('aria-pressed', 'false');
					});
					pill.classList.add('active');
					pill.setAttribute('aria-pressed', 'true');
				} else {
					// Specific pill clicked - deactivate "All" pill
					const allPill = container.querySelector(
						'.filter-pill[data-term-id=""]'
					);
					if (allPill) {
						allPill.classList.remove('active');
						allPill.setAttribute('aria-pressed', 'false');
					}

					// Toggle this pill
					pill.classList.toggle('active');
					pill.setAttribute(
						'aria-pressed',
						pill.classList.contains('active') ? 'true' : 'false'
					);

					// If no pills active, reactivate "All"
					const activePills = container.querySelectorAll(
						'.filter-pill.active'
					);
					if (activePills.length === 0 && allPill) {
						allPill.classList.add('active');
						allPill.setAttribute('aria-pressed', 'true');
					}
				}

				// Trigger filtering
				const activeTermIds = Array.from(
					container.querySelectorAll(
						'.filter-pill.active[data-term-id]:not([data-term-id=""])'
					)
				)
					.map((p) => p.dataset.termId)
					.join(',');

				// Route to correct AJAX params based on taxonomy type
				let filterPayload;
				if (taxonomy === 'category') {
					filterPayload = { category: activeTermIds };
				} else if (taxonomy === 'post_tag') {
					filterPayload = { tag: activeTermIds };
				} else {
					// CPT taxonomy — use dynamic taxonomy/terms params
					filterPayload = activeTermIds
						? { taxonomy: taxonomy, terms: activeTermIds }
						: { taxonomy: '', terms: '' };
				}

				filterPosts(blockElement, filterPayload);
			});
		});
	}

	/**
	 * Initialize AJAX pagination - intercept page link clicks.
	 */
	function initAjaxPagination(blockElement) {
		if (blockElement.dataset.ajaxPagination !== 'true') return;

		const paginationWrapper =
			blockElement.querySelector('.pagination-wrapper');
		if (!paginationWrapper) return;

		paginationWrapper.addEventListener('click', function (e) {
			const link = e.target.closest('a.page-numbers');
			if (!link) return;

			e.preventDefault();

			// Extract page number from link href
			let page = 1;
			const href = link.getAttribute('href');

			// Try ?paged=N format, then /page/N/ format
			const urlMatch = href.match(/[?&]paged=(\d+)/);
			const pathMatch = href.match(/\/page\/(\d+)/);

			if (urlMatch) {
				page = parseInt(urlMatch[1], 10);
			} else if (pathMatch) {
				page = parseInt(pathMatch[1], 10);
			}

			// Handle prev/next links by calculating from current page
			if (!urlMatch && !pathMatch) {
				const currentPage =
					parseInt(paginationWrapper.dataset.currentPage, 10) || 1;
				if (link.classList.contains('prev')) {
					page = Math.max(1, currentPage - 1);
				} else if (link.classList.contains('next')) {
					page = currentPage + 1;
				}
			}

			filterPosts(blockElement, {
				page: page,
				ajax_pagination: 'true',
			});
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

			// Initialize filters - pills or dropdowns
			if (block.dataset.filterDisplayMode === 'pills') {
				initPillFilters(block);
			} else {
				if (block.dataset.showCategoryFilter === 'true') {
					initCategoryFilter(block);
				}

				if (block.dataset.showTagFilter === 'true') {
					initTagFilter(block);
				}

				if (block.dataset.showTaxonomyFilter === 'true') {
					initTaxonomyFilter(block);
				}
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

			// Initialize AJAX pagination
			initAjaxPagination(block);

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
