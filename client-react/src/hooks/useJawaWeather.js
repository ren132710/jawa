import { useState, useEffect } from 'react';
import axios from 'axios';
import { PLACES_STORAGE_KEY, DEFAULT_PLACES } from '@/constants/constants';

const TIMEOUT = import.meta.env.VITE_AXIOS_TIMEOUT;
const WEATHER_SERVER = import.meta.env.VITE_JAWA_SERVER;
const URL = `https://${WEATHER_SERVER}/weather`;

// if localStorage, otherwise use default places
const getPlaces = () => {
  const places = localStorage.getItem(PLACES_STORAGE_KEY);
  return places ? JSON.parse(places) : DEFAULT_PLACES;
};

export default function useJawaWeather(options) {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [places, setPlaces] = useState(getPlaces());
  const [weatherData, setWeatherData] = useState([]);
  const { units, lang } = options;

  console.log('useJawaHook called!');

  useEffect(() => {
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

  // keep localStorage in sync with state
  useEffect(() => {
    localStorage.setItem(PLACES_STORAGE_KEY, JSON.stringify(places));
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
   * TODO: Add to server
   * @param {boolean} favorite:
   *   - client defined
   *   - used for filtering places before saving to localStorage
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
        favorite: place.favorite,
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

  return [{ weatherData, isLoading, isError }, setPlaces];
}
