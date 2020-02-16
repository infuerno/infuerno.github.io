---
layout: post
title: "Using CSLA 4 02 Creating Business Objects"
---

137 pages

### Reference

Templates: https://github.com/MarimerLLC/csla/tree/master/Support/Templates/cs/Files

## Chapter 1: Key Object Concepts (page 11)

### Stereotypes

Stereotypes supported by CSLA.NET:

Stereotype | Description | Base Class
---|---|---
Editable root | Read/write properties; Retrieved/stored directly | `BusinessBase<T>`
Editable child | Read/write properties; Retrieved/stored via parent | `BusinessBase<T>`
Editable root list | List object containing editable child objects. List is retrieved/stored directory | `BusinessListBase<T,C>` `BusinessBindingListBase<T,C>`
Editable child list | List is retrieved/stored via parent | `BusinessListBase<T,C>` `BusinessBindingListBase<T,C>`
Dynamic root list | Editable root objects; Retrieved/stored directly | `DynamicListBase<C>` `DynamicBindingListBase<C>`
Command | Executes a command on the server, reports back results | `CommandBase<T>`
Unit of work | Combines operations against several objects | `ReadOnlyBase<T>` `CommandBase<T>`
Read-only root | Read properties; Retrieved/stored directly | `ReadOnlyBase<T>`
Read-only child | Read properties; Retrieved/stored via parent | `ReadOnlyBase<T>`
Read-only root list | List object containing read-only child objects. List is retrieved/stored directory | `ReadOnlyListBase<T,C>` `ReadOnlyBindingListBase<T,C>`
Read-only child list | List is retrieved/stored via parent | `ReadOnlyListBase<T,C>` `ReadOnlyBindingListBase<T,C>`
Name/value list | Read name / value objects | `NameValueListBase<K,V>`

### Serializers

* `BinaryFormatter` (DEFAULT) and `NetDataContractSerializer` (NDCS) (NOT RECOMMENDED) create true clones
* `MobileFormatter` clone like functionality for Silverlight, WP7 and .NET
* `Serialization` attribute generally used on each and every object
* `DataContract` and `DataMember` can also be used at a field level - NDCS only - NOT RECOMMENDED - cannot swap to another formatter and will miss out any fields not decorated
* `BinaryFormatter` is normally faster and more efficient, so shouldn’t be overriden. However the `MobileFormatter` avoids use of reflection and so may work in medium trust environments where the `BinaryFormatter` is disallowed.

### Object Relationships

Relationships are important because the conceptual differences mean the code which is written to implement them is also different.

Relationship | Description | Example
--|--|--
Containment | Parent child relationship | an `OrderEdit` object contains a `LineItems` collection, which in turn contains `LineItemEdit` objects. This set of objects is an **object graph**. The object at the top of the graph is the **root** object.
Using | Separate and independent objects which collaborate | `LineItemEdit` uses a `TaxCalculator` to calculate tax depending on country.

### Equality

Object equality can mean different things - actually the same object, or two different objects containing the same values. The `Equals` method can be overriden, or the `IEquatable` interface implemented. 

### Basic CSLA 4 Property Concepts

Properties can become complex. A `getter` requires checking authorization, a `setter` requires checking: authorization, is new value different to existing value, `PropertyChanging` event, run rules, mark object as changed, `PropertyChanged` event.

CSLA defines a standard way to declare properties and backing fields involving:
* metadata descriptions and 
* helper methods.

#### Metadata

A `static` `PropertyInfo` field contains metadata about the property and is "registered" with the framework using the `RegisterProperty` method:

`public static readonly PropertyInfo<string> MyTextProperty = RegisterProperty<string>(c => c.MyText);`

Declaring metadata in this way is a requirement for using CSLA features.

##### `RegisterProperty` method

The `RegisterProperty` method registers the property's metadata with the "field manager", the CSLA.NET property management subsystem (with various overloads). It creates an instance of `IPropertyInfo` containing property metadata - which is returned to the class and can be stored in a `static` field. It also registers the instance with a `static` data structure maintained by the framework. 

##### `PropertyInfo<T>` and `IPropertyInfo`

The `RegisterProperty` method either accepts a pre-created `IPropertyInfo` (usually a `PropertyInfo<T>`) or will create an instance for you. (PropertyInfo<T> is strongly typed and therefore more efficient.)

The `PropertyInfo<T>` stores the property metadata (hence can be static at the class level). Elements in `IPropertyInfo` include: `Name`, `Type`, `FriendlyName`, `DefaultValue` (only use in value or immutable types since will be shared across all instances). The types can be extended to store extra metadata if required (advanced).

##### Helper Methods

Helper methods encapsulate authorisation, validation and so forth:

