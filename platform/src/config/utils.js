//
// ────────────────────────────────────────────────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: A   C O L L E C T I O   O F   V E E E R Y   U S E F U L L   F U N C T I O N S : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
//

import moment from 'moment';
import _ from 'lodash';
import React from 'react';
import translations from '../translations/i18next';
import PermissionsParserV0 from '../utils/PermissionsParserV0';
import {
  PHOTOGRAPHER_INVOICE_ITEMS_REFUNDS,
  SEVERITY_TYPES,
  COMPANIES_ORDER_STATUSES_TRANSLATION_MAP,
  INVOICE_ITEMS_TYPES,
  PHOTOGRAPHER_SHOOTING_STATUSES_TRANSLATION_MAP,
  PENALTIES_TYPES,
  REFUND_TYPES,
} from './consts';

export function isMobileBrowser() {
  let check = false;
  (function (a) {
    if (
      // eslint-disable-next-line
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
        a
      ) ||
      // eslint-disable-next-line
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        a.substr(0, 4)
      )
    )
      check = true;
  })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
}

export function saveDataToLocalStorage(fieldName, data) {
  localStorage[fieldName] = data;
}

// if event is recurrent calculate the difference between the end date of the event and the current end date filter selected
export function elaborateUnavailabilityCalendarEvents(event, startDatePeriod, endDatePeriod) {
  switch (event.periodicity) {
    case 'WEEKLY': {
      let weekDifference = moment(endDatePeriod).diff(startDatePeriod, 'week');
      // Handling the case where the user has select the weekly calendar view
      if (weekDifference === 0) weekDifference = moment(endDatePeriod).diff(event.endDate, 'week');

      // Create the base dates from wich start to add weeks
      const startDateBase = moment(startDatePeriod)
        .set('hours', moment(event.startDate).get('hours'))
        .set('minutes', moment(event.startDate).get('minutes'))
        .set('day', moment(event.startDate).get('day'));
      const endDateBase = moment(startDatePeriod)
        .set('hours', moment(event.endDate).get('hours'))
        .set('minutes', moment(event.endDate).get('minutes'))
        .set('day', moment(event.endDate).get('day'));
      const iterator = _.range(0, weekDifference + 1);

      const recurrentUnavailabilities = _.map(iterator, (weektoAdd) => ({
        start: moment(startDateBase).add(weektoAdd, 'week').toDate(),
        end: moment(endDateBase).add(weektoAdd, 'week').toDate(),
        periodicity: event.periodicity,
        ...event,
      }));
      return recurrentUnavailabilities;
    }
    default:
      return {
        start: moment(event.startDate).toDate(),
        end: moment(event.endDate).toDate(),
        periodicity: event.periodicity,
        ...event,
      };
  }
}

export function elaborateRolePermissionsString(permissions) {
  const permissionsNamesArray = _.flatMap(permissions, (perm) => (!perm.name.includes('contact-center') ? perm.name : []));
  const parsedPermissions = PermissionsParserV0.parseArray(permissionsNamesArray);
  const groupedPermissions = _.groupBy(parsedPermissions, (perm) => perm.subject);
  const reducedPermissions = _.reduce(
    groupedPermissions,
    (accumulator, current, index) => {
      accumulator[index] = _.map(current, (perm) => perm.action);
      return accumulator;
    },
    {}
  );
  const formattedPermissions = _.map(reducedPermissions, (abilities, key) => (
    <div>
      <h4 style={{ margin: 0, marginTop: 10, fontWeight: 100 }}>{`${translations.t(`permissionsEntities.${key}`)}:`}</h4>
      {_.map(abilities, (ability) => (
        <h5 style={{ fontWeight: 100, margin: 0, marginTop: 10, marginLeft: 20 }}>{`• ${translations.t(
          `permissionsActions.${ability}`
        )}`}</h5>
      ))}
    </div>
  ));
  return formattedPermissions;
}

export function getYearsList() {
  const yearsBetween = [];
  const startDate = moment().subtract(1, 'years');
  _.times(10, (n) => yearsBetween.push(moment(startDate).add(n, 'years').format('YYYY')));
  return yearsBetween;
}

