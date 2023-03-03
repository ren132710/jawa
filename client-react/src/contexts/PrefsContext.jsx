import React, { useContext, useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { getLocalPrefs, setLocalPrefs } from '@/utils/localStorage';

const PrefsAPIContext = React.createContext();
const PrefsWeatherContext = React.createContext();

// separate out theme context so components don't re-render when theme changes
const PrefsThemeContext = React.createContext();

export function usePrefsWeather() {
  const context = useContext(PrefsWeatherContext);
  if (context === undefined) {
    throw new Error('usePrefsWeather was called outside of its Provider');
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

export function usePrefsTheme() {
  const context = useContext(PrefsThemeContext);
  if (context === undefined) {
    throw new Error('usePrefsTheme was called outside of its Provider');
  }
  return context;
}

export default function PrefsProvider({ children }) {
  console.log('PrefsProvider rendered!');
  const [theme, setTheme] = useState(getLocalPrefs()[0].theme);
  const [units, setUnits] = useState(getLocalPrefs()[0].units);
  const [lang, setLang] = useState(getLocalPrefs()[0].lang);

  // apply theme change application wide
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  // keep localStorage in sync with prefs state
  useEffect(() => {
    console.log('PrefsProvider useEffect (setLocalStorage): ', [
      { theme, units, lang },
    ]);
    setLocalPrefs([{ theme, units, lang }]);
  }, [theme, units, lang]);

  const memoPrefsDataContext = useMemo(() => {
    return { units, lang };
  }, [units, lang]);

  const memoPrefsAPIContext = useMemo(() => {
    return { setTheme, setUnits, setLang };
  }, []);

  return (
    <PrefsThemeContext.Provider value={theme}>
      <PrefsWeatherContext.Provider value={memoPrefsDataContext}>
        <PrefsAPIContext.Provider value={memoPrefsAPIContext}>
          {children}
        </PrefsAPIContext.Provider>
      </PrefsWeatherContext.Provider>
    </PrefsThemeContext.Provider>
  );
}

PrefsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
