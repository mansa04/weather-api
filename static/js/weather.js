const searchButton = document.getElementById("sbtn");
const locationButton = document.getElementById("locbtn");
const cityInput = document.getElementById("city");
const weatherApp = document.getElementById("weather-app");

const apiKey = '2f5531105953fd80c02b75b18dbcce32';
const apiUrl = 'https://api.openweathermap.org/data/2.5/';

async function fetchWeatherData(cityOrLatLon) {
    try {
        const response = await fetch(`${apiUrl}weather?q=${cityOrLatLon}&appid=${apiKey}&units=metric`);
        if (!response.ok) {
            // Attempt to fetch using latitude and longitude
            const latLon = cityOrLatLon.split(',');
            if (latLon.length === 2) {
                const lat = latLon[0].trim();
                const lon = latLon[1].trim();
                const response = await fetch(`${apiUrl}weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
                const data = await response.json();
                updateCurrentWeather(data);
                fetchHourlyForecast(data.coord.lat, data.coord.lon);
                fetchAirQualityData(data.coord.lat, data.coord.lon);
                updateBackground(data.weather[0].main);
            } else {
                throw new Error('City not found');
            }
        } else {
            const data = await response.json();
            updateCurrentWeather(data);
            fetchHourlyForecast(data.coord.lat, data.coord.lon);
            fetchAirQualityData(data.coord.lat, data.coord.lon);
            updateBackground(data.weather[0].main);
        }
    } catch (error) {
        console.error("Error fetching weather data:", error);
        alert("Could not retrieve weather data. Please try again.");
    }
}

async function fetchHourlyForecast(lat, lon) {
    try {
        const response = await fetch(`${apiUrl}forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
        const data = await response.json();
        updateHourlyForecast(data);
    } catch (error) {
        console.error("Error fetching hourly forecast:", error);
    }
}

function updateCurrentWeather(data) {
    document.getElementById("current-temp").textContent = `${Math.round(data.main.temp)} °C`;
    document.getElementById("current-condition").textContent = data.weather[0].description;
    document.getElementById("current-location").textContent = `${data.name}, ${data.sys.country}`;
    document.getElementById("weather-icon").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

    const now = new Date();
    document.getElementById("current-date").textContent = moment(now).format('MMMM Do YYYY, h:mm:ss a');
}

function updateHourlyForecast(data) {
    const hourlyForecast = document.getElementById("hourly-forecast");
    hourlyForecast.innerHTML = ""; // Clear previous forecast data

    data.list.slice(0, 8).forEach(hourData => {
        const hourDiv = document.createElement("div");
        hourDiv.classList.add("hour-item");
        hourDiv.innerHTML = `
            <p>${moment(hourData.dt_txt).format('h A')}</p>
            <p>${Math.round(hourData.main.temp)} °C</p>
            <img src="https://openweathermap.org/img/wn/${hourData.weather[0].icon}.png" alt="hourly weather icon">
        `;
        hourlyForecast.appendChild(hourDiv);
    });
}

function updateBackground(condition) {
    let backgroundUrl = "";
    switch (condition.toLowerCase()) {
        case "clear":
            backgroundUrl = "url('/static/images/sunny.gif')";
            break;
        case "clouds":
            backgroundUrl = "url('/static/images/cloudy.gif')";
            break;
        case "rain":
            backgroundUrl = "url('/static/images/rainy.gif')";
            break;
        case "thunderstorm":
            backgroundUrl = "url('/static/images/thunderstorm.gif')";
            break;
        case "snow":
            backgroundUrl = "url('/static/images/snowy.gif')";
            break;
        default:
            backgroundUrl = "url('/static/images/default.gif')";
            break;
    }
    weatherApp.style.backgroundImage = backgroundUrl;
}

searchButton.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city) {
        fetchWeatherData(city);
    }
});

locationButton.addEventListener("click", () => {
    navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        fetchWeatherData(`${lat},${lon}`);
    });
});

function fetchAirQualityData(lat, lon) {
    fetch(`${apiUrl}air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => updateAirQualityData(data.list[0]))
        .catch(error => console.error('Error fetching air quality:', error));
}

function updateAirQualityData(data) {
    document.getElementById('pm25').textContent = `${data.components.pm2_5} µg/m³`;
    document.getElementById('pm10').textContent = `${data.components.pm10} µg/m³`;
    document.getElementById('so2').textContent = `${data.components.so2} µg/m³`;
    document.getElementById('co').textContent = `${data.components.co} µg/m³`;

    const aqi = data.main.aqi;
    const aqiText = ["Good", "Fair", "Moderate", "Poor", "Very Poor"];
    document.getElementById('air-quality-index').textContent = aqiText[aqi - 1];
}
