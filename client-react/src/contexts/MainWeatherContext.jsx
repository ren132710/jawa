import React, { useContext, useState, useMemo } from 'react';
import PropTypes from 'prop-types';

// 1. create the contexts
const MainWeatherDataContext = React.createContext();
const MainWeatherAPIContext = React.createContext();

// 2. make the contexts available to subscribers via custom hooks
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

  const memoDataContext = useMemo(() => {
    return { mainWeather };
  }, [mainWeather]);

  const memoApiContext = useMemo(() => {
    return { setMainWeather };
  }, [setMainWeather]);

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