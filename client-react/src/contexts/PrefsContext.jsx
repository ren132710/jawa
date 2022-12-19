import React, { useContext, useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';

const PrefsContext = React.createContext();

export function usePrefs() {
  const context = useContext(PrefsContext);

  if (context === undefined) {
    throw new Error('usePrefs is being called outside of its Provider');
  }

  return context;
}

// TODO: fetch from local storage
// TODO: use/create local storage hook
const DEFAULT_PREFS = [{ units: 'imperial', theme: 'jawa', lang: 'en' }];

export function PrefsProvider({ children }) {
  const [units, setUnits] = useState(DEFAULT_PREFS.units);
  const [theme, setTheme] = useState(DEFAULT_PREFS.theme);
  const [lang, setLang] = useState(DEFAULT_PREFS.lang);

  console.log('PrefsProvider rendered!');

  // fires every time there is a state change to prefs.theme
  useEffect(() => {
    console.log('useEffect called');
    document.querySelector('body').setAttribute('data-theme', theme);
  }, [theme]);

  // memoize otherwise consumers will be forced to re-render if the parent of the provider re-renders
  const memoValue = useMemo(() => {
    console.log('PrefsProvider useMemo is called');
    return { lang, units, theme, setLang, setUnits, setTheme };

    // React memoizes the built-in set functions by default, so don't need to include as dependency
  }, [lang, units, theme]);

  return (
    <PrefsContext.Provider value={memoValue}>{children}</PrefsContext.Provider>
  );
}

PrefsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// function onLangChange(value) {
//   setPrefs({ ...prefs, lang: value });
// }

// function onUnitsChange(value) {
//   setPrefs({ ...prefs, units: value });
// }

// function onThemeChange(value) {
//   setPrefs({ ...prefs, theme: value });
// }
