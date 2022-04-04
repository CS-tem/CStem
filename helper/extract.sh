#!/bin/bash

# Extract lines between a specified interval
# Usage: bash extract.sh dblp.xml 4060 4068

FILE=$1
N1=$(($2 - 1))
N2=$(($3 + 1))

sed -n "1,${N1}b;${N2}q;p" $FILE
