import Search from './places/Search';
import PlacesContainer from './places/PlacesContainer';
import Main from './main/Main';
import Footer from './Footer';
import styles from '../styles/Page.module.css';

export default function Page() {
  console.log('Page rendered!');

  return (
    <div className={styles.pageContainer}>
      <div className="spacer" />
      <section className={styles.placesSection}>
        <Search />
        <PlacesContainer />
      </section>
      <Main />
      <Footer />
      <div className="gutter" />
    </div>
  );
}
