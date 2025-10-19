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
 * Get Font Awesome weather icon SVG based on weather condition.
 *
 * @param string $condition Weather condition text (e.g., "Sunny", "Partly Cloudy", "Rain").
 * @return string SVG icon HTML.
 */
if (!function_exists('prolific_get_weather_icon')) {
  function prolific_get_weather_icon($condition) {
    $condition_lower = strtolower($condition);

    // Font Awesome icon paths (SVG path data)
    $icons = array(
      // Sun icon - for sunny/clear
      'sun' => array(
        'viewBox' => '0 0 512 512',
        'path' => 'M361.5 1.2c5 2.1 8.6 6.6 9.6 11.9L391 121l107.9 19.8c5.3 1 9.8 4.6 11.9 9.6s1.5 10.7-1.6 15.2L446.9 256l62.3 90.3c3.1 4.5 3.7 10.2 1.6 15.2s-6.6 8.6-11.9 9.6L391 391 371.1 498.9c-1 5.3-4.6 9.8-9.6 11.9s-10.7 1.5-15.2-1.6L256 446.9l-90.3 62.3c-4.5 3.1-10.2 3.7-15.2 1.6s-8.6-6.6-9.6-11.9L121 391 13.1 371.1c-5.3-1-9.8-4.6-11.9-9.6s-1.5-10.7 1.6-15.2L65.1 256 2.8 165.7c-3.1-4.5-3.7-10.2-1.6-15.2s6.6-8.6 11.9-9.6L121 121 140.9 13.1c1-5.3 4.6-9.8 9.6-11.9s10.7-1.5 15.2 1.6L256 65.1 346.3 2.8c4.5-3.1 10.2-3.7 15.2-1.6zM160 256a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zm224 0a128 128 0 1 0 -256 0 128 128 0 1 0 256 0z'
      ),
      // Cloud-sun icon - for partly cloudy/mostly sunny
      'cloud-sun' => array(
        'viewBox' => '0 0 640 512',
        'path' => 'M294.2 1.2c5.1 2.1 8.7 6.7 9.6 12.1l10.4 62.4c-23.3 10.8-42.9 28.4-56 50.3c-14.9-9.2-32.8-14.4-51.8-14.4c-52.9 0-96 43.1-96 96c0 35.5 19.3 66.6 48 83.2c.8 31.8 13.2 60.7 33.1 82.7l-56 39.1c-4.5 3.1-10.3 3.8-15.3 1.6s-8.7-6.7-9.6-12.1L98.1 317.9 13.4 303.8c-5.4-1-10.1-4.6-12.1-9.6s-1.5-10.7 1.6-15.3L52.5 208 2.9 137.2c-3.2-4.5-3.8-10.3-1.6-15.3s6.7-8.7 12.1-9.6L98.1 98.1l14.1-84.7c1-5.4 4.6-10.1 9.6-12.1s10.7-1.5 15.3 1.6L208 52.5 278.8 2.9c4.5-3.2 10.3-3.8 15.3-1.6zM144 208a64 64 0 1 1 128 0 64 64 0 1 1 -128 0zM639.9 431.9c0 44.2-35.8 80-80 80H288c-53 0-96-43-96-96c0-47.6 34.6-87 80-94.6l0-1.3c0-53 43-96 96-96c34.9 0 65.4 18.6 82.2 46.4c13-9.1 28.8-14.4 45.8-14.4c44.2 0 80 35.8 80 80c0 5.9-.6 11.7-1.9 17.2c37.4 6.7 65.8 39.4 65.8 78.7z'
      ),
      // Cloud icon - for cloudy/overcast
      'cloud' => array(
        'viewBox' => '0 0 640 512',
        'path' => 'M0 336c0 79.5 64.5 144 144 144H512c70.7 0 128-57.3 128-128c0-61.9-44-113.6-102.4-125.4c4.1-10.7 6.4-22.4 6.4-34.6c0-53-43-96-96-96c-19.7 0-38.1 6-53.3 16.2C367 64.2 315.3 32 256 32C167.6 32 96 103.6 96 192c0 2.7 .1 5.4 .2 8.1C40.2 219.8 0 273.2 0 336z'
      ),
      // Cloud-showers-heavy icon - for heavy rain
      'cloud-showers-heavy' => array(
        'viewBox' => '0 0 576 512',
        'path' => 'M128 320c-53 0-96-43-96-96c0-42.5 27.6-78.6 65.9-91.2C96.7 126.1 96 119.1 96 112C96 50.1 146.1 0 208 0c43.1 0 80.5 24.3 99.2 60c14.7-17.1 36.5-28 60.8-28c44.2 0 80 35.8 80 80c0 5.5-.6 10.8-1.6 16c.5 0 1.1 0 1.6 0c53 0 96 43 96 96s-43 96-96 96H128zm-14.5 33.9c12.2 5.2 17.8 19.3 12.6 31.5l-48 112c-5.2 12.2-19.3 17.8-31.5 12.6s-17.8-19.3-12.6-31.5l48-112c5.2-12.2 19.3-17.8 31.5-12.6zm120 0c12.2 5.2 17.8 19.3 12.6 31.5l-48 112c-5.2 12.2-19.3 17.8-31.5 12.6s-17.8-19.3-12.6-31.5l48-112c5.2-12.2 19.3-17.8 31.5-12.6zm244.6 31.5l-48 112c-5.2 12.2-19.3 17.8-31.5 12.6s-17.8-19.3-12.6-31.5l48-112c5.2-12.2 19.3-17.8 31.5-12.6s17.8 19.3 12.6 31.5zM345.5 353.9c12.2 5.2 17.8 19.3 12.6 31.5l-48 112c-5.2 12.2-19.3 17.8-31.5 12.6s-17.8-19.3-12.6-31.5l48-112c5.2-12.2 19.3-17.8 31.5-12.6z'
      ),
      // Cloud-rain icon - for rain/showers/drizzle
      'cloud-rain' => array(
        'viewBox' => '0 0 512 512',
        'path' => 'M96 320c-53 0-96-43-96-96c0-42.5 27.6-78.6 65.9-91.2C64.7 126.1 64 119.1 64 112C64 50.1 114.1 0 176 0c43.1 0 80.5 24.3 99.2 60c14.7-17.1 36.5-28 60.8-28c44.2 0 80 35.8 80 80c0 5.5-.6 10.8-1.6 16c.5 0 1.1 0 1.6 0c53 0 96 43 96 96s-43 96-96 96H96zm-6.8 52c1.3-2.5 3.9-4 6.8-4s5.4 1.5 6.8 4l35.1 64.6c4.1 7.5 6.2 15.8 6.2 24.3v3c0 26.5-21.5 48-48 48s-48-21.5-48-48v-3c0-8.5 2.1-16.9 6.2-24.3L89.2 372zm160 0c1.3-2.5 3.9-4 6.8-4s5.4 1.5 6.8 4l35.1 64.6c4.1 7.5 6.2 15.8 6.2 24.3v3c0 26.5-21.5 48-48 48s-48-21.5-48-48v-3c0-8.5 2.1-16.9 6.2-24.3L249.2 372zm124.9 64.6L409.2 372c1.3-2.5 3.9-4 6.8-4s5.4 1.5 6.8 4l35.1 64.6c4.1 7.5 6.2 15.8 6.2 24.3v3c0 26.5-21.5 48-48 48s-48-21.5-48-48v-3c0-8.5 2.1-16.9 6.2-24.3z'
      ),
      // Cloud-bolt icon - for thunderstorm
      'cloud-bolt' => array(
        'viewBox' => '0 0 512 512',
        'path' => 'M0 224c0 53 43 96 96 96h47.2L290 202.5c17.6-14.1 42.6-14 60.2 .2s22.8 38.6 12.8 58.8L333.7 320H352h64c53 0 96-43 96-96s-43-96-96-96c-.5 0-1.1 0-1.6 0c1-5.2 1.6-10.5 1.6-16c0-44.2-35.8-80-80-80c-24.3 0-46.1 10.9-60.8 28C256.5 24.3 219.1 0 176 0C114.1 0 64 50.1 64 112c0 7.1 .7 14.1 1.9 20.8C27.6 145.4 0 181.5 0 224zm330.1 3.6c-5.8-4.7-14.2-4.7-20.1-.1l-160 128c-5.3 4.2-7.4 11.4-5.1 17.8s8.3 10.7 15.1 10.7h70.1L177.7 488.8c-3.4 6.7-1.6 14.9 4.3 19.6s14.2 4.7 20.1 .1l160-128c5.3-4.2 7.4-11.4 5.1-17.8s-8.3-10.7-15.1-10.7H281.9l52.4-104.8c3.4-6.7 1.6-14.9-4.2-19.6z'
      ),
      // Snowflake icon - for snow
      'snowflake' => array(
        'viewBox' => '0 0 448 512',
        'path' => 'M224 0c17.7 0 32 14.3 32 32V62.1l15-15c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-49 49v70.3l61.4-35.8 17.7-66.1c3.4-12.8 16.6-20.4 29.4-17s20.4 16.6 17 29.4l-5.2 19.3 23.6-13.8c15.3-8.9 34.9-3.7 43.8 11.5s3.7 34.9-11.5 43.8l-25.3 14.8 21.7 5.8c12.8 3.4 20.4 16.6 17 29.4s-16.6 20.4-29.4 17l-67.7-18.1L287.5 256l60.9 35.5 67.7-18.1c12.8-3.4 26 4.2 29.4 17s-4.2 26-17 29.4l-21.7 5.8 25.3 14.8c15.3 8.9 20.4 28.5 11.5 43.8s-28.5 20.4-43.8 11.5l-23.6-13.8 5.2 19.3c3.4 12.8-4.2 26-17 29.4s-26-4.2-29.4-17l-17.7-66.1L256 311.7v70.3l49 49c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-15-15V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V449.9l-15 15c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l49-49V311.7l-61.4 35.8-17.7 66.1c-3.4 12.8-16.6 20.4-29.4 17s-20.4-16.6-17-29.4l5.2-19.3L48.1 395.6c-15.3 8.9-34.9 3.7-43.8-11.5s-3.7-34.9 11.5-43.8l25.3-14.8-21.7-5.8c-12.8-3.4-20.4-16.6-17-29.4s16.6-20.4 29.4-17l67.7 18.1L160.5 256 99.6 220.5 31.9 238.6c-12.8 3.4-26-4.2-29.4-17s4.2-26 17-29.4l21.7-5.8L15.9 171.6C.6 162.7-4.5 143.1 4.4 127.9s28.5-20.4 43.8-11.5l23.6 13.8-5.2-19.3c-3.4-12.8 4.2-26 17-29.4s26 4.2 29.4 17l17.7 66.1L192 200.3V129.9L143 81c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l15 15V32c0-17.7 14.3-32 32-32z'
      ),
      // Icicles icon - for freezing rain/ice
      'icicles' => array(
        'viewBox' => '0 0 512 512',
        'path' => 'M75.8 304.8L1 35.7c-.7-2.5-1-5-1-7.5C0 12.6 12.6 0 28.2 0H483.8C499.4 0 512 12.6 512 28.2c0 2.5-.3 5-1 7.5L436.2 304.8c-4.5 16.1-11.1 31.5-19.6 45.7L350.3 473.6c-8.8 14.7-24.7 23.8-41.7 23.8H203.4c-17 0-32.9-9.1-41.7-23.8l-66.2-123c-8.6-14.2-15.2-29.6-19.6-45.7zM272 128c0-8.8-7.2-16-16-16s-16 7.2-16 16v80c0 8.8 7.2 16 16 16s16-7.2 16-16V128zm-80 0c0-8.8-7.2-16-16-16s-16 7.2-16 16v96c0 8.8 7.2 16 16 16s16-7.2 16-16V128zm160 0c0-8.8-7.2-16-16-16s-16 7.2-16 16v64c0 8.8 7.2 16 16 16s16-7.2 16-16V128zM112 96c-8.8 0-16 7.2-16 16v80c0 8.8 7.2 16 16 16s16-7.2 16-16V112c0-8.8-7.2-16-16-16zm288 16c0-8.8-7.2-16-16-16s-16 7.2-16 16v48c0 8.8 7.2 16 16 16s16-7.2 16-16V112z'
      ),
      // Droplet icon - for humidity
      'droplet' => array(
        'viewBox' => '0 0 384 512',
        'path' => 'M192 512C86 512 0 426 0 320C0 228.8 130.2 57.7 166.6 11.7C172.6 4.2 181.5 0 192 0s19.4 4.2 25.4 11.7C253.8 57.7 384 228.8 384 320c0 106-86 192-192 192zM96 336c0-8.8-7.2-16-16-16s-16 7.2-16 16c0 79.5 64.5 144 144 144c8.8 0 16-7.2 16-16s-7.2-16-16-16c-61.9 0-112-50.1-112-112z'
      ),
      // Temperature-high icon - for hot weather
      'temperature-high' => array(
        'viewBox' => '0 0 512 512',
        'path' => 'M416 128c-17.7 0-32-14.3-32-32s14.3-32 32-32s32 14.3 32 32s-14.3 32-32 32zm0 64c53 0 96-43 96-96s-43-96-96-96s-96 43-96 96s43 96 96 96zM96 112c0-26.5 21.5-48 48-48s48 21.5 48 48V276.5c0 17.3 7.1 31.9 15.3 42.5C217.8 332.6 224 349.5 224 368c0 44.2-35.8 80-80 80s-80-35.8-80-80c0-18.5 6.2-35.4 16.7-48.9C88.9 308.4 96 293.8 96 276.5V112zM144 0C82.1 0 32 50.2 32 112V276.5c0 .1-.1 .3-.2 .6c-.2 .6-.8 1.6-1.7 2.8C11.2 304.2 0 334.8 0 368c0 79.5 64.5 144 144 144s144-64.5 144-144c0-33.2-11.3-63.8-30.1-88.1c-.9-1.2-1.5-2.2-1.7-2.8c-.1-.3-.2-.5-.2-.6V112C256 50.2 205.9 0 144 0zm0 416c26.5 0 48-21.5 48-48c0-20.9-13.4-38.7-32-45.3V112c0-8.8-7.2-16-16-16s-16 7.2-16 16V322.7c-18.6 6.6-32 24.4-32 45.3c0 26.5 21.5 48 48 48z'
      ),
      // Temperature-low icon - for cold weather
      'temperature-low' => array(
        'viewBox' => '0 0 512 512',
        'path' => 'M416 64c-17.7 0-32 14.3-32 32s14.3 32 32 32s32-14.3 32-32s-14.3-32-32-32zM352 96c0 53 43 96 96 96s96-43 96-96s-43-96-96-96s-96 43-96 96zM96 112c0-26.5 21.5-48 48-48s48 21.5 48 48V276.5c0 17.3 7.1 31.9 15.3 42.5C217.8 332.6 224 349.5 224 368c0 44.2-35.8 80-80 80s-80-35.8-80-80c0-18.5 6.2-35.4 16.7-48.9C88.9 308.4 96 293.8 96 276.5V112zM144 0C82.1 0 32 50.2 32 112V276.5c0 .1-.1 .3-.2 .6c-.2 .6-.8 1.6-1.7 2.8C11.2 304.2 0 334.8 0 368c0 79.5 64.5 144 144 144s144-64.5 144-144c0-33.2-11.3-63.8-30.1-88.1c-.9-1.2-1.5-2.2-1.7-2.8c-.1-.3-.2-.5-.2-.6V112C256 50.2 205.9 0 144 0zm0 416c26.5 0 48-21.5 48-48c0-20.9-13.4-38.7-32-45.3V112c0-8.8-7.2-16-16-16s-16 7.2-16 16V322.7c-18.6 6.6-32 24.4-32 45.3c0 26.5 21.5 48 48 48z'
      ),
      // Tornado icon - for tornado/severe weather
      'tornado' => array(
        'viewBox' => '0 0 448 512',
        'path' => 'M0 32V64H448V32c0-17.7-14.3-32-32-32H32C14.3 0 0 14.3 0 32zM24 96C10.7 96 0 106.7 0 120s10.7 24 24 24H360c13.3 0 24-10.7 24-24s-10.7-24-24-24H24zM56 192c-13.3 0-24 10.7-24 24s10.7 24 24 24H328c13.3 0 24-10.7 24-24s-10.7-24-24-24H56zM104 320c-17.7 0-32 14.3-32 32s14.3 32 32 32H280c17.7 0 32-14.3 32-32s-14.3-32-32-32H104zm40 96c-13.3 0-24 10.7-24 24s10.7 24 24 24h80c13.3 0 24-10.7 24-24s-10.7-24-24-24H144z'
      ),
      // Smog icon - for fog/mist/haze/smoke
      'smog' => array(
        'viewBox' => '0 0 640 512',
        'path' => 'M32 144c0 79.5 64.5 144 144 144H299.3c22.6 19.9 52.2 32 84.7 32s62.1-12.1 84.7-32H496c61.9 0 112-50.1 112-112s-50.1-112-112-112c-10.7 0-21 1.5-30.8 4.3C443.8 27.7 401.1 0 352 0c-32.6 0-62.4 12.2-85.1 32.3C242.1 12.1 210.5 0 176 0C96.5 0 32 64.5 32 144zM616 368H280c-13.3 0-24 10.7-24 24s10.7 24 24 24H616c13.3 0 24-10.7 24-24s-10.7-24-24-24zm-64 96H440c-13.3 0-24 10.7-24 24s10.7 24 24 24H552c13.3 0 24-10.7 24-24s-10.7-24-24-24zm-192 0H24c-13.3 0-24 10.7-24 24s10.7 24 24 24H360c13.3 0 24-10.7 24-24s-10.7-24-24-24zM224 392c0-13.3-10.7-24-24-24H96c-13.3 0-24 10.7-24 24s10.7 24 24 24H200c13.3 0 24-10.7 24-24z'
      ),
      // Wind icon - for windy/breezy
      'wind' => array(
        'viewBox' => '0 0 512 512',
        'path' => 'M288 32c0 17.7 14.3 32 32 32h32c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H352c53 0 96-43 96-96s-43-96-96-96H320c-17.7 0-32 14.3-32 32zm64 352c0 17.7 14.3 32 32 32h32c53 0 96-43 96-96s-43-96-96-96H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H384c-17.7 0-32 14.3-32 32zM128 512h32c53 0 96-43 96-96s-43-96-96-96H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H160c17.7 0 32 14.3 32 32s-14.3 32-32 32H128c-17.7 0-32 14.3-32 32s14.3 32 32 32z'
      ),
      // Moon icon - for clear night
      'moon' => array(
        'viewBox' => '0 0 384 512',
        'path' => 'M223.5 32C100 32 0 132.3 0 256S100 480 223.5 480c60.6 0 115.5-24.2 155.8-63.4c5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6c-96.9 0-175.5-78.8-175.5-176c0-65.8 36-123.1 89.3-153.3c6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-6.3-.5-12.6-.8-19-.8z'
      )
    );

    // Map weather conditions to icons (ordered by priority for best matching)
    // Check for night conditions first
    if (strpos($condition_lower, 'night') !== false && (strpos($condition_lower, 'clear') !== false || strpos($condition_lower, 'fair') !== false)) {
      $icon = $icons['moon'];
    }
    // Severe weather
    elseif (strpos($condition_lower, 'tornado') !== false || strpos($condition_lower, 'severe') !== false) {
      $icon = $icons['tornado'];
    } elseif (strpos($condition_lower, 'thunderstorm') !== false || strpos($condition_lower, 'storm') !== false || strpos($condition_lower, 'lightning') !== false) {
      $icon = $icons['cloud-bolt'];
    }
    // Precipitation
    elseif (strpos($condition_lower, 'freezing rain') !== false || strpos($condition_lower, 'ice') !== false || strpos($condition_lower, 'icy') !== false || strpos($condition_lower, 'sleet') !== false) {
      $icon = $icons['icicles'];
    } elseif (strpos($condition_lower, 'heavy rain') !== false || strpos($condition_lower, 'downpour') !== false) {
      $icon = $icons['cloud-showers-heavy'];
    } elseif (strpos($condition_lower, 'rain') !== false || strpos($condition_lower, 'shower') !== false || strpos($condition_lower, 'drizzle') !== false) {
      $icon = $icons['cloud-rain'];
    } elseif (strpos($condition_lower, 'snow') !== false || strpos($condition_lower, 'flurries') !== false || strpos($condition_lower, 'blizzard') !== false) {
      $icon = $icons['snowflake'];
    }
    // Temperature extremes
    elseif (strpos($condition_lower, 'hot') !== false || strpos($condition_lower, 'heat') !== false || strpos($condition_lower, 'warm') !== false) {
      $icon = $icons['temperature-high'];
    } elseif (strpos($condition_lower, 'cold') !== false || strpos($condition_lower, 'frigid') !== false || strpos($condition_lower, 'freezing') !== false) {
      $icon = $icons['temperature-low'];
    }
    // Visibility
    elseif (strpos($condition_lower, 'fog') !== false || strpos($condition_lower, 'mist') !== false || strpos($condition_lower, 'haze') !== false || strpos($condition_lower, 'smoke') !== false || strpos($condition_lower, 'smog') !== false) {
      $icon = $icons['smog'];
    }
    // Wind
    elseif (strpos($condition_lower, 'wind') !== false || strpos($condition_lower, 'breezy') !== false || strpos($condition_lower, 'blustery') !== false || strpos($condition_lower, 'gusty') !== false) {
      $icon = $icons['wind'];
    }
    // Cloud conditions
    elseif (strpos($condition_lower, 'partly cloudy') !== false || strpos($condition_lower, 'mostly sunny') !== false || strpos($condition_lower, 'partly sunny') !== false || strpos($condition_lower, 'mostly clear') !== false) {
      $icon = $icons['cloud-sun'];
    } elseif (strpos($condition_lower, 'cloudy') !== false || strpos($condition_lower, 'overcast') !== false) {
      $icon = $icons['cloud'];
    }
    // Clear/Sunny
    elseif (strpos($condition_lower, 'sunny') !== false || strpos($condition_lower, 'clear') !== false || strpos($condition_lower, 'fair') !== false) {
      $icon = $icons['sun'];
    }
    // Default fallback
    else {
      $icon = $icons['cloud'];
    }

    return sprintf(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="%s" fill="currentColor" aria-hidden="true"><path d="%s"/></svg>',
      esc_attr($icon['viewBox']),
      esc_attr($icon['path'])
    );
  }
}

