---
layout: post
title:  "Panning and Zooming with D3v4"
description: "How to use D3v4's zoom behavior to implement panning and zooming on elements."
tags: javascript d3 zooming
---
<style>
path.line {
  fill: none;
  stroke: #666;
  stroke-width: 1.5px;
}

path.area {
  fill: #e7e7e7;
}

.axis {
  shape-rendering: crispEdges;
}

.x.axis line,
.x.axis path {
  fill: none;
  stroke: #000;
}

.x.axis .minor {
  stroke-opacity: .5;
}

.x.axis path {
}

.y.axis line,
.y.axis path {
  fill: none;
  stroke: #000;
}
svg text {
        font-family: sans-serif;
            font-size: 13px;
        }


circle {
    fill: transparent;
    stroke: black;
    stroke-width: 1px;
}
</style>
<script src="/js/lib/d3.v4.min.js"></script>

All that's necessary for panning and zooming is a translation
<em>[t<sub>x</sub>, t<sub>y</sub>]</em> and a scale factor <em>[k]</em>.  When
a zoom transform is applied to an element at position <em>[x<sub>0</sub>,
y<sub>0</sub>]</em>, its new position becomes <em>[t<sub>x</sub> + k ×
x<sub>0</sub>, t<sub>y</sub> + k × y<sub>0</sub>]</em>. That's it. Everything else
is just sugar and spice on top of this simple transform.

To illustrate, let's plot 4 points. The rest of this post will only deal
with data in one dimension. It should be trivial to expand to two dimensions.
The points will represent the values 1, 1010, 1020 and 5000:


```javascript
    var xScale = d3.scaleLinear()
        .domain([0,5000])
        .range([100,500])

    var dataPoints = [1,1010,1020,5000];

    gMain.selectAll('circle')
    .data(dataPoints)
    .enter()
    .append('circle')
    .attr('r', 7)
    .attr('cx', function(d) { return xScale(d); });
```

<svg class="fig1"></svg>

<script>

function figure1() {
    var margin = {'left': -50, 'top': 80, 'bottom': 20, 'right': 20};
    var width = 500, height=50;
    var svg = d3.selectAll(".fig1")
        .attr('height', height + margin.top + margin.bottom)
        .attr('width', width + margin.left + margin.right);

    var gMain = svg.append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    var xScale = d3.scaleLinear()
        .domain([0,5000])
        .range([100,500])

    var dataPoints = [1,1010,1020,5000];

    gMain.selectAll('circle')
    .data(dataPoints)
    .enter()
    .append('circle')
    .attr('r', 7)
    .attr('cx', function(d) { return xScale(d); });

    gMain.append('text')
    .attr('x', 300)
    .attr('y', -60)
    .attr('text-anchor', 'middle')
    .text('point value');

    gMain.append('text')
    .attr('x', 300)
    .attr('y', 55)
    .attr('text-anchor', 'middle')
    .text('screen position');


    var xTopAxis = d3.axisTop()
    .scale(xScale)
    .ticks(3)

    var gTopAxis = gMain.append('g')
    .classed('x axis', true)
    .attr('transform', 'translate(0,-15)')

    var xAxis = d3.axisBottom()
    .scale(d3.scaleLinear().domain([100,500]).range([100,500]))
    .ticks(3)

    var gAxis = gMain.append('g')
    .classed('x axis', true)
    .attr('transform', 'translate(0,15)')

    gAxis.call(xAxis);
    gTopAxis.call(xTopAxis);
}
figure1();
</script>
We can see that two of the points, 1010 and 1020, are virtually on top of each other. 
Using our `xScale`, we can determine that they're less than 1 pixel apart.

```javascript
    xScale(1010) //180.8
    xScale(1020) //181.6
```

What if we want to zoom in so that they're 10 pixels apart? We'll need a scale factor, <em>k</em>:

```javascript
    var k = 10 / (xScale(1020) - xScale(1010)  //~ 12.5 
```

Let's say we want the point 1010 to be positioned at pixel 200. We need to determine <em>t<sub>x</sub></em> such that <em>200 = t<sub>x</sub> + k × xScale(1010)</em>

```javascript
    var tx = 200 - k * xScale(1010) //-2600
```

Let's apply this to our plot.

