/**
 * Retrieves the translation of text.
 *
 * This import is used for internationalizing strings within the block editor.
 * It ensures that the text in the block can be translated to different languages.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from "@wordpress/i18n";

import { v4 as uuidv4 } from "uuid";

/**
 * Import the useBlockProps hook from the WordPress block editor.
 *
 * useBlockProps standardizes and manages the properties applied to a block's wrapper element,
 * ensuring consistent class names, styles, and attributes.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps } from "@wordpress/block-editor";

/**
 * Import necessary React hooks from the WordPress element package.
 *
 * useEffect: Manages side effects in functional components.
 * useRef: Creates a mutable object to hold a reference to a DOM element.
 * useState: Manages state in functional components.
 * useCallback: Memoizes functions to optimize performance.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-element/
 */
import { useEffect, useRef, useState, useCallback } from "@wordpress/element";

/**
 * Import necessary block editor components and hooks.
 *
 * useInnerBlocksProps: Manages inner blocks and their properties.
 * InspectorControls: Adds settings to the block inspector panel.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/
 */
import {
  useInnerBlocksProps,
  InspectorControls,
  MediaUpload,
  MediaUploadCheck,
} from "@wordpress/block-editor";

/**
 * Import necessary components from the WordPress components package.
 *
 * ToggleControl: Renders a toggle switch control.
 * SelectControl: Renders a select dropdown control.
 * PanelBody: Wraps controls in a collapsible panel.
 * RangeControl: Renders a range slider control.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-components/
 */
import {
  ToggleControl,
  SelectControl,
  PanelBody,
  RangeControl,
  Button,
} from "@wordpress/components";

/**
 * Import the useSelect hook from the WordPress data package.
 *
 * useSelect: Subscribes to the WordPress data store to retrieve data.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-data/#useselect
 */
import { useSelect } from "@wordpress/data";

import "./editor.scss";

const sanitizeSvg = (svgContent) => {
  // Remove comments
  svgContent = svgContent.replace(/<!--[\s\S]*?-->/g, "");

  // Parse the SVG content
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgContent, "image/svg+xml");

  // Remove unwanted attributes
  const elements = doc.querySelectorAll("*");
  elements.forEach((el) => {
    el.removeAttribute("style"); // Remove style attribute
    if (el.tagName.toLowerCase() === "svg") {
      el.removeAttribute("width"); // Remove width attribute from svg tag
      el.removeAttribute("height"); // Remove height attribute from svg tag
    }
  });

  return new XMLSerializer().serializeToString(doc);
};

