import { useEffect } from 'react';
import Topbar from './components/topbar/Topbar';
import Page from './components/Page';
import WeatherProvider from './contexts/WeatherContext';
import PrefsProvider from './contexts/PrefsContext';
import * as c from './constants/defaults';

export default function App() {
  console.log('App rendered!');

  // initialize defaults on initial render
  useEffect(() => {
    // TODO: if return is empty or null, set default prefs
    // if local storage is empty, set default prefs
    if (!localStorage.getItem(c.PREFS_STORAGE_KEY)) {
      localStorage.setItem(
        c.PREFS_STORAGE_KEY,
        JSON.stringify(c.DEFAULT_PREFS)
      );
    }

    // TODO: if return is empty or null, set default prefs
    // if local storage is empty, set default places
    if (!localStorage.getItem(c.PLACES_STORAGE_KEY)) {
      localStorage.setItem(
        c.PLACES_STORAGE_KEY,
        JSON.stringify(c.DEFAULT_PLACES)
      );
    }
  }, []);

  return (
    <PrefsProvider>
      <WeatherProvider>
        <Topbar />
        <Page />
      </WeatherProvider>
    </PrefsProvider>
  );
}
