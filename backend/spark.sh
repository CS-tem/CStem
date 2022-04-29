cd "$(dirname "$0")"

mkdir -p data/real/post_spark
cp data/real/pre_spark/* data/real/post_spark

python fill_metrics.py -o article
python fill_metrics.py -o author
python fill_metrics.py -o institute
python fill_metrics.py -o author_topic
python fill_metrics.py -o topic
python fill_metrics.py -o venue
python fill_metrics.py -o coauthor
