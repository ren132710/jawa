describe('#renderPageWeather', () => {
  before(() => {
    cy.visit('/')
  })

  it('should correctly display current weather', () => {
    //top left
    cy.get('[data-current-location]').invoke('attr', 'data-id').should('equal', 'c9ae7c46-81e4-4c9d-a933-bb3c8d14fc87')
    cy.get('[data-current-location]').should('have.text', 'new york')
    cy.get('[data-new-place]').should('have.text', 'New Place')
    cy.get('[data-current-icon]')
      .invoke('attr', 'src')
      .should('eq', 'http://openweathermap.org/img/wn/01d@4x.png')
      .then((src) => {
        cy.request(src).its('status').should('eq', 200)
      })

    //bottom left
    cy.get('[data-current-uv-index]').should('have.text', '2.4')
    cy.get('[data-current-uv-level]').should('have.text', 'low')
    cy.get('[data-current-humidity]').should('have.text', '71')
    cy.get('[data-current-wind-speed]').should('have.text', '12')
    cy.get('[data-wind-units]').contains('mph')
    cy.get('[data-current-wind-direction]').should('have.text', 'S')

    //top right
    cy.get('[data-current-dt]').should('have.text', 'Fri, 3 Jun 3:50 PM')
    cy.get('[data-current-lat]').should('have.text', '40.7306')
    cy.get('[data-current-long]').should('have.text', '-73.9352')
    cy.get('[data-current-high]').should('have.text', '75')
    cy.get('[data-current-temp]').should('have.text', '74')
    cy.get('[data-temp-units]').contains('F')
    cy.get('[data-current-fl]').should('have.text', '75')
    cy.get('[data-current-description]').should('have.text', 'clear sky')
    cy.get('[data-current-precip]').should('have.text', '50')
    cy.get('[data-current-visibility]').should('have.text', '6.2')
    cy.get('[data-visibility-units]').contains('mi')

    //bottom right
    cy.get('[data-current-dew-point]').should('have.text', '64')
    cy.get('[data-current-sunrise]').should('have.text', '5:26 AM')
    cy.get('[data-current-sunset]').should('have.text', '8:22 PM')
  })

  it('should correctly display daily weather', () => {
    cy.get('.daily-container').children('div').its('length').should('eq', 7)

    //day 1, the long way: for each day, explicitly evaluate each child value
    cy.get('.daily-container').children('div').eq(0).as('day1')
    cy.get('@day1').find('[data-daily-date]').should('have.text', 'Saturday')
    cy.get('@day1').find('[data-daily-high]').should('have.text', '82')
    cy.get('@day1').find('[data-daily-low]').should('have.text', '63')
    cy.get('@day1').find('[data-daily-description]').should('have.text', 'few clouds')
    cy.get('@day1').find('[data-daily-humidity]').should('have.text', '32')
    cy.get('@day1').find('[data-daily-wind-speed]').should('have.text', '15')
    cy.get('@day1').find('[data-wind-units]').contains('mph')
    cy.get('@day1').find('[data-daily-wind-direction]').should('have.text', 'N')
    cy.get('@day1')
      .find('[data-daily-icon]')
      .invoke('attr', 'src')
      .should('eq', 'http://openweathermap.org/img/wn/02d.png')
      .then((src) => {
        cy.request(src).its('status').should('eq', 200)
      })

    //day 2, try leveraging custom commands
    cy.get('.daily-container').children('div').eq(1).as('day2')
    cy.evalChildValue('@day2', '[data-daily-date]', 'Sunday')
    cy.evalChildValue('@day2', '[data-daily-high]', '74')
    cy.evalChildValue('@day2', '[data-daily-low]', '60')
    cy.evalChildValue('@day2', '[data-daily-description]', 'scattered clouds')
    cy.evalChildValue('@day2', '[data-daily-humidity]', '26')
    cy.evalChildValue('@day2', '[data-daily-wind-speed]', '13')
    cy.get('@day2').find('[data-wind-units]').contains('mph')
    cy.evalChildValue('@day2', '[data-daily-wind-direction]', 'N')
    cy.get('@day2')
      .find('[data-daily-icon]')
      .invoke('attr', 'src')
      .should('eq', 'http://openweathermap.org/img/wn/03d.png')
      .then((src) => {
        cy.request(src).its('status').should('eq', 200)
      })

    //day 3
    cy.get('.daily-container').children('div').eq(2).as('day3')
    cy.evalChildValue('@day3', '[data-daily-date]', 'Monday')
    cy.evalChildValue('@day3', '[data-daily-high]', '75')
    cy.evalChildValue('@day3', '[data-daily-low]', '63')
    cy.evalChildValue('@day3', '[data-daily-description]', 'broken clouds')
    cy.evalChildValue('@day3', '[data-daily-humidity]', '33')
    cy.evalChildValue('@day3', '[data-daily-wind-speed]', '13')
    cy.get('@day3').find('[data-wind-units]').contains('mph')
    cy.evalChildValue('@day3', '[data-daily-wind-direction]', 'SE')
    cy.get('@day3')
      .find('[data-daily-icon]')
      .invoke('attr', 'src')
      .should('eq', 'http://openweathermap.org/img/wn/04d.png')
      .then((src) => {
        cy.request(src).its('status').should('eq', 200)
      })

    //day 4
    cy.get('.daily-container').children('div').eq(3).as('day4')
    cy.evalChildValue('@day4', '[data-daily-date]', 'Tuesday')
    cy.evalChildValue('@day4', '[data-daily-high]', '75')
    cy.evalChildValue('@day4', '[data-daily-low]', '64')
    cy.evalChildValue('@day4', '[data-daily-description]', 'overcast clouds')
    cy.evalChildValue('@day4', '[data-daily-humidity]', '56')
    cy.evalChildValue('@day4', '[data-daily-wind-speed]', '19')
    cy.get('@day4').find('[data-wind-units]').contains('mph')
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
    cy.evalChildValue('@day5', '[data-daily-date]', 'Wednesday')
    cy.evalChildValue('@day5', '[data-daily-high]', '79')
    cy.evalChildValue('@day5', '[data-daily-low]', '67')
    cy.evalChildValue('@day5', '[data-daily-description]', 'light rain')
    cy.evalChildValue('@day5', '[data-daily-humidity]', '49')
    cy.evalChildValue('@day5', '[data-daily-wind-speed]', '13')
    cy.get('@day5').find('[data-wind-units]').contains('mph')
    cy.evalChildValue('@day5', '[data-daily-wind-direction]', 'S')
    cy.get('@day5')
      .find('[data-daily-icon]')
      .invoke('attr', 'src')
      .should('eq', 'http://openweathermap.org/img/wn/10d.png')
      .then((src) => {
        cy.request(src).its('status').should('eq', 200)
      })

    //day 6
    cy.get('.daily-container').children('div').eq(5).as('day6')
    cy.evalChildValue('@day6', '[data-daily-date]', 'Thursday')
    cy.evalChildValue('@day6', '[data-daily-high]', '82')
    cy.evalChildValue('@day6', '[data-daily-low]', '68')
    cy.evalChildValue('@day6', '[data-daily-description]', 'moderate rain')
    cy.evalChildValue('@day6', '[data-daily-humidity]', '49')
    cy.evalChildValue('@day6', '[data-daily-wind-speed]', '18')
    cy.get('@day6').find('[data-wind-units]').contains('mph')
    cy.evalChildValue('@day6', '[data-daily-wind-direction]', 'SW')
    cy.get('@day6')
      .find('[data-daily-icon]')
      .invoke('attr', 'src')
      .should('eq', 'http://openweathermap.org/img/wn/10d.png')
      .then((src) => {
        cy.request(src).its('status').should('eq', 200)
      })

    //day 7
    cy.get('.daily-container').children('div').eq(6).as('day7')
    cy.evalChildValue('@day7', '[data-daily-date]', 'Friday')
    cy.evalChildValue('@day7', '[data-daily-high]', '80')
    cy.evalChildValue('@day7', '[data-daily-low]', '62')
    cy.evalChildValue('@day7', '[data-daily-description]', 'clear sky')
    cy.evalChildValue('@day7', '[data-daily-humidity]', '34')
    cy.evalChildValue('@day7', '[data-daily-wind-speed]', '14')
    cy.get('@day7').find('[data-wind-units]').contains('mph')
    cy.evalChildValue('@day7', '[data-daily-wind-direction]', 'SW')
    cy.get('@day7')
      .find('[data-daily-icon]')
      .invoke('attr', 'src')
      .should('eq', 'http://openweathermap.org/img/wn/01d.png')
      .then((src) => {
        cy.request(src).its('status').should('eq', 200)
      })
  })

  it('should correctly display hourly weather', () => {
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
          'FridayFridayFridayFridaySaturdaySaturdaySaturdaySaturdaySaturdaySaturdaySaturdaySaturday'
        )
        cy.get('[data-hour]').should('have.text', '5PM7PM9PM11PM1AM3AM5AM7AM9AM11AM1PM3PM')
        cy.get('[data-hour-temp]').should('have.text', '747370696765636571768082')
        cy.get('[data-hour-precip]').should('have.text', '2190000000000')
        cy.get('[data-hour-wind-speed]').should('have.text', '953777545789')
        cy.get('[data-wind-units]').contains('mph')
        cy.get('[data-hour-wind-direction]').should('have.text', 'SSSNNWNWNWNWNWWWNW')
        cy.get('[data-hour-humidity]').should('have.text', '716768535150524941342925')
        cy.get('[data-hour-uv-level]').should('have.text', 'lowlowlowlowlowlowlowlowlowhighvery highhigh')
      })
  })

  it('should display the correct weather icon for each hour', function () {
    //iterating over the collection to evaluate child values also works
    const icons = [
      'http://openweathermap.org/img/wn/01d.png',
      'http://openweathermap.org/img/wn/03d.png',
      'http://openweathermap.org/img/wn/04n.png',
      'http://openweathermap.org/img/wn/04n.png',
      'http://openweathermap.org/img/wn/04n.png',
      'http://openweathermap.org/img/wn/01n.png',
      'http://openweathermap.org/img/wn/02n.png',
      'http://openweathermap.org/img/wn/01d.png',
      'http://openweathermap.org/img/wn/03d.png',
      'http://openweathermap.org/img/wn/02d.png',
      'http://openweathermap.org/img/wn/02d.png',
      'http://openweathermap.org/img/wn/01d.png',
    ]

    cy.get('[data-hour-icon]')
      .should('have.length', 12)
      .each((img, index, arr) => {
        //cy.wrap the variable in order to call cypress commands
        cy.wrap(img).should('have.attr', 'src', icons[index])
      })
  })
})
