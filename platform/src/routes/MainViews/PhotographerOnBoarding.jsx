//
// ──────────────────────────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: P H O T O G R A P H E R   O N B O A R D I N G   V I E W : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────────────────────────────────────────────
//

import { Step, StepLabel, Stepper, Typography, withStyles } from '@material-ui/core';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { initialize, change, submit } from 'redux-form';

import { PhotographerAccountForm } from 'components/Forms/ReduxForms/Photographers/PhotographerAccountForm';
import PhotographerPhotosForm from 'components/Forms/ReduxForms/Photographers/PhotographerPhotosForm';
import PhotographerProfileForm from 'components/Forms/ReduxForms/Photographers/PhotographerProfileForm';
import ProfilePictureForm from 'components/Forms/ReduxForms/Profile/ProfilePictureForm';
import MDButton from 'components/MDButton/MDButton';
import * as PhotographersActions from 'redux/actions/photographers.actions';
import * as UtilsActions from 'redux/actions/utils.actions';
import * as ModalsActions from 'redux/actions/modals.actions';
import translations from 'translations/i18next';

const styles = (theme) => ({
  container: {
    paddingLeft: 40,
    paddingRight: 40,
    paddingTop: 20,
    paddingBottom: 20,
    height: '100vh',
    overflow: 'scroll',
  },
  layout: {
    width: 'auto',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(900 + theme.spacing.unit * 3 * 2)]: {
      width: 900,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  root: {
    width: '90%',
  },
  button: {
    marginRight: theme.spacing.unit,
  },
  instructions: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
});

function getSteps() {
  return [
    translations.t('onBoarding.uploadProfilePicture'),
    translations.t('onBoarding.checkAccountInfo'),
    translations.t('onBoarding.addPhotoInfo'),
    translations.t('onBoarding.addProfileInfo'),
  ];
}

class PhotographerOnBoarding extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeStep: 0,
    };
  }

  async componentWillMount() {
    const {
      user: { data: userData },
      dispatch,
    } = this.props;

    const personalPhotoTypes = _.map(userData.photoTypes, (photoType) => photoType.id);
    dispatch(initialize('PhotographerPhotosForm', { ...userData, photoTypes: personalPhotoTypes }));
    dispatch(initialize('ProfilePictureForm', { profilePicture: userData.profilePicture }));
  }

  async onUpdatePhoto(photoData) {
    const { dispatch } = this.props;
    const { activeStep } = this.state;
    try {
      if (photoData.profilePicture && _.isArray(photoData.profilePicture)) {
        dispatch(UtilsActions.setSpinnerVisibile(true));
        const photo = _.first(photoData.profilePicture);
        await dispatch(PhotographersActions.deleteAndUpdatePhotographerProfilePicture(photo));
        dispatch(UtilsActions.setSpinnerVisibile(false));
        dispatch(
          ModalsActions.showModal('PROFILE_PICTURE_UPLOAD_SUCCESS', {
            modalType: 'SUCCESS_ALERT',
            modalProps: {
              message: translations.t('photographers.modifyProfilePictureSuccess'),
            },
          })
        );
      }
      this.setState({
        activeStep: activeStep + 1,
      });
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
  }

  async onModifyPhotographer(photographerData) {
    const { dispatch, history } = this.props;
    const { activeStep } = this.state;

    try {
      dispatch(UtilsActions.setSpinnerVisibile(true));
      await dispatch(PhotographersActions.modifyPhotographerPersonalData(_.omit(photographerData, 'photoTypes')));
      await dispatch(PhotographersActions.fetchUserPhotographer());
      if (activeStep === 3) {
        history.push('/');
      } else {
        this.initializeProfileForm();
        this.setState({
          activeStep: activeStep + 1,
        });
      }

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
  }

  async onAddCameraType(cameraType) {
    const { dispatch } = this.props;
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
        dispatch(UtilsActions.setSpinnerVisibile(true));
        const newUserData = await dispatch(PhotographersActions.updatePhotographerCameras(cameraType));
        dispatch(change('PhotographerPhotosForm', 'cameras', newUserData.cameras));
        dispatch(UtilsActions.setSpinnerVisibile(false));
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
      dispatch(UtilsActions.setSpinnerVisibile(false));
    }
  }

  async onAddCameraLens(cameraLens) {
    const { dispatch } = this.props;
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
        dispatch(UtilsActions.setSpinnerVisibile(true));
        const newUserData = await dispatch(PhotographersActions.updatePhotographerLenses(cameraLens));
        dispatch(change('PhotographerPhotosForm', 'lenses', newUserData.lenses));
        dispatch(UtilsActions.setSpinnerVisibile(false));
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
      dispatch(UtilsActions.setSpinnerVisibile(false));
    }
  }

  async onRemoveCameraType(cameraType) {
    const { dispatch } = this.props;
    try {
      dispatch(UtilsActions.setSpinnerVisibile(true));
      const newUserData = await dispatch(PhotographersActions.deletePhotographerCamera(cameraType));
      dispatch(change('PhotographerPhotosForm', 'cameras', newUserData.cameras));
      dispatch(UtilsActions.setSpinnerVisibile(false));
    } catch (error) {
      dispatch(UtilsActions.setSpinnerVisibile(false));
    }
  }

  async onRemoveCameraLens(cameraLens) {
    const { dispatch } = this.props;
    try {
      dispatch(UtilsActions.setSpinnerVisibile(true));
      const newUserData = await dispatch(PhotographersActions.deletePhotographerLens(cameraLens));
      dispatch(change('PhotographerPhotosForm', 'lenses', newUserData.lenses));
      dispatch(UtilsActions.setSpinnerVisibile(false));
    } catch (error) {
      dispatch(UtilsActions.setSpinnerVisibile(false));
    }
  }

  onUpdatePhotoTypes(photoTypes) {
    const { dispatch } = this.props;
    dispatch(PhotographersActions.modifyPhotographerPersonalData({ photoTypes }));
  }

  getStepContent(step) {
    const {
      dispatch,
      user: { data: userData },
    } = this.props;
    switch (step) {
      case 0:
        return (
          <div>
            <ProfilePictureForm
              isOnBoarding
              user={userData}
              onSubmit={(photographerAccountData) => this.handleNext(photographerAccountData)}
            />
            <MDButton
              title={translations.t('forms.skip')}
              backgroundColor="#b1b9c1"
              containerstyle={{ marginBottom: 20, width: '10%', marginLeft: '90%' }}
              onClick={() => this.handleNext()}
            />
          </div>
        );
      case 1:
        const { email, firstName, lastName, language, phoneNumber } = userData;
        return (
          <div style={{ padding: 60 }}>
            <PhotographerAccountForm
              email={email}
              firstName={firstName}
              lastName={lastName}
              language={language}
              phoneNumber={phoneNumber}
              onSubmit={this.handleNext}
            />
          </div>
        );
      case 2:
        return (
          <div>
            <PhotographerPhotosForm
              photoTypes={_.sortBy(userData.photoTypes, (photoType) => photoType.id)}
              lenses={userData.lenses}
              cameras={userData.cameras}
              onAddCameraType={(cameraType) => this.onAddCameraType(cameraType)}
              onAddCameraLens={(cameraLens) => this.onAddCameraLens(cameraLens)}
              onRemoveCameraType={(cameraType) => this.onRemoveCameraType(cameraType)}
              onRemoveCameraLens={(cameraLens) => this.onRemoveCameraLens(cameraLens)}
              onSelectPhotoTypes={(photoType) => this.onUpdatePhotoTypes(photoType)}
              onSubmit={() => this.handleNext()}
            />
            <MDButton
              title={translations.t('forms.save')}
              backgroundColor="#5AC0B1"
              containerstyle={{ marginBottom: 100 }}
              onClick={() => dispatch(submit('PhotographerPhotosForm'))}
            />
          </div>
        );
      case 3:
        return <PhotographerProfileForm isOnBoarding onSubmit={(photographerProfileData) => this.handleNext(photographerProfileData)} />;
      default:
        return 'Unknown step';
    }
  }

  handleNext = (values) => {
    const { activeStep } = this.state;
    const { form } = this.props;

    switch (activeStep) {
      case 0:
        this.onUpdatePhoto(form.ProfilePictureForm.values);
        break;
      case 1:
        this.onModifyPhotographer(values);
        break;
      case 3:
        this.onModifyPhotographer(form.PhotographerProfileForm.values);
        break;
      default:
        this.setState({
          activeStep: activeStep + 1,
        });
        break;
    }
  };

  initializeProfileForm() {
    const {
      dispatch,
      user: { data: userData },
    } = this.props;
    dispatch(initialize('PhotographerProfileForm', userData));
  }

  render() {
    const { classes } = this.props;
    const { activeStep } = this.state;

    const steps = getSteps();
    return (
      <div className={classes.container}>
        <main className={classes.layout}>
          <h2 style={{ margin: 20, textAlign: 'center' }}>{translations.t('login.welcomeToBoom')}</h2>
          <h3 style={{ margin: 20, marginBottom: 50, textAlign: 'center' }}>{translations.t('login.completeProfile')}</h3>
          <Stepper activeStep={activeStep}>
            {steps.map((label, index) => {
              const props = {};
              const labelProps = {};
              return (
                <Step key={label} {...props}>
                  <StepLabel {...labelProps}>{label}</StepLabel>
                </Step>
              );
            })}
          </Stepper>
          <div style={{ margin: 20 }}>
            <div>
              <Typography className={classes.instructions}>{this.getStepContent(activeStep)}</Typography>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

PhotographerOnBoarding.propTypes = {
  user: PropTypes.shape({}).isRequired,
  dispatch: PropTypes.func.isRequired,
  classes: PropTypes.shape({}).isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
  form: state.form,
});

export default _.flow([connect(mapStateToProps), withStyles(styles), withRouter])(PhotographerOnBoarding);
