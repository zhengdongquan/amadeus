var domready = require('domready');
var websocketStream = require('websocket-stream');
var dnode = require('dnode');
var crypto = require('crypto');
var url = require('url');
var cheerio = require('cheerio');
var receivedDictionary;
var receivedData;
var departureflight = new Array();
var returnflight = new Array();


function hashMapToString(AssocArray) {
    var s = "";
    for (var i in AssocArray) {
        s += AssocArray[i] + ", ";
    }
    return s;
}

function md5(strin) {
    return crypto.createHash('md5').update(strin).digest('hex');
}

function getLocationFromBound(bound, boundIndex, locationType) {
    var storedDictionary = receivedDictionary;
    var elementId = bound["le"][0]["bei"];
    if (locationType == "D") {
        segmentIndex = 0;
    } else {
        if (locationType == "A") {
            segmentIndex = storedDictionary["lb"][boundIndex]["le"][elementId]["ls"].length - 1;
        }
    }

    carrierIndex = storedDictionary["lb"][boundIndex]["le"][elementId]["ls"][segmentIndex]["cai"];
    if (locationType == "D") {
        locationIndex = storedDictionary["lcr"][carrierIndex]["bli"];
    } else {
        if (locationType == "A") {
            locationIndex = storedDictionary["lcr"][carrierIndex]["eli"];
        }
    }
    return storedDictionary["ll"][locationIndex]["cin"];
}





function buildTab(tab) {
    var j = 0;
    for (var i = 0; i < tab["lr"].length; i++) {
        var requestedDate = new Array();
        for (var m = 0; m < tab["ld"].length; m++) {
            requestedDate.push(tab["ld"][m]["dd"]);
        }
        var requestedDateStr = requestedDate.join("");
        var outboundDate = tab["ld"][0]["dfd"];
        var inboundDate = new Array();
        inboundDate.push(tab["ld"][1]["dfd"]);
        buildRecommendation(tab["lr"][i], requestedDateStr, outboundDate);
    }
}



function getNumberOfTechnicalStops(boundIndex, elementId) {
    var storedDictionary = receivedDictionary;
    var nbStops = 0;
    var nbSegments = storedDictionary["lb"][boundIndex]["le"][elementId]["ls"].length;
    for (segmentIndex = 0; segmentIndex < nbSegments; segmentIndex++) {
        carrierIndex = storedDictionary["lb"][boundIndex]["le"][elementId]["ls"][segmentIndex]["cai"];
        carrier = storedDictionary["lcr"][carrierIndex];
        if (typeof carrier["lst"] != 'undefined' || typeof carrier["nos"] != 'undefined') {
            if (carrier["lst"]) {
                nbStops += carrier["lst"].length;
            } else {
                nbStops += carrier["nos"].length;
            }
        }
    }
    return nbStops;
}

function getCarrierFromElementID(boundIndex, elementId, locationType) {
    var storedDictionary = receivedDictionary;
    if (locationType == "D") {
        segmentIndex = 0;
    } else {
        if (locationType == "A") {
            segmentIndex = storedDictionary["lb"][boundIndex]["le"][elementId]["ls"].length - 1;
        }
    }
    carrierIndex = storedDictionary["lb"][boundIndex]["le"][elementId]["ls"][segmentIndex]["cai"];
    return storedDictionary["lcr"][carrierIndex];
}

function getFlightDetails(boundIndex, elementId) {

    var storedDictionary = receivedDictionary;
    i = 0;
    for (var j = 0; j < storedDictionary["lb"][boundIndex]["le"][elementId]["ls"].length; j++) {
        row = storedDictionary["lb"][boundIndex]["le"][elementId]["ls"][j];
        var carrierIndex = storedDictionary["lb"][boundIndex]["le"][elementId]["ls"][i]["cai"];
        var carrier = storedDictionary["lcr"][carrierIndex];
        var location = storedDictionary["ll"][carrier["bli"]];
        var location2 = storedDictionary["ll"][carrier["eli"]];
        console.log(location);
        console.log(location2);
        console.log(carrier);
        i++;
    }
}

function getAirlineIdByElementId(boundIndex, elementId) {
    var storedDictionary = receivedDictionary;
    element = storedDictionary["lb"][boundIndex]["le"][elementId];
    rs = new Array();
    returnedId = new Array();
    returnedId[0] = storedDictionary["lcr"][element["ls"][0]["cai"]]["si"];
    rs["AIRLINECODE"] = storedDictionary["lsu"][returnedId[0]]["c"];
    var hashCode = new Array();
    for (var m = 0; m < element["ls"].length; m++) {
        var row = element["ls"][m];
        hashCode.push(storedDictionary["lcr"][row["cai"]]["si"]);
        returnedId.push(storedDictionary["lcr"][row["cai"]]["si"]);
    }
    rs["hashCode"] = hashCode.join('');
    return rs;
}


