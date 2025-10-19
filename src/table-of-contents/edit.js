/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	ToggleControl,
	TextControl,
	RangeControl,
	Notice
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';

/**
 * Editor styles
 */
import './editor.scss';

/**
 * Helper function to slugify heading text into anchor IDs
 *
 * @param {string} text - The heading text to slugify
 * @return {string} Slugified text suitable for use as an anchor ID
 */
function slugify(text) {
	return text
		.toString()
		.toLowerCase()
		.trim()
		.replace(/\s+/g, '-')        // Replace spaces with -
		.replace(/[^\w\-]+/g, '')    // Remove all non-word chars
		.replace(/\-\-+/g, '-')      // Replace multiple - with single -
		.replace(/^-+/, '')          // Trim - from start of text
		.replace(/-+$/, '');         // Trim - from end of text
}

/**
 * Extract text content from heading block
 *
 * @param {Object} block - The heading block object
 * @return {string} The text content of the heading
 */
function getHeadingText(block) {
	if (!block || !block.attributes) {
		return '';
	}

	// Get content from the heading block
	const content = block.attributes.content || '';

	// Strip HTML tags to get plain text
	const div = document.createElement('div');
	div.innerHTML = content;
	return div.textContent || div.innerText || '';
}

/**
 * Edit component for Table of Contents block.
 *
 * @param {Object} props - Component props.
 * @param {Object} props.attributes - Block attributes.
 * @param {Function} props.setAttributes - Function to update attributes.
 * @return {JSX.Element} Block edit component.
 */
