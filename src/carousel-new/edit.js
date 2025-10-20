/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
	AlignmentControl,
} from '@wordpress/block-editor';
import {
	PanelBody,
	RangeControl,
	ToggleControl,
	SelectControl,
	Button,
	Notice,
} from '@wordpress/components';
import { useEffect, useRef, useState, useCallback } from '@wordpress/element';
import { upload, plus, cog } from '@wordpress/icons';
import { useSelect, useDispatch } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';
import { debounce } from 'lodash';
import { v4 as uuidv4 } from 'uuid';

import './editor.scss';

/**
 * Sanitize SVG content by removing potentially dangerous content.
 */
const sanitizeSvg = (svgContent) => {
	svgContent = svgContent.replace(/<!--[\s\S]*?-->/g, '');

	try {
		const parser = new DOMParser();
		const doc = parser.parseFromString(svgContent, 'image/svg+xml');

		const scripts = doc.querySelectorAll('script');
		scripts.forEach((script) => script.remove());

		const dangerousElements = doc.querySelectorAll('foreignObject, iframe');
		dangerousElements.forEach((el) => el.remove());

		const elements = doc.querySelectorAll('*');
		elements.forEach((el) => {
			Array.from(el.attributes).forEach((attr) => {
				if (attr.name.startsWith('on')) {
					el.removeAttribute(attr.name);
				}
			});

			if (el.hasAttribute('href')) {
				const href = el.getAttribute('href');
				if (href.toLowerCase().startsWith('javascript:')) {
					el.removeAttribute('href');
				}
			}

			if (el.hasAttributeNS('http://www.w3.org/1999/xlink', 'href')) {
				const xlinkHref = el.getAttributeNS('http://www.w3.org/1999/xlink', 'href');
				if (xlinkHref.toLowerCase().startsWith('javascript:')) {
					el.removeAttributeNS('http://www.w3.org/1999/xlink', 'href');
				}
			}

			el.removeAttribute('style');

			if (el.tagName.toLowerCase() === 'svg') {
				el.removeAttribute('width');
				el.removeAttribute('height');
			}
		});

		return new XMLSerializer().serializeToString(doc);
	} catch (e) {
		return '';
	}
};

/**
 * Edit component for Carousel New block.
 */
