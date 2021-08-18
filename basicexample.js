let apiKey = config.MY_API_TOKEN;

let data;

let latitude;
let longitude;

let defaultDegree = `°C`;

console.log(`API Key: ${apiKey}`);

// Get current location with navigator
window.addEventListener('load', () => {
	navigator.geolocation.getCurrentPosition((position) => {
		latitude = position.coords.latitude;
		longitude = position.coords.longitude;
		console.log(position);

		const getCurrentLocation = async () => {
			const response = await axios.get(
				`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`
			);

			console.log(response.data);
			fetchWeather(response.data.name);
		};
		getCurrentLocation();
	});
});

// to fetch weather api based on any selected city
const fetchWeather = async (city) => {
	console.log(city);

	try {
		// Fetch the data of the weather information based on selected city
		const response = await axios.get(
			`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
		);
		data = response.data;

		console.log(response);
		console.log(data);

		console.log(data.cod);

		console.log(data.sys.country);

		const getTimezone = await axios.get(
			`https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&appid-94.04&exclude=hourly,daily&appid=${apiKey}`
		);

		console.log(getTimezone.data.timezone);
		getCurrentTimeDate(getTimezone.data.timezone);
		displayWeather(data);
	} catch (err) {
		console.log(err.response);

		if (err.response.status === 404) {
			alert(`Invalid city: ${city}`);
		} else if (err.response.status === 400) {
			alert(`City cannot be empty`);
		}
	}
};

// to display fetched weather info on the browser
const displayWeather = (weatherData) => {
	// Get City name from element
	document.querySelector(
		'.city'
	).textContent = `${weatherData.name}, ${weatherData.sys.country}`;

	// Get temperature element from HTML
	document.querySelector('.temp').textContent = `${Math.floor(
		weatherData.main.temp - 273
	)}°C`;

	// Weather Description
	document.querySelector('.description').textContent =
		weatherData.weather[0].description;

	// Wind speed
	document.querySelector(
		'.wind-speed'
	).textContent = `${weatherData.wind.speed} km/h`;

	// Humidity
	document.querySelector(
		'.humidity'
	).textContent = `${weatherData.main.humidity}%`;

	// Current Weather Icon
	document.querySelector(
		'.weather-icon'
	).src = `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`;

	// Country Flag
	document.querySelector(
		'.country-flag'
	).src = `https://www.countryflags.io/${weatherData.sys.country}/shiny/64.png`;
};

// to search for city name in the search bar
const searchCity = () => {
	let input = document.querySelector('.city-input');

	document.querySelector('.button').addEventListener('click', () => {
		// input.value will be the params of fetchWeather
		fetchWeather(input.value);

		console.log(input.value);
	});

	document.querySelector('.city-input').addEventListener('keypress', (e) => {
		// console.log(input.value)
		if (e.key === 'Enter') {
			fetchWeather(input.value);

			console.log(input.value);
		}
	});
};
searchCity();

// to get the timezone of the selected city
const getCurrentTimeDate = (timezone) => {
	var currentTime = new Date().toLocaleTimeString([], {
		hour: '2-digit',
		minute: '2-digit',
		hour12: false,
		timeZone: timezone
	});

	console.log(currentTime);

	document.querySelector('.current-time').textContent = currentTime;

	// setTimeout(getCurrentTimeDate, 500); // To make the real time hours and minutes
};
