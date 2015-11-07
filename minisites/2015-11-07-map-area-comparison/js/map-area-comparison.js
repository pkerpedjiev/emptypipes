function mapComparison() {
    var width = 400;
    var height = 400;

    var chart = function(selection) {
        selection.each(function(data) {


        });
    };

    return chart;
}

function compareMaps(geoJson) {
    var gEnter = d3.select('map-area').append('svg');
    var compareChart = mapComparison();

    d3.json(geoJson, function(data) {
        svg.data([data])
        .enter()
        .append('g')
        .call(compareChart);
    });
}
