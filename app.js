// Your OpenWeather API key (for demo purposes only)
// For production, never expose your API key client-side.
const apiKey = '5ad3416bd1d37280151e838cf6b4f4f0';
const city = 'London'; // Default city; update or add user input as needed

// Fetch current weather data
function fetchCurrentWeather() {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Current weather data not available');
      }
      return response.json();
    })
    .then(data => updateCurrentWeather(data))
    .catch(error => {
      console.error('Error fetching current weather:', error);
      document.getElementById('current-weather').innerHTML = '<p>Unable to retrieve current weather data.</p>';
    });
}

// Update the current weather section
function updateCurrentWeather(data) {
  document.getElementById('city-name').textContent = data.name;
  document.getElementById('temperature').textContent = `${data.main.temp} °C`;
  document.getElementById('description').textContent = data.weather[0].description;
  
  // Display weather icon
  const iconCode = data.weather[0].icon;
  const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
  document.getElementById('weather-icon').innerHTML = `<img src="${iconUrl}" alt="Weather icon">`;
}

// Fetch forecast data
function fetchForecast() {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Forecast data not available');
      }
      return response.json();
    })
    .then(data => updateForecastChart(data))
    .catch(error => {
      console.error('Error fetching forecast:', error);
      document.getElementById('forecast').innerHTML = '<p>Unable to retrieve forecast data.</p>';
    });
}

// Update the forecast chart using Chart.js
function updateForecastChart(data) {
  // Prepare arrays for labels (time) and temperatures
  const labels = [];
  const temps = [];
  
  // For a cleaner chart, you might choose a subset of data points.
  // Here, we use all forecast points (every 3 hours) from the API.
  data.list.forEach(forecast => {
    const date = new Date(forecast.dt * 1000);
    // Format the date/time label (e.g., "Mar 15, 3 PM")
    labels.push(date.toLocaleString('en-US', {
      month: 'short', day: 'numeric', hour: 'numeric'
    }));
    temps.push(forecast.main.temp);
  });

  // Create the line chart
  const ctx = document.getElementById('forecastChart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Temperature (°C)',
        data: temps,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
        pointRadius: 3,
        fill: true,
        tension: 0.4 // smooth curves
      }]
    },
    options: {
      responsive: true,
      scales: {
        x: {
          ticks: {
            maxRotation: 90,
            minRotation: 45,
            autoSkip: true,
            maxTicksLimit: 10
          }
        },
        y: {
          beginAtZero: false
        }
      },
      animation: {
        duration: 2000,
        easing: 'easeOutBounce'
      }
    }
  });
}

// Initialize the dashboard
fetchCurrentWeather();
fetchForecast();
