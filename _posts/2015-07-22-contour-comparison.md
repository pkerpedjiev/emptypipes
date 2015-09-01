---
layout: post
title:  "D3.js and Contouring"
description: "A comparison of javascript contouring libraries and how they can be used with d3.js"
tags: javascript d3.js
---

Contouring is an important way for displying 3D data in 2D. At its core are
iso-lines, along which values in the third-dimension have equal values, and
iso-bands which are areas that encompasse values within some
range (e.g. greater than 2 and less than 10). It is used for anything from
topographical maps to show lines of equal elevation, weather maps to show
regions of equal pressure to probability density plots to show regions
with equal probability density. Calculating iso-lines and iso-bands is often
done by interpolating values on a grid. 

From a practical standpoint, there appear to be 3 javascript libraries capable
of calculating iso-lines and iso-bands,
[MarchingSquares.js](https://github.com/RaumZeit/MarchingSquares.js),
[conrec.js](https://github.com/jasondavies/conrec.js) and
[Turf.js](https://github.com/Turfjs/turf). The table below shows an overview
of the three different implementations and is followed by a slightly more
thorough explanation of their strengths and weaknesses.

<table border="0">
        <tr>
        <col width="183">
        <col width="183">
        <col width="183">

        <td><div id="marchingSquaresContourPlotDiv"></div></td>
        <td><div id="conrecContourPlotDiv"></div></td>
        <td><div id="turfContourPlotDiv"></div></td></td>
        </tr>
        <tr>
        <td align='center'><hr><b><a href="https://github.com/RaumZeit/MarchingSquares.js">MarchingSquares.js</a></b><hr></td>
        <td align='center'><hr><b><a href="https://github.com/jasondavies/conrec.js">Conrec.js</a></b><hr></td>
        <td align='center'><hr><b><a href="https://github.com/Turfjs/turf">Turf.js</a></b><hr></td>
        </tr>
        <tr>
        <td style="vertical-align: top">
        <b>Pros</b>: Simple. Adds contours to the edges of the data. True
        iso-band support.<br><br>
        </td>
        <td style="vertical-align:top">
            <b>Pros</b>: Options for specifying x- and y- values.
        </td>
        <td style="vertical-align: top">
            <b>Pros</b>: Interpolates the input data. Works with GeoJSON data
            structures.
        </td>
        </tr>
        <tr>
        <td style="vertical-align:top">
            <b>Cons</b>: Works only on gridded data. No option for specifying
                 x- and y- values.
                 </td>
        <td style="vertical-align:top">
            <b>Cons</b>: Works only on gridded data. Doesn't return
            true iso-bands. Requires a extra values to draw a border.
        </td>
        <td style="vertical-align: top">
            <b>Cons</b>: Interpolates the input data (can cause
            distortions). Works with GeoJSON data structures. Doesn't return
            actual iso-bands.
            </td>
        </tr>
</table>

<hr>

[MarchingSquares.js](https://github.com/RaumZeit/MarchingSquares.js) uses the eponymous
algorithm to calculate both iso-lines and iso-bands. [Conrec.js](https://github.com/jasondavies/conrec.js) uses a slightly 
different algorithm and returns iso-lines, whereas [Turf.js](https://github.com/Turfjs/turf) appears to use the
conrec algorithm to generate iso-lines. The examples above used the following 
data set. The `breaks` indicates where we want the iso-lines, and the iso-regions should
correspond to areas between adjacent `breaks`.

<pre>
    var breaks = [0, 4.5, 9, 13.5, 18];
    var data = [[18, 13, 10, 9, 10, 13, 18],
        [13, 8, 5, 4, 5, 8, 13],
        [10, 5, 2, 1, 2, 5, 10],
        [9, 4, 1, 12, 1, 4, 9],
        [10, 5, 2, 1, 2, 5, 10],
        [13, 8, 5, 4, 5, 8, 13],
        [18, 13, 10, 9, 10, 13, 18],
        [18, 13, 10, 9, 10, 13, 18]];
</pre>

[MarchingSquares.js](https://github.com/RaumZeit/MarchingSquares.js) accurately
returns is iso-bands and draws the plot as expected. Each path corresponds to 
a particular region. Thus hovering over the middle section also highlights the
outer section which corresponds to the same values (13.5 - 18).

[Conrec.js](https://github.com/jasondavies/conrec.js) correctly outlines the regions, but the level returned for the
second and third sections from the middle is the same although they should
correspond to different iso-bands. To create the plot, it was also necessary 
to add some artifically high values along the outside boundaries so that iso-lines
were drawn around the edges.

[Turf.js](https://github.com/Turfjs/turf) interpolated the data onto another grid and drew iso-lines in the same
manner as [conrec.js](https://github.com/jasondavies/conrec.js). The automatic interpolation is listed in the table as both
a <b>pro</b> and a <b>con</b> because it can be useful when the data is not already
on a grid, but deleterious when it insists on using a uniform resolution on both
the x and y scales and re-interpolating already gridded data (as in the example
above).

Needless to say, of the three methods,
[MarchingSquares.js](https://github.com/RaumZeit/MarchingSquares.js) was the
easiest and most aesthetically pleasing to me so I will likely use it in the
future.

The code for all three of these examples can be found in a [github repository here](https://github.com/pkerpedjiev/d3-contouring-example).

If you see any errors or omissions or know of a way to make the Turf.js example look more reasonable, please let me know on [Twitter](https://twitter.com/pkerpedjiev) or by email.

<script src="/js/lib/d3.min.js"></script>
<script src="/js/lib/conrec.js"></script>
<script src="/js/lib/turf.custom.js"></script>
<script src="/js/lib/marchingsquares-isobands.min.js"></script>
<script src="/js/circle-marchingsquares-example.js"></script>
<script src="/js/circle-conrec-example.js"></script>
<script src="/js/circle-turf-example.js"></script>
<script>

drawMarchingSquaresContours('#marchingSquaresContourPlotDiv');
drawConrecContours('#conrecContourPlotDiv');
drawTurfContours('#turfContourPlotDiv')
</script>
