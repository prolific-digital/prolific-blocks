/**
 * Global Custom Attributes
 *
 * Adds custom HTML attributes panel to ALL blocks (core, third-party, and custom)
 * for accessibility, SEO, and Lighthouse optimization.
 *
 * @package Prolific Blocks
 */

import './editor.scss';

import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { Fragment } from '@wordpress/element';
import { InspectorAdvancedControls } from '@wordpress/block-editor';
import { BaseControl, TextControl, Button, Notice } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * List of dangerous attributes that could be used for XSS attacks
 */
const DANGEROUS_ATTRIBUTES = [
	'onclick',
	'onload',
	'onerror',
	'onmouseover',
	'onmouseout',
	'onmousemove',
	'onmouseenter',
	'onmouseleave',
	'onfocus',
	'onblur',
	'onchange',
	'onsubmit',
	'onkeydown',
	'onkeyup',
	'onkeypress',
	'onscroll',
	'ondblclick',
	'oncontextmenu',
	'oninput',
	'ondrag',
	'ondrop',
	'onpaste',
	'oncopy',
	'oncut',
];

/**
 * WordPress-managed attributes that should not be overridden
 */
const PROTECTED_ATTRIBUTES = [
	'class',
	'classname',
	'id',
	'style',
];

/**
 * Validates attribute name
 * Only allows alphanumeric characters, hyphens, underscores, and colons
 *
 * @param {string} name - The attribute name to validate
 * @return {boolean} Whether the attribute name is valid
 */
function isValidAttributeName(name) {
	if (!name || typeof name !== 'string') {
		return false;
	}

	const trimmedName = name.trim().toLowerCase();

	// Check if it's a dangerous attribute
	if (DANGEROUS_ATTRIBUTES.includes(trimmedName)) {
		return false;
	}

	// Check if it's a protected attribute
	if (PROTECTED_ATTRIBUTES.includes(trimmedName)) {
		return false;
	}

	// Validate format: must match alphanumeric, hyphen, underscore, colon
	const validPattern = /^[a-z][a-z0-9\-_:]*$/i;
	return validPattern.test(trimmedName);
}

/**
 * Sanitizes attribute value to prevent XSS
 *
 * @param {string} value - The attribute value to sanitize
 * @return {string} Sanitized value
 */
function sanitizeAttributeValue(value) {
	if (typeof value !== 'string') {
		return '';
	}

	// Remove any HTML tags
	let sanitized = value.replace(/<[^>]*>/g, '');

	// Remove javascript: and data: protocols
	sanitized = sanitized.replace(/javascript:/gi, '');
	sanitized = sanitized.replace(/data:/gi, '');

	return sanitized.trim();
}

/**
 * Add customAttributes attribute to all block types
 *
 * @param {Object} settings - Block settings
 * @return {Object} Modified settings
 */
function addCustomAttributesAttribute(settings) {
	// Skip if block already has customAttributes (shouldn't happen, but defensive)
	if (settings.attributes && settings.attributes.customAttributes) {
		return settings;
	}

	return {
		...settings,
		attributes: {
			...settings.attributes,
			customAttributes: {
				type: 'array',
				default: [],
			},
		},
	};
}

/**
 * Add Inspector Controls for Custom Attributes
 */
