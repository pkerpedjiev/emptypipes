---
layout: post
title:  "Largest Ski Areas On Each Continent"
description: "A comparison of the sizes of the five largest ski areas on each continent."
permalink: /largest-ski-areas
tags: leaflet maps ski-areas
---
<meta charset="utf-8"> 
<img itemprop="image" src="/img/itemprop-largest-ski-areas.png" style='display:none' width="200" height="130" />

The chart below shows the five largest ski areas on each continent (except
Antarctica). Africa only has three entries because those are the only ski areas
I found with annotated ski lifts and slopes.  Everything is calculated
according to <a href='#how-its-made'>some reasonable yet arbitrary
heuristics</a> so please take the rankings with a grain of salt. If you click
on a ski area, it will be displayed in the <a href='#map-area-section'>map
below</a>.

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
<b id='how-its-made'>How it's made</b>

Each ski area is defined by something like an [alpha
shape](https://en.wikipedia.org/wiki/Alpha_shape), calculated over all the
lifts and slopes. Each "alpha shape" -like area is calculated by first creating
a Delaunay triangulation of all ski lift and slope waypoints. Every triangle
which has a side greater than 1km is then removed. The result is a set of
disconnected shapes all composed of multiple triangles. Each aggregation of
triangles is what I consider a ski area.

In some cases, this can lead to two ski resorts being connected even though you
might have to walk up to 1km to get from one lift to another (e.g. Kitzbühel /
SkiWelt above). In the opposite case (e.g. Oukaimeden), a long lift may not
be counted simply because the points defining it create degenerate triangles.
Nevertheless, in most cases the shapes created reflect the ski areas they
represent quite well.

Here's the recipe to re-create the graphic:

1. Download OpenStreetMap dumps of each continent
2. Filter for lifts and slopes
3. Sample points along long segments to make sure they're not split
4. Calculate a Delaunay triangulation of all the OSM nodes and the sampled points
5. Exclude all triangles which have an edge longer than 1km (concave hull of sorts)
6. Polygonize
7. Google the towns near the resorts to figure out what the resorts are called
8. Convert to topojson and downsample to reduce the size
9. Make table using d3.js
10. Create zoomable map using leaflet.js and a d3.js overlay

Questions? Comments? [Twitter (@pkerpedjiev)](https://twitter.com/pkerpedjiev) or email ([see about page](/about)).

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
