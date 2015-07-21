function drawTurfContours(divId) {
    var zs = [0, 4.5, 9, 13.5, 18];
    //var zs = [9, 13.5];
    //var zs = [9];

    var data = [[18, 13, 10, 9, 10, 13, 18],
        [13, 8, 5, 4, 5, 8, 13],
        [10, 5, 2, 1, 2, 5, 10],
        [9, 4, 1, 12, 1, 4, 9],
        [10, 5, 2, 1, 2, 5, 10],
        [13, 8, 5, 4, 5, 8, 13],
        [18, 13, 10, 9, 10, 13, 18],
        [18, 13, 10, 9, 10, 13, 18]]

        var cliff = 1000;
        data.push(d3.range(data[0].length).map(function() { return cliff; }));
        data.unshift(d3.range(data[0].length).map(function() { return cliff; }));
        data.forEach(function(d) {
            d.push(cliff);
            d.unshift(cliff);
        });

        var points = {type: "FeatureCollection", features: []}

        // convert our data grid to GeoJSON
        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < data[0].length; j++) {
                var newPoint = { geometry: {
                                    type: "Point",
                                    coordinates: [i,j] },
                                 properties: { 
                                    z: data[i][j]
                                 },
                                 type: "Feature"};
                points.features.push(newPoint);
            }
        }

        console.log('points:', points);
        var isolined = turf.isobands(points, 'z', 20, zs);
        console.log('isolined:', isolined);

        var xs = d3.range(0, data.length);
        var ys = d3.range(0, data[0].length);
        var height = 200;
        var width = height * ((xs.length - 2) / (ys.length - 2));

        var marginBottomLabel = 40;

        var xScale = d3.scale.linear()
        .range([0, width])
        .domain([1, Math.max.apply(null, xs)-1]);

        var yScale = d3.scale.linear()
        .range([0, height])
        .domain([1, Math.max.apply(null, ys)-1]);

        var colours = d3.scale.linear().domain([zs[0], zs[zs.length - 1]]).range(["green", "red"]);

        var svg = d3.select(divId).append("svg")
        .attr("width", width)
        .attr("height", height + marginBottomLabel)

        svg.append('text')
        .attr('transform', 'translate(' + (width/2) + ','+(height+15)+')')
        .attr('text-anchor', 'middle')
        .text("turf.js");

        Array.prototype.max = function() {
            return Math.max.apply(null, this);
        };

        Array.prototype.min = function() {
            return Math.min.apply(null, this);
        };

        isolined.features = isolined.features.sort(function(a,b) {
            return a.geometry.coordinates[0].map(function(d) { return d[0]; }).min()
                  -b.geometry.coordinates[0].map(function(d) { return d[0]; }).min();
        });
        //isolined.features = isolined.features.reverse();

        svg.selectAll("path")
        .data(isolined.features)
        .enter().append("path")
        .style("fill",function(d) { return colours(d.properties.z);})
        //.style('fill', 'transparent')
        .style("stroke","black")
        .attr("d", function(d) { 
            console.log('d', d);
            return d3.svg.line()
            .x(function(dat) { return xScale(dat[0]); })
            .y(function(dat) { return yScale(dat[1]); }) 
            (d.geometry.coordinates[0]);(d.geometry.coordinates[0]);
        })
        .style('opacity', 1)
}
