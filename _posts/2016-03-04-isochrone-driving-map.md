---
layout: post
title:  "Isochrone Driving Maps of the World"
description: "A contour map of driving times from various cities. Otherwise known as an isochrone map."
tags: maps javascript d3.js leaflet 
thumbnail: /img/isochrone-driving-distances/itemprop.png
---
<meta charset="utf-8"> 
<img itemprop="image" src="/img/isochrone_example.png" style='display:none' width=200 height=170>

One of my favorite things about maps is the context they provide for overlayed
information. This can range from the mundane and orthodox (such as roads and
boundaries) to the [esoteric](http://imgur.com/NpUXT2e) and
[abstract](https://atlasofprejudice.com/tearing-europe-apart-10d01e876eab#.vs8s28r1r).
Nearly a year ago I wrote a [blog
post](http://emptypipes.org/2015/05/20/europe-isochrone-map/) which overlayed
travel time (isochrone) data on top of a map of Europe. It showed how long it
would take somebody to travel from a given city to any other point in Europe
using only public transportation. In this post, I do the exact same thing using
driving times.

<div class="wp-caption alignright" style="width: 183px"> 
<a href="/supp/isochrone_driving/vienna"><img
src="/img/isochrone-driving-distances/vienna.png" width="183"/> </a>
<p
class="wp-caption-text">Driving times starting in Vienna, Austria. Notice how
the frontier of the contours is more rounded than in Lincoln, NE.</p> </div>
<div class="wp-caption alignright" style="width: 183px"> 
<a href="/supp/isochrone_driving/lincoln"><img
src="/img/isochrone-driving-distances/lincoln.png" width="183"/></a> 
<p class="wp-caption-text">Driving times starting in Lincoln, Nebraska.</p> </div>

<p>
The wonderful thing about portraying driving times is that it's possible to
make such maps for cities from all over the world. In doing so, we can see the
how the transportation infrastructure of a region meshes with the natural
features to create a unique accessibility profile. Lincoln (Nebraska) is
centered in the USA and has a characteristic diamond shaped travel time
profile. Why? Anyone that has looked at a map of the region will certainly have
noticed that the roads are arranged in a grid pattern. Thus it takes much
longer to travel along the diagonal than to travel straight north and south.
Vienna, Austria, on the other hand, has a more circular accessibility profile
due to the abundance of roads going in all directions.
</p>

<div class="wp-caption alignleft" style="width: 183px">
<a href="/supp/isochrone_driving/santiago"><img src="/img/isochrone-driving-distances/santiago.png" width="183"/></a>
<p class="wp-caption-text">The Andes mountains block driving to the east of Santiago, Chile</p>
</div>
<div class="wp-caption alignleft" style="width: 183px">
<a href="/supp/isochrone_driving/panama_city"><img src="/img/isochrone-driving-distances/panama-city.png" width="183"/></a>
<p class="wp-caption-text">The Darien Gap separates Central America from South America</p>
</div>


Looking at the isochrone map of Santiago, Chile, one can clearly see the how
the Andes mountains block travel east of the city. Southeast of panama city,
the odd fact that you can't drive between North / Central America and South
America becomes clear. Zooming in at identical levels, you can compare cities
and see the difference in accessibility of the relatively wealthy South Africa
with that of the less developed, wilder Congo. The differences in accessibility
between different cities of the world can range from the trivial (Denver, CO vs
Lincoln, NE) to the substantial (Perth, Australia vs. Sydney, Australia).
Individual cities can have a wide automobile-reachible area (Moscow, Russia) or
a narrow, geography, politics and infrastructure-constrained area (Irkutsk,
Russia).

<div class="wp-caption alignright" style="width: 183px">
<a href="/supp/isochrone_driving/kinshasa"><img src="/img/isochrone-driving-distances/kinshasa.png" width="183"/></a>
<p class="wp-caption-text">The accessibility profile of Kinshasa, Democratic Republic of the Congo is rugged and discontinuous. </p>
</div>
<div class="wp-caption alignright" style="width: 183px">
<a href="/supp/isochrone_driving/cape_town"><img src="/img/isochrone-driving-distances/cape-town.png" width="183"/></a>
<p class="wp-caption-text">Cape Town, South Africa has good links to the interior of the country as well as to Namibia in the north.</p>
</div>

<link rel="stylesheet" href="/css/leaflet.css">
<script src="/js/leaflet.js"></script>
<script src="/js/isochrone_driving_map.js"></script>
<script src="/js/cubehelix.js"></script>
<script src="/js/tile.stamen.js"></script>

Whatever the case, the places that are most interesting are always those that
are also most familiar. For this reason, I've provided overlays for most major
cities around the world. The map currently shows Vienna, but clicking any of
the links below will open a map for that particular city. The travel times were
obtained using GraphHopper and OpenStreetMap data so don't be surprised if they
differ from those of Google maps.

<div id="isochroneDrivingMap" style="height: 400px; width: 550px;"></div>
<div id="isochroneDrivingMapLegend" style="height: 40px; width: 550px;"></div>

<script type="text/javascript">
        drawIsochroneMap(48.200, 16.3666, '/jsons/isochrone_driving_contours/vienna.json');
        </script>

{% include isochrone_driving_cities_list.html %}


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
