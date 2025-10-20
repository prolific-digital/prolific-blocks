/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, BlockControls, BlockAlignmentToolbar, MediaPlaceholder, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import {
	PanelBody,
	RangeControl,
	ToggleControl,
	TextControl,
	Button,
	SelectControl,
	AnglePickerControl,
	BaseControl,
	__experimentalUnitControl as UnitControl,
	__experimentalHStack as HStack,
	Notice
} from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal dependencies
 */
import './editor.scss';
import SupportCard from '../components/SupportCard';

/**
 * Edit component for SVG block.
 *
 * @param {Object} props - Component props.
 * @param {Object} props.attributes - Block attributes.
 * @param {Function} props.setAttributes - Function to update attributes.
 * @return {JSX.Element} Block edit component.
 */
export default function Edit({ attributes, setAttributes }) {
	const {
		svgUrl,
		svgContent,
		rotation,
		flipHorizontal,
		flipVertical,
		width,
		widthUnit,
		height,
		heightUnit,
		maintainAspectRatio,
		altText,
		alignment,
		mediaId
	} = attributes;

	const [isLoading, setIsLoading] = useState(false);
	const [loadError, setLoadError] = useState('');

	const blockProps = useBlockProps({
		className: alignment ? `align${alignment}` : ''
	});

	// Set block ID
	useEffect(() => {
		if (blockProps.id) {
			setAttributes({ blockId: blockProps.id });
		}
	}, [blockProps.id]);

	// Fetch SVG content when URL changes
	useEffect(() => {
		// Only fetch if we have a URL but no content
		if (svgUrl && !svgContent) {
			setIsLoading(true);
			setLoadError('');

			fetch(svgUrl)
				.then(response => {
					if (!response.ok) {
						throw new Error('Failed to load SVG');
					}
					return response.text();
				})
				.then(content => {
					setAttributes({ svgContent: content });
					setIsLoading(false);
				})
				.catch(error => {
					console.error('Error loading SVG:', error);
					setLoadError(__('Failed to load SVG file. Please ensure it\'s a valid SVG.', 'prolific-blocks'));
					setIsLoading(false);
				});
		}
	}, [svgUrl, svgContent, setAttributes]);

	/**
	 * Handle media selection
	 */
	const onSelectMedia = (media) => {
		if (!media || !media.url) {
			return;
		}

		// Check if file is SVG (WordPress uses 'mime' or 'subtype' properties)
		const mimeType = media.mime || media.mimeType || media.type || '';
		const fileExtension = media.url.split('.').pop().toLowerCase();

		// Check both mime type and file extension
		if (mimeType !== 'image/svg+xml' && fileExtension !== 'svg') {
			setLoadError(__('Please select an SVG file.', 'prolific-blocks'));
			return;
		}

		// Clear error
		setLoadError('');

		// Update attributes - clearing svgContent triggers the fetch in useEffect
		setAttributes({
			svgUrl: media.url,
			mediaId: media.id,
			svgContent: '', // Clear content to trigger reload in useEffect
			altText: media.alt || altText || ''
		});
	};

	/**
	 * Build transform styles
	 */
	const getTransformStyle = () => {
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
		return transforms.length > 0 ? transforms.join(' ') : undefined;
	};

	/**
	 * Build SVG container styles
	 */
	const getSVGContainerStyle = () => {
		const styles = {
			width: width ? `${width}${widthUnit}` : 'auto',
			transform: getTransformStyle()
		};

		if (!maintainAspectRatio && height) {
			styles.height = `${height}${heightUnit}`;
		}

		return styles;
	};

	/**
	 * Render SVG preview
	 */
	const renderSVG = () => {
		if (isLoading) {
			return <div className="prolific-svg-loading">{__('Loading SVG...', 'prolific-blocks')}</div>;
		}

		if (loadError) {
			return <Notice status="error" isDismissible={false}>{loadError}</Notice>;
		}

		if (!svgContent) {
			return null;
		}

		return (
			<div
				className="prolific-svg-wrapper"
				style={getSVGContainerStyle()}
				role={altText ? 'img' : undefined}
				aria-label={altText || undefined}
				dangerouslySetInnerHTML={{ __html: svgContent }}
			/>
		);
	};

	return (
		<>
			{svgUrl && (
				<BlockControls>
					<BlockAlignmentToolbar
						value={alignment}
						onChange={(value) => setAttributes({ alignment: value })}
						controls={['left', 'center', 'right', 'wide', 'full']}
					/>
				</BlockControls>
			)}

			<div {...blockProps}>
				{!svgUrl ? (
					<MediaPlaceholder
						icon="format-image"
						labels={{
							title: __('SVG', 'prolific-blocks'),
							instructions: __('Upload an SVG file or select one from your media library.', 'prolific-blocks')
						}}
						onSelect={onSelectMedia}
						accept="image/svg+xml"
						allowedTypes={['image/svg+xml']}
						multiple={false}
					/>
				) : (
					<div className="prolific-svg-container">
						{renderSVG()}
					</div>
				)}
			</div>

			<InspectorControls>
				<SupportCard />
				<PanelBody title={__('SVG Settings', 'prolific-blocks')} initialOpen={true}>
					<div className="prolific-svg-media-control">
						<BaseControl
							label={__('SVG File', 'prolific-blocks')}
							id="svg-media-control"
						>
							{svgUrl && svgContent && (
								<div className="prolific-svg-thumbnail">
									<div
										className="svg-preview"
										dangerouslySetInnerHTML={{ __html: svgContent }}
									/>
								</div>
							)}
							<HStack>
								<MediaUploadCheck>
									<MediaUpload
										onSelect={onSelectMedia}
										allowedTypes={['image/svg+xml']}
										value={mediaId}
										render={({ open }) => (
											<Button
												variant="secondary"
												onClick={open}
											>
												{svgUrl ? __('Replace SVG', 'prolific-blocks') : __('Select SVG', 'prolific-blocks')}
											</Button>
										)}
									/>
								</MediaUploadCheck>
								{svgUrl && (
									<Button
										isDestructive
										variant="secondary"
										onClick={() => {
											setAttributes({
												svgUrl: '',
												svgContent: '',
												mediaId: 0
											});
										}}
									>
										{__('Remove', 'prolific-blocks')}
									</Button>
								)}
							</HStack>
						</BaseControl>
					</div>

					<TextControl
						label={__('Alt Text', 'prolific-blocks')}
						help={__('Describe the SVG for accessibility', 'prolific-blocks')}
						value={altText}
						onChange={(value) => setAttributes({ altText: value })}
					/>
				</PanelBody>

				<PanelBody title={__('Dimensions', 'prolific-blocks')} initialOpen={true}>
					<UnitControl
						label={__('Width', 'prolific-blocks')}
						value={`${width}${widthUnit}`}
						onChange={(value) => {
							const numValue = parseFloat(value);
							const unit = value.replace(numValue, '') || widthUnit;
							setAttributes({
								width: numValue,
								widthUnit: unit
							});
						}}
						units={[
							{ value: 'px', label: 'px' },
							{ value: '%', label: '%' },
							{ value: 'vw', label: 'vw' },
							{ value: 'em', label: 'em' },
							{ value: 'rem', label: 'rem' }
						]}
					/>

					<ToggleControl
						label={__('Maintain Aspect Ratio', 'prolific-blocks')}
						checked={maintainAspectRatio}
						onChange={(value) => setAttributes({ maintainAspectRatio: value })}
						help={__('Keep the original proportions of the SVG', 'prolific-blocks')}
					/>

					{!maintainAspectRatio && (
						<UnitControl
							label={__('Height', 'prolific-blocks')}
							value={height ? `${height}${heightUnit}` : ''}
							onChange={(value) => {
								const numValue = parseFloat(value) || 0;
								const unit = value.replace(numValue, '') || heightUnit;
								setAttributes({
									height: numValue,
									heightUnit: unit
								});
							}}
							units={[
								{ value: 'px', label: 'px' },
								{ value: '%', label: '%' },
								{ value: 'vh', label: 'vh' },
								{ value: 'em', label: 'em' },
								{ value: 'rem', label: 'rem' }
							]}
						/>
					)}
				</PanelBody>

				<PanelBody title={__('Transformations', 'prolific-blocks')} initialOpen={true}>
					<AnglePickerControl
						label={__('Rotation', 'prolific-blocks')}
						value={rotation}
						onChange={(value) => setAttributes({ rotation: value === undefined ? 0 : value })}
					/>

					<BaseControl
						label={__('Quick Rotation', 'prolific-blocks')}
						help={__('Click to rotate by common angles', 'prolific-blocks')}
					>
						<HStack>
							<Button
								isSmall
								variant={rotation === 0 ? 'primary' : 'secondary'}
								onClick={() => setAttributes({ rotation: 0 })}
							>
								0°
							</Button>
							<Button
								isSmall
								variant={rotation === 90 ? 'primary' : 'secondary'}
								onClick={() => setAttributes({ rotation: 90 })}
							>
								90°
							</Button>
							<Button
								isSmall
								variant={rotation === 180 ? 'primary' : 'secondary'}
								onClick={() => setAttributes({ rotation: 180 })}
							>
								180°
							</Button>
							<Button
								isSmall
								variant={rotation === 270 ? 'primary' : 'secondary'}
								onClick={() => setAttributes({ rotation: 270 })}
							>
								270°
							</Button>
						</HStack>
					</BaseControl>

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
			</InspectorControls>
		</>
	);
}
