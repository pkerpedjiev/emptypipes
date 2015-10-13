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
      .style('opacity', 0.1);

  svg.insert("path", ".graticule")
      .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
      .attr("class", "boundary")
      .attr("d", path);

        var gMain = svg.append('g');

      d3.json("/jsons/cv.json?31", function(error1, cvJson) {
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
        .range([0, height / 3.5,height-10]);

        console.log('cvJson:', cvJson);

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
            var x_offset = typeof d.x_offset == 'undefined' ? 0 : d.x_offset;
            return proj[0] + x_offset; })
        .attr('x2', function(d) {
            var proj = projection([d.location.lon, d.location.lat]);
            var x_offset = typeof d.x_offset == 'undefined' ? 0 : d.x_offset;
            return proj[0] + x_offset; })
        .attr('stroke-dasharray', '2,2')
        .classed('activity-connection', true);

        gMain.selectAll('activity-connection-extra')
        .data(activities.filter(function(d) { return d.displayConnection != "false"; }))
        .enter()
        .append('line')
        .attr('y1', function(d) { 
            var proj = projection([d.location.lon, d.location.lat]);
            return proj[1]; })
        .attr('y2', function(d) {
            var proj = projection([d.location.lon, d.location.lat]);
            return proj[1]; })
        .attr('x1', function(d) {
            var proj = projection([d.location.lon, d.location.lat]);
            var x_offset = 0;
            return proj[0] + x_offset; })
        .attr('x2', function(d) {
            var proj = projection([d.location.lon, d.location.lat]);
            var x_offset = typeof d.x_offset == 'undefined' ? 0 : d.x_offset;
            return proj[0] + x_offset; })
        .attr('stroke-dasharray', '2,2')
        .classed('activity-connection-extra', true);

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
            return proj[0] + (typeof d.x_offset == 'undefined' ? 0 : d.x_offset);
        })
        .attr('x2', function(d) { 
            var proj = projection([d.location.lon, d.location.lat]);
            return proj[0] + (typeof d.x_offset == 'undefined' ? 0 : d.x_offset);
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

        function activityTextX(d) {
            var proj = projection([d.location.lon, d.location.lat]);
            var x_offset = typeof d.x_offset == 'undefined' ? 0 : d.x_offset;

            // place the text on either the left or right hand side
            // of the activity line
            if (d.text_align == 'left')
                return x_offset + proj[0] - (ACTIVITY_TEXT_OFFSET = 10);
            else
                return x_offset + proj[0] + (ACTIVITY_TEXT_OFFSET = 10);
        }

        function activityTextAnchor(d) {
            if (d.text_align == 'left')
                return 'end';
            else
                return 'start';
        }

        function activityTextY(d) {
            return (dateScale(d.start) + dateScale(d.end)) / 2 +
                (typeof d.y_offset == 'undefined' ? 0 : d.y_offset);
        }

        //Add labels for each activity
        gMain.selectAll('.activity-text')
        .data(activities)
        .enter()
        .append('text')
        .attr('y', activityTextY)
        .attr('dy', '.3em')
        .attr('x', activityTextX)
        .classed('activity-text', true)
        .attr('text-anchor', activityTextAnchor)
        .text(function(d) { return  d.host; });

        //Add labels for each activity
        gMain.selectAll('.activity-description')
        .data(activities)
        .enter()
        .append('text')
        .attr('y', function(d) { return activityTextY(d) + 14; })
        .attr('dy', '.3em')
        .attr('x', activityTextX)
        .classed('activity-description', true)
        .attr('text-anchor', activityTextAnchor)
        .text(function(d) { return  d.description; });

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

      // Add the header (name, email, blog)
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

      // Add the section headings (History, Skills)
      svg.append('text')
      .attr('x', 240)
      .attr('y', 100)
      .classed('section-label', true)
      .text("History");

      svg.append('text')
      .attr('x', 460)
      .attr('y', 100)
      .classed('section-label', true)
      .text("Skills");

      // Add a rectangle below the skills

      // Add the skills
      var skillsMinX = 400;
      var skillsMaxX = 500;

      /*
      cvJson.skills.sort(function(a,b) {
          return dateFormat.parse(b.period.start) - 
                 dateFormat.parse(a.period.start); });
      */

      var skillSet = d3.set(cvJson.skills.map(function(d) { return d.name; })).values();
      skillSet.reverse();

      var skillsScale = d3.scale.ordinal()
      .domain(skillSet)
      .rangePoints([skillsMinX, skillsMaxX]);

      svg.selectAll('.skill-line')
      .data(cvJson.skills)
      .enter()
      .append('line')
      .attr('x1', function(d) { return skillsScale( d.name ); })
      .attr('x2', function(d) { return skillsScale( d.name ); })
      .attr('y1', function(d) { return dateScale( dateFormat.parse(d.period.start) );})
      .attr('y2', function(d) { return dateScale( dateFormat.parse(d.period.end) );})
      .classed('skill-line', true);

      var minSkillStart = d3.min(cvJson.skills.map(function(d) { return d.period.start; }));
      var maxSkillEnd = d3.max(cvJson.skills.map(function(d) { return d.period.end; }));

      svg.selectAll('.skill-guide')
      .data(cvJson.skills)
      .enter()
      .append('line')
      .attr('x1', function(d) { return skillsScale( d.name ); })
      .attr('x2', function(d) { return skillsScale( d.name ); })
      .attr('y1', function(d) { return dateScale( dateFormat.parse(minSkillStart));})
      .attr('y2', function(d) { return dateScale( dateFormat.parse(maxSkillEnd));})
      .classed('skill-guide', true)
      .attr('stroke-dasharray', '2,8');

      svg.selectAll('.skill-text')
      .data(cvJson.skills)
      .enter()
      .append('text')
      .attr('transform', function(d) { return 'translate(' + skillsScale(d.name) + "," + 
              dateScale( dateFormat.parse('2002-09-01')) + ')rotate(45)'; })
      .text(function(d) { return d.name; })
      .attr('text-anchor', 'end')
      .classed('skill-text', true);


      // PUBLICATIONS
      var publicationsX = 395;
      // Add the skills
      var publicationsMinX = 325;
      var publicationsMaxX = 380;


      svg.append('text')
      .attr('transform', function(d) { return 'translate(' + publicationsX + "," + 
              dateScale( dateFormat.parse('2008-03-01')) + ')rotate(0)'; })
       .text('Publications')
       .attr('text-anchor', 'start')
       .classed('section-label', true)

      var minPubDate = dateFormat.parse('2012-01-01');
      var maxPubDate = dateFormat.parse(currentDate);

       var journalsSet = d3.set(cvJson.publications.map(function(d) { return d.journal; })).values();

      var publicationsScale = d3.scale.ordinal()
      .domain(journalsSet)
      .rangePoints([publicationsMinX, publicationsMaxX]);

      svg.selectAll('.journal-title')
      .data(journalsSet)
      .enter()
      .append('text')
      .attr('transform', function(d) { return 'translate(' + publicationsScale(d) + "," + 
              dateScale( dateFormat.parse('2011-09-01')) + ')rotate(45)'; })
      .text(function(d) { return d; })
      .attr('text-anchor', 'end')
      .classed('journal-title', true);

      svg.selectAll('.journal-guide')
      .data(journalsSet)
      .enter()
      .append('line')
      .attr('x1', function(d) { return publicationsScale( d ); })
      .attr('x2', function(d) { return publicationsScale( d ); })
      .attr('y1', function(d) { return dateScale(minPubDate);})
      .attr('y2', function(d) { return dateScale(maxPubDate);})
      .classed('journal-guide', true)
      .attr('stroke-dasharray', '2,8');

      svg.selectAll('.publication-point')
      .data(cvJson.publications)
      .enter()
      .append('circle')
      .attr('cx', function(d) { return publicationsScale(d.journal); })
      .attr('cy', function(d) { return dateScale(dateFormat.parse(d.date)); })
      .attr('r', function(d) { return Math.sqrt(d.impactFactor * 4); })
      .attr('fill', function(d) {
          if (d.firstAuthor == 'true')
              return 'black';
          else
              return 'white';
      })
      .classed('publication-point', true);

      });
});

d3.select(self.frameElement).style("height", height + "px");
