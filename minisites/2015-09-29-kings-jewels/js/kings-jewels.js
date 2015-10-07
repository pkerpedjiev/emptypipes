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
                      console.log('previousValue', previousValue, currentValue);
                        return previousValue + currentValue.y;
                  }, 0);

        console.log('numValues:', numValues);
      //console.log('data:', data);

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
        /*
        .append('rect')
        .attr("class", "rect")
        .attr("width", rectGrid.nodeSize()[0])
        .attr("height", rectGrid.nodeSize()[1])
        //.attr("transform", function(d) { return "translate(" + (d.x)+ "," + d.y + ")"; })
        .style("opacity", 1)
        .style('fill', 'transparent')
        .style('stroke', 'black');
        */

        rectGs.each(function(d) {
            var data = d3.layout.histogram()
            .bins(seq)
            (d);

            //console.log('data:', data);
        });

    });

}

function regressionPlot() {
    var margin = {top: 20, right: 80, bottom: 35, left: 40};

    var width = 400, height=200;
    width = width - margin.left - margin.right;
    height = height - margin.top - margin.bottom;

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
            .text('Ideal Number to Throw Out')

            gEnter.append('text')
            .attr('x', xScale(41))
            .attr('y', yScale(15.5))
            .classed('line-label', true)
            .text('Maximizing')

            gEnter.append('text')
            .attr('x', xScale(41))
            .attr('y', yScale(14))
            .classed('line-label', true)
            .text('Best Value')

            gEnter.append('text')
            .attr('x', xScale(41))
            .attr('y', yScale(6.5))
            .classed('line-label', true)
            .html('Maximizing')

            gEnter.append('text')
            .attr('x', xScale(41))
            .attr('y', yScale(5))
            .classed('line-label', true)
            .html('Mean Value')

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

function jewelsRegressionLineChart() {
    var regressionChart = regressionPlot();

    /*
    */

    d3.csv('/jsons/all_stats.csv', function(data) {
        console.log('data', data);

        d3.select('#regression-area')
        .datum(data)
        .call(regressionChart);
    });
}

function kingsJewelsExample() {
    jewelsMultiHistogram('#plotting-area', '/jsons/10.json');
    jewelsMultiHistogram('#plotting-area1', '/jsons/10_normal.json');
    jewelsRegressionLineChart();
}

