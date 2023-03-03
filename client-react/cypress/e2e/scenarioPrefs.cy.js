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

describe('#scenarioPrefs', () => {
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
    cy.contains('Current Weather').should('exist');
    cy.contains('Hourly Weather').should('exist');
    cy.contains('America/New_York').should('exist');
    cy.findAllByTestId('hour-row').then((hours) => {
      expect(hours).to.have.length(24);

      // and the prefs menu is there
      cy.findByTestId('hamburger').click();
      // and all buttons are visible
      cy.findByTestId('menu').should('be.visible');
      cy.findByTestId('menu').within(() => {
        cy.findByTestId('btnMetric').should('be.visible');
        cy.findByTestId('btnImperial').should('be.visible');
        cy.findByTestId('btnLightMode').should('be.visible');
        cy.findByTestId('btnJawaMode').should('be.visible');
        cy.findByTestId('btnDarkMode').should('be.visible');
        cy.findByTestId('btnEnglish').should('be.visible');
        cy.findByTestId('btnFrench').should('be.visible');
        cy.findByTestId('btnSwedish').should('be.visible');
      });

      // and the user can close the menu
      // {force: true} because the hamburger button is behind the menu blanket
      cy.findByTestId('hamburger').click({ force: true });
      cy.findByTestId('menu').should('not.be.visible');
    });
  });

  it('should allow user to successfully switch themes', () => {
    // given default theme (jawa) is selected
    cy.get('body').should('have.attr', 'data-theme', 'jawa');

    // when the user opens the prefs menu
    cy.findByTestId('hamburger').click();

    // then the menu should be visible
    cy.findByTestId('menu').should('be.visible');

    // when the user clicks the Light button
    cy.findByTestId('btnLightMode').click();

    // then the theme should be switched to light mode and local storage should be updated
    // note: don't bother testing styling as it may change
    cy.get('body')
      .should('have.attr', 'data-theme', 'light')
      .then(() => {
        const prefs = JSON.parse(localStorage.getItem('jawa-prefs'));
        expect(prefs[0].theme).to.eql('light');
      });

    // when the user selects the Dark button
    cy.findByTestId('btnDarkMode').click();

    // then the theme should be switched to dark mode and local storage should be updated
    cy.get('body')
      .should('have.attr', 'data-theme', 'dark')
      .then(() => {
        const prefs = JSON.parse(localStorage.getItem('jawa-prefs'));
        expect(prefs[0].theme).to.eql('dark');
      });

    // when the user switches back to jawa
    cy.findByTestId('btnJawaMode').click();

    // then the theme should be switched to jawa mode and local storage should be updated
    cy.get('body')
      .should('have.attr', 'data-theme', 'jawa')
      .then(() => {
        const prefs = JSON.parse(localStorage.getItem('jawa-prefs'));
        expect(prefs[0].theme).to.eql('jawa');
      });

    // finally, the user can close the menu and the menu should be hidden
    cy.findByTestId('hamburger').click({ force: true });
    cy.findByTestId('menu').should('not.be.visible');
  });

  it('should allow user to successfully switch language', () => {
    // given default language is English
    cy.findByPlaceholderText('Weather at your places').should('exist');
    cy.contains('Current Weather').should('exist');
    cy.contains('Hourly Weather').should('exist');
    cy.contains('America/New_York').should('exist');

    // when the user switches to French
    cy.findByTestId('hamburger').click();
    cy.findByTestId('btnFrench')
      .click()
      .then(() => {
        // then the page should be translated to French
        cy.findByTestId('place-search').should(
          'have.attr',
          'placeholder',
          'Météo à vos lieux'
        );
        cy.get('[data-translation="2"]').contains('Météo Actuelle');
        cy.get('[data-translation="3"]').contains('Prévisions');
        cy.get('[data-translation="4"]').contains('Prévisions Horaires');
        cy.get('[data-translation="5"]').contains('Nouveau Lieu');
        cy.get('[data-translation="6"]').contains('Ressenti');
        cy.get('[data-translation="7"]').contains('Précip');
        cy.get('[data-translation="8"]').contains('Visibilité');
        cy.get('[data-translation="9"]').contains('Indice UV');
        cy.get('[data-translation="10"]').contains('Humidité');
        cy.get('[data-translation="11"]').contains('Vent');
        cy.get('[data-translation="12"]').contains('Point de rosée');
        cy.get('[data-translation="13"]').contains('Lever du soleil');
        cy.get('[data-translation="14"]').contains('Coucher du soleil');

        const days = [];
        cy.findAllByTestId('day-name').each((day) => {
          days.push(day.text());
        });

        cy.wrap(days)
          .should('have.length', 7)
          .then(() => {
            const expectedString =
              'dimanche,jeudi,lundi,mardi,mercredi,samedi,vendredi';
            const actualString = days.sort().toString();
            expect(actualString).to.eq(expectedString);
          });
      });

    // and when the user switches to Swedish
    cy.findByTestId('btnSwedish')
      .click()
      .then(() => {
        // then the page should be translated to Swedish
        cy.findByTestId('place-search').should(
          'have.attr',
          'placeholder',
          'Väder på dina platser'
        );
        cy.get('[data-translation="2"]').contains('Vädret Just Nu');
        cy.get('[data-translation="3"]').contains('Prognos');
        cy.get('[data-translation="4"]').contains('Timmar');
        cy.get('[data-translation="5"]').contains('Ny Plats');
        cy.get('[data-translation="6"]').contains('Känns som');
        cy.get('[data-translation="7"]').contains('Nederbörd');
        cy.get('[data-translation="8"]').contains('Sikt');
        cy.get('[data-translation="9"]').contains('UV-index');
        cy.get('[data-translation="10"]').contains('Luftfuktighet');
        cy.get('[data-translation="11"]').contains('Vind');
        cy.get('[data-translation="12"]').contains('Daggpunkt');
        cy.get('[data-translation="13"]').contains('Soluppgång');
        cy.get('[data-translation="14"]').contains('Solnedgång');

        const days = [];
        cy.findAllByTestId('day-name').each((day) => {
          days.push(day.text());
        });

        cy.wrap(days)
          .should('have.length', 7)
          .then(() => {
            const expectedString =
              'fredag,lördag,måndag,onsdag,söndag,tisdag,torsdag';
            const actualString = days.sort().toString();
            expect(actualString).to.eq(expectedString);
          });
      });

    // and when the user switches back to English
    cy.findByTestId('btnEnglish')
      .click()
      .then(() => {
        // then the page should be translated to English
        cy.findByTestId('place-search').should(
          'have.attr',
          'placeholder',
          'Weather at your places'
        );
        cy.get('[data-translation="2"]').contains('Current Weather');
        cy.get('[data-translation="3"]').contains('Forecast');
        cy.get('[data-translation="4"]').contains('Hourly Weather');
        cy.get('[data-translation="5"]').contains('New Place');
        cy.get('[data-translation="6"]').contains('Feels like');
        cy.get('[data-translation="7"]').contains('Precip');
        cy.get('[data-translation="8"]').contains('Visibility');
        cy.get('[data-translation="9"]').contains('UV Index');
        cy.get('[data-translation="10"]').contains('Humidity');
        cy.get('[data-translation="11"]').contains('Wind');
        cy.get('[data-translation="12"]').contains('Dew Point');
        cy.get('[data-translation="13"]').contains('Sunrise');
        cy.get('[data-translation="14"]').contains('Sunset');

        const days = [];
        cy.findAllByTestId('day-name').each((day) => {
          days.push(day.text());
        });

        cy.wrap(days)
          .should('have.length', 7)
          .then(() => {
            const expectedString =
              'Friday,Monday,Saturday,Sunday,Thursday,Tuesday,Wednesday';
            const actualString = days.sort().toString();
            expect(actualString).to.eq(expectedString);
          });
      });
  });

  it('should allow user to successfully switch to metric units', () => {
    // given default units are imperial
    cy.findByTestId('current-temp').contains('F');
    cy.findByTestId('current-visibility').contains('mi');
    cy.findByTestId('current-wind').contains('mph');

    // each daily card should have imperial units
    cy.findAllByTestId('daily-card').each((card) => {
      cy.wrap(card).within(() => {
        cy.findByTestId('day-wind').contains('mph');
      });
    });

    // each hour row should have imperial units
    cy.findAllByTestId('hour-row').each((row) => {
      cy.wrap(row).within(() => {
        cy.findByTestId('hour-wind').contains('mph');
      });
    });

    // when the user opens the prefs menu and clicks the metric button
    // use.then() to wait for the page to reload
    cy.findByTestId('hamburger').click();
    cy.findByTestId('btnMetric')
      .click()
      .then(() => {
        // units should be switched to metric
        cy.findByTestId('current-temp').contains('C');
        cy.findByTestId('current-visibility').contains('km');
        cy.findByTestId('current-wind').contains('kph');

        // each daily card should have metric units
        cy.findAllByTestId('daily-card').each((card) => {
          cy.wrap(card).within(() => {
            cy.findByTestId('day-wind').contains('kph');
          });
        });

        // each hour row should have metric units
        cy.findAllByTestId('hour-row').each((row) => {
          cy.wrap(row).within(() => {
            cy.findByTestId('hour-wind').contains('kph');
          });
        });

        // wait for the metric weather values to render
        // thought .then() above would work here, but it doesn't
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(2000);

        // OpenWeatherMap does the unit conversion, so the best we can do is ensure a conversion happened
        cy.findAllByTestId('day-high').each((temp) => {
          cy.wrap(temp)
            .invoke('text')
            .then(parseInt)
            .should('be.a', 'number')
            .and('lte', 45);
        });
      });
  });
});
