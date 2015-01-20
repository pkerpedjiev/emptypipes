var margin = {top: 50, right: 20, bottom: 30, left: 50},
    width = 440 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

var x0 = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var x1 = d3.scale.ordinal();

var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.category20()

var xAxis = d3.svg.axis()
    .scale(x0)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(d3.format(".2s"))
    .ticks(6);

var chart =d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

var svg = chart.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

chart.append("g")
  .attr('transform', 'translate(' + (margin.left + width/2) + ',' + 18 + ")")
    .append('text')
    .attr('class', 'title')
    .style('font', '15px sans-serif')
    .style('font-weight', 'bold')
    .attr('text-anchor', 'middle')
    .html('Spark Query Run Time using Python, Scala and SQL');

d3.json("data.json", function(error, data) {
  var categories = d3.set(data.values.map(function(d) { return d.category; })).values();
  var groups = d3.set(data.values.map(function(d) { return d.group; })).values();

  color.domain(categories);

  var nestedData = d3.nest()
  .key(function(d) { return d.group })
  .entries(data.values)

  console.log('nestedData', nestedData);

  x0.domain(groups);
  x1.domain(categories).rangeRoundBands([0, x0.rangeBand()]);
  y.domain([0, d3.max(data.values, function(d) { return +d.value })]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      /*
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text(data.y_axis);
      */
    /* Y-axis label */

    chart.append('text')
    .attr('text-anchor', 'middle')
    .attr('transform', 'translate(' + 10 + "," + (margin.top + (height/2)) + ")rotate(-90)")
    .style('font-weight', 'bold')
    .text(data.y_axis)

    chart.append("text")
    .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
    .attr("transform", "translate("+ (margin.left + width/2) +","+(margin.top + height + 30)+")")  // centre below axis
    .style('font-weight', 'bold')
    .text(data.x_axis);

  var groups = svg.selectAll(".group")
      .data(nestedData)
    .enter().append("g")
      .attr("class", "g")
      .attr("transform", function(d) { console.log("d.group:", d.key); return "translate(" + x0(d.key) + ",0)"; });

  var data_id = function(d) {
        return d.category.replace(' ', '_') + '_' + d.group;
  };

  var rects = groups.selectAll("rect")
      .data(function(d) {return d.values;})
    .enter().append("rect")
      .attr("width", x1.rangeBand())
      .attr("x", function(d) { return x1(d.category); })
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) { return height - y(d.value); })
      .attr('class', function(d) { return "rect_" + d.category.replace(' ', '_'); })
      .attr('opacity', 0.7)
      .style("fill", function(d) { return color(d.category); })
      .style('stroke', function(d) { return 'black'; })
      .style('stroke-width', 0)
      .on('mouseover', function(d, i) { 
      d3.select(this).style('stroke-width', 1); 
      d3.select('#' + data_id(d)).style('visibility', 'visible');
      })
      .on('mouseout', function(d, i) { 
      d3.select(this).style('stroke-width', 0);
      d3.select('#' + data_id(d)).style('visibility', 'hidden');
      });

    var texts = groups.selectAll("text")
      .data(function(d) {return d.values;})
    .enter().append("text")
    .attr('visibility', 'hidden')
    .attr('id', data_id)
    .attr('class', function(d) { return "text_" + d.category.replace(' ', '_');})
    .attr('transform', function(d) { return 'translate(' + (x1(d.category) + 4 + x1.rangeBand() / 2) + ',' + (y(d.value) - 5) + ') rotate(-90)'})
    .attr('text-anchor', 'start')
      .text(function(d) { return d.value;} )
 
  var legend = svg.selectAll(".legend")
      .data(categories.slice().reverse())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .attr('class', function(d) { return "rect_" + d.replace(' ', '_'); })
      .style("fill", color)
      .style('stroke', function(d) { return 'black'; })
      .style('stroke-width', 0)
      .on('mouseover', function(d, i) { 
      d3.selectAll("." + "rect_" + d.replace(' ', '_')).style('stroke-width', 1); 
      d3.selectAll('.' + "text_" + d.replace(' ', '_')).style('visibility', 'visible');
      })
      .on('mouseout', function(d, i) { 
      d3.selectAll("." + "rect_" + d.replace(' ', '_')).style('stroke-width', 0); 
      d3.selectAll('.' + "text_" + d.replace(' ', '_')).style('visibility', 'hidden');
      });

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; })
      .on('mouseover', function(d, i) { 
      d3.selectAll("." + "rect_" + d.replace(' ', '_')).style('stroke-width', 1); 
      d3.selectAll('.' + "text_" + d.replace(' ', '_')).style('visibility', 'visible');
      })
      .on('mouseout', function(d, i) { 
      d3.selectAll("." + "rect_" + d.replace(' ', '_')).style('stroke-width', 0); 
      d3.selectAll('.' + "text_" + d.replace(' ', '_')).style('visibility', 'hidden');
      });


});
