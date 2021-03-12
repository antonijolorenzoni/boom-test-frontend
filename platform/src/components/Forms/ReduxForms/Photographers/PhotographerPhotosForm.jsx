import { Grid, IconButton, InputAdornment, withStyles } from '@material-ui/core';
import Chip from '@material-ui/core/Chip';
import Divider from '@material-ui/core/Divider';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import CameraIcon from '@material-ui/icons/CameraEnhance';
import ClearIcon from '@material-ui/icons/Clear';
import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { change, Field, reduxForm } from 'redux-form';
import translations from '../../../../translations/i18next';
import MDTextInputField from '../../FormComponents/MDTextInput/MDTextInputField';

const validate = (values) => {
  const errors = {};
  if (!values.lenses) {
    errors.lensInput = 'required';
  } else if (_.isEmpty(values.lenses)) {
    errors.lensInput = 'required';
  }
  if (!values.cameras) {
    errors.camerasInput = 'required';
  } else if (_.isEmpty(values.cameras)) {
    errors.camerasInput = 'required';
  }
  return errors;
};

const styles = (theme) => ({
  formContainer: {
    margin: 20,
    marginTop: 20,
  },
  title: {
    margin: 0,
    marginTop: 20,
  },
  headerTitle: {
    marginLeft: 20,
  },
  subtitle: {
    margin: 0,
    fontWeight: '100',
    marginBottom: 20,
  },
  enabledText: {
    color: '#66c0b0',
    margin: 0,
  },
  disabledText: {
    color: 'red',
    margin: 0,
  },
  statusContainer: {
    marginLeft: 10,
    marginBottom: 20,
  },
  statusTag: {
    marginTop: 10,
    marginRight: 10,
    paddingLeft: 10,
    paddingRight: 10,
    color: 'white',
  },
  iconButton: {
    padding: 5,
    borderRadius: 4,
    background: '#74beb2',
    right: 11,
  },
  tag: {
    margin: theme.spacing.unit,
    marginTop: 10,
    height: 40,
    fontSize: '1.2em',
    display: 'inline-flex',
    alignItems: 'center',
    background: '#74beb2',
    borderRadius: 4,
    padding: '0px 15px',
    color: 'white',
  },
  tagTitle: {
    fontWeight: 100,
    margin: 0,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
    cursor: 'pointer',
  },
  profileContainer: {
    display: 'flex',
  },
  homeIcon: {
    marginRight: 10,
  },
});

const theme = createMuiTheme({
  palette: {
    primary: { 500: '#5AC0B1' },
    secondary: { main: '#CC0033' },
  },
  typography: {
    useNextVariants: true,
  },
});

class PhotographerPhotosForm extends React.Component {
  constructor(props) {
    super(props);
    const initial = props && props.form && props.form.initial;
    this.state = {
      cameras: initial.cameras,
      lenses: initial.lenses,
    };
  }

  renderTag = (list, value) => {
    const { classes } = this.props;
    return (
      <div className={classes.tag} key={value.id}>
        <h5 className={classes.tagTitle}>{value.model || ''}</h5>
        <ClearIcon className={classes.rightIcon} onClick={() => this.removeTagHandler(list, value.id || value)} />
      </div>
    );
  };

  removeTagHandler(field, value) {
    const { onRemoveCameraType, onRemoveCameraLens } = this.props;
    if (field === 'cameras') {
      onRemoveCameraType(value);
    } else {
      onRemoveCameraLens(value);
    }
  }

  addTagHandler(field) {
    const { dispatch, onAddCameraType, onAddCameraLens, form } = this.props;
    if (field === 'cameras') {
      const newCameraValue = form && form.values && form.values.camerasInput;
      if (newCameraValue) {
        onAddCameraType([{ model: newCameraValue }]);
        dispatch(change('PhotographerPhotosForm', 'camerasInput', null));
      }
    } else {
      const lensValues = form && form.values && form.values.lensInput;
      if (lensValues) {
        onAddCameraLens([{ model: lensValues }]);
        dispatch(change('PhotographerPhotosForm', 'lensInput', null));
      }
    }
  }

  render() {
    const { classes, photoTypes, cameras: camerasValues, lenses: lensValues } = this.props;
    return (
      <MuiThemeProvider theme={theme}>
        <div className={classes.formContainer}>
          <h4 className={classes.title} style={{ margin: 0, marginBottom: 10 }}>
            {translations.t('forms.camerasAndLenses')}
          </h4>
          <Grid container spacing={16}>
            <Grid item xs={12} md={5}>
              <Field
                name="camerasInput"
                component={MDTextInputField}
                label={translations.t('profile.cameras')}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton className={classes.iconButton} onClick={camerasValues ? () => this.addTagHandler('cameras') : null}>
                        {<AddIcon style={{ color: 'white' }} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                  style: {
                    paddingRight: 0,
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={7}>
              {_.map(camerasValues, (camera, index) => this.renderTag('cameras', camera, index))}
            </Grid>
            <Grid item xs={12} md={5}>
              <Field
                name="lensInput"
                component={MDTextInputField}
                label={translations.t('profile.lens')}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton className={classes.iconButton} onClick={lensValues ? () => this.addTagHandler('lenses') : null}>
                        {<AddIcon style={{ color: 'white' }} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                  style: {
                    paddingRight: 0,
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={7}>
              {_.map(lensValues, (lens, index) => this.renderTag('lenses', lens, index))}
            </Grid>
          </Grid>
          <Divider />
          {!_.isEmpty(photoTypes) && (
            <div>
              <h4 className={classes.title} style={{ marginBottom: 10 }}>
                {translations.t('forms.photoTypesPhotographer')}
              </h4>
              {_.map(photoTypes, (photoType) => (
                <Chip
                  className={classes.statusTag}
                  color="primary"
                  label={translations.t(`photoTypes.${photoType.type}`)}
                  icon={<CameraIcon />}
                />
              ))}
            </div>
          )}
        </div>
      </MuiThemeProvider>
    );
  }
}

const mapStateToProps = (state) => ({
  form: state.form.PhotographerPhotosForm,
  companies: state.companies,
});

export default _.flow([
  connect(mapStateToProps),
  reduxForm({
    form: 'PhotographerPhotosForm',
    validate,
    destroyOnUnmount: false,
  }),
  withStyles(styles),
])(PhotographerPhotosForm);
