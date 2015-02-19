---
layout: post
title:  "Reviving a Seemingly Dead Tmux"
description: "Bring a tmux session back from the dead by recreating the socket it uses."
tags: tmux linux
---

Quite often, when I try to attach to an existing tmux session, the following error pops up:

{% highlight bash %}
failed to connect to server: Connection refused
{% endhighlight %}

It seems like `tmux` has disappeared or crashed. Fortunately, to this date that
has never been the case. It's just a simple case of a deleted socket. To cut a
long story short, fixing it requires sending `tmux` a signal to recreate the
socket:

{% highlight bash %}
killall -s SIGUSR1 tmux
{% endhighlight %}

Here's a [reference to a stackexchange question](http://unix.stackexchange.com/questions/40928/tmux-session-lost-in-unknown-pts-cause-and-possible-solution)
which gives slightly more information.
