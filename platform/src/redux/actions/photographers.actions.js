//
// ────────────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: P H O T O G R A P H E R S   A C T I O N S : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────────────────────────────
//

import jwt from 'jsonwebtoken';
import _ from 'lodash';
import * as PhotographersAPI from '../../api/photographersAPI';
import { LANGUAGE_LOCAL_MAP, DEFAULT_LANGUAGE } from '../../config/consts';
import {
  APPEND_PHOTOGRAPHERS,
  DELETE_PHOTOGRAPHER,
  RESET_PHOTOGRAPHERS_DATA,
  RESET_PHOTOGRAPHERS_FILTERS,
  SAVE_PHOTOGRAPHERS,
  SAVE_PHOTOGRAPHERS_PAGINATION,
  SET_PHOTOGRAPHERS_FILTER,
  SET_PHOTOGRAPHERS_FILTER_BLOCK,
  SET_SELECTED_PHOTOGRAPHER,
  UPDATE_PHOTOGRAPHER,
} from './actionTypes/photographers';
import * as UserActions from './user.actions';
import * as UtilsActions from './utils.actions';

export function savePhotographers(photographers) {
  return {
    type: SAVE_PHOTOGRAPHERS,
    photographers,
  };
}

export function updatePhotographerInState(photographer) {
  return {
    type: UPDATE_PHOTOGRAPHER,
    photographer,
  };
}

export function appendPhotographers(photographers) {
  return {
    type: APPEND_PHOTOGRAPHERS,
    photographers,
  };
}

export function savePhotographersPagination(pagination) {
  return {
    type: SAVE_PHOTOGRAPHERS_PAGINATION,
    pagination,
  };
}

export function setPhotographersFilter(field, value) {
  return {
    type: SET_PHOTOGRAPHERS_FILTER,
    field,
    value,
  };
}

export function setPhotographersFilterBlock(filters) {
  return {
    type: SET_PHOTOGRAPHERS_FILTER_BLOCK,
    filters,
  };
}

export function resetPhotographersFilters() {
  return {
    type: RESET_PHOTOGRAPHERS_FILTERS,
  };
}

export function deletePhotographerInState(photographerId) {
  return {
    type: DELETE_PHOTOGRAPHER,
    photographerId,
  };
}

export function setSelectedPhotographer(photographer) {
  return {
    type: SET_SELECTED_PHOTOGRAPHER,
    photographer,
  };
}

export function resetPhotographersData() {
  return { type: RESET_PHOTOGRAPHERS_DATA };
}

