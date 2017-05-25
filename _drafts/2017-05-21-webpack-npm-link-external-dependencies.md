---
layout: post
title:  "Upgrading a Webpack 2 and using externals"
description: "This post describes errors I encountered in including a project containing external dependencies into a parent project using npm link."
tags: javascript d3.js
thumbnail: /img/2017-05-21-webpack-npm-link-external-dependencies.png
---

Over the past week I've been trying to move a project (let's call it Foo) from
Webpack to Webpack2. One of its dependencies, another project of mine, is
called Bar. Bar is its own package and can be used as a standalone library.  In
this case, however, it is a dependency of the application Foo. Foo and Bar 
both require React, ReactDOM and ReactBootstrap. 

When I want to use Bar within a webpage on its own, I'd like to include React,
ReactDOM and ReactBootstrap separately so that they can be quickly pulled from
a CDN rather than having them be part of the bundle. With webpack, this is
easily accomplished using `externals`.

Initially, I had these dependencies defined in `webpack.conf.js` for Bar:

```javascript
    externals: {
      "pixi.js": "PIXI",
      "react" : "React",
      "react-dom": "ReactDOM",
      "react-bootstrap": "ReactBootstrap"
  },
```

Now when I loaded Bar in a webpage along with the `<script>` tags for React,
ReactDOM, ReactBootstrap and PIXI. Everything would work just fine.

But when I included Bar [which is actually the [higlass
library](https://github.com/hms-dbmi/higlass) into Foo using `npm link ../Foo`
errors started appearing:

```
ERROR in ../higlass/dist/scripts/hglib.js
Module not found: Error: Can't resolve 'ReactDOM' in '/Users/pkerp/projects/higlass/dist/scripts'
 @ ../higlass/dist/scripts/hglib.js 1:99-118
 @ ./src/HGViewer/HGViewer.jsx
 @ ./src/views/Main/routes.js
 @ ./src/routes.js
 @ ./src/app.js
 @ multi (webpack)-dev-server/client?http://localhost:8080 ./app.js
 ```

After a bit of googling spanning topics from 'npm link externals', to 'webpack
peer dependencies' to any other relevant terms I could think of I stumbled upon
[Webpack's documentation on
externals](https://webpack.js.org/configuration/externals/). It quite clearly
states that the syntax I was using for externals (`"react-dom": "ReactDOM"`)
indicates that the library `react-dom` can be found in the global `ReactDOM`.
When we include Bar as a dependency and compile it with Webpack, no scripts
have been loaded so `ReactDOM` does not exist as a global. What I needed to do
instead was to specify another way that the external libraries can be
available:

```
  externals: {
      "pixi.js": {
        commonjs: "pixi.js",
        commonjs2: "pixi.js",
        amd: "pixi.js",
        root: "PIXI"
      },
      "react" : {
        commonjs: "react",
        commonjs2: "react",
        amd: "react",
        root: "React"
      },
      "react-dom": {
        commonjs: "react-dom",
        commonjs2: "react-dom",
        amd: "react-dom",
        root: "ReactDOM"
      },
      "react-bootstrap": {
        commonjs: "react-bootstrap",
        commonjs2: "react-bootstrap",
        amd: "react-bootstrap",
        root: "ReactBootstrap"
      }
  },
```

That seemed to fix the errors in compilation. At this point Foo does not
declare anything as external. This led to a couple more errors.

```
index.js:289 Uncaught TypeError: Cannot read property 'Component' of undefined
    at _get_original__ (index.js:289)
    at _get__ (index.js:253)
    at Object.<anonymous> (index.js:158)
    at __webpack_require__ (bootstrap ae40f91…:19)
    at Object.<anonymous> (App.js:7)
    at Object.defineProperty.value (App.js:102)
    at __webpack_require__ (bootstrap ae40f91…:19)
    at Object.<anonymous> (app.js:15)
    at __webpack_require__ (bootstrap ae40f91…:19)
    at Object.<anonymous> (hglib.js:13)
```

And...

```
Uncaught Error: locals[0] does not appear to be a `module` object with Hot Module replacement API enabled. You should disable react-transform-hmr in production by using `env` section in Babel configuration. See the example in README: https://github.com/gaearon/react-transform-hmr
    at proxyReactComponents (index.js:51)
    at Object.<anonymous> (App.js:47)
    at Object.defineProperty.value (App.js:102)
    at __webpack_require__ (bootstrap ae40f91…:19)
    at Object.<anonymous> (app.js:15)
    at __webpack_require__ (bootstrap ae40f91…:19)
    at Object.<anonymous> (hglib.js:13)
    at __webpack_require__ (bootstrap ae40f91…:19)
    at module.exports (bootstrap ae40f91…:65)
    at app.js:79
```

Both appear to be associated redbox-react and both were fixed by removing `react-hmre` from `.babelrc`:

```javascript
{
  "presets": ["es2015", "stage-0", "react"],
  "env": {
    "development": {
      //"presets": ["react-hmre"]
    },
    "production": {
      "presets": []
    },
    "test": {
      "presets": []
    }
  }
}
```

Finally, the web page loaded but the styling was missing. To fix this I had to add a loader
for css files so that I could do `import styles from './styles.module.css'` within my React
components:

```javascript
      {
          test: /\.css$/,
          use: ExtractTextPlugin.extract({
              use: [
                  {
                      loader: 'css-loader',
                      options: {
                          modules: true,
                          localIdentName: '[path][name]_[local]--[hash:base64:8]',
                      },
                  }
              ]
          })

      }
```

This concluded the process of making the library (Bar) use externals while the 
application (Foo) includes the library and having it all built using Webpack 2. For
those interested, here is the entire webpack.js file:

```javascript
var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

const root    = path.resolve(__dirname);
const src     = path.join(root, 'src');

module.exports = {
  context: __dirname + '/src',
  entry: {
      app: ['./app.js']
  },
  devtool: "cheap-source-map",
  output: {
    path: __dirname + '/build',
    publicPath: '/',
    filename: '[name].js',
    libraryTarget: 'umd',
    library: '[name]'
  },
  resolve: {
    alias: {
      'css': path.join(src, 'styles'),
      'containers': path.join(src, 'containers'),
      'components': path.join(src, 'components'),
      'utils': path.join(src, 'utils'),
      'src': src,
      'styles': path.join(src, 'styles')
    }
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        //exclude: /node_modules/,
        include: [path.resolve(__dirname, 'src'), path.resolve(__dirname, 'test')],
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                ['es2015', { modules: false }],
                'react',
                'stage-0'
              ]
            }
          }
        ]
      }
      ,
      {
          test: /\.css$/,
          use: ExtractTextPlugin.extract({
              use: [
                  {
                      loader: 'css-loader',
                      options: {
                          modules: true,
                          localIdentName: '[path][name]_[local]--[hash:base64:8]',
                      },
                  }
              ]
          })

      },
          { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' }

    ],
    noParse: [
        /node_modules\/sinon\//,
    ]
  },
  externals: {
  },
  plugins: [
    new webpack.DefinePlugin({
          'process.env': {
            'NODE_ENV': JSON.stringify('production')
          }
    }),
    new webpack.IgnorePlugin(/react\/addons/),
    new webpack.IgnorePlugin(/react\/lib\/ReactContext/),
    new webpack.IgnorePlugin(/react\/lib\/ExecutionEnvironment/),
    new ExtractTextPlugin("styles.css")
    /*
    ,
    new BundleAnalyzerPlugin({
        analyzerMode: 'static'
    })
    */
  ]
};
```
