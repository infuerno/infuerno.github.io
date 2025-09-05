---
layout: post
title: "Head First Design Patterns"
---
### References

* Source code: https://resources.oreilly.com/examples/9780596007126

## Intro

To learn effectively this book uses many different techniques:
* Pictures - the brain is tuned for visuals not text
* Redundancy - the same thing is presented in different ways using different media types and engaging multiple senses
* Unexpected content using emotion and humour - the brain is tuned for novelty
* Conversational style - the brain pays more attention if it thinks it is in a conversation
* Activities - doing rather than just reading
* Multiple learning styles - e.g. step by step vs big picture
* Both sides of the brain
* Stories - the brain is forced to think more deeply when forced to evaluate or judge
* Challenges and asking questions
* People in examples - the brain pays more attention to people rather than things
* 80/20 - cover just the main points

## 1 Welcome to Design Patterns: an introduction p1

Design 1: SimUDuck with a simple inheritance hierarchy of abstract `Duck` and concrete `MallardDuck`, `RedheadDuck`, `RubberDuck`, `DecoyDuck`.

Problem: Adding `quack`, `swim`, `display`, `fly` methods to the abstract class is useful but some behaviours do not apply to all ducks.

Design 2: Add `swim` and `display` to the abstract class, and make `Flyable` and `Quackable` interfaces for applicable ducks ONLY to implement.

Problem: Although ducks that don't fly or quack don't now have inapplicable behaviours, the code reuse is lost for all ducks that DO fly or DO quack.

> DESIGN PRINCIPLE  
> Identify the aspects of your application that vary and separate them from what stays the same.


As simple as this concept is, it forms the basis for almost every design pattern. All patterns provide a way to let some part of a system vary independently of all other parts.

Solution: Encapsulate different types of flying and quacking behaviour with the goal to:
* assign behaviours to _instances_ of Duck i.e. one `MallardDuck` has a different flying behaviour to another `MallardDuck`;
* be able to change the behaviour at runtime.

> DESIGN PRINCIPLE  
> Program to an interface, not an implementation. (Here interface is a concept implying supertype which can be an interface OR abstract class.)

Use an `IFlyBehaviour` interface and an `IQuackBehaviour` interface which different behaviours need to implement. Duck classes no longer implement behaviours directly but _delegate_ them. Instance variables in the Duck class reference the behaviour required (can vary by instance AND be updated at runtime). The `quack` and `fly` methods can still be included and use the behaviour instance variables.

Each `Duck` HAS-A `FlyBehaviour` and a `QuackBehaviour` to which it delegates flying and quacking. This design uses composition over inheritance.

> DESIGN PRINCIPLE  
> Favour composition over inheritance.

Design Patterns enable a shared vocabulary and elevate thinking about architectures to the pattern level, not the nitty gritty object level.

> STRATEGY PATTERN  
> The Strategy Pattern defines a family of algorithms, encapsulates each one, and makes them interchangeable. Strategy lets the algorithm vary independently from clients that use it.

