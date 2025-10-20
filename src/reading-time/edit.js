/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	RangeControl,
	SelectControl,
	ToggleControl,
	TextControl
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { store as editorStore } from '@wordpress/editor';

/**
 * Internal dependencies
 *
 * Icon paths for reading time block
 */
const iconPaths = {
	'book': 'M96 0C43 0 0 43 0 96V416c0 53 43 96 96 96H384h32c17.7 0 32-14.3 32-32s-14.3-32-32-32V384c17.7 0 32-14.3 32-32V32c0-17.7-14.3-32-32-32H384 96zm0 384H352v64H96c-17.7 0-32-14.3-32-32s14.3-32 32-32zm32-240c0-8.8 7.2-16 16-16H336c8.8 0 16 7.2 16 16s-7.2 16-16 16H144c-8.8 0-16-7.2-16-16zm16 48H336c8.8 0 16 7.2 16 16s-7.2 16-16 16H144c-8.8 0-16-7.2-16-16s7.2-16 16-16z',
	'clock': 'M256 0a256 256 0 1 1 0 512A256 256 0 1 1 256 0zM232 120V256c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2V120c0-13.3-10.7-24-24-24s-24 10.7-24 24z',
	'visibility': 'M288 80c-65.2 0-118.8 29.6-159.9 67.7C89.6 183.5 63 226 49.4 256c13.6 30 40.2 72.5 78.6 108.3C169.2 402.4 222.8 432 288 432s118.8-29.6 159.9-67.7C486.4 328.5 513 286 526.6 256c-13.6-30-40.2-72.5-78.6-108.3C406.8 109.6 353.2 80 288 80zM95.4 112.6C142.5 68.8 207.2 32 288 32s145.5 36.8 192.6 80.6c46.8 43.5 78.1 95.4 93 131.1c3.3 7.9 3.3 16.7 0 24.6c-14.9 35.7-46.2 87.7-93 131.1C433.5 443.2 368.8 480 288 480s-145.5-36.8-192.6-80.6C48.6 356 17.3 304 2.5 268.3c-3.3-7.9-3.3-16.7 0-24.6C17.3 208 48.6 156 95.4 112.6zM288 336c44.2 0 80-35.8 80-80s-35.8-80-80-80c-.7 0-1.3 0-2 0c1.3 5.1 2 10.5 2 16c0 35.3-28.7 64-64 64c-5.5 0-10.9-.7-16-2c0 .7 0 1.3 0 2c0 44.2 35.8 80 80 80zm0-208a128 128 0 1 1 0 256 128 128 0 1 1 0-256z'
};

/**
 * Editor styles
 */
import './editor.scss';
import SupportCard from '../components/SupportCard';

/**
 * Calculate reading time from content
 *
 * @param {string} content - Post content.
 * @param {number} wpm - Words per minute.
 * @param {boolean} includeImages - Whether to include images.
 * @param {number} secondsPerImage - Seconds to add per image.
 * @param {string} roundingMethod - Rounding method (round, ceil, floor).
 * @return {number} Reading time in minutes.
 */
function calculateReadingTime(content, wpm, includeImages, secondsPerImage, roundingMethod) {
	if (!content) return 0;

	// Strip HTML tags and shortcodes
	let text = content.replace(/<[^>]+>/g, ' ');
	text = text.replace(/\[.*?\]/g, '');

	// Count words
	const words = text.trim().split(/\s+/).length;

	// Calculate base reading time
	let timeInMinutes = words / wpm;

	// Add time for images if enabled
	if (includeImages) {
		const imageMatches = content.match(/<img/g);
		const imageCount = imageMatches ? imageMatches.length : 0;
		timeInMinutes += (imageCount * secondsPerImage) / 60;
	}

	// Apply rounding method
	switch (roundingMethod) {
		case 'ceil':
			return Math.ceil(timeInMinutes);
		case 'floor':
			return Math.floor(timeInMinutes);
		case 'round':
		default:
			return Math.round(timeInMinutes);
	}
}

/**
 * Format reading time display
 *
 * @param {number} time - Reading time in minutes.
 * @param {string} format - Display format.
 * @param {string} customFormat - Custom format string.
 * @return {string} Formatted reading time.
 */
function formatReadingTime(time, format, customFormat) {
	if (format === 'custom') {
		return customFormat.replace('{time}', time);
	}

	const formats = {
		'X min read': `${time} min read`,
		'X minute read': `${time} minute read`,
		'X minutes': `${time} ${time === 1 ? 'minute' : 'minutes'}`
	};

	return formats[format] || formats['X min read'];
}

/**
 * Edit component for Reading Time block.
 *
 * @param {Object} props - Component props.
 * @param {Object} props.attributes - Block attributes.
 * @param {Function} props.setAttributes - Function to update attributes.
 * @return {JSX.Element} Block edit component.
 */
