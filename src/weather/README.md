# Weather Block

Display current weather conditions and forecasts using the free National Weather Service API. No API key required!

## Features

- **Real-time Weather Data**: Fetch current conditions and forecasts from the National Weather Service
- **Flexible Display Options**: Show current weather, forecast, or both
- **Geolocation Support**: Use browser geolocation to auto-detect user location
- **Temperature Units**: Toggle between Fahrenheit and Celsius
- **Customizable Data Display**: Show/hide temperature, humidity, wind, and precipitation
- **Smart Caching**: Automatic data caching with configurable refresh intervals
- **Responsive Design**: Mobile-friendly card layout
- **Accessibility**: ARIA labels and semantic HTML

## Installation

1. The block is automatically available after installing the Prolific Blocks plugin
2. Look for "Weather" in the block inserter under the "Prolific" category

## Usage

### Basic Setup

1. Add the Weather block to your page/post
2. In the block sidebar, enter coordinates:
   - **Latitude**: Example: 38.8977 (Washington, DC)
   - **Longitude**: Example: -77.0365 (Washington, DC)
3. Or click "Use My Location" to auto-detect coordinates (requires browser permission)

### Finding Coordinates

For US locations, visit [weather.gov](https://www.weather.gov/) and search for your location. The coordinates will be displayed in the URL or on the page.

### Display Options

**Display Mode**:
- **Current & Forecast**: Show both current conditions and multi-day forecast
- **Current Only**: Show only current weather conditions
- **Forecast Only**: Show only the forecast

**Temperature Unit**:
- Fahrenheit (°F)
- Celsius (°C)

**Data Visibility Toggles**:
- Show/hide temperature
- Show/hide humidity percentage
- Show/hide wind speed and direction
- Show/hide precipitation probability

**Forecast Days**: Choose 1-7 days to display in the forecast

### Refresh Settings

**Refresh Interval**:
- **Manual**: Data cached indefinitely (until page cache clears)
- **Hourly**: Refresh weather data every hour
- **Daily**: Refresh weather data once per day

Weather data is automatically cached using WordPress transients to improve performance and reduce API calls.

## Block Supports

- **Alignment**: Wide and full width
- **Colors**: Text, background, and link colors
- **Typography**: Font size and line height
- **Spacing**: Padding and margin
- **Border**: Color, radius, style, and width

## API Information

This block uses the [National Weather Service API](https://www.weather.gov/documentation/services-web-api), which:
- Is completely free
- Requires no API key
- Only works for US locations
- Updates hourly
- Provides accurate, official weather data

## Browser Compatibility

The geolocation feature requires:
- HTTPS connection (or localhost)
- User permission to access location
- Modern browser with Geolocation API support

## Technical Details

### Dynamic Block

This is a dynamic block that:
- Renders via PHP (`render.php`)
- Fetches weather data server-side
- Uses WordPress transients for caching
- Includes frontend JavaScript for enhancements (`view.js`)

### API Workflow

1. Get grid information: `https://api.weather.gov/points/{lat},{lon}`
2. Fetch forecast: `https://api.weather.gov/gridpoints/{office}/{gridX},{gridY}/forecast`
3. Fetch hourly data: `https://api.weather.gov/gridpoints/{office}/{gridX},{gridY}/forecast/hourly`

### Caching

- Cache keys based on coordinates and settings
- Uses WordPress `set_transient()` and `get_transient()`
- Duration determined by refresh interval setting
- Automatically clears when settings change

## Styling

The block includes:
- Responsive grid layout for forecast
- Card-based design with shadows
- Weather icons from NWS API
- Smooth fade-in animation
- Mobile-optimized layout

## Customization

You can customize the block appearance using:
- WordPress block supports (colors, spacing, typography)
- Custom CSS targeting `.wp-block-prolific-weather`
- Theme.json settings

## Example CSS

```css
.wp-block-prolific-weather {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.wp-block-prolific-weather .weather-current .temp-current {
  font-size: 3rem;
}
```

## Error Handling

The block handles various error states:
- Invalid coordinates
- Location outside US coverage area
- API connection failures
- Network errors
- Browser permission denied for geolocation

## Accessibility

- ARIA labels for screen readers
- Semantic HTML structure
- Keyboard accessible
- Color contrast compliant

## Performance

- Server-side rendering for fast initial load
- Cached API responses reduce server load
- Minimal JavaScript for frontend
- Optimized images from NWS API

## Troubleshooting

**Weather data not displaying**:
- Verify coordinates are within US territory
- Check that coordinates are in decimal format (e.g., 38.8977, not 38°53'52")
- Clear WordPress cache/transients
- Check browser console for errors

**Geolocation not working**:
- Ensure site uses HTTPS
- Check browser location permissions
- Try manually entering coordinates

**API errors**:
- NWS API occasionally has downtime
- Some locations may have limited data
- Hourly data may not be available for all areas

## Version

1.0.0

## License

GPL-2.0-or-later
