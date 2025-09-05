---
layout: post
title: "Pluralsight: ASP.NET MVC 4 Fundamentals"
---

### References
* https://docs.microsoft.com/en-us/aspnet/whitepapers/mvc4-release-notes
* HTTP Fundamentals Pluralsight course

### Keyboard shortcuts
* Select multiple rows, hold down Alt and start typing

### Curl options
* -X specify method
* -V verbose e.g. show request and response headers being sent / received in full
* -H specify headers e.g. -H "Accept: application/json"

## Introduction to ASP.NET MVC 4 Part 1

* Entity framework can do efficient change tracking by adding additional features to your objects IF you make the properties virtual.
* Abstraction for the data source of `IDepartmentDataSource` with getters of type `IQueryable<T>`. In the actual db context class, the implementation of these methods can simply return the `DbSet<T>` properties
* Use DI in the controller e.g. StructureMap - initialise scoped to a particular request

```
public class DepartmentDb : DatabaseContext, IDepartmentDataSource
{
    public DbSet<Employee> Employees { get; set; }
    public DbSet<Department> Departments { get; set; }

    public IQueryable<Employee> IDepartmentDataSource.Employees { get { return Employees; }}
    public IQueryable<Department> IDepartmentDataSource.Departments { get { return Departments; }}
}
```

* `Enable-Migrations` - creates a Migrations folder and add a `Configuration.cs` class
* To override the database connection properties, specify the name of the Connection String in the call to the parent DbContext constructor e.g. `: base("DefaultConnection")`

## Introduction to ASP.NET MVC 4 Part 2

* View models are more secure to decouple the information received from the user from the inforamtion saved to the database to combat "over posting" or "mass assignment".
* Add data attributes to the view model to control the display e.g `[Required]`, `[HiddenInput(DisplayValue=false)]`, `[DataType(DataType.Date)]`
* Add a `Save` method to the context's interface which will simply call EF's `SaveChanges` method for the real interface implementation

## The ASP.NET WebAPI

* Can be self hosted, but using a console project and `Install-Package Microsoft.AspNet.WebApi.SelfHost`
* API controllers need to inherit from `ApiController` rather than `Controller`
* Will handle verbs GET, POST, PUT, DELETE by default. Other methods available via `[AcceptVerbs]`. Looks at the start of an action name. 
* If you try to send a DELETE request to particular web servers, it may not be able to handle it and will return a message "File or directory does not exist on the server" e.g. IIS Express
    - to reconfigure IIS Express to accept other verbs, go to C:\Users\Claire\Documents\IISExpress\config\applicationhost.config - check for key `ExtensionlessUrl-Integrated-4.0` - by default only GET, HEAD, POST and DEBUG are specified. Add PUT and DELETE to the list. Save and try again.

### Content negotiation

* Simple objects are returned (rather than action results or view results in MVC). The format of the response will depend on "content negotiation".
* The `Accept` header in the request asks for the content in a particular format e.g. `image/png` (other headers exist to specify lanuage, encoding and character set)
* Set breakpoint at start of action method, go to intermediate window: `GlobalConfiguration` and then `GlobalConfiguration.Configuration` and finally `GlobalConfiguration.Configuration.Formatters` to show the 4 default formatters. Objects returned are turned into specific representations by one of these formatters.  

### Parameter binding

* Also different to MVC
* For primitive types, the WebAPI runtime will look in the URL and query string, but NOT in the message body by default
    - Add the `[FromBody]`  attribute in front of the type e.g. `public void Post([FromBody]string value) { ... }` 
* For complex types, these are expected to be in the body of a request e.g. a PUT or a POST
* The content-type of the request will determine which formatter is chosen to parse the body
    - Pass the body to curl using -d e.g. curl http://localhost:5000/api/videos/ -X POST -d "=scott"
    - For single parameters just use an `=` sign (as above), for complex objects, e.g. `id=1&title=mvc4` would work for an object with an id and a title (using the Form encoded data formatter)

* `db.Configuration.ProxyCreationEnabled = false;` - proxy creation helps with change tracking and lazy loading - but no reason to enable this for an API if you are getting data from the database and immediately sending to the client OR receiving data from the client and immediately saving to the database. 
* The default `_Layout.cshtml` contains a `@RenderSection("scripts", required: false)` at the bottom of the page, so each pages can specify custom scripts or inlude script tags if required. 
* Can use the razor syntax within JS to form URLs e.g. `var apiUrl = '@Url.RouteUrl("DefaultApi", new { httproute="", controller="videos" })` - the `httproute` property doesn't have to be set to anything, but must be present in order for the runtime to correctly resolve the route to the controller
* Useful to set up a global AJAX error handler so that if anything at all goes wrong AJAXwise, an alert can be displayed to aid debugging: `$(document).ajaxError(function (event, xhr) { alert(xhr.status + ":" + xhr.statusText); });`
* `throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotFound));` to return a 404 from an API
* `$(document).on("click", ".editVideo", editVideo)` - using the jQuery `on` method, you can wire up objects that don't yet exist
* `db.Entry(video).State = EntityState.Modified` to update an existing entry followed by `db.SaveChanges()`
