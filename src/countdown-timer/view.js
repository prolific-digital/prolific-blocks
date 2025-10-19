/**
 * Frontend JavaScript for Countdown Timer block
 * Handles live countdown updates and expiration behavior
 */

document.addEventListener('DOMContentLoaded', function() {
	// Get all countdown timer blocks
	const countdownBlocks = document.querySelectorAll('.wp-block-prolific-countdown-timer');

	countdownBlocks.forEach((block) => {
		const targetDate = block.getAttribute('data-target-date');
		const targetTime = block.getAttribute('data-target-time');
		const showDays = block.getAttribute('data-show-days') === 'true';
		const showHours = block.getAttribute('data-show-hours') === 'true';
		const showMinutes = block.getAttribute('data-show-minutes') === 'true';
		const showSeconds = block.getAttribute('data-show-seconds') === 'true';
		const labelDays = block.getAttribute('data-label-days');
		const labelDay = block.getAttribute('data-label-day');
		const labelHours = block.getAttribute('data-label-hours');
		const labelHour = block.getAttribute('data-label-hour');
		const labelMinutes = block.getAttribute('data-label-minutes');
		const labelMinute = block.getAttribute('data-label-minute');
		const labelSeconds = block.getAttribute('data-label-seconds');
		const labelSecond = block.getAttribute('data-label-second');
		const autoHide = block.getAttribute('data-auto-hide') === 'true';
		const leadingZeros = block.getAttribute('data-leading-zeros') === 'true';
		const evergreenMode = block.getAttribute('data-evergreen-mode') === 'true';
		const evergreenHours = parseInt(block.getAttribute('data-evergreen-hours')) || 24;

		const container = block.querySelector('.countdown-container');
		const expiredElement = block.querySelector('.countdown-expired');

		let targetTimestamp;
		let countdownInterval;

		// Calculate target timestamp
		if (evergreenMode) {
			// Evergreen mode: Use localStorage to track visitor's countdown
			const storageKey = 'countdown_' + block.id;
			let storedTimestamp = localStorage.getItem(storageKey);

			if (!storedTimestamp) {
				// First visit: Set countdown from now
				targetTimestamp = new Date().getTime() + (evergreenHours * 60 * 60 * 1000);
				localStorage.setItem(storageKey, targetTimestamp);
			} else {
				// Returning visit: Use stored timestamp
				targetTimestamp = parseInt(storedTimestamp);
			}
		} else {
			// Standard mode: Use specified date and time
			if (targetDate) {
				const dateTimeString = targetDate + 'T' + targetTime;
				targetTimestamp = new Date(dateTimeString).getTime();
			}
		}

		// Format number with optional leading zeros
		const formatNumber = (num) => {
			return leadingZeros ? String(num).padStart(2, '0') : String(num);
		};

		// Update label based on singular/plural
		const updateLabel = (element, value, singular, plural) => {
			if (element) {
				element.textContent = value === 1 ? singular : plural;
			}
		};

		// Update countdown display
		const updateCountdown = () => {
			const now = new Date().getTime();
			const distance = targetTimestamp - now;

			// Check if countdown has expired
			if (distance < 0) {
				clearInterval(countdownInterval);

				if (autoHide) {
					block.style.display = 'none';
				} else {
					container.style.display = 'none';
					if (expiredElement) {
						expiredElement.style.display = 'block';
					}
				}
				return;
			}

			// Calculate time units
			const days = Math.floor(distance / (1000 * 60 * 60 * 24));
			const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
			const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
			const seconds = Math.floor((distance % (1000 * 60)) / 1000);

			// Update display for each unit
			if (showDays) {
				const daysElement = block.querySelector('[data-unit="days"]');
				const daysLabel = block.querySelector('.countdown-days .countdown-label');
				if (daysElement) {
					daysElement.textContent = formatNumber(days);
				}
				updateLabel(daysLabel, days, labelDay, labelDays);
			}

			if (showHours) {
				const hoursElement = block.querySelector('[data-unit="hours"]');
				const hoursLabel = block.querySelector('.countdown-hours .countdown-label');
				if (hoursElement) {
					hoursElement.textContent = formatNumber(hours);
				}
				updateLabel(hoursLabel, hours, labelHour, labelHours);
			}

			if (showMinutes) {
				const minutesElement = block.querySelector('[data-unit="minutes"]');
				const minutesLabel = block.querySelector('.countdown-minutes .countdown-label');
				if (minutesElement) {
					minutesElement.textContent = formatNumber(minutes);
				}
				updateLabel(minutesLabel, minutes, labelMinute, labelMinutes);
			}

			if (showSeconds) {
				const secondsElement = block.querySelector('[data-unit="seconds"]');
				const secondsLabel = block.querySelector('.countdown-seconds .countdown-label');
				if (secondsElement) {
					secondsElement.textContent = formatNumber(seconds);
				}
				updateLabel(secondsLabel, seconds, labelSecond, labelSeconds);
			}
		};

		// Initialize countdown
		if (targetTimestamp) {
			updateCountdown();
			countdownInterval = setInterval(updateCountdown, 1000);
		}
	});
});
