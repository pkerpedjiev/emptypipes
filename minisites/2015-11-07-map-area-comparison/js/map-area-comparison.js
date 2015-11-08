function mapComparison() {
    var width = 400;
    var height = 400;

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
            var numCols = data.features.length;
            var padding = [0,0];
            var nodeWidth = Math.min(height, Math.floor((width - (numCols - 1) * padding[0]) / numCols));
            var nodeHeight = nodeWidth;

            var grid = d3.layout.grid().size([width,height])
            .cols(numCols)
            .padding(padding)
            .nodeSize([nodeHeight, nodeWidth]);

            var rectFeatures = grid(data.features);

            // get the largest feature and tailor the 
            // projection so that the entire feature fits inside it
            // snuggly
            var projection = d3.geo.mercator()
            .scale(1)
            .precision(0);

            var path = d3.geo.path()
                .projection(projection);

            var minS = 1000000000000;

            for (var i = 0; i < data.features.length; i++) {
                var feature = data.features[i];
                var gb = geoBounds(feature);
                var b = [projection(gb[0]), projection(gb[1])];
                // scaling the projection taken from
                // http://stackoverflow.com/a/17067379/899470
                var s = 0.95 / Math.max(
                        (b[1][0] - b[0][0]) / nodeWidth, 
                        (b[0][1] - b[1][1]) / nodeHeight
                    );
                if (s < minS)
                    minS = s;
            }
            
            function createFeaturePath(feature) {
                var path = d3.geo.path()
                    .projection(projection);

                var b = geoBounds(feature);

                projection.center([(b[1][0]+b[0][0])/2, (b[1][1]+b[0][1])/2]);
                projection.translate([nodeWidth/2, nodeHeight/2]);
                projection.scale(minS); 

                return path(feature.geometry);
            }

            d3.select(this).selectAll(".subunit")
            .data(rectFeatures)
            .enter()
            .append('g')
            .attr('transform', function(d) { 
                return 'translate(' + d.x + ',' + d.y + ')'; })
            .append("path")
            .attr("class", function(d) { return "u" + d.properties.uid; })
            .attr("d", createFeaturePath);
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

    return chart;
}

function compareMaps(geoJson) {
    var width = 550;
    var height = 300;

    var svg = d3.select('#map-area').append('svg')
        .attr('width', width)
        .attr('height', height);

    var compareChart = mapComparison()
    .width(width)
    .height(height);

    d3.json(geoJson, function(data) {
        svg.selectAll('g')
        .data([data])
        .enter()
        .append('g')
        .call(compareChart);
    });
}
