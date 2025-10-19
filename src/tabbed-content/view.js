/**
 * Frontend JavaScript for Tabbed Content block
 */

document.addEventListener('DOMContentLoaded', function () {
	const tabbedContentBlocks = document.querySelectorAll(
		'.wp-block-prolific-tabbed-content'
	);

	tabbedContentBlocks.forEach((block) => {
		initTabbedContent(block);
	});

	/**
	 * Initialize a tabbed content block
	 */
	function initTabbedContent(block) {
		const blockId = block.dataset.blockId;
		const tabs = block.querySelectorAll('.tabbed-content__tab');
		const panels = block.querySelectorAll('.tabbed-content-panel');
		const enableUrlHash = block.dataset.enableUrlHash === 'true';
		const rememberTab = block.dataset.rememberTab === 'true';
		const mobileBreakpoint = parseInt(block.dataset.mobileBreakpoint) || 768;
		const mobileBehavior = block.dataset.mobileBehavior || 'stack';

		if (tabs.length === 0 || panels.length === 0) {
			return;
		}

		let currentActiveIndex = parseInt(block.dataset.activeTab) || 0;

		// Check localStorage for remembered tab
		if (rememberTab && blockId) {
			const storedIndex = localStorage.getItem(
				`tabbedContent_${blockId}`
			);
			if (storedIndex !== null) {
				currentActiveIndex = parseInt(storedIndex);
			}
		}

		// Check URL hash for active tab
		if (enableUrlHash && window.location.hash) {
			const hash = window.location.hash.substring(1);
			tabs.forEach((tab, index) => {
				const tabId = tab.dataset.tabId;
				if (hash === tabId || hash === `tab-${tabId}`) {
					currentActiveIndex = index;
				}
			});
		}

		/**
		 * Activate a tab
		 */
		function activateTab(index, updateHistory = false) {
			// Deactivate all tabs and panels
			tabs.forEach((tab) => {
				tab.classList.remove('is-active');
				tab.setAttribute('aria-selected', 'false');
				tab.setAttribute('tabindex', '-1');
			});

			panels.forEach((panel) => {
				panel.classList.remove('is-active');
				panel.setAttribute('aria-hidden', 'true');
			});

			// Activate selected tab and panel
			if (tabs[index] && panels[index]) {
				tabs[index].classList.add('is-active');
				tabs[index].setAttribute('aria-selected', 'true');
				tabs[index].setAttribute('tabindex', '0');

				panels[index].classList.add('is-active');
				panels[index].setAttribute('aria-hidden', 'false');

				currentActiveIndex = index;

				// Remember tab in localStorage
				if (rememberTab && blockId) {
					localStorage.setItem(
						`tabbedContent_${blockId}`,
						index.toString()
					);
				}

				// Update URL hash
				if (enableUrlHash && updateHistory) {
					const tabId = tabs[index].dataset.tabId;
					if (tabId) {
						history.replaceState(null, null, `#${tabId}`);
					}
				}
			}
		}

		// Initialize first active tab
		activateTab(currentActiveIndex);

		// Tab click events
		tabs.forEach((tab, index) => {
			tab.addEventListener('click', () => {
				activateTab(index, enableUrlHash);
			});

			// Keyboard navigation
			tab.addEventListener('keydown', (e) => {
				let newIndex = currentActiveIndex;

				if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
					e.preventDefault();
					newIndex = (currentActiveIndex + 1) % tabs.length;
				} else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
					e.preventDefault();
					newIndex =
						currentActiveIndex === 0
							? tabs.length - 1
							: currentActiveIndex - 1;
				} else if (e.key === 'Home') {
					e.preventDefault();
					newIndex = 0;
				} else if (e.key === 'End') {
					e.preventDefault();
					newIndex = tabs.length - 1;
				}

				if (newIndex !== currentActiveIndex) {
					activateTab(newIndex, enableUrlHash);
					tabs[newIndex].focus();
				}
			});
		});

		// Mobile accordion behavior
		if (mobileBehavior === 'accordion') {
			handleAccordionBehavior();
			window.addEventListener('resize', handleAccordionBehavior);
		}

		/**
		 * Handle accordion behavior on mobile
		 */
		function handleAccordionBehavior() {
			const isMobile = window.innerWidth < mobileBreakpoint;

			panels.forEach((panel, index) => {
				const accordionButton = panel.querySelector(
					'.tabbed-content-panel__accordion-button'
				);

				if (accordionButton) {
					if (isMobile) {
						// Show accordion buttons on mobile
						accordionButton.style.display = 'flex';

						// Accordion button click
						accordionButton.onclick = () => {
							// Toggle this panel
							const isCurrentlyActive =
								panel.classList.contains('is-active');

							// Deactivate all panels
							panels.forEach((p) => {
								p.classList.remove('is-active');
								p.setAttribute('aria-hidden', 'true');
							});

							// Activate this panel if it wasn't active
							if (!isCurrentlyActive) {
								panel.classList.add('is-active');
								panel.setAttribute('aria-hidden', 'false');
								currentActiveIndex = index;

								// Remember tab
								if (rememberTab && blockId) {
									localStorage.setItem(
										`tabbedContent_${blockId}`,
										index.toString()
									);
								}
							}
						};
					} else {
						// Hide accordion buttons on desktop
						accordionButton.style.display = 'none';
					}
				}
			});
		}

		// Listen for hash changes
		if (enableUrlHash) {
			window.addEventListener('hashchange', () => {
				const hash = window.location.hash.substring(1);
				tabs.forEach((tab, index) => {
					const tabId = tab.dataset.tabId;
					if (hash === tabId || hash === `tab-${tabId}`) {
						activateTab(index, false);
					}
				});
			});
		}
	}
});
