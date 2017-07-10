---
layout: post
title:  "Are Amazon reviews fake?"
description: "Are Amazon reviews fake? Some Amazon products have a suspicious number of positive reviews written with surprising language."
tags: random
thumbnail: /img/2017-05-25-webpack-npm-link-external-dependencies.png
---

Nearly every time I shop on Amazon, I use the reviews to guide my purchase.  Of
course. How else would I pick a product from a vast array of available options?
Even if I had honest, unbiased information about all aspects of the product,
how would I rank them? Is reliability more important to me than functionality?
How about aesthetics? My time is limited. I just want to pick a product that is
decent, doesn't break too soon and is reasonably priced. Amzon reviews make
this task easy. I just pick a price range then order the highest rated product
with more than some minimum number of reviews. This tends to work most of the
time, but as I was trying to decide on a pair of headphones to buy I got the
unpleasant feeling that something was wrong with this approach.

Namely, this heuristic relies on the accuracy of the reviews. But are they
always accurate? We rely on the fact that Amazon, as the dominant online
purveyor of just about everythin, polices its reviews and makes sure that 
they are not falsified. But are they? Let's look at an example.

Here's the headphones I was thinking of buying:

<img src="img/2017-07-09-fake-amazon-reviews/hiearcool-t1-product-listing.png" />

Looks like the perfect buy! Reasonably priced and great reviews. Must be a sure
thing. But is it? It's almost too good to be true. Let's take a look at the
distribution of reviews:

<img src="img/2017-07-09-fake-amazon-reviews/review-distribution-hiearcool.png" width="200" />

That's incredible. Too incredible. What do the reviews from a more "name-brand" product
look like? To begin... they have more variety:


<img src="img/2017-07-09-fake-amazon-reviews/panasonic-headphones-review.png" width="200" />

In fact, most of the products I've seen have had had some proportion of reviews
which were negative. This is to be expected. Even a fantastic product will have
detractors.  Even a well-built product will have cases where it breaks soon
after purchase.

But what about the reviews themselves? What do they look like? What do they say? Here's 
the first one on the list:


