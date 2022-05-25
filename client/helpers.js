export function getIconUrl(iconKey, { size = '' } = {}) {
  let sizeKey = ''
  if (size === 'large') sizeKey = '@4x'
  if (size === 'medium') sizeKey = '@2x'
  return `http://openweathermap.org/img/wn/${iconKey}${sizeKey}.png`
}

export function parseIconUrl(url) {
  if (!url.match(/\d\d[dn]/)) return
  return url.match(/\d\d[dn]/).toString()
}
