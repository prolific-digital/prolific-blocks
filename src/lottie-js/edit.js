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
  MediaUpload,
  MediaUploadCheck,
} from "@wordpress/block-editor";

/**
 * Import components from WordPress packages.
 *
 * These are pre-built components provided by WordPress for creating
 * control panels and UI elements within the block editor.
 */
import {
  PanelBody,
  ToggleControl,
  SelectControl,
  RangeControl,
  Button,
} from "@wordpress/components";

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * This import allows you to style the block editor interface using SCSS.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import "./editor.scss";

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

import { useState, useEffect, useRef } from "@wordpress/element";
import { DotLottie } from "@lottiefiles/dotlottie-web";
import { BlockIcon } from "@wordpress/block-editor";

export default function Edit({ attributes, setAttributes }) {
  const { lottieFile, loop, autoplay, speed, startOnView } = attributes;

  const blockProps = useBlockProps();
  const canvasRef = useRef(null);
  const [dotLottieInstance, setDotLottieInstance] = useState(null);

  setAttributes({ blockId: blockProps.id });

  // Initialize Lottie animation
  useEffect(() => {
    if (!canvasRef.current || !lottieFile) return;

    const dotLottie = new DotLottie({
      autoplay: autoplay,
      loop,
      canvas: canvasRef.current,
      src: lottieFile,
      speed,
    });

    setDotLottieInstance(dotLottie);

    // Cleanup the Lottie instance on unmount
    return () => {
      dotLottie.destroy();
      setDotLottieInstance(null);
    };
  }, [lottieFile]);

  // Update Lottie attributes when they change
  useEffect(() => {
    if (!dotLottieInstance) return;

    dotLottieInstance.setSpeed(speed);
    dotLottieInstance.setLoop(loop);

    if (autoplay && !startOnView) {
      dotLottieInstance.play();
    } else {
      dotLottieInstance.pause();
    }
  }, [dotLottieInstance, autoplay, loop, speed, startOnView]);

  useEffect(() => {
    if (!canvasRef.current || !dotLottieInstance || !startOnView) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            dotLottieInstance.play();
            observer.unobserve(canvasRef.current);
          }
        });
      },
      { threshold: 0.1 }
    );

    // Pause the animation initially if autoplay is true
    if (autoplay) {
      dotLottieInstance.pause();
    }

    observer.observe(canvasRef.current);

    // Cleanup on unmount
    return () => {
      if (canvasRef.current) observer.unobserve(canvasRef.current);
    };
  }, [dotLottieInstance, startOnView, autoplay]);

  return (
    <>
      <div {...blockProps}>
        <canvas ref={canvasRef}></canvas>
      </div>

      <InspectorControls>
        <PanelBody title={__("Lottie Settings", "prolific-blocks")}>
          <MediaUploadCheck>
            <MediaUpload
              onSelect={(media) => setAttributes({ lottieFile: media.url })}
              allowedTypes={["application/json"]}
              render={({ open }) => (
                <Button
                  onClick={open}
                  variant="primary"
                  style={{ marginBottom: "20px" }}
                >
                  {lottieFile
                    ? __("Replace JSON", "prolific-blocks")
                    : __("Upload JSON", "prolific-blocks")}
                </Button>
              )}
            />
          </MediaUploadCheck>
          <ToggleControl
            label={__("Autoplay", "prolific-blocks")}
            checked={autoplay}
            onChange={(value) => setAttributes({ autoplay: value })}
          />
          <ToggleControl
            label={__("Loop", "prolific-blocks")}
            checked={loop}
            onChange={(value) => setAttributes({ loop: value })}
          />
          <ToggleControl
            label={__("Start on View", "prolific-blocks")}
            checked={startOnView}
            onChange={(value) => setAttributes({ startOnView: value })}
          />
          <RangeControl
            label={__("Speed", "prolific-blocks")}
            value={speed}
            onChange={(value) => setAttributes({ speed: value })}
            min={1}
            max={10}
            step={0.1}
          />
        </PanelBody>
      </InspectorControls>
    </>
  );
}
