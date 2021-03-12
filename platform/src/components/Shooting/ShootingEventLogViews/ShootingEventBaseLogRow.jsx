import _ from 'lodash';
import React from 'react';
import ShootingConfirmedLogRow from './ShootingEventLogRowViews/ShootingConfirmedLogRow';
import ShootingUploadedLogRow from './ShootingEventLogRowViews/ShootingUploadedLogRow';
import ShootingMatchedLogRow from './ShootingEventLogRowViews/ShootingMatchedLogRow';
import ShootingReshootLogRow from './ShootingEventLogRowViews/ShootingReshootLogRow';
import ShootingNoPhotographerLogRow from './ShootingEventLogRowViews/ShootingNoPhotographerLogRow';
import ShootingCanceledLogRow from './ShootingEventLogRowViews/ShootingCanceledLogRow';
import ShootingRequestedLogRow from './ShootingEventLogRowViews/ShootingRequestedLogRow';
import InvoiceItemDeletedLogRow from './ShootingEventLogRowViews/InvoiceItemDeletedLogRow';
import InvoiceItemCreatedLogRow from './ShootingEventLogRowViews/InvoiceItemCreatedLogRow';
import ShootingAssignedLogRow from './ShootingEventLogRowViews/ShootingAssignedLogRow';
import ShootingUnmatchedLogRow from './ShootingEventLogRowViews/ShootingUnmatchedLogRow';
import ShootingAcceptedLogRow from './ShootingEventLogRowViews/ShootingAcceptedLogRow';
import ShootingUnassignedLogRow from './ShootingEventLogRowViews/ShootingUnassignedLogRow';
import ShootingRescheduledLogRow from './ShootingEventLogRowViews/ShootingRescheduledLogRow';
import ShootingStartRemindedLogRow from './ShootingEventLogRowViews/ShootingStartRemindedLogRow';
import CompanyReschedulePenaltyLogRow from './ShootingEventLogRowViews/CompanyReschedulePenaltyLogRow';
import ShootingRefusedEventLogRow from './ShootingEventLogRowViews/ShootingRefusedEventLogRow';
import PhotographerRefusedPenaltyLogRow from './ShootingEventLogRowViews/PhotographerRefusedPenaltyLogRow';
import ShootingPhotoRefusedLogRow from './ShootingEventLogRowViews/ShootingPhotoRefusedLogRow';
import ShootingPhotoAcceptedLogRow from './ShootingEventLogRowViews/ShootingPhotoAcceptedLogRow';
import ShootingCompletedLogRow from './ShootingEventLogRowViews/ShootingCompletedLogRow';
import ShootingDownloadedLogRow from './ShootingEventLogRowViews/ShootingDownloadedLogRow';
import ShootingArchivedLogRow from './ShootingEventLogRowViews/ShootingArchivedLogRow';
import { HIDDEN_EVEN_TYPE_BOOM } from '../../../config/consts';
import ShootingFirstAcceptedLogRow from './ShootingEventLogRowViews/ShootingFirstAcceptedLogRow';
import ShootingInviteReminderLogRow from './ShootingEventLogRowViews/ShootingInviteReminderLogRow';
import ShootingAssigneeAdminLogRow from './ShootingEventLogRowViews/ShootingAssigneeAdminLogRow';
import ShootingUnAssigneeAdminLogRow from './ShootingEventLogRowViews/ShootingUnAssigneeAdminLogRow';
import ShootingHasScheduledLogRow from './ShootingEventLogRowViews/ShootingHasScheduledLogRow';
import ShootingCreationOpenDateLogRow from './ShootingEventLogRowViews/ShootingCreationOpenDateLogRow';
import ShootingEditingMovedInternallyLogRow from './ShootingEventLogRowViews/ShootingEditingMovedInternallyLogRow';
import ShootingUploadedExtLogRow from './ShootingEventLogRowViews/ShootingUploadedExtLogRow';
import ShootingPhotoAcceptedAutoLogRow from './ShootingEventLogRowViews/ShootingPhotoAcceptedAutoLogRow';
import ShootingUnscheduledCanceledLogRow from './ShootingEventLogRowViews/ShootingUnscheduledCanceledLogRow';
import { EditingPipelineZippedLogRow } from './ShootingEventLogRowViews/EditingPipelineZippedLogRow';
import i18next from 'i18next';
import moment from "moment"

