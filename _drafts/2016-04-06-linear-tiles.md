---
layout: post
title:  "Linear Tiles"
description: "How to display large quantities of data using zooming and linear tiles."
tags: javascript d3.js tiles
thumbnail: http://emptypipes.org/img/isochrone_example.png
---
<meta charset="utf-8"> 
<img itemprop="image" src="/img/isochrone_example.png" style='display:none' width=200 height=170>

Let's say we wanted to display an enormous amount of data online in a browser.
What's the problem? If your first answer is *bandwidth*, then we're in
agreement. If you thought about it for a second and decided to change your
answer to *clarity*, then we're even more in agreement. These are the two
largest issues that plague someone wishing to display enormous datasets
online (and offline too, for that matter). Why? Well let's look into each
one separately, using ski areas as an example.

According to the OpenStreeMap data (as of May 2015), there are approximately
______ ski areas (see ____  for an explanation of what I consider a ski area)
in the world. Being curious little creatures, we'd like to rank and display
these areas according to their elevation as well as how much vertical drop
they offer. This is important because (a) we want to take longer runs and
(b) the higher up a ski area is, the more likely it is to have snow. We'd
also like an impression of how large these places are overall (we do want
some variety in terms of the runs we can take, after all) as well as a way
to identify them.

So where do we begin? Let's ignore our two concerns about *bandwidth* and
*clarity* and load everything into one huge bar chart. The size of the entire
data set is 1.5MB, so loading everything in the browser is not entirely
infeasible. Loading everything as DOM elements might slow things down a tad
but it should be entirely doable.

...

So what can we do? Well, how about we take a page out of Google's book
and decompose the data into different zoom levels. Let's say we have
the following simple dataset:

{% highlight python %}
    entries = [{'pos': 3, 'val': 15.99},
               {'pos': 0, 'val': 7.27},
               {'pos': 5, 'val': 3.88},
               {'pos': 6, 'val': 3.05},
               {'pos': 4, 'val': 3.02},
               {'pos': 1, 'val': 2.99},
               {'pos': 2, 'val': 2.48}]
{% endhighlight %}

And we want to decompose it into tiles: 

{% highlight json %}
[{"shown": [{"pos": 3, "val": 15.99}], "end_x": 6, "num": 0, "zoom": 0, "start_x": 0}, 
    {"shown": [{"pos": 3, "val": 15.99}], "end_x": 3.0, "num": 0, "zoom": 1, "start_x": 0}, 
        {"shown": [{"pos": 0, "val": 7.27}], "end_x": 1.5, "num": 0, "zoom": 2, "start_x": 0}, 
            {"shown": [{"pos": 0, "val": 7.27}], "end_x": 0.75, "num": 0, "zoom": 3, "start_x": 0}, 
            {"shown": [{"pos": 1, "val": 2.99}], "end_x": 1.5, "num": 1, "zoom": 3, "start_x": 0.75},       
        {"shown": [{"pos": 3, "val": 15.99}], "end_x": 3.0, "num": 1, "zoom": 2, "start_x": 1.5}, 
            {"shown": [{"pos": 2, "val": 2.48}], "end_x": 2.25, "num": 2, "zoom": 3, "start_x": 1.5}, 
            {"shown": [{"pos": 3, "val": 15.99}], "end_x": 3.0, "num": 3, "zoom": 3, "start_x": 2.25}, 
    {"shown": [{"pos": 5, "val": 3.88}], "end_x": 6, "num": 1, "zoom": 1, "start_x": 3.0}, 
        {"shown": [{"pos": 4, "val": 3.02}], "end_x": 4.5, "num": 2, "zoom": 2, "start_x": 3.0}, 
            {"shown": [], "end_x": 3.75, "num": 4, "zoom": 3, "start_x": 3.0}, 
            {"shown": [{"pos": 4, "val": 3.02}], "end_x": 4.5, "num": 5, "zoom": 3, "start_x": 3.75}, 
        {"shown": [{"pos": 5, "val": 3.88}], "end_x": 6, "num": 3, "zoom": 2, "start_x": 4.5}, 
            {"shown": [{"pos": 5, "val": 3.88}], "end_x": 5.25, "num": 6, "zoom": 3, "start_x": 4.5}, 
            {"shown": [{"pos": 6, "val": 3.05}], "end_x": 6, "num": 7, "zoom": 3, "start_x": 5.25}]
{% endhighlight %}

Each of these tiles shows a particular subset of the data. In this case, each
one shows just one data point, which happens to be the one with the greatest
value within the interval that the tile covers. Each interval is further
subdivided into two sub-intervals forming a binary tree. The tiles at each zoom
level cover


