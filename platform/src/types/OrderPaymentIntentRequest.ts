export interface OrderPaymentIntentRequest {
  title: string;
  pricingPackage: number;
  place: PlaceRequest;
  startDate: number;
  description: string;
  logisticInformation: string;
  mainContact: MainContactRequest;
}

export interface PlaceRequest {
  city: string;
  countryCode: string;
  formattedAddress: string;
  location: LocationRequest;
  placeId: string;
  street: string;
  timezone: string;
}

export interface LocationRequest {
  latitude: number;
  longitude: number;
}

export interface MainContactRequest {
  fullName: string;
  email: string;
  phoneNumber: string;
  additionalPhoneNumber: string | null;
  businessName: string;
}