```
public string MyText
      {
get { return GetProperty(MyTextProperty); }
set { SetProperty(MyTextProperty, value); } }
```

with the `GetProperty` and `SetProperty` methods behaving as outlined above.

Method | Description
--|--
`GetProperty` | Gets a property, checking authorization rules
`ReadProperty` | Gets a property, no authorization checked
`SetProperty` | Sets a property, authorization, validation etc
`LoadProperty` | Simply sets a property, no auth, valiadtion, events raised etc
`GetPropertyConvert`, `ReadPropertyConvert`, `SetPropertyConvert`, `LoadPropertyConvert` | As above, additionally converting the new value to the correct backing field type

#### Backing fields

CSLA 4 allows you to implement properties using a manual backing field, or a "managed" backing field. In the latter case the CSLA .NET base class manages the property’s value on your behalf. Performance is slightly worse using managed backing fields, but generally recommended unless there is a high performance requirement. 

#### Types of Property Declaration

Different base objects implement properties differently e.g. `BusinessBase` properties provide full read/write functionality; `CriteriaBase` properties are lightweight

Declaration type | Property gets or sets
--|--
Read/write | Primitive or standard .NET type
Read/write with conversion | Converts to and from the type of field containing the value
Read-only | Non-public setter
Read-only with conversion | Non-public setter with conversion
Child | Containment, typically has a non-public setter
Child with lazy loading | Only loaded or created on demand
Inter-graph reference | Reference to another object in the same object graph (not child)
Using reference | Reference to object OUTSIDE the object graph, no setter
Manual backing fields | Includes read/write and read-only

##### Read-Write

* The getter uses the `GetProperty` method, passing in the static IPropertyInfo metadata. If a user is NOT authorised the default value is returned (throwing exceptions will cause UIs to blow up - use `CanReadProperty` to check first).
* The setter uses `SetProperty`, taking the same metadata field and the new value. Throws a `SecurityException` in this case if the user is not allowed to change the value
* Child objects have to be taken into account when setting properties (more later)
* `SetProperty` invokes business rules for this property and any dependent property
* Raises the `PropertyChanged` event to support data binding

##### Read-Write with No Rules

* Might need a field just to "store" a value, but with no rules. 
* Required for certain base classes e.g. `CommandBase`. Here the `ReadProperty` and `LoadProperty` methods are used instead. 
* Property itself can be private, but ensure the metadata is declared public if requiring full support from certain data access models e.g. `ObjectFactory`

##### Read-Write with Value Conversion

* Common example: string property backed by an enum value (note, breaks localization) where a string representation is useful for the UI
* Various mechanisms allow a value of one type to be converted into another type. Conversion will succeed as long as one of those mechanisms works.
* To access the underlying backing field (e.g. the enum here) a private property of the same type (e.g. the enum) is the easiest approach. NOTE `RegisterProperty` is not required a second time (obviously).

```
public static readonly PropertyInfo<TestEnum> MyStringEnumProperty = RegisterProperty<TestEnum>(c => c.MyStringEnum);
public string MyStringEnum
{
  get { return GetPropertyConvert<TestEnum, string>(MyStringEnumProperty); }
  set { SetPropertyConvert<TestEnum, string>(MyStringEnumProperty, value); }
}
```
##### Read-Only (and Read-Only with Value Conversion)

* If authorisation is required for getting properties, these can be implemented using `GetProperty` and `LoadProperty` with the setter private (assumption being that properties do not change over the lifetime of the object)
* For base types which don't support authorisation rules, use `ReadProperty` instead

##### Child Object Reference

* Need to use an overload of `RegisterProperty` helper method to specify the relationship type as `RelationshipTypes.Child`
* For some situations, the child object will be read only, the property has a private setter and will be created when creating the parent object e.g. with code such as `Addresses = DataPortal.CreateChild<AddressEditList>();`

##### Child Object Reference with Lazy Loading

* Create or load the child object in the getter
* Additionally specify the relationship type `RelationshipTypes.LazyLoad` e.g. 

`public static readonly PropertyInfo<AddressEditList> AddressesProperty = RegisterProperty<AddressEditList>(c => c.Addresses, RelationshipTypes.Child | RelationshipTypes.LazyLoad);`

* The getter may be invoked on the client, but need to converse with the server i.e. data portal in order to load the object. Two methods:
  1. Directly use the data portal
  2. Use a seperate "child object creator" e.g. `AddressListCreator` class with `Result` property which will be called from the getter (if not already loaded - check this using `FieldManager.FieldExists`)
  
##### Properties with Manual Backing Fields

Examples of where you might use manual backing fields include:
* Inter-graph references
* Using relationship references
* Scenarios where you need to apply attributes to fields
* High-performance scenarios where using managed backing fields is a performance bottleneck
  
