/**
 * WordPress dependencies
 */
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

/**
 * Save component for the Tabbed Content block
 */
export default function save({ attributes }) {
	const {
		blockId,
		tabs,
		activeTab,
		tabPosition,
		tabAlignment,
		tabStyle,
		mobileBreakpoint,
		mobileBehavior,
		enableUrlHash,
		rememberTab,
	} = attributes;

	const blockProps = useBlockProps.save({
		className: `tab-position-${tabPosition} tab-alignment-${tabAlignment} tab-style-${tabStyle}`,
		'data-block-id': blockId,
		'data-active-tab': activeTab,
		'data-mobile-breakpoint': mobileBreakpoint,
		'data-mobile-behavior': mobileBehavior,
		'data-enable-url-hash': enableUrlHash,
		'data-remember-tab': rememberTab,
	});

	return (
		<div {...blockProps}>
			<div className="tabbed-content__container">
				{/* Tab List */}
				<div
					className="tabbed-content__tabs"
					role="tablist"
					aria-label="Content tabs"
				>
					{tabs.map((tab, index) => (
						<button
							key={tab.id}
							className={`tabbed-content__tab ${
								index === activeTab ? 'is-active' : ''
							}`}
							role="tab"
							aria-selected={index === activeTab}
							aria-controls={`panel-${tab.id}`}
							id={`tab-${tab.id}`}
							data-tab-index={index}
							data-tab-id={tab.id}
							type="button"
						>
							{tab.label}
						</button>
					))}
				</div>

				{/* Tab Panels */}
				<div className="tabbed-content__panels">
					<InnerBlocks.Content />
				</div>
			</div>
		</div>
	);
}
