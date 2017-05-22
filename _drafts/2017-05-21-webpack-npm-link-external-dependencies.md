* Had externals as an array ["react", "react-dom", ...]
* Loading the externals as scripts leads to error:

```
Uncaught TypeError: Cannot read property 'Component' of undefined
    at Object.<anonymous> (react-draggable.js:2115)
    at Object.module.exports (react-draggable.js:2245)
    at __webpack_require__ (react-draggable.js:30)
    at Object.module.exports (react-draggable.js:100)
    at __webpack_require__ (react-draggable.js:30)
    at Object.defineProperty.value (react-draggable.js:59)
    at __webpack_require__ (react-draggable.js:30)
    at react-draggable.js:50
    at react-draggable.js:53
    at webpackUniversalModuleDefinition (react-draggable.js:3)
```

Changed externals to:

*
