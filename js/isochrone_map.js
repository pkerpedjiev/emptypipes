function drawIsochroneMap(initialLat, initialLon, travelTimeGridJson) {
    //var map = L.map('isochroneMap').setView([48.2858, 6.7868], 4);
    var map = new L.Map("isochroneMap", {
        center: new L.LatLng(initialLat, initialLon),
        zoom: 5
    });

    var layer = new L.StamenTileLayer("toner");
    map.addLayer(layer);

    var topPane = map._createPane('leaflet-top-pane', map.getPanes().mapPane);
    var topLayerLines = new L.StamenTileLayer('toner-lines');
    var topLayerLabels = new L.StamenTileLayer('toner-labels');
    map.addLayer(topLayerLines);
    map.addLayer(topLayerLabels);
    topPane.appendChild(topLayerLines.getContainer());
    topPane.appendChild(topLayerLabels.getContainer());
    topLayerLabels.setZIndex(9);
    topLayerLines.setZIndex(9);

    var width=550, height=400;
    //var defaultContourColor = 'transparent';
    var defaultContourColor = 'black';
    var defaultContourWidth = 1;

    // Initialize the SVG layer
    map._initPathRoot();

    // We pick up the SVG from the map object
    var svg = d3.select("#isochroneMap").select("svg");
    var g = svg.append("g").attr("class", "leaflet-zoom-hide").attr('opacity', 0.8);
    
    var times = [2,4,6,8,10,12,14,16,18,20,22,24];
    var zs = times.map(function(d) { return Math.log(d * 60); });

    console.log('zs:', zs);
    //var colours = d3.scale.cubehelix().domain([Math.exp(zs[0]), Math.exp(zs[zs.length-1])]);
    var colours = d3.scale.cubehelix().domain([0, 11]);

    console.log('colours.domain()', colours.domain());

    function drawLegend() {
        var legendHeight = 40;

        var svgLegend = d3.select("#isochroneMapLegend").append("svg");


        svgLegend.attr("width", width)
        .attr("height", legendHeight);

        newTimes = times.map(function(d) { return (d/2) - 1; });
        var numColumns = 6;
        var perColumn = newTimes.length / numColumns;
        var numRows = newTimes.length / numColumns;

        console.log('newTimes', newTimes);

        columnBands = d3.scale.ordinal().domain(d3.range(numColumns))
        .rangeRoundBands([0, width], 0.1);
        rowBands = d3.scale.ordinal().domain(d3.range(numRows))
        .rangeRoundBands([0, legendHeight], 0.1);

        svgLegend.selectAll('rect')
        .data(newTimes)
        .enter()
        .append('rect')
        .attr('x', function(d) { return columnBands(Math.floor(d / numRows)); })
        .attr('y', function(d) { return rowBands(d % numRows); })
        .attr('width', function(d) { return rowBands.rangeBand(); })
        .attr('height', function(d) { return rowBands.rangeBand(); })
        .attr('fill', function(d) {return colours(d); })
        .attr('opacity', 0.8)
        .attr('stroke', 'black');

        svgLegend.selectAll('text')
        .data(newTimes)
        .enter()
        .append('text')
        .attr('x', function(d) { return columnBands(Math.floor(d / numRows)) + rowBands.rangeBand() + 8; })
        .attr('y', function(d) { return rowBands(d % numRows) + 14; })
        .style('font-style', 'normal')
        .style('font-family', 'sans-serif')
        .style('font-size', 14)
        .text(function(d) { 
            if (d === 11) 
                return ">= 22 hrs";
            else
                return "< " + (d+1)*2 + " hrs"; 
        });

        // range round bands for number of rows
        // range round bands for number of columns
        // 12 times = 4 rows x 3 columns

        // box row = index % 4
        // box column = index / 4
    }

    d3.json(travelTimeGridJson, function(jsonStruct) {
        var transform = d3.geo.transform({
            point: projectPoint
        });
        var path = d3.geo.path().projection(transform);

        function projectPoint(x, y) {
            var point = map.latLngToLayerPoint(new L.LatLng(y, x));
            this.stream.point(point.x, point.y);
        } 

        var width = 400,
        height = 400;

        var contours = [];
        for (var i = 0; i < jsonStruct.length; i++) {
            var newContour = jsonStruct[i].path;
            newContour.level = jsonStruct[i].level;
            newContour.k = jsonStruct[i].k;

            contours.push(newContour);
        }

        contours.sort(function(a,b) {
            return b.level - a.level;
        });

        //console.log('jsonStruct:', jsonStruct);
        var contourPath = g.selectAll("path")
        .data(contours)
        .enter().append("path")
        .style("fill",function(d, i) { return colours(d.level);})
        .style("stroke", defaultContourColor)
        .style('stroke-width', defaultContourWidth)
        .style('opacity', 1)
        .on('mouseover', function(d) { 
            d3.select(this).style('stroke', 'black');
        })
        .on('mouseout', function(d) {
            d3.select(this).style('stroke', defaultContourColor);
        });

        drawLegend();

        function resetView() {
            console.log('reset:', map.options.center);
            contourPath.attr("d", function(d) {
                var pathStr = d.map(function(d1) {
                    var point = map.latLngToLayerPoint(new L.LatLng(d1[2], d1[1]));
                    return d1[0] + point.x + "," + point.y;
                }).join('');

                //console.log('d', d); 

                return pathStr;
            });
                             
            /*
                             d3.svg.line()
                             .x(function(d) { return map.latLngToLayerPoint(new L.LatLng(d.y, d.x)).x; })
                             .y(function(d) { return map.latLngToLayerPoint(new L.LatLng(d.y, d.x)).y; }));
                             */

        }

        map.on("viewreset", resetView);
        resetView();

    });
}
