---
layout: post
title: "Pluralsight: LINQ Fundamentals"
---
### References

MSDN documentation: https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable?redirectedfrom=MSDN&view=netframework-4.8

## An Introduction

Previous to LINQ, there were many different APIs for access data in different sources e.g. Object Data using generic collections classes; Relational Data using ADO.NET; XML Data using XmlDocument.

Step up Language Integrated Query.

## Linq and C#

It is possible to iterate over both `arrays` and `List<T>` types since both have a method called `GetEnumerator`. This is because they both implement the interface `IEnumerable<T>`. The following code shows this explicity:

```
// Array of Employee
IEnumerable<Employee> developers = new Employee[]
{
    new Employee() { Id = 1, Name = "Tom"},
    new Employee() { Id = 1, Name = "Dick"}
};
IEnumerator<Employee> enumerator = developers.GetEnumerator();
while (enumerator.MoveNext()) {
    Console.WriteLine(enumerator.Current.Name);
}

// List<T> of Employee
IEnumerable<Employee> sales = new List<Employee>
{
    new Employee() { Id = 1, Name = "Harry"}
};

IEnumerator<Employee> enumerator = sales.GetEnumerator();
while (enumerator.MoveNext()) {
    Console.WriteLine(enumerator.Current.Name);
}
```

Note 1: With `enumerator.MoveNext()` the implementation of how the next item is being fetched is completely hidden, it could be an array, a list, or the next row in a database. 
Note 2: `IEnumerable` defines only ONE method - `GetEnumerator`. All other methods used in LINQ e.g. `Order`, `Where` etc are **extension** methods. This keeps the interface simple, easy to implement and easier to extend in the future. 

### Lamda Expressions

```
IEnumerable<string> filteredList = cities.Where(StartsWithL);

public bool StartsWithL(string name) {
    return name.StartsWith("L");
}
```

The **Named Method** approach provides the name of a method to the `Where` extension method which takes a string and returns bool. `Where` will call this method for each item in the collection.

An **Anonymous Method** can also be used : `var filteredList = cities.Where(delegate(string s) { return s.StartsWith("L"); });`. However, this syntax is noisy and hard to read. 

Hence the introduction of the **Lambda Expression** syntax: `var filteredList = cities.Where(s => s.StartsWith("L"));` 

### Using Func and Action types

Most LINQ extension methods take `Func` types.

```
Func<int, int> square = x => x * x;
Func<int, int, int> add = (x, y) => x + y; // 0 or 2 or more parameters require brackets
Action<int> write = s => Console.WriteLine(s);

write(square(add(5, 3)));
```

### Query Syntax vs Method Syntax

Query syntax starts with `from` and finishes with `select` or `group`. The `from` expression can be thought of similar to a `foreach` loop. It comes at the top rather than the `select` (as in SQL) so that intellisense can be helpful.

```
from city in cities
where city.StartsWith("L") && city.Length > 15
orderby city
select city
```

Not every LINQ operator is available in the query syntax, so sometimes need to use the method syntax e.g. Count

## LINQ Queries

Execution is deferred until an item in the enumeration are actually needed. This way we can define an infinite sequence, and keep that seperate from how the sequence is to be used, how much of the sequence is required etc. 

To find out whether a particular LINQ extension offers deferred execution is to check the MSDN documentation. Under remarks - it will clearly state if the method in question is using deferred execution or not. e.g. `Count` does not - it needs to know how many items in the collection. 

See: https://docs.microsoft.com/en-us/dotnet/csharp/programming-guide/concepts/linq/classification-of-standard-query-operators-by-manner-of-execution

### Pitfalls

1. Multiple executions - CAREFUL not to evaluate the enumeration multiple times, e.g. calling `.Count()` in a logging line prior to iterating over the collection.
2. When catching exceptions, ensure they are being caught when the query is being executed, not when it is being defined. 

### Streaming operators

The deferred execution operators can be divided into streaming and non-streaming where streaming operators don't need to read the whole data source before starting to return items e.g. `Where`. An example of a non-streaming deferred execution operator is `OrderBy`. The behaviour becomes similar to an operator which operates immediately - however, execution is still deferred, but after the first call to `MoveNext()` the operator needs to iterate through all entries to find which one it should return first. 

Need to think carefully about the queries (where using LINQ to Objects). If you can only fit 10 items on the screen out of a possible result set of 20,000 - then will be more efficient if you can only use streaming operations in your query. Also better to use e.g. `Where` before `OrderBy`

## Filtering, Order and Projecting

### CSV to Objects
1. Firstly read all lines of the file into a string array, filtering out any lines not required e.g. header line, blank lines at the end.
2. For each line of the file, transform into a car object using the LINQ select (aka project, transform, map) operator. 

* Use `ThenBy` and `ThenByDescending` to do a secondary order on a ordered result set
* `Select` is useful to project items from one type to items of a different type e.g. a line of a csv file (string) into a car e.g. `Select(Car.ParseFromCsv)` where `ParseFromCsv` is named method which will take a `string` and return a `Car`
* `Select` combined with anonymous types is useful to only return a subset of the fields of an object. e.g.
    - defined an anonymous type using `new { Day = "Monday", Weather = "Gloomy" };`
    - select a subset using an anonymous type: `new { Name = Car.Name, Manufacturer = Car.Manufacturer };`
    - use the shorthand to make it less verbose: `new { Car.Name, Car.Manufacturer };` // automatically works out you want 2 properties and their names
