import { get, orderBy } from 'lodash';
import moment from 'moment';

import translations from '../translations/i18next';
import { fetchShootings, fetchShootingDetails, fetchShootingUploadNotes, fetchShootingEvents } from '../api/shootingsAPI';
import { fetchInvoicingItems } from '../api/invoicingItemsAPI';
import { getPhotographerDetail } from '../api/photographersAPI';
import { fetchCompanyShootingChecklist } from '../api/companiesAPI';
import {
  HIDDEN_EVEN_TYPE_BOOM,
  HIDDEN_INVOICE_TYPES_EVENTS,
  INVOICE_ITEMS_TYPES,
  PERMISSIONS,
  PERMISSION_ENTITIES,
  PHOTO_TYPES,
} from '../config/consts';
import { elaborateInvoiceTotalBalance } from '../config/utils';
import { download } from './download';
import { unparse } from 'papaparse';
import AbilityProvider from './AbilityProvider';

export const fillOrdersWithAllInfos = async (organizationId, order, isBoom) => {
  const shootingDetailsResponse = await fetchShootingDetails(organizationId, order.id);
  const fetchedOrder = shootingDetailsResponse.data;

  if (fetchedOrder) {
    let fullOrder = { ...fetchedOrder, score: order.score };

    if (isBoom) {
      const canReadItems = AbilityProvider.getOrganizationAbilityHelper().hasPermission(
        [PERMISSIONS.READ],
        PERMISSION_ENTITIES.INVOICEITEM
      );
      const canReadPhotographer = AbilityProvider.getOrganizationAbilityHelper().hasPermission(
        [PERMISSIONS.READ],
        PERMISSION_ENTITIES.PHOTOGRAPHER
      );
      const canReadChecklist = AbilityProvider.getOrganizationAbilityHelper().hasPermission(
        [PERMISSIONS.READ],
        PERMISSION_ENTITIES.CHECKLIST
      );

      if (canReadItems) {
        const invoicingItemsResponse = await fetchInvoicingItems({ page: 0, pageSize: 5000, shootingId: order.id });
        const invoicingItems = get(invoicingItemsResponse, 'data.content', []);
        fullOrder = { ...fullOrder, items: invoicingItems };
      }

      if (fullOrder.photographerId && canReadPhotographer) {
        try {
          const photographerResponse = await getPhotographerDetail(fullOrder.photographerId);
          fullOrder = { ...fullOrder, photographer: photographerResponse.data };
        } catch (error) {}
      }

      try {
        if (canReadChecklist) {
          const checklistResponse = await fetchCompanyShootingChecklist(organizationId, order.companyId);
          const checklist = checklistResponse.data;
          fullOrder = { ...fullOrder, checklist };
        }
      } catch (error) {}
    }

    try {
      const uploadNotesResponse = await fetchShootingUploadNotes(organizationId, order.id);
      const uploadNotes = uploadNotesResponse.data;
      fullOrder = { ...fullOrder, uploadNotes };
    } catch (error) {}

    const params = { pageSize: 100, page: 0 };
    const eventsResponse = await fetchShootingEvents(order.id, params);
    const events = get(eventsResponse, 'data.content', []);
    if (events) {
      const orderedEvents = orderBy(events, 'createdAt', 'desc');
      const filteredEvents = orderedEvents.filter(
        (event) =>
          !(
            event.type in HIDDEN_EVEN_TYPE_BOOM ||
            ((event.type === 'INVOICE_ITEM_CREATED' || event.type === 'INVOICE_ITEM_DELETED') &&
              event.invoiceItem &&
              event.invoiceItem.type in HIDDEN_INVOICE_TYPES_EVENTS)
          )
      );
      fullOrder = { ...fullOrder, events: filteredEvents };
    }

    return fullOrder;
  }
};

export const fetchOrdersToExport = async (filters, organization) => {
  try {
    const params = { ...filters, page: 0, pageSize: 50000 };
    const ordersResponse = await fetchShootings(organization, params);

    const orders = get(ordersResponse, 'data.content', []);

    const fullOrders = orders.map(async (order) => {
      let orderToExport = order;

      try {
        const shootingDetailedResponse = await fetchShootingDetails(organization, order.id);
        if (shootingDetailedResponse && shootingDetailedResponse.data) {
          const shootingFetched = shootingDetailedResponse.data.shooting || shootingDetailedResponse.data;
          orderToExport = shootingFetched;
        }
      } catch (error) {}

      try {
        const invoicingItemsResponse = await fetchInvoicingItems({ shootingId: order.id, pageSize: 40 });
        if (invoicingItemsResponse && invoicingItemsResponse.data && invoicingItemsResponse.data.content) {
          orderToExport = { ...orderToExport, items: invoicingItemsResponse.data.content };
        }
      } catch (error) {}

      if (order.photographerId) {
        try {
          const photographerResponse = await getPhotographerDetail(order.photographerId);
          if (photographerResponse && photographerResponse.data) {
            orderToExport = { ...orderToExport, photographer: photographerResponse.data };
          }
        } catch (error) {}
      }

      return orderToExport;
    });

    return Promise.all(fullOrders);
  } catch (error) {
    throw error;
  }
};

