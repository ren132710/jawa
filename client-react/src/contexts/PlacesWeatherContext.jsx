import React, { useState, useContext, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import useGetWeather from '@/hooks/useGetWeather';
import { usePrefsData } from '@/contexts/PrefsContext';
import { PLACES_STORAGE_KEY, DEFAULT_PLACES } from '@/constants/constants';

// TODOs
// rename to PlacesWeatherContext
// rename contexts and provider appropriately
// eliminate useGetWeather hook
// incorporate getWeather.js
// support promise.all for multiple places fetch
// add isError, isLoading to context - update consumers of isError, isLoading (PlacesContainer, MainWeatherContainer)
// add flag for isDelete, do not fetch weather if isDelete is true

// if localStorage, otherwise use default places
const getPlaces = () => {
  const places = localStorage.getItem(PLACES_STORAGE_KEY);
  return places ? JSON.parse(places) : DEFAULT_PLACES;
};

// 1. create the contexts
const WeatherDataContext = React.createContext();
const WeatherAPIContext = React.createContext();

// 2. make the contexts available to subscribers via custom hooks
export function useWeatherData() {
  const context = useContext(WeatherDataContext);
  if (context === undefined) {
    throw new Error('useWeatherData is being called outside of its Provider');
  }
  return context;
}

export function useWeatherAPI() {
  const context = useContext(WeatherAPIContext);
  if (context === undefined) {
    throw new Error('useWeatherAPI was called outside of its Provider');
  }
  return context;
}
// 3. define the provider and delegate value props to the contexts
export default function WeatherProvider({ children }) {
  console.log('WeatherProvider rendered!');
  const [places, setPlaces] = useState(getPlaces());
  const [placesWeatherData, setPlacesWeatherData] = useState([]);
  const { units, lang } = usePrefsData();

  const options = { places, units, lang };
  const [weatherData, isLoading, isError] = useGetWeather(options);

  // update state when weatherData changes
  useEffect(() => {
    console.log('WeatherProvider useEffect, placesWeatherData: ', weatherData);
    setPlacesWeatherData(weatherData);
  }, [weatherData]);

  // keep localStorage in sync with state
  useEffect(() => {
    console.log('WeatherProvider useEffect, setLocalStorage: ', places);
    localStorage.setItem(PLACES_STORAGE_KEY, JSON.stringify(places));
  }, [places]);

  const memoDataContext = useMemo(() => {
    return {
      places,
      placesWeatherData,
      isLoading,
      isError,
    };
  }, [places, placesWeatherData, isLoading, isError]);

  const memoApiContext = useMemo(() => {
    return { setPlaces };
  }, [setPlaces]);

  return (
    <WeatherDataContext.Provider value={memoDataContext}>
      <WeatherAPIContext.Provider value={memoApiContext}>
        {children}
      </WeatherAPIContext.Provider>
    </WeatherDataContext.Provider>
  );
}

WeatherProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
