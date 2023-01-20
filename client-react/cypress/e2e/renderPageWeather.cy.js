/// <reference types= "cypress" />

describe('#renderPageWeather', () => {
  const testPlace = [
    {
      id: 'c9ae7c46-81e4-4c9d-a933-bb3c8d14fc87',
      location: 'new york',
      lat: 40.7306,
      long: -73.9352,
    },
  ];

  const testPrefs = [{ units: 'imperial', theme: 'jawa', lang: 'en' }];

  function setTestDefaults() {
    localStorage.setItem('jawa-places', JSON.stringify(testPlace));
    localStorage.setItem('jawa-prefs', JSON.stringify(testPrefs));
  }

  before(() => {
    setTestDefaults();
    // deep equality
    expect(JSON.parse(localStorage.getItem('jawa-places'))).to.eql(testPlace);
    expect(JSON.parse(localStorage.getItem('jawa-prefs'))).to.eql(testPrefs);

    // register the intercept before loading the page
    cy.intercept('GET', '**/weather**', {
      fixture: 'nycWeatherFixture.json',
    }).as('nycMock');
    cy.visit('/');

    // access the alias from .then()
    cy.wait('@nycMock').then((interception) => {
      expect(interception.response.statusCode).to.eq(200);
      expect(interception.response.body.coordinates.id).to.equal(
        'c9ae7c46-81e4-4c9d-a933-bb3c8d14fc87'
      );
    });
  });

  it('should pass smoke test of page layout before proceeding', () => {
    // place search input should have default placeholder text
    cy.get('[data-test="place-search"]').should(
      'have.attr',
      'placeholder',
      'Weather at your places'
    );

    // and places should be populated with default place
    cy.get('[data-test="places-container"]')
      .children('div')
      .its('length')
      .should('eq', 1);
    cy.get('[data-test="places-container"]').children('div').eq(0).as('place1');
    cy.get('@place1')
      .find('[data-test="place-location"]')
      .should('have.text', 'new york');

    // and major page sections exist
    // current section
    cy.contains('Current Weather').should('exist');
    cy.get('[data-test="current-top-left"]>[data-current-location]')
      .should('have.text', 'new york')
      .and(
        'have.attr',
        'data-current-id',
        'c9ae7c46-81e4-4c9d-a933-bb3c8d14fc87'
      );

    // daily section
    cy.contains('Forecast').should('exist');
    cy.get('[data-test="daily-container"]')
      .children('div')
      .its('length')
      .should('eq', 7);

    // hourly section
    cy.contains('Hourly Weather').should('exist');
    cy.contains('America/New_York').should('exist');
    cy.get('[data-test="subtitle-timezone"]').should(
      'have.text',
      'America/New_York'
    );
    cy.get('[data-test="hourly-container"]')
      .children('div')
      .its('length')
      .should('eq', 24);

    // footer
    cy.contains('Powered By OpenWeather').should('exist');
    cy.get('a')
      .invoke('attr', 'href')
      .should('eq', 'https://openweathermap.org/api')
      .then((href) => {
        cy.request(href).its('status').should('eq', 200);
      });

    // and default units should be imperial
    cy.get('[data-test="current-temp"]').contains('F');

    // TODO: watch testing-library/cypress video
    // cy.get('[data-visibility-units]').should(
    //   'have.attr',
    //   'data-visibility-units',
    //   ' mi'
    // );
    // cy.get('[data-wind-units]').should('have.attr', 'data-wind-units', ' mph ');

    // daily section, wind units only
    // cy.get('.daily-container')
    //   .find('[data-daily-wind-speed]')
    //   .each((elem) => {
    //     const after = win.getComputedStyle(elem[0], '::after');
    //     expect(after.getPropertyValue('content')).to.eq('" mph "');
    //   });

    // hourly section, wind units only
    // cy.get('.hourly-container')
    //   .find('[data-hour-wind-speed]')
    //   .each((elem) => {
    //     const after = win.getComputedStyle(elem[0], '::after');
    //     expect(after.getPropertyValue('content')).to.eq('" mph "');
    //   });

    // TODO: continue with tests from original renderPageWeather.cy.js
  });
});
