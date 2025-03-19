'use strict'

var db = require('../../db');
 
exports.engine = 'ejs';

exports.before = function(req, res, next) {
    var pet = db.pets[req.params.pet_id];
    if (!pet) return next('route');
    req.pet = pet;
    next();
};

exports.show = function(req, res, next) {
    res.render('show', { pet: req.pet});
};

exports.edit = function(req, res, next) {
    res.render('edit', { pet: req.pet});
};

exports.update = function(req, res, next) {
    var body = req.body;
    console.log("Received body:", req.body);  // 요청 데이터 출력

    // if (!req.pet) {
    //     return next(new Error('Pet not found'));
    // }

    // if (!body.pet || !body.pet.name) {
    //     return next(new Error('Invalid pet data'));
    // }

    //req.pet.name = body.pet.name;
    req.pet.name = body['pet[name]'];

    res.message('Information updated!');
    res.redirect('/mvc/pet/' + req.pet.id);
};
