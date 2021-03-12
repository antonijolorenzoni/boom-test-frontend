/* eslint-disable */

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

  cy.route('GET', 'api/v1/photoTypes', 'fixture:first-render/photoTypes.json').as('getPhotoTypes');

  // currencies stub
  cy.route('GET', 'api/v1/currencies?page=0&pageSize=50', 'fixture:first-render/currencies.json').as('getCurrencies');

  cy.route(
    'GET',
    'api/v1/orders?address=&company&createdAt=DESC&orderCode=&orderStatuses=UNSCHEDULED&page=0&pageSize=20&updatedAt',
    'fixture:dashboard/orders-page-0.json'
  ).as('getOrders-0');

  cy.route(
    'GET',
    'api/v1/orders?address=&company&createdAt=DESC&orderCode=&orderStatuses=UNSCHEDULED&page=1&pageSize=20&updatedAt',
    'fixture:dashboard/orders-page-1.json'
  ).as('getOrders-1');

  cy.visit('/orders-dashboard', {
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
  cy.wait('@getPhotoTypes');
  cy.wait('@getCurrencies');

  cy.wait('@getOrders-0');
});

describe('Orders dashboard', () => {
  it('render the first page with default filters and click on an order to open drawer', () => {
    cy.route('GET', 'api/v1/organizations/1/shootings/2', 'fixture:dashboard/order-2.json').as('getOrder2');
    cy.route('GET', 'api/v1/invoicing/items?page=0&pageSize=5000&shootingId=2', 'fixture:dashboard/items-2.json').as('getItems2');
    cy.route('GET', 'api/v1/events/shootings/2?page=0&pageSize=100', 'fixture:dashboard/events-2.json').as('getEvents2');
    cy.route('GET', 'api/v1/organizations/15/companies/15/details', 'fixture:dashboard/events-2.json').as('getCompany15');
    cy.route('GET', 'api/v1/organizations/1/checklists/companyChecklist/15', 'fixture:dashboard/checklist-15.json').as('getChecklist15');

    cy.route({
      method: 'GET',
      url: 'api/v1/organizations/1/shootings/2/details/uploadNotes',
      response: { code: 31001, message: 'Upload notes not found for shooting: 2' },
      force404: true,
    });

    cy.findByTestId('tabs-wrapper');
    cy.findByTestId('order-2').click();
    cy.wait(2000);
    cy.findByTestId('unscheduled-order-view');
  });

  it('render first two pages scrolling down', () => {
    cy.get('tbody > tr').should('have.length', 20);
    cy.findByTestId('order-20').should('not.exist');
    cy.scrollTo(0, 1500);
    cy.get('tbody > tr').should('have.length', 40);
    cy.findByTestId('order-20').should('exist');
    cy.scrollTo(0, 1500);
    cy.get('tbody > tr').should('have.length', 40);
  });

  it('render in 1920 x 1080 viewport size and should have 40 items without scrolling', () => {
    cy.viewport(1920, 1080);
    cy.get('tbody > tr').should('have.length', 40);
  });
});
