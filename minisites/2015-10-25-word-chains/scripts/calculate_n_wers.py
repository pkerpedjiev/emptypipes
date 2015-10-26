#!/usr/bin/python

import sys
from optparse import OptionParser

def print_recursive(wer, indent=0):
    '''
    Iterate over wer path and print it out recursively.
    '''
    for key,value in sorted(wer.items(), key=lambda x: x[1]['c'] / ((len(x[1]['f'])+1) ** 2)):
        print "{}{} ({})".format("".join([' '] * indent), key, wer[key]['c'])
        print_recursive(wer[key]['f'], indent + 2)

def main():
    usage = """
    python calculate_n_wers.py file.txt
    """
    num_args= 0
    parser = OptionParser(usage=usage)

    parser.add_option('-n', '', dest='n', default=1, help="Calculate how many times three words occcur in a row", type='int')
    #parser.add_option('-u', '--useless', dest='uselesss', default=False, action='store_true', help='Another useless option')

    (options, args) = parser.parse_args()

    if len(args) < num_args:
        parser.print_help()
        sys.exit(1)

    paths = {}
    with open(args[0], 'r') as f:
        sentences = " ".join(f.readlines()).split(".")
        for sentence in sentences:
            words = sentence.split(' ')
            for i in range(len(words) - options.n):
                current_path = paths

                counted = 0
                j = 0
                while counted < options.n and i+j < len(words):
                    word = words[i+j].strip('\r\n,').lower()

                    j += 1

                    to_stop = False
                    for symbol in ['/','[',']', '@', "'", '-', ':', ';', '?', '(', ')']:
                        if symbol in word:
                            to_stop = True

                    if to_stop:
                        break

                    if len(word) == 0:
                        continue
                    
                    counted += 1

                    if word not in current_path:
                        current_path[word] = {'f': {}, 'c': 1}
                    else:
                        current_path[word]['c'] += 1

                    current_path = current_path[word]['f']
    print_recursive(paths)

if __name__ == '__main__':
    main()

