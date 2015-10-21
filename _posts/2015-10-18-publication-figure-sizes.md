---
layout: post
title:  "Figure Proportions"
description: "Creating scientific figures with reasonable proportions and font sizes using IPython Notebook"
tags: python matplotlib research
---
<meta charset="utf-8"> 
<img itemprop="image" src="/img/layouts_upon_layouts_itemprop.png" style='display:none' width=200 height=130>

Graphs are key to any scientific publication. Unfortunately, there don't seem
to be any hard and fast rules as to how large they should be, what the font
sizes they should use and how much space should be devoted to the actual
figure as compared to the axis labels and such.

Having tried many different configurations, I've settled on some parameters
that work as a starting point for most of the graphs I make. The axis and tick
labels are legible and the size of the plotting area is commensurate with the
amount of data being displayed:

<hr>
<img src="/img/trigonometric_functions.png" width=250 align="middle">
<hr>

 The code to generate this plot uses the <a
 href="http://stanford.edu/~mwaskom/software/seaborn/">seaborn</a> library in
 an <a href="http://ipython.org/notebook.html">IPython notebook:</a>


{% highlight python %}
import numpy as np
import seaborn as sns

# set the figure look
sns.set_style('white')
sns.set_context("notebook", font_scale=1.5, rc={"lines.linewidth": 2.5})
rc('text', usetex=True)    # use latex in the labels
pylab.rcParams['figure.figsize'] = (4,3)

# create the dummy data
x = np.linspace(0, 2*math.pi,100)
y = sin(x)
z = cos(x)

# plot that sucker
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



