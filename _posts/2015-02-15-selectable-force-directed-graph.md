---
layout: post
title:  "D3 Selectable Force-Directed Graph"
tags: javascript d3.js
---

While working on our [online RNA secondary structure visualization application](nibiru.tbi.univie.ac.at/forna), we realized that being able to
drag many nodes at once is a really useful feature to have in a force-directed
graph.  Coincidentally, this was right around the time I was watching [Mike
Bostock's Eyeo talk](http://vimeo.com/69448223) about sharing examples of code.
While describing the process of creating the visualization
of the [2013 Oscar Contenders](http://www.nytimes.com/interactive/2013/02/20/movies/among-the-oscar-contenders-a-host-of-connections.html?_r=0), 
he showed an example of dragging multiple nodes in a 
force-directed layout [Draggable Network II](http://bl.ocks.org/mbostock/4566102). 

There was only one small problem. 

The layout in his
example wasn't dynamic. It also wasn't zoomable. Fortunately, with a little
bit of tinkering, these issues were resolved to yield a force-directed graph
layout which allows the selection and dragging of multiple nodes (hold <shift>
and drag across the background) and zooming while maintaining the force animation.
You can even center the graph by hitting the 'c' key.

<div align='center' id="d3_selectable_force_directed_graph"></div>
<link rel="stylesheet" href="/css/d3_selectable_force_directed_graph.css">
<script src="/js/d3_selectable_force_directed_graph.js"></script>
<script>selectableForceDirectedGraph();</script>

The code for this example is available as a [github gist](https://gist.github.com/pkerpedjiev/0389e39fad95e1cf29ce). 

