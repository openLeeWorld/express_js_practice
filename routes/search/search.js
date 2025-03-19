'use strict'

// install redis first:
// https://redis.io/

// then:
// $ npm install redis
// $ redis-server

/**
 * Module dependencies.
 */

var express = require('express');
var path = require('node:path');
var redis = require('redis'); // redis@v4이상은 연결방법이 호환안됨

var db = redis.createClient(6379, '127.0.0.1');

// 연결 이벤트 처리
db.on('connect', function() {
    //console.log('Redis 연결 성공');
    // populate search
    // sadd: Adds one or more members to a set. Creates the key if it doesn't exist.
    db.sadd('ferret', 'tobi');
    db.sadd('ferret', 'loki');
    db.sadd('ferret', 'jane');
    db.sadd('cat', 'manny');
    db.sadd('cat', 'luna');
    //console.log('초기 데이터 추가 완료');
});

db.on('error', function(err) {
    console.error('Redis error:', err);
});

var app = module.exports = express();

app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// GET search for :query
app.get('/:query?', function(req, res, next){ // /search/:query로 요청
    var query = req.params.query || ''; // 기본값 설정
    if (!query) {
        return res.status(400).send('Query parameter is required');
    }
    db.smembers(query, function(err, vals){
        if (err) return next(err);
        res.send(vals);
    });
});

/*
GET client javascript. Here we use sendFile()
because serving __dirname with the static() middleware
would also mean serving our server "index.js" and "search.jade" template
*/

app.get('/client.js', function(req, res){
    res.sendFile(path.join(__dirname, 'client.js'));
});

/* istanbul ignore next */
if (!module.parent) {
    app.listen(3000);
    console.log('Express started on port 3000');
}