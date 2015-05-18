function drawIsochroneMap() {
    //var map = L.map('isochroneMap').setView([48.2858, 6.7868], 4);
    var map = new L.Map("isochroneMap", {
        center: new L.LatLng(48.2858, 6.7868),
        zoom: 4
    });

    var layer = new L.StamenTileLayer("toner");
    map.addLayer(layer);

    /*
       L.tileLayer(
       'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
attribution: '&copy; ' + mapLink + ' Contributors',
maxZoom: 18,
}).addTo(map);
*/

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

    function drawLegend() {
        var legendHeight = 100;

        d3.select("#isochroneMap").append("br");

        var svgLegend = d3.select("isochroneMap").append("svg")
        .attr("width", width)
        .attr("height", legendHeight);

        // range round bands for number of rows
        // range round bands for number of columns
        // 12 times = 4 rows x 3 columns

        // box row = index % 4
        // box column = index / 4
    }

    d3.json('/jsons/isochrone_map/grid_time_vienna_200_5.json', function(jsonStruct) {
        var transform = d3.geo.transform({
            point: projectPoint
        });
        var path = d3.geo.path().projection(transform);

        function projectPoint(x, y) {
            var point = map.latLngToLayerPoint(new L.LatLng(y, x));
            this.stream.point(point.x, point.y);
        } 

        console.log('jsonStruct', jsonStruct);

        var num_levels = 15;
        var zs = [];
        var data = jsonStruct.grid_z;
        var max_z = Math.max.apply(null, data.map(function(d) { return Math.max.apply(null, d) }));

        var lenXDim = data.length;
        var lenYDim = data[0].length;

        var xGridValues = d3.scale.ordinal().domain(d3.range(lenXDim))
        .rangePoints([jsonStruct.min_x, jsonStruct.max_x], 0).range()
        var yGridValues = d3.scale.ordinal().domain(d3.range(lenYDim))
        .rangePoints([jsonStruct.min_y, jsonStruct.max_y], 0).range()

        console.log('xGridValues:', xGridValues);

        for (i = 0; i <= num_levels; i++) {
            zs.push(i * max_z / num_levels);
        }
        console.log('zs:', zs);

        times = [2,4,6,8,10,12,14,16,18,20,22,24]
        //times = [4,8,12,16,20,24]
        zs = times.map(function(d) { return Math.log(d * 60); });
        /*
           var cliff = 100000;
           data.push(d3.range(data[0].length).map(function() { return cliff; }));
           data.unshift(d3.range(data[0].length).map(function() { return cliff; }));
           data.forEach(function(d) {
           d.push(cliff);
           d.unshift(cliff);
           });
           */

        //var xs = d3.range(0, data.length);
        //var ys = d3.range(0, data[0].length);
        var c = new Conrec,
        width = 400,
        height = 400,

        /*
           x = d3.scale.linear()
           .range([0, width])
           .domain([Math.min.apply(null, xs), Math.max.apply(null, xs)]),


           y = d3.scale.linear()
           .range([height, 0])
           .domain([Math.min.apply(null, ys), Math.max.apply(null, ys)]),
           */

        //colours = d3.scale.linear().domain([zs[0], zs[zs.length - 1]]).range(["#fff", "red"]);
        colours = d3.scale.cubehelix().domain([Math.exp(zs[0]), Math.exp(zs[zs.length-1])])

        c.contour(data, 0, xGridValues.length - 1, 0, yGridValues.length - 1, xGridValues, yGridValues, zs.length, zs);

        var contourPath = g.selectAll("path")
        .data(c.contourList().reverse())
        .enter().append("path")
        .style("fill",function(d) { return colours(Math.exp(d.level));})
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
            console.log('reset:');
            contourPath.attr("d", d3.svg.line()
                             .x(function(d) { return map.latLngToLayerPoint(new L.LatLng(d.y, d.x)).x; })
                             .y(function(d) { return map.latLngToLayerPoint(new L.LatLng(d.y, d.x)).y; }));

        }

        map.on("viewreset", resetView);
        resetView();
    });
}
