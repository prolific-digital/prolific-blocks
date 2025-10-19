# Weather Block Debugging Guide

## Current Status

Data is being **successfully fetched** from the API (confirmed by console logs showing `properties.periods` array), but **NOT displaying** in the editor or frontend.

## Debug Build Deployed

I've added extensive console logging to help diagnose the issue. The build has been completed successfully.

## How to Test

1. **Open WordPress Block Editor**
2. **Add a Weather block**
3. **Enter coordinates:** 40.7128, -74.0060 (New York City)
4. **Open browser console** (F12 or Cmd+Option+I)
5. **Watch for these console logs:**

### Expected Console Output

You should see logs in this order:

```
Fetching points data from: https://api.weather.gov/points/40.7128,-74.0060
Points data: {properties: {...}}
Forecast URL: https://api.weather.gov/gridpoints/LMK/50,78/forecast
Hourly URL: https://api.weather.gov/gridpoints/LMK/50,78/forecast/hourly
Forecast data: {properties: {periods: [...]}}
Hourly data: {properties: {periods: [...]}}
Prepared weather data: {current: {...}, forecast: [...]}
```

Then when rendering:

```
renderWeatherPreview called with weatherData: {current: {...}, forecast: [...]}
displayMode: "both"
weatherData?.current: {...}
weatherData?.forecast: [...]
About to render weather preview
Current condition check: true/false
Forecast condition check: true/false
```

### Key Questions to Answer

**Q1:** Do you see "Prepared weather data" in the console?
- **YES:** State is being prepared correctly
- **NO:** Data fetch is failing silently

**Q2:** Do you see "renderWeatherPreview called with weatherData"?
- **YES:** Render function is being called
- **NO:** Component isn't re-rendering after state update

**Q3:** What does "weatherData?.current" show?
- **null:** Current data not being extracted from API response
- **{...}:** Current data extracted successfully

**Q4:** What does "weatherData?.forecast" show?
- **[]:** Empty array - no forecast periods
- **[...]:** Forecast array populated

**Q5:** What does "Current condition check" show?
- **true:** Should render current weather
- **false:** Won't render (check displayMode and weatherData.current)

**Q6:** Do you see "Rendering current weather with data"?
- **YES:** Current weather IS rendering
- **NO:** Render condition failed

## Possible Issues & Solutions

### Issue 1: State Not Updating
**Symptom:** "Prepared weather data" logs show data, but "renderWeatherPreview" shows null

**Cause:** React state update timing issue

**Solution:** The state should update correctly, but if not, there may be a race condition.

### Issue 2: Render Conditions Failing
**Symptom:** weatherData exists but "Current condition check" is false

**Causes:**
- `displayMode` is not "current" or "both"
- `weatherData.current` is null or undefined

**Check:** Console logs will show the exact values

### Issue 3: Data Structure Mismatch
**Symptom:** "weatherData?.current" shows null even though API data was fetched

**Cause:** Data extraction logic failing at line 125-126 in edit.js

**Check:** Look for this condition:
```javascript
if (forecastData.properties && forecastData.properties.periods && forecastData.properties.periods[0])
```

If this is false, `forecastData.properties.periods[0]` doesn't exist.

### Issue 4: Empty Periods Array
**Symptom:** "weatherData?.forecast" shows []

**Cause:** `forecastData.properties.periods` is empty or undefined

**Solution:** API might not be returning data for those coordinates

## Next Steps

Based on the console output, we can determine:

1. **If weatherData is null in renderWeatherPreview:**
   - State isn't being set
   - Need to investigate why setWeatherData isn't working

2. **If weatherData exists but has null current:**
   - Data extraction failing
   - Need to fix lines 125-166 in edit.js

3. **If weatherData exists but render conditions are false:**
   - displayMode check failing
   - Need to verify displayMode attribute value

4. **If everything checks pass but no visual output:**
   - CSS issue hiding content
   - DOM elements not rendering properly

## Files Modified

- `/Users/chrismiller/Local Sites/sandbox/app/public/wp-content/plugins/prolific-blocks/src/weather/edit.js`
  - Added comprehensive debug logging
  - Enhanced error handling in renderWeatherPreview

## Manual Testing Checklist

- [ ] Open browser console
- [ ] Add Weather block
- [ ] Enter coordinates: 40.7128, -74.0060
- [ ] Verify "Forecast data" log appears
- [ ] Verify "Prepared weather data" log appears
- [ ] Verify "renderWeatherPreview called" log appears
- [ ] Check what weatherData contains
- [ ] Check if Current/Forecast condition checks pass
- [ ] Note any errors in console
- [ ] Take screenshot of console output
- [ ] Take screenshot of block in editor

## Report Back

Please provide:
1. Complete console output (copy all logs)
2. Screenshot showing the block in the editor
3. Any error messages
4. What "Current condition check" and "Forecast condition check" show
