---
layout: post
title:  "Panning and Zooming with D3v4"
description: "How to use D3v4's zoom behavior to implement panning and zooming on elements."
tags: javascript d3.js zooming
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

All that's necessary for panning and zooming is a translation
<em>[t<sub>x</sub>, t<sub>y</sub>]</em> and a scale factor <em>k</em>.  When
a zoom transform is applied to an element at position <em>[x<sub>0</sub>,
y<sub>0</sub>]</em>, its new position becomes <em>[t<sub>x</sub> + k ×
x<sub>0</sub>, t<sub>y</sub> + k × y<sub>0</sub>]</em>. That's it. Everything else
is just sugar and spice on top of this simple transform.

The major difference between zooming in D3v3 and and D3v4 is that the
behavior (dealing with events) and the transforms (positioning elements)
are more separated. In v3, they used to be part of the behavior whereas
in v4, they're part of the element on which the behavior is called.

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
    var svg = d3v4.selectAll(".fig1")
        .attr('height', height + margin.top + margin.bottom)
        .attr('width', width + margin.left + margin.right);

    var gMain = svg.append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    var xScale = d3v4.scaleLinear()
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


    var xTopAxis = d3v4.axisTop()
    .scale(xScale)
    .ticks(3)

    var gTopAxis = gMain.append('g')
    .classed('x axis', true)
    .attr('transform', 'translate(0,-15)')

    var xAxis = d3v4.axisBottom()
    .scale(d3v4.scaleLinear().domain([100,500]).range([100,500]))
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

What if we want to zoom in so that they're 10 pixels apart? We'll first need to calculate the scale factor, <em>k</em>:

```javascript
    var k = 10 / (xScale(1020) - xScale(1010))  //~ 12.5 
```

Let's say we want the point 1010 to be positioned at pixel 200. We need to determine <em>t<sub>x</sub></em> such that <em>200 = t<sub>x</sub> + k × xScale(1010)</em>

```javascript
    var tx = 200 - k * xScale(1010) //-2600
```

When we apply this to our plot.

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

We get two lovely separated circles.

<svg class="fig2"></svg>

<script>

function fig2() {
    var margin = {'left': -50, 'top': 80, 'bottom': 20, 'right': 20};
    var width = 500, height=50;
    var svg = d3v4.selectAll(".fig2")
        .attr('height', height + margin.top + margin.bottom)
        .attr('width', width + margin.left + margin.right);

    var gMain = svg.append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    var xScale = d3v4.scaleLinear()
        .domain([0,5000])
        .range([100,500])

    var dataPoints = [1,1010,1020,5000];


    var k = 10 / (xScale(1020) - xScale(1010))
    var tx = 200 - k * xScale(1010)
    var t = d3v4.zoomIdentity.translate(tx, 0).scale(k)

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


    var xTopAxis = d3v4.axisTop()
    .scale(xScale)
    .ticks(3)

    var gTopAxis = gMain.append('g')
    .classed('x axis', true)
    .attr('transform', 'translate(0,-15)')

    var xAxis = d3v4.axisBottom()
    .scale(d3v4.scaleLinear().domain([100,500]).range([100,500]))
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
    var svg = d3v4.selectAll(".fig3")
        .attr('height', height + margin.top + margin.bottom)
        .attr('width', width + margin.left + margin.right);

    var gMain = svg.append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    var xScale = d3v4.scaleLinear()
        .domain([0,5000])
        .range([100,500])

    var dataPoints = [1,1010,1020,5000];


    var k = 10 / (xScale(1020) - xScale(1010))
    var tx = 200 - k * xScale(1010)
    var t = d3v4.zoomIdentity.translate(tx, 0).scale(k)

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


    var xTopAxis = d3v4.axisTop()
    .scale(xNewScale)
    .ticks(3)

    var gTopAxis = gMain.append('g')
    .classed('x axis', true)
    .attr('transform', 'translate(0,-15)')

    var xAxis = d3v4.axisBottom()
    .scale(d3v4.scaleLinear().domain([100,500]).range([100,500]))
    .ticks(3)

    var gAxis = gMain.append('g')
    .classed('x axis', true)
    .attr('transform', 'translate(0,15)')

    gAxis.call(xAxis);
    gTopAxis.call(xTopAxis);
}
fig3();

</script>

The examples above demonstrate how the zoom transforms work, but they don't
actually use the zoom behavior. For that we need to create a behavior and
attach it to an element:

