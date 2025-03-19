'use strict'
// db.js
var users = [];

users.push({name: 'Tobi'});
users.push({name: 'Loki'});
users.push({name: 'Jane'});

var express = require('express');
var app = module.exports = express();

/* 
so either you can deal with different types of formatting
for expected response in index.js
*/
app.get('/', function(req,res){
    res.format({
        html: function(){
            res.send('<ul>' + users.map(function(user){
                return '<li>' + user.name + '</li>';
            }).join('') + '</ul>');
        },

        text: function() {
            res.send(users.map(function(user){
                return ' - ' + user.name + '\n';
            }).join(''));
        },

        json: function(){
            res.json(users);
        }
    });
});

/*
or you could write a tiny middleware like
this to add a layer of abstraction 
and make things a bit more declarative
*/