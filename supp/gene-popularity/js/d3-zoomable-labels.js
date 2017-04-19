"use strict";

function zoomableLabels() {
    let labelFilter = null;
    let labelText = null;
    let labelAnchor = null;
    let labelId = null;
    let labelPosition = null;
    let labelParent = null
    let labelSort = null;

    function intersectRect(r1, r2) {
        return !(r2.left > r1.right || 
                 r2.right < r1.left || 
                 r2.top > r1.bottom ||
                 r2.bottom < r1.top);
    }

    function chart(selection) {
        let visibleAreas = selection.data().filter(labelFilter);
        visibleAreas.sort(labelSort);

        // remove all the labels
        labelParent.selectAll('.zoomable-label').remove();

        var textLabels = labelParent.selectAll('.zoomable-label')
        .data(visibleAreas.slice(0,10))
        .enter()
        .append('text')
        .classed('zoomable-label', true)
        .attr('id', labelId)
        .attr('text-anchor', labelAnchor)
        .text(labelText)
        .attr('transform', labelPosition);

        textLabels.each(function(d,i) {
            let bb1 = this.getBoundingClientRect();
            //console.log(`i: ${i}`);

            if (d3.select(this).attr('visibility') == 'hidden')
                return;

            textLabels.each(function(e,j) {
                if (j <= i)
                    return;
                //console.log(`i: ${j}`);

                let bb2 = d3.select(this).node().getBoundingClientRect();

                if (intersectRect(bb1, bb2)) {
                    d3.select(this).attr('visibility', 'hidden');
                    return;
                }
            });
        });
    }

    chart.labelFilter = function(_) {
        if (!arguments.length) return labelFilter;
        labelFilter = _;
        return chart;
    }

    chart.labelText = function(_) {
        if (!arguments.length) return labelText;
        labelText = _;
        return chart;
    }

    chart.labelAnchor = function(_) {
        if (!arguments.length) return labelAnchor;
        labelAnchor = _;
        return chart;
    }
    
    chart.labelId = function(_) {
        if (!arguments.length) return labelId;
        labelId = _;
        return chart;
    }

    chart.labelPosition = function(_) {
        if (!arguments.length) return labelPosition;
        labelPosition = _;
        return chart;
    }

    chart.labelParent = function(_) {
        if (!arguments.length) return labelParent;
        labelParent = _;
        return chart;
    }

    chart.labelSort = function(_) {
        if (!arguments.length) return labelSort;
        labelSort = _;
        return chart;
    }

    return chart;
}

