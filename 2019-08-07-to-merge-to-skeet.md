* Generic classes - generic type declared immediately after the name of the class in angle brackets e.g. `public class Car<T>`. Methods within the class can be expressed with parameters and return types in terms of T.
* Generic methods - a generic method declares type parameters immediately after the name of the method in angle brackets which can be used in other parts of the method signature, the parameters or return type e.g. 
* Generic classes can implement generic interfaces by using the type declared by the class
* Classes and methods with the same name, but a different "arity" of type parameters is ok e.g. `class Car<T>` and `class Car<T1, T2>`
* Enums **can't** be generic, but classes, structs, interfaces and delegates can be
* Methods **can** be generic, but fields, properties, indexers, constructors, events and finalizers can't be
* If the type(s) of a generic method can be inferred from the type of the arguments (where the type is used in specifying the parameters) then you don't need to specify the type when calling the method. If there are multiple type arguments, need to either specify none or all.
* Only methods allow type inference, so static factory methods can be useful to create types more easily e.g. see `Tuple` https://referencesource.microsoft.com/#mscorlib/system/tuple.cs,9124c4bea9ab0199 - then allows writing `Tuple.Create(10, "x", 20)` instead of `new Tuple<int, string, int>(10, "x", 20)`
* If type inference fails, explicitly specify or cast arguments e.g. `Tuple.Create(10, (string)null, 50)`
* Constrain generic type arguments to certain types using `where` e.g. to ensure elements of type `T` implement `IFormattable` declare the method: `void PrintItems<T>(List<T> items) where T : IFormattable`. This additionally allows any `IFormattable` methods to be called on this input.
        