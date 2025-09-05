---
layout: post
title: "Pluralsight: Getting Started with Entity Framework 6"
---

## Notes

- Latest version is EF 6.4 (release Dec 2019)
- EF 6.3 upwards can be used in EF Core applications (why would you?)

## Resources

- O'Reilly: Programming Entity Framework by Julie Lerman
- O'Reilly: Programming Entity Framework Code First by Julie Lerman
- O'Reilly: Programming Entity Framework DBContext by Julie Lerman
- https://www.mikee.se/posts/migrating_from_ef6_to_ef_core
- Pluralsight: EF6 Ninja Edition
- Pluralsight: Querying the Entity Framework
- Pluralsight: Practical LINQ by Deborah Kurata

## Overview

- EF is an ORM.
- It simplifies the effort when going from objects in software to relational data in the database.
- Other ORMs often require that the domain classes mirror the database tables.
  EF provides more flexibility to define **mappings** between domain classes and database tables (can override defaults easily).
- EF uses the LINQ to Entities syntax so developers can use a consistent and strongly typed query language regardless of the database being targetted. This is written again the domain objects NOT the database schema. LINQ can also be used to query e.g. in memory objects so uses a syntax in common with LINQ to Objects.
- Although the database is abstracted away, still need to understand the nuances of tracking as well as patterns for working in disconnected applications
- EF6 can be used with .NET 4.
- EF7 is supported on client side on devices.

### Basic EF Workflow

- Start with the domain classes -> use EF's DbContext API to wrap those classes into a **model** -> Express and execute queries using LINQ to Entities -> EF builds equivalent SQL -> Executes againsts database -> Transforms results back into model -> Modify data in model -> EF Save Changes -> EF determines and executes SQL
- Mapping to views as well as tables is supported
- Executing SPs is also supported if EF can't create efficiently performing SQL or if the query is too hard to express with LINQ.
- This is a high level overview of the _default_ workflow.

### Model options

1. EDMX Model - Visual model defined using a designer in VS -> this creates an XML file, the EDMX -> the designer then generates classes from the EDMX
2. Code-based Model - model directly written in code

If an EDMX exists, EF reads this and generates an in memory model. This in memory model is the representation of how the domain classes map to the database tables
Instead if a model in code exists, EF will use its Code First API to generate the same in memory model
Having generated the in memory model everything following is the same.

### Model Creation options

1. **Database First with EDMX**. Reverse engineer from an existing database to EDMX. EDMX is updateable when the database schema is updated. (Can also reverse engineer to Code, but this is a one way process. Really just a different way to start with a Code-First approach).
2. **Model First with EDMX**. Use the designer to write the model (EDMX) and then generate the database. However, you can migrate the database by changing the model.
3. **Code First** (most popular). Either write from scratch or reverse engineer a database. EF then has the option to determine the model and the database schema and then create the SQL to create the database. This allows generation of migrations to migrate the database when models or mappings change. Using code, EF uses conventions to infer the database schema, but mappings can be used to override the conventions.

### Architecture

Using a DBContext, EF defines which domain objects it will work with in a particular model.
There may be more than one DBContext defined model.
EF logic is written and executed in a data logic layer, e.g. queries and calls to SaveChanges. The DBContext then executes queries, tracks changes, performs updates etc, triggered by the code in the data logic layer
The domain objects and other business logic code does not need to be aware of EF at all. Only the data logic layer needs a reference to the EntityFramework.dll

### EF7

Complete rewrite.
Not backwards compatible.
Different features e.g. no EDMX model.

## Creating a Code Based Model and Database

1. Create a domain project and domain classes e.g. `Ninja`, `Clan`, `NinjaEquipment`
2. Create a datamodel project. Create a dbcontext e.g. `NinjaContext` by inheriting from `System.Data.Entity.DbContext`. This will orchestrate all the interactions with the database.
3. When defining a `DbContext`, need to define what `DbSet`s are in the model. Add a `DbSet` for each type that will be maintained by the DbContext. The `DbSet` IS a repository (repository pattern) and is responsible for maintaining an in memory collection of types. Queries are performed by way of the DbSets. These entities can then be queried and persisted directly. It is possible to have entities in the model which aren't part of a DbSet which are reached by relationships to entities which are in a `DbSet` [ADVANCED].

