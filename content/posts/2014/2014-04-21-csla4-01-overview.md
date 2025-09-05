---
layout: post
---
## Chapter 1: Introduction and Installation

CSLA - Component based, Scalable, Logical Architecture
This ebook provides and overview including vision, goals and guiding philosophy.

## Chapter 2: Architecture and Philosophy

### Logical and physical architecture

#### N-tier and SOA
An application is defined here as a set of code, objects, components that are part of a single logical unit.
SOA differs, and is designed as multiple services / applications interacting via message based communication.
An application will have a set number of logical layers. Physical tiers are less than or equal to the number of logical layers. In badly designed applications, the number of logical layers defaults to the number of physical tiers.
Physical n-tier architecture is not the same as SOA.
SOA goals: loose coupling, reuse of functionality, open communication.
N-tier goals: performance, avoidance of code duplication, targeted functionality.

#### Logical and physical model differences
Traditionally an application is generally divided into 3 logical layers: interface, business logic, data management. (Today though the interface is usually split into 2 layers: browser and web server.) If not designed properly it isn't always possible to put a physical boundary between logical layers. Other times, performance is impacted: data binding is very chatty between presentation and business layers so doesn't work well with a network boundary between.
The more physical tiers, the worse the performance. Potential however to increase scalability, security, fault tolerance.
##### Performance v Scalability
##### Security
##### Fault Tolerance

#### 5-layer logical architecture
CSLA.NET is based on a 5 layer logical architecture comprising: Interface, Interface Control, Business Logice, Data Access, Data Storage and Management.
[Discussion on each layer]

This can be applied in different ways physically depending on the technology and purpose.
[Discussion on each scenario]

CSLA.NET can switch between different deployment scenarios based on configuration file changes on the client and the configuration of the servers.

### Managing business logic

All layers need to interact with the application's data. Business, validation and authorisation rules are often duplicated / spread between layers / in a non optimal layer e.g. UI layer input data is only validated when it has reached the data layer. 

A better solution is to share business logic across tiers. This can be satisfied by mobile business objects where the .NET framework encapsulate the details of moving objects between layers by value.

#### Business objects

The key to successful object design is encapsulation: the object is a black box, which contains behaviour / logic and the data required by that logic. Business objects are objects which are related to the business for which the application is being developed.
The data in a business object is `smart data`, the object contains data and logic which goes along with the data.

#### Mobile objects

This kind of OO design is difficult for n-tier applications running in separate processes on different machines.
To minimize complexity, many applications are OO only within a particular tier. This can increase performance, but does break encapsulation.
Instead mobile objects can be used.

##### Local, anchored and mobile objects
Local
By default .NET objects are local and aren't accessible from outside the process they are created in.

Anchored
A reference can be passed from an object in one process on one machine to an object in a different process. Any property or method calls are sent across the network so the object should be designed to use few method calls e.g. one. This design is true for objects with methods exposed via WCF. In .NET anchored objects are created using `[ServiceContract]` and `[OperationContract]` attributes. Older .NET remoting objects can inherit from `MarshalByRefObject`.

Mobile 
Mobile objects are passed by value between processes, copying the objects data across the network. In .NET add the `[Serializable]` attribute to a class, or implement `ISerializable`. Alternatively WCF allows the `[DataContract]` and `[DataMember]` attributes, however, all only those methods so marked will be serialized so this way it is easy to introduce a hard to find bug.

Anchored and mobile objects can be used in parallel to ensure when an object is required to e.g. run on the application server, this is guaranteed.

Passing mobile objects by reference.
These objects are actually passed by value, but the .NET framework gives the illusion of passing by reference. When returned to the calling code, the original reference is replaced with a reference to the new object. Any other references to this object will potentially still be pointing at the old object, so care must be taken to update all references to point to the new object.

## Chapter 3: CSLA .NET Framework

### Basic design goals

Specifically CSLA maps the architectural layers into these technologies:

Layer | Technologies
--- | ---
Interface | WPF, Silverlight, WP7, ASP.NET, WCF, Windows Forms
Interface Control | Viewmodel object, Controller object, Code-behind, Service implementation
Business | CSLA .NET business domain objects
Data Access | ADO.NET, ADO.NET Entity Framework, and many others
Data Storage | SQL Server, Oracle, DB2, MySQL, XML or JSON services

An ideal situation is that any nonbusiness objects will already exist, e.g. ui controls, dtos.

