---
layout: post
title: "Test-Driven Infrastructure With Chef"
---
##  References

* <Ruby quick reference by Ryan Davis|http://zenspider.com/Languages/Ruby/QuickRef.html>
* <www.infrastructures.org>
* History of Ruby <http://bit.ly/18FHd3p>

## The Philosophy of Test-Driven Infrastructur

Need to ensure that infrastructure code is written with the same care as application code including coding standards, reviews and testing.
Robert C. Martin in, Clean Code: A Handbook of Agile Software Craftsmanship - first do no harm. Ensure that by taking action you are not making the situation worse.
* Functional harm: introducing bugs
* Structural harm: making software harder to change

Testing takes time, so it is important to automate it. Writing good tests for code is hard, so it is also important to write code which is easy to test.

## An Introduction to Ruby

Everything is an object, even `nil`.
There are 4 main identifiers: 
* variables (of which there are 4 types: local - begin with lowercase or underscore, instance - begin with `@`, class - begin with `@@`, global - begin with `$` and have cryptic names e.g. `$!` - exception object)
* constants - begin with uppercase
* keywords
* methods - can end in `?`, `!` or `=` and also possible to have methods called e.g. `[]` or `<=>`
