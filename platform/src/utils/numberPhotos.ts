import { PackageType } from 'types/PackageType';

export const getMaxUploadPhotos = ({ packageType, photosQuantity }: { packageType: PackageType; photosQuantity: number }): number => {
  switch (packageType) {
    case PackageType.Food:
      return photosQuantity;
    case PackageType.RealEstate:
      return photosQuantity < 45 ? (photosQuantity + 5) * 3 : Math.ceil(photosQuantity * 1.1 * 3);
    default:
      return Infinity;
  }
};

export const getRequiredUploadPhotos = ({ packageType, photosQuantity }: { packageType: PackageType; photosQuantity: number }): number => {
  switch (packageType) {
    case PackageType.Food:
      return photosQuantity;
    case PackageType.RealEstate:
      return photosQuantity * 3;
    default:
      return Infinity;
  }
};

export const getMinUploadPhotosToConfirm = ({ packageType }: { packageType: PackageType }): number =>
  packageType === PackageType.RealEstate ? 3 : 1;
