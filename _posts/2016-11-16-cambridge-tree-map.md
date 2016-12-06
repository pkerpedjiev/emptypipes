---
layout: post
title:  "Cambridge Tree Map"
description: "Inspired by the cambridge tree walk website, this is a map of which tree species are most common on different blocks in Cambridge, MA."
tags: javascript d3.js maps
---
<link rel="stylesheet" href="/css/cambridge-tree-map.css">
<script src="/js/cambridge-tree-map.js"></script>
<script src="/js/lib/topojson.v1.min.js"></script>

The city of Cambridge, MA maintains a wealth of geographic information on [its
GIS website](https://www.cambridgema.gov/GIS/). One of the more unconvential
datasets is the [list of
trees](https://www.cambridgema.gov/GIS/gisdatadictionary/Environmental/ENVIRONMENTAL_StreetTrees)
lining the streets of the city. It contains the position and species of around
30 thousand trees and can be explored using the [Cambridge Tree
Walk](https://gis.cambridgema.gov/dpw/trees/trees_walk.html)) application.
While this app is incredily detailed and useful at high resolution, it loses
all information at low resolution. The identities and positions of the trees
are lost. And if they weren't they would be too dense to display in a
meaningful and intelligible manner.

To provide a different view, I calculated which tree species is most common on
each block in Cambridge and plotted the results using D3.js. The analysis shows
that Maple trees dominate the landscape in Cambridge. Further down the list are
Oaks, Lindens and Pears. While these are the most common trees on most street
blocks in Cambridge, there are a few which are dominated by less common species.
This isn't to say that those species are only found on those blocks, just that
those are the only blocks where those species are in the majority.
<hr>

<div id='cambridge-tree-map'></div>

<hr>
How useful is this map? I don't know. But it was fun to make and will hopefully
serve as a decent example for introducing how D3.js can be used for cartography
at [Maptime Boston](http://www.meetup.com/Maptime-Boston/).  A tutorial
describing how this map is made is available on the [GitHub
page](https://github.com/pkerpedjiev/cambridge-trees) for the project. It's
also avilable as a
[block](https://bl.ocks.org/pkerpedjiev/91fbba8179f5517348fdb7d5079be04a).

<script>
    createMap('#cambridge-tree-map');
</script>
