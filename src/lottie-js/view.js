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

      // Initialize Lottie with the retrieved attributes
      const dotLottie = new DotLottie({
        canvas: canvas,
        autoplay: autoplay,
        loop: loop,
        src: src,
        speed: speed,
      });
    }
  });
});
