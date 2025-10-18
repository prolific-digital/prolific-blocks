/**
 * Frontend JavaScript for Lottie block.
 * Initializes DotLottie animations with all configuration options.
 */
import { DotLottie } from '@lottiefiles/dotlottie-web';

document.addEventListener('DOMContentLoaded', function () {
	// Select all Lottie block instances
	const lottieBlocks = document.querySelectorAll('.wp-block-prolific-lottie-js');

	lottieBlocks.forEach((block) => {
		// Find the canvas element within the block
		const canvas = block.querySelector('canvas.lottie-canvas');

		if (!canvas) return;

		// Get all attributes from the canvas
		const loop = canvas.getAttribute('data-lottie-loop') === 'true';
		const autoplay = canvas.getAttribute('data-lottie-autoplay') === 'true';
		const src = canvas.getAttribute('data-lottie-src');
		const speed = parseFloat(canvas.getAttribute('data-lottie-speed')) || 1;
		const direction = parseInt(canvas.getAttribute('data-lottie-direction')) || 1;
		const mode = canvas.getAttribute('data-lottie-mode') || 'normal';
		const startOnView = canvas.getAttribute('data-lottie-start-on-view') === 'true';
		const intermission = parseInt(canvas.getAttribute('data-lottie-intermission')) || 0;
		const useFrameInterpolation =
			canvas.getAttribute('data-lottie-use-frame-interpolation') === 'true';
		const segmentAttr = canvas.getAttribute('data-lottie-segment');
		const marker = canvas.getAttribute('data-lottie-marker');

		// Parse segment if exists
		let segment = null;
		if (segmentAttr) {
			try {
				segment = JSON.parse(segmentAttr);
			} catch (e) {
				console.error('Failed to parse Lottie segment:', e);
			}
		}

		// Build DotLottie configuration
		const config = {
			canvas: canvas,
			autoplay: autoplay && !startOnView,
			loop,
			src,
			speed,
			useFrameInterpolation,
		};

		// Add mode if not normal
		if (mode && mode !== 'normal') {
			config.mode = mode;
		}

		// Add intermission for bounce mode
		if (mode === 'bounce' && intermission > 0) {
			config.intermission = intermission;
		}

		// Add segment if specified
		if (segment && Array.isArray(segment) && segment.length === 2) {
			config.segment = segment;
		}

		// Add marker if specified
		if (marker) {
			config.marker = marker;
		}

		// Initialize Lottie
		const dotLottie = new DotLottie(config);

		// Set direction after initialization
		dotLottie.addEventListener('load', () => {
			if (direction === -1) {
				dotLottie.setDirection('reverse');
			}
		});

		// Handle startOnView with IntersectionObserver
		if (startOnView) {
			// Pause the animation initially if autoplay is true
			if (autoplay) {
				dotLottie.addEventListener('load', () => {
					dotLottie.pause();
				});
			}

			const observerOptions = {
				root: null, // Viewport
				rootMargin: '0px 0px -200px 0px', // Trigger before element fully visible
				threshold: 0,
			};

			const observer = new IntersectionObserver((entries, observer) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						dotLottie.play();
						observer.unobserve(entry.target);
					}
				});
			}, observerOptions);

			observer.observe(canvas);
		}
	});
});
