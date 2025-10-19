/**
 * WordPress dependencies
 */
import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

/**
 * Save function for PDF Viewer block.
 * Renders the PDF viewer markup on the frontend.
 *
 * @param {Object} props - Component props.
 * @param {Object} props.attributes - Block attributes.
 * @return {JSX.Element|null} Block save component.
 */
export default function save({ attributes }) {
	const {
		pdfUrl,
		pdfFilename,
		displayMethod,
		showDownloadButton,
		aspectRatio,
		customHeight,
		showToolbar,
		enableZoom,
		enableNavigation,
		altText
	} = attributes;

	// Don't render if no PDF is selected
	if (!pdfUrl) {
		return null;
	}

	const blockProps = useBlockProps.save({
		className: 'wp-block-prolific-pdf-viewer'
	});

	/**
	 * Get aspect ratio padding percentage.
	 *
	 * @return {string|null} Aspect ratio padding.
	 */
	const getAspectRatioPadding = () => {
		switch (aspectRatio) {
			case '16-9':
				return '56.25%';
			case '4-3':
				return '75%';
			case 'a4':
				return '141.4%';
			case 'custom':
				return null;
			default:
				return '56.25%';
		}
	};

	const padding = getAspectRatioPadding();
	const containerStyle = aspectRatio === 'custom' ? { height: `${customHeight}px` } : {};
	const wrapperStyle = aspectRatio !== 'custom' ? { paddingBottom: padding } : {};

	// Build iframe URL with parameters
	let iframeUrl = pdfUrl;
	if (displayMethod === 'iframe') {
		const params = [];
		if (!showToolbar) params.push('toolbar=0');
		if (!enableZoom) params.push('zoom=100');
		if (!enableNavigation) params.push('navpanes=0');
		if (params.length > 0) {
			iframeUrl += '#' + params.join('&');
		}
	}

	return (
		<div {...blockProps}>
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
						<a
							href={pdfUrl}
							download={pdfFilename}
							className="pdf-download-button"
						>
							{__('Download PDF', 'prolific-blocks')}
						</a>
					</div>
				)}
			</div>
		</div>
	);
}
