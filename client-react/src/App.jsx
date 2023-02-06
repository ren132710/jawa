import Topbar from '@/components/topbar/Topbar';
import Page from '@/components/Page';
import UtilsProvider from '@/contexts/UtilsContext';
import PrefsProvider from '@/contexts/PrefsContext';
import WeatherProvider from '@/contexts/WeatherContext';
import MainWeatherProvider from '@/contexts/MainWeatherContext';

export default function App() {
  console.log('App rendered!');

  return (
    <UtilsProvider>
      <PrefsProvider>
        <MainWeatherProvider>
          <WeatherProvider>
            <Topbar />
            <Page />
          </WeatherProvider>
        </MainWeatherProvider>
      </PrefsProvider>
    </UtilsProvider>
  );
}
