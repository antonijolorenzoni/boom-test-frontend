//
// ────────────────────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: P H O T O G R A P H E R   P R O F I L E   V I E W : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────────────────────────────────────
//

import React, { useEffect, useState } from 'react';
import { Grid, Tab, withStyles } from '@material-ui/core';
import _ from 'lodash';
import { withRouter } from 'react-router-dom';
import { initialize } from 'redux-form';
import PhotographerPhotosForm from '../../components/Forms/ReduxForms/Photographers/PhotographerPhotosForm';
import PhotographerProfileForm from '../../components/Forms/ReduxForms/Photographers/PhotographerProfileForm';
import { PhotographerAccountForm } from 'components/Forms/ReduxForms/Photographers/PhotographerAccountForm';
import ProfilePictureCard from '../../components/Forms/ReduxForms/Profile/ProfilePictureCard';
import MDTabs from '../../components/MDTabs/MDTabs';
import ProfileRatingView from '../../components/Photographers/ProfileRatingView';
import RatingExplanationView from '../../components/Photographers/RatingExplanationView';
import * as PhotographersActions from '../../redux/actions/photographers.actions';
import * as UserActions from '../../redux/actions/user.actions';
import * as UtilsActions from '../../redux/actions/utils.actions';
import * as ModalsActions from '../../redux/actions/modals.actions';
import translations from '../../translations/i18next';
import { useDispatch, useSelector } from 'react-redux';

