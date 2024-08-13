/******/ (() => { // webpackBootstrap
/*!***********************************!*\
  !*** ./src/timeline-item/view.js ***!
  \***********************************/
// look for all hamburger classes and on click, toggle an is-active class to the hamburger and a menu-is-active class to the body
const hamburgers = document.querySelectorAll(".hamburger");
const body = document.querySelector("body");
hamburgers.forEach(hamburger => {
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("is-active");
    body.classList.toggle("menu-is-active");
  });
});
/******/ })()
;
//# sourceMappingURL=view.js.map