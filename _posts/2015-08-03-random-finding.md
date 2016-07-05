---
layout: post
title:  "Randomly Finding Someone on a Grid"
description: "How long does it take two people to find each other when moving, vs standing still?"
tags: javascript d3.js problem
---

<meta charset="utf-8"> 
<link rel="stylesheet" href="/css/random_finding.css">
<script src="/js/math.min.js"></script>
<script src="/js/random_finding.js"></script>

<img itemprop="image" src="/img/random_finding/random_finding_thumbnail.png" style='display:none' width="150" height="150" />

A few months ago somebody asked the [following question on
AskReddit](https://www.reddit.com/r/askscience/comments/35uljq/if_i_wanted_to_randomly_find_someone_in_an/?limit=500):

<br>

>"If I wanted to randomly find someone in an amusement park, would my odds of
>finding them be greater if I stood still or roamed around?"

<br>

As usual, the comments were highly informative with various users
running simulations to show that two people would generally find each
other faster when both moved around. The question was lost in the detritus
of my mind until a recent late-night conversation after a bioinformatics
conference. The context in this conversation was different but the underlying
question was the same. 

<br>

>"Are two proteins more likely to encounter each
>other when both are mobile or when one is attached to a cell membrance
>while the other is free to float around the interior of the cell?"

<br>

 After bringing up the reddit post, I tried
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

<div id='onePersonWaits' style="width: 200px; margin-left: auto; margin-right: auto;"></div>
<script>
var onePersonWaits = randomFinding.randomFindingLinear()
.transitionDuration(100)
.histogramWidth(0)
.height(150)
.width(400)
.numPointsY(4)
.transitionDuration(100)
.strategyRunner('standing')
.strategyChaser('random')

d3.select('#onePersonWaits')
.call(onePersonWaits);

/*
var scanningStrategySimple = randomFinding.randomFindingLinear()
.transitionDuration(100)
.histogramWidth(0)
.height(150)
.width(400)
.strategyRunner('standing')
.strategyChaser('scanning')
.numPointsY(4);
*/
</script>

#### Scenario 2: Both people move ####

Both people (green and red circles) move around. Both start at random positions
at the start of each simulation.

<div id='bothPeopleMove' style="width: 200px; margin-left: auto; margin-right: auto;"></div>
<script>
var bothPeopleMove = randomFinding.randomFindingLinear()
.transitionDuration(100)
.histogramWidth(0)
.height(150)
.width(400)
.numPointsY(4)
.transitionDuration(100)
.strategyRunner('random')
.strategyChaser('random');

d3.select('#bothPeopleMove')
.call(bothPeopleMove)
</script>

#### Verdict ####

To save you some time, I took the liberty of repeating these simulations for a
variety of grid sizes and recorded the results.

<hr>
<h5 align=center> Number of Moves Required to Meet </h5>

<hr>
<table width=400 align=center>
<tr>
<th rowspan=2>Grid Size</th>
<th>Both People</th>
<th>One Person</th>
</tr>

<tr>
<th>Moving</th>
<th>Waits</th>
</tr>


<tr>
<td >2x2</td>
<td class='number-cell'>2</td>
<td class='number-cell'>2</td>
</tr>

<tr>
<td> 4x4</td>
<td class='number-cell'>11</td>
<td class='number-cell'>14</td>
</tr>

<tr>
<td> 8x8</td>
<td class='number-cell'>53</td>
<td class='number-cell'>73</td>
</tr>

<tr>
<td> 16x16</td>
<td class='number-cell'>257</td>
<td class='number-cell'>453</td>
</tr>

</table>
<hr>

It's clear that the better strategy is for both people to move at
random than to have one person wait while the other moves randomly.


But wait... 


Is this really a realistic scenario? How often do people just
move around randomly? In most cases, when people are looking 
for something, they search in some methodic manner. The rest 
of this post will explore two fundamentally similar strategies
and how they affect the search time.

#### Scanning Strategy ####

The first strategy involves simply scanning the grid up and 
down, left to right.

<div id='scanningStrategySimple' style="width: 200px; margin-left: auto; margin-right: auto;"></div>
<script>
var scanningStrategySimple = randomFinding.randomFindingLinear()
.transitionDuration(100)
.histogramWidth(0)
.height(150)
.width(400)
.strategyRunner('standing')
.strategyChaser('scanning')
.numPointsY(4);

d3.select('#scanningStrategySimple')
.call(scanningStrategySimple);
</script>

#### Avoiding Strategy ####

The avoiding strategy involves keeping track of where
the person has been, and at every point, visiting 
the least visited neighbor. If there is more than one
least visited neighbor, pick one at random and continue.

<div id='avoidingStrategySimple' style="width: 200px; margin-left: auto; margin-right: auto;"></div>
<script>
var avoidingStrategySimple = randomFinding.randomFindingLinear()
.transitionDuration(100)
.histogramWidth(0)
.height(150)
.width(400)
.strategyRunner('standing')
.strategyChaser('avoiding')
.numPointsY(4);

d3.select('#avoidingStrategySimple')
.call(avoidingStrategySimple);
</script>

#### Centering Strategy ####

A reddit user recently pointed out that a reasonable strategy
might be for one person to just go to the center because there
they would have a larger chance of being found by randomly 
moving person. An illustration of this appears below where
the red person moves to the center and green person wanders
around randomly.

<div id='centeringStrategySimple' style="width: 200px; margin-left: auto; margin-right: auto;"></div>
<script>
var centeringStrategySimple = randomFinding.randomFindingLinear()
.transitionDuration(100)
.histogramWidth(0)
.height(150)
.width(400)
.strategyRunner('random')
.strategyChaser('center')
.numPointsY(4);

d3.select('#centeringStrategySimple')
.call(centeringStrategySimple);
</script>

### Pairwise Comparison of Strategies ###

To determine what the best course of action is when two people are separated
somewhere, we need to do a pairwise comparison of the strategies on an 8x8 grid:

<hr>
<h5 align=center> Median Moves Requires to Meet </h5>
<hr>

<table id='pairwiseStrategyComparison' align=center>
<tr>
<td></td>
<td> Standing </td>
<td> Random </td>
<td> Scanning </td>
<td> Avoiding </td>
<td> Centering </td>
</tr>

<tr>
<td>Standing</td>
<td class='number-cell'>*</td>
<td class='number-cell'>82</td>
<td class='number-cell'>34</td>
<td class='number-cell'>33</td>
<td class='number-cell'>*</td>
</tr>
<tr>
<td>Random</td>
<td class='number-cell'></td>
<td class='number-cell'>60</td>
<td class='number-cell'>51</td>
<td class='number-cell'>51</td>
<td class='number-cell'>54</td>
</tr>
<tr>
<td>Scanning</td>
<td class='number-cell'></td>
<td class='number-cell'></td>
<td class='number-cell'>*</td>
<td class='number-cell'>52</td>
<td class='number-cell'>15</td>
</tr>
<tr>
<td>Avoiding</td>
<td class='number-cell'></td>
<td class='number-cell'></td>
<td class='number-cell'></td>
<td class='number-cell'>57</td>
<td class='number-cell'>30</td>
</tr>
<td>Centering</td>
<td class='number-cell'></td>
<td class='number-cell'></td>
<td class='number-cell'></td>
<td class='number-cell'></td>
<td class='number-cell'>3</td>
</tr>
</table>

<hr> <br> 

Generally, standing still is the best strategy if the other person is
**not** moving around randomly. Even if they are, the best strategy appears to
be to first go the center and stay put there.  Moving around randomly is only
optimal if the other person is doing an avoiding walk.  Scanning and avoiding
work well in general with one major caveat: if both people are scanning, it can
lead to a situation where the two peole never meet, no matter how long they
walk.

<div id='scanningScanningStrategy' style="width: 250px; margin-left: auto; margin-right: auto;"></div>
<script>
var scanningScanningChart = randomFinding.randomFindingLinear()
.transitionDuration(100)
.histogramWidth(0)
.height(150)
.width(400)
.strategyRunner('scanning')
.strategyChaser('scanning')
.numPointsY(4)
.initialRunnerPosition([3,1])
.initialChaserPosition([2,1]);

d3.select('#scanningScanningStrategy')
.call(scanningScanningChart);
</script>

The avoiding strategy avoids (heh), this outcome by introducing a little bit
of stochasticity into the searching process by picking a random position to
go to when there are equally many least visited options available.

### Conclusion ###

The best strategy is for people to choose a point at which they meet if they
get lost. When both people go to the center, it takes a median of 3 moves and
will never take more than four moves (on an 8x8 grid).

Often times, however, this doesn't enter the conversation and an ad-hoc
strategy must be selected. The second best option is for one person to stop
moving and for the other to scan the search area looking for them. This also
requires a certain amount of prior coordination to determine who will stop. If
both people decide to stop, then it stands to reason that they'll never find
each other. Thus, when there is no agreed upon strategy, it appears that the
best choice is to walk around avoiding places that you've already been and
taking a random turn here or there. 

Finally, if you're really lazy it pays off to walk to the center and wait
there. This will actually lead to a faster rendezvous when the other person
is walking around randomly than walking around randomly yourself.

Good luck!

Read on for a look at the distributions of finding times and the application
that made all of this possible.

### Appendix ###

<hr>
<h5 align=center> The Distribution of the Number of Moves Required to Meet </h5>
<hr>

<table id='pairwiseStrategyComparisonHistograms' align=center>
<tr>
<td></td>
<td> Standing </td>
<td> Random </td>
<td> Scanning </td>
<td> Avoiding </td>
<td> Centering </td>
</tr>

<tr>
<td>Standing</td>
<td class='number-cell'><img width=100 src="/img/random_finding/8_8_scanning_scanning.png" /></td>
<td ><img width=100 src="/img/random_finding/8_8_standing_random.png" /></td>
<td class='number-cell'><img width=100 src="/img/random_finding/8_8_standing_scanning.png" /></td>
<td class='number-cell'><img width=100 src="/img/random_finding/8_8_standing_avoiding.png" /></td>
<td class='number-cell'><img width=100 src="/img/random_finding/8_8_scanning_scanning.png" /></td>
</tr>
<tr>
<td>Random</td>
<td class='number-cell'></td>
<td class='number-cell'><img width=100 src="/img/random_finding/8_8_random_random.png" /></td>
<td class='number-cell'><img width=100 src="/img/random_finding/8_8_random_scanning.png" /></td>
<td class='number-cell'><img width=100 src="/img/random_finding/8_8_random_avoiding.png" /></td>
<td class='number-cell'><img width=100 src="/img/random_finding/8_8_centering_random.png" /></td>
</tr>
<tr>
<td>Scanning</td>
<td class='number-cell'></td>
<td class='number-cell'></td>
<td class='number-cell'><img width=100 src="/img/random_finding/8_8_scanning_scanning.png" /></td>
<td class='number-cell'><img width=100 src="/img/random_finding/8_8_avoiding_scanning.png" /></td>
<td class='number-cell'><img width=100 src="/img/random_finding/8_8_centering_scanning.png" /></td>
</tr>
<tr>
<td>Avoiding</td>
<td class='number-cell'></td>
<td class='number-cell'></td>
<td class='number-cell'></td>
<td class='number-cell'><img width=100 src="/img/random_finding/8_8_avoiding_avoiding.png" /></td>
<td class='number-cell'><img width=100 src="/img/random_finding/8_8_centering_avoiding.png" /></td>
</tr>
<td>Centering</td>
<td class='number-cell'></td>
<td class='number-cell'></td>
<td class='number-cell'></td>
<td class='number-cell'></td>
<td class='number-cell'><img width=100 src="/img/random_finding/8_8_centering_centering.png" /></td>
</tr>
</table>
<hr>

Key Points from the Histograms:

<ul>
 <li>Having one person sit still severly restricts the maximum number of moves
that need to be taken if the other person is using the avoiding or scanning
strategy.</li> 
  <li>One person standing and the other moving randomly can lead to an
exorbitantly long search time.
    </li>
    <li>
        Both people standing or both people scanning can lead to infinite
        search times.
    </li>
    <li>
        Most of the time, the search will be faster rather than slower, 
        but the times can vary a lot. Much of the bias toward faster 
        search times is actually due to the fact that the starting
        points are chosen randomly, and closer starting points are
        more likely than further starting points.
    </li>
    </ul>

#### In Three Dimensions ####

A [few people](https://www.reddit.com/r/dataisbeautiful/comments/3flifw/animation_and_analysis_of_the_randomly_finding/ctpw7zd) wondered how different the results would be on a 3D grid. It's large-ish step to add 3D rendering to the current animations, but changing the code to use 3D dimensions wasn't a huge deal. The results are in the table below.

<hr>
<h5 align=center> Median Moves Requires to Meet </h5>
<hr>

<table id='pairwise3DStrategyComparison' align=center>
<tr>
<td></td>
<td> Standing </td>
<td> Random </td>
<td> Avoiding </td>
</tr>

<tr>
<td>Standing</td>
<td class='number-cell'>*</td>
<td class='number-cell'>438</td>
<td class='number-cell'>253</td>
</tr>
<tr>
<td>Random</td>
<td class='number-cell'></td>
<td class='number-cell'>380</td>
<td class='number-cell'>375</td>
</tr>
<tr>
<td>Avoiding</td>
<td class='number-cell'></td>
<td class='number-cell'></td>
<td class='number-cell'>344</td>
</tr>
</table>

<hr>
<br>

The results a roughly analagous to those on the 2D grid. Naturally, it takes
more moves for people to find each other in 3D, but the best strategy remains
standing - avoiding, and moving in a random fashion is better than standing
when the other person is also moving randomly. For those that are interested,
the histograms below show the distribution of search lengths on a 3D grid.

<hr>
<h5 align=center> The Distribution of the Number of Moves Required to Meet on a 3D Grid </h5>
<hr>

<table id='pairwiseStrategyComparisonHistograms' align=center>
<tr>
<td></td>
<td> Standing </td>
<td> Random </td>
<td> Avoiding </td>
</tr>

<tr>
<td>Standing</td>
<td ><img width=100 src="/img/random_finding/8_8_scanning_scanning.png" /></td>
<td ><img width=100 src="/img/random_finding/3d_8_8_standing_random.png" /></td>
<td ><img width=100 src="/img/random_finding/3d_8_8_standing_avoiding.png" /></td>
</tr>
<tr>
<td>Random</td>
<td ></td>
<td ><img width=100 src="/img/random_finding/3d_8_8_random_random.png" /></td>
<td ><img width=100 src="/img/random_finding/3d_8_8_random_avoiding.png" /></td>
</tr>
<tr>
<tr>
<td>Avoiding</td>
<td ></td>
<td ></td>
<td ><img width=100 src="/img/random_finding/3d_8_8_avoiding_avoiding.png" /></td>
</tr>
</table>
<hr>
<br>
#### Make Your Own Simulation ####

Here's an application that you can use to run your own simulation.

<div id='random-finding-options' style='width: 400px; margin-left: auto; margin-right: auto'>
<table id='options-table' style='width: 400px'>
<tr>
<td colspan=2>
<label>Strategy Person 1:</label>
<select id='selectStrategy1'> </select>
</td>
<td colspan=2>
<label>Strategy Person 2:</label>
<select id='selectStrategy2'> </select>
</td>
</tr>
</table>
</div>
<div id='random-finding-linear' style='width: 400px; margin-left: auto; margin-right: auto'></div>
<script>
var randomFindingLinearChart = randomFinding.randomFindingLinear();

d3.select('#random-finding-linear')
.call(randomFindingLinearChart);

var optionsChart = randomFinding.randomFindingOptions()
    .oldChart(randomFindingLinearChart);

d3.select('#random-finding-options')
.call(optionsChart);

</script>

#### Source ####

The source code for the application to run these simulations can be found [on github](https://github.com/pkerpedjiev/random_finding).

