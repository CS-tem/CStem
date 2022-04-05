#!/bin/bash

# Get first n occurances of specified pattern in a file
# Usage: bash ngrep.sh 10 inproceedings dblp.xml

FILE=$3
N=$1
RE=$2

grep -nr -m $N $RE $FILE
