var currentDate = '2015-10-08';

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
    .attr("width", width)
    .attr("height", height);

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

      d3.json("/jsons/cv.json", function(error1, cvJson) {
        var dateFormat = d3.time.format('%Y-%m-%d');

        var education = cvJson.education.map(function(d) {
            d.start = dateFormat.parse(d.start);
            d.end = dateFormat.parse(d.end);
            return d;
        });

        var minStart = d3.min(education.map(function(d) { return d.start; }));
        var maxStart = d3.max(education.map(function(d) { return d.end; }));

        dateScale = d3.time.scale()
        .domain([dateFormat.parse('1984-09-22'), dateFormat.parse(currentDate)])
        .range([-180,180]);

        console.log('cvJson:', cvJson);
        console.log('minStartLat:', dateScale(minStart), dateScale(maxStart));
      });
});

d3.select(self.frameElement).style("height", height + "px");
