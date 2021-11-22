"use strict";

const container = document.querySelector(".weather-container");
const city_txt = document.querySelector(".city");
const descritption = document.querySelector(".weather-description");
const clouds_symbol = document.querySelector(".clouds");
const sun_symbol = document.querySelector(".sun");
const coords_txt = document.querySelector(".coords");
const date_txt = document.querySelector(".date");
const time_txt = document.querySelector(".time");
const celsius = document.querySelector(".celsius");
const city_search = document.querySelector(".search-city");
const btn_search = document.querySelector(".search-btn");
const err_message = document.querySelector(".error-message");

// Get date
function getData() {
  const date = new Date();
  const dateTime = date.toLocaleDateString("it-IT", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  date_txt.textContent = dateTime;
}

// Get time
function getTime() {
  setInterval(() => {
    let d = new Date();
    let m = d.getMinutes();
    let h = d.getHours();
    let time = ("0" + h).substr(-2) + ":" + ("0" + m).substr(-2);
    time_txt.textContent = time;
  }, 1000);
}

// Start application
async function showWeather(e) {
  e.preventDefault();
  const country = city_search.value;
  const weatherAPI = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${country}&appid=9f4e307539e7aed3226a8d067e9e2022`
  );
  const weather = weatherAPI.json();
  weather.then(function (data) {
    try {
      if (!city_search.value == "") {
        if (weatherAPI.ok) {
          getTime();
          getData();
          const city = data.name;
          const country = data.sys.country;
          const weather_des = data.weather[0].description;
          const { lat: lt, lon: lng } = data.coord;
          const cels = data.main.temp;

          console.log(country);
          container.classList.remove("hidden");
          err_message.classList.add("hidden");
          city_search.classList.remove("invalid-input");
          city_search.value = "";

          // Set text
          city_txt.textContent = `${city} (${country})`;
          descritption.textContent = weather_des;
          coords_txt.textContent = "coords " + lt + " " + lng;
          celsius.textContent = Math.round(cels - 273) + "°";

          if (weather_des == "clear sky") {
            sun_symbol.classList.remove("hidden");
            clouds_symbol.classList.add("hidden");
          }

          if (
            weather_des == "overcast clouds" ||
            weather_des == "scattered clouds" ||
            weather_des == "mist" ||
            weather_des == "few clouds" ||
            weather_des == "broken clouds"
          ) {
            clouds_symbol.classList.remove("hidden");
            sun_symbol.classList.add("hidden");
          }
        } else {
          city_search.value = "";
          err_message.classList.remove("hidden");
          container.classList.add("hidden");
          err_message.textContent = errorMessage();
          throw new Error(errorMessage());
        }
      } else {
        city_search.classList.add("invalid-input");
      }
    } catch (err) {
      console.error(err);
    }
  });
}

// Error message
function errorMessage() {
  return "😔 Ops, City doesn't exist! try with another";
}

btn_search.addEventListener("click", showWeather);
