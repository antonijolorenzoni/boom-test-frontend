import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { change, Field, reduxForm, submit } from 'redux-form';

import * as ModalsActions from '../../../../redux/actions/modals.actions';
import translations from '../../../../translations/i18next';
import MDButton from '../../../MDButton/MDButton';
import AvatarSelectorField from '../../FormComponents/AvatarSelectorField/AvatarSelectorField';

class ProfilePictureForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isModifying: false,
    };
  }

  render() {
    const { isModifying } = this.state;
    const {
      dispatch,
      user: { firstName, lastName, user },
      isOnBoarding,
    } = this.props;

    const maxSize = 10485760; //10 megabytes

    const onFileRejected = () => dispatch(
      ModalsActions.showModal('USER_MODIFY_ERROR', {
        modalType: 'ERROR_ALERT',
        modalProps: {
          message: translations.t('profile.photoIsTooBig'),
        },
      })
    )

    return (
      <React.Fragment>
        <Field
          name="profilePicture"
          multiple={false}
          component={AvatarSelectorField}
          maxSize={maxSize}
          onFileRejected={onFileRejected}
          onDeleteFile={() => dispatch(change('ProfilePictureForm', 'profilePicture', null))}
          onDropFile={(file) => this.setState({ isModifying: true })}
        />
        {!isOnBoarding && (
          <h4 style={{ fontWeight: 'bold', textAlign: 'center', marginBottom: 0 }}>
            {`${firstName || (user && user.firstName)} ${lastName || (user && user.lastName)}`}
          </h4>
        )}
        {isOnBoarding && !isModifying && (
          <h4 style={{ fontWeight: 'bold', textAlign: 'center', marginBottom: 0 }}>{translations.t('onBoarding.uploadPictureForm')}</h4>
        )}
        {isModifying && (
          <MDButton
            title={translations.t('profile.uploadPic')}
            backgroundColor="#5AC0B1"
            onClick={() => dispatch(submit('ProfilePictureForm'))}
            containerstyle={
              isOnBoarding && {
                width: 200,
                margin: 'auto',
              }
            }
          />
        )}
      </React.Fragment>
    );
  }
}

ProfilePictureForm.getDefaultProps = {
  isOnBoarding: false,
};

ProfilePictureForm.propTypes = {
  user: PropTypes.shape({}).isRequired,
  dispatch: PropTypes.func.isRequired,
  isOnBoarding: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  form: state.form.ProfilePictureForm,
});

export default _.flow([
  connect(mapStateToProps),
  reduxForm({
    form: 'ProfilePictureForm',
  }),
])(ProfilePictureForm);
