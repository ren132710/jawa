/// <reference types= "cypress" />

describe('#renderPageWeather', () => {
  const testPlace = [
    {
      id: 'c9ae7c46-81e4-4c9d-a933-bb3c8d14fc87',
      location: 'new york',
      lat: 40.7306,
      long: -73.9352,
    },
  ]

  const testPrefs = [{ units: 'imperial', theme: 'morning' }]

  function setTestDefaults() {
    localStorage.setItem('jawa-places', JSON.stringify(testPlace))
    localStorage.setItem('jawa-prefs', JSON.stringify(testPrefs))
  }

  before(function () {
    setTestDefaults()
    // deep equality
    expect(JSON.parse(localStorage.getItem('jawa-places'))).to.eql(testPlace)
    expect(JSON.parse(localStorage.getItem('jawa-prefs'))).to.eql(testPrefs)

    //register the intercept before loading the page
    cy.intercept('GET', '**/weather**', { fixture: 'nycWeatherFixture.json' }).as('nycMock')
    cy.visit('/')

    //access the alias from.then()
    cy.wait('@nycMock').then((interception) => {
      expect(interception.response.statusCode).to.eq(200)
      expect(interception.response.body.coordinates.id).to.equal('c9ae7c46-81e4-4c9d-a933-bb3c8d14fc87')
    })
  })
  it('should pass smoke test of page layout', function () {
    //place search input should have default placeholder text
    //note different ways to verify the value of an element attribute
    cy.get('[data-place-search]').invoke('attr', 'placeholder').should('eq', 'Weather at your places')
    cy.get('[data-place-search]').should('have.attr', 'placeholder', 'Weather at your places')

    //and places should be populated with default place
    cy.get('.places-container').children('div').its('length').should('eq', 1)
    cy.get('.places-container').children('div').eq(0).as('place1')
    cy.get('@place1').find('[data-card-location]').should('have.text', 'new york')

    //and major page sections exist
    //current section
    cy.contains('Current Weather').should('exist')
    cy.get('.current-top-left>[data-current-location]').should('have.text', 'new york')
    //daily section
    cy.contains('Forecast').should('exist')
    cy.get('.daily-container').children('div').its('length').should('eq', 7)
    //hourly section
    cy.contains('Hourly Weather').should('exist')
    cy.contains('America/New_York').should('exist')
    cy.get('[data-hour-timezone]').should('have.text', 'America/New_York')
    cy.get('.hourly-container').children('div').its('length').should('eq', 12)
    //footer
    cy.contains('Powered By OpenWeather').should('exist')
    cy.get('a')
      .invoke('attr', 'href')
      .should('eq', 'https://openweathermap.org/api')
      .then((href) => {
        cy.request(href).its('status').should('eq', 200)
      })

    //and default units should be imperial
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
  })

  it('should correctly display current weather', function () {
    //units of measure are verified in the smoke test
    //top left
    cy.get('.current-top-left>[data-current-location]')
      .invoke('attr', 'data-current-id')
      .should('equal', 'c9ae7c46-81e4-4c9d-a933-bb3c8d14fc87')
    cy.get('.current-top-left>[data-current-location]').should('have.text', 'new york')
    cy.get('[data-new-place]').should('have.text', 'New Place')
    cy.get('[data-current-icon]')
      .invoke('attr', 'src')
      .should('eq', 'http://openweathermap.org/img/wn/01d@4x.png')
      .then((src) => {
        cy.request(src).its('status').should('eq', 200)
      })

    //bottom left
    cy.get('[data-current-uv-index]').should('have.text', '2.56')
    cy.get('[data-current-uv-level]').should('have.text', 'low')
    cy.get('[data-current-humidity]').should('have.text', '40')
    cy.get('[data-current-wind-speed]').should('have.text', '17')
    cy.get('[data-current-wind-direction]').should('have.text', 'S')

    //top right
    cy.get('[data-current-dt]').should('have.text', 'Mon 6 Jun 4:19 PM')
    cy.get('[data-current-lat]').should('have.text', '40.7128')
    cy.get('[data-current-long]').should('have.text', '-74.006')
    cy.get('[data-current-high]').should('have.text', '78')
    cy.get('[data-current-temp]').should('have.text', '78')
    cy.get('[data-current-fl]').should('have.text', '77')
    cy.get('[data-current-description]').should('have.text', 'clear sky')
    cy.get('[data-current-precip]').should('have.text', '0')
    cy.get('[data-current-visibility]').should('have.text', '6.2')

    //bottom right
    cy.get('[data-current-dew-point]').should('have.text', '51')
    cy.get('[data-current-sunrise]').should('have.text', '5:25 AM')
    cy.get('[data-current-sunset]').should('have.text', '8:24 PM')
  })

  it('should correctly display daily weather', function () {
    cy.get('.daily-container').children('div').its('length').should('eq', 7)

    //day 1, the long way: for each day, explicitly evaluate each child value
    cy.get('.daily-container').children('div').eq(0).as('day1')
    cy.get('@day1').find('[data-daily-date]').should('have.text', 'Tuesday')
    cy.get('@day1').find('[data-daily-high]').should('have.text', '75')
    cy.get('@day1').find('[data-daily-low]').should('have.text', '64')
    cy.get('@day1').find('[data-daily-description]').should('have.text', 'overcast clouds')
    cy.get('@day1').find('[data-daily-humidity]').should('have.text', '49')
    cy.get('@day1').find('[data-daily-wind-speed]').should('have.text', '21')
    cy.get('@day1').find('[data-daily-wind-direction]').should('have.text', 'S')
    cy.get('@day1')
      .find('[data-daily-icon]')
      .invoke('attr', 'src')
      .should('eq', 'http://openweathermap.org/img/wn/04d.png')
      .then((src) => {
        cy.request(src).its('status').should('eq', 200)
      })

    //day 2, try leveraging custom commands
    cy.get('.daily-container').children('div').eq(1).as('day2')
    cy.evalChildValue('@day2', '[data-daily-date]', 'Wednesday')
    cy.evalChildValue('@day2', '[data-daily-high]', '80')
    cy.evalChildValue('@day2', '[data-daily-low]', '67')
    cy.evalChildValue('@day2', '[data-daily-description]', 'moderate rain')
    cy.evalChildValue('@day2', '[data-daily-humidity]', '72')
    cy.evalChildValue('@day2', '[data-daily-wind-speed]', '14')
    cy.evalChildValue('@day2', '[data-daily-wind-direction]', 'S')
    cy.get('@day2')
      .find('[data-daily-icon]')
      .invoke('attr', 'src')
      .should('eq', 'http://openweathermap.org/img/wn/10d.png')
      .then((src) => {
        cy.request(src).its('status').should('eq', 200)
      })

    //day 3
    cy.get('.daily-container').children('div').eq(2).as('day3')
    cy.evalChildValue('@day3', '[data-daily-date]', 'Thursday')
    cy.evalChildValue('@day3', '[data-daily-high]', '81')
    cy.evalChildValue('@day3', '[data-daily-low]', '68')
    cy.evalChildValue('@day3', '[data-daily-description]', 'moderate rain')
    cy.evalChildValue('@day3', '[data-daily-humidity]', '58')
    cy.evalChildValue('@day3', '[data-daily-wind-speed]', '17')
    cy.evalChildValue('@day3', '[data-daily-wind-direction]', 'NW')
    cy.get('@day3')
      .find('[data-daily-icon]')
      .invoke('attr', 'src')
      .should('eq', 'http://openweathermap.org/img/wn/10d.png')
      .then((src) => {
        cy.request(src).its('status').should('eq', 200)
      })

    //day 4
    cy.get('.daily-container').children('div').eq(3).as('day4')
    cy.evalChildValue('@day4', '[data-daily-date]', 'Friday')
    cy.evalChildValue('@day4', '[data-daily-high]', '77')
    cy.evalChildValue('@day4', '[data-daily-low]', '63')
    cy.evalChildValue('@day4', '[data-daily-description]', 'overcast clouds')
    cy.evalChildValue('@day4', '[data-daily-humidity]', '48')
    cy.evalChildValue('@day4', '[data-daily-wind-speed]', '10')
    cy.evalChildValue('@day4', '[data-daily-wind-direction]', 'S')
    cy.get('@day4')
      .find('[data-daily-icon]')
      .invoke('attr', 'src')
      .should('eq', 'http://openweathermap.org/img/wn/04d.png')
      .then((src) => {
        cy.request(src).its('status').should('eq', 200)
      })

    //day 5
    cy.get('.daily-container').children('div').eq(4).as('day5')
    cy.evalChildValue('@day5', '[data-daily-date]', 'Saturday')
    cy.evalChildValue('@day5', '[data-daily-high]', '70')
    cy.evalChildValue('@day5', '[data-daily-low]', '61')
    cy.evalChildValue('@day5', '[data-daily-description]', 'heavy intensity rain')
    cy.evalChildValue('@day5', '[data-daily-humidity]', '96')
    cy.evalChildValue('@day5', '[data-daily-wind-speed]', '15')
    cy.evalChildValue('@day5', '[data-daily-wind-direction]', 'NE')
    cy.get('@day5')
      .find('[data-daily-icon]')
      .invoke('attr', 'src')
      .should('eq', 'http://openweathermap.org/img/wn/10d.png')
      .then((src) => {
        cy.request(src).its('status').should('eq', 200)
      })

    //day 6
    cy.get('.daily-container').children('div').eq(5).as('day6')
    cy.evalChildValue('@day6', '[data-daily-date]', 'Sunday')
    cy.evalChildValue('@day6', '[data-daily-high]', '77')
    cy.evalChildValue('@day6', '[data-daily-low]', '58')
    cy.evalChildValue('@day6', '[data-daily-description]', 'clear sky')
    cy.evalChildValue('@day6', '[data-daily-humidity]', '47')
    cy.evalChildValue('@day6', '[data-daily-wind-speed]', '14')
    cy.evalChildValue('@day6', '[data-daily-wind-direction]', 'W')
    cy.get('@day6')
      .find('[data-daily-icon]')
      .invoke('attr', 'src')
      .should('eq', 'http://openweathermap.org/img/wn/01d.png')
      .then((src) => {
        cy.request(src).its('status').should('eq', 200)
      })

    //day 7
    cy.get('.daily-container').children('div').eq(6).as('day7')
    cy.evalChildValue('@day7', '[data-daily-date]', 'Monday')
    cy.evalChildValue('@day7', '[data-daily-high]', '77')
    cy.evalChildValue('@day7', '[data-daily-low]', '61')
    cy.evalChildValue('@day7', '[data-daily-description]', 'clear sky')
    cy.evalChildValue('@day7', '[data-daily-humidity]', '46')
    cy.evalChildValue('@day7', '[data-daily-wind-speed]', '13')
    cy.evalChildValue('@day7', '[data-daily-wind-direction]', 'NW')
    cy.get('@day7')
      .find('[data-daily-icon]')
      .invoke('attr', 'src')
      .should('eq', 'http://openweathermap.org/img/wn/01d.png')
      .then((src) => {
        cy.request(src).its('status').should('eq', 200)
      })
  })

  it('should correctly display hourly weather', function () {
    cy.get('[data-hour-timezone]').should('have.text', 'America/New_York')

    //assert collection size
    cy.get('.hourly-container').children('div').its('length').should('eq', 12)

    //now, streamline testing by evaluating numerous child values at once at the collection level
    cy.get('.hourly-container')
      .children('div')
      .should('have.length', 12) //shorter way to evaluate collection size
      .then(() => {
        cy.get('[data-hour-date]').should(
          'have.text',
          'MondayMondayMondayMondayTuesdayTuesdayTuesdayTuesdayTuesdayTuesdayTuesdayTuesday'
        )
        cy.get('[data-hour]').should('have.text', '6PM8PM10PM12AM2AM4AM6AM8AM10AM12PM2PM4PM')
        cy.get('[data-hour-temp]').should('have.text', '777471686665646772757574')
        cy.get('[data-hour-precip]').should('have.text', '000000000000')
        cy.get('[data-hour-wind-speed]').should('have.text', '141312109871112162021')
        cy.get('[data-hour-wind-direction]').should('have.text', 'SSSSWSWSWSWSWSSSS')
        cy.get('[data-hour-humidity]').should('have.text', '384144464956636151495155')
        cy.get('[data-hour-uv-level]').should('have.text', 'lowlowlowlowlowlowlowlowmediumhighhighmedium')
      })
  })

  it('should display the correct weather icon and alt text for each hour', function () {
    //iterating over the collection to evaluate child values also works
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
    ]

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
    ]

    cy.get('[data-hour-icon]')
      .should('have.length', 12)
      .each((img, index, arr) => {
        //cy.wrap the variable in order to call cypress commands
        cy.wrap(img).should('have.attr', 'src', icons[index])
        cy.wrap(img).should('have.attr', 'alt', alts[index])
      })
  })
})