```javascript
    var k = 10 / (xScale(1020) - xScale(1010))
    var tx = 200 - k * xScale(1010)
    var t = d3.zoomIdentity.translate(tx, 0).scale(k)

    gMain.selectAll('circle')
    .data(dataPoints)
    .enter()
    .append('circle')
    .attr('r', 7)
    .attr('cx', function(d) { return t.applyX(xScale(d)); });
```

To get two lovely separated circles.

<svg class="fig2"></svg>

<script>

function fig2() {
    var margin = {'left': -50, 'top': 80, 'bottom': 20, 'right': 20};
    var width = 500, height=50;
    var svg = d3.selectAll(".fig2")
        .attr('height', height + margin.top + margin.bottom)
        .attr('width', width + margin.left + margin.right);

    var gMain = svg.append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    var xScale = d3.scaleLinear()
        .domain([0,5000])
        .range([100,500])

    var dataPoints = [1,1010,1020,5000];


    var k = 10 / (xScale(1020) - xScale(1010))
    var tx = 200 - k * xScale(1010)
    var t = d3.zoomIdentity.translate(tx, 0).scale(k)

    gMain.selectAll('circle')
    .data(dataPoints)
    .enter()
    .append('circle')
    .attr('r', 7)
    .attr('cx', function(d) { return t.applyX(xScale(d)); });

    gMain.append('text')
    .attr('x', 300)
    .attr('y', -60)
    .attr('text-anchor', 'middle')
    .text('point value');

    gMain.append('text')
    .attr('x', 300)
    .attr('y', 55)
    .attr('text-anchor', 'middle')
    .text('screen position');


    var xTopAxis = d3.axisTop()
    .scale(xScale)
    .ticks(3)

    var gTopAxis = gMain.append('g')
    .classed('x axis', true)
    .attr('transform', 'translate(0,-15)')

    var xAxis = d3.axisBottom()
    .scale(d3.scaleLinear().domain([100,500]).range([100,500]))
    .ticks(3)

    var gAxis = gMain.append('g')
    .classed('x axis', true)
    .attr('transform', 'translate(0,15)')

    gAxis.call(xAxis);
    gTopAxis.call(xTopAxis);
}
fig2();
</script>

Fantastic, right? But notice that the top axis still refers to the old domain. This is
because we never changed it. In the old version of D3, we would attach the axis to the
zoom behavior, set the `translate` and `scale` properties and be done with it. In v4,
we have to rescale our linear scale manually and use the rescaled version to create the
axis:

```javascript
    var xNewScale = t.rescaleX(xScale)

    var xTopAxis = d3.axisTop()
    .scale(xNewScale)
    .ticks(3)
```

<svg class="fig3"></svg>

<script>

function fig3() {
    var margin = {'left': -50, 'top': 80, 'bottom': 20, 'right': 20};
    var width = 500, height=50;
    var svg = d3.selectAll(".fig3")
        .attr('height', height + margin.top + margin.bottom)
        .attr('width', width + margin.left + margin.right);

    var gMain = svg.append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    var xScale = d3.scaleLinear()
        .domain([0,5000])
        .range([100,500])

    var dataPoints = [1,1010,1020,5000];


    var k = 10 / (xScale(1020) - xScale(1010))
    var tx = 200 - k * xScale(1010)
    var t = d3.zoomIdentity.translate(tx, 0).scale(k)

    var xNewScale = t.rescaleX(xScale)

    gMain.selectAll('circle')
    .data(dataPoints)
    .enter()
    .append('circle')
    .attr('r', 7)
    .attr('cx', function(d) { return t.applyX(xScale(d)); });

    gMain.append('text')
    .attr('x', 300)
    .attr('y', -60)
    .attr('text-anchor', 'middle')
    .text('point value');

    gMain.append('text')
    .attr('x', 300)
    .attr('y', 55)
    .attr('text-anchor', 'middle')
    .text('screen position');


    var xTopAxis = d3.axisTop()
    .scale(xNewScale)
    .ticks(3)

    var gTopAxis = gMain.append('g')
    .classed('x axis', true)
    .attr('transform', 'translate(0,-15)')

    var xAxis = d3.axisBottom()
    .scale(d3.scaleLinear().domain([100,500]).range([100,500]))
    .ticks(3)

    var gAxis = gMain.append('g')
    .classed('x axis', true)
    .attr('transform', 'translate(0,15)')

    gAxis.call(xAxis);
    gTopAxis.call(xTopAxis);
}
fig3();
</script>
