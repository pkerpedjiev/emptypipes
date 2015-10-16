---
layout: post
title:  "Layouts Upon Layouts"
description: "An example of how to create nested d3 layouts."
tags: javascript d3.js rna
---
<meta charset="utf-8"> 
<img itemprop="image" src="/img/layouts_upon_layouts_itemprop.png" style='display:none' width=200 height=130>

Images are key to any scientific publication. Unfortunately, there don't
seem to be any hard and fast rules as to how large an image should be, what
the font sizes should be and how much of the space should be devoted to 
the actual figure as compared to the axis labels and such.

Having tried many different configurations, I've settled on a configuration
that works for about 90% of the graphs I make, using the fantastic
<a href="http://stanford.edu/~mwaskom/software/seaborn/">`seaborn`</a>
library in an <a href="http://ipython.org/notebook.html">IPython notebook:</a>

{% highlight python %}
import numpy as np
import seaborn as sns

sns.set_style('white')
sns.set_context("notebook", font_scale=1.5, rc={"lines.linewidth": 2.5})
rc('text', usetex=True)    # use latex in the labels
pylab.rcParams['figure.figsize'] = (4,3)

x = np.linspace(0, 2*math.pi,100)
y = sin(x)
z = cos(x)

fig, ax = plt.subplots()
ax.plot(x, y, label='sin')
ax.plot(x, z, label='cos')

ax.set_xlabel('x')
ax.set_ylabel('y')
ax.set_title('Trigonometric Functions')

handles, labels = ax.get_legend_handles_labels()
ax.legend(handles, labels)

plt.savefig('img/trigonometric_functions.png', dpi=500)
{% endhighlight %}


The result is a figure in which the axis and tick labels are legible and
the size of the plotting area is commensurate with the amount of data 
being displayed:

![simple proportional plot](/img/trigonometric_functions.png)
