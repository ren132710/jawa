export default function getIconUrl(iconKey, size = 'small') {
  let sizeKey = '';
  // see: https://openweathermap.org/weather-conditions#How-to-get-icon-URL
  if (size === 'small') sizeKey = '';
  if (size === 'large') sizeKey = '@4x';
  if (size === 'medium') sizeKey = '@2x';
  return `http://openweathermap.org/img/wn/${iconKey}${sizeKey}.png`;
}
