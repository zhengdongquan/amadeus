var domready = require('domready');
var shoe = require('shoe');
var dnode = require('dnode');
var receivedDictionary;
var receivedData;
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
    for(var i=0;i<tab["lr"].length;i++){
        var requestedDate = new Array();
        for(var m=0;m<tab["ld"].length;m++){
            requestedDate.push(tab["ld"][m]["dd"]);
        }
        var requestedDateStr = requestedDate.join("");
        var outboundDate = tab["ld"][0]["dfd"];
        var inboundDate = new Array();
        inboundDate.push(tab["ld"][1]["dfd"]);
        buildRecommendation(tab["lr"][i], requestedDateStr, outboundDate);
    }
}

function buildRecommendation(recommendation, requestedDateStr, outboundDate) {
    console.log(recommendation);
    console.log(requestedDateStr);
    console.log(outboundDate);
    /*

    $i = 0;
    $srcplace = "";


    $tmphas = "";
    $tmphasary = array();
    foreach ($recommendation["lb"] as $bound) {
        $dplace = getLocationFromBound($bound, $i, "D");
        $aplace = getLocationFromBound($bound, $i, "A");
        $tmprs = array();

        foreach ($bound["le"] as $element) {
            $detail = buildElement($element, $i);
            $detail["departuecity"] = $dplace;
            $detail["arrivecity"] = $aplace;
            $detail["fp"] = $recommendation["fp"];
            $detail["ri"] = $recommendation["ri"];
            if ($i == 0) {
                $tmphas = md5(serialize($detail));
                $tmphasary[] = $tmphas;
                $GLOBALS["departure"][$tmphas] = $detail;
            }
            $tmprs[] = $detail;
        }
        if ($i == 1) {
            foreach ($tmphasary as $row) {
                $GLOBALS["return"][$row] = $tmprs;
            }
        }
        $i++;
    }
    */
}















function  showWaitingImage()
{
    
}

domready(function () {
    var result = document.getElementById('result');
    var stream = shoe('/dnode');

    var d = dnode();
    d.on('remote', function (remote) {
        remote.transform('beep', function (s) {
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

        });
    });
    d.pipe(stream).pipe(d);
});


