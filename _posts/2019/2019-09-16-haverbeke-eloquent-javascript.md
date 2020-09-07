---
layout: post
title: "Haverbeke: Eloquent JavaScript"
---

## Introduction

> We think we are creating the system for our own purposes. We believe we are making it in our own image... But the computer is not really like us. It is a projection of a very slim part of ourselves: that portion devoted to logic, order, rule, and clarity.
> &mdash; <cite>Ellen Ullman, Close to the Machine: Technophilia and its Discontents</cite>

> When action grows unprofitable, gather information. When information grows unprofitable, sleep.
> &mdash; <cite>Ursula K. Le Guin, The Left Hand of Darkness</cite>

Programming, it turns out, is hard. You're buidling your own maze, in a way, and you might just get lost in it. Without care, a programs size and complexity will grow out of control, confusing even the person who created it.

### Overview

- Chapters 1-12: JavaScript language
  - 1-4: Control structures, functions, data structures
  - 5, 6: Functions and objects
  - 7: **Project** A Robot
  - 8-11: Error handling , regex, modularity, asynchronous programming
  - 12: **Project** A Programming Language
- Chapters 13-19: Web Browsers
  - 13-15: Browsers, DOM, events
  - 16: **Project** A Platform Game
  - 17,18: Canvas, HTTP, forms
  - 19: **Project** A Pixel Art Editor
- Chapters 20, 21: Node.js
  - 20: Node.js
  - 21: **Project** Skill Sharing Website

## Chapter 1. Values, Types, and Operators

### Numbers

JavaScript uses 64 bits to store values of type `number`. Still need to worry about overflow, but only with huge numbers. Floating point arithmetic is still approximate. There are 3 special number types: `Infinity`, `-Infinity` and `NaN`.

### Interpolation

Backtick-quoted strings, usually called template literals, can do a few more tricks. Apart from being able to span lines, they can also embed other values.

```javascript
`half of 100 is ${100 / 2}`;
```

When you write something inside `${}` in a template literal, its result will be computed, converted to a string, and included at that position. The example produces “half of 100 is 50”.

### `null` and `undefined`

- Two special values, `null` and `undefined`, are used to denote the absence of a meaningful value. They are themselves values, but carry no information.
- Many operations in the language that don’t produce meaningful values (detailed later) yield `undefined` simply because they have to yield **some** value.
- The difference in meaning between `undefined` and `null` is an accident of JavaScript’s design, and it doesn’t matter most of the time. In cases where you actually have to concern yourself with these values, I recommend treating them as mostly interchangeable.

### Automatic type conversion

JavaScript goes out of its way to understand almost anything you give it including automatic type conversion when operating on two or more types of different values. When using `==` to compare different types, JavaScript uses a complicated and confusing set of rules to determine what to do. Use `===` to avoid automatic type conversion.

## Chapter 2. Program Structure

### Expressions and Statements

Expressions are fragments of code which produce values e.g. `22`, `"psycho"`, `(22)`, `typeof 22`, `3 + 4`
Statements combine expressions. The simplist statements are just expressions followed by a `;` e.g. `1;`, `false;`

### Bindings

Imagine bindings (or variables) as tentacles, rather than boxes.

A binding name may include dollar signs `$` or underscores `_` but no other punctuation or special characters. Words with a special meaning, such as `let`, are **keyword**s, and may not be used as binding names. The full list of keywords and reserved words is long.

```javascript
 break case catch class const continue debugger default
 delete do else enum export extends false finally for
 function if implements import interface in instanceof let
 new package private protected public return static super
 switch this throw true try typeof var void while with yield
```

When creating a binding produces an unexpected syntax error, first check if trying to define a reserved word.

### The Environment

The collection of bindings and their values which exist at a given time is the **environment**. Many of these values of of type `function`. Executing a function = "invoke" it, "call" it or "apply" it.

### Blocks

`{` and `}` can be used to group any number of statements into a **block**.

### Capitalization

Most bindings use Lower Camel Case e.g. `fuzzyLittleTurtle`. Constructor functions use Camel Case e.g. `Number`.

## Chapter 3. Functions

A function is just a regular binding where the **value** is a function.

```javascript
const square = function (x) {
  return x * x;
};
console.log(square(4));
```