/**
 * Fetch weather data from National Weather Service API.
 *
 * @param string $latitude Latitude coordinate.
 * @param string $longitude Longitude coordinate.
 * @param string $display_type Display type (compact, current, full).
 * @param int $forecast_days Number of forecast days to retrieve.
 * @param bool $show_nights Whether to include night forecasts.
 * @return array|WP_Error Weather data or error.
 */
if (!function_exists('prolific_fetch_weather_data')) {
  function prolific_fetch_weather_data($latitude, $longitude, $display_type, $forecast_days, $show_nights) {
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

    // Extract location information
    $location_name = '';
    if (!empty($points_data['properties']['relativeLocation']['properties'])) {
      $loc_props = $points_data['properties']['relativeLocation']['properties'];
      $city = isset($loc_props['city']) ? $loc_props['city'] : '';
      $state = isset($loc_props['state']) ? $loc_props['state'] : '';
      if ($city && $state) {
        $location_name = $city . ', ' . $state;
      } elseif ($city) {
        $location_name = $city;
      }
    }

    $forecast_url = $points_data['properties']['forecast'];
    $hourly_url = isset($points_data['properties']['forecastHourly']) ? $points_data['properties']['forecastHourly'] : '';

    error_log('Prolific Weather: Forecast URL: ' . $forecast_url);
    error_log('Prolific Weather: Hourly URL: ' . $hourly_url);
    error_log('Prolific Weather: Location: ' . $location_name);

    $weather_data = array(
      'locationName' => $location_name
    );

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
        // Only store forecast if we need to display it (full type includes forecast)
        if ($display_type === 'full') {
          $all_periods = $forecast_data['properties']['periods'];

          // Filter based on showNights setting
          if (!$show_nights) {
            // Filter out night periods
            $all_periods = array_filter($all_periods, function($period) {
              $period_name = strtolower($period['name']);
              return strpos($period_name, 'night') === false && strpos($period_name, 'tonight') === false;
            });
            // Re-index the array
            $all_periods = array_values($all_periods);
          }

          // Limit to the requested number of forecast days
          // If showNights is true, we get day+night pairs, so multiply by 2
          $limit = $show_nights ? ($forecast_days * 2) : $forecast_days;
          $weather_data['forecast'] = array_slice($all_periods, 0, $limit);
        }

        // Set up current conditions (needed for all display types)
        if ($display_type === 'compact' || $display_type === 'current' || $display_type === 'full') {
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
      return round(($fahrenheit - 32) * 5 / 9);
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
      'N',
      'NNE',
      'NE',
      'ENE',
      'E',
      'ESE',
      'SE',
      'SSE',
      'S',
      'SSW',
      'SW',
      'WSW',
      'W',
      'WNW',
      'NW',
      'NNW'
    ];

    $index = round($degrees / 22.5) % 16;
    return $directions[$index];
  }
}

