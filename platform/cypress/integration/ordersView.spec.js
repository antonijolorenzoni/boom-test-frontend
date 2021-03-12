/* eslint-disable */

const moment = require('moment');
import translations from '../../src/translations/i18next';

const dateFrom = moment().startOf('day').valueOf();
const dateTo = moment().endOf('day').valueOf();

beforeEach(() => {
  cy.server();

  cy.route('GET', 'api/v1/features', 'fixture:first-render/features.json').as('getFeatures');

  // user stuff stub
  cy.route('GET', 'api/v1/users/me', 'fixture:first-render/me.json').as('getMe');
  cy.route('GET', 'api/v1/roles', 'fixture:first-render/roles.json').as('getRoles');
  cy.route('GET', 'api/v1/notifications?page=0&pageSize=10&seen=false', 'fixture:first-render/notifications').as('getNotifications');
  cy.route('GET', 'api/v1/organizations/1/users/156/accessRules/mine?pageSize=50&type=USER', 'fixture:first-render/myAccessRules.json').as(
    'getMyAccessRules'
  );

  // permissions stub
  cy.route('GET', 'api/v1/roles/2/permissions', 'fixture:first-render/permissions/2.json').as('getPermRole2');
  cy.route('GET', 'api/v1/roles/4/permissions', 'fixture:first-render/permissions/4.json').as('getPermRole4');
  cy.route('GET', 'api/v1/roles/5/permissions', 'fixture:first-render/permissions/5.json').as('getPermRole5');
  cy.route('GET', 'api/v1/roles/6/permissions', 'fixture:first-render/permissions/6.json').as('getPermRole6');
  cy.route('GET', 'api/v1/roles/7/permissions', 'fixture:first-render/permissions/7.json').as('getPermRole7');

  // orders and photo types stub
  cy.route(
    'get',
    `api/v1/organizations/1/shootings?dateFrom=${dateFrom}&dateTo=${dateTo}&page=0&pageSize=10&search=&sortDirection=DESC&sortField=startDate`,
    'fixture:orders-view/orders.json'
  ).as('getOrders');

  cy.route('GET', 'api/v1/photoTypes', 'fixture:first-render/photoTypes.json').as('getPhotoTypes');

  // currencies stub
  cy.route('GET', 'api/v1/currencies?page=0&pageSize=50', 'fixture:first-render/currencies.json').as('getCurrencies');

  // ph stub
  cy.route('GET', 'api/v1/photographers/8', 'fixture:orders-view/ph-8.json').as('ph-8');
  cy.route('GET', 'api/v1/photographers/658', 'fixture:orders-view/ph-658.json').as('ph-658');

  cy.visit('/orders', {
    onBeforeLoad(win) {
      win.localStorage.setItem('isAuthenticated', true);
      win.localStorage.setItem('token', Cypress.env('token'));
    },
  });

  cy.wait('@getMe');
  cy.wait('@getRoles');
  cy.wait('@getNotifications');
  cy.wait('@getMyAccessRules');
  cy.wait('@getPermRole2');
  cy.wait('@getPermRole4');
  cy.wait('@getPermRole5');
  cy.wait('@getPermRole6');
  cy.wait('@getPermRole7');
  cy.wait('@getOrders');
  cy.wait('@getPhotoTypes');
  cy.wait('@getCurrencies');
});

describe('Orders view', () => {
  // to test:
  // - number of items
  // - content of order info
  // - filter reset
  // - export csv number
  // - order selection
  // - evaluation

  it.only('render the first page with default filters, scrolling down no other orders will be fetched', () => {
    cy.findByTestId('orders-wrapper').children().should('have.length', 3);
  });

  it('clear the dateFrom filter and scroll the view to fetch also the second page', () => {
    cy.route(
      'get',
      `api/v1/organizations/1/shootings?dateFrom&dateTo=${dateTo}&page=0&pageSize=10&search=&sortDirection=DESC&sortField=startDate`,
      'fixture:orders-view/orders-page-0.json'
    ).as('getOrders-0-no-date-from');

    cy.route(
      'get',
      `api/v1/organizations/1/shootings?dateFrom&dateTo=${dateTo}&page=1&pageSize=10&search=&sortDirection=DESC&sortField=startDate`,
      'fixture:orders-view/orders-page-1.json'
    ).as('getOrders-1-no-date-from');

    cy.findByTestId('start-date-clear').click();
    cy.get('[data-testid="buttons-wrapper"] > :first-child').click();

    cy.wait('@getOrders-0-no-date-from');
    cy.wait('@ph-8');

    cy.scrollTo(0, 1500);
    cy.wait('@getOrders-1-no-date-from');
  });

  it('reset the filter using button', () => {});
});
