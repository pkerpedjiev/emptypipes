---
layout: post
title:  "D3.js and Contouring"
description: "A comparison of javascript contouring libraries and how they can be used with d3.js"
tags: javascript d3.js
---

<table border="0">
    <tr>
        <td colspan='2' align='center'><hr><b>MarchingSquares.js</b><hr></td>
    </tr>
    <tr>
        <col width="225">
        <col width="225">
    <td><div id="marchingSquaresContourPlotDiv"></div></td><td>
        <b>Pros</b>: Simple. Adds contours to the edges of the data. True
        iso-band support. <br><br>
            <b>Cons</b>: Works only on gridded data. No option for specifying
                 x- and y- values.
        </td>
    </tr>
    <tr>
        <td colspan='2' align='center'><hr><b>Conrec.js</b><hr></td>
    </tr>
    <tr>
        <td><div id="conrecContourPlotDiv"></div></td>
        <td style="vertical-align:middle">
            <b>Pros</b>: Options for specifying x- and y- values.<br><br>
            <b>Cons</b>: Works only on gridded data. Doesn't return
            true iso-bands. Requires a extra values to draw a border.
        </td>
    </tr>
    <tr>
        <td colspan='2' align='center'><hr><b>Turf.js</b><hr></td>
    </tr>
    <tr>
        <td style="vertical-align: middle">
        <div id="turfContourPlotDiv"></div></td>
        <td style="vertical-align: middle">
            <b>Pros</b>: Interpolates the input data. Works with GeoJSON data
            structures.<br> <br>
            <b>Cons</b>: Interpolates the input data (can cause
            distortions). Works with GeoJSON data structures. Doesn't return
            actual iso-bands.
        </td>
    </tr>
</table>

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
