---
layout: post
title:  "Wikipedia's Climate Data on an Interactive Map"
description: "A map showing climate data such as sunshine, precipitation and snow taken from wikipedia."
tags: maps javascript d3.js leaflet 
---
<meta charset="utf-8"> 
<img itemprop="image" src="/img/sunshine_map/sunshine_map_itemprop.jpg" style='display:none' width=200 height=170>

One of my favorite things about Wikipedia is that most cities have a 'weather box'
which shows historical climate data such as sunshine hours, maximum and minimum
temperatures, precipitation and various other interesting statistics:

<hr>
<a href="https://en.wikipedia.org/wiki/Grytviken#Climate"><img src="/img/sunshine_map/grytviken_weatherbox.jpg"/ width="500px"></a>
<hr>

It's informative to compare the values for different cities. Are summers in
Vienna warmer than in Zürich (yes)? Is Seattle rainier than New York City
(no!)? This often involves jumping from page to page or opening up two browser
windows to compare values.  Couldn't we make it easier? What if we could see
all the values for every place for which there was data at once?

The map below contains a Voronoi diagram overlay where each cell is color coded 
according to the climate data for the location defining that point (default is
sunshine). Moving the mouse over any cell will show the city it corresponds to
as well as its climate data.

A time range can be selected using the circular control on the bottom right
corner (only works on the desktop version).  The letters refer to the months of
the year. Dragging one of the handles will extend or contract the range,
whereas dragging on the range itself will translate it.

Different climate data overlays can be selected via the icon in the upper right corner.

<link rel="stylesheet" href="/css/leaflet.css">
<link rel="stylesheet" href="/css/sunshine.css">

<script src="/js/lib/jquery.min.js"></script>
<script src="/js/lib/underscore-min.js"></script>
<script src="/js/lib/backbone.js"></script>
<script src="/js/lib/d3.min.js"></script>
<script src="/js/lib/queue.min.js"></script>
<script src="/js/lib/topojson.v1.min.js"></script>
<script src="/js/lib/d3.geo.voronoi.js"></script>
<script src="/js/lib/d3.svg.circularbrush.js"></script>
<script src="/js/lib/leaflet.js"></script>
<script src="/js/lib/tile.stamen.js"></script>
<script src="/js/lib/spin.min.js"></script>
<script src="/js/lib/leaflet.spin.js"></script>
<script src="/js/climate-map.js"></script>

<hr>
<div id="climate-map" style="height: 400px; width: 550px;"></div>
<hr>

<script type="text/javascript">

var cm = new ClimateMapViewer();
cm.drawClimateMap('climate-map')

</script>

<h4> How It's Made </h4>

<b>Data Preparation</b>

1. Wikipedia dumps for all the pages are calculated.  
2. For each article that
has an assicated location and weatherbox, we extract the name, latitude,
longitude and weatherbox data and store it in a JSON file.
3. This file is filtered for for any entries that don't have sun,
precipitation, high and low temperatures
4. The final file is used as input to climate-map.js
5. All of the code for parsing wikipedia is [on github](https://github.com/pkerpedjiev/sunshine-map)

<b>Interactive Map</b>

1. Country outlines were obtained from [Johan Sundström's `world.geo.json` github repository](https://github.com/johan/world.geo.json)
2. The circular brush was obtained from [Elijah Meeks' bl.ock](http://bl.ocks.org/emeeks/ccc0368f6fb127d60b7c)
3. There's a bottom layer using [CartoDB's Positron Layer](https://cartodb.com/basemaps), although this is usually covered by up the SVG containing the voronoi diagram.
4. There's a middle layer containing the SVG element with all of the voronoi cells.
5. Then there is a label-only [CartoDB Position Layer](https://cartodb.com/basemaps).
6. Finally, on top of that, the circular brush is used to create the month selector control on the bottom right corner.
7. The layer selector control on the upper right hand corner is a hacked facsimile of [Leaflet.js's Layers Control](http://leafletjs.com/examples/layers-control.html). It's hacked because the different layers aren't actually Leaflet layers, but rather different cross sections of the data. Selecting different options triggers a different data bind for the voronoi cells in the SVG layer.
