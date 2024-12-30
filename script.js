document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('locationInput');
    const searchInput = document.getElementById('searchInput');
    const locationElement = document.getElementById('location');
    const dateElement = document.getElementById('time');
    const timeElement = document.getElementById('AM-PM');
    const greetingElement = document.getElementById('good-day');
    const temperatureElement = document.getElementById('temperature');
    const temperatureElement2 = document.getElementById('temperature2');
    const mainDescriptionElement = document.getElementById('main-description');
    const secondaryElement = document.getElementById('description');
    const windSpeedElement = document.getElementById('wind-speed');
    const humidityElement = document.getElementById('humidity');
    const weatherIconElement = document.querySelector('.iconz');
    const feelsLikeElement = document.getElementById('feel');
    const hourlyElements = [
        { hour: document.getElementById('hour-1'), temp: document.getElementById('temp-1'), behave: document.getElementById('behave-1') },
        { hour: document.getElementById('hour-2'), temp: document.getElementById('temp-2'), behave: document.getElementById('behave-2') },
        { hour: document.getElementById('hour-3'), temp: document.getElementById('temp-3'), behave: document.getElementById('behave-3') },
        { hour: document.getElementById('hour-4'), temp: document.getElementById('temp-4'), behave: document.getElementById('behave-4') },
        { hour: document.getElementById('hour-5'), temp: document.getElementById('temp-5'), behave: document.getElementById('behave-5') },
        { hour: document.getElementById('hour-6'), temp: document.getElementById('temp-6'), behave: document.getElementById('behave-6') },
    ];

    const apiKey = 'cf0dc1a1a4da4645c7e8056ac0ac7402';

    const weatherIcons = {
        '01d': 'day/113.png',
        '01n': 'night/113.png',
        '02d': 'day/116.png',
        '02n': 'night/116.png',
        '03d': 'day/119.png',
        '03n': 'night/119.png',
        '04d': 'day/122.png',
        '04n': 'night/122.png',
        '09d': 'day/263.png',
        '09n': 'night/263.png',
        '10d': 'day/266.png',
        '10n': 'night/266.png',
        '11d': 'day/200.png',
        '11n': 'night/200.png',
        '13d': 'day/230.png',
        '13n': 'night/230.png',
        '50d': 'day/248.png',
        '50n': 'night/248.png',
    };

    const backgroundImages = {
        day: {
            clear: './Images/Days/Sunny.jpg',
            cloudy: './Images/Days/Cloudy.jpg',
            rainy: './Images/Days/raiiny.jpg',
            snowy: './Images/Days/snowy.jpg'
        },
        night: {
            clear: './Images/NIghts/Night.jpg',
            cloudy: './Images/NIghts/cloudy-night.jpg',
            rainy: './Images/NIghts/rainy.jpg',
            snowy: './Images/NIghts/snowy.jpg'
        }
    };

    async function fetchWeatherData(location) {
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`);
            const data = await response.json();
            if (response.ok) {
                updateWeatherInfo(data);
                fetchHourlyForecast(data.coord.lat, data.coord.lon);
            } else {
                console.error('Failed to fetch weather data.');
            }
        } catch (error) {
            console.error('Failed to fetch weather data.', error);
        }
    }

    async function fetchWeatherDataByCoords(lat, lon) {
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
            const data = await response.json();
            if (response.ok) {
                updateWeatherInfo(data);
                fetchHourlyForecast(lat, lon);
            } else {
                console.error('Failed to fetch weather data.');
            }
        } catch (error) {
            console.error('Failed to fetch weather data.', error);
        }
    }

    function updateWeatherInfo(data) {
        const location = data.name;
        const temperature = Math.round(data.main.temp);
        const feelsLike = Math.round(data.main.feels_like);
        const mainDescription = data.weather[0].description;
        const windSpeed = data.wind.speed;
        const humidity = data.main.humidity;
        const weatherIcon = data.weather[0].icon;

        locationElement.textContent = location;
        temperatureElement.innerHTML = `${temperature}&#176;`;
        temperatureElement2.innerHTML = `${temperature}&#176;`;
        feelsLikeElement.innerHTML = `Feel like ${feelsLike}&#176;`;
        mainDescriptionElement.textContent = mainDescription;
        secondaryElement.textContent = mainDescription;
        windSpeedElement.textContent = `${windSpeed} km/h`;
        humidityElement.textContent = `${humidity}%`;

        const iconPath = weatherIcons[weatherIcon];
        if (iconPath) {
            weatherIconElement.src = `./Images/icons/${iconPath}`;
            weatherIconElement.alt = mainDescription;
        }

        const backgroundImage = getBackgroundImage(weatherIcon);
        console.log('Background Image Path:', backgroundImage);
        document.body.style.backgroundImage = `url(${backgroundImage})`;
    }

    function getBackgroundImage(iconCode) {
        const hour = new Date().getHours();
        const isDayTime = hour > 6 && hour < 20;

        if (isDayTime) {
            if (iconCode.includes('01')) return backgroundImages.day.clear;
            if (iconCode.includes('02') || iconCode.includes('03') || iconCode.includes('04')) return backgroundImages.day.cloudy;
            if (iconCode.includes('09') || iconCode.includes('10') || iconCode.includes('11')) return backgroundImages.day.rainy;
            if (iconCode.includes('13')) return backgroundImages.day.snowy;
        } else {
            if (iconCode.includes('01')) return backgroundImages.night.clear;
            if (iconCode.includes('02') || iconCode.includes('03') || iconCode.includes('04')) return backgroundImages.night.cloudy;
            if (iconCode.includes('09') || iconCode.includes('10') || iconCode.includes('11')) return backgroundImages.night.rainy;
            if (iconCode.includes('13')) return backgroundImages.night.snowy;
        }
        return '';
    }

    function updateDate() {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateElement.textContent = now.toLocaleDateString(undefined, options);
    }

    function updateTimeAndGreeting() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
        timeElement.textContent = `${hours % 12 || 12}:${formattedMinutes} ${ampm}`;

        const greeting = hours < 12 ? 'Good Morning' : hours < 18 ? 'Good Afternoon' : 'Good Evening';
        greetingElement.textContent = greeting;
    }

    async function fetchHourlyForecast(lat, lon) {
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,daily,alerts&appid=${apiKey}&units=metric`);
            const data = await response.json();
            if (response.ok) {
                updateHourlyForecast(data.hourly);
            } else {
                console.error('Failed to fetch hourly forecast data.');
            }
        } catch (error) {
            console.error('Failed to fetch hourly forecast data.', error);
        }
    }

    function updateHourlyForecast(hourlyData) {
        const now = new Date();
        const currentHour = now.getHours();
        const nextSixHours = hourlyData.slice(1, 7);

        nextSixHours.forEach((hourData, index) => {
            const hour = (currentHour + index + 1) % 24;
            const temperature = Math.round(hourData.temp);
            const description = hourData.weather[0].description;

            hourlyElements[index].hour.textContent = `${hour}:00`;
            hourlyElements[index].temp.innerHTML = `${temperature}&#176;C`;
            hourlyElements[index].behave.textContent = description;
        });
    }

    // Ask for permission to access location on page load
    function askForLocationPermission() {
        if (navigator.permissions) {
            navigator.permissions.query({ name: 'geolocation' }).then(permissionStatus => {
                if (permissionStatus.state === 'granted') {
                    getCurrentPosition();
                } else if (permissionStatus.state === 'prompt') {
                    permissionStatus.onchange = () => {
                        if (permissionStatus.state === 'granted') {
                            getCurrentPosition();
                        }
                    };
                }
            }).catch(error => {
                console.error('Error while asking for permission:', error);
            });
        } else {
            console.error('Geolocation permissions API is not supported by this browser.');
        }
    }

    // Fetch weather data based on current position
    function getCurrentPosition() {
        navigator.geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                fetchWeatherDataByCoords(latitude, longitude);
            },
            error => {
                console.error('Failed to retrieve location:', error);
            }
        );
    }

    askForLocationPermission();
    searchForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const location = searchInput.value.trim();
        if (location) {
            await fetchWeatherData(location);
        }
    });

    updateDate();
    updateTimeAndGreeting();
    setInterval(updateTimeAndGreeting, 60000);
});