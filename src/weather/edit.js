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
	Spinner,
	Notice,
	Placeholder
} from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';
import { cloud } from '@wordpress/icons';

/**
 * Editor styles
 */
import './editor.scss';

/**
 * Edit component for Weather block.
 *
 * @param {Object} props - Component props.
 * @param {Object} props.attributes - Block attributes.
 * @param {Function} props.setAttributes - Function to update attributes.
 * @return {JSX.Element} Block edit component.
 */
export default function Edit({ attributes, setAttributes }) {
	const {
		latitude,
		longitude,
		displayMode,
		temperatureUnit,
		showTemperature,
		showHumidity,
		showWind,
		showPrecipitation,
		forecastDays,
		refreshInterval,
		cachedData
	} = attributes;

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');
	const [locationError, setLocationError] = useState('');
	const [weatherData, setWeatherData] = useState(null);

	const blockProps = useBlockProps();

	// Set block ID
	useEffect(() => {
		setAttributes({ blockId: blockProps.id });
	}, []);

	/**
	 * Fetch weather data from the National Weather Service API.
	 */
	useEffect(() => {
		if (!latitude || !longitude) {
			setWeatherData(null);
			return;
		}

		// Validate coordinates
		const lat = parseFloat(latitude);
		const lon = parseFloat(longitude);
		if (isNaN(lat) || isNaN(lon)) {
			setError(__('Invalid coordinates. Please enter valid numbers.', 'prolific-blocks'));
			return;
		}

		const fetchWeather = async () => {
			setIsLoading(true);
			setError('');

			try {
				// Step 1: Get the forecast URLs from the points endpoint
				const pointsUrl = `https://api.weather.gov/points/${lat},${lon}`;

				const pointsResponse = await fetch(pointsUrl, {
					headers: {
						'User-Agent': 'ProlificBlocks/1.0 (WordPress Weather Block)',
						'Accept': 'application/json'
					}
				});

				if (!pointsResponse.ok) {
					throw new Error(__('Invalid coordinates or location not supported.', 'prolific-blocks'));
				}

				const pointsData = await pointsResponse.json();

				if (!pointsData.properties || !pointsData.properties.forecast) {
					throw new Error(__('Forecast data unavailable for this location.', 'prolific-blocks'));
				}

				const forecastUrl = pointsData.properties.forecast;
				const hourlyUrl = pointsData.properties.forecastHourly;

				// Step 2: Fetch forecast data
				const forecastResponse = await fetch(forecastUrl, {
					headers: {
						'User-Agent': 'ProlificBlocks/1.0 (WordPress Weather Block)',
						'Accept': 'application/json'
					}
				});

				if (!forecastResponse.ok) {
					throw new Error(__('Unable to fetch forecast data.', 'prolific-blocks'));
				}

				const forecastData = await forecastResponse.json();

				// Step 3: Fetch hourly data for more detailed current conditions
				let currentData = null;
				if (forecastData.properties && forecastData.properties.periods && forecastData.properties.periods[0]) {
					currentData = { ...forecastData.properties.periods[0] };

					// Extract probabilityOfPrecipitation value
					if (currentData.probabilityOfPrecipitation && currentData.probabilityOfPrecipitation.value !== undefined) {
						currentData.probabilityOfPrecipitation = currentData.probabilityOfPrecipitation.value;
					}

					// Try to get more detailed hourly data
					if (hourlyUrl) {
						try {
							const hourlyResponse = await fetch(hourlyUrl, {
								headers: {
									'User-Agent': 'ProlificBlocks/1.0 (WordPress Weather Block)',
									'Accept': 'application/json'
								}
							});

							if (hourlyResponse.ok) {
								const hourlyData = await hourlyResponse.json();

								if (hourlyData.properties && hourlyData.properties.periods && hourlyData.properties.periods[0]) {
									const currentHourly = hourlyData.properties.periods[0];

									// Update with hourly data
									currentData.temperature = currentHourly.temperature;
									currentData.relativeHumidity = currentHourly.relativeHumidity?.value || null;
									currentData.windSpeed = currentHourly.windSpeed;
									currentData.windDirection = currentHourly.windDirection || currentData.windDirection;

									if (currentHourly.probabilityOfPrecipitation?.value !== undefined) {
										currentData.probabilityOfPrecipitation = currentHourly.probabilityOfPrecipitation.value;
									}
								}
							}
						} catch (hourlyError) {
							console.error('Error fetching hourly data:', hourlyError);
							// Continue with forecast data
						}
					}
				}

				// Prepare the weather data
				const preparedData = {
					current: currentData,
					forecast: forecastData.properties?.periods || []
				};

				setWeatherData(preparedData);
				setError('');
			} catch (err) {
				console.error('Weather fetch error:', err);
				setError(err.message || __('Unable to fetch weather data.', 'prolific-blocks'));
				setWeatherData(null);
			} finally {
				setIsLoading(false);
			}
		};

		fetchWeather();
	}, [latitude, longitude]);

	/**
	 * Request user's current location using browser geolocation API.
	 */
	const handleUseMyLocation = () => {
		if (!navigator.geolocation) {
			setLocationError(__('Geolocation is not supported by your browser.', 'prolific-blocks'));
			return;
		}

		setIsLoading(true);
		setLocationError('');

		navigator.geolocation.getCurrentPosition(
			(position) => {
				setAttributes({
					latitude: position.coords.latitude.toFixed(4),
					longitude: position.coords.longitude.toFixed(4)
				});
				setIsLoading(false);
				setLocationError('');
			},
			(error) => {
				setIsLoading(false);
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

	/**
	 * Convert Celsius to Fahrenheit.
	 *
	 * @param {number} celsius - Temperature in Celsius.
	 * @return {number} Temperature in Fahrenheit.
	 */
	const celsiusToFahrenheit = (celsius) => {
		return Math.round((celsius * 9/5) + 32);
	};

	/**
	 * Convert temperature based on unit preference.
	 *
	 * @param {number} fahrenheit - Temperature in Fahrenheit.
	 * @return {number} Temperature in selected unit.
	 */
	const convertTemp = (fahrenheit) => {
		if (temperatureUnit === 'celsius') {
			return Math.round((fahrenheit - 32) * 5/9);
		}
		return Math.round(fahrenheit);
	};

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

		if (isLoading) {
			return (
				<div className="weather-loading">
					<Spinner />
					<p>{__('Loading weather data...', 'prolific-blocks')}</p>
				</div>
			);
		}

		if (!weatherData) {
			return (
				<div className="weather-placeholder">
					<p>{__('Unable to load weather data. Please check your coordinates.', 'prolific-blocks')}</p>
				</div>
			);
		}

		if (!weatherData.current && (!weatherData.forecast || weatherData.forecast.length === 0)) {
			return (
				<div className="weather-placeholder">
					<p>{__('Weather data loaded but contains no periods. Please try different coordinates.', 'prolific-blocks')}</p>
				</div>
			);
		}

		const tempUnit = temperatureUnit === 'fahrenheit' ? '°F' : '°C';

		return (
			<div className="weather-preview">
				{(displayMode === 'current' || displayMode === 'both') && weatherData.current ? (
					<div className="weather-current">
						{weatherData.current.icon && (
							<div className="weather-icon">
								<img src={weatherData.current.icon} alt={weatherData.current.shortForecast} />
							</div>
						)}
						<div className="weather-details">
							{showTemperature && weatherData.current.temperature && (
								<div className="weather-temp">
									<span className="temp-current">
										{convertTemp(weatherData.current.temperature)}{tempUnit}
									</span>
								</div>
							)}
							{weatherData.current.shortForecast && (
								<div className="weather-condition">{weatherData.current.shortForecast}</div>
							)}
							<div className="weather-meta">
								{showHumidity && weatherData.current.relativeHumidity && (
									<span className="weather-humidity">
										{__('Humidity:', 'prolific-blocks')} {Math.round(weatherData.current.relativeHumidity)}%
									</span>
								)}
								{showWind && weatherData.current.windSpeed && (
									<span className="weather-wind">
										{__('Wind:', 'prolific-blocks')} {weatherData.current.windSpeed}
										{weatherData.current.windDirection && ` ${weatherData.current.windDirection}`}
									</span>
								)}
								{showPrecipitation && weatherData.current.probabilityOfPrecipitation !== null && weatherData.current.probabilityOfPrecipitation !== undefined && (
									<span className="weather-precipitation">
										{__('Precipitation:', 'prolific-blocks')} {Math.round(weatherData.current.probabilityOfPrecipitation)}%
									</span>
								)}
							</div>
						</div>
					</div>
				) : null}

				{(displayMode === 'forecast' || displayMode === 'both') && weatherData.forecast && weatherData.forecast.length > 0 ? (
					<div className="weather-forecast">
						<h3>{__('Forecast', 'prolific-blocks')}</h3>
						<div className="forecast-grid">
							{weatherData.forecast.slice(0, forecastDays * 2).map((period, index) => (
								<div key={index} className="forecast-day">
									<div className="forecast-day-name">{period.name}</div>
									{period.icon && (
										<div className="forecast-icon">
											<img src={period.icon} alt={period.shortForecast} />
										</div>
									)}
									{showTemperature && period.temperature && (
										<div className="forecast-temp">
											{convertTemp(period.temperature)}{tempUnit}
										</div>
									)}
									{period.shortForecast && (
										<div className="forecast-condition">{period.shortForecast}</div>
									)}
								</div>
							))}
						</div>
					</div>
				) : null}
			</div>
		);
	};

	return (
		<>
			<div {...blockProps}>
				{error && (
					<Notice status="error" isDismissible={false}>
						{error}
					</Notice>
				)}
				{renderWeatherPreview()}
			</div>

			<InspectorControls>
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
						disabled={isLoading}
						className="weather-location-button"
					>
						{isLoading ? __('Getting location...', 'prolific-blocks') : __('Use My Location', 'prolific-blocks')}
					</Button>
					{locationError && (
						<Notice status="warning" isDismissible={false}>
							{locationError}
						</Notice>
					)}
					<p className="components-base-control__help">
						{__('Enter coordinates for the location you want to display weather for. Coordinates for US locations can be found on weather.gov.', 'prolific-blocks')}
					</p>
				</PanelBody>

				<PanelBody title={__('Display Options', 'prolific-blocks')} initialOpen={true}>
					<SelectControl
						label={__('Display Mode', 'prolific-blocks')}
						help={__('Choose what weather information to display', 'prolific-blocks')}
						value={displayMode}
						options={[
							{ label: __('Current & Forecast', 'prolific-blocks'), value: 'both' },
							{ label: __('Current Only', 'prolific-blocks'), value: 'current' },
							{ label: __('Forecast Only', 'prolific-blocks'), value: 'forecast' }
						]}
						onChange={(value) => setAttributes({ displayMode: value })}
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
					{(displayMode === 'forecast' || displayMode === 'both') && (
						<RangeControl
							label={__('Forecast Days', 'prolific-blocks')}
							help={__('Number of days to show in forecast (1-7)', 'prolific-blocks')}
							value={forecastDays}
							onChange={(value) => setAttributes({ forecastDays: value })}
							min={1}
							max={7}
						/>
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
