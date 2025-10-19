/**
 * Chart rendering utilities using D3.js
 * Shared functions for both editor and frontend rendering
 */

import * as d3 from 'd3';

/**
 * Color schemes for charts
 */
export const COLOR_SCHEMES = {
	blue: ['#1E3A8A', '#3B82F6', '#60A5FA', '#93C5FD', '#DBEAFE'],
	green: ['#14532D', '#22C55E', '#4ADE80', '#86EFAC', '#D1FAE5'],
	purple: ['#581C87', '#A855F7', '#C084FC', '#E9D5FF', '#F3E8FF'],
	orange: ['#9A3412', '#F97316', '#FB923C', '#FDBA74', '#FED7AA'],
	red: ['#991B1B', '#EF4444', '#F87171', '#FCA5A5', '#FEE2E2'],
	teal: ['#134E4A', '#14B8A6', '#5EEAD4', '#99F6E4', '#CCFBF1'],
	gradient: ['#667EEA', '#764BA2', '#F093FB', '#4FACFE', '#00F2FE']
};

/**
 * Get colors for the chart based on scheme and custom colors
 */
export function getChartColors(colorScheme, customColors, dataLength) {
	// If custom scheme is selected, use custom colors
	if (colorScheme === 'custom') {
		const colors = [...(customColors || [])];
		// Fill in any missing colors with a default blue
		while (colors.length < dataLength) {
			colors.push('#2196f3');
		}
		return colors.slice(0, dataLength);
	}

	// Use preset color scheme
	const scheme = COLOR_SCHEMES[colorScheme] || COLOR_SCHEMES.blue;
	const colors = [];

	for (let i = 0; i < dataLength; i++) {
		colors.push(scheme[i % scheme.length]);
	}

	return colors;
}

/**
 * Create responsive SVG container
 */
export function createSVG(container, width, height, margins, responsive = true) {
	// Clear existing content
	d3.select(container).selectAll('*').remove();

	const svg = d3.select(container)
		.append('svg')
		.attr('role', 'img')
		.attr('aria-label', 'Data visualization chart');

	if (responsive && width === '100%') {
		svg.attr('viewBox', `0 0 800 ${height}`)
			.attr('preserveAspectRatio', 'xMidYMid meet')
			.style('width', '100%')
			.style('height', 'auto');
	} else {
		svg.attr('width', width)
			.attr('height', height);
	}

	const chartGroup = svg.append('g')
		.attr('transform', `translate(${margins.left},${margins.top})`);

	return { svg, chartGroup };
}

/**
 * Add tooltip to container
 */
export function createTooltip(container) {
	return d3.select(container)
		.append('div')
		.attr('class', 'chart-tooltip')
		.style('opacity', 0)
		.style('position', 'absolute')
		.style('pointer-events', 'none');
}

/**
 * Render Bar Chart
 */
