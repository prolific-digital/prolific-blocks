/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	ToggleControl,
	RangeControl,
	SelectControl
} from '@wordpress/components';

/**
 * Editor styles
 */
import './editor.scss';
import SupportCard from '../components/SupportCard';

/**
 * Edit component for Anchor Navigation block.
 *
 * @param {Object} props - Component props.
 * @param {Object} props.attributes - Block attributes.
 * @param {Function} props.setAttributes - Function to update attributes.
 * @return {JSX.Element} Block edit component.
 */
export default function Edit({ attributes, setAttributes }) {
	const {
		includeH1,
		includeH2,
		includeH3,
		includeH4,
		includeH5,
		includeH6,
		smoothScroll,
		scrollOffset,
		sticky,
		stickyOffset,
		styleVariation,
		alignment,
		mobileStyle,
		mobileBreakpoint
	} = attributes;

	const blockProps = useBlockProps({
		className: `anchor-nav-style-${styleVariation} anchor-nav-align-${alignment}${sticky ? ' is-sticky' : ''}`
	});

	// Set block ID
	setAttributes({ blockId: blockProps.id });

	// Preview links (example data)
	const previewLinks = [
		{ text: 'Introduction', href: '#introduction' },
		{ text: 'Features', href: '#features' },
		{ text: 'Pricing', href: '#pricing' },
		{ text: 'FAQ', href: '#faq' }
	];

	return (
		<>
			<div {...blockProps}>
				{sticky && (
					<div className="anchor-nav-sticky-notice">
						{__('This navigation will stick to the top when scrolling', 'prolific-blocks')}
					</div>
				)}
				<nav className="anchor-navigation" aria-label={__('Jump to section', 'prolific-blocks')}>
					<ul className="anchor-nav-list">
						{previewLinks.map((link, index) => (
							<li key={index} className="anchor-nav-item">
								<a href={link.href} className="anchor-nav-link">
									{link.text}
								</a>
							</li>
						))}
					</ul>
				</nav>
				<div className="anchor-nav-notice">
					{__('Preview: Navigation will auto-generate from page headings on the frontend', 'prolific-blocks')}
				</div>
			</div>

			<InspectorControls>
				<SupportCard />
				<PanelBody title={__('Heading Levels', 'prolific-blocks')} initialOpen={true}>
					<p className="components-base-control__help">
						{__('Select which heading levels to include in the navigation', 'prolific-blocks')}
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

				<PanelBody title={__('Navigation Settings', 'prolific-blocks')} initialOpen={true}>
					<ToggleControl
						label={__('Smooth Scroll', 'prolific-blocks')}
						help={__('Enable smooth scrolling to sections', 'prolific-blocks')}
						checked={smoothScroll}
						onChange={(value) => setAttributes({ smoothScroll: value })}
					/>
					<RangeControl
						label={__('Scroll Offset (px)', 'prolific-blocks')}
						help={__('Offset for sticky headers or spacing', 'prolific-blocks')}
						value={scrollOffset}
						onChange={(value) => setAttributes({ scrollOffset: value })}
						min={0}
						max={200}
						step={10}
					/>
					<hr />
					<ToggleControl
						label={__('Sticky Positioning', 'prolific-blocks')}
						help={__('Navigation sticks to top when scrolling', 'prolific-blocks')}
						checked={sticky}
						onChange={(value) => setAttributes({ sticky: value })}
					/>
					{sticky && (
						<RangeControl
							label={__('Sticky Offset (px)', 'prolific-blocks')}
							help={__('Top offset when sticky (for admin bar, etc.)', 'prolific-blocks')}
							value={stickyOffset}
							onChange={(value) => setAttributes({ stickyOffset: value })}
							min={0}
							max={200}
							step={10}
						/>
					)}
				</PanelBody>

				<PanelBody title={__('Style', 'prolific-blocks')} initialOpen={true}>
					<SelectControl
						label={__('Style Variation', 'prolific-blocks')}
						value={styleVariation}
						options={[
							{ label: __('Pills', 'prolific-blocks'), value: 'pills' },
							{ label: __('Underline', 'prolific-blocks'), value: 'underline' },
							{ label: __('Bordered', 'prolific-blocks'), value: 'bordered' },
							{ label: __('Minimal', 'prolific-blocks'), value: 'minimal' }
						]}
						onChange={(value) => setAttributes({ styleVariation: value })}
					/>
					<SelectControl
						label={__('Alignment', 'prolific-blocks')}
						value={alignment}
						options={[
							{ label: __('Left', 'prolific-blocks'), value: 'left' },
							{ label: __('Center', 'prolific-blocks'), value: 'center' },
							{ label: __('Right', 'prolific-blocks'), value: 'right' },
							{ label: __('Space Between', 'prolific-blocks'), value: 'space-between' }
						]}
						onChange={(value) => setAttributes({ alignment: value })}
					/>
				</PanelBody>

				<PanelBody title={__('Mobile Settings', 'prolific-blocks')} initialOpen={false}>
					<SelectControl
						label={__('Mobile Style', 'prolific-blocks')}
						value={mobileStyle}
						options={[
							{ label: __('Horizontal Scroll', 'prolific-blocks'), value: 'scroll' },
							{ label: __('Stack Vertical', 'prolific-blocks'), value: 'stack' }
						]}
						onChange={(value) => setAttributes({ mobileStyle: value })}
					/>
					<RangeControl
						label={__('Mobile Breakpoint (px)', 'prolific-blocks')}
						value={mobileBreakpoint}
						onChange={(value) => setAttributes({ mobileBreakpoint: value })}
						min={320}
						max={1024}
						step={1}
					/>
				</PanelBody>
			</InspectorControls>
		</>
	);
}
