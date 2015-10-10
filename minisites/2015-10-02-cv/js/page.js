var currentDate = '2015-10-08';

var margin = {top: 10, right: 10, left: 10, bottom: 10}

var width = 550,
    height = 550;

var projection = d3.geo.mercator()
    .scale((width + 1) / 2 / Math.PI)
    .translate([width / 2, height / 2])
    .precision(.1);

var path = d3.geo.path()
    .projection(projection);

var graticule = d3.geo.graticule();

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + "," + margin.right + ")");

    /*
svg.append("path")
    .datum(graticule)
    .attr("class", "graticule")
    .attr("d", path);
    */

d3.json("/jsons/world-110m.json", function(error, world) {
  if (error) throw error;

  svg.insert("path", ".graticule")
      .datum(topojson.feature(world, world.objects.land))
      .attr("class", "land")
      .attr("d", path)
      .style('opacity', 0.2);

  svg.insert("path", ".graticule")
      .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
      .attr("class", "boundary")
      .attr("d", path);

        var gMain = svg.append('g');

      d3.json("/jsons/cv.json?25", function(error1, cvJson) {
        var dateFormat = d3.time.format('%Y-%m-%d');

        var activities = cvJson.activities.map(function(d) {
            d.start = dateFormat.parse(d.start);
            d.end = dateFormat.parse(d.end);
            return d;
        });

        var minStart = d3.min(activities.map(function(d) { return d.start; }));
        var maxStart = d3.max(activities.map(function(d) { return d.end; }));

        dateScale = d3.time.scale()
        .domain([dateFormat.parse('1983-12-30'), 
                dateFormat.parse('2001-12-30'), dateFormat.parse(currentDate)])
        //.range([width,3*width/4,0]);
        .range([0, width / 3.5,width]);

        console.log('cvJson:', cvJson);
        console.log('minStartLat:', dateScale(minStart), dateScale(maxStart));


        gMain.selectAll('activity-connection')
        .data(activities.filter(function(d) { return d.displayConnection != "false"; }))
        .enter()
        .append('line')
        .attr('y1', function(d) { return dateScale(d.start); })
        .attr('y2', function(d) {
            var proj = projection([d.location.lon, d.location.lat]);
            return proj[1]; })
        .attr('x1', function(d) {
            var proj = projection([d.location.lon, d.location.lat]);
            return proj[0]; })
        .attr('x2', function(d) {
            var proj = projection([d.location.lon, d.location.lat]);
            return proj[0]; })
        .attr('stroke-dasharray', '5,5')
        .classed('activity-connection', true);

        //plot lines indicating the period along with a particular activity
        //took place
        gMain.selectAll('.activities-line')
        .data(activities)
        .enter()
        .append('line')
        .attr('y1', function(d) { return dateScale(d.start); })
        .attr('y2', function(d) { return dateScale(d.end); })
        .attr('x1', function(d) { 
            var proj = projection([d.location.lon, d.location.lat]);
            return proj[0];
        })
        .attr('x2', function(d) { 
            var proj = projection([d.location.lon, d.location.lat]);
            return proj[0];
        })
        .attr('stroke-linecap', 'round')
        .classed('activities-line', true);

        gMain.selectAll('activity-point')
        .data(activities.filter(function(d) { return d.displayConnection != "false"; }))
        .enter()
        .append('circle')
        .attr('cx', function(d) {
            var proj = projection([d.location.lon, d.location.lat]);
            return proj[0]; })
        .attr('cy', function(d) {
            var proj = projection([d.location.lon, d.location.lat]);
            return proj[1]; })
        .attr('r', 3)
        .classed('activity-point', true);

        //Add labels for each activity
        gMain.selectAll('.activity-text')
        .data(activities)
        .enter()
        .append('text')
        .attr('y', function(d) { 
            return (dateScale(d.start) + dateScale(d.end)) / 2;
        })
        .attr('dy', '.3em')
        .attr('x', function(d) {
            var proj = projection([d.location.lon, d.location.lat]);

            // place the text on either the left or right hand side
            // of the activity line
            if (d.text_align == 'left')
                return proj[0] - (ACTIVITY_TEXT_OFFSET = 10);
            else
                return proj[0] + (ACTIVITY_TEXT_OFFSET = 10);
        })
        .classed('activity-text', true)
        .attr('text-anchor', function(d) {
            if (d.text_align == 'left')
                return 'end';
            else
                return 'start';
        })
        .text(function(d) { return  d.host; });

        var yearDateFormat = d3.time.format('%Y');
		// add an axis for the year
		var xAxis = d3.svg.axis()
        .scale(dateScale)
        .orient('right')
        .ticks(d3.time.years, 1)
        .tickFormat(function(d) {
            var year = d.getFullYear();

            if (year < 2002) {
                if (year % 2 === 0)
                    return d3.time.format('%Y')(d);
                else
                    return '';
            }

            return d3.time.format('%Y')(d);
        })
        .tickSize(0)
        .tickPadding(8);
	  
     // add the axes with the years
        // on the left
  	  svg.append('g')
      .attr('class', 'year axis')
  	  .attr('transform', 'translate(0,0)')
  	  .call(xAxis);

      // and on the right, the orientation is the way the
      // labels face
      svg.append('g')
      .attr('class', 'year axis')
  	  .attr('transform', 'translate(' + width + ',0)')
  	  .call(xAxis.orient('left'));

      //var textFromTop = height - 50;  //where to start the name, email, blog header
      var textFromTop = 10;  //where to start the name, email, blog header
      var emailOffset = 18;  //how far from the name to offset the email

      svg.append('text')
      .attr('x', width - 40)
      .attr('y', textFromTop)
      .classed('name-label', true)
      .text(cvJson.name);

      svg.append('text')
      .attr('x', width - 40)
      .attr('y', textFromTop) 
      .attr('dy', emailOffset)
      .classed('email-label', true)
      .text(cvJson.email);

      svg.append('text')
      .attr('x', width - 40)
      .attr('y', textFromTop) 
      .attr('dy', 2 * emailOffset)
      .classed('email-label', true)
      .text(cvJson.blog);

      });
});

d3.select(self.frameElement).style("height", height + "px");
