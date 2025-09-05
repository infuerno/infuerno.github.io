---
layout: post
title: "Pluralsight: Entity Framework Core 2: Getting Started"
---

# Introduction
Made up of various NuGet package libraries in the `Microsoft.EntityFrameworkCore.*` packages.
## Versions
* EF Core 1.0 June 2016
* EF Core 2.0 August 2017 - lots of changes, first solid version
* EF Core 2.1 May 2018 (Minor update) - important update with lots of new features

## ORMs
Typically, ORMs use the same structure in the classes and the database tables. EF has a mapping layer which gives more flexibility: objects -> tables and object properties -> table columns. **Conventions** are used as a starting point. ![](https://www.dropbox.com/s/bjys3tm3i9zn1vb/Screenshot%202019-12-28%2012.05.53.png?raw=1)
Still need to understand how EF Core works, nuances with tracking changes that need to be persisted to the database and patterns for working with disconnected applications.  
## Available Providers
Include: SQL Server (Microsoft), SQLite (Microsoft, Devart), InMemory (Microsoft), SQL Server Compact, MySQL, Oracle, PostgreSQL, DB2, MyCat, Firebird.

## Open Source
* Available on GitHub under the `aspnet` account
* Tied to the release cycle of dotnet core
* EF Core 2.0 runs on .NET Standard 2.0 (supported by .NET Framework 4.6.1+)

## How EF Core Works
* Write the domain class - nothing to do with EF
* Define the data model based on those domain classes. Write LINQ to entities queries against those classes. Call save changes.
* EF tracks changes, builds and execute SQLs. Manages all the connectivity to the database.
* If there is an existing database, can use scaffolding to generate context and model. From this point on use migrations.
* Tables names are pluralalized by default when mapping from data model classes

## Workflow
* Define domain classes
* Use EF to wrap these domain classes in a model, define how the model maps to the database schema
* Write LINQ to entities using the provider for the chosen database technology
* Can map to views instead of tables
* Can use SPs if query is too difficult to express with LINQ
* EF can keep track of changes as long as the context is in scope (e.g. desktop application). For disconnected apps there are patterns to inform EF of the state of an object when e.g. a web app returns with changes

## EF 6 vs EF Core 1 vs EF Core 2
* EF 6 (2013) moved to CodePlex and became open source. Now moved to GitHub (aspnet group)
* Some features will NEVER come to EF
  * No EDMX/Designer in EF Core (could use DevArt or LLBLGenPro)
  * Database first still works (using the scaffold command), can also use EF Reverse POCO Code First Generator by Simon Hughes
* Basic model remains the same
  * Define a data model with classes and a DbContext.
  * DbContext and DbSets are still there
  * Create and migrate databases as the model changes
  * Query with LINQ to Entities
  * EF tracks changes to entities in memory
  * Will still add and attach entities to the context
  * NEW Update method - automatically set the state to modified
  * SaveChanges still exists to push changes back to the data store
* New features
  * Batch insert, update and delete
  * Specify Unique FKs in entities
  * LINQ queries - allow providers to choose which part of queries are actioned in memory and which in SQL - can then use inline functions - compose LINQ on top of RAW SQL
  * Better disconnected patterns
  * InMemory provider for testing
  * Mapping to backing fields (not just properties)
  * Mapping to IEnumerables
* Differences from EF6 to EF Core
  * `Include` works differently in how it queries for related data
  * Db entry method behaves differently - see August 2016 - Data Points - EF Core Change-Tracking Behaviour
* Updates for EF Core 2
  * Querying
    * EF.Functions.Like()
    * More LINQ run on the database
    * Global filters per type
    * Explicitly compile queries (already in EF 6)
    * `GroupJoin` generated SQL is better (already in EF 6)
  * Mapping
    * Map to UDF scalar functions in the database (already in EF 6)
    * Owned Entities (replaces EF 6 complex type / value object support)
    * Table splitting (already in EF 6)
  * Performance
    * DbContext pooling
    * String interpolation in raw SQL
    * Consolidate logging and diagnostics

# Creating a Data Model and Database with EF Core
1. Define domain models for `Sumurai`, `Battle` and `Quote`. NOTE that
   * `Samurai` has a `List<Quotes>` and `Quote` has a `SamuraiId`
   * Similarly, `Battle` has a `List<Samurai>` and `Samurai` has a `BattleId`
   * Strangely, `Quote` ALSO has a reference to `Samurai` TOO
1. Add NuGet package for provider e.g. SqlServer to add in all other dependencies
2. Add Context class and defined `DbSet`s. By adding a DbSet for each domain class, will be able to query all 3 directly.
3. EF 6 had magic to infer the provider and the database string. in EF Core there is NO MORE MAGIC - must specify the provider and connection string. Need to explicitly set both. 
   * Override the dbContext's OnConfiguring method and use `optionsBuilder.UseSqlServer` to specify the connection string (database doesn't need to exist)
   * The first time the context is instantiated, the OnConfiguring method will be called. The Migrations API will also be able to benefit from this setting.
