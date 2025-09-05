---
layout: post
title: JavaScript Succinctly
---
## Preface

Mozilla javascript reference: <https://developer.mozilla.org/en-US/docs/Web/JavaScript>

David Flanagan: O'Reilly JavaScript: The Definitive Guide <http://shop.oreilly.com/product/9780596805531.do>

## Chapter 1: JavaScript Objects

### Creating objects

An object in JavaScript is just a container for properties, each of which has a name and a value.
Methods are just properties which contain a `Function()` object.

New objects can be created by calling the `new Object()` constructor function. 
User defined contructor functions can also be defined to create custom objects:

    var Person = function (living, age, gender) {
        this.living = living;
        this.age = age;
        this.gender = gender;
    this.getGender = function () { return this.gender; }; };

Conventionally, a capital letter is used (i.e. `var Person`, not `var person`).

Objects created from either `new Person()` or `new Object()` with the same properties will be exactly the same object. Only the method of creating is different.

Functions can be named or not named:

    var Person = function (living, age, gender) { ... };
    var Person = function Person (living, age, gender) { ... };


### JavaScript constructors create and return object instances

A constructor function is a cookie cutter for producing objects that have default properties and property methods.
The *only difference* between a constructor function and a normal function is how it behaves when invoked with the `new` keyword. In this case, JavaScript sets the value of `this` to the new object being created and returns it (instead of false).

### The native JavaScript object constructors

`Number(), String(), Boolean(), Object(), Array(), Function(), Date(), RegExp(), Error()`

JavaScript is mostly constructed from these nine native (aka global) objects as well as the string, number and Boolean primitive values. 

Note, `Math` is a static object, a container for methods (and therefore not instantiated using the `new` keyword).

### Instantiating constructors using the new operator

Constructor functions can be called with or without the `new` keyword.

If called without using `new`:
* the `this` referred to in a constructor function is no longer the object under construction, but the parent object (see Chapter 6)
* the object is not returned (the constructor function could always explicity return the object)

