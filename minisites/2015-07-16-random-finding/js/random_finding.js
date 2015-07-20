!function() {
    var randomFinding = {};

    randomFinding.randomFindingLinear = function() {
        var width=200;
        var height=200;
        var stepCounts = [];

        var numPointsX=6;
        var numPointsY=4;
        var pointRadius=5;
        var transitionDuration = 200;

        var margin=20;
        var steps = 0;

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

                gEnter.selectAll('chaser')
                .data([randomPosition()])
                .enter()
                .append('circle')
                .attr('cx', function(d) { return xScale(d[0]); })
                .attr('cy', function(d) { return yScale(d[1]); })
                .attr('r', function(d) { return pointRadius; })
                .classed('chaser', true);

                gEnter.selectAll('runner')
                .data([randomPosition()])
                .enter()
                .append('circle')
                .attr('cx', function(d) { return xScale(d[0]); })
                .attr('cy', function(d) { return yScale(d[1]); })
                .attr('r', function(d) { return pointRadius; })
                .classed('runner', true);

                function randomPosition() {
                    return [Math.floor(Math.random() * numPointsX),
                            Math.floor(Math.random() * numPointsY)];
                }

                function randomDirection() {
                    return [Math.floor(Math.random() * 3) - 1,
                            Math.floor(Math.random() * 3) - 1];
                }

                function isValidPosition(position) {
                    if (position[0] < 0 || position[1] < [0])
                        return false;
                    if (position[0] >= numPointsX || position[1] >= numPointsY)
                        return false;

                    return true;
                }

                function addPosition(position, direction) {
                    return [position[0] + direction[0],
                            position[1] + direction[1]];
                }

                function step() {
                    var chaser = d3.select('.chaser');
                    var runner = d3.select('.runner');

                    console.log('step:', step);

                    if (chaser.data()[0][0] == runner.data()[0][0] &&
                        chaser.data()[0][1] == runner.data()[0][1]) {
                        stepCounts.push(steps);
                        console.log('finished:', stepCounts);
                        
                        chaser.data([randomPosition()]);
                        runner.data([randomPosition()]);
                        steps = 0;

                        chaser.data([randomPosition()]).transition()
                        .duration(transitionDuration)
                        .attr('cx', function(d) { return xScale(d[0]); })
                        .attr('cy', function(d) { return yScale(d[1]); });

                        runner.data([randomPosition()]).transition()
                        .duration(transitionDuration)
                        .attr('cx', function(d) { return xScale(d[0]); })
                        .attr('cy', function(d) { return yScale(d[1]); });


                        setTimeout(step, transitionDuration);

                        return;
                    }

                    do {
                        newChaserPosition = addPosition(chaser.data()[0],
                                                            randomDirection());
                    } while (!isValidPosition(newChaserPosition));

                    do {
                        newRunnerPosition = addPosition(runner.data()[0],
                                                        randomDirection());
                    } while (!isValidPosition(newRunnerPosition));

                    chaser.data([newChaserPosition]).transition()
                    .duration(transitionDuration)
                    .attr('cx', function(d) { return xScale(d[0]); })
                    .attr('cy', function(d) { return yScale(d[1]); });

                    runner.data([newRunnerPosition]).transition()
                    .duration(transitionDuration)
                    .attr('cx', function(d) { return xScale(d[0]); })
                    .attr('cy', function(d) { return yScale(d[1]); });

                    steps += 1;
                    setTimeout(step, transitionDuration);
                }

                console.log('points', points);
                
                step();
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

