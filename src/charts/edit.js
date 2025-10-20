/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	ToggleControl,
	TextControl,
	SelectControl,
	RangeControl,
	Button,
	ColorPicker,
	BaseControl,
	TextareaControl
} from '@wordpress/components';
import { useEffect, useRef, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { renderChart, getChartColors, COLOR_SCHEMES } from './chart-utils';
import './editor.scss';
import SupportCard from '../components/SupportCard';

/**
 * Edit component for Charts block.
 *
 * @param {Object} props - Component props.
 * @param {Object} props.attributes - Block attributes.
 * @param {Function} props.setAttributes - Function to update attributes.
 * @return {JSX.Element} Block edit component.
 */
export default function Edit({ attributes, setAttributes }) {
	const {
		blockId,
		chartType,
		orientation,
		chartData,
		chartWidth,
		chartHeight,
		marginTop,
		marginRight,
		marginBottom,
		marginLeft,
		responsive,
		colorScheme,
		customColors,
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
		chartTitle,
		chartDescription
	} = attributes;

	const chartRef = useRef(null);
	const [editingRow, setEditingRow] = useState(null);

	const blockProps = useBlockProps({
		className: 'prolific-chart-block'
	});

	// Set block ID
	useEffect(() => {
		if (!blockId) {
			setAttributes({ blockId: blockProps.id });
		}
	}, [blockId, blockProps.id, setAttributes]);

	// Render chart whenever attributes change
	useEffect(() => {
		if (chartRef.current && chartData && chartData.length > 0) {
			const colors = getChartColors(colorScheme, customColors, chartData.length);
			const margins = {
				top: marginTop,
				right: marginRight,
				bottom: marginBottom,
				left: marginLeft
			};

			const options = {
				width: chartWidth,
				height: chartHeight,
				margins,
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

			renderChart(chartRef.current, chartType, chartData, options);
		}
	}, [
		chartType,
		orientation,
		chartData,
		chartWidth,
		chartHeight,
		marginTop,
		marginRight,
		marginBottom,
		marginLeft,
		responsive,
		colorScheme,
		customColors,
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
		showTooltips
	]);

	// Add new data row
	const addDataRow = () => {
		const newData = [...chartData, { label: 'New', value: 0 }];
		setAttributes({ chartData: newData });
	};

	// Remove data row
	const removeDataRow = (index) => {
		if (chartData.length > 1) {
			const newData = chartData.filter((_, i) => i !== index);
			setAttributes({ chartData: newData });
		}
	};

	// Update data row
	const updateDataRow = (index, field, value) => {
		const newData = [...chartData];
		newData[index] = {
			...newData[index],
			[field]: field === 'value' ? parseFloat(value) || 0 : value
		};
		setAttributes({ chartData: newData });
	};

	// Import JSON data
	const importJSONData = (jsonString) => {
		try {
			const data = JSON.parse(jsonString);
			if (Array.isArray(data) && data.length > 0 && data[0].label && typeof data[0].value === 'number') {
				setAttributes({ chartData: data });
			} else {
				alert(__('Invalid JSON format. Expected array of objects with "label" and "value" properties.', 'prolific-blocks'));
			}
		} catch (e) {
			alert(__('Invalid JSON format.', 'prolific-blocks'));
		}
	};

	return (
		<>
			<div {...blockProps}>
				{chartTitle && (
					<h3 className="chart-title">{chartTitle}</h3>
				)}
				{chartDescription && (
					<p className="chart-description">{chartDescription}</p>
				)}
				<div className="chart-container" ref={chartRef} style={{ position: 'relative' }}></div>
			</div>

			<InspectorControls>
				<SupportCard />
				<PanelBody title={__('Chart Type', 'prolific-blocks')} initialOpen={true}>
					<SelectControl
						label={__('Chart Type', 'prolific-blocks')}
						value={chartType}
						options={[
							{ label: __('Bar Chart', 'prolific-blocks'), value: 'bar' },
							{ label: __('Line Chart', 'prolific-blocks'), value: 'line' },
							{ label: __('Pie Chart', 'prolific-blocks'), value: 'pie' },
							{ label: __('Donut Chart', 'prolific-blocks'), value: 'donut' },
							{ label: __('Area Chart', 'prolific-blocks'), value: 'area' },
							{ label: __('Scatter Plot', 'prolific-blocks'), value: 'scatter' }
						]}
						onChange={(value) => setAttributes({ chartType: value })}
					/>
					{chartType === 'bar' && (
						<SelectControl
							label={__('Orientation', 'prolific-blocks')}
							value={orientation}
							options={[
								{ label: __('Vertical', 'prolific-blocks'), value: 'vertical' },
								{ label: __('Horizontal', 'prolific-blocks'), value: 'horizontal' }
							]}
							onChange={(value) => setAttributes({ orientation: value })}
						/>
					)}
				</PanelBody>

				<PanelBody title={__('Chart Data', 'prolific-blocks')} initialOpen={true}>
					<div className="chart-data-table">
						<div className="data-table-header">
							<span>{__('Label', 'prolific-blocks')}</span>
							<span>{__('Value', 'prolific-blocks')}</span>
							<span></span>
						</div>
						{chartData.map((row, index) => (
							<div key={index} className="data-table-row">
								<TextControl
									value={row.label}
									onChange={(value) => updateDataRow(index, 'label', value)}
									placeholder={__('Label', 'prolific-blocks')}
								/>
								<TextControl
									type="number"
									value={row.value}
									onChange={(value) => updateDataRow(index, 'value', value)}
									placeholder={__('Value', 'prolific-blocks')}
								/>
								<Button
									isDestructive
									isSmall
									icon="trash"
									onClick={() => removeDataRow(index)}
									disabled={chartData.length === 1}
									label={__('Remove row', 'prolific-blocks')}
								/>
							</div>
						))}
					</div>
					<Button
						isPrimary
						onClick={addDataRow}
						style={{ marginTop: '10px' }}
					>
						{__('Add Data Row', 'prolific-blocks')}
					</Button>

					<BaseControl
						label={__('Import JSON Data', 'prolific-blocks')}
						help={__('Paste JSON array with label and value properties', 'prolific-blocks')}
						style={{ marginTop: '20px' }}
					>
						<TextareaControl
							placeholder={__('[{"label":"Jan","value":30},{"label":"Feb","value":45}]', 'prolific-blocks')}
							onChange={(value) => {
								if (value) importJSONData(value);
							}}
						/>
					</BaseControl>
				</PanelBody>

				<PanelBody title={__('Chart Settings', 'prolific-blocks')} initialOpen={false}>
					<TextControl
						label={__('Chart Title', 'prolific-blocks')}
						value={chartTitle}
						onChange={(value) => setAttributes({ chartTitle: value })}
					/>
					<TextControl
						label={__('Chart Description', 'prolific-blocks')}
						value={chartDescription}
						onChange={(value) => setAttributes({ chartDescription: value })}
					/>
					<hr />
					<TextControl
						label={__('Width', 'prolific-blocks')}
						help={__('Use px, %, or "auto"', 'prolific-blocks')}
						value={chartWidth}
						onChange={(value) => setAttributes({ chartWidth: value })}
					/>
					<RangeControl
						label={__('Height (px)', 'prolific-blocks')}
						value={chartHeight}
						onChange={(value) => setAttributes({ chartHeight: value })}
						min={200}
						max={800}
					/>
					<ToggleControl
						label={__('Responsive', 'prolific-blocks')}
						help={__('Make chart responsive to container width', 'prolific-blocks')}
						checked={responsive}
						onChange={(value) => setAttributes({ responsive: value })}
					/>
					<hr />
					<BaseControl label={__('Margins', 'prolific-blocks')}>
						<RangeControl
							label={__('Top', 'prolific-blocks')}
							value={marginTop}
							onChange={(value) => setAttributes({ marginTop: value })}
							min={0}
							max={100}
						/>
						<RangeControl
							label={__('Right', 'prolific-blocks')}
							value={marginRight}
							onChange={(value) => setAttributes({ marginRight: value })}
							min={0}
							max={100}
						/>
						<RangeControl
							label={__('Bottom', 'prolific-blocks')}
							value={marginBottom}
							onChange={(value) => setAttributes({ marginBottom: value })}
							min={0}
							max={100}
						/>
						<RangeControl
							label={__('Left', 'prolific-blocks')}
							value={marginLeft}
							onChange={(value) => setAttributes({ marginLeft: value })}
							min={0}
							max={100}
						/>
					</BaseControl>
				</PanelBody>

				<PanelBody title={__('Style', 'prolific-blocks')} initialOpen={false}>
					<SelectControl
						label={__('Color Scheme', 'prolific-blocks')}
						value={colorScheme}
						options={[
							{ label: __('Blue', 'prolific-blocks'), value: 'blue' },
							{ label: __('Green', 'prolific-blocks'), value: 'green' },
							{ label: __('Purple', 'prolific-blocks'), value: 'purple' },
							{ label: __('Orange', 'prolific-blocks'), value: 'orange' },
							{ label: __('Red', 'prolific-blocks'), value: 'red' },
							{ label: __('Teal', 'prolific-blocks'), value: 'teal' },
							{ label: __('Gradient', 'prolific-blocks'), value: 'gradient' },
							{ label: __('Custom', 'prolific-blocks'), value: 'custom' }
						]}
						onChange={(value) => setAttributes({ colorScheme: value })}
					/>
					{colorScheme === 'custom' && chartData && chartData.length > 0 && (
						<div className="chart-custom-colors">
							<BaseControl label={__('Custom Colors', 'prolific-blocks')}>
								{chartData.map((item, index) => (
									<div key={index} className="chart-color-picker-row">
										<span className="chart-color-label">
											{item.label || `Data ${index + 1}`}
										</span>
										<ColorPicker
											color={customColors[index] || '#2196f3'}
											onChangeComplete={(color) => {
												const newColors = [...customColors];
												newColors[index] = color.hex;
												setAttributes({ customColors: newColors });
											}}
											disableAlpha
										/>
									</div>
								))}
							</BaseControl>
						</div>
					)}
					<ToggleControl
						label={__('Show Data Labels', 'prolific-blocks')}
						checked={showDataLabels}
						onChange={(value) => setAttributes({ showDataLabels: value })}
					/>
					{(chartType === 'pie' || chartType === 'donut') && (
						<>
							<ToggleControl
								label={__('Show Legend', 'prolific-blocks')}
								checked={showLegend}
								onChange={(value) => setAttributes({ showLegend: value })}
							/>
							{showLegend && (
								<SelectControl
									label={__('Legend Position', 'prolific-blocks')}
									value={legendPosition}
									options={[
										{ label: __('Top', 'prolific-blocks'), value: 'top' },
										{ label: __('Bottom', 'prolific-blocks'), value: 'bottom' },
										{ label: __('Left', 'prolific-blocks'), value: 'left' },
										{ label: __('Right', 'prolific-blocks'), value: 'right' }
									]}
									onChange={(value) => setAttributes({ legendPosition: value })}
								/>
							)}
						</>
					)}
					<RangeControl
						label={__('Font Size', 'prolific-blocks')}
						value={fontSize}
						onChange={(value) => setAttributes({ fontSize: value })}
						min={8}
						max={24}
					/>
				</PanelBody>

				{(chartType === 'bar' || chartType === 'line' || chartType === 'area' || chartType === 'scatter') && (
					<PanelBody title={__('Axes', 'prolific-blocks')} initialOpen={false}>
						<ToggleControl
							label={__('Show X Axis', 'prolific-blocks')}
							checked={showXAxis}
							onChange={(value) => setAttributes({ showXAxis: value })}
						/>
						{showXAxis && (
							<TextControl
								label={__('X Axis Label', 'prolific-blocks')}
								value={xAxisLabel}
								onChange={(value) => setAttributes({ xAxisLabel: value })}
							/>
						)}
						<ToggleControl
							label={__('Show Y Axis', 'prolific-blocks')}
							checked={showYAxis}
							onChange={(value) => setAttributes({ showYAxis: value })}
						/>
						{showYAxis && (
							<TextControl
								label={__('Y Axis Label', 'prolific-blocks')}
								value={yAxisLabel}
								onChange={(value) => setAttributes({ yAxisLabel: value })}
							/>
						)}
						<ToggleControl
							label={__('Show Grid Lines', 'prolific-blocks')}
							checked={showGridLines}
							onChange={(value) => setAttributes({ showGridLines: value })}
						/>
					</PanelBody>
				)}

				<PanelBody title={__('Animation', 'prolific-blocks')} initialOpen={false}>
					<ToggleControl
						label={__('Enable Animations', 'prolific-blocks')}
						checked={enableAnimations}
						onChange={(value) => setAttributes({ enableAnimations: value })}
					/>
					{enableAnimations && (
						<>
							<RangeControl
								label={__('Animation Duration (ms)', 'prolific-blocks')}
								value={animationDuration}
								onChange={(value) => setAttributes({ animationDuration: value })}
								min={100}
								max={2000}
								step={100}
							/>
							<SelectControl
								label={__('Easing Function', 'prolific-blocks')}
								value={easingFunction}
								options={[
									{ label: __('Quad In Out', 'prolific-blocks'), value: 'easeQuadInOut' },
									{ label: __('Linear', 'prolific-blocks'), value: 'easeLinear' },
									{ label: __('Cubic In Out', 'prolific-blocks'), value: 'easeCubicInOut' },
									{ label: __('Sin In Out', 'prolific-blocks'), value: 'easeSinInOut' },
									{ label: __('Elastic Out', 'prolific-blocks'), value: 'easeElasticOut' },
									{ label: __('Bounce Out', 'prolific-blocks'), value: 'easeBounceOut' }
								]}
								onChange={(value) => setAttributes({ easingFunction: value })}
							/>
						</>
					)}
					<ToggleControl
						label={__('Show Tooltips', 'prolific-blocks')}
						checked={showTooltips}
						onChange={(value) => setAttributes({ showTooltips: value })}
					/>
				</PanelBody>
			</InspectorControls>
		</>
	);
}
