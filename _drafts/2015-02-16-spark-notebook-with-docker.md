---
layout: post
title:  "Using The Spark Notebook with Docker"
tags: scala spark docker
comments: true
---

Trying to run [spark-notebook](https://github.com/andypetrella/spark-notebook)
using the provided docker container required overcoming a few hurdles
associated with my niavette of how docker works. To lessen the pain of anybody
else that wishes to follow my footsteps, I've written down the problems I've
encountered as well as how to solve them.

1. **Access outside files**: To access files outside of the container, we need
to specify a directory to mount using the `-v` option:

docker run -v /Users/pkerp/projects/chairliftplot/:/mnt -p 9000:9000 andypetrella/spark-notebook:0.2.0-spark-1.2.0-hadoop-1.0.4

2. Save notebooks: 
