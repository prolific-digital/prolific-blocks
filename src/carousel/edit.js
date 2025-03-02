import classnames from "classnames";

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
  useBlockProps,
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
import { debounce } from "lodash";

/**
 * Sanitize SVG content by removing potentially dangerous content.
 *
 * This function sanitizes SVG content by:
 * 1. Removing comments
 * 2. Removing script tags and their content
 * 3. Removing event handlers (on* attributes)
 * 4. Removing potentially dangerous attributes like href with javascript:
 * 5. Removing unwanted presentation attributes (style, width, height)
 *
 * @param {string} svgContent - The raw SVG content as a string.
 * @returns {string} - The sanitized SVG content as a string.
 */
const sanitizeSvg = (svgContent) => {
  // Remove comments
  svgContent = svgContent.replace(/<!--[\s\S]*?-->/g, "");

  try {
    // Parse the SVG content
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgContent, "image/svg+xml");

    // Remove script elements
    const scripts = doc.querySelectorAll("script");
    scripts.forEach(script => script.remove());

    // Remove potentially dangerous elements
    const dangerousElements = doc.querySelectorAll("foreignObject, iframe");
    dangerousElements.forEach(el => el.remove());

    // Process all elements
    const elements = doc.querySelectorAll("*");
    elements.forEach((el) => {
      // Remove all event handler attributes (on*)
      Array.from(el.attributes).forEach(attr => {
        if (attr.name.startsWith("on")) {
          el.removeAttribute(attr.name);
        }
      });

      // Remove href attributes that contain javascript:
      if (el.hasAttribute("href")) {
        const href = el.getAttribute("href");
        if (href.toLowerCase().startsWith("javascript:")) {
          el.removeAttribute("href");
        }
      }

      // Remove xlink:href attributes that contain javascript:
      if (el.hasAttributeNS("http://www.w3.org/1999/xlink", "href")) {
        const xlinkHref = el.getAttributeNS("http://www.w3.org/1999/xlink", "href");
        if (xlinkHref.toLowerCase().startsWith("javascript:")) {
          el.removeAttributeNS("http://www.w3.org/1999/xlink", "href");
        }
      }

      // Remove style attribute for all elements
      el.removeAttribute("style");

      // For SVG elements, remove width and height
      if (el.tagName.toLowerCase() === "svg") {
        el.removeAttribute("width");
        el.removeAttribute("height");
      }
    });

    return new XMLSerializer().serializeToString(doc);
  } catch (e) {
    // If there's an error processing the SVG, return an empty string
    return "";
  }
};

