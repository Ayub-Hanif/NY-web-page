// Author: Mohammad Ayub Hanif Saleh

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