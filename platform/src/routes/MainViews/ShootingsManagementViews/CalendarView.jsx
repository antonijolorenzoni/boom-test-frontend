//
// ──────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: M A I N   C A L E N D A R   V I E W : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────────────────────────
//

import { withStyles } from '@material-ui/core/styles';
import _ from 'lodash';
import moment from 'moment';
import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { connect } from 'react-redux';
import { initialize, submit } from 'redux-form';
import { getPlaceTimezone } from '../../../api/instances/googlePlacesInstance';
import * as ModalsActions from '../../../redux/actions/modals.actions';
import AgendaEvent from '../../../components/Event/AgendaEvent';
import EventRow from '../../../components/Event/EventRow';
import NewUnavailabilityForm from '../../../components/Forms/ReduxForms/Calendar/NewUnavailabilityForm';
import ShootingCalendarFiltersForm from '../../../components/Forms/ReduxForms/Calendar/ShootingCalendarFiltersForm';
import Permission from '../../../components/Permission/Permission';
import ShootingBulkUploadViewContainer from '../../../components/Shooting/ShootingBulkUploadView/container';
import {
  COMPANIES_SHOOTING_CALENDAR_STATUSES,
  PERMISSIONS,
  PERMISSION_ENTITIES,
  PHOTOGRAPHER_SHOOTING_CALENDAR_STATUSES,
  SHOOTINGS_STATUSES,
  SHOOTING_STATUSES_UI_ELEMENTS,
  USER_ROLES,
} from '../../../config/consts';
import { isMobileBrowser } from '../../../config/utils';
import * as AvailabilityActions from '../../../redux/actions/availability.actions';
import * as ShootingsActions from '../../../redux/actions/shootings.actions';
import * as UtilsActions from '../../../redux/actions/utils.actions';
import translations from '../../../translations/i18next';
import AbilityProvider from '../../../utils/AbilityProvider';
import HideFor from 'components/Permission/HideFor';
import { NewOrderForm } from 'components/Forms/NewOrderForm';
import { createShootingRefund } from 'api/shootingsAPI';
import { ShowForRoles } from 'components/Permission/ShowFor';
import { NewOrderFormForSubscribers } from 'components/Forms/NewOrderForm/NewOrderFormForSubscribers';
import { getSubscription } from 'api/paths/payments';
import { getMySmbProfile } from 'api/paths/user';
import { axiosBoomInstance } from 'api/instances/boomInstance';
import { Button } from 'ui-boom-components';
import { SubscriptionStatus } from 'types/SubscriptionStatus';
import { isDayBlocked } from 'utils/date-utils';

const styles = {
  calendarContainer: {
    padding: 20,
    width: isMobileBrowser() ? '90%' : '100%',
    paddingBottom: 40,
    marginLeft: isMobileBrowser() ? 0 : 320,
    height: '90vh',
  },
  container: {
    display: 'flex',
    backgroundColor: '#ffffff',
  },
  shootingsContainer: {
    backgroundColor: '#f5f6f7',
    width: 300,
    padding: 10,
    height: '100vh',
    overflow: 'scroll',
    position: 'fixed',
    left: 0,
    top: 64,
  },
  calendar: {
    border: 'none',
    minWidth: '100%',
    backgroundColor: 'transparent',
  },
};

// Component used to show a shooting status in calendar filters
const ShootingStatusOption = ({ state }) => (
  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
    <h4 style={{ fontWeight: 100, marginRight: 10 }}>{translations.t(`shootingStatuses.${state}`)}</h4>
    <div
      style={{
        width: 15,
        height: 15,
        borderRadius: '50%',
        backgroundColor: SHOOTING_STATUSES_UI_ELEMENTS[state].color,
      }}
    />
  </div>
);

class CalendarView extends React.Component {
  constructor(props) {
    super(props);
    const {
      user: {
        data: { isBoom },
      },
    } = props;

    // This is the possible time range of calendar view
    const minHours = isBoom ? 0 : 8;
    const maxHours = isBoom ? 23 : 20;
    const minTime = new Date();
    minTime.setHours(minHours, 0, 0);
    const maxTime = new Date();
    maxTime.setHours(maxHours, 0, 0);
    this.state = {
      date: null,
      minTime,
      maxTime,
      minHours,
      maxHours,
      gracePeriod: false,
    };
  }
  /*
   * On component mount reset shootings data and refetch shootings
   */

