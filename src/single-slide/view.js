import Swiper from "swiper";
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

/**
 * Use this file for JavaScript code that you want to run in the front-end
 * on posts/pages that contain this block.
 *
 * When this file is defined as the value of the `viewScript` property
 * in `block.json` it will be enqueued on the front end of the site.
 *
 * Example:
 *
 * ```js
 * {
 *   "viewScript": "file:./view.js"
 * }
 * ```
 *
 * If you're not making any changes to this file because your project doesn't need any
 * JavaScript running in the front-end, then you should delete this file and remove
 * the `viewScript` property from `block.json`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/#view-script
 */

/* eslint-disable no-console */
console.log("Hello World! (from create-block-prolific-blocks block)");
/* eslint-enable no-console */

document.addEventListener("DOMContentLoaded", () => {
  document
    .querySelectorAll(".main-swiper-container")
    .forEach((swiperContainer) => {
      const swiperData = JSON.parse(
        swiperContainer.getAttribute("data-swiper")
      );

      // If thumbs swiper is enabled, initialize it first
      let thumbsSwiper;
      console.log(swiperData.thumbs);
      if (swiperData.thumbs) {
        const thumbsSwiperContainer = swiperContainer.nextElementSibling;
        if (
          thumbsSwiperContainer &&
          thumbsSwiperContainer.classList.contains("thumbs-swiper")
        ) {
          const thumbsSwiperOptions = {
            spaceBetween: 30,
            slidesPerView: 3,
            freeMode: true,
            watchSlidesProgress: true,
            modules: [Thumbs],
          };
          thumbsSwiper = new Swiper(thumbsSwiperContainer, thumbsSwiperOptions);
        }
      }

      const swiperOptions = {
        // Install modules
        modules: [
          Navigation,
          Pagination,
          Scrollbar,
          Keyboard,
          Autoplay,
          A11y,
          Thumbs,
          FreeMode,
        ],
        navigation: swiperData.navigation
          ? {
              nextEl: swiperContainer.querySelector(".swiper-button-next"),
              prevEl: swiperContainer.querySelector(".swiper-button-prev"),
            }
          : false,
        pagination: swiperData.pagination
          ? {
              el: swiperContainer.querySelector(".swiper-pagination"),
              clickable: true,
            }
          : false,
        scrollbar: swiperData.scrollbar
          ? {
              el: swiperContainer.querySelector(".swiper-scrollbar"),
              draggable: true,
            }
          : false,
        allowTouchMove: swiperData.allowTouchMove,
        keyboard: swiperData.keyboard,
        grabCursor: swiperData.grabCursor,
        autoplay: swiperData.autoplay
          ? {
              delay: swiperData.delay,
              disableOnInteraction: false,
            }
          : false,
        loop: swiperData.loop,
        speed: swiperData.transitionSpeed,
        autoHeight: swiperData.autoHeight,
        centeredSlides: swiperData.centeredSlides,
        direction: swiperData.direction,
        freeMode: swiperData.freeMode,
        breakpoints: {
          640: {
            slidesPerView: swiperData.slidesPerViewMobile,
            spaceBetween: swiperData.spaceBetweenMobile,
          },
          768: {
            slidesPerView: swiperData.slidesPerViewTablet,
            spaceBetween: swiperData.spaceBetweenTablet,
          },
          1024: {
            slidesPerView: swiperData.slidesPerView,
            spaceBetween: swiperData.spaceBetween,
          },
        },
        a11y: swiperData.a11yEnabled
          ? {
              enabled: true,
            }
          : false,
        thumbs: thumbsSwiper ? { swiper: thumbsSwiper } : undefined,
      };

      // Initialize Swiper instance
      new Swiper(swiperContainer, swiperOptions);
    });
});
