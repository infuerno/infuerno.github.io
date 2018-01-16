---
layout: post
title: Pluralsight - C++ Fundamentals
---
## Context
### Modern C++

The standard library contains:
* String class
* Collections (linked list, stack, queue etc)
* Smart pointers which handle memory management for you

Managing memory yourself is _old-school_.

### C++/CLI

C++/CLI is a variant of C++ which makes managed code. 
Visual Studio can compile C++ code either into native code or managed code. Managed code can be easily called from other .NET modules.
Note, choose CLR project to compile to managed code, choose Win32 projects to compile to native code.

### Versions of C++

C++ doesn't belong to anybody. A standards committee decides on updates. First version was C++98 with a small update C++03. Next version was C++11 with a small update C++14.


## Tools
### Visual Studio

Running a console application _without debugging_ automatically give you a 'Press any key to continue...' at the end so you can see all the output before closing the command window.

When creating a new project, click "include pre-compiled header" to include the "stdafx.h" header file to make the application compile faster (not run faster).

### Console Application Structure

`#` preprocessor directives
The preprocessor goes through the code before the compiler and tweaks it a little bit. One thing it does is combines multiple files into one. Put just the definitions of functionality into a header file and then include that header file into each file that needs it.
Includes from the Standard Library do not have the .h on the end.

`::` scope resolution operator as in `std::cout`

## Language Basics

C++ is strongly typed - once a variable is declared as an int, it is always an int.

Fundamental types are built into the language and include int, bool, char.
User defined types include e.g. std::string. They can do everything that fundamental types can do i.e. full participants in the language.

You can see there are red wigglies here. They say: Error: a value of type "const char *" cannot be used to initialize an entity of type "char". The important part of that is probably the word 'Error'.

Fundamental Types on MSDN: <http://msdn.microsoft.com/en-us/library/cc953fe1.aspx>
Data Type Ranges on MSDN: <http://msdn.microsoft.com/en-us/library/s3f49ktz.aspx>

Different types hold different kinds of data with different lengths and different maxiumum values. When assigning doubles to ints, ints to bools, ints to chars etc, there are no runtime errors. However, the compiler knows the different lengths and will help you and issue warnings.

### Casting

Compiler will convert types when they're compatible, with a warning if data might be lost. Error only if they are not compatible.
By casting, the compiler warnings disappear, though this still may lead to trouble. Safer casts available with templates.
Suffixes can be used to show the type of a literal and are a form of casting.

### Overflow

Overflow can happen silently. E.g. char x = 300 will just assign the value 44 to x without error.

## User defined types

### Classes and objects

* When defining a class, don't forget the trailing semi-colon, causes some weird error message on the line after the class declaration.
* Private and public sections (default is private) rather than declaring public or private for each thing.
* Access member variables and functions with `.`
* Access static members and functions with `::`
* To create a class, create two files, .cpp to contain the class and .h to contain the defintion
* Declare the variables and method signatures in the header file and include this in any other file you need to use it (including the .cpp class file).
* Memory is allocated but not initialised when declaring and object.
* Constructors have special initialisation syntax to immediately assign values to the member variables

    Person::Person(string f, string l, int a) : fullname(f), lastname(l), age(a)
    {    
        cout << "Constructing" << firstname << " " << lastname << endl;    
    }

    Person p1("James", "Smith", 23);  // created on the stack

    Person::~Person()
    {
        cout << "Destructing" << firstname << " " << lastname << endl;    
    }

* Every class has a default constructor if none others have been defined
* Objects created as above are created on the stack and automatically cleaned up when the object goes out of scope. If a destructor has been defined, this is automatically called at this point.
* With inheritance constructor of the base class is called first, then the derived class. With destructors it is in reverse.
* Only use `using namespace <e.g. std>` inside the .cpp files and not in the header files

### Enums

Enums in c++ are not prefixed by the name of the enumeration, so have to be unique across all enumerations defined.
Generally just have a header file with the enum defined within.

### Preprocessor

The preprocessor is most often used to include all files required into one file. This is achieved with preprocessor directives such as `#include "Person.h"`. If files are included multiple times, the compiler errors. Rather than keep track of the whole tree of inclusions, just use the `#ifndef` and `#endif` to defined a constant in your header file, which has the effect of thereafter only including that file if the constant hasn't been defined.

