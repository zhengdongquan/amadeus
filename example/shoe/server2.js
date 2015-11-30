'use strict';

var ws = require('ws');
var websocketStream = require('websocket-stream');
var dnode = require('dnode');
var ecstatic = require('ecstatic')(__dirname + '/static');
var http = require('http');

var HTTPserver = http
    .createServer(ecstatic)
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