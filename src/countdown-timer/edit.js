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
	__experimentalInputControl as InputControl
} from '@wordpress/components';

/**
 * Editor styles
 */
import './editor.scss';

/**
 * Edit component for Countdown Timer block.
 *
 * @param {Object} props - Component props.
 * @param {Object} props.attributes - Block attributes.
 * @param {Function} props.setAttributes - Function to update attributes.
 * @return {JSX.Element} Block edit component.
 */
export default function Edit({ attributes, setAttributes }) {
	const {
		targetDate,
		targetTime,
		showDays,
		showHours,
		showMinutes,
		showSeconds,
		labelDays,
		labelDay,
		labelHours,
		labelHour,
		labelMinutes,
		labelMinute,
		labelSeconds,
		labelSecond,
		expiredMessage,
		autoHide,
		leadingZeros,
		separator,
		size,
		evergreenMode,
		evergreenHours
	} = attributes;

	const blockProps = useBlockProps({
		className: `countdown-size-${size}`
	});

	// Set block ID
	setAttributes({ blockId: blockProps.id });

	// Get separator symbol
	const getSeparatorSymbol = (type) => {
		const separators = {
			'colon': ':',
			'dash': '-',
			'dot': '·',
			'slash': '/',
			'none': ''
		};
		return separators[type] || ':';
	};

	const separatorSymbol = getSeparatorSymbol(separator);

	// Format number with leading zeros if enabled
	const formatNumber = (num) => {
		return leadingZeros ? String(num).padStart(2, '0') : String(num);
	};

	// Calculate preview countdown (showing example values)
	const previewDays = 5;
	const previewHours = 12;
	const previewMinutes = 34;
	const previewSeconds = 56;

	return (
		<>
			<div {...blockProps}>
				<div className="countdown-timer-preview">
					{evergreenMode && (
						<div className="countdown-evergreen-notice">
							{__('Evergreen Mode: Timer resets for each visitor', 'prolific-blocks')}
						</div>
					)}
					<div className="countdown-container">
						{showDays && (
							<div className="countdown-unit">
								<span className="countdown-number">{formatNumber(previewDays)}</span>
								{separator !== 'none' && showHours && (
									<span className="countdown-separator">{separatorSymbol}</span>
								)}
								<span className="countdown-label">
									{previewDays === 1 ? labelDay : labelDays}
								</span>
							</div>
						)}
						{showHours && (
							<div className="countdown-unit">
								<span className="countdown-number">{formatNumber(previewHours)}</span>
								{separator !== 'none' && showMinutes && (
									<span className="countdown-separator">{separatorSymbol}</span>
								)}
								<span className="countdown-label">
									{previewHours === 1 ? labelHour : labelHours}
								</span>
							</div>
						)}
						{showMinutes && (
							<div className="countdown-unit">
								<span className="countdown-number">{formatNumber(previewMinutes)}</span>
								{separator !== 'none' && showSeconds && (
									<span className="countdown-separator">{separatorSymbol}</span>
								)}
								<span className="countdown-label">
									{previewMinutes === 1 ? labelMinute : labelMinutes}
								</span>
							</div>
						)}
						{showSeconds && (
							<div className="countdown-unit">
								<span className="countdown-number">{formatNumber(previewSeconds)}</span>
								<span className="countdown-label">
									{previewSeconds === 1 ? labelSecond : labelSeconds}
								</span>
							</div>
						)}
					</div>
					{!targetDate && !evergreenMode && (
						<div className="countdown-notice">
							{__('Please set a target date in the block settings', 'prolific-blocks')}
						</div>
					)}
				</div>
			</div>

			<InspectorControls>
				<PanelBody title={__('Date & Time', 'prolific-blocks')} initialOpen={true}>
					<ToggleControl
						label={__('Evergreen Mode', 'prolific-blocks')}
						help={__('Timer resets for each visitor using their local storage', 'prolific-blocks')}
						checked={evergreenMode}
						onChange={(value) => setAttributes({ evergreenMode: value })}
					/>
					{evergreenMode ? (
						<RangeControl
							label={__('Countdown Hours', 'prolific-blocks')}
							help={__('Number of hours for evergreen countdown', 'prolific-blocks')}
							value={evergreenHours}
							onChange={(value) => setAttributes({ evergreenHours: value })}
							min={1}
							max={168}
						/>
					) : (
						<>
							<TextControl
								label={__('Target Date', 'prolific-blocks')}
								help={__('Format: YYYY-MM-DD', 'prolific-blocks')}
								type="date"
								value={targetDate}
								onChange={(value) => setAttributes({ targetDate: value })}
							/>
							<TextControl
								label={__('Target Time', 'prolific-blocks')}
								help={__('Format: HH:MM (24-hour)', 'prolific-blocks')}
								type="time"
								value={targetTime}
								onChange={(value) => setAttributes({ targetTime: value })}
							/>
						</>
					)}
				</PanelBody>

				<PanelBody title={__('Display Options', 'prolific-blocks')} initialOpen={false}>
					<ToggleControl
						label={__('Show Days', 'prolific-blocks')}
						checked={showDays}
						onChange={(value) => setAttributes({ showDays: value })}
					/>
					<ToggleControl
						label={__('Show Hours', 'prolific-blocks')}
						checked={showHours}
						onChange={(value) => setAttributes({ showHours: value })}
					/>
					<ToggleControl
						label={__('Show Minutes', 'prolific-blocks')}
						checked={showMinutes}
						onChange={(value) => setAttributes({ showMinutes: value })}
					/>
					<ToggleControl
						label={__('Show Seconds', 'prolific-blocks')}
						checked={showSeconds}
						onChange={(value) => setAttributes({ showSeconds: value })}
					/>
					<hr />
					<ToggleControl
						label={__('Leading Zeros', 'prolific-blocks')}
						help={__('Display numbers with leading zeros (e.g., 05 instead of 5)', 'prolific-blocks')}
						checked={leadingZeros}
						onChange={(value) => setAttributes({ leadingZeros: value })}
					/>
					<SelectControl
						label={__('Separator Style', 'prolific-blocks')}
						value={separator}
						options={[
							{ label: __('Colon (:)', 'prolific-blocks'), value: 'colon' },
							{ label: __('Dash (-)', 'prolific-blocks'), value: 'dash' },
							{ label: __('Dot (·)', 'prolific-blocks'), value: 'dot' },
							{ label: __('Slash (/)', 'prolific-blocks'), value: 'slash' },
							{ label: __('None', 'prolific-blocks'), value: 'none' }
						]}
						onChange={(value) => setAttributes({ separator: value })}
					/>
				</PanelBody>

				<PanelBody title={__('Labels', 'prolific-blocks')} initialOpen={false}>
					<TextControl
						label={__('Days Label (Plural)', 'prolific-blocks')}
						value={labelDays}
						onChange={(value) => setAttributes({ labelDays: value })}
					/>
					<TextControl
						label={__('Day Label (Singular)', 'prolific-blocks')}
						value={labelDay}
						onChange={(value) => setAttributes({ labelDay: value })}
					/>
					<hr />
					<TextControl
						label={__('Hours Label (Plural)', 'prolific-blocks')}
						value={labelHours}
						onChange={(value) => setAttributes({ labelHours: value })}
					/>
					<TextControl
						label={__('Hour Label (Singular)', 'prolific-blocks')}
						value={labelHour}
						onChange={(value) => setAttributes({ labelHour: value })}
					/>
					<hr />
					<TextControl
						label={__('Minutes Label (Plural)', 'prolific-blocks')}
						value={labelMinutes}
						onChange={(value) => setAttributes({ labelMinutes: value })}
					/>
					<TextControl
						label={__('Minute Label (Singular)', 'prolific-blocks')}
						value={labelMinute}
						onChange={(value) => setAttributes({ labelMinute: value })}
					/>
					<hr />
					<TextControl
						label={__('Seconds Label (Plural)', 'prolific-blocks')}
						value={labelSeconds}
						onChange={(value) => setAttributes({ labelSeconds: value })}
					/>
					<TextControl
						label={__('Second Label (Singular)', 'prolific-blocks')}
						value={labelSecond}
						onChange={(value) => setAttributes({ labelSecond: value })}
					/>
				</PanelBody>

				<PanelBody title={__('Expiration', 'prolific-blocks')} initialOpen={false}>
					<TextControl
						label={__('Expired Message', 'prolific-blocks')}
						help={__('Text to display when countdown reaches zero', 'prolific-blocks')}
						value={expiredMessage}
						onChange={(value) => setAttributes({ expiredMessage: value })}
					/>
					<ToggleControl
						label={__('Auto-hide on Expiry', 'prolific-blocks')}
						help={__('Automatically hide the block when countdown expires', 'prolific-blocks')}
						checked={autoHide}
						onChange={(value) => setAttributes({ autoHide: value })}
					/>
				</PanelBody>

				<PanelBody title={__('Size', 'prolific-blocks')} initialOpen={false}>
					<SelectControl
						label={__('Size', 'prolific-blocks')}
						value={size}
						options={[
							{ label: __('Small', 'prolific-blocks'), value: 'small' },
							{ label: __('Medium', 'prolific-blocks'), value: 'medium' },
							{ label: __('Large', 'prolific-blocks'), value: 'large' }
						]}
						onChange={(value) => setAttributes({ size: value })}
					/>
				</PanelBody>
			</InspectorControls>
		</>
	);
}
