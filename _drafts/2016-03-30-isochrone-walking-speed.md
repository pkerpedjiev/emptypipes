---
layout: post
title:  "Isochrones at varying resolutions"
description: "How to determine the the resolution of an isochrone map"
tags: maps javascript d3.js leaflet 
thumbnail: http://emptypipes.org/img/isochrone_example.png
---
<meta charset="utf-8"> 
<img itemprop="image" src="/img/isochrone_example.png" style='display:none' width=200 height=170>

<div id="isochroneDrivingMap" style="height: 400px; width: 550px;"></div>
<div id="isochroneDrivingMapLegend" style="height: 40px; width: 550px;"></div>

<link rel="stylesheet" href="/css/leaflet.css">
<script src="/js/leaflet.js"></script>
<script src="/js/isochrone_driving_map.js"></script>
<script src="/js/cubehelix.js"></script>
<script src="/js/tile.stamen.js"></script>

<script type="text/javascript">
        drawIsochroneMap(48.200, 16.3666, '/jsons/isochrone_driving_contours/vienna_80.json');
        </script>

<b>Errata / Disclaimer</b>
<br>

Everything is an estimate. Rounding errors abound. Don't use this for anything
but entertainment and curiosity. But you already know that.

Some data may be missing. There may be faster routes. Google Maps certainly
finds some better ones.  If you find issues, please let me know and I'll do my
best to fix them.

<hr>
<b>How it's made, technically</b>

For each starting city, an area encompassing 30 degrees north, east, south and
west was subdivided into a .1 degree grid. Directions from the starting city to
each point were calculated using
[graphhopper](https://github.com/graphhopper/graphhopper/) and the OSM map
files. From this, contours were extracted using matplotlib's `contourf`
function. These contour files are stored as JSONs and loaded as a D3.js
overlay on top of a leaflet map.

All of the code used to create these maps [is on
github](https://github.com/pkerpedjiev/roadway_routing). If you have any
questions, feel free to ask.  
<hr>
<b>Background Information and Motivation</b>

This project was a logical extension of the [isochrone train
maps](/2015/05/20/europe-isochrone-map/) of Europe project. 
