d3.layout.aspectGrid = function() {
    var numCells = 1;
    var aspect = 1;
    var widthTotal = 550;
    var heightTotal = 300;

    var alignment = "best";

    function grid(d) {
        numCells = d.length;

        var tA = (widthTotal / heightTotal);
        var onW = Math.sqrt(tA * numCells / aspect);
        var onH = numCells / onW;

        var iH, iW;
        var nW, nH;
        var totalAreaVertical, horizontalW, horizontalH;
        var totalAreaHorizontal, verticalW, verticalH;

        if (alignment == 'vertical' || alignment == 'best') {
            nH = Math.floor(onH) - 1;
            do {
                nH += 1;
                nW = Math.ceil(numCells / nH);
                iH = heightTotal / nH;
                iW = iH * aspect;
            } while (iW * nW > widthTotal);

            totalAreaVertical = numCells * iH * iW;
            verticalnW = nW;
            verticalnH = nH;

            verticaliW = iW;
            verticaliH = iH;
        }

        if (alignment == 'horizontal' || alignment == 'best') {
            nW = Math.floor(onW)-1;
            do {
                nW += 1;
                nH = Math.ceil(numCells / nW);

                iW = widthTotal / nW;
                iH = iW / aspect;
            } while (iH * nH > heightTotal);

            totalAreaHorizontal = numCells * iH * iW;
            horizontalnW = nW;
            horizontalnH = nH;

            horizontaliW = iW;
            horizontaliH = iH;
        }
        
        /*
        console.log('totalAreaHorizontal:', totalAreaHorizontal);
        console.log('totalAreaVertical:', totalAreaVertical);
        */

        var currentAlignment;

        if (alignment == 'best') {
            if (totalAreaHorizontal > totalAreaVertical) {
                currentAlignment = 'horizontal';
            } else {
                currentAlignment = 'vertical';
            }
        } else {
            currentAlignment = 'alignment';
        }

        if (currentAlignment == 'vertical') {
            nH = verticalnH;
            nW = verticalnW;

            iH = verticaliH;
            iW = verticaliW;
        } else if (currentAlignment == 'horizontal') {
            nH = horizontalnH;
            nW = horizontalnW;

            iH = horizontaliH;
            iW = horizontaliW;
        }

        nW = Math.floor(0.005 + widthTotal / iW); //rounding errors

        return d.map(function(d1, i) {
            return {
                pos: { x:  iW * (i % nW) ,
                       y:  iH * Math.floor(i / nW) ,
                       width: iW,
                       height: iH
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

    grid.alignment = function(_) {
        if (!arguments.length) return alignment;
        else alignment = _;
        return grid;
    };

    return grid;
};


