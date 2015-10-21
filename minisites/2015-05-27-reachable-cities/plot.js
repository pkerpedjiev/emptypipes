function chairLiftChart() {
    var margin = {top: 20, right: 20, bottom: 20, left: 20},
    width = 500,
    height = 300,
    xValue = function(d) { return d[0]; },
    yValue = function(d) { return d[1]; },
    xScale = d3.scale.linear(),
    yScale = d3.scale.linear(),
    xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickSize(6, 0),
    area = d3.svg.area().x(X).y1(Y),
    line = d3.svg.line().x(X).y(Y);

    function chart(selection) {
        console.log('selection:', selection);

        selection.each(function(data) {
            console.log('data', data);

            //flatten the list of x values
            var allXs = [],
            allYs = [];

            var mappedXs = data.map(function(d) { 
                return d.points.map(function(d1) { return d1[0]; }) ; 
            });
            var mappedYs = data.map(function(d) { 
                return d.points.map(function(d1) { return d1[1]; }) ; 
            });
            //
            //flatten the list of y values
            allXs = allXs.concat.apply(allXs, mappedXs);
            allYs = allYs.concat.apply(allYs, mappedYs);

            // Update the x-scale.
            xScale
            .domain(d3.extent(allXs))
            .range([0, width - margin.left - margin.right]);

            // Update the y-scale.
            yScale
            .domain(d3.extent(allYs))
            .range([height - margin.top - margin.bottom, 0]);

            // Select the svg element, if it exists.
            var svg = d3.select(this).selectAll("svg").data([data]);

            // Otherwise, create the skeletal chart.
            var gEnter = svg.enter().append("svg").append("g");
            gEnter.append("g").attr("class", "x axis");

            var gpath = gEnter.selectAll(".gpath")
                .data(function(d) { console.log('y'); return d; })
                .enter()
                .append("g")
                .attr('class', 'gpath');

                gpath.append("path").attr("class", "line")
                .attr('d', function(d)  { return line(d.points);} );

            // Update the outer dimensions.
            svg.attr("width", width)
            .attr("height", height);

            // Update the inner dimensions.
            var g = svg.select("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            // Update the line path.
            /*
            g.select(".line")
            .attr("d", line)
            .each(function(d) {
                console.log('d', d);
            });
            */

            // Update the x-axis.
            g.select(".x.axis")
            .attr("transform", "translate(0," + yScale.range()[0] + ")")
            .call(xAxis);
        });
    }

    // The x-accessor for the path generator; xScale ∘ xValue.
    function X(d) {
        console.log('d:', d);
        return xScale(d[0]);
    }

    // The x-accessor for the path generator; yScale ∘ yValue.
    function Y(d) {
        return yScale(d[1]);
    }

    chart.margin = function(_) {
        if (!arguments.length) return margin;
        margin = _;
        return chart;
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

    chart.x = function(_) {
        if (!arguments.length) return xValue;
        xValue = _;
        return chart;
    };

    chart.y = function(_) {
        if (!arguments.length) return yValue;
        yValue = _;
        return chart;
    };

    return chart;
}

d3.xml("with_elevation/stuhleck.osm", "application/xml", function(xml) {
    var ways = $(xml).find("way");
    //var ways = xml.documentElement.getElementsByTagName("way");
    //
    var liftNodes = ways.map(function() {
        var way = $(this);
        var nds = $(way).find('nd');

        // convert the nodes to javascript objects for easier
        // manipulation
        var nodes = nds.map(function(i, d) { 
            var node = $(xml).find('#' + $(d).attr('ref'));

            return {'latitude': +node.attr('lat'),
                'longitude': +node.attr('lon'),
                'elevation': +node.attr('elev')
            };
        }).toArray();

        return {"nodes": nodes};
    }).toArray();

    var allNodes = [];
    allNodes = allNodes.concat.apply(allNodes, liftNodes.map(function(d) { return d.nodes; }));

    var lowestPoint = allNodes[0];
    for (var i = 0; i < allNodes.length; i++) 
        if (allNodes[i].elevation < lowestPoint.elevation)
            lowestPoint = allNodes[i];

    console.log('allNodes', allNodes);
    console.log('lowestPoint', lowestPoint);

    var lifts = liftNodes.map(function(lift) {
        var nodes = lift.nodes;
        var firstNode = nodes[0];
        var lastNode = nodes[nodes.length-1];

        if (firstNode.elevation > lastNode.elevation) {
            var tmp = firstNode;
            firstNode = lastNode;
            lastNode = tmp;
        }

        var start = firstNode;

        var points = [];
        var startDist = haversine(lowestPoint, firstNode);

        console.log('startDist', startDist)

        for (var i = 0; i < nodes.length; i++) {
            var here = nodes[i];

            var dist = haversine(start, here);
            points.push([startDist + dist, here.elevation]);
        }

        return {"points":points};
    });

    var chart = chairLiftChart();

    console.log('lifts:', lifts.length, lifts);

    d3.select("#chart")
    .datum(lifts)
    .call(chart);
});
