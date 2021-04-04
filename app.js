const notifyElement = document.querySelector('.notification');
const iconElement = document.querySelector('.weatherIcon');
const temperatureValue = document.querySelector('.tempValue p');
const temperatureDescription = document.querySelector('.tempDescription p');
const locationElement = document.querySelector('.location');


//app data...
const weather = {};

weather.temperature = {
    unit : 'celsius'
};

const kelvin = 273;

const apiKey = '5e40e62091c7262710c918f5581cca39';

//set user's position...
const setPosition = (position) =>{
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    getWeather(latitude, longitude);
}

//show an error when there is an issue with the geolocation service...
const showError = (error) =>{
    notifyElement.style.display = 'block';
    notifyElement.innerHTML = `<p>${error.message}</p>`
};

//check if browser supports geolocation...
if('geolocation' in navigator){
    navigator.geolocation.getCurrentPosition(setPosition, showError);
} else{
    notifyElement.style.display = 'block';
    notifyElement.innerHTML = `<p>Browser doesn't support Geolocation</p>`;
};


//taking weather datas from the API...
const getWeather =  (latitude, longitude) => {
    let api = `api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

   fetch(api)
    .then((response) => {
        let data = response.json();
        return data; 
    })
    .then((data)=> {
        weather.temperature.value = Math.floor(data.main.temp - kelvin);
        weather.description = data.weather[0].description;
        weather.iconId = data.weather[0].icon;
        weather.city = data.name;
        weather.country = data.sys.country;
    })
    .then(()=>{
        displayWeather();
    });
};

//function displayWeather(); for displaying the weather to the user interface...
const displayWeather = () => {
    iconElement.innerHTML = `<img src="icons/${weather.iconId}.png"/>`;
    temperatureValue.innerHTML = `${weather.temperature.value}°<span>C</span>`;
    temperatureDescription.innerHTML = weather.description;
    locationElement.innerHTML = `${weather.city}, ${weather.country}`;
}


//celsius to fahrenheit conversion...
const celsiusToFahrenheit = (temperatureInCelsius) => {
    return (temperatureInCelsius * 9/5) + 32;
};


//an event listener that changes the value of temperature from celsius to fahrenheit once the user clicks on the temperature...
temperatureValue.addEventListener('click', () => {
    //check for if the temperature value is defined...
    if(weather.temperature.value === undefined) return;
    
    if(weather.temperature.unit == 'celsius'){
        let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
        fahrenheit = Math.floor(fahrenheit);

        temperatureValue.innerHTML = `${fahrenheit}°<span>F</span>`;
        weather.temperature.unit = 'fahrenheit';
    }
    else{
        temperatureValue.innerHTML = `${weather.temperature.value}°<span>C</span>`
    }
});