You can log `myobj.constructor` to see the function definition (which for the built in types won't show you the actual defnition, but for an unknown type, will at least reveal how it was created and therefore reveal its type).

### Creating shorthand or literal values from constructors

_Literals_ are shorthand for creating objects for the built in types rather than calling the `new` keyword.

* Number - just use the number
* String - use quotes
* Boolean - true or false
* Object - {}
* Array - []
* Function - function(x, y) { return x* y };
* RegExp - //

In general the effect is exactly the same as using the `new` keyword. However, in the case of number, string and boolean types, a complex object is not created until object properties are used. e.g `'foo'.length`. Only at this point does a _wrapper_ object get created and then discarded again afterwards.

### Primitive (aka simple) values

The JavaScript values `5`, `'foo'`, `true`, and `false` , as well as `null` and `undefined`, are considered primitive because they are irreducible. 

Note, if using the `new` keyword to create String, Number or Boolean types, then complex objects *are* created and returned. 

Note, if you alternatively call the String(), Number() or Boolean() constructor functions without the `new` keyword, the primitive values are returned. *In this instance, are the complex objects constructed or not - I assume not.*

Primitive values are stored and copied by value, and are equal if equal in value.

### Complex objects (aka composite objects or reference types)

Complex values are stored and manipulated by reference. They are equal only if referring to the same reference (address).

### The `typeof` operator used on primitive and complex values

declaration |   primitive / complex | typeof x | x.constructor | beware
---|---|---
var x = null | primitive | object | [error] | * typeof x is object (not null)
var x = undefined | primitive | undefined | [error]
var x = "string" | primitive | string | String
var x = String("string") | primitive   | string | String
var x = 23  | primitive | number | Number
var x = Number(23)  | primitive | number | Number
var x = true | primitive | boolean | Boolean
var x = Boolean(true) | primitive | boolean | Boolean
var x = new Number(23) | complex | object | Number
var x = new String("string") | complex | object | String
var x = new Boolean(false) | complex | object | Boolean
var x = new Object() | complex | object | Object
var x = new Array("foo", "bar") | complex | object | Array
var x = new Function("x", "y", "return x * y") | complex | function | Function | * typeof x is function (not object)
var x = new Date() | complex | object | Date
var x = new RegExp("[a-z]+") | complex | object | RegExp
var x = new Error("Darn!") | complex | object | Error

### Dynamic properties allow for mutable objects

User-defined objects and most of the native objects can be augmented with extra functionality, storing extra properties and adding new methods.

    String.someExtraProperties = []; // add an array of extra properties
    String.prototype.anExtraMethod = function() { // some extra method definition }; // add an extra function

### All constructor instances have constructor properties that point to their constructor function

When any object is instantiated, the constructor property is created behind the scenes as a property of that object or instance. This property points to the constructor function that created the object.

This is useful for determining the type of an object (more useful than `typeof` for object types, see table above). Note that the value returned is a reference the constructor function, NOT a string containing the function's name.

User defined contructor functions work in exactly the same way and when logged will show the actual implementation details.

### The `instanceof` function

By using the `instanceof` operator, we can determine (true or false) if an object is an instance of a particular constructor function. 

    var Person = function () { this.foo = 'bar'; };
    var person = new Person();
    
    console.log(person instanceof Person); // logs true
    console.log(person instanceof Object); // logs true
    
    // native objects work the same
    console.log(new Array('foo') instanceof Array) // logs true
    console.log(new Array('foo') instanceof Object); // logs true

Note, since all objects inherit from the Object() constructor all will return true for `instanceof Object`

Note, primitive values will return false from `instanceof` operations.

### Instances can have their own properties

Objects can be augmented at any time (i.e. dynamic properties).

    var myString = new String("hello");
    myString.isGreeting = true;

## Chapter 2: Working with Objects and Properties

* Objects can be nested inside other objects (and functions, regexs etc) ad infinitum. Sometimes known as *object chaining*.
* Get or set an object's properties using _dot notation_ or _brackets_. Dot notation is more common, but bracket notation is useful when you have a variable containing the key or with property names which are invalid JavaScript identifiers (e.g. containing a numeral)
* By using bracket notation you can mimic associative arrays found in other languages
* If a property is a method, this can be invoked using the `()` operators e.g. `cody.getGender()`
* The `delete` operator can be used to remove a property from an object e.g. `delete person.name`. Note, this will not delete properties found on the prototype chain. 

### How references to object properties are resolved

If you try to access a property not on the object, JavaScript will check on the prototype chain before returning `undefined`. E.g. accessing a non existent property on an `Array` object will also check `Array.prototype` and `Object.prototype`.

The prototype chain is built using the object contructor function's `prototype` object. This is the secret `__proto__` link contained in all objects which points to the constructor function which created the instance, specifically, the _prototype property_ of the instance’s constructor function.

For example, when you create a instance of an array, the `join` method is not a function on that particular instance, but via the `__proto__` link, it can access the `join` method of the Array class.

    var ar = new Array();
    console.log(ar.hasOwnProperty('join')); // logs false
    console.log(ar.__proto__.hasOwnProperty('join')); // logs true
    console.log(ar.constructor.prototype.hasOwnProperty('join')); // logs true 
    console.log(Array.prototype.hasOwnProperty('join')); // logs true

Note, use `hasOwnProperty` to check for properties specific to that object and not from the prototype change. `in` also appears to have this behaviour in chrome (contrary to the book's explanations that `in` includes all members of an object via the prototype chain).

### Host objects and native objects

Within a browser environment, there are typically additional *host objects* which are not part of JavaScript specification, but just objects provided by the environment itself. These are in themselves very useful e.g. `window` and the objects it contains, but then are *not* part of the JavaScript specification.

Enumerate `x in window` to show all properties in the `window` host object of a browser.

Enumerate `x in window.document` to show all properties in the HTML document, or DOM.

### Underscore.js

This library of functions extends the current offering of JavaScript 1.5 with a number of useful functions for all objects and a number more for arrays in particular including: `map()`, `select()` and `invoke()` where these are not yet provided by the native implementation.

Full details at <http://documentcloud.github.io/underscore/>

## Chapter 3: String()

Avoid using `new String()` since the `typeof` function confusingly returns `object` and the complex object provided by using the new keyword is less performant.

### String properties and methods


## Chapter 4: Number()

As with strings, avoid using `new Number()`.

### Number properties and methods

The Number() object itself has a few useful properties: `MAX_VALUE`, `MIN_VALUE`, `NaN`, `NEGATIVE_INFINITY`, `POSITIVE_INFINITY`

Instance methods include: `toString()`, `valueOf()`

## Chapter 5: Boolean()

Any valid JavaScript value that is not 0, -1, null, false, NaN, undefined or empty string ("") will be converted to true when creating a boolean.

Beware, this means that a 'false' Boolean object (as opposed to a false boolean primitive value) will actually be true.








