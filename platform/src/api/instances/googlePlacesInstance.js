//
// ──────────────────────────────────────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: A X I O S   I N S T A N C E   F O R   G O O G L E   M A P S   A P I : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
//

import _ from 'lodash';
import moment from 'moment';

const axios = require('axios');

const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;

export function geocodeByAddress(address) {
  const geocoder = new window.google.maps.Geocoder();
  const { OK } = window.google.maps.GeocoderStatus;
  return new Promise((resolve, reject) => {
    geocoder.geocode({ address }, (results, status) => {
      if (status !== OK) {
        reject(status);
      }
      resolve(results);
    });
  });
}

export function getLatLng(result) {
  return new Promise((resolve, reject) => {
    try {
      const latLng = {
        latitude: result.geometry.location,
        longitude: result.geometry.location,
      };
      resolve(latLng);
    } catch (e) {
      reject(e);
    }
  });
}

export function geocodeByPlaceId(placeId) {
  const geocoder = new window.google.maps.Geocoder();
  const { OK } = window.google.maps.GeocoderStatus;
  return new Promise((resolve, reject) => {
    geocoder.geocode({ placeId }, (results, status) => {
      if (status !== OK) {
        reject(status);
      }
      resolve(results);
    });
  });
}

export function fetchPlaceFromGoogle(text, token, country) {
  const autocompleteService = new window.google.maps.places.AutocompleteService();
  return new Promise((resolve, reject) => {
    autocompleteService.getPlacePredictions(
      {
        input: text,
        sessiontoken: token,
        componentRestrictions: {
          country: country || null,
        },
        types: ['address'],
      },
      (place, status) => {
        resolve(place);
      }
    );
  });
}

export async function onFetchGooglePlacesOptions(value, token, country) {
  const addresses = await fetchPlaceFromGoogle(value, token, country);
  const options = _.map(addresses, (address) => ({
    value: address.place_id, // workaround for creatable component
    label: address.description,
  }));
  return options;
}

export async function getPlaceTimezone(lat, lon) {
  try {
    const { OK } = window.google.maps.GeocoderStatus;
    const timezoneResponse = await axios.get(
      `https://maps.googleapis.com/maps/api/timezone/json?location=${lat},${lon}&timestamp=${moment().unix()}&key=${GOOGLE_API_KEY}`
    );
    if (timezoneResponse && timezoneResponse.data && timezoneResponse.data.timeZoneId && timezoneResponse.data.status === OK) {
      return timezoneResponse.data.timeZoneId;
    }
    return 'Europe/Rome';
  } catch (error) {
    return 'Europe/Rome';
  }
}

const findInAddressFn = (addressSelected) => (field) =>
  _.find(addressSelected.address_components, (component) => _.indexOf(component.types, field) !== -1);

export const buildAddressDTO = (selectedAddress, timezone) => {
  const location = {
    latitude: selectedAddress.geometry.location.lat,
    longitude: selectedAddress.geometry.location.lng,
  };

  const findFieldInAddress = findInAddressFn(selectedAddress);

  const city = findFieldInAddress('locality');
  const postalCode = findFieldInAddress('postal_code');
  const country = findFieldInAddress('country');
  const street = findFieldInAddress('route');
  const street_number = findFieldInAddress('street_number');

  const addressDTO = {
    location,
    city: city?.long_name,
    street: street?.long_name,
    street_number: street_number?.long_name,
    postalCode: postalCode?.long_name,
    country: country?.long_name,
    countryCode: country?.short_name,
    formattedAddress: selectedAddress.formatted_address,
    placeId: selectedAddress.place_id,
    timezone,
  };

  return addressDTO;
};

export async function fetchGoogleAddressDetails(address, sessionToken) {
  try {
    // need to check if it is an array
    // because react-select trigger the onChange function also when press backspace and the field is empty
    if (!address || Array.isArray(address)) {
      return null;
    }

    const details = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${address.label}&key=${GOOGLE_API_KEY}&sensor=false&language=en&sessiontoken=${sessionToken}`
    );

    const detailsResult = _.get(details, 'data.results');

    if (detailsResult && _.isArray(details.data.results)) {
      const selectedAddress = _.first(details.data.results);

      if (!selectedAddress) {
        return null;
      }

      const latitude = selectedAddress.geometry.location.lat;
      const longitude = selectedAddress.geometry.location.lng;
      const timezone = await getPlaceTimezone(latitude, longitude);

      return buildAddressDTO(selectedAddress, timezone);
    }

    return null;
  } catch (error) {
    throw error;
  }
}
