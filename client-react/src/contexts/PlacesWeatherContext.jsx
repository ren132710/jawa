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
  const [isError, setIsError] = useState(false);
  const [places, setPlaces] = useState(getLocalPlaces());
  const [placesWeatherData, setPlacesWeatherData] = useState([]);
  const { units, lang } = useWeatherPrefs();

  useEffect(() => {
    console.log('PlacesWeatherProvider useEffect (options): ', {
      places,
      units,
      lang,
    });
    getWeather({ places, units, lang })
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