### Strategy Pattern (from refactoring.guru)
![Strategy Pattern](https://www.dropbox.com/s/hl41wxsxvo70v9v/refactoring-guru-patterns-strategy.png?raw=1)

1. The `Context` maintains a reference to one of the concrete strategies and communicates with this object only via the strategy interface.
2. The `Strategy` interface is common to all concrete strategies. It declares a method the context uses to execute a strategy.
3. `Concrete Strategies` implement different variations of an algorithm the context uses.
4. The context calls the execution method on the linked strategy object each time it needs to run the algorithm. The context doesn’t know what type of strategy it works with or how the algorithm is executed.
5. The `Client` creates a specific strategy object and passes it to the context. The context exposes a setter which lets clients replace the strategy associated with the context at runtime.

#### Advantages

* Swap algorithms used inside an object at runtime.
* Isolate the implementation details of an algorithm from the code that uses it.
* Replace inheritance with composition.
* Open/Closed Principle. Introduce new strategies without having to change the context.

#### Disadvantages

* Clients must be aware of the differences between strategies to be able to select a proper one.
* A lot of modern programming languages have functional type support that lets you implement different versions of an algorithm inside a set of anonymous functions. Then you could use these functions exactly as you’d have used the strategy objects, but without bloating your code with extra classes and interfaces.

## 2 Keeping your Objects in the know: the Observer Pattern p37

> DESIGN PRINCIPLE  
> Strive for loosely coupled designs between objects that interact.

### Observer Pattern (from refactoring.guru)

Observer is a behavioural design pattern that lets you define a subscription mechanism to notify multiple objects about any events that happen to the object they’re observing.

The object with the interesting state is called the **subject** or **publisher**. Other objects wanting to track the state are **observers** or **subscribers**. Subscribers must implement the same interface and the publisher interact via the interface only. The interface declares the notification method which the publisher calls and the subscribers implement.

![Observer Pattern](https://www.dropbox.com/s/d97jssseqfg6tcq/refactoring-guru-patterns-observer.png?raw=1)

1. The `Publisher` issues events of interest to other objects. These events occur when the publisher changes its state or executes some behaviours. Publishers contain a subscription infrastructure that lets new Subscribers join and current subscribers leave the list.
2. When a new event happens, the publisher goes over the subscription list and calls the notification method declared in the subscriber interface on each subscriber object.
3. The `Subscriber` interface declares the notification interface. In most cases, it consists of a single `update` method. The method may have several parameters that let the publisher pass some event details along with the update.
4. `Concrete subscribers` perform some actions in response to notifications issued by the publisher. All of these classes must implement the same interface so the publisher isn’t coupled to concrete classes.
5. Usually, subscribers need some contextual information to handle the update correctly. For this reason, publishers often pass some `context data` as arguments of the notification method. The publisher can pass itself as an argument, letting subscriber fetch any required data directly. (Less flexible would be to pass the publisher to the subscriber in the constructor.)
6. The Client creates publisher and subscriber objects separately and then registers subscribers for publisher updates.

## 3 Decorating Objects: the Decorator Pattern p79

Inheritance is typically overused. Alternative approach is to decorate classes at runtime using object composition.

> DESIGN PRINCIPLE  
> Open-Closed principle. Classes should be open for extension, but closed for modification.

Goal is to design classes so they are easily extendable - can incorporate new functionality without changing existing code. There are techniques to allow this - but don't overuse them as this will lead to unnecessarily complex code.

> DECORATOR PATTERN  
The Decorator Pattern attaches additional responsibilities to an object dynamically. Decorators provide a flexible alternative to subclassing for extending functionality.

### Decorator Pattern (from refactoring.guru)

Decorator is a structural design pattern that lets you attach new behaviours to objects by placing these objects inside special wrapper objects that contain the behaviours. Wrapper is the alternative nickname for the Decorator pattern that clearly expresses the main idea of the pattern.

Use the pattern when it’s awkward or not possible to extend an object’s behaviour using inheritance. Many programming languages have the `final` keyword that can be used to prevent further extension of a class. For a final class, the only way to reuse the existing behaviour would be to wrap the class with your own wrapper, using the Decorator pattern.

![Complex stacks of decorators](https://www.dropbox.com/s/m4cc3kbnwic5uqb/refactoring-guru-patterns-decorator.png?raw=1)

Client code needs to wrap the original object in more and more layers, such that the resulting objects are structured somewhat like a stack.

![Decorator pattern](https://www.dropbox.com/s/ljvbq10r5oqj5w9/refactoring-guru-patterns-decorator2.png?raw=1)

1. The `Component` declares the common interface for both wrappers and wrapped objects.
2. `Concrete Component` is a class of objects being wrapped. It defines the basic behaviour, which can be altered by decorators.
3. The `Base Decorator` class has a field for referencing a wrapped object. The field’s type should be declared as the component interface so it can contain both concrete components and decorators. The base decorator delegates all operations to the wrapped object.
4. `Concrete Decorators` define extra behaviours that can be added to components dynamically. Concrete decorators override methods of the base decorator and execute their behaviour either before or after calling the parent method.
5. The `Client` can wrap components in multiple layers of decorators, as long as it works with all objects via the component interface.

## 4 Baking with OO goodness: the Factory Pattern p109

The **Simple Factory Pattern** is where an object which has one `Create` method. This object is responsible for creating types. Simple Factory often uses a static `Create` method for this. However, this means you can't subclass or change the behaviour of the create method.

However this is NOT the full factory pattern. The **Factory Pattern** defines an interface for the `Create` method, such that different implementations of `Create` can be given, with the consuming object referencing only the interface.

The **Factory Method Pattern** is also a common pattern where an abstract class has an abstract `Create` method which is implemented in the subclass. Additional code is usually implemented in the abstract creator method to make use of the concrete class created by the subtype.

Example: `PizzaStore` is the abstract interface with one method `CreatePizza`. Subclasses of `PizzaStore` e.g. `NYPizzaStore` create pizzas appropriate for that area and decide which concrete `Pizza` class to create e.g. `NYStyleCheesePizza`.

> DESIGN PRINCIPLE  
> Depend upon abstractions. Do not depend upon concrete classes.

Guidelines to strive for if possible (won't always be):
1. No variable should hold a reference to a concrete class
2. No class should derive from a concrete class (only from abstractions)
3. No method should override an implemented method of any of its base classes

The **Abstract Factory Pattern** provides an interface for creating families of related or dependent objects without specifying their concrete classes. Concrete factories often use factory methods to create concrete types.

Example: `PizzaIngredientFactory` is an abstract factory containing methods for creating families of objects i.e. the ingredients needed to create a pizza e.g. `CreateSauce()`, `CreateDough()` etc. A concrete subclass e.g. `NYPizzaIngredientFactory` implements the methods to create these ingredients e.g. `CreateSauce()` instantiates `MarinaraSauce` for NY style pizza.

## 5 One of a Kind Objects: the Singleton Pattern p169
## 6 Encapsulating Invocation: the Command Pattern p191
## 7 Being Adaptive: the Adapter and Facade Patterns p235
## 8 Encapsulating Algorithms: the Template Method Pattern p275
## 9 Well-managed Collections: the Iterator and Composite Patterns p315
## 10 The State of Things: the State Pattern p385
## 11 Controlling Object Access: the Proxy Pattern p429
## 12 Patterns of Patterns: Compound Patterns p499
## 13 Patterns in the Real World: Better Living with Patterns p577
## 14 Appendix: Leftover Patterns p611
