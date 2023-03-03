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
    // clear local storage and set test defaults
    localStorage.clear();
    setTestDefaults();
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

  it('should pass smoke test before proceeding with other tests', () => {
    // place search input should have default placeholder text
    cy.findByTestId('place-search').should('exist');
    cy.findByPlaceholderText('Weather at your places').should('exist');

    // and places should be populated with default place
    cy.findByTestId('places-container')
      .should('have.length', 1)
      .eq(0)
      .within(() => {
        cy.findByTestId('place-weather-icon')
          .invoke('attr', 'src')
          .should('eq', 'https://openweathermap.org/img/wn/01d.png')
          .then((src) => {
            cy.request(src).its('status').should('eq', 200);
          });
        cy.findByTestId('place-weather-icon').should(
          'have.attr',
          'alt',
          'clear sky'
        );
        cy.findByTestId('place-location').should('have.text', 'new york');
        cy.findByTestId('place-hl').should('have.text', '78/64°');
      });

    // and major page sections exist
    // current section
    cy.contains('Current Weather').should('exist');
    cy.findByTestId('subtitle-current').should(
      'have.text',
      'Mon 6 Jun 5:19 PM'
    );
    cy.findByTestId('current-top-left')
      .should('have.length', 1)
      .within(() => {
        cy.findByTestId('current-location')
          .should('have.text', 'new york')
          .should(
            'have.attr',
            'data-current-id',
            'c9ae7c46-81e4-4c9d-a933-bb3c8d14fc87'
          );
        cy.findByTestId('current-weather-icon')
          // .should('have.attr', 'width', '200')
          // .should('have.attr', 'height', '200')
          .invoke('attr', 'src')
          .should('eq', 'https://openweathermap.org/img/wn/01d@4x.png')
          .then((src) => {
            cy.request(src).its('status').should('eq', 200);
          });
      });

    // and default units should be imperial
    cy.findByTestId('current-temp').contains('F');

    // daily section
    cy.contains('Forecast').should('exist');

    // If the HTML contains a non-breaking space entity &nbsp;
    // use the jQuery:contains selector and the Unicode value \u00a0
    cy.findByTestId('subtitle-forecast').filter(':contains("\u00a0")');
    cy.findAllByTestId('daily-card')
      .should('have.length', 7)
      .eq(0)
      .within(() => {
        cy.findByTestId('day-weather-icon')
          .invoke('attr', 'src')
          .should('eq', 'https://openweathermap.org/img/wn/04d.png')
          .then((src) => {
            cy.request(src).its('status').should('eq', 200);
          });
        cy.findByTestId('day-weather-icon').should(
          'have.attr',
          'alt',
          'overcast clouds'
        );
        cy.findByTestId('day-name').should('have.text', 'Tuesday');
        cy.findByTestId('day-hl').should('have.text', '75/64°');
        cy.findByTestId('day-description').should(
          'have.text',
          'overcast clouds'
        );
        cy.findByTestId('day-humidity').should('have.text', '49%');
        cy.findByTestId('day-wind').should('have.text', '21 mph S');
      });

    // hourly section
    cy.contains('Hourly Weather').should('exist');
    cy.contains('America/New_York').should('exist');
    cy.findByTestId('subtitle-hourly').should('have.text', 'America/New_York');
    cy.findAllByTestId('hour-row')
      .should('have.length', 24)
      .eq(0)
      .within(() => {
        cy.findByTestId('hour-day').should('have.text', 'Monday');
        cy.findByTestId('hour-name').should('have.text', '6PM');
        cy.findByTestId('hour-weather-icon')
          .invoke('attr', 'src')
          .should('eq', 'https://openweathermap.org/img/wn/01d.png')
          .then((src) => {
            cy.request(src).its('status').should('eq', 200);
          });
        cy.findByTestId('hour-weather-icon').should(
          'have.attr',
          'alt',
          'clear sky'
        );
        cy.findByTestId('hour-temp').should('have.text', '77°');
        cy.findByTestId('hour-precip').should('have.text', '0%');
        cy.findByTestId('hour-wind').should('have.text', '14 mph S');
        cy.findByTestId('hour-humidity').should('have.text', '38%');
        cy.findByTestId('hour-uv-level').should('have.text', 'low');
      });

    // footer
    cy.contains('Powered By OpenWeather').should('exist');
    cy.get('a')
      .invoke('attr', 'href')
      .should('eq', 'https://openweathermap.org/api')
      .then((href) => {
        cy.request(href).its('status').should('eq', 200);
      });
  });

  it('should correctly display current weather', () => {
    // top left quadrant
    cy.findByTestId('current-top-left')
      .should('have.length', 1)
      .within(() => {
        cy.findByTestId('current-location')
          .should('have.text', 'new york')
          .should(
            'have.attr',
            'data-current-id',
            'c9ae7c46-81e4-4c9d-a933-bb3c8d14fc87'
          );
        cy.findByTestId('current-weather-icon')
          .invoke('attr', 'src')
          .should('eq', 'https://openweathermap.org/img/wn/01d@4x.png')
          .then((src) => {
            cy.request(src).its('status').should('eq', 200);
          });
        cy.findByTestId('current-weather-icon').should(
          'have.attr',
          'alt',
          'clear sky'
        );
        cy.findByTestId('btnNewPlace')
          .should('exist')
          .should('have.text', 'New Place')
          .should('have.attr', 'data-location', 'new york')
          .should('have.attr', 'data-lat', '40.7128')
          .should('have.attr', 'data-long', '-74.006')
          .should(
            'have.css',
            'text-decoration',
            'underline solid rgb(0, 102, 153)'
          );
      });

    // top right quadrant
    cy.findByTestId('current-top-right')
      .should('have.length', 1)
      .within(() => {
        cy.findByTestId('current-lat').should('contain', '40.7128');
        cy.findByTestId('current-long').should('contain', '-74.006');
        cy.findByTestId('current-hl').should('have.text', '78/64°');
        cy.findByTestId('current-temp').should('have.text', '78° F');
        cy.findByTestId('current-fl').should('have.text', '77°');
        cy.findByTestId('current-description').should('have.text', 'clear sky');
        cy.findByTestId('current-precip').should('have.text', '0%');
        cy.findByTestId('current-visibility').should('have.text', '6.2 mi');
      });

    // bottom left quadrant
    cy.findByTestId('current-bottom-left')
      .should('have.length', 1)
      .within(() => {
        cy.findByTestId('current-uv').should('have.text', '2.56 low');
        cy.findByTestId('current-humidity').should('have.text', '40%');
        cy.findByTestId('current-wind').should('have.text', '17 mph S');
      });

    // bottom right quadrant
    cy.findByTestId('current-bottom-right')
      .should('have.length', 1)
      .within(() => {
        cy.findByTestId('current-dew-point').should('have.text', '51°');
        cy.findByTestId('current-sunrise').should('have.text', '5:25 AM');
        cy.findByTestId('current-sunset').should('have.text', '8:24 PM');
      });
  });

  it('should correctly display daily weather', () => {
    cy.findByTestId('daily-container').then(() => {
      cy.get('[data-testid="day-name"]').should(
        'have.text',
        'TuesdayWednesdayThursdayFridaySaturdaySundayMonday'
      );
      cy.get('[data-testid="day-hl"]').should(
        'have.text',
        '75/64°80/67°81/68°77/63°70/61°77/58°77/61°'
      );
      cy.get('[data-testid="day-description"]').should(
        'have.text',
        'overcast cloudsmoderate rainmoderate rainovercast cloudsheavy intensity rainclear skyclear sky'
      );
      cy.get('[data-testid="day-humidity"]').should(
        'have.text',
        '49%72%58%48%96%47%46%'
      );
      cy.get('[data-testid="day-wind"]').should(
        'have.text',
        '21 mph S14 mph S17 mph NW10 mph S15 mph NE14 mph W13 mph NW'
      );
    });

    const dailyIcons = [
      'https://openweathermap.org/img/wn/04d.png',
      'https://openweathermap.org/img/wn/10d.png',
      'https://openweathermap.org/img/wn/10d.png',
      'https://openweathermap.org/img/wn/04d.png',
      'https://openweathermap.org/img/wn/10d.png',
      'https://openweathermap.org/img/wn/01d.png',
      'https://openweathermap.org/img/wn/01d.png',
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

  it('should display hourly weather', () => {
    cy.findByTestId('hourly-container').then(() => {
      cy.get('[data-testid="hour-day"]').should(
        'have.text',
        'MondayMondayMondayTuesdayTuesdayTuesdayTuesdayTuesdayTuesdayTuesdayTuesdayTuesdayTuesdayTuesdayTuesdayWednesdayWednesdayWednesdayWednesdayWednesdayWednesdayWednesdayWednesdayWednesday'
      );
      cy.get('[data-testid="hour-name"]').should(
        'have.text',
        '6PM8PM10PM12AM2AM4AM6AM8AM10AM12PM2PM4PM6PM8PM10PM12AM2AM4AM6AM8AM10AM12PM2PM4PM'
      );
      cy.get('[data-testid="hour-temp"]').should(
        'have.text',
        '77°74°71°68°66°65°64°67°72°75°75°74°72°70°69°68°67°67°67°68°70°74°79°80°'
      );
      cy.get('[data-testid="hour-precip"]').should(
        'have.text',
        '0%0%0%0%0%0%0%0%0%0%0%0%0%0%3%26%87%84%79%82%76%66%48%0%'
      );
      cy.get('[data-testid="hour-wind"]').should(
        'have.text',
        '14 mph S13 mph S12 mph S10 mph SW9 mph SW8 mph SW7 mph SW11 mph SW12 mph S16 mph S20 mph S21 mph S20 mph S17 mph S16 mph S14 mph S12 mph S10 mph S7 mph S7 mph SW6 mph SW4 mph W5 mph SW10 mph S'
      );
      cy.get('[data-testid="hour-humidity"]').should(
        'have.text',
        '38%41%44%46%49%56%63%61%51%49%51%55%64%72%76%84%92%94%95%93%86%72%57%56%'
      );
      cy.get('[data-testid="hour-uv-level"]').should(
        'have.text',
        'lowlowlowlowlowlowlowlowmediumhighhighmediumlowlowlowlowlowlowlowlowlowhighhighmedium'
      );
    });
    const hourlyIcons = [
      'https://openweathermap.org/img/wn/01d.png',
      'https://openweathermap.org/img/wn/03d.png',
      'https://openweathermap.org/img/wn/04n.png',
      'https://openweathermap.org/img/wn/04n.png',
      'https://openweathermap.org/img/wn/04n.png',
      'https://openweathermap.org/img/wn/04n.png',
      'https://openweathermap.org/img/wn/04d.png',
      'https://openweathermap.org/img/wn/04d.png',
      'https://openweathermap.org/img/wn/04d.png',
      'https://openweathermap.org/img/wn/04d.png',
      'https://openweathermap.org/img/wn/04d.png',
      'https://openweathermap.org/img/wn/04d.png',
      'https://openweathermap.org/img/wn/04d.png',
      'https://openweathermap.org/img/wn/04d.png',
      'https://openweathermap.org/img/wn/04n.png',
      'https://openweathermap.org/img/wn/10n.png',
      'https://openweathermap.org/img/wn/10n.png',
      'https://openweathermap.org/img/wn/10n.png',
      'https://openweathermap.org/img/wn/04d.png',
      'https://openweathermap.org/img/wn/10d.png',
      'https://openweathermap.org/img/wn/10d.png',
      'https://openweathermap.org/img/wn/04d.png',
      'https://openweathermap.org/img/wn/04d.png',
      'https://openweathermap.org/img/wn/04d.png',
    ];

    const hourlyAlts = [
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
        cy.wrap(img).should('have.attr', 'width', '50');
        cy.wrap(img).should('have.attr', 'height', '50');
        cy.wrap(img).should('have.attr', 'src', hourlyIcons[index]);
        cy.wrap(img).should('have.attr', 'alt', hourlyAlts[index]);
      });
  });
});