1. Every time the model changes, a new migration needs to be created.
   * Install the package `EntityFrameworkCore.Tools`
   * Set the start up project to a project which can execute. (if targeting .NET Standard can adjust `TargetFrameworks` in the Samurai.Data .csproj to `<TargetFrameworks>netcoreapp3.1;netstandard2.0</TargetFrameworks>`) 
   * `Get-Help EntityFrameworkCore` to show info on all the migration commands
   * `Add-Migration Initial` to add a new migration (ensure correct Data project picked in PMC dropdown)
   * A Migrations folder is created, a file with the migration code AND a ModelSnapshot.cs is also created which reflects the current database schema - useful when working in teams - NEW TO EF CORE
   * Can use `Script-Migration` to produce a script of migrations - recommended for production databases
   * Database will be created automatically using `Update-Database`, but must be created beforehand when using `Script-Migration`
   * The `EFMigrations` table contains the Migration name. Previously used to contain the snapshot, which created headaches for teams using source control. 

## Use DI container to provide a preconfigured DbContextOptions to set up the DbContext
* Remove `OnConfiguring` method and instead code a constructor which accepts a `DbContextOptions<SamuraiContext>` options object which is sent to the base constructor.  The web app, where the DI container is configured, now has to have access to EF and the provider. In Core 2.1 and before, the NuGet package `Microsoft.AspNet.All` provided all libraries required. In Core 3 it still just works, but need to add EFCore.Design additionally.

## Many to Many relations
* Requires a Join Entity to link them (maps to a Join Table)
* Create a class for the join e.g. `SamuraiBattle` with at least two properties for `SamuraiId` and `BattleId` (and optionally two navigation properties for `Samurai` and `Battle`)
* Need to specify the joint primary key in the `OnModelCreating` method

## One to One relations
* Add a `SecretIdentity` property to `Samurai`. This will be optional (default behaviour - need to use business logic if want to ensure exists)
* Add a `SamuraiId` to `SecretIdentity` (a `SecretIdentity` cannot be parentless)

>The dependent end of a 1 to 1 relationship is ALWAYS optional

# Interacting with EF Core Model
## Logging
* Logging will be added to the context class
* Install Microsoft.Extensions.Logging.Console

```
public static readonly LoggerFactory ConsoleLoggerFactory
 = new LoggerFactory(new[] {
   new ConsoleLoggerProvider((category, level)
    => category == DbLoggerCategory.Database.Command.Name
    && level == LogLevel.Information, true)
});
```
* Then in the options configuration, add the `.UseLoggerFactory()` method to configure with the logger created.

## Inserting
* SaveChanges ALWAYS wraps all commands in a transaction - so if any fail, all will be rolled back
* Use `context.Add` to directly add entities. EF will work out which type of entity is being added. Also works well with `context.AddRange()` to add different types of entities.

## Querying
* `context.Samarais.ToList()` to fetch all `Samurai`s. `ToList()` is a LINQ Execution method
* LINQ Query Syntax can also be used, but would still need to use an execution method at the end e.g. `from s in context.Samurais select s).ToList()`
* The query itself is disconnected from the method which EXECUTES the query
* Alternative to using an execution method is to ENUMERATE the query e.g. using a foreach loop and writing out some information. However a connection is opened at the beginning of the enumeration and stays open until the last result is fetched. This can cause issues if e.g. processing each item is intensive. Advisable to get all entries and THEN process.
* When you use the same context for multiple operations, it will keep track of all operations.

