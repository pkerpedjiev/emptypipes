/*jshint plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, strict: false */
/*global d3: false */

"use strict";


function goombaPlot() {
    var width = 550;
    var height = 400;
    var margin = {'top': 30, 'left': 30, 'bottom': 30, 'right': 40};
    
    function chart(selection) {
        selection.each(function(data) {
            console.log('data:', data);
            // Select the svg element, if it exists.
            var svg = d3.select(this).selectAll("svg").data([data]);

            var zoom = d3.behavior.zoom()
                .on("zoom", draw);

            // Otherwise, create the skeletal chart.
            var gEnter = svg.enter().append("svg").append("g");
            var gMain = gEnter.append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);

            gEnter.insert("rect", "g")
            .attr("class", "pane")
            .attr("width", width)
            .attr("height", height)
            .attr('pointer-events', 'all');

            gEnter.call(zoom);

            svg.attr('width', width)
            .attr('height', height);

            console.log('data:', data);

            // Get the names of the chromosomes
            let chromosomes = Array.from(new Set(data.map((d) => { return d.chr; })));
            let chromosomeLengths = chromosomes.map((d) => {
                let lengths = data.filter((e) => { return e.chr == d;  })
                                .map((e) => {return +e.end; });
                return {"name": d,
                        "length": d3.max(lengths)
                        };
                    });

            // order them according to the maximum start position
            // of all genes
            let chromosomesInOrder = chromosomeLengths
                .sort((a,b) => { return b.length - a.length; })
                .map((d) => { return d.name; });

            console.log('chromosomesInOrder:', chromosomesInOrder);

            var yScale = d3.scale.ordinal()
            .domain(chromosomesInOrder)
            .rangeRoundBands([0, height - margin.top - margin.bottom], 0.4);

            var xScaleDomain = [0, d3.max(data.map((d) => { return +d.end; }))];

            console.log('xScaleDomain', xScaleDomain);

            /****** Scales *************/
            var xScale = d3.scale.linear()
            .domain(xScaleDomain)
            .range([0, width-margin.left - margin.right]);

            var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("bottom")
            .ticks(4);

            var gXAxis = gEnter.append("g")
            .attr("class", "x axis")
            .attr("transform", `translate(${margin.left}, ${height - margin.top})`);

            gXAxis.call(xAxis);

            var gYAxis = gEnter.append("g")
            .attr("class", "y axis")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

            var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left");

            gYAxis.call(yAxis);

            let colorDomain = d3.extent(data.map((d) => { return +Math.log(d.count); }));
            let colorScale = d3.scale.linear()
            .domain(colorDomain)
            .range(['#FFFFFF', '#000000']);
            
            console.log('colorDomain:', colorDomain);

            gMain.selectAll('rect')

            let gGenes = gMain.selectAll('.gene')
            .data(data)
            .enter()
            .append('g')
            .classed('gene', true)

            gGenes.append('rect')
            .classed('gene-rect', true)
            .attr('x', (d) => { return xScale(d.start); })
            .attr('y', (d) => { return yScale(d.chr); })
            .attr('width', (d) => { return xScale(d.end) - xScale(d.start); })
            .attr('height', (d) => { return yScale.rangeBand(); })
            .attr('stroke', (d) => { return colorScale(Math.log(+d.count)); })
            .attr('fill', (d) => { return colorScale(Math.log(+d.count)); });

            zoom.x(xScale).scaleExtent([1,data.length / 10])
            .xExtent(xScaleDomain);

            let labelSort = (a,b) => { return (+b.count - (+a.count)); }
            var scaledX, scaledY;

            data.sort(labelSort);

            function draw() {
                let scaledX = xScale;
                let scaledY = yScale;

                gMain.selectAll('rect')
                .attr('x', (d) => { return xScale(d.start); })
                .attr('y', (d) => { return yScale(d.chr); })
                .attr('width', (d) => { return xScale(d.end) - xScale(d.start); });

                gXAxis.call(xAxis);

                let labelFilter =  (d) => {
                    if ((d.start) > scaledX.invert(0) &&
                        (d.end) < scaledX.invert(width - margin.right))
                        return true;
                    return false;
                }

                let visibleAreas = data.filter(labelFilter);
                let labelText = (d) => { return d.symbol; };
                let labelAnchor = (d) => { return 'middle' };
                let labelId = (d) => { return `n-${d.geneid}`; }
                let labelPosition = (d,i) => { 
                    return `translate(${(scaledX(d.start) + scaledX(d.end)) / 2},
                    ${scaledY(d.chr) - 7})`;
                }

                var zoomableLabelsOrientation = zoomableLabels()
                .labelFilter(labelFilter)
                .labelText(labelText)
                .labelAnchor(labelAnchor)
                .labelId(labelId)
                .labelPosition(labelPosition)
                .labelParent(gMain)
                .labelSort(labelSort);

                gGenes.call(zoomableLabelsOrientation);
            }

            draw();

            console.log('chromosomes', chromosomes);
            console.log('chromosomeLengths', chromosomeLengths);

        });
    }

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

    return chart;
}