export const mapOrderStatus = (isBoom, isPhotographer, state) => {
  if (isBoom) {
    return state;
  }

  if (isPhotographer) {
    return PHOTOGRAPHER_SHOOTING_STATUSES_TRANSLATION_MAP[state];
  }

  return COMPANIES_ORDER_STATUSES_TRANSLATION_MAP[state];
};

export function elaborateIsIncomeFromItemType(type) {
  if (
    type === INVOICE_ITEMS_TYPES.COMPANY_PENALTY ||
    type === INVOICE_ITEMS_TYPES.REFUSE_PENALTY ||
    type === INVOICE_ITEMS_TYPES.RESHOOT_PENALTY ||
    type === INVOICE_ITEMS_TYPES.PHOTOGRAPHER_PENALTY
  ) {
    return false;
  }
  return true;
}

export function elaborateInvoiceTotalBalance(invoices) {
  return _.reduce(
    invoices,
    (prev, curr, key) => {
      if (curr.deleted) return prev;
      if (!curr.income) return prev - curr.amount;
      return curr.amount + prev;
    },
    0
  );
}

export function calculateCompanyPenalty(value, type) {
  switch (type) {
    case PENALTIES_TYPES.FULL_PENALTY:
      return value;
    case PENALTIES_TYPES.HALF_PENALTY:
      return value * 0.5;
    case PENALTIES_TYPES.NO_PENALTY:
      return 0;
    default:
      return value;
  }
}

export function calculatePercentage(price, percentage) {
  return (price * (percentage / 100)).toString();
}

export function elaborateSeverityLevel(type) {
  switch (type) {
    case PENALTIES_TYPES.FULL_PENALTY:
    case REFUND_TYPES.FULL_REFUND: {
      return SEVERITY_TYPES.FULL;
    }
    case PENALTIES_TYPES.HALF_PENALTY:
    case REFUND_TYPES.HALF_REFUND: {
      return SEVERITY_TYPES.HALF;
    }
    case PENALTIES_TYPES.NO_PENALTY:
    case REFUND_TYPES.NO_REFUND: {
      return SEVERITY_TYPES.UNCLASSIFIED;
    }
    default: {
      return SEVERITY_TYPES.UNCLASSIFIED;
    }
  }
}

export function calculatePhotographerPenalty(value, type) {
  switch (type) {
    case REFUND_TYPES.FULL_REFUND:
      return value;
    case REFUND_TYPES.HALF_REFUND:
      return value * 0.5;
    case REFUND_TYPES.NO_REFUND:
      return 0;
    default:
      return value;
  }
}

export function elaborateInvoiceItemEventMessage(type, user) {
  switch (type) {
    case 'PHOTOGRAPHER_REFUND_CREATED': {
      if (user) return 'photographerRefundCreatedMessageWithUser';
      return 'photographerRefundCreatedMessage';
    }
    case 'PHOTOGRAPHER_REFUND_DELETED': {
      if (user) return 'photographerRefundDeletedMessageWithUser';
      return 'photographerRefundDeletedMessage';
    }
    case 'COMPANY_PENALTY_CREATED': {
      if (user) return 'companyPenaltyCreatedMessageWithUser';
      return 'companyPenaltyCreatedMessage';
    }
    case 'COMPANY_PENALTY_DELETED': {
      if (user) return 'companyPenaltyDeletedMessageWithUser';
      return 'companyPenaltyDeletedMessage';
    }
    case 'PHOTOGRAPHER_TRAVEL_EXPENSES_CREATED': {
      if (user) return 'photographerTravelExpensesCreatedMessageWithUser';
      return 'photographerTravelExpensesCreatedMessage';
    }
    case 'SHOOTING_REFUNDED_TRAVEL_EXPENSES_CREATED': {
      if (user) return 'photographerTravelExpensesRefundedCreatedMessageWithUser';
      return 'photographerTravelExpensesRefundedCreatedMessage';
    }
    case 'PHOTOGRAPHER_TRAVEL_EXPENSES_DELETED': {
      if (user) return 'photographerTravelExpensesDeletedMessageWithUser';
      return 'photographerTravelExpensesDeletedMessage';
    }
    case 'PHOTOGRAPHER_PENALTY_CREATED': {
      if (user) return 'photographerPenealtyCreatedMessageWithUser';
      return 'photographerPenealtyCreatedMessage';
    }
    case 'PHOTOGRAPHER_PENALTY_DELETED': {
      if (user) return 'photographerPenealtyDeletedMessageWithUser';
      return 'photographerPenealtyDeletedMessage';
    }
    case 'COMPANY_REFUND_CREATED': {
      if (user) return 'companyRefundCreatedMessageWithUser';
      return 'companyRefundCreatedMessage';
    }
    case 'COMPANY_REFUND_DELETED': {
      if (user) return 'companyRefundDeleteMessageWithUser';
      return 'companyRefundDeleteMessage';
    }
    case 'SHOOTING_TRAVEL_EXPENSES_CREATED': {
      if (user) return 'photographerTravelExpensesCreatedMessageWithUser';
      return 'photographerTravelExpensesCreatedMessage';
    }
    case 'SHOOTING_CANCELED_CREATED':
      return 'shootingCanceledItemCreatedMessage';
    case 'SHOOTING_RESCHEDULED_CREATED':
      return 'shootingRescheduleItemCreatedMessage';
    case 'RESHOOT_PENALTY_CREATED':
      return 'photographerReshootPenaltyCreatedMessage';
    default:
      return null;
  }
}

