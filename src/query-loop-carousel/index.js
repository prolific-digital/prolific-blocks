/**
 * Query Loop Carousel Extension
 *
 * Extends the core/query block with carousel functionality
 *
 * @since 1.0.0
 */

import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ToggleControl, RangeControl, SelectControl, Notice } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';

/**
 * Import styles for webpack processing
 */
import './style.scss';
import './editor.scss';

/**
 * Add carousel attributes to core/query block
 *
 * @param {Object} settings Block settings
 * @param {string} name Block name
 * @return {Object} Modified settings
 */
function addCarouselAttributes(settings, name) {
	if (name !== 'core/query') {
		return settings;
	}

	return {
		...settings,
		attributes: {
			...settings.attributes,
			carouselEnabled: {
				type: 'boolean',
				default: false,
			},
			carouselSlidesPerViewDesktop: {
				type: 'number',
				default: 3,
			},
			carouselSlidesPerViewTablet: {
				type: 'number',
				default: 2,
			},
			carouselSlidesPerViewMobile: {
				type: 'number',
				default: 1,
			},
			carouselSpaceBetweenDesktop: {
				type: 'number',
				default: 30,
			},
			carouselSpaceBetweenTablet: {
				type: 'number',
				default: 20,
			},
			carouselSpaceBetweenMobile: {
				type: 'number',
				default: 10,
			},
			carouselNavigation: {
				type: 'boolean',
				default: true,
			},
			carouselPagination: {
				type: 'boolean',
				default: true,
			},
			carouselPaginationType: {
				type: 'string',
				default: 'bullets',
			},
			carouselAutoplay: {
				type: 'boolean',
				default: false,
			},
			carouselAutoplayDelay: {
				type: 'number',
				default: 3000,
			},
			carouselLoop: {
				type: 'boolean',
				default: false,
			},
			carouselEffect: {
				type: 'string',
				default: 'slide',
			},
			carouselSpeed: {
				type: 'number',
				default: 300,
			},
		},
	};
}

addFilter(
	'blocks.registerBlockType',
	'prolific/query-carousel-attributes',
	addCarouselAttributes
);

/**
 * Add carousel controls to Query block inspector
 */
