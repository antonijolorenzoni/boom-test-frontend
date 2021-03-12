//
// ────────────────────────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: E V E N T   R O W   G E N E R I C   C O M P O N E N T : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────────────────────────────────────────
//

import React from 'react';
import { connect } from 'react-redux';
import ShootingsEventRow from './ShootingsEventRow';
import AvailabiltyEventRow from './AvailabilityEventRow';

const rowComponents = {
  SHOOTINGS_EVENT_ROW: ShootingsEventRow,
  AVAILABILITY_EVENT_ROW: AvailabiltyEventRow,
};

const EventRow = (props) => {
  const { event } = props;
  const Component = event && event.code ? rowComponents.SHOOTINGS_EVENT_ROW : rowComponents.AVAILABILITY_EVENT_ROW;
  return <Component {...props} />;
};

export default connect()(EventRow);