#### Business rules
Consist of validation rules (data is valid), business rules (involve some kind of calculation to alter an object) and authorization rules.
Business rules can be hand-coded or use `DataAnnotation` attribute rules.
Rules may run synchronously or asynchronously. Asynchronous rules allow CSLA to update the object when returning, and synchronous may therefore just as well follow the same approach.
Validation rules generally return valid or invalid. Invalid  can have different severities, info, warning or error, and potentially additional information available. Broken rules are maintained in a list.
Databinding infrastructures make use of the IDataErrorInfo and INotifyDataErrorInfo interfaces to automate the display of error messages in ASP.NET MVC etc (display of warning or info messages require custom code).

#### Tracking Whether the Object Has Changed

There are different ways of tracking this. CSLA maintains a flag set to `true` if any property is changed to a new value.

#### Strongly Typed Collections of Child Objects
.NET framework provides several powerful collection classes. `BindingList<T>` and `ObservableCollection<T>` provide data binding collection support. CSLA contains classes which derive from these and should be used according to the UI technology in use.

#### N-Level Undo Capability
More useful for windows forms applications, no overhead incurred if not used.

#### Class in Charge (Factory pattern)
CSLA utilises the *Class in charge* approach (variation on the factory design pattern) to keep UI code simple and abstract. A *factory* method is responsible for creating and managing an object. Often these methods are static methods, hence "class in charge". CSLA allows two approaches, static methods in the class concerned, or instance methods which in turn call a factory class.

#### Supporting Data Binding
Data binding is an important feature of each UI technology on the Microsoft platforms. It offers:
* good performance, control and flexibility
* can be used to link controls to properties of business objects
* reduce UI code

Editable objects should implement `IEditableObject`, supporting one level undo in grids etc. If an objects data changes, it must form the UI that a refresh is required. This is done by implementing INotifyPropertyChanged, which defines the `PropertyChanged` event. `INotifyPropertyChanging` can be used for before events. `INotifyCollectionChanged` equivalent can be implemented by list collections. If deriving from `ObservableCollection<T>` this will already by implemented. CSLA base classes ultimately derive from this.

##### Events and serialization
When an object is marked as serializable, the .NET framework will serialise this object and all objects it references (unless marked with the `[NonSerialized]` attribulte). If the object is handling e.g. an event raised by a form, then the .NET framework will attempt to serialise not only the object but also the form (reference from object to form is largely invisible to the .NET developer).
This can be resolved by marking the events as `[NonSerialized]` (already implemented by `ObservableCollection<T>`).

#### Object Persistence and Object-Relational Mapping

A good object model is not the same as a good relational data model. Relational models are concerned with storing data and often conform to rules of normalisation (e.g. third normal form). Object models are concerned with modelling behaviour. An object should have one clear responsibility. The data does not define the object, rather the role the object plays within the business domain.

`CustomerEdit` - responsible for adding and editing customer data
`CustomerInfo` - responsible for providing read-only access to data

##### Behaviour is normalised, not data

Futhermore, data in objects does not need to be normalised like it would be in a database. Instead behaviour should be normalised, not data.

Behaviour and rules can be abstracted into their own classes for reuse. This means data can be repeated, but the rules kept seperate and used where necessary.

Business object oriented design relies heavily on *collaboration*. One object should collaborate with other objects to do its work.

##### ORM

ORM tools have difficulties working against behavioural object-oriented designed systems, since by there nature, they tend to create objects closely modelled on the database.

CSLA 4 defines a standard set of five methods for creating, retrieving, updating, and deleting objects: Create, Fetch, Update, Delete and Execute. 

##### Data Portal

The data portal is anchored and will always run on the application server. Mobile business objects interact with the data portal in order to retrieve default values (create), fetch data (read), update or insert data (update), remove data (delete), or execute server code (execute). 

##### Authentication

Windows authentication, ASP.NET membership authentication as well as custom authentication is supported.  

### Framework design

The CSLA framework is broken down into several functional groups:
* Business object creation
* Data binding support
* N-level undo functionality
* Validation and business rules
* A data portal enabling various physical configurations
* Transactional and non-transactional data access
* Authentication and authorization 
* Helper types and classes

#### Business object creation

#### Data binding support
#### N-level undo functionality
#### Validation and business rules
#### A data portal enabling various physical configurations
#### Transactional and non-transactional data access
#### Authentication and authorization 
#### Helper types and classes

