var domready = require('domready');
var shoe = require('shoe');
var dnode = require('dnode');
function  showWaitingImage()
{
    
}

var receivedData;
domready(function () {
    var result = document.getElementById('result');
    var stream = shoe('/dnode');

    var d = dnode();
    d.on('remote', function (remote) {
        remote.transform('beep', function (s) {
            result.textContent += s;
            eval(s);
            loadData();
            alert(receivedData);
        });
    });
    d.pipe(stream).pipe(d);
});


