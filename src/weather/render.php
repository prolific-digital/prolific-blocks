<?php
/**
 * Render callback for Weather block.
 *
 * @param array    $attributes Block attributes.
 * @param string   $content    Block content.
 * @param WP_Block $block      Block instance.
 * @return string Rendered block HTML.
 */

/**
 * Fetch weather data from National Weather Service API.
 *
 * @param string $latitude Latitude coordinate.
 * @param string $longitude Longitude coordinate.
 * @param string $display_mode Display mode (current, forecast, both).
 * @param int $forecast_days Number of forecast days to retrieve.
 * @return array|WP_Error Weather data or error.
 */
if (!function_exists('prolific_fetch_weather_data')) {
  function prolific_fetch_weather_data($latitude, $longitude, $display_mode, $forecast_days) {
  // Log the request for debugging
  error_log('Prolific Weather: Fetching weather for lat=' . $latitude . ', lon=' . $longitude);

  // First, get the grid endpoint for the coordinates
  $points_url = sprintf(
    'https://api.weather.gov/points/%s,%s',
    floatval($latitude),
    floatval($longitude)
  );

  error_log('Prolific Weather: Points URL: ' . $points_url);

  $points_response = wp_remote_get($points_url, [
    'headers' => [
      'User-Agent' => 'ProlificBlocks/1.0 (WordPress Weather Block)',
      'Accept' => 'application/json'
    ],
    'timeout' => 15
  ]);

  if (is_wp_error($points_response)) {
    error_log('Prolific Weather: Points request error: ' . $points_response->get_error_message());
    return new WP_Error('api_error', __('Unable to connect to weather service.', 'prolific-blocks'));
  }

  $points_code = wp_remote_retrieve_response_code($points_response);
  error_log('Prolific Weather: Points response code: ' . $points_code);

  if ($points_code !== 200) {
    $points_body = wp_remote_retrieve_body($points_response);
    error_log('Prolific Weather: Points error response: ' . $points_body);
    return new WP_Error('api_error', __('Invalid coordinates or location not supported.', 'prolific-blocks'));
  }

  $points_body = wp_remote_retrieve_body($points_response);
  $points_data = json_decode($points_body, true);

  if (empty($points_data['properties']['forecast'])) {
    error_log('Prolific Weather: No forecast URL in points response');
    return new WP_Error('api_error', __('Forecast data unavailable for this location.', 'prolific-blocks'));
  }

  $forecast_url = $points_data['properties']['forecast'];
  $hourly_url = isset($points_data['properties']['forecastHourly']) ? $points_data['properties']['forecastHourly'] : '';

  error_log('Prolific Weather: Forecast URL: ' . $forecast_url);
  error_log('Prolific Weather: Hourly URL: ' . $hourly_url);

  $weather_data = [];

  // Always fetch forecast data (needed for current conditions too)
  $forecast_response = wp_remote_get($forecast_url, [
    'headers' => [
      'User-Agent' => 'ProlificBlocks/1.0 (WordPress Weather Block)',
      'Accept' => 'application/json'
    ],
    'timeout' => 15
  ]);

  if (!is_wp_error($forecast_response) && wp_remote_retrieve_response_code($forecast_response) === 200) {
    $forecast_body = wp_remote_retrieve_body($forecast_response);
    $forecast_data = json_decode($forecast_body, true);

    error_log('Prolific Weather: Forecast data retrieved, periods count: ' . (isset($forecast_data['properties']['periods']) ? count($forecast_data['properties']['periods']) : 0));

    if (!empty($forecast_data['properties']['periods'])) {
      // Only store forecast if we need to display it
      if ($display_mode === 'forecast' || $display_mode === 'both') {
        $weather_data['forecast'] = array_slice($forecast_data['properties']['periods'], 0, $forecast_days * 2);
      }

      // Set up current conditions (use first period from forecast)
      if ($display_mode === 'current' || $display_mode === 'both') {
        if (!empty($forecast_data['properties']['periods'][0])) {
          $current_period = $forecast_data['properties']['periods'][0];

          // Extract probabilityOfPrecipitation value from the object structure
          $precip_value = null;
          if (isset($current_period['probabilityOfPrecipitation'])) {
            if (is_array($current_period['probabilityOfPrecipitation']) && isset($current_period['probabilityOfPrecipitation']['value'])) {
              $precip_value = $current_period['probabilityOfPrecipitation']['value'];
            } elseif (is_numeric($current_period['probabilityOfPrecipitation'])) {
              $precip_value = $current_period['probabilityOfPrecipitation'];
            }
          }

          $weather_data['current'] = [
            'name' => $current_period['name'],
            'temperature' => $current_period['temperature'],
            'temperatureUnit' => $current_period['temperatureUnit'],
            'shortForecast' => $current_period['shortForecast'],
            'detailedForecast' => isset($current_period['detailedForecast']) ? $current_period['detailedForecast'] : '',
            'icon' => $current_period['icon'],
            'windSpeed' => $current_period['windSpeed'],
            'windDirection' => $current_period['windDirection'],
            'probabilityOfPrecipitation' => $precip_value
          ];

          // Try to get more detailed current conditions from hourly if available
          if (!empty($hourly_url)) {
            $hourly_response = wp_remote_get($hourly_url, [
              'headers' => [
                'User-Agent' => 'ProlificBlocks/1.0 (WordPress Weather Block)',
                'Accept' => 'application/json'
              ],
              'timeout' => 15
            ]);

            if (!is_wp_error($hourly_response) && wp_remote_retrieve_response_code($hourly_response) === 200) {
              $hourly_body = wp_remote_retrieve_body($hourly_response);
              $hourly_data = json_decode($hourly_body, true);

              error_log('Prolific Weather: Hourly data retrieved, periods count: ' . (isset($hourly_data['properties']['periods']) ? count($hourly_data['properties']['periods']) : 0));

              if (!empty($hourly_data['properties']['periods'][0])) {
                $current_hourly = $hourly_data['properties']['periods'][0];

                // Extract relativeHumidity value from object structure
                $humidity_value = null;
                if (isset($current_hourly['relativeHumidity'])) {
                  if (is_array($current_hourly['relativeHumidity']) && isset($current_hourly['relativeHumidity']['value'])) {
                    $humidity_value = $current_hourly['relativeHumidity']['value'];
                  } elseif (is_numeric($current_hourly['relativeHumidity'])) {
                    $humidity_value = $current_hourly['relativeHumidity'];
                  }
                }

                // Extract probabilityOfPrecipitation from hourly
                $hourly_precip_value = null;
                if (isset($current_hourly['probabilityOfPrecipitation'])) {
                  if (is_array($current_hourly['probabilityOfPrecipitation']) && isset($current_hourly['probabilityOfPrecipitation']['value'])) {
                    $hourly_precip_value = $current_hourly['probabilityOfPrecipitation']['value'];
                  } elseif (is_numeric($current_hourly['probabilityOfPrecipitation'])) {
                    $hourly_precip_value = $current_hourly['probabilityOfPrecipitation'];
                  }
                }

                // Merge with more precise hourly data
                $weather_data['current']['temperature'] = $current_hourly['temperature'];
                $weather_data['current']['relativeHumidity'] = $humidity_value;
                $weather_data['current']['windSpeed'] = $current_hourly['windSpeed'];
                $weather_data['current']['windDirection'] = isset($current_hourly['windDirection']) ? $current_hourly['windDirection'] : $weather_data['current']['windDirection'];
                if ($hourly_precip_value !== null) {
                  $weather_data['current']['probabilityOfPrecipitation'] = $hourly_precip_value;
                }
              }
            }
          }

          error_log('Prolific Weather: Current weather data prepared: ' . print_r($weather_data['current'], true));
        }
      }
    }
  } else {
    error_log('Prolific Weather: Forecast request failed');
  }

  error_log('Prolific Weather: Returning weather data with keys: ' . implode(', ', array_keys($weather_data)));
  return $weather_data;
  }
}