```javascript
    var circles = svg.selectAll('circle');
    var zoom = d3.zoom().on('zoom', zoomed);

    function zoomed() {
        var transform = d3.event.transform;

        // rescale the x linear scale so that we can draw the top axis
        var xNewScale = transform.rescaleX(xScale);
        xTopAxis.scale(xNewScale)
        gTopAxis.call(xTopAxis);

        // draw the circles in their new positions
        circles.attr('cx', function(d) { return transform.applyX(xScale(d)); });
    }

    gMain.call(zoom)
```

Here we recompute the zoom transform every time there is a zoom event and
reposition each circle. We also rescale the x-scale so that we can use it to
create an axis. The astute observer will note that
`transform.applyX(xScale(d))` is actually equivalent to `xNewScale(d)`.
Automatic rescaling was possible using v3 by calling `zoom.x(xScale)`, but this
has been done away with in favor of explicit rescaling using
`transform.rescaleX(xScale)`.

The code above works but if we had programmatically zoomed in beforehand (as we
did in the previous section by applying the transform), then applying the zoom
behavior would remove that transform as soon as we start zooming.

Why?

Because in the `zoomed` function we obtain a `transform` from
`d3.event.transform`.  In previous versions of D3, this would come from the
zoom behavior itself (`zoom.translate` and `zoom.scale`). In v4, it comes from
the element on which the zoom behavior is called (`gMain`). To programmatically
zoom in and then apply the zoom behavior starting from there, we need to set the
zoom transform of the `gMain` element before we call the behavior:

```javascript
var k = 10 / (xScale(1020) - xScale(1010))
var tx = 200 - k * xScale(1010)
var t = d3.zoomIdentity.translate(tx, 0).scale(k)

gMain.call(zoom.transform, t);
gMain.call(zoom)
```

Now we start with an already zoomed in view **and** can zoom in and out using the
mouse.

<svg class="fig4"></svg>

<script>

function fig4() {
    var margin = {'left': -50, 'top': 80, 'bottom': 20, 'right': 20};
    var width = 500, height=50;
    var svg = d3v4.selectAll(".fig4")
        .attr('height', height + margin.top + margin.bottom)
        .attr('width', width + margin.left + margin.right);

    var gMain = svg.append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    gMain.append('rect')
    .attr('x', 50)
    .attr('y', -25)
    .attr('width', width)
    .attr('height', height)
    .style('fill', 'transparent');

    var xScale = d3v4.scaleLinear()
        .domain([0,5000])
        .range([100,500])

    var dataPoints = [1,1010,1020,5000];


    var k = 10 / (xScale(1020) - xScale(1010))
    var tx = 200 - k * xScale(1010)
    var t = d3v4.zoomIdentity.translate(tx, 0).scale(k)

    var xNewScale = t.rescaleX(xScale)


    var circles = gMain.selectAll('circle')
    .data(dataPoints)
    .enter()
    .append('circle')
    .attr('r', 7)
    //.attr('cx', function(d) { return t.applyX(xScale(d)); })




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


    var xTopAxis = d3v4.axisTop()
    .scale(xNewScale)
    .ticks(3)

    var gTopAxis = gMain.append('g')
    .classed('x axis', true)
    .attr('transform', 'translate(0,-15)')

    var xAxis = d3v4.axisBottom()
    .scale(d3v4.scaleLinear().domain([100,500]).range([100,500]))
    .ticks(3)

    var gAxis = gMain.append('g')
    .classed('x axis', true)
    .attr('transform', 'translate(0,15)')

    var zoom = d3v4.zoom().on('zoom', zoomed);
    function zoomed() {
        var transform = d3v4.event.transform;

        var xNewScale = transform.rescaleX(xScale);
        xTopAxis.scale(xNewScale)  
        gTopAxis.call(xTopAxis);

        circles.attr('cx', function(d) { return xNewScale(d); });
    }
    gMain.call(zoom.transform, t);
    gMain.call(zoom)

    gAxis.call(xAxis);
    gTopAxis.call(xTopAxis);
}
fig4();
</script>