export default function Edit({ attributes, setAttributes, clientId }) {
  // Destructure attributes and setAttributes from props for easier access
  const {
    spaceBetween,
    enableAutoSlidesPerView,
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
    pauseButton,
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

  const blockProps = useBlockProps();
  const swiperElRef = useRef(null);
  const uniqueId = useRef(uuidv4());
  const [innerBlocksCount, setInnerBlocksCount] = useState(0);
  const [renderSwiper, setRenderSwiper] = useState(true);
  const [hasSetBlockId, setHasSetBlockId] = useState(false);

  // Only set blockId once when component mounts
  useEffect(() => {
    if (!hasSetBlockId && blockProps.id) {
      setAttributes({ blockId: blockProps.id });
      setHasSetBlockId(true);
    }
  }, [blockProps.id, hasSetBlockId, setAttributes]);

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
    debounce(() => {
      setRenderSwiper(false);
      setTimeout(() => {
        setRenderSwiper(true);
      }, 300);
    }, 300),
    []
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
    if (swiperElRef.current && swiperElRef.current.swiper) {
      // Use a small delay to ensure content is fully rendered
      setTimeout(() => {
        swiperElRef.current.swiper.update();
        
        // Special handling for autoHeight to force recalculation
        if (autoHeight && swiperElRef.current.swiper.updateAutoHeight) {
          swiperElRef.current.swiper.updateAutoHeight(0);
        }
      }, 100);
    }
  }, [innerBlocksCount, autoHeight]);
  
  /**
   * Effect hook to set up custom navigation in the editor
   * 
   * This hook creates direct click handlers for the custom navigation buttons
   * instead of relying on Swiper's built-in navigation.
   * 
   * @function useEffect
   */
  useEffect(() => {
    // Only run if custom navigation is enabled and after swiper is initialized
    if (!customNav || !renderSwiper) return;
    
    // Use a timeout to ensure everything is properly rendered
    const timeoutId = setTimeout(() => {
      // Update reference to current swiper instance
      const swiper = swiperElRef.current?.swiper;
      if (!swiper) return;
      
      // Get buttons by class names (using document to ensure we find them)
      const nextBtn = document.querySelector(`.custom-next-${uniqueId.current}`);
      const prevBtn = document.querySelector(`.custom-prev-${uniqueId.current}`);
      
      // Set up click handler for next button
      if (nextBtn) {
        // Remove existing handlers by cloning and replacing
        const nextBtnClone = nextBtn.cloneNode(true);
        if (nextBtn.parentNode) {
          nextBtn.parentNode.replaceChild(nextBtnClone, nextBtn);
        }
        
        // Add the click handler using event delegation (more reliable)
        nextBtnClone.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log('Next button clicked');
          if (swiper && typeof swiper.slideNext === 'function') {
            swiper.slideNext();
          }
        };
      }
      
      // Set up click handler for prev button
      if (prevBtn) {
        // Remove existing handlers by cloning and replacing
        const prevBtnClone = prevBtn.cloneNode(true);
        if (prevBtn.parentNode) {
          prevBtn.parentNode.replaceChild(prevBtnClone, prevBtn);
        }
        
        // Add the click handler using event delegation (more reliable)
        prevBtnClone.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log('Previous button clicked');
          if (swiper && typeof swiper.slidePrev === 'function') {
            swiper.slidePrev();
          }
        };
      }
    }, 500); // Longer timeout to ensure everything is initialized
    
    return () => clearTimeout(timeoutId);
  }, [customNav, renderSwiper, uniqueId.current]);

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
    enableAutoSlidesPerView,
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
    pauseButton,
    customNav,
    customNavPrev,
    customNavNext,
    autoHeight,
  ]);

  // Set navigation element class names only once when component mounts
  useEffect(() => {
    if (!navigationNextEl || !navigationPrevEl) {
      setAttributes({ 
        navigationNextEl: `.custom-next-${uniqueId.current}`,
        navigationPrevEl: `.custom-prev-${uniqueId.current}`
      });
    }
  }, []);

  const autoSlidesPerView = enableAutoSlidesPerView ? "auto" : slidesPerView;

  const onSelectPrevSvg = async (media) => {
    if (media && media.url) {
      try {
        const svgContent = await fetchSvgContent(media.url);
        setAttributes({ customNavPrev: media.url, customNavPrevSvg: svgContent });
      } catch (error) {
        // Silently handle error in production
      }
    }
  };

  const onSelectNextSvg = async (media) => {
    if (media && media.url) {
      try {
        const svgContent = await fetchSvgContent(media.url);
        setAttributes({ customNavNext: media.url, customNavNextSvg: svgContent });
      } catch (error) {
        // Silently handle error in production
      }
    }
  };

  const fetchSvgContent = async (url) => {
    try {
      // Add cache busting parameter to avoid browser caching issues
      const cacheBustUrl = `${url}?_=${Date.now()}`;
      const response = await fetch(cacheBustUrl, {
        credentials: 'same-origin',
        headers: {
          'Accept': 'image/svg+xml, */*'
        }
      });
      
      if (!response.ok) {
        throw new Error(`SVG fetch failed: ${response.status} ${response.statusText}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (contentType && !contentType.includes('svg')) {
        throw new Error(`Invalid content type: ${contentType}`);
      }
      
      const text = await response.text();
      // Validate that the content looks like SVG
      if (!text.includes('<svg') || !text.includes('</svg>')) {
        throw new Error('Invalid SVG content');
      }
      
      return sanitizeSvg(text);
    } catch (error) {
      // Silently handle error in production
      return "";
    }
  };

  const clearPrevSvg = () => {
    setAttributes({ customNavPrev: "", customNavPrevSvg: "" });
  };

  const clearNextSvg = () => {
    setAttributes({ customNavNext: "", customNavNextSvg: "" });
  };

  const innerBlocksProps = useInnerBlocksProps(
    {},
    {
      template: [
        ["prolific/carousel-slide"],
        ["prolific/carousel-slide"],
        ["prolific/carousel-slide"],
        ["prolific/carousel-slide"],
      ],
    }
  );

  return (
    <>
      <div {...blockProps} className={classnames(blockProps.className, 'wp-block-prolific-carousel')}>
        {renderSwiper && (
          <swiper-container
            {...innerBlocksProps}
            ref={swiperElRef}
            slides-per-view={autoSlidesPerView}
            direction={direction}
            space-between={spaceBetween}
            navigation={(!customNav).toString()} // Only use built-in navigation when customNav is false
            pagination={pagination}
            scrollbar={scrollbar}
            allow-touch-move="false"
            keyboard={keyboard.toString()}
            grab-cursor="false"
            autoplay="false"
            centered-slides={centeredSlides.toString()}
            speed={transitionSpeed.toString()}
            loop="false"
            draggable="false"
            pause-on-hover={pauseOnHover.toString()}
            a11y={a11yEnabled.toString()}
            auto-height={autoHeight.toString()}
            breakpoints={`{
              "1024": {
                "slidesPerView": "${autoSlidesPerView}",
                "spaceBetween": "${spaceBetween}"
              },
              "768": {
                "slidesPerView": "${slidesPerViewTablet}",
                "spaceBetween": "${spaceBetweenTablet}"
              },
              "0": {
                "slidesPerView": "${slidesPerViewMobile}",
                "spaceBetween": "${spaceBetweenMobile}"
              }
            }`}
            role="region"
            aria-label={__("Carousel", "prolific-blocks")}
            class="editor-carousel"
            on-swiper-init="swiperInitialized"
          >
            {/* innerblock */}
          </swiper-container>
        )}
        {customNav && (
          <>
            <button 
              className={`custom-prev custom-prev-${uniqueId.current}`}
              aria-label={__("Previous slide", "prolific-blocks")}
              role="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (swiperElRef.current && swiperElRef.current.swiper) {
                  swiperElRef.current.swiper.slidePrev();
                  console.log("Previous slide clicked");
                }
              }}
            >
              {customNavPrevSvg ? (
                <span dangerouslySetInnerHTML={{ __html: customNavPrevSvg }} />
              ) : (
                <span aria-hidden="true">&#10094;</span>
              )}
              <span className="screen-reader-text">{__("Previous", "prolific-blocks")}</span>
            </button>
            <button 
              className={`custom-next custom-next-${uniqueId.current}`}
              aria-label={__("Next slide", "prolific-blocks")}
              role="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (swiperElRef.current && swiperElRef.current.swiper) {
                  swiperElRef.current.swiper.slideNext();
                  console.log("Next slide clicked");
                }
              }}
            >
              {customNavNextSvg ? (
                <span dangerouslySetInnerHTML={{ __html: customNavNextSvg }} />
              ) : (
                <span aria-hidden="true">&#10095;</span>
              )}
              <span className="screen-reader-text">{__("Next", "prolific-blocks")}</span>
            </button>
          </>
        )}
        {autoplay && pauseButton && (
          <button 
            className="carousel-pause-button"
            aria-label={__("Pause carousel", "prolific-blocks")}
            role="button"
          >
            <span aria-hidden="true">⏸</span>
            <span className="screen-reader-text">{__("Pause", "prolific-blocks")}</span>
          </button>
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
          <ToggleControl
            label={__("Enable Auto Slides Per View", "prolific-blocks")}
            checked={enableAutoSlidesPerView}
            onChange={(value) =>
              setAttributes({ enableAutoSlidesPerView: value })
            }
            help={__(
              "Enable auto slides per view to style slide width using css.",
              "prolific-blocks"
            )}
          />
          {/* check if enableAutoSlidesPerView is true */}
          {!enableAutoSlidesPerView && (
            <RangeControl
              label={__("Slides Per View", "prolific-blocks")}
              value={slidesPerView}
              onChange={(value) => setAttributes({ slidesPerView: value })}
              min={1}
              max={10}
              help={__(
                "Define the number of slides visible at once.",
                "prolific-blocks"
              )}
            />
          )}
          {/* <RangeControl
            label={__("Slides Per View", "prolific-blocks")}
            value={slidesPerView}
            onChange={(value) => setAttributes({ slidesPerView: value })}
            min={1}
            max={5}
            help={__(
              "Define the number of slides visible at once.",
              "prolific-blocks"
            )}
          /> */}
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
              "Allow height of each slide to determine height of carousel. May cause layout shifts during editing.",
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
          {autoplay && (
            <>
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
                label={__("Pause on Hover", "prolific-blocks")}
                checked={pauseOnHover}
                onChange={(value) => setAttributes({ pauseOnHover: value })}
                help={__(
                  "Pause autoplay when the mouse hovers over the slider.",
                  "prolific-blocks"
                )}
              />
              <ToggleControl
                label={__("Show Pause Button", "prolific-blocks")}
                checked={pauseButton}
                onChange={(value) => setAttributes({ pauseButton: value })}
                help={__(
                  "Display a pause button for the carousel.",
                  "prolific-blocks"
                )}
              />
            </>
          )}
          <ToggleControl
            label={__("Loop", "prolific-blocks")}
            checked={loop}
            onChange={(value) => setAttributes({ loop: value })}
            help={__(
              "Enable continuous loop mode for the slider.",
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
    </>
  );
}
