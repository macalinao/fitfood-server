var express = require('express');
var mongoose = require('mongoose');

var clientId = 'jmPj4TUbUIw';
var secret = process.env.CLIENT_SECRET;

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost:27017/test');

var User = mongoose.model('User', new mongoose.Schema({
  name: {
    type: String,
    unique: true
  },
  code: String
}));

var app = express();

app.route('/').all(function(req, res) {
  res.send('Hello');
});

app.route('/auth/:user').get(function(req, res) {
  res.redirect(['https://jawbone.com/auth/oauth2/auth',
    '?response_type=code&client_id=' + clientId,
    '&redirect_uri=http://fitfood.herokuapp.com/oauth/' + req.params.user,
    '&scope=basic_read extended_read location_read ',
    'friends_read mood_read mood_write move_read move_write ',
    'sleep_read sleep_write meal_read meal_write weight_read ',
    'weight_write generic_event_read generic_event_write'
  ].join(''));
});

app.route('/oauth/:user').get(function(req, res) {
  var name = req.params.user;
  var code = req.query.code;
  User.findOne({
    name: name
  }).exec(function(err, doc) {
    if (!doc) {
      (new User({
        name: name,
        code: code
      })).save(function(err) {
        res.send('OK');
      });
    } else {
      res.send('EXIST');
    }
  });
});

app.route('/health/:user').get(function(req, res) {
  var user = User.findOne({
    name: req.params.user
  }).exec(function(err, doc) {
    var up = require('jawbone-up')({
      client_id: clientId,
      access_token: doc.code,
      client_secret: secret
    });
    up.events.body.get({}, function(err, data) {
      res.json(doc.code + ' ' + data);
    });
  });
});

var port = process.env.PORT || 3000;
var server = app.listen(port, function() {
  console.log('Listening on port %d', server.address().port);
});
