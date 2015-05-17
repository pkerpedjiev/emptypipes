function drawIceMap() {
    var map = L.map('iceMap').setView([48.2858, 6.7868], 4);
    mapLink = 
        '<a href="http://openstreetmap.org">OpenStreetMap</a>';
    L.tileLayer(
        'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; ' + mapLink + ' Contributors',
        maxZoom: 18,
    }).addTo(map);

    // Initialize the SVG layer
    map._initPathRoot();

    // We pick up the SVG from the map object
    var svg = d3.select("#iceMap").select("svg");
    var g = svg.append("g").attr("class", "leaflet-zoom-hide");

    var gLines = g.append('g');
    var gCircles = g.append('g');

    function showLines(lines) {
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];
            var selectStr = '.' + line.replace(' ', '');
            var outerPaths = d3.selectAll(selectStr);

            outerPaths.attr('visibility', 'visible');
        }
    }

    function hideLines(lines) {
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];
            var selectStr = '.' + line.replace(' ', '');
            var outerPaths = d3.selectAll(selectStr);

            outerPaths.attr('visibility', 'hidden');
        }
    }

    function cityMouseOver(d) {
        showLines(d.properties.lines);
    }

    function cityMouseOut(d) {
        hideLines(d.properties.lines);
    }

    function lineMouseOver(d) {
        showLines(d.properties.lines);
    }

    function lineMouseOut(d) {
        hideLines(d.properties.lines);
    }

    d3.json("/jsons/city_pairs.json", function(geoShape) {
        var transform = d3.geo.transform({
            point: projectPoint
        });
        var path = d3.geo.path().projection(transform);

        function projectPoint(x, y) {
            var point = map.latLngToLayerPoint(new L.LatLng(y, x));
            this.stream.point(point.x, point.y);
        } 

        function escapeRegExp(string) {
            return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
        }

        function replaceAll(string, find, replace) {
            return string.replace(new RegExp(escapeRegExp(find), 'g'), replace);
        }

        outerPath = gLines.selectAll(".outerPath")
        .data(geoShape.features)
        .enter().append("path")
        .attr('class', function(d) {
            var iceNames = d.properties.lines[0].replace(" [DB]", "").replace(' ', '');
            for (var i = 1; i < d.properties.lines.length; i++) {
                iceNames += ' ' + d.properties.lines[i].replace(" [DB]", "").replace(' ', '');
            }
            return 'outerPath ' + iceNames;
        })
        .attr('visibility', 'hidden');

        // create path elements for each of the features
        d3_features = gLines.selectAll(".innerPath")
        .data(geoShape.features)
        .enter().append("path")
        .classed('innerPath', true)
        .on('mouseover', lineMouseOver)
        .on('mouseout', lineMouseOut);

        d3_features.append('title').text(function(d) { return d.properties.name + " (" + d.properties.speed + " km/h) " + d.properties.lines; });

        map.on("viewreset", reset1);


        var colors = d3.scale.linear()
        .domain(d3.extent(geoShape.features.map(function(d) { return d.properties.speed; })))
        .range(['red', 'green']);

        var widths = d3.scale.linear()
        .domain(d3.extent(geoShape.features.map(function(d) { return d.properties.lines.length; })))
        .range([3,14]);

        reset1();

        // fit the SVG element to leaflet's map layer
        function reset1() {
            outerPath.attr("d", path)
            .style("fill-opacity", 0.7)
            .style('stroke', 'black')
            .style('stroke-width', function(d) {
                return widths(d.properties.lines.length) + 4;
            })
            .style('opacity', 0.8);

            // initialize the path data 
            d3_features.attr("d", path)
            .style("fill-opacity", 0.7)
            .style('stroke', function(d) {
                return colors(d.properties.speed);
            })
            .style('stroke-width', function(d) {
                //return widths(d.properties.speed);
                return widths(d.properties.lines.length);
            })
            .style('opacity', 0.7);

        } 
    });

    d3.json("/jsons/city_counts.json", function(collection) {
        // Add a LatLng object to each item in the dataset
        collection.features.forEach(function(d) {
            d.LatLng = new L.LatLng(d.geometry.coordinates[0],
                                    d.geometry.coordinates[1]);
        });

        var feature = gCircles.selectAll("circle")
        .data(collection.features)
        .enter().append("circle")
        .style("stroke", "black")  
        .style("opacity", 0.7)
        .style("fill", "white")
        .attr("r", function(d) { return 2 + Math.sqrt(d.properties.width) / 2; })  
        .on('mouseover', cityMouseOver)
        .on('mouseout', cityMouseOut);

        feature.append('title').text(function(d) { return d.properties.name + " " + d.properties.lines; });

        map.on("viewreset", update);
        update();

        function update() {
            feature.attr("transform", 
                         function(d) { 
                             return "translate("+ 
                                 map.latLngToLayerPoint(d.LatLng).x +","+ 
                                 map.latLngToLayerPoint(d.LatLng).y +")";
                         });
        }
    });
}

