---
layout: post
title:  "Approximate Flight Time Map"
description: "An iso-distance map showing approximate flight times between different locations on Earth"
tags: javascript d3.js maps
---

The map below shows the approximate flight time (in hours) from any location on
earth to any other.


<meta charset="utf-8"> 
<script src="/js/lib/d3.min.js"></script>
<img itemprop="image" src="/img/isodistance_screenshot.png" style='display:none' width="200" height="170" />
<link rel="stylesheet" href="/css/isodistances.css">

<ul>

<li><b>Double click</b> to change the starting point (sorry mobile users!).</li>
<li>Click and drag to pan</li>
<li>Scroll to zoom in and out</li>
<li>Click on the <i>Flight Times</i> and <i>Flight Paths</i> checkboxes to toggle the displayed lines</li>

</ ul>

<script src="/js/isodistances.js"></script>
<script src="/js/topojson.v1.min.js"></script>

<div align='center' id="flight-time-map"></div>

<script>
d3.select('#flight-time-map')
.call(flightTimeMap());
</script>

<hr>

The red lines above indicate equal distances of approximately 1660 km, from the
starting location. This distance corresponds to (very) roughly two hours of flight
time in a commercial airliner. The actual time would depend on the type of plane,
wind conditions, trajectory and a host of other factors that are omitted for simplicity.

The <i>flight paths</i> option, when checked, shows the path a flight might take when going
to any point on the globe. Notice that no matter which direction it goes 
in, it will always go over the opposite side of the earth if it flies long
enough.

The more observant of the viewers will notice that the distances and paths
above are equivalent to rotated latitudes and longitudes where the 'topmost'
point is not the north pole, but rather the location chosen as the starting point.
If there is a proper name for these rotated meridians and parallels please let me
know.
<hr>

<b> Background </b>
<br>
<br>
Is it further to fly from Madrid to Los Angeles or from Helsinki to Los Angeles?
Think about it. If you're anything like me, you would have guessed Madrid, and you
would have been wrong. Madrid is about 9300 km from LA, while Helsinki is 9000 km, 
as the plane flies. 

What gives? Well, essentially the earth is a sphere (mostly), and the map is
distorted. A plane flying from Helsinki to LA would actually start off flying 
north-west rather than south-west (where LA appears to be), because it would
be flying along the <b>great circle</b> which contains both LA and Helsinki (or Madrid).
Because the flight goes over the 'top' of the world, it's actually slightly shorter
than the flight from Madrid, that has to go around nearer to the equator.

Other interesting facts that one can glean from this map:

<ul>
<li>New Zealand is opposite Madrid on the globe.</li>
<li>Ecuador and Colombia are opposite Indonesia</li>
<li>If you wanted to fly direct from New York to Jakarta, you would have to go either directly north or directly south</li>
<li>It would take a commercial airliner about 22 hours to fly halfway around the globe.</li>
</ul>

<b>Credits</b>

Thanks to <a href="http://bl.ocks.org/patricksurry/6621971">patricksurry's
block</a> for an example of how to implement a rolling pan and zoom with d3.js.

<b>Errata / Disclaimer</b>
<br>
Everything is an estimate. Rounding errors abound. Don't use this for anything but entertainment and curiosity. But you already know that.
<br>
