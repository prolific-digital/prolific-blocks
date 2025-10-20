/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import {
	PanelBody,
	SelectControl,
	ToggleControl,
	RangeControl,
	Button,
	TextControl,
	Notice
} from '@wordpress/components';
import { useEffect } from '@wordpress/element';

/**
 * Editor styles
 */
import './editor.scss';

/**
 * Edit component for PDF Viewer block.
 *
 * @param {Object} props - Component props.
 * @param {Object} props.attributes - Block attributes.
 * @param {Function} props.setAttributes - Function to update attributes.
 * @return {JSX.Element} Block edit component.
 */
export default function Edit({ attributes, setAttributes }) {
	const {
		pdfId,
		pdfUrl,
		pdfFilename,
		displayMethod,
		showDownloadButton,
		aspectRatio,
		customHeight,
		showToolbar,
		enableNavigation,
		altText
	} = attributes;

	const blockProps = useBlockProps();

	// Set block ID
	useEffect(() => {
		setAttributes({ blockId: blockProps.id });
	}, []);

	/**
	 * Handle PDF selection from Media Library.
	 *
	 * @param {Object} media - Media object from WordPress.
	 */
	const onSelectPDF = (media) => {
		// Validate that the selected file is a PDF
		if (media.mime !== 'application/pdf' && !media.url.toLowerCase().endsWith('.pdf')) {
			return;
		}

		setAttributes({
			pdfId: media.id,
			pdfUrl: media.url,
			pdfFilename: media.filename || media.title,
			altText: altText || media.title
		});
	};

	/**
	 * Handle PDF removal.
	 */
	const onRemovePDF = () => {
		setAttributes({
			pdfId: 0,
			pdfUrl: '',
			pdfFilename: '',
			altText: ''
		});
	};

	/**
	 * Get aspect ratio dimensions.
	 *
	 * @return {Object} Aspect ratio padding percentage.
	 */
	const getAspectRatioPadding = () => {
		switch (aspectRatio) {
			case '16-9':
				return '56.25%'; // 9/16 * 100
			case '4-3':
				return '75%'; // 3/4 * 100
			case 'a4':
				return '141.4%'; // A4 ratio (297/210)
			case 'custom':
				return null;
			default:
				return '56.25%';
		}
	};

	/**
	 * Render PDF viewer preview.
	 *
	 * @return {JSX.Element} PDF viewer preview component.
	 */
	const renderPDFViewer = () => {
		if (!pdfUrl) {
			return (
				<div className="pdf-placeholder">
					<MediaUploadCheck>
						<MediaUpload
							onSelect={onSelectPDF}
							allowedTypes={['application/pdf']}
							value={pdfId}
							render={({ open }) => (
								<Button
									onClick={open}
									variant="primary"
									className="pdf-upload-button"
								>
									{__('Upload PDF', 'prolific-blocks')}
								</Button>
							)}
						/>
					</MediaUploadCheck>
					<p>{__('Select a PDF file from your media library or upload a new one.', 'prolific-blocks')}</p>
				</div>
			);
		}

		const padding = getAspectRatioPadding();
		const containerStyle = aspectRatio === 'custom' ? { height: `${customHeight}px` } : {};
		const wrapperStyle = aspectRatio !== 'custom' ? { paddingBottom: padding } : {};

		// Build iframe URL with parameters
		let iframeUrl = pdfUrl;
		if (displayMethod === 'iframe') {
			const params = [];
			if (!showToolbar) params.push('toolbar=0');
			if (!enableNavigation) params.push('navpanes=0');
			if (params.length > 0) {
				iframeUrl += '#' + params.join('&');
			}
		}

		return (
			<div className="pdf-viewer-container" style={containerStyle}>
				<div className="pdf-viewer-wrapper" style={wrapperStyle}>
					{displayMethod === 'embed' && (
						<embed
							src={pdfUrl}
							type="application/pdf"
							width="100%"
							height="100%"
							aria-label={altText || pdfFilename}
						/>
					)}

					{displayMethod === 'object' && (
						<object
							data={pdfUrl}
							type="application/pdf"
							width="100%"
							height="100%"
							aria-label={altText || pdfFilename}
						>
							<p>
								{__('Your browser doesn\'t support PDFs.', 'prolific-blocks')}{' '}
								<a href={pdfUrl} download={pdfFilename}>
									{__('Download the PDF', 'prolific-blocks')}
								</a>
							</p>
						</object>
					)}

					{displayMethod === 'iframe' && (
						<iframe
							src={iframeUrl}
							width="100%"
							height="100%"
							frameBorder="0"
							title={altText || pdfFilename}
							aria-label={altText || pdfFilename}
						/>
					)}
				</div>

				{showDownloadButton && (
					<div className="pdf-download-actions">
						<Button
							href={pdfUrl}
							download={pdfFilename}
							variant="secondary"
							className="pdf-download-button"
						>
							{__('Download PDF', 'prolific-blocks')}
						</Button>
					</div>
				)}

				{pdfFilename && (
					<div className="pdf-filename">
						<strong>{__('File:', 'prolific-blocks')}</strong> {pdfFilename}
					</div>
				)}
			</div>
		);
	};

	return (
		<>
			<div {...blockProps}>
				{pdfUrl && (
					<Notice status="info" isDismissible={false} className="pdf-editor-notice">
						{__('PDF preview shown. The actual PDF viewer will appear on the frontend.', 'prolific-blocks')}
					</Notice>
				)}
				{renderPDFViewer()}
			</div>

			<InspectorControls>
				<PanelBody title={__('PDF Settings', 'prolific-blocks')} initialOpen={true}>
					{pdfUrl ? (
						<>
							<div className="pdf-current-file">
								<p><strong>{__('Current PDF:', 'prolific-blocks')}</strong></p>
								<p className="pdf-current-filename">{pdfFilename}</p>
							</div>

							<MediaUploadCheck>
								<MediaUpload
									onSelect={onSelectPDF}
									allowedTypes={['application/pdf']}
									value={pdfId}
									render={({ open }) => (
										<Button
											onClick={open}
											variant="secondary"
											className="pdf-replace-button"
										>
											{__('Replace PDF', 'prolific-blocks')}
										</Button>
									)}
								/>
							</MediaUploadCheck>

							<Button
								onClick={onRemovePDF}
								variant="link"
								isDestructive
								className="pdf-remove-button"
							>
								{__('Remove PDF', 'prolific-blocks')}
							</Button>
						</>
					) : (
						<MediaUploadCheck>
							<MediaUpload
								onSelect={onSelectPDF}
								allowedTypes={['application/pdf']}
								value={pdfId}
								render={({ open }) => (
									<Button
										onClick={open}
										variant="primary"
									>
										{__('Upload PDF', 'prolific-blocks')}
									</Button>
								)}
							/>
						</MediaUploadCheck>
					)}

					<TextControl
						label={__('Alternative Text', 'prolific-blocks')}
						help={__('Describe the PDF content for accessibility', 'prolific-blocks')}
						value={altText}
						onChange={(value) => setAttributes({ altText: value })}
						placeholder={__('PDF document description', 'prolific-blocks')}
					/>
				</PanelBody>

				<PanelBody title={__('Display Settings', 'prolific-blocks')} initialOpen={true}>
					<SelectControl
						label={__('Display Method', 'prolific-blocks')}
						help={__('Choose how to display the PDF', 'prolific-blocks')}
						value={displayMethod}
						options={[
							{ label: __('Embed (Most Compatible)', 'prolific-blocks'), value: 'embed' },
							{ label: __('Object (With Fallback)', 'prolific-blocks'), value: 'object' },
							{ label: __('Iframe (Toolbar Control)', 'prolific-blocks'), value: 'iframe' }
						]}
						onChange={(value) => setAttributes({ displayMethod: value })}
					/>

					<SelectControl
						label={__('Aspect Ratio', 'prolific-blocks')}
						help={__('Choose the viewer dimensions', 'prolific-blocks')}
						value={aspectRatio}
						options={[
							{ label: __('16:9 (Widescreen)', 'prolific-blocks'), value: '16-9' },
							{ label: __('4:3 (Standard)', 'prolific-blocks'), value: '4-3' },
							{ label: __('A4 (Document)', 'prolific-blocks'), value: 'a4' },
							{ label: __('Custom Height', 'prolific-blocks'), value: 'custom' }
						]}
						onChange={(value) => setAttributes({ aspectRatio: value })}
					/>

					{aspectRatio === 'custom' && (
						<RangeControl
							label={__('Custom Height (px)', 'prolific-blocks')}
							value={customHeight}
							onChange={(value) => setAttributes({ customHeight: value })}
							min={300}
							max={1200}
							step={10}
						/>
					)}

					<hr />

					<ToggleControl
						label={__('Show Download Button', 'prolific-blocks')}
						help={__('Display a button to download the PDF', 'prolific-blocks')}
						checked={showDownloadButton}
						onChange={(value) => setAttributes({ showDownloadButton: value })}
					/>
				</PanelBody>

				{displayMethod === 'iframe' && (
					<PanelBody title={__('Toolbar Settings', 'prolific-blocks')} initialOpen={false}>
						<p className="components-base-control__help">
							{__('Note: Toolbar controls may not work in all browsers and PDF viewers.', 'prolific-blocks')}
						</p>

						<ToggleControl
							label={__('Show Toolbar', 'prolific-blocks')}
							help={__('Display PDF toolbar with controls', 'prolific-blocks')}
							checked={showToolbar}
							onChange={(value) => setAttributes({ showToolbar: value })}
						/>

						<ToggleControl
							label={__('Enable Page Navigation', 'prolific-blocks')}
							help={__('Show page navigation panel', 'prolific-blocks')}
							checked={enableNavigation}
							onChange={(value) => setAttributes({ enableNavigation: value })}
						/>
					</PanelBody>
				)}
			</InspectorControls>
		</>
	);
}
