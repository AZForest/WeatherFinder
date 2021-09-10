//colors
let red = '#d10b64';
let orange = '#FFBD51';
let blue = '#0BBDD1';

const toggle = document.getElementById('toggle');
const toggle2 = document.getElementById('toggle2');
const map = document.getElementById('bg-img-container');
const cities = document.querySelectorAll('.city');
const resultHeading = document.getElementById('result-heading');
const resultDescription = document.getElementById('result-description');
const search = document.getElementById('search');
const submit = document.getElementById('submit');
const searchCity = document.getElementById('search-city');
const searchLabel = document.getElementById('search-label');
const random = document.getElementById('random');
const leftBar = document.getElementById('left-bar');
const rightBar = document.getElementById('right-bar');
const searchResults = document.getElementById('search-results');

//city DOM elements
const mc = document.getElementById('mc'); //mexico city
const la = document.getElementById('la'); //la
const ny = document.getElementById('ny'); //new york
const sp = document.getElementById('sp'); //sao paulo
const be = document.getElementById('be'); //beijing
const ty = document.getElementById('ty'); //tokyo
const de = document.getElementById('de'); //delhi
const ca = document.getElementById('ca'); //cairo
const mo = document.getElementById('mo'); //moscow
const sy = document.getElementById('sy'); //sydney

//array of deafult city dom elements
let defCityArray = [mc, la, ny, sp, be, ty, de, ca, mo, sy];

window.onload = function() {
    this.initializeCity(19.42847, -99.12766, mc);
    this.initializeCity(34.0522, -118.2437, la);
    this.initializeCity(46.51802, -95.37615, ny);
    this.initializeCity(-23.5505, -46.6333, sp);
    this.initializeCity(39.9075, 116.39723, be);
    this.initializeCity(35.6895, 139.69171, ty);
    this.initializeCity(28.7041, 77.1025, de);
    this.initializeCity(30.0444, 31.2357, ca);
    this.initializeCity(55.75222, 37.61556, mo);
    this.initializeCity(-33.8688, 151.2093, sy);
}

window.onresize = function () {
    this.initializeCity(19.42847, -99.12766, mc);
    this.initializeCity(34.0522, -118.2437, la);
    this.initializeCity(46.51802, -95.37615, ny);
    this.initializeCity(-23.5505, -46.6333, sp);
    this.initializeCity(39.9075, 116.39723, be);
    this.initializeCity(35.6895, 139.69171, ty);
    this.initializeCity(28.7041, 77.1025, de);
    this.initializeCity(30.0444, 31.2357, ca);
    this.initializeCity(55.75222, 37.61556, mo);
    this.initializeCity(-33.8688, 151.2093, sy);
}

function registerPoint(e) {
    let xpos = e.clientX;
    let ypos = e.clientY;
    console.log(xpos, ypos);
}

async function getCoords(city, isoCode) {
    if (city === 'New York') {
        city = 'New York Mills';
    }
    const res = await fetch('https://raw.githubusercontent.com/lutangar/cities.json/master/cities.json');
    const data = await res.json();
    let x = data.filter(obj => {
        return obj["name"].normalize("NFD").replace(/[\u0300-\u036f]/g, "") === city && obj["country"] === isoCode.trim();
    })
    if (x.length === 0 ) {
        resultDescription.innerHTML = `<p>Unable to match a city and country combination. This error likely occurred from the server receiving too many requests.</p>`
        resultDescription.style.color = "white";

    }
    let coords = [ x[0]["lat"], x[0]["lng"] ];
    //resultHeading.innerHTML = `<h2>${city}, ${getCountry(isoCode)}</h2>`;
    return coords;
}

//gets random location
async function getRandomLocation() {
    resultDescription.innerHTML = `
        <h2 class="loading">Loading...</h2>
        <div class="loading-container">
            <div class="lds-dual-ring"></div>
        </div>
        `;
    resultDescription.style.visibility = 'visible';
    const res = await fetch('https://raw.githubusercontent.com/lutangar/cities.json/master/cities.json');
    const data = await res.json();
    let randomNum = Math.floor(Math.random() * data.length);
    let randomCity = data[randomNum]["name"];
    let randomIso = data[randomNum]["country"];

    cities.forEach(city => {
        city.style.background = blue;
    })

    renderData(randomCity.trim(), randomIso.trim());
}

