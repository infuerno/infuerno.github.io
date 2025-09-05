---
layout: post
title: "Pluralsight: Python Fundamentals"
---

## Introduction to the Python Fundamentals, 13 mins

- Initially developed by Guido in the late 1980s - BDFL (Benevolent Dictator For Life)
- Open Source project - managed by non profit Python Software Foundation
- Strongly typed language - every object has a definite type
- Dynamically typed - no type checking prior to running it (unlike C++ or Java) i.e. uses duck typing
- Interpreted language - it is actually compiled to a form of bytecode before executing, but this happens invisibly - experience is of immediately executing code with a noticeable compilation phase
- Originally written in C - CPython - other implementation include:
  - Jython (written in Java, targets JVM)
  - IronPython (written in C#, targets .NET runtime)
  - pypy (written in a specialised subset of python, RPython)
- Python has a huge standard library - "batteries included" - which means many scripts will run out of the box
- Python philosophy - `import this`

## Getting started with Python 3, 43 mins

- `_` in REPL to refer to most recently printed value
- Ctrl-D to quit (mac, linux); Ctrl-Z to quit (windows) - `fg` if you accidentally press the wrong key and background the job
- `:` indicates the body of a contruct follows (for e.g. `if`, `for`, `while`)
- Contemporary python code is indented by 4 spaces - can be either spaces or tabs - spaces have become standard - don't mix
- Terminate a block in the REPL by entering a blank line
- Standard library modules, although available, still need to be imported: `import math`
- `help(math)` to get help on the `math` module
- `help(math.factorial)` to get help on the `factorial` function in the `math` module
- To use `factorial` without qualifying with the module name, use: `from math import factorial`
- To alias functions use: `from match import factorial as fac` - may be useful for a namespace clash - in general don't use
- Import multiple functions using `from math import (factorial, floor)` (brackets optional - don't use `from math import *`)
- `/` is the floating point division operator
- `//` in the integer division operator
- Python works with arbitrarily large integers (e.g. no upper limit of 2\*\*31 - 1)
- `input()` to request input from the user

### Scalar types and values

- `int` signed, unlimited precision
  - specify in decimal (default); binary with `0b` prefix e.g. `0b10`; octal with `0o10`; hex with `0x10`
  - convert to int using `int()` e.g. `int(3.7)`
- `float` IEEE-754 double precision - approx 15 bits of decimal precision
  - numbers with `.` or `e` are interpreted as floats e.g. `3e8` = 3 x 10^8 = 300000000.0
  - `float("nan")`, `float("inf")`, `float("-inf")`
- `None` special type to indicate the absence of a value
- `bool` either `True` or `False`
  - e.g. ` bool(1)`` is  `True`; `bool(0)`is`False`; `bool("")`is`False` etc
  - expressions passed to the `if` and `while` statements are implicitly cast to bool using the `bool()` constructor

## Strings and Collections, 18 mins

- `str` - data type for strings
  - immutable sequence of Unicode codepoints (can think of these like characters - but not equivalent)
  - delimit with either single or double quotes
  - "hello" "world" - adjacent strings are concatenated - useful for formatting code
  - multiline strings use """ or ''' - embeds `\n` between strings
  - **Universal newlines** support in Python3 translates `\n` to `\r\n` for Windows native carriage returns if running on Windows (PEP278)
  - raw strings don't use escape sequences and are prefixed using `r` e.g `r'C:\Users\Merlin\'`
  - use the `str()` string constructor to create strings based on other types e.g. `str(3)`
  - strings are **sequence types**; use `[]` to index into strings
  - no character types i.e. `type('hello'[4])` is `<class 'str'>`
  - default source code encoding is UTF-8
- `bytes`
  - immutable sequence of bytes
  - used for raw binary data and fixed width single byte character encodings such as ascii
  - use `b` i.e. `b'data'`
  - converting between bytes and strings requires knowing the encoding of the byte sequence used to represent the string's code points
    - `'skål'.encode('utf-8')` -> `b'sk\xc3\xa5l'`
    - `'skål'.encode('utf-7')` -> `b'sk+AOU-l'`
    - IMPORTANT: files, network resources and HTTP responses are transmitted as byte streams - so the encoding used is crucial
- `list`
  - mutable sequences of objects
  - the workhorse of python data structures
  - heterogeneous with respect to the types of objects contained e.g. `a = ['apple', 7, 'dog']`
  - the `list` constructor can create lists from e.g. strings `list('hello')` gives `['h', 'e', 'l', 'l', 'o']`
  - can span multiple lines
- `dict`
  - mutable mappings of keys to values (in some languages known as associative arrays)
  - `{k1: v1, k2: v2}`
  - note stored in any particular order

## Modularity, 21 mins

- Collections of related functions can be grouped into modules
- Modules can be used from other modules (as long as no circular dependency)
- Declare functions using the `def` keyword e.g. `def square(x)`
- Functions can return values e.g. `return x` or simply return i.e. `return`. In the latter case, `None` is returned.
- To run a function as a script, use the value of `__name__` to detect if the file is being run OR simply imported e.g. `if __name__ == "__main__":`
- Recommended to ensure all modules can also be run as scripts if required using the `if __name__` directive
- Take command line arguments using `sys.argv[1]` etc - ensure the `main` function takes arguments (so it can be used from another module, repl etc) and the `if __name__` part ONLY refers to the sys.argv arguments - so they can be passed in when running as a script
- Better command line argument libraries: argparse (Standard Library) or docopt (Third Party)
- Leave 2 blank lines between functions
- Document functions with docstrings - first string in a named block e.g. function or module - customary to use triple quoted strings
  - PEP 257 outlines preferred syntax, but not used much
  - reStructuredText / Sphinx - available to build HTML document
  - Google's Python Style Guide is preferred
  - Module docstrings go at the top of the file BEFORE any other statements
- Shebang command can also be added at the top of the file e.g. `#! /usr/bin/env python3` where `/usr/bin/env` is used to locate `python3` - mark the script executable and now run directly using e.g. `./words.py`

## Objects, 21 mins

- Python only has named references to objects
- `int` is a reference type and is immutable. `y = 100` creates an object on the heap with the value 100 and `y` references it. `y = 1000` creates a different object on the heap. 100 is no longer referenced and is garbage collected at some point.
- `id()` returns a identifier representing the memory location of the object
- `is` uses `id()` to test for equality
- Function arguments are transferred by "pass by object reference" - the value of the refrence is copied, but not the value of the object
- Default values are evaluated WHEN a function is evaluated - so default values which use **mutable** objects, time etc are DOOMED - ONLY use immutable objects such as ints or strings for default arguments e.g. set mutable types to None and initialise inside the function if not passed in

### Dynamic vs Static

- Dynamic = object types are resolved at runtime e.g. python, ruby cf
- Static = objects are resolved at compile time e.g. C++

### Strong vs Weak

- Strong = generally means no implicity type conversion e.g. trying to add float and string in Python (exception is bool in `if` statements and `while` loops)
- Weak = e.g. JavaScript, Perl

### Scopes

IMPORTANT - scopes are NOT affected by for loops, while loops etc

- Local = inside the current function
- Enclosing = NOT COVERED
- Global = inside a module e.g. import statements, class and function defs, constants (and occasionally variables)
- Builtins = built in to the language provided by the `builtin` module

Global refereneces can be read from a local scope BUT in order to assign the global references, need to use the `global` keyword inside the function e.g. `global count`.

- `dir(_module_name_)` to introspect an object and get a list of its attributes
- Everything is an object including functions and modules

## Collections, 45 mins

- `str` = immutable sequence of unicode code points
- `list` = mutable sequence of objects
- `dict` = mutable mapping from immutable keys to mutable objects
- `tuple` = immutable sequence of objects
- `range` = arithmetic progression of integers
- `set` = mutable collection of unique immutable objects

### tuple

### str

### range

### list

### dict

### set

## Handling exceptions, 22 mins

## Iterables, 33 mins

## Classes, 30 mins

https://www.python-course.eu/python3_properties.php

```
class P:

    def __init__(self, x):
        self.x = x

    @property
    def x(self):
        return self.__x

    @x.setter
    def x(self, x):
        if x > 0:
            self.__x = x
```

## Files and Resource Management, 31 mins

## Shipping Working and Maintainable code, 34 mins
