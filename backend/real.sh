cd "$(dirname "$0")/parse_aminer"

mkdir -p ../data/aminer/s0
mkdir -p ../data/aminer/s1
mkdir -p ../data/aminer/s2

echo "Runnning institutes.py"
python institutes.py
echo "Running article.py"
python article.py
echo "Running citation.py"
python citation.py
echo "Running author_article.py"
python author_article.py
echo "Running author.py"
python author.py

cd ../data/aminer/
mkdir -p final
cp constant/topic.csv constant/venue_topic.csv constant/venue.csv final/
cp s0/* final/
cp s1/author_article.csv s1/cited_by.csv final/
cp s2/* final/

cd -
mkdir -p ../data/real/pre_spark
cp -r ../data/aminer/final/* ../data/real/pre_spark/
