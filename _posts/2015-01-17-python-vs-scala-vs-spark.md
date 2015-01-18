---
layout: post
title:  "Python vs. Scala vs. Spark"
tags: python scala spark
---

The fantastic [Apache Spark](https://spark.apache.org/) framework provides an
API for distributed data analysis and processing in three different languages:
Scala, Java and Python. Being an ardent yet somewhat impatient Python user, I
was curious if there would be a large advantage in using Scala to code my data
processing tasks, so I created a small benchmark data processing script using
Python, Scala, and SparkSQL. 

#### The Task ####

The benchmark task consists of the following steps:

1. Load a tab-separated table (gene2pubmed), and convert string values to integers
2. Load another table (pmid_year), parse dates and convert to integers
3. Join the two tables on a key
4. Count the number of occurances of a key (reduce)
5. Sort by key
6. Collect

#### The Result ####

<div class='chart'>
<div align='center' id="python-scala-spark-chart"></div>
<link rel="stylesheet" href="/css/d3_bar_chart.css">
<script src="http://d3js.org/d3.v3.min.js"></script>
<script src="/js/d3_python_scala_spark.js"></script>
 </div>

<!-- <img alt="Python and Scala on Spark Benchmark Results" src=/img/python_vs_scala_vs_spark.png width=400px> -->

#### Interpretation ####

The fastest performance was achieved when using SparkSQL with Scala. The
slowest, SparkSQL with Python. The more cores used, the more equal the results.
This is likely due to the fact that parallelizable tasks start to contribute
less and less of the total time and so the running time becomes dominated by
the collection and aggregation which must be run synchronously, take a long
time and are largely language independent (i.e. possibly run by some internal
Spark API). This is only a guess, however.

#### Conclusion

If you have less cores at your disposal, Scala is quite a bit faster than
Python.  As more cores are added, its advantage dwindles. Having more computing
power at your disposal gives you the opportunity to use alternative languages
without having to wait for your results. If computing power is at a premium,
then it might make sense to learn a little bit of Scala, if only enough to be
able to code SparkSQL queries.

#### Apache Spark ####

The code for each programming language is listed in the sections below:

##### Master and Worker Nodes #####

The number of workers was set in the `SPARK_WORKER_CORES` variable in  `conf/spark-env.sh`

{% highlight bash %}
./sbin/stop-all.sh; rm logs/*; ./sbin/start-all.sh
{% endhighlight %}


##### Python Shell #####

{% highlight bash %}
./spark-1.2.0/bin/pyspark --master spark://server.com:7077 --driver-memory 4g --executor-memory 4g
{% endhighlight %}

##### Scala Shell #####

{% highlight bash %}
./spark-1.2.0/bin/spark-shell --master spark://server.com:7077 --driver-memory 4g --executor-memory 4g
{% endhighlight %}

#### Benchmark Code ####

The following code was pasted into its respective shell and timed.

##### Scala #####

{% highlight scala %}
val pmid_gene = sc.textFile("/Users/pkerp/projects/genbank/data/gene2pubmed").map(_.split("\t")).filter(_(0).head != '#').map(line => (line(2).toInt, line(1).toInt)).cache()

// the dates were obtained by doing entrez queries and stored as
// table of the form "date pmid"
	object ParsingFunctions {
		def parseDate(line: String): (Int,Int) = {
		    // extract the date information and the pmid
		    // and return it as tuple
		    val parts = line.split(" ");
			// the year is in %Y/%m/%d format
			val year = parts(0).split("/")(0).toInt;
			val pmid = parts(1).toInt;
			return (pmid, year);
		}
	}
val pmid_year = sc.textFile("/Users/pkerp/projects/genbank/data/pmid_year.ssv").map(ParsingFunctions.parseDate)
val pmid_gene_year = pmid_year.join(pmid_gene)

val gene_year_1 = pmid_gene_year.map{ case (pmid, (gene, year)) => ((gene, year), 1)}
val gene_year_counts = gene_year_1.reduceByKey((x,y) => x+y)
val counts_gene_year = gene_year_counts.map{case ((gene,year), count) => (count, (gene, year))}
val sorted_counts_gene_year = counts_gene_year.sortByKey()
val scgy = sorted_counts_gene_year.collect()
//blah
{% endhighlight %}

##### Scala SQL #####

{% highlight scala %}
val sqlContext = new org.apache.spark.sql.SQLContext(sc)
import sqlContext.createSchemaRDD
case class PmidGene(taxid: Int, geneid: Int, pmid: Int)
case class PmidYear(pmid: Int, year: Int)

val gene2pubmed = sc.textFile("/Users/pkerp/projects/genbank/data/gene2pubmed").map(_.split("\t")).filter(_(0).head != '#').map(line => PmidGene(line(0).toInt, line(1).toInt, line(2).toInt)).cache()

gene2pubmed.registerTempTable("gene2pubmed")

	object ParsingFunctions {
		def parseDate(line: String): PmidYear = {
		    // extract the date information and the pmid
		    // and return it as tuple
		    val parts = line.split(" ");
			// the year is in %Y/%m/%d format
			val year = parts(0).split("/")(0).toInt;
			val pmid = parts(1).toInt;

			return PmidYear(pmid, year);
		}
	}

val pmid_year = sc.textFile("/Users/pkerp/projects/genbank/data/pmid_year.ssv").map(ParsingFunctions.parseDate)
pmid_year.registerTempTable("pmid_year")
val geneid_year = sqlContext.sql("select geneid, year from pmid_year, gene2pubmed where pmid_year.pmid = gene2pubmed.pmid")
geneid_year.registerTempTable("geneid_year")
val result = sqlContext.sql("select geneid, year, count(*) as cnt from geneid_year group by geneid, year order by cnt desc")
val x = result.collect()
//blah
{% endhighlight %}

##### Python #####

{% highlight python %}
# get the gene_id -> pubmed mapping
pmid_gene = sc.textFile("/Users/pkerp/projects/genbank/data/gene2pubmed").map(lambda x: x.split("\t")).filter(lambda x: x[0][0] != '#').map(lambda x: (int(x[2]), int(x[1]))).cache()
  
# the dates were obtained by doing entrez queries and stored as
# table of the form "date pmid"
def parse_date_pmid_line(line):
    # extract the date information and the pmid
    # and return it as tuple
    parts = line.split()
    # the year is in %Y/%m/%d format
    year = int(parts[0].split('/')[0])
    pmid = int(parts[1])
    return (pmid, year)

# extract the dates and store them as values where the key is the pmid
pmid_year = sc.textFile('/Users/pkerp/projects/genbank/data/pmid_year.ssv').map(parse_date_pmid_line).cache()
pmid_gene_year = pmid_year.join(pmid_gene)

gene_year_1 = pmid_gene_year.map(lambda (pmid, (gene, year)): ((gene,year),1))
gene_year_counts = gene_year_1.reduceByKey(lambda x,y: x+y)
counts_gene_year = gene_year_counts.map(lambda ((gene, year), count): (count, (gene, year)))
sorted_counts_gene_year = counts_gene_year.sortByKey(ascending=False);
scgy = sorted_counts_gene_year.collect()
#blah
{% endhighlight %}

##### Python SQL #####

{% highlight python %}
from pyspark.sql import *
sqlContext = SQLContext(sc)
# get the gene_id -> pubmed mapping
gene2pubmed = sc.textFile("/Users/pkerp/projects/genbank/data/gene2pubmed").filter(lambda x: x[0] != '#').map(lambda x: x.split('\t')).map(lambda p: Row(taxid=int(p[0]), geneid=int(p[1]), pmid=int(p[2])))
schemaGene2Pubmed = sqlContext.inferSchema(gene2pubmed)
schemaGene2Pubmed.registerTempTable("gene2pubmed")
# the dates were obtained by doing entrez queries and stored as
# table of the form "date pmid"
def parse_date_pmid_line(line):
    # extract the date information and the pmid
    # and return it as tuple
    parts = line.split()
    # the year is in %Y/%m/%d format
    year = int(parts[0].split('/')[0])
    pmid = int(parts[1])
    return (pmid, year)


pmid_year = sc.textFile('/Users/pkerp/projects/genbank/data/pmid_year.ssv').map(parse_date_pmid_line).map(lambda p: Row(pmid=p[0], year=p[1]))
schemaPmidYear = sqlContext.inferSchema(pmid_year)
schemaPmidYear.registerTempTable('pmid_year')
geneid_year = sqlContext.sql('select geneid, year from pmid_year, gene2pubmed where pmid_year.pmid = gene2pubmed.pmid')
geneid_year.registerTempTable('geneid_year')
result = sqlContext.sql('select geneid, year, count(*) as cnt from geneid_year group by geneid, year order by cnt desc')
x = result.collect()
#blah
{% endhighlight %}
