d3.layout.grid = function() {
    var numCells = 1;
    var aspect = 1;
    var widthTotal = 550;
    var heightTotal = 300;

    function grid(d) {
        numCells = d.length;

        var widthIndividual = Math.sqrt(aspect * widthTotal * heightTotal / numCells);

        //fill the window horizantally
        var minNx = Math.floor(widthTotal / widthIndividual);
        var maxNy = Math.ceil(numCells / minNx);

        //fill the window vertically
        var maxNx = Math.ceil(widthTotal / widthIndividual);
        var minNy = Math.ceil(numCells / maxNx);

        var horizontalWidth = Math.min((widthTotal / maxNx),
                                       (aspect * heightTotal / minNy ));
        var horizontalHeight = horizontalWidth / aspect;

        var verticalHeight = (heightTotal / maxNy);
        var verticalWidth = verticalHeight * aspect;

        var totalAreaHorizontal = numCells * horizontalWidth * horizontalHeight;
        var totalAreaVertical = numCells * verticalHeight * verticalWidth;

        console.log('totalAreaHorizontal:', totalAreaHorizontal);
        console.log('totalAreaVertical:', totalAreaVertical);

        if (totalAreaHorizontal > totalAreaVertical) {
            widthI = horizontalWidth;
            heightI = horizontalHeight;

            numX = maxNx;
            numY = minNy;
        } else {
            widthI = verticalWidth;
            heightI = verticalHeight;

            numX = minNx;
            numY = maxNy;
        }

        console.log('horizontalHeight:', horizontalHeight);
        console.log('verticalHeight:', verticalHeight);
        console.log('heightI', heightI);

        return d.map(function(d1, i) {
            return {
                pos: { x:  widthI * (i % numX) ,
                       y:  heightI * Math.floor(i / numX) ,
                       width: widthI,
                       height: heightI
                },
                data: d1
            };
        });
    }

    grid.size = function(_) {
        if (!arguments.length) return _;
        else {
            widthTotal = _[0];
            heightTotal = _[1];
        }
        return grid;
    };

    grid.aspect = function(_) {
        if (!arguments.length) return aspect;
        else aspect = _;
        return grid;
    };

    return grid;
};

function gridLayout(inData, aspectRatio) {
    var data = inData;
    var numCells = data.length;
    var aspect = aspectRatio;
    var widthTotal = 550;
    var heightTotal = 300;

    function chart(selection) {
        var widthIndividual = Math.sqrt(aspect * widthTotal * heightTotal / numCells);

        //fill the window horizantally
        var minNx = Math.floor(widthTotal / widthIndividual);
        var maxNy = Math.ceil(numCells / minNx);

        //fill the window vertically
        var maxNx = Math.ceil(widthTotal / widthIndividual);
        var minNy = Math.ceil(numCells / maxNx);

        var horizontalWidth = (widthTotal / maxNx);
        var horizontalHeight = horizontalWidth / aspect;

        var verticalHeight = (heightTotal / maxNy);
        var verticalWidth = verticalHeight * aspect;

        var totalAreaHorizontal = numCells * horizontalHeight * horizontalHeight;
        var totalAreaVertical = numCells * verticalHeight * verticalWidth;

        if (totalAreaHorizontal > totalAreaVertical) {
            widthI = horizontalWidth;
            heightI = horizontalHeight;

            numX = maxNx;
            numY = minNy;
        } else {
            widthI = verticalWidth;
            heightI = verticalHeight;

            numX = minNx;
            numY = maxNy;
        }

        selection.selectAll('.grid-rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('x', function(d,i) { return widthI * (i % numX); })
        .attr('y', function(d,i) { console.log('i:', i); ret = heightI * Math.floor(i / numX);  return ret; })
        .attr('width', widthI)
        .attr('height', heightI)
        .classed('grid-rect', true);
    }

    
    var width = function(_) {
        if (!arguments.length) return _;
        else widthTotal = _;
        return chart;
    };

    var height = function(_) {
        if (!arguments.length) return _;
        else heightTotal = _;
        return chart;
    };

    return chart;
}

