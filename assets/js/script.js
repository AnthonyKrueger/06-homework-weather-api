// Make variables for elements

var searchInput = $("#city")
var weatherInfoDiv = $(".weatherInfo")
var forecastDiv = $(".forecast")
var searchButton = $(".searchButton")
var searchResults = $(".searchResults")
var recentSearches = $('.recentSearches')

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
        var nameDateRow = $("<div>").addClass("row deep-orange lighten-4")
        var nameDateEl = $('<h4>').text(`${cityName} - ${nameDate}`).addClass('col s-10')
        var iconDiv = $('<div>').addClass('col s2')
        var weatherIcon = $('<img>').attr("src", `http://openweathermap.org/img/wn/${iconCode}@2x.png`).addClass('responsive-img')
        iconDiv.append(weatherIcon)
        nameDateRow.append(iconDiv)
        nameDateRow.append(nameDateEl)
        weatherInfoDiv.append(nameDateRow)

        var tempDiv = $('<div>').addClass('row')
        var temp = Math.round(response.current.temp)
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
        var title = $("<span>").addClass("card-title blue lighten-3").text(dateString)
        var temp = Math.round(data.daily[i].temp.day);
        var wind = data.daily[i].wind_speed
        var humidity = data.daily[i].humidity
        var weatherIconCode = data.daily[i].weather[0].icon
        var weatherIcon = $('<img>').attr("src", `http://openweathermap.org/img/wn/${weatherIconCode}@2x.png`).addClass('responsive-img')
        var tempEl = $("<p>").text(`Temp: ${temp}° F`)
        var windEl = $("<p>").text(`Wind: ${wind}MPH`)
        var humidityEl = $("<p>").text(`Humidity: ${humidity}%`)
        var contentDiv = $("<div>").addClass("card-content")
        var containerDiv = $("<div>").addClass("col s12 m4 l2")
        var weatherCard = $("<div>").addClass("card deep-orange lighten-4")

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
        if(response[0] != undefined) {
            var lat = response[0].lat
            var lon = response[0].lon
            cityName = response[0].name
            populateData(lat, lon)
            var recentSearches = JSON.parse(localStorage.getItem('recent'))
            if(recentSearches != undefined) {
                if(recentSearches.includes(searchText) == false) {
                    addToRecentSearches();
                    refreshRecentSearches();
                }
            }
            else {
                addToRecentSearches();
                refreshRecentSearches();
            }
        }
        else {
            weatherInfoDiv.empty()
            forecastDiv.empty()
            var noResults = $('<h4>').addClass("col s12").text("Location Not Found!")
            weatherInfoDiv.append(noResults);
        }
        
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

// Function to add query to recent searches

function addToRecentSearches() {
    if(localStorage.getItem('recent') == null) {
        localStorage.setItem('recent', [])
        var recentSearches = []
        recentSearches.push(searchText);
        localStorage.setItem('recent', JSON.stringify(recentSearches))
    } 
    else {
        var recentSearches = JSON.parse(localStorage.getItem('recent'))
        if(recentSearches.length < 10){
            recentSearches.push(searchText)
            localStorage.setItem('recent', JSON.stringify(recentSearches))
        }
        else {
            recentSearches.shift()
            recentSearches.push(searchText)
            localStorage.setItem('recent', JSON.stringify(recentSearches))
        }
    }
}

// Function to populate recent searches list

function refreshRecentSearches() {
    recentSearches.empty()

    // var recentSearchesHeader = $('<li>').addClass('collection-header')
    // var recentSearchesHeaderText = $('<h4>').text('Recent Searches')
    // recentSearchesHeader.append(recentSearchesHeaderText)
    // recentSearches.append(recentSearchesHeader)

    var recents = JSON.parse(localStorage.getItem('recent'))
    for(i = recents.length - 1;i > -1;i--) {
        var recentItem = $('<li>').addClass('collection-item')
        var recentItemText = $('<a>').addClass('btn waves-effect red lighten-1').text(recents[i])
        recentItem.append(recentItemText)
        recentSearches.append(recentItem);
    }
    $('.collection-item').on('click', function() {
        searchText = $(this).text()
        convertCity();
    })

}

// Function to run on page initialization

function init() {
    searchButton.on('click', function() {
        searchText = searchInput.val()
        convertCity();
    })
    refreshRecentSearches();
}
init()