//click dot
function selectDot(e) {
    if (e.target.classList.contains("city")) {
        let x = window.getComputedStyle(e.target);
        resultDescription.innerHTML = `
            <h2 class="loading">Loading...</h2>
            <div class="loading-container">
                <div class="lds-dual-ring"></div>
            </div>
            `;
        resultDescription.style.visibility = 'visible';
        if (x.getPropertyValue('background-color') !== red) {
            cities.forEach(item => {
                item.style.background = blue;
            });
            e.target.style.background = red;

            displayData(e.target);
        } else {
            e.target.style.background = orange;
        }
    };
    search.value = ''; 
}

async function searchLocation(e) {
    e.preventDefault();
  
    resultDescription.innerHTML = `
        <h2 class="loading">Loading...</h2>
        <div class="loading-container">
            <div class="lds-dual-ring"></div>
        </div>
        `;
    resultDescription.style.visibility = 'visible';
    const searchTerm = search.value;
    const location = searchTerm.split(',');
    let isoCode;

    if (location.length < 2) {
        resultDescription.innerHTML = `<p>Unable to match a city and country combination. This error likely occurred from the server receiving too many requests.</p>`;
        resultDescription.style.color = "white";
    }

    //handles iso code input
    if (location[1].trim().length === 2) {
        isoCode = location[1].trim().toUpperCase();
    } else {
        //set first letter(s) of country to uppercase
        let countryTrim = location[1].trim();
        let countryFormatArr = countryTrim.split(' ');
        let countryFormat = countryFormatArr.map(word => {
            return word.charAt(0).toUpperCase() + word.slice(1);
        });
        isoCode = getISOCode(countryFormat.join(' '));
    }

    //sets first letter(s) of city to uppercase
    let wordFormatArr = location[0].split(' ');
    let wordFormat = wordFormatArr.map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1);
    })
    let city = wordFormat.join(' ');

    //clears all dots
    cities.forEach(item => {
        item.style.background = blue;
    })
    renderData(city, isoCode);
}


function displayData(select) {
    const location = select.innerHTML.split(',');
    renderData(location[0], location[1].trim());
}

