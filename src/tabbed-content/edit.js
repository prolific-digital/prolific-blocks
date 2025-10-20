/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	InspectorControls,
	InnerBlocks,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
import {
	PanelBody,
	SelectControl,
	RangeControl,
	ToggleControl,
	Button,
	TextControl,
	ButtonGroup,
	__experimentalHStack as HStack,
	__experimentalVStack as VStack,
	Disabled,
} from '@wordpress/components';
import { useState, useEffect, useCallback } from '@wordpress/element';
import { dragHandle, plus, cog } from '@wordpress/icons';
import { useSelect, useDispatch } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import './editor.scss';
import SupportCard from '../components/SupportCard';

/**
 * Edit component for the Tabbed Content block
 */
export default function Edit({ attributes, setAttributes, clientId }) {
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

	const blockProps = useBlockProps({
		className: `tab-position-${tabPosition} tab-alignment-${tabAlignment} tab-style-${tabStyle}`,
	});

	// Set unique block ID on mount
	useEffect(() => {
		if (!blockId) {
			setAttributes({ blockId: clientId });
		}
	}, [clientId, blockId, setAttributes]);

	// Get inner blocks
	const { innerBlocks } = useSelect(
		(select) => ({
			innerBlocks: select('core/block-editor').getBlocks(clientId),
		}),
		[clientId]
	);

	// Get block insertion, removal, selection, and move functions
	const { insertBlock, removeBlock, selectBlock, moveBlocksToPosition } = useDispatch('core/block-editor');

	// Function to select the parent tabbed content block
	const selectParentBlock = useCallback(() => {
		selectBlock(clientId);
	}, [selectBlock, clientId]);

	// Template for inner blocks - create a panel for each tab
	const template = tabs.map((tab) => [
		'prolific/tabbed-content-panel',
		{ tabId: tab.id },
	]);

	const innerBlocksProps = useInnerBlocksProps(
		{ className: 'tabbed-content__panels' },
		{
			allowedBlocks: ['prolific/tabbed-content-panel'],
			template,
			templateLock: 'all',
			renderAppender: false,
		}
	);

	/**
	 * Add a new tab
	 */
	const handleAddTab = useCallback(() => {
		const newTabId = `tab-${Date.now()}`;
		const newTabs = [
			...tabs,
			{
				id: newTabId,
				label: `Tab ${tabs.length + 1}`,
			},
		];
		setAttributes({ tabs: newTabs });

		// Create new tab panel block
		const newPanel = createBlock('prolific/tabbed-content-panel', { tabId: newTabId });
		const newPanelIndex = innerBlocks.length;
		insertBlock(newPanel, newPanelIndex, clientId);

		// Set the new tab as active
		setAttributes({ activeTab: tabs.length });
	}, [tabs, setAttributes, insertBlock, innerBlocks.length, clientId]);

	/**
	 * Remove a tab
	 */
	const handleRemoveTab = (index) => {
		if (tabs.length <= 1) {
			return; // Don't allow removing the last tab
		}

		// First update the tabs array
		const newTabs = tabs.filter((_, i) => i !== index);

		// Adjust active tab BEFORE removing the block
		let newActiveTab = activeTab;
		if (activeTab >= newTabs.length) {
			newActiveTab = newTabs.length - 1;
		} else if (activeTab === index && index > 0) {
			newActiveTab = index - 1;
		} else if (activeTab > index) {
			// If active tab is after the removed tab, decrement it
			newActiveTab = activeTab - 1;
		}

		// Update attributes FIRST
		setAttributes({
			tabs: newTabs,
			activeTab: newActiveTab
		});

		// THEN remove the corresponding inner block
		// Use setTimeout to ensure the state update happens first
		setTimeout(() => {
			if (innerBlocks[index]) {
				removeBlock(innerBlocks[index].clientId, false);
			}
		}, 0);
	};

	/**
	 * Update tab label
	 */
	const handleTabLabelChange = (index, label) => {
		const newTabs = [...tabs];
		newTabs[index].label = label;
		setAttributes({ tabs: newTabs });
	};

	/**
	 * Move tab up
	 */
	const moveTabUp = (index) => {
		if (index === 0) return;

		// Swap tabs in array
		const newTabs = [...tabs];
		[newTabs[index - 1], newTabs[index]] = [
			newTabs[index],
			newTabs[index - 1],
		];

		// Update active tab if needed
		let newActiveTab = activeTab;
		if (activeTab === index) {
			newActiveTab = index - 1;
		} else if (activeTab === index - 1) {
			newActiveTab = index;
		}

		setAttributes({ tabs: newTabs, activeTab: newActiveTab });

		// Move the corresponding inner blocks to match
		if (innerBlocks[index]) {
			moveBlocksToPosition(
				[innerBlocks[index].clientId],
				clientId,
				clientId,
				index - 1
			);
		}
	};

	/**
	 * Move tab down
	 */
	const moveTabDown = (index) => {
		if (index === tabs.length - 1) return;

		// Swap tabs in array
		const newTabs = [...tabs];
		[newTabs[index], newTabs[index + 1]] = [
			newTabs[index + 1],
			newTabs[index],
		];

		// Update active tab if needed
		let newActiveTab = activeTab;
		if (activeTab === index) {
			newActiveTab = index + 1;
		} else if (activeTab === index + 1) {
			newActiveTab = index;
		}

		setAttributes({ tabs: newTabs, activeTab: newActiveTab });

		// Move the corresponding inner blocks to match
		if (innerBlocks[index]) {
			moveBlocksToPosition(
				[innerBlocks[index].clientId],
				clientId,
				clientId,
				index + 1
			);
		}
	};

	/**
	 * Set active tab
	 */
	const setActiveTabIndex = (index) => {
		setAttributes({ activeTab: index });
	};

	return (
		<>
			<InspectorControls>
				<SupportCard />
				{/* Documentation Notice */}
				<PanelBody>
					<p className="components-base-control__help" style={{ marginTop: 0, marginBottom: 0 }}>
						{__('Configure your tabbed content settings and manage individual tabs below.', 'prolific-blocks')}
					</p>
				</PanelBody>

				<PanelBody title={__('Tab Settings', 'prolific-blocks')} initialOpen={true}>
					<VStack spacing={3}>
						{tabs.map((tab, index) => (
							<div key={tab.id} className="tab-control-item">
								<HStack spacing={2}>
									<div style={{ flex: 1 }}>
										<TextControl
											label={__('Tab Label', 'prolific-blocks')}
											value={tab.label}
											onChange={(label) =>
												handleTabLabelChange(index, label)
											}
										/>
									</div>
								</HStack>
								<HStack spacing={2} justify="flex-start">
									<Button
										isSmall
										variant="secondary"
										onClick={() => moveTabUp(index)}
										disabled={index === 0}
									>
										{__('↑', 'prolific-blocks')}
									</Button>
									<Button
										isSmall
										variant="secondary"
										onClick={() => moveTabDown(index)}
										disabled={index === tabs.length - 1}
									>
										{__('↓', 'prolific-blocks')}
									</Button>
									<Button
										isSmall
										isDestructive
										variant="secondary"
										onClick={() => handleRemoveTab(index)}
										disabled={tabs.length <= 1}
									>
										{__('Remove', 'prolific-blocks')}
									</Button>
								</HStack>
							</div>
						))}
						<Button variant="primary" onClick={handleAddTab}>
							{__('Add Tab', 'prolific-blocks')}
						</Button>
					</VStack>
				</PanelBody>

				<PanelBody title={__('Layout Settings', 'prolific-blocks')}>
					<SelectControl
						label={__('Tab Position', 'prolific-blocks')}
						value={tabPosition}
						options={[
							{ label: __('Top', 'prolific-blocks'), value: 'top' },
							{ label: __('Bottom', 'prolific-blocks'), value: 'bottom' },
							{ label: __('Left', 'prolific-blocks'), value: 'left' },
							{ label: __('Right', 'prolific-blocks'), value: 'right' },
						]}
						onChange={(value) => setAttributes({ tabPosition: value })}
						help={__(
							'Position of tabs relative to content',
							'prolific-blocks'
						)}
					/>

					<SelectControl
						label={__('Tab Alignment', 'prolific-blocks')}
						value={tabAlignment}
						options={[
							{ label: __('Left', 'prolific-blocks'), value: 'left' },
							{ label: __('Center', 'prolific-blocks'), value: 'center' },
							{ label: __('Right', 'prolific-blocks'), value: 'right' },
							{
								label: __('Justified', 'prolific-blocks'),
								value: 'justified',
							},
						]}
						onChange={(value) => setAttributes({ tabAlignment: value })}
						help={__(
							'Horizontal alignment of tabs',
							'prolific-blocks'
						)}
					/>

					<SelectControl
						label={__('Tab Style', 'prolific-blocks')}
						value={tabStyle}
						options={[
							{ label: __('Default (Underline)', 'prolific-blocks'), value: 'default' },
							{ label: __('Boxed', 'prolific-blocks'), value: 'boxed' },
							{ label: __('Pills', 'prolific-blocks'), value: 'pills' },
							{ label: __('Minimal', 'prolific-blocks'), value: 'minimal' },
						]}
						onChange={(value) => setAttributes({ tabStyle: value })}
						help={__('Visual style of tab buttons', 'prolific-blocks')}
					/>

					<SelectControl
						label={__('Initial Active Tab', 'prolific-blocks')}
						value={activeTab}
						options={tabs.map((tab, index) => ({
							label: tab.label,
							value: index,
						}))}
						onChange={(value) =>
							setAttributes({ activeTab: parseInt(value) })
						}
						help={__(
							'Which tab is active when the page loads',
							'prolific-blocks'
						)}
					/>
				</PanelBody>

				<PanelBody title={__('Mobile Settings', 'prolific-blocks')}>
					<SelectControl
						label={__('Mobile Behavior', 'prolific-blocks')}
						value={mobileBehavior}
						options={[
							{ label: __('Same as Desktop', 'prolific-blocks'), value: 'same' },
							{
								label: __('Stack Vertically', 'prolific-blocks'),
								value: 'stack',
							},
							{
								label: __('Accordion Style', 'prolific-blocks'),
								value: 'accordion',
							},
						]}
						onChange={(value) => setAttributes({ mobileBehavior: value })}
						help={__(
							'How tabs should display on mobile devices',
							'prolific-blocks'
						)}
					/>

					<RangeControl
						label={__('Mobile Breakpoint (px)', 'prolific-blocks')}
						value={mobileBreakpoint}
						onChange={(value) => setAttributes({ mobileBreakpoint: value })}
						min={320}
						max={1024}
						step={1}
						help={__(
							'Screen width where mobile behavior activates',
							'prolific-blocks'
						)}
					/>
				</PanelBody>

				<PanelBody title={__('Advanced Settings', 'prolific-blocks')}>
					<ToggleControl
						label={__('Enable URL Hash Navigation', 'prolific-blocks')}
						checked={enableUrlHash}
						onChange={(value) => setAttributes({ enableUrlHash: value })}
						help={__(
							'Allow linking to specific tabs via URL hash (#tab-1)',
							'prolific-blocks'
						)}
					/>

					<ToggleControl
						label={__('Remember Active Tab', 'prolific-blocks')}
						checked={rememberTab}
						onChange={(value) => setAttributes({ rememberTab: value })}
						help={__(
							'Remember last active tab using localStorage',
							'prolific-blocks'
						)}
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				{/* Helper Bar - Above Tabbed Content */}
				<div className="tabbed-content-helper-bar">
					<div className="tabbed-content-helper-info">
						<span className="dashicons dashicons-table-col-after"></span>
						<span>{__('Tabbed Content Block', 'prolific-blocks')}</span>
						<span className="tabbed-content-tab-count">
							{tabs.length} {tabs.length === 1 ? __('tab', 'prolific-blocks') : __('tabs', 'prolific-blocks')}
						</span>
					</div>
					<div className="tabbed-content-helper-actions">
						<Button
							variant="secondary"
							onClick={handleAddTab}
							icon={plus}
							className="tabbed-content-add-tab-button"
						>
							{__('Add New Tab', 'prolific-blocks')}
						</Button>
						<Button
							variant="secondary"
							onClick={selectParentBlock}
							icon={cog}
							className="tabbed-content-settings-button"
						>
							{__('Tab Settings', 'prolific-blocks')}
						</Button>
					</div>
				</div>

				<div className="tabbed-content__container">
					{/* Tab List */}
					<div
						className="tabbed-content__tabs"
						role="tablist"
						aria-label={__('Content tabs', 'prolific-blocks')}
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
								onClick={() => setActiveTabIndex(index)}
								type="button"
							>
								{tab.label}
							</button>
						))}
					</div>

					{/* Tab Panels */}
					<div {...innerBlocksProps} />
				</div>
			</div>
		</>
	);
}
