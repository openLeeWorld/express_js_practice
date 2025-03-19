// rendering views dynamically
'use strict'

var express = require('express');
var GithubView = require('./github-view');
var md = require('marked').parse; 
// 마크다운(Markdown) 텍스트를 HTML로 변환해주는 Node.js 라이브러리

var app = module.exports = express();

//register .md as an engine in express view system
app.engine('md', function(str, options, fn) {
    try {
        var html = md(str);
        html = html.replace(/\{([^}]+)\}/g, function(_, name){
            return options[name] || ''; // // 템플릿 변수 치환
        }); // {변수명} 형식의 변수를 options 객체에서 찾아 치환합니다.
        fn(null, html); // 변환된 HTML을 반환
    } catch (err) {
        fn(err); // 에러 처리
    }
}); // .md 확장자를 가진 파일을 HTML로 변환하는 엔진을 추가합니다.

// pointing to a particular github repo to load files from it
app.set('views', 'expressjs/express');
//Express의 views 디렉토리를 expressjs/express(GitHub 저장소의 특정 경로)로 설정합니다.

// register a new view constructor 
app.set('view', GithubView); // custom view engine
// GithubView는 Markdown 파일을 GitHub에서 불러오는 역할을 합니다.

app.get('/', function(req, res){
    /*
    rendering a view relative to the repo.
    app.locals, res.locals, and local
    work like they normally would
    */
   res.render('examples/markdown/views/index.md', { title: 'Example'});
}); // examples/markdown/views/index.md 파일을 렌더링하여 반환합니다.

app.get('/Readme.md', function(req, res){
     // rendering a view from https://github.com/expressjs/express/blob/master/Readme.md
    res.render('Readme.md');
}); // Readme.md 파일을 GitHub 저장소에서 불러와 렌더링합니다.

/*
app.js는 Express 앱을 설정하고, GithubView를 통해 
GitHub에서 .md 파일을 가져와 렌더링하는 역할을 합니다.
github-view.js는 실제로 GitHub에서 파일을 요청하고, 
Markdown을 변환하여 응답하는 커스텀 뷰 엔진입니다.
최종적으로 사용자는 GitHub 저장소의 Readme.md를 
Markdown → HTML로 변환된 웹 페이지 형태로 볼 수 있습니다. 
*/
