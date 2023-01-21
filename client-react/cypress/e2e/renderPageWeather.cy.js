/// <reference types= "cypress" />

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

describe('#renderPageWeather', () => {
  beforeEach(() => {
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
    cy.get('[data-testid="place-search"]').should(
      'have.attr',
      'placeholder',
      'Weather at your places'
    );

    // and places should be populated with default place
    cy.get('[data-testid="places-container"]')
      .children('div')
      .its('length')
      .should('eq', 1);
    cy.get('[data-testid="places-container"]')
      .children('div')
      .eq(0)
      .as('place1');
    cy.get('@place1')
      .find('[data-testid="place-location"]')
      .should('have.text', 'new york');

    // and major page sections exist
    // current section
    cy.contains('Current Weather').should('exist');
    cy.get('[data-testid="current-top-left"]>[data-current-location]')
      .should('have.text', 'new york')
      .and(
        'have.attr',
        'data-current-id',
        'c9ae7c46-81e4-4c9d-a933-bb3c8d14fc87'
      );

    // daily section
    cy.contains('Forecast').should('exist');
    cy.get('[data-testid="daily-container"]')
      .children('div')
      .its('length')
      .should('eq', 7);

    // hourly section
    cy.contains('Hourly Weather').should('exist');
    cy.contains('America/New_York').should('exist');
    cy.get('[data-testid="subtitle-timezone"]').should(
      'have.text',
      'America/New_York'
    );
    cy.get('[data-testid="hourly-container"]')
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
    cy.get('[data-testid="current-temp"]').contains('F');

    // cypress testing library
    cy.findByPlaceholderText('Weather at your places').should('exist');
    cy.findAllByTestId('daily-card').should('have.length', 7);
    cy.findAllByTestId('hour-row').should('have.length', 24);
  });

  it('should display the correct weather icon and alt text for each day', () => {
    const dailyIcons = [
      'http://openweathermap.org/img/wn/04d.png',
      'http://openweathermap.org/img/wn/10d.png',
      'http://openweathermap.org/img/wn/10d.png',
      'http://openweathermap.org/img/wn/04d.png',
      'http://openweathermap.org/img/wn/10d.png',
      'http://openweathermap.org/img/wn/01d.png',
      'http://openweathermap.org/img/wn/01d.png',
    ];

    const dailyAlts = [
      'overcast clouds',
      'moderate rain',
      'moderate rain',
      'overcast clouds',
      'heavy intensity rain',
      'clear sky',
      'clear sky',
    ];

    cy.findAllByTestId('day-weather-icon')
      .should('have.length', 7)
      .each((img, index) => {
        cy.wrap(img).should('have.attr', 'width', '50');
        cy.wrap(img).should('have.attr', 'height', '50');
        cy.wrap(img).should('have.attr', 'src', dailyIcons[index]);
        cy.wrap(img).should('have.attr', 'alt', dailyAlts[index]);
      });
  });

  it('cypress only', () => {
    // cypress only
    const icons = [
      'http://openweathermap.org/img/wn/01d.png',
      'http://openweathermap.org/img/wn/03d.png',
      'http://openweathermap.org/img/wn/04n.png',
      'http://openweathermap.org/img/wn/04n.png',
      'http://openweathermap.org/img/wn/04n.png',
      'http://openweathermap.org/img/wn/04n.png',
      'http://openweathermap.org/img/wn/04d.png',
      'http://openweathermap.org/img/wn/04d.png',
      'http://openweathermap.org/img/wn/04d.png',
      'http://openweathermap.org/img/wn/04d.png',
      'http://openweathermap.org/img/wn/04d.png',
      'http://openweathermap.org/img/wn/04d.png',
      'http://openweathermap.org/img/wn/04d.png',
      'http://openweathermap.org/img/wn/04d.png',
      'http://openweathermap.org/img/wn/04n.png',
      'http://openweathermap.org/img/wn/10n.png',
      'http://openweathermap.org/img/wn/10n.png',
      'http://openweathermap.org/img/wn/10n.png',
      'http://openweathermap.org/img/wn/04d.png',
      'http://openweathermap.org/img/wn/10d.png',
      'http://openweathermap.org/img/wn/10d.png',
      'http://openweathermap.org/img/wn/04d.png',
      'http://openweathermap.org/img/wn/04d.png',
      'http://openweathermap.org/img/wn/04d.png',
    ];

    const alts = [
      'clear sky',
      'scattered clouds',
      'overcast clouds',
      'overcast clouds',
      'broken clouds',
      'broken clouds',
      'broken clouds',
      'overcast clouds',
      'overcast clouds',
      'overcast clouds',
      'overcast clouds',
      'broken clouds',
      'broken clouds',
      'overcast clouds',
      'overcast clouds',
      'light rain',
      'moderate rain',
      'light rain',
      'overcast clouds',
      'light rain',
      'light rain',
      'overcast clouds',
      'overcast clouds',
      'broken clouds',
    ];

    cy.get('[data-testid=hour-weather-icon]')
      .should('have.length', 24)
      .each((img, index) => {
        // cy.wrap the variable in order to call cypress commands
        cy.wrap(img).should('have.attr', 'src', icons[index]);
        cy.wrap(img).should('have.attr', 'alt', alts[index]);
      });
  });

  it('cypress testing library', () => {
    // using cypress testing library
    const icons = [
      'http://openweathermap.org/img/wn/01d.png',
      'http://openweathermap.org/img/wn/03d.png',
      'http://openweathermap.org/img/wn/04n.png',
      'http://openweathermap.org/img/wn/04n.png',
      'http://openweathermap.org/img/wn/04n.png',
      'http://openweathermap.org/img/wn/04n.png',
      'http://openweathermap.org/img/wn/04d.png',
      'http://openweathermap.org/img/wn/04d.png',
      'http://openweathermap.org/img/wn/04d.png',
      'http://openweathermap.org/img/wn/04d.png',
      'http://openweathermap.org/img/wn/04d.png',
      'http://openweathermap.org/img/wn/04d.png',
      'http://openweathermap.org/img/wn/04d.png',
      'http://openweathermap.org/img/wn/04d.png',
      'http://openweathermap.org/img/wn/04n.png',
      'http://openweathermap.org/img/wn/10n.png',
      'http://openweathermap.org/img/wn/10n.png',
      'http://openweathermap.org/img/wn/10n.png',
      'http://openweathermap.org/img/wn/04d.png',
      'http://openweathermap.org/img/wn/10d.png',
      'http://openweathermap.org/img/wn/10d.png',
      'http://openweathermap.org/img/wn/04d.png',
      'http://openweathermap.org/img/wn/04d.png',
      'http://openweathermap.org/img/wn/04d.png',
    ];

    const alts = [
      'clear sky',
      'scattered clouds',
      'overcast clouds',
      'overcast clouds',
      'broken clouds',
      'broken clouds',
      'broken clouds',
      'overcast clouds',
      'overcast clouds',
      'overcast clouds',
      'overcast clouds',
      'broken clouds',
      'broken clouds',
      'overcast clouds',
      'overcast clouds',
      'light rain',
      'moderate rain',
      'light rain',
      'overcast clouds',
      'light rain',
      'light rain',
      'overcast clouds',
      'overcast clouds',
      'broken clouds',
    ];

    cy.findAllByTestId('hour-weather-icon')
      .should('have.length', 24)
      .each((img, index) => {
        // cy.wrap the variable in order to call cypress commands
        cy.wrap(img).should('have.attr', 'src', icons[index]);
        cy.wrap(img).should('have.attr', 'alt', alts[index]);
      });
  });
});
