'use strict'

/**
 * Module dependencies.
 */

var express = require('express');
var hash = require('pbkdf2-password')()
var path = require('node:path');
var session = require('express-session');

var app = module.exports = express();

// config

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// middleware
app.use(express.urlencoded({ extended: true }));
/*이 미들웨어는 URL-encoded 데이터를 파싱하는 역할을 합니다. 
즉, application/x-www-form-urlencoded 형식으로 전송된 
HTTP 요청의 **본문(body)**을 해석하여 req.body 객체로 변환
extended: true는
qs (Query String) 라이브러리를 사용하여 데이터를 파싱
중첩된 객체도 제대로 변환 가능
*/
app.use(session({
    resave: false, // don' save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    secret: 'shhhh, very secret' // encrypt session id
}));

// Session-persisted message middleware
app.use(function(req, res, next) {
    var err = req.session.error;
    var msg = req.session.success;
    delete req.session.error;
    delete req.session.success;
    res.locals.message = '';
    if (err) res.locals.message = '<p class="msg error">' + err + '</p>';
    if (msg) res.locals.message = '<p class="msg success">' + msg + '</p>';
    next();
});

//dummy database
var users = {
    tj: { name: 'tj' }
};

// when you create a user, generate a salt
// and hash the password ('foobar' is the pass here)
hash({ password: 'foobar'}, function(err, pass, salt, hash) {
    if (err) throw err;
    // store the salt & hash in the "db"
    users.tj.salt = salt;
    users.tj.hash = hash;
});

// Authenticate using our plain-object database of doom!
function authenticate(name, pass, fn) {
    console.log('authenticating %s:%s', name, pass);
    var user = users[name];
    //query the db for the given username
    if (!user) return fn(null, null);
    /*
    apply the same algorithm to the POSTed password, applying 
    the hash against the pass / salt, if there is a match we 
    found the user
    */
   hash({ password: pass, salt: user.salt }, function(err, pass, salt, hash) {
        if (err) return fn(err);
        if (hash === user.hash) return fn(null, user);
        fn(null, null);
    });
}

function restrict(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        req.session.error = 'Access denied!';
        res.redirect('/auth/login');
    }
}

app.get('/', function(req, res) {
    res.redirect('/auth/login');
});

app.get('/restricted', restrict, function(req, res) {
    res.send('Wahoo! restricted area, click to <a href="/auth/logout">logout</a>');
});

app.get('/logout', function(req, res) {
    //destroy the user's session to log them out
    //will be re-created next request
    req.session.destroy(function(){
        res.redirect('/auth/login');
    });
});

app.get('/login', function(req, res){
    res.render('login');
});

app.post('/login', function(req, res, next) {
    if (!req.body) return res.sendStatus(400); // bad request
    authenticate(req.body.username, req.body.password, function(err, user) {
        if (err) return next(err);
        if (user) {
            // Regenerate session when signing in
            // to prevent fixation
            req.session.regenerate(function(){
                /*
                Store the user's primary key 
                in the session store to be retrieved, 
                or in this case the entire user object
                */
               req.session.user = user;
               req.session.success = 'Authenticated as ' + user.name
               + ' click to <a href="/auth/logout">logout</a>. '
               + ' You may now access <a href="/auth/restricted">/restricted</a>.';
            res.redirect(req.get('Referer') || '/');
            });
        } else {
            req.session.error = 'Authentication failed, please check your ' 
            + ' username and password.'
            + ' (use "tj" and "foobar")';
            res.redirect('/auth/login');
        }
    });
});