const styles = (theme) => ({
  layout: {
    width: 'auto',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(1300 + theme.spacing.unit * 3 * 2)]: {
      width: 1300,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  versionText: {
    textAlign: 'center',
    color: '#80888d',
    fontWeight: 100,
    fontSize: 12,
  },
});

const PhotographerProfileView = ({ classes, history }) => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user.data);

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeData = async () => {
      const personalPhotoTypes = _.map(userData.photoTypes, (photoType) => photoType.id);
      const selectedAddress = [
        {
          value: userData.address,
          label: userData.address.formattedAddress,
        },
      ];
      await dispatch(initialize('PhotographerProfileForm', { ...userData, addressSelected: selectedAddress }));
      await dispatch(initialize('PhotographerPhotosForm', { ...userData, photoTypes: personalPhotoTypes }));
      await dispatch(initialize('ProfilePictureForm', { profilePicture: userData.profilePicture }));
      setIsInitialized(true);
    };

    const address = _.get(userData, 'address');

    if (address && !isInitialized) {
      initializeData();
    }
  }, [userData, isInitialized, dispatch]);

  const onUserLogout = () => {
    dispatch(
      ModalsActions.showModal('LOGOUT_MODAL', {
        modalType: 'MODAL_DIALOG',
        modalProps: {
          title: translations.t('forms.warning'),
          bodyText: translations.t('profile.logoutConfirm'),
          onConfirm: () => onUserLogoutConfirm(),
        },
      })
    );
  };

  const onUserLogoutConfirm = () => {
    dispatch(ModalsActions.hideModal('LOGOUT_MODAL'));
    dispatch(UserActions.userLogout());
    history.push('/login');
  };

  const onModifyPhotographer = async (photographerData) => {
    try {
      dispatch(UtilsActions.setSpinnerVisibile(true));
      await dispatch(PhotographersActions.modifyPhotographerPersonalData(_.omit(photographerData, 'photoTypes')));
      dispatch(PhotographersActions.fetchUserPhotographer());
      dispatch(UtilsActions.setSpinnerVisibile(false));
      dispatch(
        ModalsActions.showModal('USER_MODIFY_ALERT', {
          modalType: 'SUCCESS_ALERT',
          modalProps: {
            message: translations.t('photographers.modifyPhotographerSuccess'),
          },
        })
      );
    } catch (error) {
      dispatch(
        ModalsActions.showModal('USER_MODIFY_ERROR', {
          modalType: 'ERROR_ALERT',
          modalProps: {
            message: translations.t('photographers.photographerModifyError'),
          },
        })
      );
      dispatch(UtilsActions.setSpinnerVisibile(false));
    }
  };

  const onUpdatePhoto = async (photoData) => {
    try {
      dispatch(UtilsActions.setSpinnerVisibile(true));
      if (photoData.profilePicture && _.isArray(photoData.profilePicture)) {
        await dispatch(PhotographersActions.deleteAndUpdatePhotographerProfilePicture(_.first(photoData.profilePicture)));
      }
      dispatch(UtilsActions.setSpinnerVisibile(false));
      dispatch(
        ModalsActions.showModal('PROFILE_PICTURE_UPLOAD_SUCCESS', {
          modalType: 'SUCCESS_ALERT',
          modalProps: {
            message: translations.t('photographers.modifyProfilePictureSuccess'),
          },
        })
      );
    } catch (error) {
      dispatch(UtilsActions.setSpinnerVisibile(false));
      dispatch(
        ModalsActions.showModal('PROFILE_PICTURE_UPLOAD_ERROR', {
          modalType: 'ERROR_ALERT',
          modalProps: {
            message: translations.t('photographers.modifyProfilePictureError'),
          },
        })
      );
    }
  };

  const onAddCameraType = async (cameraType) => {
    try {
      if (cameraType[0].model.length > 255) {
        dispatch(
          ModalsActions.showModal('ADD_CAMERA_TOO_LONG', {
            modalType: 'ERROR_ALERT',
            modalProps: {
              message: translations.t('profile.addCameraTooLong'),
            },
          })
        );
      } else {
        await dispatch(PhotographersActions.updatePhotographerCameras(cameraType));
      }
    } catch (error) {
      dispatch(
        ModalsActions.showModal('ADD_CAMERA_ERROR', {
          modalType: 'ERROR_ALERT',
          modalProps: {
            message: translations.t('profile.addCameraError'),
          },
        })
      );
    }
  };

  const onAddCameraLens = async (cameraLens) => {
    try {
      if (cameraLens[0].model.length > 255) {
        dispatch(
          ModalsActions.showModal('ADD_LENS_TOO_LONG', {
            modalType: 'ERROR_ALERT',
            modalProps: {
              message: translations.t('profile.addLensTooLong'),
            },
          })
        );
      } else {
        await dispatch(PhotographersActions.updatePhotographerLenses(cameraLens));
      }
    } catch (error) {
      dispatch(
        ModalsActions.showModal('ADD_LENS_ERROR', {
          modalType: 'ERROR_ALERT',
          modalProps: {
            message: translations.t('profile.addLensError'),
          },
        })
      );
    }
  };

  const onRemoveCameraType = async (cameraType) => {
    try {
      dispatch(UtilsActions.setSpinnerVisibile(true));
      await dispatch(PhotographersActions.deletePhotographerCamera(cameraType));
      dispatch(UtilsActions.setSpinnerVisibile(false));
    } catch (error) {
      dispatch(UtilsActions.setSpinnerVisibile(false));
    }
  };

  const onRemoveCameraLens = async (cameraLens) => {
    try {
      dispatch(UtilsActions.setSpinnerVisibile(true));
      await dispatch(PhotographersActions.deletePhotographerLens(cameraLens));
      dispatch(UtilsActions.setSpinnerVisibile(false));
    } catch (error) {
      dispatch(UtilsActions.setSpinnerVisibile(false));
    }
  };

  const onUpdatePhotoTypes = (photoTypes) => {
    dispatch(PhotographersActions.modifyPhotographerPersonalData({ photoTypes }));
  };

  const onShowRatingInfo = () => {
    dispatch(
      ModalsActions.showModal('RATING_LEGEND', {
        modalType: 'MODAL_DIALOG',
        modalProps: {
          title: translations.t('profile.rating'),
          content: <RatingExplanationView />,
          cancelText: translations.t('forms.close'),
        },
      })
    );
  };

  const onUpdatePhotographerForm = (photographerAccountData) => {
    const { email } = userData;

    const newEmail = photographerAccountData.email;

    if (newEmail !== email) {
      dispatch(
        ModalsActions.showModal('CONFIRM_CHANGE_EMAIL_MODAL', {
          modalType: 'MODAL_DIALOG',
          modalProps: {
            title: translations.t('forms.warning'),
            bodyText: translations.t('profile.changeEmailWarning', { newEmail, oldEmail: email }),
            onConfirm: () => {
              onModifyPhotographer(photographerAccountData);
              dispatch(ModalsActions.hideModal('CONFIRM_CHANGE_EMAIL_MODAL'));
            },
          },
        })
      );
    } else {
      onModifyPhotographer(photographerAccountData);
    }
  };

  const { email, firstName, lastName, language, phoneNumber } = userData;

  return (
    isInitialized && (
      <div style={{ paddingLeft: 40, paddingRight: 40, paddingTop: 20 }}>
        <main className={classes.layout}>
          <Grid container spacing={32} style={{ marginBottom: 50 }}>
            <Grid item xs={12} md={3}>
              <ProfilePictureCard user={userData} onLogout={() => onUserLogout()} onSubmit={(fotoData) => onUpdatePhoto(fotoData)} />
              <ProfileRatingView user={userData} onShowRatingInfo={() => onShowRatingInfo()} />
              {process.env.REACT_APP_VERSION && (
                <h4 className={classes.versionText}>{`BOOM Imagestudio Platform v ${process.env.REACT_APP_VERSION}`}</h4>
              )}
            </Grid>
            <Grid item xs={12} md={9}>
              <MDTabs
                tabContainers={[
                  <PhotographerAccountForm
                    email={email}
                    firstName={firstName}
                    lastName={lastName}
                    language={language}
                    phoneNumber={phoneNumber}
                    onSubmit={onUpdatePhotographerForm}
                  />,
                  <PhotographerPhotosForm
                    photoTypes={_.sortBy(userData.photoTypes, (photoType) => photoType.id)}
                    lenses={userData.lenses}
                    cameras={userData.cameras}
                    onAddCameraType={(cameraType) => onAddCameraType(cameraType)}
                    onAddCameraLens={(cameraLens) => onAddCameraLens(cameraLens)}
                    onRemoveCameraType={(cameraType) => onRemoveCameraType(cameraType)}
                    onRemoveCameraLens={(cameraLens) => onRemoveCameraLens(cameraLens)}
                    onSelectPhotoTypes={(photoTypes) => onUpdatePhotoTypes(photoTypes)}
                  />,
                  <PhotographerProfileForm photographer={{}} onSubmit={(photographerData) => onModifyPhotographer(photographerData)} />,
                ]}
              >
                <Tab label={translations.t('profile.account')} />
                <Tab label={translations.t('profile.photography')} />
                <Tab label={translations.t('profile.profile')} />
              </MDTabs>
            </Grid>
          </Grid>
        </main>
      </div>
    )
  );
};

export default _.flow([withStyles(styles), withRouter])(PhotographerProfileView);
