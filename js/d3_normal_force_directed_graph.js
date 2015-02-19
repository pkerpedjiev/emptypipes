function normalForceDirectedGraph() {
    var width = 250,
    height = 200;

    var color = d3.scale.category20();

    var force = d3.layout.force()
    .charge(-120)
    .linkDistance(30)
    .size([width, height]);

    var svg = d3.select("#d3_normal_force_directed_graph")
    .append("svg")
    .attr("width", width)
    .attr("height", height);


    var borderPath = svg.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("height", height)
    .attr("width", width)
    .style("stroke", 'black')
    .style("fill", "none")
    .style("stroke-width", 1);

    d3.json("/jsons/miserables.json", function(error, graph) {
        force
        .nodes(graph.nodes)
        .links(graph.links)
        .start();

        var link = svg.selectAll(".link")
        .data(graph.links)
        .enter().append("line")
        .attr("class", "link")
        .style("stroke-width", function(d) { return Math.sqrt(d.value); });

        var node = svg.selectAll(".node")
        .data(graph.nodes)
        .enter().append("circle")
        .attr("class", "node")
        .attr("r", 5)
        .style("fill", function(d) { return color(d.group); })
        .call(force.drag);

        node.append("title")
        .text(function(d) { return d.name; });

        force.on("tick", function() {
            link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

            node.attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
        });

        svg.append('text').text('Normal')
        .attr('transform', 'translate(5,15)')
        .style('font', '15px sans-serif')
        .style('font-weight', 'bold');
    });

}

