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
 * Get Font Awesome weather icon component based on weather condition.
 *
 * @param {string} condition - Weather condition text.
 * @return {JSX.Element} Icon SVG element.
 */
const getWeatherIcon = (condition) => {
	const conditionLower = condition.toLowerCase();
	let iconPath = '';
	let viewBox = '0 0 512 512';

	if (conditionLower.includes('sunny') || conditionLower.includes('clear')) {
		if (conditionLower.includes('night')) {
			// Moon icon
			viewBox = '0 0 384 512';
			iconPath = 'M223.5 32C100 32 0 132.3 0 256S100 480 223.5 480c60.6 0 115.5-24.2 155.8-63.4c5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6c-96.9 0-175.5-78.8-175.5-176c0-65.8 36-123.1 89.3-153.3c6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-6.3-.5-12.6-.8-19-.8z';
		} else {
			// Sun icon
			iconPath = 'M361.5 1.2c5 2.1 8.6 6.6 9.6 11.9L391 121l107.9 19.8c5.3 1 9.8 4.6 11.9 9.6s1.5 10.7-1.6 15.2L446.9 256l62.3 90.3c3.1 4.5 3.7 10.2 1.6 15.2s-6.6 8.6-11.9 9.6L391 391 371.1 498.9c-1 5.3-4.6 9.8-9.6 11.9s-10.7 1.5-15.2-1.6L256 446.9l-90.3 62.3c-4.5 3.1-10.2 3.7-15.2 1.6s-8.6-6.6-9.6-11.9L121 391 13.1 371.1c-5.3-1-9.8-4.6-11.9-9.6s-1.5-10.7 1.6-15.2L65.1 256 2.8 165.7c-3.1-4.5-3.7-10.2-1.6-15.2s6.6-8.6 11.9-9.6L121 121 140.9 13.1c1-5.3 4.6-9.8 9.6-11.9s10.7-1.5 15.2 1.6L256 65.1 346.3 2.8c4.5-3.1 10.2-3.7 15.2-1.6zM160 256a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zm224 0a128 128 0 1 0 -256 0 128 128 0 1 0 256 0z';
		}
	} else if (conditionLower.includes('partly cloudy') || conditionLower.includes('mostly sunny') || conditionLower.includes('partly sunny') || conditionLower.includes('mostly clear')) {
		// Cloud-sun icon
		viewBox = '0 0 640 512';
		iconPath = 'M294.2 1.2c5.1 2.1 8.7 6.7 9.6 12.1l10.4 62.4c-23.3 10.8-42.9 28.4-56 50.3c-14.9-9.2-32.8-14.4-51.8-14.4c-52.9 0-96 43.1-96 96c0 35.5 19.3 66.6 48 83.2c.8 31.8 13.2 60.7 33.1 82.7l-56 39.1c-4.5 3.1-10.3 3.8-15.3 1.6s-8.7-6.7-9.6-12.1L98.1 317.9 13.4 303.8c-5.4-1-10.1-4.6-12.1-9.6s-1.5-10.7 1.6-15.3L52.5 208 2.9 137.2c-3.2-4.5-3.8-10.3-1.6-15.3s6.7-8.7 12.1-9.6L98.1 98.1l14.1-84.7c1-5.4 4.6-10.1 9.6-12.1s10.7-1.5 15.3 1.6L208 52.5 278.8 2.9c4.5-3.2 10.3-3.8 15.3-1.6zM144 208a64 64 0 1 1 128 0 64 64 0 1 1 -128 0zM639.9 431.9c0 44.2-35.8 80-80 80H288c-53 0-96-43-96-96c0-47.6 34.6-87 80-94.6l0-1.3c0-53 43-96 96-96c34.9 0 65.4 18.6 82.2 46.4c13-9.1 28.8-14.4 45.8-14.4c44.2 0 80 35.8 80 80c0 5.9-.6 11.7-1.9 17.2c37.4 6.7 65.8 39.4 65.8 78.7z';
	} else if (conditionLower.includes('cloudy') || conditionLower.includes('overcast')) {
		// Cloud icon
		viewBox = '0 0 640 512';
		iconPath = 'M0 336c0 79.5 64.5 144 144 144H512c70.7 0 128-57.3 128-128c0-61.9-44-113.6-102.4-125.4c4.1-10.7 6.4-22.4 6.4-34.6c0-53-43-96-96-96c-19.7 0-38.1 6-53.3 16.2C367 64.2 315.3 32 256 32C167.6 32 96 103.6 96 192c0 2.7 .1 5.4 .2 8.1C40.2 219.8 0 273.2 0 336z';
	} else if (conditionLower.includes('rain') || conditionLower.includes('shower') || conditionLower.includes('drizzle')) {
		// Cloud-rain icon
		iconPath = 'M96 320c-53 0-96-43-96-96c0-42.5 27.6-78.6 65.9-91.2C64.7 126.1 64 119.1 64 112C64 50.1 114.1 0 176 0c43.1 0 80.5 24.3 99.2 60c14.7-17.1 36.5-28 60.8-28c44.2 0 80 35.8 80 80c0 5.5-.6 10.8-1.6 16c.5 0 1.1 0 1.6 0c53 0 96 43 96 96s-43 96-96 96H96zm-6.8 52c1.3-2.5 3.9-4 6.8-4s5.4 1.5 6.8 4l35.1 64.6c4.1 7.5 6.2 15.8 6.2 24.3v3c0 26.5-21.5 48-48 48s-48-21.5-48-48v-3c0-8.5 2.1-16.9 6.2-24.3L89.2 372zm160 0c1.3-2.5 3.9-4 6.8-4s5.4 1.5 6.8 4l35.1 64.6c4.1 7.5 6.2 15.8 6.2 24.3v3c0 26.5-21.5 48-48 48s-48-21.5-48-48v-3c0-8.5 2.1-16.9 6.2-24.3L249.2 372zm124.9 64.6L409.2 372c1.3-2.5 3.9-4 6.8-4s5.4 1.5 6.8 4l35.1 64.6c4.1 7.5 6.2 15.8 6.2 24.3v3c0 26.5-21.5 48-48 48s-48-21.5-48-48v-3c0-8.5 2.1-16.9 6.2-24.3z';
	} else if (conditionLower.includes('thunderstorm') || conditionLower.includes('storm')) {
		// Cloud-bolt icon
		iconPath = 'M0 224c0 53 43 96 96 96h47.2L290 202.5c17.6-14.1 42.6-14 60.2 .2s22.8 38.6 12.8 58.8L333.7 320H352h64c53 0 96-43 96-96s-43-96-96-96c-.5 0-1.1 0-1.6 0c1-5.2 1.6-10.5 1.6-16c0-44.2-35.8-80-80-80c-24.3 0-46.1 10.9-60.8 28C256.5 24.3 219.1 0 176 0C114.1 0 64 50.1 64 112c0 7.1 .7 14.1 1.9 20.8C27.6 145.4 0 181.5 0 224zm330.1 3.6c-5.8-4.7-14.2-4.7-20.1-.1l-160 128c-5.3 4.2-7.4 11.4-5.1 17.8s8.3 10.7 15.1 10.7h70.1L177.7 488.8c-3.4 6.7-1.6 14.9 4.3 19.6s14.2 4.7 20.1 .1l160-128c5.3-4.2 7.4-11.4 5.1-17.8s-8.3-10.7-15.1-10.7H281.9l52.4-104.8c3.4-6.7 1.6-14.9-4.2-19.6z';
	} else if (conditionLower.includes('snow') || conditionLower.includes('flurries') || conditionLower.includes('sleet')) {
		// Snowflake icon
		viewBox = '0 0 448 512';
		iconPath = 'M224 0c17.7 0 32 14.3 32 32V62.1l15-15c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-49 49v70.3l61.4-35.8 17.7-66.1c3.4-12.8 16.6-20.4 29.4-17s20.4 16.6 17 29.4l-5.2 19.3 23.6-13.8c15.3-8.9 34.9-3.7 43.8 11.5s3.7 34.9-11.5 43.8l-25.3 14.8 21.7 5.8c12.8 3.4 20.4 16.6 17 29.4s-16.6 20.4-29.4 17l-67.7-18.1L287.5 256l60.9 35.5 67.7-18.1c12.8-3.4 26 4.2 29.4 17s-4.2 26-17 29.4l-21.7 5.8 25.3 14.8c15.3 8.9 20.4 28.5 11.5 43.8s-28.5 20.4-43.8 11.5l-23.6-13.8 5.2 19.3c3.4 12.8-4.2 26-17 29.4s-26-4.2-29.4-17l-17.7-66.1L256 311.7v70.3l49 49c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-15-15V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V449.9l-15 15c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l49-49V311.7l-61.4 35.8-17.7 66.1c-3.4 12.8-16.6 20.4-29.4 17s-20.4-16.6-17-29.4l5.2-19.3L48.1 395.6c-15.3 8.9-34.9 3.7-43.8-11.5s-3.7-34.9 11.5-43.8l25.3-14.8-21.7-5.8c-12.8-3.4-20.4-16.6-17-29.4s16.6-20.4 29.4-17l67.7 18.1L160.5 256 99.6 220.5 31.9 238.6c-12.8 3.4-26-4.2-29.4-17s4.2-26 17-29.4l21.7-5.8L15.9 171.6C.6 162.7-4.5 143.1 4.4 127.9s28.5-20.4 43.8-11.5l23.6 13.8-5.2-19.3c-3.4-12.8 4.2-26 17-29.4s26 4.2 29.4 17l17.7 66.1L192 200.3V129.9L143 81c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l15 15V32c0-17.7 14.3-32 32-32z';
	} else if (conditionLower.includes('fog') || conditionLower.includes('mist') || conditionLower.includes('haze')) {
		// Smog icon
		viewBox = '0 0 640 512';
		iconPath = 'M32 144c0 79.5 64.5 144 144 144H299.3c22.6 19.9 52.2 32 84.7 32s62.1-12.1 84.7-32H496c61.9 0 112-50.1 112-112s-50.1-112-112-112c-10.7 0-21 1.5-30.8 4.3C443.8 27.7 401.1 0 352 0c-32.6 0-62.4 12.2-85.1 32.3C242.1 12.1 210.5 0 176 0C96.5 0 32 64.5 32 144zM616 368H280c-13.3 0-24 10.7-24 24s10.7 24 24 24H616c13.3 0 24-10.7 24-24s-10.7-24-24-24zm-64 96H440c-13.3 0-24 10.7-24 24s10.7 24 24 24H552c13.3 0 24-10.7 24-24s-10.7-24-24-24zm-192 0H24c-13.3 0-24 10.7-24 24s10.7 24 24 24H360c13.3 0 24-10.7 24-24s-10.7-24-24-24zM224 392c0-13.3-10.7-24-24-24H96c-13.3 0-24 10.7-24 24s10.7 24 24 24H200c13.3 0 24-10.7 24-24z';
	} else if (conditionLower.includes('wind') || conditionLower.includes('breezy') || conditionLower.includes('blustery')) {
		// Wind icon
		iconPath = 'M288 32c0 17.7 14.3 32 32 32h32c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H352c53 0 96-43 96-96s-43-96-96-96H320c-17.7 0-32 14.3-32 32zm64 352c0 17.7 14.3 32 32 32h32c53 0 96-43 96-96s-43-96-96-96H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H384c-17.7 0-32 14.3-32 32zM128 512h32c53 0 96-43 96-96s-43-96-96-96H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H160c17.7 0 32 14.3 32 32s-14.3 32-32 32H128c-17.7 0-32 14.3-32 32s14.3 32 32 32z';
	} else {
		// Default to cloud
		viewBox = '0 0 640 512';
		iconPath = 'M0 336c0 79.5 64.5 144 144 144H512c70.7 0 128-57.3 128-128c0-61.9-44-113.6-102.4-125.4c4.1-10.7 6.4-22.4 6.4-34.6c0-53-43-96-96-96c-19.7 0-38.1 6-53.3 16.2C367 64.2 315.3 32 256 32C167.6 32 96 103.6 96 192c0 2.7 .1 5.4 .2 8.1C40.2 219.8 0 273.2 0 336z';
	}

	return (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox={viewBox} fill="currentColor" aria-hidden="true">
			<path d={iconPath} />
		</svg>
	);
};

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
		locationName,
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

				// Extract location information
				let locationNameFromAPI = '';
				if (pointsData.properties && pointsData.properties.relativeLocation && pointsData.properties.relativeLocation.properties) {
					const locProps = pointsData.properties.relativeLocation.properties;
					const city = locProps.city || '';
					const state = locProps.state || '';
					if (city && state) {
						locationNameFromAPI = `${city}, ${state}`;
					} else if (city) {
						locationNameFromAPI = city;
					}
				}

				// Save location name to attributes
				if (locationNameFromAPI && locationNameFromAPI !== locationName) {
					setAttributes({ locationName: locationNameFromAPI });
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

		// Determine which location name to display: custom name > API name > nothing
		const displayLocationName = customLocationName || locationName;

		return (
			<div className={`weather-preview weather-display-${displayType}`}>
				{showLocation && displayLocationName && (
					<div className="weather-location">
						{__('Weather for', 'prolific-blocks')} {displayLocationName}
					</div>
				)}

				{weatherData.current && displayType === 'compact' && (
					<div className="weather-compact">
						{weatherData.current.shortForecast && (
							<div className="weather-icon">
								{getWeatherIcon(weatherData.current.shortForecast)}
							</div>
						)}
						{showTemperature && weatherData.current.temperature && (
							<div className="weather-temp">
								<span className="temp-current">
									{convertTemp(weatherData.current.temperature)}{tempUnit}
								</span>
							</div>
						)}
					</div>
				)}

				{weatherData.current && (displayType === 'current' || displayType === 'full') && (
					<div className="weather-current">
						{weatherData.current.shortForecast && (
							<div className="weather-icon">
								{getWeatherIcon(weatherData.current.shortForecast)}
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
				)}

				{displayType === 'full' && weatherData.forecast && weatherData.forecast.length > 0 && (
					<div className="weather-forecast">
						<h3 className="forecast-title">{__('Forecast', 'prolific-blocks')}</h3>
						<div className="forecast-scroll-container">
							{weatherData.forecast.slice(0, showNights ? forecastDays * 2 : forecastDays).map((period, index) => {
								// Filter out night forecasts if showNights is false
								if (!showNights && period.name && (period.name.toLowerCase().includes('night') || period.name.toLowerCase().includes('tonight'))) {
									return null;
								}

								return (
									<div key={index} className="forecast-day">
										<div className="forecast-day-name">{period.name}</div>
										{period.shortForecast && (
											<div className="forecast-icon">
												{getWeatherIcon(period.shortForecast)}
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
								);
							})}
						</div>
					</div>
				)}
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
					{locationName && (
						<p className="components-base-control__help" style={{ fontWeight: 600, marginTop: '0.5rem' }}>
							{__('Location:', 'prolific-blocks')} {locationName}
						</p>
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
						placeholder={locationName || __('Enter custom location name', 'prolific-blocks')}
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