  async componentWillMount() {
    const {
      dispatch,
      user: {
        data: { isPhotographer, authorities },
      },
    } = this.props;
    dispatch(AvailabilityActions.resetUnavailabilityData());
    dispatch(ShootingsActions.resetDailyShootingsFilters());
    dispatch(ShootingsActions.resetShootingFilter());
    dispatch(ShootingsActions.setShootingFilter('states', _.values(this.elaborateShootingStatusFilters())));
    this.onSetCalendarFiltersAndFetchEvents(moment(), 'week');
    if (isPhotographer) {
      await dispatch(AvailabilityActions.fetchPhotographerUnavailability());
    }

    const isSMB = (authorities ?? []).includes(USER_ROLES.ROLE_SMB);
    if (isSMB) {
      const smbProfile = await axiosBoomInstance.get(getMySmbProfile());
      const subscription = await axiosBoomInstance.get(getSubscription(smbProfile.data.companyId));
      this.setState({
        gracePeriod: subscription.data.subscriptionStatus === SubscriptionStatus.UNSUBSCRIBED_GRACE,
      });
    }
  }

  /*
   * Function called when a timerange it's selected from the calendar
   */
  onSelectRange(range) {
    const {
      dispatch,
      user: {
        data: { isPhotographer, isBoom },
      },
    } = this.props;
    const { start } = range;
    // Avoid reservation in special days (new year's day, christmas etc)
    if (isDayBlocked(start)) {
      dispatch(
        ModalsActions.showModal('ORDER_DATE_BLOCKED', {
          modalType: 'ERROR_ALERT',
          modalProps: {
            message: translations.t('shootings.dayIsBlocked'),
          },
        })
      );
      return;
    }
    // Avoid reservation before 8 AM
    if (moment(start).hours() < 8 && !isBoom) {
      dispatch(
        ModalsActions.showModal('SHOOTING_RANGE_ERROR', {
          modalType: 'ERROR_ALERT',
          modalProps: {
            message: isPhotographer
              ? translations.t('calendar.timeSlotInTheFuturePhotographer')
              : translations.t('calendar.timeSlotTooEarly'),
          },
        })
      );
      return;
    }
    // If the user is a photographer then open the unavailability creation form
    if (moment(start).isAfter(moment.now()) || isBoom) {
      if (isPhotographer) {
        this.onShowNewUnavailabilityForm(range);
      } else {
        this.onShowNewShootingForm(range);
      }
    } else {
      dispatch(
        ModalsActions.showModal('SHOOTING_CREATION_ERROR', {
          modalType: 'ERROR_ALERT',
          modalProps: {
            message: isPhotographer
              ? translations.t('calendar.timeSlotInThePastPhotographer')
              : translations.t('calendar.timeSlotInThePast'),
          },
        })
      );
    }
  }

  /*
   * Initialize and open the shooting form
   */
  onShowNewShootingForm(range) {
    const {
      dispatch,
      user: {
        data: { isBoom },
      },
    } = this.props;
    const { start } = range;

    dispatch(
      ModalsActions.showModal('NEW_SHOOTING_DIALOG', {
        modalType: 'OPERATIONAL_VIEW',
        modalProps: {
          content: (
            <div style={{ padding: '20px 40px' }} id="create-order-drawer">
              <HideFor roles={[USER_ROLES.ROLE_SMB]}>
                <NewOrderForm
                  initialDate={start ? moment(start).valueOf() : undefined}
                  initialStartTime={start ? moment(start).valueOf() : undefined}
                  onCancel={() => dispatch(ModalsActions.hideModal('NEW_SHOOTING_DIALOG'))}
                  onCreateOrderCompleted={(organizationId, orderId, refund) => {
                    if (isBoom && refund) {
                      createShootingRefund(organizationId, orderId, { amount: refund });
                    }
                    this.onSetCalendarFiltersAndFetchEvents(this.state.date, 'week');
                  }}
                />
              </HideFor>
              <ShowForRoles roles={[USER_ROLES.ROLE_SMB]}>
                <NewOrderFormForSubscribers
                  onCancel={() => dispatch(ModalsActions.hideModal('NEW_SHOOTING_DIALOG'))}
                  onCreateOrderCompleted={() => this.onSetCalendarFiltersAndFetchEvents(this.state.date, 'week')}
                />
              </ShowForRoles>
            </div>
          ),
        },
      })
    );
  }

