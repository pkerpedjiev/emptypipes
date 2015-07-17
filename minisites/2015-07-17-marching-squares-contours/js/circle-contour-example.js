function drawContours() {
    zs = [0, 4.5, 9, 13.5, 18];
    data = [[18, 13, 10, 9, 10, 13, 18],
        [13, 8, 5, 4, 5, 8, 13],
        [10, 5, 2, 1, 2, 5, 10],
        [9, 4, 1, 12, 1, 4, 9],
        [10, 5, 2, 1, 2, 5, 10],
        [13, 8, 5, 4, 5, 8, 13],
        [18, 13, 10, 9, 10, 13, 18],
        [18, 13, 10, 9, 10, 13, 18]]

    var xs = d3.range(0, data.length);
    var ys = d3.range(0, data[0].length);

    width = 200,
    height = 200,

    xScale = d3.scale.linear()
    .range([0, width])
    .domain([Math.min.apply(null, xs), Math.max.apply(null, xs)]),

    yScale = d3.scale.linear()
    .range([height, 0])
    .domain([Math.min.apply(null, ys), Math.max.apply(null, ys)]),

    colours = d3.scale.linear().domain([zs[0], zs[zs.length - 1]]).range(["green", "red"]);

    var isoBands = [];
    for (var i = 1; i < zs.length; i++) {
        var lowerBand = zs[i-1];
        var upperBand = zs[i];

        var band = MarchingSquaresJS.IsoBands(data, lowerBand, upperBand - lowerBand);
        console.log('band', band);
        isoBands.push({"coords": band, "level": i, "val": zs[i]});
    }

    d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .selectAll("path")
    .data(isoBands)
    .enter().append("path")
    .style("fill",function(d) { return colours(d.val);})
    .style("stroke","black")
    .style('opacity', 1.0)
    .attr("d", function(d) {
        var p = "";
        d.coords.forEach(function(aa, i){
            p += (d3.svg.line()
                  .x(function(dat){ return xScale(dat[0]); })
                  .y(function(dat){ return xScale(dat[1]); })
                  .interpolate("linear")
                 )(aa) + "Z";
        });
        return p; 
    });
}

requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: 'js/lib',
});

// Start the main app logic.
requirejs(['d3.min', "marchingsquares-isobands"],
function   (d3, MarchingSquaresJS) {
    //jQuery, canvas and the app/sub module are all
    //loaded and can be used here now.
    drawContours();
});

