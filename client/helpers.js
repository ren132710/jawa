//https://date-fns.org/v2.28.0/docs/format
import { format, utcToZonedTime } from 'date-fns-tz'

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

//Jan, Feb, Mar,...
export function formatMonth(timestamp) {
  return format(new Date(timestamp), 'MMM')
}

//1, 2, ..., 31
export function formatDayOfMonth(timestamp) {
  return format(new Date(timestamp), 'd')
}

//Monday, Tuesday, Wednesday,...
export function formatDayOfWeek(timestamp) {
  return format(new Date(timestamp), 'EEEE')
}

//Mon, Tue,...
export function formatDayOfWeekShort(timestamp) {
  return format(new Date(timestamp), 'EEE')
}

//5PM, 2AM
export function formatHour(timestamp) {
  return format(new Date(timestamp), 'ha')
}

//Apr 29, 1970
export function formatDate(timestamp) {
  return format(new Date(timestamp), 'PP')
}

//05:25 PM
export function formatTime(timestamp) {
  return format(new Date(timestamp), 'p')
}

//displays the timezone time for the particular place
export function formatZonedTime(timestamp, timezone) {
  const zonedDate = utcToZonedTime(new Date(timestamp), timezone)
  return format(zonedDate, 'p', { timezone })
}