export default function Edit({ attributes, setAttributes, clientId }) {
	const {
		blockId,
		contentAlign,
		slidesPerViewDesktop,
		slidesPerViewTablet,
		slidesPerViewMobile,
		spaceBetweenDesktop,
		spaceBetweenTablet,
		spaceBetweenMobile,
		centeredSlides,
		autoHeight,
		direction,
		freeMode,
		navigation,
		pagination,
		paginationType,
		scrollbar,
		customNavigation,
		customNavPrev,
		customNavNext,
		customNavPrevSvg,
		customNavNextSvg,
		autoplay,
		autoplayDelay,
		pauseOnHover,
		pauseOnInteraction,
		autoplayReverseDirection,
		stopOnLastSlide,
		effect,
		speed,
		loop,
		allowTouchMove,
		grabCursor,
		keyboard,
		mousewheel,
		resistanceRatio,
		a11yEnabled,
		pauseButton,
		navigationPosition,
		paginationPosition,
		groupControls,
		groupedPosition,
		groupedLayout,
	} = attributes;

	const blockProps = useBlockProps();
	const swiperElRef = useRef(null);
	const uniqueId = useRef(uuidv4());
	const [innerBlocksCount, setInnerBlocksCount] = useState(0);
	const [renderSwiper, setRenderSwiper] = useState(true);
	const [hasSetBlockId, setHasSetBlockId] = useState(false);

	// Set block ID once
	useEffect(() => {
		if (!hasSetBlockId && blockProps.id) {
			setAttributes({ blockId: blockProps.id });
			setHasSetBlockId(true);
		}
	}, [blockProps.id, hasSetBlockId, setAttributes]);

	// Get inner blocks
	const { innerBlocks } = useSelect(
		(select) => ({
			innerBlocks: select('core/block-editor').getBlocks(clientId),
		}),
		[clientId]
	);

	// Get block insertion and selection functions
	const { insertBlock, selectBlock } = useDispatch('core/block-editor');

	// Function to add a new slide
	const addNewSlide = useCallback(() => {
		const newSlide = createBlock('prolific/carousel-new-slide');
		const newSlideIndex = innerBlocks.length;
		insertBlock(newSlide, newSlideIndex, clientId);

		// Navigate to the new slide after it's added
		setTimeout(() => {
			if (swiperElRef.current && swiperElRef.current.swiper) {
				swiperElRef.current.swiper.slideTo(newSlideIndex);
			}
		}, 300);
	}, [insertBlock, innerBlocks.length, clientId]);

	// Function to select the parent carousel block
	const selectParentCarousel = useCallback(() => {
		selectBlock(clientId);
	}, [selectBlock, clientId]);

	// Update inner blocks count
	useEffect(() => {
		setInnerBlocksCount(innerBlocks.length);
	}, [innerBlocks]);

	// Update Swiper when inner blocks change
	useEffect(() => {
		if (swiperElRef.current && swiperElRef.current.swiper) {
			setTimeout(() => {
				swiperElRef.current.swiper.update();
				if (autoHeight && swiperElRef.current.swiper.updateAutoHeight) {
					swiperElRef.current.swiper.updateAutoHeight(0);
				}
			}, 100);
		}
	}, [innerBlocksCount, autoHeight]);

	// Debounced reinitialize function
	const reinitializeSwiper = useCallback(
		debounce(() => {
			setRenderSwiper(false);
			setTimeout(() => {
				setRenderSwiper(true);
			}, 300);
		}, 300),
		[]
	);

	// Reinitialize on attribute changes
	useEffect(() => {
		if (swiperElRef.current) {
			reinitializeSwiper();
		}
	}, [
		reinitializeSwiper,
		effect,
		slidesPerViewMobile,
		spaceBetweenMobile,
		slidesPerViewTablet,
		spaceBetweenTablet,
		centeredSlides,
		autoplay,
		autoplayDelay,
		loop,
		direction,
		pauseOnHover,
		pauseButton,
		customNavigation,
		autoHeight,
	]);

	// Set navigation and pagination element class names
	useEffect(() => {
		if (!attributes.navigationNextEl || !attributes.navigationPrevEl || !attributes.paginationEl) {
			setAttributes({
				navigationNextEl: `.custom-next-${uniqueId.current}`,
				navigationPrevEl: `.custom-prev-${uniqueId.current}`,
				paginationEl: `.custom-pagination-${uniqueId.current}`,
			});
		}
	}, []);

	// SVG upload handlers
	const fetchSvgContent = async (url) => {
		try {
			const cacheBustUrl = `${url}?_=${Date.now()}`;
			const response = await fetch(cacheBustUrl, {
				credentials: 'same-origin',
				headers: {
					Accept: 'image/svg+xml, */*',
				},
			});

			if (!response.ok) {
				throw new Error(`SVG fetch failed: ${response.status} ${response.statusText}`);
			}

			const contentType = response.headers.get('content-type');
			if (contentType && !contentType.includes('svg')) {
				throw new Error(`Invalid content type: ${contentType}`);
			}

			const text = await response.text();
			if (!text.includes('<svg') || !text.includes('</svg>')) {
				throw new Error('Invalid SVG content');
			}

			return sanitizeSvg(text);
		} catch (error) {
			return '';
		}
	};

	const onSelectPrevSvg = async (media) => {
		if (media && media.url) {
			try {
				const svgContent = await fetchSvgContent(media.url);
				setAttributes({
					customNavPrev: media.url,
					customNavPrevSvg: svgContent
				});
			} catch (error) {
				// Silent error handling
			}
		}
	};

	const onSelectNextSvg = async (media) => {
		if (media && media.url) {
			try {
				const svgContent = await fetchSvgContent(media.url);
				setAttributes({
					customNavNext: media.url,
					customNavNextSvg: svgContent
				});
			} catch (error) {
				// Silent error handling
			}
		}
	};

	// InnerBlocks configuration
	// IMPORTANT: We create innerBlocksProps with a className to identify the wrapper,
	// but we DON'T spread it on the swiper-container because that prevents parent block selection.
	// Instead, we'll render it inside the swiper-container.
	const innerBlocksProps = useInnerBlocksProps(
		{
			className: 'carousel-new-slides-wrapper',
		},
		{
			allowedBlocks: ['prolific/carousel-new-slide'],
			template: [
				['prolific/carousel-new-slide'],
				['prolific/carousel-new-slide'],
			],
		}
	);

	return (
		<>
			<InspectorControls>
				{/* Documentation Notice */}
				<div style={{ padding: '16px 16px 0' }}>
					<Notice status="info" isDismissible={false}>
						<div>
							<div style={{ marginBottom: '4px' }}>
								{__('Need help?', 'prolific-blocks')}
							</div>
							<a
								href="https://prolificdigital.notion.site/Carousel-2905efcd8c5f8046bfbcc568c0144038?source=copy_link"
								target="_blank"
								rel="noopener noreferrer"
								style={{
									color: '#007cba',
									textDecoration: 'underline',
									fontWeight: '500'
								}}
							>
								{__('View Documentation', 'prolific-blocks')}
							</a>
						</div>
					</Notice>
				</div>

				{/* Slide Management */}
				<PanelBody title={__('Slide Management', 'prolific-blocks')} initialOpen={true}>
					<div style={{ marginBottom: '16px' }}>
						<p className="components-base-control__help" style={{ marginTop: 0 }}>
							{__('Current slides: ', 'prolific-blocks')}
							<strong>{innerBlocks.length}</strong>
						</p>
						<Button
							variant="primary"
							icon={plus}
							onClick={addNewSlide}
							style={{ width: '100%' }}
						>
							{__('Add New Slide', 'prolific-blocks')}
						</Button>
					</div>
				</PanelBody>

				{/* Panel 1: Content Alignment */}
				<PanelBody title={__('Content Alignment', 'prolific-blocks')} initialOpen={false}>
					<p className="components-base-control__help">
						{__('Control how content is aligned within the carousel. Note: This is separate from block width alignment (available in the block toolbar).', 'prolific-blocks')}
					</p>
					<AlignmentControl
						value={contentAlign}
						onChange={(value) => setAttributes({ contentAlign: value })}
						alignments={['left', 'center', 'right']}
					/>
				</PanelBody>

				{/* Panel 2: Layout Settings */}
				<PanelBody title={__('Layout Settings', 'prolific-blocks')} initialOpen={false}>
					<p className="components-base-control__help">
						{__('Configure how many slides are visible at different screen sizes.', 'prolific-blocks')}
					</p>

					<RangeControl
						__nextHasNoMarginBottom
						__next40pxDefaultSize
						label={__('Slides per View (Desktop)', 'prolific-blocks')}
						value={slidesPerViewDesktop}
						onChange={(value) => setAttributes({ slidesPerViewDesktop: value })}
						min={1}
						max={6}
						step={1}
						help={__('Number of slides visible on desktop screens (1024px+)', 'prolific-blocks')}
					/>

					<RangeControl
						__nextHasNoMarginBottom
						__next40pxDefaultSize
						label={__('Slides per View (Tablet)', 'prolific-blocks')}
						value={slidesPerViewTablet}
						onChange={(value) => setAttributes({ slidesPerViewTablet: value })}
						min={1}
						max={4}
						step={1}
						help={__('Number of slides visible on tablet screens (768px-1023px)', 'prolific-blocks')}
					/>

					<RangeControl
						__nextHasNoMarginBottom
						__next40pxDefaultSize
						label={__('Slides per View (Mobile)', 'prolific-blocks')}
						value={slidesPerViewMobile}
						onChange={(value) => setAttributes({ slidesPerViewMobile: value })}
						min={1}
						max={3}
						step={1}
						help={__('Number of slides visible on mobile screens (0-767px)', 'prolific-blocks')}
					/>

					<hr />

					<RangeControl
						__nextHasNoMarginBottom
						__next40pxDefaultSize
						label={__('Space Between Slides (Desktop)', 'prolific-blocks')}
						value={spaceBetweenDesktop}
						onChange={(value) => setAttributes({ spaceBetweenDesktop: value })}
						min={0}
						max={100}
						step={5}
						help={__('Space in pixels between slides on desktop', 'prolific-blocks')}
					/>

					<RangeControl
						__nextHasNoMarginBottom
						__next40pxDefaultSize
						label={__('Space Between Slides (Tablet)', 'prolific-blocks')}
						value={spaceBetweenTablet}
						onChange={(value) => setAttributes({ spaceBetweenTablet: value })}
						min={0}
						max={100}
						step={5}
						help={__('Space in pixels between slides on tablet', 'prolific-blocks')}
					/>

					<RangeControl
						__nextHasNoMarginBottom
						__next40pxDefaultSize
						label={__('Space Between Slides (Mobile)', 'prolific-blocks')}
						value={spaceBetweenMobile}
						onChange={(value) => setAttributes({ spaceBetweenMobile: value })}
						min={0}
						max={100}
						step={5}
						help={__('Space in pixels between slides on mobile', 'prolific-blocks')}
					/>

					<hr />

					<ToggleControl
						__nextHasNoMarginBottom
						label={__('Centered Slides', 'prolific-blocks')}
						checked={centeredSlides}
						onChange={(value) => setAttributes({ centeredSlides: value })}
						help={__('Center the active slide instead of aligning to the left', 'prolific-blocks')}
					/>

					<ToggleControl
						__nextHasNoMarginBottom
						label={__('Auto Height', 'prolific-blocks')}
						checked={autoHeight}
						onChange={(value) => setAttributes({ autoHeight: value })}
						help={__('Carousel height will adapt to the height of the active slide', 'prolific-blocks')}
					/>

					<SelectControl
						__nextHasNoMarginBottom
						__next40pxDefaultSize
						label={__('Direction', 'prolific-blocks')}
						value={direction}
						options={[
							{ label: __('Horizontal', 'prolific-blocks'), value: 'horizontal' },
							{ label: __('Vertical', 'prolific-blocks'), value: 'vertical' },
						]}
						onChange={(value) => setAttributes({ direction: value })}
						help={__('Slide transition direction', 'prolific-blocks')}
					/>

					<ToggleControl
						__nextHasNoMarginBottom
						label={__('Free Mode', 'prolific-blocks')}
						checked={freeMode}
						onChange={(value) => setAttributes({ freeMode: value })}
						help={__('Slides will not have fixed positions, more like a scroll', 'prolific-blocks')}
					/>
				</PanelBody>

				{/* Panel 3: Control Positioning */}
				<PanelBody title={__('Control Positioning', 'prolific-blocks')} initialOpen={false}>
					<ToggleControl
						__nextHasNoMarginBottom
						label={__('Group Controls Together', 'prolific-blocks')}
						checked={groupControls}
						onChange={(value) => setAttributes({ groupControls: value })}
						help={__('Group navigation and pagination controls together', 'prolific-blocks')}
					/>

					{groupControls ? (
						<>
							<SelectControl
								__nextHasNoMarginBottom
								__next40pxDefaultSize
								label={__('Grouped Controls Position', 'prolific-blocks')}
								value={groupedPosition}
								options={[
									{ label: __('Top', 'prolific-blocks'), value: 'top' },
									{ label: __('Bottom', 'prolific-blocks'), value: 'bottom' },
								]}
								onChange={(value) => setAttributes({ groupedPosition: value })}
								help={__('Position of grouped navigation and pagination controls', 'prolific-blocks')}
							/>

							<SelectControl
								__nextHasNoMarginBottom
								__next40pxDefaultSize
								label={__('Grouped Controls Layout', 'prolific-blocks')}
								value={groupedLayout}
								options={[
									{ label: __('Split (Nav on sides, pagination center)', 'prolific-blocks'), value: 'split' },
									{ label: __('Left (Nav left, pagination right)', 'prolific-blocks'), value: 'left' },
									{ label: __('Right (Pagination left, nav right)', 'prolific-blocks'), value: 'right' },
								]}
								onChange={(value) => setAttributes({ groupedLayout: value })}
								help={__('How to arrange navigation and pagination when grouped', 'prolific-blocks')}
							/>
						</>
					) : (
						<>
							{navigation && (
								<SelectControl
									__nextHasNoMarginBottom
									__next40pxDefaultSize
									label={__('Navigation Position', 'prolific-blocks')}
									value={navigationPosition}
									options={[
										{ label: __('Top', 'prolific-blocks'), value: 'top' },
										{ label: __('Center', 'prolific-blocks'), value: 'center' },
										{ label: __('Bottom', 'prolific-blocks'), value: 'bottom' },
									]}
									onChange={(value) => setAttributes({ navigationPosition: value })}
									help={__('Vertical position of navigation arrows over carousel', 'prolific-blocks')}
								/>
							)}

							{pagination && (
								<SelectControl
									__nextHasNoMarginBottom
									__next40pxDefaultSize
									label={__('Pagination Position', 'prolific-blocks')}
									value={paginationPosition}
									options={[
										{ label: __('Top', 'prolific-blocks'), value: 'top' },
										{ label: __('Bottom', 'prolific-blocks'), value: 'bottom' },
									]}
									onChange={(value) => setAttributes({ paginationPosition: value })}
									help={__('Position of pagination relative to carousel', 'prolific-blocks')}
								/>
							)}
						</>
					)}
				</PanelBody>

				{/* Panel 4: Navigation & Controls */}
				<PanelBody title={__('Navigation & Controls', 'prolific-blocks')} initialOpen={false}>
					<ToggleControl
						__nextHasNoMarginBottom
						label={__('Show Navigation Arrows', 'prolific-blocks')}
						checked={navigation}
						onChange={(value) => setAttributes({ navigation: value })}
						help={__('Display previous/next arrow buttons', 'prolific-blocks')}
					/>

					{navigation && (
						<>
							<ToggleControl
								__nextHasNoMarginBottom
								label={__('Custom Navigation Icons', 'prolific-blocks')}
								checked={customNavigation}
								onChange={(value) => setAttributes({ customNavigation: value })}
								help={__('Upload custom SVG icons for navigation arrows', 'prolific-blocks')}
							/>

							{customNavigation && (
								<div className="carousel-custom-nav-upload">
									<MediaUploadCheck>
										<MediaUpload
											onSelect={onSelectPrevSvg}
											allowedTypes={['image/svg+xml']}
											value={customNavPrevSvg}
											render={({ open }) => (
												<div style={{ marginBottom: '12px' }}>
													<Button onClick={open} variant="secondary" icon={upload}>
														{customNavPrevSvg
															? __('Change Previous Arrow', 'prolific-blocks')
															: __('Upload Previous Arrow SVG', 'prolific-blocks')}
													</Button>
													{customNavPrevSvg && (
														<>
															<Button
																onClick={() => setAttributes({ customNavPrev: '', customNavPrevSvg: '' })}
																variant="link"
																isDestructive
																style={{ marginLeft: '8px' }}
															>
																{__('Remove', 'prolific-blocks')}
															</Button>
															{customNavPrev && (
																<img
																	src={customNavPrev}
																	alt={__('Custom Previous Button', 'prolific-blocks')}
																	style={{
																		display: 'block',
																		marginTop: '10px',
																		maxWidth: '50px',
																		maxHeight: '50px',
																	}}
																/>
															)}
														</>
													)}
												</div>
											)}
										/>
									</MediaUploadCheck>

									<MediaUploadCheck>
										<MediaUpload
											onSelect={onSelectNextSvg}
											allowedTypes={['image/svg+xml']}
											value={customNavNextSvg}
											render={({ open }) => (
												<div>
													<Button onClick={open} variant="secondary" icon={upload}>
														{customNavNextSvg
															? __('Change Next Arrow', 'prolific-blocks')
															: __('Upload Next Arrow SVG', 'prolific-blocks')}
													</Button>
													{customNavNextSvg && (
														<>
															<Button
																onClick={() => setAttributes({ customNavNext: '', customNavNextSvg: '' })}
																variant="link"
																isDestructive
																style={{ marginLeft: '8px' }}
															>
																{__('Remove', 'prolific-blocks')}
															</Button>
															{customNavNext && (
																<img
																	src={customNavNext}
																	alt={__('Custom Next Button', 'prolific-blocks')}
																	style={{
																		display: 'block',
																		marginTop: '10px',
																		maxWidth: '50px',
																		maxHeight: '50px',
																	}}
																/>
															)}
														</>
													)}
												</div>
											)}
										/>
									</MediaUploadCheck>
								</div>
							)}
						</>
					)}

					<hr />

					<ToggleControl
						__nextHasNoMarginBottom
						label={__('Show Pagination', 'prolific-blocks')}
						checked={pagination}
						onChange={(value) => setAttributes({ pagination: value })}
						help={__('Display pagination indicators', 'prolific-blocks')}
					/>

					{pagination && (
						<>
							<SelectControl
								__nextHasNoMarginBottom
								__next40pxDefaultSize
								label={__('Pagination Type', 'prolific-blocks')}
								value={paginationType}
								options={[
									{ label: __('Bullets', 'prolific-blocks'), value: 'bullets' },
									{ label: __('Fraction', 'prolific-blocks'), value: 'fraction' },
									{ label: __('Progress Bar', 'prolific-blocks'), value: 'progressbar' },
								]}
								onChange={(value) => setAttributes({ paginationType: value })}
							/>
						</>
					)}

					<ToggleControl
						__nextHasNoMarginBottom
						label={__('Show Scrollbar', 'prolific-blocks')}
						checked={scrollbar}
						onChange={(value) => setAttributes({ scrollbar: value })}
						help={__('Display a draggable scrollbar', 'prolific-blocks')}
					/>
				</PanelBody>

				{/* Panel 5: Autoplay Settings */}
				<PanelBody title={__('Autoplay Settings', 'prolific-blocks')} initialOpen={false}>
					<ToggleControl
						__nextHasNoMarginBottom
						label={__('Enable Autoplay', 'prolific-blocks')}
						checked={autoplay}
						onChange={(value) => setAttributes({ autoplay: value })}
						help={__('Automatically advance to the next slide (frontend only)', 'prolific-blocks')}
					/>

					{autoplay && (
						<>
							<Notice status="info" isDismissible={false}>
								{__(
									'Autoplay is disabled in the editor for better editing experience. It will work on the frontend.',
									'prolific-blocks'
								)}
							</Notice>

							<RangeControl
								__nextHasNoMarginBottom
								__next40pxDefaultSize
								label={__('Autoplay Delay (ms)', 'prolific-blocks')}
								value={autoplayDelay}
								onChange={(value) => setAttributes({ autoplayDelay: value })}
								min={1000}
								max={10000}
								step={500}
								help={__('Time in milliseconds between slide transitions', 'prolific-blocks')}
							/>

							<ToggleControl
								__nextHasNoMarginBottom
								label={__('Pause on Hover', 'prolific-blocks')}
								checked={pauseOnHover}
								onChange={(value) => setAttributes({ pauseOnHover: value })}
								help={__('Pause autoplay when user hovers over carousel', 'prolific-blocks')}
							/>

							<ToggleControl
								__nextHasNoMarginBottom
								label={__('Pause on Interaction', 'prolific-blocks')}
								checked={pauseOnInteraction}
								onChange={(value) => setAttributes({ pauseOnInteraction: value })}
								help={__('Pause autoplay when user interacts with carousel', 'prolific-blocks')}
							/>

							<ToggleControl
								__nextHasNoMarginBottom
								label={__('Reverse Direction', 'prolific-blocks')}
								checked={autoplayReverseDirection}
								onChange={(value) => setAttributes({ autoplayReverseDirection: value })}
								help={__('Run autoplay in reverse direction', 'prolific-blocks')}
							/>

							<ToggleControl
								__nextHasNoMarginBottom
								label={__('Stop on Last Slide', 'prolific-blocks')}
								checked={stopOnLastSlide}
								onChange={(value) => setAttributes({ stopOnLastSlide: value })}
								help={__('Stop autoplay when reaching the last slide', 'prolific-blocks')}
							/>

							<ToggleControl
								__nextHasNoMarginBottom
								label={__('Show Pause Button', 'prolific-blocks')}
								checked={pauseButton}
								onChange={(value) => setAttributes({ pauseButton: value })}
								help={__('Display a pause/play button for user control', 'prolific-blocks')}
							/>
						</>
					)}
				</PanelBody>

				{/* Panel 6: Effects & Transitions */}
				<PanelBody title={__('Effects & Transitions', 'prolific-blocks')} initialOpen={false}>
					<SelectControl
						__nextHasNoMarginBottom
						__next40pxDefaultSize
						label={__('Transition Effect', 'prolific-blocks')}
						value={effect}
						options={[
							{ label: __('Slide', 'prolific-blocks'), value: 'slide' },
							{ label: __('Fade', 'prolific-blocks'), value: 'fade' },
							{ label: __('Cube', 'prolific-blocks'), value: 'cube' },
							{ label: __('Flip', 'prolific-blocks'), value: 'flip' },
							{ label: __('Coverflow', 'prolific-blocks'), value: 'coverflow' },
							{ label: __('Cards', 'prolific-blocks'), value: 'cards' },
						]}
						onChange={(value) => setAttributes({ effect: value })}
						help={__('Visual effect for slide transitions', 'prolific-blocks')}
					/>

					{effect === 'fade' && (
						<Notice status="info" isDismissible={false}>
							{__('Fade effect works best with 1 slide per view', 'prolific-blocks')}
						</Notice>
					)}

					{(effect === 'cube' || effect === 'flip') && (
						<Notice status="info" isDismissible={false}>
							{__('This effect requires exactly 1 slide per view', 'prolific-blocks')}
						</Notice>
					)}

					<RangeControl
						__nextHasNoMarginBottom
						__next40pxDefaultSize
						label={__('Transition Speed (ms)', 'prolific-blocks')}
						value={speed}
						onChange={(value) => setAttributes({ speed: value })}
						min={100}
						max={2000}
						step={50}
						help={__('Duration of transition between slides in milliseconds', 'prolific-blocks')}
					/>

					<ToggleControl
						__nextHasNoMarginBottom
						label={__('Loop Mode', 'prolific-blocks')}
						checked={loop}
						onChange={(value) => setAttributes({ loop: value })}
						help={__('Enable continuous loop mode (frontend only)', 'prolific-blocks')}
					/>
				</PanelBody>

				{/* Panel 7: Interaction Settings */}
				<PanelBody title={__('Interaction Settings', 'prolific-blocks')} initialOpen={false}>
					<ToggleControl
						__nextHasNoMarginBottom
						label={__('Touch/Swipe Enabled', 'prolific-blocks')}
						checked={allowTouchMove}
						onChange={(value) => setAttributes({ allowTouchMove: value })}
						help={__('Allow users to swipe/drag slides with touch or mouse', 'prolific-blocks')}
					/>

					<ToggleControl
						__nextHasNoMarginBottom
						label={__('Grab Cursor', 'prolific-blocks')}
						checked={grabCursor}
						onChange={(value) => setAttributes({ grabCursor: value })}
						help={__('Show grab cursor when hovering over carousel', 'prolific-blocks')}
					/>

					<ToggleControl
						__nextHasNoMarginBottom
						label={__('Keyboard Navigation', 'prolific-blocks')}
						checked={keyboard}
						onChange={(value) => setAttributes({ keyboard: value })}
						help={__('Enable keyboard arrow keys for navigation', 'prolific-blocks')}
					/>

					<ToggleControl
						__nextHasNoMarginBottom
						label={__('Mousewheel Control', 'prolific-blocks')}
						checked={mousewheel}
						onChange={(value) => setAttributes({ mousewheel: value })}
						help={__('Enable navigation with mousewheel scroll', 'prolific-blocks')}
					/>

					<RangeControl
						__nextHasNoMarginBottom
						__next40pxDefaultSize
						label={__('Resistance Ratio', 'prolific-blocks')}
						value={resistanceRatio}
						onChange={(value) => setAttributes({ resistanceRatio: value })}
						min={0}
						max={1}
						step={0.05}
						help={__(
							'Resistance when swiping edges of carousel (0 = no resistance, 1 = full resistance)',
							'prolific-blocks'
						)}
					/>
				</PanelBody>

				{/* Panel 8: Accessibility */}
				<PanelBody title={__('Accessibility', 'prolific-blocks')} initialOpen={false}>
					<ToggleControl
						__nextHasNoMarginBottom
						label={__('Enhanced Accessibility', 'prolific-blocks')}
						checked={a11yEnabled}
						onChange={(value) => setAttributes({ a11yEnabled: value })}
						help={__(
							'Enable WCAG-compliant accessibility features including ARIA labels and keyboard navigation',
							'prolific-blocks'
						)}
					/>

					{a11yEnabled && (
						<Notice status="success" isDismissible={false}>
							{__(
								'Accessibility features enabled: ARIA labels, keyboard navigation, screen reader support, and focus management.',
								'prolific-blocks'
							)}
						</Notice>
					)}
				</PanelBody>
			</InspectorControls>

			<div
				{...blockProps}
				className={`wp-block-prolific-carousel-new has-content-align-${contentAlign || 'center'}`}
			>
				{/* Add Slide Button - Above Carousel */}
				<div className="carousel-new-add-slide-wrapper">
					<Button
						variant="secondary"
						icon={plus}
						onClick={addNewSlide}
						className="carousel-new-add-slide-button"
					>
						{__('Add New Slide', 'prolific-blocks')}
					</Button>
					<Button
						variant="secondary"
						icon={cog}
						onClick={selectParentCarousel}
						className="carousel-new-settings-button"
					>
						{__('Carousel Settings', 'prolific-blocks')}
					</Button>
					<span className="carousel-slide-count-info">
						{innerBlocks.length} {innerBlocks.length === 1 ? __('slide', 'prolific-blocks') : __('slides', 'prolific-blocks')}
					</span>
				</div>

				<div className="carousel-new-swiper-wrapper">
					{renderSwiper && (
						<swiper-container
							ref={swiperElRef}
							slides-per-view={slidesPerViewDesktop}
							direction={direction}
							space-between={spaceBetweenDesktop}
							navigation="false"
							pagination={pagination.toString()}
							pagination-type={paginationType}
							pagination-el={groupControls && pagination ? `.custom-pagination-${uniqueId.current}` : '.swiper-pagination'}
							scrollbar={scrollbar.toString()}
							allow-touch-move="false"
							keyboard={keyboard.toString()}
							grab-cursor="false"
							autoplay="false"
							centered-slides={centeredSlides.toString()}
							speed={speed.toString()}
							loop="false"
							pause-on-hover={pauseOnHover.toString()}
							a11y={a11yEnabled.toString()}
							auto-height={autoHeight.toString()}
							free-mode={freeMode.toString()}
							effect={effect}
							breakpoints={`{
								"1024": {
									"slidesPerView": ${slidesPerViewDesktop},
									"spaceBetween": ${spaceBetweenDesktop}
								},
								"768": {
									"slidesPerView": ${slidesPerViewTablet},
									"spaceBetween": ${spaceBetweenTablet}
								},
								"0": {
									"slidesPerView": ${slidesPerViewMobile},
									"spaceBetween": ${spaceBetweenMobile}
								}
							}`}
							role="region"
							aria-label={__('Carousel', 'prolific-blocks')}
							class="editor-carousel-new"
						>
							{innerBlocksProps.children}
						</swiper-container>
					)}

					{/* Navigation when NOT grouped */}
					{!groupControls && navigation && (
						<div className={`carousel-new-nav-wrapper nav-position-${navigationPosition || 'center'}`}>
							<div className="carousel-new-nav-buttons">
								<button
									className={`carousel-new-nav-prev custom-prev-${uniqueId.current}`}
									aria-label={__('Previous slide', 'prolific-blocks')}
									role="button"
									onClick={(e) => {
										e.preventDefault();
										e.stopPropagation();
										if (swiperElRef.current && swiperElRef.current.swiper) {
											swiperElRef.current.swiper.slidePrev();
										}
									}}
								>
									{customNavigation && customNavPrevSvg ? (
										<span dangerouslySetInnerHTML={{ __html: customNavPrevSvg }} />
									) : (
										<span aria-hidden="true">&#10094;</span>
									)}
									<span className="screen-reader-text">{__('Previous', 'prolific-blocks')}</span>
								</button>
								<button
									className={`carousel-new-nav-next custom-next-${uniqueId.current}`}
									aria-label={__('Next slide', 'prolific-blocks')}
									role="button"
									onClick={(e) => {
										e.preventDefault();
										e.stopPropagation();
										if (swiperElRef.current && swiperElRef.current.swiper) {
											swiperElRef.current.swiper.slideNext();
										}
									}}
								>
									{customNavigation && customNavNextSvg ? (
										<span dangerouslySetInnerHTML={{ __html: customNavNextSvg }} />
									) : (
										<span aria-hidden="true">&#10095;</span>
									)}
									<span className="screen-reader-text">{__('Next', 'prolific-blocks')}</span>
								</button>
							</div>
						</div>
					)}

					{/* Pagination when NOT grouped */}
					{!groupControls && pagination && (
						<div className={`swiper-pagination pagination-position-${paginationPosition || 'bottom'}`}></div>
					)}

					{/* Grouped controls */}
					{groupControls && (navigation || pagination) && (
						<div className={`carousel-new-controls-group grouped grouped-position-${groupedPosition || 'bottom'} grouped-layout-${groupedLayout || 'split'}`}>
							{groupedLayout === 'split' ? (
								<>
									{/* Split layout: individual buttons for proper ordering */}
									{navigation && (
										<button
											className={`carousel-new-nav-prev custom-prev-${uniqueId.current}`}
											aria-label={__('Previous slide', 'prolific-blocks')}
											role="button"
											onClick={(e) => {
												e.preventDefault();
												e.stopPropagation();
												if (swiperElRef.current && swiperElRef.current.swiper) {
													swiperElRef.current.swiper.slidePrev();
												}
											}}
										>
											{customNavigation && customNavPrevSvg ? (
												<span dangerouslySetInnerHTML={{ __html: customNavPrevSvg }} />
											) : (
												<span aria-hidden="true">&#10094;</span>
											)}
											<span className="screen-reader-text">{__('Previous', 'prolific-blocks')}</span>
										</button>
									)}
									{pagination && (
										<div className={`swiper-pagination custom-pagination-${uniqueId.current} grouped`}></div>
									)}
									{navigation && (
										<button
											className={`carousel-new-nav-next custom-next-${uniqueId.current}`}
											aria-label={__('Next slide', 'prolific-blocks')}
											role="button"
											onClick={(e) => {
												e.preventDefault();
												e.stopPropagation();
												if (swiperElRef.current && swiperElRef.current.swiper) {
													swiperElRef.current.swiper.slideNext();
												}
											}}
										>
											{customNavigation && customNavNextSvg ? (
												<span dangerouslySetInnerHTML={{ __html: customNavNextSvg }} />
											) : (
												<span aria-hidden="true">&#10095;</span>
											)}
											<span className="screen-reader-text">{__('Next', 'prolific-blocks')}</span>
										</button>
									)}
								</>
							) : (
								<>
									{/* Left/Right layouts: buttons grouped in wrapper */}
									{navigation && (
										<div className="carousel-new-nav-buttons">
											<button
												className={`carousel-new-nav-prev custom-prev-${uniqueId.current}`}
												aria-label={__('Previous slide', 'prolific-blocks')}
												role="button"
												onClick={(e) => {
													e.preventDefault();
													e.stopPropagation();
													if (swiperElRef.current && swiperElRef.current.swiper) {
														swiperElRef.current.swiper.slidePrev();
													}
												}}
											>
												{customNavigation && customNavPrevSvg ? (
													<span dangerouslySetInnerHTML={{ __html: customNavPrevSvg }} />
												) : (
													<span aria-hidden="true">&#10094;</span>
												)}
												<span className="screen-reader-text">{__('Previous', 'prolific-blocks')}</span>
											</button>
											<button
												className={`carousel-new-nav-next custom-next-${uniqueId.current}`}
												aria-label={__('Next slide', 'prolific-blocks')}
												role="button"
												onClick={(e) => {
													e.preventDefault();
													e.stopPropagation();
													if (swiperElRef.current && swiperElRef.current.swiper) {
														swiperElRef.current.swiper.slideNext();
													}
												}}
											>
												{customNavigation && customNavNextSvg ? (
													<span dangerouslySetInnerHTML={{ __html: customNavNextSvg }} />
												) : (
													<span aria-hidden="true">&#10095;</span>
												)}
												<span className="screen-reader-text">{__('Next', 'prolific-blocks')}</span>
											</button>
										</div>
									)}
									{pagination && (
										<div className={`swiper-pagination custom-pagination-${uniqueId.current} grouped`}></div>
									)}
								</>
							)}
						</div>
					)}
				</div>
				{autoplay && pauseButton && (
					<button className="carousel-new-pause-button" aria-label={__('Pause carousel', 'prolific-blocks')} role="button">
						<span aria-hidden="true">⏸</span>
						<span className="screen-reader-text">{__('Pause', 'prolific-blocks')}</span>
					</button>
				)}
			</div>
		</>
	);
}