export function updateMePhotographerInState(userData) {
  return (dispatch) => {
    if (localStorage.token) {
      const decodedJWT = jwt.decode(localStorage.token);
      const { authorities } = decodedJWT;
      dispatch(
        UserActions.saveUserData({
          ...userData,
          isBoom: false,
          isPhotographer: true,
          authorities,
        }),
        true
      );
      const userLanguage = userData.language;
      if (userLanguage) {
        const languageToSet = LANGUAGE_LOCAL_MAP[userLanguage];
        dispatch(UtilsActions.setLanguage(languageToSet ? languageToSet.translation : DEFAULT_LANGUAGE));
      }
    }
  };
}
export function fetchPhotographers(page = 0, pageSize = 50) {
  return async (dispatch, getState) => {
    try {
      const {
        photographers: {
          data: { filters },
        },
      } = getState();
      const params = {
        ...filters,
        page,
        pageSize,
      };
      const response = await PhotographersAPI.fetchPhotographers(params);
      if (response && response.data && response.data.content) {
        dispatch(savePhotographers(response.data.content));
        dispatch(savePhotographersPagination(_.omit(response.data, 'content')));
        return response.data.content;
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}

export function fetchAppendPhotographers(page = 0, pageSize = 50) {
  return async (dispatch, getState) => {
    try {
      const {
        photographers: {
          data: { filters },
        },
      } = getState();
      const params = {
        ...filters,
        page,
        pageSize,
      };
      const response = await PhotographersAPI.fetchPhotographers(params);
      if (response && response.data && response.data.content) {
        dispatch(appendPhotographers(response.data.content));
        dispatch(savePhotographersPagination(_.omit(response.data, 'content')));
        return response.data;
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}

export function createPhotographer(userDTO) {
  return async (dispatch, getState) => {
    try {
      const photographerDTO = {
        ...userDTO,
        username: userDTO.email,
        cameras: [],
        lenses: [],
      };
      const response = await PhotographersAPI.createPhotographer(photographerDTO);
      if (response.data) {
        return response.data;
      }
      throw new Error();
    } catch (error) {
      if (error && error.response && error.response.data && error.response.data.code) throw error.response.data.code;
      throw error;
    }
  };
}

export function modifyPhotographer(userDTO) {
  return async (dispatch, getState) => {
    try {
      const response = await PhotographersAPI.updatePhotographer(userDTO.id, {
        ...userDTO.user,
        // TODO remove cameras and lenses
        cameras: userDTO.cameras,
        lenses: userDTO.lenses,
      });
      if (response.data) {
        dispatch(updatePhotographerInState({ ...response.data, profilePicture: userDTO.profilePicture }));
        return response.data;
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}

export function modifyPhotographerPersonalData(userDTO) {
  return async (dispatch, getState) => {
    try {
      const {
        user: { data: userData },
      } = getState();
      const response = await PhotographersAPI.updateMePhotographer(userDTO);
      if (response.data) {
        dispatch(updateMePhotographerInState({ ...response.data, profilePicture: userData.profilePicture }));
        return response.data;
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}

export function deletePhotographer(userDTO) {
  return async (dispatch) => {
    try {
      const response = await PhotographersAPI.deletePhotographer(userDTO.id);
      if (response.data) {
        dispatch(deletePhotographerInState(userDTO.id));
        return response.data;
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}

export function resendPhotographerRegistrationEmail(userId) {
  return async (dispatch, getState) => {
    try {
      const {
        user: { data: userData },
      } = getState();
      const response = await PhotographersAPI.resendPhotographerRegistrationEmail(userId);
      if (response.data) {
        dispatch(updatePhotographerInState({ ...response.data, profilePicture: userData.profilePicture }));
        return response.data;
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}

export function updatePhotographerCameras(cameras) {
  return async (dispatch, getState) => {
    try {
      const {
        user: { data: userData },
      } = getState();
      const response = await PhotographersAPI.updateCameras(cameras);
      if (response.data && response.data.cameras) {
        dispatch(updateMePhotographerInState({ ...userData, cameras: response.data.cameras, profilePicture: userData.profilePicture }));
        return response.data;
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}

export function updatePhotographerLenses(lenses) {
  return async (dispatch, getState) => {
    try {
      const {
        user: { data: userData },
      } = getState();
      const response = await PhotographersAPI.updateLenses(lenses);
      if (response.data && response.data.lenses) {
        dispatch(updateMePhotographerInState({ ...userData, lenses: response.data.lenses, profilePicture: userData.profilePicture }));
        return response.data;
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}

export function deletePhotographerLens(lensId) {
  return async (dispatch, getState) => {
    try {
      const {
        user: { data: userData },
      } = getState();
      const response = await PhotographersAPI.deleteLens(lensId);
      if (response.data && response.data.lenses) {
        dispatch(updateMePhotographerInState({ ...userData, lenses: response.data.lenses, profilePicture: userData.profilePicture }));
        return response.data;
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}

export function deletePhotographerCamera(cameraId) {
  return async (dispatch, getState) => {
    try {
      const {
        user: { data: userData },
      } = getState();
      const response = await PhotographersAPI.deleteCamera(cameraId);
      if (response.data && response.data.cameras) {
        dispatch(updateMePhotographerInState({ ...userData, cameras: response.data.cameras, profilePicture: userData.profilePicture }));
        return response.data;
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}

export function getPhotographerProfilePicture() {
  return async (dispatch, getState) => {
    try {
      const {
        user: { data: userData },
      } = getState();
      const response = await PhotographersAPI.fetchPhotographerProfilePicture();
      if (response.data) {
        const decodedUrl = URL.createObjectURL(response.data);
        dispatch(updateMePhotographerInState({ ...userData, profilePicture: decodedUrl }));
        return response.data;
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}

export function deleteAndUpdatePhotographerProfilePicture(profilePicture) {
  return async (dispatch, getState) => {
    try {
      const response = await PhotographersAPI.createPhotographerProfilePicture(profilePicture);
      if (response.data) {
        dispatch(getPhotographerProfilePicture());
        return response.data;
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}

export function fetchUserPhotographer() {
  return async (dispatch) => {
    try {
      if (localStorage.token) {
        const decodedJWT = jwt.decode(localStorage.token);
        const { authorities } = decodedJWT;
        const response = await PhotographersAPI.fetchMePhotographer();
        if (response && response.data) {
          const { data: userData } = response;
          const { user } = userData;
          const photographerData = _.omit(userData, 'user');
          dispatch(
            UserActions.saveUserData({
              ...user,
              ...photographerData,
              isBoom: false,
              isPhotographer: true,
              authorities,
            }),
            true
          );
          const userLanguage = user.language;
          if (userLanguage) {
            const languageToSet = LANGUAGE_LOCAL_MAP[userLanguage];
            dispatch(UtilsActions.setLanguage(languageToSet ? languageToSet.translation : DEFAULT_LANGUAGE));
          }
          try {
            await dispatch(getPhotographerProfilePicture());
          } catch (error) {}
          return userData;
        }
        throw new Error();
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}

export function getPhotographerPicture(photographer) {
  return async (dispatch, getState) => {
    const response = await PhotographersAPI.fetchPhotographerPicture(photographer.id);
    if (response.data) {
      const decodedUrl = URL.createObjectURL(response.data);
      return decodedUrl;
    }
  };
}

export function fetchPhotographersAndPhotos(page = 0, pageSize = 10) {
  return async (dispatch, getState) => {
    const {
      photographers: {
        data: { filters },
      },
    } = getState();
    const params = {
      ...filters,
      page,
      pageSize,
    };
    const response = await PhotographersAPI.fetchPhotographers(params);
    if (response && response.data && response.data.content) {
      const photographersFetched = response.data.content;
      const approvationCalls = _.map(photographersFetched, async (photographer) => {
        try {
          const companyLogo = await dispatch(getPhotographerPicture(photographer));
          dispatch(updatePhotographerInState({ ...photographer, picture: companyLogo }));
          return { ...photographer, logo: companyLogo };
        } catch (error) {
          dispatch(updatePhotographerInState(photographer));
          return photographer;
        }
      });
      await Promise.all(approvationCalls);
      dispatch(savePhotographersPagination(_.omit(response.data, 'content')));
      return response.data;
    }
  };
}
