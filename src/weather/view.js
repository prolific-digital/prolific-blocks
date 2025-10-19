/**
 * Frontend JavaScript for Weather block.
 * Handles dynamic weather updates and geolocation if needed.
 */

document.addEventListener('DOMContentLoaded', function() {
  const weatherBlocks = document.querySelectorAll('.wp-block-prolific-weather');

  weatherBlocks.forEach((block) => {
    // Add any frontend interactivity here
    // For example, you could add a refresh button or real-time updates

    // Add a subtle fade-in animation (optional, progressive enhancement)
    // Block is visible by default, this just adds a nice entrance animation
    block.classList.add('weather-animate-in');
  });
});
