---
layout: post
title: "Pluralsight: Entity Framework in the Enterprise"
---

## Contents

Course Overview - 1m 52s
Architecting a Data Layer - 29m 41s
Understanding EF Encapsulation and the Great Repository Debates 21m 53s
Implementing Encapsulation Patterns with Entity Framework- 46m 17s
Managing Complex Domains and Data Models - 41m 46s
Refactoring into Bounded Contexts: A Walkthrough - 27m 32s
Handling the State of Disconnected Graphs - 14m 34s
Mapping DDD Domain Models with EF - 51m 25s
Testing Your Apps When Entity Framework Is Involved - 46m 56s

## References

* Automated testing for Fraidy cats like me
* C# Fundamentals with Visual Studio 2015
* Domain Driven Design Fundamentals
* SOLID Principles of OO Design by Steve Smith
* How EF6 Enables Mocking DbSets More Easily
* https://domainlanguage.com/ddd/

### Others
* Object Oriented Programming fundamentals in C# by Deborah Kurata
* Encapsulation and SOLID by Mark Seeman

## Understanding EF Encapsulation and the Great Repository Debates

* Should we use repositories with EF? What other encapsulation patterns are there?
* Should queries return `IQueryable` or `IEnumerable`?

* Dealing with disconnected data are is different between single objects and graphs, especially when persisting the data
	* Useful to work with the objects in different ways e.g. `CustomerData` class and `CustomerWithOrdersData` class.
	* For consumers, helpful because the don't have to worry about getting a graph when wanting a single type or vice versa


## Implementing Encapsulation Patterns
### Logging in Tests

* For more information about **Logging** watch EF6 Ninja Edition, Improved Database Interaction module

```
[TestClass]
public class GenericRepositoryIntegrationTests {
    private StringBuilder _logBuilder = new StringBuilder();
    private string _log;

    public GenericRepositoryIntegrationTests() {
	  //...
      SetupLogging();
    }

    private void WriteLog() {
      Debug.WriteLine(_log);
    }

    private void SetupLogging() {
      _context.Database.Log = BuildLogString;
    }

    private void BuildLogString(string message) {
      _logBuilder.Append(message);
      _log = _logBuilder.ToString();
    }
}
```

### Non-tracking alternative to generic FindById

* Queries shoud be implemented using `AsNoTracking()` in disconnected scenarios
* Find is called on a DbSet, but uses tracking (in fact checks the cache first). NOT performant. Instead could use `SingleOrDefault`. However, since repo is Generic, lamda expression to identify entity doesn't know the attributes.
	* Create `IEntity` interface with an `Id` property and adjust GenericRepository: `public class GenericRepository<TEntity> where TEntity : class, IEntity`
	* If instead the key names are e.g. `CustomerId`, `ProductId` etc - may have to build the lamda dynamically (ouch!)
	* For composite keys, generic repositories are probably NOT the right way to go

### Add Eager Loading

* Useful to have further repository methods to include related data e.g. `FindByInclude` and `AllInclude`

### Dependency Injection with StructureMap

* Dependency Injection - DI, loose coupling, dependencies are pushed in from somewhere else rather than **new**ed up. Super useful for testing
* Inversion of Control - define who is in control of instantiating dependencies. Use an IoC container
* See the SOLID principles of OO Design course for more details
* Install-Package StructureMap
* Install-Package StructureMap.MVC5 - takes care of wiring up the StructureMap container into an MVC5 application (note not updated for StructureMap 4, so needs to be installed afterwards / seperately)
* Creates a new folder `DependencyResolution`, as well as `StructuremapMvc.cs` in the App_Start folder. The `StructuremapMvc` class gets run due to attributes which hook it up to the `PreApplicationStart` lifecycle event.
* Main configuration for rules for the container is in `DefaultRegistry.cs`
* Built in conventions cover some use cases e.g. adding `Example` for `IExample`
* The "closed generic" `GenericRepository<Customer>` will also be taken care of
* The DbContext needs to be explicitly added e.g. `For<DbContext>().Use<OrderSystemContext>().Transient();
* Needed to add the following to get the older version of StructureMap.Mvc5 to work with StructureMap since the `ScanTypes` method needs to be implemented with the new version

```
// inside ControllerConvention.cs

public void ScanTypes(TypeSet types, Registry register) {
	types.AllTypes().ForEach(type => {
		if (type.CanBeCastTo<Controller>() && !type.IsAbstract) {
			registry.For(type).LifecycleIs(new UniquePerRequestLifecycle());
		}
	})
}
```

* To only use e.g. `OrderSystemContext` with certain repository classes, can use the following registry code:

```
For(typeof(GenericRepository<>))
  .Use(typeof(GenericRepository<>))
  .Ctor<DbContext>().Is(new OrderSystemContext());
```