const withCustomAttributesControls = createHigherOrderComponent((BlockEdit) => {
	return (props) => {
		const { attributes, setAttributes, name } = props;
		const { customAttributes = [] } = attributes;

		/**
		 * Add a new attribute entry
		 */
		const addAttribute = () => {
			const newAttributes = [
				...customAttributes,
				{ name: '', value: '', id: Date.now() },
			];
			setAttributes({ customAttributes: newAttributes });
		};

		/**
		 * Update an attribute at a specific index
		 *
		 * @param {number} index - Index of the attribute to update
		 * @param {string} field - Field to update ('name' or 'value')
		 * @param {string} newValue - New value for the field
		 */
		const updateAttribute = (index, field, newValue) => {
			const newAttributes = [...customAttributes];
			newAttributes[index] = {
				...newAttributes[index],
				[field]: newValue,
			};
			setAttributes({ customAttributes: newAttributes });
		};

		/**
		 * Remove an attribute at a specific index
		 *
		 * @param {number} index - Index of the attribute to remove
		 */
		const removeAttribute = (index) => {
			const newAttributes = customAttributes.filter((_, i) => i !== index);
			setAttributes({ customAttributes: newAttributes });
		};

		/**
		 * Check if an attribute name is dangerous
		 *
		 * @param {string} attrName - Attribute name to check
		 * @return {boolean} Whether the attribute is dangerous
		 */
		const isDangerous = (attrName) => {
			const normalized = attrName.trim().toLowerCase();
			return DANGEROUS_ATTRIBUTES.includes(normalized) ||
			       PROTECTED_ATTRIBUTES.includes(normalized);
		};

		/**
		 * Get help text based on attribute name
		 *
		 * @param {string} attrName - Attribute name
		 * @return {string} Help text
		 */
		const getHelpText = (attrName) => {
			const normalized = attrName.trim().toLowerCase();

			if (PROTECTED_ATTRIBUTES.includes(normalized)) {
				return __('This attribute is managed by WordPress and cannot be modified here.', 'prolific-blocks');
			}

			if (DANGEROUS_ATTRIBUTES.includes(normalized)) {
				return __('This attribute could pose a security risk and is not allowed.', 'prolific-blocks');
			}

			// Provide helpful examples for common attributes
			const helpTexts = {
				'rel': __('Example: "noopener noreferrer" or "nofollow"', 'prolific-blocks'),
				'aria-label': __('Example: "Click to learn more"', 'prolific-blocks'),
				'aria-labelledby': __('Example: "heading-id"', 'prolific-blocks'),
				'aria-describedby': __('Example: "description-id"', 'prolific-blocks'),
				'role': __('Example: "button", "navigation", "banner"', 'prolific-blocks'),
				'loading': __('Example: "lazy" or "eager"', 'prolific-blocks'),
				'fetchpriority': __('Example: "high", "low", or "auto"', 'prolific-blocks'),
				'autocomplete': __('Example: "email", "name", "tel"', 'prolific-blocks'),
				'target': __('Example: "_blank", "_self"', 'prolific-blocks'),
			};

			return helpTexts[normalized] || '';
		};

		return (
			<Fragment>
				<BlockEdit {...props} />
				<InspectorAdvancedControls>
					<BaseControl
						className="prolific-custom-attributes-section"
						help={__('Add custom HTML attributes to this block for accessibility, SEO, and performance optimization.', 'prolific-blocks')}
					>
						<h3 className="prolific-custom-attributes-heading">
							{__('Custom HTML Attributes', 'prolific-blocks')}
						</h3>

						{customAttributes.length > 0 && (
							<div className="prolific-custom-attributes-list">
								{customAttributes.map((attr, index) => {
									const isDangerousAttr = attr.name && isDangerous(attr.name);
									const helpText = attr.name ? getHelpText(attr.name) : '';

									return (
										<div key={attr.id || index} className="prolific-custom-attribute-item">
											<TextControl
												label={__('Attribute Name', 'prolific-blocks')}
												value={attr.name}
												onChange={(value) => updateAttribute(index, 'name', value)}
												placeholder="e.g., aria-label, rel, data-custom"
												help={helpText}
											/>

											{isDangerousAttr && (
												<Notice
													status="error"
													isDismissible={false}
													className="prolific-attribute-warning"
												>
													{getHelpText(attr.name)}
												</Notice>
											)}

											<TextControl
												label={__('Attribute Value', 'prolific-blocks')}
												value={attr.value}
												onChange={(value) => updateAttribute(index, 'value', value)}
												placeholder="e.g., Click here, noopener noreferrer"
												disabled={isDangerousAttr}
											/>

											<Button
												isDestructive
												variant="secondary"
												onClick={() => removeAttribute(index)}
												className="prolific-remove-attribute"
											>
												{__('Remove Attribute', 'prolific-blocks')}
											</Button>

											{index < customAttributes.length - 1 && (
												<hr className="prolific-attribute-separator" />
											)}
										</div>
									);
								})}
							</div>
						)}

						<Button
							variant="primary"
							onClick={addAttribute}
							className="prolific-add-attribute"
						>
							{__('+ Add Attribute', 'prolific-blocks')}
						</Button>

						<div className="prolific-attributes-help">
							<p><strong>{__('Common Use Cases:', 'prolific-blocks')}</strong></p>
							<ul>
								<li><code>rel="noopener noreferrer"</code> - {__('For external links', 'prolific-blocks')}</li>
								<li><code>aria-label="..."</code> - {__('For screen readers', 'prolific-blocks')}</li>
								<li><code>loading="lazy"</code> - {__('For image lazy loading', 'prolific-blocks')}</li>
								<li><code>role="button"</code> - {__('For ARIA roles', 'prolific-blocks')}</li>
								<li><code>data-*="..."</code> - {__('For custom data attributes', 'prolific-blocks')}</li>
							</ul>
						</div>
					</BaseControl>
				</InspectorAdvancedControls>
			</Fragment>
		);
	};
}, 'withCustomAttributesControls');

