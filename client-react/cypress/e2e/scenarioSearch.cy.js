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
    id: '905e58e1-5510-4535-b4c8-2ed30045772d',
    location: 'austin',
    lat: 30.2672,
    long: -97.7431,
  },
  {
    id: '90f3d018-bbd3-45be-9c11-debbff73fb6c',
    location: 'san francisco',
    lat: 37.7749,
    long: -122.4194,
  },
  {
    id: '6b819c6d-c8d4-4f2a-94c1-6eec48c6d8c8',
    location: 'montreal',
    lat: 45.5017,
    long: -73.5673,
  },
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

describe('#scenario: places', () => {
  beforeEach(() => {
    // Note: cypress clears localStorage automatically before each test
    setTestDefaults();
    expect(JSON.parse(localStorage.getItem('jawa-places'))).to.eql(TEST_PLACES);
    expect(JSON.parse(localStorage.getItem('jawa-prefs'))).to.eql(testPrefs);
    cy.visit('/');
  });

  it.skip('should pass smoke test before proceeding with other tests', () => {
    // place search input should have default placeholder text
    cy.findByTestId('place-search').should('exist');
    cy.findByPlaceholderText('Weather at your places').should('exist');

    // and places should be populated with default place
    cy.findAllByTestId('place-card')
      .should('have.length', 4)
      .eq(0)
      .as('place1');
    cy.get('@place1')
      .should('have.attr', 'data-id', '905e58e1-5510-4535-b4c8-2ed30045772d')
      .should('have.attr', 'data-location', 'austin')
      .should('have.attr', 'data-lat', '30.2672')
      .should('have.attr', 'data-long', '-97.7431')
      .within(() => {
        cy.findByTestId('place-weather-icon').should('exist');
        cy.findByTestId('place-location').should('have.text', 'austin');
        cy.findByTestId('place-hl').should('exist');
      });

    // and major page sections exist
    // current section
    cy.contains('Current Weather').should('exist');

    cy.findByTestId('current-top-left').within(() => {
      cy.findByTestId('current-location')
        .should('have.text', 'austin')
        .should(
          'have.attr',
          'data-current-id',
          '905e58e1-5510-4535-b4c8-2ed30045772d'
        );
      cy.findByTestId('current-weather-icon')
        .should('exist')
        .should('have.attr', 'width', '200')
        .should('have.attr', 'height', '200');
    });

    // and default units should be imperial
    cy.findByTestId('current-temp').contains('F');

    // daily section
    cy.contains('Forecast').should('exist');

    // If the HTML contains a non-breaking space entity &nbsp;
    // use the jQuery:contains selector and the Unicode value \u00a0
    cy.findByTestId('subtitle-forecast').filter(':contains("\u00a0")');
    // use callback in lieu of cy.wait()
    cy.findAllByTestId('daily-card').should((days) => {
      expect(days).to.have.length(7);
    });

    // hourly section
    cy.contains('Hourly Weather').should('exist');
    cy.contains('America/Chicago').should('exist');
    cy.findAllByTestId('hour-row').should((hours) => {
      expect(hours).to.have.length(24);
    });
  });

  it('should allow user to fetch weather for a searched place and save to places', () => {
    // given Search box is visible and empty
    cy.findByTestId('place-search').should('exist');
    cy.findByTestId('place-search').should('have.value', '');

    // when the user types in 'boston', log the autocomplete results
    cy.findByTestId('place-search').type('boston', { delay: 300 });
    cy.get('div.pac-item').each((elem) => {
      cy.log(elem.text());
    });

    // TODO: Unable to get cypress click event to fire the 'boston' fetch request
    // and user selects "Boston MA, USA"
    cy.get('div.pac-item').each((elem) => {
      if (elem.text().includes('MA')) {
        cy.wrap(elem).should('have.text', 'BostonMA, USA');
        cy.wrap(elem).should('be.visible').click({ force: true });
      }
    });

    // alternate approach
    // cy.get('div.pac-item')
    //   .contains('BostonMA, USA', { timeout: 1000 })
    //   .should('be.visible')
    //   .click({ force: true });

    // then the weather for boston should display
    // https://jawa-server-7odol.ondigitalocean.app/weather?lat=42.3600825&long=-71.0588801&units=imperial&lang=en&id=search&location=Boston
    cy.findByTestId('current-location', { timeout: 3000 })
      .should('have.text', 'boston')
      .should('have.attr', 'data-current-id', 'boston')
      .should('have.attr', 'data-current-lat', '42.3601')
      .should('have.attr', 'data-current-lon', '-71.0589');

    // and units should be imperial
    // cy.findByTestId('current-temp').contains('F');

    // and daily section should contain 7 days of weather
    // cy.findAllByTestId('daily-card').should((days) => {
    //   expect(days).to.have.length(7);
    // });

    // and hourly section should contain 24 hours of weather
    // cy.findAllByTestId('hour-row').should((hours) => {
    //   expect(hours).to.have.length(24);
    // });

    // when the user adds austin to places
    // cy.findByTestId('new-place').click();
  });
});
