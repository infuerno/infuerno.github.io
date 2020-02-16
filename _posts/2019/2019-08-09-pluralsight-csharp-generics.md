---
layout: post
title: "Pluralsight - C# Generics"
---
## Generic Delegates

Regular delegates would require using `object` and the disadvantages (not type safe, boxing performance hit).

```
// declare a delegate type
public delegate void Printer(object data);

// declare a method that has the same signature
public void WriteToConsole(object data) {
    Console.WriteLine(data);
}

// create a delegate to point to this method
var consolePrinter = new Printer(WriteToConsole);
// invoke the delegate
consolePrinter.Invoke("hello");
// or pass the delegate to a method that will use it
buffer.Dump(consolePrinter);

// using shorthand (method group conversion)
var consolePrinter = WriteToConsole;
consolePrinter("hello"); // or buffer.Dump(consolePrinter)
```

Using generics:

```
// make it all generic
public delegate void Printer<T>(T data);
public void WriteToConsole<T>(T data) {
    Console.WriteLine(data);
}
var consolePrinter = new Printer<double>(WriteToConsole);
consolePrinter.Invoke(2.0); // or buffer.Dump(consolePrinter)
```

## General purpose delegate types

To save having to create your own delegate types, there are several built in delegate types which can be used instead: `Func`, `Action` and `Predicate`.

### Action

Always returns void, but can take from 0 to 16 params, the types of which are determined using from 0 to 16 generic type arguments. e.g. `Action<double>` can be used for a method which returns `void`, but takes one parameter of type `double`.

```
var consolePrinter = new Action<double>(WriteToConsole);
consolePrinter(2.0);
// or if passing to a method, that method would have to be updated to accept a delegate type of Action
buffer.Dump(consolePrinter);

// can use method group conversion instead
var consolePrinter = WriteToConsole;

// can use anonymous method
Action<double> consolePrinter = delegate(double data) { Console.WriteLine(data);};

// can use lamda expression
Action<double> consolePrinter = d => Console.WriteLine(data);
buffer.Dump(consolePrinter);

// can use inline lamda
buffer.Dump(d => d.Console.WriteLine(data));
```

### Func

Always has a return type, which is the last argument specified as well as 0 to 16 parameters e.g. `Func<double, double>` points to a method which takes a `double` and returns a `double`.

```
Func<double, double> square = d => d * d;
Func<double, double, double> add = (x, y) => x + y;
```

### Predicate

Always returns a boolean. 

```
Predicate<double> isLessThanTen = d => d < 10;
```

## Events and Generics

As well as `Func`, `Action` and `Predicate` the built in delegate `EventHandler` is useful for raising events.

**Come back to this after checking more into events**

## Constraints, Covariance, Contravariance

### Constraints

Use the `where` keyword to restrict generic types. This means that we know we can now call certain methods in the implementation. It makes more sense to add these restrictions just to the implementations rather than interfaces, since the interface doesn't care about implementation details. However matter of personal taste.

### Covariance

* `IEnumerable<Employee> temp = employeeRepository.FindAll()` - this is ok because `FindAll` returns `IQueryable` which implements `IEnumerable`, so the collection returned will be IQueryable as well as IEnumerable.
* `IEnumerable<Person> temp = employeeRepository.FindAll()` - this is also OK. `FindAll` return a collection of `Employee`s and since `Employee` inherits from `Person`, those employees will also be people. This only works because the IEnumerable interface is specified using the `out` keyword (a generic modifier) which allows the `T` parameter to "vary" i.e. `IEnumerable<out T>`. The `T` parameter is covariant. The `GetEnumerator` method in the IEnumerable interface is allowed to return types which are "more derived" than the original type specified.
* NOTE: covariance only works with delegates and interfaces (not classes) 
* Covariance can only be used on an interface where the `T` is returned. It can't be used when the `T` is used as a parameter. Treating employees as people is ok when they are returned to a caller. But treating a person as an employee will be a problem. So we can't accept a person instead. 
* A solution is to split out the interface into the read only methods which simply return T and then implement this interface by the other one
* `interface IReadOnlyRepository<out T>`

### Contravariance

* The opposite. Allow generic interfaces which define methods which accept T, but don't return it, to accept T OR any type which derives from T. Do this using the `in` keyword: `interface IWriteOnlyRepository<in T>`
* The `IRepository` interface is now empty with read split out to `IReadOnlyRepository` and writes split out to `IWriteOnlyRepository`. The `IRepository` simply implements both interfaces, but specifies that `T` must be invariant when dealing with `IRepository`. e.g. can only use Employee objects here and nothing else. i.e. `IRepository<T> : IReadOnlyRepository<T>, IWriteOnlyRepository<T>`
* Example with a delegate: `delegate TOutput Converter<in TInput, out TOutput>(TInput input)`

## Generics and Reflection

### Instantiate Generic Types

Create a generic type using the whole type definition

```
Type t = typeof(List<Employee>);
object o = Activator.CreateInstance(t);
Console.WriteLine(o.GetType().Name); // List`1
o.GetType().GenericTypeArguments.ToList().ForEach(arg => Console.Write($"[{arg.Name}]")); // [Employee]
```

Create a generic type where collection type and item type are specified seperately by calling `MakeGenericType` on the collection type.

```
Type typeCollection = typeof(List<>);
type typeItem = typeof(Employee);
Type closedType = typeCollection.MakeGenericType(typeItem);
object o = Activator.CreateInstance(closedType);
```

### Invoke Generic Methods

The below code would usually work for non generic methods, but doesn't work where generic parameters are required.

```
var employee = new Employee();
var employeeType = employee.GetType();
var methodInfo = employeeType.GetMethod("Speak");
methodInfo.Invoke(employee, null); // null since method doesn't have any parameters
```

Need to create a generic method using `MakeGenericMethod` on the method info: `methodInfo = methodInfo.MakeGenericMethod(typeof(DateTime));`

## Odds and Ends

### Enums

When using generics with `enum`s - it is not possible to constrain a generic type to be of type enumeration. The nearest possible is of a value type. So e.g. writing a generic method to convert a string to an enumeration cannot be constrained to ensure it will only be used with enumerations.

```
enum ColourType {
    Black, White
}
public static StringExtensions
{
    public static T ParseEnum<T>(this string value) : where T : struct
    {
        return (T)Enum.Parse(typeof(T), value);
    }
}

var input = "black";
var colour = input.ParseEnum<ColourType>();
```

### Maths

Can't enforce generic types such that they implement certain operators e.g. `+`, `<`, `+=`. Best approach here is overloaded methods instead.

### Using Base Types

If you have a generic class `Item<T>` and you want to have a list of only these items, you need to defined a strongly type list OF strongly typed items and it wouldn't be possible to e.g. have `Item<int>` and `Item<double>` in the same list.

One solution is to create a `Item` base type and have `Item<T> : Item` inherit from this base type. This way you have have a `List<Item>` and maintain some control over what is added to the list.

### Generics and Statics

Static fields belong to the generic type specified FOR a particular type e.g. `Item<int>` and not shared across all `Item<T>`.