`#pragma once` does the same thing for Visual Studio.

## Flow of control

Now a momentary word about bracing style. People have arguments about brace positioning that far exceed the arguments they can have about politics or religion or any other major touch points.

### Switch

`expression`s and `value`s must be integral type or enum

### Functions
* Can take parameters by value or reference.
* Can return by value or reference (careful not to create a 'dangling' reference).
* Passing by reference is used when you want to change something OR when it is expensive to pass by reference even though the variable won't be changed (use the `const` keyword here).
* Dangling reference is created when you return a reference to a variable created within the function. Once the function returns, the variable goes out of scope. The memory contents may remain the same for a while, so the code will seem to work, but at any moment can be overwritten. Compiler will try and warn of this.
* Must have a return type. If none, then keyword `void` is used. Sometimes see this used for paramters when there are no parameters, but not necessary.

#### Free functions

* Declare before used in a header file, which can then be included in multiple places. 
* Functions which aren't part of a class are called global or *free* functions.

#### Member functions

* Often don't take parameters, but work instead on values in the class
* Often don't return values, but store instead the value in the class

#### Inline functions

* Inline functions can be explicitly defined by putting the implemetation in the header file. (Actually the compiler may also decide to make other functions inline.)

#### Error messages

Errors from calling functions tend to come from one of two places:
1. the compiler - have you declared the function (usually in the .h)
2. the linker - have you implemented the function (usually in the .cpp)

For visual studio, the .cpp files in particular MUST be part of the project, not just exist in the folder.

### Immediate if
Much cleaner to use immediate if if applicable: `result = something? 7: 302;`

## Operators

0 matches false, everything else matches true.
Yoda syntax: `if (3==i)` (this is popular because if typo occurs and only one equals sign is entered, in this case there would be a compiler error).

### Bitwise operators