const statusViewComponents = {
  SHOOTING_ASSIGNED: ShootingAssignedLogRow,
  SHOOTING_ARCHIVED: ShootingArchivedLogRow,
  SHOOTING_ACCEPTED: ShootingAcceptedLogRow,
  SHOOTING_UNASSIGNED: ShootingUnassignedLogRow,
  SHOOTING_UNMATCHED: ShootingUnmatchedLogRow,
  SHOOTING_UPLOADED: ShootingUploadedLogRow,
  SHOOTING_UPLOADED_EXT: ShootingUploadedExtLogRow,
  SHOOTING_MATCHED: ShootingMatchedLogRow,
  SHOOTING_RESHOOT: ShootingReshootLogRow,
  UPCOMING_SHOOTING_NO_PHOTOGRAPHER: ShootingNoPhotographerLogRow,
  SHOOTING_CANCELED: ShootingCanceledLogRow,
  SHOOTING_REQUESTED: ShootingRequestedLogRow,
  SHOOTING_CONFIRMED: ShootingConfirmedLogRow,
  INVOICE_ITEM_DELETED: InvoiceItemDeletedLogRow,
  INVOICE_ITEM_CREATED: InvoiceItemCreatedLogRow,
  SHOOTING_RESCHEDULED: ShootingRescheduledLogRow,
  SHOOTING_START_REMINDER: ShootingStartRemindedLogRow,
  COMPANY_RESCHEDULE_PENALTY: CompanyReschedulePenaltyLogRow,
  SHOOTING_REFUSED: ShootingRefusedEventLogRow,
  PHOTOGRAPHER_SHOOTING_REFUSED_PENALTY: PhotographerRefusedPenaltyLogRow,
  SHOOTING_PHOTO_REFUSED: ShootingPhotoRefusedLogRow,
  SHOOTING_PHOTO_ACCEPTED: ShootingPhotoAcceptedLogRow,
  SHOOTING_COMPLETED: ShootingCompletedLogRow,
  SHOOTING_DOWNLOADED: ShootingDownloadedLogRow,
  SHOOTING_FIRST_ACCEPTED: ShootingFirstAcceptedLogRow,
  SHOOTING_INVITE_REMINDER: ShootingInviteReminderLogRow,
  ORDER_ASSIGNED: ShootingAssigneeAdminLogRow,
  ORDER_UN_ASSIGNED: ShootingUnAssigneeAdminLogRow,
  ORDER_AVAILABILITIES_ADDED: ShootingHasScheduledLogRow,
  ORDER_OPEN_DATE_REQUESTED: ShootingCreationOpenDateLogRow,
  PHOTO_EDITING_MOVED_INTERNALLY: ShootingEditingMovedInternallyLogRow,
  SHOOTING_PHOTO_ACCEPTED_AUTO: ShootingPhotoAcceptedAutoLogRow,
  SHOOTING_UNSCHEDULED_CANCELED: ShootingUnscheduledCanceledLogRow,
  EDITING_PIPELINE_ZIPPED: EditingPipelineZippedLogRow,
  PHOTOGRAPHER_SHOOTING_RESHOOT_PENALTY: () => null,
};
/*
 * This component will render the right event log row
 * depending on the event.type variable
 */
const ShootingEventBaseLogRow = (props) => {
  const { event, isBoom, shooting } = props;

  moment.locale(i18next.languages[0]);

  if (!event || _.isEmpty(event)) {
    return null;
  }

  // COMPANY_RESCHEDULE_PENALTY and COMPANY_SHOOTING_REFUND handled with a specific INVOICE_ITEM_CREATED event.
  if (isBoom && event.type in HIDDEN_EVEN_TYPE_BOOM) {
    return null;
  }
  const Component = statusViewComponents[event.type];
  if (!Component) {
    return <h4>{event.type}</h4>;
  }
  return (
    <div style={{ marginTop: 15, marginBottom: 15 }}>
      <Component isBoom={isBoom} shooting={shooting} key={event.id} event={event} {...props} />
    </div>
  );
};

export default ShootingEventBaseLogRow;
