'use strict'

// install redis first:
// https://redis.io/

// then:
// $ npm install redis
// $ redis-server

var express = require('express');
var session = require('express-session');

var app = module.exports = express();

// pass the express to the connect redis module
// allowing it to inherit from session.Store
// connect-redis는 Express의 세션 데이터를 Redis에 저장하고 
// 관리할 수 있도록 해주는 미들웨어입니다.
var RedisStore = require('connect-redis')(session); // v3이하 에서만 함수 호출 방식 가능능
// redis v4이상 모듈에서는 api가 다르므로 공식 문서 참조

// populates req.session
app.use(session({
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    secret: 'keyboard cat',
    store: new RedisStore({ ttl: 3600 }) //1시간
})); // req.session 데이터는 Redis에 JSON 문자열 형태로 저장됨

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

/* REDIS
키 형식: sess:<sessionID>
값 형식: { "cookie": {...}, "user": {...} }
TTL을 설정하면 자동으로 만료 및 삭제됨
Redis CLI (KEYS, GET, TTL) 명령어로 직접 데이터 확인 가능
브라우저와 서버가 같은 세션임을 인식하는 핵심 요소는 
세션 쿠키(session cookie) 입니다.
이 세션 ID는 쿠키에 저장되며, 브라우저가 자동으로 이후 요청마다 전송
ex) Set-Cookie: connect.sid=s%3Aabc123xyz.GXrD1...; Path=/; HttpOnly
ex) Redis에 저장된 데이터
Key: sess:abc123xyz
Value: { "cookie": { ... }, "user": { "id": 123, "name": "Alice" } }
express-session은 요청의 쿠키에서 세션 ID를 가져와 Redis에서 데이터를 조회합니다.
Redis에서 세션 데이터를 찾으면, 
기존 req.session을 복원하여 사용자가 로그인이 유지됩니다.
사용자가 로그아웃하거나 브라우저 쿠키를 삭제하면, 새로운 세션이 생성됨.
Express.js에서 로그아웃하면 기존 세션이 없어지는 원리
Express에서 사용자가 로그아웃하면, 기존 세션 데이터를 삭제해야 합니다. 
이를 수행하는 방법은 크게 두 가지입니다.
1. req.session.destroy() 사용 → Redis에서 세션 데이터 삭제
2. 세션 쿠키 삭제 (res.clearCookie()) → 클라이언트에서 세션 정보 제거
express-session에서 secret 값이 변경되면 기존 세션이 무효화됨.
*/

