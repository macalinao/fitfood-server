var express = require('express');

var app = express();

app.route('/').all(function(req, res) {
  res.send('Hello');
});

app.route('/auth/:user').get(function(req, res) {
  res.redirect(['https://jawbone.com/auth/oauth2/auth',
    '?response_type=code&client_id=jmPj4TUbUIw',
    '&redirect_uri=http://fitfood.herokuapp.com/oauth/' + req.params.user,
    '&scope=basic_read extended_read location_read ',
    'friends_read mood_read mood_write move_read move_write ',
    'sleep_read sleep_write meal_read meal_write weight_read ',
    'weight_write generic_event_read generic_event_write'].join(''));
});

app.route('/oauth/:user').get(function(req, res) {
  res.send(req.params.user + ' ' + req.query.code);
});

var port = process.env.PORT || 3000;
var server = app.listen(port, function() {
  console.log('Listening on port %d', server.address().port);
});
