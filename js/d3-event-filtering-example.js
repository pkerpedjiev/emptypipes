function zoomFiltering(divId) {
    var width = 400, height=250, maxR=30;

    var svg = d3v4.select(divId)
                .append('svg')
                .attr('width', width)
                .attr('height', height)
    var g = svg.append('g')

    // create 15 circles
    var numCircles = 55;
    var circles = [];
    for (var i = 0; i < numCircles; i++)
        circles.push({'x': 1+Math.floor(Math.random() * width),
                'y': 1+Math.floor(Math.random() * height),
                'r': 1+Math.floor(Math.random() * maxR)});

    g.selectAll('circle')
        .data(circles)
        .enter()
        .append('circle')
        .attr('cx', function(d) { return d.x; })
        .attr('cy', function(d) { return d.y; })
        .attr('r', function(d) { return d.r; })
        .classed('no-zoom', true)

    var zoom = d3v4.zoom()
                 .filter(() => { return !d3v4.event.path[0].classList.contains('no-zoom') })
                 .on('zoom', function(d) { g.attr('transform', d3v4.event.transform); });

     var texts = ["The red circles don't allow scroll-wheel zooming and",
                  "drag-based panning"]
     svg.selectAll('text')
        .data(texts)
        .enter()
        .append('text')
        .attr('x', 200)
        .attr('y', function(d,i) { return 20 + i * 20; })
        .text(function(d) { return d; });

    svg.call(zoom);
}
