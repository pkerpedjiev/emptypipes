!function() {
    var randomFinding = {};

    randomFinding.randomFindingLinear = function() {
        var width=200;
        var height=200;

        var numPointsX=6;
        var numPointsY=2;
        var pointRadius=5;

        var margin=20;

        var chart = function(selection) {
           selection.each(function(data) {
                var svg = d3.select(this).selectAll('svg').data([data]);

                var gEnter = svg.enter().append('svg').append('g');

                svg.attr('width', width)
                .attr('height', height);

                var gridWidthX = (width - 2 * margin) / numPointsX;
                var gridWidthY = (height - 2 * margin) / numPointsY;

                if (gridWidthX < gridWidthY) {
                    //xPoints are more tightly packed than yPoints
                    xMargin = margin;
                    yMargin = (height - (numPointsY - 1) * gridWidthX) / 2;
                } else {
                    yMargin = margin;
                    xMargin = (width - (numPointsX - 1) * gridWidthY) / 2;
                }

                var xScale = d3.scale.ordinal().domain(d3.range(numPointsX))
                 .rangePoints([xMargin,width-xMargin]);
                var yScale = d3.scale.ordinal().domain(d3.range(numPointsY))
                .rangePoints([yMargin,height-yMargin]);

                var points = [];
                for (var i = 0; i < numPointsX; i++)
                    for (var j = 0; j < numPointsY; j++)
                        points.push([i, j]);

                gEnter.selectAll('grid-point')
                .data(points)
                .enter()
                .append('circle')
                .attr('cx', function(d) { return xScale(d[0]); })
                .attr('cy', function(d) { return yScale(d[1]); })
                .attr('r', function(d) { return pointRadius; })
                .classed('grid-point', true);

                console.log('points', points);
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
    };

    console.log('define:', define);
    if (typeof define === "function" && define.amd) define(randomFinding); else if (typeof module === "object" && module.exports) module.exports = randomFinding;
        this.d3 = d3;
    this.randomFinding = randomFinding;
}();

