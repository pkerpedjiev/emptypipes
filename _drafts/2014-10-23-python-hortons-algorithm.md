---
layout: post
title:  "Shortest Cycle Basis of a Graph Using Horton's Algorithm in Python"
categories: python graphs
---

Graphs with cycles are common occurance in nature. Chemical compounds have
rings. Political maps have countries. Roads have blocks and roundabouts. Each
of these are the smallest possible cycle that one can find in within a graph
that contains larger cycles. Chemical compounds also have multiring compounds.
Political maps have continents, and roads have, well, ring roads that encircle
a portion of a city. If we represented each of these scenarious as graphs,
meetings of political borders and intersections would be vertices and bonds,
borders and coastlines, and road segments would be edges. These graphs all
contain numerous loops, some of which are larger than the others. What if we
want to find the smallest set of cycles which can be combined to form any other
cycle in the graph? This is the so-called minimum or shortest cycle basis
and can be found using [Horton's Algorithm](http://epubs.siam.org/doi/abs/10.1137/0216026).

Without going into the details of how the algorithms works (it's rather simple).
Consider the following test cases:


{% highlight python %}

{% endhighlight %}

