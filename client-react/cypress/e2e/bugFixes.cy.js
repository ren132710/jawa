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

// write a failing test and make it pass, then bugs will never reappear
describe('#BugFixes', () => {
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

  it('#MemoizedPlaceCard: adding/deleting numerous places should not cause erratic disappearing/reappearing places', () => {
    // Given saved places
    cy.findAllByTestId('place-card').should((places) => {
      expect(places).to.have.length(2);
    });

    // when adding a number of places
    cy.findByTestId('btnNewPlace')
      .click({ force: true })
      .then(() => {
        // then the place should be added to places
        cy.findAllByTestId('place-card', { timeout: 10000 }).then((places) => {
          expect(places).to.have.length(3);
        });
      });

    cy.findByTestId('btnNewPlace')
      .click({ force: true })
      .then(() => {
        cy.findAllByTestId('place-card', { timeout: 10000 }).then((places) => {
          expect(places).to.have.length(4);
        });
      });

    cy.findByTestId('btnNewPlace')
      .click({ force: true })
      .then(() => {
        cy.findAllByTestId('place-card', { timeout: 10000 }).then((places) => {
          expect(places).to.have.length(5);
        });
      });

    cy.findByTestId('btnNewPlace')
      .click({ force: true })
      .then(() => {
        cy.findAllByTestId('place-card', { timeout: 10000 }).then((places) => {
          expect(places).to.have.length(6);
        });
      });

    // then each sequential deletion of the first place should result in the correct number of places
    cy.findAllByTestId('place-card').eq(0).as('delete1').trigger('mouseover');
    cy.get('@delete1').find('[data-testid="btnDeletePlace"]').click();
    cy.findAllByTestId('place-card').then((places) => {
      expect(places).to.have.length(5);
    });

    cy.findAllByTestId('place-card').eq(0).as('delete2').trigger('mouseover');
    cy.get('@delete2').find('[data-testid="btnDeletePlace"]').click();
    cy.findAllByTestId('place-card').then((places) => {
      expect(places).to.have.length(4);
    });

    cy.findAllByTestId('place-card').eq(0).as('delete3').trigger('mouseover');
    cy.get('@delete3').find('[data-testid="btnDeletePlace"]').click();
    cy.findAllByTestId('place-card').then((places) => {
      expect(places).to.have.length(3);
    });

    cy.findAllByTestId('place-card').eq(0).as('delete4').trigger('mouseover');
    cy.get('@delete4').find('[data-testid="btnDeletePlace"]').click();
    cy.findAllByTestId('place-card').then((places) => {
      expect(places).to.have.length(2);
    });

    cy.findAllByTestId('place-card').eq(0).as('delete5').trigger('mouseover');
    cy.get('@delete5').find('[data-testid="btnDeletePlace"]').click();
    cy.findAllByTestId('place-card').then((places) => {
      expect(places).to.have.length(1);
    });

    // and the delete button should be hidden when there is only one place
    cy.findAllByTestId('place-card').eq(0).as('place').trigger('mouseover');
    cy.get('@place').find('[data-testid="btnDeletePlace"]').should('not.exist');
  });
});
