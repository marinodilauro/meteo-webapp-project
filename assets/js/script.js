// API keys (replace with your own)
const OPENWEATHER_API_KEY = '01c216d7c6d67611e8ad31d180cb4466';
const OPENWEATHER_API_BASE_URL = 'https://api.openweathermap.org/data/2.5/forecast/';

// DOM elements
const cityInput = document.getElementById('cityInput');
const searchButton = document.getElementById('searchButton');
const weatherInfo = document.getElementById('weatherInfo');
const recentSearches = document.getElementById('recentSearches');

// Load cities from JSON file and display their weather
let cities = [];
fetch('./assets/data/cities.json')
  .then(response => response.json())
  .then(data => {
    cities = data;
    displayInitialCitiesWeather();
  })
  .catch(error => console.error('Error loading cities:', error));


// Display weather for initial cities
async function displayInitialCitiesWeather() {
  const weatherPromises = cities.map(city => fetchWeatherData(city));
  const weatherData = await Promise.all(weatherPromises);
  displayWeatherData(weatherData);
}


// Fetch weather data from API
async function fetchWeatherData(city) {
  let url = `${OPENWEATHER_API_BASE_URL}?q=${city}&appid=${OPENWEATHER_API_KEY}&units=metric`;
  console.log(city);


  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('City not found');
  }
  const data = await response.json();
  return { city: data.city.name, forecast: data.list };
}

// Display weather data
function displayWeatherData(weatherDataArray) {
  let html = '';
  weatherDataArray.forEach(data => {
    const cityName = data.city;
    const forecasts = data.forecast.filter((_, index) => index % 8 === 0).slice(0, 7);

    html += `
            <h2 class="text-center mb-4">7-Day Forecast for ${cityName}</h2>
            <div class="table-responsive mb-5">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Temperature</th>
                            <th>Conditions</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

    html += forecasts
      .map(
        (item) => `
                <tr>
                    <td>${new Date(item.dt * 1000).toLocaleDateString()}</td>
                    <td>${item.main.temp.toFixed(1)}°C</td>
                    <td>
                        ${item.weather[0].description}
                        <img src="http://openweathermap.org/img/wn/${item.weather[0].icon}.png" alt="${item.weather[0].description}">
                    </td>
                </tr>`
      )
      .join("");

    html += `
                    </tbody>
                </table>
            </div>
        `;
  });

  weatherInfo.innerHTML = html;
}





