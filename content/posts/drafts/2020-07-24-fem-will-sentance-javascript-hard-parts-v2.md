---
layout: post
title: "Frontend Masters: Will Sentance JavaScript The Hard Parts v2"
---

## Reference

- Slides: https://static.frontendmasters.com/resources/2019-09-18-javascript-hard-parts-v2/javascript-hard-parts-v2.pdf
- Exercises: csbin.io/callbacks
- Exercies: csbin.io/closures

## JavaScript Principles

### Thread of execution

When JS code runs it:

- Thread of Execution: goes through the code line-by-line and runs / "executes" each line - known as the **thread of execution**
- Memory: Saves "data" like strings and arrays so we can use that data later - in its memory
- Call Stack: Starts with just the global context and as functions are called, these are recorded on top of the call stack

Method
: a function which is stored as a property on another object

Higher Order Function
: a function which takes in a function as an argument OR returns a function

Callback Function
: a function which is passed into a higher order function

Statically / Lexically Scoped Languages
: the physical positioning on the page of the function determines the scope

## Closure

A function returned from another function which, when returned, keeps a reference to any of the variables in local memory it referenced. Therefore each instance of the function as well as having a completely seperate execution context ALSO has access to a common set of variables shared across ALL function invocations.

The state is stored in a hidden variable `[[scope]]`, which can only be referenced when **running** the function. The "backpack".

The "backpack" is sometimes referred to as:

- C.O.V.E - Closed Over Variable Environment
- P.L.S.R.D - Persistent Lexical Scope Referenced Data

Closures and their persistent memory enable an entirely new toolkit.

- **Helper functions**
  - `once` can only be run once
  - `memoize` giving functions persistent memories of their previous input / output combinations - remember parameters and results to save recalculation
- **Iterators and Generators**
  - `iterator` keeps track in its backpack of the index of the element to be returned when `next` is called
  - `generator` come back to a running function. Store all the live data, and the current line in the backpack
- **Module pattern**
  - preserve state (live data) for the life of the application without polluting global namespace. This is achieved by protecting state inside backpacks.
- **Asynchronous JavaScript**
  - Callbacks and Promises rely on closure

## Asynchronous JavaScript

- Promises - the most significant ES6 features
- Asynchronicity - the feature which makes dynamic web applications possible
- Event loop - JavaScript's triage
- Microtask queue - callback queue and web browser features (APIs) - https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/

The Javascript engine has only 3 main parts: a single thread of execution, a memory / variable environment and a call stack. New components are required to do achieve asynchronicity: Web Browser APIs / Node background APIs; Promises; Event loop, Callback / Task queue and the microtask queue.

JavaScript does not run in isolation. It runs **IN A BROWSER**, which has a ton of other features including network requests, rendering, timers, local storage. It interfaces with this functionality using the APIs exposed by the web browser features. These are NOT JavaScript features e.g. `setTimeout`, `document`, `fetch`, `xhr`, `console`

## Promises

## Classes and Prototypes
