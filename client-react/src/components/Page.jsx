import Search from '@/components/places/Search';
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
        <Search />
        <PlacesContainer />
      </section>
      <Main />
      <Footer />
    </div>
  );
}
