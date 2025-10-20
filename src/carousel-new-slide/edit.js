/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

/**
 * Default template for new slides.
 * Provides a starting point that users can customize.
 */
const TEMPLATE = [
	['core/image', {}],
	['core/heading', {
		level: 3,
		placeholder: __('Slide Title', 'prolific-blocks'),
		textAlign: 'center',
	}],
	['core/paragraph', {
		placeholder: __('Add your slide description here...', 'prolific-blocks'),
		align: 'center',
	}],
];

/**
 * Edit component for Carousel New Slide block.
 *
 * @param {Object} props - Block props.
 * @param {Object} props.attributes - Block attributes.
 * @param {Function} props.setAttributes - Function to set block attributes.
 * @param {string} props.clientId - Block client ID.
 * @return {JSX.Element} Edit component.
 */
export default function Edit({ attributes, setAttributes, clientId }) {
	const blockProps = useBlockProps({ className: 'swiper-slide' });

	setAttributes({ blockId: blockProps.id });

	return (
		<swiper-slide>
			<div className="carousel-new-slide-inner">
				<InnerBlocks template={TEMPLATE} templateLock={false} />
			</div>
		</swiper-slide>
	);
}
