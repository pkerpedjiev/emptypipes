---
layout: post
title:  "Fast 3D Vector Operations in Cython"
description: "Speed up vector operations in python by using cython to pre-compile the code and add static type declarations."
tags: python cython vector
thumbnail: /img/2014-02-26-cython-vectors.png
---

The numpy library provides a plethora of fast functionality using for vectors. The question is, can we improve upon it by using cython and assuming vectors in three-dimensional space. Let's take the following two functions which are not provided by numpy, but easily implemented. The first simply calculates the magnitude of a vector, while the second calculates the distance between two vectors.

{% highlight python %}
import math as m
import numpy as np

def magnitude(vec):
    '''
    Return the magnitude of a vector (|V|).

    @param vec: The vector in question.
    @return: The magnitude of the vector.
    '''

    return m.sqrt(np.dot(vec, vec))
    
def vec_distance(vec1, vec2):
    v = vec2 - vec1
    return m.sqrt(np.dot(v, v1))
{% endhighlight %}


Now let's take the equivalent implementation in cython. The only major difference from the pure code is the definition of the data types and the handling of each value individually without any loops.

{% highlight python %}
cimport numpy as np

ctypedef np.double_t DTYPE_t
#print dir(np)
#from math import sin, cos, sqrt

from libc.math cimport sin,cos, sqrt, acos, atan2, pow

def vec_distance(np.ndarray[DTYPE_t, ndim=1] vec1, np.ndarray[DTYPE_t, ndim=1] vec2):
    cdef double d0 = vec2[0] - vec1[0]
    cdef double d1 = vec2[1] - vec1[1]
    cdef double d2 = vec2[2] - vec1[2]
    
    return sqrt(d0 * d0 + d1*d1 + d2*d2)
    
def magnitude(np.ndarray[DTYPE_t, ndim=1] vec):
    cdef double x = sqrt(vec[0] * vec[0] + vec[1] * vec[1] + vec[2] * vec[2])

    return x
{% endhighlight %}

Finally, the timing:

{% highlight python %}
In [2]: import cytvec as cv

In [3]: a = np.array([1.,2.,3.])

In [4]: %timeit vec_distance(a, a)
1000000 loops, best of 3: 1.44 us per loop

In [5]: %timeit magnitude(a - a)
1000000 loops, best of 3: 1.48 us per loop

In [6]: %timeit cv.vec_distance(a,a)
1000000 loops, best of 3: 554 ns per loop

In [7]: %timeit magnitude(a)
1000000 loops, best of 3: 656 ns per loop

In [8]: %timeit cv.magnitude(a)
1000000 loops, best of 3: 287 ns per loop

{% endhighlight %}

Using the cython implementation leads to a nearly three-fold decrease in the running time for the `vec_distance` function and an almost two-fold decrease in the running time for the `magnitude` function. The cytvec implementation can simply be copied into a file (let's say `cytvec.pyx`) and compiled into a module by following the instructions in the [cython tutorial](http://docs.cython.org/src/tutorial/cython_tutorial.html).

{% highlight bash %}
python setup.py build_ext --inplace
{% endhighlight %}

An already compiled implementation can be found in the [forgi](http://www.tbi.univie.ac.at/~pkerp/forgi/) package under `forgi.threedee.utilities.cytvec`.