// Helper function to convert temperature if needed
if (!function_exists('prolific_convert_temperature')) {
  function prolific_convert_temperature($fahrenheit, $unit) {
    if ($unit === 'celsius') {
      return round(($fahrenheit - 32) * 5/9);
    }
    return round($fahrenheit);
  }
}

// Helper function to get temperature unit symbol
if (!function_exists('prolific_get_temp_unit')) {
  function prolific_get_temp_unit($unit) {
    return $unit === 'celsius' ? '°C' : '°F';
  }
}

// Helper function to format wind direction
if (!function_exists('prolific_format_wind_direction')) {
  function prolific_format_wind_direction($direction) {
    if (empty($direction)) {
      return '';
    }

    // If it's already a string direction, return it
    if (!is_numeric($direction)) {
      return $direction;
    }

    // Convert to float and ensure it's in 0-360 range
    $degrees = floatval($direction);
    $degrees = fmod($degrees, 360);
    if ($degrees < 0) {
      $degrees += 360;
    }

    $directions = [
      'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
      'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'
    ];

    $index = round($degrees / 22.5) % 16;
    return $directions[$index];
  }
}

// Get attributes with defaults
$latitude = isset($attributes['latitude']) ? sanitize_text_field($attributes['latitude']) : '';
$longitude = isset($attributes['longitude']) ? sanitize_text_field($attributes['longitude']) : '';
$display_mode = isset($attributes['displayMode']) ? $attributes['displayMode'] : 'both';
$temperature_unit = isset($attributes['temperatureUnit']) ? $attributes['temperatureUnit'] : 'fahrenheit';
$show_temperature = isset($attributes['showTemperature']) ? $attributes['showTemperature'] : true;
$show_humidity = isset($attributes['showHumidity']) ? $attributes['showHumidity'] : true;
$show_wind = isset($attributes['showWind']) ? $attributes['showWind'] : true;
$show_precipitation = isset($attributes['showPrecipitation']) ? $attributes['showPrecipitation'] : true;
$forecast_days = isset($attributes['forecastDays']) ? intval($attributes['forecastDays']) : 7;
$refresh_interval = isset($attributes['refreshInterval']) ? $attributes['refreshInterval'] : 'hourly';