export function renderBarChart(container, data, options) {
	const {
		width = 800,
		height = 400,
		margins = { top: 20, right: 20, bottom: 50, left: 60 },
		colors = COLOR_SCHEMES.blue,
		orientation = 'vertical',
		showDataLabels = false,
		showXAxis = true,
		showYAxis = true,
		xAxisLabel = '',
		yAxisLabel = '',
		showGridLines = true,
		enableAnimations = true,
		animationDuration = 800,
		easingFunction = 'easeQuadInOut',
		showTooltips = true,
		responsive = true
	} = options;

	const actualWidth = responsive ? 800 : (typeof width === 'number' ? width : 800);
	const chartWidth = actualWidth - margins.left - margins.right;
	const chartHeight = height - margins.top - margins.bottom;

	const { svg, chartGroup } = createSVG(container, width, height, margins, responsive);

	if (orientation === 'vertical') {
		// Vertical bar chart
		const x = d3.scaleBand()
			.domain(data.map(d => d.label))
			.range([0, chartWidth])
			.padding(0.2);

		const y = d3.scaleLinear()
			.domain([0, d3.max(data, d => d.value)])
			.nice()
			.range([chartHeight, 0]);

		// Add grid lines
		if (showGridLines) {
			chartGroup.append('g')
				.attr('class', 'grid')
				.selectAll('line')
				.data(y.ticks())
				.join('line')
				.attr('x1', 0)
				.attr('x2', chartWidth)
				.attr('y1', d => y(d))
				.attr('y2', d => y(d))
				.attr('stroke', '#e5e7eb')
				.attr('stroke-dasharray', '2,2');
		}

		// Add bars
		const bars = chartGroup.selectAll('.bar')
			.data(data)
			.join('rect')
			.attr('class', 'bar')
			.attr('x', d => x(d.label))
			.attr('width', x.bandwidth())
			.attr('fill', (d, i) => colors[i % colors.length])
			.attr('rx', 4);

		if (enableAnimations) {
			bars.attr('y', chartHeight)
				.attr('height', 0)
				.transition()
				.duration(animationDuration)
				.ease(d3[easingFunction] || d3.easeQuadInOut)
				.attr('y', d => y(d.value))
				.attr('height', d => chartHeight - y(d.value));
		} else {
			bars.attr('y', d => y(d.value))
				.attr('height', d => chartHeight - y(d.value));
		}

		// Add data labels
		if (showDataLabels) {
			chartGroup.selectAll('.label')
				.data(data)
				.join('text')
				.attr('class', 'label')
				.attr('x', d => x(d.label) + x.bandwidth() / 2)
				.attr('y', d => y(d.value) - 5)
				.attr('text-anchor', 'middle')
				.attr('fill', '#374151')
				.attr('font-size', '12px')
				.text(d => d.value);
		}

		// Add axes
		if (showXAxis) {
			chartGroup.append('g')
				.attr('class', 'x-axis')
				.attr('transform', `translate(0,${chartHeight})`)
				.call(d3.axisBottom(x));

			if (xAxisLabel) {
				chartGroup.append('text')
					.attr('class', 'x-axis-label')
					.attr('text-anchor', 'middle')
					.attr('x', chartWidth / 2)
					.attr('y', chartHeight + 40)
					.attr('fill', '#374151')
					.text(xAxisLabel);
			}
		}

		if (showYAxis) {
			chartGroup.append('g')
				.attr('class', 'y-axis')
				.call(d3.axisLeft(y));

			if (yAxisLabel) {
				chartGroup.append('text')
					.attr('class', 'y-axis-label')
					.attr('text-anchor', 'middle')
					.attr('transform', 'rotate(-90)')
					.attr('x', -chartHeight / 2)
					.attr('y', -45)
					.attr('fill', '#374151')
					.text(yAxisLabel);
			}
		}

		// Add tooltips
		if (showTooltips) {
			const tooltip = createTooltip(container);

			bars.on('mouseover', function(event, d) {
				d3.select(this).attr('opacity', 0.7);
				tooltip.transition()
					.duration(200)
					.style('opacity', 0.9);
				tooltip.html(`<strong>${d.label}</strong><br/>Value: ${d.value}`)
					.style('left', (event.pageX + 10) + 'px')
					.style('top', (event.pageY - 28) + 'px');
			})
			.on('mouseout', function() {
				d3.select(this).attr('opacity', 1);
				tooltip.transition()
					.duration(500)
					.style('opacity', 0);
			});
		}
	} else {
		// Horizontal bar chart
		const x = d3.scaleLinear()
			.domain([0, d3.max(data, d => d.value)])
			.nice()
			.range([0, chartWidth]);

		const y = d3.scaleBand()
			.domain(data.map(d => d.label))
			.range([0, chartHeight])
			.padding(0.2);

		// Add grid lines
		if (showGridLines) {
			chartGroup.append('g')
				.attr('class', 'grid')
				.selectAll('line')
				.data(x.ticks())
				.join('line')
				.attr('x1', d => x(d))
				.attr('x2', d => x(d))
				.attr('y1', 0)
				.attr('y2', chartHeight)
				.attr('stroke', '#e5e7eb')
				.attr('stroke-dasharray', '2,2');
		}

		// Add bars
		const bars = chartGroup.selectAll('.bar')
			.data(data)
			.join('rect')
			.attr('class', 'bar')
			.attr('y', d => y(d.label))
			.attr('height', y.bandwidth())
			.attr('fill', (d, i) => colors[i % colors.length])
			.attr('rx', 4);

		if (enableAnimations) {
			bars.attr('x', 0)
				.attr('width', 0)
				.transition()
				.duration(animationDuration)
				.ease(d3[easingFunction] || d3.easeQuadInOut)
				.attr('width', d => x(d.value));
		} else {
			bars.attr('x', 0)
				.attr('width', d => x(d.value));
		}

		// Add data labels
		if (showDataLabels) {
			chartGroup.selectAll('.label')
				.data(data)
				.join('text')
				.attr('class', 'label')
				.attr('x', d => x(d.value) + 5)
				.attr('y', d => y(d.label) + y.bandwidth() / 2)
				.attr('dy', '.35em')
				.attr('fill', '#374151')
				.attr('font-size', '12px')
				.text(d => d.value);
		}

		// Add axes
		if (showXAxis) {
			chartGroup.append('g')
				.attr('class', 'x-axis')
				.attr('transform', `translate(0,${chartHeight})`)
				.call(d3.axisBottom(x));

			if (xAxisLabel) {
				chartGroup.append('text')
					.attr('class', 'x-axis-label')
					.attr('text-anchor', 'middle')
					.attr('x', chartWidth / 2)
					.attr('y', chartHeight + 40)
					.attr('fill', '#374151')
					.text(xAxisLabel);
			}
		}

		if (showYAxis) {
			chartGroup.append('g')
				.attr('class', 'y-axis')
				.call(d3.axisLeft(y));

			if (yAxisLabel) {
				chartGroup.append('text')
					.attr('class', 'y-axis-label')
					.attr('text-anchor', 'middle')
					.attr('transform', 'rotate(-90)')
					.attr('x', -chartHeight / 2)
					.attr('y', -45)
					.attr('fill', '#374151')
					.text(yAxisLabel);
			}
		}

		// Add tooltips
		if (showTooltips) {
			const tooltip = createTooltip(container);

			bars.on('mouseover', function(event, d) {
				d3.select(this).attr('opacity', 0.7);
				tooltip.transition()
					.duration(200)
					.style('opacity', 0.9);
				tooltip.html(`<strong>${d.label}</strong><br/>Value: ${d.value}`)
					.style('left', (event.pageX + 10) + 'px')
					.style('top', (event.pageY - 28) + 'px');
			})
			.on('mouseout', function() {
				d3.select(this).attr('opacity', 1);
				tooltip.transition()
					.duration(500)
					.style('opacity', 0);
			});
		}
	}
}