* Still register a static metadata field for the property, but specify the `RelationshipTypes.PrivateField`
* Initialise the private variable with the `MyProperty.DefaultValue`
* `GetProperty`, `SetProperty` have overloads to use the manual backing field for consistency 
* No need for `ReadProperty` or `LoadProperty` - just use the backing field - but loosely typed versions of these methods which can be used if required

##### Inter-Graph Reference

For example `PersonEdit` has a list of child objects of type `AddressList`, but also has a reference `PrimaryAddress`. This would be an inter-graph reference. The difference is important for how n-level undo works - need to increase edit level for all objects in the object graph ONLY ONCE.

Inter-graph references must use a manual backing field AND must have the `[NotUndoable]` attribute applied to that backing field. Since not a child object only the `RelationshipTypes.PrivateField` is needed.

```
public static readonly PropertyInfo<AddressEdit> PrimaryAddressProperty = RegisterProperty<AddressEdit>(c => c.PrimaryAddress, RelationshipTypes.PrivateField);
[NotUndoable]
private AddressEdit _primaryAddress = PrimaryAddressProperty.DefaultValue; public AddressEdit PrimaryAddress
{
  get { return GetProperty(PrimaryAddressProperty, _primaryAddress); }
  set { SetProperty(PrimaryAddressProperty, ref _primaryAddress, value); }
}
```

##### Using Reference

A reference to an object OUTSIDE the object graph. Best way is NOT to keep a reference to this object. Either create a reference when needed, or get a reference and store only in a local variable. 

For times when a reference is REQUIRED - this MUST be implemented using a manual backing field and decorated with the [NotUndoable] and [NonSerialized] attributes. Lazy loading of this reference MUST also be implemented - since after deserialization the property value will be null. 

##### Non-Generic LoadProperty Method

Most examples above use the generic overloaded version of the LoadProperty method e.g. `LoadProperty(AddressesProperty, value)`.

The non-generic overload is substantially slower than the generic overload, because the value types aren’t known at compile time. Only use if there’s no way to invoke the generic overload.

### Method Declarations

Similarly to properties, declaration of methods include the declaration of a static metadata field as well as use of helper methods to check authorization. 

```
public static readonly MethodInfo TestMethod = RegisterMethod(typeof(EditableProperties), "Test");
public void Test()
{
  CanExecuteMethod(TestMethod, true); // method author must remember to add this line first
  // do some work here
}
```

### Metastate

CSLA objects maintain their own status. Following flags are available:

Property | Description | Stereotypes
--|--|--
`IsNew` | Object's primary key value doesn't exist in data store | Editable root and child
`IsDeleted` | Object is marked for deletion (and on save will delete rather than update). Generally used for child objects. | Editable root and child
`IsChild` | Child object | Editable root and child, Editable list
`IsDirty` | Has been changed (object or child) | Editable root and child, Editable list
`IsSelfDirty` | Has been changed (this object only) | Editable root and child
`IsValid` | No broken rules (object or child) | Editable root and child, Editable list
`IsSelfValid` | No broken rules (this object only) | Editable root and child
`IsBusy` | Async operations in progress (object or child) | Editable root and child, Editable list
`IsSelfBusy` | Async operations in progress (this object only) | Editable root and child
`IsSavable` | `IsDirty && IsValid && !IsBusy` AND user is authorised | Editable root and child, Editable list

* It is possible to directly alter metastate
* It is possible to override how metastate works (make sure you know what you are doing)
* Various events are raised during an object's lifetime

Event | Description | Stereotypes
--|--|--
`PropertyChanged` | A property has changed | Editable root and child
`PropertyChanging` | A property is changing | Editable root and child
`ListChanged` | The list or item in the list has changed (`BindingList` subclasses only) | Editable list
`CollectionChanged` | The collection or item in the collection has changed (`ObservableCollection` subclasses only) | Editable list
`ChildChanged` | An object in the graph has changed | Editable root and child, Editable list
`Saved` | The object graph has been saved | Editable root, Editable root list
`BusyChanged` | The objects busy status has changed | Editable root and child, Editable list

#### Accessing Metastate

* via public properties directly from the object itself
* via `ITrackStatus` interface which all business objects implement (useful for polymorphism)
* via `INotifyBusy` interface to access busy status as well as `BusyChanged` events (useful for polymorphism)
* via `INotifyChildChanged` interface for `ChildChanged` events (useful for polymorphism)

Note: metastate properties do NOT support data binding


## Chapter 2: Solution Structure (page 57)
## Chapter 3: Object Stereotypes (page 64)
## Chapter 4: Business Rules (page 91)


