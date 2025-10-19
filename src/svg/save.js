/**
 * WordPress dependencies
 */
import { useBlockProps } from '@wordpress/block-editor';

/**
 * Save component for SVG block.
 *
 * @param {Object} props - Component props.
 * @param {Object} props.attributes - Block attributes.
 * @return {JSX.Element|null} Saved block content.
 */
export default function save({ attributes }) {
	const {
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
		alignment
	} = attributes;

	// Don't render if no SVG content
	if (!svgContent) {
		return null;
	}

	const blockProps = useBlockProps.save({
		className: alignment ? `align${alignment}` : ''
	});

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
			width: width ? `${width}${widthUnit}` : 'auto'
		};

		const transform = getTransformStyle();
		if (transform) {
			styles.transform = transform;
		}

		if (!maintainAspectRatio && height) {
			styles.height = `${height}${heightUnit}`;
		}

		return styles;
	};

	return (
		<div {...blockProps}>
			<div className="prolific-svg-container">
				<div
					className="prolific-svg-wrapper"
					style={getSVGContainerStyle()}
					role={altText ? 'img' : undefined}
					aria-label={altText || undefined}
					dangerouslySetInnerHTML={{ __html: svgContent }}
				/>
			</div>
		</div>
	);
}
