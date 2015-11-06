function gridLayoutExample(divName, alignment) {
    var totalWidth = 550;
    var totalHeight = 300;

    var margin = {'top': 55, 'left': 20, 'right':20};

    var width = totalWidth - margin.left - margin.right;
    var height = totalHeight - margin.top;

    var gridLayout = d3.layout.grid()
    .size([width, height])
    .aspect(1.0)
    .alignment(alignment);

    //console.log(gridLayout([1,2,3]));

    //when called on an array of objects, gridLayout
    //will return another array, each of whose members
    //contain the 'pos' and 'data' members

    var svg = d3.select(divName)
    .append('svg')
    .attr('width', totalWidth)
    .attr('height', totalHeight);

    // create a rectangle so we can see the extent of the svg
    // canvas
    var rectG = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    rectG.append('rect')
    .attr('width', width)
    .attr('height', height)
    .classed('background-rect', true);

    /************ Begin Brush stuff *************/
    // the x scale for the brush
    var x = d3.scale.log()
    .domain([0.2, 5])
    .range([0, width])
    .clamp(true);

    var brush = d3.svg.brush()
    .x(x)
    .extent([0, 0])
    .on("brush", brushed)
    .on('brushstart', brushstart)
    .on('brushend', brushend);

    // the ticks that are less than zero should be formatted
    // like .1 .2 .3, rather than 0.1, 0.2, 0.3
    //
    var formatTick = function(d) {
        if (d < 1)
            return "." + d3.format("1f")(d * 10);
        else
            return d;
    };
    var sliderG = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',0)');

    sliderG.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(" + 0 + "," + (13 + margin.top / 2) + ")")
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

          // the label for the brush
          // optional in any other context
          sliderG.append('text')
          .attr('text-anchor', 'middle')
          .attr('x', width / 2)
          .attr('y', 13)
          .text('Aspect Ratio')

          // the handle
          var handle = slider.
              append("circle")
          .attr("class", "handle")
          .attr("transform", "translate(0," + ( 13 + margin.top / 2 ) + ")")
          .attr("r", 9);

          slider
          .call(brush.extent([1, 1]))
          .call(brush.event);

          function brushstart() {

          }

          function brushend() {
              lastTime = new Date().getTime();
              setTimeout( startPushing(lastTime), duration);
          }

          function brushed() {
              var value = brush.extent()[0];

              if (d3.event.sourceEvent) { // not a programmatic event
                  value = x.invert(d3.mouse(this)[0]);
                  brush.extent([value, value]);
              }
              handle.attr("cx", x(value));

              gridLayout.aspect(value);
              numbers = [];
          }

          /********* end brush stuff ************/

          numbers = [1];

          var duration = 500;
          var lastTime = new Date().getTime();

          function startPushing(time) {
              var currentTime = time;

            // add new rectangles, one at a time
              // if the aspect ratio is changed, then the current time
              // will change and older animations won't continue
              function push() {
                  if (currentTime != lastTime)
                      return;

                  if (numbers.length > 135)
                      return;

                  var rectData = rectG.selectAll('.grid-rect')
                  .data(gridLayout(numbers));

                  rectData.exit().remove();

                  rectData.enter()
                  .append('rect')
                  .attr('x', width)
                  .attr('y', height)
                  .attr('width', 0)
                  .attr('height', 0)
                  .classed('grid-rect', true);

                  rectG.selectAll('.grid-rect')
                  .transition()
                  .attr('x', function(d) { return d.pos.x; })
                  .attr('y', function(d) { return d.pos.y; })
                  .attr('width', function(d) { return d.pos.width; })
                  .attr('height', function(d) { return d.pos.height; })
                  .duration(duration);

                  console.log('length:', numbers.length);

                  numbers.push(numbers[numbers.length-1]+1);
                  setTimeout(push, duration);
              }

              return push;
          }
        
         // start the initial animation which will be changed
          // when the user selects a new aspect ratio
          lastTime = new Date().getTime();
          setTimeout(startPushing(lastTime), duration);
          return;
         gridLayout.aspect(.2);

                  rectG.selectAll('.grid-rect')
                  .data(gridLayout([1,2,3,4,5,6,7,8,9,10,11,12,13]))
                  .enter()
                  .append('rect')
                  .classed('grid-rect', true)
                  .attr('x', function(d) { return d.pos.x; })
                  .attr('y', function(d) { return d.pos.y; })
                  .attr('width', function(d) { return d.pos.width; })
                  .attr('height', function(d) { return d.pos.height; });
}
