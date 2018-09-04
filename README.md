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
new Promise((resolve, reject) => resolve(value))
  .then(PCO.myCheckingFunc)
  .then(PCO.myOtherFunc)
  .then(doStuff)
  .catch(doOtherStuff)
```

It still has room for improvement, but I do think it

# Common assertion functions

`PCO.isset`
Checks if an element isn't undefined

`PCO.exists`
Checks if an element isn't undefined and is non-null

`PCO.fullString`
Checks if an element is a non-empty string (trims whitespaces)
