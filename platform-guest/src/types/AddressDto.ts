import { fetchGoogleAddressDetails } from 'utils/google-place';
import { Unpacked } from './Unpacked';

export type AddressDto = Unpacked<ReturnType<typeof fetchGoogleAddressDetails>>;
