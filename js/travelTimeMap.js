
function haversine(fromCoords, toCoords) {
    Number.prototype.toRad = function() {
        return this * Math.PI / 180;
    };

    var lat2 = fromCoords[0]; 
    var lon2 = fromCoords[1]; 
    var lat1 = toCoords[0]; 
    var lon1 = toCoords[1]; 

    var R = 6371; // km 
    //has a problem with the .toRad() method below.
    var x1 = lat2-lat1;
    var dLat = x1.toRad();  
    var x2 = lon2-lon1;
    var dLon = x2.toRad();  
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
        Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);  
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; 

    return d;
}

Number.prototype.toHHMMSS = function () {
    var sec_num = this;
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    //if (hours   < 10) {hours   = "0"+hours;}
    //if (minutes < 10) {minutes = "0"+minutes;}

    var time    = hours+' h '+minutes + " m";

    return time;
};

function loadClickableTravelTimeMap(startCoords, imageBounds, imageUrl) {
    var map;
    var i;

    function initmap() {
        // set up the map
        map = new L.Map('map');

        // create the tile layer with correct attribution
        var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        var osmAttrib='Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
        var osm = new L.TileLayer(osmUrl, {minZoom: 2, maxZoom: 12, attribution: osmAttrib});

        // start the map in South-E     ast England
        map.setView(new L.LatLng(startCoords[0], startCoords[1]),5);
        map.addLayer(osm);

        return map;
    }


    map = initmap();

    lowerLeft = proj4('EPSG:4326', 'EPSG:3785').forward([imageBounds[0][1], imageBounds[0][0]]);
    upperRight = proj4('EPSG:4326', 'EPSG:3785').forward([imageBounds[1][1], imageBounds[1][0]]);

    var imgWidth = upperRight[0] - lowerLeft[0];
    var imgHeight = upperRight[1] - lowerLeft[1];

    var overlay = L.imageOverlay(imageUrl, imageBounds, {"opacity": 0.85}).addTo(map);
    var marker;

    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    var imageObj = new Image();

    imageObj.onload = function() {
        canvas.width = imageObj.width;
        canvas.height = imageObj.height;
        context.drawImage(imageObj, 0, 0, imageObj.width, imageObj.height);
    };


    imageObj.src = imageUrl;

    function rinterpolateColor(color) {
        // Reverse interpolate a color from the "Blues" color scale
        colorScale = {'blue': [[0.0, 1.0, 1.0], [0.125, 0.9686274528503418,
            0.9686274528503418], [0.25, 0.93725490570068359, 0.93725490570068359],
            [0.375, 0.88235294818878174, 0.88235294818878174], [0.5,
                0.83921569585800171, 0.83921569585800171], [0.625, 0.7764706015586853,
                0.7764706015586853], [0.75, 0.70980393886566162, 0.70980393886566162],
                [0.875, 0.61176472902297974, 0.61176472902297974], [1.0,
                    0.41960784792900085, 0.41960784792900085]],

                    'green': [[0.0, 0.9843137264251709, 0.9843137264251709], [0.125,
                        0.92156863212585449, 0.92156863212585449], [0.25,
                        0.85882353782653809, 0.85882353782653809], [0.375,
                        0.7921568751335144, 0.7921568751335144], [0.5,
                        0.68235296010971069, 0.68235296010971069], [0.625,
                        0.57254904508590698, 0.57254904508590698], [0.75,
                        0.44313725829124451, 0.44313725829124451], [0.875,
                        0.31764706969261169, 0.31764706969261169], [1.0,
                        0.18823529779911041, 0.18823529779911041]],

                        'red': [[0.0, 0.9686274528503418, 0.9686274528503418], [0.125,
                            0.87058824300765991, 0.87058824300765991], [0.25,
                            0.7764706015586853, 0.7764706015586853], [0.375,
                            0.61960786581039429, 0.61960786581039429], [0.5,
                            0.41960784792900085, 0.41960784792900085], [0.625,
                            0.25882354378700256, 0.25882354378700256], [0.75,
                            0.12941177189350128, 0.12941177189350128], [0.875,
                            0.031372550874948502, 0.031372550874948502], [1.0,
                            0.031372550874948502, 0.031372550874948502]]};

                            var closestValues = [];

                            for (var prop in colorScale) {
                                vals = colorScale[prop];

                                if (prop == "red")
                                    ix = 0;
                                else if (prop == "green")
                                    ix = 1;
                                else if (prop == "blue")
                                    ix = 2;
                                else {
                                    continue;
                                }
                                var scaledColor = color[ix] / 255;

                                for (var i = 0; i < vals.length-1; i++) {
                                    if ((colorScale[prop][i][2] < scaledColor && scaledColor < colorScale[prop][i+1][1]) || (colorScale[prop][i][2] > scaledColor && scaledColor > colorScale[prop][i+1][1])) {
                                        var frac = (scaledColor - colorScale[prop][i][2]) / (colorScale[prop][i+1][1] - colorScale[prop][i][2]);
                                        var interpValue = colorScale[prop][i][0] + frac * (colorScale[prop][i+1][0] - colorScale[prop][i][0]);

                                        closestValues.push(interpValue);
                                    }
                                }
                            }

                            if (closestValues.length === 0) {
                                throw "Couldn't interpolate a value" ;
                            }

                            var sum = 0;
                            var j;
                            for (j = 0; j < closestValues.length; j++)
                            sum += closestValues[j];

                            return sum / closestValues.length;
    }



    function onMapClick(e) {

        // transforming point coordinates
        p = proj4('EPSG:4326', 'EPSG:3785').forward([e.latlng.lng, e.latlng.lat]);

        var xRatio = (p[0] - lowerLeft[0]) / imgWidth;
        var yRatio = (p[1] - lowerLeft[1]) / imgHeight;

        var xPos = imageObj.width * xRatio;
        var yPos = imageObj.height * yRatio;

        if (xRatio < 0 || yRatio < 0 || xRatio > 1 || yRatio > 1)
            return;

        var x = xPos;
        var y = canvas.height - yPos;

        var pixelData = context.getImageData(x, y, 1, 1);
        var inputRange = [pixelData.data[0], pixelData.data[1], pixelData.data[2]];

        try {
            var minTime = 3.0;
            var maxTime = 9.5;
            var avgTime = rinterpolateColor(inputRange);
            var realTime = minTime + (maxTime - minTime) * (1 - avgTime);
            var popup = L.popup()
            .setLatLng(e.latlng)
            .setContent("Latitude, Longitude: " + e.latlng.lat.toFixed(1) + ", " + e.latlng.lng.toFixed(1) + "<br>Distance: " + haversine([e.latlng.lat, e.latlng.lng], startCoords).toFixed(1) + " km<br>Estimated travel time: " + (60 * Math.exp(realTime)).toHHMMSS())
            .openOn(map);
        } catch (err) {

        }
    }

    map.on('click', onMapClick);
}
