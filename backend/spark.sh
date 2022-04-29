cd "$(dirname "$0")"

DNAME="real"

mkdir -p data/$DNAME/post_spark
cp data/$DNAME/pre_spark/* data/$DNAME/post_spark

python3 fill_metrics.py -o article
python3 fill_metrics.py -o author
python3 fill_metrics.py -o institute
python3 fill_metrics.py -o author_topic
python3 fill_metrics.py -o topic
python3 fill_metrics.py -o venue
python3 fill_metrics.py -o coauthor
