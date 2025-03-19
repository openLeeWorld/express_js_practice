'use strict'

/**
 * Module dependencies.
 */

var express = require('express');
var app = module.exports = express();
//var logger = require('morgan');
var cookieParser = require('cookie-parser');

// custom log format
//if (process.env.NODE_ENV !== 'test') app.use(logger(':method :url'));

/*
parses request cookies, populating
req.cookies and req.signedCookies
when the secret is passed, used 
for siging the cookies.
*/
app.use(cookieParser('my secret here'));

// parses x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.get('/', function(req, res){
    if (req.cookies.remember) {
        res.send('Remembered :). Click to <a href="/cookie/forget">forget</a>!.');
    } else {
        res.send('<form method="post"><p>Check to <label>'
            + '<input type="checkbox" name="remember"/> remember me</label> '
            + '<input type="submit" value="Submit"/>.</p></form>');   
    }
});

app.get('/forget', function(req, res){
    res.clearCookie('remember');
    res.redirect(req.get('Referer') || '/cookie');
    // req.get('Referer'): 이전 페이지의 url을 담고있는 http 헤더 Referer
});

app.post('/', function(req, res){
    var minute = 60000; // 1 minute

    if (req.body && req.body.remember) {
        res.cookie('remember', 1, {maxAge: minute})
    }

    res.redirect(req.get('Referer') || '/cookie');
});