---
layout: post
title:  "Isochrone Driving Maps of the World"
description: "A contour map of driving times from various cities. Otherwise known as an isochrone map."
tags: maps javascript d3.js leaflet 
---
<meta charset="utf-8"> 
<img itemprop="image" src="/img/isochrone_example.jpg" style='display:none' width=200 height=170>

<link rel="stylesheet" href="/css/leaflet.css">
<script src="/js/leaflet.js"></script>
<script src="/js/isochrone_driving_map.js"></script>
<script src="/js/cubehelix.js"></script>
<script src="/js/tile.stamen.js"></script>

This map shows how far one may expect to drive in less than 24 hours
starting in Vienna.
<br>
<br>

<div id="isochroneDrivingMap" style="height: 400px; width: 550px;"></div>
<div id="isochroneDrivingMapLegend" style="height: 40px; width: 550px;"></div>

<script type="text/javascript">
        drawIsochroneMap(48.200, 16.3666, '/jsons/isochrone_driving_contours/vienna.json');
        </script>

{% include isochrone_driving_cities_list.html %}

The origin of this map is described in slightly more detail <a href="/2015/05/20/driving-isochrone-map/">in the original blog post.</a>

<hr>
<b>Errata / Disclaimer</b>
<br>
Everything is an estimate. Rounding errors abound. Don't use this for anything but entertainment and curiosity. But you already know that.
<br>
<br>

Some data may be missing. There may be faster routes.
If you find issues, please let me know
and I'll do my best to fix them.
<br>
<br>
