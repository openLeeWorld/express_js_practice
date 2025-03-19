// working with virtual hosts

'use strict'

/**
 * Module dependencies.
 */

var express = require('express');
var vhost = require('vhost');

/*
edit /etc/hosts or C:\Windows\System32\drivers\etc\hosts:

127.0.0.1       foo.example.com
127.0.0.1       bar.example.com
127.0.0.1       example.com
*/

// Main server app

var main = express();

main.get('/', function(req, res){
    res.send('Hello from main app!')
});

main.get('/:sub', function(req, res){
    res.send('requested ' + req.params.sub);
});

// Redirect app

var redirect = express();

redirect.use(function(req, res){
    console.log(req.vhost);
    res.redirect('http://example.com:3000/' + req.vhost[0]);
}); // req.vhost[0]: 서브도메인 부분 (foo, bar 등)

// vhost app
var app = module.exports = express();

app.use(vhost('*.example.com', redirect)); // Serves all subdomains via Redirect app
app.use(vhost('example.com', main)); // Serves top level domain via Main server app
