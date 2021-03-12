import { fetchGoogleAddressDetails } from 'api/instances/googlePlacesInstance';
import { Unpacked } from './Unpacked';

export type AddressDto = Unpacked<ReturnType<typeof fetchGoogleAddressDetails>>;