// Validate coordinates
if (empty($latitude) || empty($longitude)) {
  return '<div ' . get_block_wrapper_attributes(['class' => 'wp-block-prolific-weather']) . '><p>' . esc_html__('Please configure weather location in block settings.', 'prolific-blocks') . '</p></div>';
}

// Validate latitude and longitude ranges
if (!is_numeric($latitude) || !is_numeric($longitude)) {
  return '<div ' . get_block_wrapper_attributes(['class' => 'wp-block-prolific-weather']) . '><p>' . esc_html__('Invalid coordinates. Please check your settings.', 'prolific-blocks') . '</p></div>';
}

// Calculate cache duration based on refresh interval
$cache_duration = 0;
switch ($refresh_interval) {
  case 'hourly':
    $cache_duration = HOUR_IN_SECONDS;
    break;
  case 'daily':
    $cache_duration = DAY_IN_SECONDS;
    break;
  default:
    $cache_duration = HOUR_IN_SECONDS; // Default to hourly even for manual
    break;
}

// Create unique cache key based on coordinates and settings
$cache_key = 'prolific_weather_' . md5($latitude . $longitude . $display_mode . $forecast_days);

// Try to get cached data
$weather_data = get_transient($cache_key);

// If no cached data, fetch from API
if (false === $weather_data) {
  $weather_data = prolific_fetch_weather_data($latitude, $longitude, $display_mode, $forecast_days);

  if (is_wp_error($weather_data)) {
    return '<div ' . get_block_wrapper_attributes(['class' => 'wp-block-prolific-weather weather-error']) . '><p>' . esc_html($weather_data->get_error_message()) . '</p></div>';
  }

  // Cache the data
  set_transient($cache_key, $weather_data, $cache_duration);
}

$temp_unit = prolific_get_temp_unit($temperature_unit);

// Start output buffering
ob_start();

// Build block wrapper attributes
$wrapper_attributes = get_block_wrapper_attributes(['class' => 'wp-block-prolific-weather']);
?>

