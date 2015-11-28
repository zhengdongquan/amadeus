var domready = require('domready');
var shoe = require('shoe');
var dnode = require('dnode');
function  showWaitingImage()
{
    
}
var receivedDictionary;
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
            for (var i = 0; i < receivedData.length; i++) {
                for (var j = 0; j < receivedData[i]["lp"].length; j++) {
                    $row1 = receivedData[i]["lp"][j]["lt"];
                    for (var m = 0; m < $row1.length; m++) {
                        consolog.log($row1[m]["lr"]);
                    }
                }
            }

        });
    });
    d.pipe(stream).pipe(d);
});


