---
layout: post
title:  "Train Travel Times in Europe"
description: "A map of the travel time from Berlin, Vienna, London, Paris and Jena to any other place in Europe."
tags: python map
---

I like travelling. I like trains. I don't particularly like making decisions.
Thus when deciding where to travel to with a train, it would be nice to know
which areas are accessible. Taking inspiration from [Beau Gunderson's route
times in Seattle](http://beaugunderson.com/routes/), I decided to create maps
showing which places are accessible by train from four of Europe's major
cities: London, Paris, Berlin and Vienna. 

The methodology is simple. I used the [Swiss public transport
API](http://transport.opendata.ch/) to get best connection between the start
city (London, Paris, Berlin and Vienna) and every other city in Europe. Then I
created a grid over all of Europe and interpolated the time to each point on
the grid by assuming that any location that wasn't a train station could be
walked to at a rate of 10 minutes per kilometer. The results show a
interconnected web of easy-to-reach locations criss-crossing the disconnected
countryside.

Darker blue colors indicate a shorter travel time. Click on the images to overlay
them on top of open-street maps.


<table>
<tr>
<td><div align="center"><a href="/supp/travel_times_from_london"><img src="/img/from_london.jpg" width=260 height=260 style="border:1px solid #021a40;"/></a>London</div></td>
<td><div align="center"><a href="/supp/travel_times_from_paris"><img src="/img/from_paris.jpg" width=260 height=260 style="border:1px solid #021a40;" /></a>Paris</td>
</tr>
<tr>
<td><div align="center"><a href="/supp/travel_times_from_berlin"><img src="/img/from_berlin.jpg" width=260 height=260 style="border:1px solid #021a40;"></a>Berlin</div></td>
<td><div align="center"><a href="/supp/travel_times_from_vienna"><img src="/img/from_vienna.jpg" width=260 height=260 style="border:1px solid #021a40;"></a>Vienna</td>
</tr>
</table>
