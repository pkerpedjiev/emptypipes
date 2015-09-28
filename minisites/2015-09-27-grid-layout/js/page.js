    var chart = gridLayout([1,2,3,4,5,6,7], 3);

    var totalWidth = 550;
    var totalHeight = 300;

var gridLayout = d3.layout.grid()
.size([totalWidth, totalHeight])
    .aspect(1.0);

//when called on an array of objects, gridLayout
//will return another array, each of whose members
//contain the 'pos' and 'data' members


    var svg = d3.select('#grid-area')
    .append('svg')
    .attr('width', totalWidth)
    .attr('height', totalHeight)

    // the background rectangle
    svg.append('rect')
    .attr('width', totalWidth)
    .attr('height', totalHeight)
    .style('fill', 'red')
    .style('opacity', 0.2)


var x = d3.scale.linear()
        .domain([0, 180])
        .range([0, width])
        .clamp(true);

var brush = d3.svg.brush()
        .x(x)
        .extent([0, 0])
        .on("brush", push);

        svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height / 2 + ")")
    .call(d3.svg.axis()
      .scale(x)
      .orient("bottom")
      .tickFormat(function(d) { return d + "°"; })
      .tickSize(0)
      .tickPadding(12))
  .select(".domain")
  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "halo");

var slider = svg.append("g")
    .attr("class", "slider")
    .call(brush);

slider.selectAll(".extent,.resize")
    .remove();

slider.select(".background")
    .attr("height", height);

var handle = slider.append("circle")
    .attr("class", "handle")
    .attr("transform", "translate(0," + height / 2 + ")")
    .attr("r", 9);

    if (false) {
    svg.selectAll('.grid-rect')
    .data(gridLayout([1]))
    .enter()
    .append('rect')
    .attr('x', function(d) { return d.pos.x; })
    .attr('y', function(d) { return d.pos.y; })
    .attr('width', function(d) { return d.pos.width; })
    .attr('height', function(d) { return d.pos.height; })
    .classed('grid-rect', true);
    } else {
    
    numbers = [1];
    function push() {
        if (numbers.length > 135)
            return;

        var duration = 1000;

         var rectEnter = svg.selectAll('.grid-rect')
            .data(gridLayout(numbers))
            .enter()
            .append('rect')
            .attr('x', totalWidth)
            .attr('y', totalHeight)
            .attr('width', 0)
            .attr('height', 0)
            .classed('grid-rect', true);

        d3.selectAll('.grid-rect')
        .transition()
        .attr('x', function(d) { return d.pos.x; })
        .attr('y', function(d) { return d.pos.y; })
        .attr('width', function(d) { return d.pos.width; })
        .attr('height', function(d) { return d.pos.height; })
        .duration(duration);

        console.log('length:', numbers.length);

        numbers.push(numbers[numbers.length-1]+1);
        setTimeout(push, duration)
    }

    push();
    }
