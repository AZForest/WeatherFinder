//Dark Sky API key: 8c5ee7a62a87ef9ec2fdc70c746dbd83
//red = #d1110b
//orange = #d1740b
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
//const formContainer = document.getElementById('form-container');
const leftBar = document.getElementById('left-bar');
const rightBar = document.getElementById('right-bar');
const searchResults = document.getElementById('search-results');
//const defaultDesc = document.getElementById('default-info');

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
    /*const skycons = new Skycons({"color": "#0BBDD1"});
    skycons.add(document.getElementById('icon1'), Skycons.CLEAR_DAY);
    skycons.add(document.getElementById('icon2'), Skycons.PARTLY_CLOUDY_DAY);
    skycons.add(document.getElementById('icon3'), Skycons.RAIN);
    skycons.play();*/

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
    console.log(city);
    if (city === 'New York') {
        city = 'New York Mills';
    }
    //console.log(city, country);
    const res = await fetch('https://raw.githubusercontent.com/lutangar/cities.json/master/cities.json');
    const data = await res.json();
    //console.log(data);
    let x = data.filter(obj => {
        return obj["name"].normalize("NFD").replace(/[\u0300-\u036f]/g, "") === city && obj["country"] === isoCode.trim();
    })
    //console.log(x);
    /*if (x.length > 1) {
        //console.log(random);
        searchResults.style.visibility = 'visible';
        searchResults.innerHTML = x.map(item => {
            `<p>lat = ${item.lat}, long = ${item.long}</p>`;
        })
        ;
    }*/
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
    //console.log(randomNum);
    //console.log(data);
    let randomCity = data[randomNum]["name"];
    let randomIso = data[randomNum]["country"];

    //console.log(randomCity, randomIso);
    cities.forEach(city => {
        city.style.background = blue;
    })

    renderData(randomCity.trim(), randomIso.trim());
}

