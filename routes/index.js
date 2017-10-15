var request = require('request');

const DS_APIKEY = 'cfbcd033a5bbefa108f3235c6b189cc3';
const URL = 'https://api.darksky.net/forecast/';

exports.index = function(req, res) {
  res.render('index');
}

exports.getCurrentWeather = function(req, res) {
  console.log("working ajax call " + req.body.latitude);

  var api_call = URL + DS_APIKEY + "/" + req.body.latitude + "," + req.body.longitude;

  request(api_call, function(err, response, body) {
    if(err){
      console.log('error:', error);
    } else {
      res.json(body);
    }
  });
}
