//
// ──────────────────────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: A L L   S H O O T I N G   S T A T U S E S   V I E W : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────────────────────────────────────────
//

import _ from 'lodash';
import React from 'react';

import { ShootingAcceptedView } from './ShootingAcceptedView';
import ShootingPostProcessingView from './ShootingPostProcessing';
import ShootingUploadedView from './ShootingUploadedView';
import { ShootingCanceledView } from './ShootingCanceledView';
import { ShootingRefusedView } from './ShootingRefusedView';
import { ShootingToReshootView } from './ShootingToReshootView';
import ShootingDoneView from './ShootingDoneView';
import ShootingMatchedView from './ShootingMatchedView';
import ShootingNewView from './ShootingNewView';
import ShootingArchivedView from './ShootingArchivedView';
import ShootingAutoAssignmentView from './ShootingAutoAssignmentView';
import ShootingPendingView from './ShootingPendingView';
import { ShootingUnscheduledView } from './ShootingUnscheduledView';
import { ShootingAcceptedView_REFACTOR } from './ShootingAcceptedView_REFACTOR';
import { featureFlag } from 'config/featureFlags';
import { ShootingRefusedView_REFACTOR } from './ShootingRefusedView_REFACTOR';

const getViewByStatus = (status) => {
  const isA2bEnabled = featureFlag.isFeatureEnabled('upload-a2-b');

  const statusViewComponents = {
    NEW: ShootingNewView,
    UNSCHEDULED: ShootingUnscheduledView,
    AUTO_ASSIGNMENT: ShootingAutoAssignmentView,
    ASSIGNED: ShootingAutoAssignmentView,
    PENDING: ShootingPendingView,
    MATCHED: ShootingMatchedView,
    ACCEPTED: isA2bEnabled ? ShootingAcceptedView_REFACTOR : ShootingAcceptedView,
    UPLOADED: ShootingUploadedView,
    POST_PROCESSING: ShootingPostProcessingView,
    DOWNLOADED: ShootingDoneView,
    DONE: ShootingDoneView,
    REFUSED: isA2bEnabled ? ShootingRefusedView_REFACTOR : ShootingRefusedView,
    RESHOOT: ShootingToReshootView,
    CANCELED: ShootingCanceledView,
    ARCHIVED: ShootingArchivedView,
  };

  return statusViewComponents[status];
};

/*
 * This component will render the right shooting status view
 * depending on the shooting.state variable.
 */
const ShootingStatusView = (props) => {
  const { shooting } = props;
  if (!shooting || _.isEmpty(shooting)) {
    return null;
  }
  const Component = getViewByStatus(shooting.state);
  return <Component key={shooting.id} shooting={shooting} {...props} />;
};

export default ShootingStatusView;
