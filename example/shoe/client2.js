'use strict';

var websocketStream = require('websocket-stream');
var dnode = require('dnode');

var c = websocketStream('ws://52.33.184.12:9999');
var d = dnode()
    .on('remote', function(remote)
    {
        remote.test(function(msg)
        {
            alert(msg);
        });
    });

c
    .pipe(d)
    .pipe(c);