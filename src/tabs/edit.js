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
  TextControl,
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

export default function Edit({ attributes, setAttributes }) {
  const { tabs } = attributes;
  const blockProps = useBlockProps();
  // Create a ref to store references to the tab panels
  const tabPanelRefs = useRef(null);

  setAttributes({ blockId: blockProps.id });

  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const handleAddTab = () => {
    const newTabs = [...tabs, { label: `Tab ${tabs.length + 1}`, content: "" }];
    setAttributes({ tabs: newTabs });
  };

  const handleRemoveTab = (index) => {
    const newTabs = tabs.filter((_, i) => i !== index);
    setAttributes({ tabs: newTabs });
  };

  const handleTabChange = (index, label) => {
    const newTabs = [...tabs];
    newTabs[index].label = label;
    setAttributes({ tabs: newTabs });
  };

  const handleTabClick = (index) => {
    setActiveTabIndex(index);
  };

  const innerBlocksProps = useInnerBlocksProps(
    {},
    {
      allowedBlocks: ["prolific/tabbed-accordion-content"],
      template: [["prolific/tabs-panel"], ["prolific/tabs-panel"]],
    }
  );

  useEffect(() => {
    if (!tabPanelRefs.current) return;

    const tabPanels = tabPanelRefs.current.querySelectorAll(".tab-panel");

    if (!tabPanels.length) return;

    console.log(tabPanels);

    tabPanels.forEach((panel, index) => {
      console.log(index);
      if (index === activeTabIndex) {
        panel.classList.add("active");
      } else {
        panel.classList.remove("active");
      }
    });
  }, [activeTabIndex, blockProps.id]);

  return (
    <>
      <div {...blockProps}>
        <div className="tabs">
          {tabs.map((tab, index) => (
            <button
              key={index}
              className={`tab ${index === activeTabIndex ? "active" : ""}`}
              onClick={() => handleTabClick(index)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div ref={tabPanelRefs}>
          <div className="tab-content" {...innerBlocksProps}></div>
        </div>
      </div>

      <InspectorControls>
        <PanelBody title={__("Tab Settings", "text-domain")}>
          {tabs.map((tab, index) => (
            <div key={index} style={{ marginBottom: "20px" }}>
              <TextControl
                label={__("Tab Label", "text-domain")}
                value={tab.label}
                onChange={(label) => handleTabChange(index, label)}
              />
              <Button
                isDestructive
                variant="secondary"
                onClick={() => handleRemoveTab(index)}
              >
                {__("Remove Tab", "text-domain")}
              </Button>
            </div>
          ))}
          <Button variant="primary" onClick={handleAddTab}>
            {__("Add Tab", "text-domain")}
          </Button>
        </PanelBody>
      </InspectorControls>
    </>
  );
}
