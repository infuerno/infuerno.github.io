---
layout: post
title: "Pluralsight: The Go Programming Language, John Sonmez"
---
## Overview

* Compiled - down to machine code
    - Fast compile times, mainly due again to simplicity
* Garbage Collected - no performance hit - latency free
* Concurrent - passing data instead of sharing data
* Static
    - Efficient like a static language, ease of use like a dynamic language - achieved by keeping Go very simple
    - Type safe and memory safe - an int is always an int - can't point to the wrong memory location
* No inheritance - often better to use composition over inheritance
* No generic programming (currently...)
* No assertions (developer crutch)
* No method overloading - makes it faster to compile
* Go Interfaces - implicitly implemented
* No classes - only user defined types
* Systems level language - but otherwise not really similar to C and C++

### References

* https://github.com/nsf/gotris/blob/master/gotris.go
* https://golang.org

### Text Editors

* http://go-ide.com
* http://go-lang.cat-v.org/text-editors/

### Development setup

* $GOROOT is an environment variable set by the installer
* $GOPATH is set to ~/go by default, but can be overidden - root of your go workspace
* `go run hello.go` will run the given file
* `go build hello.go` will create an executable in the current directory
* `go install hello` will create an executable in the `bin` directory

## Variables, Types and Pointers

http://golang.org/ref/spec

* Basic Types:
    - bool
    - string
    - int, int8, int16, int32, int64 - int size depends on the architecture e.g. 32bit on 32bit machine - int and int32 are not compatible
    - uint, uint8, uint16, uint32, uint64, uintptr
    - byte (uint8) - byte and uint8 ARE compatible
    - rune (int32), like char
    - float32, float64
    - complex64, complex128

* Other Types:
    - Array, Slice, Struct, Pointer (points to a memory address), Function (can be stored, passed, treated just like any other data type), Interface, Map (key, value pair), Channel (used for communication between go routines)

### Variables

* `var message string` where the type is declared after the variable name
* `var a, b, c int` to declare multiple variables of the same type
* `var message string = "hello"` to initialise at the same time as declaration
* `var a, b, c int = 1, 2, 3` to initialise multiple variables
* `var a, message, c, flag = 1, "hello", 3, true` go infers types if not specified
* `a, message, c, flag := 1, "hello", 3, true` can shortcut initialisation using `:=` inside a `func`

### Pointers

* A pointer is a variable which contains the memory address of another variable
* The type of a pointer refers to the type which the pointer points to e.g. 'pointer to a int', 'pointer to a string'
* Even though these pointers will all hold addresses, a pointer is always scoped to a particular type and can't change
* Any parameters which are passed to functions in Go are copied
    - ints will be passed by value and changes to the variable inside the function will NOT effect the value of the original int
    - pointers to ints are also passed by value and copied, but will nevertheless still point to the same memory location as before and dereferencing and changing the value will change the value of the int the pointer is pointing to

### User Defined Types

* `type Salutation string` the user defined type 'Saluation' is simply a string - methods could then be added to the Saluation type (see later)
```
// capital S means this type is publically visible
type Saluation struct { 
    name string 
    greeting string
} 

func main() {
        var x Salutation = Salutation {"bob", "hyas"} // OR
        var x = Salutation {"bob", "hyas"} // OR
        x := Salutation {"bob", "hyas"}
}

```

### Constants

* `const PI = 3.14`
* `const Language = "GO"`

```
// here A would be equal to 0, B to 1 and C to 2
const (
    A = iota
    B = iota
    C = iota
    D // don't need to repeat after the first one
)

```

## Functions

* Multiple return values - in other languages you often need to choose between throwing an exception or returning an error code. If you choose to return an error code, you often can't return anything else, but in Go you can return multiple values.
* Functions are treated just like any other type: pass them into other functions, declare as variables, return from functions - similar to delegates in C# or JavaScript functions
* Go supports function literals - declaring a function inside another function, remembers the context of that other function - aka closure
* Parameter types are writen after the parameter name e.g. `CreateMessage(name string)`
* If all parameters are of the same type, as in variable declaration, just specify at the end e.g. `CreateMessage(name, greeting string)`
* Specify a return type after the parameters e.g. `CreateMessage(name, greeting string) string`
* If returning multiple values specify multiple types in brackets e.g. `CreateMessage(name, greeting string) (string, string)`. Return both types together
* Assign return types thus `message, alternative := CreateMessage("bob", "hello")`
* If you don't need all the return types, then Go will complain if you assign to a variable, but then don't use it. Instead use `_` e.g. `_, alternative := CreateMessage("bob", "hello")`
* The return values can also be named in the function declaration - simply set the vars inside the message body and then return with the keyword by itself i.e. `return`

### Variadic functions

* A function which has a variable number of parameters of a certain type 
* Specified using `...` e.g. `CreateMessage(name string, greeting ...string)`
* Use `len(greeting)` to find the length of a slice

### Function types