At runtime, .NET will check the class definitions of all classes included in the `DbSet`s in the `DbContext` and infer a model as well as infer how that model relates to a database schema.
Use Entity Framework Power Tools to view the same model in advance (right click on context file for menu).

Where there are "foreign keys" defined between domain classes via explicit integer keys, EF will create an 1 to 1 or 1 to many relationship. However if the relationship is via a class which could be nullable, this will be created as a 0 to 1 or 0 to many relationship by default. Use Fluent API in your EF DbContext to sort out, or add the `[Required]` attribute to your domain classes.

NOTE. Not having explicity FK `int` relationships can become a problem when using EF with disconnected web apps.

### Code First database creation and migrations

There are a number of ways to migrate a database from the model.
Some are automated and happen at runtime - useful for running unit tests.
Design time Code First migrations feature gives the most consistency and control.
The Migrations API can detect changes between the model and an existing database, describe these schema changes and then generate the equivalent SQL.

Issue the `Enable-Migrations` command in the package manager console. This creates a folder called Migrations and a `Configuration.cs` class.

There are 3 steps to migrating the database:

1. Define / update the model
2. Create the migration file: `Add-Migration Initial`
3. Apply to the database
   - `Update-Database -Script` will simply show the script to be run on update
   - `Update-Database -Verbose` will run the migration on the database, giving verbose output

By default the database will be created locally using mssqllocaldb using the namespace and context names to name the database

## Using EF to interact with the database

- CRUD
- Working with graphs of related data
- Projection queries

### Database initialisation

Control the initialisation of the database e.g Create if not exists or turn off in `OnModelCreating`: `Database.SetInitializer(new NullDatabaseInitializer<NinjaContext>());`

```xml
  <appSettings>
    <add key="DatabaseInitializerForType Pluralsight.Ef6gs.Ninja.DataModel.NinjaContext, Pluralsight.Ef6gs.Ninja.DataModel"
         value="Disabled" />
  </appSettings>
```

See: https://www.entityframeworktutorial.net/code-first/database-initialization-strategy-in-code-first.aspx

### Log generated SQL

ctx.Database.Log = Console.WriteLine;

### Triggering queries to execute

- Use a LINQ "execution method" e.g. `query.ToList()`
- Enumerate a query e.g. `foreach(var ninja in query)` - NOTE database connection will be open UNTIL the last record is read - often better to ensure control and explicitly call e.g. `ToList()`

### Updates in disconnected applications

- Pluralsight: EF in the Enterprise much more info on disconnected applications including established patterns

```csharp
using (var ctx = new NinjaContext()) {
  context.Ninjas.Attach(ninja); // tell EF about the entity - actually this part is not required when using the following line
  context.Entry(ninja).State = EntityState.Modified;
  context.SaveChanges(); // this will update EVERY property (unlike connected apps where EF knows which properties have changed)
}
```

### Useful DbSet methods

- `ctx.Ninjas.Find(1)` - used with the id value. Will query in memory EF tracked entities first
- `ctx.Ninjas.SqlQuery("exec GetNinjas")` - since this is a method of `DbSet` it expects THAT entity type to be returned. Still need a LINQ execution method e.g. `ToList()` to retrieve. String can be a SQL query or exec with an SP.

- Alt database method: `ctx.Database.ExecuteSqlCommand("exec DeleteNinjaById {0}", id)`

### Deletes in disconnected applications

- Call `ctx.Ninjas.Remove(ninja)` to delete a ninja. This will throw an exception in disconnected apps where a new context has been instantiated
- `ctx.Ninjas.Attach(ninja); ctx.Ninjas.Remove(ninja);` works.
- `ctx.Entry(ninja).State = EntityState.Deleted` also works

### Inserting related data

Adding child objects to a parent object when the parent object is already tracked by EF will result in the child objects ALSO being tracked by EF AND having the same state.

If the child objects are already known to EF, their state will be retained.

```csharp
ctx.Ninjas.Add(ninja);
// will automatically be tracked by EF despite not being explicitly added to the context
ninja.EquipmentOwned.Add(new NinjaEquipment() {Name = "Muscles", Type = EquipmentType.Tool});
ninja.EquipmentOwned.Add(new NinjaEquipment() {Name = "Sword", Type = EquipmentType.Weapon});

```

In this example, EF will initially insert the first Ninja and then do a SELECT to get the ID of the newly inserted record. It will use this ID to insert the 2 equipment records. The 4 SQL queries are done in a single transaction and a single connection.

