function renderGeneCountsChart() {

d3.json('/jsons/gene_counts.json', function(error, data) {
    var barHeight = 20;

    var margin = {top: 40, right: 50, bottom: 30, left: 120},
    width = 550 - margin.left - margin.right,
    height = barHeight * data.length;

    //height = 450 - margin.top - margin.bottom;

    var y = d3.scale.ordinal()
    .rangeBands([0, barHeight * data.length], 0.1)
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

    /* X-axis label */

    chart.append('text')
    .attr('class', 'x label')
    .attr('x', margin.left + width / 2)
    .attr('text-anchor', 'middle')
    .style('font-weight', 'bold')
    .attr('y', 10)
    .text('# of citations');

    /* Y-axis label */

    chart.append('g')
    .attr('transform', 'translate(' + 40 + "," + (margin.top + (barHeight * data.length + 5) / 2) + ")")
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('class', 'y label')
    .style('font-weight', 'bold')
    .attr('text-anchor', 'middle')
    .text('Gene name');

    /* Create the actual bars with the full name of the gene on the inside
     * and the symbol for the gene on the outside */

    bars = svg.selectAll('.gbar')
    .data(data)
    .enter()
    .append('g')
    .attr('class', 'gbar')
    .attr('transform', function(d, i) { return "translate(0," + y(d.name) + ")"; });

    species_array = data.map(function(d) {return d.species; });
    unique_species = d3.set( species_array ).values();

    species_colors = d3.scale.category10()
    .domain(unique_species);

    bars.append('rect')
    .attr('class', 'bar')
    .attr('width', function(d) { return x(d.count); })
    .attr('height', y.rangeBand())
    .style('fill', function(d) { return species_colors(d.species); });

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


    /* Add a legend to the lower right hand side */
    var yLegend = d3.scale.ordinal()
    .rangeBands([barHeight * (data.length - unique_species.length), barHeight * data.length], 0.1)
    //.rangeBands([barHeight * data.length, barHeight * (data.length - unique_species.length)], 0.1)
    .domain(unique_species);

    legend = svg.selectAll('.legend')
    .data(unique_species)
    .enter()
    .append('g')
    .attr('class', 'legend')
    .attr('transform', function(d, i) { return "translate(" +  (width - yLegend.rangeBand()) + "," + yLegend(d) + ")"; }) ;

    legend.append('rect')
    .attr('class', 'bar')
    .attr('width', yLegend.rangeBand())
    .attr('height', yLegend.rangeBand())
    .style('fill', function(d) { return species_colors(d); });

    legend.append('text')
    .attr('x', -2)
    .attr('text-anchor', 'end')
    .attr('y', 0)
    .attr('dy', '12px')
    .text(function(d) { return d; } );
  });
}
