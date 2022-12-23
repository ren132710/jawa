export default function getIconUrl(iconKey, { size = '' } = {}) {
  let sizeKey = '';
  if (size === 'large') sizeKey = '@4x';
  if (size === 'medium') sizeKey = '@2x';
  return `http://openweathermap.org/img/wn/${iconKey}${sizeKey}.png`;
}