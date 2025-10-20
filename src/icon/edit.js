/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, BlockControls, AlignmentToolbar } from '@wordpress/block-editor';
import {
	PanelBody,
	RangeControl,
	ToggleControl,
	TextControl,
	Button,
	Modal,
	SearchControl,
	TabPanel,
	AnglePickerControl
} from '@wordpress/components';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { iconCategories, iconPaths } from './icons';
import './editor.scss';
import SupportCard from '../components/SupportCard';

/**
 * Icon Picker Component
 *
 * @param {Object} props - Component props.
 * @param {string} props.selectedIcon - Currently selected icon name.
 * @param {Function} props.onSelect - Callback when icon is selected.
 * @param {Function} props.onClose - Callback to close modal.
 * @return {JSX.Element} Icon picker modal.
 */
function IconPicker({ selectedIcon, onSelect, onClose }) {
	const [searchTerm, setSearchTerm] = useState('');

	// Filter icons based on search
	const filterIcons = (icons) => {
		if (!searchTerm) return icons;
		return icons.filter((icon) =>
			icon.toLowerCase().includes(searchTerm.toLowerCase())
		);
	};

	// Get all icons from all categories
	const allIcons = Object.values(iconCategories).flatMap(category => category.icons);

	// Create tabs for categories with "All" as the first tab
	const tabs = [
		{
			name: 'all',
			title: 'All',
			icons: filterIcons(allIcons)
		},
		...Object.entries(iconCategories).map(([key, category]) => ({
			name: key,
			title: category.label,
			icons: filterIcons(category.icons)
		}))
	];

	return (
		<Modal
			title={__('Select Icon', 'prolific-blocks')}
			onRequestClose={onClose}
			className="prolific-icon-picker-modal"
		>
			<div className="icon-picker-search">
				<SearchControl
					value={searchTerm}
					onChange={setSearchTerm}
					placeholder={__('Search icons...', 'prolific-blocks')}
				/>
			</div>

			<TabPanel
				className="icon-picker-tabs"
				tabs={tabs}
			>
				{(tab) => (
					<div className="icon-picker-grid">
						{tab.icons.length > 0 ? (
							tab.icons.map((iconName) => (
								<button
									key={iconName}
									className={`icon-picker-item ${selectedIcon === iconName ? 'is-selected' : ''}`}
									onClick={() => {
										onSelect(iconName);
										onClose();
									}}
									title={iconName}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 512 512"
										width="32"
										height="32"
									>
										<path d={iconPaths[iconName]} />
									</svg>
									<span className="icon-picker-label">{iconName}</span>
								</button>
							))
						) : (
							<p>{__('No icons found', 'prolific-blocks')}</p>
						)}
					</div>
				)}
			</TabPanel>
		</Modal>
	);
}

/**
 * Edit component for Icon block.
 *
 * @param {Object} props - Component props.
 * @param {Object} props.attributes - Block attributes.
 * @param {Function} props.setAttributes - Function to update attributes.
 * @return {JSX.Element} Block edit component.
 */
