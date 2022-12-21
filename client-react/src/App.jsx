import Topbar from './components/topbar/Topbar';
import Page from './components/Page';
import WeatherProvider from './contexts/WeatherContext';
import PrefsProvider from './contexts/PrefsContext';

export default function App() {
  console.log('App rendered!');

  return (
    <PrefsProvider>
      <WeatherProvider>
        <Topbar />
        <Page />
      </WeatherProvider>
    </PrefsProvider>
  );
}
