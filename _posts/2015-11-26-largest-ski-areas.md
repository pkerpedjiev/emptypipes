---
layout: post
title:  "Largest Ski Areas On Each Continent"
description: "A comparison of the sizes of the five largest ski areas on each continent."
tags: leaflet maps ski-areas
---
<meta charset="utf-8"> 
<img itemprop="image" src="/img/layouts_upon_layouts_itemprop.png" style='display:none' width=200 height=130>

The chart below shows the five largest ski areas on each continent (except
Antarctica). Africa only has three entries because those are the only ski areas
I found with annotated ski lifts and slopes.  Everything is calculated
according to heuristics so take it with a grain of salt. If you click on
a ski area, it will be displayed in the map below.

<link rel='stylesheet' href='/css/largest-ski-areas.css'>
<link rel="stylesheet" href="/css/leaflet.css">

<hr>
<div id="compare-area"></div>
<hr>

<b id='map-area-section'>The Map</b>

All the ski areas in the chart above are annotated on the map below. Clicking
on an area above centers the map below.

<hr>
<div id="map-area" style="height: 300px; width: 550px;"></div>
<hr>
<b>How it's made</b>

What constitutes a ski area you ask? In this case, it's the concave hull of
all lifts and slopes that are no further than 1km from each other. Here's the recipe:

1. Download OpenStreetMap dumps of each continent
2. Filter for lifts and slopes
3. Sample points along long segments to make sure they're not split
4. Calculate a Delaunay triangulation of all the OSM nodes and the sampled points
5. Exclude all triangles which have an edge longer than 1km (concave hull of sorts)
6. Polygonize
7. Convert to topojson and downsample to reduce the size
8. Google the towns near the resorts to figure out what the resorts are called
9. Make table using D3.js
10. Create zoomable map using leaflet.js and a d3.js overlay

Questions? Comments? Twitter or email.

<script src="/js/lib/d3.min.js"></script>
<script src="/js/lib/topojson.v1.min.js"></script>
<script src="/js/lib/d3-grid.js"></script>
<script src="/js/lib/leaflet.js"></script>
<script src="/js/largest-ski-areas.js"></script>
<script src="/js/ski-area-map.js"></script>
<script>

var skiAreasFn = '/jsons/largest-ski-areas/topn.topo'

var map = drawSkiMap('map-area', skiAreasFn);
compareMaps(skiAreasFn, map);

</script>
