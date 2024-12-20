let country = document.querySelector("#country");
let city = document.querySelector("#city");
let check = document.querySelector("#check");
let tempIcon = document.querySelector("#tempIcon");
let weatherCountry = document.querySelector("#weatherCountry");
let temperature = document.querySelector("#temperature");
let weatherDescription = document.querySelector("#weatherDescription");
let feelsLike = document.querySelector("#feelsLike");
let humidity = document.querySelector("#humidity");
let longitude = document.querySelector("#longitude");
let latitude = document.querySelector("#latitude");
let forecastInfo = document.querySelector("#forecast-info");

check.addEventListener("click", () => {
  let key = `bd4ea33ecf905116d12af172e008dbae`;
  let weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city.value},${country.value}&lang=en&units=metric&appid=${key}`;
  let forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city.value},${country.value}&lang=en&units=metric&appid=${key}`;

  fetch(weatherUrl)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      weatherCountry.innerText = `${data.name} / ${data.sys.country}`;
      temperature.innerHTML = `${data.main.temp}°<b>C</b>`;

      // Menampilkan gambar latar belakang
      document.body.style.backgroundImage =
        "url('https://source.unsplash.com/1600x900/?" + "')";

      data.weather.forEach((item) => {
        weatherDescription.innerText = item.description;
        tempIcon.src = getWeatherIcon(item.id);
        tempIcon.style.display = "block"; // Menampilkan ikon cuaca setelah input
      });

      feelsLike.innerText = `Feels Like ${data.main.feels_like}°C`;
      humidity.innerText = `Humidity ${data.main.humidity}`;
      latitude.innerText = `Latitude ${data.coord.lat}`;
      longitude.innerText = `Longitude ${data.coord.lon}`;

      // Menambahkan kelas "visible" untuk menampilkan baris data
      document.querySelectorAll(".weather-info div").forEach((div) => {
        div.classList.add("visible");
      });

      // Menampilkan waktu real-time WIB
      const updateTime = () => {
        const localTime = new Date(); // Waktu sekarang
        const options = {
          timeZone: "Asia/Jakarta", // Zona waktu WIB
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        };
        const timeString = localTime.toLocaleTimeString("en-GB", options); // Format waktu WIB
        const timeElement = document.getElementById("local-time");

        if (timeElement) {
          timeElement.innerText = `Local Time (WIB): ${timeString}`; // Menampilkan waktu WIB
        }
      };

      // Memperbarui waktu setiap detik
      setInterval(updateTime, 1000);

      // Pastikan waktu ditampilkan segera setelah halaman dimuat
      updateTime();
    });

  fetch(forecastUrl)
    .then((response) => response.json())
    .then((data) => {
      forecastInfo.innerHTML = "";

      // Mendapatkan waktu lokal WIB saat ini
      const currentTime = new Date();
      const currentHour = currentTime.getHours();
      const currentMinute = currentTime.getMinutes();

      // Waktu saat ini dalam detik
      const currentTimeInSeconds = currentTime.getTime() / 1000;

      // Menentukan ramalan untuk 3 jam ke depan dimulai dari waktu lokal WIB
      let displayedForecasts = 0;

      data.list.forEach((item) => {
        const forecastTime = new Date(item.dt * 1000); // Mengonversi UTC ke lokal
        const forecastHour = forecastTime.getHours();
        const forecastMinute = forecastTime.getMinutes();

        // Menampilkan ramalan 3 jam ke depan dari waktu lokal WIB
        if (forecastTime >= currentTime && displayedForecasts < 3) {
          forecastInfo.innerHTML += `
          <div class="forecast-item">
            <div class="forecast-time">${forecastTime.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}</div>
            <div class="forecast-icon">
              <img src="${getWeatherIcon(
                item.weather[0].id
              )}" alt="Forecast Icon">
              ${item.main.temp}°C
            </div>
            <div class="forecast-description">${
              item.weather[0].description
            }</div>
          </div>
        `;
          displayedForecasts++;
        }
      });
    });

  country.value = "";
  city.value = "";
});

function getWeatherIcon(id) {
  if (id < 250) {
    return `tempicons/storm.svg`;
  } else if (id < 350) {
    return `tempicons/drizzle.svg`;
  } else if (id < 550) {
    return `tempicons/rain.svg`;
  } else if (id < 650) {
    return `tempicons/snow.svg`;
  } else if (id < 800) {
    return `tempicons/atmosphere.svg`;
  } else if (id === 800) {
    return `tempicons/sun.svg`;
  } else if (id > 800) {
    return `tempicons/clouds.svg`;
  }
}
