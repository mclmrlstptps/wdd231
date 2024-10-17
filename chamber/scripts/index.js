// HTML elements //
const myTown = document.querySelector('#town');
const myDescription = document.querySelector('#description');
const myTemperature = document.querySelector('#temperature');
const myGraphic = document.querySelector('#graphic')

// 3 day forcast
const forecastToday = document.querySelector('#today');
const forecastTomorrow = document.querySelector('#tomorrow');
const forecastD3 = document.querySelector('#day3')


// required variables for URL//
const myKey = "6eb44b758b0f478d4c01ea26cb4554c6"
const myLat = "38.24706453999145"
const myLong = "-85.77135649477583"

// Full path 
const myURL = 'https://api.openweathermap.org/data/2.5/weather?lat=38.24706453999145&lon=-85.77135649477583&units=imperial&appid=6eb44b758b0f478d4c01ea26cb4554c6';
const forecastURL = 'https://api.openweathermap.org/data/2.5/forecast?lat=38.24706453999145&lon=-85.77135649477583&units=imperial&appid=6eb44b758b0f478d4c01ea26cb4554c6'

// Current weather data
async function apiFetch() {
    try {
      const response = await fetch(myURL);
      if (response.ok) {
        const data = await response.json();
        console.log(data); // testing only
        displayResults(data); // uncomment when ready
      } else {
          throw Error(await response.text());
      }
    } catch (error) {
        console.error(error);
    }
  }
     function displayResults(data) {
        console.log('hello')
        myTown.innerHTML = data.name
        myDescription.innerHTML = data.weather[0].description
        myTemperature.innerHTML = `${data.main.temp}&deg;F`
        const iconsrc = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
        myGraphic.setAttribute('SRC', iconsrc)
        myGraphic.setAttribute('alt', data.weather[0].description)

     }
apiFetch(); 


async function fetchForecast() {
  try {
    const response = await fetch(forecastURL);
    if (response.ok) {
      const data = await response.json();
      console.log(data); // testing only
      displayForecast(data); // uncomment when ready
    } else {
        throw Error(await response.text());
    }
  } catch (error) {
      console.error(error);
  }
}
   function displayForecast(data) {
    const todayForecast = data.list.find(item => item.dt_txt.includes("12:00:00"));
    const tomorrowForecast = data.list.find(item => item.dt_txt.includes("12:00:00") && new Date(item.dt_txt).getDate() === new Date().getDate() + 1);
    const day3Forecast = data.list.find(item => item.dt_txt.includes("12:00:00") && new Date(item.dt_txt).getDate() === new Date().getDate() + 2);

    if (todayForecast) {
      forecastToday.innerHTML = `${todayForecast.main.temp}&deg;F with ${todayForecast.weather[0].description}`;
    }
    if (tomorrowForecast) {
        forecastTomorrow.innerHTML = `${tomorrowForecast.main.temp}&deg;F with ${tomorrowForecast.weather[0].description}`;
    }
    if (day3Forecast) {
        forecastD3.innerHTML = `${day3Forecast.main.temp}&deg;F with ${day3Forecast.weather[0].description}`;
    }

   }
fetchForecast(); 



// Fetch member data from the JSON file
async function fetchMembers() {
  try {
      const response = await fetch('data/members.json');
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      const data = await response.json();
      
      // Check if the data is an array, if not, look for a members property
      const members = Array.isArray(data) ? data : data.members;
      
      if (!Array.isArray(members)) {
          throw new Error('Members data is not in the expected format');
      }
      
      displayMembers(members);
  } catch (error) {
      console.error('Error fetching members:', error);
      displayError('Failed to load members data. Please try again later.');
  }
}

// Function to display members
function displayMembers(members) {
  const container = document.getElementById('membersContainer');
  container.innerHTML = ''; // Clear previous content

  // Slice the array to get only the first 3 members
  const selectedMembers = members.slice(0, 3);

  selectedMembers.forEach(member => {
      const memberCard = document.createElement('div');
      memberCard.classList.add('member-card');

      memberCard.innerHTML = `
          <h3>${member.name || 'Unnamed Business'}</h3>
          <div class="business-info">
              <p>Email: ${member.email || 'N/A'}</p>
              <p>Phone: ${member.phone || 'N/A'}</p>
              <p>Website: ${member.website ? `<a href="${member.website}" target="_blank">${member.website}</a>` : 'N/A'}</p>
          </div>
      `;

      container.appendChild(memberCard);
  });
}

// Function to display error messages
function displayError(message) {
  const container = document.getElementById('membersContainer');
  container.innerHTML = `<p class="error-message">${message}</p>`;
}

// Call the fetch function on page load
fetchMembers();




// Set current timestamp in hidden field
document.getElementById('timestamp').value = new Date().toISOString();

// Modal functionality
const modals = document.querySelectorAll('.modal');
const closeButtons = document.querySelectorAll('.close-btn');
const membershipLinks = document.querySelectorAll('.membership-card a');

// Open modal on click
membershipLinks.forEach((link, index) => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        modals[index].style.display = 'block';
    });
});

// Close modal on close button
closeButtons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
        modals[index].style.display = 'none';
    });
});

// Close modal when clicking outside modal content
window.addEventListener('click', (event) => {
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});

// // Animate membership cards
// window.addEventListener('load', () => {
//     document.querySelectorAll('.membership-card').forEach(card => {
//         card.style.transition = 'opacity 1s ease-in-out, transform 1s ease';
//         card.style.opacity = '1';
//         card.style.transform = 'translateY(0)';
//     });
// });



// discover page js
const lastVisit = localStorage.getItem('lastVisit');
const now = Date.now();
const oneDay = 24 * 60 * 60 * 1000;

if (lastVisit) {
  const daysSinceLastVisit = Math.floor((now - lastVisit) / oneDay);

  if (daysSinceLastVisit < 1) {
    document.querySelector('.visitor-message').textContent = "Back so soon! Awesome!";
  } else if (daysSinceLastVisit === 1) {
    document.querySelector('.visitor-message').textContent = "You last visited 1 day ago.";
  } else {
    document.querySelector('.visitor-message').textContent = `You last visited ${daysSinceLastVisit} days ago.`;
  }
} else {
  document.querySelector('.visitor-message').textContent = "Welcome! Let us know if you have any questions.";
}

localStorage.setItem('lastVisit', now);