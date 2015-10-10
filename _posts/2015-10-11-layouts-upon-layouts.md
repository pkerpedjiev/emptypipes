---
layout: post
title:  "Layouts Upon Layouts"
description: "An example of how to create nested d3 layouts."
tags: javascript d3.js rna
---
<meta charset="utf-8"> 
<img itemprop="image" src="/img/layouts_upon_layouts_itemprop.png" style='display:none' width=200 height=130>

One of the truly beautiful things about d3.js is how easy it is to combine
multiple layouts into one graphic. The example below incorporates three
differents layout to show the data along 3 different dimensions:

1. RNA secondary structure. RNA is a molecule similar to DNA with the property
that it folds back onto itself to form pairs with bases in its own sequence.
Its secondary structure is often displayed as an eponymous diagram. Displayed
using an <a href="https://github.com/pkerpedjiev/rnaplot">rnaplot</a> layout.

2. Some quantity associated with each molecule. We can display this by scaling
the secondary structure diagrams using a treemap layout. Each rna-plot is 
scaled as a <a href="http://bl.ocks.org/mbostock/4063582">treemap</a>

3. Multiples of the above quantities. Four sets of structures and sizes
are arranged using a <a href="https://github.com/interactivethings/d3-grid">grid
layout</a>.

<hr>
<div id='layouts-upon-layouts-div' style="width: 400px; margin:auto;" ></div>
<hr>

So how do we create this layout chaining? We start with the d3-grid layout:

{% highlight javascript %}
var rnaTreemap = rnaTreemapChart()
var rectGrid = d3.layout.grid()

var rectData = rectGrid(root)
var gMain = d3.select(divName)
    .append('svg')
    .data(rectData)
    .enter()
    .append('g')
    ... //position the g according to rectData
    .call(rnaTreemap);
{% endhighlight %}

Now we have one appropriately positioned &lt;g&gt; for each treemap, under
which we will construct the rna-treemap layout:

{% highlight javascript %}
// the rna-treemap layout
var chart = function(selection) {
    selection.each(function(data) {
        var treemap = d3.layout.treemap()

        d3.select(this)
        .append('g'); //probably unnecessary
        .datum(data)
        .selectAll(".treemapNode")
        .data(treemap.nodes)
        .enter()
        .append('g')
        .call(rnaTreemapNode);

        function rnaTreemapNode(selection) {
            selection.each(function(d) {
                var chart = rnaPlot()

                if ('structure' in d) d3.select(this).call(chart)
            });
        }
    });
{% endhighlight %}

At the end of the road, the `rna-plot` layout adds its own &lt;g&gt; and
continuous on drawing the circles associated with the RNA (not shown).

{% highlight javascript %}
function chart(selection) {
    selection.each(function(data) {
        rg = new RNAGraph(data.sequence, data.structure, 
                          data.name)

        d3.select(this)
        .append('g')
        ...
{% endhighlight %}

And that's it! Create layout function. Create child nodes bound to the data.
Call layout function. Rinse, repeat! Take a look at the <a
href="http://bost.ocks.org/mike/chart/">"Towards Reusable Charts"</a> tutorial
for an excellent introduction to creating a custom layout.

<link rel='stylesheet' type='text/css' href='/css/d3-rnaplot.css' />

<script type='text/javascript' src='/js/lib/d3-rnaplot.js'></script>
<script type='text/javascript' src='/js/lib/d3-rna-treemap.js'></script>
<script type='text/javascript' src='/js/lib/d3-grid.js'></script>
<script type='text/javascript' src='/js/layouts-upon-layouts.js'></script>
<script type='text/javascript'>
    layoutsUponLayouts('#layouts-upon-layouts-div');
</script>
