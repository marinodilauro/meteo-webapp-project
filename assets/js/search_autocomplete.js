function initPlacesAutocomplete() {
  const input = document.getElementById('cityInput');
  const options = {
    types: ['(cities)']
  };

  const autocomplete = new google.maps.places.Autocomplete(input, options);

  autocomplete.addListener('place_changed', function () {
    const place = autocomplete.getPlace();
    if (!place.geometry) {
      console.log("No details available for input: '" + place.name + "'");
      return;
    }

    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    const city = place.name;

    // Trigger weather search with the selected place
    searchWeatherByCoordinates(city, lat, lng);
  });
}

function searchWeatherByCoordinates(city, lat, lng) {
  fetchWeatherData(city, { lat, lng })
    .then(weatherData => {
      displayWeatherData([weatherData]);
      addToRecentSearches(city);
    })
    .catch(error => {
      weatherInfo.innerHTML = `<p class="text-danger">${error.message}</p>`;
    });
}

// This function will be called when the Google Maps API is loaded
function initGoogleMapsAPI() {
  initPlacesAutocomplete();
  // You can add other Google Maps related initializations here if needed
}
