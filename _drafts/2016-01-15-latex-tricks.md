---
layout: post
title:  "Latex Tips"
description: "Macros and snippets I commonly use in latex documents"
tags: latex papers
---

** Highlight TODO text **

{% highlight latex %}
\newcommand{\TODO}[1]{\begingroup\color{red}#1\endgroup}
\newcommand{\DONE}[1]{\begingroup\color{OliveGreen}#1\endgroup}
\newcommand{\REPL}[2]{\begingroup\color{red}#1\endgroup\begingroup\color{OliveGreen}{ }#2\endgroup}
{% endhighlight %}

** Angstrom Character **

{% highlight latex %}
\newcommand{\angstrom}{\mbox{\normalfont\AA}}
{% endhighlight %}
