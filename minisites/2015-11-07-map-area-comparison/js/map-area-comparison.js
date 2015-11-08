function mapComparison() {
    var width = 400;
    var height = 400;

    var chart = function(selection) {
        selection.each(function(data) {
            console.log('data', data, d3.select(this));
            var grid = d3.layout.grid().size([width,height])
            .cols(data.features.length);

            var padding = [0,0];
            // add grid coordinates to the features
            var rectFeatures = grid(data.features);

            var numCols = grid.cols();
            var nodeWidth = Math.floor((width - (numCols - 1) * padding[0]) / numCols);
            var nodeHeight = nodeWidth;

            // get the largest feature and tailor the 
            // projection so that the entire feature fits inside it
            // snuggly
            var feature = data.features[0];
            var projection = d3.geo.mercator()
            .scale(1);

            var path = d3.geo.path()
                .projection(projection);

            // scaling the projection taken from
            // http://stackoverflow.com/a/17067379/899470
            var b = path.bounds(feature),
                s = 0.95 / Math.max(
                    (b[1][0] - b[0][0]) / nodeWidth, 
                    (b[1][1] - b[0][1]) / nodeHeight
                );
            projection.scale(s); 
            b = d3.geo.bounds(feature);
            projection.center([(b[1][0]+b[0][0])/2, (b[1][1]+b[0][1])/2]);
            projection.translate([nodeWidth/2, nodeHeight/2]);

            d3.select(this).selectAll(".subunit")
            .data(rectFeatures)
            .enter()
            .append('g')
            .attr('transform', function(d) { 
                return 'translate(' + d.x + ',' + d.y + ')'; })
            .append("path")
            .attr("class", function(d) { return "u" + d.properties.uid; })
            .attr("d", path);

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
