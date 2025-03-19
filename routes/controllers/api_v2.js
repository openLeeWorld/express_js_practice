'use strict'

var express = require('express');

var apiv2 = express.Router();

apiv2.get('/', function(req, res) {
    res.send('Hello from apiv2 root route')
});

apiv2.get('/users', function(req, res) {
    res.send('List of apiv2 users.');
});

module.exports = apiv2;

