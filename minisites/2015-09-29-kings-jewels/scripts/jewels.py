#!/usr/bin/python

import numpy as np
import random
import scipy.stats as ss
import sys
from optparse import OptionParser

def main():
    usage = """
    python jewels.py

    Run the simulation.
    """
    num_args= 0
    parser = OptionParser(usage=usage)

    parser.add_option('-b', '--nth-best', dest='nth_best', default=1, help="Pick the best after the nth best", type='int')
    parser.add_option('-n', '--number', dest='number', default=10, help="The number of jewels in the bag", type='int')
    parser.add_option('-i', '--iterations', dest='iterations', default=100, help="The number of times to run the simulation", type='int')
    parser.add_option('-f', '--full-output', dest='full_output', default=False,
                      help="Output all of the numbers", action="store_true")
    #parser.add_option('-u', '--useless', dest='uselesss', default=False, action='store_true', help='Another useless option')

    (options, args) = parser.parse_args()

    if len(args) < num_args:
        parser.print_help()

        sys.exit(1)

    jewels = [i for i in range(options.number)]
    random.shuffle(jewels)

    print "jewels:", jewels

    picked = []
    for i in range(options.iterations):
        picked += [jewels[0]]
        random.shuffle(jewels)
        
    for i in range(0, options.number):
        picked = []
        best = 0

        for j in range(options.iterations):
            random.shuffle(jewels)
            #print "jewels[:i]", jewels[:i]
            if i == 0:
                max_to_i = -1
            else:
                if options.nth_best <= i:
                    max_to_i = sorted(jewels[:i], reverse=True)[options.nth_best-1]
                else:
                    max_to_i = sorted(jewels[:i], reverse=True)[0]

            picked_here = None

            for k in range(i+1, options.number):
                if jewels[k] > max_to_i:
                    picked_here = jewels[k]
                    break

            if picked_here is None:
                picked_here = jewels[-1]

            if picked_here == max(jewels):
                best += 1
             
            picked += [picked_here]

        #print "picked:", picked

        if options.full_output:
            print "{}".format(" ".join(map(str, picked)))

        if not options.full_output:
            print "i: {}, best: {} (25,50,70): [{:.1f} | {:.1f} | {:.1f}] mean: {:.1f} median: {:.1f} std: {:.1f}".format(i, best,

                                                                                           np.percentile(picked, 25), np.percentile(picked, 50), np.percentile(picked, 75), np.mean(picked), np.median(picked), np.std(picked))


if __name__ == '__main__':
    main()
