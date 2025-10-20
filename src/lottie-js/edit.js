/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	ToggleControl,
	RangeControl,
	Button,
	SelectControl,
	ColorPicker,
	Notice,
	__experimentalUnitControl as UnitControl,
	__experimentalNumberControl as NumberControl,
} from '@wordpress/components';
import { useState, useEffect, useRef, useCallback } from '@wordpress/element';
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';

/**
 * External dependencies
 */
import { DotLottie } from '@lottiefiles/dotlottie-web';

/**
 * Editor styles
 */
import './editor.scss';
import SupportCard from '../components/SupportCard';

/**
 * Edit component for Lottie block.
 *
 * @param {Object} props - Component props.
 * @param {Object} props.attributes - Block attributes.
 * @param {Function} props.setAttributes - Function to update attributes.
 * @return {JSX.Element} Block edit component.
 */
export default function Edit({ attributes, setAttributes }) {
	const {
		lottieFile,
		loop,
		autoplay,
		speed,
		direction,
		mode,
		startOnView,
		intermission,
		width,
		height,
		backgroundColor,
		objectFit,
		useFrameInterpolation,
		segment,
		marker,
	} = attributes;

	const blockProps = useBlockProps();
	const canvasRef = useRef(null);
	const containerRef = useRef(null);
	const [dotLottieInstance, setDotLottieInstance] = useState(null);
	const [animationError, setAnimationError] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [animationData, setAnimationData] = useState(null);

	// Set block ID
	setAttributes({ blockId: blockProps.id });

	// Initialize Lottie animation
	useEffect(() => {
		if (!canvasRef.current || !lottieFile) {
			setAnimationError(null);
			return;
		}

		setIsLoading(true);
		setAnimationError(null);

		const config = {
			canvas: canvasRef.current,
			src: lottieFile,
			autoplay: autoplay && !startOnView,
			loop,
			speed,
			useFrameInterpolation,
		};

		// Add mode if not normal
		if (mode && mode !== 'normal') {
			config.mode = mode;
		}

		// Add segment if specified
		if (segment && segment.length === 2) {
			config.segment = segment;
		}

		// Add marker if specified
		if (marker) {
			config.marker = marker;
		}

		const dotLottie = new DotLottie(config);

		// Handle load event
		dotLottie.addEventListener('load', () => {
			setIsLoading(false);
			setAnimationData({
				totalFrames: dotLottie.totalFrames,
				duration: dotLottie.duration,
				markers: dotLottie.markers || [],
			});
		});

		// Handle error event
		dotLottie.addEventListener('error', () => {
			setIsLoading(false);
			setAnimationError('Failed to load animation. Please check the file.');
		});

		setDotLottieInstance(dotLottie);

		// Cleanup
		return () => {
			dotLottie.destroy();
			setDotLottieInstance(null);
			setAnimationData(null);
		};
	}, [lottieFile]);

	// Update animation properties when they change
	useEffect(() => {
		if (!dotLottieInstance) return;

		dotLottieInstance.setSpeed(speed);
		dotLottieInstance.setLoop(loop);
		dotLottieInstance.setUseFrameInterpolation(useFrameInterpolation);

		// Set direction
		if (direction === -1) {
			dotLottieInstance.setDirection('reverse');
		} else {
			dotLottieInstance.setDirection('forward');
		}

		// Set mode
		if (mode) {
			dotLottieInstance.setMode(mode);
		}

		// Control playback based on autoplay and startOnView
		if (autoplay && !startOnView) {
			dotLottieInstance.play();
		} else if (!startOnView) {
			dotLottieInstance.pause();
		}
	}, [
		dotLottieInstance,
		autoplay,
		loop,
		speed,
		direction,
		mode,
		startOnView,
		useFrameInterpolation,
	]);

	// Handle segment changes
	useEffect(() => {
		if (!dotLottieInstance || !segment || segment.length !== 2) return;
		dotLottieInstance.setSegment(segment[0], segment[1]);
	}, [dotLottieInstance, segment]);

	// Handle marker changes
	useEffect(() => {
		if (!dotLottieInstance || !marker) return;
		dotLottieInstance.setMarker(marker);
	}, [dotLottieInstance, marker]);

	// Handle startOnView with IntersectionObserver
	useEffect(() => {
		if (!containerRef.current || !dotLottieInstance || !startOnView) return;

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						dotLottieInstance.play();
						observer.unobserve(containerRef.current);
					}
				});
			},
			{ threshold: 0.1 }
		);

		// Pause initially if autoplay is enabled
		if (autoplay) {
			dotLottieInstance.pause();
		}

		observer.observe(containerRef.current);

		return () => {
			if (containerRef.current) {
				observer.unobserve(containerRef.current);
			}
		};
	}, [dotLottieInstance, startOnView, autoplay]);

	// Container styles
	const containerStyle = {
		width: width || '400px',
		height: height || '400px',
		backgroundColor: backgroundColor || 'transparent',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		position: 'relative',
	};

	// Canvas styles
	const canvasStyle = {
		width: '100%',
		height: '100%',
		objectFit: objectFit || 'contain',
	};

	return (
		<>
			<div {...blockProps}>
				<div ref={containerRef} style={containerStyle}>
					{!lottieFile && (
						<div className="lottie-placeholder">
							<p>{__('Upload a Lottie animation to get started', 'prolific-blocks')}</p>
						</div>
					)}
					{animationError && (
						<Notice status="error" isDismissible={false}>
							{animationError}
						</Notice>
					)}
					{isLoading && (
						<div className="lottie-loading">
							<p>{__('Loading animation...', 'prolific-blocks')}</p>
						</div>
					)}
					<canvas ref={canvasRef} style={canvasStyle} />
				</div>
			</div>

			<InspectorControls>
				<SupportCard />
				{/* File Upload Panel */}
				<PanelBody title={__('Animation File', 'prolific-blocks')} initialOpen={true}>
					<MediaUploadCheck>
						<MediaUpload
							onSelect={(media) => {
								setAttributes({ lottieFile: media.url });
								setAnimationError(null);
							}}
							allowedTypes={['application/json']}
							render={({ open }) => (
								<>
									<Button onClick={open} variant="primary" style={{ marginBottom: '10px' }}>
										{lottieFile
											? __('Replace Animation', 'prolific-blocks')
											: __('Upload Animation', 'prolific-blocks')}
									</Button>
									{lottieFile && (
										<Button
											onClick={() => setAttributes({ lottieFile: '' })}
											variant="secondary"
											isDestructive
										>
											{__('Remove Animation', 'prolific-blocks')}
										</Button>
									)}
								</>
							)}
						/>
					</MediaUploadCheck>
					{lottieFile && (
						<p style={{ fontSize: '12px', marginTop: '10px', color: '#757575' }}>
							{__('Current file: ', 'prolific-blocks')}
							{lottieFile.split('/').pop()}
						</p>
					)}
				</PanelBody>

				{/* Playback Panel */}
				<PanelBody title={__('Playback Settings', 'prolific-blocks')} initialOpen={true}>
					<ToggleControl
						label={__('Autoplay', 'prolific-blocks')}
						help={__('Start playing automatically when loaded', 'prolific-blocks')}
						checked={autoplay}
						onChange={(value) => setAttributes({ autoplay: value })}
					/>
					<ToggleControl
						label={__('Loop', 'prolific-blocks')}
						help={__('Repeat animation continuously', 'prolific-blocks')}
						checked={loop}
						onChange={(value) => setAttributes({ loop: value })}
					/>
					<RangeControl
						label={__('Speed', 'prolific-blocks')}
						help={__('Playback speed multiplier', 'prolific-blocks')}
						value={speed}
						onChange={(value) => setAttributes({ speed: value })}
						min={0.1}
						max={5}
						step={0.1}
					/>
					<SelectControl
						label={__('Direction', 'prolific-blocks')}
						help={__('Playback direction', 'prolific-blocks')}
						value={direction}
						options={[
							{ label: __('Forward', 'prolific-blocks'), value: 1 },
							{ label: __('Reverse', 'prolific-blocks'), value: -1 },
						]}
						onChange={(value) => setAttributes({ direction: parseInt(value) })}
					/>
					<SelectControl
						label={__('Play Mode', 'prolific-blocks')}
						help={__('How the animation plays', 'prolific-blocks')}
						value={mode}
						options={[
							{ label: __('Normal', 'prolific-blocks'), value: 'normal' },
							{ label: __('Bounce', 'prolific-blocks'), value: 'bounce' },
						]}
						onChange={(value) => setAttributes({ mode: value })}
					/>
					{loop && mode === 'bounce' && (
						<RangeControl
							label={__('Intermission (ms)', 'prolific-blocks')}
							help={__('Delay between loops in bounce mode', 'prolific-blocks')}
							value={intermission}
							onChange={(value) => setAttributes({ intermission: value })}
							min={0}
							max={5000}
							step={100}
						/>
					)}
				</PanelBody>

				{/* Timing Panel */}
				<PanelBody title={__('Timing & Triggers', 'prolific-blocks')} initialOpen={false}>
					<ToggleControl
						label={__('Start on View', 'prolific-blocks')}
						help={__('Play when scrolled into viewport', 'prolific-blocks')}
						checked={startOnView}
						onChange={(value) => setAttributes({ startOnView: value })}
					/>
					{animationData && animationData.totalFrames && (
						<>
							<p style={{ fontSize: '12px', color: '#757575', margin: '10px 0' }}>
								{__('Total Frames: ', 'prolific-blocks')}
								{animationData.totalFrames}
							</p>
							<p style={{ fontSize: '12px', color: '#757575', margin: '0 0 10px 0' }}>
								{__('Duration: ', 'prolific-blocks')}
								{animationData.duration}s
							</p>
						</>
					)}
					{animationData && animationData.markers && animationData.markers.length > 0 && (
						<SelectControl
							label={__('Start from Marker', 'prolific-blocks')}
							help={__('Begin playback from a specific marker', 'prolific-blocks')}
							value={marker}
							options={[
								{ label: __('None', 'prolific-blocks'), value: '' },
								...animationData.markers.map((m) => ({
									label: m.name,
									value: m.name,
								})),
							]}
							onChange={(value) => setAttributes({ marker: value })}
						/>
					)}
				</PanelBody>

				{/* Appearance Panel */}
				<PanelBody title={__('Appearance', 'prolific-blocks')} initialOpen={false}>
					<UnitControl
						label={__('Width', 'prolific-blocks')}
						value={width}
						onChange={(value) => setAttributes({ width: value })}
						units={[
							{ value: 'px', label: 'px' },
							{ value: '%', label: '%' },
							{ value: 'vw', label: 'vw' },
						]}
					/>
					<UnitControl
						label={__('Height', 'prolific-blocks')}
						value={height}
						onChange={(value) => setAttributes({ height: value })}
						units={[
							{ value: 'px', label: 'px' },
							{ value: '%', label: '%' },
							{ value: 'vh', label: 'vh' },
						]}
					/>
					<div style={{ marginBottom: '16px' }}>
						<label style={{ display: 'block', marginBottom: '8px', fontSize: '13px' }}>
							{__('Background Color', 'prolific-blocks')}
						</label>
						<ColorPicker
							color={backgroundColor}
							onChange={(value) => setAttributes({ backgroundColor: value })}
							enableAlpha
						/>
						{backgroundColor && (
							<Button
								onClick={() => setAttributes({ backgroundColor: '' })}
								variant="secondary"
								isSmall
								style={{ marginTop: '8px' }}
							>
								{__('Clear Color', 'prolific-blocks')}
							</Button>
						)}
					</div>
					<SelectControl
						label={__('Object Fit', 'prolific-blocks')}
						help={__('How animation fits in container', 'prolific-blocks')}
						value={objectFit}
						options={[
							{ label: __('Contain', 'prolific-blocks'), value: 'contain' },
							{ label: __('Cover', 'prolific-blocks'), value: 'cover' },
							{ label: __('Fill', 'prolific-blocks'), value: 'fill' },
							{ label: __('None', 'prolific-blocks'), value: 'none' },
						]}
						onChange={(value) => setAttributes({ objectFit: value })}
					/>
				</PanelBody>

				{/* Advanced Panel */}
				<PanelBody title={__('Advanced', 'prolific-blocks')} initialOpen={false}>
					<ToggleControl
						label={__('Frame Interpolation', 'prolific-blocks')}
						help={__('Smooth animation between frames', 'prolific-blocks')}
						checked={useFrameInterpolation}
						onChange={(value) => setAttributes({ useFrameInterpolation: value })}
					/>
					<Notice status="info" isDismissible={false}>
						<p style={{ fontSize: '12px', margin: 0 }}>
							{__(
								'Frame interpolation provides smoother animations at the cost of slightly higher CPU usage.',
								'prolific-blocks'
							)}
						</p>
					</Notice>
				</PanelBody>
			</InspectorControls>
		</>
	);
}
