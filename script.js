let button = document.getElementById("submit");
let form = document.querySelector("#cityform");
const selectElement = document.querySelector("#dayDuration");
let subContainer = document.querySelector(".subContainer");
let selectedDays = selectElement.value;

selectElement.addEventListener("change", (event) => {
	selectedDays = event.target.value;
});

button.addEventListener("click", async (e) => {
	e.preventDefault();
	let country = document.querySelector("#city");
	//console.log(country.value); //country.value = la valeur entrée dans l'input

	let geoloc = await getGeoloc(); //console.log(geoloc)
	let geoLat = geoloc.results[0].geometry.lat; //geoLat = récupère la latitude
	let geoLng = geoloc.results[0].geometry.lng; //geoLng = récupère la longitude

	let geoweather = await getGeoweather(); //console.log(geoweather);
	let weather = geoweather.list[0].weather[0].main; //console.log(weather);
	let clouds = geoweather.list[0].clouds.all; //console.log(clouds);

	let town = document.querySelector("#town");
	town.innerHTML = country.value;
	town.style.display = "block";

	let timezone = geoweather.city.timezone;
	let sunrise = geoweather.city.sunrise;
	let sunset = geoweather.city.sunset;

	const time = (timeNow, timeset, timesun) => {
		if (timeNow >= timeset || timeNow <= timesun) {
			console.log("nuit");
			document.body.style.background ="linear-gradient(127deg, rgba(251,126,63,1) 0%, rgba(251,63,108,1) 17%, rgba(152,58,148,1) 42%, rgba(44,33,198,1) 66%, rgba(6,24,82,1) 100%)"
		} else {
			console.log("jour");
			document.body.style.background = "linear-gradient(127deg, rgba(251,246,63,1) 0%, rgba(251,214,63,1) 25%, rgba(131,231,178,1) 50%, rgba(70,226,241,1) 70%, rgba(70,138,252,1) 100%)"
		}
	};

	let localTime = Math.floor((Date.now() + timezone * 1000) / 1000);

	let timing = new Date(localTime * 1000).getHours() - 2;
	let sunsetHour = new Date((sunset + timezone)* 1000).getHours() -2;
	let sunriseHour = new Date((sunrise + timezone)* 1000).getHours() -2;
	//console.log(timing, sunriseHour, sunsetHour);
	time(timing, sunsetHour, sunriseHour);

	subContainer.innerHTML = ""; //Supprimer les icônes précédentes
	let compteur = 0;
	for (let i = 0; i < geoweather.list.length; i++) {
		let weekWeather = geoweather.list[i].weather; // récupère la météo
		let conditions = weekWeather[0].main; // récupère les conditions météorologiques
		let day = geoweather.list[i].dt_txt;
		let dya = geoweather.list[i].dt; //console.log(dya);
		const timestamp = new Date(dya * 1000);
		const options = {
			weekday: "long",
		}; //console.log(timestamp);
		let dayWeek = timestamp.toLocaleDateString("fr-FR", options);

		let checkDay = day.split("09:00:00"); //affiche la date;
	
		if (day.split("09:00:00").length > 1) {
			if (compteur == selectedDays) break;
			let nameDay = geoweather.list[i].dt_txt;
			let checkDay = nameDay.split("09:00:00")[0];
			//console.log(checkDay);
			const numDay = new Date(checkDay);
			const num = numDay.getDay();
			//console.log(num); // Sunday - Saturday : 0 - 6
			
			let temp = geoweather.list[i].main.temp;
			// console.log(temp)
			let tempCelsius = Math.round(temp - 273.15);
			//console.log(tempCelsius)
			
			let weatherbox = document.createElement("div");
			let dDay = document.createElement("p");
			const weekIcon = document.createElement("img");
			let degree = document.createElement("p");

			weekIcon.src = await getIcon(conditions, geoweather.list[i].clouds.all);
			subContainer.appendChild(weatherbox);
			weatherbox.style.padding = "10px";
			weatherbox.appendChild(dDay);
			dDay.id = "date";
			dDay.innerHTML = dayWeek;
			dDay.style.display = "block";
			degree.id = "degree";
			degree.style.display = "block";
			degree.innerHTML = tempCelsius + "°C";
			weatherbox.appendChild(weekIcon);
			weatherbox.appendChild(degree)
			compteur += 1;
		}	
	}

	//form.reset();

	async function getIcon(weather, clouds) {
		if (weather === "Clear") {
			return "./weather_icons/sunny.svg";
		} else if (weather === "Snow") {
			return "./weather_icons/snow.svg";
		} else if (weather === "Clouds" && clouds < 50) {
			return "./weather_icons/clouds.svg";
		} else if (weather === "Clouds" && clouds >= 50) {
			return "./weather_icons/cloudy.svg";
		} else if (weather === "Rain") {
			return "./weather_icons/rain.svg";
		}
	}

	getIcon(weather, clouds);

	async function getGeoweather(city) {
		const apiKey = "47452b753496ef6f2690b8f80b2c97c5";
		const apiWeather = await fetch(
			`https://api.openweathermap.org/data/2.5/forecast?lat=${geoLat}&lon=${geoLng}&appid=${apiKey}`
		);
		return await apiWeather.json();
	}
});

async function getGeoloc() {
	let country = document.querySelector("#city");
	let geo = await fetch(
		`https://api.opencagedata.com/geocode/v1/json?q=${country.value}&key=e79de59f09d8491692b7aaadd28637cc&language=fr&pretty=1`
	);
	return await geo.json();
}
