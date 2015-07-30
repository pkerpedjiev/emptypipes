!function() {
    var randomFinding = {};
    var targetFunction = function(x) {};

    randomFinding.histogramPlot = function() {
        var margin = {top: 20, right: 30, bottom: 20, left: 40};
        var width=420 - margin.left - margin.right;
        var height=220 - margin.top - margin.bottom;
        var gEnter, xScale, yScale;

        var transitionDuration = 100;

        var xScale, yScale;;
        var svg;

        var chart = function(selection) {

            // Generate a Bates distribution of 10 random variables.

            // A formatter for counts.
            var formatCount = d3.format(",.0f");

            xScale = d3.scale.linear()
            .domain([0, 1])
            .range([0, width]);

            var values = []
            var data = d3.layout.histogram()
            .bins(xScale.ticks(20))
            (values);

            yScale = d3.scale.linear()
            .domain([0, d3.max(data, function(d) { return d.y; })])
            .range([height, 0]);

            xAxis = d3.svg.axis()
            .scale(xScale)
            .ticks(3)
            .orient("bottom");

            yAxis = d3.svg.axis()
            .scale(yScale)
            .ticks(3)
            .orient("left");

            svg = selection.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            var bar = svg.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr('x', function(d) { return xScale(d.x) + 1;} )
            .attr('y', function(d) { return yScale(d.y) + 1;} )
            .attr("width", xScale(data[0].dx) - 1)
            .attr("height", function(d) { return height - yScale(d.y); });
            //.attr("transform", function(d) { return "translate(" + xScale(d.x) + "," + yScale(d.y) + ")"; });

            /*
            bar.append("rect")
            .attr("x", 1)
            .attr("width", xScale(data[0].dx) - 1)
            .attr("height", function(d) { return height - yScale(d.y); });
            */

            svg.append("g")
            .attr('class', 'histogram-axis histogram-x-axis')
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

            svg.append('g')
            .attr('class', 'histogram-axis histogram-y-axis')
            .call(yAxis);

            svg.append("text")
            .attr("class", "histogram-label")
            .attr("text-anchor", "middle")
            .attr("x", width / 2)
            .attr("y", height + 30)
            .text('Moves to meeting');

            svg.append("text")
            .attr("class", "histogram-label")
            .attr("text-anchor", "end")
            .attr('x', 0)
            .attr("y", -37)
            .attr("dy", ".75em")
            .attr("transform", "rotate(-90)")
            .text("# of simulations");

            svg.append("text")
            .attr("class", 'move-counter-label')
            .attr('text-anchor', 'end')
            .attr('x', 75)
            .attr('y', -20)
            .text('Moves Taken:');

            svg.append("text")
            .attr("class", 'move-counter')
            .attr('text-anchor', 'start')
            .attr('x', 80)
            .attr('y', -20)
            .text('0');

            svg.append("text")
            .attr("id", 'move-mean-label')
            .attr('text-anchor', 'end')
            .attr('x', 75)
            .attr('y', -33)
            .classed('statistic-label', true)
            .text('Mean Moves Taken:');

            svg.append("text")
            .attr("id", 'move-mean')
            .attr('text-anchor', 'start')
            .attr('x', 80)
            .attr('y', -33)
            .classed('statistic-label', true)
            .text('0');

            svg.append("text")
            .attr("id", 'move-median-label')
            .attr('text-anchor', 'end')
            .attr('x', 75)
            .attr('y', -46)
            .classed('statistic-label', true)
            .text('Median Moves Taken:');

            svg.append("text")
            .attr("id", 'move-median')
            .attr('text-anchor', 'start')
            .attr('x', 80)
            .attr('y', -46)
            .classed('statistic-label', true)
            .text('0');

            svg.append("text")
            .attr("id", 'move-stddev-label')
            .attr('text-anchor', 'end')
            .attr('x', 75)
            .attr('y', -59)
            .classed('statistic-label', true)
            .text('Std Moves Taken:');

            svg.append("text")
            .attr("id", 'move-stddev')
            .attr('text-anchor', 'start')
            .attr('x', 80)
            .attr('y', -59)
            .classed('statistic-label', true)
            .text('0');

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

        chart.transitionDuration = function(_) {
            if (!arguments.length) return transitionDuration;
            transitionDuration = _;
            return chart;
        };

        chart.updateMoves = function(newMoves) {
            svg.select('.move-counter')
            .text(newMoves);
        }

        chart.updateData = function(newValues) {
            xScale.domain([-0.01, d3.max(newValues)]);

            var data = d3.layout.histogram()
            .bins(xScale.ticks(20))
            (newValues);

            yScale.domain([0, d3.max(data, function(d) { return d.y; })]);

            var bar = svg.selectAll(".bar")
            .data(data);

            bar.exit().remove();

            bar.enter().append("rect")
            .attr("class", "bar")
            .attr('x', function(d) { return xScale(d.x) + 1;} )
            .attr('y', function(d) { return yScale(d.y) + 1;} )
            .attr("width", xScale(data[0].dx) - 1)
            .attr("height", function(d) { return height - yScale(d.y); });

            bar.transition()
            .attr("class", "bar")
            .attr('x', function(d) { return xScale(d.x) + 1;} )
            .attr('y', function(d) { return yScale(d.y) + 1;} )
            .attr("width", xScale(data[0].dx) - 1)
            .attr("height", function(d) { return height - yScale(d.y); });

            bar.transition()
            .attr("class", "bar")
            .attr('x', function(d) { return xScale(d.x) + 1;} )
            .attr('y', function(d) { return yScale(d.y) + 1;} )
            .attr("width", xScale(data[0].dx) - 1)
            .attr("height", function(d) { return height - yScale(d.y); });

            svg.select('.histogram-x-axis')
            .call(xAxis);

            svg.select('.histogram-y-axis')
            .call(yAxis);

            var formatMean = d3.format(",.1f");
            svg.select('#move-mean')
            .text(formatMean(math.mean(newValues)));

            svg.select('#move-median')
            .text(formatMean(math.median(newValues)));

            svg.select('#move-stddev')
            .text(formatMean(math.std(newValues)));

            svg.select('.move-counter')
            .transition()
            .duration(transitionDuration)
            .attr('x', xScale(newValues[newValues.length-1]))
            .attr('y', height)
            .transition()
            .duration(0)
            .attr('x', 80)
            .attr('y', -20);
        };

        return chart;
    };

    randomFinding.durationSlider = function() {
        var width = 100;

        var chart = function(selection) {
            var xScale = d3.scale.linear()
            .domain([0.01, 0.6])
            .range([0, width])
            .clamp(true);

            var brush = d3.svg.brush()
            .x(xScale)
            .extent([0.1, 0.1])   //default duration is set here
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

            // Add the label for the slider
            selection.append("text")
            .attr("class", "speed-label")
            .attr("text-anchor", "middle")
            .attr("x", width / 2)
            .attr("y", 35)
            .text('Speed per move (seconds)');

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

    randomFinding.randomFindingOptions = function() {
        var selectXValues, selectYValues, selectSpeedValues;
        var selectStrategyRunner, selectStrategyChaser;

        var optionsX, optionsY, optionsSpeed;
        var optionsStrategy1, optionsStrategy2;

        var radioWaiting;
        var targetChartDiv='#random-finding-linear';
        var oldChart = null;

        var chart = function(selection) {
            var heightOptionValues = [1,2,3,4,5,6,7,8,16];
            var widthOptionValues = [1,2,3,4,5,6,7,8,16];
            var optionSpeedValues = [{'name': 'slow',
                                     'value': 400},
                                     {'name': 'medium',
                                     'value': 200},
                                     {'name': 'fast',
                                      'value': 10}];
            var optionStrategies = ['standing', 'random', 'avoiding', 'scanning'];
            
           var table = selection.select('#options-table') ;
            row = table.append('tr');

            var td1 = row.append('td');

            td1.append('label')
            .attr('for', 'xPosValues')
            .text("Width:")
            .style('margin-right', 10);
                
            selectXValues  = td1.append("select")
            .on("change", xChange)
            .attr('id', 'xPosValues');

            var td2 = row.append('td');

            td2.append('label')
            .attr('for', 'xPosValues')
            .text("Height:")
            .style('margin-right', 10)

            selectYValues  = td2.append("select")
            .on("change", yChange)
            .attr('id', 'yPosValues');

            var td3 = row.append('td');
            td3.append('label')
            .attr('for', 'speedValues')
            .text("Speed:")
            .style('margin-right', 10)

            var td4 = row.append('td');

            td4.append('button')
            .text('Restart')
            .on('click', reloadClicked);

            selectSpeedValues  = td3.append("select")
            .on("change", speedChange)
            .attr('id', 'speedValues');

            selectStrategy1 = selection.select('#selectStrategy1')
            .on('change', reloadClicked);
            selectStrategy2 = selection.select('#selectStrategy2')
            .on('change', reloadClicked);

            optionsX = selectXValues.selectAll('option')
            .data(widthOptionValues)
            .enter()
            .append('option')
            .text(function(d) { return d; })
            .property('selected', function(d) { return d === oldChart.numPointsX(); });

            optionsY = selectYValues.selectAll('option')
            .data(heightOptionValues)
            .enter()
            .append('option')
            .text(function(d) { return d; })
            .property('selected', function(d) { return d === oldChart.numPointsY(); }); // Data join

            optionsSpeed = selectSpeedValues.selectAll('option')
            .data(optionSpeedValues)
            .enter()
            .append('option')
            .text(function(d) { return d.name; })
            .property('selected', function(d) { return d.value === oldChart.transitionDuration(); });

            console.log(oldChart.strategyRunner());
            optionsStrategy1 = selectStrategy1.selectAll('option')
            .data(optionStrategies)
            .enter()
            .append('option')
            .text(function(d) { return d; })
            .property('selected', function(d) { return d == oldChart.strategyRunner(); });

            optionsStrategy2 = selectStrategy2.selectAll('option')
            .data(optionStrategies)
            .enter()
            .append('option')
            .text(function(d) { return d; })
            .property('selected', function(d) { return d == oldChart.strategyChaser(); });
        };

        function reloadClicked() {
            var newChart = randomFinding.randomFindingLinear();

            var selectedIndex = selectXValues.property('selectedIndex'),
                data           = optionsX[0][selectedIndex].__data__;

            newChart.numPointsX(data);

            selectedIndex = selectYValues.property('selectedIndex');
            data           = optionsY[0][selectedIndex].__data__;

            newChart.numPointsY(data);

            selectedIndex = selectSpeedValues.property('selectedIndex');
            data           = optionsSpeed[0][selectedIndex].__data__;
            newChart.transitionDuration(data.value);

            selectedIndex = selectStrategy1.property('selectedIndex');
            data           = optionsStrategy1[0][selectedIndex].__data__;

            console.log('data:', data);
            newChart.strategyRunner(data);

            selectedIndex = selectStrategy2.property('selectedIndex');
            data           = optionsStrategy2[0][selectedIndex].__data__;

            console.log('dataChaser:', data);
            newChart.strategyChaser(data);


            if (oldChart !== null)
                oldChart.running(false);

            d3.select(targetChartDiv)
            .selectAll('svg')
            .remove();

            oldChart = newChart;

            d3.select(targetChartDiv)
            .call(newChart);
        }

        function xChange() {
            var selectedIndex = selectXValues.property('selectedIndex'),
                    data          = optionsX[0][selectedIndex].__data__;

                    console.log('data:', data);

                if (oldChart !== null) {
                    /*
                    oldChart.numPointsX(data);
                    oldChart.redrawGrid();
                    */

                    reloadClicked();
                }
        }

        function yChange() {
            var selectedIndex = selectYValues.property('selectedIndex'),
                    data          = optionsY[0][selectedIndex].__data__;
                console.log('data:', data);

                if (oldChart !== null) {
                    /*
                    oldChart.numPointsY(data);
                    oldChart.redrawGrid();
                    */

                    reloadClicked();
                }
        }

        function speedChange() {
            var selectedIndex = selectSpeedValues.property('selectedIndex'),
                    data          = optionsSpeed[0][selectedIndex].__data__;

                    console.log('data', data)
                    if (oldChart !== null) {
                        oldChart.transitionDuration(data.value);
                    }
        }
        
        chart.targetChartDiv = function(_) {
            if (!arguments.length) return targetChartDiv;
            targetChartDiv = _;
            return chart;
        };

        chart.oldChart = function(_) {
            if (!arguments.length) return oldChart;
            oldChart = _;
            return chart;
        };

        return chart;
    };

    randomFinding.randomFindingLinear = function() {
        var histogramWidth = 170;

        var margin = {top: 20, right: 40 + histogramWidth, bottom: 20 , left: 10};

        var width=420 - margin.left - margin.right;
        var height=220 - margin.top - margin.bottom;
        var stepCounts = [];

        var numPointsX=6;
        var numPointsY=2;
        var pointRadius=5;
        var transitionDuration = 200;
        var running = true;

        var steps = 0;
        var xScale, yScale;
        var gEnter;

        var strategyRunner = 'standing';
        var strategyChaser = 'avoiding';

        var runnerDirection = [1,1];
        var chaserDirection = [-1,-1];

        var timesVisitedRunner;
        var timesVisitedChaser;


        function createEmptyGrid() {
            var emptyGrid = [];
            for (var i = 0; i < numPointsX; i++) {
                var thisRow = [];

                for (var j = 0; j < numPointsY; j++) 
                    thisRow.push(0);

                emptyGrid.push(thisRow);
            }

            return emptyGrid;
        }

        var chart = function(selection) {
            var svg = selection.append('svg');

            gEnter = svg.append('g')
            .attr('transform', 'translate(' + margin.left + ',' +  margin.top + ')');


            var hist = randomFinding.histogramPlot()
            .width(histogramWidth)
            .height(height - 50);

            console.log('blah 2;');
            var gHistogram = svg.append('g')
            .attr('transform', 'translate(' + (margin.left + width + 40 ) + ',' + (margin.bottom + 14 + 20) + ')')
            .classed('histogram', true)
            .call(hist);

            /*
               var gSlider = gEnter.append('g')
               .attr('transform', 'translate(0, ' + (height + margin.bottom/2) + ')')
               .call(randomFinding.durationSlider().width(width)
               .targetFunction(
               function(x) { 
               transitionDuration = 1000 * x; 
               hist.transitionDuration = 1000 * x;
               }
               ));
               */

            svg.attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom);

            drawGrid();

            gEnter.selectAll('.chaser')
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

            function potentialMoves(currentPosition) {
                var moves = [[-1,-1],[-1,0],[-1,1],
                                      [0,1],[0,-1],
                                      [1,-1],[1,0],[1,0]];
                moves = moves.map(function(d) {
                    return addPosition(currentPosition, d);
                });

                return moves.filter(function(d) {
                    return isValidPosition(d);
                });
            }

            timesVisitedRunner = createEmptyGrid();
            timesVisitedChaser = createEmptyGrid();

            function shuffle(o){
                for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
                return o;
            }

            function getAvoidingMove(currentPosition, timesVisited) {
                var validPositions = potentialMoves(currentPosition);
                validPositions = validPositions.map(function(d) {
                    return [d, timesVisited[d[0]][d[1]]];
                }).sort(function(a,b) { return a[1] - b[1]; })

                //take all equally good positions
                validPositions = validPositions.filter(function(d) { return d[1] == validPositions[0][1]; });
                shuffle(validPositions);
                
                console.log('validPositions:', validPositions[0], validPositions[1], validPositions[2]);
                return validPositions[0][0];
            }

            function getScanningMove(currentPosition, previousDirection) {
                // move in the y direction
                var newPosition = addPosition(currentPosition, [0, previousDirection[1]]);
                
                if (!isValidPosition(newPosition)) {
                    // didn't work, move in the x-direction
                    // and reverse the y-direction for the next move
                    newPosition = addPosition(currentPosition, [previousDirection[0], 0]);
                    previousDirection[1] = -previousDirection[1];
                }

                if (!isValidPosition(newPosition)) {
                    //didn't work move back in the x direction, keep the
                    //reversed y direction and reverse the x-direction 
                    newPosition = addPosition(currentPosition, [-previousDirection[0], 0]);
                    previousDirection[0] = -previousDirection[0];
                }

                return [newPosition, previousDirection];
            }

            function step() {
                if (!running)
                    return;

                var chaser = gEnter.select('.chaser');
                var runner = gEnter.select('.runner');

                var prevPosRunner = runner.data()[0];
                var prevPosChaser = chaser.data()[0];

                timesVisitedRunner[prevPosRunner[0]][prevPosRunner[1]] += 1;
                timesVisitedChaser[prevPosChaser[0]][prevPosChaser[1]] += 1;

                if (chaser.data()[0][0] == runner.data()[0][0] &&
                    chaser.data()[0][1] == runner.data()[0][1]) {
                    stepCounts.push(steps);

                timesVisitedRunner = createEmptyGrid();
                timesVisitedChaser = createEmptyGrid();

                //console.log('stepCounts:', stepCounts);

                hist.updateData(stepCounts);
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
                    if (strategyChaser == 'standing') {
                        newChaserPosition = chaser.data()[0];
                    } else if (strategyChaser == 'random') {
                        newChaserPosition = addPosition(chaser.data()[0],
                                                        randomDirection());
                        console.log('newChaserPosition', newChaserPosition);
                    } else if (strategyChaser == 'avoiding') {
                        newChaserPosition = getAvoidingMove(chaser.data()[0],
                                                           timesVisitedChaser);
                    } else if (strategyChaser = 'scanning') {
                        var ret = getScanningMove(chaser.data()[0], chaserDirection);
                        newChaserPosition = ret[0];
                        chaserDirection = ret[1];
                    }
                } while (!isValidPosition(newChaserPosition));

                do {
                    if (strategyRunner == 'standing') {
                        newRunnerPosition = runner.data()[0];
                    } else if (strategyRunner == 'random') {
                        newRunnerPosition = addPosition(runner.data()[0],
                                                        randomDirection());
                    } else if (strategyRunner == 'avoiding') {
                        newRunnerPosition = getAvoidingMove(runner.data()[0],
                                                            timesVisitedRunner);
                    } else if (strategyRunner = 'scanning') {
                        var ret = getScanningMove(runner.data()[0], runnerDirection);
                        newRunnerPosition = ret[0];
                        runnerDirection = ret[1];
                    }

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
                        hist.updateMoves(steps);

                        setTimeout(step, transitionDuration);
            }

            step();
        };

        function randomPosition() {
            return [Math.floor(Math.random() * numPointsX),
                Math.floor(Math.random() * numPointsY)];
        }

    drawGrid = function() {
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

            console.log('yMargin', yMargin);

            xScale = d3.scale.ordinal().domain(d3.range(numPointsX))
             .rangePoints([xMargin,width-xMargin]);
            yScale = d3.scale.ordinal().domain(d3.range(numPointsY))
            .rangePoints([yMargin,height-yMargin]);

            var points = [];
            for (var i = 0; i < numPointsX; i++)
                for (var j = 0; j < numPointsY; j++)
                    points.push([i, j]);

            var pointSelection = gEnter.selectAll('.grid-point')
            .data(points);


            var exitSelection = pointSelection.exit();
            exitSelection.remove();

            pointSelection.enter()
            .append('circle')
            .attr('cx', function(d) { return xScale(d[0]); })
            .attr('cy', function(d) { return yScale(d[1]); })
            .attr('r', function(d) { return pointRadius; })
            .classed('grid-point', true);
            
            pointSelection
            .attr('cx', function(d) { return xScale(d[0]); })
            .attr('cy', function(d) { return yScale(d[1]); })
            .attr('r', function(d) { return pointRadius; });
    };

    chart.redrawGrid = function() {
        var chaser = gEnter.select('.chaser');
        var runner = gEnter.select('.runner');

        chaser.data([randomPosition()]);
        runner.data([randomPosition()]);

        drawGrid();    
    };

        chart.strategyRunner = function(_) {
            if (!arguments.length) return strategyRunner;
            strategyRunner = _;
            return chart;
        };

        chart.strategyChaser = function(_) {
            if (!arguments.length) return strategyChaser;
            strategyChaser = _;
            return chart;
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

        chart.numPointsX = function(_) {
            if (!arguments.length) return numPointsX;
            numPointsX = _;
            return chart;
        };
        
        chart.numPointsY = function(_) {
            if (!arguments.length) return numPointsY;
            numPointsY = _;
            return chart;
        };

        chart.running = function(_) {
            if (!arguments.length) return running;
            running = _;
            return chart;
        };

        chart.transitionDuration = function(_) {
            if (!arguments.length) return transitionDuration;
            transitionDuration = _;
            return chart;
        };

        chart.runnerFixed = function(_) {
            if (!arguments.length) return runnerFixed;
            runnerFixed = _;
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


    if (typeof define === "function" && define.amd) define(randomFinding); else if (typeof module === "object" && module.exports) module.exports = randomFinding;
        this.d3 = d3;
    this.randomFinding = randomFinding;
}();

