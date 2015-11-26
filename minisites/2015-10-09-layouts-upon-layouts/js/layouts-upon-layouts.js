function layoutsUponLayouts(divName) {
    d3.json('/jsons/rna-treemap-example.json', function(root) {
        console.log('root:', root);
    // set all of the parameters
    var padding = [10,10];   //the padding between the grid rectangles
    var margin = {top: 4, left: 4, bottom: 4, right: 4};
    var svgWidth = 400 - margin.left - margin.right;  //the width of the svg

    var treemapWidth = 174; //the width of each treemap
    var treemapHeight = 177;  //the height of each treemap

    // calculate the number of columns and the height of the SVG,
    // which is dependent on the on the number of data points
    //var numCols = Math.floor((svgWidth + padding[0]) / (treemapWidth + padding[0]));
    var numCols = 3;
    var treemapWidth = Math.floor((svgWidth - (numCols - 1) * padding[0]) / 3);
    
    var treemapHeight = treemapWidth;
    var svgHeight = Math.ceil(root.length / numCols) * (treemapHeight + padding[1]) - padding[1] + margin.bottom;

    // the rna treemap layout, which will be called for every grid point
    var rnaTreemap = rnaTreemapChart()
        .width(treemapWidth)
        .height(treemapHeight);

    // the grid layout that will determine the position of each
    // treemap
     var rectGrid = d3.layout.grid()
              .bands()
              .size([svgWidth, svgHeight])
              .cols(numCols)
              .padding(padding)
              .nodeSize([treemapWidth, treemapHeight]);
    var rectData = rectGrid(root);

    // create an svg as a child of the #rna_ss div
    // and then a g for each grid cell
    var gMain = d3.select(divName)
    .append('svg')
    .attr('width', svgWidth + margin.left + margin.right)
    .attr('height', svgHeight + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + "," + margin.top + ")")

    gMain.selectAll('.rna-treemap')
    .data(rectData)
    .enter()
    .append('g')
    .attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; })
    .classed('rna-treemap', true)
    .call(rnaTreemap);
});
}
