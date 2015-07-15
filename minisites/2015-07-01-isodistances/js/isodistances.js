function flightTimeMap() {
    var bottomMargin = 30;

    var width = 550,
    height = 400 - bottomMargin,

    rotate = 60,        // so that [-60, 0] becomes initial center of projection
    maxlat = 83;        // clip northern and southern poles (infinite in mercator)

    var chart = function(selection) {
        var projection = d3.geo.mercator()
        .rotate([rotate,0])
        .scale(1)           // we'll scale up to match viewport shortly.
        .translate([width/2, height/2]);

        // find the top left and bottom right of current projection
        function mercatorBounds(projection, maxlat) {
            var yaw = projection.rotate()[0],
            xymax = projection([-yaw+180-1e-6,-maxlat]),
            xymin = projection([-yaw-180+1e-6, maxlat]);

            return [xymin,xymax];
        }

        // set up the scale extent and initial scale for the projection
        var b = mercatorBounds(projection, maxlat),
        s = width/(b[1][0]-b[0][0]),
        scaleExtent = [s, 10*s];

        projection
        .scale(scaleExtent[0]);

        var zoom = d3.behavior.zoom()
        .scaleExtent(scaleExtent)
        .scale(projection.scale())
        .translate([0,0])               // not linked directly to projection
        .on("zoom", redraw);

        var path = d3.geo.path()
        .projection(projection);

        selection.selectAll('svg')
        .data([1])
        .enter()
        .append('svg');
        /*
        var svg = d3.selectAll('body')
        .append('svg')
        */
        var svg = selection.selectAll('svg')
        .classed('world-map', true)
        .attr('width',width)
        .attr('height',height + bottomMargin);


        svg.append('rect')
        .classed('map-background', true)
        .attr('width', width)
        .attr('height', height);


        var countriesG = svg.append('g');

        var circle = d3.geo.circle();
        var circlePathsG = svg.append("g")
        .attr("class", "circlea");

        var clipTextEdgeWidth = 6;   //how far from the edges to clip the texts
        var clipCircleEdgeWidth = 3;   //how far from the edges to clip the texts

        svg.append("clipPath")
        .attr('id', 'text-clip')
        .append('rect')
        .attr('x', clipTextEdgeWidth)
        .attr('width', width- 2 * clipTextEdgeWidth )
        .attr('height', height)

        svg.append("clipPath")
        .attr('id', 'map-clip')
        .append('rect')
        .attr('x', 1)
        .attr('y', 1)
        .attr('width', width - 2)
        .attr('height', height -1 )

        svg.append("clipPath")
        .attr('id', 'circle-clip')
        .append('rect')
        .attr('x', clipCircleEdgeWidth)
        .attr('width', width- 2 * clipCircleEdgeWidth )
        .attr('height', height);

        var lastPos = [-74.0, 40.7]; // New York, NY

        function drawCircles(coords) {
            var pathContainers = circlePathsG.selectAll('.path-g')
            .data(d3.range(0, 180, 16))
            //.data([100])
            .enter()
            .append("g")
            .classed('path-g', true);

            pathContainers.append('path').classed('altitude-circle', true);

            circlePathsG.selectAll('.altitude-circle')
            .attr("d", function(r) { return path(circle.origin(coords).angle(r)()); })
            .attr('id', function(r) { return "circle" + r; })
            .attr("clip-path", "url(#circle-clip)")
            .on('mouseover', function(d) {
                console.log('mouseover');
                d3.select(this).classed('thick-path', true);
            })
            .on('mouseout', function(d) {
                d3.select(this).classed('thick-path', false);
            });

            halfPath = d3.geo.circle().origin(coords).angle(90).precision(20);

            azimuths = circlePathsG.selectAll('.azimuth-circle')
            .data(halfPath().coordinates[0])
            .enter()
            .append('path')
            .classed('azimuth-circle', true);

            circlePathsG.selectAll('.azimuth-circle')
            .attr('d', function(d) { return path(d3.geo.circle().origin(d).angle(90)()); });

            pathContainers.each(function(d) {
                var path = d3.select(this).select('path');

                var xPoss = d3.range(0, path.node().getTotalLength() - 100, 100) ;

                var texts = d3.select(this).selectAll('text')
                .data(xPoss)
                .enter()
                .append('text')
                .attr('x', function(d1) { return d1; })
                .attr('dy', 5)
                .attr("clip-path", "url(#text-clip)")
                .classed('flight-time-text', true);

                texts
                .append("textPath")
                .attr("xlink:href", function(d1) { return "#circle" + d; } )
                .text(function(d1) { return (d / 8); });
            });
        }

        d3.json("jsons/world-110m.json", function ready(error, world) {

            countriesG.selectAll('.world-map')
            .data(topojson.feature(world, world.objects.countries).features)
            .enter().append('path').classed('world-map', true)
                .attr("clip-path", "url(#map-clip)");

            redraw();       // update path data
            var bg_rect = svg.append('rect').attr('fill', 'transparent').attr('width', width)
            .attr('height', height).classed('bg-rect', true)
            .call(zoom)
            .on("dblclick.zoom", null)
            bg_rect.on('dblclick', function(d) {
                lastPos = projection.invert(d3.mouse(this));
                drawCircles(lastPos);
            });
        });

        // track last translation and scale event we processed
        var tlast = [0,0], 
        slast = null;

        function updatePaths(coords) {
            circlePathsG.selectAll('.altitude-circle')
            .attr("d", function(r) { return path(d3.geo.circle().origin(coords).angle(r)()); })
            .attr("clip-path", "url(#map-clip)");

            circlePathsG.selectAll('.azimuth-circle')
            .attr("d", function(d) { return path(d3.geo.circle().origin(d).angle(90)()); })
                .attr("clip-path", "url(#map-clip)");
        }

        function redraw() {
            if (d3.event) { 
                var scale = d3.event.scale,
                t = d3.event.translate;                

                // if scaling changes, ignore translation (otherwise touch zooms are weird)
                if (scale != slast) {
                    projection.scale(scale);
                } else {
                    var dx = t[0]-tlast[0],
                    dy = t[1]-tlast[1],
                    yaw = projection.rotate()[0],
                    tp = projection.translate();

                    // use x translation to rotate based on current scale
                    projection.rotate([yaw+360*dx/width*scaleExtent[0]/scale, 0, 0]);
                    // use y translation to translate projection, clamped by min/max
                    var b = mercatorBounds(projection, maxlat);
                    if (b[0][1] + dy > 0) dy = -b[0][1];
                    else if (b[1][1] + dy < height) dy = height-b[1][1];
                    projection.translate([tp[0],tp[1]+dy]);
                }
                // save last values.  resetting zoom.translate() and scale() would
                // seem equivalent but doesn't seem to work reliably?
                slast = scale;
                tlast = t;
            }

            svg.selectAll('.world-map')       // re-project path data
            .attr('d', path);

            updatePaths(lastPos);
        }

        function toggleVisible(checkName, changeName) {
            return function() {
                var legendLine = d3.select(checkName);

                if (legendLine.classed('invisible') === true) {
                    legendLine.classed('invisible', false);
                    d3.selectAll(changeName).classed('invisible', false);
                } else {
                    legendLine.classed('invisible', true);
                    d3.selectAll(changeName).classed('invisible', true);
                }
            };
        }


        var legendG = svg.append('g')
        .classed('flight-time-legend', true)
        .attr('transform', 'translate(0,' + height + ')');

        var xScale = d3.scale.ordinal().domain([0,1]).rangeRoundBands([20,width], 0.1, 0.2);

        var legendRectWidth = 14;
        var legendTextOffset = 6;

        drawCircles(lastPos);

        legendG.append('path')
        .classed('legend-line-altitude', true)
        .attr('d', function(x) { var path = 'M' + xScale(0) + "," + (bottomMargin / 2) + 'L' + (xScale(0) + legendRectWidth) + "," + (bottomMargin / 2); return path; });

        legendG.append('rect')
        .attr('x', xScale(0))
        .attr('y', (bottomMargin - legendRectWidth) / 2)
        .classed('legend-rect', true)
        .attr('fill', 'transparent')
        .attr('width', legendRectWidth)
        .attr('height', legendRectWidth)
        .attr('opacity', 0.3)
        .classed('invisible', false)
        .on('click', function() {
            toggleVisible('.legend-line-altitude', '.altitude-circle, .flight-time-text')();
        });

        legendG.append('text')
        .attr('x', xScale(0) + legendRectWidth + 8)
        .attr('y', legendRectWidth + legendTextOffset)
        .text("Flight Times (isodistances)")
        .classed('legend-label', true);

        legendG.append('path')
        .classed('legend-line-azimuth', true)
        .attr('d', function(x) { var path = 'M' + xScale(1) + "," + (bottomMargin / 2) + 'L' + (xScale(1) + legendRectWidth) + "," + (bottomMargin / 2); return path; });

        legendG.append('rect')
        .attr('x', xScale(1))
        .attr('y', (bottomMargin - legendRectWidth) / 2)
        .classed('legend-rect', true)
        .attr('width', legendRectWidth)
        .attr('height', legendRectWidth)
        .attr('opacity', 0.3)
        .on('click', toggleVisible('.legend-line-azimuth', '.azimuth-circle'));

        toggleVisible('.legend-line-azimuth', '.azimuth-circle')();

        legendG.append('text')
        .attr('x', xScale(1) + legendRectWidth + 8)
        .attr('y', legendRectWidth + legendTextOffset)
        .text("Flight Paths (shortest paths)")
        .classed('legend-label', true);
        
    };

    chart.width = function(_) {
        if (!arguments.length) return width;
        width = _;
        return chart;
    };

    chart.height = function(_) {
        if (!arguments.length) return height + bottomMargin;
        height = _ - bottomMargin;
        return chart;
    };

    return chart;
}
