import React, { useContext, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { usePlacesWeatherData } from '@/contexts/PlacesWeatherContext';

const MainWeatherDataContext = React.createContext();
const MainWeatherAPIContext = React.createContext();

export function useMainWeatherData() {
  const context = useContext(MainWeatherDataContext);
  if (context === undefined) {
    throw new Error('useMainWeatherData was called outside of its Provider');
  }
  return context;
}

export function useMainWeatherAPI() {
  const context = useContext(MainWeatherAPIContext);
  if (context === undefined) {
    throw new Error('useMainWeatherAPI was called outside of its Provider');
  }
  return context;
}

export default function MainWeatherProvider({ children }) {
  console.log('MainWeatherProvider rendered!');
  const [mainWeather, setMainWeather] = useState([]);
  const { placesWeather } = usePlacesWeatherData();

  const memoDataContext = useMemo(() => {
    return { mainWeather };
  }, [mainWeather]);

  const memoApiContext = useMemo(() => {
    return { setMainWeather };
  }, [setMainWeather]);

  // set mainWeather to first placeWeather on startup, or whenever mainWeather is empty
  if (!placesWeather.length) return;
  if (mainWeather.length === 0) setMainWeather([placesWeather[0]]);

  return (
    <MainWeatherDataContext.Provider value={memoDataContext}>
      <MainWeatherAPIContext.Provider value={memoApiContext}>
        {children}
      </MainWeatherAPIContext.Provider>
    </MainWeatherDataContext.Provider>
  );
}

MainWeatherProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
