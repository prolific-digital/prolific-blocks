import { InnerBlocks } from "@wordpress/block-editor";

/**
 * Save function for Carousel New Slide block.
 * Saves InnerBlocks content to database so render.php can access it.
 *
 * @return {Element} InnerBlocks content to be saved.
 */
export default function save() {
	return <InnerBlocks.Content />;
}
