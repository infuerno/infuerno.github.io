---
layout: post
title: "Using CSLA 4 06 ASP.NET MVC"
---

### References

* https://www.red-gate.com/simple-talk/dotnet/asp-net/advanced-uses-razor-views-asp-net-mvc/

## Chapter 1: ASP.NET MVC

### ASP.NET MVC Introduction

#### MVC Design Pattern

Model, View, Controller map directly to 3 of the 5 CSLA.NET layers:

* Model > Business Logic
* Controller > Interface Control
* View > Interface

ViewModel objects are typically used in MVC since many domain objects are data centric and therefore don't have properties appropriate for a view. This often happens when using an ORM to create domain objects. HOWEVER, in CSLA business objects should already reflect the user scenario. ViewModels should not generally be required.

#### ASP.NET MVC Framework

The framework supports the MVC design pattern. For CSLA MVC, all controller need to inherit from the `Csla.Web.Mvc.Controller` base class.

* `ViewData` is a dictionary object for passing arbitrary data to the view, but also has a `Model` property for providing a reference to a model object. 
* `ViewBag` is a dynamic object and as such has no compile time checking. Typos are hard to spot.

The default MVC model binder works fine for objects with:

* a default constructor
* properties with getters and setters
* data validations, but nothing more complicated

For some CSLA objects the regular model binder will fail. In these circumstances the alternative CSLA model binder can be used.

### CSLA.NET MVC Features

#### ASP.NET Support

The `ApplicationContext` object (stored on the HttpContext in ASP.NET) contains:

1. Access to numerous configuration settings
2. 3 context dictionaries: `LocalContext`, `ClientContext`, `GlobalContext`
3. `User` property to access the principal

A reference to `Csla.Web` must be added to ensure all features work as expected.

#### ASP.NET MVC Support

Use of the MVC features is optional. The `Csla.Web.Mvc` assembly references the `System.Web.Mvc` assembly, so the correct version of the `Csla.Web.Mvc` assembly must be used.

Type | Description
---|---
`Controller` | Has `SaveObject` and `LoadProperty` methods simplify having to use 'new' objects whether for create, edit OR delete. `SaveObject` method accepts the object to be save, a boolean indicating create or update and an optional alternative implementation of UpdateModel
`CslaModelBinder` | The regular ASP.NET model binder invokes `DataAnnotations` attribute rules after copying postdata back to an object. However CSLA has also run the same rules when each property's `SetProperty` method is called during the model binding. The `CslaModelBinder` solves this problem by suspending rules when copying back (using `ICheckRules` interface) and then invoking all business and validation rules for the object. If using this model binder with list objects, ensure the `name` property of each HTML element follows the ASP.NET MVC list conventions i.e. the name will be rendered as `[0].personId` or `[0].firstName` (literally). `Html` helper methods will take care of this. The custom model binder must be loaded at application start i.e. in `Application_Start` of `Global.asax.cs` either globally - use `ModelBinders.Binders.DefaultBinder = new Csla.Web.Mvc.CslaModelBinder();` - or for a subset of types - `var cslaBinder = new Csla.Web.Mvc.CslaModelBinder(); ModelBinders.Binders.Add(typeof(ProjectTracker.Library.ProjectEdit), cslaBinder);`. Using the `CslaModelBinder` for all types is usual.
`IModelCreator` | To bind the form collection to an object, an instance of the object needs to be created, often using `new`. In some circumstances for CSLA, the `create` factory method should instead by used. If the controller implements `IModelCreator` the method `CreateModel` needs to be implemented to specify how the model should be created e.g. by calling the static method `ProjectEdit.NewProject()`. `CreateModel` will be called by the `CslaModelBinder`. Alternative to this is to use view models (see below).
`HtmlExtensions` | The `Csla.Web.Mvc` namespace includes a `Html.HasPermission` extension method to customise the UI. The helper method defines markup which should be rendered if the user has permission and if the user doesn't have permission. In this way elements can be hidden or made read only as required. The `IAuthorizeReadWrite` can alternatively be used.
`HasPermissionAttribute` | Can be applied to a controller or action method. Used to leverage CSLA authorization rules for objects e.g. GetObject or CreateObject. Will redirect the user to the login screen if not authenticated or not authorised to perform this action. Generally UI elements should be hidden (e.g. using `Html.HasPermission`) but directly addressable controllers and actions must additionally be protected in this way.
`IViewModel` | Used with ViewModels which generally rely on an existing BO for most properties, but want to add extra read only properties to be displayed, or extra verbs for use by the controller. The controller implements `IViewModel`. When model binding back, the underlying business object is used.
`ViewModelBase` | Implements `IViewModel`. Optional. The ViewModel object will generally create / get the BO, rather than the controller (so the controller no longer needs to implement the interface).

#### MVVM

The MVVM pattern specifies that the view binds to a viewmodel object, and the viewmodel object manages the model object.

## Chapter 2: Business and Data Access Layers

## Chapter 3: Application Implementation

