import axios from "axios";

export async function getWeather(city: String) {
  try {
      city = encodeURIComponent(city.trim())
      return await axios.get(`https://weather.contrateumdev.com.br/api/weather/city/?city=${city}`)
        .then(response => response.data);
  } catch (error) {
      console.log('error: getWeather')
  }
}