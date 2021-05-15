// Make variables for elements

var searchInput = $("#city")
var weatherInfoDiv = $(".weatherInfo")
var forecastDiv = $(".forecast")
var searchButton = $(".searchButton")
var searchResults = $(".searchResults")

// Global variable for search latitude and longitude

var cityName;
var searchText;

// Create function to populate data in search results

function populateData(searchLat, searchLon) {
    weatherInfoDiv.empty()
    forecastDiv.empty()
    var searchUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${searchLat}&lon=${searchLon}&exclude=hourly&units=imperial&appid=40c43c9b382e01cc48d70ce7ed8b8c5a`
    $.ajax({
        url:searchUrl,
        method:"GET",
    }).then(function(response) {
        var locationInfo = response
        var timeCode = response.current.dt
        console.log(response)

        var nameDate = convertTime(timeCode)
        var iconCode = response.current.weather[0].icon
        var nameDateRow = $("<div>").addClass("row")
        var nameDateEl = $('<h4>').text(`${cityName} - ${nameDate}`).addClass('col s-10')
        var iconDiv = $('<div>').addClass('col s-2')
        var weatherIcon = $('<img>').attr("src", `http://openweathermap.org/img/wn/${iconCode}@2x.png`).addClass('responsive-img')
        iconDiv.append(weatherIcon)
        nameDateRow.append(iconDiv)
        nameDateRow.append(nameDateEl)
        weatherInfoDiv.append(nameDateRow)

        var tempDiv = $('<div>').addClass('row')
        var temp = response.current.temp
        var tempEl = $('<lead>').text(`Temp: ${temp}° F`)
        tempDiv.append(tempEl)
        weatherInfoDiv.append(tempDiv)

        var windDiv = $('<div>').addClass('row')
        var wind = response.current.wind_speed
        var windEl = $('<lead>').text(`Wind: ${wind}MPH`)
        windDiv.append(windEl)
        weatherInfoDiv.append(windDiv)

        var humidityDiv = $('<div>').addClass('row')
        var humidity = response.current.humidity
        var humidityEl = $('<lead>').text(`Humidity: ${humidity}%`)
        humidityDiv.append(humidityEl)
        weatherInfoDiv.append(humidityDiv)

        var uvDiv = $('<div>').addClass('row')
        var uv = response.current.uvi
        var uvEl = $('<lead>').text(`UV Index:  `)
        var uvNumEl = $("<a>").text(uv).addClass('btn')
        if(uv < 3) {
            uvNumEl.addClass('green')
        }
        else if(uv < 6) {
            uvNumEl.addClass('yellow')
        }
        else {
            uvNumEl.addClass('red')
        }
        uvDiv.append(uvEl)
        uvDiv.append(uvNumEl)
        weatherInfoDiv.append(uvDiv)

        var fiveDayTitle = $("<h4>").text("5 Day Forecast:")
        var fiveDayTitleEl = $("<div>").addClass("row")
        fiveDayTitleEl.append(fiveDayTitle)
        forecastDiv.append(fiveDayTitleEl)

        populateForecast(locationInfo)

    })
}

// Create function for making forecast elements

function populateForecast(data) {
    for(i = 1;i < 6;i++) {
        var dateCode = data.daily[i].dt
        var dateString = convertTime(dateCode)
        console.log(dateString)
        var title = $("<span>").addClass("card-title orange lighten-2").text(dateString)
        var temp = data.daily[i].temp.day
        var wind = data.daily[i].wind_speed
        var humidity = data.daily[i].humidity
        var weatherIconCode = data.daily[i].weather[0].icon
        var weatherIcon = $('<img>').attr("src", `http://openweathermap.org/img/wn/${weatherIconCode}@2x.png`).addClass('responsive-img')
        var tempEl = $("<p>").text(`Temp: ${temp}° F`)
        var windEl = $("<p>").text(`Wind: ${wind}MPH`)
        var humidityEl = $("<p>").text(`Humidity: ${humidity}%`)
        var contentDiv = $("<div>").addClass("card-content")
        var containerDiv = $("<div>").addClass("col s-2")
        var weatherCard = $("<div>").addClass("card blue lighten-2")
        contentDiv.append(title)
        contentDiv.append(weatherIcon)
        contentDiv.append(tempEl)
        contentDiv.append(windEl)
        contentDiv.append(humidityEl)
        weatherCard.append(contentDiv)
        containerDiv.append(weatherCard)
        forecastDiv.append(containerDiv)
        }

}

// Create function to convert search text to latitude longitude coordinates

function convertCity() {
    var searchUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${searchText}&limit=1&appid=40c43c9b382e01cc48d70ce7ed8b8c5a`
    $.ajax({
        url:searchUrl,
        method:"GET",
    }).then(function(response) {
        var lat = response[0].lat
        var lon = response[0].lon
        cityName = response[0].name
        populateData(lat, lon)
        
    })
}


// Create function to convert unix code to date format

function convertTime(timeCode) {
    var date = new Date(timeCode * 1000)
    var day = date.getDate()
    var month = date.getMonth() + 1
    var year = date.getFullYear()
    var dateString = (`${month}/${day}/${year}`);
    return dateString;
}

// Function to run on page initialization

function init() {
    searchButton.on('click', function() {
        searchText = searchInput.val()
        convertCity();
    })
}
init()