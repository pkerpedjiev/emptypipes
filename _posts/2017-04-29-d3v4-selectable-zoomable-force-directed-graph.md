---
layout: post
title:  "Selectable zoomable force directed graph in D3v4"
description: "To prevent events from affecting certain elements, certain behaviors (such as zoom) can be filtered so that their events ignore specified elements."
tags: javascript d3.js d3v4.js
thumbnail: /img/2017-04-29-d3v4-selectable-zoomable-force-directed-graph.png
---

A [previous post](/2015/02/15/selectable-force-directed-graph/) described how
to use d3.js to create a force-directed graph we can zoom in to and select
nodes from. Such a tool is useful for displaying and arranging larger
networks. My colleagues and I personally used it to create [a small web
application for displaying RNA secondary
structure](http://rna.tbi.univie.ac.at/forna/).

Since that post, a new version of D3 was released. D3 V4 introduced a lot of
useful new features (see [Irene Ros's excellent overview of the differences
between v3 and v4](https://iros.github.io/d3-v4-whats-new/)). Unfortunately,
however, it did not maintain backward compatiblity with previous versions of
d3. This means that the [previous selectable zoomable force directed graph
example](/2015/02/15/selectable-force-directed-graph/) could not be used with
new code written with the latest version of the D3 library. Until now.

As in the previous example, this graph provides the following selection
behavior:

1. Clicking on a node selects it and de-selects everything else.
2. Shift-clicking on a node toggles its selection status and leaves
   all other nodes as they are.
3. Shift-dragging toggles the selection status of all nodes within
   the selection area.
4. Dragging on a selected node drags all selected nodes.
5. Dragging an unselected node selects and drags it while
   de-selecting everything else.

<div align='center' id="d3_selectable_force_directed_graph" style="width: 400px; height: 300px; margin: auto; margin-bottom: 12px">
    <svg />
</div>

Upgrading the selectable zoomable force directed graph implementation required
a few minor and not-so-minor changes.

* The new brush in v4 captures the shift, alt and meta keys to perform some
  actions by default. To get around this, I forked `d3-brush` and modified it
  so that it doesn't capture the shift events. The new version (d3-brush-lite)
  can be found [on github](https://github.com/pkerpedjiev/d3-brush-lite). There
  is an [open github issue](https://github.com/d3/d3-brush/issues/20) to
  disable this behavior in `d3-brush`.
* Because the d3-drag behavior consumes all events in v4, it is no longer
  necessary to stop propagation.
* The brush creates its own overlay which catches all events meaning that we
  don't need to turn the zoom behavior off when the shift key is pressed.
* Whether a node is fixed is specified by the `.fx` and `.fy` parameters. This
  eliminates the need to set the `.fixed` parameter on each node.
* The force layout in v4 lets us specify an [accessor for the nodes that a link
  connects](https://github.com/d3/d3-force#link_id). This lets us use ids for 
  a link's endpoint and makes the graph specification JSON easier to read:

```json
{
  "nodes": [
    {"id": "Myriel", "group": 1},
    {"id": "Napoleon", "group": 1},
    {"id": "Mlle.Baptistine", "group": 1},
    ...
  ],
  "links": [
    {"source": "Napoleon", "target": "Myriel", "value": 1},
    {"source": "Mlle.Baptistine", "target": "Myriel", "value": 8},
    ...
  ]
}
```

The source code for this example can be found as [a github
gist](https://gist.github.com/pkerpedjiev/f2e6ebb2532dae603de13f0606563f5b) or
[on
bl.ocks.org](https://bl.ocks.org/pkerpedjiev/f2e6ebb2532dae603de13f0606563f5b).

<link rel='stylesheet' href='/css/d3v4-selectable-zoomable-force-directed-graph.css'>
<script type='text/javascript'>
    var d3v3 = d3;
    d3 = d3v4;
    // load the lite brush into the d3v4 namespace
</script>
<script src="/js/d3v4-brush-lite.js"></script>
<script type='text/javascript'>
    // restore the v3 namespace
    var d3 = d3v3;
</script>
<script src="/js/d3v4-selectable-force-directed-graph.js"></script>

<script>
    var svg = d3.select('#d3_selectable_force_directed_graph');

    d3.json('/jsons/miserables.with-ids.json', function(error, graph) {
        if (!error) {
            //console.log('graph', graph);
            createV4SelectableForceDirectedGraph(svg, graph);
        } else {
            console.error(error);
        }
    });
</script>
