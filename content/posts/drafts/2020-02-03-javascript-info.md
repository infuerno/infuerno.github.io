---
layout: post
title: "javascript.info"
---

# An introduction

## An introduction to JavaScript

JavaScript can execute on any device which has a *JavaScript engine*.

* A browser has an embedded JavaScript engine, sometimes called a *JavaScript virtual machine*. 
    - `v8` in Chrome and Opera
    - `SpiderMonkey` in Firefox
    - `Trident`, `Chakra` (IE); `ChakraCore` (Edge); `Nitro`, `SquirrelFish` (Safari);
* The engine compiles the script to machine code, but also watches the data flowing through the code and makes further optimisations
* In-browser JavaScript has differing sets of functionality to e.g. Node.js
* There are lots of restrictions for in-browser JavaScript (for safety)

## Manuals and specifications

* EMCA specification: https://www.ecma-international.org/publications/standards/Ecma-262.htm
* A new specification is released every year
* MDN reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference
* Compatibility: http://caniuse.com and https://kangax.github.io/compat-table 

## Browser console

* `Shift+Enter` allows you to enter multiple lines

# JavaScript Fundamentals

* Generally semi-colons can be omitted and automatic semi-colon insertion is performed: https://tc39.es/ecma262/#sec-automatic-semicolon-insertion
* Sometimes strange errors can occur if semi-colons are ommited e.g. automatic semi-colons are not inserted before square brackets
    - RECOMMENDATION: use semi-colons!
* `'use strict'` is necessary to use many ES5 and ES6 features - most people (and tools e.g. babel) automatically insert it
    - must be at the top of the file
    - can't cancel `'use strict'`
    - use `Shift+Enter` if needing it in a browser console OR alternatively wrap in a function e.g. `(function() { 'use strict';  // code })();`
    - some modern constructs like `class` and `module` enable it by default
    - always start scripts with `'use strict'`
* `const` for values that won't change once assigned. Capitals for values known at compile time e.g. `const COLOuR_ORANGE = '#FF7F00`

## Data types

* Variables are dynamically typed i.e. are typed e.g. `number`, `string` but can change type when reassigned
* There are 8 basic types:
    - `number` for both ints and floats. Special numbers are `Infinity` (e.g. `1 / 0`, `-Infinity`, `NaN` e.g. `"hello"/8`.
    - `bigint` for anything bigger than `2^53` (or smaller than `-2^53`). Create by appending `n` e.g. `const x = 1234567890123456789012345678901234567890n` (not supported in Safari / Edge)
    - `string` surrounded by quotes, either `"`, `'` or a backticks for template strings e.g. containing `${x}`
    - `boolean` either `true` or `false`
    - `null` represents nothing, empty or value unknown e.g. `let age = null;`
    - `undefined` value is not assigned e.g. `let x; // undefined`. Would never assign `undefined`. Use it to check that a value has been assigned.
    - `object` is the only non-primitive type
    - `symbol` is a special type used to create unique identifiers for objects
* Use `typeof` to check the type. Either as an operator: `typeof x` or a function `typeof(x)`. Returns a string with the type name
* Type conversion is often implicit in functions and operators e.g. `alert(value)` will automatically convert the `value` to a string
    - convert to string using `String()` e.g. `String(1)`
    - convert to a number using `Number()` or `+` e.g. `Number("3") or +"3"`. Will result in `NaN` if the string cannot be converted. NOTE other non-intuitive conversions e.g. `Number("") // 0`, `Number(null) // 0`, `Number(undefined) // NaN`
    - convert to boolean using `Boolean()`. Mostly intuitive e.g. 0, an empty string, `null`, `undefined`, and `NaN` all become `false`. NOTE that `"0"` and `" "` both become true (in other languages e.g. PHP is false)

## Operators

e.g. `+`, `-` etc

* `+` for string concatenation (as well as addition). `1 + '2'` is `'12'`. `1 + 1 + '2'` becomes `'22'` since operators are evaluated LEFT to RIGHT
* Other arithmetic operators convert operands to numbers e.g. `'10' * '3'` is `30`
* 

# Code quality

# Objects: the basics
# Data types
# Advanced working with functions
# Object properties configuration
# Prototypes, inheritance
# Classes
# Error handling
# Promises, async/await
# Generators, advanced iteration
# Modules
# Miscellaneous