/**
 * Render Line Chart
 */
export function renderLineChart(container, data, options) {
	const {
		width = 800,
		height = 400,
		margins = { top: 20, right: 20, bottom: 50, left: 60 },
		colors = COLOR_SCHEMES.blue,
		showDataLabels = false,
		showXAxis = true,
		showYAxis = true,
		xAxisLabel = '',
		yAxisLabel = '',
		showGridLines = true,
		enableAnimations = true,
		animationDuration = 800,
		easingFunction = 'easeQuadInOut',
		showTooltips = true,
		responsive = true
	} = options;

	const actualWidth = responsive ? 800 : (typeof width === 'number' ? width : 800);
	const chartWidth = actualWidth - margins.left - margins.right;
	const chartHeight = height - margins.top - margins.bottom;

	const { svg, chartGroup } = createSVG(container, width, height, margins, responsive);

	const x = d3.scalePoint()
		.domain(data.map(d => d.label))
		.range([0, chartWidth])
		.padding(0.5);

	const y = d3.scaleLinear()
		.domain([0, d3.max(data, d => d.value)])
		.nice()
		.range([chartHeight, 0]);

	// Add grid lines
	if (showGridLines) {
		chartGroup.append('g')
			.attr('class', 'grid')
			.selectAll('line')
			.data(y.ticks())
			.join('line')
			.attr('x1', 0)
			.attr('x2', chartWidth)
			.attr('y1', d => y(d))
			.attr('y2', d => y(d))
			.attr('stroke', '#e5e7eb')
			.attr('stroke-dasharray', '2,2');
	}

	// Create line generator
	const line = d3.line()
		.x(d => x(d.label))
		.y(d => y(d.value))
		.curve(d3.curveMonotoneX);

	// Add line path
	const path = chartGroup.append('path')
		.datum(data)
		.attr('class', 'line')
		.attr('fill', 'none')
		.attr('stroke', colors[0])
		.attr('stroke-width', 2)
		.attr('d', line);

	if (enableAnimations) {
		const totalLength = path.node().getTotalLength();
		path.attr('stroke-dasharray', totalLength + ' ' + totalLength)
			.attr('stroke-dashoffset', totalLength)
			.transition()
			.duration(animationDuration)
			.ease(d3[easingFunction] || d3.easeQuadInOut)
			.attr('stroke-dashoffset', 0);
	}

	// Add dots
	const dots = chartGroup.selectAll('.dot')
		.data(data)
		.join('circle')
		.attr('class', 'dot')
		.attr('cx', d => x(d.label))
		.attr('cy', d => y(d.value))
		.attr('r', 4)
		.attr('fill', colors[0])
		.attr('stroke', '#fff')
		.attr('stroke-width', 2);

	if (enableAnimations) {
		dots.attr('r', 0)
			.transition()
			.delay((d, i) => i * (animationDuration / data.length))
			.duration(200)
			.attr('r', 4);
	}

	// Add data labels
	if (showDataLabels) {
		chartGroup.selectAll('.label')
			.data(data)
			.join('text')
			.attr('class', 'label')
			.attr('x', d => x(d.label))
			.attr('y', d => y(d.value) - 10)
			.attr('text-anchor', 'middle')
			.attr('fill', '#374151')
			.attr('font-size', '12px')
			.text(d => d.value);
	}

	// Add axes
	if (showXAxis) {
		chartGroup.append('g')
			.attr('class', 'x-axis')
			.attr('transform', `translate(0,${chartHeight})`)
			.call(d3.axisBottom(x));

		if (xAxisLabel) {
			chartGroup.append('text')
				.attr('class', 'x-axis-label')
				.attr('text-anchor', 'middle')
				.attr('x', chartWidth / 2)
				.attr('y', chartHeight + 40)
				.attr('fill', '#374151')
				.text(xAxisLabel);
		}
	}

	if (showYAxis) {
		chartGroup.append('g')
			.attr('class', 'y-axis')
			.call(d3.axisLeft(y));

		if (yAxisLabel) {
			chartGroup.append('text')
				.attr('class', 'y-axis-label')
				.attr('text-anchor', 'middle')
				.attr('transform', 'rotate(-90)')
				.attr('x', -chartHeight / 2)
				.attr('y', -45)
				.attr('fill', '#374151')
				.text(yAxisLabel);
		}
	}

	// Add tooltips
	if (showTooltips) {
		const tooltip = createTooltip(container);

		dots.on('mouseover', function(event, d) {
			d3.select(this).attr('r', 6);
			tooltip.transition()
				.duration(200)
				.style('opacity', 0.9);
			tooltip.html(`<strong>${d.label}</strong><br/>Value: ${d.value}`)
				.style('left', (event.pageX + 10) + 'px')
				.style('top', (event.pageY - 28) + 'px');
		})
		.on('mouseout', function() {
			d3.select(this).attr('r', 4);
			tooltip.transition()
				.duration(500)
				.style('opacity', 0);
		});
	}
}

