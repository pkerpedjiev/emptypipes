---
layout: post
title:  "European High Speed Rail Network"
description: "An interactive map of Europe's high speed rail network."
tags: javascript d3.js
---

Europe has a wonderful high-speed rail network. Due to terrain and track
conditions, however, the speed at which trains travel can vary greatly.
Furthermore, the railway between any two given cities is never perfectly
straight and the trains actually travel further than the direct distance, 'as
the bird flies'. What concerns passengers, however, is the time it takes the
train to go from point A to point B. To illustrate this, the map below shows
all*, high speed rail connections in Europe, colored according to the average
speed of the line over the direct distance between the two cities.

<div id="iceMap" style="height: 400px; width: 550px;"></div>
<link rel="stylesheet" href="/css/leaflet.css">
<script src="/js/leaflet.js"></script>
<script src="/js/high_speed_rail.js"></script>
<script>drawIceMap();</script>

* (*)May be missing some connections. More information is available in the <a href='/supp/europe_high_speed_rail_description.html'>description of how this map was made.</a>
* A <a href='/supp/europe_high_speed_rail_larger.html'>larger version</a> is also available.
