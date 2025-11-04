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
import { useBlockProps, InspectorControls } from "@wordpress/block-editor";

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
import SupportCard from '../components/SupportCard';

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

import { useState } from "@wordpress/element";

export default function Edit({ attributes, setAttributes }) {
  const { hamburgerClass, ariaControls, showLabel, labelText, labelTextActive } = attributes;
  const blockProps = useBlockProps();
  const [isActive, setIsActive] = useState(false);

  const hamburgerOptions = [
    { value: "hamburger--3dx", label: "3D X" },
    { value: "hamburger--3dx-r", label: "3D X Reverse" },
    { value: "hamburger--3dy", label: "3D Y" },
    { value: "hamburger--3dy-r", label: "3D Y Reverse" },
    { value: "hamburger--3dxy", label: "3D XY" },
    { value: "hamburger--3dxy-r", label: "3D XY Reverse" },
    { value: "hamburger--arrow", label: "Arrow" },
    { value: "hamburger--arrow-r", label: "Arrow Reverse" },
    { value: "hamburger--arrowalt", label: "Arrow Alt" },
    { value: "hamburger--arrowalt-r", label: "Arrow Alt Reverse" },
    { value: "hamburger--arrowturn", label: "Arrow Turn" },
    { value: "hamburger--arrowturn-r", label: "Arrow Turn Reverse" },
    { value: "hamburger--boring", label: "Boring" },
    { value: "hamburger--collapse", label: "Collapse" },
    { value: "hamburger--collapse-r", label: "Collapse Reverse" },
    { value: "hamburger--elastic", label: "Elastic" },
    { value: "hamburger--elastic-r", label: "Elastic Reverse" },
    { value: "hamburger--emphatic", label: "Emphatic" },
    { value: "hamburger--emphatic-r", label: "Emphatic Reverse" },
    { value: "hamburger--minus", label: "Minus" },
    { value: "hamburger--slider", label: "Slider" },
    { value: "hamburger--slider-r", label: "Slider Reverse" },
    { value: "hamburger--spin", label: "Spin" },
    { value: "hamburger--spin-r", label: "Spin Reverse" },
    { value: "hamburger--spring", label: "Spring" },
    { value: "hamburger--spring-r", label: "Spring Reverse" },
    { value: "hamburger--stand", label: "Stand" },
    { value: "hamburger--stand-r", label: "Stand Reverse" },
    { value: "hamburger--squeeze", label: "Squeeze" },
    { value: "hamburger--vortex", label: "Vortex" },
    { value: "hamburger--vortex-r", label: "Vortex Reverse" },
  ];

  const toggleActiveClass = () => {
    setIsActive(!isActive);
  };

  return (
    <>
      <InspectorControls>
        <SupportCard />
        <PanelBody title={__("Hamburger Settings", "text-domain")}>
          <SelectControl
            label={__("Select Hamburger Style", "text-domain")}
            value={hamburgerClass}
            options={hamburgerOptions}
            onChange={(value) => setAttributes({ hamburgerClass: value })}
          />
          <TextControl
            label={__("Aria Controls ID", "text-domain")}
            value={ariaControls}
            onChange={(value) => setAttributes({ ariaControls: value })}
            help={__(
              "Enter the ID of the element this button controls.",
              "text-domain"
            )}
          />
        </PanelBody>
        <PanelBody title={__("Label Settings", "text-domain")} initialOpen={false}>
          <ToggleControl
            label={__("Show Label", "text-domain")}
            checked={showLabel}
            onChange={(value) => setAttributes({ showLabel: value })}
            help={__(
              "Display text label alongside the hamburger button.",
              "text-domain"
            )}
          />
          {showLabel && (
            <>
              <TextControl
                label={__("Default Label Text", "text-domain")}
                value={labelText}
                onChange={(value) => setAttributes({ labelText: value })}
                help={__(
                  "Text displayed when menu is closed.",
                  "text-domain"
                )}
              />
              <TextControl
                label={__("Active Label Text", "text-domain")}
                value={labelTextActive}
                onChange={(value) => setAttributes({ labelTextActive: value })}
                help={__(
                  "Text displayed when menu is open.",
                  "text-domain"
                )}
              />
            </>
          )}
        </PanelBody>
      </InspectorControls>
      <div {...blockProps}>
        <button
          className={`hamburger ${hamburgerClass} ${
            isActive ? "is-active" : ""
          }`}
          type="button"
          onClick={toggleActiveClass}
          aria-controls={ariaControls || undefined}
        >
          <span className="hamburger-box">
            <span className="hamburger-inner"></span>
          </span>
          {showLabel && (
            <span className="hamburger-label">
              <span className={`hamburger-label-text ${isActive ? "is-hidden" : ""}`}>
                {labelText}
              </span>
              <span className={`hamburger-label-text hamburger-label-text-active ${!isActive ? "is-hidden" : ""}`}>
                {labelTextActive}
              </span>
            </span>
          )}
        </button>
      </div>
    </>
  );
}
