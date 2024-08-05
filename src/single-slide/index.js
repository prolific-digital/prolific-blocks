/**
 * Registers a new block provided a unique name and an object defining its behavior.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
import { registerBlockType } from "@wordpress/blocks";

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * All files containing `style` keyword are bundled together. The code used
 * gets applied both to the front of your site and to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import "./style.scss";

/**
 * Internal dependencies
 */
import Edit from "./edit";
import save from "./save";
import metadata from "./block.json";

/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
registerBlockType(metadata.name, {
  icon: {
    src: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
        <path d="M256 32c-17.7 0-32 14.3-32 32l0 384c0 17.7 14.3 32 32 32l256 0c17.7 0 32-14.3 32-32l0-384c0-17.7-14.3-32-32-32L256 32zM192 64c0-35.3 28.7-64 64-64L512 0c35.3 0 64 28.7 64 64l0 384c0 35.3-28.7 64-64 64l-256 0c-35.3 0-64-28.7-64-64l0-384zM96 64c0-8.8 7.2-16 16-16s16 7.2 16 16l0 384c0 8.8-7.2 16-16 16s-16-7.2-16-16L96 64zM0 112c0-8.8 7.2-16 16-16s16 7.2 16 16l0 288c0 8.8-7.2 16-16 16s-16-7.2-16-16L0 112z" />
      </svg>
    ),
  },
  /**
   * @see ./edit.js
   */
  edit: Edit,

  /**
   * @see ./save.js
   */
  save,
});
