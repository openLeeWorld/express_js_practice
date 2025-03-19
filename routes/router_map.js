'use strict'

var escapeHtml = require('escape-html')
var express = require('express')

//var verbose = process.env.NODE_ENV !== 'test'
var verbose = false

var app = module.exports = express()

app.map = function(a, route) {
    route = route || '';
    for (var key in a) {
        switch(typeof a[key]) {
            // {'/path}': {...}
            case 'object': 
                app.map(a[key], route + key);
                break;
            // get: function(){...}
            case 'function':
                if (verbose) console.log('%s %s', key, route)
                app[key](route, a[key]);
                break;
        }
    }
}; 

var users = {
    list: function(req, res){
        res.send('user list');
    },

    get: function(req, res) {
        res.send('user: ' + escapeHtml(req.params.uid))
    },

    delete: function(req, res) {
        res.send('delete users');
    }
};

var pets = {
    list: function(req, res) {
        res.send('user ' + escapeHtml(req.params.uid) + '\'s pets');
    },

    delete: function(req, res) {
        res.send('delete ' + escapeHtml(req.params.uid) + '\'s pet ' + escapeHtml(req.params.pid));
    }
}

app.map({
    '/users': {
        get: users.list,
        delete: users.delete,
        '/:uid': {
            get: users.get,
            '/pets': {
                get: pets.list,
                '/:pid': {
                    delete: pets.delete
                }
            }
        }
    }
});

