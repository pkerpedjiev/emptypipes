---
layout: post
title:  "Gene Popularity in GenBank"
categories: genbank bioinformatics
---
The Nation Center for Biotechnology Information (NCBI) maintains an enormous
amount of biological data and provides it all to the public for no cost as a
collection of databases. One of the most popular is GenBank, which contains
information about annotated genes. Whenever a researcher annotates
(characterizes) a gene, they create an entry in the database which describes the
gene. Consider the [gene
p53](http://www.ncbi.nlm.nih.gov/gene/7157). This gene encodes a tumor
suppressor protein, the absence of which allows many cancers to proliferate. By
looking at its entry in GenBank, we can immediately find out its full name
(tumor protein p53), which organism this entry corresponds to (Human), aliases
(BCC7, LFS1, TRP53), a short description and a whole host of other technical
information. Amongst this slew of description and data is the section on
references. This section contains a list of papers which have referenced this
gene. In other words, the authors of the paper have performed an experiment
which involved this particular gene. In the case of p53, there are 6622
references which mention it. This got me wondering, which are the most popular
genes? Which genes have been scrutinized most heavily? To answer, this, I
[downloaded the table](ftp://ftp.ncbi.nlm.nih.gov/gene/DATA/) which contains 
the reference information from GenBank, and performed some rudimentary analysis,
yielding the following table of the top 10 most popular genes, as measured
by the number of times they have been cited:

<table>
    <tr>
        <th>Rank</th>
        <th>Gene ID</th>
        <th>Gene Symbol</th>
        <th>Description</th>
        <th>Type</th>
        <th># of Citations</th>
    </tr>
    <tr>
        <td>1</td>
        <td><a href="http://www.ncbi.nlm.nih.gov/gene/?term=7157">7157</a></td>
        <td>TP53</td>
        <td>tumor protein p53</td>
        <td>protein-coding</td>
        <td>6622</td>
    </tr>
    <tr>
        <td>2</td>
        <td><a href="http://www.ncbi.nlm.nih.gov/gene/?term=7124">7124</a></td>
        <td>TNF</td>
        <td>tumor necrosis factor</td>
        <td>protein-coding</td>
        <td>4436</td>
    </tr>
    <tr>
        <td>3</td>
        <td><a href="http://www.ncbi.nlm.nih.gov/gene/?term=14910">14910</a></td>
        <td>Gt(ROSA)26Sor</td>
        <td>gene trap ROSA 26, Philippe Soriano</td>
        <td>ncRNA</td>
        <td>4350</td>
    </tr>
    <tr>
        <td>4</td>
        <td><a href="http://www.ncbi.nlm.nih.gov/gene/?term=31271">31271</a></td>
        <td>w</td>
        <td>white</td>
        <td>protein-coding</td>
        <td>3503</td>
    </tr>
    <tr>
        <td>5</td>
        <td><a href="http://www.ncbi.nlm.nih.gov/gene/?term=7316">7316</a></td>
        <td>UBC</td>
        <td>ubiquitin C</td>
        <td>protein-coding</td>
        <td>3445</td>
    </tr>
    <tr>
        <td>6</td>
        <td><a href="http://www.ncbi.nlm.nih.gov/gene/?term=348">348</a></td>
        <td>APOE</td>
        <td>apolipoprotein E</td>
        <td>protein-coding</td>
        <td>3422</td>
    </tr>
    <tr>
        <td>7</td>
        <td><a href="http://www.ncbi.nlm.nih.gov/gene/?term=1956">1956</a></td>
        <td>EGFR</td>
        <td>epidermal growth factor receptor</td>
        <td>protein-coding</td>
        <td>3410</td>
    </tr>
    <tr>
        <td>8</td>
        <td><a href="http://www.ncbi.nlm.nih.gov/gene/?term=22059">22059</a></td>
        <td>Trp53</td>
        <td>transformation related protein 53</td>
        <td>protein-coding</td>
        <td>3273</td>
    </tr>
    <tr>
        <td>9</td>
        <td><a href="http://www.ncbi.nlm.nih.gov/gene/?term=7422">7422</a></td>
        <td>VEGFA</td>
        <td>vascular endothelial growth factor A</td>
        <td>protein-coding</td>
        <td>3146</td>
    </tr>
    <tr>
        <td>10</td>
        <td><a href="http://www.ncbi.nlm.nih.gov/gene/?term=3569">3569</a></td>
        <td>IL6</td>
        <td>interleukin 6</td>
        <td>protein-coding</td>
        <td>3120</td>
    </tr>
</table>

There's nothing too surprising in the list. The first two entries are genes
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

The aptly named number 5 entry, Uniquitin, is involved in the degradation of proteins.
As its name suggests, it's performs a constitutive (ever present) and extremely 
important process in cells, thus making it a worthy holder of the #5 title. The number
6 spot belongs to apolipoprotein E, which is involved in the transport
of various lipids into the lymph system. It's associated with heart disease and Alzheimers
and thus worthy of heavy scrutiny. After it come the epidermal growth factor receptor
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
