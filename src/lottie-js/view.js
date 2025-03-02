import { DotLottie } from "@lottiefiles/dotlottie-web";

document.addEventListener("DOMContentLoaded", function () {
  // Select all div elements with the specific ID and class
  const lottieBlocks = document.querySelectorAll(
    ".wp-block-prolific-lottie-js"
  );

  lottieBlocks.forEach((block) => {
    // Find the canvas element within the block
    const canvas = block.querySelector("canvas");

    if (canvas) {
      // Get the attributes from the canvas
      const loop = canvas.getAttribute("data-lottie-loop") === "true";
      const autoplay = canvas.getAttribute("data-lottie-autoplay") === "true";
      const src = canvas.getAttribute("data-lottie-src");
      const speed = parseFloat(canvas.getAttribute("data-lottie-speed")) || 1;
      const startOnView =
        canvas.getAttribute("data-lottie-start-on-view") === "true";

      // Initialize Lottie with the retrieved attributes
      const dotLottie = new DotLottie({
        canvas: canvas,
        autoplay: autoplay,
        loop: loop,
        src: src,
        speed: speed,
      });

      // If startOnView is enabled, set up Intersection Observer
      if (startOnView) {
        // Pause the animation initially if autoplay is true
        if (autoplay) {
          dotLottie.pause();
        }

        const observerOptions = {
          root: null, // Defaults to the viewport
          rootMargin: "0px 0px -200px 0px", // Offset the root's bottom boundary by -50px
          threshold: 0,
        };

        const observer = new IntersectionObserver((entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              dotLottie.play();
              observer.unobserve(entry.target);
            }
          });
        }, observerOptions);

        observer.observe(canvas);
      }
    }
  });
});
