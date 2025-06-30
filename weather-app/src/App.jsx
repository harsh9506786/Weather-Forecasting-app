import React, { useState } from "react";
import "./App.css";
import clear from "./assets/Clear.png";
import rainy from "./assets/rainy.png";
import cloudy from "./assets/cloudy.png";
import Forecast from "./components/Forecast";
import ErrorDisplay from "./components/ErrorDisplay";

export default function WeatherApp() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState("");

  const apiKey = "e6023752812dc172c81aeabb690412e6";

  const fetchWeather = async () => {
    if (!city) {
      setError("Please enter a city name.");
      setWeather(null);
      setForecast([]);
      return;
    }

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city.trim()}&appid=${apiKey}&units=metric`
      );
      if (!response.ok) throw new Error("City not found");
      const data = await response.json();

      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city.trim()}&appid=${apiKey}&units=metric`
      );
      if (!forecastRes.ok) throw new Error("Forecast not found");
      const forecastData = await forecastRes.json();

      const daily = forecastData.list.filter((f) =>
        f.dt_txt.includes("12:00:00")
      );

      setWeather(data);
      setForecast(daily);
      setError("");
    } catch (err) {
      setError(err.message);
      setWeather(null);
      setForecast([]);
    }
  };

  const getWeatherImage = (description) => {
    const desc = description.toLowerCase();
    if (desc.includes("cloud")) return { img: cloudy, text: "Cloudy" };
    if (desc.includes("rain")) return { img: rainy, text: "Rainy" };
    if (desc.includes("clear")) return { img: clear, text: "Clear" };
    return { img: clear, text: description };
  };

  return (
    <div className="container">
      <h1 className="title">Weather Forecasting Application</h1>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="input"
        />
        <button onClick={fetchWeather} className="button">
          Search
        </button>
      </div>

      {error && <ErrorDisplay message={error} />}

      {weather && (
        <div className="result">
          <h2>
            {weather.name}, {weather.sys.country}
          </h2>
          <p>Temperature: {Math.round(weather.main.temp)}°C</p>
          <div>
            {(() => {
              const { img, text } = getWeatherImage(
                weather.weather[0].description
              );
              return (
                <div>
                  <img src={img} alt={text} className="weather-image" />
                  <p>The weather is {text}</p>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      <Forecast forecast={forecast} />
    </div>
  );
}
