'use strict'

var express = require('express');
var path = require('node:path');
var session = require('express-session');
var methodOverride = require('method-override'); // form에서 put, delete 등 메서드 추가 
var app = module.exports = express();

/*
set out default template engine to "ejs" 
which prevents the need for using file extensions
*/
app.set('view engine', 'ejs');

// set views for error and 404 pages 
app.set('views', path.join(__dirname, 'views'));

/*
define a custom res.message() method
which stores messages in the session
*/
app.response.message = function(msg){
    //reference `req.session` via the `this.req` reference
    var sess = this.req.session;
    // simply add the msg to an array for later
    sess.messages = sess.messages || [];
    sess.messages.push(msg);
    return this;
};

// serve static files
//app.use(express.static(path.join(__dirname, 'public')));

// session support 
app.use(session({
    resave: false, // don't save session if unmodified 
    saveUninitialized: false, // don't create session until somthing stored
    secret: 'some secret here'
}));

// parse request bodies (req.body)
app.use(express.urlencoded({extended: true}));
app.use(express.json());
// allow overriding methids in query (?_method=put)
app.use(methodOverride('_method'));

// explore the "messages" local variable when views are rendered
app.use(function(req, res, next){
    //console.log(req.session);

    var msgs = req.session.messages || [];

    // expose "messages" local variable
    res.locals.messages = msgs;

    // expose "hasMessages" (true/false)
    res.locals.hasMessages = !! msgs.length; // !!는 불리언 값으로 변환하는 연산자

    /* This is equivalent:
        res.locals({
            messages: msgs,
            hasMessages: !! msgs.length
        });
    */

    next();
    // empty of "flush" the messages so they
    // don't build up
    req.session.messages = [];
});

// local controllers
try {
    require('./lib/boot')(app, { verbose: false }); // true로 변경 가능
} catch (err) {
    console.error("Error loading boot.js:", err);
}

app.use(function(err, req, res, next){
    // log it
    console.error(err.stack);

    // error page
    res.status(500).render('5xx');
});

// assume 404 since no middleware responded
app.use(function(req, res, next){
    res.status(404).render('404', { url: req.originalUrl });
});




