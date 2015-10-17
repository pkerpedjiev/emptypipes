---
layout: post
title:  "The King's Jewels Problem"
description: "How to maximize the chances of picking the best option."
tags: javascript d3.js rna
---
<meta charset="utf-8">
<link rel='stylesheet' href='/css/kings-jewels.css'>

A long time ago, in an alternate universe, you rescue the king's
life. To show his gratitude, the king promises you one of his jewels as a
reward. He takes out his bag of jewels and tells you that you can 
reach into the bag and randomly choose one of the jewels. If you like it,
you can keep it. If you don't, you to place it into another bag and 
loses the opportunity to ever take that jewel. Judging by the size of the
bag, you estimate that there are 10 jewels inside.

**How should you proceed in order to maximize your chances of scoring the best
jewel in the bag?** Should you just take the first one you pick or should you
look at a few before deciding on one to take home? If so, how many?

There is a concrete mathematical solution, but in this case, it's more
informative to run some simulations and see what the outcome is. The histograms
below show how often a jewel with a value between 0 and 9 is picked after
seeing some of the jewels and then picking the next one which is better than
any seen (or the last if the best was seen and discarded).

<hr>
<div id="kj-plotting-area" ></div>
<hr>

The results are striking! If you don't look at any jewels and always pick the
first one, you're equally likely to get any of the jewels. That is, your
chances of picking the best one are 1/9. If you look at one, discard it and
then pick the next jewel which is better than the one you saw, your chances of
picking the best jewel increase dramatically! In fact, the entire distribution
gets skewed right and your chances of picking the second and third best jewels
also significantly increase.

You're after the best, however. From the histogram above, it's hard to see how
many we have to see and discard before we maximize our chances of picking the
best jewel. For that we can either run a simulation with lots of jewels and lots
of iterations. Or we can run simulations for increasing numbers of jewels and 
plot how many we have to look at, to maximize our chances of getting the best:

<hr>
<div id="kj-regression-area" style="width: 400px; margin-left: auto; margin-right: auto;"></div>
<hr>

What this chart shows is that the number of we have to look at and throw out to
maximize our chances of finding the best grows linearly with the number of
jewels. The slope of the line (0.36), indicats the fraction of the total number
of jewels that we should examine before picking the next best. 

The red line shows how many we should look at if we want to maximize the
average value of the jewel we end up with. If we try and maximize the chances
of bagging the best jewel, we also increase the chances that we end up with the
worst. When trying to get the highest value on average, we would thus have to
look at fewer jewels before deciding to look for the best yet. How much fewer,
in this case, between four and five times fewer.

#### What if the jewels are...? ####

But what if the values of the jewels are not uniformly distributed? What if most
jewels are average in value and only a few are either precious or worthless? Or
what if most jewels have a low value with only a few true gems? The next two sections
show the results when the jewels are normally distributed (mostly average) and
exponentially distributed (mostly low-value). 

<div class="accordion" id="accordion_kings_jewels">
    <div class="accordion-group">
        <div class="accordion-heading">
            <a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion_kings_jewels" href="#collapseNormalJewelDist">
            <b>Normally Distributed Jewels</b>
            </a>
        </div>
        <div id="collapseNormalJewelDist" class="accordion-body collapse out">
            <div class="accordion-inner">

            <div id="kj-plotting-area-normal" ></div>
            <div id="kj-regression-area-normal" style="width: 400px; margin-left: auto; margin-right: auto;" ></div>

            </div>
        </div>
    </div>

    <div class="accordion-group">
        <div class="accordion-heading">
            <a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion_kings_jewels" href="#collapseExponentialJewelDist">
            <b>Exponentially Distributed Jewels</b>
            </a>
        </div>
        <div id="collapseExponentialJewelDist" class="accordion-body collapse out">
            <div class="accordion-inner">

            <div id="kj-plotting-area-exponential" ></div>
            <div id="kj-regression-area-exponential" style="width: 400px; margin-left: auto; margin-right: auto;" ></div>

            </div>
        </div>
    </div>
</div>

#### Moral of the Story ####

As long as you have more than option and you want to get the best reward
possible, always discard the first third of the options and then pick the next
one which is better than any you have seen so far. If you want something better
than average but not necessarily the best, discard fewer. Or, to put it more
succintly:

<center><b>NEVER take the first offer when you have more than one choice!</b></center>

<script src="/js/lib/d3.min.js"></script>
<script src="/js/lib/d3-grid.js"></script>
<script src="/js/kings-jewels.js"></script>

<script type='text/javascript'>
    kingsJewelsExample();
</script>

#### Acknowledgements ####

<ul>
    <li>Huge thanks Stephen Rudich for introducing me to the
    King's Jewels problem a long time ago during a summer lecture at the
    Andrew's Leap program at CMU</li>

    <li> Thanks to <a
        href="http://trentrichardson.com/2010/04/06/compute-linear-regressions-in-javascript/">Trent Richardson</a> for the javascript implementation of a linear regression
    function.  </li>
</ul>
</body>
