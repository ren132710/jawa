/// <reference types= "cypress" />

// eslint-disable-next-line no-unused-vars
Cypress.on('uncaught:exception', (err, runnable) => {
  console.log('uncaught:exception err', err);
  console.log('uncaught:exception runnable', runnable);
  // returning false here prevents Cypress from failing the test
  return false;
});

const TEST_PLACES = [
  {
    id: 'c9ae7c46-81e4-4c9d-a933-bb3c8d14fc87',
    location: 'new york',
    lat: 40.7128,
    long: -74.006,
  },
];

const testPrefs = [{ units: 'imperial', theme: 'jawa', lang: 'en' }];

function setTestDefaults() {
  localStorage.setItem('jawa-places', JSON.stringify(TEST_PLACES));
  localStorage.setItem('jawa-prefs', JSON.stringify(testPrefs));
}

describe('#scenarioSearch', () => {
  beforeEach(() => {
    // clear local storage and set test defaults
    localStorage.clear();
    setTestDefaults();
    expect(JSON.parse(localStorage.getItem('jawa-places'))).to.eql(TEST_PLACES);
    expect(JSON.parse(localStorage.getItem('jawa-prefs'))).to.eql(testPrefs);
    cy.visit('/');

    // then make sure the page is fully loaded before proceeding with tests
    cy.findByTestId('place-search').should('exist');
    cy.findByPlaceholderText('Weather at your places').should('exist');
    cy.contains('Hourly Weather').should('exist');
    cy.contains('America/New_York').should('exist');
    cy.findAllByTestId('hour-row').then((hours) => {
      expect(hours).to.have.length(24);
    });
  });

  it('should allow user to fetch weather for a searched place and save to places', () => {
    // given Search box is visible and empty
    cy.findByTestId('place-search').should('exist');
    cy.findByTestId('place-search').should('have.value', '');

    // when the user types in 'boston', log the autocomplete results
    cy.findByTestId('place-search').type('boston', { delay: 200 });
    cy.get('div.pac-item').each((elem) => {
      cy.log(elem.text());
    });

    // and user selects "Boston MA, USA" from autocomplete
    cy.get('div.pac-container')
      .children('div')
      .contains('BostonMA, USA')
      .should('be.visible')
      .as('boston');
    cy.get('@boston')
      .click({ force: true })
      .then(() => {
        cy.log('search item clicked');
      });

    // then the weather for boston should display
    // https://jawa-server-7odol.ondigitalocean.app/weather?lat=42.3600825&long=-71.0588801&units=imperial&lang=en&id=search&location=Boston
    cy.findByTestId('current-location', { timeout: 2000 })
      .should('have.text', 'Boston')
      .should('have.attr', 'data-current-lat', '42.3601')
      .should('have.attr', 'data-current-long', '-71.0589');

    // and units should be imperial
    cy.findByTestId('current-temp').contains('F');

    // and daily section should contain 7 days of weather
    cy.findAllByTestId('daily-card').then((days) => {
      expect(days).to.have.length(7);
    });

    // and hourly section should contain 24 hours of weather
    cy.findAllByTestId('hour-row').then((hours) => {
      expect(hours).to.have.length(24);
    });

    // when the user adds boston to places
    cy.findByTestId('btnNewPlace').click();

    // then the new place should be added to places
    // and there should be 5 places
    cy.findAllByTestId('place-card').then((places) => {
      expect(places).to.have.length(2);
    });

    // and the new place should be the last place and should be boston
    cy.findAllByTestId('place-card')
      .last()
      .should('have.attr', 'data-location', 'Boston')
      .should('have.attr', 'data-lat', '42.3601')
      .should('have.attr', 'data-long', '-71.0589');

    // and the card background should be transparent
    cy.findAllByTestId('place-card')
      .last()
      .should('have.css', 'background-color', 'rgba(0, 0, 0, 0)');
  });
});
