import SearchContainer from '@/components/places/SearchContainer';
import PlacesContainer from '@/components/places/PlacesContainer';
import Main from '@/components/main/Main';
import Footer from '@/components/Footer';
import styles from '@/styles/Page.module.css';

export default function Page() {
  console.log('Page rendered!');

  return (
    <div className={styles.pageContainer}>
      <section id="spacer" />
      <section className={styles.placesSection}>
        <SearchContainer />
        <PlacesContainer />
      </section>
      <Main />
      <Footer />
    </div>
  );
}
