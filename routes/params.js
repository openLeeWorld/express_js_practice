'use strict'

var createError = require('http-errors');
var express = require('express');
var app = module.exports = express();

var users = [
    { name: 'tj' }
    , { name: 'tobi' }
    , { name: 'loki' }
    , { name: 'jane' }
    , { name: 'bandit' }
];

// Convert :to and :from to integers

app.param(['to', 'from'], function(req, res, next, num, name){
    req.params[name] = parseInt(num, 10);
    if (isNaN(req.params[name])) {
        next(createError(400, 'failed to parseInt ' + num));
    } else {
        next();
    }
});

// load user by id

app.param('user', function(req, res, next, id) {
    req.user = users[id];
    if (req.user) {
        next();
    } else {
        next(createError(404, 'failed to find user'));
    }
});

app.get('/', function(req, res){
    res.send('Visit /user/0 or /users/0-2');
});

app.get('/user/:user', function(req, res){
    res.send('user ' + req.user.name);
});

app.get('/users/:from-:to', function(req, res){
    var from = req.params.from;
    var to = req.params.to;
    var names = users.map(function(user){ return user.name });
    res.send('users ' + names.slice(from, to + 1).join(', '));
})