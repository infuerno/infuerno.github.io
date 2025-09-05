---
layout: post
title: "Robert C Martin: Clean Code"
---
## Chapter 2 Meaningful Names

* Noise words are a meaningless distinction - the word `variable` should never appear in a variable name. The word `table` should never appear in a table name.
* Distinguish names in such a way that the reader knows what the differences offer e.g. don't use `account` and `accountInfo`
* Class names should use nouns and avoid verbs - especially avoid words like `Manager`, `Processor`, `Data` or `Info`
* Method names should have verbs or verb phrases in them
* Use a consistent lexicon, but don't use the same word when the concepts are different
* Use solution domain i.e. technical terms e.g. `AccountVisitor` when using the VISITOR pattern
* Use problem domain terms too

## Chapter 3 Functions

* The first rule of functions is that they should be small. The second rule of functions is that they should be smaller than that.
* This implies that blocks within `if`, `else` and `while` statements should be one line long. Probably that line should be a function call.
* Functions should do one thing. They should do it well. They should do it ONLY.
* Use one level of abstraction within one function - mixing levels of abstraction is always confusing (it turns out to be very difficult for programmers to learn to follow this rule and write functions that stay at a single level of abstraction)
* Switch statements should only be tolerated if they appear once to create polymorphic objects *G23*
* Functions should have none, one, two or three arguments - not more
* Common monadic functions (one argument):
    - Ask a question - return the answer as the output of the function
    - Transform - return the transformation as the output of the function
    - Event - void return
* Don't use flag arguments i.e. a function which takes a `bool` argument - create two functions, one for the positive case and one for the negative case
* Dyadic functions are HARDER to understand and should be reduced to monadic functions where possible e.g. `WriteField(outputStream, value)` becomes `outputStream.WriteField(value)` or make `outputStream` a member of the current class so it doesn't have to be passed
* Multiple function arguments may indicate they need to be wrapped in a class
* Consider encoding argument names into function names e.g. `AssertExpectedEqualsActual` (the keyword form of a function)
* Ensure functions don't have side effects e.g. a function which check a valid password and then ADDITIONALLY initializes session
* Don't use arguments for output
* Seperate commands from queries - don't have a function which does both
* Use exceptions, not return codes
* Extract the bodies of try/catch blocks to their own functions
* Duplication MAY be the root of all evil in software. D.R.Y.

>When I write functions, they come out long and complicated. They have lots of indenting and nested loops. They have long argument lists. The names are arbitrary and there is duplicated code. But I also have a set of unit tests which cover every one of those clumsy lines of code.
>In the end I wind up with functions that follow the rules I've laid down. I don't write them that way to start. I don't think anyone could.

## Chapter 4 Comments


