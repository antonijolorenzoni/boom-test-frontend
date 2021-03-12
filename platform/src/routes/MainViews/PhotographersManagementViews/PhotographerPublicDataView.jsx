//
// ──────────────────────────────────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: P H O T O G R A P H E R   L E N S E S   A N D   B I O   V I E W : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────────────────────────────────────────────────────
//

import { withStyles } from '@material-ui/core';
import Chip from '@material-ui/core/Chip';
import Divider from '@material-ui/core/Divider';
import LensIcon from '@material-ui/icons/Camera';
import CameraIcon from '@material-ui/icons/CameraEnhance';
import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import translations from '../../../translations/i18next';

const styles = (theme) => ({
  container: {
    margin: 20,
    marginTop: 40,
    paddingTop: 20,
  },
  sectionContainer: {
    marginBottom: 10,
  },
  title: {
    marginTop: 0,
    marginBottom: 10,
    color: 'black',
    fontWeight: 'bold',
  },
  description: {
    marginTop: 10,
    marginBottom: 10,
    color: 'black',
    fontWeight: '100',
  },
  statusTag: {
    marginRight: 10,
    marginTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
});

const PhotographerPublicDataView = ({ classes, photographer }) => {
  const cameras = _.filter(photographer.cameras, (camera) => camera.model);
  const lenses = _.filter(photographer.lenses, (lens) => lens.model);
  return (
    <div>
      {photographer.address && photographer.address.formattedAddress && (
        <div className={classes.sectionContainer}>
          <h4 className={classes.title}>{translations.t('forms.address')}</h4>
          <h5 className={classes.description}>{photographer.address.formattedAddress}</h5>
          <Divider />
        </div>
      )}
      {cameras && !_.isEmpty(cameras) && (
        <div className={classes.sectionContainer}>
          <h4 className={classes.title}>{translations.t('forms.cameras')}</h4>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            {_.map(cameras, (camera) => (
              <div>{camera.model && <Chip className={classes.statusTag} color="primary" label={camera.model} icon={<CameraIcon />} />}</div>
            ))}
          </div>
          <Divider style={{ marginTop: 10 }} />
        </div>
      )}
      {lenses && !_.isEmpty(lenses) && (
        <div className={classes.sectionContainer}>
          <h4 className={classes.title}>{translations.t('forms.lenses')}</h4>
          <div>
            {_.map(lenses, (lens) => (
              <div style={{ margin: 5, display: 'inline-block' }}>
                {lens.model && <Chip className={classes.statusTag} color="primary" label={lens.model} icon={<LensIcon />} />}
              </div>
            ))}
          </div>
          <Divider style={{ marginTop: 10 }} />
        </div>
      )}
      {photographer.shortBio && (
        <div>
          <h4 className={classes.title}>{translations.t('forms.bio')}</h4>
          <h5 className={classes.description}>{photographer.shortBio}</h5>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  users: state.users,
});

export default connect(mapStateToProps)(withStyles(styles)(PhotographerPublicDataView));