export default function Edit({ attributes, setAttributes, clientId }) {
  // Destructure attributes and setAttributes from props for easier access
  const {
    spaceBetween,
    slidesPerView,
    spaceBetweenTablet,
    slidesPerViewTablet,
    spaceBetweenMobile,
    slidesPerViewMobile,
    navigation,
    pagination,
    scrollbar,
    allowTouchMove,
    keyboard,
    grabCursor,
    autoplay,
    delay,
    loop,
    draggable,
    pauseOnHover,
    transitionSpeed,
    a11yEnabled,
    autoHeight,
    centeredSlides,
    direction,
    freeMode,
    blockId,
    className,
    anchor,
    align,
    effect,
    customNav,
    customNavPrev,
    customNavNext,
    customNavPrevSvg,
    customNavNextSvg,
    navigationNextEl,
    navigationPrevEl,
  } = attributes;

  const swiperElRef = useRef(null);
  const uniqueId = uuidv4();
  const blockProps = useBlockProps();
  const [innerBlocksCount, setInnerBlocksCount] = useState(0);
  const [renderSwiper, setRenderSwiper] = useState(true);

  /**
   * Debounced function to reinitialize the Swiper component.
   *
   * This function sets the renderSwiper state to false and then back to true after a delay,
   * effectively re-rendering the Swiper component. It is debounced to prevent excessive re-renders.
   *
   * @function reinitializeSwiper
   * @returns {void}
   */
  const reinitializeSwiper = useCallback(
    _.debounce(() => {
      setRenderSwiper(false);
      setTimeout(() => {
        setRenderSwiper(true);
      }, 300);
    }, 300),
    []
  );

  const innerBlocksProps = useInnerBlocksProps(
    {},
    {
      template: [
        ["prolific-blocks/single-slide"],
        ["prolific-blocks/single-slide"],
        ["prolific-blocks/single-slide"],
        ["prolific-blocks/single-slide"],
      ],
    }
  );

  /**
   * Select inner blocks from the block editor's data store.
   *
   * This hook retrieves the inner blocks for the current block using the clientId.
   *
   * @function useSelect
   * @param {function} select - A function to select data from the data store.
   * @param {Array} deps - Dependency array to re-run the select function when clientId changes.
   * @returns {Object} An object containing the selected inner blocks.
   */
  const { innerBlocks } = useSelect(
    (select) => ({
      innerBlocks: select("core/block-editor").getBlocks(clientId),
    }),
    [clientId]
  );

  /**
   * Effect hook to update the inner blocks count.
   *
   * This hook updates the innerBlocksCount state whenever the inner blocks change.
   *
   * @function useEffect
   */
  useEffect(() => {
    setInnerBlocksCount(innerBlocks.length);
  }, [innerBlocks]);

  /**
   * Effect hook to update the Swiper instance when the innerBlocksCount changes.
   *
   * This hook ensures that the Swiper instance is updated whenever the number of inner blocks changes.
   * It handles cases where slides are added or removed, ensuring that Swiper reflects the current state
   * of the slides.
   *
   * The swiper.update() method is called to recalculate Swiper's dimensions, positions, and other necessary
   * parameters to accurately display the current slides.
   *
   * @function useEffect
   */
  useEffect(() => {
    if (swiperElRef.current) {
      swiperElRef.current.swiper.update();
    }
  }, [innerBlocksCount]);

  /**
   * Effect hook to reinitialize the Swiper component when specific dependencies change.
   *
   * This hook reinitializes the Swiper component by calling the debounced reinitializeSwiper function
   * whenever any of the specified dependencies change, such as effect, slidesPerViewMobile, spaceBetweenMobile, etc.
   * It handles reinitializing Swiper for properties that Swiper does not automatically update and require reinitialization.
   *
   * @function useEffect
   */
  useEffect(() => {
    if (swiperElRef.current) {
      reinitializeSwiper();
    }
  }, [
    reinitializeSwiper,
    effect,
    slidesPerViewMobile,
    spaceBetweenMobile,
    slidesPerViewTablet,
    spaceBetweenTablet,
    centeredSlides,
    autoplay,
    delay,
    loop,
    direction,
    pauseOnHover,
    customNav,
    customNavPrev,
    customNavNext,
  ]);

  const onSelectPrevSvg = async (media) => {
    if (media && media.url) {
      const svgContent = await fetchSvgContent(media.url);
      setAttributes({ customNavPrev: media.url, customNavPrevSvg: svgContent });
    }
  };

  const onSelectNextSvg = async (media) => {
    if (media && media.url) {
      const svgContent = await fetchSvgContent(media.url);
      setAttributes({ customNavNext: media.url, customNavNextSvg: svgContent });
    }
  };

  const fetchSvgContent = async (url) => {
    const response = await fetch(url);
    if (response.ok) {
      const text = await response.text();
      const cleanSvg = sanitizeSvg(text);
      return cleanSvg;
    }
    return "";
  };

  const clearPrevSvg = () => {
    setAttributes({ customNavPrev: "", customNavPrevSvg: "" });
  };

  const clearNextSvg = () => {
    setAttributes({ customNavNext: "", customNavNextSvg: "" });
  };

  setAttributes({ navigationNextEl: `.custom-next-${uniqueId}` });
  setAttributes({ navigationPrevEl: `.custom-prev-${uniqueId}` });

  return (
    <div>
      <div {...blockProps}>
        {renderSwiper && (
          // Need to work on a solution for vertical slides, setting slideperview auto seems to work on the frontend but not the editor
          // https://github.com/nolimits4web/swiper/issues/4599#issuecomment-1805420811

          // Need to look into parallax settings and how to apply data attributes to innerblocks
          <swiper-container
            {...innerBlocksProps}
            ref={swiperElRef}
            slides-per-view={slidesPerView}
            direction={direction}
            space-between={spaceBetween}
            navigation={navigation}
            {...(customNav && {
              "navigation-next-el": { navigationNextEl },
              "navigation-prev-el": { navigationPrevEl },
            })}
            pagination={pagination}
            scrollbar={scrollbar}
            allow-touch-move="false"
            keyboard="false"
            grab-cursor={grabCursor}
            autoplay={autoplay}
            centered-slides={centeredSlides}
            speed={transitionSpeed}
            loop={loop}
            draggable={draggable}
            pause-on-hover={pauseOnHover}
            {...(autoplay && { "autoplay-delay": delay })}
            {...(effect !== "none" && { effect })}
            {...(effect === "fade" && { "fade-effect-cross-fade": "true" })}
            breakpoints={`{
              "1024": {
                "slidesPerView": ${slidesPerView},
                "spaceBetween": ${spaceBetween}
              },
              "768": {
                "slidesPerView": ${slidesPerViewTablet},
                "spaceBetween": ${spaceBetweenTablet}
              },
              "0": {
                "slidesPerView": ${slidesPerViewMobile},
                "spaceBetween": ${spaceBetweenMobile}
              }
            }`}
          >
            {/* innerblock */}
          </swiper-container>
        )}
        {customNav && (
          <>
            <button className={`custom-prev custom-prev-${uniqueId}`}>
              <span dangerouslySetInnerHTML={{ __html: customNavPrevSvg }} />
              <span className="screen-reader-text">Previous</span>
            </button>
            <button className={`custom-next custom-next-${uniqueId}`}>
              <span dangerouslySetInnerHTML={{ __html: customNavNextSvg }} />
              <span className="screen-reader-text">Next</span>
            </button>
          </>
        )}
      </div>

      <InspectorControls>
        <PanelBody
          title={__("Slider Settings", "prolific-blocks")}
          initialOpen={true}
        >
          <ToggleControl
            label={__("Custom Navigation", "prolific-blocks")}
            checked={customNav}
            onChange={(value) => setAttributes({ customNav: value })}
            help={__(
              "Enable custom navigation arrows on the sides of the slider.",
              "prolific-blocks"
            )}
          />
          {customNav && (
            <div style={{ display: "block", marginBottom: "20px" }}>
              {!customNavPrev && (
                <MediaUpload
                  onSelect={onSelectPrevSvg}
                  allowedTypes={["image/svg+xml"]}
                  render={({ open }) => (
                    <Button
                      onClick={open}
                      isPrimary
                      style={{ marginRight: "5px", marginBottom: "10px" }}
                    >
                      {__("Add Previous SVG", "prolific-blocks")}
                    </Button>
                  )}
                />
              )}
              {customNavPrev && (
                <>
                  <Button
                    onClick={clearPrevSvg}
                    isSecondary
                    style={{
                      display: "block",
                      marginTop: "10px",
                    }}
                  >
                    {__("Remove Previous SVG", "prolific-blocks")}
                  </Button>
                  <img
                    src={customNavPrev}
                    alt={__("Custom Previous Button", "prolific-blocks")}
                    style={{
                      display: "block",
                      marginTop: "10px",
                      maxWidth: "50px",
                      maxHeight: "50px",
                    }}
                  />
                </>
              )}

              {!customNavNext && (
                <MediaUpload
                  onSelect={onSelectNextSvg}
                  allowedTypes={["image/svg+xml"]}
                  render={({ open }) => (
                    <Button onClick={open} isPrimary>
                      {__("Add Next SVG", "prolific-blocks")}
                    </Button>
                  )}
                />
              )}
              {customNavNext && (
                <>
                  <Button
                    onClick={clearNextSvg}
                    isSecondary
                    style={{ display: "block", marginTop: "10px" }}
                  >
                    {__("Remove Next SVG", "prolific-blocks")}
                  </Button>
                  <img
                    src={customNavNext}
                    alt={__("Custom Next Button", "prolific-blocks")}
                    style={{
                      display: "block",
                      marginTop: "10px",
                      maxWidth: "50px",
                      maxHeight: "50px",
                    }}
                  />
                </>
              )}
            </div>
          )}
          <RangeControl
            label={__("Space Between Slides", "prolific-blocks")}
            value={spaceBetween}
            onChange={(value) => setAttributes({ spaceBetween: value })}
            min={0}
            max={100}
            help={__(
              "Set the space between slides in pixels.",
              "prolific-blocks"
            )}
          />
          <RangeControl
            label={__("Slides Per View", "prolific-blocks")}
            value={slidesPerView}
            onChange={(value) => setAttributes({ slidesPerView: value })}
            min={1}
            max={5}
            help={__(
              "Define the number of slides visible at once.",
              "prolific-blocks"
            )}
          />
          <ToggleControl
            label={__("Navigation", "prolific-blocks")}
            checked={navigation}
            onChange={(value) => setAttributes({ navigation: value })}
            help={__(
              "Enable navigation arrows on the sides of the slider.",
              "prolific-blocks"
            )}
          />
          <ToggleControl
            label={__("Pagination", "prolific-blocks")}
            checked={pagination}
            onChange={(value) => setAttributes({ pagination: value })}
            help={__(
              "Show pagination dots below the slider.",
              "prolific-blocks"
            )}
          />
        </PanelBody>
        <PanelBody
          title={__("Advanced Settings", "prolific-blocks")}
          initialOpen={false}
        >
          {/* create a select select dropdown for horizontal or vertical */}
          <SelectControl
            label={__("Direction", "prolific-blocks")}
            value={direction}
            options={[
              {
                label: __("Horizontal", "prolific-blocks"),
                value: "horizontal",
              },
              { label: __("Vertical", "prolific-blocks"), value: "vertical" },
            ]}
            onChange={(value) => setAttributes({ direction: value })}
            help={__("Choose the direction of the slider.", "prolific-blocks")}
          />
          <SelectControl
            label={__("Effect", "prolific-blocks")}
            value={effect}
            options={[
              {
                label: __("Slide", "prolific-blocks"),
                value: "slide",
              },
              {
                label: __("Fade", "prolific-blocks"),
                value: "fade",
              },
              {
                label: __("Cube", "prolific-blocks"),
                value: "cube",
              },
              {
                label: __("Cover Flow", "prolific-blocks"),
                value: "coverflow",
              },
              {
                label: __("Flip", "prolific-blocks"),
                value: "flip",
              },
              {
                label: __("Cards", "prolific-blocks"),
                value: "cards",
              },
            ]}
            onChange={(value) => setAttributes({ effect: value })}
            help={__("Choose the effect for your slider.", "prolific-blocks")}
          />
          <ToggleControl
            label={__("Free Mode", "prolific-blocks")}
            checked={freeMode}
            onChange={(value) => setAttributes({ freeMode: value })}
            help={__(
              "Enable free mode to allow slides to move freely.",
              "prolific-blocks"
            )}
          />
          <ToggleControl
            label={__("Centered Slides", "prolific-blocks")}
            checked={centeredSlides}
            onChange={(value) => setAttributes({ centeredSlides: value })}
            help={__(
              "Center the active slide in the carousel.",
              "prolific-blocks"
            )}
          />
          <ToggleControl
            label={__("Auto Height", "prolific-blocks")}
            checked={autoHeight}
            onChange={(value) => setAttributes({ autoHeight: value })}
            help={__(
              "Allow heigh of each slide to determine height of carousel.",
              "prolific-blocks"
            )}
          />
          <ToggleControl
            label={__("Scrollbar", "prolific-blocks")}
            checked={scrollbar}
            onChange={(value) => setAttributes({ scrollbar: value })}
            help={__(
              "Display a draggable scrollbar below the slider.",
              "prolific-blocks"
            )}
          />
          <ToggleControl
            label={__("Allow Touch Move", "prolific-blocks")}
            checked={allowTouchMove}
            onChange={(value) => setAttributes({ allowTouchMove: value })}
            help={__(
              "Enable slide navigation by touch on mobile devices.",
              "prolific-blocks"
            )}
          />
          <ToggleControl
            label={__("Keyboard Control", "prolific-blocks")}
            checked={keyboard}
            onChange={(value) => setAttributes({ keyboard: value })}
            help={__(
              "Allow navigation using keyboard arrow keys.",
              "prolific-blocks"
            )}
          />
          <ToggleControl
            label={__("Grab Cursor", "prolific-blocks")}
            checked={grabCursor}
            onChange={(value) => setAttributes({ grabCursor: value })}
            help={__(
              "Change cursor to 'grab' style when hovering over the slider.",
              "prolific-blocks"
            )}
          />
          <ToggleControl
            label={__("Autoplay", "prolific-blocks")}
            checked={autoplay}
            onChange={(value) => setAttributes({ autoplay: value })}
            help={__(
              "Automatically transition between slides.",
              "prolific-blocks"
            )}
          />
          <RangeControl
            label={__("Autoplay Delay (ms)", "prolific-blocks")}
            value={delay}
            onChange={(value) => setAttributes({ delay: value })}
            min={1000}
            max={10000}
            help={__(
              "Set the delay between autoplay transitions in milliseconds.",
              "prolific-blocks"
            )}
          />
          <ToggleControl
            label={__("Loop", "prolific-blocks")}
            checked={loop}
            onChange={(value) => setAttributes({ loop: value })}
            help={__(
              "Enable continuous loop mode for the slider.",
              "prolific-blocks"
            )}
          />
          <ToggleControl
            label={__("Pause on Hover", "prolific-blocks")}
            checked={pauseOnHover}
            onChange={(value) => setAttributes({ pauseOnHover: value })}
            help={__(
              "Pause autoplay when the mouse hovers over the slider.",
              "prolific-blocks"
            )}
          />
          <RangeControl
            label={__("Transition Speed (ms)", "prolific-blocks")}
            value={transitionSpeed}
            onChange={(value) => setAttributes({ transitionSpeed: value })}
            min={100}
            max={2000}
            help={__(
              "Set the speed of slide transitions in milliseconds.",
              "prolific-blocks"
            )}
          />
          <ToggleControl
            label={__("Accessibility", "prolific-blocks")}
            checked={a11yEnabled}
            onChange={(value) => setAttributes({ a11yEnabled: value })}
            help={__(
              "Enable accessibility features for screen readers.",
              "prolific-blocks"
            )}
          />
        </PanelBody>
        <PanelBody
          title={__("Tablet Settings", "prolific-blocks")}
          initialOpen={false}
        >
          <RangeControl
            label={__("Space Between Slides", "prolific-blocks")}
            value={spaceBetweenTablet}
            onChange={(value) => setAttributes({ spaceBetweenTablet: value })}
            min={0}
            max={100}
            help={__(
              "Set the space between slides in pixels for tablet devices.",
              "prolific-blocks"
            )}
          />
          <RangeControl
            label={__("Slides Per View", "prolific-blocks")}
            value={slidesPerViewTablet}
            onChange={(value) => setAttributes({ slidesPerViewTablet: value })}
            min={1}
            max={5}
            help={__(
              "Define the number of slides visible at once on tablet screens.",
              "prolific-blocks"
            )}
          />
        </PanelBody>
        <PanelBody
          title={__("Mobile Settings", "prolific-blocks")}
          initialOpen={false}
        >
          <RangeControl
            label={__("Space Between Slides", "prolific-blocks")}
            value={spaceBetweenMobile}
            onChange={(value) => setAttributes({ spaceBetweenMobile: value })}
            min={0}
            max={100}
            help={__(
              "Set the space between slides in pixels for mobile devices.",
              "prolific-blocks"
            )}
          />
          <RangeControl
            label={__("Slides Per View", "prolific-blocks")}
            value={slidesPerViewMobile}
            onChange={(value) => setAttributes({ slidesPerViewMobile: value })}
            min={1}
            max={5}
            help={__(
              "Define the number of slides visible at once on mobile screens.",
              "prolific-blocks"
            )}
          />
        </PanelBody>
      </InspectorControls>
    </div>
  );
}