export const generateExportRows = (orders) => {
  const rows = orders.map((order) => {
    const { code, state, title, startDate, endDate, company, photographer, pricingPackage, place, items } = order;
    const emptyColumn = '---';

    const companyName = get(company, 'name', emptyColumn);
    const companyID = get(company, 'id', emptyColumn);
    const organizationID = get(company, 'organization', emptyColumn);
    const pricingPackageName = get(pricingPackage, 'name', emptyColumn);
    const pricingPackageCurrency = get(pricingPackage, 'pricingPackage.currency.symbol', emptyColumn);

    const pricingPackageCompanyPrice = get(pricingPackage, 'companyPrice');
    const pricingPackagePhotographerEarning = get(pricingPackage, 'photographerEarning', emptyColumn);

    const photographerInfo = get(photographer, 'user') ? `${photographer.user.firstName} ${photographer.user.lastName}` : emptyColumn;
    const address = get(place, 'formattedAddress', emptyColumn);
    const latitude = get(place, 'location.latitude', emptyColumn);
    const longitude = get(place, 'location.longitude', emptyColumn);
    const city = get(place, 'city', emptyColumn);

    const time = startDate ? `${moment(startDate).format('HH:mm')} - ${moment(endDate).format('HH:mm')}` : emptyColumn;
    const date = startDate ? moment(startDate).format('LL') : emptyColumn;

    const weekNumber = startDate ? `${moment(startDate).format('YYYY')} - ${moment(startDate).isoWeek()}` : emptyColumn;
    const monthNumber = startDate ? `${moment(startDate).format('YYYY')} - ${moment(startDate).month() + 1}` : emptyColumn;

    const photographersRefundsItems = items.filter((item) => item.type === INVOICE_ITEMS_TYPES.PHOTOGRAPHER_REFUND);

    const photographerBaseRefundsItems = items.filter((item) =>
      [
        INVOICE_ITEMS_TYPES.SHOOTING_PHOTOGRAPHER_REFUND,
        INVOICE_ITEMS_TYPES.PHOTOGRAPHER_TRAVEL_EXPENSES,
        INVOICE_ITEMS_TYPES.PHOTOGRAPHER_REFUNDED_TRAVEL_EXPENSES,
      ].includes(item.type)
    );

    const photographersPenaltiesItems = items.filter((item) =>
      [INVOICE_ITEMS_TYPES.PHOTOGRAPHER_PENALTY, INVOICE_ITEMS_TYPES.RESHOOT_PENALTY].includes(item.type)
    );

    const companyPenalties = items.filter((item) =>
      [INVOICE_ITEMS_TYPES.COMPANY_PENALTY, INVOICE_ITEMS_TYPES.SHOOTING_CANCELED, INVOICE_ITEMS_TYPES.SHOOTING_RESCHEDULED].includes(
        item.type
      )
    );

    const companyTravelPenaltyitems = items.filter((item) =>
      [INVOICE_ITEMS_TYPES.SHOOTING_TRAVEL_EXPENSES, INVOICE_ITEMS_TYPES.SHOOTING_REFUNDED_TRAVEL_EXPENSES].includes(item.type)
    );

    const companyRefunds = items.filter((item) => item.type === INVOICE_ITEMS_TYPES.COMPANY_REFUND);

    return [
      code,
      translations.t(`shootingStatuses.${state}`),
      photographerInfo,
      companyName,
      title,
      date,
      time,
      monthNumber,
      weekNumber,
      address,
      city,
      pricingPackageName,
      pricingPackageCurrency,
      pricingPackageCompanyPrice,
      pricingPackagePhotographerEarning,
      elaborateInvoiceTotalBalance(photographersRefundsItems),
      elaborateInvoiceTotalBalance(photographerBaseRefundsItems),
      elaborateInvoiceTotalBalance(photographersPenaltiesItems),
      elaborateInvoiceTotalBalance(companyPenalties),
      elaborateInvoiceTotalBalance(companyTravelPenaltyitems),
      elaborateInvoiceTotalBalance(companyRefunds),
      latitude,
      longitude,
      organizationID,
      companyID,
    ];
  });

  const headers = [
    translations.t('forms.shootingCodeForm'),
    translations.t('shootings.shotingStatus'),
    translations.t('shootings.photographer'),
    translations.t('company.name'),
    translations.t('forms.shootingTitle'),
    translations.t('calendar.shootingDate'),
    translations.t('calendar.shootingTime'),
    translations.t('shootings.shootingMonth'),
    translations.t('shootings.shootingWeek'),
    translations.t('forms.address'),
    translations.t('profile.city'),
    translations.t('forms.pricingPackageName'),
    translations.t('forms.currency'),
    translations.t('forms.shootingPrice'),
    translations.t('forms.photographerEarning'),
    translations.t('forms.photographersRefunds'),
    translations.t('forms.photographerBaseRefunds'),
    translations.t('forms.photographerPenalties'),
    translations.t('forms.companiesPenalties'),
    translations.t('forms.companiesTravelExpenses'),
    translations.t('forms.companiesRefunds'),
    translations.t('shootings.latitude'),
    translations.t('shootings.longitude'),
    translations.t('organization.id'),
    translations.t('company.id'),
  ];

  return [headers, ...rows];
};

export const buildAndDownloadCsv = (rows) => {
  const csv = unparse(rows, { header: 'true' });
  download(csv, 'orders_export.csv');
};

export const photoTypesWithoutOthers = (photoTypes) => photoTypes.filter((type) => type.type !== PHOTO_TYPES.OTHERS);
