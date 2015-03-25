---
layout: post
title:  "Slowing Down the Force Directed Graph in D3"
description: "Slow down the d3 force-directed graph in order to more clearly see what happens in each step."
tags: javascript d3.js
---

Tracking the stepwise movements of the [force-directed graph layout in
d3.js](http://bl.ocks.org/mbostock/4062045) is useful when creating more
intricate and/or dynamic graphs. Unfortunately, in its current implementations,
these changes are fleeting and hard to see due to the speed with which the
layout is updated. Slowing it down can help to see how each tick event updates the
positions of each node.  A method for doing this is described by
[@DavidBruant](https://twitter.com/davidbruant) in [a
thread](https://github.com/mbostock/d3/issues/1519) about running the force
simulation faster. Keep in mind that this is a hack and probably shouldn't be
used for anything production-related.

<div class="example" align='center' id="d3_slow_force_directed_graph" style="float: left;"></div>
<div class="example" align='center' id="d3_normal_force_directed_graph" style="float: right;"></div>
<script src="/js/d3_slow_force_directed_graph.js"></script>
<script src="/js/d3_slow.js"></script>
<script>slowForceDirectedGraph('#d3_slow_force_directed_graph');</script>
<script src="/js/d3.js"></script>
<link rel="stylesheet" href="/css/d3_normal_force_directed_graph.css">
<script src="/js/d3_normal_force_directed_graph.js"></script>
<script>normalForceDirectedGraph();</script>

Implementing this slowdown requires slightly changing `d3.js`. To adjust the desired
delay between each `tick` event, simply change the `setTimeout(tick, 234)` line.

{% highlight bash %}
pkerp@toc:~/projects/emptypipes$ diff js/d3.js js/d3_slow.js
6228c6228,6233
<         d3.timer(force.tick);
---
>         setTimeout(function tick(){
>             force.tick();
>             if(alpha >= .005)
>                 setTimeout(tick, 234);
>         }, 0);
>         //d3.timer(force.tick);
{% endhighlight %}

The modified version of d3.js used in the 'slow' example abov used in the 'slow' example abovee is available [here](/js/d3_slow.js).
