import { PLACE_HOLDER } from 'config/consts';
import { OptionTypeBase } from 'react-select';
import { getDurationInfoString } from 'utils/timeHelpers';

const packageToOption = (photos: string) => (
  pricingPackage?: {
    id: number;
    name: string;
    photosQuantity: number;
    shootingDuration: number;
    companyPrice: number;
    currency: { symbol: string };
  } | null
): OptionTypeBase | null =>
  pricingPackage
    ? {
        value: pricingPackage.id,
        label: `${pricingPackage.name} (${pricingPackage.photosQuantity} ${photos} - ${getDurationInfoString(
          pricingPackage.shootingDuration
        )}) - ${pricingPackage.companyPrice} ${pricingPackage?.currency?.symbol ?? PLACE_HOLDER}`,
      }
    : null;

export { packageToOption };
