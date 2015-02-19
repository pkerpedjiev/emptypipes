---
layout: post
title:  "VIM Python Snippets"
description: "How to simplify and ease the creation of new code by creating shortcuts to chunks of code using the vim snippets plugin."
tags: linux python vim
---

There are many times when a task calls for a simple python script. It is
usually something small that takes some input file as a parameter, does some
processing, and then spits out some results. It might even take an options or
two. It is tempting to just throw some lines of code into a file that directly
attacks the task in the form of a sequential script. By way of overly simplified
examples, consider the following code (let's creatively call it ``do_stuff.py``)
which simply converts the input to uppercase.  Simple, easy, to-the-point.

{% highlight python %}
import sys

for line in sys.stdin:
    print line.upper()
{% endhighlight %}

What happens, however, when it grows a little bit and we add a function?


{% highlight python %}
import random
import sys

def uppercase_and_scramble(line):
   ll = list(line)
   random.shuffle(ll)
   return "".join(ll)

for line in sys.stdin:
    print line.upper()
{% endhighlight %}

Still simple. Still easy. But now what happens, if we want to include that
function into another file. Then importing do_stuff.py will cause the for
loop to run leading to troubles. A much better solution is to do all of the
'scripty' stuff in a main function that only gets called if the file is called
as a script (as opposed to being imported as a library):

{% highlight python %}
import random
import sys
from optparse import OptionParser

def uppercase_and_scramble(line):
    '''
    Make the line uppercase, scramble its contents and return the result.
    '''
    ll = list(line)
    random.shuffle(ll)
    return "".join(ll)

def main():
    usage = """
    python do_stuff.py

    Process lines from the input.
    """
    num_args= 0
    parser = OptionParser(usage=usage)

    #parser.add_option('-o', '--options', dest='some_option', default='yo', help="Place holder for a real option", type='str')
    #parser.add_option('-u', '--useless', dest='uselesss', default=False, action='store_true', help='Another useless option')

    (options, args) = parser.parse_args()

    if len(args) < num_args:
        parser.print_help()
        sys.exit(1)

    for line in sys.stdin:
        print uppercase_and_scramble(line)

if __name__ == '__main__':
    main()


{% endhighlight %}

That's a lot of code for a simple task you say? Well it doesn't necessarily
require much typing to enter thanks to the
[SnipMate](http://www.vim.org/scripts/script.php?script_id=2540) plugin for
vim. By adding the following code in ``~/.vim/snippets/python.snippets`` we can
create almost all of the code by simply typing ``start`` and hitting tab
right at the beginning of the script.

{% highlight python %}
snippet start
    import sys
    from optparse import OptionParser

    def main():
        usage = """
        ${1:usage}
        """
        num_args= 0
        parser = OptionParser(usage=usage)

        #parser.add_option('-o', '--options', dest='some_option', default='yo', help="Place holder for a real option", type='str')
        #parser.add_option('-u', '--useless', dest='uselesss', default=False, action='store_true', help='Another useless option')

        (options, args) = parser.parse_args()

        if len(args) < num_args:
            parser.print_help()
            sys.exit(1)

    if __name__ == '__main__':
        main()

{% endhighlight %}

This will create the main function and position the cursor within the ``usage`` string 
thus priming the author to write a quick documentation of what this script will do. 
The ``num_args`` variable is there to make sure the user enters the right number of
arguments. Otherwise the script exits with an error. The rest of the processing code
should go directly after the `if` statement. When scripts are written in this manner, 
they can be painlessly turned into libraries at a future point in time.
