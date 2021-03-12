export const onFetchGooglePlacesOptions = (value, token) =>
  Promise.resolve([
    {
      value:
        'EjdDb3JzbyBNYWdlbnRhLCBNaWxhbiwgTWV0cm9wb2xpdGFuIENpdHkgb2YgTWlsYW4sIEl0YWx5Ii4qLAoUChIJLfawmlDBhkcRX8dY63xh_1wSFAoSCed1Ej9JwYZHEY0OdMYTzf88',
      label: 'Corso Magenta',
    },
  ]);

export const fetchGoogleAddressDetails = () =>
  Promise.resolve({
    placeId: 'ChIJ4edudVzBhkcRHP7WsU-4aSM',
    street: 'Corso Magenta',
    timezone: 'Europe/Rome',
  });
