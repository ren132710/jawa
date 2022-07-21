/// <reference types= "cypress" />

//scenario testing is end-to-end. Server must be running
describe('#scenario: prefs', () => {
  const testPlace = [
    {
      id: 'c9ae7c46-81e4-4c9d-a933-bb3c8d14fc87',
      location: 'new york',
      lat: 40.7128,
      long: -74.006,
    },
  ]

  const testPrefs = [{ units: 'imperial', theme: 'jawa', lang: 'en' }]

  function setTestDefaults() {
    localStorage.setItem('jawa-places', JSON.stringify(testPlace))
    localStorage.setItem('jawa-prefs', JSON.stringify(testPrefs))
  }

  beforeEach(function () {
    setTestDefaults()
    expect(JSON.parse(localStorage.getItem('jawa-places'))).to.eql(testPlace)
    expect(JSON.parse(localStorage.getItem('jawa-prefs'))).to.eql(testPrefs)
    cy.visit('/')
    cy.wait(1000)
  })

  it('should pass initial smoke test prior to running scenario', function () {
    //places
    cy.get('.places-container').children('div').its('length').should('eq', 1)
    cy.get('.places-container').children('div').eq(0).as('place1')
    cy.get('@place1').should('have.attr', 'data-id', 'c9ae7c46-81e4-4c9d-a933-bb3c8d14fc87')
    cy.get('@place1').should('have.attr', 'data-lat', '40.7128')
    cy.get('@place1').should('have.attr', 'data-long', '-74.006')
    cy.get('@place1').should('have.attr', 'data-location', 'new york')
    cy.get('@place1').find('[data-card-location]').should('have.text', 'new york')
    //current
    cy.get('.current-top-left>[data-current-location]').should('have.text', 'new york')
    //verify daily section
    cy.get('.daily-container').children('div').its('length').should('eq', 7)
    //verify hourly section
    cy.get('[data-hour-timezone]').should('have.text', 'America/New_York')
    cy.get('.hourly-container').children('div').its('length').should('eq', 12)
  })

  it('should allow user to successfully switch to metric units', function () {
    //given: default units are imperial
    cy.get('[data-temp-units]').should('have.attr', 'data-temp-units', ' F')
    cy.get('[data-visibility-units]').should('have.attr', 'data-visibility-units', ' mi')
    cy.get('[data-wind-units]').should('have.attr', 'data-wind-units', ' mph ')

    //and pseudo elements are working
    //use the window object to fetch the computed values of the pseudo elements
    cy.window().then((win) => {
      //current section
      cy.get('.current-temp').then((elem) => {
        //jQuery embeds elem in an array, so fetch using index
        const after = win.getComputedStyle(elem[0], '::after')
        //pseudo content is a string so surround in quotes
        expect(after.getPropertyValue('content')).to.eq('" F"')
      })
      cy.get('[data-current-visibility]').then((elem) => {
        const after = win.getComputedStyle(elem[0], '::after')
        expect(after.getPropertyValue('content')).to.eq('" mi"')
      })
      cy.get('[data-current-wind-speed]').then((elem) => {
        const after = win.getComputedStyle(elem[0], '::after')
        expect(after.getPropertyValue('content')).to.eq('" mph "')
      })

      //daily section, wind units only
      cy.get('.daily-container')
        .find('[data-daily-wind-speed]')
        .each((elem, index, arr) => {
          let after = win.getComputedStyle(elem[0], '::after')
          expect(after.getPropertyValue('content')).to.eq('" mph "')
        })

      //hourly section, wind units only
      cy.get('.hourly-container')
        .find('[data-hour-wind-speed]')
        .each((elem, index, arr) => {
          let after = win.getComputedStyle(elem[0], '::after')
          expect(after.getPropertyValue('content')).to.eq('" mph "')
        })
    })

    //when: user opens prefs menu and clicks Metric button
    cy.get('.menu-toggle').click()
    cy.get('#menu')
      .should('be.visible')
      .then(() => {
        cy.get('button').contains('Metric').as('btnMetric')
      })
    cy.get('@btnMetric')
      .should('be.visible')
      .and('have.text', 'Metric')
      .and('have.attr', 'data-action', 'metric')
      .click()
    cy.get('.menu-toggle').click()
    cy.get('#menu')
      .should('not.be.visible')
      .then(() => {
        const prefs = JSON.parse(localStorage.getItem('jawa-prefs'))
        expect(prefs[0].units).to.eq('metric')
      })

    //then: units should be metric
    cy.get('[data-temp-units]').should('have.attr', 'data-temp-units', ' C')
    cy.get('[data-visibility-units]').should('have.attr', 'data-visibility-units', ' km')
    cy.get('[data-wind-units]').should('have.attr', 'data-wind-units', ' kph ')

    //and pseudo elements are updated and working
    cy.window().then((win) => {
      //current section
      cy.get('.current-temp').then((elem) => {
        const after = win.getComputedStyle(elem[0], '::after')
        expect(after.getPropertyValue('content')).to.eq('" C"')
      })
      cy.get('[data-current-visibility]').then((elem) => {
        const after = win.getComputedStyle(elem[0], '::after')
        expect(after.getPropertyValue('content')).to.eq('" km"')
      })
      cy.get('[data-current-wind-speed]').then((elem) => {
        const after = win.getComputedStyle(elem[0], '::after')
        expect(after.getPropertyValue('content')).to.eq('" kph "')
      })

      //daily section, wind units only
      cy.get('.daily-container')
        .find('[data-daily-wind-speed]')
        .each((elem, index, arr) => {
          let after = win.getComputedStyle(elem[0], '::after')
          expect(after.getPropertyValue('content')).to.eq('" kph "')
        })

      //hourly section, wind units only
      cy.get('.hourly-container')
        .find('[data-hour-wind-speed]')
        .each((elem, index, arr) => {
          let after = win.getComputedStyle(elem[0], '::after')
          expect(after.getPropertyValue('content')).to.eq('" kph "')
        })
    })

    //and the temperature values are converted
    //OpenWeatherMap does the unit conversion, so the best we can do is ensure a conversion happened
    cy.get('[data-current-temp]').invoke('text').then(parseInt).should('be.a', 'number').and('lte', 45)

    //when: user switches back to imperial units
    cy.get('.menu-toggle').click()
    cy.get('#menu')
      .should('be.visible')
      .then(() => {
        cy.get('button').contains('Imperial').as('btnImperial')
      })
    cy.get('@btnImperial')
      .should('be.visible')
      .and('have.text', 'Imperial')
      .and('have.attr', 'data-action', 'imperial')
      .click()
    cy.get('.menu-toggle').click()
    cy.get('#menu')
      .should('not.be.visible')
      .then(() => {
        const prefs = JSON.parse(localStorage.getItem('jawa-prefs'))
        expect(prefs[0].units).to.eq('imperial')
      })
    cy.wait(1000)

    //then: units should be imperial
    cy.get('[data-temp-units]').should('have.attr', 'data-temp-units', ' F')
    cy.get('[data-visibility-units]').should('have.attr', 'data-visibility-units', ' mi')
    cy.get('[data-wind-units]').should('have.attr', 'data-wind-units', ' mph ')

    //and pseudo elements are updated and working
    cy.window().then((win) => {
      //current section
      cy.get('.current-temp').then((elem) => {
        const after = win.getComputedStyle(elem[0], '::after')
        expect(after.getPropertyValue('content')).to.eq('" F"')
      })
      cy.get('[data-current-visibility]').then((elem) => {
        const after = win.getComputedStyle(elem[0], '::after')
        expect(after.getPropertyValue('content')).to.eq('" mi"')
      })
      cy.get('[data-current-wind-speed]').then((elem) => {
        const after = win.getComputedStyle(elem[0], '::after')
        expect(after.getPropertyValue('content')).to.eq('" mph "')
      })

      //daily section, wind units only
      cy.get('.daily-container')
        .find('[data-daily-wind-speed]')
        .each((elem, index, arr) => {
          let after = win.getComputedStyle(elem[0], '::after')
          expect(after.getPropertyValue('content')).to.eq('" mph "')
        })

      //hourly section, wind units only
      cy.get('.hourly-container')
        .find('[data-hour-wind-speed]')
        .each((elem, index, arr) => {
          let after = win.getComputedStyle(elem[0], '::after')
          expect(after.getPropertyValue('content')).to.eq('" mph "')
        })
    })

    //and the temperature values are converted
    //we cannot know what values OpenWeather will return so skip this verification
  })

  it('should allow user to successfully switch theme', function () {
    //given: default theme = 'jawa'
    cy.get('body').should('have.attr', 'data-theme', 'jawa')

    //when: user opens prefs menu and clicks Light button
    cy.get('.menu-toggle').click()
    cy.get('#menu')
      .should('be.visible')
      .then(() => {
        cy.get('button').contains('Light').as('btnLight')
      })
    cy.get('@btnLight').should('be.visible').and('have.text', 'Light').and('have.attr', 'data-action', 'light').click()
    cy.get('.menu-toggle').click()
    cy.get('#menu')
      .should('not.be.visible')
      .then(() => {
        const prefs = JSON.parse(localStorage.getItem('jawa-prefs'))
        expect(prefs[0].theme).to.eq('light')
      })

    //then: theme should be switched to light
    cy.get('body').should('have.attr', 'data-theme', 'light')

    //when: user switches to dark theme
    cy.get('.menu-toggle').click()
    cy.get('#menu')
      .should('be.visible')
      .then(() => {
        cy.get('button').contains('Dark').as('btnDark')
      })
    cy.get('@btnDark').should('be.visible').and('have.text', 'Dark').and('have.attr', 'data-action', 'dark').click()
    cy.get('.menu-toggle').click()
    cy.get('#menu')
      .should('not.be.visible')
      .then(() => {
        const prefs = JSON.parse(localStorage.getItem('jawa-prefs'))
        expect(prefs[0].theme).to.eq('dark')
      })

    //then: theme should be switched to dark
    cy.get('body').should('have.attr', 'data-theme', 'dark')

    //when: user switches back to the default theme 'jawa'
    cy.get('.menu-toggle').click()
    cy.get('#menu')
      .should('be.visible')
      .then(() => {
        cy.get('button').contains('Jawa').as('btnJawa')
      })
    cy.get('@btnJawa').should('be.visible').and('have.text', 'Jawa').and('have.attr', 'data-action', 'jawa').click()
    cy.get('.menu-toggle').click()
    cy.get('#menu')
      .should('not.be.visible')
      .then(() => {
        const prefs = JSON.parse(localStorage.getItem('jawa-prefs'))
        expect(prefs[0].theme).to.eq('jawa')
      })

    //then: theme should be switched to jawa
    cy.get('body').should('have.attr', 'data-theme', 'jawa')
  })

  it('should allow user to successfully switch language', function () {
    //given: default language = 'en'
    const prefs = JSON.parse(localStorage.getItem('jawa-prefs'))
    expect(prefs[0].lang).to.eq('en')

    //when: user switches to French
    cy.get('.menu-toggle').click()
    cy.get('#menu')
      .should('be.visible')
      .then(() => {
        cy.get('button').contains('French').as('btnFrench')
      })
    cy.get('@btnFrench').should('be.visible').and('have.text', 'French').and('have.attr', 'data-action', 'fr').click()
    cy.get('.menu-toggle').click()
    cy.get('#menu')
      .should('not.be.visible')
      .then(() => {
        const prefs = JSON.parse(localStorage.getItem('jawa-prefs'))
        expect(prefs[0].lang).to.eq('fr')
      })

    //then: language should be switched to fr
    cy.get('[data-place-search]').should('have.attr', 'placeholder', 'Météo à vos places')
    cy.get('[data-dictionary="Current"]').contains('Météo Actuelle')
    cy.get('[data-dictionary="Forecast"]').contains('Prévisions')
    cy.get('[data-dictionary="Hourly"]').contains('Heure par Heure')

    //when: user switches to Swedish
    cy.get('.menu-toggle').click()
    cy.get('#menu')
      .should('be.visible')
      .then(() => {
        cy.get('button').contains('Swedish').as('btnSwedish')
      })
    cy.get('@btnSwedish').should('be.visible').and('have.text', 'Swedish').and('have.attr', 'data-action', 'sv').click()
    cy.get('.menu-toggle').click()
    cy.get('#menu')
      .should('not.be.visible')
      .then(() => {
        const prefs = JSON.parse(localStorage.getItem('jawa-prefs'))
        expect(prefs[0].lang).to.eq('sv')
      })

    //then: language should be switched to sv
    cy.get('[data-place-search]').should('have.attr', 'placeholder', 'Väder på dina platser')
    cy.get('[data-dictionary="Current"]').contains('Vädret Just Nu')
    cy.get('[data-dictionary="Forecast"]').contains('Prognos')
    cy.get('[data-dictionary="Hourly"]').contains('Timmar')

    //when: user switches back to the default English'
    cy.get('.menu-toggle').click()
    cy.get('#menu')
      .should('be.visible')
      .then(() => {
        cy.get('button').contains('English').as('btnEnglish')
      })
    cy.get('@btnEnglish').should('be.visible').and('have.text', 'English').and('have.attr', 'data-action', 'en').click()
    cy.get('.menu-toggle').click()
    cy.get('#menu')
      .should('not.be.visible')
      .then(() => {
        const prefs = JSON.parse(localStorage.getItem('jawa-prefs'))
        expect(prefs[0].lang).to.eq('en')
      })

    //then: language should be switched to en
    cy.get('[data-place-search]').should('have.attr', 'placeholder', 'Weather at your places')
    cy.get('[data-dictionary="Current"]').contains('Current Weather')
    cy.get('[data-dictionary="Forecast"]').contains('Forecast')
    cy.get('[data-dictionary="Hourly"]').contains('Hourly Weather')
  })
})