* Functions can be passed just as any other type e.g. `Greet(s Salutation, do func(string)` where the function passed for the second parameter would have to be a function which took a single string parameter with no return type
* The function type can also be declared e.g. `type Printer func(string) ()` where the empty final brackets indicate no return type. Now the method signature for `Greet` can be `Greet(s Salutation, do Printer)`

### Closures

A function which returns a function

```
func CreatePrintFunction(custom string) Printer {
    return func(m string) {
        fmt.Println(m + custom)
    }
}
```

This is a closure since the function which is returned has the `custom` variable hard coded in its definition, yet it can be changed each time the outer function itself is called

Examples of function usage (advanced): https://golang.org/doc/codewalk/functions/

## Branching

* `if` statements can have an optional assignment e.g. `if x := 1; isFormal { ...` which is scoped to the if statement
* `switch` statements 
    - do not fall through by default - so no need for break statements - use `fallthrough` keyword to override (will fallthrough to next statement even if case doesn't match)
    - can have a list of matches e.g. `case "Joe", "Mary" : prefix = "Dr"`
    - don't something to switch on, cases can be an expression e.g. instead of `switch name { ...` just have `switch { ...` where each case statement now has to be boolean e.g. `case name == "Joe", name == "Mary"`  - cleaner than lots of if..else..else statements
    - can switch on types rather than the value of a variable e.g. `switch x.(type)` will switch on the type of x, test using `case int:` etc

## Loops

* `for` is the only loop - by leaving omitting optional elements can recreate **while** loops and can recreate **foreach** loops using range
* `for condition { ...` where condition is evaulated each time and the loop continues while true = while loop
* `for init; cond; post { ...` usual for loop
* `for { ...` is also valid, effectively an infinite loop you'd have to break out of
* `break` and `continue` keywords work as expected
* `for a, b := range collection` allows you to iterate over a collection without having to index into the collection. For strings, arrays and slices `a` is the index and `b` is the item in the collection. Works for:
    - array or slice
    - string - over each `rune` in a `string` 
    - map - over each key value pair e.g. `for key, value := range myMap { ..`
    - channel - waiting for data - communication between threads or Go routines

http://golang.org/doc/effective_go.html#for
http://golang.org/ref/spec#For_statements

## Maps

* Data structure which maps keys to values - called dictionaries in some languages - key must be unique
* Reference types
* Keys must have the equality operator defined (most do, but maps and slices don't)
* Maps are not thread safe - avoid using maps concurrently
* Declare using `var myMap map[string]string` where `[string]` denotes the type of the key and `string` the type of the value
* Initialise using `make` e.g. `myMap = make(map[string]string)` to allocate memory for it
* Can alternatively be declared, initialised and defined in one statement:

```
myMap := map[string]string {
    "Bob": "Mr",
    "Jane": "Mrs",
}
```

* Operations on maps include:
    - insert or update e.g. `myMap["BoB"] = "Mr"`
    - delete e.g. `delete(myMap, "Bob")` - works fine even if the key doesn't exist
    - check for existence - optional assignment in `if` statement can be used: `if prefix, exists := myMap["Bob"]; exists { ...`

## Arrays

* Fixed size
* The size and the type of elements stored are both part of the array's **type** - this means that to use an array for a paramter it would need to be of the specific size AND type to compile
* Array is zeroed when defined e.g. if array of ints, values are set to 0
* Value type 

## Slices

* Fixed size - but can be reallocated with append
* Type is slice of underlying type - length is not part of the type (unlike arrays)
* A slice effectively wraps an array and is in effect a pointer to an array
* Reference type which points to an array
* Use `make` to initialise otherwise nil - specify length (and optionally capacity) e.g. `var slice []int = make([]int, 3)`
* Can declare, initialise and define at the same time e.g. `slice := []int {1, 2, 3, 4, 5}` 
* Common to slice a slice e.g. `slice = slice[1:2]` specifying start index inclusively and end index exclusively
    - can omit the start index or the end index e.g. `slice[:3]`
* Append elements to a slice using `append` e.g. `slice = append(slice, 7)`
    - can append multiple elements e.g. `slice = append(slice, 7, 8, 9)`
    - can append a slice by 'expanding' it e.g. `slice = append(slice, slice...)`
* Delete the nth element using append e.g. `slice = append(slice[:n], slice[n:]...)` (no delete function)

## Methods

* There are no classes in Go, only structs. Methods (cf functions) declare what type they can operate as well as having parameters and return types, like functions
* Methods can only be created on named types - though can simply redefine e.g. an int as a named type e.g. `type myInt int`
* Methods can also operate on pointers to named types - in this way the underlying type can be modified (can't be modified if the method is defined on the type itself)

## Interfaces

* Don't need to specify that a named type "implements" an interface
* Just need to ensure all the methods specified on the interface are defined and implemented
* An empty interface is one that doesn't specify an methods that need implementing - every type will effectively then implement this interface

## Concurrency
