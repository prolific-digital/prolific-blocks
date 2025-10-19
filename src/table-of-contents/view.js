/**
 * Frontend JavaScript for Table of Contents block
 * Handles smooth scrolling, collapsible functionality, and active section highlighting
 */

document.addEventListener('DOMContentLoaded', function() {
	// Get all table of contents blocks
	const tocBlocks = document.querySelectorAll('.wp-block-prolific-table-of-contents');

	tocBlocks.forEach((tocBlock) => {
		const smoothScroll = tocBlock.getAttribute('data-smooth-scroll') === 'true';
		const scrollOffset = parseInt(tocBlock.getAttribute('data-scroll-offset')) || 0;
		const isCollapsible = tocBlock.getAttribute('data-collapsible') === 'true';

		// Handle collapsible functionality
		if (isCollapsible) {
			const toggleButton = tocBlock.querySelector('.toc-toggle');
			const content = tocBlock.querySelector('.toc-content');

			if (toggleButton && content) {
				toggleButton.addEventListener('click', function() {
					const isExpanded = this.getAttribute('aria-expanded') === 'true';

					// Toggle aria-expanded
					this.setAttribute('aria-expanded', !isExpanded);

					// Toggle content visibility
					tocBlock.classList.toggle('toc-collapsed');

					// Toggle icon rotation (handled by CSS)
					this.classList.toggle('toc-toggle-collapsed');
				});
			}
		}

		// Handle smooth scrolling for TOC links
		const tocLinks = tocBlock.querySelectorAll('.toc-link');

		tocLinks.forEach((link) => {
			link.addEventListener('click', function(e) {
				const href = this.getAttribute('href');

				// Only handle internal anchor links
				if (href && href.startsWith('#')) {
					const targetId = href.substring(1);
					const targetElement = document.getElementById(targetId);

					if (targetElement) {
						e.preventDefault();

						// Calculate scroll position with offset
						const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
						const offsetPosition = targetPosition - scrollOffset;

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
			const tocLinks = tocBlock.querySelectorAll('.toc-link');
			let activeLink = null;
			let closestDistance = Infinity;

			tocLinks.forEach((link) => {
				const href = link.getAttribute('href');

				if (href && href.startsWith('#')) {
					const targetId = href.substring(1);
					const targetElement = document.getElementById(targetId);

					if (targetElement) {
						const rect = targetElement.getBoundingClientRect();
						const distance = Math.abs(rect.top - scrollOffset);

						// Find the closest heading to the scroll position
						if (rect.top <= scrollOffset + 50 && distance < closestDistance) {
							closestDistance = distance;
							activeLink = link;
						}
					}
				}

				// Remove active class from all links
				link.classList.remove('toc-link-active');
			});

			// Add active class to the closest link
			if (activeLink) {
				activeLink.classList.add('toc-link-active');
			}
		};

		// Throttle scroll event for better performance
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
	});

	/**
	 * Ensure all headings have anchor IDs
	 * This adds IDs to headings that don't already have them
	 * Uses the same logic as the server-side render to ensure consistency
	 */
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
