/******/ (() => { // webpackBootstrap
/*!**************************!*\
  !*** ./src/tabs/view.js ***!
  \**************************/
// get all of the .wp-block-prolific-tabs elements
const tabsBlocks = document.querySelectorAll(".wp-block-prolific-tabs");

// listen for a click on each .tab element
tabsBlocks.forEach(tabsBlock => {
  const tabs = tabsBlock.querySelectorAll(".tab");
  const tabPanels = tabsBlock.querySelectorAll(".tab-panel");
  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => {
      tabPanels.forEach((panel, panelIndex) => {
        if (index === panelIndex) {
          panel.classList.add("active");
        } else {
          panel.classList.remove("active");
        }
      });
    });
  });
});

// add a class of active to the first .tab-panel element
tabsBlocks.forEach(tabsBlock => {
  const tabPanels = tabsBlock.querySelectorAll(".tab-panel");
  tabPanels[0].classList.add("active");
});
/******/ })()
;
//# sourceMappingURL=view.js.map