  openBulkUploadDialog = () => {
    const { dispatch } = this.props;

    dispatch(
      ModalsActions.showModal('BULK_UPLOAD_DIALOG', {
        modalType: 'MODAL_DIALOG',
        modalProps: {
          hideCancel: true,
          maxWidth: 'lg',
          width: '60vw',
          height: '70vh',
          overflow: 'hidden',
          titleStyle: { fontSize: 17 },
          innerContainerStyle: { height: 'calc(100% - 88px)', boxSizing: 'border-box' },
          bodyContentContainerStyle: { height: '100%' },
          title: translations.t('calendar.bulkUploadModalTitle'),
          content: <ShootingBulkUploadViewContainer />,
        },
      })
    );
  };

  /*
   * Initialize and open the unavailability form
   */
  onShowNewUnavailabilityForm(range) {
    const { dispatch } = this.props;
    const { start, end } = range;
    dispatch(
      initialize('NewUnavailabilityForm', {
        date: moment(start).valueOf(),
        startTime: moment(start).valueOf(),
        endTime: moment(end).valueOf(),
      })
    );
    dispatch(
      ModalsActions.showModal('UNAVAILABILITY_FORM_MODAL', {
        modalType: 'MODAL_DIALOG',
        modalProps: {
          title: translations.t('calendar.newUnavailabilityModalTitle'),
          content: <NewUnavailabilityForm onSubmit={(unavailabilityData) => this.onCreateUnavailability(unavailabilityData)} />,
          onConfirm: () => dispatch(submit('NewUnavailabilityForm')),
          confirmText: translations.t('modals.publish'),
        },
      })
    );
  }

  /*
   *  Create photographer unavailability
   */
  async onCreateUnavailability(unavailabilityData) {
    const {
      dispatch,
      user: {
        data: {
          address: { location },
        },
      },
    } = this.props;
    try {
      const timezone = await getPlaceTimezone(location.latitude, location.longitude);
      dispatch(UtilsActions.setSpinnerVisibile(true));
      await dispatch(AvailabilityActions.createUserUnavailability({ ...unavailabilityData, timezone }));
      dispatch(ModalsActions.hideModal('UNAVAILABILITY_FORM_MODAL'));
    } catch (error) {
      let errorMessage = translations.t('calendar.unavailabilityCreateError');
      if (error && error === 23003) {
        errorMessage = translations.t('calendar.unavailabilityCreateAlreadyThereError');
      }
      dispatch(
        ModalsActions.showModal('UNAV_CREATION_ERROR', {
          modalType: 'ERROR_ALERT',
          modalProps: {
            message: errorMessage,
          },
        })
      );
    } finally {
      dispatch(UtilsActions.setSpinnerVisibile(false));
    }
  }

  /*
   *  Fetching the shootings everytime the viewtype and date changes
   * viewType = ['month'|'week'|'work_week'|'day'|'agenda'];
   */
  async onSetCalendarFiltersAndFetchEvents(date, viewType) {
    const {
      dispatch,
      user: {
        data: { isPhotographer },
      },
    } = this.props;
    const { minHours, maxHours } = this.state;
    if (date) {
      const dateFrom = moment(date).startOf(viewType).subtract(1, 'day').valueOf();
      const dateTo = moment(date).endOf(viewType).add(1, 'day').valueOf();
      const newFilters = {
        dateFrom,
        dateTo,
      };

      const minTime = new Date(moment(date).year(), moment(date).month(), moment(date).date(), minHours, 0, 0);
      const maxTime = new Date(moment(date).year(), moment(date).month(), moment(date).date(), maxHours, 0, 0);
      this.setState({ date, minTime, maxTime });

      dispatch(ShootingsActions.setShootingFilter('dateFrom', dateFrom));
      dispatch(ShootingsActions.setShootingFilter('dateTo', dateTo));
      await dispatch(ShootingsActions.fetchCalendarPhOrders());
      if (isPhotographer) {
        dispatch(AvailabilityActions.setUnavailabilityFilterBlock(newFilters));
        await dispatch(AvailabilityActions.fetchPhotographerUnavailability());
      }
    }
  }