export default function Edit({ attributes, setAttributes }) {
	const {
		iconName,
		iconSize,
		rotation,
		flipHorizontal,
		flipVertical,
		linkUrl,
		linkTarget,
		linkRel,
		ariaLabel,
		alignment
	} = attributes;

	const [showIconPicker, setShowIconPicker] = useState(false);

	const blockProps = useBlockProps({
		className: `has-text-align-${alignment}`
	});

	// Set block ID
	setAttributes({ blockId: blockProps.id });

	// Build transform style
	const transforms = [];
	if (rotation !== 0) {
		transforms.push(`rotate(${rotation}deg)`);
	}
	if (flipHorizontal) {
		transforms.push('scaleX(-1)');
	}
	if (flipVertical) {
		transforms.push('scaleY(-1)');
	}

	const iconStyle = {
		width: `${iconSize}px`,
		height: `${iconSize}px`,
		transform: transforms.length > 0 ? transforms.join(' ') : undefined
	};

	const iconPath = iconPaths[iconName] || iconPaths['heart'];

	return (
		<>
			<BlockControls>
				<AlignmentToolbar
					value={alignment}
					onChange={(value) => setAttributes({ alignment: value })}
				/>
			</BlockControls>

			<div {...blockProps}>
				<div className="prolific-icon-wrapper">
					{linkUrl ? (
						<a
							href={linkUrl}
							target={linkTarget ? '_blank' : undefined}
							rel={linkRel || undefined}
							aria-label={ariaLabel}
							onClick={(e) => e.preventDefault()}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 512 512"
								style={iconStyle}
								className="prolific-icon"
								aria-hidden={ariaLabel ? 'false' : 'true'}
							>
								<path d={iconPath} />
							</svg>
						</a>
					) : (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 512 512"
							style={iconStyle}
							className="prolific-icon"
							aria-label={ariaLabel}
							role={ariaLabel ? 'img' : undefined}
						>
							<path d={iconPath} />
						</svg>
					)}
				</div>
			</div>

			<InspectorControls>
				<SupportCard />
				<PanelBody title={__('Icon Selection', 'prolific-blocks')} initialOpen={true}>
					<div className="icon-selection-preview">
						<div className="selected-icon-display">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 512 512"
								width="48"
								height="48"
							>
								<path d={iconPath} />
							</svg>
							<p><strong>{iconName}</strong></p>
						</div>
						<Button
							variant="primary"
							onClick={() => setShowIconPicker(true)}
						>
							{__('Change Icon', 'prolific-blocks')}
						</Button>
					</div>
				</PanelBody>

				<PanelBody title={__('Icon Settings', 'prolific-blocks')} initialOpen={true}>
					<RangeControl
						label={__('Icon Size', 'prolific-blocks')}
						value={iconSize}
						onChange={(value) => setAttributes({ iconSize: value })}
						min={16}
						max={200}
						step={1}
					/>
					<AnglePickerControl
						label={__('Rotation', 'prolific-blocks')}
						value={rotation}
						onChange={(value) => setAttributes({ rotation: value })}
					/>
					<ToggleControl
						label={__('Flip Horizontal', 'prolific-blocks')}
						checked={flipHorizontal}
						onChange={(value) => setAttributes({ flipHorizontal: value })}
					/>
					<ToggleControl
						label={__('Flip Vertical', 'prolific-blocks')}
						checked={flipVertical}
						onChange={(value) => setAttributes({ flipVertical: value })}
					/>
				</PanelBody>

				<PanelBody title={__('Link Settings', 'prolific-blocks')} initialOpen={false}>
					<TextControl
						label={__('URL', 'prolific-blocks')}
						value={linkUrl}
						onChange={(value) => setAttributes({ linkUrl: value })}
						type="url"
						placeholder="https://"
					/>
					{linkUrl && (
						<>
							<ToggleControl
								label={__('Open in New Tab', 'prolific-blocks')}
								checked={linkTarget}
								onChange={(value) => setAttributes({ linkTarget: value })}
							/>
							<TextControl
								label={__('Link Rel', 'prolific-blocks')}
								help={__('Relationship attribute (e.g., nofollow, noopener)', 'prolific-blocks')}
								value={linkRel}
								onChange={(value) => setAttributes({ linkRel: value })}
								placeholder="nofollow noopener"
							/>
						</>
					)}
					<TextControl
						label={__('ARIA Label', 'prolific-blocks')}
						help={__('Accessible description for screen readers', 'prolific-blocks')}
						value={ariaLabel}
						onChange={(value) => setAttributes({ ariaLabel: value })}
						placeholder={__('Icon description', 'prolific-blocks')}
					/>
				</PanelBody>
			</InspectorControls>

			{showIconPicker && (
				<IconPicker
					selectedIcon={iconName}
					onSelect={(icon) => setAttributes({ iconName: icon })}
					onClose={() => setShowIconPicker(false)}
				/>
			)}
		</>
	);
}
