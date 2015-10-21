function histogramChart() {
  var margin = {top: 10, right: 3, bottom: 20, left: 3},
      width = 960,
      height = 500;

  var histogram = d3.layout.histogram(),
      x = d3.scale.ordinal(),
      y = d3.scale.linear(),
      xAxis = d3.svg.axis().scale(x).orient("bottom").tickSize(6, 0);


  function chart(selection) {
    selection.each(function(data, index) {
        numbers = { 0: 'None',
                   1: 'One',
                   2: 'Two',
                   3: 'Three',
                   4: 'Four',
                   5: 'Five',
                   6: 'Six',
                   7: 'Seven',
                   8: 'Eight',
                   9: 'All but the last'}
      var header = numbers[index];

      // Compute the histogram.
      data = histogram(data);
      var numValues = data.reduce(function(previousValue, currentValue, index, array) {
                        return previousValue + currentValue.y;
                  }, 0);

      // Update the x-scale.
      x   .domain(data.map(function(d) { return d.x; }))
          .rangeRoundBands([0, width - margin.left - margin.right], .1);

      // Update the y-scale.
      y   .domain([0, 
                  numValues / 2])
                  //d3.max(data, function(d) { return d.y; })])
          .range([height - margin.top - margin.bottom, 0]);

      // Select the svg element, if it exists.
      var svg = d3.select(this).selectAll("svg").data([data]);

      // Otherwise, create the skeletal chart.
      var gEnter = svg.enter().append("svg").append("g");
      gEnter.append("g").attr("class", "bars");
      gEnter.append("g").attr("class", "x axis");
      gEnter.append('text')
      .attr('x', width / 2)
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .classed('chart-title', true)
      .text(header)

      // Update the outer dimensions.
      svg .attr("width", width)
          .attr("height", height);

      // Update the inner dimensions.
      var g = svg.select("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // Update the bars.
      var bar = svg.select(".bars").selectAll(".bar").data(data);
      bar.enter().append("rect");
      bar.exit().remove();
      bar .attr("width", x.rangeBand())
          .attr("x", function(d) { return x(d.x); })
          .attr("y", function(d) { return y(d.y); })
          .attr("height", function(d) { return y.range()[0] - y(d.y); })
          .order();

      // Update the x-axis.
      g.select(".x.axis")
          .attr("transform", "translate(0," + y.range()[0] + ")")
          .call(xAxis);
    });
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

  // Expose the histogram's value, range and bins method.
  d3.rebind(chart, histogram, "value", "range", "bins");

  // Expose the x-axis' tickFormat method.
  d3.rebind(chart, xAxis, "tickFormat");

  return chart;
}


function jewelsMultiHistogram(divName, filename) {
    var margin = {top: 30, left: 20, right: 20, bottom: 20};

    var width = 550 - margin.left - margin.right;
    var height = 400 - margin.top - margin.bottom;

    var svg = d3.select(divName)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

    var mainG = svg.append('g')
    .attr('transform', 'translate(' + margin.left + "," + margin.right + ")");

    mainG.append('text')
    .attr('x', width / 2)
    .attr('y', 5)
    .classed('main-title', true)
    .text('Jewels Seen');

    var numCols = 4;
    var rectGrid = d3.layout.grid()
        .bands()
        .size([width, height])
        .cols(numCols)
        .nodeSize([width/numCols, 100]);

    d3.json(filename, function(jewelPicks) {
        var rectGs = mainG.selectAll('g')
        .data(rectGrid(jewelPicks));

        mainG
        .append('g')
        .attr('transform', 'translate(-10,' + Math.ceil(jewelPicks.length / numCols) * rectGrid.nodeSize()[1] / 2 + ')')
        .append('text')
        .attr('transform', 'rotate(-90)')
        .classed('main-title', true)
        .text('Outcome Frequency')

        mainG
        .append('g')
        .attr('transform', 'translate(' + width/2 + ',' + (Math.ceil(jewelPicks.length / numCols) * rectGrid.nodeSize()[1] + 20) + ')')
        .append('text')
        .classed('main-title', true)
        .text('Picked Jewel Value')

        for (var i=0, seq=[]; i < jewelPicks.length+1; i++) seq.push(i);

        chart = histogramChart().bins(seq)
        .width(rectGrid.nodeSize()[0])
        .height(rectGrid.nodeSize()[1]);

        rectGs.enter().append('g')
        .attr('transform', function(d) { return 'translate(' + d.x + "," + d.y + ")" })
        .call(chart)

        rectGs.each(function(d) {
            var data = d3.layout.histogram()
            .bins(seq)
            (d);

        });

    });

}

function regressionPlot() {
    var margin = {top: 20, right: 80, bottom: 35, left: 40};

    var width = 400, height=200;
    width = width - margin.left - margin.right;
    height = height - margin.top - margin.bottom;

    function linearRegression(y,x){
        /* Courtesy Trent Richardson
         *
         * http://trentrichardson.com/2010/04/06/compute-linear-regressions-in-javascript/
         */
        var lr = {};
        var n = y.length;
        var sum_x = 0;
        var sum_y = 0;
        var sum_xy = 0;
        var sum_xx = 0;
        var sum_yy = 0;

        for (var i = 0; i < y.length; i++) {
            
            sum_x += x[i];
            sum_y += y[i];
            sum_xy += (x[i]*y[i]);
            sum_xx += (x[i]*x[i]);
            sum_yy += (y[i]*y[i]);
        } 
        
        lr['slope'] = (n * sum_xy - sum_x * sum_y) / (n*sum_xx - sum_x * sum_x);
        lr['intercept'] = (sum_y - lr.slope * sum_x)/n;
        lr['r2'] = Math.pow((n*sum_xy - sum_x*sum_y)/Math.sqrt((n*sum_xx-sum_x*sum_x)*(n*sum_yy-sum_y*sum_y)),2);
        lr['fn'] = function (x) { return this.slope * x + this.intercept; };
        
        return lr;
    }

    function chart(selection) {
        selection.each(function(data, index) {
          // Select the svg element, if it exists.
          var svg = d3.select(this).selectAll("svg").data([data]);

          // Otherwise, create the skeletal chart.
          var gEnter = svg.enter().append("svg")
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
          .append("g")
          .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

            // the data will be in the form [[0,1],[2,5],[4,5]]
            // a two-dimensional array with x and y value pairs
            var xScale = d3.scale.linear()
            .domain(d3.extent(data, function(d) { return +d.num; }))
            .range([0, width]);

            var yScale = d3.scale.linear()
            .domain(d3.extent(data, function(d) { return +d.best; }))
            .range([height, 0]);


            var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("bottom");

            var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left");

            gEnter.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + height + ')')
            .call(xAxis);

            gEnter.append('g')
            .attr('class', 'y axis')
            .call(yAxis);

            var lineBest = d3.svg.line()
                .x(function(d) { return xScale(+d.num); })
                .y(function(d) { return yScale(+d.best); });

            var lineMean = d3.svg.line()
                .x(function(d) { return xScale(+d.num); })
                .y(function(d) { return yScale(+d.mean); });

            gEnter.append('path')
            .datum(data)
            .attr('class', 'line-best')
            .attr('d', lineBest);

            gEnter.append('path')
            .datum(data)
            .attr('class', 'line-mean')
            .attr('d', lineMean);

            // Add the axes
            gEnter.append('text')
            .attr('y', height + 33)
            .attr('x', width / 2)
            .classed('axis-label', true)
            .text('Total Number of Jewels')

            gEnter.append('g')
            .attr('transform', 'translate(-30,' + (height/2) + ")")
            .append('text')
            .attr('transform', 'rotate(-90)')
            .classed('axis-label', true)
            .text('Ideal Number to Throw Out');


            //add the descriptory labels
            gEnter.append('text')
            .attr('x', xScale(101))
            .attr('y', yScale(data[data.length-1].best))
            .classed('line-label', true)
            .text('Maximizing');

            gEnter.append('text')
            .attr('x', xScale(101))
            .attr('y', yScale(data[data.length-1].best))
            .attr('dy', 13)
            .classed('line-label', true)
            .text('Best Value');

            gEnter.append('text')
            .attr('x', xScale(101))
            .attr('y', yScale(data[data.length-1].mean))
            .classed('line-label', true)
            .html('Maximizing');

            gEnter.append('text')
            .attr('x', xScale(101))
            .attr('y', yScale(data[data.length-1].mean))
            .attr('dy', 13)
            .classed('line-label', true)
            .html('Mean Value');

            // calculate the regressions
            var regBest = linearRegression(
                data.map(function(d) { return +d.best; }),
                data.map(function(d) { return +d.num; }));
            var regMean = linearRegression(
                data.map(function(d) { return +d.mean; }),
                data.map(function(d) { return +d.num; }));

            console.log('regBest:', regBest);
            console.log('regBest:', regMean);

            gEnter.append('line')
            .attr('x1', xScale(0))
            .attr('y1', yScale(regBest.fn(0)))
            .attr('x2', xScale(data[data.length-1].num))
            .attr('y2', yScale(regBest.fn(data[data.length-1].num)))
            .attr('class', 'line-best')
            .attr('stroke-dasharray', '2,2')

            gEnter.append('line')
            .attr('x1', xScale(0))
            .attr('y1', yScale(regMean.fn(0)))
            .attr('x2', xScale(data[data.length-1].num))
            .attr('y2', yScale(regMean.fn(data[data.length-1].num)))
            .attr('class', 'line-mean')
            .attr('stroke-dasharray', '2,2')

            gEnter.append('text')
            .attr('x', xScale(data[data.length / 2].num))
            .attr('y', yScale(data[data.length / 2].mean))
            .attr('dy', 16)
            .classed('line-label', true)
            .text('Slope: ' + d3.format('.2f')(regMean.slope) + ' (r=' + d3.format('.2f')(Math.sqrt(regMean.r2)) + ')');

            gEnter.append('text')
            .attr('x', xScale(data[3 * data.length / 5].num))
            .attr('y', yScale(data[data.length / 2].best))
            .attr('dy', -18)
            .classed('line-label', true)
            .style('text-anchor', 'end')
            .text('Slope: ' + d3.format('.2f')(regBest.slope) + ' (r=' + d3.format('.2f')(Math.sqrt(regBest.r2)) + ')');

        });
    }

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

function jewelsRegressionLineChart(divName, filename) {
    var regressionChart = regressionPlot();

    /*
    */

    d3.csv(filename, function(data) {
        console.log('data', data);

        d3.select(divName)
        .datum(data)
        .call(regressionChart);
    });
}

function kingsJewelsExample() {
    jewelsMultiHistogram('#plotting-area', '/jsons/10.json');
    jewelsMultiHistogram('#plotting-area-normal', '/jsons/10_normal.json');
    jewelsMultiHistogram('#plotting-area-exponential', '/jsons/10_exponential.json');

    jewelsRegressionLineChart('#regression-area', '/jsons/all_stats_uniform.csv');
    jewelsRegressionLineChart('#regression-area-normal', '/jsons/all_stats_normal.csv');
    jewelsRegressionLineChart('#regression-area-exponential', '/jsons/all_stats_exponential.csv');
}

