---
layout: post
title: "Seemann: Dependency Injection in .NET"
---

Source code: http://manning.com/DependencyInjectionin.NET

* Learn what Dependency Injection is
* Learn what kinds of problems it solves
* Learn the patterns for using it
* Look at the various tools which help in applying those patterns


## Chapter 1: A Dependency Injection tasting menu
Code bases need to be maintainable
One way of making a code base maintainable is through loose coupling
Loose coupling makes code extensible, extensibility makes it maintainable
DI is a technique that enables loose coupling
Program to an interface not an implementation
Programming to interfaces is easy, but where do the instances come from - this is where DI comes in
DI injects dependencies from the outside, with constructor injection being the preferred method

### Fallacies about DI
Late Binding: DI enables late binding (implementation chosen at runtime via config) but is ONLY ONE of the many aspects of DI
Unit Testing: Again, relevant, but DI does much more
Service Locator: DI is the opposite of service locator - we don’t ask for dependencies, we force consumers to supply them.
DI Container: optional - without this is sometimes known as poor man’s DI - more work, but doesn’t compromise principles

### Purpose of DI
Liskov Substitution Principle - should be able to replace one implementation of an interface without breaking either client or implementation. One of the most important software design principles for DI.
**Null Object** - replace an implementation with something that does nothing - so as not to break the client
**Decorator** - introduce new features with cross cutting concerns by implementing an interface and and also allowing the original component to plug back into the decorator. e.g. add an implementation which encompasses 
**Composite** - add new functionality to an existing codebase by composing an existing implementation of an interface with a new implementation
**Adapter** - match two related but separate interfaces to each other - useful when using a third party API which needs to be consumed by your application according to a specific interface

### Benefits of DI
**Late Binding** - by injecting a dependency via a constructer, there is only one place which couples these two classes together - where the constructor is called. This then enables late binding by swapping out a hard coded implementation choice, with an implementation choice specified via config.
**Extensibility** - loose coupling allows the application to be recomposed in a different way with minimal changes e.g. by replacing one implementation of a particular interface with another. Open for extensibility, closed for modification.
**Parallel Development** 
**Maintainability** - a known benefit of the single responsibility principle - adding new features becomes simpler because it is clearer where those changes should be applied - more often that not be adding classes and recomposing the application
**Testability** - by coding to interfaces, mocks, test doubles, fakes etc can all be injected easily to limit the testing to the class under test rather than its dependencies

### When to use DI
Not everything needs to be abstracted away and made pluggable. Distinguish between types that pose no danger (stable) and types that may tighten an application’s degree of coupling (volatile).
**Seam** - where a dependency is separated via DI
**Stable dependency** - doesn’t change, backwards compatible, contain deterministic algorithms, isn’t volatile
**Volatile dependency**
	* A dependency which introduces a requirement to set up and configure a runtime environment e.g. databases. LINQ to Entities implies a relational database. Other out of process resources including message queues, web services and the file system.
	* A dependency which doesn’t yet exist
	* A dependency which can’t be installed on all machines (e.g. expensive 3rd party library)
	* A dependency which has non deterministic behaviour e.g. random numbers, or algorithms which depend on the current date or time
Volatile dependencies are the focal point of DI. Introduce seams for these kind of dependencies.

### DI Scope
By removing the responsibility of instantiating a dependency from a consuming class, that class loses control, but the control is not lost, just moved to another place. In doing so there are several benefits:
**Object composition** - closely associated with the original meaning of DI, compose classes into application with greater control
**Object lifetime** - surrendering creation of dependencies also means a class gives up control of when instances are created and when they go out of scope. Dependencies can be shared between consumers. Garbage collection generally means not much of an issue in .NET. Dependencies which implement `IDisposable` become complicated. Something else higher up in the call stack must control the lifetime. 
**Interception** - Prior to injecting a dependency, it can be intercepted and altered. Interception is an application of the Decorator design pattern.
 
> There are many misconceptions about DI. Some people think that it only addresses narrow problems, such as late binding or unit testing; although these aspects of soft- ware design certainly benefit from DI, the scope is much broader. The overall purpose is maintainability.  

> The idea of DI as a service modeled along the lines of a dictionary leads directly to the SERVICE LOCATOR anti-pattern. This is why I put so much emphasis on the need to clear your mind of even the most basic assumptions. After all, when we’re talking about dictionaries, we’re talking about stuff that belongs in the “reptile brain of programming.”  

### DI or IoC
DI is a subset of IoC.
Inversion of Control simply refers to any style of programming where a framework or runtime controls program flow e.g. ASP.NET - where the ASP.NET page lifecycle controls the flow. Nowadays, the term IoC is often used to refer specifically to IoC over dependencies, or Dependency Injection.  However IoC is actually much broader.

## To Read
[Event Sourcing](https://martinfowler.com/eaaDev/EventSourcing.html)
http://blogs.msdn.com/b/nblumhardt/archive/2008/12/27/container-managed-application-design-prelude-where-does-the-container-belong.aspx
Currently, the most promising alternative to n-layer applications is an architectural style related to the Command- Query Responsibility Segregation (CQRS) pattern. For more information, see Rinat Abdullin, “CQRS Starting Page,” http://abdullin.com/cqrs
