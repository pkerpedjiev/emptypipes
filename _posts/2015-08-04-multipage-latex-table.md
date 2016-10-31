---
layout: post
title:  "Multi-Page Vertically Centered Latex Table"
description: "How to create a latex table which spans multiple pages and has the text centered vertically in the cells."
tags: latex
---

Say we wanted to create a latex table that had vertically centered text.  Say
furthermore that our table was very long and we wanted it to automatically span
multiple pages.

Then we might imagine that the table would have a heading...
<br><br>
<img src="/img/multipage_latex_table/first_page_start.png" width="400px" />
<br><br>
Followed by an ending at the end of the page...
<br><br>
<img src="/img/multipage_latex_table/first_page_end.png" width="400px" />
<br><br>
Which would be continued at the start of the next page...
<br><br>
<img src="/img/multipage_latex_table/second_page_start.png" width="400px">
<br><br>
Such a table can be created using the snippet of code below. It uses the
`array` package for vertically centering the cell text and the `longtable`
package for automatically breaking up the table across multiple pages.

{% highlight latex %}
\usepackage{array}
\usepackage{longtable}

\begin{longtable}{ >{\centering\arraybackslash} m{1cm} >{\centering\arraybackslash} m{4cm} >{\centering\arraybackslash} m{4cm}}
PDB ID & Length & Coarse Grain Structure \\
\hline
\endfirsthead

\multicolumn{3}{c}%
{ {\bfseries \tablename\ \thetable{} -- continued from previous page} } \\
\hline PDB ID & Length & Coarse Grain Structure \\
\hline 
\endhead

\hline \multicolumn{3}{|r|}{{Continued on next page}} \\ \hline
\endfoot

\hline \hline
\endlastfoot
1GID & 158 & \includegraphics[width=4cm]{gfx/cgs/1GID_A.png} \\
3D0U & 192 & \includegraphics[width=4cm]{gfx/cgs/3D0U_A.png} \\
4GXY & 192 & \includegraphics[width=4cm]{gfx/cgs/4GXY_A.png} \\
\end{longtable}

{% endhighlight %}

Stack Exchange References:

1. [How to vertically-center the text of the cells?](http://tex.stackexchange.com/questions/7208/how-to-vertically-center-the-text-of-the-cells)
2. [Make a table span multiple pages](http://tex.stackexchange.com/questions/26462/make-a-table-span-multiple-pages)