/**
 * Render Pie Chart
 */
export function renderPieChart(container, data, options) {
	const {
		width = 800,
		height = 400,
		margins = { top: 20, right: 20, bottom: 20, left: 20 },
		colors = COLOR_SCHEMES.blue,
		showDataLabels = false,
		showLegend = true,
		enableAnimations = true,
		animationDuration = 800,
		easingFunction = 'easeQuadInOut',
		showTooltips = true,
		responsive = true
	} = options;

	const actualWidth = responsive ? 800 : (typeof width === 'number' ? width : 800);
	const chartWidth = actualWidth - margins.left - margins.right;
	const chartHeight = height - margins.top - margins.bottom;

	const { svg, chartGroup } = createSVG(container, width, height, margins, responsive);

	const radius = Math.min(chartWidth, chartHeight) / 2;

	chartGroup.attr('transform', `translate(${actualWidth / 2},${height / 2})`);

	const pie = d3.pie()
		.value(d => d.value)
		.sort(null);

	const arc = d3.arc()
		.innerRadius(0)
		.outerRadius(radius);

	const labelArc = d3.arc()
		.innerRadius(radius * 0.6)
		.outerRadius(radius * 0.6);

	const arcs = chartGroup.selectAll('.arc')
		.data(pie(data))
		.join('g')
		.attr('class', 'arc');

	const paths = arcs.append('path')
		.attr('fill', (d, i) => colors[i % colors.length])
		.attr('stroke', '#fff')
		.attr('stroke-width', 2);

	if (enableAnimations) {
		paths.transition()
			.duration(animationDuration)
			.ease(d3[easingFunction] || d3.easeQuadInOut)
			.attrTween('d', function(d) {
				const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
				return function(t) {
					return arc(interpolate(t));
				};
			});
	} else {
		paths.attr('d', arc);
	}

	// Add labels
	if (showDataLabels) {
		arcs.append('text')
			.attr('transform', d => `translate(${labelArc.centroid(d)})`)
			.attr('text-anchor', 'middle')
			.attr('fill', '#fff')
			.attr('font-weight', 'bold')
			.attr('font-size', '14px')
			.text(d => d.data.value);
	}

	// Add tooltips
	if (showTooltips) {
		const tooltip = createTooltip(container);

		paths.on('mouseover', function(event, d) {
			d3.select(this).attr('opacity', 0.7);
			tooltip.transition()
				.duration(200)
				.style('opacity', 0.9);
			const percentage = ((d.data.value / d3.sum(data, d => d.value)) * 100).toFixed(1);
			tooltip.html(`<strong>${d.data.label}</strong><br/>Value: ${d.data.value} (${percentage}%)`)
				.style('left', (event.pageX + 10) + 'px')
				.style('top', (event.pageY - 28) + 'px');
		})
		.on('mouseout', function() {
			d3.select(this).attr('opacity', 1);
			tooltip.transition()
				.duration(500)
				.style('opacity', 0);
		});
	}
}

