---
layout: post
title: "Jon Skeet: C# In Depth 4th Edition"
---

### References

> This book is dedicated to equality, which is significantly harder to achieve in the real world than overriding Equals()and GetHashCode().

Book website: https://csharpindepth.com
Publishers website: https://www.manning.com/books/c-sharp-in-depth-fourth-edition

# Part 1: C# in context

## Chapter 1: Survival of the sharpest

### A helpful type system

Statically typed languages help show intent in large programs.

- Evolution includes: generics (C#2), nullable types (C#2), immutable structs (C#7), nullable reference types (C#8) i.e. any reference type not explicitly marked nullable, can't be null
- Anonymous types and `var` (both C#3) reduced verbosity. Anonymous types are useful if you need a particular data shape within a method, but nowhere else, often used for LINQ. They only help within a single block of code however - they can't be used in parameters OR return types.
- Tuples (C#7) and the ability to name elements means they could be used instead of anonymous types in some cases and CAN be used in params or return types
- Record types (C#8) are essentially named anonymous types

### Concise code

C#’s features allow you to reduce **ceremony**, remove **boilerplate** code, and avoid **cruft**.

- Method group conversions and anonymous methods (C#2) for writing delegates more concisely.
- Lamda expressions (C#3) for delegate with even shorter syntax
- Object and collection initialisers from LINQ where properties can be set inline during initialisation
- Automatically implemented properties (C#3, improved in later versions)
- Expression-bodied members (C#6) for when a method or property is a single expression, using `=>` syntax: `member => expression`
- Caller information attributes (C#5) for diagnostics and debugging where a method can receive information about the calling method, namely: the method name, the line number and the file path at compile time

### Data access with LINQ

- Query expressions - compile-time checking, intellisense, efficient database queries
- Expression trees for querying out of process data (e.g. SQL server)
- LINQ encourages thinking about data transformations in terms of functional programming

### Asynchrony

- `async` and `await` (C#5) allowing the writing of asynchronous code, which looks similar to more familiar synchronous code

# Part 2: C# 2-5

## Chapter 2: C# 2

C# 2 was released with Visual Studio 2005 and .NET 2.0. Important features were generics, better constructs for writing both delegates and iterators.

### Generics

General purpose code which is type safe at compile time. Mainly used in collections, delegates (particularly LINQ), async code with `Task<T>` and nullable value types.

- **Parameter**: a method declares its inputs as **parameters**
- **Argument**: these are provided by the calling code in the form of **arguments**

Generics has **type parameters** and **type arguments**, same idea but applied to types.

- Generic classes - generic type declared immediately after the name of the class in angle brackets e.g. `public class Car<T>`. Methods within the class can be expressed with parameters and return types in terms of `T`.
- Generic methods - a generic method declares type parameters immediately after the name of the method in angle brackets which can be used in other parts of the method signature, the parameters or return type e.g.
- Generic classes can implement generic interfaces by using the type declared by the class
- Classes and methods with the same name, but a different "arity" of type parameters is ok e.g. `class Car<T>` and `class Car<T1, T2>`
- Enums **can't** be generic, but classes, structs, interfaces and delegates can be
- Methods **can** be generic, but fields, properties, indexers, constructors, events and finalizers can't be
- If the type(s) of a generic method can be inferred from the type of the arguments (where the type is used in specifying the parameters) then you don't need to specify the type when calling the method. If there are multiple type arguments, need to either specify none or all.
- Only methods allow type inference, so static factory methods can be useful to create types more easily e.g. see `Tuple` https://referencesource.microsoft.com/#mscorlib/system/tuple.cs,9124c4bea9ab0199 - then allows writing `Tuple.Create(10, "x", 20)` instead of `new Tuple<int, string, int>(10, "x", 20)`
- If type inference fails, explicitly specify or cast arguments e.g. `Tuple.Create(10, (string)null, 50)`
- Constrain generic type arguments to certain types using `where` e.g. to ensure elements of type `T` implement `IFormattable` declare the method: `void PrintItems<T>(List<T> items) where T : IFormattable`. This additionally allows any `IFormattable` methods to be called on this input.
- `default()` is useful when dealing with generics in methods e.g. `T x = default(T);`
- A type of `` System.Collections.Generic.List`1[System.Int32] `` means a generic type of `List` with arity 1 (one type parameter) and the type of that argument is `System.Int32`
- the `typeof` operator ONLY can also take an argument e.g. `typeof(List<>)` and refers to the generic type definition itself. Add commas to indicate multiple arguments e.g. `typeof(Dictionary<,>)` or `typeof(Tuple<,,,>)`

### Nullable value types

A nullable type encapsulates the value and a flag. At the core is the `public struct Nullable<T> : where T : struct` struct.

- Can be used with primitive types, enums, system-provided structs and user-defined structs
- Type `T` is the "underlying type" of `Nullable<T>` (i.e. `int` is the underlying type of `Nullable<int>`)
- Boxing behaviour of value types and nullable value types is different. A nullable value type has no "boxed" form - it is simply either null or the boxed form of the underlying value
- Strange note - calling GetType() on a value type variable requires it to be boxed first
- Using `?` is completely equivalent to using `Nullable<T>` e.g. `int?`, `Int32?`
- When a nullable value type is `null`, the value is `null` and the `HasValue` property is false i.e. `int? x = new int?()` and `int? x = null` are equivalent (and `x.HasValue` will return false, NOT throw a null reference exception)
- `as` could additionally be used with nullable value types in C#2 (check out pattern matching for C#7 onwards)
- `??` can be used to assign to a value type IF one side is also a value type

With regards to the fact that trying to access the value of a nullable value type which doesn't have a value will throw an exception:

> I think it’s important enough to restate: progress doesn’t come just from making it easier to write correct code; it also comes from making it harder to write broken code or making the consequences less severe.

### Simplified delegate creation

> The basic purpose of delegates is to encapsulate a piece of code so that it can be passed around and executed as necessary in a type-safe fashion in terms of the return type and parameters.

- A delegate is essentially a function contained in an object - allows you to specify a sequence of actions to be execute at a later time
- Four parts to delegates:
  - A **delegate type** needs to be declared e.g. `delegate void StringProcessor(string input)` - this delegate type can point to any method which takes one string parameter and doesn't return anything
  - The code to be executed must be contained in a method (either an existing one, or by writing a new one)
  - A delegate instance must be created - exact form depends on whether method is instance or static
  - The delegate instance must be invoked - a method `Invoke` is always present in the delegate with the same parameters and return type as delgate type declaration e.g. `delegateX.Invoke("hey")`
- Shorthand exists to omit the call to `Invoke` by treating the delegate variable as a method e.g. `delegateX("hey")`
- Delegates tended to be used for event handling or starting threads in C#1 and also in C#2. LINQ in C#3 made delegates and passing functions around more commonplace
- Method group conversions simplify specifying a delegate instance from `var proc = new StringProcessor(PrintString)` to `StringProcessor proc = PrintString;`
- Anonymous methods preceeded lamda expressions and allowed specifying a delegate instance without having to have a separate method e.g.

```
StringProcessor proc = delegate(string input) { Console.Write($"{input}") }
```

### Iterators
