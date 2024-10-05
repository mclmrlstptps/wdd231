// HTML elements //
const myTown = document.querySelector('#town');
const myDescription = document.querySelector('#description');
const myTemperature = document.querySelector('#temperature');
const myGraphic = document.querySelector('#graphic')


// required variables for URL//
const myKey = "e889381047419515a91f0ee098853322"
const myLat = "49.75"
const myLong = "6.64"

// Full path 
const myURL = '//api.openweathermap.org/data/2.5/weather?lat=49.75&lon=6.64&units=imperial&appid=[e889381047419515a91f0ee098853322]';

// Current weather data
async function apiFetch() {
    try {
      const response = await fetch(myURL);
      if (response.ok) {
        const data = await response.json();
        console.log(data); // testing only
        // displayResults(data); // uncomment when ready
      } else {
          throw Error(await response.text());
      }
    } catch (error) {
        console.error(error);
    }
  }
   
  apiFetch();

  function displayResults(data) {
    currentTemp.innerHTML = `${data._____}&deg;F`;
    const iconsrc = `https://openweathermap.org/img/w/${______}.___`;
    let desc = data.weather[0].______;
    weatherIcon.setAttribute('___', _____);
    weatherIcon.setAttribute('___', _____);
    captionDesc.textContent = `${desc}`;
  }