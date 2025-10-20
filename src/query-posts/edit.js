/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	InspectorControls,
} from '@wordpress/block-editor';
import {
	PanelBody,
	SelectControl,
	RangeControl,
	ToggleControl,
	TextControl,
	Button,
	ButtonGroup,
	CheckboxControl,
	__experimentalNumberControl as NumberControl,
	Placeholder,
	Spinner,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useEffect, useState } from '@wordpress/element';
import ServerSideRender from '@wordpress/server-side-render';
import SupportCard from '../components/SupportCard';

/**
 * Edit component for Query Posts block
 */
export default function Edit({ attributes, setAttributes, clientId }) {
	const {
		postType,
		postsPerPage,
		orderBy,
		order,
		offset,
		includeIds,
		excludeIds,
		categories,
		tags,
		authorIds,
		postStatus,
		stickyPosts,
		displayMode,
		columns,
		columnsTablet,
		columnsMobile,
		gap,
		equalHeight,
		enableCarousel,
		slidesPerViewDesktop,
		slidesPerViewTablet,
		slidesPerViewMobile,
		spaceBetweenDesktop,
		spaceBetweenTablet,
		spaceBetweenMobile,
		carouselLoop,
		carouselAutoplay,
		autoplayDelay,
		carouselNavigation,
		carouselPagination,
		paginationType,
		carouselSpeed,
		centeredSlides,
		pauseOnHover,
		grabCursor,
		keyboard,
		showSearch,
		searchPlaceholder,
		showCategoryFilter,
		showTagFilter,
		showDateFilter,
		showSortDropdown,
		enableLoadMore,
		loadMoreText,
		enablePagination,
		showFeaturedImage,
		imageSizeSlug,
		imagePosition,
		showTitle,
		titleTag,
		showExcerpt,
		excerptLength,
		showMeta,
		showAuthor,
		showDate,
		showCategories,
		showTags,
		showReadMore,
		readMoreText,
		noResultsText,
	} = attributes;

	// Generate unique block ID
	useEffect(() => {
		if (!attributes.blockId) {
			setAttributes({ blockId: `query-posts-${clientId}` });
		}
	}, [clientId]);

	// Fetch available post types
	const postTypes = useSelect((select) => {
		const { getPostTypes } = select('core');
		const types = getPostTypes({ per_page: -1 }) || [];
		return types.filter((type) => type.viewable).map((type) => ({
			label: type.name,
			value: type.slug,
		}));
	}, []);

	// Fetch categories for the selected post type
	const categoryOptions = useSelect(
		(select) => {
			if (postType !== 'post') return [];
			const { getEntityRecords } = select('core');
			const cats = getEntityRecords('taxonomy', 'category', { per_page: -1 }) || [];
			return cats.map((cat) => ({
				label: cat.name,
				value: cat.id,
			}));
		},
		[postType]
	);

	// Fetch tags
	const tagOptions = useSelect(
		(select) => {
			if (postType !== 'post') return [];
			const { getEntityRecords } = select('core');
			const allTags = getEntityRecords('taxonomy', 'post_tag', { per_page: -1 }) || [];
			return allTags.map((tag) => ({
				label: tag.name,
				value: tag.id,
			}));
		},
		[postType]
	);

	// Fetch authors
	const authorOptions = useSelect((select) => {
		const { getUsers } = select('core');
		const users = getUsers({ who: 'authors', per_page: -1 }) || [];
		return users.map((user) => ({
			label: user.name,
			value: user.id,
		}));
	}, []);

	// Fetch image sizes
	const imageSizes = useSelect((select) => {
		const settings = select('core/block-editor').getSettings();
		return settings.imageSizes || [
			{ slug: 'thumbnail', name: 'Thumbnail' },
			{ slug: 'medium', name: 'Medium' },
			{ slug: 'large', name: 'Large' },
			{ slug: 'full', name: 'Full Size' },
		];
	}, []);

	const blockProps = useBlockProps({
		className: 'prolific-query-posts-editor',
	});

	return (
		<>
			<InspectorControls>
				<SupportCard />
				{/* Query Settings Panel */}
				<PanelBody title={__('Query Settings', 'prolific-blocks')} initialOpen={true}>
					{postTypes && postTypes.length > 0 && (
						<SelectControl
							label={__('Post Type', 'prolific-blocks')}
							value={postType}
							options={postTypes}
							onChange={(value) => setAttributes({ postType: value })}
							help={__('Select the post type to query', 'prolific-blocks')}
						/>
					)}

					<RangeControl
						label={__('Number of Posts', 'prolific-blocks')}
						value={postsPerPage}
						onChange={(value) => setAttributes({ postsPerPage: value })}
						min={1}
						max={100}
						help={__('Maximum number of posts to display', 'prolific-blocks')}
					/>

					<SelectControl
						label={__('Order By', 'prolific-blocks')}
						value={orderBy}
						options={[
							{ label: __('Date', 'prolific-blocks'), value: 'date' },
							{ label: __('Title', 'prolific-blocks'), value: 'title' },
							{ label: __('Modified Date', 'prolific-blocks'), value: 'modified' },
							{ label: __('Menu Order', 'prolific-blocks'), value: 'menu_order' },
							{ label: __('Random', 'prolific-blocks'), value: 'rand' },
							{ label: __('Author', 'prolific-blocks'), value: 'author' },
							{ label: __('Comment Count', 'prolific-blocks'), value: 'comment_count' },
						]}
						onChange={(value) => setAttributes({ orderBy: value })}
					/>

					<SelectControl
						label={__('Order', 'prolific-blocks')}
						value={order}
						options={[
							{ label: __('Descending', 'prolific-blocks'), value: 'desc' },
							{ label: __('Ascending', 'prolific-blocks'), value: 'asc' },
						]}
						onChange={(value) => setAttributes({ order: value })}
					/>

					<RangeControl
						label={__('Offset', 'prolific-blocks')}
						value={offset}
						onChange={(value) => setAttributes({ offset: value })}
						min={0}
						max={50}
						help={__('Skip first N posts', 'prolific-blocks')}
					/>

					<SelectControl
						label={__('Post Status', 'prolific-blocks')}
						value={postStatus}
						options={[
							{ label: __('Published', 'prolific-blocks'), value: 'publish' },
							{ label: __('Draft', 'prolific-blocks'), value: 'draft' },
							{ label: __('Pending', 'prolific-blocks'), value: 'pending' },
							{ label: __('Private', 'prolific-blocks'), value: 'private' },
							{ label: __('Any', 'prolific-blocks'), value: 'any' },
						]}
						onChange={(value) => setAttributes({ postStatus: value })}
					/>

					<SelectControl
						label={__('Sticky Posts', 'prolific-blocks')}
						value={stickyPosts}
						options={[
							{ label: __('Include', 'prolific-blocks'), value: 'include' },
							{ label: __('Exclude', 'prolific-blocks'), value: 'exclude' },
							{ label: __('Only Sticky', 'prolific-blocks'), value: 'only' },
						]}
						onChange={(value) => setAttributes({ stickyPosts: value })}
						help={__('How to handle sticky posts', 'prolific-blocks')}
					/>
				</PanelBody>

				{/* Filters Panel */}
				<PanelBody title={__('Filters', 'prolific-blocks')} initialOpen={false}>
					<TextControl
						label={__('Include Post IDs', 'prolific-blocks')}
						value={includeIds}
						onChange={(value) => setAttributes({ includeIds: value })}
						help={__('Comma-separated list of post IDs to include', 'prolific-blocks')}
					/>

					<TextControl
						label={__('Exclude Post IDs', 'prolific-blocks')}
						value={excludeIds}
						onChange={(value) => setAttributes({ excludeIds: value })}
						help={__('Comma-separated list of post IDs to exclude', 'prolific-blocks')}
					/>

					{postType === 'post' && categoryOptions.length > 0 && (
						<div className="prolific-checkbox-group">
							<p className="components-base-control__label">
								{__('Categories', 'prolific-blocks')}
							</p>
							{categoryOptions.map((cat) => (
								<CheckboxControl
									key={cat.value}
									label={cat.label}
									checked={categories.includes(cat.value)}
									onChange={(checked) => {
										const newCategories = checked
											? [...categories, cat.value]
											: categories.filter((id) => id !== cat.value);
										setAttributes({ categories: newCategories });
									}}
								/>
							))}
						</div>
					)}

					{postType === 'post' && tagOptions.length > 0 && (
						<div className="prolific-checkbox-group">
							<p className="components-base-control__label">
								{__('Tags', 'prolific-blocks')}
							</p>
							{tagOptions.slice(0, 10).map((tag) => (
								<CheckboxControl
									key={tag.value}
									label={tag.label}
									checked={tags.includes(tag.value)}
									onChange={(checked) => {
										const newTags = checked
											? [...tags, tag.value]
											: tags.filter((id) => id !== tag.value);
										setAttributes({ tags: newTags });
									}}
								/>
							))}
							{tagOptions.length > 10 && (
								<p className="components-base-control__help">
									{__('Showing first 10 tags', 'prolific-blocks')}
								</p>
							)}
						</div>
					)}

					{authorOptions.length > 0 && (
						<div className="prolific-checkbox-group">
							<p className="components-base-control__label">
								{__('Authors', 'prolific-blocks')}
							</p>
							{authorOptions.map((author) => (
								<CheckboxControl
									key={author.value}
									label={author.label}
									checked={authorIds.includes(author.value)}
									onChange={(checked) => {
										const newAuthors = checked
											? [...authorIds, author.value]
											: authorIds.filter((id) => id !== author.value);
										setAttributes({ authorIds: newAuthors });
									}}
								/>
							))}
						</div>
					)}
				</PanelBody>

				{/* Display Mode Panel */}
				<PanelBody title={__('Display Mode', 'prolific-blocks')} initialOpen={false}>
					<SelectControl
						label={__('Layout Type', 'prolific-blocks')}
						value={displayMode}
						options={[
							{ label: __('Grid', 'prolific-blocks'), value: 'grid' },
							{ label: __('List', 'prolific-blocks'), value: 'list' },
							{ label: __('Masonry', 'prolific-blocks'), value: 'masonry' },
						]}
						onChange={(value) => setAttributes({ displayMode: value })}
					/>

					<ToggleControl
						label={__('Enable Carousel Mode', 'prolific-blocks')}
						checked={enableCarousel}
						onChange={(value) => setAttributes({ enableCarousel: value })}
						help={__('Convert layout to a Swiper carousel', 'prolific-blocks')}
					/>

					{displayMode === 'grid' && !enableCarousel && (
						<ToggleControl
							label={__('Equal Height Cards', 'prolific-blocks')}
							checked={equalHeight}
							onChange={(value) => setAttributes({ equalHeight: value })}
							help={__('Make all cards the same height', 'prolific-blocks')}
						/>
					)}
				</PanelBody>

				{/* Carousel Settings Panel - Only show when carousel is enabled */}
				{enableCarousel && (
					<PanelBody title={__('Carousel Settings', 'prolific-blocks')} initialOpen={true}>
						<p className="components-base-control__label">
							{__('Slides Per View', 'prolific-blocks')}
						</p>
						<RangeControl
							label={__('Desktop', 'prolific-blocks')}
							value={slidesPerViewDesktop}
							onChange={(value) => setAttributes({ slidesPerViewDesktop: value })}
							min={1}
							max={6}
						/>
						<RangeControl
							label={__('Tablet', 'prolific-blocks')}
							value={slidesPerViewTablet}
							onChange={(value) => setAttributes({ slidesPerViewTablet: value })}
							min={1}
							max={4}
						/>
						<RangeControl
							label={__('Mobile', 'prolific-blocks')}
							value={slidesPerViewMobile}
							onChange={(value) => setAttributes({ slidesPerViewMobile: value })}
							min={1}
							max={3}
						/>

						<hr />

						<p className="components-base-control__label">
							{__('Space Between Slides', 'prolific-blocks')}
						</p>
						<RangeControl
							label={__('Desktop', 'prolific-blocks')}
							value={spaceBetweenDesktop}
							onChange={(value) => setAttributes({ spaceBetweenDesktop: value })}
							min={0}
							max={100}
						/>
						<RangeControl
							label={__('Tablet', 'prolific-blocks')}
							value={spaceBetweenTablet}
							onChange={(value) => setAttributes({ spaceBetweenTablet: value })}
							min={0}
							max={80}
						/>
						<RangeControl
							label={__('Mobile', 'prolific-blocks')}
							value={spaceBetweenMobile}
							onChange={(value) => setAttributes({ spaceBetweenMobile: value })}
							min={0}
							max={60}
						/>

						<hr />

						<ToggleControl
							label={__('Loop', 'prolific-blocks')}
							checked={carouselLoop}
							onChange={(value) => setAttributes({ carouselLoop: value })}
							help={__('Enable infinite loop mode', 'prolific-blocks')}
						/>

						<ToggleControl
							label={__('Autoplay', 'prolific-blocks')}
							checked={carouselAutoplay}
							onChange={(value) => setAttributes({ carouselAutoplay: value })}
						/>

						{carouselAutoplay && (
							<RangeControl
								label={__('Autoplay Delay (ms)', 'prolific-blocks')}
								value={autoplayDelay}
								onChange={(value) => setAttributes({ autoplayDelay: value })}
								min={1000}
								max={10000}
								step={500}
							/>
						)}

						{carouselAutoplay && (
							<ToggleControl
								label={__('Pause on Hover', 'prolific-blocks')}
								checked={pauseOnHover}
								onChange={(value) => setAttributes({ pauseOnHover: value })}
							/>
						)}

						<hr />

						<ToggleControl
							label={__('Navigation Arrows', 'prolific-blocks')}
							checked={carouselNavigation}
							onChange={(value) => setAttributes({ carouselNavigation: value })}
						/>

						<ToggleControl
							label={__('Pagination', 'prolific-blocks')}
							checked={carouselPagination}
							onChange={(value) => setAttributes({ carouselPagination: value })}
						/>

						{carouselPagination && (
							<SelectControl
								label={__('Pagination Type', 'prolific-blocks')}
								value={paginationType}
								options={[
									{ label: __('Bullets', 'prolific-blocks'), value: 'bullets' },
									{ label: __('Fraction', 'prolific-blocks'), value: 'fraction' },
									{ label: __('Progress Bar', 'prolific-blocks'), value: 'progressbar' },
								]}
								onChange={(value) => setAttributes({ paginationType: value })}
							/>
						)}

						<hr />

						<RangeControl
							label={__('Transition Speed (ms)', 'prolific-blocks')}
							value={carouselSpeed}
							onChange={(value) => setAttributes({ carouselSpeed: value })}
							min={100}
							max={2000}
							step={100}
						/>

						<ToggleControl
							label={__('Centered Slides', 'prolific-blocks')}
							checked={centeredSlides}
							onChange={(value) => setAttributes({ centeredSlides: value })}
							help={__('Center active slide', 'prolific-blocks')}
						/>

						<ToggleControl
							label={__('Grab Cursor', 'prolific-blocks')}
							checked={grabCursor}
							onChange={(value) => setAttributes({ grabCursor: value })}
							help={__('Show grab cursor on hover', 'prolific-blocks')}
						/>

						<ToggleControl
							label={__('Keyboard Control', 'prolific-blocks')}
							checked={keyboard}
							onChange={(value) => setAttributes({ keyboard: value })}
							help={__('Enable keyboard navigation', 'prolific-blocks')}
						/>
					</PanelBody>
				)}

				{/* Layout Panel - Only show when carousel is disabled */}
				{!enableCarousel && (
					<PanelBody title={__('Layout', 'prolific-blocks')} initialOpen={false}>
						{displayMode !== 'list' && (
							<>
								<p className="components-base-control__label">
									{__('Columns', 'prolific-blocks')}
								</p>
								<RangeControl
									label={__('Desktop', 'prolific-blocks')}
									value={columns}
									onChange={(value) => setAttributes({ columns: value })}
									min={1}
									max={6}
								/>
								<RangeControl
									label={__('Tablet', 'prolific-blocks')}
									value={columnsTablet}
									onChange={(value) => setAttributes({ columnsTablet: value })}
									min={1}
									max={4}
								/>
								<RangeControl
									label={__('Mobile', 'prolific-blocks')}
									value={columnsMobile}
									onChange={(value) => setAttributes({ columnsMobile: value })}
									min={1}
									max={2}
								/>
								<hr />
							</>
						)}

						<RangeControl
							label={__('Gap Between Items (px)', 'prolific-blocks')}
							value={gap}
							onChange={(value) => setAttributes({ gap: value })}
							min={0}
							max={100}
						/>
					</PanelBody>
				)}

				{/* Content Display Panel */}
				<PanelBody title={__('Content Display', 'prolific-blocks')} initialOpen={false}>
					<ToggleControl
						label={__('Show Featured Image', 'prolific-blocks')}
						checked={showFeaturedImage}
						onChange={(value) => setAttributes({ showFeaturedImage: value })}
					/>

					{showFeaturedImage && (
						<>
							<SelectControl
								label={__('Image Size', 'prolific-blocks')}
								value={imageSizeSlug}
								options={imageSizes.map((size) => ({
									label: size.name,
									value: size.slug,
								}))}
								onChange={(value) => setAttributes({ imageSizeSlug: value })}
							/>

							{displayMode === 'list' && (
								<SelectControl
									label={__('Image Position', 'prolific-blocks')}
									value={imagePosition}
									options={[
										{ label: __('Top', 'prolific-blocks'), value: 'top' },
										{ label: __('Left', 'prolific-blocks'), value: 'left' },
										{ label: __('Right', 'prolific-blocks'), value: 'right' },
									]}
									onChange={(value) => setAttributes({ imagePosition: value })}
								/>
							)}
						</>
					)}

					<hr />

					<ToggleControl
						label={__('Show Title', 'prolific-blocks')}
						checked={showTitle}
						onChange={(value) => setAttributes({ showTitle: value })}
					/>

					{showTitle && (
						<SelectControl
							label={__('Title Tag', 'prolific-blocks')}
							value={titleTag}
							options={[
								{ label: 'H1', value: 'h1' },
								{ label: 'H2', value: 'h2' },
								{ label: 'H3', value: 'h3' },
								{ label: 'H4', value: 'h4' },
								{ label: 'H5', value: 'h5' },
								{ label: 'H6', value: 'h6' },
							]}
							onChange={(value) => setAttributes({ titleTag: value })}
						/>
					)}

					<hr />

					<ToggleControl
						label={__('Show Excerpt', 'prolific-blocks')}
						checked={showExcerpt}
						onChange={(value) => setAttributes({ showExcerpt: value })}
					/>

					{showExcerpt && (
						<RangeControl
							label={__('Excerpt Length (words)', 'prolific-blocks')}
							value={excerptLength}
							onChange={(value) => setAttributes({ excerptLength: value })}
							min={10}
							max={200}
						/>
					)}

					<hr />

					<ToggleControl
						label={__('Show Meta Data', 'prolific-blocks')}
						checked={showMeta}
						onChange={(value) => setAttributes({ showMeta: value })}
					/>

					{showMeta && (
						<>
							<CheckboxControl
								label={__('Show Author', 'prolific-blocks')}
								checked={showAuthor}
								onChange={(value) => setAttributes({ showAuthor: value })}
							/>
							<CheckboxControl
								label={__('Show Date', 'prolific-blocks')}
								checked={showDate}
								onChange={(value) => setAttributes({ showDate: value })}
							/>
							{postType === 'post' && (
								<>
									<CheckboxControl
										label={__('Show Categories', 'prolific-blocks')}
										checked={showCategories}
										onChange={(value) => setAttributes({ showCategories: value })}
									/>
									<CheckboxControl
										label={__('Show Tags', 'prolific-blocks')}
										checked={showTags}
										onChange={(value) => setAttributes({ showTags: value })}
									/>
								</>
							)}
						</>
					)}

					<hr />

					<ToggleControl
						label={__('Show Read More Link', 'prolific-blocks')}
						checked={showReadMore}
						onChange={(value) => setAttributes({ showReadMore: value })}
					/>

					{showReadMore && (
						<TextControl
							label={__('Read More Text', 'prolific-blocks')}
							value={readMoreText}
							onChange={(value) => setAttributes({ readMoreText: value })}
						/>
					)}
				</PanelBody>

				{/* Search & Filters Panel */}
				<PanelBody title={__('Search & Filters', 'prolific-blocks')} initialOpen={false}>
					<ToggleControl
						label={__('Show Search Box', 'prolific-blocks')}
						checked={showSearch}
						onChange={(value) => setAttributes({ showSearch: value })}
						help={__('Enable AJAX search functionality', 'prolific-blocks')}
					/>

					{showSearch && (
						<TextControl
							label={__('Search Placeholder', 'prolific-blocks')}
							value={searchPlaceholder}
							onChange={(value) => setAttributes({ searchPlaceholder: value })}
						/>
					)}

					{postType === 'post' && (
						<>
							<ToggleControl
								label={__('Show Category Filter', 'prolific-blocks')}
								checked={showCategoryFilter}
								onChange={(value) => setAttributes({ showCategoryFilter: value })}
								help={__('Dropdown to filter by category', 'prolific-blocks')}
							/>

							<ToggleControl
								label={__('Show Tag Filter', 'prolific-blocks')}
								checked={showTagFilter}
								onChange={(value) => setAttributes({ showTagFilter: value })}
								help={__('Dropdown to filter by tag', 'prolific-blocks')}
							/>
						</>
					)}

					<ToggleControl
						label={__('Show Date Filter', 'prolific-blocks')}
						checked={showDateFilter}
						onChange={(value) => setAttributes({ showDateFilter: value })}
						help={__('Filter by year and month', 'prolific-blocks')}
					/>

					<ToggleControl
						label={__('Show Sort Dropdown', 'prolific-blocks')}
						checked={showSortDropdown}
						onChange={(value) => setAttributes({ showSortDropdown: value })}
						help={__('Allow users to change sorting', 'prolific-blocks')}
					/>

					<hr />

					<ToggleControl
						label={__('Enable Load More Button', 'prolific-blocks')}
						checked={enableLoadMore}
						onChange={(value) => {
							setAttributes({ enableLoadMore: value });
							if (value) {
								setAttributes({ enablePagination: false });
							}
						}}
						help={__('AJAX-powered load more posts', 'prolific-blocks')}
					/>

					{enableLoadMore && (
						<TextControl
							label={__('Load More Button Text', 'prolific-blocks')}
							value={loadMoreText}
							onChange={(value) => setAttributes({ loadMoreText: value })}
						/>
					)}

					<ToggleControl
						label={__('Enable Pagination', 'prolific-blocks')}
						checked={enablePagination}
						onChange={(value) => {
							setAttributes({ enablePagination: value });
							if (value) {
								setAttributes({ enableLoadMore: false });
							}
						}}
						help={__('Show page numbers', 'prolific-blocks')}
					/>

					<hr />

					<TextControl
						label={__('No Results Text', 'prolific-blocks')}
						value={noResultsText}
						onChange={(value) => setAttributes({ noResultsText: value })}
						help={__('Message shown when no posts are found', 'prolific-blocks')}
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<div className="prolific-query-posts-preview">
					<ServerSideRender
						block="prolific/query-posts"
						attributes={attributes}
						LoadingResponsePlaceholder={() => (
							<Placeholder>
								<Spinner />
								<p>{__('Loading posts...', 'prolific-blocks')}</p>
							</Placeholder>
						)}
						ErrorResponsePlaceholder={() => (
							<Placeholder>
								<p>{__('Error loading posts. Please check your settings.', 'prolific-blocks')}</p>
							</Placeholder>
						)}
					/>
				</div>
			</div>
		</>
	);
}
