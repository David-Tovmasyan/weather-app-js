let search = document.querySelector("header input[type='text']"); // search
let cityName = document.querySelector(".main .city"); // html tag
let temperature = document.querySelector(".main .temperature");
let every = document.querySelector(".every");
let timeBox = document.querySelectorAll(".every .everyTime .time");
let hoursBox = document.querySelectorAll(".everyHour .hours");
let boxNumber = 5;  // if in the future I add a setting to change boxNumbers this will be needed
let defaultCity = "Paris";  // if in the future I want to change to another or get current city this will be needed 
let feelsLike = document.querySelector(".additionalInfo .feels_like")
let pressure = document.querySelector(".additionalInfo .pressure")
let humidity = document.querySelector(".additionalInfo .humidity")
let speed = document.querySelector(".additionalInfo .wind .speed")
let tMinTemperature = document.querySelector(".connector .tomorrow .minTemperature")
let tMaxTemperature = document.querySelector(".connector .tomorrow .maxTemperature")

search.addEventListener("change", e => {
    getCurrentData(e.target.value)
    getHourlyData(e.target.value)
    search.value = "" // reseting search bar
})

navigator.geolocation.getCurrentPosition(foundLocation, noLocation);

function foundLocation(position) {
    getUserLocation(position.coords.latitude, position.coords.longitude)
}
function noLocation() {
    getCurrentData(defaultCity); //default city option
    getHourlyData(defaultCity);
}

async function getUserLocation(lat, lng) {
    let url = `https://www.mapquestapi.com/geocoding/v1/reverse?key=RmaLnBYiiXfdLd34AGJaDoVQIVKVuxGw&location=${lat},${lng}&outFormat=json&thumbMaps=false`;
    let res = await fetch(url);
    if (!res.ok) {
        getCurrentData(defaultCity); //default city option
        getHourlyData(defaultCity);
        return
    }
    let data = await res.json();
    getCurrentData(data.results[0].locations[0].adminArea5) //uxarkum enq qaxaqi anun@
    getHourlyData(data.results[0].locations[0].adminArea5)
}

async function getCurrentData(city) {
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&limit=1&appid=40b6b2db4fa1b97827a5d020cb0c8670` //current
    let res = await fetch(url);
    if (!res.ok) {
        alert("Cannot find inforamation about this place");
        location.reload();
    }
    let data = await res.json();
    setCurrentData([data.main, data.weather[0].main, data.name, countryListAlpha2[data.sys.country], data.wind.speed]) // sending required data
}

function setCurrentData(data) {
    addAdditionalInfo(data[0], data[4]);
    temperature.innerHTML = `${Math.round(data[0].temp)}<span>&#8451</span>` //Celsius
    cityName.innerHTML = `${data[2]}, ${data[3]}`
    search.placeholder = data[2];
    if (data[2] == data[3]) {   //if country name is written
        cityName.innerHTML = `${data[2]}`
    }
}

function addAdditionalInfo(data, wind) {
    feelsLike.innerHTML = `Feels Like: ${Math.round(data.feels_like)}<span>&#8451;</span>`;
    pressure.innerHTML = `Pressure: ${data.pressure}`;
    humidity.innerHTML = `Humidity: ${data.humidity}%`;
    speed.innerHTML = `Wind Speed: ${wind} m/s`;
}

async function getHourlyData(city) {
    let url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&limit=1&appid=40b6b2db4fa1b97827a5d020cb0c8670`  //3hours 

    let res = await fetch(url);
    let data = await res.json();
    setHourlyData(data.list);
}

function setHourlyData(data) {   
    tMinTemperature.innerHTML=`Min Temp: ${getTomorrowData(data)[0]}<span>&#8451</span>`;
    tMaxTemperature.innerHTML=`Max Temp: ${getTomorrowData(data)[1]}<span>&#8451</span>`;

    for (let i = 0; i < boxNumber; i++) {
        timeBox[i].innerHTML = `<div>${getOnlyTime(data[i].dt_txt)}</div>`;
    }
    for (let i = 0; i < boxNumber; i++) {  // 5 hours weather
        hoursBox[i].innerHTML = `<div>${parseInt(data[i].main.temp)}<span>&#8451</span></div>`;
    }
}

function getTomorrowData(data) {
    let TomorrowStartIndex;
    let tempInfo = [];
    let weatherInfo = [];
    let weatherType = "";
    for (let i = 1; i < data.length; i++) { // We can write 9 instead of data.length
        if (getOnlyTime(data[i].dt_txt) == "00:00") {
            TomorrowStartIndex = i;
            break;
        }
    }
    for (let i = TomorrowStartIndex; i < TomorrowStartIndex + 9; i++) {
        tempInfo.push(Math.round(data[i].main.temp));
        weatherInfo.push(data[i].weather[0].main)
    }
    console.log(weatherInfo);



    return [Math.min(...tempInfo), Math.max(...tempInfo)];
}

