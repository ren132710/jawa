import React, { useState, useContext, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useWeatherPrefs } from '@/contexts/PrefsContext';
import { PLACES_STORAGE_KEY, DEFAULT_PLACES } from '@/constants/constants';
import getWeather from '@/utils/getWeather';

// if localStorage, otherwise use default places
const getPlaces = () => {
  const places = localStorage.getItem(PLACES_STORAGE_KEY);
  return places ? JSON.parse(places) : DEFAULT_PLACES;
};

// 1. create the contexts
const PlacesWeatherDataContext = React.createContext();
const PlacesWeatherAPIContext = React.createContext();

// 2. make the contexts available to subscribers via custom hooks
export function usePlacesWeatherData() {
  const context = useContext(PlacesWeatherDataContext);
  if (context === undefined) {
    throw new Error('usePlacesWeatherData was called outside of its Provider');
  }
  return context;
}

export function usePlacesWeatherAPI() {
  const context = useContext(PlacesWeatherAPIContext);
  if (context === undefined) {
    throw new Error('usePlacesWeatherAPI was called outside of its Provider');
  }
  return context;
}
// 3. define the provider and delegate value props to the contexts
export default function PlacesWeatherProvider({ children }) {
  console.log('PlacesWeatherProvider rendered!');
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [places, setPlaces] = useState(getPlaces());
  const [placesWeatherData, setPlacesWeatherData] = useState([]);
  const { units, lang } = useWeatherPrefs();
  const options = useMemo(() => {
    return { places, units, lang };
  }, [places, units, lang]);

  // minimize API calls, load places weather only on page load
  // TODO: might have to add back doPlacesUpdate when we support lang and units changes
  useEffect(() => {
    console.log('PlacesWeatherProvider useEffect (options): ', options);
    getWeather(options)
      .then((data) => {
        console.log('PlacesWeatherProvider useEffect (weather): ', data);
        setIsLoading(true);
        setPlacesWeatherData(data);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        setIsError(true);
        console.log('PlacesWeatherProvider useEffect (error): ', err);
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // keep localStorage in sync with state
  useEffect(() => {
    console.log('PlacesWeatherProvider useEffect (setLocalStorage): ', places);
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
    return { setPlaces, setPlacesWeatherData };
  }, [setPlaces, setPlacesWeatherData]);

  return (
    <PlacesWeatherDataContext.Provider value={memoDataContext}>
      <PlacesWeatherAPIContext.Provider value={memoApiContext}>
        {children}
      </PlacesWeatherAPIContext.Provider>
    </PlacesWeatherDataContext.Provider>
  );
}

PlacesWeatherProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