* `SelectMany` is also a projection operator which can flatten objects - i.e. take a collection of collections and flatten it to a single collection. So `[[1,3,4], [3,4,5]]` becomes `[1,3,4,3,4,5]`

## Joining, Grouping and Aggregating

### Joins
Joins in LINQ are similar to INNER JOINs in SQL.

```
// query syntax for joining on multiple properties
var query = from car in cars
            join manufacturer in manufacturers
            on new { car.Manufacturer, car.Year } 
                equals
                new { Manufacturer = manufacturer.Name, manufacturer.Year }
            select new
            {
                car.Name,
                manufacturer.Country
            };

// method syntax for joining on multiple properties
var query2 = cars
    .Join(manufacturers, 
        c => new { c.Manufacturer, c.Year }, 
        m => new { Manufacturer = m.Name, m.Year }, 
        (c, m) => new { c.Name, m.Country })
    .ToList();
```

### Grouping
```
// query syntax
var query = from car in cars
            group car by car.Manufacturer.ToUpper() into manufacturer
            orderby manufacturer.Key
            select manufacturer;

// method syntax
var query2 = cars.GroupBy(c => c.Manufacturer.ToUpper())
    .OrderBy(g => g.Key);

// output
foreach (var group in query2)
{
    Console.WriteLine(group.Key);
    foreach (var car in group.OrderByDescending(c => c.Combined).Take(2))
    {
        Console.WriteLine($"\t{car.Name} : {car.Combined}");
    }
}
```

### Grouping and Joining
The Type of both `query` objects in the above code is `IOrdered Enumerable<IGrouping<string, Car>>`.

GroupJoins are useful for when you want to both join and group data from two different sources e.g. Group by Manufacturer, but include various attributes from the manufacturer as well as car numerous car attributes.

Can use both `join` and `group`, but can alternatively use a group `join` by using the `join` `into` query syntax.

```
var query = from manufacturer in manufacturers
    join car in cars on manufacturer.Name equals car.Manufacturer into carGroup
    select new
    {
        Manufacturer = manufacturer,
        Cars = carGroup
    };

var query2 = manufacturers
    .GroupJoin(cars, m => m.Name,
        c => c.Manufacturer, 
        (m, c) => new { Manufacturer = m, Cars = c });

foreach (var group in query2)
{
    Console.WriteLine(group.Manufacturer.Name);
    foreach (var car in group.Cars.OrderByDescending(c => c.Combined).Take(2))
    {
        Console.WriteLine($"\t{car.Name} : {car.Combined}");
    }
}
```

### Aggregations
There are numerous aggregation functions including `Max`, `Min`, `Avg`. If calculating multiple aggregations, careful not to loop over data sets more than once. Use `Aggregate` possible with a custom class e.g. `CarStatistics` to calculate aggregates whilst parsing the data only once. 

## LINQ to XML

In the `System.Xml.Linq` namespace, added automatically to most projects. Introduced a number of classes beginning with an `X`:
* `XDocument`
* `XElement`
* `XAttribute`
* `XComment`
* `XDeclaration` - encoding and namespaces e.g. `<?xml version ="1.0" encoding="utf-8" ?>`
All classes derive from `XNode`

### Generating XML

```
// without LINQ
var records = LoadCars("fuel.csv");
var document = new XDocument();

var cars = new XElement("Cars");
foreach (var record in records)
{
    var car = new XElement("Car",
        new XAttribute("Name", record.Name),
        new XAttribute("Manufacturer", record.Manufacturer),
        new XAttribute("Combined", record.Combined)
    );
    cars.Add(car);
}

document.Add(cars);
document.Save("fuel.xml");

// with LINQ
var records = LoadCars("fuel.csv");
var document = new XDocument();

var cars = new XElement("Cars",
    from record in records
    select new XElement("Car",
        new XAttribute("Name", record.Name),
        new XAttribute("Manufacturer", record.Manufacturer),
        new XAttribute("Combined", record.Combined))
);

document.Add(cars);
document.Save("fuel.xml");

```

### Querying XML

```
XDocument document = XDocument.Load("fuel.xml");

var query = document.Element("Cars").Elements("Car")
    .Where(e => e.Attribute("Manufacturer").Value == "BMW")
    .OrderBy(e => e.Attribute("Name").Value);

query.ToList().ForEach(e => Console.WriteLine(e.ToString()));
```

### Creating XML with namespaces

```
var records = LoadCars("fuel.csv");

var ns = (XNamespace)"http://dot.kitchen/cars/2016";
var ex = (XNamespace)"http://dot.kitchen/cars/2016/ex";

var document = new XDocument();
var cars = new XElement(ns + "Cars",
    from record in records
    select new XElement(ex + "Car",
        new XAttribute("Name", record.Name),
        new XAttribute("Manufacturer", record.Manufacturer),
        new XAttribute("Combined", record.Combined))
);

// add a prefix for the ex namespace so it doesn't
// appear on each <Car> element
cars.Add(new XAttribute(XNamespace.Xmlns + "ex", ex));
document.Add(cars);
document.Save("fuel.xml");
```

### Querying XML with namespaces
```
XDocument document = XDocument.Load("fuel.xml");

var ns = (XNamespace)"http://dot.kitchen/cars/2016";
var ex = (XNamespace)"http://dot.kitchen/cars/2016/ex";

var query = document.Element(ns + "Cars").Elements(ex + "Car")
    .Where(e => e.Attribute("Manufacturer").Value == "BMW")
    .OrderBy(e => e.Attribute("Name").Value);

query.ToList().ForEach(e => Console.WriteLine(e.ToString()));
```

## LINQ and the Entity Framework

