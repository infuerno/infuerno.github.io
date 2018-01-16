---
layout: post
title: "Pluralsight: Getting Started with Entity Framework 6"
---
## Resources

O'Reilly Programming Entity Framework by Julie Lerman
O'Reilly Programming Entity Framework Code First by Julie Lerman
O'Reilly Programming Entity Framework DBContext by Julie Lerman

## Overview

EF is an ORM. 
It simplifies the effort when going from objects in software to relational data in the database.
Other ORMs often require that the domain classes mirror the database tables.
EF provides more flexibility to define mappings between domain classes and database tables.
EF uses the LINQ to Entities syntax so developers can use a consistent and strongly typed query language regardless of the database being targetted. This is written again the domain objects NOT the database schema. LINQ can also be used to query e.g. in memory objects so uses a syntax in common with LINQ to Objects.
EF6 can be used with .NET 4.
EF7 is supported on client side on devices.

### Basic EF Workflow

Define model -> Express and execute query in LINQ -> EF builds equivalent SQL -> Executes againsts database -> Transforms results back into model -> Modify data in model -> EF Save Changes -> EF determines and executes SQL
Mapping to views as well as tables is supported
Executing SPs is also supported if EF can't create efficiently performing SQL or if the query is too hard to express with LINQ.
This is a high level overview of the *default* workflow.

### Model options

1. EDMX Model - Visual model defined using a designer in VS -> this creates an XML file, the EDMX -> the designer then generates classes from the EDMX
2. Code-based Model - model directly written in code

If an EDMX exists, EF reads this and generates an in memory model. This in memory model is the representation of how the domain classes map to the database tables
Instead if a model in code exists, EF will use its Code First API to generate the same in memory model
Having generated the in memory model everything following is the same.

### Model Creation options

1. Reverse engineer from an existing database to EDMX or Code. EDMX is updateable if the database schema is updated, the Code is not.
2. Model First. Use the designer to write the model and then generate the database. Again one time only - does not have the ability to migrate the database if you change the model.
3. Code First (most popular). Either write from scratch or reverse engineer a database. EF then has the option to determine the model and the database schema and then create the SQL to create the database. This allows generation of migrations to migrate the database when models or mappings change. Using code, EF uses conventions to infer the database schema, but mappings can be used to override the conventions.

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

1. Create domain classes
2. Create a dbcontext by inheriting from `System.Data.Entity.DbContext`. This will orchestrate all the interactions with the database.
3. Add a `DbSet` for each type that will be maintained by the DbContext. The DbSet is responsible for maintaining an in memory collection of types. Queries are performed by way of the DbSets. These entities can then be queried and persisted directly. It is possible to have entities in the model which aren't part of a DbSet which are reached by relationships to entities which are in a DbSet [ADVANCED].

At runtime, .NET will check the class definitions of all classes included in the `DbSet`s in the `DbContext` and infer a model as well as infer how that model relates to a database schema. 
Use Entity Framework Power Tools to view the same model in advance (right click on context file for menu).
Where there are "foreign keys" defined between domain classes via explicit integer keys, EF will create an 1 to 1 or 1 to many relationship. However if the relationship is via a class which could be nullable, this will be created as a 0 to 1 or 0 to many relationship by default. Use Fluent API in your EF DbContext to sort out, or add the `[Required]` attribute to your domain classes.

### Code First database creation and migrations

There are a number of ways to migrate a database from the model.
Some are automated and happen at runtime - useful for running unit tests.
Design time Code First migrations feature gives the most consistency and control. 
The Migrations API can detect changes between the model and an existing database, describe these schema changes and then generate the equivalent SQL. 

Issue the `Enable-Migrations` command in the package manager console. This creates a folder called Migrations and a Configuration.cs class.

There are 3 steps to migrating the database:
1. Update the model
2. Create the migration file
3. Apply to the database

After updating the model, issue the `Add-Migration` command also in the package manager console to create a migration class giving the command at a minimum the name of the migration e.g. `Add-Migration Initial`. This generates a class for the migration with a timestamp. `Update-Database -Script` will simply show the script to be run on update. `Update-Database -Verbose` will run the migration on the database, giving verbose output.
