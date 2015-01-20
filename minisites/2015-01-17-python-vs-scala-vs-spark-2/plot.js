var margin = {top: 50, right: 40, bottom: 30, left: 50},
width = 380 - margin.left - margin.right,
height = 300 - margin.top - margin.bottom;

// python / scala far left labels
var y0 = d3.scale.ordinal()
.rangeRoundBands([0, height], 0.1);

// number of cores labels
var y1 = d3.scale.ordinal();

var x = d3.scale.linear()
.range([0, width]);

var color = d3.scale.category10();

var xAxis = d3.svg.axis()
.scale(x)
.orient("top")
.ticks(5);

var yAxis = d3.svg.axis()
.scale(y0)
.orient("left");


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
.html('Execution Time of Each Step in the Workflow (seconds)');

d3.json("data.json", function(error, data) {
    var categories = d3.set(data.values.map(function(d) { return d.category; })).values();
    var groups = d3.set(data.values.map(function(d) { return d.group; })).values();
    var steps = d3.set(data.values.map(function(d) { return d.step; })).values();

    color.domain(categories);

    var nestedData = d3.nest()
    .key(function(d) { return d.group; })
    .key(function(d) { return d.category; })
    .entries(data.values);

    nestedData.forEach(function(d) {
        //groups
        d.values.forEach(function(d1) {
            //categories
            var base_value = 0;
            var sorted_values = d1.values.sort(function(a,b) { return (+a.step) - (+b.step); });

            // find the starting y-position of each rect so that they can be stacked
            sorted_values.forEach(function(d2) {
                d2.base_value = base_value;
                base_value += +d2.value;
            });
        });
    });


    y0.domain(groups);
    y1.domain(categories).rangeRoundBands([0, y0.rangeBand()], 0.1);
    x.domain([0, d3.max(data.values, function(d) { return (+d.base_value + d.value); })]);

    var yAxis1 = d3.svg.axis()
    .scale(y1)
    .orient("left");

    console.log('x.domain()', x.domain());

    var axis = svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + 0 + ")")
    .call(xAxis);

    svg.selectAll(".xlabels")
    .data(groups)
    .enter()
    .append('text')
    .attr('text-anchor', 'middle')
    .style('font-weight', 'bold')
    .attr('transform', function(d) {
        return "translate(-25," + (y0(d) + y0.rangeBand() / 2) + ")rotate(-90) ";
    })
    .text(function(d) { 
        return d + " cores"; 
    });

    var groups = svg.selectAll(".group")
    .data(nestedData)
    .enter().append("g")
    .attr("class", "g")
    .attr("transform", function(d) { 
        console.log("d.group:", d.key); 
        return "translate(" + 0 + "," + y0(d.key) + ")"; 
    });

    groups.append("g")
    .attr("class", "y axis")
    .call(yAxis1);

    var data_id = function(d) {
        return d.category.replace(' ', '_') + '_' + d.group;
    };

    var core_groups_enter = groups.selectAll(".core_group")
    .data(function(d) {
        return d.values;
    })
    .enter();

    var core_groups = core_groups_enter.append("g")
    .attr("class", "g")
    .attr("transform", function(d) {
        return "translate(0," + y1(d.key) + ")";
    });

    var text_id = function(d) {
        return "text_" + d.step;
    };

    var rect_id = function(d) {
        return "rect_" + d.step;
    };

    var rect_unique_id = function(d) {
        return "rect_" + d.group + "_" + d.category + "_" + d.step;
    };

    var text_unique_id = function(d) {
        return "text_" + d.group + "_" + d.category + "_" + d.step;
    };

    var rects = core_groups.selectAll("rect")
    .data(function(d) {
        return d.values;
    })
    .enter()
    .append("rect")
    .attr("height", y1.rangeBand())
    .attr("width", function(d) { return x(d.value); })
    .attr("x", function(d) { return x(d.base_value); })
    .attr("y", 0)
    .attr('id', rect_unique_id)
    .attr('class', rect_id)
    .style('stroke', function(d) { return 'black'; })
    .style('stroke-width', 0)
    .style("fill", function(d) { return color(d.step); })
    .attr('opacity', 0.6)
    .on('mouseover', function(d, i) {
        d3.selectAll('#' + rect_unique_id(d)).attr('opacity', 1);
        d3.selectAll('#' + text_unique_id(d)).attr('visibility', 'visible');
        //d3.selectAll('#' + white_id(d)).attr('visibility', 'visible');
        //d3.selectAll('#' + total_id(d)).attr('visibility', 'visible');
    })
    .on('mouseout', function(d, i) {
        d3.selectAll('#' + rect_unique_id(d)).attr('opacity', 0.6);
        d3.selectAll('#' + text_unique_id(d)).attr('visibility', 'hidden');
        //d3.selectAll('#' + white_id(d)).attr('visibility', 'visible');
        //d3.selectAll('#' + total_id(d)).attr('visibility', 'hidden');
    });

    var labels1 = core_groups.selectAll(".white_text")
    .data(function(d) {
        return d.values;
    })
    .enter()
    .append("text")
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'middle')
    .attr('pointer-events', 'none')
    .style('stroke-width', 2.5)
    .style('stroke', 'white')
    .style('font-weight', 'bold')
    .style('opacity', 0.7)
    .attr("x", function(d) { return x(d.base_value + d.value / 2); })
    .attr("y", function(d) { 
        return y1.rangeBand() / 2;
    })
    .attr('visibility', 'hidden')
    .attr('class', text_id)
    .attr('id', text_unique_id)
    //.attr('transform', function(d) { return 'translate(' + x(d.base_value) + ",)"; })
    .text(function(d) { return d.value; } );

    var labels = core_groups.selectAll(".black_text")
    .data(function(d) {
        return d.values;
    })
    .enter()
    .append("text")
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'middle')
    .attr('pointer-events', 'none')
    .attr("x", function(d) { return x(d.base_value + d.value / 2); })
    .attr("y", function(d) { 
        return y1.rangeBand() / 2;
    })
    .attr('visibility', 'hidden')
    .attr('class', text_id)
    .attr('id', text_unique_id)
    .style('font-weight', 'bold')
    //.attr('transform', function(d) { return 'translate(' + x(d.base_value) + ",)"; })
    .text(function(d) { return d.value; } );


    // label the combined totals
    core_groups
    .append("text")
    .attr('dominant-baseline', 'middle')
    .attr('pointer-events', 'none')
    .attr("x", function(d) { 
        var lastValue = d.values[d.values.length-1];
        console.log('lastValue:', lastValue);
        return 2 + x(lastValue.base_value + lastValue.value); 
    })
    .attr("y", function(d) { 
        return y1.rangeBand() / 2;
    })
    //.attr('visibility', 'hidden')
    //.attr('transform', function(d) { return 'translate(' + x(d.base_value) + ",)"; })
    .text(function(d) { 
        var lastValue = d.values[d.values.length-1];
        return lastValue.base_value + lastValue.value; 
    });
    //end the data block
    //
    step_descriptions = {1: 'map/filter', 2: 'map', 3: 'join', 4:'map', 5: 'reduceByKey', 6: 'map', 7: 'sortByKey'};

    yLegend = d3.scale.ordinal()
    .domain(steps)
    .rangeRoundBands([0, height/2],0.1);
   
    legend = svg.selectAll('.legend_squares')
    .data(steps)
    .enter()
    .append('g');

    legend.append('rect')
    .attr('x', width)
    .attr('y', yLegend)
    .style('stroke', function(d) { return 'black'; })
    .style('stroke-width', 0)
    .attr('class', function(d) { return 'rect_' + d; })
    .attr('width', y1.rangeBand() / 2)
    .attr('height', y1.rangeBand() / 2)
    .attr('fill', color)
    .attr('opacity', 0.6)
    .on('mouseover', function(d, i) {
        d3.selectAll('.rect_' + d).style('stroke-width', 1).attr('opacity', 1);
        d3.selectAll('.text_' + d).attr('visibility', 'visible');
    })
    .on('mouseout', function(d, i) {
        d3.selectAll('.rect_' + d).style('stroke-width', 0).attr('opacity', 0.6);
        d3.selectAll('.text_' + d).attr('visibility', 'hidden');
    });

    legend.append('text')
    .attr('x', width - (y1.rangeBand() / 2 - 6))
    .attr('y', function(d) { return yLegend(d) + y1.rangeBand() / 4;} )
    .attr('dominant-baseline', 'middle')
    .attr('text-anchor', 'end')
    .text(function(d) { return step_descriptions[d]; })
    .on('mouseover', function(d, i) {
        d3.selectAll('.rect_' + d).attr('opacity', 1);
        d3.selectAll('.text_' + d).attr('visibility', 'visible');
    })
    .on('mouseout', function(d, i) {
        d3.selectAll('.rect_' + d).attr('opacity', 0.6);
        d3.selectAll('.text_' + d).attr('visibility', 'hidden');
    });
    
});

