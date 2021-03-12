import { axiosBoomInstance } from 'api/axiosBoomInstance';
import { AddressDto } from 'types/AddressDto';
import { MainContact } from 'types/request-body/MainContact';

export const scheduleShooting = (organizationId: number, shootingId: number, startDate: number) =>
  axiosBoomInstance.put(`/organizations/${organizationId}/shootings/${shootingId}/schedule`, { startDate });

export const rescheduleShooting = (organizationId: number, shootingId: number, startDate: number) =>
  axiosBoomInstance.put(`/organizations/${organizationId}/shootings/${shootingId}/reschedule`, { startDate });

export const updateShooting = (organizationId: number, shootingId: number, data: { address?: AddressDto; mainContact?: MainContact }) => {
  const address = data.address ? { place: data.address } : undefined;
  const mainContact = data.mainContact ? { mainContact: data.mainContact } : undefined;

  return axiosBoomInstance.put(`/organizations/${organizationId}/shootings/${shootingId}`, {
    ...address,
    ...mainContact,
  });
};