//zamayin code-ic vercnum a menak zam@ 
function getOnlyTime(time) {
    let fullTime = time.split(" ")[1];
    if (typeof fullTime == "string") {
        return fullTime.slice(0, fullTime.lastIndexOf(":"));
    }
    else return "None";
}

// css 

window.addEventListener("resize", changeDevice)

function changeDevice() {
    let width = window.innerWidth;
    if (width > 300) {
        every.classList.add("d-flex")
        every.classList.add("flex-row")
        every.children[0].classList.add("flex-column")
        every.children[1].classList.add("flex-column")
    }
    else {
        every.classList.remove("d-flex")
        every.classList.remove("flex-row")
        every.children[0].classList.remove("flex-column")
        every.children[1].classList.remove("flex-column")
    }
}

const countryListAlpha2 = {
    "AF": "Afghanistan",
    "AL": "Albania",
    "DZ": "Algeria",
    "AS": "American Samoa",
    "AD": "Andorra",
    "AO": "Angola",
    "AI": "Anguilla",
    "AQ": "Antarctica",
    "AG": "Antigua and Barbuda",
    "AR": "Argentina",
    "AM": "Armenia",
    "AW": "Aruba",
    "AU": "Australia",
    "AT": "Austria",
    "AZ": "Azerbaijan",
    "BS": "Bahamas ",
    "BH": "Bahrain",
    "BD": "Bangladesh",
    "BB": "Barbados",
    "BY": "Belarus",
    "BE": "Belgium",
    "BZ": "Belize",
    "BJ": "Benin",
    "BM": "Bermuda",
    "BT": "Bhutan",
    "BO": "Bolivia",
    "BQ": "Bonaire",
    "BA": "Bosnia and Herzegovina",
    "BW": "Botswana",
    "BV": "Bouvet Island",
    "BR": "Brazil",
    "IO": "British Indian Ocean Territory",
    "BN": "Brunei Darussalam",
    "BG": "Bulgaria",
    "BF": "Burkina Faso",
    "BI": "Burundi",
    "CV": "Cabo Verde",
    "KH": "Cambodia",
    "CM": "Cameroon",
    "CA": "Canada",
    "KY": "Cayman Islands",
    "CF": "Central African Republic",
    "TD": "Chad",
    "CL": "Chile",
    "CN": "China",
    "CX": "Christmas Island",
    "CC": "Cocos Islands",
    "CO": "Colombia",
    "KM": "Comoros",
    "CD": "Congo Democratic Republic",
    "CG": "Congo",
    "CK": "Cook Islands",
    "CR": "Costa Rica",
    "HR": "Croatia",
    "CU": "Cuba",
    "CW": "Curaçao",
    "CY": "Cyprus",
    "CZ": "Czechia",
    "CI": "Côte d'Ivoire",
    "DK": "Denmark",
    "DJ": "Djibouti",
    "DM": "Dominica",
    "DO": "Dominican Republic",
    "EC": "Ecuador",
    "EG": "Egypt",
    "SV": "El Salvador",
    "GQ": "Equatorial Guinea",
    "ER": "Eritrea",
    "EE": "Estonia",
    "SZ": "Eswatini",
    "ET": "Ethiopia",
    "FK": "Falkland Islands",
    "FO": "Faroe Islands",
    "FJ": "Fiji",
    "FI": "Finland",
    "FR": "France",
    "GF": "French Guiana",
    "PF": "French Polynesia",
    "TF": "French Southern Territories",
    "GA": "Gabon",
    "GM": "Gambia",
    "GE": "Georgia",
    "DE": "Germany",
    "GH": "Ghana",
    "GI": "Gibraltar",
    "GR": "Greece",
    "GL": "Greenland",
    "GD": "Grenada",
    "GP": "Guadeloupe",
    "GU": "Guam",
    "GT": "Guatemala",
    "GG": "Guernsey",
    "GN": "Guinea",
    "GW": "Guinea-Bissau",
    "GY": "Guyana",
    "HT": "Haiti",
    "HM": "Heard Island and McDonald Islands",
    "VA": "Holy See ",
    "HN": "Honduras",
    "HK": "Hong Kong",
    "HU": "Hungary",
    "IS": "Iceland",
    "IN": "India",
    "ID": "Indonesia",
    "IR": "Iran",
    "IQ": "Iraq",
    "IE": "Ireland",
    "IM": "Isle of Man",
    "IL": "Israel",
    "IT": "Italy",
    "JM": "Jamaica",
    "JP": "Japan",
    "JE": "Jersey",
    "JO": "Jordan",
    "KZ": "Kazakhstan",
    "KE": "Kenya",
    "KI": "Kiribati",
    "KP": "North Korea ",
    "KR": "South Korea ",
    "KW": "Kuwait",
    "KG": "Kyrgyzstan",
    "LA": "Lao People's Democratic Republic ",
    "LV": "Latvia",
    "LB": "Lebanon",
    "LS": "Lesotho",
    "LR": "Liberia",
    "LY": "Libya",
    "LI": "Liechtenstein",
    "LT": "Lithuania",
    "LU": "Luxembourg",
    "MO": "Macao",
    "MG": "Madagascar",
    "MW": "Malawi",
    "MY": "Malaysia",
    "MV": "Maldives",
    "ML": "Mali",
    "MT": "Malta",
    "MH": "Marshall Islands ",
    "MQ": "Martinique",
    "MR": "Mauritania",
    "MU": "Mauritius",
    "YT": "Mayotte",
    "MX": "Mexico",
    "FM": "Micronesia (Federated States of)",
    "MD": "Moldova (the Republic of)",
    "MC": "Monaco",
    "MN": "Mongolia",
    "ME": "Montenegro",
    "MS": "Montserrat",
    "MA": "Morocco",
    "MZ": "Mozambique",
    "MM": "Myanmar",
    "NA": "Namibia",
    "NR": "Nauru",
    "NP": "Nepal",
    "NL": "Netherlands ",
    "NC": "New Caledonia",
    "NZ": "New Zealand",
    "NI": "Nicaragua",
    "NE": "Niger ",
    "NG": "Nigeria",
    "NU": "Niue",
    "NF": "Norfolk Island",
    "MP": "Northern Mariana Islands ",
    "NO": "Norway",
    "OM": "Oman",
    "PK": "Pakistan",
    "PW": "Palau",
    "PS": "Palestine, State of",
    "PA": "Panama",
    "PG": "Papua New Guinea",
    "PY": "Paraguay",
    "PE": "Peru",
    "PH": "Philippines ",
    "PN": "Pitcairn",
    "PL": "Poland",
    "PT": "Portugal",
    "PR": "Puerto Rico",
    "QA": "Qatar",
    "MK": "Republic of North Macedonia",
    "RO": "Romania",
    "RU": "Russian Federation ",
    "RW": "Rwanda",
    "RE": "Réunion",
    "BL": "Saint Barthélemy",
    "SH": "Saint Helena, Ascension and Tristan da Cunha",
    "KN": "Saint Kitts and Nevis",
    "LC": "Saint Lucia",
    "MF": "Saint Martin (French part)",
    "PM": "Saint Pierre and Miquelon",
    "VC": "Saint Vincent and the Grenadines",
    "WS": "Samoa",
    "SM": "San Marino",
    "ST": "Sao Tome and Principe",
    "SA": "Saudi Arabia",
    "SN": "Senegal",
    "RS": "Serbia",
    "SC": "Seychelles",
    "SL": "Sierra Leone",
    "SG": "Singapore",
    "SX": "Sint Maarten (Dutch part)",
    "SK": "Slovakia",
    "SI": "Slovenia",
    "SB": "Solomon Islands",
    "SO": "Somalia",
    "ZA": "South Africa",
    "GS": "South Georgia and the South Sandwich Islands",
    "SS": "South Sudan",
    "ES": "Spain",
    "LK": "Sri Lanka",
    "SD": "Sudan ",
    "SR": "Suriname",
    "SJ": "Svalbard and Jan Mayen",
    "SE": "Sweden",
    "CH": "Switzerland",
    "SY": "Syrian Arab Republic",
    "TW": "Taiwan",
    "TJ": "Tajikistan",
    "TZ": "Tanzania",
    "TH": "Thailand",
    "TL": "Timor-Leste",
    "TG": "Togo",
    "TK": "Tokelau",
    "TO": "Tonga",
    "TT": "Trinidad and Tobago",
    "TN": "Tunisia",
    "TR": "Turkey",
    "TM": "Turkmenistan",
    "TC": "Turks and Caicos Islands ",
    "TV": "Tuvalu",
    "UG": "Uganda",
    "UA": "Ukraine",
    "AE": "United Arab Emirates ",
    "GB": "United Kingdom",
    "UM": "United States Minor Outlying Islands ",
    "US": "United States of America ",
    "UY": "Uruguay",
    "UZ": "Uzbekistan",
    "VU": "Vanuatu",
    "VE": "Venezuela (Bolivarian Republic of)",
    "VN": "Viet Nam",
    "VG": "Virgin Islands (British)",
    "VI": "Virgin Islands (U.S.)",
    "WF": "Wallis and Futuna",
    "EH": "Western Sahara",
    "YE": "Yemen",
    "ZM": "Zambia",
    "ZW": "Zimbabwe",
    "AX": "Åland Islands"
};  // from country code to name f. e. AM=>Armenia

