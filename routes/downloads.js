'use strict'

/**
 * Module dependencies.
 */

var express = require('express');
var path = require('node:path');

var app = module.exports = express();

// path to where the files are stored on disk
var FILES_DIR = path.join(__dirname, 'files');

app.get('/', function(req, res){
    res.send('<ul>' + 
        '<li>Download <a href="downloads/files/notes/groceries.txt">notes/groceries.txt</a>.</li>' +
    '<li>Download <a href="downloads/files/amazing.txt">amazing.txt</a>.</li>' +
    '<li>Download <a href="downloads/files/missing.txt">missing.txt</a>.</li>' +
    '</ul>'
    )
});

/*
/files/* is accessed via req.params[0]
*/
// 파일 다운로드 라우트
app.get('/files/*', function(req, res, next) {
    var filePath = req.params[0]; // '*'는 req.params[0]에 매칭됨

    res.download(filePath, { root: FILES_DIR }, function(err) {
        if (!err) return; // 파일 정상 전송
        if (err.status !== 404) return next(err); // 404가 아닌 에러는 next(err) 호출
        // 파일이 존재하지 않을 경우
        res.status(404).send('Cant find that file');
    });
});