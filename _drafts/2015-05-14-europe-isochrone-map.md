---
layout: post
title:  "Isochrone Maps of Europe"
description: "A contour map of travel times between European cities. Otherwise known as an isochrone map."
tags: maps javascript d3.js leaflet 
---
<meta charset="utf-8"> 
<img itemprop="image" src="/img/isochrone_example.jpg" style='display:none' width=200 height=170>

Travel times from Vienna by train:
<br>
<br>

<div id="isochroneMap" style="height: 400px; width: 550px;"></div>
<div id="isochroneMapLegend" style="height: 40px; width: 550px;"></div>
<link rel="stylesheet" href="/css/leaflet.css">
<script src="/js/leaflet.js"></script>
<script src="/js/isochrone_map.js"></script>
<script src="/js/conrec.js"></script>
<script src="/js/cubehelix.js"></script>
<script src="/js/tile.stamen.js"></script>

<script type="text/javascript">
drawIsochroneMap(48.2000, 16.3667, '/jsons/isochrone_map/grid_time_vienna_200_5.json');
</script>

<hr>
<b>Other Cities</b>
<br>
<br>
<table style="width: 550px;">
<tr>
<td><a href="/supp/isochrone_amsterdam">Amsterdam</a></td>
<td><a href="/supp/isochrone_antwerp">Antwerp</a></td>
<td><a href="/supp/isochrone_belgrade">Belgrade</a></td>
<td><a href="/supp/isochrone_berlin">Berlin</a></td>
<td><a href="/supp/isochrone_bratislava">Bratislava</a></td>
</tr>
<tr>
<td><a href="/supp/isochrone_brussels">Brussels</a></td>
<td><a href="/supp/isochrone_budapest">Budapest</a></td>
<td><a href="/supp/isochrone_copenhagen">Copenhagen</a></td>
<td><a href="/supp/isochrone_dublin">Dublin</a></td>
<td><a href="/supp/isochrone_geneva">Geneva</a></td>
</tr>
<tr>
<td><a href="/supp/isochrone_helsinki">Helsinki</a></td>
<td><a href="/supp/isochrone_jena">Jena</a></td>
<td><a href="/supp/isochrone_ljubljana">Ljubljana</a></td>
<td><a href="/supp/isochrone_london">London</a></td>
<td><a href="/supp/isochrone_madrid">Madrid</a></td>
</tr>
<tr>
<td><a href="/supp/isochrone_oslo">Oslo</a></td>
<td><a href="/supp/isochrone_paris">Paris</a></td>
<td><a href="/supp/isochrone_podgorica">Podgorica</a></td>
<td><a href="/supp/isochrone_prague">Prague</a></td>
<td><a href="/supp/isochrone_riga">Riga</a></td>
</tr>
<tr>
<td><a href="/supp/isochrone_rome">Rome</a></td>
<td><a href="/supp/isochrone_sofia">Sofia</a></td>
<td><a href="/supp/isochrone_stockholm">Stockholm</a></td>
<td><a href="/supp/isochrone_tallinn">Tallinn</a></td>
<td><a href="/supp/isochrone_vienna">Vienna</a></td>
</tr>
<tr>
<td><a href="/supp/isochrone_vilnius">Vilnius</a></td>
<td><a href="/supp/isochrone_warsaw">Warsaw</a></td>
<td><a href="/supp/isochrone_zagreb">Zagreb</a></td>
</tr>
</table>
<hr>

<b>Background Information and Motivation</b>
<hr>

While browsing twitter, I recently came across [this wonderful isochrone map]
(https://alternativetransport.wordpress.com/2015/05/07/what-is-an-isochrone-map/)
of the travel times by train from Vienna to the surrounding region at the turn
of the century. As happy resident of Vienna, an avowed admirer of trains, and 
an ardent afficionado of maps, that map strikes a strong chord with me not only
for its historic cachet but for its clean design and aesthetic appeal. It conjured
images of steam trains (were the trains in 1900 still running on steam?) chugging
along between the imperial centers of Vienna and Budapest. It made me wonder about
how people commuted from the train station to their final destination. It made
me question my conception of how long it took to get from place to place. Most of
all, however, it made me wonder what such a map would look like today.

Having toyed with the idea of plotting travel times by train in [a previous
post](/2015/03/25/train-travel-times-in-europe-map/), the map
at [alternativetransport.org](https://alternativetransport.wordpress.com/2015/05/07/what-is-an-isochrone-map/) made me realize that contour lines are much better
way of presenting the information. Relying on shades of a color makes it difficult
to distinguish difference between disparate points on the map as well as to
convert to an absolute value. Questions such as "how much darker is point A
than point B?" and "what actual time does a particular shade correspond to?" are
resolved using the interactive maps (i.e. [Vienna](), [Paris](), [London](),
[Berlin]()), but these fail to provide the information at a mere glance. A
map containing contour lines corresponding to the locations which can be reached
in a particular amount of time provides a clear and concise comparison between
the travel times to various locations as well as a concrete reference to the
absolute time required to reach a particular point. An example of such a map,
called an isochrone map, is provided for Vienna above.
<hr>
<font size="2pt">
The method for obtaining the data is descriped in the [Europe by Train post](/2015/05/11/2015-05-12-europe-high-speed-rail/). For
more information, feel free to ask.
</font>