//click dot
function selectDot(e) {
    if (e.target.classList.contains("city")) {
        let x = window.getComputedStyle(e.target);
        //console.log(x.getPropertyValue('background-color'));
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
    

    //resultHeading.innerHTML = '';
    //resultDescription.innerHTML = '';
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
        console.log(location[1].trim().toUpperCase());
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
    console.log(wordFormat.join(' '));
    let city = wordFormat.join(' ');

    //clears all dots
    cities.forEach(item => {
        item.style.background = blue;
    })
    //sets dot to red if 
    /*cities.forEach(item => {
        for (let i = 0; i < 6; i++) {
            if (item.nextElementSibling.innerHTML === `${location[0]}, ${isoCode}`) {
                item.style.background = red;
            }
        }
    })*/
    //location[0]
    renderData(city, isoCode);
}


function displayData(select) {
    //let parent = select.parentElement.classList.item(0);
    //console.log(parent);
    //let label = document.getElementById(`${parent}-label`);

    //console.log(label.innerHTML);
    const location = select.innerHTML.split(',');
    renderData(location[0], location[1].trim());
}

async function renderData(city, isoCode) {
    const result = await getCoords(city, isoCode);
    let lat = result[0];
    let long = result[1];
    addSearchCity(lat, long, city, isoCode);
    const proxy = 'https://cors-anywhere.herokuapp.com/';
    //console.log('here');
    try {
        /* let darkSky = await fetch(`${proxy}https://api.darksky.net/forecast/8c5ee7a62a87ef9ec2fdc70c746dbd83/${lat},${long}`);
        console.log(darkSky);
        const data = await darkSky.json(); */
        const openWeather = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=0ac2666dd0ae54a2d9033ee17a74d8f4`)
        console.log(openWeather);
        const data = await openWeather.json();
        console.log(data);
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
        /*<div><canvas id="icon4" width="70" height="70"><img src="images/icons/01d.png"/></canvas></div>*/
        /* resultDescription.innerHTML = `
        <h2>${city}, ${getCountry(isoCode)}</h2>
        <h4>${convertTime(data.currently.time)}</h4>
        <p id="x" class="x">x</p>
        <div class="row">
            <ul>
                <li>Lat/Long: <span>${data.latitude < 0 ? Math.abs(data.latitude).toFixed(1) + 'S' : data.latitude.toFixed(1) + 'N'}, ${data.longitude < 0 ? Math.abs(data.longitude).toFixed(1) + 'W' : data.longitude.toFixed(1) + 'E'}</span></li>
                <li>TZ: <span>${data.timezone}</span></li>
                <li>Dew Point: <span>${data.currently.dewPoint}</span></li>
                <li>Humidity: <span>${data.currently.humidity}</span></li>
                <li>Ozone: <span>${data.currently.ozone}</span></li>
            </ul>
            <ul class="first">
                <li class="temp">${data.currently.temperature.toFixed(0)}°</li>
                <li>feels like ${data.currently.apparentTemperature.toFixed(0)}°</li> 
                <li>UV Index: ${data.currently.uvIndex} of 10</li>
            </ul>
            <div class="icon-ul">
                <div><canvas id="icon4" width="70" height="70"></canvas></div>
                <p class="temp-desc">${data.currently.summary}</p>
                <p>Cloud Cover: <span>${data.currently.cloudCover}</span></p>
            </div>
            <ul>
                <li>Pressure: <span>${data.currently.pressure}</span></li>
                <li>Visibility: <span>${data.currently.visibility}</span></li>
                <li>Wind Bearing: <span>${data.currently.windBearing}</span></li>
                <li>Wind Gust: <span>${data.currently.windGust}</span></li>
                <li>Wind Speed: <span>${data.currently.windSpeed}</span></li>
            </ul>
        </div>
        `; */

        setIcons(data.weather[0].icon, document.getElementById('icon4'));
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
   
    

    //defaultDesc.style.visibility = "hidden";
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
    //console.log(windowWidth);
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
    //console.log(lat, newLat);
    

    //converts logn to positive coord (1 - 360)
    let newLong;
    if (long < 0) {
        newLong = 180 - Math.abs(long);
    } else {
        newLong = +long + 180;
    }
    //console.log(long, newLong);


    //long coord -> 1.84 ratio between map-width and geographic coords
    //376 = width of screen before map begins
    let x = (newLong * 1.83953) + map.offsetLeft;
    //console.log('x = ' + x);
    //lat coord -> 2.67 ratio | 171 pixels down
    let y = (newLat * 2.71186) + map.offsetTop;
    //console.log('y = ' + y);
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
    console.log('top = ' + y)
    searchCity.style.left = (x - 30) + 'px';
    console.log('top = ' + x)
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
    //let mili = Math.floor(epochTime/1000.0);
    //let result = mili.toString();
    //return result;

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

function setIcons(icon, iconID) {
    console.log(icon, iconID);
    const skycons = new Skycons({color: "white"});
    const currentIcon = icon.replace(/-/g, "_").toUpperCase();
    skycons.play();
    return skycons.set(iconID, Skycons[currentIcon]);
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
    console.log(xpos, ypos);
});
random.addEventListener('click', getRandomLocation);
toggle2.addEventListener('click', showRightBar);



//Country ISO Codes. Credit: maephisto GitHub
var isoCountries = {
    'AF' : 'Afghanistan',
    'AX' : 'Aland Islands',
    'AL' : 'Albania',
    'DZ' : 'Algeria',
    'AS' : 'American Samoa',
    'AD' : 'Andorra',
    'AO' : 'Angola',
    'AI' : 'Anguilla',
    'AQ' : 'Antarctica',
    'AG' : 'Antigua And Barbuda',
    'AR' : 'Argentina',
    'AM' : 'Armenia',
    'AW' : 'Aruba',
    'AU' : 'Australia',
    'AT' : 'Austria',
    'AZ' : 'Azerbaijan',
    'BS' : 'Bahamas',
    'BH' : 'Bahrain',
    'BD' : 'Bangladesh',
    'BB' : 'Barbados',
    'BY' : 'Belarus',
    'BE' : 'Belgium',
    'BZ' : 'Belize',
    'BJ' : 'Benin',
    'BM' : 'Bermuda',
    'BT' : 'Bhutan',
    'BO' : 'Bolivia',
    'BA' : 'Bosnia And Herzegovina',
    'BW' : 'Botswana',
    'BV' : 'Bouvet Island',
    'BR' : 'Brazil',
    'IO' : 'British Indian Ocean Territory',
    'BN' : 'Brunei Darussalam',
    'BG' : 'Bulgaria',
    'BF' : 'Burkina Faso',
    'BI' : 'Burundi',
    'KH' : 'Cambodia',
    'CM' : 'Cameroon',
    'CA' : 'Canada',
    'CV' : 'Cape Verde',
    'KY' : 'Cayman Islands',
    'CF' : 'Central African Republic',
    'TD' : 'Chad',
    'CL' : 'Chile',
    'CN' : 'China',
    'CX' : 'Christmas Island',
    'CC' : 'Cocos (Keeling) Islands',
    'CO' : 'Colombia',
    'KM' : 'Comoros',
    'CG' : 'Congo',
    'CD' : 'Congo, Democratic Republic',
    'CK' : 'Cook Islands',
    'CR' : 'Costa Rica',
    'CI' : 'Cote D\'Ivoire',
    'HR' : 'Croatia',
    'CU' : 'Cuba',
    'CY' : 'Cyprus',
    'CZ' : 'Czech Republic',
    'DK' : 'Denmark',
    'DJ' : 'Djibouti',
    'DM' : 'Dominica',
    'DO' : 'Dominican Republic',
    'EC' : 'Ecuador',
    'EG' : 'Egypt',
    'SV' : 'El Salvador',
    'GQ' : 'Equatorial Guinea',
    'ER' : 'Eritrea',
    'EE' : 'Estonia',
    'ET' : 'Ethiopia',
    'FK' : 'Falkland Islands (Malvinas)',
    'FO' : 'Faroe Islands',
    'FJ' : 'Fiji',
    'FI' : 'Finland',
    'FR' : 'France',
    'GF' : 'French Guiana',
    'PF' : 'French Polynesia',
    'TF' : 'French Southern Territories',
    'GA' : 'Gabon',
    'GM' : 'Gambia',
    'GE' : 'Georgia',
    'DE' : 'Germany',
    'GH' : 'Ghana',
    'GI' : 'Gibraltar',
    'GR' : 'Greece',
    'GL' : 'Greenland',
    'GD' : 'Grenada',
    'GP' : 'Guadeloupe',
    'GU' : 'Guam',
    'GT' : 'Guatemala',
    'GG' : 'Guernsey',
    'GN' : 'Guinea',
    'GW' : 'Guinea-Bissau',
    'GY' : 'Guyana',
    'HT' : 'Haiti',
    'HM' : 'Heard Island & Mcdonald Islands',
    'VA' : 'Holy See (Vatican City State)',
    'HN' : 'Honduras',
    'HK' : 'Hong Kong',
    'HU' : 'Hungary',
    'IS' : 'Iceland',
    'IN' : 'India',
    'ID' : 'Indonesia',
    'IR' : 'Iran, Islamic Republic Of',
    'IQ' : 'Iraq',
    'IE' : 'Ireland',
    'IM' : 'Isle Of Man',
    'IL' : 'Israel',
    'IT' : 'Italy',
    'JM' : 'Jamaica',
    'JP' : 'Japan',
    'JE' : 'Jersey',
    'JO' : 'Jordan',
    'KZ' : 'Kazakhstan',
    'KE' : 'Kenya',
    'KI' : 'Kiribati',
    'KR' : 'Korea',
    'KW' : 'Kuwait',
    'KG' : 'Kyrgyzstan',
    'LA' : 'Lao People\'s Democratic Republic',
    'LV' : 'Latvia',
    'LB' : 'Lebanon',
    'LS' : 'Lesotho',
    'LR' : 'Liberia',
    'LY' : 'Libyan Arab Jamahiriya',
    'LI' : 'Liechtenstein',
    'LT' : 'Lithuania',
    'LU' : 'Luxembourg',
    'MO' : 'Macao',
    'MK' : 'Macedonia',
    'MG' : 'Madagascar',
    'MW' : 'Malawi',
    'MY' : 'Malaysia',
    'MV' : 'Maldives',
    'ML' : 'Mali',
    'MT' : 'Malta',
    'MH' : 'Marshall Islands',
    'MQ' : 'Martinique',
    'MR' : 'Mauritania',
    'MU' : 'Mauritius',
    'YT' : 'Mayotte',
    'MX' : 'Mexico',
    'FM' : 'Micronesia, Federated States Of',
    'MD' : 'Moldova',
    'MC' : 'Monaco',
    'MN' : 'Mongolia',
    'ME' : 'Montenegro',
    'MS' : 'Montserrat',
    'MA' : 'Morocco',
    'MZ' : 'Mozambique',
    'MM' : 'Myanmar',
    'NA' : 'Namibia',
    'NR' : 'Nauru',
    'NP' : 'Nepal',
    'NL' : 'Netherlands',
    'AN' : 'Netherlands Antilles',
    'NC' : 'New Caledonia',
    'NZ' : 'New Zealand',
    'NI' : 'Nicaragua',
    'NE' : 'Niger',
    'NG' : 'Nigeria',
    'NU' : 'Niue',
    'NF' : 'Norfolk Island',
    'MP' : 'Northern Mariana Islands',
    'NO' : 'Norway',
    'OM' : 'Oman',
    'PK' : 'Pakistan',
    'PW' : 'Palau',
    'PS' : 'Palestinian Territory, Occupied',
    'PA' : 'Panama',
    'PG' : 'Papua New Guinea',
    'PY' : 'Paraguay',
    'PE' : 'Peru',
    'PH' : 'Philippines',
    'PN' : 'Pitcairn',
    'PL' : 'Poland',
    'PT' : 'Portugal',
    'PR' : 'Puerto Rico',
    'QA' : 'Qatar',
    'RE' : 'Reunion',
    'RO' : 'Romania',
    'RU' : 'Russian Federation',
    'RW' : 'Rwanda',
    'BL' : 'Saint Barthelemy',
    'SH' : 'Saint Helena',
    'KN' : 'Saint Kitts And Nevis',
    'LC' : 'Saint Lucia',
    'MF' : 'Saint Martin',
    'PM' : 'Saint Pierre And Miquelon',
    'VC' : 'Saint Vincent And Grenadines',
    'WS' : 'Samoa',
    'SM' : 'San Marino',
    'ST' : 'Sao Tome And Principe',
    'SA' : 'Saudi Arabia',
    'SN' : 'Senegal',
    'RS' : 'Serbia',
    'SC' : 'Seychelles',
    'SL' : 'Sierra Leone',
    'SG' : 'Singapore',
    'SK' : 'Slovakia',
    'SI' : 'Slovenia',
    'SB' : 'Solomon Islands',
    'SO' : 'Somalia',
    'ZA' : 'South Africa',
    'GS' : 'South Georgia And Sandwich Isl.',
    'ES' : 'Spain',
    'LK' : 'Sri Lanka',
    'SD' : 'Sudan',
    'SR' : 'Suriname',
    'SJ' : 'Svalbard And Jan Mayen',
    'SZ' : 'Swaziland',
    'SE' : 'Sweden',
    'CH' : 'Switzerland',
    'SY' : 'Syrian Arab Republic',
    'TW' : 'Taiwan',
    'TJ' : 'Tajikistan',
    'TZ' : 'Tanzania',
    'TH' : 'Thailand',
    'TL' : 'Timor-Leste',
    'TG' : 'Togo',
    'TK' : 'Tokelau',
    'TO' : 'Tonga',
    'TT' : 'Trinidad And Tobago',
    'TN' : 'Tunisia',
    'TR' : 'Turkey',
    'TM' : 'Turkmenistan',
    'TC' : 'Turks And Caicos Islands',
    'TV' : 'Tuvalu',
    'UG' : 'Uganda',
    'UA' : 'Ukraine',
    'AE' : 'United Arab Emirates',
    'GB' : 'United Kingdom',
    'US' : 'United States',
    'UM' : 'United States Outlying Islands',
    'UY' : 'Uruguay',
    'UZ' : 'Uzbekistan',
    'VU' : 'Vanuatu',
    'VE' : 'Venezuela',
    'VN' : 'Viet Nam',
    'VG' : 'Virgin Islands, British',
    'VI' : 'Virgin Islands, U.S.',
    'WF' : 'Wallis And Futuna',
    'EH' : 'Western Sahara',
    'YE' : 'Yemen',
    'ZM' : 'Zambia',
    'ZW' : 'Zimbabwe'
};