  /*
   * This function is invoked every time the calendar month | week | day  selector is pressed
   */
  onCalendarViewChange(viewType) {
    const { date } = this.state;
    this.onSetCalendarFiltersAndFetchEvents(date, viewType);
  }

  getMinShootingsStartingHour(shootings) {
    let min = shootings.length > 0 ? new Date(shootings[0].start).getHours() : 0;
    for (let i = 1, len = shootings.length; i < len; i++) {
      let nextHour = new Date(shootings[i].start).getHours();
      min = nextHour < min ? nextHour : min;
    }
    return min;
  }

  static getDefaultMinCalendarHours(isBoom) {
    const MIN_CALENDAR_HOUR_BOOM = 0;
    const MIN_CALENDAR_HOUR_CLIENTS = 8;
    return isBoom ? MIN_CALENDAR_HOUR_BOOM : MIN_CALENDAR_HOUR_CLIENTS;
  }

  /*
   * Style for calendar event
   */
  eventStyleGetter = (event, start, end, isSelected) => {
    const style = {
      backgroundColor: 'transparent',
      borderRadius: '0px',
      opacity: 1,
      color: 'transparent',
      border: '0px solid white',
      display: 'block',
      marginLeft: 5,
      padding: 0,
    };
    return {
      style,
    };
  };

  /*
   * Function to dynamically obtain the list of shooting statuses used by filters
   */

  elaborateShootingStatusFilters() {
    const {
      user: {
        data: { isPhotographer },
      },
    } = this.props;
    if (isPhotographer) {
      return PHOTOGRAPHER_SHOOTING_CALENDAR_STATUSES;
    }
    return _.omit(SHOOTINGS_STATUSES, [SHOOTINGS_STATUSES.UNSCHEDULED]);
  }

  /*
   * Function to dynamically obtain the list of shooting statuses used by filters
   */

  elaborateShootingStatusOptions() {
    const {
      user: {
        data: { isPhotographer, isBoom },
      },
    } = this.props;
    let statuses = this.elaborateShootingStatusFilters();

    if (!isPhotographer && !isBoom) {
      statuses = COMPANIES_SHOOTING_CALENDAR_STATUSES;
    }

    if (isPhotographer) {
      statuses = _.omit(PHOTOGRAPHER_SHOOTING_CALENDAR_STATUSES, [
        SHOOTINGS_STATUSES.DOWNLOADED,
        SHOOTINGS_STATUSES.ASSIGNED,
        SHOOTINGS_STATUSES.AUTO_ASSIGNMENT,
      ]);
    }
    return _.map(statuses, (state, index) => ({
      id: index,
      element: <ShootingStatusOption state={state} />,
      value: translations.t(`shootingStatuses.${state}`),
    }));
  }

  onAddNewOrder = () => {
    const tomorrowDate = moment().add(1, 'days');

    if (isDayBlocked(tomorrowDate)) {
      this.onShowNewShootingForm({
        start: moment().add(2, 'days'),
        end: moment().add(2, 'days').add(2, 'hours'),
      });
    } else {
      this.onShowNewShootingForm({
        start: moment().add(1, 'days'),
        end: moment().add(1, 'days').add(2, 'hours'),
      });
    }
  };