/**
 * Render Donut Chart
 */
export function renderDonutChart(container, data, options) {
	const {
		width = 800,
		height = 400,
		margins = { top: 20, right: 20, bottom: 20, left: 20 },
		colors = COLOR_SCHEMES.blue,
		showDataLabels = false,
		showLegend = true,
		enableAnimations = true,
		animationDuration = 800,
		easingFunction = 'easeQuadInOut',
		showTooltips = true,
		responsive = true
	} = options;

	const actualWidth = responsive ? 800 : (typeof width === 'number' ? width : 800);
	const chartWidth = actualWidth - margins.left - margins.right;
	const chartHeight = height - margins.top - margins.bottom;

	const { svg, chartGroup } = createSVG(container, width, height, margins, responsive);

	const radius = Math.min(chartWidth, chartHeight) / 2;
	const innerRadius = radius * 0.6;

	chartGroup.attr('transform', `translate(${actualWidth / 2},${height / 2})`);

	const pie = d3.pie()
		.value(d => d.value)
		.sort(null);

	const arc = d3.arc()
		.innerRadius(innerRadius)
		.outerRadius(radius);

	const arcs = chartGroup.selectAll('.arc')
		.data(pie(data))
		.join('g')
		.attr('class', 'arc');

	const paths = arcs.append('path')
		.attr('fill', (d, i) => colors[i % colors.length])
		.attr('stroke', '#fff')
		.attr('stroke-width', 2);

	if (enableAnimations) {
		paths.transition()
			.duration(animationDuration)
			.ease(d3[easingFunction] || d3.easeQuadInOut)
			.attrTween('d', function(d) {
				const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
				return function(t) {
					return arc(interpolate(t));
				};
			});
	} else {
		paths.attr('d', arc);
	}

	// Add center text
	const total = d3.sum(data, d => d.value);
	chartGroup.append('text')
		.attr('text-anchor', 'middle')
		.attr('dy', '-0.5em')
		.attr('font-size', '24px')
		.attr('font-weight', 'bold')
		.attr('fill', '#374151')
		.text(total);

	chartGroup.append('text')
		.attr('text-anchor', 'middle')
		.attr('dy', '1.2em')
		.attr('font-size', '14px')
		.attr('fill', '#6B7280')
		.text('Total');

	// Add tooltips
	if (showTooltips) {
		const tooltip = createTooltip(container);

		paths.on('mouseover', function(event, d) {
			d3.select(this).attr('opacity', 0.7);
			tooltip.transition()
				.duration(200)
				.style('opacity', 0.9);
			const percentage = ((d.data.value / total) * 100).toFixed(1);
			tooltip.html(`<strong>${d.data.label}</strong><br/>Value: ${d.data.value} (${percentage}%)`)
				.style('left', (event.pageX + 10) + 'px')
				.style('top', (event.pageY - 28) + 'px');
		})
		.on('mouseout', function() {
			d3.select(this).attr('opacity', 1);
			tooltip.transition()
				.duration(500)
				.style('opacity', 0);
		});
	}
}

