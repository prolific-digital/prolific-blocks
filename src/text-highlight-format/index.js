/**
 * Text Highlight Format - Simple span wrapper
 */
import { registerFormatType, toggleFormat } from '@wordpress/rich-text';
import { RichTextToolbarButton } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

import './editor.scss';

const FORMAT_NAME = 'prolific/text-highlight';

registerFormatType(FORMAT_NAME, {
	title: __('Highlight Text', 'prolific-blocks'),
	tagName: 'span',
	className: 'prolific-text-highlight',
	edit: ({ isActive, value, onChange }) => {
		return (
			<RichTextToolbarButton
				icon="admin-customizer"
				title={__('Highlight Text', 'prolific-blocks')}
				onClick={() => {
					onChange(toggleFormat(value, { type: FORMAT_NAME }));
				}}
				isActive={isActive}
			/>
		);
	},
});
