/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl, ToggleControl, TextControl } from '@wordpress/components';

/**
 * Editor styles
 */
import './editor.scss';

/**
 * Edit component for Breadcrumbs block.
 *
 * @param {Object} props - Component props.
 * @param {Object} props.attributes - Block attributes.
 * @param {Function} props.setAttributes - Function to update attributes.
 * @return {JSX.Element} Block edit component.
 */
export default function Edit({ attributes, setAttributes }) {
	const { divider, showHome, homeLabel, showCurrent } = attributes;

	const blockProps = useBlockProps();

	// Set block ID
	setAttributes({ blockId: blockProps.id });

	// Divider options
	const dividerOptions = [
		{ label: '/', value: 'slash' },
		{ label: '>', value: 'arrow' },
		{ label: '»', value: 'double-arrow' },
		{ label: '|', value: 'pipe' },
		{ label: '·', value: 'dot' },
		{ label: '→', value: 'right-arrow' },
		{ label: '-', value: 'dash' },
	];

	// Get divider symbol based on selection
	const getDividerSymbol = (type) => {
		const option = dividerOptions.find((opt) => opt.value === type);
		return option ? option.label : '/';
	};

	const dividerSymbol = getDividerSymbol(divider);

	return (
		<>
			<div {...blockProps}>
				<nav className="breadcrumbs-preview" aria-label={__('Breadcrumbs', 'prolific-blocks')}>
					<ol className="breadcrumbs-list">
						{showHome && (
							<>
								<li className="breadcrumb-item">
									<a href="#">{homeLabel || __('Home', 'prolific-blocks')}</a>
								</li>
								<li className="breadcrumb-divider" aria-hidden="true">
									{dividerSymbol}
								</li>
							</>
						)}
						<li className="breadcrumb-item">
							<a href="#">{__('Parent Page', 'prolific-blocks')}</a>
						</li>
						<li className="breadcrumb-divider" aria-hidden="true">
							{dividerSymbol}
						</li>
						{showCurrent && (
							<li className="breadcrumb-item breadcrumb-current" aria-current="page">
								{__('Current Page', 'prolific-blocks')}
							</li>
						)}
					</ol>
				</nav>
			</div>

			<InspectorControls>
				<PanelBody title={__('Breadcrumb Settings', 'prolific-blocks')} initialOpen={true}>
					<SelectControl
						label={__('Divider Style', 'prolific-blocks')}
						help={__('Choose the separator between breadcrumb items', 'prolific-blocks')}
						value={divider}
						options={dividerOptions}
						onChange={(value) => setAttributes({ divider: value })}
					/>
					<hr />
					<ToggleControl
						label={__('Show Home Link', 'prolific-blocks')}
						help={__('Display a link to the homepage', 'prolific-blocks')}
						checked={showHome}
						onChange={(value) => setAttributes({ showHome: value })}
					/>
					{showHome && (
						<TextControl
							label={__('Home Label', 'prolific-blocks')}
							help={__('Text to display for the home link', 'prolific-blocks')}
							value={homeLabel}
							onChange={(value) => setAttributes({ homeLabel: value })}
							placeholder={__('Home', 'prolific-blocks')}
						/>
					)}
					<hr />
					<ToggleControl
						label={__('Show Current Page', 'prolific-blocks')}
						help={__('Display the current page in the breadcrumb trail', 'prolific-blocks')}
						checked={showCurrent}
						onChange={(value) => setAttributes({ showCurrent: value })}
					/>
				</PanelBody>
			</InspectorControls>
		</>
	);
}