- Functions have a set of `parameters` and a `body` = statements to be executed when the function is called.
- Functions use the `return` keyword to return values. e.g. `return 4`.
- A function immediately returns on encountering the `return` keyword, giving the value to the code which called the function.
- `undefined` is returned if a return value is not specified OR if there is no `return`.

### Scopes

- A binding defined outside of a function or block is a **global** binding
- A binding created for function parameters or defined within a function is a **local** binding
- Every time a function is called new instances of the bindings are created, isolating separate function invocations
- Bindings declared with `let` or `const` are local to the **block**
- Each scope can **look out** to the scope around it, except where multiple bindings have the same name
- Multiple degress of locality exist when functions and blocks are created within other functions and blocks (i.e. nested)
- Lexical scoping: the set of bindings visible inside a block (or function) is determined by the place of that block **in the program text**

### Declaration notation

- A shorter way of declaring a function, using `function` keyword at the start
- Doesn't require a semi-colon after the declaration
- Almost the same, except that they are logically **moved** to the top of their scope

### Arrow notation

```javascript
const square1 = (x) => {
  return x * x;
};
const square2 = (x) => x * x;
```

### Parameters

- If too many arguments are passed, extra ones are ignored
- If too few, the remaining are set to `undefined`
- Using `=` gives a default value in the case it is not specified

### Closures

Closures are possible because:

- functions can be treated as values
- bindings are recreated every time a function is calculated
- **closure**: being able to reference a specific instance of a local binding in an enclosing scope
- **a closure**: a function that references bindings from local scopes around it

```javascript
function wrapValue(n) {
  let local = n; // creates a local binding
  return () => local; // returns a function which accesses this
}
let wrap1 = wrapValue(1);
let wrap2 = wrapValue(2);
console.log(wrap1()); // → 1
console.log(wrap2()); // → 2
```

- Local bindings are created anew for each call to `wrapValue`
- Different calls are completely seperate

The `local` variable from `wrapValue` isn't necessary since the parameter itself is a local variable. Therefore equivalent to:

```javascript
function wrapValue(n) {
  return () => n;
}
```

Use this idea to create functions which multiply by an arbitrary amount:

```javascript
function multiplier(factor) {
  return (number) => number * factor; // returns a **function** which accepts one parameter
}
let twice = multiplier(2);
console.log(twice(5)); // → 10
```

Thinking about programs like this takes some practice. A good mental model is to think of function values as containing both the code in their body and the environment in which they are created. When called, the function body sees the environment in which it was created, not the environment in which it is called.

### Functions and side-effects

Functions can be roughly divided into those that are called for their side effects and those that are called for their return value. (Though it is definitely also possible to both have side effects and return a value.)

A **pure** function is a specific kind of value-producing function that:

