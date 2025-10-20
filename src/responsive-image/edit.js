/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	InspectorControls,
	BlockControls,
	MediaPlaceholder,
	MediaUpload,
	MediaUploadCheck,
	RichText,
	BlockAlignmentToolbar
} from '@wordpress/block-editor';
import {
	PanelBody,
	RangeControl,
	ToggleControl,
	TextControl,
	Button,
	ButtonGroup,
	ToolbarGroup,
	ToolbarButton,
	Spinner,
	Notice,
	__experimentalNumberControl as NumberControl
} from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';
import { desktop, tablet, mobile } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import './editor.scss';
import SupportCard from '../components/SupportCard';

/**
 * Device Preview Toolbar Component
 */
function DevicePreviewToolbar({ currentDevice, onDeviceChange }) {
	return (
		<ToolbarGroup>
			<ToolbarButton
				icon={desktop}
				label={__('Desktop Preview', 'prolific-blocks')}
				isPressed={currentDevice === 'desktop'}
				onClick={() => onDeviceChange('desktop')}
			/>
			<ToolbarButton
				icon={tablet}
				label={__('Tablet Preview', 'prolific-blocks')}
				isPressed={currentDevice === 'tablet'}
				onClick={() => onDeviceChange('tablet')}
			/>
			<ToolbarButton
				icon={mobile}
				label={__('Mobile Preview', 'prolific-blocks')}
				isPressed={currentDevice === 'mobile'}
				onClick={() => onDeviceChange('mobile')}
			/>
		</ToolbarGroup>
	);
}

/**
 * Image Upload Control Component
 */
function ImageUploadControl({
	label,
	imageUrl,
	imageId,
	onSelect,
	onRemove,
	allowedTypes = ['image'],
	help,
	isRequired = false
}) {
	return (
		<div className="responsive-image-control">
			<h3>{label} {!isRequired && <span className="optional-label">({__('Optional', 'prolific-blocks')})</span>}</h3>
			{help && <p className="components-base-control__help">{help}</p>}

			{imageUrl ? (
				<div className="responsive-image-preview">
					<img src={imageUrl} alt="" />
					<MediaUploadCheck>
						<div className="responsive-image-actions">
							<MediaUpload
								onSelect={onSelect}
								allowedTypes={allowedTypes}
								value={imageId}
								render={({ open }) => (
									<Button variant="secondary" onClick={open}>
										{__('Replace', 'prolific-blocks')}
									</Button>
								)}
							/>
							{!isRequired && (
								<Button
									variant="tertiary"
									isDestructive
									onClick={onRemove}
								>
									{__('Remove', 'prolific-blocks')}
								</Button>
							)}
						</div>
					</MediaUploadCheck>
				</div>
			) : (
				<MediaUploadCheck>
					<MediaPlaceholder
						icon="format-image"
						labels={{
							title: label,
							instructions: __('Upload an image or pick one from the media library.', 'prolific-blocks')
						}}
						onSelect={onSelect}
						accept="image/*"
						allowedTypes={allowedTypes}
					/>
				</MediaUploadCheck>
			)}
		</div>
	);
}

/**
 * Dimension Controls Component
 */
function DimensionControls({ width, height, lockRatio, onWidthChange, onHeightChange, onLockChange, label }) {
	const [aspectRatio, setAspectRatio] = useState(1);

	useEffect(() => {
		if (width && height) {
			setAspectRatio(width / height);
		}
	}, [width, height]);

	const handleWidthChange = (value) => {
		const newWidth = parseInt(value, 10);
		onWidthChange(newWidth);

		if (lockRatio && aspectRatio && height) {
			const newHeight = Math.round(newWidth / aspectRatio);
			onHeightChange(newHeight);
		}
	};

	const handleHeightChange = (value) => {
		const newHeight = parseInt(value, 10);
		onHeightChange(newHeight);

		if (lockRatio && aspectRatio && width) {
			const newWidth = Math.round(newHeight * aspectRatio);
			onWidthChange(newWidth);
		}
	};

	return (
		<div className="dimension-controls">
			<div className="dimension-controls-header">
				<h4>{label}</h4>
				<ToggleControl
					label={__('Lock aspect ratio', 'prolific-blocks')}
					checked={lockRatio}
					onChange={onLockChange}
				/>
			</div>
			<div className="dimension-inputs">
				<NumberControl
					label={__('Width (px)', 'prolific-blocks')}
					value={width || ''}
					onChange={handleWidthChange}
					min={1}
					step={1}
				/>
				<NumberControl
					label={__('Height (px)', 'prolific-blocks')}
					value={height || ''}
					onChange={handleHeightChange}
					min={1}
					step={1}
				/>
			</div>
		</div>
	);
}