// Get attributes with defaults
$latitude = isset($attributes['latitude']) ? sanitize_text_field($attributes['latitude']) : '';
$longitude = isset($attributes['longitude']) ? sanitize_text_field($attributes['longitude']) : '';
$location_name = isset($attributes['locationName']) ? sanitize_text_field($attributes['locationName']) : '';
$custom_location_name = isset($attributes['customLocationName']) ? sanitize_text_field($attributes['customLocationName']) : '';
$show_location = isset($attributes['showLocation']) ? $attributes['showLocation'] : true;
$display_type = isset($attributes['displayType']) ? $attributes['displayType'] : 'full';
$show_nights = isset($attributes['showNights']) ? $attributes['showNights'] : false;
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
$cache_key = 'prolific_weather_' . md5($latitude . $longitude . $display_type . $forecast_days . $show_nights);

// Try to get cached data
$weather_data = get_transient($cache_key);

// If no cached data, fetch from API
if (false === $weather_data) {
  $weather_data = prolific_fetch_weather_data($latitude, $longitude, $display_type, $forecast_days, $show_nights);

  if (is_wp_error($weather_data)) {
    return '<div ' . get_block_wrapper_attributes(['class' => 'wp-block-prolific-weather weather-error']) . '><p>' . esc_html($weather_data->get_error_message()) . '</p></div>';
  }

  // Cache the data
  set_transient($cache_key, $weather_data, $cache_duration);
}

