function drawCityUrbanAreas(geoJson, divName) {
    if (arguments.length == 1)
        divName = 'cityBoundaryMap';

    //var map = L.map('isochroneMap').setView([48.2858, 6.7868], 4);
    //
    d3.json(geoJson, function(data) {
        var firstFeature = data.features[0];

        console.log('divName:', divName);
        console.log('geoJson', geoJson);

        var map = new L.Map(divName, {
            center: new L.LatLng(0, 0),
                                 zoom: 8
        });

        // create the tile layer with correct attribution
        var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        var osmAttrib='Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
        var osm = new L.TileLayer(osmUrl, {minZoom: 2, maxZoom: 16, attribution: osmAttrib});

        map.addLayer(osm);

        var svg = d3.select(map.getPanes().overlayPane).append("svg"),
            g = svg.append("g").attr("class", "leaflet-zoom-hide");

              var transform = d3.geo.transform({point: projectPoint}),
              path = d3.geo.path().projection(transform);

              var feature = g.selectAll("path")
              .data(data.features)
              .enter().append("path");

              map.on("viewreset", reset);
              reset();

              // Reposition the SVG to cover the features.
              function reset() {
                  var bounds = path.bounds(data),
                  topLeft = bounds[0],
                  bottomRight = bounds[1];

                  svg .attr("width", bottomRight[0] - topLeft[0])
                  .attr("height", bottomRight[1] - topLeft[1])
                  .style("left", topLeft[0] + "px")
                  .style("top", topLeft[1] + "px");

                  g   .attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");

                  feature.attr("d", path)
                  .attr('fill', 'black')
                  .attr('stroke-width', 0.5)
                  .attr('stroke', 'black')
                  .style('opacity', 0.3);
              }

              // Use Leaflet to implement a D3 geometric transformation.
              function projectPoint(x, y) {
                  var point = map.latLngToLayerPoint(new L.LatLng(y, x));
                  this.stream.point(point.x, point.y);
              }

    });

}
