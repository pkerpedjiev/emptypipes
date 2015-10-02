function kingsJewelsExample() {
    var margin = {top: 20, left: 20, right: 20, bottom: 20};

    var width = 550 - margin.left - margin.right;
    var height = 400 - margin.top - margin.bottom;

    var svg = d3.select("#plotting-area")
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

    var mainG = svg.append('g')
    .attr('transform', 'translate(' + margin.left + "," + margin.right + ")");

    var rectGrid = d3.layout.grid()
        .bands()
        .size([width, height])
        .padding([0.1, 0.1])
        .cols(4);

    var points = [1,2,3,4,5];

    console.log('rectGrid', rectGrid(points));
}