$temp_unit = prolific_get_temp_unit($temperature_unit);

// Determine which location name to display: custom name > API name > attribute name
// Priority: customLocationName > locationName > API locationName
$api_location_name = !empty($weather_data['locationName']) ? $weather_data['locationName'] : '';
$final_location_name = !empty($custom_location_name) ? $custom_location_name : (!empty($location_name) ? $location_name : $api_location_name);

// Build block wrapper attributes with display type class
$wrapper_classes = ['wp-block-prolific-weather', 'weather-display-' . $display_type];
$wrapper_attributes = get_block_wrapper_attributes(['class' => implode(' ', $wrapper_classes)]);
?>

<div <?php echo $wrapper_attributes; ?>>
  <?php if ($show_location && !empty($final_location_name)): ?>
    <div class="weather-location">
      <?php echo esc_html(sprintf(__('Weather for %s', 'prolific-blocks'), $final_location_name)); ?>
    </div>
  <?php endif; ?>

  <?php if (!empty($weather_data['current'])): ?>
    <?php if ($display_type === 'compact'): ?>
      <!-- Compact mode: Icon + temperature only -->
      <div class="weather-compact">
        <?php if (!empty($weather_data['current']['shortForecast'])): ?>
          <div class="weather-icon">
            <?php echo prolific_get_weather_icon($weather_data['current']['shortForecast']); ?>
          </div>
        <?php endif; ?>
        <?php if ($show_temperature && !empty($weather_data['current']['temperature'])): ?>
          <div class="weather-temp">
            <span class="temp-current">
              <?php echo esc_html(prolific_convert_temperature($weather_data['current']['temperature'], $temperature_unit)); ?><?php echo esc_html($temp_unit); ?>
            </span>
          </div>
        <?php endif; ?>
      </div>

    <?php elseif ($display_type === 'current' || $display_type === 'full'): ?>
      <!-- Current weather card (for both 'current' and 'full' modes) -->
      <div class="weather-current">
        <?php if (!empty($weather_data['current']['shortForecast'])): ?>
          <div class="weather-icon">
            <?php echo prolific_get_weather_icon($weather_data['current']['shortForecast']); ?>
          </div>
        <?php endif; ?>

        <div class="weather-details">
          <?php if ($show_temperature && !empty($weather_data['current']['temperature'])): ?>
            <div class="weather-temp">
              <span class="temp-current">
                <?php echo esc_html(prolific_convert_temperature($weather_data['current']['temperature'], $temperature_unit)); ?><?php echo esc_html($temp_unit); ?>
              </span>
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
  <?php endif; ?>

  <?php if ($display_type === 'full' && !empty($weather_data['forecast'])): ?>
    <!-- Forecast section (horizontal scrollable row) -->
    <div class="weather-forecast">
      <h3 class="forecast-title"><?php echo esc_html__('Forecast', 'prolific-blocks'); ?></h3>
      <div class="forecast-scroll-container">
        <?php foreach ($weather_data['forecast'] as $index => $period): ?>
          <div class="forecast-day">
            <div class="forecast-day-name"><?php echo esc_html($period['name']); ?></div>
            <?php if (!empty($period['shortForecast'])): ?>
              <div class="forecast-icon">
                <?php echo prolific_get_weather_icon($period['shortForecast']); ?>
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
