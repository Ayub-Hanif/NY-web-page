const { getDateAndTime, responseStatusCheck } = require('../main.js');

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

// we testing the response function if it correctly checks and responds to both success and fail cases.
describe('responseStatusCheck()', () => {
    //Test #3 - we made up a mock data of sucess and check if it actually returns the data. 
    test('response status check for sucessful', async () => {
        const mockData = { message: 'Success' };
        const sucessfulResponse = {
            ok: true,
            json: jest.fn().mockResolvedValue(mockData),
        };
        const result = await responseStatusCheck(sucessfulResponse); 
        expect(result).toEqual(mockData);
    });
    //Test #4 - we made up a mock data of fail and check if it actually returns the error. using try and catch because 
    // other ways it will not work.
    test('response status check for failed',async () => {
        const failedResponse = {
            ok: false,
            json: jest.fn().mockResolvedValue({ message: 'Failed' }),
        };
        let caught;
        try {
          await responseStatusCheck(failedResponse);
        } catch (err) {
          caught = err;
        }
        expect(caught).toEqual(new Error('Network response was not ok'));
    });
});