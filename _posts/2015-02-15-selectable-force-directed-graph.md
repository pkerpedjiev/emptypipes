---
layout: post
title:  "Selectable Force-Directed Graph Using D3.js"
description: "A variation of d3's force-directed graph layout which allows the simultaneous selection and dragging of multiple nodes, zooming and centering the view."
tags: javascript d3.js
thumbnail: /img/2015-02-15-selectable-force-directed-graph.png
---

**Update:** An new version of this example using D3v4 can be
[found in a more recent blog post.](/2017/04/29/d3v4-selectable-zoomable-force-directed-graph/)

Dragging multiple nodes in a force-directed graph layout is useful
for making large changes in its arrangement. Mike Bostock
showed a nice example of this while describing the process
of creating the [2013 Oscar
Contenders](http://www.nytimes.com/interactive/2013/02/20/movies/among-the-oscar-contenders-a-host-of-connections.html?_r=0)
visualization in his [Eyeo talk](http://vimeo.com/69448223) about examples.

His example, while instructive and useful, can be made even more
helpful by adding the dynamic force calculation, as well as zooming
and centering behaviour. 

In the example below, hold down **shift** to select multiple
nodes or press the **'c'** key to center the graph. Zooming and panning
follow the typical pattern using the mousewheel and dragging.

<div align='center' id="d3_selectable_force_directed_graph"></div>
<link rel="stylesheet" href="/css/d3_selectable_force_directed_graph.css">
<script src="/js/d3_selectable_force_directed_graph.js"></script>
<script>selectableForceDirectedGraph();</script>

The selection process is made to emulate the behaviour of selection
and dragging that is seen in most file managers and is thus familiar
to most users of desktop computers:

1. Clicking on a node selects it and de-selects everything else.
2. Shift-clicking on a node toggles its selection status and leaves
   all other nodes as they are.
3. Shift-dragging toggles the selection status of all nodes within
   the selection area.
4. Dragging on a selected node drags all selected nodes.
5. Dragging an unselected node selects and drags it while
   de-selecting everything else.

Finally, the cursor is changed to a crosshair when the user presses
the shift key.

The code for this example is available on [bl.ocks.org](http://bl.ocks.org/pkerpedjiev/0389e39fad95e1cf29ce) or
directly from [github gist](https://gist.github.com/pkerpedjiev/0389e39fad95e1cf29ce).
An example of its use is found in this [RNA secondary structure visualization tool](http://nibiru.tbi.univie.ac.at/forna/).