### LINQ to Entities Execution Methods
|Method|Async Method|Notes|
|---|---|---|
|ToList()|ToListAsync()|
|First()|FirstAsync()|
|FirstOrDefault()|FirstOrDefaultAsync()|
|Single()|SingleAsync()|
|SingleOrDefault()|SingleOrDefaultAsync()|
|Last()|LastAsync()|Require query to have an `OrderBy` method
|LastOrDefault()|LastOrDefaultAsync()|Require query to have an `OrderBy` method
|Count()|CountAsync()|
|LongCount()|LongCountAsync()|
|Min()|MinAsync()|
|Max()|MaxAsync()|
|Average()|AverageAsync()|
|Find(key)|FindAsync(key)|Not a LINQ method, but a DbSet method which will execute. If object is already in memory (i.e. being tracked by the context) it won't hit the db, but return that object|

All apart from `ToList()` all perform some kind of aggregation, the logic of which executes on the database

## Simple updates
For connected apps, the entity can be retrieved, updated and the changes saved using the same context. The context is therefore aware of exactly what has changed and can optimised the SQL accordingly by ONLY updating generating update statements for the attributes it knows has changed.

## Disconnected updates
For web applications where an entity is retrieved by one context (and sent to a client browser) and then updated using a different context, EF is NOT tracking this updated entity and therefore has no idea what has changed. In this scenario, the `context.Update()` method needs to be called (EF will start tracking the entity and then set the state to modified). The SQL which is generated has updates for ALL attributes.
### Tools for tracking between Server and Client
* Breeze - Rich data for JS apps <https://getbreezenow.com>
* Trackable Entities - N-Tier support for EF <https://trackableentities.github.io>

## Deletions
These work in a similar way using the `.Remove()` set of methods on either the DbSet OR the context itself. The SQL generated simply deletes the object using the ID. However it is NOT possible to call remove using the ID. Either call remove using the whole object OR use `Find(key)` followed by `Remove()`

## Executing Raw SQL
See previous course for further information.
* Use `context.Database.ExecuteSqlCommand("exec DeleteById {0}", samuraiId)`
* OR use `DbSet.FromSql()` method which replaces `DbSet.SqlQuery` and `DbSet.Database.SqlQuery()`

# Working with Related Data
## Inserting related data
When EF is tracking the parent, it will automatically be tracking the child too. Simply add / update a child and issue SaveChanges for the children to be added / updated. e.g. retrieve samurai, add quote, save changes.

When disconnected and EF is not tracking the parent object, in order to add the child without first retrieving the parent, use the FK SamuraiId property of the child. Best to AVOID the graph when the objects have different states. 

This means having FK properties in child classes BUT they make life MUCH EASIER.
## Loading related data
1. Eager loading
2. Projections
3. Explicit loading
4. Lazy loading (only supported in EF Core 3 +)

### Eager Loading
* Use `Include()`
* Ensure it is used BEFORE any query execution method
* For children AND grandchildren use `Include` and `ThenInclude()`
* To only load grandchildren use `Include` directly specifying the grandchildren e.g. `samurais.Include(s => s.Quotes.Translations)`
* `Include` does not allow you to specify WHICH related data is returned, will simply load ALL children for the parents specified

### Projections
* Usually use `Select` to specify which properties to return, e.g. using an anonymous type e.g. `samurais.Select(s => new { s.Id, s.Name }).ToList()` 
* NOTE can only use the anonymous type in the same method. To return to a different method, use an actual type (e.g. IdAndName struct) OR cast to dynamic e.g. `listOfAnonTypes.ToList<dynamic>()`
* To include related data add this to the projection e.g. `samurais.Select(s => new { s.Id, s.Name, s.Quotes }).ToList()` 
* Can filter the related data in this method e.g. `samurais.Select(s => new { s.Id, s.Name, s.Quotes.Where(q => q.Text.Contains("happy")) }).ToList()` 
* BROKEN. Should then be able to get samurais AND their quotes using a filter e.g. `samurais.Select(s => new { Samurai = s, Quotes = s.Quotes.Where(q => q.Text.Contains("happy")) }).ToList()` 
* WORKING. By simply executing multiple selects on the SAME context, EF will correctly join up the object graph

```
context.Samurais.ToList();
context.Quotes.Where( ...).ToList();
```

THERE IS A LOT MORE TO PROJECTIONS .. (but this is only a Getting Started course)
