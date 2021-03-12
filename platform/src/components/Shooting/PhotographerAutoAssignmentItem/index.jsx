import React from 'react';
import cn from 'classnames';
import { withStyles, Grid } from '@material-ui/core';

import translations from '../../../translations/i18next';
import PositionIndicator from '../PositionIndicator';
import { styles } from './styles';
import { AUTO_ASSIGNMENT_STATUSES } from '../../../config/consts';

const PhotographerAutoAssignmentItem = ({ position, id, name, status, shootingStatus, classes }) => {
  const { DEFAULT, INSERTED, ELAPSED, FREEZED, INVITED, REFUSED } = AUTO_ASSIGNMENT_STATUSES;

  const additionalWrapperStyle = {
    [classes.defaultInvitedWrapper]: status === DEFAULT || INVITED,
    [classes[`insertedWrapper_${shootingStatus}`]]: status === INSERTED,
    [classes.refusedElapsedFreezedWrapper]: status === REFUSED || status === ELAPSED || status === FREEZED,
  };

  const additionalNameStyle = {
    [classes.invitedName]: status === INVITED,
    [classes.defaultName]: status === DEFAULT,
    [classes.insertedName]: status === INSERTED,
    [classes.refusedOrElapsedName]: status === REFUSED || status === ELAPSED,
    [classes.freezedName]: status === FREEZED,
  };

  const additionalIdStyle = {
    [classes.insertedId]: status === INSERTED,
    [classes.refusedOrElapsedId]: status === REFUSED || status === ELAPSED,
    [classes.freezedId]: status === FREEZED,
  };

  const additionalStatusStyle = {
    [classes.insertedStatus]: status === INSERTED,
    [classes.refusedElapsedFreezedStatus]: status === REFUSED || status === ELAPSED || status === FREEZED,
  };

  return (
    <Grid container alignItems="center" className={cn(classes.wrapper, additionalWrapperStyle)}>
      <Grid item md={1}>
        <PositionIndicator shootingStatus={shootingStatus} position={position} status={status} />
      </Grid>
      <Grid direction="column" container item md={5} className={classes.idNameWrapper}>
        <Grid item className={cn(classes.id, additionalIdStyle)}>
          {`ID-${`00000${id}`.slice(-6)}`}
        </Grid>
        <Grid item className={cn(classes.name, additionalNameStyle)}>
          {name}
        </Grid>
      </Grid>
      {status !== DEFAULT && (
        <Grid item className={cn(classes.status, additionalStatusStyle)}>
          {translations.t(`autoAssignmentStatuses.${status}`)}
        </Grid>
      )}
    </Grid>
  );
};

export default withStyles(styles)(PhotographerAutoAssignmentItem);
