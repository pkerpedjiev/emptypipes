---
layout: post
title:  "Randomly Finding Someone on a Grid"
description: "How long does it take two people to find each other when moving, vs standing still?"
tags: javascript d3.js
---

<meta charset="utf-8"> 
<link rel="stylesheet" href="/css/random_finding.css">
<script src="/js/math.min.js"></script>
<script src="/js/random_finding.js"></script>

A few months ago somebody asked the [following question on
AskReddit](https://www.reddit.com/r/askscience/comments/35uljq/if_i_wanted_to_randomly_find_someone_in_an/?limit=500):

>"If I wanted to randomly find someone in an amusement park, would my odds of
>finding them be greater if I stood still or roamed around?"

As usual, the comments were highly informative with various users
running simulations to show that two people would generally find each
other faster when both moved around. The question was lost in the detritus
of my mind until a recent late-night conversation after a bioinformatics
conference. The context in this conversation was different but the underlying
question was the same. 

>"Are two proteins more likely to encounter each
>other when both are mobile or when one is attached to a cell membrance
>while the other is free to float around the interior of the cell?"

Same
question, different context. After bringing up the reddit post, I tried
my best to explain why it would make sense that fixing the position of
one person (or protein) would make it easier for the other to find it.
Alas, my memory had failed me and this conclusion was contrary to that
suggested by the reddit comment simulations. What struck me, however, 
is that I couldn't make a coherent case for why standing still is better,
and wasn't convinced by the other's argument that moving around was 
better. Frustrated, I decided to make a little tool to perform a simulation
of my own and to illustrate the phenomenon. So, without further ado, here
we go.

#### Scenario 1: One person waits ####

One person (green circle) waits, while the other (red circle) searches. Both
start at random positions at the start of each simulation.

<div id='onePersonWaits' style="width: 420px; margin-left: auto; margin-right: auto;"></div>
<script>
var onePersonWaits = randomFinding.randomFindingLinear()
.transitionDuration(100)
.runnerFixed(true);

d3.select('#onePersonWaits')
.call(onePersonWaits);
</script>

#### Scenario 2: Both people move ####

Both people (green and red circles) move around. Both start at random positions
at the start of each simulation.

<div id='bothPeopleMove' style="width: 420px; margin-left: auto; margin-right: auto;"></div>
<script>
var bothPeopleMove = randomFinding.randomFindingLinear()
.transitionDuration(100)

d3.select('#bothPeopleMove')
.call(bothPeopleMove);
</script>

#### Verdict ####

To save you some time, I took the liberty of repeating these simulations for a
variety of grid sizes and recorded the results.