- has no side effects
- doesn’t rely on side effects from other code (e.g. doesn't use global variables)

## Chapter 4. Objects and Arrays

> On two occasions I have been asked, ‘Pray, Mr. Babbage, if you put into the machine wrong figures, will the right answers come out?’ [...] I am not able rightly to apprehend the kind of confusion of ideas that could provoke such a question.
> &mdash; <cite>Charles Babbage, Passages from the Life of a Philosopher (1864)</cite>

### Properties

- Almost all JavaScript values have properties (with the exception of `null` and `undefined`)
- Both `value.x` and `value[x]` access a property on value
  - Using a dot, the word after the dot is the literal name of the property.
  - Using square brackets, the expression between the brackets is evaluated and converted to a string to get the property name
- Properties with names which aren't naturally strings (e.g. 2; "John Doe") must use square bracket notation
- Elements in an array are stored as the array’s properties, using numbers as property names (and therefore must use square bracket notation)
- Properties that contain functions are generally called methods of the value they belong to, as in “toUpperCase is a method of a string”.

### Objects

- Values of the type `object` are arbitrary collections of properties
- One way to create an object is by using braces as an expression

```javascript
let day1 = {
  squirrel: false,
  events: ["work", "touched tree", "pizza", "running"],
};
```

- Quote binding names if necessary
- `Object.keys` returns an array of strings, the object’s property names e.g. `Object.keys(day1)` gives `["squirrel", "events"]`
- `Object.assign` copies all properties from one object into another e.g. `Object.assign(day1, {weather: "cloudy", moon: "full"})`

### Arrays

Arrays are simply a kind of object specialized for storing sequences of things, with extra methods available

- `includes` checks whether a given value exists in the array
- `for ... of` to iterate over arrays (as well as other iterables e.g. strings) e.g. `for (let entry of journal)`
- `push` and `pop` add to and remove from the **end** of an array
- `unshift` and `shift` add to and remove from the **beginning** of an array
- `indexOf` and `lastIndexOf` search for objects in an array (returning -1 if not found)
- `slice` returns a sub section of an array e.g. `arr.slice(2, 4)` (use `slice()` to copy the whole array)
- `concat` glues arrays together to create a new array (similar to `+` for strings)

### Strings

- `indexOf` can search for more than one letter (unlike arrays)
- `padStart`, `trim`
- `split`, `join`
- `repeat` e.g. `"ha".repeat(3) // hahaha`

### Rest parameters

- To accept any number of arguments, add `...` before the last argument e.g. `function max(...numbers)` a.k.a. the **rest parameter**
- The rest parameter gathers up all remaining parameters and binds them to an array
- Use `...` to _call_ a function with an array and automagically "spread" the array out into the arguments e.g. `let numbers = [5, 1, 7]; console.log(max(...numbers));` - "spreading" out the array into the function call

### Destructuring

- Use destructuring to assign more meaningful variable names directly to elements in an array parameter using `[]` e.g. `function phi([n00, n01, n10, n11])`
- Destructure objects using `{}` e.g. `let {name} = {name: "Faraji", age: 23}; // "Faraji"`

## Chapter 5. Higher-Order Functions

- Functions that operate on other functions, either by taking them as arguments or by returning them, are called higher-order functions (term is from mathematics where there is more difference between a "function" and a "value")
- Allow abstracting over _actions_ (not just _values_)
- Functions which create new functions:

```
function greaterThan(n) {
   return m => m > n; // returns a **function**
}
let greaterThan10 = greaterThan(10);
console.log(greaterThan10(11));
// → true
```

- Functions which change other functions - e.g. log input and output as well as call an existing function
- Array have a variety of higher-order functions defined including:
  - `forEach` to loop over the elements in an array
  - `filter` returns a new array of only elements passing the predicate function
  - `map` transform all elements in an array according to the given function
  - `reduce` combines all elements in an array into a single value
  - `some` tests whether any element in an array passes a given predicate function
  - `findIndex` finds the position of the first element passing a given predicate function

## Chapter 6. The Secret Life of Objects

### Encapsulation

- Javascript objects do not have the concept of `public` and `private` (YET), however it is customary for private variables to be prefixed with `_`.

### Methods

- `Methods` are object properties which hold function values
- When a method needs access something on the object it was called on, it can use the binding `this` (in effect, passed into the method is a special way).

```javascript
let rabbit = {
  type: "white",
  speak(line) {
    console.log(`The ${this.type} rabbit says ${line}`);
  },
};
rabbit.speak("hi");
```

- Alternatively a function's `call` method can be used to explicity specify the binding for `this`

```javascript
speak.call(hungryRabbit, "Burp!");
```

### `this`

- Since each function has its own scope, `this` will hide any definitions of `this` in an outer scope EXCEPT for fat arrow functions which DO NOT define their own `this` value (can be exploited).

```javascript
function normalise() {
  console.log(this.coords.map((n) => n / this.length)); // if using `function`, `this` would be undefined
}
normalise.call({ coords: [1, 2, 3] }, (length: 5));
// -> [0, 0.4, 0.6]
```

### Prototypes

Most objects in JavaScript also have a `prototype`, an informal take on the OO concept of classes. Functions derive from `Function.prototype`, array from `Array.prototype` and these prototypes as well as objects derive from `Object.prototype`

```javascript
let protoRabbit = {
  speak(line) {
    console.log(`The ${this.type} rabbit says ${line}`);
  },
};
let killerRabbit = Object.create(protoRabbit);
killerRabbit.type = "killer";
killerRabbit.speak("SKRREEE");
```

#### Constructor Functions

Special functions - use `Object.create` - ensure all mandatory properties are initialised.

```javascript
function makeRabbit(type) {
  let rabbit = Object.create(rabbitPrototype);
  rabbit.type = type;
  return rabbit;
}
let wiseRabbit = makeRabbit("wise");
```

Equivalently syntax using `new`.

```javascript
function Rabbit(type) {
  this.type = type;
}
Rabbit.prototype.speak = function (line) {
  console.log(`The ${this.type} rabbit says ${line}`);
};
let weirdRabbit = new Rabbit("weird");
```

Constructors (and all functions actually) automatically get a property name `prototype`, to which you can add further functionality e.g. the function `speak`.

#### Pre ES6

JavaScript classes are constructor functions with a prototype property and are written as such.

#### Post ES6

Same, but with easier syntax.

```javascript
class Rabbit {
  constructor(type) {
    this.type = type;
  }
  speak(line) = {
    console.log(`The ${this.type} rabbit says ${line}`);
  }
  // can currently only defined methods, not properties (other than directly manipulating the prototype after creation)
}
let blackRabbit = new Rabbit('black');
```

### Maps

Since all objects derive from `Object.prototype` and inherit several default methods e.g. `toString`, this can be problematic when requiring a map type object where the ONLY properties you want are those which have been explicitly defined.

The JavaScript `Map` class solves this. Methods `get` and `set` can be used to set keys and retrieve values.

### Getter, Setters and Statics

## Chapter 8. Bugs and Errors

## Chapter 9. Regular Expressions

> Some people, when confronted with a problem think 'I know, I'll use regular expressions.' Now they have two problems.
> &mdash; <cite>Jamie Zawinski</cite>

- Define using literal value `/abc/` or a constructor `new RegExp("abc")`
- If defining using the latter backslashes need escaping e.g. `/\d+/` but `new RegExp("\\d+")`
- If defining using the former forward slashes need to be escaped e.g. `new RegExp("a/b")` but `/a\/b/`

### Useful methods

#### .test() on RegExp

`.test()` on `RegExp` when passed a string, returns a boolean e.g. `/abc/.test("abcdef")` returns `true`

Subexpressions are grouped using `()` and are treated as a **single element** e.g. `/boo+(hoo+)+/i.test("Boohoooohoohoooo"` returns `true`

#### .exec() on RegExp

`.exec()` on `RegExp` returns a "match" object. Either `null` if not found OR an `Array` of the matches, with some extra properties including `index` containing where the match was found (and also the properties `input` and `groups`)

#### .match() on String

`.match()` on `String` is the equivalent of `.exec()` on `RegExp`

#### .replace() on String

This `String` method can take either `String`s or `RegExp`s for the first argument. The second argument can additionally use the `$1`, `$2` group substitutions (use `$&` for the whole match).

```javascript
console.log("Liskov, Barbara\nMcCarthy, John\nWadler, Philip".replace(/(\w+), (\w+)/g, "$2 $1"));
// → Barbara Liskov
//   John McCarthy
//   Philip Wadler
```

A function can alternatively be passed as the second arguments

```javascript
let s = "the cia and fbi";
console.log(s.replace(/\b(fbi|cia)\b/g, (str) => str.toUpperCase()));
// → the CIA and FBI
```

#### .search() on String

Similar to `indexOf`, but using regular expressions instead e.g. `" word".search(/\S/)` gives `2`

### The Date class

- `new Date()` - today's date
- `new Date(2009, 11, 9)` - date for 9th **December** 2009 (**months** are zero based)
- Timestamps are stored as the number of milliseconds since 1/1/1970. Use `getTime()` to get this number e.g. `new Date().getTime()` gives `1598619753764`
- Negative numbers are used for dates prior to 1970
- `Date()` constructor called with a single argument is treated as ticks

### Example using regex, groups and destructuring to parse variables from a string

```javascript
function getDate(string) {
  let [_, month, day, year] = /(\d{1,2})-(\d{1,2})-(\d{4})/.exec(string);
  return new Date(year, month - 1, day);
}
console.log(getDate("1-30-2003"));
// → Thu Jan 30 2003 00:00:00 GMT+0100 (CET)
```

### Matching and Backtracking

The reg ex parsing engine looks for a match in the string checking from the first character then the second and so on. When there are choices (using `|`) or wildcard operators (`*`, `+`) and the initial pass doesn't yield a match, the engine has to backtrack and try a second way (the second branch, or less greedy using of `*`).

Some regular expressions and string combinations can be written such that ** a lot** backtracking occurs and can yield performance issues.
e.g. `"0101010101010101010101010101".match(/([01]+)+b/)` never matches and takes about 5 seconds to return `null`. The time to complete is doubled for each number added to the string.

### Greed

Due to the mechanics of matching, `+`, `*`, `?` and `{}` are **greedy** by default, i.e. they match as much as they can and backtrack from there.

Using a following `?` makes these operators **nongreedy** i.e. `+?`, `*?`. This is often what is wanted in the first place.

**When using a repetition operator consider the nongreedy variant first.**

### The `lastIndex` property

This `lastIndex` property is set on a `RegExp` object where the `global` or `sticky` flag is true AND the `exec` method is used. It keeps track of where the next match will be checked from when `exec` is called a second or subsequent time.

This can be useful OR lead to bugs.

#### Looping over matches

```javascript
let input = "A string with 3 numbers in it... 42 and 88.";
let number = /\b\d+\b/g;
let match;
while ((match = number.exec(input))) {
  console.log("Found", match[0], "at", match.index);
}
// -> Found 3 at 14
// -> Found 42 at 33
// -> Found 88 at 40
```

#### Source of bugs

```javascript
let pattern = /abc/g;
console.log(pattern.exec("abc in the summer"));
// -> [ 'abc', index: 0, input: 'abcdefabc', groups: undefined ]
console.log(pattern.lastIndex);
// -> 3
console.log(pattern.exec("abc in the winter"));
// -> null
```

### International Characters

Regular expressions in JavaScript work with code units NOT actual characters. So 🍎 which is composed of two code units behaves unexpectedly.

```javascript
console.log(/🍎{3}/.test("🍎🍎🍎"));
// -> false - only the second code unit has the {3} applied, so the test fails
```

Use `/u` to treat Unicode characters correctly.

```javascript
console.log(/🍎{3}/u.test("🍎🍎🍎"));
// -> true
```

### Summary

| regex      | meaning                                      |
| ---------- | -------------------------------------------- |
| `/abc/`    | A sequence of characters                     |
| `/[abc]/`  | Any character from a set of characters       |
| `/[^abc]/` | Any character not in a set of characters     |
| `/[0-9]/`  | Any character in a range of characters       |
| `/x+/`     | One or more occurrences of the pattern x     |
| `/x+?/`    | One or more occurrences, nongreedy           |
| `/x*/`     | Zero or more occurrences                     |
| `/x?/`     | Zero or one occurrence                       |
| `/x{2,4}/` | Two to four occurrences                      |
| `/(abc)/`  | A group                                      |
| `/a        | b                                            | c/` | Any one of several patterns |
| `/\d/`     | Any digit character                          |
| `/\w/`     | An alphanumeric character ("word character") |
| `/\s/`     | Any whitespace character                     |
| `/./`      | Any character except newlines                |
| `/\b/`     | A word boundary                              |
| `/^/`      | Start of input                               |
| `/$/`      | End of input                                 |

## Chapter 10. Modules

Modules are used to break programs into smaller pieces. Each module should specify its dependencies and its own interface. In a similar way to objects, they expose some functionality publically and keep the rest private.

Relationships between modules are called dependencies.

### CommonJS modules

Until 2015, there was no official module system in JavaScript so improvised systems emerged using functions to create local scopes and objects to represent interfaces.

CommonJS is the most widely used of these. The main concept is a function `require` which is called with a string of the name of the dependency e.g. `require("ordinal")`. The string is treated as a path. The file system will be searched in obvious places to find a file or folder with the same name e.g. `ordinal.js` (or `index.js` by default if a folder is used instead - can be changed in `package.json`). Strings starting `./`, `../` or just `/` can also be used.

The following steps are taken when requiring a module:

- Resolving: Find the absolute path of the file
- Loading: Determine the type of the file content
- Wrapping: Give the file its private scope. This is what makes both the require and module objects local to every file we require
- Evaluating: This is what the VM eventually does with the loaded code
- Caching: When the file is required again, the same steps are not repeated

A `module` object is the result of requiring a file in this way. The `module` object has a special property `exports`, itself an object which can be used to expose properties of the module e.g. `exports.id = "hello world";`. The `module.exports` object is returned by the `require` function.

To export functions etc from a module, define on the `exports` object e.g. `exports.formatDate = function(date, format) {...}`

### ES6 modules