  render() {
    const {
      classes,
      shootings: { calendarShootings },
      user: {
        data: { isPhotographer, isBoom },
      },
      availability,
    } = this.props;

    const allCalendarEvents = [...calendarShootings, ...availability];
    const { minTime, maxTime } = this.state;
    const minShootingsStartingHour = this.getMinShootingsStartingHour(calendarShootings);
    const minHoursToScroll = isFinite(minShootingsStartingHour) ? minShootingsStartingHour : this.getDefaultMinCalendarHours(isBoom);

    const scrollToTime = new Date();
    scrollToTime.setHours(minHoursToScroll, 0, 0);

    const canSelectSlot =
      (AbilityProvider.getOrganizationAbilityHelper().hasPermission(
        [PERMISSIONS.CREATE, PERMISSIONS.MANAGE],
        PERMISSION_ENTITIES.SHOOTING
      ) &&
        !this.state.gracePeriod) ||
      isPhotographer;

    return (
      <div className={classes.container}>
        <div id="event-board" className={classes.shootingsContainer}>
          <Permission
            do={[PERMISSIONS.UNAVAILABILITIES]}
            on={PERMISSION_ENTITIES.PHOTOGRAPHER}
            abilityHelper={AbilityProvider.getOrganizationAbilityHelper()}
          >
            <Button
              backgroundColor="#b1b9c1"
              onClick={() => this.onShowNewUnavailabilityForm({ start: moment(), end: moment().add(2, 'hours') })}
              style={{ width: '100%' }}
            >
              {translations.t('calendar.newUnavailabilityModalTitle')}
            </Button>
          </Permission>
          <Permission
            do={[PERMISSIONS.CREATE, PERMISSIONS.MANAGE]}
            on={PERMISSION_ENTITIES.SHOOTING}
            abilityHelper={AbilityProvider.getOrganizationAbilityHelper()}
          >
            <Button onClick={this.onAddNewOrder} style={{ width: '100%' }} disabled={this.state.gracePeriod}>
              {translations.t('calendar.newShootingModalTitle')}
            </Button>
          </Permission>
          <HideFor roles={[USER_ROLES.ROLE_SMB]}>
            {isBoom && (
              <Permission
                do={[PERMISSIONS.CREATE, PERMISSIONS.MANAGE]}
                on={PERMISSION_ENTITIES.SHOOTING}
                abilityHelper={AbilityProvider.getOrganizationAbilityHelper()}
              >
                <Button onClick={this.openBulkUploadDialog} style={{ width: '100%', marginTop: 12 }}>
                  {translations.t('calendar.bulkUploadModalTitle')}
                </Button>
              </Permission>
            )}
          </HideFor>
          <ShootingCalendarFiltersForm
            shootingStatuses={this.elaborateShootingStatusFilters()}
            shootingStatesOptions={this.elaborateShootingStatusOptions()}
          />
        </div>
        <div className={classes.calendarContainer}>
          {isMobileBrowser() && (
            <Permission
              do={[PERMISSIONS.UNAVAILABILITIES]}
              on={PERMISSION_ENTITIES.PHOTOGRAPHER}
              abilityHelper={AbilityProvider.getOrganizationAbilityHelper()}
            >
              <Button
                backgroundColor="#b1b9c1"
                onClick={() =>
                  this.onShowNewUnavailabilityForm({
                    start: moment(),
                    end: moment().add(2, 'hours'),
                  })
                }
              >
                {translations.t('calendar.newUnavailabilityModalTitle')}
              </Button>
            </Permission>
          )}
          <Calendar
            components={{
              event: EventRow,
              month: {
                // with the agenda view use a different component to render events
                event: AgendaEvent,
              },
            }}
            showMultiDayTimes
            localizer={momentLocalizer(moment)}
            events={allCalendarEvents}
            startAccessor="start"
            endAccessor="end"
            defaultView="week"
            min={minTime}
            max={maxTime}
            scrollToTime={scrollToTime}
            views={['month', 'week', 'day']}
            eventPropGetter={(event, start, end, isSelected) => this.eventStyleGetter(event, start, end, isSelected)}
            selectable={canSelectSlot}
            messages={{
              today: translations.t('calendar.today'),
              previous: translations.t('calendar.previous'),
              next: translations.t('calendar.next'),
              month: translations.t('calendar.month'),
              week: translations.t('calendar.week'),
              day: translations.t('calendar.day'),
              agenda: translations.t('calendar.agenda'),
            }}
            onSelectSlot={(range) => this.onSelectRange(range)}
            onNavigate={(date, viewType) => this.onSetCalendarFiltersAndFetchEvents(date, viewType)}
            onView={(viewType, date) => this.onCalendarViewChange(viewType)}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  shootings: state.shootings,
  user: state.user,
  availability: state.availability.data.content,
  utils: state.utils,
});

export default connect(mapStateToProps)(withStyles(styles)(CalendarView));
