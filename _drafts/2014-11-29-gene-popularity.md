---
layout: post
title:  "Gene Popularity in GenBank"
tags: genbank bioinformatics
---
The Nation Center for Biotechnology Information (NCBI) maintains an enormous
amount of biological data and provides it all to the public for no cost as a
collection of databases. One of the most popular is GenBank, which contains
information about annotated genes. Consider the [gene
p53](http://www.ncbi.nlm.nih.gov/gene/7157), which encodes a tumor
suppressor protein, the absence of which allows many cancers to proliferate. By
looking at its entry in GenBank, we can immediately find out its full name
(tumor protein p53), which organism this entry corresponds to (Human), aliases
(BCC7, LFS1, TRP53), a short description and a whole host of other technical
information. 

Among the information provided with each entry is a section which contains a
list of papers which have referenced this gene. In a sense, each reference 
is a paper which has contributed to the dialogue or discussion
surrounding the function of this little piece of DNA (or RNA). This can 
be viewed as a proxy for how 'popular'  it is. This got me
wondering, which are the most popular genes? Which genes
have been scrutinized most heavily? 

To answer, this, I [downloaded the
table](ftp://ftp.ncbi.nlm.nih.gov/gene/DATA/) which contains the reference
information from GenBank, and performed some rudimentary analysis, yielding the
following table of the top 20 most popular genes, as measured by the number of
times they have been cited:

<div id="gene-counts-chart"></div>
<link rel="stylesheet" href="/css/d3_bar_chart.css">
<script src="http://d3js.org/d3.v3.min.js"></script>
<script src="js/d3_bar_chart.js"></script>
 <script>renderGeneCountsChart();</script>

As some of these names were meaningless to me, I looked them up and summarized
their descriptions in the list below:

* TP53 - sdfsd

There's nothing too surprising in the list. The first two entries (p53 and TNF) are genes
associated with cancer which have been extensively studied due to their
deleterious effects on human health. The third, ROSA 26, is, according to
Wikipedia "a locus used for constitutive, ubiquitious gene expression in mice."
Essentially, it's a place where one would clone in a gene that needs to be
expressed all the time. It's very useful for putting new genes in mice and
seeing what happens. The fourth, w or White Gene, was the 'first sex-linked
mutation every discovered in the fruit fly D. melanogaster'.  Its inheritance
pattern does not correspond to what one would expect according to the Mendelian
laws on inhertance. This is because it is located on one of the sex chromosomes
and has a different chance of being passed from male to female. It has
historical cachet and didactic value, but is neither deadly nor particular useful.

Among the remaining entries are a variety o

The number 5 entry, Uniquitin, is involved in the degradation of proteins.
As its name suggests, it performs a constitutive (ever present) and extremely 
important process in cells. The number
6 spot belongs to apolipoprotein E, which is involved in the transport
of various lipids into the lymph system. It's associated with heart disease and Alzheimers
and thus an important target to study when trying to understand how these diseases function
and what we can do to battle them. Next comes the epidermal growth factor receptor
and the vascular endothelial growth factor, two proteins which are involved in signalling
when cells should divide and new tissue should grow. As expected, they are associated
with various cancers and other diseases. Rounding off the list is interleukin-6, a protein
involved in inflammation and immune response. Anything having to do with the immune system
tends to be important due to its relevance in fighting off infection and battling disease,
and IL-6 especially so due to its direct effect in stimulating an immune response. 

As a whole this list tends to be biased toward disease-related genes, particularly cancer.
The results are neither surprising nor particularly insightful. Nevertheless, they do
provide a glimpse into what has received the most attention in the world of molecular 
genetics in the past century.
