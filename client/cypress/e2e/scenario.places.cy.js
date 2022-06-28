/// <reference types= "cypress" />

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

  function getLocalStorage() {
    return JSON.parse(localStorage.getItem('JAWA-Places'))
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
    cy.get('@place1').should('have.attr', 'data-lat', '40.7128')
    cy.get('@place1').should('have.attr', 'data-long', '-74.006')
    cy.get('@place1').should('have.attr', 'data-location', 'new york')
    cy.get('@place1').find('[data-card-location]').should('have.text', 'new york')
    //verify daily section
    cy.get('.daily-container').children('div').its('length').should('eq', 7)
    //verify hourly section
    cy.get('[data-hour-timezone]').should('have.text', 'America/New_York')
    cy.get('.hourly-container').children('div').its('length').should('eq', 12)
  })

  it('should allow user to fetch weather for Austin, TX and save to places', function () {
    //when the user types in 'austin'
    cy.get('[data-place-search]').type('Austin', { delay: 200 })
    cy.get('div.pac-item').each((elem, index, arr) => {
      cy.log(elem.text())
    })
    //and selects 'Austin TX, USA'
    cy.get('div.pac-item').each((elem, index, arr) => {
      if (elem.text().includes('TX')) {
        cy.wrap(elem).should('have.text', 'AustinTX, USA')
        //chaining .click({ force: true }) on the assertion seems to avoid "element is detached from the DOM" error
        cy.wrap(elem).should('be.visible').click({ force: true })
      }
    })
    //then the weather for austin should be displayed
    //wait until page loads, use optional param { timeout: 10000 } in lieu of cy.wait()
    cy.get('.current-top-left>[data-current-location]', { timeout: 5000 }).should('have.text', 'Austin')
    cy.get('[data-current-lat]').should('have.text', '30.2672')
    cy.get('[data-current-long]').should('have.text', '-97.7431')
    //verify daily section
    cy.get('.daily-container').children('div').its('length').should('eq', 7)
    //verify hourly section
    cy.get('[data-hour-timezone]').should('have.text', 'America/Chicago')
    cy.get('.hourly-container').children('div').its('length').should('eq', 12)

    //when user add austin to places
    cy.get('#btnNewPlace').click()
    cy.wait(2000)
    //then austin should be saved to places
    cy.get('.places-container').children('div').its('length').should('eq', 2)
    cy.get('.places-container').children('div').eq(1).as('place2')
    cy.get('@place2').should('have.attr', 'data-lat', '30.2672')
    cy.get('@place2').should('have.attr', 'data-long', '-97.7431')
    cy.get('@place2').should('have.attr', 'data-location', 'austin')
    cy.get('@place2')
      .find('[data-card-location]')
      .should('have.text', 'austin')
      .then(() => {
        //and localStorage is updated
        const storage = getLocalStorage()
        expect(storage.length).to.eq(2)
      })
  })

  it('should allow user to delete a place from places', function () {
    //given there are 2 saved places: austin, new york
    cy.get('.places-container')
      .children('div')
      .should('have.length', 2)
      .then(() => {
        cy.get('.place-card-item[data-card-location]').should('have.text', 'new yorkaustin')
      })

    //when the user deletes new york
    cy.get('.places-container').children('div').eq(0).as('place1')
    cy.get('@place1').should('have.attr', 'data-location', 'new york')
    cy.get('@place1').find('#btnDeletePlace').should('be.visible').click()

    //then austin should be the only saved place
    cy.get('.places-container')
      .children('div')
      .should((places) => {
        expect(places).to.have.length(1)
        expect(places[0]).to.have.attr('data-location', 'austin')
      })
    cy.get('.places-container>.place-card>[data-card-location]')
      .should('have.text', 'austin')
      //and austin should be the only place saved to localStorage
      .then(() => {
        const storage = getLocalStorage()
        expect(storage.length).to.eq(1)
        expect(storage[0].location).to.equal('austin')
      })
  })

  it('when there are no saved placed, page should successfully refresh to default place(s) ', function () {
    //given austin is the only saved place
    cy.get('.places-container').children('div').eq(0).as('place1')
    cy.get('@place1').should('have.attr', 'data-location', 'austin')

    //when austin is deleted from saved places
    cy.get('@place1').find('#btnDeletePlace').should('be.visible').click()

    //then there are no saved places
    cy.get('.places-container')
      .children('div')
      .should((places) => {
        expect(places).to.have.length(0)
      })
      .then(() => {
        const storage = getLocalStorage()
        expect(storage.length).to.eq(0)
      })

    //when the page is refreshed
    cy.reload().then(() => {
      //then the page should load with the default place, new york
      cy.get('.current-top-left>[data-location]').should('have.text', 'new york')
      //verify daily section
      cy.get('.daily-container').children('div').its('length').should('eq', 7)
      //verify hourly section
      cy.get('[data-hour-timezone]').should('have.text', 'America/New_York')
      cy.get('.hourly-container').children('div').its('length').should('eq', 12)
    })
  })
})