export function elaborateSeverityLevelPercentage(level) {
  switch (level) {
    case 'FULL':
      return '100%';
    case 'HALF':
      return '50%';
    case 'UNCLASSIFIED':
      return null;
    default:
      return null;
  }
}

export function filterPhotographerItemsRefund(items) {
  const photographerFilteredItems = _.filter(items, (item) => item.type in PHOTOGRAPHER_INVOICE_ITEMS_REFUNDS);
  return photographerFilteredItems;
}

export function checkPhotographerItemsRefund(items) {
  const photographerFilteredItems = _.filter(
    items,
    (item) => item.type === INVOICE_ITEMS_TYPES.SHOOTING_TRAVEL_EXPENSES,
    (item) => item.deleted === 0
  );
  return photographerFilteredItems;
}

export function calculatePhotographerTotalRefund(items) {
  return _.reduce(
    items,
    (prev, curr, key) => {
      if (curr.deleted) return prev;
      if (curr.type === INVOICE_ITEMS_TYPES.PHOTOGRAPHER_PENALTY) {
        return prev - curr.amount;
      }
      return curr.amount + prev;
    },
    0
  );
}

export function calculateIsDifferentTimezone(shooting) {
  const shootingTimezone = shooting.timezone;
  if (shootingTimezone) {
    const myTimezone = moment.tz.guess();
    const isDifferentTimezone = moment.tz(shootingTimezone).zoneAbbr() !== moment.tz(myTimezone).zoneAbbr();

    return isDifferentTimezone;
  }

  return false;
}

export function getErrorMessageOnPhotographerDeleted(photographerName, errorCode, defaultErrorMessage) {
  const dictErrorMessages = {
    37001: translations.t('photographers.photographerHasBeenDeleted', { photographerName }),
    14004: translations.t('photographers.photographerIsStillAssignedToShootings'),
  };
  const errorMessage = dictErrorMessages[errorCode] ? dictErrorMessages[errorCode] : defaultErrorMessage;

  return errorMessage;
}

export function getErrorMessageOnDeletePackagePriceInUse(shootingCodes, errorCode, defaultErrorMessage) {
  const dictErrorMessages = {
    22003: translations.t('organization.deletePackageInUse', { shootingCodes }),
  };
  const errorMessage = dictErrorMessages[errorCode] ? dictErrorMessages[errorCode] : defaultErrorMessage;

  return errorMessage;
}

export const revertToOriginalStatuses = (statuses, statusMap) =>
  _.flatMap(statuses, (status) =>
    Object.entries(statusMap)
      .filter(([k, v]) => status === v)
      .map(([k, v]) => k)
  );

export const getCompleteName = (user) => {
  const firstName = _.get(user, 'firstName', '');
  const lastName = _.get(user, 'lastName', '');
  return `${firstName} ${lastName}`;
};

export const getDiffDaysWhenDifferentTimezone = (startDate, orderTimezone) => {
  const diffDays = moment(moment.tz(startDate, orderTimezone).format('YYYY-MM-DD')).diff(
    moment(moment(startDate).format('YYYY-MM-DD')),
    'days'
  );

  return diffDays > 0 ? `+${diffDays}` : diffDays;
};