/**
 * Render Area Chart
 */
export function renderAreaChart(container, data, options) {
	const {
		width = 800,
		height = 400,
		margins = { top: 20, right: 20, bottom: 50, left: 60 },
		colors = COLOR_SCHEMES.blue,
		showDataLabels = false,
		showXAxis = true,
		showYAxis = true,
		xAxisLabel = '',
		yAxisLabel = '',
		showGridLines = true,
		enableAnimations = true,
		animationDuration = 800,
		easingFunction = 'easeQuadInOut',
		showTooltips = true,
		responsive = true
	} = options;

	const actualWidth = responsive ? 800 : (typeof width === 'number' ? width : 800);
	const chartWidth = actualWidth - margins.left - margins.right;
	const chartHeight = height - margins.top - margins.bottom;

	const { svg, chartGroup } = createSVG(container, width, height, margins, responsive);

	const x = d3.scalePoint()
		.domain(data.map(d => d.label))
		.range([0, chartWidth])
		.padding(0.5);

	const y = d3.scaleLinear()
		.domain([0, d3.max(data, d => d.value)])
		.nice()
		.range([chartHeight, 0]);

	// Add grid lines
	if (showGridLines) {
		chartGroup.append('g')
			.attr('class', 'grid')
			.selectAll('line')
			.data(y.ticks())
			.join('line')
			.attr('x1', 0)
			.attr('x2', chartWidth)
			.attr('y1', d => y(d))
			.attr('y2', d => y(d))
			.attr('stroke', '#e5e7eb')
			.attr('stroke-dasharray', '2,2');
	}

	// Create area generator
	const area = d3.area()
		.x(d => x(d.label))
		.y0(chartHeight)
		.y1(d => y(d.value))
		.curve(d3.curveMonotoneX);

	// Add area path
	const path = chartGroup.append('path')
		.datum(data)
		.attr('class', 'area')
		.attr('fill', colors[0])
		.attr('fill-opacity', 0.3)
		.attr('stroke', colors[0])
		.attr('stroke-width', 2)
		.attr('d', area);

	if (enableAnimations) {
		path.attr('opacity', 0)
			.transition()
			.duration(animationDuration)
			.ease(d3[easingFunction] || d3.easeQuadInOut)
			.attr('opacity', 1);
	}

	// Add dots
	const dots = chartGroup.selectAll('.dot')
		.data(data)
		.join('circle')
		.attr('class', 'dot')
		.attr('cx', d => x(d.label))
		.attr('cy', d => y(d.value))
		.attr('r', 4)
		.attr('fill', colors[0])
		.attr('stroke', '#fff')
		.attr('stroke-width', 2);

	if (enableAnimations) {
		dots.attr('r', 0)
			.transition()
			.delay((d, i) => i * (animationDuration / data.length))
			.duration(200)
			.attr('r', 4);
	}

	// Add axes
	if (showXAxis) {
		chartGroup.append('g')
			.attr('class', 'x-axis')
			.attr('transform', `translate(0,${chartHeight})`)
			.call(d3.axisBottom(x));

		if (xAxisLabel) {
			chartGroup.append('text')
				.attr('class', 'x-axis-label')
				.attr('text-anchor', 'middle')
				.attr('x', chartWidth / 2)
				.attr('y', chartHeight + 40)
				.attr('fill', '#374151')
				.text(xAxisLabel);
		}
	}

	if (showYAxis) {
		chartGroup.append('g')
			.attr('class', 'y-axis')
			.call(d3.axisLeft(y));

		if (yAxisLabel) {
			chartGroup.append('text')
				.attr('class', 'y-axis-label')
				.attr('text-anchor', 'middle')
				.attr('transform', 'rotate(-90)')
				.attr('x', -chartHeight / 2)
				.attr('y', -45)
				.attr('fill', '#374151')
				.text(yAxisLabel);
		}
	}

	// Add tooltips
	if (showTooltips) {
		const tooltip = createTooltip(container);

		dots.on('mouseover', function(event, d) {
			d3.select(this).attr('r', 6);
			tooltip.transition()
				.duration(200)
				.style('opacity', 0.9);
			tooltip.html(`<strong>${d.label}</strong><br/>Value: ${d.value}`)
				.style('left', (event.pageX + 10) + 'px')
				.style('top', (event.pageY - 28) + 'px');
		})
		.on('mouseout', function() {
			d3.select(this).attr('r', 4);
			tooltip.transition()
				.duration(500)
				.style('opacity', 0);
		});
	}
}

