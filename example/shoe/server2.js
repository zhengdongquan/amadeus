'use strict';

var ws = require('ws');
var websocketStream = require('websocket-stream');
var dnode = require('dnode');
var http = require('http');

var HTTPserver = http
    .createServer()
    .listen(9999);

var WSserver = new ws.Server(
{
    server: HTTPserver
});

WSserver
    .on('connection', function(s)
    {
        var c = websocketStream(s);
        var d = dnode(
        {
            test: function(f)
            {
                console.log('--------');
                f('hello');
            }
        });

        c
            .pipe(d)
            .pipe(c);
    });