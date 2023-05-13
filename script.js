let button = document.getElementById("submit");
//console.log(button);
let form = document.querySelector("#cityform");

button.addEventListener("click", async (e) => {
	e.preventDefault();
	let country = document.querySelector("#city");
	console.log(country.value);
	//country.value = la valeur entrée dans l'input

	let geoloc = await getGeoloc();
	//console.log(geoloc)
	let geoLat = geoloc.results[0].geometry.lat;
	let geoLng = geoloc.results[0].geometry.lng;
	console.log(geoLat);
	//geoLat = récupère la latitude
	//geoLng = récupère la longitude
	console.log(geoLng);

	let geoweather = await getGeoweather();
	//console.log(geoweather);
	let weather = geoweather.list[0].weather[0].main;
	console.log(weather);
	let clouds = geoweather.list[0].clouds.all;
	console.log(clouds);

	let town = document.querySelector("#town");
	town.innerHTML = country.value;
	town.style.display = "block";

	for (let i = 0; i < geoweather.list.length && i < geoweather.list.length; i++) {
		let weekWeather = geoweather.list[i].weather;
		//console.log(weekWeather);
		// récupère la météo
		let conditions = weekWeather[0].main;
		//console.log(conditions);
		// récupère les conditions météorologiques
		let day = geoweather.list[i].dt_txt;

		let dya = geoweather.list[i].dt;
		//console.log(dya);
		const timestamp = new Date(dya * 1000);
		const options = {
			weekday: 'long'
		};
		//console.log(timestamp);
		let dayWeek = timestamp.toLocaleDateString('fr-FR', options);

		let checkDay = day.split("09:00:00");
		//console.log(checkDay)
		//affiche la date;


		if (day.split("09:00:00").length > 1) {
			//console.log(geoweather.list[i])
			//console.log(day)
			//console.log(day);
			// let checkDay = day.split("09:00:00");
			// console.log(checkDay)
			// //affiche la date;
			let nameDay = geoweather.list[i].dt_txt;
			let checkDay = (nameDay.split("09:00:00"))[0];
			//console.log(checkDay);


			const numDay = new Date(checkDay);
			const num = numDay.getDay();
			// Sunday - Saturday : 0 - 6
			console.log(num);


			// const dayWeek = new Date(Date.UTC(checkDay));
			// const options = { weekday: 'long' };
			// console.log(dayWeek);

			let subContainer = document.querySelector(".subContainer");
			let weatherbox = document.createElement('div');
			let dDay = document.createElement('p');
			const weekIcon = document.createElement("img");

			weekIcon.src = await getIcon(conditions, geoweather.list[i].clouds.all);
			subContainer.appendChild(weatherbox);
			weatherbox.appendChild(dDay);
			dDay.id = "date";
			dDay.innerHTML = dayWeek;
			dDay.style.display = "block";
			weatherbox.appendChild(weekIcon);
		}



	}

	const selectElement = document.querySelector("#dayDuration");
	const optionSelect = document.querySelectorAll("option");
	selectElement.addEventListener("change", (event) => {
		console.log(optionSelect);
	});


	form.reset();

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
