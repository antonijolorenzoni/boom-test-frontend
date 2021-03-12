import { axiosBoomInstance } from './instances/boomInstance';
import { API_VERSION } from 'config/configurations';

export const updateContactCenter = ({ id, name, language, phoneNumber }) => {
  return axiosBoomInstance.put(`/api/${API_VERSION}/contact-centers/${id}`, { name, language, phoneNumber });
};

export const addUserContactCenter = ({ id, email, firstName, lastName, language }) =>
  axiosBoomInstance.post(`/api/${API_VERSION}/contact-centers/${id}/users`, { email, firstName, lastName, language });

export const updateInfoCcUser = ({ idContactCenter, idUser, firstName, email, lastName, language }) =>
  axiosBoomInstance.put(`/api/${API_VERSION}/contact-centers/${idContactCenter}/users/${idUser}`, { email, firstName, lastName, language });
