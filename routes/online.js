'use strict'

// install redis first:
// https://redis.io/

// then:
// $ npm install redis online
// $ redis-server

/**
 * Module dependencies.
 */

var express = require('express');
var online = require('online');
var redis = require('redis');
var db = redis.createClient(6379, '127.0.0.1');

// 연결 이벤트 처리
db.on('connect', function() {
    // online 모듈 초기화
    online = online(db);
    //console.log('Redis 연결 성공');
});

//app
var app = module.exports = express();

// activity tracking, in this case using
// the UA string, you would use req.user.id etc

app.use(function(req, res, next){
    // fire-and-forget
    online.add(req.headers['user-agent']);
    next();
});

// List helper

function list(ids) {
    return '<ul>' + ids.map(function(id) {
        return '<li>' + id + '</li>';
    }).join('') + '</ul>';
}

// GET users online

app.get('/', function(req, res, next) {
    online.last(5, function(err, ids) {
        if (err) return next(err);
        res.send('<p>Users online: ' + ids.length + '</p>' + list(ids));
    });
});
