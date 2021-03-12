import { buildAddressDTO } from './googlePlacesInstance';

const fullAddress = {
  address_components: [
    {
      long_name: '85',
      short_name: '85',
      types: ['street_number'],
    },
    {
      long_name: 'Corso Magenta',
      short_name: 'Corso Magenta',
      types: ['route'],
    },
    {
      long_name: 'Milano',
      short_name: 'Milano',
      types: ['locality', 'political'],
    },
    {
      long_name: 'Milano',
      short_name: 'Milano',
      types: ['administrative_area_level_3', 'political'],
    },
    {
      long_name: 'Città Metropolitana di Milano',
      short_name: 'MI',
      types: ['administrative_area_level_2', 'political'],
    },
    {
      long_name: 'Lombardia',
      short_name: 'Lombardia',
      types: ['administrative_area_level_1', 'political'],
    },
    {
      long_name: 'Italy',
      short_name: 'IT',
      types: ['country', 'political'],
    },
    {
      long_name: '20123',
      short_name: '20123',
      types: ['postal_code'],
    },
  ],
  formatted_address: 'Corso Magenta, 85, 20123 Milano MI, Italy',
  geometry: {
    location: {
      lat: 45.4658235,
      lng: 9.1666898,
    },
    location_type: 'ROOFTOP',
    viewport: {
      northeast: {
        lat: 45.4671724802915,
        lng: 9.168038780291502,
      },
      southwest: {
        lat: 45.4644745197085,
        lng: 9.165340819708499,
      },
    },
  },
  place_id: 'ChIJ4edudVzBhkcRHP7WsU-4aSM',
  plus_code: {
    compound_code: 'F588+8M Milan, Metropolitan City of Milan, Italy',
    global_code: '8FQFF588+8M',
  },
  types: ['street_address'],
};

const withoutStreetNumberAddress = {
  address_components: [
    {
      long_name: 'Corso Magenta',
      short_name: 'Corso Magenta',
      types: ['route'],
    },
    {
      long_name: 'Milano',
      short_name: 'Milano',
      types: ['locality', 'political'],
    },
    {
      long_name: 'Milano',
      short_name: 'Milano',
      types: ['administrative_area_level_3', 'political'],
    },
    {
      long_name: 'Città Metropolitana di Milano',
      short_name: 'MI',
      types: ['administrative_area_level_2', 'political'],
    },
    {
      long_name: 'Lombardia',
      short_name: 'Lombardia',
      types: ['administrative_area_level_1', 'political'],
    },
    {
      long_name: 'Italy',
      short_name: 'IT',
      types: ['country', 'political'],
    },
  ],
  formatted_address: 'Corso Magenta, Milano MI, Italy',
  geometry: {
    bounds: {
      northeast: {
        lat: 45.4668262,
        lng: 9.180570699999999,
      },
      southwest: {
        lat: 45.4649824,
        lng: 9.165971299999999,
      },
    },
    location: {
      lat: 45.4657262,
      lng: 9.173159199999999,
    },
    location_type: 'GEOMETRIC_CENTER',
    viewport: {
      northeast: {
        lat: 45.4672532802915,
        lng: 9.180570699999999,
      },
      southwest: {
        lat: 45.4645553197085,
        lng: 9.165971299999999,
      },
    },
  },
  place_id: 'ChIJLfawmlDBhkcRX8dY63xh_1w',
  types: ['route'],
};

const onlyCityAddress = {
  address_components: [
    {
      long_name: 'Milan',
      short_name: 'Milan',
      types: ['locality', 'political'],
    },
    {
      long_name: 'Milan',
      short_name: 'Milan',
      types: ['administrative_area_level_3', 'political'],
    },
    {
      long_name: 'Metropolitan City of Milan',
      short_name: 'MI',
      types: ['administrative_area_level_2', 'political'],
    },
    {
      long_name: 'Lombardy',
      short_name: 'Lombardy',
      types: ['administrative_area_level_1', 'political'],
    },
    {
      long_name: 'Italy',
      short_name: 'IT',
      types: ['country', 'political'],
    },
  ],
  formatted_address: 'Milan, Metropolitan City of Milan, Italy',
  geometry: {
    bounds: {
      northeast: {
        lat: 45.535689,
        lng: 9.2903463,
      },
      southwest: {
        lat: 45.3897787,
        lng: 9.065118199999999,
      },
    },
    location: {
      lat: 45.4642035,
      lng: 9.189982,
    },
    location_type: 'APPROXIMATE',
    viewport: {
      northeast: {
        lat: 45.535689,
        lng: 9.2903463,
      },
      southwest: {
        lat: 45.3897787,
        lng: 9.065118199999999,
      },
    },
  },
  place_id: 'ChIJ53USP0nBhkcRjQ50xhPN_zw',
  types: ['locality', 'political'],
};

const onlyCountryAddress = {
  address_components: [
    {
      long_name: 'Italy',
      short_name: 'IT',
      types: ['country', 'political'],
    },
  ],
  formatted_address: 'Italy',
  geometry: {
    bounds: {
      northeast: {
        lat: 47.092,
        lng: 18.7975999,
      },
      southwest: {
        lat: 35.4897,
        lng: 6.6267201,
      },
    },
    location: {
      lat: 41.87194,
      lng: 12.56738,
    },
    location_type: 'APPROXIMATE',
    viewport: {
      northeast: {
        lat: 47.092,
        lng: 18.7975999,
      },
      southwest: {
        lat: 35.4897,
        lng: 6.6267201,
      },
    },
  },
  place_id: 'ChIJA9KNRIL-1BIRb15jJFz1LOI',
  types: ['country', 'political'],
};

describe('googlePlaceInstances', () => {
  describe('buildAddressDTO', () => {
    it('build a full address', () => {
      expect(buildAddressDTO(fullAddress, 'Europe/Rome')).toMatchSnapshot();
    });

    it('build an address without street number', () => {
      expect(buildAddressDTO(withoutStreetNumberAddress, 'Europe/Rome')).toMatchSnapshot();
    });

    it('build an address composed by only a city', () => {
      expect(buildAddressDTO(onlyCityAddress, 'Europe/Rome')).toMatchSnapshot();
    });

    it('build an address composed by only a country', () => {
      expect(buildAddressDTO(onlyCountryAddress, 'Europe/Rome')).toMatchSnapshot();
    });
  });
});
