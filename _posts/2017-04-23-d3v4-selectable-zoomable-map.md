---
layout: post
title:  "D3v4 event filtering example"
description: "To prevent events from affecting certain elements, certain behaviors (such as zoom) can be filtered so that their events ignore specified elements."
tags: javascript d3.js
thumbnail: 
---

Differences between v3 and v4

* The brush keeps a constant width or height when the shift key is pressed so we can't use that for selection
    - Had to fork d3-brush to remove its default shift key behavior
* How the brush is called and cleared on keydown
* Whether a node is fixed is specified by the `.fx` and `.fy` parameters. This eliminates the need to set the
  `.fixed` parameter on each node.
* Clear the selection when someone clicks on the background, this fixes the issue in the previous version
 where zooming would clear the selection
