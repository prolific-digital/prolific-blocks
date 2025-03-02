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
  InnerBlocks,
  useInnerBlocksProps,
} from "@wordpress/block-editor";

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * This import allows you to style the block editor interface using SCSS.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import "./editor.scss";

export default function Edit({ attributes, setAttributes }) {
  const blockProps = useBlockProps();

  setAttributes({ blockId: blockProps.id });

  const innerBlocksProps = useInnerBlocksProps(
    { className: "tab-panel" },
    {
      template: [
        ["core/heading", { placeholder: "Lorem ipsum dolor" }],
        [
          "core/paragraph",
          {
            placeholder:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
          },
        ],
      ],
    }
  );

  return (
    <>
      <div {...blockProps} {...innerBlocksProps}></div>
    </>
  );
}
