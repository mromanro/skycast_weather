var days = [
		'Sunday',
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday'
	];

var latitude = '';
var longitude = '';

$(document).ready(function() {
  insertGoogleScript();
});

function getFutureForecast(latitude, longitude) {

}

function getPastForecast(latitude, longitude, days) {

}

function dailyWeather(forecast) {
	var dailyWeather = {
		'Monday': null,
		'Tuesday': null,
		'Wednesday': null,
		'Thursday': null,
		'Friday': null,
		'Saturuday': null,
		'Sunday': null
	};

	$("#forecast").empty();

	for(var i = 0, j = forecast.daily.data.length; i < j; i++) {
		var date = new Date(forecast.daily.data[i].time * 1000);
		var day = days[date.getDay()];
		var skicons = forecast.daily.data[i].icon;
		var time = forecast.daily.data[i].time;
		var humidity = forecast.daily.data[i].humidity;
		var summary = forecast.daily.data[i].summary;
		var tempMin = Math.round(forecast.daily.data[i].temperatureMin);
		var tempMax = Math.round(forecast.daily.data[i].temperatureMax);

		$("#forecast").append(
			'<li class="shade-'+ skicons +'"><div class="card-container"><div><div class="front card"><div>' +
					"<div class='graphic'><canvas class=" + skicons + "></canvas></div>" +
					"<div><b>Day</b>: " + date.toLocaleDateString() + "</div>" +
					"<div><b>Temperature</b>: " + tempMin + "</div>" +
					"<div><b>Max Temp.</b>: " + tempMax + "</div>" +
					"<div><b>Humidity</b>: " + humidity + "</div>" +
					'<p class="summary">' + summary + '</p>' +
					'</div></div><div class="back card">' +
					'<div class="hourly' + ' ' + day + '"><b>Forecast</b><ul class="list-reset"></ul></div></div></div></div></li>'
		);
	}

	skycons();
}


function getCurrentWeather(lat, lon) {
	var data = {latitude: lat, longitude: lon};

	$.ajax({
		url: './getWeather',
		type: 'post',
		data: JSON.stringify(data),
		contentType: 'application/json; charset=utf-8',
		dataType: 'json',
		error: function(xhr, status, error) {
			console.log("something went wrong " + error);
		},
		success: function(data) {
			dailyWeather(JSON.parse(data));
			console.log("returned no error");
		}
	});
}

$('#getWeather').on('click', function(event) {
  var city = $("#city").val();

  if(latitude && longitude !== '') {
    event.preventDefault();
    getCurrentWeather(latitude, longitude);
  }
});

function skycons() {
	var icons = new Skycons({
		"color" : "black",
		"resizeCLear" : true
	});
	var list = [
		"clear-day",
		"partly-cloudy-day",
		"partly-cloudy-night",
		"cloudy",
		"rain",
		"sleet",
		"snow",
		"wind",
		"fog"
	];

	for(var i = 0; i < list.length; i++) {
		var weatherType = list[i];
		var elements = document.getElementsByClassName(weatherType);

		for(var j = 0; j < elements.length; j++) {
			icons.set(elements[j], weatherType);
		}
	}

	icons.play();
}

function insertGoogleScript() {
	var google_api = document.createElement('script'),
			api_key    = 'AIzaSyBFnBuCMQAsFLaH8-uGh7xI_Fa3JzU17fQ';

	// Inject the script for Google's API and reference the initGoogleAPI
	// function as a callback.
	google_api.src = 'https://maps.googleapis.com/maps/api/js?key='+ api_key +'&callback=initGoogleAPI&libraries=places,geometry';
	document.body.appendChild(google_api);
}

function initGoogleAPI() {
  var input = document.getElementById('city');

	var autocomplete = new google.maps.places.SearchBox(input);

	autocomplete.addListener('places_changed', function() {
		var place = autocomplete.getPlaces()[0];
		latitude = place.geometry.location.lat();
		longitude = place.geometry.location.lng();
	});
}
