---
layout: post
title:  "Isochrone Maps of Europe"
description: "A contour map of travel times between European cities. Otherwise known as an isochrone map."
tags: maps javascript d3.js leaflet 
---
<meta charset="utf-8"> 
<img itemprop="image" src="/img/isochrone_example.jpg" style='display:none' width=200 height=170>

<b>Edit:</b> Any time you see 'train' below, it should technically be public transport. The vast
vast majority of the travel used to make these maps is by train, but a very small percentage may
involve ferries or buses.
<br>
<br>
Below is a map showing how long one would expect to travel to any point in Europe
starting in Vienna, using only trains and walking at a brisk rate of 5 min / kilometer.
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
drawIsochroneMap(48.2000, 16.3667, '/jsons/isochrone_contours/vienna.json');
</script>
<hr>
<b>Other Cities</b>
<br>

<table style="width: 550px;">
<tr>
<td><a href="/supp/isochrone_amsterdam">Amsterdam</a></td>
<td><a href="/supp/isochrone_antwerp">Antwerp</a></td>
<td><a href="/supp/isochrone_barcelona">Barcelona</a></td>
<td><a href="/supp/isochrone_belgrade">Belgrade</a></td>
</tr>
<tr>
<td><a href="/supp/isochrone_berlin">Berlin</a></td>
<td><a href="/supp/isochrone_birmingham">Birmingham</a></td>
<td><a href="/supp/isochrone_bratislava">Bratislava</a></td>
<td><a href="/supp/isochrone_brussels">Brussels</a></td>
</tr>
<tr>
<td><a href="/supp/isochrone_bucharest">Bucharest</a></td>
<td><a href="/supp/isochrone_budapest">Budapest</a></td>
<td><a href="/supp/isochrone_copenhagen">Copenhagen</a></td>
<td><a href="/supp/isochrone_dublin">Dublin</a></td>
</tr>
<tr>
<td><a href="/supp/isochrone_frankfurt">Frankfurt</a></td>
<td><a href="/supp/isochrone_geneva">Geneva</a></td>
<td><a href="/supp/isochrone_helsinki">Helsinki</a></td>
<td><a href="/supp/isochrone_jena">Jena</a></td>
</tr>
<tr>
<td><a href="/supp/isochrone_ljubljana">Ljubljana</a></td>
<td><a href="/supp/isochrone_london">London</a></td>
<td><a href="/supp/isochrone_madrid">Madrid</a></td>
<td><a href="/supp/isochrone_minsk">Minsk</a></td>
</tr>
<tr>
<td><a href="/supp/isochrone_oslo">Oslo</a></td>
<td><a href="/supp/isochrone_paris">Paris</a></td>
<td><a href="/supp/isochrone_podgorica">Podgorica</a></td>
<td><a href="/supp/isochrone_prague">Prague</a></td>
</tr>
<tr>
<td><a href="/supp/isochrone_riga">Riga</a></td>
<td><a href="/supp/isochrone_rome">Rome</a></td>
<td><a href="/supp/isochrone_sofia">Sofia</a></td>
<td><a href="/supp/isochrone_stockholm">Stockholm</a></td>
</tr>
<tr>
<td><a href="/supp/isochrone_tallinn">Tallinn</a></td>
<td><a href="/supp/isochrone_vienna">Vienna</a></td>
<td><a href="/supp/isochrone_vilnius">Vilnius</a></td>
<td><a href="/supp/isochrone_warsaw">Warsaw</a></td>
</tr>
<tr>
<td><a href="/supp/isochrone_zagreb">Zagreb</a></td>
<td><a href="/supp/isochrone_zurich">Zurich</a></td>
</tr>
</table>

<hr>
<b>Errata / Disclaimer</b>
<br>
Everything is an estimate. Rounding errors abound. Don't use this for anything but entertainment and curiosity. But you already know that.
<br>

Some data may be missing. There may be faster connections.
If you find issues, please let me know
and I'll do my best to fix them.
Thanks to <i>cuicuit</i> on reddit and
[@yorksranter](https://twitter.com/yorksranter) for pointing out missing data
for Paris and London! This data has been added.
<br>

Ireland and parts of Spain are not well represented due to missing data.
<br>
<hr>
<b>How it's made, technically</b>
<br>

I used the [Swiss public transport API](http://transport.opendata.ch/) 
to get travel times to most other small-medium sized cities in Europe. Then I 
created a rectangle enclosing most of Europe (the borders of which can be seen
in the maps for Stockholm, Helsinki and some of the Baltic countries), and
divided it into a grid (200 x 200 points). For each point in this grid, I calculated
the fastest way to get to it assuming that the distance between the any train
station and that point can be walked at a rate of 5 minutes / kilometer. Any points
on water were assigned a swimming rate of 100 minutes / kilometer in order to create
dense contours at the coasts.

This grid was used as an input to `conrec.js` which created a set of contour lines.
These lines were then plotted as a paths using `d3.js` on top of a `leaflet.js` 
layer using the [Stamen maps tiles](http://maps.stamen.com/toner/). These tiles 
were chosen because they provide tile sets containing the borders and labels
which can be overlayed on top of the colored contour plot.

The legend is its own div positioned directly below the map. The color map is cubehelix,
which provides a nice range from dark to light tones while providing intermediate colors
to distinguish the different contours.

<hr>
<b>Background Information and Motivation</b>

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
at [Alternative Transport](https://alternativetransport.wordpress.com/2015/05/07/what-is-an-isochrone-map/), along with [Beau Gunderson's route times in Seattle](http://beaugunderson.com/routes), 
made me realize that contour lines are a much better
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
