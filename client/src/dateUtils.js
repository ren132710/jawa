//https://date-fns.org/v2.28.0/docs/format
import { format, utcToZonedTime } from 'date-fns-tz'
// import { format } from 'date-fns'
import { en, fr, sv } from 'date-fns/locale'

//Jan, Feb, Mar,...
export function formatMonth(timestamp, strLocale) {
  locale = getLocale(strLocale)
  return format(new Date(timestamp), 'MMM', { locale: locale })
}

//1, 2, ..., 31
export function formatDayOfMonth(timestamp) {
  return format(new Date(timestamp), 'd')
}

//Monday, Tuesday, Wednesday,...
export function formatDayOfWeek(timestamp, strLocale) {
  locale = getLocale(strLocale)
  return format(new Date(timestamp), 'EEEE', { locale: locale })
}

//Mon, Tue,...
export function formatDayOfWeekShort(timestamp, strLocale) {
  locale = getLocale(strLocale)
  return format(new Date(timestamp), 'EEE', { locale: locale })
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

//5:30 AM, 8:21 PM (for the given timezone)
export function formatZonedTime(timestamp, timezone) {
  const zonedDate = utcToZonedTime(new Date(timestamp), timezone)
  return format(zonedDate, 'p', { timezone })
}

//5PM, 2AM (for the given timezone)
export function formatZonedHour(timestamp, timezone) {
  const zonedDate = utcToZonedTime(new Date(timestamp), timezone)
  return format(zonedDate, 'ha', { timezone })
}

/**
 * helper functions
 */

function getLocale(strLocal) {
  switch (strLocal) {
    case 'en':
      return en
    case 'fr':
      return fr
    case 'sv':
      return sv
    default:
      return en
  }
}
