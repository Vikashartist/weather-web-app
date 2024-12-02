// Simple script for weather web application.

// Fetch elements from the DOM
const cityInput = document.getElementById("city-input");
const getWeatherBtn = document.getElementById("get-weather-btn");
const weatherInfo = document.getElementById("weather-info");
const cityName = document.getElementById("city-name");
const weatherDescription = document.getElementById("weather-description");
const temperature = document.getElementById("temperature");
const humidity = document.getElementById("humidity");
const errorMessage = document.getElementById("error-message");
const suggestionsList = document.getElementById("suggestions-list");
const weatherDetails = document.getElementById("weather-details");

// OpenWeatherMap API key (You will need to sign up on https://openweathermap.org/ to get your key)
const apiKey = "16e364f83322b85bea3a631489bc2368"; // Replace this with your API Key

// Event listener for typing in the city input
cityInput.addEventListener("input", function() {
    const query = cityInput.value.trim();

    if (query === "") {
        suggestionsList.classList.add("hidden");
        return;
    }

    // Fetch city suggestions from OpenWeatherMap's API (via the autocomplete feature)
    const apiUrl = `https://api.openweathermap.org/data/2.5/find?q=${query}&appid=${apiKey}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            suggestionsList.innerHTML = "";
            if (data.list && data.list.length > 0) {
                data.list.forEach(city => {
                    const cityDiv = document.createElement("div");
                    cityDiv.textContent = city.name + ", " + city.sys.country;
                    cityDiv.addEventListener("click", () => {
                        cityInput.value = city.name;
                        suggestionsList.classList.add("hidden");
                    });
                    suggestionsList.appendChild(cityDiv);
                });
                suggestionsList.classList.remove("hidden");
            } else {
                suggestionsList.classList.add("hidden");
            }
        })
        .catch(() => {
            suggestionsList.classList.add("hidden");
        });
});

// Hide suggestions list when clicked outside
document.addEventListener("click", function(event) {
    if (!suggestionsList.contains(event.target) && event.target !== cityInput) {
        suggestionsList.classList.add("hidden");
    }
});

// Event listener for the button to get the weather
getWeatherBtn.addEventListener("click", function() {
    const city = cityInput.value.trim();

    if (city === "") {
        errorMessage.textContent = "Please enter a city!";
        errorMessage.classList.remove("hidden");
        weatherInfo.classList.add("hidden");
        return;
    }

    // Clear any previous error or weather info
    errorMessage.classList.add("hidden");

    // Fetch weather data from OpenWeatherMap API
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error("City not found");
            }
            return response.json();
        })
        .then(data => {
            // Successfully received data
            const {
                name,
                weather,
                main,
                wind,
                sys,
                dt
            } = data;

            cityName.textContent = name;
            weatherDescription.textContent = weather[0].description;
            temperature.textContent = `Temperature: ${main.temp}°C`;
            humidity.textContent = `Humidity: ${main.humidity}%`;

            // Additional weather details
            const windSpeed = wind.speed;
            const sunrise = new Date(sys.sunrise * 1000).toLocaleTimeString();
            const sunset = new Date(sys.sunset * 1000).toLocaleTimeString();
            const currentTime = new Date(dt * 1000).toLocaleTimeString();

            weatherDetails.innerHTML = `
        <p>Wind Speed: ${windSpeed} m/s</p>
        <p>Sunrise: ${sunrise}</p>
        <p>Sunset: ${sunset}</p>
        <p>Current Time: ${currentTime}</p>
    `;

            // Display weather info
            weatherInfo.classList.remove("hidden");
        })
        .catch(error => {
            // Handle any errors, e.g., city not found
            errorMessage.textContent = error.message;
            errorMessage.classList.remove("hidden");
            weatherInfo.classList.add("hidden");
        });
});