<div <?php echo $wrapper_attributes; ?>>
  <?php if (($display_mode === 'current' || $display_mode === 'both') && !empty($weather_data['current'])): ?>
    <div class="weather-current">
      <?php if (!empty($weather_data['current']['icon'])): ?>
        <div class="weather-icon">
          <img src="<?php echo esc_url($weather_data['current']['icon']); ?>" alt="<?php echo esc_attr($weather_data['current']['shortForecast']); ?>" />
        </div>
      <?php endif; ?>

      <div class="weather-details">
        <?php if ($show_temperature && !empty($weather_data['current']['temperature'])): ?>
          <div class="weather-temp">
            <span class="temp-current">
              <?php echo esc_html(prolific_convert_temperature($weather_data['current']['temperature'], $temperature_unit)); ?><?php echo esc_html($temp_unit); ?>
            </span>
            <?php if (!empty($weather_data['current']['temperatureHigh']) && !empty($weather_data['current']['temperatureLow'])): ?>
              <span class="temp-range">
                <?php echo esc_html__('H:', 'prolific-blocks'); ?> <?php echo esc_html(prolific_convert_temperature($weather_data['current']['temperatureHigh'], $temperature_unit)); ?><?php echo esc_html($temp_unit); ?>
                <?php echo esc_html__('L:', 'prolific-blocks'); ?> <?php echo esc_html(prolific_convert_temperature($weather_data['current']['temperatureLow'], $temperature_unit)); ?><?php echo esc_html($temp_unit); ?>
              </span>
            <?php endif; ?>
          </div>
        <?php endif; ?>

        <?php if (!empty($weather_data['current']['shortForecast'])): ?>
          <div class="weather-condition"><?php echo esc_html($weather_data['current']['shortForecast']); ?></div>
        <?php endif; ?>

        <div class="weather-meta">
          <?php if ($show_humidity && !empty($weather_data['current']['relativeHumidity'])): ?>
            <span class="weather-humidity">
              <?php echo esc_html__('Humidity:', 'prolific-blocks'); ?> <?php echo esc_html($weather_data['current']['relativeHumidity']); ?>%
            </span>
          <?php endif; ?>

          <?php if ($show_wind && !empty($weather_data['current']['windSpeed'])): ?>
            <span class="weather-wind">
              <?php echo esc_html__('Wind:', 'prolific-blocks'); ?>
              <?php echo esc_html($weather_data['current']['windSpeed']); ?>
              <?php if (!empty($weather_data['current']['windDirection'])): ?>
                <?php echo esc_html(prolific_format_wind_direction($weather_data['current']['windDirection'])); ?>
              <?php endif; ?>
            </span>
          <?php endif; ?>

          <?php if ($show_precipitation && !empty($weather_data['current']['probabilityOfPrecipitation'])): ?>
            <span class="weather-precipitation">
              <?php echo esc_html__('Precipitation:', 'prolific-blocks'); ?> <?php echo esc_html($weather_data['current']['probabilityOfPrecipitation']); ?>%
            </span>
          <?php endif; ?>
        </div>
      </div>
    </div>
  <?php endif; ?>

  <?php if (($display_mode === 'forecast' || $display_mode === 'both') && !empty($weather_data['forecast'])): ?>
    <div class="weather-forecast">
      <h3 class="forecast-title"><?php echo esc_html__('Forecast', 'prolific-blocks'); ?></h3>
      <div class="forecast-grid">
        <?php
        $displayed_days = 0;
        foreach ($weather_data['forecast'] as $index => $period):
          if ($displayed_days >= $forecast_days) break;
          $displayed_days++;
        ?>
          <div class="forecast-day">
            <div class="forecast-day-name"><?php echo esc_html($period['name']); ?></div>
            <?php if (!empty($period['icon'])): ?>
              <div class="forecast-icon">
                <img src="<?php echo esc_url($period['icon']); ?>" alt="<?php echo esc_attr($period['shortForecast']); ?>" />
              </div>
            <?php endif; ?>
            <?php if ($show_temperature && !empty($period['temperature'])): ?>
              <div class="forecast-temp">
                <?php echo esc_html(prolific_convert_temperature($period['temperature'], $temperature_unit)); ?><?php echo esc_html($temp_unit); ?>
              </div>
            <?php endif; ?>
            <?php if (!empty($period['shortForecast'])): ?>
              <div class="forecast-condition"><?php echo esc_html($period['shortForecast']); ?></div>
            <?php endif; ?>
          </div>
        <?php endforeach; ?>
      </div>
    </div>
  <?php endif; ?>
</div>

<?php
return ob_get_clean();
