var http = require('http');
var shoe = require('shoe');
var ecstatic = require('ecstatic')(__dirname + '/static');
var dnode = require('dnode');

var server = http.createServer(ecstatic);
server.listen(9999);

var options = {
  host: 'sinorama.ca',
  path: '/'
};

var sock = shoe(function (stream) {
    var d = dnode({
        transform : function (s, cb) {
            //var res = s.replace(/[aeiou]{2,}/, 'oo').toUpperCase();
            //cb(res);
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
        }
    });
    d.pipe(stream).pipe(d);
});
sock.install(server, '/dnode');
