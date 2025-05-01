// Author: Mohammad Ayub Hanif Saleh
//         Raiyan Sazid

// This function gets the current date in a specific format, We return a string for the date
// The time options is to get weekday name, year, month, and day in correct format so it will appear on website navbar.
function getDateAndTime() {
  dateElement = document.querySelector('#date');
  const date = new Date();
  const time = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  dateElement.textContent = date.toLocaleDateString('en-US', time);
}

addEventListener('DOMContentLoaded', getDateAndTime);

addEventListener('load', () => {
  fetch('api/findArticle/sacramento')
  .then (response => responseStatusCheck(response))
  .then (data => { articleParser(data)})
  .catch (error => console.error('Error fetching data:', error));

});

async function responseStatusCheck(response) {
  // This function will check the status of the response and return true or false
  // The response is an object, we need to check the status code and return true or false
  // The status code is in the range of 200-299, if it is in this range we will return true
  // If it is not in this range we will return false
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await response.json();
  return data;
}
async function articleParser(data) {
  // This function will parse the data and return the article object
  // The data is an array of objects, we need to get the first object and return it
  // The object has the following properties: title, author, date, content, image
  // We will return an object with these properties

  articles = data.response.docs;
  console.log(articles[0]);

  for (let i = 0; i < articles.length; i++) {
    let articleTitle = articles[i].headline.main;
    let articleAuthor = articles[i].byline.original;
    let articleDate = articles[i].pub_date;
    let articleAbstract = articles[i].abstract;
    let articleImage = articles[i].multimedia.default.url;
    let articleImageCaption = articles[i].multimedia.caption;
    
    await injectArticle(articleTitle, articleAuthor, articleDate, articleAbstract, articleImage, articleImageCaption);
  }

  return true;
}

async function injectArticle(articleTitle, articleAuthor, articleDate, articleAbstract, articleImage, articleImageCaption) {
  // This function will inject the article into the HTML page
  // The article is an object with the following properties: title, author, date, content, image
  // We will inject the article into the HTML page using innerHTML
  // The HTML page has a div with id="article" where we will inject the article

  const articleContainer = document.querySelector('main div.gridContainer');

  const articleHTML = `
    <img src="${articleImage}" alt="${articleImageCaption}" class="news-image">
    <h2>${articleTitle}</h2>
    <p>${articleAbstract}</p>
  `;

  // Inject a section named article and add the articleHTML
  const articleSection = document.createElement('section');
  articleSection.classList.add('article');
  articleSection.innerHTML = articleHTML;

  // Append the article section to the article container
  articleContainer.appendChild(articleSection);
}
