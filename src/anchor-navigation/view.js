/**
 * Frontend JavaScript for Anchor Navigation block
 * Handles smooth scrolling, sticky behavior, and active link highlighting
 */

document.addEventListener('DOMContentLoaded', function() {
	// Get all anchor navigation blocks
	const anchorNavBlocks = document.querySelectorAll('.wp-block-prolific-anchor-navigation');

	anchorNavBlocks.forEach((navBlock) => {
		const smoothScroll = navBlock.getAttribute('data-smooth-scroll') === 'true';
		const scrollOffset = parseInt(navBlock.getAttribute('data-scroll-offset')) || 0;
		const isSticky = navBlock.getAttribute('data-sticky') === 'true';
		const stickyOffset = parseInt(navBlock.getAttribute('data-sticky-offset')) || 0;

		const navLinks = navBlock.querySelectorAll('.anchor-nav-link');

		// Handle sticky positioning with CSS sticky
		if (isSticky) {
			// Set the sticky top position
			navBlock.style.top = `${stickyOffset}px`;

			// Use Intersection Observer to detect when nav becomes sticky (for box shadow effect)
			const sentinel = document.createElement('div');
			sentinel.style.position = 'absolute';
			sentinel.style.top = `-${stickyOffset + 1}px`;
			sentinel.style.height = '1px';
			sentinel.style.width = '100%';
			navBlock.parentElement.insertBefore(sentinel, navBlock);

			const observer = new IntersectionObserver(
				([entry]) => {
					// When sentinel is not visible, nav is stuck
					if (!entry.isIntersecting) {
						navBlock.classList.add('is-stuck');
					} else {
						navBlock.classList.remove('is-stuck');
					}
				},
				{
					threshold: [0],
					rootMargin: `${stickyOffset}px 0px 0px 0px`
				}
			);

			observer.observe(sentinel);
		}

		// Handle smooth scrolling for navigation links
		navLinks.forEach((link) => {
			link.addEventListener('click', function(e) {
				const href = this.getAttribute('href');

				// Only handle internal anchor links
				if (href && href.startsWith('#')) {
					const targetId = href.substring(1);
					const targetElement = document.getElementById(targetId);

					if (targetElement) {
						e.preventDefault();

						// Calculate scroll position with offset
						// Account for sticky nav height and sticky offset to position heading at top
						const navHeight = isSticky ? navBlock.offsetHeight + stickyOffset : 0;
						const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
						const offsetPosition = targetPosition - navHeight - scrollOffset;

						if (smoothScroll) {
							// Smooth scroll
							window.scrollTo({
								top: offsetPosition,
								behavior: 'smooth'
							});
						} else {
							// Instant scroll
							window.scrollTo(0, offsetPosition);
						}

						// Update URL hash
						if (history.pushState) {
							history.pushState(null, null, href);
						} else {
							// Fallback for older browsers
							location.hash = href;
						}

						// Focus the target element for accessibility
						targetElement.setAttribute('tabindex', '-1');
						targetElement.focus();
					}
				}
			});
		});

		// Highlight active section on scroll
		const highlightActiveSection = () => {
			let activeLink = null;
			let closestDistance = Infinity;

			navLinks.forEach((link) => {
				const href = link.getAttribute('href');

				if (href && href.startsWith('#')) {
					const targetId = href.substring(1);
					const targetElement = document.getElementById(targetId);

					if (targetElement) {
						const rect = targetElement.getBoundingClientRect();
						const adjustedOffset = scrollOffset + (isSticky ? navBlock.offsetHeight : 0);
						const distance = Math.abs(rect.top - adjustedOffset);

						// Find the closest heading to the scroll position
						if (rect.top <= adjustedOffset + 50 && distance < closestDistance) {
							closestDistance = distance;
							activeLink = link;
						}
					}
				}

				// Remove active class from all links
				link.classList.remove('is-active');
			});

			// Add active class to the closest link
			if (activeLink) {
				activeLink.classList.add('is-active');
			}
		};

		// Throttle scroll event for performance
		let scrollTimeout;
		window.addEventListener('scroll', function() {
			if (scrollTimeout) {
				window.cancelAnimationFrame(scrollTimeout);
			}

			scrollTimeout = window.requestAnimationFrame(function() {
				highlightActiveSection();
			});
		});

		// Initial highlight on page load
		highlightActiveSection();

		// Ensure all headings have IDs (same logic as TOC block and server-side)
		const ensureHeadingAnchors = () => {
			const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
			const anchorCounts = {};

			headings.forEach((heading) => {
				if (!heading.id) {
					// Generate ID from heading text using same logic as server-side
					let baseId = heading.textContent
						.toLowerCase()
						.trim()
						.replace(/\s+/g, '-')
						.replace(/[^\w\-]+/g, '')
						.replace(/\-\-+/g, '-')
						.replace(/^-+/, '')
						.replace(/-+$/, '');

					// Handle duplicate IDs by appending counter
					// Start counting from 1 for the first occurrence
					if (!anchorCounts[baseId]) {
						anchorCounts[baseId] = 0;
					}

					anchorCounts[baseId]++;

					// Check if ID already exists in DOM (from server-side render or previous headings)
					let finalId = baseId;
					if (anchorCounts[baseId] > 1 || document.getElementById(finalId)) {
						// If duplicate or already exists, append counter
						let counter = anchorCounts[baseId];
						finalId = baseId + '-' + counter;

						// Keep incrementing if still exists in DOM
						while (document.getElementById(finalId)) {
							counter++;
							finalId = baseId + '-' + counter;
							anchorCounts[baseId] = counter;
						}
					}

					heading.id = finalId;
				} else {
					// Track existing IDs to maintain consistency
					const baseId = heading.id.replace(/-\d+$/, '');
					if (!anchorCounts[baseId]) {
						anchorCounts[baseId] = 0;
					}
					anchorCounts[baseId]++;
				}
			});
		};

		// Ensure all headings have IDs
		ensureHeadingAnchors();
	});
});
