---
layout: post
title:  "Killing the tmux sockets"
categories: python graphs
---

Quite often, when I try to attach to an existing tmux session, the following error pops up:

{% highlight bash %}
failed to connect to server: Connection refused
{% endhighlight %}

To cut a long story short, fixing it simply requires running the following command:

{% highlight bash %}
killall -s SIGUSR1 tmux
{% endhighlight %}

Here's a [reference to a stackexchange question](http://unix.stackexchange.com/questions/40928/tmux-session-lost-in-unknown-pts-cause-and-possible-solution)
which gives slightly more information.
