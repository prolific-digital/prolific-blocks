/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import Edit from './edit';
import metadata from './block.json';
import './editor.scss';
import './style.scss';

/**
 * Register the Query Posts block
 */
registerBlockType(metadata.name, {
	edit: Edit,
	// Rendered via render.php on server-side
	save: () => null,
});
