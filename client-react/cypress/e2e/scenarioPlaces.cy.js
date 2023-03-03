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
];

const testPrefs = [{ units: 'imperial', theme: 'jawa', lang: 'en' }];

function setTestDefaults() {
  localStorage.setItem('jawa-places', JSON.stringify(TEST_PLACES));
  localStorage.setItem('jawa-prefs', JSON.stringify(testPrefs));
}

describe('#scenarioPlaces', () => {
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
    cy.contains('America/Chicago').should('exist');
    cy.findAllByTestId('hour-row').then((hours) => {
      expect(hours).to.have.length(24);
    });
  });

  it('should allow user to view weather for a saved place', () => {
    // given saved places
    cy.findAllByTestId('place-card').then((places) => {
      expect(places).to.have.length(2);
    });

    // when the user hovers or tabs to the second place card
    cy.findAllByTestId('place-card').eq(1).as('place2').trigger('mouseover');

    // and the delete button should be visible
    cy.get('@place2')
      .find('[data-testid="btnDeletePlace"]')
      .invoke('show')
      .should('be.visible');

    // and when the user clicks on the second place card
    cy.get('@place2').click();

    // then the main weather should update
    cy.contains('Current Weather').should('exist');
    cy.findByTestId('current-location')
      .should('have.text', 'san francisco')
      .should(
        'have.attr',
        'data-current-id',
        '90f3d018-bbd3-45be-9c11-debbff73fb6c'
      );
    cy.findByTestId('current-weather-icon').should('exist');
    // .should('have.attr', 'width', '200')
    // .should('have.attr', 'height', '200');

    // and the units should be imperial
    cy.findByTestId('current-temp').contains('F');

    // and the daily weather should update
    cy.contains('Forecast').should('exist');
    cy.findByTestId('subtitle-forecast').filter(':contains("\u00a0")');
    cy.findAllByTestId('daily-card').should((days) => {
      expect(days).to.have.length(7);
    });

    // and the hourly weather should update
    cy.contains('Hourly Weather').should('exist');
    cy.contains('America/Los_Angeles').should('exist');
    cy.findAllByTestId('hour-row').should((hours) => {
      expect(hours).to.have.length(24);
    });

    // and when the user hovers or tabs away
    cy.get('@place2').trigger('mouseout');

    // and the delete button should be hidden
    cy.get('@place2')
      .find('[data-testid="btnDeletePlace"]')
      .invoke('hide')
      .should('not.be.visible');
  });

  it('should allow user to delete a saved place', () => {
    // given saved places
    cy.findAllByTestId('place-card').then((places) => {
      expect(places).to.have.length(2);
    });

    // when the user hovers or tabs to the second place card
    cy.findAllByTestId('place-card').eq(1).as('place2').trigger('mouseover');

    // then the delete button should be visible
    cy.get('@place2')
      .find('[data-testid="btnDeletePlace"]')
      .invoke('show')
      .should('be.visible');

    // and when the user clicks on the delete button
    cy.get('@place2').find('[data-testid="btnDeletePlace"]').click();

    // then there should be one remaining saved place
    // chain with .then() to wait for the DOM to update
    cy.findAllByTestId('place-card').then((places) => {
      expect(places).to.have.length(1);
    });

    // and the one remaining place should be 'austin'
    cy.findAllByTestId('place-card')
      .eq(0)
      .within(() => {
        cy.findByTestId('place-location').should('have.text', 'austin');
      });

    // however main weather should still be san francisco
    cy.findByTestId('current-location')
      .should('have.text', 'san francisco')
      .should(
        'have.attr',
        'data-current-id',
        '90f3d018-bbd3-45be-9c11-debbff73fb6c'
      );
  });

  it('should prevent deletion if there is only one place', () => {
    // Given saved places
    cy.findAllByTestId('place-card').should((places) => {
      expect(places).to.have.length(2);
    });

    // delete the first place ('austin')
    cy.findAllByTestId('place-card').eq(0).as('place').trigger('mouseover');
    cy.get('@place').find('[data-testid="btnDeletePlace"]').click();
    cy.findAllByTestId('place-card').then((places) => {
      expect(places).to.have.length(1);
    });

    // delete button should be hidden when there is only one place
    cy.findAllByTestId('place-card').eq(0).as('place').trigger('mouseover');
    cy.get('@place').find('[data-testid="btnDeletePlace"]').should('not.exist');

    // and the place should be 'san francisco'
    cy.findAllByTestId('place-card')
      .eq(0)
      .within(() => {
        cy.findByTestId('place-location').should('have.text', 'san francisco');
      });
  });

  it('should allow user to save a new place', () => {
    // Given saved places
    cy.findAllByTestId('place-card').should((places) => {
      expect(places).to.have.length(2);
    });

    // when the user clicks the New Place button
    cy.findByTestId('btnNewPlace')
      .click({ force: true })
      .then(() => {
        // then the place should be added to places
        cy.findAllByTestId('place-card', { timeout: 10000 }).then((places) => {
          expect(places).to.have.length(3);
        });
      });

    // and the place should have an id that is unique among the saved places
    cy.findAllByTestId('place-card').then((place) => {
      cy.log(place);
      cy.log(place.attr('data-id'));
      expect(place).to.have.attr('data-id');

      // get the id
      const id = place.attr('data-id');

      // ensure it is unique among the saved places
      const ids = [];
      cy.findAllByTestId('place-card').each((p) => {
        cy.log(p.attr('data-id'));
        if (p.attr('data-id') === id) {
          ids.push(p.attr('data-id'));
        }
      });

      // if there is more than one, fail
      cy.wrap(ids).should('have.length', 1);
    });

    // and the main weather should remain unchanged
    cy.findByTestId('current-location').should('have.text', 'austin');
  });
});
