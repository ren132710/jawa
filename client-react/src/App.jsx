import Topbar from './components/topbar/Topbar';
import PageLayout from './components/PageLayout';

export default function App() {
  console.log('App rendered!');

  return (
    <>
      <Topbar />
      <PageLayout />
    </>
  );
}
