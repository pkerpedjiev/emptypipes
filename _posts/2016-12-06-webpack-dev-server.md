---
layout: post
title:  "Fast ES6 Development Using webpack-dev-server"
description: "How to speed up webpack when called from gulp: switching from gulp and webpack-stream to webpack-dev-server reduces the rebuild time of a 5500 line javascript project from 11s to <2s"
tags: javascript es6
thumbnail: /img/2016-12-06-webpack-dev-server.png
---

#### Summary

<i>Switching from `gulp` and `webpack-stream` to `webpack-dev-server` reduces
the rebuild time for a 5500-line javascript project from ~11s to ~1.3 seconds.</i>

#### Details

Whenever I create a javascript project, I do it using a very uniform directory
structure and configuration, as outlined in a previous [blog
post](http://emptypipes.org/2016/03/02/es6-module/). With this configuration,
all the source files are transpiled using `babel` and bundled using the
`webpack-stream` module as part of a step in the build process managed by
`gulp`.

This is great because then I can run `gulp serve` and have it recompile and
reload the resulting web page whenever I make any changes to the source code in
`app/scripts`.

This works like a charm until the source code and dependencies get to any
appreciable size. As more and more files need to be transpiled, the process
gets slower and slower until at about ~10 seconds, it starts to get annoying:

{% highlight shell %}
[BS] 3 files changed (main.js, playground.js, worker.js)
[08:31:20] Finished 'scripts' after 11 s
{% endhighlight %}

So how can this be sped up? Easy, stop using gulp and webpack-stream and
switch to the...

##### [Webpack dev server](https://webpack.github.io/docs/webpack-dev-server.html)

The webpack dev server runs in its own terminal and watches the source files
listed in its config file (`webpack.config.js`). When one of the files changes, it
recreates the output files specified in its config and reloads the web page. I
run it using the following command line:

{% highlight shell %}
webpack-dev-server --content-base app --display-exclude --profile --inline | grep -v "\\[\\d*\\]"
{% endhighlight %}

The grep at the end is to filter out some of the [overly] verbose output that webpack
produces. So how long does it take to regenerate the code when a source file is changed? 

{% highlight shell %}
Version: webpack 1.12.15
Time: 1296ms
chunk    {0} main.js (main) 4.61 MB
{% endhighlight %}

This is about 10x faster than the configuration using gulp and webpack-stream.

The resulting web page can be found at
`http://localhost:8080/index.html`

The only thing I needed
to change in my `webpack.config.js` file was to add `output: { publicPath:
'/scripts/'}`.  This is because my `index.html` file loads the compiled scripts
from the `scripts` directory:

{% highlight html %}
<script src='scripts/playground.js'></script>
{% endhighlight %}

Below is the entire `webpack.config.js` for this project. Notice that there's
multiple different targets being built including a worker script that can be
used in a web worker to do compute intensive tasks off of the main UI thread.

Other notable sights include the `devtool: "cheap-source-map"` entry to make sure
we can easily see the source code when debugging.


{% highlight json %}
var path = require('path');
var webpack = require('webpack');

module.exports = {
  context: __dirname + '/app',
  entry: {
      playground: ['./scripts/playground.jsx'],
      main: ['./scripts/main.jsx'],
      worker: ['./scripts/worker.js']
  },
  devtool: "cheap-source-map",
  output: {
    path: __dirname + '/build',
    publicPath: '/scripts/',
    filename: '[name].js',
    libraryTarget: 'umd',
    library: '[name]'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        //exclude: /node_modules/,
        include: [path.resolve(__dirname, 'app/scripts')],
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react']
        }
      }, {
        test: /\.css$/,
        loader: 'style!css'
      }
    ],
    postLoaders: [
        {
            include: path.resolve(__dirname, 'node_modules/pixi.js'),
            loader: 'transform?brfs'
        }
    ],
    externals: {

               },
    resolve: {
      extensions: ['.js', '.jsx']
    }
  }
};
{% endhighlight %}
