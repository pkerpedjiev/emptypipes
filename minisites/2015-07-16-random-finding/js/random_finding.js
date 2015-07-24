!function() {
    var randomFinding = {};
    var targetFunction = function(x) {};

    randomFinding.durationSlider = function() {
        var width = 100;
        var margin = {top: 20, right: 20, bottom: 40 , left: 20};

        var chart = function(selection) {
            var xScale = d3.scale.linear()
            .domain([.01, 0.6])
            .range([0, width])
            .clamp(true);

            var brush = d3.svg.brush()
            .x(xScale)
            .extent([0.5, 0.5])
            .on("brush", brushed);

            selection.append("g")
            .attr("class", "x axis")
            //.attr("transform", "translate(0," + height / 2 + ")")
            .call(d3.svg.axis()
                  .scale(xScale)
                  .orient("bottom")
                  .tickFormat(function(d) { return d; })
                  .tickSize(0)
                  .ticks(5)
                  .tickPadding(12))
                  .select(".domain")
                  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
                  .attr("class", "halo");

            var slider = selection.append("g")
            .attr("class", "slider")
            .call(brush);


            var handle = slider.append("circle")
            .attr("class", "handle")
            .attr("r", 6);

            slider
            .call(brush.event);

            function brushed() {
                var value = brush.extent()[0];

                if (d3.event.sourceEvent) { // not a programmatic event
                    value = xScale.invert(d3.mouse(this)[0]);
                    brush.extent([value, value]);
                }

                targetFunction(brush.extent()[0]);
                handle.attr("cx", xScale(value));
            }

        };

        chart.targetFunction = function(_) {
            if (!arguments.length) return targetFunction;
            targetFunction = _;
            return chart;
        };

        chart.width = function(_) {
            if (!arguments.length) return width;
            width = _;
            return chart;
        };

        return chart;
    };

    randomFinding.randomFindingLinear = function() {
        var margin = {top: 20, right: 20, bottom: 40 , left: 20};

        var width=220 - margin.left - margin.right;
        var height=220 - margin.top - margin.bottom;
        var stepCounts = [];

        var numPointsX=10;
        var numPointsY=5;
        var pointRadius=5;
        var transitionDuration = 100;

        var steps = 0;

        var chart = function(selection) {
           selection.each(function(data) {
                var svg = d3.select(this).selectAll('svg').data([data]);

                var gEnter = svg.enter().append('svg')
                .append('g')
                .attr('transform', 'translate(' + margin.left + ',0)');

                var gSlider = gEnter.append('g')
                .attr('transform', 'translate(0, ' + (height + margin.bottom/2) + ')')
                .call(randomFinding.durationSlider().width(width)
                      .targetFunction(
                        function(x) { 
                          console.log('x:', x);
                          transitionDuration = 1000 * x; 
                      }
                      ));

                svg.attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom);

                var gridWidthX = (width) / numPointsX;
                var gridWidthY = (height) / numPointsY;

                if (gridWidthX < gridWidthY) {
                    //xPoints are more tightly packed than yPoints
                    xMargin = 0;
                    yMargin = (height - (numPointsY - 1) * gridWidthX) / 2;
                } else {
                    yMargin = 0;
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
                .attr('r', function(d) { return pointRadius; })
                .classed('chaser', true)
                .attr('transform', function(d) {
                    return 'translate(' + xScale(d[0]) + ',' + yScale(d[1]) + ')';
                });

                gEnter.selectAll('runner')
                .data([randomPosition()])
                .enter()
                .append('circle')
                .attr('r', function(d) { return pointRadius; })
                .classed('runner', true)
                .attr('transform', function(d) {
                    return 'translate(' + xScale(d[0]) + ',' + yScale(d[1]) + ')';
                });

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

                    var prevPosRunner = runner.data()[0];
                    var prevPosChaser = chaser.data()[0];

                    if (chaser.data()[0][0] == runner.data()[0][0] &&
                        chaser.data()[0][1] == runner.data()[0][1]) {
                        stepCounts.push(steps);

                        //console.log('stepCounts:', stepCounts);

                        explode(gEnter, [xScale(chaser.data()[0][0]),
                                      yScale(chaser.data()[0][1])],
                               transitionDuration * 2);
                        
                        chaser.data([randomPosition()]);
                        runner.data([randomPosition()]);
                        steps = 0;

                        chaser.data([randomPosition()]).transition()
                        .duration(transitionDuration)
                        .attr('transform', function(d) {
                            return 'translate(' + xScale(d[0]) + ',' + yScale(d[1]) + ')';
                        });

                        runner.data([randomPosition()]).transition()
                        .duration(transitionDuration)
                        .attr('transform', function(d) {
                            return 'translate(' + xScale(d[0]) + ',' + yScale(d[1]) + ')';
                        });

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
                    .attrTween('transform', motionTrailTween(
                        gEnter,
                        [xScale(newChaserPosition[0]), yScale(newChaserPosition[1])],
                        d3.transform(chaser.attr('transform')).translate,
                        transitionDuration * 10));

                    runner.data([newRunnerPosition]).transition()
                    .duration(transitionDuration)
                    .attrTween('transform', motionTrailTween(
                        gEnter,
                        [xScale(newRunnerPosition[0]), yScale(newRunnerPosition[1])],
                        d3.transform(runner.attr('transform')).translate,
                        transitionDuration * 10));

                    steps += 1;
                    setTimeout(step, transitionDuration);
                }

                console.log('points', points);
                
                step();
           });
        };

        chart.width = function(_) {
            if (!arguments.length) return width + margin.left + margin.right;
            width = _ - margin.left - margin.right;
            return chart;
        };

        chart.height = function(_) {
            if (!arguments.length) return height + margin.top + margin.bottom;
            height = _ - margin.top - margin.bottom;
            return chart;
        };

        return chart;
    };

    function explode(targetSelection, pos, duration) {
        //Create an exploding circle at position pos

        targetSelection.append('circle')
        .attr('cx', pos[0])
        .attr('cy', pos[1])
        .attr('r', 0)
        .classed('exploding-circle', true)
        .transition()
        .duration(1000)
        .attr('r', 30)
        .style('opacity', 0)
        .remove();
    }

    function motionTrailTween(targetSelection, newPos, prevPos, duration) {
        var prevX = prevPos[0];
        var prevY = prevPos[1];

        var prevTimeX = prevX;
        var prevTimeY = prevY;

        return function(d,i,a) {
            var dThis = this;
            //console.log('d3.select(dThis)', d3.select(dThis).attr('fill'));

            return function(t) {

                var newX = prevX + (newPos[0] - prevX) * t;
                var newY = prevY + (newPos[1] - prevY) * t;

                targetSelection.append('path')
                .datum([[prevTimeX, prevTimeY],[newX, newY]])
                .attr('d', d3.svg.line())
                .attr('stroke', d3.select(dThis).attr('fill'))
                .attr('stroke-width', 2)
                .classed(d3.select(dThis).attr('class'), true)
                .transition()
                .ease('linear')
                .duration(duration / 2)
                .ease('linear')
                .style('opacity', 0)
                .remove();

                prevT = t;
                var ret= 'translate(' + newX + ',' + newY + ')';

                prevTimeX = newX;
                prevTimeY = newY;

                return ret;
            };
        };
    }

    function brushed(d) {

    }

    if (typeof define === "function" && define.amd) define(randomFinding); else if (typeof module === "object" && module.exports) module.exports = randomFinding;
        this.d3 = d3;
    this.randomFinding = randomFinding;
}();

