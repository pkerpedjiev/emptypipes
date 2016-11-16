function createMap(divId) {
    var width=550, height=400;

    var svg = d3.select(divId)
        .append('svg')
        .attr('width', width)
        .attr('height', height);
    var bgRect = svg.append('rect')
        .attr('width', width)
        .attr('height', height)
        .attr('fill', 'white');

    var gBackground = d3.select('svg')
        .append('g')
        var g = svg.append('g')

        var legendColumnWidth = 90;
    var legendRowHeight = 10;

    var gBlocks = g.append('g');
    var gRoads = g.append('g')
        var gLegend = svg.append('g')
        .attr('transform', 'translate(' + (width - 2 * legendColumnWidth - 10) + ',55)')

        svg.append('text')
        .classed('title', true)
        .text("Common Trees in Cambridge")
        .attr('x', 430)
        .attr('y', 40)
        .attr('text-anchor', 'middle')
        ;

    texts = ['This map shows which trees are found',
    'most often on each block in Cambridge',
    'Use the mouse to hover over items',
    'in the legend or on the map to see',
    'where each species is most common']

        var gAbstract = svg.append('g')
        .attr('transform', 'translate(20,340)')

        gAbstract.selectAll('.abstract')
        .data(texts)
        .enter()
        .append('text')
        .classed('abstract',true)
        .attr('y', function(d,i) { return 10 * i; })
        .text(function(d) { return d; });

    var projection = d3.geoMercator()
        .scale(1000000)

        var path = d3.geoPath()
        .projection(projection);

    d3.json("/jsons/2016-11-16-cambridge-tree-map/block_trees.json", function(error, data) {
        if (error) throw error;

        var treeNames = d3.set(data.features.map(function(d) {
            return d.properties.most_common_tree_name}));

        var colorList = ["rgb(52,71,180)", "rgb(202,211,250)","rgb(86,238,173)", "rgb(32,80,46)", "rgb(135,212,207)", "rgb(38,85,130)", "rgb(142,128,251)", "rgb(194,223,125)", "rgb(119,49,41)", "rgb(244,142,155)", "rgb(186,26,23)", "rgb(44,245,43)", "rgb(31,147,131)", "rgb(53,151,33)", "rgb(162,6,85)", "rgb(253,143,47)", "rgb(157,141,136)", "rgb(241,192,57)", "rgb(132,30,164)", "rgb(226,109,248)", "rgb(63,22,249)", "rgb(50,149,233)", "rgb(254,22,244)", "rgb(249,79,156)", "rgb(239,208,165)"]  // thanks to Colorgorical

            var colorScale = d3.scaleOrdinal()
            .domain(treeNames)
            .range(colorList);

        function selectTreeType(treeType) {
            var allBlocks = gBlocks.selectAll('.block')
                var sameBlocks = allBlocks.filter(function(e) {
                    return e.properties.most_common_tree_name == treeType;
                });

            sameBlocks.classed('selected', true);

            gLegend.selectAll('.legend-rect')
                .filter(function(d) { return d == treeType; })
                .classed('selected', true);
        }

        function unselectAllTreeTypes() {
            gBlocks.selectAll('.block')
                .classed('selected', false);

            gLegend.selectAll('.legend-rect')
                .classed('selected', false);
        }


        gBlocks.selectAll('.block')
            .data(data.features)
            .enter()
            .append('path')
            .attr("class", "block")
            .attr('d', path)
            .attr('stroke', 'black')
            .style('fill', function(d) { return colorScale(d.properties.most_common_tree_name) })
            .on('mouseover', function(d) {
                unselectAllTreeTypes();
                selectTreeType(d.properties.most_common_tree_name);
            });

        // mouse moves out of the map area
        bgRect.on('mouseover', unselectAllTreeTypes);

        /* scale to fit all of cambridge */
        // https://bl.ocks.org/mbostock/4699541
        var bounds = path.bounds(data),
        dx = bounds[1][0] - bounds[0][0],
        dy = bounds[1][1] - bounds[0][1],
        x = (bounds[0][0] + bounds[1][0]) / 2,
        y = (bounds[0][1] + bounds[1][1]) / 2,
        scale = .9 / Math.max(dx / width, dy / height),
        translate = [width / 2 - scale * x, height / 2 - scale * y];

        g.attr('transform', "translate(" + translate + ")scale(" + scale + ")")

            //add the legend
            var popularTreeCounts = {}
        for (let i = 0; i < data.features.length; i++) {
            var treeName = data.features[i].properties.most_common_tree_name
                if (treeName in popularTreeCounts)
                    popularTreeCounts[treeName] += 1;
                else
                    popularTreeCounts[treeName] = 1;
        }

        // a list of the tree types, sorted by how common they are
        var treeList = treeNames.values().sort(function(a,b) { return popularTreeCounts[b] - popularTreeCounts[a]} );
        var itemBarWidth = 20;
        var itemBarLength = 6

            var halfTreeListLength = Math.ceil(treeList.length / 2);
        var legendItems = gLegend.selectAll('.legend-item')
            .data(treeList)
            .enter()
            .append('g')
            .classed('legend-item', true)
            .attr('transform', function(d,i) { 
                return "translate(" + (legendColumnWidth * Math.floor(i / halfTreeListLength)) + ',' + ((i % halfTreeListLength) * legendRowHeight) + ")";
            })

        legendItems.append('text')
            .text(function(d) { return d + " (" + popularTreeCounts[d] + ")"; })
            .attr('dy', 8)
            .attr('dx', 4);

        legendItems.append('rect')
            .attr('x', -itemBarLength)
            .attr('y', 2)
            .attr('height', legendRowHeight - 4)
            .attr('width', itemBarLength)
            .classed('legend-rect', true)
            .style('fill', function(d) { return colorScale(d) }) ;

        legendItems.on('mouseover', function(d) {
            d3.selectAll('.legend-rect').classed('selected', false);
            d3.select(this).select('rect').classed('selected', true)
                gBlocks.selectAll('.block').classed('selected', false);
            selectTreeType(d);
        });

        console.log("popularTreeCounts:", popularTreeCounts);
        console.log('treeList', treeList);
    });

    // add the roads
    d3.json("/jsons/2016-11-16-cambridge-tree-map/roads.topo", function(error, data1) {
        gRoads.selectAll('.road')
            .data(topojson.feature(data1,data1.objects.roads).features)
            .enter()
            .append('path')
            .attr("class", "road")
            .attr('d', path)
    });

    /*
       d3.xml("img/tree.svg").mimeType("image/svg+xml").get(function(error, xml) {
       if (error) throw error;

       gBackground
       .attr('transform', 'translate(270,10)scale(0.6)')
       .style('opacity', 0.06)
       .node()
       .appendChild(xml.documentElement);

       });
       */
}
