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
  MediaPlaceholder,
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
  RangeControl,
  SelectControl,
  Button,
} from "@wordpress/components";

import { MediaUpload, MediaUploadCheck } from "@wordpress/block-editor";

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
 * Import Swiper's CSS and JS.
 *
 * Swiper is a modern touch slider library. These imports allow you
 * to use Swiper components and their styles in the block.
 */
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper core and required modules
import {
  Navigation,
  Pagination,
  Scrollbar,
  Keyboard,
  Autoplay,
  A11y,
  Thumbs,
  FreeMode,
} from "swiper/modules";

// Import Swiper styles
import "swiper/css/bundle";

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
import { useEffect, useState, useRef } from "react";

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
    thumbs,
    autoHeight,
    centeredSlides,
    direction,
    freeMode,
    images,
    blockId,
    className,
    anchor,
    align,
  } = attributes;

  // Set a unique block ID
  if (!attributes.blockId) {
    setAttributes({ blockId: clientId });
  }

  console.log(blockId);

  // State to force re-render the swiper component on attribute changes
  const [swiperKey, setSwiperKey] = useState(0);
  // State to hold the instance of the thumbs swiper
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  // State to indicate if thumbs swiper is ready
  const [isThumbsReady, setIsThumbsReady] = useState(false);

  // Effect hook to update swiper key and reset thumbs swiper when attributes change
  useEffect(() => {
    setSwiperKey((prevKey) => prevKey + 1);
    setThumbsSwiper(null); // Reset thumbsSwiper when settings change
    // setIsThumbsReady(false); // Reset isThumbsReady when settings change
  }, [
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
    thumbs,
    autoHeight,
    centeredSlides,
    direction,
    freeMode,
    images,
  ]);

  // Effect hook to set isThumbsReady to true when thumbs swiper is available
  useEffect(() => {
    if (thumbsSwiper) {
      setIsThumbsReady(true);
    }
  }, [thumbsSwiper]);

  return (
    <div {...useBlockProps()}>
      {/* InspectorControls for the block settings in the sidebar */}
      <InspectorControls>
        <PanelBody
          title={__("Slider Settings", "prolific-blocks")}
          initialOpen={true}
        >
          <MediaUploadCheck>
            <MediaUpload
              onSelect={(media) =>
                setAttributes({
                  images: media.map((img) => ({ id: img.id, url: img.url })),
                })
              }
              allowedTypes={["image"]}
              value={images.map((img) => img.id)}
              multiple={true}
              gallery={true}
              render={({ open }) => (
                <Button
                  onClick={open}
                  variant="primary"
                  style={{ marginBottom: "20px" }}
                >
                  {__("Manages Images", "prolific-blocks")}
                </Button>
              )}
            />
          </MediaUploadCheck>
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
          <ToggleControl
            label={__("Thumbnails", "prolific-blocks")}
            checked={thumbs}
            onChange={(value) => setAttributes({ thumbs: value })}
            help={__(
              "Enable thumbnails below the carousel.",
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

      {images.length === 0 ? (
        <MediaPlaceholder
          icon="format-image"
          labels={{
            title: __("Upload or Select Images", "prolific-blocks"),
            instructions: __(
              "Upload your images or select existing images from your media library.",
              "prolific-blocks"
            ),
          }}
          onSelect={(media) =>
            setAttributes({
              images: media.map((img) => ({ id: img.id, url: img.url })),
            })
          }
          accept="image/*"
          allowedTypes={["image"]}
          multiple={true}
        />
      ) : (
        <>
          <Swiper
            key={`main-${swiperKey}`}
            className="main-swiper-container"
            modules={[
              Navigation,
              Pagination,
              Scrollbar,
              Keyboard,
              Autoplay,
              A11y,
              Thumbs,
              FreeMode,
            ]}
            navigation={navigation}
            centeredSlides={centeredSlides}
            direction={direction}
            keyboard={{ enabled: keyboard }}
            grabCursor={grabCursor}
            autoHeight={autoHeight}
            autoplay={
              autoplay
                ? { delay: delay, pauseOnMouseEnter: pauseOnHover }
                : false
            }
            allowTouchMove={allowTouchMove}
            a11y={{ enabled: a11yEnabled }}
            pagination={pagination ? { clickable: true } : false}
            scrollbar={scrollbar ? { draggable: true } : false}
            loop={loop}
            speed={transitionSpeed}
            resizeObserver={true}
            freeMode={freeMode}
            breakpoints={{
              1024: {
                slidesPerView: slidesPerView,
                spaceBetween: spaceBetween,
              },
              768: {
                slidesPerView: slidesPerViewTablet,
                spaceBetween: spaceBetweenTablet,
              },
              320: {
                slidesPerView: slidesPerViewMobile,
                spaceBetween: spaceBetweenMobile,
              },
            }}
            onSwiper={(swiper) => {
              console.log(swiper);
            }}
            onSlideChange={() => console.log("slide change")}
            passiveListeners={false}
            thumbs={isThumbsReady ? { swiper: thumbsSwiper } : undefined}
          >
            {images.length > 0 ? (
              images.map((img) => (
                <SwiperSlide key={img.id}>
                  <img
                    src={img.url}
                    alt={__("Selected image", "prolific-blocks")}
                    style={{ width: "100%" }}
                  />
                </SwiperSlide>
              ))
            ) : (
              <p>{__("No images available", "prolific-blocks")}</p>
            )}
          </Swiper>

          {thumbs && (
            <Swiper
              key={`thumbs-${swiperKey}`}
              onSwiper={setThumbsSwiper}
              spaceBetween={30}
              slidesPerView={3}
              freeMode={true}
              watchSlidesProgress={true}
              modules={[Navigation, Thumbs]}
              className="thumbs-swiper"
            >
              {images.length > 0 ? (
                images.map((img) => (
                  <SwiperSlide key={img.id}>
                    <img
                      src={img.url}
                      alt={__("Selected image", "prolific-blocks")}
                      style={{ width: "100%" }}
                    />
                  </SwiperSlide>
                ))
              ) : (
                <p>{__("No images available", "prolific-blocks")}</p>
              )}
            </Swiper>
          )}
        </>
      )}
    </div>
  );
}
