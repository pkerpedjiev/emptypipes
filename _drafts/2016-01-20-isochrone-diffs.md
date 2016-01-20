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
<div id="isochroneDiff" style="height: 400px; width: 550px;"></div>
<div id="isochroneDiffLegend" style="height: 40px; width: 550px;"></div>
<link rel="stylesheet" href="/css/leaflet.css">
<script src="/js/leaflet.js"></script>
<script src="/js/isochrone_diff.js"></script>
<script src="/js/conrec.js"></script>
<script src="/js/cubehelix.js"></script>
<script src="/js/tile.stamen.js"></script>

<script type="text/javascript">
drawIsochroneDiff(48.2000, 16.3667, '/jsons/isochrone_contours/vienna.json');
</script>
