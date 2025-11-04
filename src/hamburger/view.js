// look for all hamburger classes and on click, toggle an is-active class to the hamburger and a menu-is-active class to the body
const hamburgers = document.querySelectorAll(".hamburger");
const body = document.querySelector("body");

hamburgers.forEach((hamburger) => {
  hamburger.addEventListener("click", () => {
    const isActive = hamburger.classList.toggle("is-active");
    body.classList.toggle("menu-is-active");

    // Update aria-expanded for accessibility
    hamburger.setAttribute("aria-expanded", isActive ? "true" : "false");

    // Toggle label text visibility if label exists
    const labelTexts = hamburger.querySelectorAll(".hamburger-label-text");
    if (labelTexts.length > 0) {
      labelTexts.forEach((labelText) => {
        labelText.classList.toggle("is-hidden");
      });

      // Update aria-label on button
      const defaultLabel = hamburger.querySelector(".hamburger-label-text:not(.hamburger-label-text-active)");
      const activeLabel = hamburger.querySelector(".hamburger-label-text-active");
      if (defaultLabel && activeLabel) {
        hamburger.setAttribute("aria-label", isActive ? activeLabel.textContent : defaultLabel.textContent);
      }
    }
  });
});
