const apiKey = '5ad3416bd1d37280151e838cf6b4f4f0';
let currentCity = document.getElementById('city-select').value;
const charts = {}; // To store Chart.js instances

// Helper: Create (or update) a chart
function buildChart(canvasId, label, dataArr, bgColor, borderColor, beginAtZero, labels) {
  if (charts[canvasId]) charts[canvasId].destroy();
  const ctx = document.getElementById(canvasId).getContext('2d');
  charts[canvasId] = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label, data: dataArr,
        backgroundColor: bgColor, borderColor: borderColor,
        borderWidth: 2, fill: true, tension: 0.4
      }]
    },
    options: {
      responsive: true,
      scales: { x: { ticks: { autoSkip: true, maxTicksLimit: 10 } },
                y: { beginAtZero } },
      animation: { duration: 1500, easing: 'easeOutQuad' }
    }
  });
}

// Fetch current weather and update DOM
function fetchCurrentWeather() {
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${currentCity}&appid=${apiKey}&units=metric`)
    .then(res => res.json())
    .then(data => {
      document.getElementById('city-name').textContent = data.name;
      document.getElementById('temperature').textContent = `${data.main.temp} °C`;
      document.getElementById('description').textContent = data.weather[0].description;
      document.getElementById('weather-icon').innerHTML = `<img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="icon">`;
    })
    .catch(err => console.error(err));
}

// Fetch forecast and update charts
function fetchForecast() {
  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${currentCity}&appid=${apiKey}&units=metric`)
    .then(res => res.json())
    .then(data => {
      const labels = [], temps = [], humidities = [], winds = [], pressures = [];
      data.list.forEach(item => {
        const date = new Date(item.dt * 1000);
        labels.push(date.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric' }));
        temps.push(item.main.temp);
        humidities.push(item.main.humidity);
        winds.push(item.wind.speed);
        pressures.push(item.main.pressure);
      });
      buildChart('tempChart', 'Temperature (°C)', temps, 'rgba(54,162,235,0.2)', 'rgba(54,162,235,1)', false, labels);
      buildChart('humidityChart', 'Humidity (%)', humidities, 'rgba(75,192,192,0.2)', 'rgba(75,192,192,1)', true, labels);
      buildChart('windChart', 'Wind Speed (m/s)', winds, 'rgba(255,159,64,0.2)', 'rgba(255,159,64,1)', true, labels);
      buildChart('pressureChart', 'Pressure (hPa)', pressures, 'rgba(153,102,255,0.2)', 'rgba(153,102,255,1)', false, labels);
    })
    .catch(err => console.error(err));
}

// Update dashboard
function updateDashboard() {
  fetchCurrentWeather();
  fetchForecast();
}

// Listen for city changes
document.getElementById('city-select').addEventListener('change', function() {
  currentCity = this.value;
  updateDashboard();
});

// Initial load
updateDashboard();
