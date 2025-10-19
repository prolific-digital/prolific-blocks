/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	InnerBlocks,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
import { useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import './editor.scss';

/**
 * Edit component for the Tabbed Content Panel block
 */
export default function Edit({ attributes, setAttributes, context }) {
	const { tabId, panelIndex } = attributes;
	const {
		'prolific/tabbedContent/blockId': parentBlockId,
		'prolific/tabbedContent/tabs': tabs,
		'prolific/tabbedContent/activeTab': activeTab,
	} = context;

	// Find this panel's index in the tabs array
	useEffect(() => {
		if (tabs && tabId) {
			const index = tabs.findIndex((tab) => tab.id === tabId);
			if (index !== -1 && index !== panelIndex) {
				setAttributes({ panelIndex: index });
			}
		}
	}, [tabs, tabId, panelIndex, setAttributes]);

	const isActive = panelIndex === activeTab;

	const blockProps = useBlockProps({
		className: `tabbed-content-panel ${isActive ? 'is-active' : ''}`,
		'data-panel-index': panelIndex,
		'data-tab-id': tabId,
	});

	const innerBlocksProps = useInnerBlocksProps(
		{ className: 'tabbed-content-panel__content' },
		{
			template: [
				[
					'core/heading',
					{
						level: 3,
						placeholder: __('Panel heading...', 'prolific-blocks'),
					},
				],
				[
					'core/paragraph',
					{
						placeholder: __(
							'Add your tab content here...',
							'prolific-blocks'
						),
					},
				],
			],
			templateLock: false,
		}
	);

	// Get the label for this panel from the tabs array
	const tabLabel =
		tabs && tabs[panelIndex] ? tabs[panelIndex].label : `Tab ${panelIndex + 1}`;

	return (
		<div {...blockProps} role="tabpanel" aria-labelledby={`tab-${tabId}`}>
			{/* Accordion button for mobile - hidden on desktop */}
			<button
				className="tabbed-content-panel__accordion-button"
				type="button"
			>
				<span className="tabbed-content-panel__accordion-label">
					{tabLabel}
				</span>
				<span className="tabbed-content-panel__accordion-icon">
					{isActive ? '−' : '+'}
				</span>
			</button>

			{/* Panel content */}
			<div {...innerBlocksProps} />
		</div>
	);
}