/**
 * Render Scatter Plot
 */
export function renderScatterPlot(container, data, options) {
	const {
		width = 800,
		height = 400,
		margins = { top: 20, right: 20, bottom: 50, left: 60 },
		colors = COLOR_SCHEMES.blue,
		showDataLabels = false,
		showXAxis = true,
		showYAxis = true,
		xAxisLabel = '',
		yAxisLabel = '',
		showGridLines = true,
		enableAnimations = true,
		animationDuration = 800,
		easingFunction = 'easeQuadInOut',
		showTooltips = true,
		responsive = true
	} = options;

	const actualWidth = responsive ? 800 : (typeof width === 'number' ? width : 800);
	const chartWidth = actualWidth - margins.left - margins.right;
	const chartHeight = height - margins.top - margins.bottom;

	const { svg, chartGroup } = createSVG(container, width, height, margins, responsive);

	// For scatter plot, we'll use value as y and create x based on index
	const x = d3.scaleLinear()
		.domain([0, data.length - 1])
		.range([0, chartWidth]);

	const y = d3.scaleLinear()
		.domain([0, d3.max(data, d => d.value)])
		.nice()
		.range([chartHeight, 0]);

	// Add grid lines
	if (showGridLines) {
		chartGroup.append('g')
			.attr('class', 'grid')
			.selectAll('line.horizontal')
			.data(y.ticks())
			.join('line')
			.attr('class', 'horizontal')
			.attr('x1', 0)
			.attr('x2', chartWidth)
			.attr('y1', d => y(d))
			.attr('y2', d => y(d))
			.attr('stroke', '#e5e7eb')
			.attr('stroke-dasharray', '2,2');
	}

	// Add dots
	const dots = chartGroup.selectAll('.dot')
		.data(data)
		.join('circle')
		.attr('class', 'dot')
		.attr('cx', (d, i) => x(i))
		.attr('cy', d => y(d.value))
		.attr('fill', (d, i) => colors[i % colors.length])
		.attr('stroke', '#fff')
		.attr('stroke-width', 2);

	if (enableAnimations) {
		dots.attr('r', 0)
			.transition()
			.delay((d, i) => i * (animationDuration / data.length))
			.duration(200)
			.ease(d3[easingFunction] || d3.easeQuadInOut)
			.attr('r', 6);
	} else {
		dots.attr('r', 6);
	}

	// Add axes
	if (showXAxis) {
		const xAxis = d3.axisBottom(x)
			.tickFormat((d, i) => data[d] ? data[d].label : '');

		chartGroup.append('g')
			.attr('class', 'x-axis')
			.attr('transform', `translate(0,${chartHeight})`)
			.call(xAxis);

		if (xAxisLabel) {
			chartGroup.append('text')
				.attr('class', 'x-axis-label')
				.attr('text-anchor', 'middle')
				.attr('x', chartWidth / 2)
				.attr('y', chartHeight + 40)
				.attr('fill', '#374151')
				.text(xAxisLabel);
		}
	}

	if (showYAxis) {
		chartGroup.append('g')
			.attr('class', 'y-axis')
			.call(d3.axisLeft(y));

		if (yAxisLabel) {
			chartGroup.append('text')
				.attr('class', 'y-axis-label')
				.attr('text-anchor', 'middle')
				.attr('transform', 'rotate(-90)')
				.attr('x', -chartHeight / 2)
				.attr('y', -45)
				.attr('fill', '#374151')
				.text(yAxisLabel);
		}
	}

	// Add tooltips
	if (showTooltips) {
		const tooltip = createTooltip(container);

		dots.on('mouseover', function(event, d) {
			d3.select(this).attr('r', 8);
			tooltip.transition()
				.duration(200)
				.style('opacity', 0.9);
			tooltip.html(`<strong>${d.label}</strong><br/>Value: ${d.value}`)
				.style('left', (event.pageX + 10) + 'px')
				.style('top', (event.pageY - 28) + 'px');
		})
		.on('mouseout', function() {
			d3.select(this).attr('r', 6);
			tooltip.transition()
				.duration(500)
				.style('opacity', 0);
		});
	}
}

/**
 * Main render function that routes to appropriate chart type
 */
export function renderChart(container, chartType, data, options) {
	if (!data || data.length === 0) {
		d3.select(container).html('<div class="chart-placeholder">No data available. Please add data in the block settings.</div>');
		return;
	}

	switch (chartType) {
		case 'bar':
			renderBarChart(container, data, options);
			break;
		case 'line':
			renderLineChart(container, data, options);
			break;
		case 'pie':
			renderPieChart(container, data, options);
			break;
		case 'donut':
			renderDonutChart(container, data, options);
			break;
		case 'area':
			renderAreaChart(container, data, options);
			break;
		case 'scatter':
			renderScatterPlot(container, data, options);
			break;
		default:
			renderBarChart(container, data, options);
	}
}
