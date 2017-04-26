---
layout: post
title:  "D3v4 event filtering example"
description: "To prevent events from affecting certain elements, certain behaviors (such as zoom) can be filtered so that their events ignore specified elements."
tags: javascript d3.js
thumbnail: /img/2017-04-18-d3-event-filtering.png
---
<link rel="stylesheet" href="/css/d3-event-filtering.css">
<script src="/js/d3-event-filtering-example.js"></script>

D3 behaviors, such as `d3.zoom`, work by responding to events which 
pass through the element on which they are called. If they are called
on an element with children and the children don't block the events
from propagating, the behavior will still be called. This is often
beneficial. If we want to be able to zoom on a populated SVG, we need
only call the zoom behavior on the root node and we'll be able to
pan and zoom even if we drag and scroll on the child elements.

There are times, however, when this is undesireable. We may want to 
ignore certain elements without having the block the propagation of
the event. For this, there is event filtering. The example below
illustrates this by only allowing zooming on the background and not
on the circles.

<div id='event-filtering-div' style="width: 400px; margin: auto; margin-bottom: 5px"></div>

To accomplish this, we simply check that the event did not go through
any elements with a class of `no-zoom`.

```javascript
var zoom = d3v4.zoom()
    .filter(() => { return !d3v4.event.path[0].classList.contains('no-zoom') })
    .on('zoom', function(d) { g.attr('transform', d3v4.event.transform); });
```

A bl.ock of this example can be found [here](https://bl.ocks.org/pkerpedjiev/32b11b37be444082762443c4030d145d).


<script>
    zoomFiltering('#event-filtering-div');
</script>