function buildElement(element, boundIndex) {

    var storedDictionary = receivedDictionary;
    var elementId = element["bei"];


    var rs = getAirlineIdByElementId(boundIndex, elementId);
    var carrier = getCarrierFromElementID(boundIndex, elementId, "D");
    var location = storedDictionary["ll"][carrier["bli"]];

    rs["DEPARTURE"] = location["cin"];
    rs["DEPARTURE_DATE"] = carrier["bdfd"];
    rs["DEPARTURE_TIME"] = carrier["bdft"];
    rs["DURATION"] = storedDictionary["lb"][boundIndex]["le"][elementId]["fd"];

    carrier = getCarrierFromElementID(boundIndex, elementId, "A");
    location = storedDictionary["ll"][carrier["bli"]];
    rs["ARRIVAL_DATE"] = carrier["edfd"];
    rs["ARRIVAL_TIME"] = carrier["edft"];

    var nbStops = element["ls"].length - 1 + getNumberOfTechnicalStops(boundIndex, elementId);

    rs["STOPS"] = nbStops;
    rs["ELEMENTID"] = elementId;
    rs["BOUNDINDEX"] = element["er"];
    return rs;
}

function buildRecommendation(recommendation, requestedDateStr, outboundDate) {
    //console.log(recommendation);
    //console.log(requestedDateStr);
    //console.log(outboundDate);



    var i = 0;
    var srcplace = "";


    var tmphas = "";
    var tmphasary = new Array();
    for (var j = 0; j < recommendation["lb"].length; j++) {
        bound = recommendation["lb"][j];
        var dplace = getLocationFromBound(bound, i, "D");
        var aplace = getLocationFromBound(bound, i, "A");
        tmprs = new Array();
        for (var m = 0; m < bound["le"].length; m++) {
            element = bound["le"][m];
            detail = buildElement(element, i);
            detail["departuecity"] = dplace;
            detail["arrivecity"] = aplace;
            detail["fp"] = recommendation["fp"];
            detail["ri"] = recommendation["ri"];
            if (i == 0) {

                tmphas = md5(hashMapToString(detail));

                tmphasary.push(tmphas);
                departureflight.push(detail);
            }
            tmprs.push(detail);
            if (i == 1) {
                for (var n = 0; n < tmphasary.length; n++) {
                    row = tmphasary[n];
                    returnflight[row] = tmprs;
                }
            }
        }
        i++;
    }

}




function showWaitingImage() {

}

window.loadFTlist = function (formid,listcodeid){
    //var njq = cheerio.load(body);
    //var listboxid = njq('#' + listboxid).parent();
    //var boxcode =njq('#' + listboxid);
    var c = websocketStream('ws://52.33.184.12:9999');
    var options2 = {
        host: 'wftc1.e-travel.com',
        path: '/plnext/AIEA00SA00S/TravelShopperAvailability.action?LANGUAGE=US&SITE=A00SA00S&AIR_CABIN=E&TRIP_TYPE=R&TRAVELLER_TYPE_1=ADT&TRAVELLER_TYPE_2=CHD&TRAVELLER_TYPE_3=&TRAVELLER_TYPE_4=&TRAVELLER_TYPE_5=&B_ANY_TIME_1=TRUE&B_ANY_TIME_2=TRUE&B_DATE_1=201603030000&B_DATE_2=201605100000&PRODUCT_TYPE_1=STANDARD_AIR&DISTANCE_UNIT=M&B_TIME_WINDOW_1=&B_TIME_WINDOW_2=&MINUS_DATE_RANGE_1=&MINUS_DATE_RANGE_2=&PLUS_DATE_RANGE_1=&PLUS_DATE_RANGE_2=&PLTG_FROMPAGE=MPSEARCH&TRIP_FLOW=YES&B_CAL_DATE_1=&B_CAL_DATE_2=&SEARCH_PAGE=MP&AIR_MAX_CONNECTIONS=4&B_DAY=10&B_LOCATION_1=YUM&B_TIME_TO_PROCESS=ANY&E_DAY=10&E_LOCATION_1=PEK&E_TIME_TO_PROCESS=ANY&departuredateInput=03%2F03%2F2016&returndateInput=05%2F10%2F2016&FIELD_ADT_NUMBER=1&FIELD_CHD_NUMBER=0'
    };
    var d = dnode();
    d.on('remote', function (remote) {
        remote.transform(options2, function (s) {
            //  result.textContent += s;
            eval(s);
            loadData();
            for (var i = 0; i < receivedData.length; i++) {
                for (var j = 0; j < receivedData[i]["lp"].length; j++) {
                    $row1 = receivedData[i]["lp"][j]["lt"];
                    for (var m = 0; m < $row1.length; m++) {
                        buildTab($row1[m]);
                        //console.log($row1[m]["lr"]);
                    }
                }
            }
            departureflight.forEach(function(entry) {
                console.log(entry);
            });
            //console.log(departureflight);
            //console.log(returnflight);

        });
    });
    c
    .pipe(d)
    .pipe(c);

}

