/**
 * Frontend chart rendering
 */

import { renderChart, getChartColors } from './chart-utils';

/**
 * Initialize charts on the frontend
 */
function initializeCharts() {
	const chartBlocks = document.querySelectorAll('.prolific-chart-block');

	chartBlocks.forEach((block) => {
		const container = block.querySelector('.chart-container');
		if (!container) return;

		// Get attributes from data attributes
		const chartType = block.dataset.chartType || 'bar';
		const orientation = block.dataset.orientation || 'vertical';
		const chartData = JSON.parse(block.dataset.chartData || '[]');
		const chartWidth = block.dataset.chartWidth || '100%';
		const chartHeight = parseInt(block.dataset.chartHeight) || 400;
		const marginTop = parseInt(block.dataset.marginTop) || 20;
		const marginRight = parseInt(block.dataset.marginRight) || 20;
		const marginBottom = parseInt(block.dataset.marginBottom) || 50;
		const marginLeft = parseInt(block.dataset.marginLeft) || 60;
		const responsive = block.dataset.responsive === 'true';
		const colorScheme = block.dataset.colorScheme || 'blue';
		const customColors = JSON.parse(block.dataset.customColors || '[]');
		const showDataLabels = block.dataset.showDataLabels === 'true';
		const showLegend = block.dataset.showLegend === 'true';
		const legendPosition = block.dataset.legendPosition || 'top';
		const fontSize = parseInt(block.dataset.fontSize) || 12;
		const showXAxis = block.dataset.showXAxis === 'true';
		const showYAxis = block.dataset.showYAxis === 'true';
		const xAxisLabel = block.dataset.xAxisLabel || '';
		const yAxisLabel = block.dataset.yAxisLabel || '';
		const showGridLines = block.dataset.showGridLines === 'true';
		const enableAnimations = block.dataset.enableAnimations === 'true';
		const animationDuration = parseInt(block.dataset.animationDuration) || 800;
		const easingFunction = block.dataset.easingFunction || 'easeQuadInOut';
		const showTooltips = block.dataset.showTooltips === 'true';

		// Skip if no data
		if (!chartData || chartData.length === 0) {
			return;
		}

		// Remove loading message
		const loading = container.querySelector('.chart-loading');
		if (loading) {
			loading.remove();
		}

		// Get colors
		const colors = getChartColors(colorScheme, customColors, chartData.length);

		// Build options object
		const options = {
			width: chartWidth,
			height: chartHeight,
			margins: {
				top: marginTop,
				right: marginRight,
				bottom: marginBottom,
				left: marginLeft
			},
			colors,
			orientation,
			showDataLabels,
			showLegend,
			legendPosition,
			fontSize,
			showXAxis,
			showYAxis,
			xAxisLabel,
			yAxisLabel,
			showGridLines,
			enableAnimations,
			animationDuration,
			easingFunction,
			showTooltips,
			responsive
		};

		// Render the chart
		renderChart(container, chartType, chartData, options);

		// Handle window resize for responsive charts
		if (responsive) {
			let resizeTimeout;
			const handleResize = () => {
				clearTimeout(resizeTimeout);
				resizeTimeout = setTimeout(() => {
					renderChart(container, chartType, chartData, options);
				}, 250);
			};

			window.addEventListener('resize', handleResize);

			// Store cleanup function
			container._cleanupResize = () => {
				window.removeEventListener('resize', handleResize);
			};
		}
	});
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initializeCharts);
} else {
	initializeCharts();
}

// Re-initialize when blocks are dynamically added (e.g., via AJAX)
if (window.MutationObserver) {
	const observer = new MutationObserver((mutations) => {
		let hasNewCharts = false;
		mutations.forEach((mutation) => {
			mutation.addedNodes.forEach((node) => {
				if (node.nodeType === 1 &&
					(node.classList?.contains('prolific-chart-block') ||
					 node.querySelector?.('.prolific-chart-block'))) {
					hasNewCharts = true;
				}
			});
		});
		if (hasNewCharts) {
			initializeCharts();
		}
	});

	observer.observe(document.body, {
		childList: true,
		subtree: true
	});
}
