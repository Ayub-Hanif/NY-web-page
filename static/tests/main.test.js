const { getDateAndTime } = require('../main.js');

describe('getDateAndTime()', () => {
  beforeAll(() => {
    //I am makding sure that the time is at May 2, 2023
    //I learned the example from (jest timer mocks).
    jest.useFakeTimers()
        .setSystemTime(new Date(2023, 4, 2));
  });
    // once we are done I use the afterAll to restore the original timers after all tests are done.
  afterAll(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
    //making sure that the time is back to normal.
  });
    // making sure that the tests are indep and do not affect each other. and DOM is reset before each test.
  beforeEach(() => {
    document.body.innerHTML = `<p id="date"></p>`;
  });

    //Test #1 - we check the return value of the function that was used for the fetching request.
  test('check for YYYYMMDD string', () => {
    const string = getDateAndTime();
    expect(string).toBe('20230502');
  });

    //Test #2 - we check if the function is updating the DOM correctly. 
    // which is the human-readable date and on top right side of the website.
  test('check for human readable date for #date', () => {
    getDateAndTime();  // call it so it updates the DOM
    const human = document.querySelector('#date').textContent;
    expect(human).toBe('Tuesday, May 2, 2023');
  });
});