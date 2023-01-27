import { useState, useEffect } from 'react';
import axios from 'axios';

const TIMEOUT = import.meta.env.VITE_AXIOS_TIMEOUT;
const WEATHER_SERVER = import.meta.env.VITE_JAWA_SERVER;
const URL = `https://${WEATHER_SERVER}/weather`;
console.log('URL:', URL);

export default function useGetWeather(options) {
  console.log('useGetWeatherHook called!');
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [weatherData, setWeatherData] = useState([]);
  const { places, units, lang } = options;

  useEffect(() => {
    console.log('useGetWeatherHook useEffect called!');
    let ignore = false;

    const fetchWeather = async () => {
      setIsLoading(true);
      const results = await getPlacesWeather(places);
      setWeatherData(results);
      setIsLoading(false);
    };

    if (!ignore) fetchWeather();

    // prevent setting component state when component is unmounted
    // (i.e., user navigates away from page before fetch completes)
    return () => {
      ignore = true;
    };

    // only need to run useEffect when places changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [places]);

  /**
   * The Jawa weather server uses the OpenWeather API
   * @param {string} lat: latitude, required by OpenWeather
   * @param {string} long: longitude, required by OpenWeather
   * @param {string} units: (imperial | metric ), required by OpenWeather
   * @param {string} lang: (en | fr | sv ), OpenWeather option
   * @param {string} id:
   *   - client defined
   *   - used for adding/deleting places from localStorage
   *   - pass to server so server can include in the response object
   * @param {string} location:
   *   - client defined
   *   - pass to server so server can include in the response object
   */

  async function getPlacesWeather() {
    const promises = [];

    places.forEach((place) => {
      const params = {
        lat: place.lat,
        long: place.long,
        units,
        lang,
        id: place.id,
        location: place.location,
      };
      const promise = getWeather(params);
      promises.push(promise);
    });

    const results = await Promise.all(promises);
    return results;
  }

  async function getWeather(params) {
    setIsError(false);

    try {
      const response = await axios.get(URL, {
        params,
        timeout: TIMEOUT,
      });
      return response.data;
    } catch (error) {
      setIsError(true);
      console.log('ERROR:', error);
    }
  }

  return [weatherData, isLoading, isError];
}
