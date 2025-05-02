const { getDateAndTime, responseStatusCheck, lazyLoadArticles, currPg, pgSize, isLoading } = require('../main.js');

describe('date and time', () => {
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
  test('should set the date element with the correct format', () => {
    getDateAndTime();
    const dateElement = document.querySelector('#date');
    expect(dateElement.textContent).toMatch(/\w+, \w+ \d+, \d{4}/); // Matches "Weekday, Month Day, Year"
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


describe('lazyLoadArticles() this will test mock articles of 18 so it lazy loads them', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <p id="date"></p>
      <main>
        <div class="gridContainer">
        </div>
      </main>
      <footer id="load-more"></footer>
    `;
    global.isLoading = false;
    global.checker = { disconnect: jest.fn() };
    global.fetch = jest.fn();
  });
    //Test #5 - making sure this function creates and then push articles to the DOm with incrementing page number.
    // We also made test for the fetch function to check if it is called with the correct page num and size.
  test('loading page 0 and after that page 1 by pushing 9 articles at a time', async () => {
    function createTempDocs(num) {
      const tempDocs = [];
      for (let i = 0; i < num; i++) {
        tempDocs.push({
          headline: { main: 'Article Title ' + i },
          byline:   { original: 'by Ayub' + i },
          pub_date: '2025-05-01',
          multimedia: {
            default: { url: 'https://test.com/img' + i + '.png' },
            caption: 'boring ' + i
          }
        });
      }
      return tempDocs;
    }
    const firstPage = { response:{ docs: createTempDocs(9) }};
    const secondPage = { response:{ docs: createTempDocs(9) }};

    //mock that will return successful response and the data.
    function okResponse(data) {
      return {
        ok: true,
        json: () => Promise.resolve(data),
      };
    }

    fetch
      .mockResolvedValueOnce(okResponse(firstPage))
      .mockResolvedValueOnce(okResponse(secondPage));

    //mock lazyLoadArticles function to check if it is called with the correct page number and size.
    await lazyLoadArticles();
    expect(fetch).toHaveBeenCalledWith(expect.stringMatching(/\?page=0&pageSize=9$/));
    let articles = document.querySelectorAll('main .gridContainer .article');
    expect(articles).toHaveLength(9);
    
    await lazyLoadArticles();
    expect(fetch).toHaveBeenCalledWith(expect.stringMatching(/\?page=1&pageSize=9$/));
    articles = document.querySelectorAll('main .gridContainer .article');
    expect(articles).toHaveLength(18);
  });
});