---
layout: post
title:  "Largest Ski Areas On Each Continent"
description: "A comparison of the sizes of the five largest ski areas on each continent."
tags: leaflet maps ski-areas
---
<meta charset="utf-8"> 
<img itemprop="image" src="/img/layouts_upon_layouts_itemprop.png" style='display:none' width=200 height=130>

<link rel='stylesheet' href='/css/largest-ski-areas.css'>
<link rel="stylesheet" href="/css/leaflet.css">

<div id="compare-area"></div>
<div id="map-area" style="height: 300px; width: 550px;"></div>

<script src="/js/lib/d3.min.js"></script>
<script src="/js/lib/topojson.v1.min.js"></script>
<script src="/js/lib/d3-grid.js"></script>
<script src="/js/lib/leaflet.js"></script>
<script src="/js/map-area-comparison.js"></script>
<script src="/js/ski-area-map.js"></script>
<script>

var map = drawSkiMap('map-area');
compareMaps('/jsons/largest-ski-areas/topn.topo', map);

</script>
