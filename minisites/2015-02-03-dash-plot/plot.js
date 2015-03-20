var margin = {top: 80, right: 80, bottom: 80, left: 80},
    width = 720 - margin.left - margin.right,
    height = 320 - margin.top - margin.bottom;

var x0 = d3.scale.ordinal()
    .rangeRoundBands([0, width], 0.2);

var x1 = d3.scale.ordinal();

var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.category10();

var xAxis = d3.svg.axis()
    .scale(x0)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(d3.format(".2s"))
    .ticks(5);

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
    .html('RMSD of Structures Sampled Using <br/> Ernwin, NAST, RNAComposer and FARNA');

var dsv = d3.dsv(' ', 'text/plain');

dsv('best_values.csv', function(best_values) {
    best_values.forEach(function(d) {
        d.pdb_len = +d.pdb_len;
        d.rmsd = +d.rmsd;
    });

    dsv('all_ranges_unique.csv', function(data) {
        console.log('data', data);

        data.forEach(function(d) {
            d.pdb_len = +d.pdb_len;
            d.rmsd = +d.rmsd;
        });

        var category = 'program'; //category goes in the legend
        var group = 'pdb_name';  //group goes on the x-axis
        var value = 'rmsd'; //the values to be plotted

        var categories = d3.set(data.map(function(d) { return d[category]; })).values();
        var groups = d3.set(data.map(function(d) { return d[group]; })).values();


        group_to_lengths = data.reduce(function(result, currentItem) {
            result[currentItem.pdb_name] = +currentItem.pdb_len;
            return result;
        }, {})

        groups.sort(function(a,b) { return group_to_lengths[a] - group_to_lengths[b]; });
        var group_lengths = groups.map(function(d) { return group_to_lengths[d]; });

        best_values = best_values.filter(function(d) { 
            return groups.indexOf(d[group]) >= 0 && categories.indexOf(d[category]) >= 0; 
        });

        //console.log('group_to_lengths:', group_to_lengths);

        color.domain(categories);

        var nestedData = d3.nest()
        .key(function(d) { return d[group]; })
        .entries(data);
        x0.domain(groups);

        x1.domain(categories).rangeRoundBands([0, x0.rangeBand()]);
        y.domain([0, d3.max(data, function(d) { return +d[value]; })]);

        svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")  
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", function(d) {
            return "rotate(-65)" 
        });

        svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

        /* Y-axis label */
        chart.append('text')
        .attr('text-anchor', 'middle')
        .attr('transform', 'translate(' + 10 + "," + (margin.top + (height/2)) + ")rotate(-90)")
        .style('font-weight', 'bold')
        .text(data.y_axis);

        chart.append("text")
        .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("transform", "translate("+ (margin.left + width/2) +","+(margin.top + height + 30)+")")  // centre below axis
        .style('font-weight', 'bold')
        .text(data.x_axis);

        // each ggroup will contain a set of categories (i.e. a two bars next to each other)
        var ggroups = svg.selectAll(".group")
        .data(nestedData)
        .enter().append("g")
        .attr("class", "g")
        .attr("transform", function(d) { return "translate(" + x0(d.key) + ",0)"; })

        ggroups.append("rect")
        .attr("x", -3)
        .attr("y", 0)
        .attr("width", x0.rangeBand() + 2)
        .attr("height", height)
        .attr("fill", function(d, i) { console.log('i', d, i); return groups.indexOf(d.key) % 2 == 0 ? "black" : "white"; })
        .attr("opacity", 0.1)

        var dashWidth = 1.5


        var dashes = ggroups.selectAll('.dash')
        .data(function(d) { 
            return d.values; 
        })
        .enter()
        .append("svg:path")
        .attr("d", function(d) { return "M " + (x1(d[category])-dashWidth) + " " + y(d[value]) + " L " + (x1(d[category])+dashWidth) + " " + y(d[value]); })
        .attr('stroke', function(d) { return color(d[category]); })
        .attr('stroke-width', 0.4)
        .attr('opacity', 0.8);

        
        var rbest_values = svg.selectAll('.circle')
        .data(best_values)
        .enter()
        .append('circle')
        .attr('cx', function(d) { 
            return x0(d[group]) + x1(d[category]); })
        .attr('cy', function(d) { return y(d[value]) })
        .attr('r', 2)
        .attr('stroke', function(d) { return d3.rgb(color(d[category])).darker(); })
        .attr('fill', 'white')
        .attr('stroke-width', 3)

        chart.append("text")
        .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("transform", "translate("+ (margin.left + width/2) +","+(margin.top + height + 53)+")")  // centre below axis
        .style('font-weight', 'bold')
        .text("PDB ID (Ordered by Chain Length)");

        chart.append('text')
        .attr('text-anchor', 'start')
        .attr('transform', 'translate(' + 10 + "," + (margin.top + (height/2)) + ")")
        .style('font-weight', 'bold')
        .text("RMSD")

        var legend = svg.selectAll(".legend")
        .data(categories.slice().reverse())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(10," + i * 20 + ")"; });

        var rectStart = 30;
        var rectWidth = 4;
        var textStart = rectStart + rectWidth + 5;

        legend.append("rect")
        .attr("x", rectStart)
        .attr("width", rectWidth)
        .attr("height", 6)
        .style("fill", color)
        .style('stroke', function(d) { return 'black'; })
        .style('stroke-width', 0)

        legend.append("text")
        .attr("x", textStart)
        .attr("y", 3)
        .attr("dy", ".35em")
        .style("text-anchor", "start")
        .text(function(d) { return "Sampled " + d; })

        var bvLegend = svg.append("g")
        .attr("class", "legend2")
        .attr('transform', "translate(10, " + categories.length * 20 + ")")

        bvLegend.selectAll(".bestValueCircles")
        .data(categories.slice().reverse())
        .enter()
        .append("circle")
        .attr("cx", function(d, i) { console.log('cx', 10 + i*5); return i * 10; })
        .attr("cy", 3)
        .attr('r', 2)
        .attr('stroke', function(d) { return d3.rgb(color(d)).darker(); })
        .attr('fill', 'white')
        .attr('stroke-width', 3);

        bvLegend.append('text')
        .attr('x', textStart)
        .attr("y", 3)
        .attr("dy", ".35em")
        .style("text-anchor", "start")
        .text("Lowest Energy Structures");

        var rightX = d3.scale.ordinal()
        .rangePoints([10, margin.right - 35], 0.1)
        .domain(categories)

        var rightXAxis = d3.svg.axis()
            .scale(rightX)
            .orient("top");

        rightPlot = svg.append('g')
        .attr('transform', 'translate(' + width + ', 0)')

        rightPlot.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + 0 + ")")
        .call(rightXAxis)
        .selectAll("text")  
        .style("text-anchor", "start")
        .attr("dx", ".4em")
        .attr("dy", "-.10em")
        .attr("transform", function(d) {
            return "rotate(-45)" 
        });

        rightPlot.selectAll('.bestValueHist')
        .data(best_values)
        .enter()
        .append('circle')
        .attr('cx', function(d) { return rightX(d[category]); })
        .attr('cy', function(d) { return y(d[value]); })
        .attr('r', 2)
        .attr('stroke', function(d) { return d3.rgb(color(d[category])).darker(); })
        .attr('fill', 'white')
        .attr('stroke-width', 3);

        rightPlot.append('path')
        .attr("d", "M 0 0 L 0 " + height)
        .attr('stroke', 'black')
        .attr('stroke-width', 1)
    })});
