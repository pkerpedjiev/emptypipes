---
layout: post
title:  "D3v4 event filtering example"
description: "To prevent events from affecting certain elements, certain behaviors (such as zoom) can be filtered so that their events ignore specified elements."
tags: javascript d3.js
thumbnail: 
---

Differences between v3 and v4

* The brush keeps a constant width or height when the shift key is pressed so we can't use that for selection
* How the brush is called and cleared on keydown
