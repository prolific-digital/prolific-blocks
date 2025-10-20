/**
 * Retrieves the translation of text.
 *
 * This import is used for internationalizing strings within the block editor.
 * It ensures that the text in the block can be translated to different languages.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from "@wordpress/i18n";

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * useBlockProps is a custom hook that adds necessary properties
 * to the block's wrapper element.
 *
 * InspectorControls is a component that allows you to add control
 * panels to the block inspector sidebar.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import {
  useBlockProps,
  InspectorControls,
  InnerBlocks,
  useInnerBlocksProps,
} from "@wordpress/block-editor";

/**
 * Import components from WordPress packages.
 *
 * These are pre-built components provided by WordPress for creating
 * control panels and UI elements within the block editor.
 */
import { PanelBody, ToggleControl, SelectControl } from "@wordpress/components";

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * This import allows you to style the block editor interface using SCSS.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import "./editor.scss";
import SupportCard from '../components/SupportCard';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * The edit function is where you define the UI and behavior of your block.
 * It returns the elements to be rendered in the block editor.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */

import { useState } from "@wordpress/element";

const TEMPLATE = [
  ["prolific/timeline-item"],
  ["prolific/timeline-item"],
  ["prolific/timeline-item"],
  ["prolific/timeline-item"],
];

const ALLOWED_BLOCKS = ["prolific/timeline-item"];

export default function Edit({ attributes, setAttributes }) {
  const blockProps = useBlockProps();

  const innerBlocksProps = useInnerBlocksProps(
    {},
    {
      template: [
        ["prolific/timeline-item"],
        ["prolific/timeline-item"],
        ["prolific/timeline-item"],
        ["prolific/timeline-item"],
      ],
      allowedBlocks: ["prolific/timeline-item"],
    }
  );

  return (
    <>
      <div {...blockProps}>
        <div {...innerBlocksProps}></div>
        {/* <InnerBlocks template={TEMPLATE} allowedBlocks={ALLOWED_BLOCKS} /> */}
      </div>
    </>
  );
}
