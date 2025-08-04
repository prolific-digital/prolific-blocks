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
import { useBlockProps, InnerBlocks } from "@wordpress/block-editor";
import { useEffect } from "@wordpress/element";

const TEMPLATE = [
  ["core/image"],
  ["core/heading", { placeholder: "Catchy Slide Title" }],
  [
    "core/paragraph",
    { placeholder: "Add an engaging description for your slide here..." },
  ],
];

export default function Edit({ attributes, setAttributes, clientId }) {
  const blockProps = useBlockProps({ className: "swiper-slide" });

  // Set blockId in useEffect to avoid React rendering issues
  useEffect(() => {
    if (blockProps.id && (!attributes.blockId || attributes.blockId !== blockProps.id)) {
      setAttributes({ blockId: blockProps.id });
    }
  }, [blockProps.id, attributes.blockId, setAttributes]);

  return (
    <swiper-slide>
      <div className="prolific-carousel-slide-inner">
        <InnerBlocks template={TEMPLATE} />
      </div>
    </swiper-slide>
  );
}
