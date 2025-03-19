'use strict'

var https = require('node:https');
var path = require('node:path');
var extname = path.extname;

// Expose GithubView

module.exports = GithubView;

/*
Custom view that fetches and renders
remove github templates. You could 
render templates from a database etc.
GitHub 저장소에서 직접 파일을 가져와 
렌더링하는 커스텀 뷰(GithubView)를 생성합니다.
*/

function GithubView(name, options) {
    this.name = name; // 요청한 파일 이름 (Readme.md 등)
    options = options || {};
    this.engine = options.engines[extname(name)]; //.md 확장자의 경우, 앞서 등록한 Markdown 엔진을 사용
    /* 
    root is the app.set('views') setting, however
    in your own implementation you could ignore this
    */
   this.path = '/' + options.root + '/master/' + name;
   // this.path: 요청한 파일의 GitHub raw.githubusercontent.com 경로를 구성
}

// render view
GithubView.prototype.render = function(options, fn) {
    var self = this;
    var opts = {
        host: 'raw.githubusercontent.com',
        port: 443,
        path: this.path, //'/expressjs/express/master/Readme.md'
        method: 'GET'
    }; // https://raw.githubusercontent.com/{owner}/{repo}/{branch}/{filePath}
    /* 
    GitHub의 Raw 콘텐츠 서버(raw.githubusercontent.com)에서 
    직접 파일을 가져오는 방식입니다.
    파일 내용만 가져올 수 있음 (메타데이터 X)
    */

    https.request(opts, function(res) { 
        // GitHub에서 Markdown 파일을 가져오는 HTTP 요청을 생성 (https.request)
        var buf = '';
        res.setEncoding('utf8');
        res.on('data', function(str) {
            buf += str
        }); // 파일 내용을 buf에 저장 (res.on('data'))
        res.on('end', function() {
            self.engine(buf, options, fn);
        }); // 파일을 다 받으면 (end 이벤트), Markdown 엔진을 통해 HTML로 변환하여 렌더링
    }).end();
};
