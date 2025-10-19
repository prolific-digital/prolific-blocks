/**
 * WordPress dependencies
 */
import { useBlockProps } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import { iconPaths } from './icons';

/**
 * Save function for Icon block.
 *
 * @param {Object} props - Component props.
 * @param {Object} props.attributes - Block attributes.
 * @return {JSX.Element} Saved block output.
 */
export default function save({ attributes }) {
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

	const blockProps = useBlockProps.save({
		className: `has-text-align-${alignment}`
	});

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

	const iconElement = (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 512 512"
			style={iconStyle}
			className="prolific-icon"
			aria-label={ariaLabel || undefined}
			role={ariaLabel ? 'img' : undefined}
			aria-hidden={!ariaLabel ? 'true' : undefined}
		>
			<path d={iconPath} />
		</svg>
	);

	return (
		<div {...blockProps}>
			<div className="prolific-icon-wrapper">
				{linkUrl ? (
					<a
						href={linkUrl}
						target={linkTarget ? '_blank' : undefined}
						rel={linkRel || undefined}
					>
						{iconElement}
					</a>
				) : (
					iconElement
				)}
			</div>
		</div>
	);
}
