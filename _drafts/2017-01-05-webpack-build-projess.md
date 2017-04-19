---
layout: post
title:  "Fast ES6 development using webpack-dev-server"
description: "How to speed up webpack when called from gulp: switching from gulp and webpack-stream to webpack-dev-server reduces the rebuild time of a 5500 line javascript project from 11s to <2s"
tags: javascript es6
---

```
webpack
4.5M Jan  5 13:42 playground.js
```

```
webpack --optimize-minimize
1.5M Jan  5 13:44 playground.js
```

```
webpack --optimize --optimize-dedupe

1.5M Jan  5 13:41 playground.js
```

```
NODE_ENV=production webpack -p
1.5M Jan  5 13:45 playground.js
```