async function renderData(city, isoCode) {
    const result = await getCoords(city, isoCode);
    let lat = result[0];
    let long = result[1];
    addSearchCity(lat, long, city, isoCode);
    const proxy = 'https://cors-anywhere.herokuapp.com/';
    try {
        const openWeather = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=0ac2666dd0ae54a2d9033ee17a74d8f4`)
        const data = await openWeather.json();
        resultDescription.style.visibility = "visible";
        resultDescription.innerHTML = `
        <h2>${city}, ${getCountry(isoCode)}</h2>
        <h4>${convertTime(data.dt)}</h4>
        <p id="x" class="x">x</p>
        <div class="row">
            <ul>
                <li>Lat/Long: <span>${data.coord.lat < 0 ? Math.abs(data.coord.lat).toFixed(1) + 'S' : data.coord.lat.toFixed(1) + 'N'}, ${data.coord.lon < 0 ? Math.abs(data.coord.lon).toFixed(1) + 'W' : data.coord.lon.toFixed(1) + 'E'}</span></li>
                <li>TZ: <span>${data.timezone}</span></li>
                <li>Cloud Cover: <span>${data.clouds.all}%</span></li>
                <li>Pressure: <span>${data.main.pressure}</span></li>
                <li>Humidity: <span>${data.main.humidity}%</span></li>
            </ul>
            <ul class="first">
                <li class="temp">${convertCel(data.main.temp)}° C</li>
                <li>${convertFah(data.main.temp)}° F</li>
                <li>feels like ${convertCel(data.main.feels_like)}° C</li> 
            </ul>
            <div class="icon-ul">
                <img src="Images/icons/${data.weather[0].icon}.png" width=90 height=90/>
                <p><span>${data.weather[0].main}</span></p>
            </div>
            <ul>
                <li>Visibility: <span>${data.visibility}</span></li>
                <li>Wind Dir: <span>${data.wind.deg}°</span></li>
                <li>Wind Speed: <span>${data.wind.speed} m/sec</span></li>
                <li>Sunrise: <span>${convertTimeFormat(data.sys.sunrise)}</span></li>
                <li>Sunset: <span>${convertTimeFormat(data.sys.sunset)}</span></li>
            </ul>
        </div>
        `;

        const xButton = document.getElementById('x');
        xButton.addEventListener('click', function() {
            resultDescription.style.visibility = "hidden";
            //defaultDesc.style.visibility = "visible";
            searchCity.style.visibility = "hidden";
            cities.forEach(city => {
                city.style.background = blue;
            })
        });
    } catch(err) {
        resultDescription.style.visibility = "visible";
        resultDescription.innerHTML = `
            <br />
            ${err}
            <br />
            This error likely occurred from the server receiving too many requests.
            `;
        resultDescription.style.color = "white";
    }

}



//gets iso code from full country name
function getISOCode(country) {
    let result = '';
    const isoArray = Object.entries(isoCountries);

    for (let i = 0; i < isoArray.length; i++) {
        if (isoArray[i][1] === country) {
            result = isoArray[i][0];
        }
    }
    return result;
}

//gets country name from iso code
function getCountry(isoCode) {
    let result = '';
    const isoArray = Object.entries(isoCountries);

    for (let i = 0; i < isoArray.length; i++) {
        if (isoArray[i][0] === isoCode) {
            result = isoArray[i][1];
        }
    }
    return result;
}

//initialize dots
function initializeCity(lat, long, cityDOM) {
    let newLat;
    if (lat < 0) {
        newLat = 90 + Math.abs(lat);
    } else {
        newLat = 90 - lat;
    }

    let newLong;
    if (long < 0) {
        newLong = 180 - Math.abs(long);
    } else {
        newLong = +long + 180;
    }
    //let w = window.getComputedStyle(map);
    let x = (newLong * 1.83953) + map.offsetLeft;
    let y = (newLat * 2.71186) + map.offsetTop;
    let z = window.getComputedStyle(map);
    let windowWidth = window.innerWidth;
    if (parseInt(z.width, 10) > 900) {
        x = x + (x * 0.4) - 190;
        y = y + (y * 0.4) - 70;
    }
    if (parseInt(windowWidth, 10) > 2000) {
        x = x - 130;
    }

    cityDOM.style.top = (y + 5) + 'px';
    cityDOM.style.left = (x - 30) + 'px';
}

//creates dot at search location 
function addSearchCity(lat, long, city, isoCode) {
    //resets position
    searchCity.style.visibility = 'visible';
    searchCity.style.top = 0;
    searchCity.style.left = 0;

    
    //converts lat to positive (1 - 180)
    let newLat;
    if (lat < 0) {
        newLat = 90 + Math.abs(lat);
    } else {
        newLat = 90 - lat;
    }

    //converts logn to positive coord (1 - 360)
    let newLong;
    if (long < 0) {
        newLong = 180 - Math.abs(long);
    } else {
        newLong = +long + 180;
    }

    //long coord -> 1.84 ratio between map-width and geographic coords
    //376 = width of screen before map begins
    let x = (newLong * 1.83953) + map.offsetLeft;
    //lat coord -> 2.67 ratio | 171 pixels down
    let y = (newLat * 2.71186) + map.offsetTop;
    //searchDot.style.display = 'normal';

    let z = window.getComputedStyle(map);
    if (parseInt(z.width, 10) > 900) {
        x = x + (x * 0.4) - 190;
        y = y + (y * 0.4) - 70;
    }
    if (parseInt(window.innerWidth, 10) > 2000) {
        x = x - 130;
    }

    searchCity.style.top = (y + 5) + 'px';
    searchCity.style.left = (x - 30) + 'px';
    searchCity.innerHTML = `${city}, ${isoCode}`;
}

function showRightBar() {
    if (rightBar.innerHTML === '') {
        const isoArray = Object.entries(isoCountries);
        rightBar.innerHTML = isoArray.map(item => `
        <div class="iso-row">
            <p>${item[1]} = ${item[0]}</p>
        </div>
        `).join('');
        rightBar.style.overflow = 'scroll';
        rightBar.style.overflowX = 'hidden';
        rightBar.style.visibility = 'visible';
    } else {
        rightBar.innerHTML = '';
        rightBar.style.visibility = 'hidden';
        rightBar.style.overflow = 'hidden';
    }
    
}


//converts epoch time to Greenwich Mean Time
function convertTime(time) {
    let date = new Date(time * 1000);
    return date.toString();
}

function convertTimeFormat(time) {
    let date = new Date(time * 1000);
    let result = "";
    result = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    return result;
}

//converts Kelvins to Celsius
function convertCel(time) {
    return (time - 273.15).toFixed(0);
}
//converts Kelvin to Fahrenheit
function convertFah(time) {
    return ((time - 273.15) * (9/5) + 32).toFixed(0);
}

submit.addEventListener('submit', searchLocation);
map.addEventListener('click', selectDot);
toggle.addEventListener('click', () => {
    leftBar.classList.toggle('translate')
    if (leftBar.classList.contains('translate')) {
        toggle.style.color = '#fff';
    } else {
        toggle.style.color = '#0BBDD1';
    }
});
map.addEventListener('click', function(e) {
    let xpos = e.clientX;
    let ypos = e.clientY;
});
random.addEventListener('click', getRandomLocation);
toggle2.addEventListener('click', showRightBar);
