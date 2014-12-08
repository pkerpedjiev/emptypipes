function renderGeneCountsChart() {

d3.json('jsons/gene_counts.json', function(error, data) {
    var margin = {top: 40, right: 50, bottom: 30, left: 80},
    width = 550 - margin.left - margin.right,
    height = 470 - margin.top - margin.bottom;

    var barHeight = 20;

    var y = d3.scale.ordinal()
    .rangeRoundBands([0, barHeight * data.length], 0.1)
    .domain(data.map(function(d) {return d.name; }));

    var x = d3.scale.linear()
    .range([0,width])
    .domain([0, d3.max(data, function(d) { return parseFloat(d.count); })]);

    xAxis = d3.svg.axis()
    .scale(x)
    .orient('top')
    .ticks(5);

    yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

    var chart = d3.select("#gene-counts-chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

    var svg = chart
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("g")
    .attr('class', 'y axis')
    .call(yAxis);

    svg.append("g")
    .attr('class', 'x axis')
    .call(xAxis);

    chart.append('text')
    .attr('class', 'x label')
    .attr('x', margin.left + width / 2)
    .attr('text-anchor', 'middle')
    .style('font-weight', 'bold')
    .attr('y', 10)
    .text('# of citations');

    chart.append('g')
    .attr('transform', 'translate(' + 10 + "," + (margin.top + (barHeight * data.length + 5) / 2) + ")")
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('class', 'y label')
    .style('font-weight', 'bold')
    .attr('text-anchor', 'middle')
    .text('Gene name');

    bars = svg.selectAll('.gbar')
    .data(data)
    .enter()
    .append('g')
    .attr('class', 'gbar')
    .attr('transform', function(d, i) { return "translate(0," + y(d.name) + ")"; });


    bars.append('rect')
    .attr('class', 'bar')
    .attr('width', function(d) { return x(d.count); })
    .attr('height', y.rangeBand());

    bars.append('text')
    .attr("x", 2)
    .attr('y', 0)
    .attr('dy', '12px')
    .style('fill', 'white')
    .text(function(d) { return d.description; });

    bars.append('text')
    .attr("x", function(d) { return x(d.count) + 3; })
    .attr("y", 0)
    .attr("dy", "12px")
    .text(function(d) { return d.count; });

  });
}