const withCarouselControls = createHigherOrderComponent((BlockEdit) => {
	return (props) => {
		const { name, attributes, setAttributes } = props;

		if (name !== 'core/query') {
			return <BlockEdit {...props} />;
		}

		const {
			carouselEnabled = false,
			carouselSlidesPerViewDesktop = 3,
			carouselSlidesPerViewTablet = 2,
			carouselSlidesPerViewMobile = 1,
			carouselSpaceBetweenDesktop = 30,
			carouselSpaceBetweenTablet = 20,
			carouselSpaceBetweenMobile = 10,
			carouselNavigation = true,
			carouselPagination = true,
			carouselPaginationType = 'bullets',
			carouselAutoplay = false,
			carouselAutoplayDelay = 3000,
			carouselLoop = false,
			carouselEffect = 'slide',
			carouselSpeed = 300,
		} = attributes;

		return (
			<Fragment>
				<BlockEdit {...props} />
				<InspectorControls>
					<PanelBody
						title={__('Carousel Mode', 'prolific-blocks')}
						initialOpen={carouselEnabled}
					>
						<ToggleControl
							label={__('Enable Carousel Mode', 'prolific-blocks')}
							help={
								carouselEnabled
									? __('Query Loop will display as a carousel', 'prolific-blocks')
									: __('Enable to add carousel functionality', 'prolific-blocks')
							}
							checked={carouselEnabled}
							onChange={(value) => setAttributes({ carouselEnabled: value })}
						/>

						{carouselEnabled && (
							<Fragment>
								<Notice status="info" isDismissible={false}>
									{__(
										'Carousel mode is active. The preview below shows the layout structure. Full carousel functionality will be visible on the frontend.',
										'prolific-blocks'
									)}
								</Notice>

								<h3>{__('Slides Per View', 'prolific-blocks')}</h3>

								<RangeControl
									label={__('Desktop (1024px+)', 'prolific-blocks')}
									value={carouselSlidesPerViewDesktop}
									onChange={(value) =>
										setAttributes({ carouselSlidesPerViewDesktop: value })
									}
									min={1}
									max={6}
								/>

								<RangeControl
									label={__('Tablet (768px - 1023px)', 'prolific-blocks')}
									value={carouselSlidesPerViewTablet}
									onChange={(value) =>
										setAttributes({ carouselSlidesPerViewTablet: value })
									}
									min={1}
									max={6}
								/>

								<RangeControl
									label={__('Mobile (0 - 767px)', 'prolific-blocks')}
									value={carouselSlidesPerViewMobile}
									onChange={(value) =>
										setAttributes({ carouselSlidesPerViewMobile: value })
									}
									min={1}
									max={6}
								/>

								<h3>{__('Space Between Slides (px)', 'prolific-blocks')}</h3>

								<RangeControl
									label={__('Desktop', 'prolific-blocks')}
									value={carouselSpaceBetweenDesktop}
									onChange={(value) =>
										setAttributes({ carouselSpaceBetweenDesktop: value })
									}
									min={0}
									max={100}
								/>

								<RangeControl
									label={__('Tablet', 'prolific-blocks')}
									value={carouselSpaceBetweenTablet}
									onChange={(value) =>
										setAttributes({ carouselSpaceBetweenTablet: value })
									}
									min={0}
									max={100}
								/>

								<RangeControl
									label={__('Mobile', 'prolific-blocks')}
									value={carouselSpaceBetweenMobile}
									onChange={(value) =>
										setAttributes({ carouselSpaceBetweenMobile: value })
									}
									min={0}
									max={100}
								/>

								<h3>{__('Navigation & Pagination', 'prolific-blocks')}</h3>

								<ToggleControl
									label={__('Show Navigation Arrows', 'prolific-blocks')}
									checked={carouselNavigation}
									onChange={(value) => setAttributes({ carouselNavigation: value })}
								/>

								<ToggleControl
									label={__('Show Pagination', 'prolific-blocks')}
									checked={carouselPagination}
									onChange={(value) => setAttributes({ carouselPagination: value })}
								/>

								{carouselPagination && (
									<SelectControl
										label={__('Pagination Type', 'prolific-blocks')}
										value={carouselPaginationType}
										options={[
											{ label: __('Bullets', 'prolific-blocks'), value: 'bullets' },
											{ label: __('Fraction', 'prolific-blocks'), value: 'fraction' },
											{
												label: __('Progress Bar', 'prolific-blocks'),
												value: 'progressbar',
											},
										]}
										onChange={(value) =>
											setAttributes({ carouselPaginationType: value })
										}
									/>
								)}

								<h3>{__('Behavior', 'prolific-blocks')}</h3>

								<ToggleControl
									label={__('Enable Autoplay', 'prolific-blocks')}
									checked={carouselAutoplay}
									onChange={(value) => setAttributes({ carouselAutoplay: value })}
								/>

								{carouselAutoplay && (
									<RangeControl
										label={__('Autoplay Delay (ms)', 'prolific-blocks')}
										value={carouselAutoplayDelay}
										onChange={(value) =>
											setAttributes({ carouselAutoplayDelay: value })
										}
										min={1000}
										max={10000}
										step={500}
									/>
								)}

								<ToggleControl
									label={__('Enable Loop', 'prolific-blocks')}
									checked={carouselLoop}
									onChange={(value) => setAttributes({ carouselLoop: value })}
								/>

								<SelectControl
									label={__('Transition Effect', 'prolific-blocks')}
									value={carouselEffect}
									options={[
										{ label: __('Slide', 'prolific-blocks'), value: 'slide' },
										{ label: __('Fade', 'prolific-blocks'), value: 'fade' },
										{ label: __('Coverflow', 'prolific-blocks'), value: 'coverflow' },
									]}
									onChange={(value) => setAttributes({ carouselEffect: value })}
								/>

								<RangeControl
									label={__('Transition Speed (ms)', 'prolific-blocks')}
									value={carouselSpeed}
									onChange={(value) => setAttributes({ carouselSpeed: value })}
									min={100}
									max={2000}
									step={50}
								/>
							</Fragment>
						)}
					</PanelBody>
				</InspectorControls>
			</Fragment>
		);
	};
}, 'withCarouselControls');

addFilter(
	'editor.BlockEdit',
	'prolific/query-carousel-controls',
	withCarouselControls
);

/**
 * Add carousel class to Query block wrapper in editor
 */
const addCarouselClassName = createHigherOrderComponent((BlockListBlock) => {
	return (props) => {
		const { name, attributes } = props;

		if (name !== 'core/query') {
			return <BlockListBlock {...props} />;
		}

		const { carouselEnabled } = attributes;

		if (!carouselEnabled) {
			return <BlockListBlock {...props} />;
		}

		return (
			<BlockListBlock
				{...props}
				className={`${props.className || ''} is-carousel-enabled`}
			/>
		);
	};
}, 'addCarouselClassName');

addFilter(
	'editor.BlockListBlock',
	'prolific/query-carousel-class',
	addCarouselClassName
);