### Loading related data

#### Eager loading

Useful if you know you want to get all related records.

- using `Include` e.g. `ctx.Ninjas.Include(n => n.EquipmentOwned).FirstOrDefault(n => n.Name == "Jun")`

#### Explicit loading

Useful if you only want to get a few related records.

```csharp
  var ninja = ctx.Ninjas.FirstOfDefault(n => n.Name == "jun");
  ctx.Entry(ninja).Collection(n => n.EquipmentOwned).Load();
```

#### Lazy loading

WARNING: use with caution.

If you mark a navigation propery with the keyword `virtual` then properties can be lazy loaded simply by referencing a child object. However if iterating data and referencing child properties this MAY result in a call to the database for each child property (rather than just one call up front when using `Include`).

```csharp
public class Ninja
{
    // ...
    public virtual List<NinjaEquipment> EquipmentOwned { get; set; }
}


var ninja = ctx.Ninjas.FirstOrDefault(n => n.Name == "Mai" && n.Id != 3);
// at this point the EquipmentOwned count is 0
Console.WriteLine($"{ninja.Name} owns {ninja.EquipmentOwned.Count}");
// checking the SQL queries made shows an extra SELECT in order to get the count
```

#### Projection queries

Use projections to return subsets of properties of related entities. From related objects can request the whole object OR aggregate properties e.g. Count of a collection type.

```csharp
// selects all EquipmentOwned objects
var ninjas = ctx.Ninjas
    .Select(n => new {n.Name, n.EquipmentOwned})
    .ToList();

// selects aggregates for EquipmentOwned objects
// since Clan is a single object CAN select single properties
var ninjas = ctx.Ninjas
    .Select(n => new {n.Name, EquipmentCount = n.EquipmentOwned.Count, ClanName = n.Clan.Name})
    .ToList();
```

Projections usually return anonymous types

## Using EF in your applications

```
public interface IModificationHistory {
  DateTime DateCreated { get; set; }
  DateTime DateModified { get; set; }
  bool IsDirty { get; set; }

```

- All domain classes will implement the `IModificationHistory` interface
- IsDirty will not be persisted and will be ignored in `OnModelCreating`
  - `builder.Types().Configure(c => c.Ignore("IsDirty));` // not in EF Model, EF Queries, EF Updates
- Override `SaveChanges()` to update the DateCreated and DateModified fields in one place

```csharp
public override int SaveChanges() {
  foreach(var history in this.ChangeTracker.Entries()
    .Where(e => e.Entity is IModificationHistory && (e.State == EntityState.Added
      || e.State == EntityState.Modified))
    .Select(e => e.EntityState as IModificationHistory)) {
      history.DateModified = DateTime.Now;
      if (history.DateCreated == DateTime.Minvalue) {
        history.DateCreated = DateTime.Now;
      }
    }
  int result = base.SaveChanges();
  foreach(var history in this.ChangeTracker.Entries()
    .Where(e => e.Entity is IModificationHistory)
    .Select(e => e.EntityState as IModificationHistory)) {
        history.IsDirty = false; // relevant for connected applications
  }
  return result;
}
```

### EF with ASP.NET MVC and WebAPI applications

* Short lived context - one per repository method
* Different queries for specific purposes - since disconnected should only grab the actual data needed for that query - no sense in grabbing anything extra
* `AsNoTracking()` liberally used - super important performance pattern. Note cannot use with `Find()`
* FK properties from a child object back to a parent object can cause issues e.g. `NinjaEquipment` has a `Ninja` property, but no NinjaId property.

```csharp
// without an FK property
// have to additionally pass in the ninja ID as well as initially get the ninja from the database
public void SaveNewEquipment(NinjaEquipment equipment, int ninjaId) {
  using(var context = new NinjaContext()) {
    var ninja = context.Find(ninjaId);
    ninja.EquipmentOwned.Add(equipment);
    context.SaveChanges();
  }
}

// again without the FK property
public void SaveUpdatedEquipment(NinjaEquipment equipment, int ninjaId) {
  using(var context = new NinjaContext()) {
    // get the whole object graph from the database
    var equipmentWithNinja = context.Equipment.Include(n => n.Ninja).FirstOrDefault(e => e.Id == equipment.Id);
    // update the fields on equipment
    context.Entry(equipmentWithNinja).CurrentValues.SetValues(equipment);
    context.SaveChanges();
  }
}
```

