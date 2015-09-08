---
layout: post
title:  "Wikipedia's Climate Data on an Interactive Map"
description: "A map showing climate data such as sunshine, precipitation and snow taken from wikipedia."
tags: maps javascript d3.js leaflet 
---
<meta charset="utf-8"> 
<img itemprop="image" src="/img/sunshine_map/sunshine_map_itemprop.jpg" style='display:none' width=200 height=170>

<b>Introduction</b>

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
all the values for every place for which there was data at once? What if we
could show how the weather changes over the course of the year for the
whole world at once?

<hr>
<table>
<tr>
<td>
<img src="/img/sunshine_map/sunshine_animation.gif"/>
</td>
<td>
<img src="/img/sunshine_map/precipitation_animation.gif"/>
</td>
<td>
<img src="/img/sunshine_map/temperature_animation.gif"/>
</td>
</tr>
<tr>
<td style="text-align: center">Sunshine</td>
<td style="text-align: center">Precipitation</td>
<td style="text-align: center">Daily High</td>
</tr>
</table>
<hr>

The animations above show how the world's climate changes over the year, as
documented in Wikipedia's weather boxes. The sunshine mostly follows the a
predictable pattern following the seasons. Bright in the northern hemisphere
from April to October and vice versa. A few exceptions stick out, such as the
prominently cloudier regions over the equatorial land masses, which largely
correspond to the rainforests of the Amazon, Mid-Western Africa and Indonesia,
Malaysia, and Papua New Guinea. 

These rainy regions can be more easily recognized in the middle animation above
which show how the precipitation changes over the year. As expected the
rainiest regions are where we find rainforests near the equator, as well as
along the coast of British Columbia and northern Washington in the US. A few
rainy islands in the Pacific and South Atlantic are shown with
disproportionately large areas due to the lack of any other weather stations
nearby (see the description of the map below).

The temperature map is also as expected, wherein the temperatures follow the
seasons. Most striking, perhaps, is how much the temperatures change over the
large landmasses of North America and Siberia, as compared to the oceanic
regions. The astutue eye may also notice persistently colder temperatures over
Tibet due to its high elevation.

These animations were created by recording interactions with the map described
below.

<b>The Map</b>

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

1. Wikipedia dumps for all the pages are downloaded.  
2. For each article that
has an associated location and weatherbox, I extract the name, latitude,
longitude and weatherbox data and store it in a JSON file.
3. This file is filtered for for any entries that don't have sun,
precipitation, high and low temperatures
4. The final file is used as input to climate-map.js
5. All of the code for parsing wikipedia is [on github](https://github.com/pkerpedjiev/sunshine-map)

<b>Interactive Map</b>

1. Country outlines were obtained from [Johan Sundström's `world.geo.json` github repository](https://github.com/johan/world.geo.json)
2. The circular brush was obtained from [Elijah Meeks' bl.ock](http://bl.ocks.org/emeeks/ccc0368f6fb127d60b7c)
3. The map itself is displayed using [leaflet.js](http://leafletjs.com/).
4. There's a bottom layer using [CartoDB's Positron Layer](https://cartodb.com/basemaps), although this is usually covered by up the SVG containing the voronoi diagram.
5. There's a middle layer containing the SVG element with all of the voronoi cells.
6. There's a label-only [CartoDB Position Layer](https://cartodb.com/basemaps).
7. Finally, on top of that, the circular brush is used to create the month selector control on the bottom right corner.
8. The layer selector control on the upper right hand corner is a hacked facsimile of [Leaflet.js's Layers Control](http://leafletjs.com/examples/layers-control.html). It's hacked because the different layers aren't actually Leaflet layers, but rather different cross sections of the data. Selecting different options triggers a different data bind for the Voronoi cells in the SVG layer.

<b>Related</b>

A similar map is available for historical temperatures at [halftone.co](http://halftone.co/projects/temperatures/).
