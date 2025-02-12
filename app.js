const apiKey = '5ad3416bd1d37280151e838cf6b4f4f0';
let currentCity = document.getElementById('city-select').value;

// Načtení aktuálního počasí
function fetchCurrentWeather() {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${currentCity}&appid=${apiKey}&units=metric&lang=cz`;
  fetch(url)
    .then(response => response.json())
    .then(data => updateCurrentWeather(data))
    .catch(error => console.error('Chyba:', error));
}

function updateCurrentWeather(data) {
  document.getElementById('city-name').textContent = data.name;
  document.getElementById('temperature').textContent = `${data.main.temp} °C`;
  document.getElementById('description').textContent = data.weather[0].description;

  const iconCode = data.weather[0].icon;
  const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
  document.getElementById('weather-icon').innerHTML = `<img src="${iconUrl}" alt="Počasí">`;
}

// Načtení předpovědi
function fetchForecast() {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${currentCity}&appid=${apiKey}&units=metric&lang=cz`;
  fetch(url)
    .then(response => response.json())
    .then(data => updateForecast(data))
    .catch(error => console.error('Chyba:', error));
}

function updateForecast(data) {
  const forecastContainer = document.getElementById('forecast-container');
  const hourlyContainer = document.getElementById('hourly-container');
  forecastContainer.innerHTML = '';
  hourlyContainer.innerHTML = '';
  hourlyContainer.style.display = 'none';

  const dailyData = {};

  data.list.forEach(forecast => {
    const date = new Date(forecast.dt * 1000).toLocaleDateString('cs-CZ', { weekday: 'long', day: 'numeric', month: 'numeric' });

    if (!dailyData[date]) {
      dailyData[date] = {
        temp: forecast.main.temp,
        icon: forecast.weather[0].icon,
        hourly: []
      };
    }
    dailyData[date].hourly.push({
      time: new Date(forecast.dt * 1000).toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' }),
      temp: forecast.main.temp,
      icon: forecast.weather[0].icon
    });
  });

  Object.keys(dailyData).slice(0, 5).forEach(date => {
    const day = dailyData[date];
    const forecastDay = document.createElement('div');
    forecastDay.classList.add('forecast-day');
    forecastDay.innerHTML = `
      <h3>${date}</h3>
      <img src="http://openweathermap.org/img/wn/${day.icon}@2x.png" alt="Počasí">
      <p>${day.temp} °C</p>
    `;

    forecastDay.addEventListener('click', function() {
      // Show only one at a time
      hourlyContainer.innerHTML = '';
      hourlyContainer.style.display = 'flex';
      hourlyContainer.innerHTML = day.hourly.map(h => `
        <div class="hourly-item">
          <span>${h.time}</span>
          <img src="http://openweathermap.org/img/wn/${h.icon}@2x.png" alt="Ikona">
          <span>${h.temp} °C</span>
        </div>
      `).join('');
    });

    forecastContainer.appendChild(forecastDay);
  });
}

// Změna města
document.getElementById('city-select').addEventListener('change', function() {
  currentCity = this.value;
  updateDashboard();
});

function updateDashboard() {
  fetchCurrentWeather();
  fetchForecast();
}
updateDashboard();
