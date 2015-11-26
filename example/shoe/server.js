var http = require('http');
var shoe = require('shoe');
var ecstatic = require('ecstatic')(__dirname + '/static');
var dnode = require('dnode');

var async= require('async');

var server = http.createServer(ecstatic);
server.listen(9999);

var options = {
  host: 'sinorama.ca',
  path: '/'
};

var sock = shoe(function (stream) {
    var d = dnode({
        transform : function (s, cb) {
            






            async.parallel([
        //Load user
        function(callback) {
            http.request(options, function(response){
                var str = '';

                //another chunk of data has been recieved, so append it to `str`
                response.on('data', function (chunk) {
                    str += chunk;
                });

                //the whole response has been recieved, so we just print it out here
                response.on('end', function () {
                    cb(str);
                });
            }).end();
        },
        //Load posts
        function(callback) {
            http.request("http://vacancesinorama.com/", function(response){
                var str = '';

                //another chunk of data has been recieved, so append it to `str`
                response.on('data', function (chunk) {
                    str += chunk;
                });

                //the whole response has been recieved, so we just print it out here
                response.on('end', function () {
                    cb(str);
                });
            }).end();
        }
    ], function(err) { //This function gets called after the two tasks have called their "task callbacks"
        if (err) return next(err); //If an error occured, we let express/connect handle it by calling the "next" function
        //Here locals will be populated with 'user' and 'posts'
        cb("do some thing wrong.");
    });




















            
        }
    });
    d.pipe(stream).pipe(d);
});
sock.install(server, '/dnode');
