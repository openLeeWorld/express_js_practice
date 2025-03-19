'use strict'

var search = document.querySelector('[type=search]');
var code = document.querySelector('pre');

search.addEventListener('keyup', function(){
    var xhr = new XMLHttpRequest;
    xhr.open('GET', '/search/' + search.value, true);
    xhr.onreadystatechange = function(){
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                if (response.length === 0) {
                    code.textContent = 'No results found';
                } else {
                    code.textContent = xhr.responseText;
                }
            } else {
                code.textContent = 'Error: ' + xhr.status;
            }
        }
    };
    xhr.send();
}, false);