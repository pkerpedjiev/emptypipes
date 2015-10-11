function linkageClustering(selection) {
    var width = 550;
    var height = 350;

    var numCircles = 20;

    function chart(selection) {
        var svg = selection.append('svg')
        .attr('width', width)
        .attr('height', height);

        var rootG = svg.append('g');

        var xScale = d3.scale.linear().domain([0,1])
        .range([0, width]);

        var yScale = d3.scale.linear().domain([0,1])
        .range([height, 0]);

        // create random positions for all of the nodes that we'll
        // be clustering
        var positions = [];
        for (var i = 0; i < numCircles; i++) 
            positions.push([Math.random(), Math.random()])

        rootG.selectAll('circle')
        .data(positions)
        .enter()
        .append('circle')
        .attr('cx', function(d) { return xScale(d[0]); })
        .attr('cy', function(d) { return yScale(d[1]); })
        .attr('r', function(d) { return 2; });
    }

    function proximityCluster(points, distance) {
        //cluster points such that whenever two points are
        //within distance of each other, they are placed in
        //the same cluster

        //take m n-d points as input and
        //return an array of length m containing integers
        //where each integers encodes the cluster that the ith
        //point is in
        
        var clusters = []

        // all points are in their own cluster
        for (var i = 0; i < points.length; i++)
            clusters.push(i)

    }

    chart.width = function(_) {
        if (!arguments.length) return _;
        else width = _;
        return chart;
    };

    chart.height = function(_) {
        if (!arguments.length) return _;
        else height = _;
        return chart;
    };

    chart.numCircles = function(_) {
        if (!arguments.length) return _;
        else numCircles = _;
        return chart;
    };

    return chart;
}
