'use strict'

// install redis first:
// https://redis.io/

// then:
// $ npm install redis
// $ redis-server

var express = require('express');
var session = require('express-session');

var app = module.exports = express();

app.use(session({
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    secret: 'keyboard cat'
}));

app.get('/', function(req, res){
    var body = '';
    if (req.session.views) {
        ++req.session.views; // req.session.views 객체에 저장
    } else {
        req.session.views = 1;
        body += '<p>First time visiting? view this page in seveal browsers :)</p>';
    }
    res.send(body + '<p>viewed <strong>' + req.session.views + '</strong> times.</p>');
});