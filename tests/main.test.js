/**
 * @jest-environment jsdom
 */

const { getDateAndTime } = require('../static/main.js');

describe('getDateAndTime', () => {
  beforeEach(() => {
    // Set up a mock DOM element
    document.body.innerHTML = '<div id="date"></div>';
  });

  test('should set the date element with the correct format', () => {
    getDateAndTime();
    const dateElement = document.querySelector('#date');
    expect(dateElement.textContent).toMatch(/\w+, \w+ \d+, \d{4}/); // Matches "Weekday, Month Day, Year"
  });
});