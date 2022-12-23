import Topbar from './components/topbar/Topbar';
import Page from './components/Page';
import PrefsProvider from './contexts/PrefsContext';
import WeatherProvider from './contexts/WeatherContext';
import UtilsProvider from './contexts/UtilsContext';

export default function App() {
  console.log('App rendered!');

  return (
    <UtilsProvider>
      <PrefsProvider>
        <WeatherProvider>
          <Topbar />
          <Page />
        </WeatherProvider>
      </PrefsProvider>
    </UtilsProvider>
  );
}
