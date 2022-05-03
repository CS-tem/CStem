cd "$(dirname "$0")"

DNAME="artificial"

mkdir -p data/$DNAME/post_spark
cp data/$DNAME/pre_spark/* data/$DNAME/post_spark

python fill_metrics.py -o article
python fill_metrics.py -o author
python fill_metrics.py -o institute
python fill_metrics.py -o author_topic
python fill_metrics.py -o topic
python fill_metrics.py -o venue
python fill_metrics.py -o coauthor
