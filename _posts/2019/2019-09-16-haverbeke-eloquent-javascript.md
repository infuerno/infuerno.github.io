---
layout: post
title: "Haverbeke: Eloquent JavaScript"
---
# Introduction

* Ellen Ullman, Close to the Machine: Technophilia and its Discontents
* Ursula K. Le Guin, The Left Hand of Darkness

# Chapter 1. Values, Types, and Operators

Backtick-quoted strings, usually called template literals, can do a few more tricks. Apart from being able to span lines, they can also embed other values.
```
`half of 100 is ${100 / 2}`
```
When you write something inside `${}` in a template literal, its result will be computed, converted to a string, and included at that position. The example produces “half of 100 is 50”.

There are two special values, written `null` and `undefined`, that are used to denote the absence of a meaningful value. They are themselves values, but they carry no information.  
Many operations in the language that don’t produce a meaningful value (you’ll see some later) yield `undefined` simply because they have to yield some value.  
The difference in meaning between `undefined` and `null` is an accident of JavaScript’s design, and it doesn’t matter most of the time. In cases where you actually have to concern yourself with these values, I recommend treating them as mostly interchangeable.

# Chapter 2. Program Structure
You should imagine bindings as tentacles, rather than boxes.  


A binding name may include dollar signs ($) or underscores (_) but no other punctuation or special characters. Words with a special meaning, such as let, are keywords, and they may not be used as binding names. The full list of keywords and reserved words is rather long.
```
 break case catch class const continue debugger default
 delete do else enum export extends false finally for
 function if implements import interface in instanceof let
 new package private protected public return static super
 switch this throw true try typeof var void while with yield
```
Don’t worry about memorizing this list. When creating a binding produces an unexpected syntax error, see whether you’re trying to define a reserved word.

# Chapter 3. Functions
A function is just a regular binding where the **value** is a function.
```
const square = function(x) {
   return x * x;
};
console.log(square(4));
```
## Scopes
* A binding defined outside of a function or block is a **global** binding
* A binding created for function parameters or defined within a function is a **local** binding
* Bindings declared with `let` or `const` are local to the **block**
* Each scope can **look out** to the scope around it, except where multiple bindings have the same name
* Multiple degress of locality exist when functions and blocks are created within other functions and blocks (i.e. nested)

## Declaration notation
* A shorter way of declaring a function, using `function` keyword at the start
* Almost the same, except that they are logically **moved** to the top of their scope

## Arrow notation
```
const square1 = (x) => { return x * x; };
const square2 = x => x * x;
```
## Parameters
* If too many arguments are passed, extra ones are ignored
* If too few, the remaining are set to `undefined`
* Using `=` gives a default value in the case it is not specified

## Closures
```
function wrapValue(n) {
  let local = n;      // creates a local binding
  return () => local; // returns a function which accesses this
}
let wrap1 = wrapValue(1);
let wrap2 = wrapValue(2);
console.log(wrap1()); // → 1
console.log(wrap2()); // → 2
```
* Local bindings are created anew for each call to `wrapValue`
* Different calls are completely seperate
* This feature — being able to reference a specific instance of a local binding in an enclosing scope — is called **closure**.
* A function that references bindings from local scopes around it is called **a closure**.

The `local` variable from `wrapValue` isn't necessary since the parameter itself is a local variable. Therefore equivalent to:
```
function wrapValue(n) {
  return () => n;
}
```
Use this idea to create functions which multiply by an arbitrary amount:
```
function multiplier(factor) {
   return number => number * factor;
}
let twice = multiplier(2);
console.log(twice(5)); // → 10
 ```
Thinking about programs like this takes some practice. A good mental model is to think of function values as containing both the code in their body and the environment in which they are created. When called, the function body sees the environment in which it was created, not the environment in which it is called.

## Functions and side-effects
Functions can be roughly divided into those that are called for their side effects and those that are called for their return value. (Though it is definitely also possible to both have side effects and return a value.)  
A **pure** function is a specific kind of value-producing function that not only has no side effects but also doesn’t rely on side effects from other code

# Chapter 4. Objects and Arrays
## Properties
* Almost all JavaScript values have properties (with the exception of null and undefined).
* Both `value.x` and `value[x]` access a property on value
  * Using a dot, the word after the dot is the literal name of the property.
  * Using square brackets, the expression between the brackets is evaluated and converted to a string to get the property name
* Properties with names which aren't naturally strings (e.g. 2; "John Doe") must use square bracket notation
* Elements in an array are stored as the array’s properties, using numbers as property names (and therefore must use square bracket notation)
* Properties that contain functions are generally called methods of the value they belong to, as in “toUpperCase is a method of a string”.

## Objects
* Values of the type object are arbitrary collections of properties
* One way to create an object is by using braces as an expression

```
let day1 = {
squirrel: false,
events: ["work", "touched tree", "pizza", "running"]
};
```
* Quote binding names if necessary
* `Object.keys` returns an array of strings, the object’s property names
* `Object.assign` copies all properties from one object into another

## Arrays
* Arrays are simply a kind of object specialized for storing sequences of things
* Arrays have an `includes` method that checks whether a given value exists in the array
* Iterate over arrays and strings with `for ... of` e.g. `for (let entry of journal)`
* `slice` returns a sub section of an array 
* `concat`glues arrays together to create a new array (similar to `+` for strings)

## Strings
* `indexOf` can search for more than one letter (unlike arrays)
* `padStart`
* `split`
* `join`

## Rest parameters
* To accept any number of arguments, add `...` before the last argument e.g. `function max(...numbers)` a.k.a. the **rest parameter**
* The rest parameter is bound to an array
* Use `...` to _call_ such a function with an array e.g. `let numbers = [5, 1, 7]; console.log(max(...numbers));` - "spreading" out the array into the function call

## Destructuring
* When a function takes an array for a parameter, the function parameters can instead target individual items in the array e.g. `function phi([n00, n01, n10, n11])`
* Works for `let`, `const` or `var` as well as parameters
* Works for objects too using `{}` e.g. `let {name} = {name: "Faraji", age: 23}; // "Faraji"`

# Chapter 5. Higher-Order Functions
* Functions that operate on other functions, either by taking them as arguments or by returning them, are called higher-order functions (term is from mathematics where there is more difference between a "function" and a "value")
* Allow abstracting over _actions_ (not just _values_)
* Functions which create new functions:
```
function greaterThan(n) {
   return m => m > n; // returns a **function**
}
let greaterThan10 = greaterThan(10);
console.log(greaterThan10(11));
// → true
```
* Functions which change other functions - e.g. log input and output as well as call an existing function
* Array have a variety of higher-order functions defined including:
  * `forEach` to loop over the elements in an array
  * `filter` returns a new array of only elements passing the predicate function
  * `map` transform all elements in an array according to the given function
  * `reduce` combines all elements in an array into a single value
  * `some` tests whether any element in an array passes a given predicate function
  * `findIndex` finds the position of the first element passing a given predicate function

# Chapter 6. The Secret Life of Objects