export default function Edit({ attributes, setAttributes }) {
	const {
		title,
		showTitle,
		includeH1,
		includeH2,
		includeH3,
		includeH4,
		includeH5,
		includeH6,
		numbered,
		collapsible,
		smoothScroll,
		scrollOffset
	} = attributes;

	const blockProps = useBlockProps();

	// Set block ID
	useEffect(() => {
		if (blockProps.id && blockProps.id !== attributes.blockId) {
			setAttributes({ blockId: blockProps.id });
		}
	}, [blockProps.id]);

	// Get all blocks from the editor
	const headings = useSelect((select) => {
		const { getBlocks } = select('core/block-editor');
		const allBlocks = getBlocks();

		// Filter for heading blocks
		const headingBlocks = [];
		const anchorCounts = {};

		const findHeadings = (blocks) => {
			blocks.forEach((block) => {
				if (block.name === 'core/heading') {
					const level = block.attributes.level || 2;
					const text = getHeadingText(block);

					// Process ALL headings to track anchor counts
					if (text) {
						// Get or generate base anchor
						const baseAnchor = block.attributes.anchor || slugify(text);

						// CRITICAL: Track anchor counts for ALL headings, not just filtered ones
						// This ensures ID generation matches server-side render.php
						if (!anchorCounts[baseAnchor]) {
							anchorCounts[baseAnchor] = 0;
						}

						anchorCounts[baseAnchor]++;

						// Generate final anchor with counter if duplicate
						const anchor = anchorCounts[baseAnchor] > 1
							? `${baseAnchor}-${anchorCounts[baseAnchor]}`
							: baseAnchor;

						// Add ALL headings to the list (filtering happens later)
						headingBlocks.push({
							level,
							text,
							anchor,
							clientId: block.clientId
						});
					}
				}

				// Recursively check inner blocks
				if (block.innerBlocks && block.innerBlocks.length > 0) {
					findHeadings(block.innerBlocks);
				}
			});
		};

		findHeadings(allBlocks);
		return headingBlocks;
	}, []);

	// Filter headings based on selected levels
	const filteredHeadings = headings.filter((heading) => {
		switch (heading.level) {
			case 1:
				return includeH1;
			case 2:
				return includeH2;
			case 3:
				return includeH3;
			case 4:
				return includeH4;
			case 5:
				return includeH5;
			case 6:
				return includeH6;
			default:
				return false;
		}
	});

	// Build nested structure for display
	const buildNestedList = (items) => {
		if (!items || items.length === 0) {
			return null;
		}

		const result = [];
		const stack = [];

		items.forEach((item) => {
			const listItem = {
				...item,
				children: []
			};

			// Find the parent level
			while (stack.length > 0 && stack[stack.length - 1].level >= item.level) {
				stack.pop();
			}

			if (stack.length === 0) {
				result.push(listItem);
			} else {
				stack[stack.length - 1].children.push(listItem);
			}

			stack.push(listItem);
		});

		return result;
	};

	// Render nested list
	const renderList = (items, depth = 0) => {
		if (!items || items.length === 0) {
			return null;
		}

		const ListTag = numbered ? 'ol' : 'ul';

		return (
			<ListTag className={`toc-list toc-list-level-${depth}`}>
				{items.map((item, index) => (
					<li key={`${item.anchor}-${index}`} className="toc-item">
						<a href={`#${item.anchor}`} className="toc-link">
							{item.text}
						</a>
						{item.children && item.children.length > 0 && renderList(item.children, depth + 1)}
					</li>
				))}
			</ListTag>
		);
	};

	const nestedHeadings = buildNestedList(filteredHeadings);

	return (
		<>
			<div {...blockProps}>
				<div className="wp-block-prolific-table-of-contents">
					{showTitle && title && (
						<div className="toc-header">
							<h2 className="toc-title">{title}</h2>
							{collapsible && (
								<button
									className="toc-toggle"
									aria-label={__('Toggle table of contents', 'prolific-blocks')}
									type="button"
								>
									<span className="toc-toggle-icon"></span>
								</button>
							)}
						</div>
					)}

					<div className="toc-content">
						{filteredHeadings.length === 0 ? (
							<Notice status="warning" isDismissible={false}>
								{__('No headings found. Add heading blocks to your page to generate the table of contents.', 'prolific-blocks')}
							</Notice>
						) : (
							<nav className="toc-navigation" aria-label={__('Table of contents', 'prolific-blocks')}>
								{renderList(nestedHeadings)}
							</nav>
						)}
					</div>
				</div>
			</div>

			<InspectorControls>
				<PanelBody title={__('Display Settings', 'prolific-blocks')} initialOpen={true}>
					<ToggleControl
						label={__('Show Title', 'prolific-blocks')}
						help={__('Display the table of contents title', 'prolific-blocks')}
						checked={showTitle}
						onChange={(value) => setAttributes({ showTitle: value })}
					/>

					{showTitle && (
						<TextControl
							label={__('Title Text', 'prolific-blocks')}
							help={__('Customize the title of the table of contents', 'prolific-blocks')}
							value={title}
							onChange={(value) => setAttributes({ title: value })}
							placeholder={__('Table of Contents', 'prolific-blocks')}
						/>
					)}

					<hr />

					<ToggleControl
						label={__('Numbered List', 'prolific-blocks')}
						help={__('Display as numbered list instead of bullets', 'prolific-blocks')}
						checked={numbered}
						onChange={(value) => setAttributes({ numbered: value })}
					/>

					<ToggleControl
						label={__('Collapsible', 'prolific-blocks')}
						help={__('Allow users to expand/collapse the table of contents', 'prolific-blocks')}
						checked={collapsible}
						onChange={(value) => setAttributes({ collapsible: value })}
					/>
				</PanelBody>

				<PanelBody title={__('Heading Levels', 'prolific-blocks')} initialOpen={true}>
					<p className="components-base-control__help">
						{__('Select which heading levels to include in the table of contents', 'prolific-blocks')}
					</p>

					<ToggleControl
						label={__('Include H1', 'prolific-blocks')}
						checked={includeH1}
						onChange={(value) => setAttributes({ includeH1: value })}
					/>

					<ToggleControl
						label={__('Include H2', 'prolific-blocks')}
						checked={includeH2}
						onChange={(value) => setAttributes({ includeH2: value })}
					/>

					<ToggleControl
						label={__('Include H3', 'prolific-blocks')}
						checked={includeH3}
						onChange={(value) => setAttributes({ includeH3: value })}
					/>

					<ToggleControl
						label={__('Include H4', 'prolific-blocks')}
						checked={includeH4}
						onChange={(value) => setAttributes({ includeH4: value })}
					/>

					<ToggleControl
						label={__('Include H5', 'prolific-blocks')}
						checked={includeH5}
						onChange={(value) => setAttributes({ includeH5: value })}
					/>

					<ToggleControl
						label={__('Include H6', 'prolific-blocks')}
						checked={includeH6}
						onChange={(value) => setAttributes({ includeH6: value })}
					/>
				</PanelBody>

				<PanelBody title={__('Behavior Settings', 'prolific-blocks')} initialOpen={false}>
					<ToggleControl
						label={__('Smooth Scroll', 'prolific-blocks')}
						help={__('Enable smooth scrolling when clicking on links', 'prolific-blocks')}
						checked={smoothScroll}
						onChange={(value) => setAttributes({ smoothScroll: value })}
					/>

					<RangeControl
						label={__('Scroll Offset (px)', 'prolific-blocks')}
						help={__('Offset for sticky headers. Adjusts scroll position when jumping to headings.', 'prolific-blocks')}
						value={scrollOffset}
						onChange={(value) => setAttributes({ scrollOffset: value })}
						min={0}
						max={200}
						step={5}
					/>
				</PanelBody>
			</InspectorControls>
		</>
	);
}
