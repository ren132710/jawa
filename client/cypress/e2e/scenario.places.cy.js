/// <reference types= "cypress" />
//TODO: newPlace test is flaky
//TODO: deletePlace
//TODO: commit and Push
//TODO: parcel dotenv flakiness
//TODO: initAutocomplete flakiness

//scenario testing is end-to-end. Server must be running
describe('places scenario', () => {
  const initialPlace = [
    {
      id: 'c9ae7c46-81e4-4c9d-a933-bb3c8d14fc87',
      location: 'new york',
      lat: 40.7128,
      long: -74.006,
    },
  ]

  function setDefaultPlace() {
    localStorage.setItem('JAWA-Places', JSON.stringify(initialPlace))
  }

  before(function () {
    setDefaultPlace()
    expect(JSON.parse(localStorage.getItem('JAWA-Places'))).to.eql(initialPlace)
    cy.visit('/')
    cy.wait(1000)
  })

  afterEach(function () {
    cy.get('[data-place-search]').clear()
  })

  it('should successfully load initial place', function () {
    cy.get('.current-top-left>[data-location]').should('have.text', 'new york')
    cy.get('.places-container').children('div').its('length').should('eq', 1)
    cy.get('.places-container').children('div').eq(0).as('place1')
    cy.log(cy.get('.places-container').children('div').eq(0))
    cy.get('@place1').should('have.attr', 'data-lat', '40.7128')
    cy.get('@place1').should('have.attr', 'data-long', '-74.006')
    cy.get('@place1').should('have.attr', 'data-location', 'new york')
    cy.get('@place1').find('[data-location]').should('have.text', 'new york')
    //TODO: test day collection and hour collection exist
  })

  it('should allow user to fetch weather for Austin, TX and save to places', function () {
    cy.get('[data-place-search]').type('Austin', { delay: 200 })
    cy.get('div.pac-item').each((elem, index, arr) => {
      cy.log(elem.text())
    })
    cy.get('div.pac-item').each((elem, index, arr) => {
      if (elem.text().includes('TX')) {
        cy.wrap(elem).should('have.text', 'AustinTX, USA')
        //chain .click({ force: true }) on the assertion seems to avoid "element is detached from the DOM" error
        cy.wrap(elem).should('be.visible').click({ force: true })
        cy.wait(1000)
      }
    })
    cy.get('.current-top-left>[data-current-location]').should('have.text', 'Austin')
    cy.get('[data-current-lat]').should('have.text', '30.2672')
    cy.get('[data-current-long]').should('have.text', '-97.7431')
    //TODO: test day collection and hour collection exist

    //new place
    cy.get('#btnNewPlace').click()
    cy.wait(2000)
    cy.get('.places-container').children('div').its('length').should('eq', 2)
    cy.get('.places-container').children('div').eq(1).as('place2')
    cy.get('@place2').should('have.attr', 'data-lat', '30.2672')
    cy.get('@place2').should('have.attr', 'data-long', '-97.7431')
    cy.get('@place2').should('have.attr', 'data-location', 'austin')
    cy.get('@place2').find('[data-location]').should('have.text', 'austin')
  })

  it('should allow user to fetch weather for Boston, MA and save to places', function () {
    cy.get('[data-place-search]').type('Boston', { delay: 200 })
    cy.get('div.pac-item').each((elem, index, arr) => {
      cy.log(elem.text())
    })
    cy.get('div.pac-item').each((elem, index, arr) => {
      if (elem.text().includes('MA')) {
        //chain .click({ force: true }) on the assertion seems to avoid "element is detached from the DOM" error
        cy.wrap(elem).should('have.text', 'BostonMA, USA')
        cy.wrap(elem).should('be.visible').click({ force: true })
        cy.wait(1000)
      }
    })
    cy.get('.current-top-left>[data-current-location]').should('have.text', 'Boston')
    cy.get('[data-current-lat]').should('have.text', '42.3601')
    cy.get('[data-current-long]').should('have.text', '-71.0589')
    //TODO: test day collection and hour collection exist

    //new place
    cy.get('#btnNewPlace').click()
    cy.wait(2000)
    cy.get('.places-container').children('div').its('length').should('eq', 3)
    cy.get('.places-container').children('div').eq(2).as('place3')
    cy.get('@place3').should('have.attr', 'data-lat', '42.3601')
    cy.get('@place3').should('have.attr', 'data-long', '-71.0589')
    cy.get('@place3').should('have.attr', 'data-location', 'boston')
    cy.get('@place3').find('[data-location]').should('have.text', 'boston')
  })

  it('should allow user to delete a place from places', function () {
    //delete place, verify places count
    //delete all places
    //refresh page
  })

  it('when there are no saved placed, page should successfully refresh to default place(s) ', function () {
    //per default places defined in script.js
    //just ensure the page loads
  })
})
