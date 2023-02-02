// import { useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import Search from './Search';
import { ERROR_MESSAGE_AUTOCOMPLETE } from '@/constants/constants';

// https://developers.google.com/maps/documentation/javascript/url-params#required_parameters
const API_KEY = import.meta.env.VITE_API_KEY;
const loader = new Loader({
  apiKey: API_KEY,
  libraries: ['places'],
});
const isLoader = !!loader;

export default function SearchContainer() {
  console.log('SearchContainer is rendered!');

  return (
    <div>
      {isLoader ? (
        <Search loader={loader} />
      ) : (
        <div className="error-container">
          <div className="error">{ERROR_MESSAGE_AUTOCOMPLETE}</div>
        </div>
      )}
    </div>
  );
}
