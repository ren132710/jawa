const LOCAL_STORAGE_PREFIX = 'jawa';

export const PLACES_STORAGE_KEY = `${LOCAL_STORAGE_PREFIX}-places`;
export const PREFS_STORAGE_KEY = `${LOCAL_STORAGE_PREFIX}-prefs`;

export const DEFAULT_PLACES = [
  {
    id: '905e58e1-5510-4535-b4c8-2ed30045772d',
    location: 'austin',
    lat: 30.2672,
    long: -97.7431,
  },
  {
    id: '90f3d018-bbd3-45be-9c11-debbff73fb6c',
    location: 'san francisco',
    lat: 37.7749,
    long: -122.4194,
  },
  {
    id: '6b819c6d-c8d4-4f2a-94c1-6eec48c6d8c8',
    location: 'montreal',
    lat: 45.5017,
    long: -73.5673,
  },
  {
    id: 'c9ae7c46-81e4-4c9d-a933-bb3c8d14fc87',
    location: 'new york',
    lat: 40.7128,
    long: -74.006,
  },
];

export const DEFAULT_PREFS = [{ units: 'imperial', theme: 'jawa', lang: 'en' }];

// embedded crlf is respected by css whitespace: pre-wrap
export const ERROR_MESSAGE_WEATHER = `Oops, something went wrong fetching your weather.
Please refresh the page and try again.`;

export const ERROR_MESSAGE_AUTOCOMPLETE = `Oops, something went wrong loading the google autocomplete box.`;