These do the operations bit by bit, `&` and `^`.
Commonly used to save space and time by packing individual bit values into a single number. E.g. if you have an operation which can take 7 different flags, one way is to take 7 different parameters, all alternatively, take a integer, check the lowest 7 bits of that integer to see if the options are on or off. This is implemented using constants (so you don't have to work out which int corresponds to a certain set of options being on). flag1 = 1, flag2 = 2, flag3 = 4, flag4 = 8 etc. Bitwise or them to get your set of options, bitwise and them to check if the option is set or not.

### Bitshift operators

Shifts all the bits along
e.g. 4 >> 1 is 2, 4 << 1 is 8

## Operator overloading

    int i = j + 3;
    Order newOrder = oldOrder + newItem;

* Usually a member function, sometimes a free function (e.g. if you didn't have access to the Order class to change it, of if the first item was e.g. an int)

Examples
* `firstname + " " + lastname` works becuase the `+` has been overloaded by the person who wrote the string class
* `cout << "hello"` works because the bitwise operator `<<` has been overloaded
* In collections and iterators, `++` is often overloaded to move onto the next

### Writing an overload
There are two ways of writing an overload:
1. As a member function of whatever type is before the operator which takes one parameter, the type after the operator. Often, especially with comparison operators, the two types will be the same.

    // myObject < something
    bool MyClass::operator<(OtherType something) 

2. As a free function which takes two parameters. Often if this is a complement to a set of comparison operators on a class which defines comparison to e.g. int, these free function definitions will be included in the class .cpp file.

    // myObject < something
    bool operator<(MyClass myObject, OtherType something)

Since this isn't a member of MyClass, it only has access to public member functions (unless you use `friend`). You can use friend by specifying that the free function is a `friend` inside the class definition. Thereafter the free function can access private member variables. This is one of the few situations where using `friend` is acceptable.

## Templates

* Templates is the way C++ implements genericity. Unlike other languages, templates are resolved at compile time, not runtime.
* Write a class or a function and use it with a variety of types. e.g. typesafe collections
* Often rely on overload functions and can therefore work with both fundamental types and user defined types
* Much of the Standard Library is template based (formerly STL, or Standard Template Library)
* Both function and class templates tends to be implemented all at once in the include file rather than seperate header and .cpp file
* Author of some code which uses templates must ensure that types are compatible with templates chosen (and implement any extra functions required if necessary)
* Note, mostly people *use* templates rather than writing them

### Function templates

The example below works for all types which have defined the less than operator. Note, for those that haven't, the error messages are vague since they will often refer to the implentation and that isn't obvious for the user of a function.

    template <class T>
    T max(T& t1, T& t2)
    {
        return t1 < t2? t2: t1;
    }

* The compiler can usually work out which type to use depending on the type of the operands, but you can specify it if necessary e.g. `max<double>(1.2, 3)` instead of `max(1.2, 3)`

### Class templates

An example of a template class which could take e.g. `int` or `float`

    template <class T>
    class Accum
    {
    private:
        T total;
    public:
        Accum(T start): total(start) {};
        T operator+=(const  T& T) {return total = total + t;};
        T GetTotal() {return total;}
    };

* When instantiating template class, the type must be explicitly stated

    Accum<int> integers(0);
    integers += 7;

* Trying to add a string to the integers object will give a compile time exception (which is what we want with templates)

### Template specialization

Compilers will generate appropriate code from the template for any type you pass it, but you can also specify the code you want if necessary. You may need this if:

* Operator or function is missing 
* Operator of function used by the template has been written in such a way that is not appropriate for this case

* First choice if e.g. operator function is missing - then just add that operator function as a free function (assumption is that you don't have access to change the class code, or that don't want to add in the operator function, maybe doesn't fit)... but someone may have already written it
* Second choice is template specialization (which was often required with c style strings, though less so now). However since templates are such a time saver, if you find one which is good, but not quite right, you'll need to know how to adapt it.

Example of trying to accumulate Person (which doesn't define operator+)

    template <>
    class Accum<Person>
        {
    private:
        int total;
    public:
        Accum(Person start): total(start) {};
        int operator+=(Person& t) {return total = total + t.GetNumber();};
        int GetTotal() {return total;}
    };

1. Take a copy of the template code
2. Remove the `class T` from the template declaration on the first line
3. Add the type fo the class declaration on the second line
4. Replace type T with appropriate types (often the class type, but not necessarily)

## Pointers and references

### Pointers

* A pointer is a variable which holds the address of another variable
* They should either be initialised to an address or 'null', but never just declared
* You can use the pointer to go through it get to the value it is pointing to (or indeed change the pointer to point to something else)
* One way to get one is to take the address of an existing variable.

    int *pA = &A; // note, either int *pA or int* pA works fine, importantly the type is `int *`
    pA = &B; // now points to address of int variable B
    *pA = 5; // change the contents of the memory to 5, B now equals 5
    (*pA*)++; // increment the contents of the memory, new value is 6

* When an `&` is before a variable it means "please take the address of the instance of this variable". (When the `&` is at the end of a type, as e.g. in previous section above, it means an e.g. Person reference)
* To get through the pointer to its target use the `*` operator

    *pA = 5

* If the contents of the memory location is an object, you would need to access the members of the object via the `.` operator which would become `(*pO).SomeMember` or alternatively `p0->SomeMember`
* `->` is pronounced *points to* or *arrow*
* Since pointers are not always initialised to be pointing to something, they can be initialised to "not pointing to anything" and should be. Choices are `0`, `NULL` (which has been defined in an application to point to 0) or `nullptr` (C++11)

### References

C++ got pointers from C, but added references. References are much simpler than pointers, and are like aliases. Unlike pointers, they can't be changed to point to different places, the target is set on declaration and that's that. Also don't have to use different punction (`->`) to talk to the target, just use `.` as normal.

    int& rA = a; // set reference equal to a (hence alias analogy)
    rA = b; // now aliasing b 
    rA = 5; // change value to 5

### Examples of bad programming

    int *badPointer; // declare a pointer, but not pointing to any memory
    *badPointer = 3; // try to dereference the pointer, program blows up

    int *badPointer = nullptr;
    if (badPointer) // this will now resolve to true or false (would still error if try to deref)
    {
        *badPointer = 3;
    }

    int &badReference; // won't compile, has to point to something

### Const

* `const` is a commitment to the compiler that you won't change it
* Used when declaring a local variable `const int zero = 0`
* As a function parameter 
    - `int foo(const int i)` - function won't change the value of i
    - `int something(const Person& p)` - less expensive to pass, if any code in function tries to change, compiler error. This in turn means that any functions which `something` calls on the Person& must also be const functions which state that the values won't change e.g. a GetName() method. They need to be declared as such `int GetName() const;` in both the header and .cpp file.
* *Const correctness* is the term used to get all this inline (can end up following a long thread if left to the end)

### Const and pointers

* `const` can also be used with pointers and has two possible meanings:
    - the pointer is constant and can't chagne it to point to anything else e.g. `int * const cpI;`
    - or it is pointing to something const e.g. `const int *cpI;` in this case you can't change the value of the target.
    - can use both of course: `const int * const cpI;`

### The Free Store

* Often called the heap, since this is how it is implemented, it is used to store longer lived variables.
* Create with `new`
* Tear down with `delete`

### Manual memory management
* Manual memory management is hard with variety of mistakes e.g. delete too soon, delete twice, never delete
* Rule of three
    - Copy constructor
    - Copy assignment operator
    - Destructor

>>>GREAT DEMO OF HOW TO IMPLEMENT WITH MANUAL MEMORY MANAGEMENT<<<

### Smart pointers

* C++11 has a nice range of smart pointers, which do all the manual memory management for you
* They are solid objects which contain a pointer
* When a smart pointer goes out of scope, the destructor calls the delete for you
* Imagine a template class with just one member variable, a pointer. The constructor saves the T* in a member variable, the destructor will delete the T*
* Copying is handled either by prevention OR by keeping a count of the references
* `*` and `->` are overloaded
* All used exactly the same as traditional raw pointers

### Smart pointers in the Standard Library

* `shared_ptr` - reference counted behaves well in collections
* `weak_ptr` - allows you to "peek" at shared_ptr without bumping the reference count
* `unique_ptr` - non copyable

## Pointers and inheritance

* Inheritance in C++ uses pointers
* A pointer to a derived class can be stored as a pointer to a base class instead - if a function takes a pointer to e.g. a BankAccount and you pass it a SavingsAccount that works ok
* When a derived class overrides a function in the base class either implementation could run when the function name is called, depending on if the programmer has marked the function as `virtual` or not (default is not)
* Virtual functions are implemented through a virtual table, so a little more time and memory are used
* Smart pointers work in exactly the same way as raw pointers in inheritance situations
* The `virtual` keyword only needs to be added to the header file of the base class
* Careful that if there any methods which are virtual then also ensure to make sure that the destructor is virtual too

### Slicing

Slicing occurs when you pass objects by value and you pass e.g. a SavingsAccount when a function or object is expecting a BankAccount. The memory allocated is only enough for the BankAccount so anything extra in SavingsAccount is lost OR the copy will fail.

To avoid slicing always use references or pointers.

    Tweeter localT("Local", "Tweeter", 123, "@local")
    Person localP = localT; // slicing occurs, twitter handle gets lost
    cout << localP.GetName() << endl; // calls the Person version of the GetName() function

    // fix with pointers (make Person and pointer, to the address of localT and dereference to call GetName())
    Tweeter localT("Local", "Tweeter", 123, "@local")
    Person *localP = &localT; // slicing occurs, twitter handle gets lost
    cout << localP->GetName() << endl; // calls the Person version of the GetName() function

    // fix with references (just declare localP as Person&)
    Tweeter localT("Local", "Tweeter", 123, "@local")
    Person& localP = localT; // slicing occurs, twitter handle gets lost
    cout << localP.GetName() << endl; // calls the Person version of the GetName() function


### Cast operators

* `(type)` is one way, C style, but dangerous
* `static_cast<type>` uses a template and resolves at compile time and may give a warning (or error) but up to you to ensure it's safe
* `dynamic_cast<type>` is much better
    - works with pointers to classes with virtual tables
    - Uses a dynamic check at run time on the virtual table
    - will give a null back if it fails which you can check for
    - Note, casting e.g. a reference will fail
* `const_cast`, `reinterpret_cast` etc are dangerous

