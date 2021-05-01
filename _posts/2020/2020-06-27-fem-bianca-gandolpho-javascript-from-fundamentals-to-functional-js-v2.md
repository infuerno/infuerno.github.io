---
layout: post
title: "Frontend Masters: Bianca Gandolpho Javascript from Fundamentals to Functional JS v2"
---

m/bgando/exercises-fundamentals-2-functional

### Other Courses

- [Functional-Light JavaScript v3](https://frontendmasters.com/courses/functional-javascript-v3/) by Kyle Simpson
- [Asynchronous Programming with JavaScript](https://frontendmasters.com/courses/advanced-async-js/) by Jafar Husain
  Dr Bullion

### What is Functional Programming

- OO Programming = Nouns - easier to think of the world in terms of nouns
- Functional Programming = Verbs - think in terms of actions and applying them to the nouns - hence use a lot of functions, pass functions to functions, return functions from functions
- Different to Functional Reactive Programming = functional style with streams
- Instead think [Lodash](https://lodash.com/), [Underscore](https://underscorejs.org/) and [Ramda](https://ramdajs.com/) (more hardcore version of the other two)
- Pure functions - Input, Output and no side effects - very testable, but most code requires side effects e.g. web programmming with DOM manipulation. Can go crazy and sacrifice readability if not careful
- Won't cover monads, monoids, functors etc
- BUT functional programming can help with e.g. off by one errors when using loops

## Objects and Arrays

### Property access

```javascript
let person = {};
person.name = "Mrs White";

let person = {
  "name": "Mrs White"; // don't need the quotes around name since a simple string
}

let who = person.name; // who = "Mrs White" - the string primitive value is stored by VALUE

person.name = "Mr White"; // who STILL = "Mrs White"
```

- **primitive** - string, number, boolean, null, undefined - passed by value
- **non primitive** - object, array, function, promise - passed by reference

```javascript
let person2 = person;
```

- Any changes to `person.name`, will also apply to `person2.name`. Therefore recommended that you don't mutate your data structures, but instead copy them.

### Arrays

```javascript
let person = [];
person.name = "Mrs White";

let who = person.name; // arrays can still have properties since arrays ARE objects
typeof person === "object"; // true
```

- The only difference between objects and arrays is that arrays have some cool methods. e.g. `array.push`, `array.pop`, `array.length`
- To check if an object is an array use `Array.isArray(person)`
- An array is **different** in that it has a `.length` **property** which is computed as numerical indicies are added (different to properties)
- With numerical indicies there is an order e.g. items can be reversed, unlike properties on a object which are not ordered.
- Application level code doesn't necessarily use properties on arrays very often BUT libraries use them a lot.

### Dot vs Bracket

```javascript
person[0] = "I was not in the Billiards room";
```

- `0` is simply a property, but specified using bracket notation instead of dot notation (well, its a bit more than that, e.g. effect is different if person is just an object object)
- Can't use `person.0` because `0` is not a string. THEREFORE need to use the brackets. Have to use brackets to access properties whenever not a simple string.

```javascript
person[plea] = "I would never"; // ReferenceError: plea is not defined
```

- The dot notation coerces `name` in `person.name` to a string (will only successfully coerce certain strings e.g. `0` will not be coerced to `"0"`). With bracket notation this needs to be **explicit** e.g. `person["plea"] = "I would never"`

```javascript
person[
  function () {
    return 3;
  }
] = false; // simply evalulates function() {} as a string
person[
  (function () {
    return 3;
  })()
] = false; // need to actually call the function to evaluate as the result
```

- Use `Object.keys(person)` to get a list of properties

### ES6 Destructuring

Saves repetition in variable declarations. Requires a target and a source.

#### Array destructuring

```javascript
// variable declaration
const [first, second] = [true, false];
let [first, second] = [true, false];

// assignment
[first, second] = [true, false];

// omit values
[a, , b] = [1, 2, 3]; // a = 1, b = 3

// spread operator - gathers all remaining values
[a, ...b] = [1, 2, 3]; // a = 1, b = [2,3]

// swap variables easily without temp
let a = 1,
  b = 2;
[a, b] = [b, a]; //a = 2, b = 1

// advanced deep arrays
let [a, [b, [c, d]]] = [1, [2, [[[3, 4], 5], 6]; // a = 1, b = 2, c = [[3, 4], 5], d = 6
```

Creating variables on the left = the target, assigning them values on the right = the source. IMPORTANT. Need the brackets on the left **and** right. Matches simply on order (with arrays order is everything!).

#### Object destructuring

Objects have no sense of ordering. Destructuring matches on name.

```javascript
// variable declaration
const {first, second} = {first: 1; second: 2};
let {first, second} = {first: 1; second: 2};

// assignment
{first, second} = {first: 1; second: 2};

// use different variable names
let {first: x, second: y} = {first: 1, second: 2}; // assigns to x and y instead

// careful
let a, b;
{a, b} = {a: 1, b: 2}; // doesn't work
({a, b} = {a: 1, b: 2}); // works ok. starting with { defines block scope, so need to evaluate with ()

```

See: https://gist.github.com/mikaelbr/9900818

## .forEach() Function

Iterates over each value and executes the supplied function. **Does not return anything.**

```javascript
// a property speak which is a function
function createSuspect(name) {
  return {
    name: name,
    color: name.split(" ")[1],
    speak: function () {
      console.log("my name is ", name);
    },
  };
}

// ES6 speak is defined slightly differently
function createSuspect(name) {
  return {
    name: name,
    color: name.split(" ")[1],
    speak() {
      console.log("my name is ", name);
    },
  };
}

let names = ["Miss Scarlet", "Colonel Mustard", "Mr Black"];
let suspectList = [];

// native forEach(), method on the array, which requires prototypes, this etc, much more advanced
names.forEach((n) => suspectsList.push(createSuspect(n)));

// underscore.js each(), easier to implement since the array is passed in
_.each(names, (n) => suspectsList.push(createSuspect(n)));

// _.each() implementation
// expectation is that callback will be called 3 arguments:
// item, then index (or property name in the case of an object), then the whole list
// i.e. callback(item, i, list);
const _ = {};

_.each = function (list, callback) {
  if (Array.isArray(list)) {
    for (let i = 0; i < list.length; i++) {
      callback(list[i], i, list);
    }
  } else if (typeof list === "object") {
    for (let key in list) {
      callback(list[key], key, list);
    }
  }
};
```

## .map() Function

Similar to `.forEach()`, but returns a new array of values by appling the given transformation function, the **iterator**, to each item in the supplied list. Again the arguments supplied to the iterator are item, index, list in the case of an array (and value, key, object in the case of an object). Always returns a list of the same size.

```javascript
const weapons = ["candlestick", "lead pipe", "revolver"];
const makeBroken = function (item) {
  return `broken ${item}`;
};
console.log(weapons.map(makeBroken)); // ["broken candlestick", "broken ..." etc]

const _ = {};

// implementation using for loop
_.map = function (list, callback) {
  let result = [];
  if (Array.isArray(list)) {
    for (let i = 0; i < list.length; i++) {
      result.push(callback(list[i], i, list));
    }
  } else if (typeof list === "object") {
    for (let key in list) {
      result.push(callback(list[key], key, list));
    }
  }
  return result;
};

// implementation using previously defined _.each()
_.map = function (list, callback) {
  let result = [];
  _.each(list, function (item, i, list) {
    result.push(callback(item, i, list));
  });
  return result;
};
```

## .filter() Function

Similarily to `.map()`, can reuse `.each()` to implement.

## Functions In Depth

- definition vs invocation
- parameter vs arguments
  - parameters are variables and don't have values e.g. `function square(x) { ... }`
  - arguments have values e.g. `square(2)`
- function declaration vs function expression
  - function declaration = a named function, which are invoked using the function name e.g. `function square(x) { return x*x; }`. These are **hoisted** to the top of other code.
  - function expressions are assigned to variables e.g. `let square = function(x) { return x*x;}` and invoked using the variable name. These are not available prior to the line on which the variable is assigned. However, they are useful for:
    - closures
    - arguments to other functions
    - Immediately Invoked Function Expressions (IIFE)
- side effect = anything reaching beyond the curly braces and changes something - functional programming tries to minimise side effects

### ES6 Arrow Functions

All functions have a keyword `this` which gets bound at call time. However arrow functions do not have a seperate value `this` and instead reach into the parent scope and grab the value of `this` from there. Replaces the need for `.bind`, `let that = this` etc.

Arrow function don't have their own value for the `arguments` keyword, but rather yield the outer "normal" functions value for `arguments`.

Arrow functions auto `return` in certain circumstances, but best to explicitly `return` to make sure.

### Arguments

The keyword `arguments` available in most functions (not arrow functions) is an array-like object (but not a proper array) set to all the arguments passed in whether bound to parameters or not. To transform it into a proper array, use `Array.prototype.slice.call(arguments)` in ES5, or `Array.from()` in ES6 e.g. `Array.from(arguments)`.

## Scope

- `var` uses function scope (lexical function scope = static scope)
- `let` and `const` (ES6) use block scope (can just create a random block using `{` and `}`)

```javascript
(function () {
  var firstFn = function () {
    var localToFirstFn = "first";
    secondFn();
  };
  var secondFn = function () {
    var actual = localToFirstFn; // throws ReferenceError: localToFirstFn is not defined
  };
  firstFn();
})();
```

Javascript scope is defined statically. `firstFn` and `secondFn` are in completely different **static** scopes, so even though at run time, `secondFn` is run in the context of being within `firstFn`, it DOESN'T have access to `localToFirstFn` because scope is determined statically, **not** dynamically.

## Callbacks

Higher order functions can take functions as parameters and return functions.

```javascript
const ifElse = (condition, isTrue, isFalse) => {
  return condition ? isTrue : isFalse;
};

let result = ifElse(
  true,
  () => console.log(true),
  () => console.log(false)
);
// result will be the function () => console.log(true) [NOTE: this function is never called]
```

### spread `...`

The spread expression, `...`, is useful for gathering and spreading an unknown number of arguments from parameters AND passing them into further functions as arguments.

```javascript
const func = (condition, fn1, fn2, ...arg) => {
  condition ? fn1(...arg) : fn2(...arg);
};
func(true, fn1, fn3, 1, 2, 3);
```

Can pass multiple arguments (after the initial 3) to `func`. `arg` will be an array with all but the first 3 argument values e.g. `[1, 2, 3]`. When passed to `fn1` and `fn2` the elements of `arg` will be "spread" out into the parameters of the function e.g. `fn1(1, 2, 3)`

### `call`, `apply`, `bind`

Three core functions worth looking into. Pre ES6 and the spread operator, the previous function would need to be rewritten:

```javascript
var func2 = function (condition, fn1, fn2) {
  var args = Array.prototype.slice.call(arguments, 3);
  condition ? fn1.apply(this, args) : fn2.apply(this, args);
};
```

### `.reduce() Function`

Array has a `reduce()` function which reduces the array to a single value by applying a function to each item in the array and accumulating the result at each iteration, returning the final result at the end.

e.g. `[1, 2, 3].reduce((n, sum) => n + sum, 0); // sum elements in array, set initial value to 0`

Other libraries e.g. lodash include a similar `reduce` function for objects.

## Functional Utilities

### Currying

Currying is a way of calling a function with multiple arguments multiple times to pass in each argument, but only have the function execute once when all arguments have been passed.

```javascript
const abc = function (a, b, c) {
  return [a, b, c];
};

let curried = _.curry(abc); // defined in underscore.js

// curried saves the parameters in scope (somewhere) UNTIL 3 params have been passed, at which point it calls and returns the result from the original function

curried(1)(2)(3);
// => [1, 2, 3]
```

The curried version of the function needs to keep returning a function (with arguments passed so far in scope) to the caller UNTIL finally the number of arguments has been achieved at which point it can execute the original function with the arguments passed.

### Composing

Joins two seperate functions together into one function by calling one and passing the output as an input to the other.

### Closures

A child function inside a parent function which retains access to the parent scope even after it has been executed.

#### Closure recipe!

```javascript
// 1. create the parent function
function checkScope() {
  // 2. define some vars in the parent's local scope
  let innerVar = "local scope";
  // 3. define the child function
  function innerFunc() {
    return innerVar;
  }
  // 4. return from inside the parent function
  return innerFunc;
}
```

## Advanced Scope: Closures

## Recap

1. What is an object?
2. What is the difference between dot and bracket notation?
3. How do you add a property with a key that contains special characters?
4. How do you add a property whose key and value are stored in different variables?
5. How do we loop through objects to access the values?
6. When can you only use dot notation and not bracket?
7. When can you only use brackets and not dot?
8. How do you add a property with a key that is stored in a variable?
9. How do you access an object that is inside another object?
10. How do you create an object that is nested inside another object?

```

```
