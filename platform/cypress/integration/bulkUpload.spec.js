/* eslint-disable */

const moment = require('moment');
import translations from '../../src/translations/i18next';
import { headerFields } from '../../src/components/Shooting/ShootingBulkUploadView/utils';

beforeEach(() => {
  const dateFrom = moment().startOf('week').valueOf();
  const dateTo = moment().endOf('week').add(2, 'day').valueOf();

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

  // shootings and photo types stub
  cy.route(
    'get',
    `api/v1/organizations/1/shootings?dateFrom=${dateFrom}&dateTo=${dateTo}&page=0&pageSize=500000&states=NEW&states=AUTO_ASSIGNMENT&states=PENDING&states=MATCHED&states=ASSIGNED&states=ACCEPTED&states=UPLOADED&states=POST_PROCESSING&states=DONE&states=DOWNLOADED&states=CANCELED&states=RESHOOT&states=ARCHIVED&states=REFUSED`,
    'fixture:first-render/shootings.json'
  ).as('getShootings');
  cy.route('GET', 'api/v1/photoTypes', 'fixture:first-render/photoTypes.json').as('getPhotoTypes');

  // currencies stub
  cy.route('GET', 'api/v1/currencies?page=0&pageSize=50', 'fixture:first-render/currencies.json').as('getCurrencies');

  cy.visit('/', {
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
  cy.wait('@getShootings');
  cy.wait('@getPhotoTypes');
  cy.wait('@getCurrencies');
});

describe('Bulk shooting insert', () => {
  it('correctly bulk insert', function () {
    cy.route('POST', 'api/v1/bulk/shootings', 'fixture:bulk-import/upload-response-ok.json').as('postShootings');

    cy.findByText('Bulk upload shootings').click();
    cy.fixture('bulk-import/standard.csv').then((fileContent) => {
      cy.findByTestId('bulk-upload-input').upload({ fileContent, fileName: 'shootings.csv', mimeType: 'csv' });

      cy.findByTestId('header-error-wrapper').should('not.exist');
      cy.findByTestId('csv-error-wrapper').should('not.exist');

      cy.contains(translations.t('shootings.bulkInsertPreview.title'));
      cy.contains(
        translations.t('shootings.bulkInsertPreview.normalShootingsCount', {
          normalCount: 6,
        })
      );
      cy.contains(
        translations.t('shootings.bulkInsertPreview.openDateShootingsCount', {
          openDateCount: 0,
        })
      );
      cy.findByText(translations.t('modals.confirm')).click();

      cy.wait('@postShootings').should((xhr) => {
        expect(xhr.requestBody).to.be.an('array');

        cy.fixture('bulk-import/request-body-standard.json').then((body) => {
          expect(xhr.requestBody).to.deep.equal(body);
        });
      });
      cy.findByText(translations.t('shootings.bulkInsertSuccess'));
    });
  });

  it('does not an insertion: invalid csv header', function () {
    cy.findByText('Bulk upload shootings').click();
    cy.fixture('bulk-import/invalid_header.csv').then((fileContent) => {
      cy.findByTestId('bulk-upload-input').upload({ fileContent, fileName: 'shootings.csv', mimeType: 'csv' });

      cy.findByTestId('header-error-wrapper').within(() => {
        cy.get('span').eq(0).contains(translations.t('shootings.csvValidationErrorHeaderTitle'));
        cy.get('div > div').eq(0).contains(`${headerFields[0].label}: Organisation`);
        cy.get('div > div').eq(1).contains(`${headerFields[3].label}: ${headerFields[4].label}`);
        cy.get('div > div').eq(2).contains(`${headerFields[4].label}: ${headerFields[3].label}`);
      });
    });
  });

  it('does not an insertion: invalid csv header length', function () {
    cy.findByText('Bulk upload shootings').click();
    cy.fixture('bulk-import/invalid_header_wrong_length.csv').then((fileContent) => {
      cy.findByTestId('bulk-upload-input').upload({ fileContent, fileName: 'shootings.csv', mimeType: 'csv' });
      cy.findByText(translations.t('shootings.csvValidationErrorHeaderLengthTitle'));
    });
  });

  it('does not an insertion: client csv validation fails', function () {
    cy.findByText('Bulk upload shootings').click();
    cy.fixture('bulk-import/error.csv').then((fileContent) => {
      cy.findByTestId('bulk-upload-input').upload({ fileContent, fileName: 'shootings.csv', mimeType: 'csv' });

      cy.findByTestId('csv-error-wrapper').within(() => {
        cy.get('span').eq(0).contains(translations.t('shootings.csvValidationErrorTitle'));
        cy.get('div > div')
          .eq(0)
          .contains(`2: ${translations.t('shootings.csvValidationErrors.emptyFields')}`);
        cy.get('div > div')
          .eq(1)
          .contains(`5: ${translations.t('shootings.csvValidationErrors.wrongDateFormat')}`);
        cy.get('div > div')
          .eq(2)
          .contains(
            `6: ${translations.t('shootings.csvValidationErrors.wrongDateFormat')}, ${translations.t(
              'shootings.csvValidationErrors.wrongTimeFormat'
            )}`
          );
        cy.get('div > div')
          .eq(3)
          .contains(`7: ${translations.t('shootings.csvValidationErrors.wrongPhoneFormat')}`);
        cy.get('div > div')
          .eq(4)
          .contains(`8: ${translations.t('shootings.csvValidationErrors.wrongEmailFormat')}`);
        cy.get('div > div')
          .eq(5)
          .contains(`9: ${translations.t('shootings.csvValidationErrors.dateWithoutTime')}`);
      });
    });
  });

  it('does not an insertion: server csv validation fails', function () {
    cy.route('POST', 'api/v1/bulk/shootings', 'fixture:bulk-import/upload-response-errors.json').as('postShootings');

    cy.findByText('Bulk upload shootings').click();
    cy.fixture('bulk-import/standard.csv').then((fileContent) => {
      cy.findByTestId('bulk-upload-input').upload({ fileContent, fileName: 'shootings.csv', mimeType: 'csv' });
      cy.findByTestId('header-error-wrapper').should('not.exist');
      cy.findByTestId('csv-error-wrapper').should('not.exist');

      cy.contains(translations.t('shootings.bulkInsertPreview.title'));
      cy.contains(
        translations.t('shootings.bulkInsertPreview.normalShootingsCount', {
          normalCount: 6,
        })
      );
      cy.contains(
        translations.t('shootings.bulkInsertPreview.openDateShootingsCount', {
          openDateCount: 0,
        })
      );
      cy.findByText(translations.t('modals.confirm')).click();
      cy.wait('@postShootings');
      cy.findByText(translations.t('shootings.bulkInsertCsvError'));

      cy.findByTestId('job-info-wrapper').within(() => {
        cy.get('span').eq(1).contains(translations.t('shootings.bulkInsertInsertedShootings.title'));
        cy.get('span')
          .eq(2)
          .contains(
            translations.t('shootings.bulkInsertInsertedShootings.normalShootingsCount', {
              normalCount: 4,
            })
          );
        cy.get('span')
          .eq(3)
          .contains(
            translations.t('shootings.bulkInsertInsertedShootings.openDateShootingsCount', {
              openDateCount: 0,
            })
          );
        cy.get('span')
          .eq(4)
          .contains(`${translations.t('shootings.bulkInsertErrorsTitle')}: 2`);
      });
    });
  });
});
