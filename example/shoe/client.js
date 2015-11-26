var domready = require('domready');
var shoe = require('shoe');
var dnode = require('dnode');

domready(function () {
    var result = document.getElementById('result');
    var stream = shoe('/dnode');

    var d = dnode.connect('52.33.184.12', 9999);
    d.on('remote', function (remote) {
        remote.transform('beep', function (s) {
            result.textContent += s;
        });
    });
    d.pipe(stream).pipe(d);
});
