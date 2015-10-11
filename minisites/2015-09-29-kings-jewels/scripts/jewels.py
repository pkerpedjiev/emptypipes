#!/usr/bin/python

import json
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
    parser.add_option('-s', '--summary-output', dest='summary_output', default=False,
                      help="Print a summary of the output", action='store_true')
    parser.add_option('-d', '--distributin', dest='distribution', default='uniform',
            help='The type of distribution to use for the jewels', type='str')
    #parser.add_option('-u', '--useless', dest='uselesss', default=False, action='store_true', help='Another useless option')

    (options, args) = parser.parse_args()

    if len(args) < num_args:
        parser.print_help()

        sys.exit(1)

    normal_std_divisor = 5.

    if options.distribution == 'uniform':
        jewels = [i for i in range(options.number)]
    elif options.distribution == 'normal':
        jewels = map(int, np.random.normal(options.number / 2, options.number / normal_std_divisor, options.number))
    elif options.distribution == 'exponential':
        jewels = map(int, np.random.exponential(options.number / normal_std_divisor, options.number))

    random.shuffle(jewels)

    picked = []
    for i in range(options.iterations):
        picked += [jewels[0]]
        random.shuffle(jewels)
        
    all_picked = []
    stats = []
    for i in range(0, options.number):
        picked = []
        best = 0

        for j in range(options.iterations):
            if options.distribution == 'uniform':
                jewels = [j for j in range(options.number)]
            elif options.distribution == 'normal':
                jewels = map(int, np.random.normal(options.number / 2, options.number / normal_std_divisor, options.number))
            elif options.distribution == 'exponential':
                jewels = map(int, np.random.exponential(options.number / normal_std_divisor, options.number))

            random.shuffle(jewels)
            #random.shuffle(jewels)
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
        all_picked += [picked]


        if options.summary_output:
            print "i: {}, best: {} (25,50,70): [{:.1f} | {:.1f} | {:.1f}] mean: {:.1f} median: {:.1f} std: {:.1f} zscore: {:.1f}".format(i, best, np.percentile(picked, 25), np.percentile(picked, 50), np.percentile(picked, 75), np.mean(picked), np.median(picked), np.std(picked), (np.median(picked) - options.number / 2.) / np.std(picked))
        stats += [{'mean': np.mean(picked),
                  'median': np.median(picked),
                  'best': best,
                  'std': np.std(picked),
                  'l25': np.percentile(picked, 25),
                  'num': i }]

            
    if options.full_output:
        print json.dumps(all_picked)

    best_best = sorted(stats, key=lambda x: -x['best'])[0]['num']
    best_mean = sorted(stats, key=lambda x: -x['mean'])[0]['num']
    best_median = sorted(stats, key=lambda x: -x['median'])[0]['num']
    best_l25 = sorted(stats, key=lambda x: -x['l25'])[0]['num']

    if not options.full_output:
        print ",".join(map(str, [options.number, best_best, best_mean, best_median, best_l25]))


if __name__ == '__main__':
    main()

