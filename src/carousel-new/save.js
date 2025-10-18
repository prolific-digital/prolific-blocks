import { InnerBlocks } from "@wordpress/block-editor";

/**
 * Save function for Carousel New block.
 * Saves InnerBlocks content so render.php can access and wrap it in Swiper container.
 * Even though this is a dynamic block with PHP rendering, we MUST save the InnerBlocks
 * structure for changes to persist. The render.php uses $content to access this saved markup.
 *
 * @return {Element} InnerBlocks content to be saved to database.
 */
export default function save() {
	return <InnerBlocks.Content />;
}
