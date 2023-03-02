import Topbar from '@/components/topbar/Topbar';
import Page from '@/components/Page';
import UtilsProvider from '@/contexts/UtilsContext';
import PrefsProvider from '@/contexts/PrefsContext';
import HasErrorProvider from '@/contexts/HasErrorContext';
import PlacesWeatherProvider from '@/contexts/PlacesWeatherContext';
import MainWeatherProvider from '@/contexts/MainWeatherContext';

export default function App() {
  console.log('App rendered!');

  return (
    <UtilsProvider>
      <PrefsProvider>
        <HasErrorProvider>
          <PlacesWeatherProvider>
            <MainWeatherProvider>
              <Topbar />
              <Page />
            </MainWeatherProvider>
          </PlacesWeatherProvider>
        </HasErrorProvider>
      </PrefsProvider>
    </UtilsProvider>
  );
}
