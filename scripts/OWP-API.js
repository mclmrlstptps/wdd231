// HTML elements //
const myTown = document.querySelector('#town');
const myDescription = document.querySelector('#description');
const myTemperature = document.querySelector('#temperature');
const myGraphic = document.querySelector('#graphic')


// required variables for URL//
const myKey = "6eb44b758b0f478d4c01ea26cb4554c6"
const myLat = "49.75010293864281"
const myLong = "6.637455443723131"

// Full path 
const myURL = 'https://api.openweathermap.org/data/2.5/weather?lat=49.75010293864281&lon=6.637455443723131&units=imperial&appid=6eb44b758b0f478d4c01ea26cb4554c6';

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