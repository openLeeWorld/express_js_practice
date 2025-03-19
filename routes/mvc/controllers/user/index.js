'use strict'

/**
 * Module dependencies.
 */
try {
    var db = require('../../db');
    // console.log(db.users); 
    // console.log(db.pets);
} catch (err) {
    console.error("Error loading db.js:", err);
}


exports.engine = 'hbs';

exports.before = function(req, res, next) {
    var id = req.params.user_id;
    //console.log("Requested User ID:", id);
    if (!id) return next();
    // pretend to query a database...
    process.nextTick(function() {
        req.user = db.users[id];
        // can't find that user
        if (!req.user) return next('route');
        // found it, move on to the routes
        next();
    });
};

exports.list = function(req, res, next) {
    res.render('list', { user: db.users });
};

exports.edit = function(req, res, next) {
    res.render('edit', { user: req.user });
};

exports.show = function(req, res, next) {
    res.render('show', { user: req.user });
};

exports.update = function(req, res, next) {
    var body = req.body;
    //console.log("Received body:", req.body);  // 요청 데이터 출력
    // if (!req.user) {
    //     return next(new Error('User not found'));
    // }

    // if (!body.user || !body.user.name) {
    //     return next(new Error('Invalid user data'));
    // }

    //req.user.name = body.user.name;
    req.user.name = body['user[name]'];
    res.message('Information updated!');
    res.redirect('/mvc/user/' + req.user.id);
};
