'use strict'

var express = require('express');
var app = module.exports = express();

var cookieSession = require('cookie-session'); // 세션 데이터를 클라이언트 측 쿠키에 저장

// add req.session cookie support
app.use(cookieSession({secret: 'manny is cool '}));

// do something with the session
app.get('/', function(req, res) {
    req.session.count = (req.session.count || 0) + 1;
    res.send('viewed ' + req.session.count + ' times\n');
}) // localhost:3000/cookie_session