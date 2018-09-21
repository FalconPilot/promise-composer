![Tests coverage](https://github.com/FalconPilot/promise-composer/blob/master/badges/tests.png|alt=Test_coverage)

# How to install ?

1. Run `npm install promise-composer`
2. Include the Promise Composer Object (PCO) with something like :

```javascript
var PCO = require('promise-composer');
```

# What does it do ?

Promise Composer is a small JS library that gives some utility tools and
functions to help asynchronous processes to dynamically check/validate data.

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

To create a custom assertion function, you only have to use the `PCO.assert`
function.

```javascript
function validateObject(x) {
  return Array.isArray(x)
    && x.length > 3
    && x.length < 9
}

Promise.resolve(15)
  .then(x => PCO.assert(x, validateObject))
  .then(doOtherStuff)
  .catch(computeError)
```

# Common assertion functions

• `PCO.isset`
Check if an element isn't undefined

• `PCO.exists`
Check if an element isn't undefined and is non-null

• `PCO.fullString`
Check if an element is a non-empty Sstring (trims whitespaces)

• `PCO.isObject`
Check if an element is a non-array Object

• `PCO.isArray`
Check if an element is a valid Array

• `PCO.isNumber`
Check if an element is a valid Number

• `PCO.isInteger`
Check if an element is a valid Integer

# Multiple assertions

If you need multiple validations at once, you can use two important functions :

• `PCO.any`
This functions acts as an "or" operator. It will proceed if any of the
given assertions is true.

*Example*
```javascript
Promise.resolve("Coucou")
  .then(x => PCO.any(x, [PCO.fullString, PCO.isset]))
  .then(doStuff)
  .catch(computeError)

// This example should not trigger the .catch() block
```

• `PCO.all`
This function acts as an "and" operator. It will proceed if all of the
given assertions are true.

*Example*
```javascript
Promise.resolve(15)
  .then(x => PCO.all(x, [PCO.fullString, PCO.isset]))
  .then(doStuff)
  .catch(computeError)

// This example should trigger the .catch() block !
```

*Important !*

`PCO.any` and `PCO.all` both require as a second argument an array of
assertions. You can use standard PCO assertion functions as well as
custom assertion functions (this might be useful for dataset validation
for instance).

# Verify assertion on multiple values

You can use `PCO.traverse` using an array of values instead of a single value
to check every value inside the array with your assertion.

*Example*
```javascript
Promise.resolve(["foo", "bar", null])
  .then(x => PCO.traverse(x, PCO.exists))
  .then(doStuff)
  .catch(computeError)

// This exemple should trigger the .catch() block !
```
