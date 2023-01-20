import '@/styles/Footer.module.css';

export default function Footer() {
  console.log('Footer rendered!');

  return (
    <footer>
      <a href="https://openweathermap.org/api" target="_blank" rel="noreferrer">
        Powered By OpenWeather
      </a>
    </footer>
  );
}