/**
 * Apply custom attributes to block wrapper on save
 *
 * @param {Object} extraProps - Extra props to add to the block wrapper
 * @param {Object} blockType - Block type object
 * @param {Object} attributes - Block attributes
 * @return {Object} Modified extra props
 */
function applyCustomAttributes(extraProps, blockType, attributes) {
	const { customAttributes = [] } = attributes;

	if (customAttributes.length > 0) {
		customAttributes.forEach((attr) => {
			// Skip if attribute is incomplete
			if (!attr.name || !attr.value) {
				return;
			}

			// Validate and sanitize
			const attrName = attr.name.trim().toLowerCase();

			if (!isValidAttributeName(attrName)) {
				return;
			}

			const attrValue = sanitizeAttributeValue(attr.value);

			if (!attrValue) {
				return;
			}

			// Apply the attribute
			// Use the original case for the attribute name, but validate with lowercase
			extraProps[attr.name.trim()] = attrValue;
		});
	}

	return extraProps;
}

/**
 * Apply custom attributes in the editor (for preview)
 * This ensures attributes are visible in the editor as well as on the frontend
 *
 * @param {Object} BlockListBlock - Original BlockListBlock component
 * @return {Object} Wrapped component
 */
const withCustomAttributesInEditor = createHigherOrderComponent((BlockListBlock) => {
	return (props) => {
		const { attributes, block } = props;
		const { customAttributes = [] } = attributes;

		if (customAttributes.length === 0) {
			return <BlockListBlock {...props} />;
		}

		// Build custom props object
		const customProps = {};

		customAttributes.forEach((attr) => {
			if (!attr.name || !attr.value) {
				return;
			}

			const attrName = attr.name.trim().toLowerCase();

			if (!isValidAttributeName(attrName)) {
				return;
			}

			const attrValue = sanitizeAttributeValue(attr.value);

			if (!attrValue) {
				return;
			}

			customProps[attr.name.trim()] = attrValue;
		});

		// Merge with existing wrapper props
		const wrapperProps = {
			...props.wrapperProps,
			...customProps,
		};

		return <BlockListBlock {...props} wrapperProps={wrapperProps} />;
	};
}, 'withCustomAttributesInEditor');

// Register filters
addFilter(
	'blocks.registerBlockType',
	'prolific/custom-attributes',
	addCustomAttributesAttribute
);

addFilter(
	'editor.BlockEdit',
	'prolific/custom-attributes-controls',
	withCustomAttributesControls
);

addFilter(
	'blocks.getSaveContent.extraProps',
	'prolific/apply-custom-attributes',
	applyCustomAttributes
);

addFilter(
	'editor.BlockListBlock',
	'prolific/custom-attributes-editor',
	withCustomAttributesInEditor
);
