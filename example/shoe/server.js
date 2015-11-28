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

var options2 = {
  host: 'wftc1.e-travel.com',
  path: 'plnext/AIEA00SA00S/TravelShopperAvailability.action?LANGUAGE=US&SITE=A00SA00S&AIR_CABIN=E&TRIP_TYPE=R&TRAVELLER_TYPE_1=ADT&TRAVELLER_TYPE_2=CHD&TRAVELLER_TYPE_3=&TRAVELLER_TYPE_4=&TRAVELLER_TYPE_5=&B_ANY_TIME_1=TRUE&B_ANY_TIME_2=TRUE&B_DATE_1=201603030000&B_DATE_2=201605100000&PRODUCT_TYPE_1=STANDARD_AIR&DISTANCE_UNIT=M&B_TIME_WINDOW_1=&B_TIME_WINDOW_2=&MINUS_DATE_RANGE_1=&MINUS_DATE_RANGE_2=&PLUS_DATE_RANGE_1=&PLUS_DATE_RANGE_2=&PLTG_FROMPAGE=MPSEARCH&TRIP_FLOW=YES&B_CAL_DATE_1=&B_CAL_DATE_2=&SEARCH_PAGE=MP&AIR_MAX_CONNECTIONS=4&B_DAY=10&B_LOCATION_1=YUM&B_TIME_TO_PROCESS=ANY&E_DAY=10&E_LOCATION_1=PEK&E_TIME_TO_PROCESS=ANY&departuredateInput=03%2F03%2F2016&returndateInput=05%2F10%2F2016&FIELD_ADT_NUMBER=1&FIELD_CHD_NUMBER=0'
};


var sock = shoe(function (stream) {
    var d = dnode({
        transform : function (s, cb) {

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
