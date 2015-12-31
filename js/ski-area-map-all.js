function geoBounds(feature) {
    /* Get the bounding box of a GeoJSON feature
     * and return it as a leaflet-compatible object
     *
     * For some reason d3's geo.bounds didn't seem to work
     * */
    var minLat = 90;
    var maxLat = -90;
    var minLon = 180;
    var maxLon = -180;
    for (var i = 0; i < feature.geometry.coordinates.length; i++) {
        var coords = feature.geometry.coordinates[i];
        for (var j = 0; j < coords.length; j++) {
            if (coords[j][1] < minLat)
                minLat = coords[j][1];
            if (coords[j][1] > maxLat)
                maxLat = coords[j][1];
            if (coords[j][0] < minLon)
                minLon = coords[j][0];
            if (coords[j][0] > maxLon)
                maxLon = coords[j][0];
        }
    }
    console.log('minLat:', minLat, 'minLon:', minLon);
    var newBounds = L.latLngBounds(
        L.latLng(minLat, minLon),
        L.latLng(maxLat, maxLon));

    return newBounds;
}

function haversine(lat1, lon1, lat2, lon2) {
    /*
    Calculate the haversine distance between two points on the
    globe. Code taken from:

    http://stackoverflow.com/a/14561433
   */
    Number.prototype.toRad = function() {
        return this * Math.PI / 180;
    };

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

drawSkiMap = function(divName, jsonDir) {
    //var map = L.map('isochroneMap').setView([48.2858, 6.7868], 4);
    var initialLat = 47.630119;
    var initialLon = 15.781780;


    var map = new L.Map(divName, {
        center: new L.LatLng(initialLat, initialLon),
        minZoom: 1,
        zoom: 5
    });

    var mapnikLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    });

    var mapQuestLayer = new L.TileLayer.MapQuestOpen.OSM();
    mapQuestLayer.addTo(map);

    var baseMaps = { 'MapQuest Open': mapQuestLayer,
                    'Mapnik': mapnikLayer };

    L.control.layers(baseMaps).addTo(map);

    var topPane = map._createPane('leaflet-top-pane', map.getPanes().mapPane);
    //var topLayerLines = new L.StamenTileLayer('toner-lines', {'opacity': 0.8});

    var width=550, height=300;
    //var defaultContourColor = 'transparent';

    // Initialize the SVG layer
    map._initPathRoot();

    // We pick up the SVG from the map object
    var svg = d3.select("#" + divName).select("svg");
    var gMain = svg.append("g").attr("class", "leaflet-zoom-hide").attr('opacity', 0.8);

    var gAreaBoundaries = gMain.append('g');

    /*
    queue()
    .defer(d3.xml, "application/xml", "/data/stuhleck.osm")
    .await(ready);
    */
    function projectPoint(x, y) {
          var point = map.latLngToLayerPoint(new L.LatLng(y, x));
            this.stream.point(point.x, point.y);
    }

    var transform = d3.geo.transform({point: projectPoint}),
        path = d3.geo.path().projection(transform);

    d3.json(jsonDir + '/uids-to-names.json', function(error, uids_to_names) {
        console.log('uids_to_names', uids_to_names);
        d3.json(jsonDir + '/ski-areas.topo', function(error, data) {
            console.log('data.bbox:', data.bbox);
            var southWest = L.latLng(data.bbox[1], data.bbox[0]),
                northEast = L.latLng(data.bbox[3], data.bbox[2]);

                var bounds = L.latLngBounds(southWest, northEast);
                console.log('bounds:', bounds);
                map.fitBounds(bounds);

                var feature = gAreaBoundaries.selectAll(".boundary-path")
                .data(topojson.feature(data, data.objects.boundaries).features)
                .enter().append("path")
                .classed('boundary-path', true)
                .attr('id', function(d) { return 'b' + d.properties.uid; })
                .classed('annotated', function(d) {
                    if (d.properties.uid in uids_to_names)
                        return true;
                    else
                        return false;
                })
                .on('mouseover', function(d) {
                    d3.selectAll('#u' + d.properties.uid)
                    .classed('selected', true)
                })
                .on('mouseout', function(d) {
                    d3.selectAll('#u' + d.properties.uid)
                    .classed('selected', false)
                })
                .on('click', function(d) {
                    console.log('clicked');
                    d3.selectAll('a')
                    .classed('selected', false);


                    d3.select('#a-' + d.properties.uid)
                    .classed('selected', true)
                    .node()
                    .scrollIntoView();

                    d3.selectAll('.boundary-path')
                    .classed('selected', false);

                    d3.select(this)
                    .classed('selected', true);
                });

                var namedFeatures = topojson.feature(data, data.objects.boundaries).features;
                namedFeatures = namedFeatures.filter(function(d) {
                    return d.properties.uid in uids_to_names;
                });
                console.log('namedFeatures:', namedFeatures);

                var text = gAreaBoundaries.selectAll('.boundary-text')
                .data(namedFeatures)
                .enter()
                .append('text')
                .text(function(d) { return uids_to_names[d.properties.uid]; })
                .attr('id', function(d) { return "u" + d.properties.uid; })
                .attr('text-anchor', 'middle')
                .attr('dominant-baseline', 'central');

                var text1 = gAreaBoundaries.selectAll('.boundary-text')
                .data(topojson.feature(data, data.objects.boundaries).features)
                .enter()
                .append('text')
                .attr('dy', 14)
                .text(function(d) { return d.properties.name; })
                .attr('id', function(d) { return "u" + d.properties.uid; })
                .attr('text-anchor', 'middle')
                .attr('dominant-baseline', 'central');

                function resetView() {
                    feature.attr("d", function(d) { return path(d.geometry); });
                    text.attr('transform', function(d) {
                        var centroid = path.centroid(d.geometry);
                        return 'translate(' + centroid[0] + ',' + centroid[1] + ')';
                    });
                    text1.attr('transform', function(d) {
                        var centroid = path.centroid(d.geometry);
                        return 'translate(' + centroid[0] + ',' + centroid[1] + ')';
                    });
                }

                map.on("viewreset", resetView);
                resetView();

                var skiAreas = topojson.feature(data, data.objects.boundaries).features;
                skiAreas.sort(function(a,b) { return +b.properties.area - a.properties.area; });

                console.log('bounds:', bounds);

                var lis = d3.select("#resort-list")
                .append('ul')
                .selectAll('li')
                .data(skiAreas)
                .enter()
                .append('li');

                var roundFormat = d3.format('.3f');
                lis.append('a')
                .attr('href', "javascript:void(0);")
                .attr('id', function(d) { return 'a-' + d.properties.uid; })
                .on('click', function(d) { 
                    var newBounds = geoBounds(d);
                    d3.selectAll('a')
                    .classed('selected', false);

                    feature.classed('selected', false);

                    d3.select('#b' + d.properties.uid)
                    .classed('selected', true);

                    d3.select(this).classed('selected', true);
                    map.fitBounds(newBounds);
                })
                .text(function(d,i) { return i + ") " + roundFormat(d.properties.area) + " || " ; });

                lis.append('input')
                .attr('type', 'text')
                .attr('name', function(d) { return 'i' + d.properties.uid; })
                .attr('value', function(d) { 
                  if (d.properties.uid in uids_to_names) {
                    return uids_to_names[d.properties.uid];
                  }
                })
                .on('change', function(d) {
                    uids_to_names[d.properties.uid] = this.value;
                });

                d3.select('#export-button')
                .on('click', function(d) {
                    var data_string = JSON.stringify(uids_to_names);
                    var blob = new Blob([data_string], {type: "application/json"});
                    saveAs(blob, 'uids-to-names.json');

                    console.log('uids_to_names:', uids_to_names);
                });

        });
    });
};
