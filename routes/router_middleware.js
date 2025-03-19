'use strict'

var express = require('express');

var app = module.exports = express();

/*
Example requests
curl http://localhost:3000/router_middleware/user/0
curl http://localhost:3000/router_middleware/user/0/edit
curl http://localhost:3000/router_middleware/user/1
curl http://localhost:3000/router_middleware/user/1/edit (unauthorized since this is not you)
curl -X DELETE http://localhost:3000/router_middleware/user/0 (unauthorized since you are not an admin)
*/

//Dummy users
var users = [
    {id: 0, name: 'tj', email:'tj@vision-media.ca', role: 'member'}
    , { id: 1, name: 'ciaran', email: 'ciaranj@gmail.com', role: 'member'}
    , { id: 2, namn: 'aaron', email: 'aaron.heckman+github@gmail.com', role: 'admin'}
];

function loadUser(req, res, next) {
    // you would fetch your user from the db
    var user = users[req.params.id];
    if (user) {
        req.user = user;
        next();
    } else {
        next(new Error('Failed to load user ' + req.params.id));
    }
}

function andRestrictToSelf(req, res, next) {
    // If our authenticated user is the user we are viewing
    // then everything is fine
    if (req.authenticatedUser.id === req.user.id) {
        next();
    } else {
        // you may want to implement specific exceptions
        // such as UnauthorizedError or similar so that you 
        // can handle these can be special-cased in an error handler
        // (view ./examples/pages for this)
        next(new Error('Unauthorized'));
    }
}

function andRestrictTo(role) {
    return function(req, res, next) {
        if (req.authenticatedUser.role === role) {
            next();
        } else {
            next(new Error('Unauthorized'));
        }
    }
}

/* 
Middleware for faux authentication
how an authenticated user 
may interact with middleware?
*/

app.use(function(req, res, next){
    req.authenticatedUser = users[0];
    next();
})

app.get('/', function(req, res){
    res.redirect('/user/0');
});

app.get('/user/:id', loadUser, function(req, res){
    res.send('Viewing user ' + req.user.name);
});

app.get('/user/:id/edit', loadUser, andRestrictToSelf, function(req, res){
    res.send('Editing user ' + req.user.name);
});

app.delete('/user/:id', loadUser, andRestrictTo('admin'), function(req, res){
    res.send('Deleted user ' + req.user.name);
});