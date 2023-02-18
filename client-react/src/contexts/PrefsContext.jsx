import React, { useContext, useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { getLocalPrefs, setLocalPrefs } from '@/utils/localStorage';

const WeatherPrefsContext = React.createContext();
const PrefsAPIContext = React.createContext();

// separate out theme context so components don't re-render when theme changes
const ThemeContext = React.createContext();

export function useWeatherPrefs() {
  const context = useContext(WeatherPrefsContext);
  if (context === undefined) {
    throw new Error('usePrefsData was called outside of its Provider');
  }
  return context;
}

export function usePrefsAPI() {
  const context = useContext(PrefsAPIContext);
  if (context === undefined) {
    throw new Error('usePrefsAPI was called outside of its Provider');
  }
  return context;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme was called outside of its Provider');
  }
  return context;
}

export default function PrefsProvider({ children }) {
  console.log('PrefsProvider rendered!');
  const [theme, setTheme] = useState(getLocalPrefs()[0].theme);
  const [units, setUnits] = useState(getLocalPrefs()[0].units);
  const [lang, setLang] = useState(getLocalPrefs()[0].lang);

  // keep localStorage in sync with prefs state
  useEffect(() => {
    console.log('PrefsProvider useEffect (setLocalStorage)!');
    setLocalPrefs([{ theme, units, lang }]);
  }, [theme, units, lang]);

  // apply theme change application wide
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  const memoPrefsDataContext = useMemo(() => {
    return { units, lang };
  }, [units, lang]);

  const memoPrefsAPIContext = useMemo(() => {
    return { setTheme, setUnits, setLang };
  }, []);

  return (
    <ThemeContext.Provider value={theme}>
      <WeatherPrefsContext.Provider value={memoPrefsDataContext}>
        <PrefsAPIContext.Provider value={memoPrefsAPIContext}>
          {children}
        </PrefsAPIContext.Provider>
      </WeatherPrefsContext.Provider>
    </ThemeContext.Provider>
  );
}

PrefsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
