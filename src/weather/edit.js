/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	SelectControl,
	ToggleControl,
	TextControl,
	RangeControl,
	Button,
	Notice,
	Placeholder
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import { cloud } from '@wordpress/icons';
import ServerSideRender from '@wordpress/server-side-render';

/**
 * Editor styles
 */
import './editor.scss';
import SupportCard from '../components/SupportCard';

/**
 * Edit component for Weather block.
 *
 * The editor preview is rendered server-side via <ServerSideRender>, which
 * reuses render.php (with its built-in transient cache) for parity with the
 * frontend. This avoids any client-side polling of the NWS API in the editor —
 * previously the source of jitter in the Site Editor's Patterns/Templates list.
 *
 * @param {Object}   props               - Component props.
 * @param {Object}   props.attributes    - Block attributes.
 * @param {Function} props.setAttributes - Function to update attributes.
 * @return {JSX.Element} Block edit component.
 */
export default function Edit({ attributes, setAttributes }) {
	const {
		latitude,
		longitude,
		customLocationName,
		showLocation,
		displayType,
		showNights,
		temperatureUnit,
		showTemperature,
		showHumidity,
		showWind,
		showPrecipitation,
		forecastDays,
		refreshInterval
	} = attributes;

	const [isLocating, setIsLocating] = useState(false);
	const [locationError, setLocationError] = useState('');

	const blockProps = useBlockProps();

	/**
	 * Render weather preview.
	 *
	 * @return {JSX.Element} Weather preview component.
	 */
	const renderWeatherPreview = () => {
		if (!latitude || !longitude) {
			return (
				<Placeholder
					icon={cloud}
					label={__('Weather', 'prolific-blocks')}
					instructions={__('Enter your latitude and longitude in the block settings panel to display weather information.', 'prolific-blocks')}
				>
					<p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#757575' }}>
						{__('Tip: Use the "Use My Location" button in settings, or find coordinates for any location using Google Maps.', 'prolific-blocks')}
					</p>
				</Placeholder>
			);
		}

		return (
			<ServerSideRender
				block="prolific/weather"
				attributes={attributes}
				EmptyResponsePlaceholder={() => (
					<div className="weather-placeholder">
						<p>{__('Unable to load weather data. Please check your coordinates.', 'prolific-blocks')}</p>
					</div>
				)}
			/>
		);
	};

	/**
	 * Request user's current location using browser geolocation API.
	 */
	const handleUseMyLocation = () => {
		if (!navigator.geolocation) {
			setLocationError(__('Geolocation is not supported by your browser.', 'prolific-blocks'));
			return;
		}

		setIsLocating(true);
		setLocationError('');

		navigator.geolocation.getCurrentPosition(
			(position) => {
				setAttributes({
					latitude: position.coords.latitude.toFixed(4),
					longitude: position.coords.longitude.toFixed(4)
				});
				setIsLocating(false);
				setLocationError('');
			},
			(error) => {
				setIsLocating(false);
				switch (error.code) {
					case error.PERMISSION_DENIED:
						setLocationError(__('Location permission denied. Please enable location access.', 'prolific-blocks'));
						break;
					case error.POSITION_UNAVAILABLE:
						setLocationError(__('Location information unavailable.', 'prolific-blocks'));
						break;
					case error.TIMEOUT:
						setLocationError(__('Location request timed out.', 'prolific-blocks'));
						break;
					default:
						setLocationError(__('An unknown error occurred.', 'prolific-blocks'));
						break;
				}
			}
		);
	};

	return (
		<>
			<div {...blockProps}>
				{renderWeatherPreview()}
			</div>

			<InspectorControls>
				<SupportCard />
				<PanelBody title={__('Location Settings', 'prolific-blocks')} initialOpen={true}>
					<TextControl
						label={__('Latitude', 'prolific-blocks')}
						help={__('Example: 38.8977', 'prolific-blocks')}
						value={latitude}
						onChange={(value) => setAttributes({ latitude: value })}
						type="text"
					/>
					<TextControl
						label={__('Longitude', 'prolific-blocks')}
						help={__('Example: -77.0365', 'prolific-blocks')}
						value={longitude}
						onChange={(value) => setAttributes({ longitude: value })}
						type="text"
					/>
					<Button
						variant="secondary"
						onClick={handleUseMyLocation}
						disabled={isLocating}
						className="weather-location-button"
					>
						{isLocating ? __('Getting location...', 'prolific-blocks') : __('Use My Location', 'prolific-blocks')}
					</Button>
					{locationError && (
						<Notice status="warning" isDismissible={false}>
							{locationError}
						</Notice>
					)}
					<p className="components-base-control__help">
						{__('Enter coordinates for the location you want to display weather for. Coordinates for US locations can be found on weather.gov.', 'prolific-blocks')}
					</p>
					<hr />
					<TextControl
						label={__('Custom Location Name (Optional)', 'prolific-blocks')}
						help={__('Override the location name detected from coordinates. Leave blank to use automatic detection.', 'prolific-blocks')}
						value={customLocationName}
						onChange={(value) => setAttributes({ customLocationName: value })}
						type="text"
						placeholder={__('Enter custom location name', 'prolific-blocks')}
					/>
					<ToggleControl
						label={__('Show Location', 'prolific-blocks')}
						help={__('Display the location name above weather information.', 'prolific-blocks')}
						checked={showLocation}
						onChange={(value) => setAttributes({ showLocation: value })}
					/>
				</PanelBody>

				<PanelBody title={__('Display Options', 'prolific-blocks')} initialOpen={true}>
					<SelectControl
						label={__('Display Type', 'prolific-blocks')}
						help={__('Choose how to display weather information', 'prolific-blocks')}
						value={displayType}
						options={[
							{ label: __('Compact (icon + temp)', 'prolific-blocks'), value: 'compact' },
							{ label: __('Current Weather Card', 'prolific-blocks'), value: 'current' },
							{ label: __('Full (current + forecast)', 'prolific-blocks'), value: 'full' }
						]}
						onChange={(value) => setAttributes({ displayType: value })}
					/>
					<SelectControl
						label={__('Temperature Unit', 'prolific-blocks')}
						value={temperatureUnit}
						options={[
							{ label: __('Fahrenheit (°F)', 'prolific-blocks'), value: 'fahrenheit' },
							{ label: __('Celsius (°C)', 'prolific-blocks'), value: 'celsius' }
						]}
						onChange={(value) => setAttributes({ temperatureUnit: value })}
					/>
					<hr />
					<ToggleControl
						label={__('Show Temperature', 'prolific-blocks')}
						checked={showTemperature}
						onChange={(value) => setAttributes({ showTemperature: value })}
					/>
					{displayType !== 'compact' && (
						<>
							<ToggleControl
								label={__('Show Humidity', 'prolific-blocks')}
								checked={showHumidity}
								onChange={(value) => setAttributes({ showHumidity: value })}
							/>
							<ToggleControl
								label={__('Show Wind', 'prolific-blocks')}
								checked={showWind}
								onChange={(value) => setAttributes({ showWind: value })}
							/>
							<ToggleControl
								label={__('Show Precipitation', 'prolific-blocks')}
								checked={showPrecipitation}
								onChange={(value) => setAttributes({ showPrecipitation: value })}
							/>
						</>
					)}
					{displayType === 'full' && (
						<>
							<hr />
							<RangeControl
								label={__('Forecast Days', 'prolific-blocks')}
								help={__('Number of days to show in forecast (1-7)', 'prolific-blocks')}
								value={forecastDays}
								onChange={(value) => setAttributes({ forecastDays: value })}
								min={1}
								max={7}
							/>
							<ToggleControl
								label={__('Include Night Forecasts', 'prolific-blocks')}
								help={__('Show night forecasts in addition to daytime', 'prolific-blocks')}
								checked={showNights}
								onChange={(value) => setAttributes({ showNights: value })}
							/>
						</>
					)}
				</PanelBody>

				<PanelBody title={__('Refresh Settings', 'prolific-blocks')} initialOpen={false}>
					<SelectControl
						label={__('Refresh Interval', 'prolific-blocks')}
						help={__('How often to update weather data', 'prolific-blocks')}
						value={refreshInterval}
						options={[
							{ label: __('Manual', 'prolific-blocks'), value: 'manual' },
							{ label: __('Hourly', 'prolific-blocks'), value: 'hourly' },
							{ label: __('Daily', 'prolific-blocks'), value: 'daily' }
						]}
						onChange={(value) => setAttributes({ refreshInterval: value })}
					/>
					<p className="components-base-control__help">
						{__('Weather data is cached to improve performance. Manual refresh requires page reload.', 'prolific-blocks')}
					</p>
				</PanelBody>
			</InspectorControls>
		</>
	);
}
