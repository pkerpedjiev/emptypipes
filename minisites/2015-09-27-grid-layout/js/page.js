    var chart = gridLayout([1,2,3,4,5,6,7], 3);

    var totalWidth = 550;
    var totalHeight = 300;

    var margin = {'top': 40, 'left': 20, 'right':20};

    var width = totalWidth - margin.left - margin.right;
    var height = totalHeight - margin.top;

var gridLayout = d3.layout.grid()
.size([width, height])
    .aspect(1.0);

//when called on an array of objects, gridLayout
//will return another array, each of whose members
//contain the 'pos' and 'data' members


    var svg = d3.select('#grid-area')
    .append('svg')
    .attr('width', totalWidth)
    .attr('height', totalHeight);

    // the background rectangle
    var rectG = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    rectG.append('rect')
    .attr('width', width)
    .attr('height', height)
    .style('fill', 'red')
    .style('opacity', 0.2);


var x = d3.scale.log()
        .domain([0.1, 10])
        .range([0, width])
        .clamp(true);

var brush = d3.svg.brush()
        .x(x)
        .extent([0, 0])
        .on("brush", brushed)
        .on('brushstart', brushstart)
        .on('brushend', brushend);

        var sliderG = svg.append('g')
        .attr('transform', 'translate(' + margin.left + ',0)');

        var formatTick = function(d) {
            if (d < 1)
                return d3.format("00f")(d);
            else
                return d;
        };

        sliderG.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(" + 0 + "," + margin.top / 2 + ")")
        .call(d3.svg.axis()
              .scale(x)
              .orient("top")
              .tickFormat(formatTick)
              .tickSize(0)
              .tickPadding(12))
              .select(".domain")
              .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
              .attr("class", "halo");

var slider = sliderG.append("g")
    .attr("class", "slider")
    .call(brush);

slider.selectAll(".extent,.resize")
    .remove();

    numbers = [1];

var handle = slider.
    append("circle")
    .attr("class", "handle")
    .attr("transform", "translate(0," + margin.top / 2 + ")")
    .attr("r", 9);

    slider
    .call(brush.extent([70, 70]))
    .call(brush.event);

    var brushing = false;

    function brushstart() {
        brushing = true;
    }

    function brushend() {
        brushing = false;
        push();
    }

    function brushed() {
        var value = brush.extent()[0];

        if (d3.event.sourceEvent) { // not a programmatic event
            value = x.invert(d3.mouse(this)[0]);
            brush.extent([value, value]);
        }

        console.log('handle:', handle);
        console.log('value:', value);

        numbers = [];
        handle.attr("cx", x(value));
    }

    if (false) {
    rectG.selectAll('.grid-rect')
    .data(gridLayout([1]))
    .enter()
    .append('rect')
    .attr('x', function(d) { return d.pos.x; })
    .attr('y', function(d) { return d.pos.y; })
    .attr('width', function(d) { return d.pos.width; })
    .attr('height', function(d) { return d.pos.height; })
    .classed('grid-rect', true);
    } else {
    

    function push() {
        if (brushing)
            return;

        if (numbers.length > 135)
            return;

        var duration = 1000;

        var rectData = rectG.selectAll('.grid-rect')
            .data(gridLayout(numbers))

        rectData.exit().remove();

         rectData.enter()
            .append('rect')
            .attr('x', width)
            .attr('y', height)
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
