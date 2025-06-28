document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("submit");
  const cityInput = document.querySelector("#city");
  const selectElement = document.querySelector("#dayDuration");
  const subContainer = document.querySelector(".subContainer");
  const town = document.querySelector("#town");
  const errorMessage = document.getElementById("errorMessage"); // Zone d'affichage erreur

  let selectedDays = selectElement.value;

  selectElement.addEventListener("change", (event) => {
    selectedDays = event.target.value;
  });

  button.addEventListener("click", async (e) => {
    e.preventDefault();

    // Réinitialiser le message d'erreur à chaque clic
    errorMessage.textContent = "";

    if (!cityInput.value.trim()) {
      errorMessage.textContent = "Veuillez saisir une ville.";
      return;
    }

    try {
      const geoweather = await getGeoweather(cityInput.value.trim());

      if (!geoweather || geoweather.cod !== "200" || !geoweather.list) {
        errorMessage.textContent =
          "Ville introuvable ou aucune donnée météo disponible.";
        return;
      }

      town.innerHTML = cityInput.value.trim();
      town.style.display = "block";

      const timezone = geoweather.city.timezone;
      const sunrise = geoweather.city.sunrise;
      const sunset = geoweather.city.sunset;

      const localTime = Math.floor(Date.now() / 1000) + timezone;
      const timing = new Date(localTime * 1000).getHours();
      const sunriseHour = new Date((sunrise + timezone) * 1000).getHours();
      const sunsetHour = new Date((sunset + timezone) * 1000).getHours();

      if (timing >= sunsetHour || timing <= sunriseHour) {
        document.body.style.background =
          "linear-gradient(127deg, rgba(251,126,63,1) 0%, rgba(251,63,108,1) 17%, rgba(152,58,148,1) 42%, rgba(44,33,198,1) 66%, rgba(6,24,82,1) 100%)";
      } else {
        document.body.style.background =
          "linear-gradient(127deg, rgba(251,246,63,1) 0%, rgba(251,214,63,1) 25%, rgba(131,231,178,1) 50%, rgba(70,226,241,1) 70%, rgba(70,138,252,1) 100%)";
      }

      subContainer.innerHTML = "";

      let compteur = 0;
      for (let i = 0; i < geoweather.list.length; i++) {
        const dataPoint = geoweather.list[i];
        const date = new Date(dataPoint.dt_txt);
        const hour = date.getHours();

        if (hour === 9) {
          if (compteur == selectedDays) break;

          const options = { weekday: "long" };
          const dayName = date.toLocaleDateString("fr-FR", options);

          const tempCelsius = Math.round(dataPoint.main.temp - 273.15);
          const icon = getIcon(dataPoint.weather[0].main, dataPoint.clouds.all);

          const weatherbox = document.createElement("div");
          const dDay = document.createElement("p");
          const weekIcon = document.createElement("img");
          const degree = document.createElement("p");

          dDay.id = "date";
          dDay.innerHTML = dayName;
          dDay.style.display = "block";

          degree.id = "degree";
          degree.style.display = "block";
          degree.innerHTML = tempCelsius + "°C";

          weekIcon.src = icon;
          weekIcon.alt = dataPoint.weather[0].main;

          weatherbox.style.padding = "10px";
          weatherbox.style.textAlign = "center";
          weatherbox.appendChild(dDay);
          weatherbox.appendChild(weekIcon);
          weatherbox.appendChild(degree);

          subContainer.appendChild(weatherbox);

          compteur++;
        }
      }
    } catch (error) {
      // Erreur réseau ou autre erreur inattendue
      errorMessage.textContent =
        "Erreur lors de la récupération des données météo. Veuillez réessayer plus tard.";
      console.error(error);
    }
  });

  function getIcon(weather, clouds) {
    if (weather === "Clear") return "./weather_icons/sunny.svg";
    if (weather === "Snow") return "./weather_icons/snow.svg";
    if (weather === "Clouds" && clouds < 50)
      return "./weather_icons/clouds.svg";
    if (weather === "Clouds" && clouds >= 50)
      return "./weather_icons/cloudy.svg";
    if (weather === "Rain") return "./weather_icons/rain.svg";
    return "./weather_icons/clouds.svg";
  }

  async function getGeoweather(city) {
    const apiKey = "47452b753496ef6f2690b8f80b2c97c5"; // Ma clé API OpenWeatherMap
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
      city
    )}&appid=${apiKey}`;
    const res = await fetch(url);
    return await res.json();
  }
});