To wrap up this post, let's combine these techniques to create a figure which automatically
zooms between random data points (a la [M. Bostock's Zoom Transitions Block](http://bl.ocks.org/mbostock/b783fbb2e673561d214e09c7fb5cedee)). How do we do this?

First, we need a function to call every time we want to jump to a point:

```javascript
    let targetPoint = 1010;

    function transition(selection) {
        let n = dataPoints.length;
        let prevTargetPoint = targetPoint;

        // pick a new point to zoom to
        while (targetPoint == prevTargetPoint) {
            let i = Math.random() * n | 0
            targetPoint = dataPoints[i];
        }

        selection.transition()
        .delay(300)
        .duration(2000)
        .call(zoom.transform, transform)
        .on('end', function() { circles.call(transition); });
    }

    circles.call(transition);
```

This function picks a random point (`targetPoint`) and calls a
transition on the selection. In our case, the selection will be the circles.
When the transition is over, we simply call the function again to start it
over.

Second, we need a transform to center the view on the target point:

```javascript
    function transform() {
        // put points that are 10 values apart 20 pixels apart
        var k = 20 / (xScale(10) - xScale(0))
        // center in the middle of the visible area
        var tx = (xScale.range()[1] + xScale.range()[0])/2 - k * xScale(targetPoint)
        var t = d3.zoomIdentity.translate(tx, 0).scale(k)
        return t;
    }

```

<svg class="fig5"></svg>

<script>

function fig5() {
    var margin = {'left': -50, 'top': 80, 'bottom': 20, 'right': 20};
    var width = 500, height=50;
    var svg = d3v4.selectAll(".fig5")
        .attr('height', height + margin.top + margin.bottom)
        .attr('width', width + margin.left + margin.right);

    var gMain = svg.append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    gMain.append('rect')
    .attr('x', 50)
    .attr('y', -25)
    .attr('width', width)
    .attr('height', height)
    .style('fill', 'transparent');

    var xScale = d3v4.scaleLinear()
        .domain([0,5000])
        .range([100,500])

    var dataPoints = [1,1010,1020,5000];
    var targetPoint = 1015;


    var k = 10 / (xScale(1020) - xScale(1010))
    var tx = 200 - k * xScale(1010)
    var t = d3v4.zoomIdentity.translate(tx, 0).scale(k)

    var xNewScale = t.rescaleX(xScale)


    var circles = gMain.selectAll('circle')
    .data(dataPoints)
    .enter()
    .append('circle')
    .attr('r', 7)
    //.attr('cx', function(d) { return t.applyX(xScale(d)); })

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

    var xTopAxis = d3v4.axisTop()
    .scale(xNewScale)
    .ticks(3)

    var gTopAxis = gMain.append('g')
    .classed('x axis', true)
    .attr('transform', 'translate(0,-15)')

    var xAxis = d3v4.axisBottom()
    .scale(d3v4.scaleLinear().domain([100,500]).range([100,500]))
    .ticks(3)

    var gAxis = gMain.append('g')
    .classed('x axis', true)
    .attr('transform', 'translate(0,15)')

    var zoom = d3v4.zoom().on('zoom', zoomed);
    function zoomed() {
        var transform = d3v4.event.transform;
        var xNewScale = transform.rescaleX(xScale);

        xTopAxis.scale(xNewScale)
        gTopAxis.call(xTopAxis);
        circles.attr('cx', function(d) { return transform.applyX(xScale(d)); });
    }
    gMain.call(zoom.transform, t);
    gMain.call(zoom)

    gAxis.call(xAxis);
    gTopAxis.call(xTopAxis);

    function transform() {
        // put points that are 10 values apart 20 pixels apart
        var k = 20 / (xScale(10) - xScale(0))
        // center in the middle of the visible area
        var tx = (xScale.range()[1] + xScale.range()[0])/2 - k * xScale(targetPoint)
        var t = d3v4.zoomIdentity.translate(tx, 0).scale(k)
        return t;
    }

    function transition(selection) {
        let n = dataPoints.length;
        let prevTargetPoint = targetPoint;

        // pick a new point to zoom to
        while (targetPoint == prevTargetPoint) {
            let i = Math.random() * n | 0
            targetPoint = dataPoints[i];
        }

        selection.transition()
        .delay(300)
        .duration(2000)
        .call(zoom.transform, transform)
        .on('end', function() { circles.call(transition); });
    }

    circles.call(transition);
}
fig5();
</script>

And that's all. Just remember, when zooming and panning the position of the transformed point <em>[x<sub>1</sub>,y<sub>1</sub>] = [t<sub>x</sub> + k ×
x<sub>0</sub>, t<sub>y</sub> + k × y<sub>0</sub>]</em>. Everything else is just window dressing.
