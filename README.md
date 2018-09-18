# How to install ?

Pre-note : This package uses `module.exports`, and therefore is mostly
compatible with Node.js by default.

1. Run `npm install promise-composer`
2. Include the Promise Composer Object (PCO) with the following code :

```javascript
var PCO = require('promise-composer');
```

# What does it do ?

Promise Composer is a small JS library to use conditional
composers in Promises to be able to handle potential errors into your code
directly inside of promises.

I wrote it since I was tired of checking type errors manually using the
same old `if/else` or `switch/case` methods, so instead of writing :

```javascript
if (myCheckingFunc(value) && myOtherFunc(value)) {
  doStuff()
} else {
  doOtherStuff()
}
```

You could just write :

```javascript
Promise.resolve(value)
  .then(PCO.myCheckingFunc)
  .then(PCO.myOtherFunc)
  .then(doStuff)
  .catch(doOtherStuff)
```

It still is pretty minimal, but I do think this can be of help to ensure a
layer of dynamical verification without having to cope with `if/else` forests
or huge monolithic `switch/case` blocks.

# Create an assertion

To create an assertion function, you only have to use the `PCO.assert` function.

```javascript
function assertInteger(x) { return typeof x === "number" && Number.isInteger(x) }
const isInteger = (x) => PCO.asser(x, assertInteger)

Promise.resolve(15)
  .then()
```

# Common assertion functions

`PCO.isset`
Check if an element isn't undefined

`PCO.exists`
Check if an element isn't undefined and is non-null

`PCO.fullString`
Check if an element is a non-empty Sstring (trims whitespaces)

`PCO.isObject`
Check if an element is a non-array Object

`PCO.isArray`
Check if an element is a valid Array

`PCO.isNumber`
Check if an element is a valid Number

`PCO.isInteger`
Check if an element is a valid Integer
