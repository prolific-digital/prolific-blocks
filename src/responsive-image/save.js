/**
 * WordPress dependencies
 */
import { useBlockProps, RichText } from '@wordpress/block-editor';

/**
 * Save component for Responsive Image block
 *
 * Outputs an HTML5 <picture> element with responsive sources
 * for different screen sizes using media queries.
 */
export default function save({ attributes }) {
	const {
		desktopImageUrl,
		desktopWidth,
		desktopHeight,
		tabletImageUrl,
		tabletWidth,
		tabletHeight,
		mobileImageUrl,
		mobileWidth,
		mobileHeight,
		caption,
		desktopBreakpoint,
		tabletBreakpoint
	} = attributes;

	// Don't render if no desktop image
	if (!desktopImageUrl) {
		return null;
	}

	const blockProps = useBlockProps.save();

	// Build the picture element content
	const renderPicture = () => {
		const sources = [];

		// Mobile source (max-width: tabletBreakpoint - 1)
		if (mobileImageUrl) {
			sources.push(
				<source
					key="mobile"
					media={`(max-width: ${tabletBreakpoint - 1}px)`}
					srcSet={mobileImageUrl}
					width={mobileWidth}
					height={mobileHeight}
				/>
			);
		}

		// Tablet source (min-width: tabletBreakpoint AND max-width: desktopBreakpoint - 1)
		if (tabletImageUrl) {
			sources.push(
				<source
					key="tablet"
					media={`(min-width: ${tabletBreakpoint}px) and (max-width: ${desktopBreakpoint - 1}px)`}
					srcSet={tabletImageUrl}
					width={tabletWidth}
					height={tabletHeight}
				/>
			);
		}

		// Desktop image (fallback img element)
		const imgElement = (
			<img
				src={desktopImageUrl}
				alt=""
				width={desktopWidth}
				height={desktopHeight}
				loading="lazy"
			/>
		);

		return (
			<picture className="prolific-responsive-picture">
				{sources}
				{imgElement}
			</picture>
		);
	};

	// Wrap in figure if caption exists
	return (
		<div {...blockProps}>
			{caption ? (
				<figure className="prolific-responsive-image">
					{renderPicture()}
					<RichText.Content tagName="figcaption" value={caption} />
				</figure>
			) : (
				<div className="prolific-responsive-image">{renderPicture()}</div>
			)}
		</div>
	);
}
