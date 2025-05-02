const { getDateAndTime, responseStatusCheck, articleParser } = require('../main.js');

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

describe('articleParser and inject', () => {
  beforeEach(() => {
    // Set up a mock DOM structure
    document.body.innerHTML = `
      <main>
        <div class="gridContainer"></div>
      </main>
    `;
  });

  test('should inject articles into the DOM correctly', async () => {
    // Mock data
    const mockData = {
      response: {
        docs: [
          {
            headline: { main: 'Test Article 1' },
            byline: { original: 'Author 1' },
            pub_date: '2025-05-01',
            abstract: 'This is a test abstract for article 1.',
            multimedia: {
              default: { url: 'image1.jpg' },
              caption: 'Image 1 caption',
            },
          },
          {
            headline: { main: 'Test Article 2' },
            byline: { original: 'Author 2' },
            pub_date: '2025-05-02',
            abstract: 'This is a test abstract for article 2.',
            multimedia: {
              default: { url: 'image2.jpg' },
              caption: 'Image 2 caption',
            },
          },
        ],
      },
    };

    // Call the function with mock data
    await articleParser(mockData);

    // Verify the DOM has been updated
    const articles = document.querySelectorAll('.gridContainer .article');
    expect(articles.length).toBe(2); // Two articles should be added

    // Check the content of the first article
    const firstArticle = articles[0];
    expect(firstArticle.querySelector('h2').textContent).toBe('Test Article 1');
    expect(firstArticle.querySelector('p').textContent).toBe('This is a test abstract for article 1.');
    expect(firstArticle.querySelector('img').src).toContain('image1.jpg');
    expect(firstArticle.querySelector('img').alt).toBe('Image 1 caption');

    // Check the content of the second article
    const secondArticle = articles[1];
    expect(secondArticle.querySelector('h2').textContent).toBe('Test Article 2');
    expect(secondArticle.querySelector('p').textContent).toBe('This is a test abstract for article 2.');
    expect(secondArticle.querySelector('img').src).toContain('image2.jpg');
    expect(secondArticle.querySelector('img').alt).toBe('Image 2 caption');
  });

  test('should inject articles with no multimedia', async () => {
    // Mock data
    const mockData = {
      response: {
        docs: [
          {
            headline: { main: 'Test Article 1' },
            byline: { original: 'Author 1' },
            pub_date: '2025-05-01',
            abstract: 'This is a test abstract for article 1.',
          },
          {
            headline: { main: 'Test Article 2' },
            byline: { original: 'Author 2' },
            pub_date: '2025-05-02',
            abstract: 'This is a test abstract for article 2.',
            multimedia: {
              default: { url: 'image2.jpg' },
              caption: 'Image 2 caption',
            },
          },
        ],
      },
    };

    // Call the function with mock data
    await articleParser(mockData);

    // Verify the DOM has been updated
    const articles = document.querySelectorAll('.gridContainer .article');
    expect(articles.length).toBe(2); // Two articles should be added

    // Check the content of the first article
    const firstArticle = articles[0];
    expect(firstArticle.querySelector('h2').textContent).toBe('Test Article 1');
    expect(firstArticle.querySelector('p').textContent).toBe('This is a test abstract for article 1.');
    expect(firstArticle.querySelector('img')).toBeNull(); // No image should be present

    // Check the content of the second article
    const secondArticle = articles[1];
    expect(secondArticle.querySelector('h2').textContent).toBe('Test Article 2');
    expect(secondArticle.querySelector('p').textContent).toBe('This is a test abstract for article 2.');
    expect(secondArticle.querySelector('img').src).toContain('image2.jpg');
    expect(secondArticle.querySelector('img').alt).toBe('Image 2 caption');
  });
});