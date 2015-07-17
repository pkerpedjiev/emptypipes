---
layout: post
title:  "Starting with Scala and Spark"
tags: scala spark
---

My latest fascination is Apache Spark. It makes it seemingly so simple to parallelize
data processing that it I had to try it out. With python as my go-to language, I 
fired up an IPython notebook and created a simple example. Unfortunately, extending
it to do a more complex join led to a 'Too Many Open Files' which I gave up on after
a few failed attempts at fixing it. So, unwilling to give up Spark, I decided I'd
try the same example using Scala. The following is an account of how I went from
knowing nothing about Scala, do doing some relatively simple data analysis with Spark.

To begin, I downloaded a copy of [Andy Petrella's spark-notebook](https://github.com/andypetrella/spark-notebook)
and started it without too much trouble. The first task is to read in tab-separated file containing gene
ids and pubmed ids. The file has only three columns, each of which contains an integer. Except for the first
line. That contains the headings of the columns:

Format: tax_id GeneID PubMed_ID (tab is used as a separator, pound sign - start of a comment)
9       1246500 9873079
9       1246501 9873079

Reading the file is simple:

var gene2pubmed = sparkContext.textFile("/Users/pkerp/projects/genbank/data/gene2pubmed")

But what does this return?

println(gene2pubmed.take(1))
[Ljava.lang.String;@12ff3e64

First WTF! Shouldn't each line be a string? Apparently not. According to [this stackoverflow
question](http://stackoverflow.com/questions/9868482/what-is-ljava-lang-string), this actually
refers to an Array of Strings. Printing this requires converting it a string itself:

println(Arrays.toString(gene2pubmed.take(1)));
<console>:35: error: not found: value Arrays
              println(Arrays.toString(gene2pubmed.take(1)));
                                    ^

Other notes:

    * How do I index into tuples? Obviously (1,2,3)(0) does not work for taking the 0'th element of the tuple (1,2,3)
