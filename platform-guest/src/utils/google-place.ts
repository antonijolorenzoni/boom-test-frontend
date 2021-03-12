import axios from 'axios';
import moment from 'moment';
import { find, get, indexOf } from 'lodash';

export const fetchPlaceFromGoogle = (text: string): Promise<Array<google.maps.places.AutocompletePrediction>> => {
  const autocompleteService = new window.google.maps.places.AutocompleteService();
  return new Promise((resolve, reject) => {
    autocompleteService.getPlacePredictions({ input: text }, (place, _) => {
      resolve(place);
    });
  });
};

export const onFetchGooglePlacesOptions = async (text: string): Promise<Array<{ value: string; label: string }>> => {
  return fetchPlaceFromGoogle(text).then((addresses) =>
    (addresses || []).map((address) => ({
      value: address.place_id,
      label: address.description,
    }))
  );
};

export const getPlaceTimezone = async (lat: string, long: string) => {
  try {
    const { OK } = window.google.maps.GeocoderStatus;
    const timezoneResponse = await axios.get<{ timeZoneId: string; status: google.maps.GeocoderStatus }>(
      `https://maps.googleapis.com/maps/api/timezone/json?location=${lat},${long}&timestamp=${moment().unix()}&key=${
        process.env.REACT_APP_GOOGLE_API_KEY
      }`
    );

    if (timezoneResponse.data.timeZoneId && timezoneResponse.data.status === OK) {
      return timezoneResponse.data.timeZoneId;
    }

    return 'Europe/Rome';
  } catch (error) {
    return 'Europe/Rome';
  }
};

const findInAddressFn = (addressSelected: google.maps.places.PlaceResult) => (field: string) =>
  find(addressSelected.address_components, (component) => indexOf(component.types, field) !== -1);

export const buildAddressDTO = (selectedAddress: google.maps.places.PlaceResult, timezone: string) => {
  const location = {
    latitude: selectedAddress.geometry!.location.lat,
    longitude: selectedAddress.geometry!.location.lng,
  };

  const findFieldInAddress = findInAddressFn(selectedAddress);

  const city = findFieldInAddress('locality');
  const postalTown = findFieldInAddress('postal_town');
  const cityField = city || postalTown;
  const country = findFieldInAddress('country');
  const street = findFieldInAddress('route');

  const addressDTO = {
    location,
    city: cityField && cityField.long_name,
    street: street && street.long_name,
    countryCode: country && country.short_name,
    formattedAddress: selectedAddress.formatted_address,
    placeId: selectedAddress.place_id,
    timezone,
  };

  return addressDTO;
};

export const fetchGoogleAddressDetails = async (address: string | Array<string>): Promise<ReturnType<typeof buildAddressDTO> | null> => {
  try {
    // need to check if it is an array
    // because react-select trigger the onChange function also when press backspace and the field is empty
    if (!address || Array.isArray(address)) {
      return null;
    }

    const details = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_GOOGLE_API_KEY}&sensor=false&language=en`
    );

    const detailsResult = get(details, 'data.results');

    if (detailsResult && Array.isArray(details.data.results)) {
      const selectedAddress = details.data.results[0];

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
};
