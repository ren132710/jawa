import React, { useState, useContext, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useWeatherPrefs } from '@/contexts/PrefsContext';
import getWeather from '@/utils/getWeather';
import { getLocalPlaces, setLocalPlaces } from '@/utils/localStorage';

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
  const [hasError, setHasError] = useState(false);
  const [places, setPlaces] = useState(getLocalPlaces());
  const [placesWeatherData, setPlacesWeatherData] = useState([]);
  const { units, lang } = useWeatherPrefs();

  useEffect(() => {
    console.log('PlacesWeatherProvider useEffect (options): ', {
      places,
      units,
      lang,
    });

    setIsLoading(true);

    getWeather({ places, units, lang })
      .then((weather) => {
        console.log('PlacesWeatherProvider useEffect (weather): ', weather);
        setPlacesWeatherData(weather);
      })
      .catch((err) => {
        setHasError(true);
        console.log('PlacesWeatherProvider useEffect (error): ', err);
      });

    setIsLoading(false);

    // we want the user to be able to add/delete places without refreshing weather data
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [units, lang]);

  // keep localStorage in sync with state
  useEffect(() => {
    console.log('PlacesWeatherProvider useEffect (setLocalStorage): ', places);
    setLocalPlaces(places);
  }, [places]);

  const memoDataContext = useMemo(() => {
    return {
      places,
      placesWeatherData,
      isLoading,
      hasError,
    };
  }, [places, placesWeatherData, isLoading, hasError]);

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
