function mapComparison() {
    var width = 400;
    var height = 400;
    var worldJson = null;
    var scaleValue = null;

    function geoBounds(feature) {
        /* Get the bounding box of a GeoJSON feature
         * and return it as a leaflet-compatible object
         *
         * For some reason d3's geo.bounds didn't seem to work
         * */

        var minLat = 90;
        var maxLat = -90;
        var minLon = 180;
        var maxLon = -180;
        for (var i = 0; i < feature.geometry.coordinates.length; i++) {
            var coords = feature.geometry.coordinates[i];
            for (var j = 0; j < coords.length; j++) {
                if (coords[j][1] < minLat)
                    minLat = coords[j][1];
                if (coords[j][1] > maxLat)
                    maxLat = coords[j][1];
                if (coords[j][0] < minLon)
                    minLon = coords[j][0];
                if (coords[j][0] > maxLon)
                    maxLon = coords[j][0];
            }
        }
        return [[minLon, minLat], [maxLon, maxLat]];
    }

    var chart = function(selection) {
        selection.each(function(data) {
            // add grid coordinates to the features
            var i, j;
            var features = topojson.feature(data, data.objects.boundaries).features;
            var numCols = features.length / 5;
            var numRows = Math.ceil(features.length / numCols);

            var padding = [0,0];
            var marginLeft = width / 6;
            var nodeWidth = Math.min(height, Math.floor((width - marginLeft - (numCols - 1) * padding[0]) / numCols));
            var nodeHeight = nodeWidth;
            var totalHeight = numRows * nodeHeight;

            // make sure all features fit in the prescribed width
            var projection = d3.geo.mercator()
            .scale(1)
            .precision(0);

            var path = d3.geo.path()
                .projection(projection);

            if (scaleValue === null) {
                scaleValue = 1000000000000;

                for (i = 0; i < features.length; i++) {
                    var feature = features[i];
                    var gb = geoBounds(feature);
                    var b = [projection(gb[0]), projection(gb[1])];
                    // scaling the projection taken from
                    // http://stackoverflow.com/a/17067379/899470
                    /*
                    var s = 0.95 / Math.max(
                            (b[1][0] - b[0][0]) / nodeWidth, 
                            (b[0][1] - b[1][1]) / nodeHeight
                        );
                    */
                     var s = 0.95 / Math.max( (b[1][0] - b[0][0]) / nodeWidth );

                    if (s < scaleValue) {
                        scaleValue = s;
                    }
                }
            }

            // the height for each row will be adjusted dynamically
            var grid = d3.layout.grid().size([width,height])
            .cols(numCols)
            .padding(padding)
            .nodeSize([nodeHeight, nodeWidth]);

            var rectFeatures = grid(features);

            var currY = 0;
            var textHeight = 20;

            var heights = Array(numRows);  //the height of each row
            var rowYPoss = Array(numRows); //the positions of each row

            var maxHeight = 0;
            for (i = 0; i < numRows; i++) {

                // calculate the maximum height of a node in this row
                for (j = 0; j < numCols; j++) {
                    var feature = rectFeatures[i * numCols + j];
                    feature.nodeWidth = nodeWidth;
                    feature.nodeHeight = nodeHeight;
                    createFeaturePath(feature);
                    var bounds = path.bounds(feature.geometry);
                    var featureHeight = bounds[1][1] - bounds[0][1];
                    console.log('featureHeight:', featureHeight);

                    if (featureHeight > maxHeight)
                        maxHeight = featureHeight;
                }

                // set the height of all the nodes in this row to the maximum
                // row height
                for (j = 0; j < numCols; j++) {
                    var feature = rectFeatures[i * numCols + j];
                    feature.y = currY;
                    feature.nodeHeight = maxHeight + textHeight;
                    feature.nodeWidth = nodeWidth;
                }

                heights[i] = maxHeight;
                rowYPoss[i] = currY;

                // set the current position in the grid
                currY += maxHeight + textHeight;
            }


            // get the largest feature and tailor the 
            // projection so that the entire feature fits inside it
            // snuggly

            
            function createFeaturePath(feature) {
                var b = geoBounds(feature);

                projection.center([(b[1][0]+b[0][0])/2, (b[1][1]+b[0][1])/2]);
                projection.translate([feature.nodeWidth/2, feature.nodeHeight/2]);
                projection.scale(scaleValue); 

                return path(feature.geometry);
            }

            var gGrid = d3.select(this).append('g')
            .attr('transform', 'translate(' + marginLeft + ',0)');

            var gSkiArea = gGrid.selectAll(".subunit")
            .data(rectFeatures)
            .enter()
            .append('g')
            .attr('transform', function(d) { 
                console.log('d.y:', d.y);
                return 'translate(' + d.x + ',' + d.y + ')'; 
            });

            gSkiArea.append("path")
            .attr("class", function(d) { return "u" + d.properties.uid; })
            .attr("d", createFeaturePath)
            .attr('id', function(d) { return 'up' + d.properties.uid; })
            .on('mouseover', function(d) {
                d3.select('#uo' + d.properties.uid)
                .style('stroke-width', 2);
                d3.select('#up' + d.properties.uid)
                .style('stroke-width', 2);
            })
            .on('mouseout', function(d) {
                var sel = d3.select('#uo' + d.properties.uid)
                .style('stroke-width', 0);
                d3.select('#up' + d.properties.uid)
                .style('stroke-width', 1);
            });

            gSkiArea.append('text')
            .attr('transform', function(d) {
                console.log('d.nodeHeight:', d.nodeHeight);
                return 'translate(' + (d.nodeWidth / 2) + ',' + (d.nodeHeight + 3) + ')';
            })
            .classed('ski-area-name', true)
            .text(function(d) { return d.properties.name; });

            gSkiArea.append('text')
            .attr('transform', function(d) {
                console.log('d.nodeHeight:', d.nodeHeight);
                return 'translate(' + (d.nodeWidth / 2) + ',' + (d.nodeHeight + 16) + ')';
            })
            .classed('ski-area-name', true)
            .text(function(d) { return "(" + d.properties.country + ")"; });

            var gGlobes = d3.select(this).append('g');
            // add the globes
            //
            console.log('worldJson:', worldJson);

            var continents = ['Europe', 'N. America', 'Asia', 'S. America', 'Aus. / Oceania'];

            for (i = 0; i < numRows; i++) {
                var gThisGlobe = gGlobes.append('g')
                .attr('transform', 'translate(0,' + rowYPoss[i] + ')');

                var centroid = [0,0];
                for (j = 0; j < numCols; j++) {
                    var featureCentroid = d3.geo.centroid(features[i * numRows + j]);
                    centroid[0] += featureCentroid[0];
                    centroid[1] += featureCentroid[1];
                }
                centroid[0] /= numCols;
                centroid[1] /= numCols;

                var clipHeight = nodeWidth;
                var clipWidth = nodeHeight;

                console.log('nodeWidth:', nodeWidth);

                var totalHeight = (heights[i] + textHeight) / 2;
                var scale = 30;
                var worldProjection = d3.geo.orthographic()
                .scale(scale)
                .translate([nodeWidth / 2, totalHeight])
                .rotate([-centroid[0], -centroid[1]])
                .clipAngle(90)
                .precision(0.1);

                var worldPath = d3.geo.path()
                    .projection(worldProjection);

                gThisGlobe.append('path')
                .datum(worldJson)
                .attr('d', worldPath)
                .classed('land', 'true');

                for (j = 0; j < numCols; j++) {
                    var featureCentroid = d3.geo.centroid(features[i * numRows + j]);
                    var point = worldProjection(featureCentroid);

                    gThisGlobe.append('circle')
                    .attr('cx', point[0])
                    .attr('cy', point[1])
                    .attr('r', 3)
                    .classed('ski-area-centroid', true);
                }

                gThisGlobe.append('text')
                .attr('transform', 'translate(' + 5 + ',' + (nodeHeight / 2) + ')rotate(-90)')
                .classed('continent-name', true)
                .text(continents[i]);

                //add circle outlines on top of the red points
                for (j = 0; j < numCols; j++) {
                    var featureCentroid = d3.geo.centroid(features[i * numRows + j]);
                    var point = worldProjection(featureCentroid);

                    gThisGlobe.append('circle')
                    .attr('cx', point[0])
                    .attr('cy', point[1])
                    .attr('r', 3)
                    .attr('id', 'uo' + features[i * numRows + j].properties.uid)
                    .classed('ski-area-outline', true);
                }
            }
        });
    };

    chart.width = function(_) {
        if (!arguments.length) return width;
        width = _;
        return chart;
    };

    chart.height = function(_) {
        if (!arguments.length) return height;
        height = _;
        return chart;
    };

    chart.scale = function(_) {
        if (!arguments.length) return scaleValue;
        scaleValue = _;
        return chart;
    };

    chart.worldJson = function(_) {
        if (!arguments.length) return worldJson;
        worldJson = _;
        return chart;
    };

    return chart;
}

function compareMaps(geoJson) {
    /*
    Create a grid comparing some topojson maps.

    @param geoJson: The topojson file (misleading parameter name)
    */
    var width = 550;
    var height = 550;

    var svg = d3.select('#map-area').append('svg')
        .attr('width', width)
        .attr('height', height);

    var margin = {'top': 10, 'left': 10, 'right': 10, 'bottom': 10};

    var compareChart = mapComparison()
    .width(width - margin.left - margin.right)
    .height(height - margin.top - margin.bottom);

    var prevArgs = arguments;

    d3.json(geoJson, function(data) {
        d3.json('/jsons/world-110m.json', function(world) {
            compareChart.worldJson(topojson.feature(world, world.objects.countries));

            svg.selectAll('g')
            .data([data])
            .enter()
            .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
            .call(compareChart);
        });
    });
}
