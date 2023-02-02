import Topbar from '@/components/topbar/Topbar';
import Page from '@/components/Page';
import UtilsProvider from '@/contexts/UtilsContext';
import PrefsProvider from '@/contexts/PrefsContext';
import WeatherProvider from '@/contexts/WeatherContext';
import SelectedWeatherProvider from '@/contexts/SelectedWeatherContext';

export default function App() {
  console.log('App rendered!');

  return (
    <UtilsProvider>
      <PrefsProvider>
        <SelectedWeatherProvider>
          <WeatherProvider>
            <Topbar />
            <Page />
          </WeatherProvider>
        </SelectedWeatherProvider>
      </PrefsProvider>
    </UtilsProvider>
  );
}