export default function Edit({ attributes, setAttributes }) {
	const {
		wordsPerMinute,
		displayFormat,
		customFormat,
		includeImages,
		secondsPerImage,
		roundingMethod,
		prefixText,
		suffixText,
		showIcon,
		iconType,
		minimumTime
	} = attributes;

	const blockProps = useBlockProps();

	// Set block ID
	setAttributes({ blockId: blockProps.id });

	// Get post content from editor
	const postContent = useSelect((select) => {
		const editor = select(editorStore);
		return editor ? editor.getEditedPostContent() : '';
	}, []);

	// Calculate reading time
	const readingTime = calculateReadingTime(
		postContent,
		wordsPerMinute,
		includeImages,
		secondsPerImage,
		roundingMethod
	);

	// Format display text
	const displayText = formatReadingTime(readingTime, displayFormat, customFormat);

	// Check if should display based on minimum time
	const shouldDisplay = readingTime >= minimumTime;

	// Get icon path
	const iconPath = iconPaths[iconType] || iconPaths['book'];

	// Get the correct viewBox for the icon
	// Eye icon uses 576x512, others use 512x512
	const viewBox = iconType === 'visibility' ? '0 0 576 512' : '0 0 512 512';

	return (
		<>
			<div {...blockProps}>
				{shouldDisplay ? (
					<div className="reading-time-display">
						{showIcon && (
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox={viewBox}
								className="reading-time-icon"
								aria-hidden="true"
							>
								<path d={iconPath} />
							</svg>
						)}
						<span className="reading-time-text">
							{prefixText && <span className="reading-time-prefix">{prefixText} </span>}
							{displayText}
							{suffixText && <span className="reading-time-suffix"> {suffixText}</span>}
						</span>
					</div>
				) : (
					<div className="reading-time-notice">
						{__('Reading time hidden (below minimum threshold)', 'prolific-blocks')}
					</div>
				)}
			</div>

			<InspectorControls>
				<SupportCard />
				<PanelBody title={__('Calculation Settings', 'prolific-blocks')} initialOpen={true}>
					<RangeControl
						label={__('Words Per Minute', 'prolific-blocks')}
						help={__('Average reading speed (200 is standard)', 'prolific-blocks')}
						value={wordsPerMinute}
						onChange={(value) => setAttributes({ wordsPerMinute: value })}
						min={100}
						max={300}
						step={10}
					/>
					<ToggleControl
						label={__('Include Images in Calculation', 'prolific-blocks')}
						help={__('Add extra time for viewing images', 'prolific-blocks')}
						checked={includeImages}
						onChange={(value) => setAttributes({ includeImages: value })}
					/>
					{includeImages && (
						<RangeControl
							label={__('Seconds Per Image', 'prolific-blocks')}
							value={secondsPerImage}
							onChange={(value) => setAttributes({ secondsPerImage: value })}
							min={5}
							max={30}
							step={1}
						/>
					)}
					<SelectControl
						label={__('Rounding Method', 'prolific-blocks')}
						value={roundingMethod}
						options={[
							{ label: __('Round to nearest', 'prolific-blocks'), value: 'round' },
							{ label: __('Round up (ceiling)', 'prolific-blocks'), value: 'ceil' },
							{ label: __('Round down (floor)', 'prolific-blocks'), value: 'floor' }
						]}
						onChange={(value) => setAttributes({ roundingMethod: value })}
					/>
					<RangeControl
						label={__('Minimum Time to Display', 'prolific-blocks')}
						help={__('Hide if reading time is below this (0 = always show)', 'prolific-blocks')}
						value={minimumTime}
						onChange={(value) => setAttributes({ minimumTime: value })}
						min={0}
						max={10}
						step={1}
					/>
				</PanelBody>

				<PanelBody title={__('Display Options', 'prolific-blocks')} initialOpen={true}>
					<SelectControl
						label={__('Display Format', 'prolific-blocks')}
						value={displayFormat}
						options={[
							{ label: __('X min read', 'prolific-blocks'), value: 'X min read' },
							{ label: __('X minute read', 'prolific-blocks'), value: 'X minute read' },
							{ label: __('X minutes', 'prolific-blocks'), value: 'X minutes' },
							{ label: __('Custom', 'prolific-blocks'), value: 'custom' }
						]}
						onChange={(value) => setAttributes({ displayFormat: value })}
					/>
					{displayFormat === 'custom' && (
						<TextControl
							label={__('Custom Format', 'prolific-blocks')}
							help={__('Use {time} as placeholder for the reading time', 'prolific-blocks')}
							value={customFormat}
							onChange={(value) => setAttributes({ customFormat: value })}
							placeholder="Reading time: {time} minutes"
						/>
					)}
					<hr />
					<TextControl
						label={__('Prefix Text', 'prolific-blocks')}
						help={__('Text to display before the reading time', 'prolific-blocks')}
						value={prefixText}
						onChange={(value) => setAttributes({ prefixText: value })}
					/>
					<TextControl
						label={__('Suffix Text', 'prolific-blocks')}
						help={__('Text to display after the reading time', 'prolific-blocks')}
						value={suffixText}
						onChange={(value) => setAttributes({ suffixText: value })}
					/>
				</PanelBody>

				<PanelBody title={__('Icon Settings', 'prolific-blocks')} initialOpen={false}>
					<ToggleControl
						label={__('Show Icon', 'prolific-blocks')}
						checked={showIcon}
						onChange={(value) => setAttributes({ showIcon: value })}
					/>
					{showIcon && (
						<SelectControl
							label={__('Icon Type', 'prolific-blocks')}
							value={iconType}
							options={[
								{ label: __('Book', 'prolific-blocks'), value: 'book' },
								{ label: __('Clock', 'prolific-blocks'), value: 'clock' },
								{ label: __('Eye (Visibility)', 'prolific-blocks'), value: 'visibility' }
							]}
							onChange={(value) => setAttributes({ iconType: value })}
						/>
					)}
				</PanelBody>
			</InspectorControls>
		</>
	);
}
