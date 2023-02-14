import Topbar from '@/components/topbar/Topbar';
import Page from '@/components/Page';
import UtilsProvider from '@/contexts/UtilsContext';
import PrefsProvider from '@/contexts/PrefsContext';
import PlacesWeatherProvider from '@/contexts/PlacesWeatherContext';
import MainWeatherProvider from '@/contexts/MainWeatherContext';

export default function App() {
  console.log('App rendered!');

  return (
    <UtilsProvider>
      <PrefsProvider>
        <MainWeatherProvider>
          <PlacesWeatherProvider>
            <Topbar />
            <Page />
          </PlacesWeatherProvider>
        </MainWeatherProvider>
      </PrefsProvider>
    </UtilsProvider>
  );
}
