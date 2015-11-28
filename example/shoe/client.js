var domready = require('domready');
var shoe = require('shoe');
var dnode = require('dnode');
function  showWaitingImage()
{
    
}
domready(function () {
    var result = document.getElementById('result');
    var stream = shoe('/dnode');

    var d = dnode();
    d.on('remote', function (remote) {
        remote.transform('beep', function (s) {
            result.textContent += s;
            eval(s);
            alert(jsonExpression);
        });
    });
    d.pipe(stream).pipe(d);
});