/**
 * Edit component for Responsive Image block
 */
export default function Edit({ attributes, setAttributes }) {
	const {
		desktopImageId,
		desktopImageUrl,
		desktopWidth,
		desktopHeight,
		tabletImageId,
		tabletImageUrl,
		tabletWidth,
		tabletHeight,
		mobileImageId,
		mobileImageUrl,
		mobileWidth,
		mobileHeight,
		caption,
		desktopBreakpoint,
		tabletBreakpoint,
		lockDesktopRatio,
		lockTabletRatio,
		lockMobileRatio,
		currentPreviewDevice
	} = attributes;

	const blockProps = useBlockProps({
		className: `preview-device-${currentPreviewDevice}`
	});

	// Determine which image to show based on preview device
	const getPreviewImage = () => {
		switch (currentPreviewDevice) {
			case 'mobile':
				return mobileImageUrl || tabletImageUrl || desktopImageUrl;
			case 'tablet':
				return tabletImageUrl || desktopImageUrl;
			case 'desktop':
			default:
				return desktopImageUrl;
		}
	};

	const previewImageUrl = getPreviewImage();

	// Handle desktop image selection
	const onSelectDesktopImage = (media) => {
		setAttributes({
			desktopImageId: media.id,
			desktopImageUrl: media.url,
			desktopWidth: media.width,
			desktopHeight: media.height
		});
	};

	// Handle tablet image selection
	const onSelectTabletImage = (media) => {
		setAttributes({
			tabletImageId: media.id,
			tabletImageUrl: media.url,
			tabletWidth: media.width,
			tabletHeight: media.height
		});
	};

	// Handle mobile image selection
	const onSelectMobileImage = (media) => {
		setAttributes({
			mobileImageId: media.id,
			mobileImageUrl: media.url,
			mobileWidth: media.width,
			mobileHeight: media.height
		});
	};

	// Remove tablet image
	const removeTabletImage = () => {
		setAttributes({
			tabletImageId: 0,
			tabletImageUrl: '',
			tabletWidth: undefined,
			tabletHeight: undefined
		});
	};

	// Remove mobile image
	const removeMobileImage = () => {
		setAttributes({
			mobileImageId: 0,
			mobileImageUrl: '',
			mobileWidth: undefined,
			mobileHeight: undefined
		});
	};

	// Get device indicator badges
	const getDeviceBadges = () => {
		const badges = [];
		if (desktopImageUrl) badges.push('Desktop');
		if (tabletImageUrl) badges.push('Tablet');
		if (mobileImageUrl) badges.push('Mobile');
		return badges;
	};

	const deviceBadges = getDeviceBadges();

	return (
		<>
			<BlockControls>
				<BlockAlignmentToolbar
					value={attributes.align}
					onChange={(value) => setAttributes({ align: value })}
					controls={['left', 'center', 'right', 'wide', 'full']}
				/>
				<DevicePreviewToolbar
					currentDevice={currentPreviewDevice}
					onDeviceChange={(device) => setAttributes({ currentPreviewDevice: device })}
				/>
			</BlockControls>

			<InspectorControls>
				<SupportCard />
				<PanelBody title={__('Desktop Image', 'prolific-blocks')} initialOpen={true}>
					<ImageUploadControl
						label={__('Desktop Image', 'prolific-blocks')}
						imageUrl={desktopImageUrl}
						imageId={desktopImageId}
						onSelect={onSelectDesktopImage}
						isRequired={true}
						help={__('This image is required and will be used as fallback for all devices.', 'prolific-blocks')}
					/>
					{desktopImageUrl && (
						<DimensionControls
							width={desktopWidth}
							height={desktopHeight}
							lockRatio={lockDesktopRatio}
							onWidthChange={(value) => setAttributes({ desktopWidth: value })}
							onHeightChange={(value) => setAttributes({ desktopHeight: value })}
							onLockChange={(value) => setAttributes({ lockDesktopRatio: value })}
							label={__('Desktop Dimensions', 'prolific-blocks')}
						/>
					)}
				</PanelBody>

				<PanelBody title={__('Tablet Image', 'prolific-blocks')} initialOpen={false}>
					<ImageUploadControl
						label={__('Tablet Image', 'prolific-blocks')}
						imageUrl={tabletImageUrl}
						imageId={tabletImageId}
						onSelect={onSelectTabletImage}
						onRemove={removeTabletImage}
						help={__('Optional. Falls back to desktop image if not set.', 'prolific-blocks')}
					/>
					{tabletImageUrl && (
						<DimensionControls
							width={tabletWidth}
							height={tabletHeight}
							lockRatio={lockTabletRatio}
							onWidthChange={(value) => setAttributes({ tabletWidth: value })}
							onHeightChange={(value) => setAttributes({ tabletHeight: value })}
							onLockChange={(value) => setAttributes({ lockTabletRatio: value })}
							label={__('Tablet Dimensions', 'prolific-blocks')}
						/>
					)}
				</PanelBody>

				<PanelBody title={__('Mobile Image', 'prolific-blocks')} initialOpen={false}>
					<ImageUploadControl
						label={__('Mobile Image', 'prolific-blocks')}
						imageUrl={mobileImageUrl}
						imageId={mobileImageId}
						onSelect={onSelectMobileImage}
						onRemove={removeMobileImage}
						help={__('Optional. Falls back to tablet or desktop image if not set.', 'prolific-blocks')}
					/>
					{mobileImageUrl && (
						<DimensionControls
							width={mobileWidth}
							height={mobileHeight}
							lockRatio={lockMobileRatio}
							onWidthChange={(value) => setAttributes({ mobileWidth: value })}
							onHeightChange={(value) => setAttributes({ mobileHeight: value })}
							onLockChange={(value) => setAttributes({ lockMobileRatio: value })}
							label={__('Mobile Dimensions', 'prolific-blocks')}
						/>
					)}
				</PanelBody>

				<PanelBody title={__('Breakpoints', 'prolific-blocks')} initialOpen={false}>
					<p className="components-base-control__help">
						{__('Customize the screen size breakpoints for device switching.', 'prolific-blocks')}
					</p>
					<RangeControl
						label={__('Desktop Breakpoint (min-width)', 'prolific-blocks')}
						help={__('Minimum screen width for desktop image (px)', 'prolific-blocks')}
						value={desktopBreakpoint}
						onChange={(value) => setAttributes({ desktopBreakpoint: value })}
						min={768}
						max={2560}
						step={1}
					/>
					<RangeControl
						label={__('Tablet Breakpoint (min-width)', 'prolific-blocks')}
						help={__('Minimum screen width for tablet image (px)', 'prolific-blocks')}
						value={tabletBreakpoint}
						onChange={(value) => setAttributes({ tabletBreakpoint: value })}
						min={320}
						max={1024}
						step={1}
					/>
					<Notice status="info" isDismissible={false}>
						<p>
							<strong>{__('Current breakpoints:', 'prolific-blocks')}</strong><br />
							{__('Mobile:', 'prolific-blocks')} &lt; {tabletBreakpoint}px<br />
							{__('Tablet:', 'prolific-blocks')} {tabletBreakpoint}px - {desktopBreakpoint - 1}px<br />
							{__('Desktop:', 'prolific-blocks')} ≥ {desktopBreakpoint}px
						</p>
					</Notice>
				</PanelBody>

			</InspectorControls>

			<div {...blockProps}>
				{!desktopImageUrl ? (
					<MediaPlaceholder
						icon="format-image"
						labels={{
							title: __('Responsive Image', 'prolific-blocks'),
							instructions: __('Upload a desktop image or pick one from the media library. You can add tablet and mobile images in the sidebar.', 'prolific-blocks')
						}}
						onSelect={onSelectDesktopImage}
						accept="image/*"
						allowedTypes={['image']}
					/>
				) : (
					<figure className="prolific-responsive-image">
						{deviceBadges.length > 0 && (
							<div className="device-badges">
								{deviceBadges.map((badge) => (
									<span key={badge} className={`device-badge device-badge-${badge.toLowerCase()}`}>
										{badge}
									</span>
								))}
							</div>
						)}

						<div className="preview-device-indicator">
							{currentPreviewDevice === 'desktop' && __('Desktop Preview', 'prolific-blocks')}
							{currentPreviewDevice === 'tablet' && __('Tablet Preview', 'prolific-blocks')}
							{currentPreviewDevice === 'mobile' && __('Mobile Preview', 'prolific-blocks')}
						</div>

						{previewImageUrl ? (
							<img
								src={previewImageUrl}
								alt=""
							/>
						) : (
							<div className="no-image-notice">
								<Notice status="warning" isDismissible={false}>
									{currentPreviewDevice === 'tablet' && __('No tablet image set. Add one in the Tablet Image panel or the desktop image will be used.', 'prolific-blocks')}
									{currentPreviewDevice === 'mobile' && __('No mobile image set. Add one in the Mobile Image panel or the fallback image will be used.', 'prolific-blocks')}
								</Notice>
							</div>
						)}

						{caption && (
							<RichText
								tagName="figcaption"
								placeholder={__('Write caption…', 'prolific-blocks')}
								value={caption}
								onChange={(value) => setAttributes({ caption: value })}
							/>
						)}
					</figure>
				)}
			</div>
		</>
	);
}
