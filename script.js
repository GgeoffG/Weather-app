const previousSearchList = document.getElementById("previousSearch");
console.log(previousSearchList);
var todayForcast = document.getElementById("todayForcast");
console.log(todayForcast);
var fiveDay = document.getElementsByClassName("fiveDay");
var dayIds = [];
for (i = 0; i < fiveDay.length; ++i) {
  dayIds.push(fiveDay[i].id);
}
const inputBtn = document.getElementById("input-button");
const key = "d8d66952229750cd88a614838cc1d8a0";
const searchInput = document.getElementById("search-input");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const temp = document.getElementById("temp");
const todayHeader = document.getElementById("today-header");
const saveBtn = document.getElementById("save-btn");
const currentWeather = document.getElementById("current-weather");
const getStartedMsg = document.getElementById("get-started");
const clearBtn = document.getElementById("clear-btn");
console.log(dayIds);

const saveSearch = () => {
  const searchTitle = todayHeader.innerHTML;
  const [city, state] = searchTitle.split(",");
  const previousSearches =
    JSON.parse(localStorage.getItem("previousSearches")) || [];
  const searchExists = previousSearches.some((search) => {
    return (
      search.city.toLowerCase() === city.toLowerCase() &&
      search.state &&
      search.state.toLowerCase() === state.toLowerCase()
    );
  });
  if (searchTitle === "") {
    alert("Please enter a city to save");
    return;
  }
  if (searchExists) {
    alert("This city is already saved");
    return;
  }
  previousSearches.push({ city, state });
  localStorage.setItem("previousSearches", JSON.stringify(previousSearches));
  renderPreviousSearches();
};

const renderPreviousSearches = () => {
  previousSearchList.innerHTML = "";
  const previousSearches =
    JSON.parse(localStorage.getItem("previousSearches")) || [];
  previousSearches.forEach((search) => {
    const previousSearchButton = document.createElement("button");
    previousSearchButton.classList.add(`btn`);
    previousSearchButton.classList.add(`btn-info`);
    previousSearchButton.classList.add(`previous`);
    previousSearchButton.classList.add(`border-dark`);

    if (search.state && search.city) {
      previousSearchButton.innerText = `${search.city}, ${search.state}`;
      previousSearchButton.addEventListener("click", () => {
        searchInput.value = `${search.city}, ${search.state}`;
        getWeather();
      });
    } else {
      previousSearchButton.innerText = `${search.city}`;
      previousSearchButton.addEventListener("click", () => {
        searchInput.value = `${search.city}`;
        getWeather();
      });
    }

    previousSearchList.appendChild(previousSearchButton);
  });
};

const clearHistory = () => {
  localStorage.clear();
  previousSearchList.innerHTML = "";
};

const getWeather = () => {
  const input = searchInput.value;
  const [city, state] = input.split(",");
  if (!input) {
    alert("Enter a city to search");
    return;
  }
  const requestURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city},US-${state}&appid=${key}&units=imperial`;
  fetch(requestURL)
    .then(function (response) {
      if (response.ok) {
        return response.json();
      } else if (response !== 200) {
        alert("No weather information found");
      }
    })
    .then(function (data) {
      const latitude = data.city.coord.lat;
      const longitude = data.city.coord.lon;
      const getCurrentWeather = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}&units=imperial`;
      const getForcast = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${key}&units=imperial`;
      fetch(getCurrentWeather)
        .then(function (response) {
          return response.json();
        })
        .then(function update(data) {
          todayHeader.innerHTML = `${input}`;
          temp.innerHTML = `Temperature: ${data.main.feels_like}&deg;F`;
          wind.innerHTML = `Wind: ${data.wind.speed} MPH`;
          humidity.innerHTML = `Humidity: ${data.main.humidity}%`;
          currentWeather.classList.remove("hidden");
          saveBtn.classList.remove("hidden");
          getStartedMsg.classList.add("hidden");
        });
      fetch(getForcast)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          for (let i = 0; i < dayIds.length; i++) {
            const dayId = dayIds[i];
            const card = document.getElementById(dayId);
            const forecastData = data.list[i];
            const date = new Date(forecastData.dt_txt).toLocaleDateString();
            const temperature = forecastData.main.temp;
            const description = forecastData.weather[0].description;
            const icon = forecastData.weather[0].icon;
            const windSpeed = forecastData.wind.speed;
            const humidity = forecastData.main.humidity;

            const temperatureListItem = document.createElement("li");
            temperatureListItem.innerHTML = `Temperature: ${temperature}&deg;F`;

            const windSpeedListItem = document.createElement("li");
            windSpeedListItem.innerHTML = `WindSpeed: ${windSpeed} MPH`;

            const humidityListItem = document.createElement("li");
            humidityListItem.innerHTML = `humidity: ${humidity}%`;

            const descriptionListItem = document.createElement("li");
            descriptionListItem.innerHTML = `Description: ${description}`;

            const iconUrl = `http://openweathermap.org/img/w/${icon}.png`;
            const iconImg = document.createElement("img");
            iconImg.src = iconUrl;

            card.querySelector("h3").innerHTML = date;
            const cardBody = card.querySelector(".card-body");
            while (cardBody.firstChild) {
              cardBody.removeChild(cardBody.firstChild);
            }
            cardBody.appendChild(temperatureListItem);
            cardBody.appendChild(windSpeedListItem);
            cardBody.appendChild(humidityListItem);
            cardBody.appendChild(descriptionListItem);
            cardBody.appendChild(iconImg);

            card.classList.remove("hidden");
          }
        });
    });
};
renderPreviousSearches();
inputBtn.addEventListener("click", getWeather);
saveBtn.addEventListener("click", saveSearch);
clearBtn.addEventListener("click", clearHistory);
