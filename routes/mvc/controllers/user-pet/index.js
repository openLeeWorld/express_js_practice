'use strict'

var db = require('../../db');

exports.name = 'pet';
exports.prefix = '/user/:user_id';

exports.create = function(req, res, next) {
    var id = req.params.user_id;
    var user = db.users[id];
    var body = req.body;
    //console.log("Received body:", req.body);  // 요청 데이터 출력
    if (!user) return next('route');
    var pet = { name: body['pet[name]'] };
    pet.id = db.pets.push(pet) - 1;
    user.pets.push(pet);
    res.message('Added pet ' + body['pet[name]']);
    res.redirect('/mvc/user/' + id);
};