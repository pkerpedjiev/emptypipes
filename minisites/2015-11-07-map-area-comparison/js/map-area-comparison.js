function mapComparison() {
    var width = 400;
    var height = 400;
    var scaleValue = null;

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
        return [[minLon, minLat], [maxLon, maxLat]];
    }

    var chart = function(selection) {
        selection.each(function(data) {
            // add grid coordinates to the features
            var features = topojson.feature(data, data.objects.boundaries).features;
            var numCols = features.length / 5;
            var numRows = Math.ceil(features.length / numCols);

            var padding = [0,0];
            var nodeWidth = Math.min(height, Math.floor((width - (numCols - 1) * padding[0]) / numCols));
            var nodeHeight = nodeWidth;
            var totalHeight = numRows * nodeHeight;
            console.log('totalHeight:', totalHeight);

            var grid = d3.layout.grid().size([width,height])
            .cols(numCols)
            .padding(padding)
            .nodeSize([nodeHeight, nodeWidth]);

            console.log('features', features);
            var rectFeatures = grid(features);

            // get the largest feature and tailor the 
            // projection so that the entire feature fits inside it
            // snuggly
            var projection = d3.geo.mercator()
            .scale(1)
            .precision(0);

            var path = d3.geo.path()
                .projection(projection);


            if (scaleValue === null) {
                scaleValue = 1000000000000;

                for (var i = 0; i < features.length; i++) {
                    var feature = features[i];
                    var gb = geoBounds(feature);
                    var b = [projection(gb[0]), projection(gb[1])];
                    // scaling the projection taken from
                    // http://stackoverflow.com/a/17067379/899470
                    var s = 0.95 / Math.max(
                            (b[1][0] - b[0][0]) / nodeWidth, 
                            (b[0][1] - b[1][1]) / nodeHeight
                        );
                    if (s < scaleValue) {
                        scaleValue = s;
                    }
                }
            }
            
            function createFeaturePath(feature) {
                var path = d3.geo.path()
                    .projection(projection);

                var b = geoBounds(feature);

                projection.center([(b[1][0]+b[0][0])/2, (b[1][1]+b[0][1])/2]);
                projection.translate([nodeWidth/2, nodeHeight/2]);
                projection.scale(scaleValue); 

                console.log('feature', feature);

                return path(feature.geometry);
            }

            var gSkiArea = d3.select(this).selectAll(".subunit")
            .data(rectFeatures)
            .enter()
            .append('g')
            .attr('transform', function(d) { 
                return 'translate(' + d.x + ',' + d.y + ')'; });

            gSkiArea.append("path")
            .attr("class", function(d) { return "u" + d.properties.uid; })
            .attr("d", createFeaturePath);

            gSkiArea.append('text')
            .attr('transform', function(d) {
                return 'translate(' + (nodeWidth / 2) + ',' + (nodeHeight + 5) + ')';
            })
            .classed('ski-area-name', true)
            .text(function(d) { return d.properties.name; });
        });
    };

    chart.width = function(_) {
        if (!arguments.length) return width;
        width = _;
        return chart;
    };

    chart.height = function(_) {
        if (!arguments.length) return height;
        height = _;
        return chart;
    };

    chart.scale = function(_) {
        if (!arguments.length) return scaleValue;
        scaleValue = _;
        return chart;
    };

    return chart;
}

function compareMaps(geoJson) {
    /*
    Create a grid comparing some topojson maps.

    @param geoJson: The topojson file (misleading parameter name)
    */
    var width = 550;
    var height = 550;

    var svg = d3.select('#map-area').append('svg')
        .attr('width', width)
        .attr('height', height);

    var margin = {'top': 10, 'left': 10, 'right': 10, 'bottom': 10};

    var compareChart = mapComparison()
    .width(width - margin.left - margin.right)
    .height(height - margin.top - margin.bottom);

    var prevArgs = arguments;

    d3.json(geoJson, function(data) {
        svg.selectAll('g')
        .data([data])
        .enter()
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        .call(compareChart);
    });
}
