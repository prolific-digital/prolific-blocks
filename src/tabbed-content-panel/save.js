/**
 * WordPress dependencies
 */
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

/**
 * Save component for the Tabbed Content Panel block
 */
export default function save({ attributes }) {
	const { tabId, panelIndex } = attributes;

	const blockProps = useBlockProps.save({
		className: 'tabbed-content-panel',
		'data-panel-index': panelIndex,
		'data-tab-id': tabId,
		role: 'tabpanel',
		'aria-labelledby': `tab-${tabId}`,
		'aria-hidden': 'true', // Will be updated by JavaScript
	});

	return (
		<div {...blockProps} id={`panel-${tabId}`}>
			{/* Accordion button for mobile - hidden by default */}
			<button
				className="tabbed-content-panel__accordion-button"
				type="button"
				style={{ display: 'none' }}
				aria-expanded="false"
			>
				<span className="tabbed-content-panel__accordion-label">
					{/* Label will be set by JavaScript */}
				</span>
				<span className="tabbed-content-panel__accordion-icon">+</span>
			</button>

			{/* Panel content */}
			<div className="tabbed-content-panel__content">
				<InnerBlocks.Content />
			</div>
		</div>
	);
}
