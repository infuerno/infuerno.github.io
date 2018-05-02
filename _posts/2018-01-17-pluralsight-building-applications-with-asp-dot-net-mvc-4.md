---
layout: post
title: "Pluralsight: Building applications with ASP.NET MVC 4"
---
## Shortcuts
* Ctrl + . - to activate the contextual menu to e.g. add missing using statements
* F12 - go to implementation
* F9 - set a breakpoint
* Ctrl K, C - comment out code
* Ctrl K, D - format code
* Ctrl . - implement an interface

## Introduction to ASP.NET MVC 4

* The MVC 4 Visual Studio project templates use HTML5 by default. 
* `<meta charset="utf-8"` is added (necessary to [avoid some XSS vulnerabilities](https://www.html5in24hours.com/meta-charset-protects-against-hackers/)) - place as the first element within `<head>`.
* `<meta name="viewport"` tag is also added - important for mobile devices - tells the device that the site has been designed to work on a mobile device, so don't assume it needs e.g. 900px
* modernizr.js ensures old browsers work fine with new HTML5 tags
* MVC Framework runs on the core ASP.NET runtime - been around for 10 years - stable, secure - HTTP modules / handlers / caching / diagnostics
* `ViewBag` is a dynamically typed object in C# - add any property and it will be available to the view to pull out and display
* `@` tells the razor view engine that here is a C# expression - evaluate it and write the results into the response at this point
* `@model` directive (uses lowercase 'm') to inform the view about the model e.g. `@model OdeToFood.Models.AboutModel`
* `@Model` (uppercase 'M') is then a strongly typed object available on the view

## Controllers in ASP.NET MVC 4

### Routes and Controllers
The routing engine is a core part of ASP.NET - it isn't tied to the MVC framework, you can use the routing engine to route requests for ASP.NET web forms, MVC services, any type of resource.

The routing engine is given a "map" to follow using the MapRoute API to specify: friendly name; pattern; default parameters. After the request passes through the routing engine, a `RouteData` data structure is populated with the details and available throughout the request not only to the MVC framework but also in controllers and views.

```
RouteData.Values["controller"]
RouteData.Values["action"]
RouteData.Values["id"]
```

The order in which routes are added to the global route collection is significant. The first route the URL matches, wins.

If there is a file on the file system matching the URL, then the MVC framework doesn't interfere.
However some virtual .axd files which don't really exist can be troublesome, so for this it explicity ignore in the `RegisterRoutes` method. i.e. `routes.IgnoreRoute("{resource}.axd/{*pathInfo)"`

### Action and Parameters

* `return Content("hello")` will literally return content rather than using any views
* Any public method added to a controller is potentially addressable (don't add any public methods that you don't expect to be called via a URL)
* If you add a parameter to an action, the MVC framework will do everything it can to populate it for you, looking all around the request at routing data (parsed from the URL), query string, POSTed form values. 
* `Server` is a property which is inherited on the controller to get to server type utilties including `Server.HtmlEncode` (razor view engine encodes automatically)

### Action Results

Name | Framework Behaviour | Producing Method
---|---|---
ContentResult | Returns a literal string | Content
EmptyResult | No response | 
FileContentResult / FilePathResult / FileStreamResult | Returns the contents of a file | File
HttpUnauthorizedResult | Returns an HTTP 403 status
JavaScriptResult | Returns a script to execute | JavaScript
JsonResult | Returns data in a JSON format | Json
RedirectResult | Redirects the client to a new URL | Redirect
RedirectToRouteResult | Redirect to another action, or another controller's action | RedirectToRoute / RedirectToAction
ViewResult / PartialViewResult | Response is the responsibility of the view engine | View / PartialView

* All class names derive from `ActionResult`

### Action Selectors

`ActionName` selector attributes decorate public action methods and alter the name by which the action can be invoked. The below method is now invoked using `Modify` and can't be invoked using `Edit`.

```
[ActionName("Modify")]
[HttpPost]
public ActionResult Edit(string departmentName)
{
	// ...
}
```

`AcceptVerbs` selector attributes specify the HTTP verb which is allowed to invoke an action e.g. `[HttpPost]`

### Action Filters

Action filter attributes apply pre and post processing to an action, to add cross cutting logic - logic which needs to execute across multiple actions without duplicating code.

Name | Description
---|---
OutputCache | Cache the output of a controller
ValidateInput | Turn off request validation and allow dangerous input
Authorize | Restrict an action to authorized users or roles
ValidateAntiForgeryToken | Helps prevent cross site request forgeries
HandleError | Can specify a view to render in the event of an unhandled exception

Action filters can be applied at the method level, the class level OR the global level via FilterConfig.RegisterGlobalFilters e.g. the HandleError attribute. This uses the Error.cshtml view by default (when CustomErrors are on)

Custom action filters can be created by creating a class which inherits from `ActionFilterAttribute`. There are 4 main methods availble to override:
1. `OnActionExecuting` - look at the request before an action executes
2. `OnActionExecuted` - after the action method executes
3. `OnResultExecuting` - before the result is executed
4. `OnResultExecuted` - after a result is executed.

These action filters are very powerful - change the environment, change results, change parameters. In each method, the filter context@ holds different information relevant to that particular scenario e.g. parameters

## Razor Views

* There are 2 view engines registered by default in the MVC runtime: web forms engine and razor view engine.
* Right click inside an action and select "Add View"
* Razor will automatically html encode any output sent through the `@` sign (`@Html.Raw` will override this)

### Code Expressions

* `@item.Rating / 10` is an implicit expression - razor will evaluate the first part, but then print out `/ 10` lterally
* `@(item.Rating / 10)` is an explicit expression - razor will evaluate the whole thing
* `R@item.Rating` will not be interpreted correctly, but treated as literal text - need to explicity say `R@(item.Rating)`. On the other hand `@item.City, @item.Country` is interpreted as expected
* Email addresses will be output literally without issue, but twitter handles e.g. `@infurnex` will need to be escaped i.e. `@@infurnex`
* The razor view is good at working out what is markup and what is C# code, but a literal string not within tags may be treated incorrectly as C# code e.g. "Review". To ensure this is treated as literal text use `@:Review`
* Use `@{ ... }` for code blocks. The expressions are only valuated and not written at all.

### Layout Views

* Two special methods: `@RenderBody()` and `@RenderSection()` - allows normal views to plug in their content to specific locations in the layout.
* `_Layout.cshtml` - conventionally starts with an underscore to denote not a primary content view
* `_ViewStart.cshtml` - sets a layout property - convention with the razor view engine - if you have this file, it will be execute before the view is rendered. Can have multiple `_ViewStart.cshtml` files which work in a hierarchy e.g. one in the root of the Views folder, then one inside a subfolder for to be used for a subset of Views
* `Layout = null` if you don't want to use a layout view
* `@RenderSection("featured", required: false)` can be included in a layout view and then specified within regular views using `@section featured{ .... }`

### HTML Helpers

* Makes it easy to create small blocks of HTML. There are helpers to create inputs, links, validation messages, labels and more. 
* Mainly intelligent e.g. `@Html.EditorFor()` will emit an `<input type="text"/>` for strings and `<input type="checkbox"/>` for booleans
* All methods are available from the `Html` property that a view inherits
* `Html.ActionLink("Edit", "Edit", new { id = item.ID }"` will render a link with text "Edit" pointing to the Edit action, and will pass an anoymous object along to the routing engine, which will contruct the URL intelligently working out where to put the id value into the URL e.g. `/Reviews/Edit/3`
* `Html.BeginForm()` will emit a form tag. With no additional params, the action will be the same URL we came from, with method POST.
* `Html.HiddenFor(model => model.Id)` emits a hidden input field
* `Html.LabelFor(model + model.Name)` emits a label field with a `for` attribute, useful for accessibility
* These methods will also populate the `id` and `name` attributes to match the property name of the model - necessary for the way the MVC framework tries to populate properties based on convention
* `data-` attributes are also added, used for client side validation
* Model binding - happens when parameters are used in an action request as well as when using `TryUpdateModel(model)` method
* Other useful helpers: `CheckBoxFor`, `Display` helpers, `Name` helpers, `RouteLink` helpers, `ValidationMessageFor`
* Custom helpers are useful - if lots of logic in the view, think about a custom helper

### Partial Views

* Partial views allow:
   - reusing code across multiple views
   - delegate work to another controller
* Name usually starts with an `_` e.g. `_Review.cshtml`
* Rendered using `Html.Partial("_Review", item)` where item is the model - this method can only be passed the current model, or part of the current model
* The location of the partial view file will determine which pages are allowed to use it
* Use `Html.Action` when rendering something not part of the current model e.g. render a partial outside of the normal context of that partial e.g. on the layout page to show the best review. This method issues a subrequest which calls another controller action independently e.g. `Html.Action("BestReview", "Reviews")` to call the `BestReview` action on the `Reviews` controller
* `return PartialView("_Review", bestReview);` from this controller to render the partial view
* Add attribute `[ChildActionOnly]` so that this action cannot be called directly via a URL

## Working with Data (Part 1)

Schema first - existing database - graphical designer in VS, imports schema and generates classes needed to manipulate the schema - thereafter change the database and update the schema and the model
Model first - use the graphical designer to draw a model - EF generates both the classes and the database schema
Code first - write classes - EF uses these to generate the database schema using conventions (which can be overridden)

* Need model classes - express relationships between them e.g. `Restaurant` model contains `ICollection<RestaurantReview> Reviews`, correspondingly `RestaurantReview` has an `int RestaurantId` property
* Need class to interact with the database derived from `DbContext`, this class has strongly typed `DbSet` properties e.g. `DbSet<Restaurant> Restaurants` and `DbSet<RestaurantReview> Reviews` (this latter could be retrieved via the Restaurant object, but this allows for more complex scenarios)
* Can now instantiate the db context derived class e.g. `var _db = new OdeToFoodDb();`
* Since this is a disposable resource, should also override the Dispose method in a controller and call Dispose on the db context derived object. Cleaning up as soon as possible is good practice.

```
protected override void Dispose(bool disposing) {
    if (_db != null) _db.Dispose();
    base.Dispose(disposing);
}
```

* Now in the action method, can get the resturants from the database e.g. `var model = _db.Restaurants.ToList();`
* In the view, define the model as `@model IEnumerable<OdeToFood.Models.Restaurant>`
* If EF can't find an existing database it will just create one. If there are no specified connection strings anywhere, it will use the default instance of LocalDB and create the database with the fully qualified name of the DbContext.
* To explicity define the location of the database, pass the connection string into the constructor of the DbContext base class e.g. `public OdeToFoodDb() : base("server=.; initial catalog=odetofood; integrated security=true") { }` 
* Better still, reference the connection string by name from a config file: `public OdeToFoodDb() : base("name=OdeToFoodDbConnection") { }`
* EF migrations can not only sync changes, but also populate with seed data
* `Enable-Migrations -ContextTypeName OdeToFoodDb` - will create `Configuration.cs` and an initial migration file
* Within the new Configuration class, `AutomaticMigrationsEnabled` flag is set to false by default, but useful to set to true for initial development
* The Seed method can be used to add reference data, will be called after each migration to the latest version
* Use the AddOrUpdate() method to ensure duplicates aren't added e.g. `context.Restaurants.AddOrUpdate(r => r.Name, new Resturant() { ...}, etc )` 
* Can configure the application to automatically apply updates
* Can explicity use `Update-Database -Verbose` via the package manager console
* To update the database with the model having made model changes:
    - Either create a migration script and run it (migration.cs file in the project)
    - OR simply update the database (requires `AutomaticMigrationsEnabled` set to TRUE) (will not create an explicit migration.cs code file)
* EF keeps track of which migration scripts have been applied, which haven't and which order they need to be applied (in `_MigrationHistory`)

### LINQ

Two different styles:
* Comprehension Query Syntax: `var model = from r in _db.Restaurants where r.country == "USA" orderby r.Name select r;`
    - Starts with the `from` keyword
    - Introduces a range variable, e.g. `r` which can be used throughout the rest of the query
    - Keywords for filtering, grouping, joining and projecting e.g. `where`, `orderby`, `select`
* Extension Methods Syntax: `var model = _db.Restaurants.Where(r => r.Country == "USA").OrderBy(r => r.Name).Skip(10).Take(10);`
    - here you can also use `Skip()` and `Take()` methods here

There are numerous extension methods available 
* 101 LINQ Samples on MSDN: http://code.msdn.microsoft.com/101-linq-samples-3fb9811b
* LinqPad: http://www.linqpad.net - comes with 100s of samples
* Pluralsight courses

Use a projection to create a new anonymous type with the exact fields required e.g.
```
var model = from r in _db.Restaurants where r.country == "USA" orderby r.Name
    select new { r.Id, r.Name, r.City, r.Country, NumberOfReviews = r.Reviews.Count() };
```
Passing this to the view is difficult since it is an anonymous type. Instead create a view model object with these fields and create an instance of this type instead.

Alternative syntax using Extension Methods Syntax:
```
var model = _db.Restaurants.Where(r => r.Country == "USA").OrderBy(r => r.Name)
    .Select(r => new { r.Id, r.Name, r.City, r.Country, NumberOfReviews = r.Reviews.Count() });
```

To filter using a parameter which may be null use: `.Where(searchTerm == null || r.Country.StartsWith(searchTerm)`


## Working with Data (Part 2)

* The `Find` method of a DbSet object allows you to search on the primary key

### Listing Reviews

* `Html.ActionLink()` method has various overloads:
    - `Html.ActionLink("LinkText", "ActionName", new { id=item.Id })`
    - `Html.ActionLine("LinkText", "ActionName", "ControllerName", new { id=item.Id }, null)` to specify a different controller (if you forget the last parameter, the override with `htmlAttributes` for the last parameter, not `routeValues` will be chosen)
    - the `htmlAttributes` parameter allows you to specify extra attributes e.g. `target="_blank"` i.e. `new { target="_blank" }`
* By default in a controller you would expect any `id` paramter to relate to the entity for this controller. `public ActionResult Index([Bind(Prefix="id")] int restaurantId)` will allow the parameter to be bound called `id` and keep this simple in views and routes, but also make it explicit that this is not the id of a review, but the id of a restaurant in the actual controller.
* EF doesn't load up associated child collections automatically
* Adding the keyword `virtual` to the model definition of the child collection e.g. `public virtual ICollection<RestaurantReview> Reviews { get; set; }`. A wrapper will now be created to intercept calls to the Reviews property to ensure these are now loaded via a second call to the database. Two queries instead of one may be a worry - if so read this on eager loading: http://msdn.microsoft.com/en-US/data/jj574232

### Creating a Review

* Update the ActionLink for create to pass in the restaurant id - will be added to the query string, since no matching route
* Add an `[HttpGet]` create action which takes in this id and returns an empty view
* The default action of the form will post back to the same URL, so with therefore have the restaurantId in the query string still
* The default scaffolded view uses `@using (Html.BeginForm())` - the form implements IDisposable, so any resources are disposed of immediately, not really important here, but could be
* The `[HttpPost]` create action will have a parameter of `RestaurantReview` which will be populated automatically from both the POST form and the restaurant id in the query string
    - first check the model is valid: `if (ModelState.IsValid)`, if it isn't just return the same view
    - add the new review to the reviews collection e.g. `_db.Reviews.Add(review)`
    - save it to the database e.g. `_db.SaveChanges()`
    - then return to a different view where the new entity can be seen (e.g. index view)

### Editing a Review

* Edit link is provided on a list page by the default scaffolding
* In the `[HttpGet]` `Edit()` method, the id is passed in, use `Find` to retrieve this review and pass to the view
* Need hidden fields for both the review id and the restaurant id
* Similar to create, the model is passed the action, `ModelState.IsValid` is checked and the same model returned to the view if not
* The DbContext `Entry` API tells EF that we want to start tracking an entity, set to the state to modified i.e. `_db.Entry(review).State =  EntityState.Modified`
* Save changes and redirect back to an index view

### Security implications of model binding

* Overposting or Mass assignment is the automatic model binding which will grab everything from everywhere possible to try to populate the model, potentially
* For more information http://odetocode.com/blogs/scott/archive/2012/03/11/complete-guide-to-mass-assignment-in-asp-net-
* Not the best, but one of the easiest is to use the `Bind` attribute on an action method e.g. `public ActionResult Edit([Bind(Exclude="ReviewerName")] RestaurantReview review)` (can also use `Include`)
* Another approach is to use a ViewModel

### Validation Annotations

* Use data binding attributes e.g. `[Range(1,10)]`, `[Required]`, `[StringLength(1024)]`
* Other attributes include regex, comparing two properties, remote validations (calls back to the server as a user types in)
* After adding data annotations EF recognises that the schema is now out of date with the model
* `Update-Database -Verbose` to update the schema - may fail if e.g. column previously had no length and now given a limit - use `Update-Database -Verbose -Force` to force the update
* Validations run on both server side and client side
* Also data attributes to influence the display e.g. `[Display(Name="User Name")]`, `[DisplayFormat(NullDisplayText="anonymous")]` - this latter only affects the display - NOT the database'

### Custom Validations

* Write custom validation attributes when you want to apply to multiple models (write a class which derives from `ValidationAttribute`)
* Only happens on the server by default unless you write client side validation too
* Alternative is for your model to implement `IValidatableObject` and write the `Validate` method body. Here you have access to the whole model. Validation errors will be displayed where the `Html.ValidationSummary(true)` tag is included on the view. Changing the parameter to false will display ALL errors.

## AJAX and ASP.NET MVC

* `_references.js`, `xxx.intellisense.js` - for intellisense
* `xxx.unobtrusive...js` - authored by the MVC team, serve as a bridge between ASP.NET MVC and jQuery. Need the `unobtrusive` scripts for some of the client side validation to work - it takes metadata which is emitted by HTML helpers (e.g. EditorFor) and feeds the data into the jQuery validations
* `@Scripts.Render("~/bundles/modernizr"` will emit the correct HTML to include the modernizr libraries (need to be at the top of the page)
* `@Scripts.Render("~/bundles/jquery"` included at the bottom of the page (as most script files should be)
* `@Scripts.Render()` and `@Styles.Render()` give minified bundles of JS and CSS respectively - the ASP.NET bundling feature can bundle scripts together at runtime
* `BundleConfig.RegisterBundles(BundleCollection bundles)` is called from the `Application_Start()` in `Global.asax.cs`
    - the `{version}` tag will substitute for a version number so you can update js libraries without changing C# code
* Bundling and minification only happens in release mode i.e. `<compilation debug="true"/>` in the web.config

### AJAX Helpers

* Where `Html.BeginForm()` makes a synchronous request to the server, `Ajax.BeginForm()` makes an asynchronous request to the server to redraw just a portion of the screen. The `AjaxOptions` object passed in, tells the helper which part of the page to update

```
@using(Ajax.BeginForm(new AjaxOptions(HttpMethod="get", InsertionMode = InsertionMode.Replace, UpdateTargetId = "restaurantList")) {
    <input type="search" name="searchTerm"/>
    <input type="submit" value="Search By Name" />
}
<div id="restaurantList"> ... </div>
```

Just by itself this will draw a page within a page. To correct this, first put the `<div id="restaurantList"> ... </div>` inside a partial view e.g. `_Restaurants.cshtml` and add the `@model` directive to strongly type it. The controller will then need to decide to either return the whole page view e.g. `Index.cshtml` or just the partial. In the controller add:

```
if (Request.IsAjaxPartial()) {
    return PartialView("_Restaurants", model);
}
return View(model);
```

### Behind the scenes

* MVC provides 3 AJAX features out of the box: `Ajax.BeginForm()`, `Ajax.ActionLink()` and client side validation. 
* These 3 features all use an approach called **unobtrusive** javascript which uses the HTML 5 data-* attributes to inject javascript into the page. Without javascript enabled, all features continue to work using server side functionality instead. 
* Instead of using the built in features of e.g. `Ajax.BeginForm()`, a similar technique can be written from scratch
* `@Url.Action("Index")` is helpful to generate the URL to the Index action

### Autocomplete

* New action on the controller e.g. `public ActionResult Autocomplete(string term)` (documentation for jQuery uses the name `term` for the parameter) which queries the database, get any restaurants starting with `term` and projects each one into a new object with property called `label` containing the name of the restaurant.
* Then `return Json(model, JsonRequestBehaviour.AllowGet);` to return results in JSON
* Wire this up on the element needing autocomplete, e.g. the searchTerm `<input />` tag using a data-* attribute e.g. `data-otf-autocomplete="@Url.Action("Autocomplete")"`
* Then write the JavaScript to implement this:
    - add the javascript to each element using a function `$("input[data-otf-autocomplete]").each(createAutocomplete);`
    - the `createAutocomplete` function will
        + get the input in question, wrap in jQuery using `$()` e.g. `$input = $(this)`
        + construct an options object which at a minimum has a `source` property - the URL to get the data from
        + finally call the jQuery autocomplete function on the input object e.g. `$input.autocomplete(options)`
* The option `select` can define a function which will be invoked when the element in the drop down list is selected. In this way, when selecting the options, you can also trigger the search at the same time.

### Paging

* Using `PagedList.Mvc` NuGet package (which in turn depends on package `PagedList`)
* Adds extension methods for LINQ, HTML helpers and a PagedList.css
* In the controller: 
    + Add a new integer parameter to the Action called page with a default value of 1 e.g. `, int page = 1)`
    + Convert the regular list received from EF to a `PagedList` using the extension method `ToPagedList(page, 10)`, specifying the page and the size
* In the UI:
    + Update the model declaration from `IEnumerable` to `IPagedList`
    + To avoid fully qualifying each type, add the namespaces following to the web.config **in the Views folder** 
    + Add a call the HTML helper `@Html.PagedListPager(Model, page => Url.Action("Index", new { page }), PagedListRenderOptions.MinimalWithItemCountText`
        - lamda expression which given a page will return the URL to go to that page. The PagedListPager will pass the page
    * Add the PagedList.css to a bundle

To convert the paging from a full post back to partial post backs using JavaScript, as with search we could wire up an event on the anchor tags. However this is part of the HTML in the partial view which gets rerendered each time we search, so they would have to be rewired with every partial page load. Instead wire up the event to something outside of this section e.g. the `main-content` div, specifying how to filter the events:

`$(".main-content").on("click", ".pagedList a", getPage)` 

The `getPage` function has been written to be generic:

```
var getPage = function() {
    var $a = $(this); // wrap the 'a' with jQuery so we can
    var options = {
        url: $a.attr("href"),
        data: $("form").serialize(), // add the form vars to the request so anything in the search box is taken into account
        type: "get"
    };
    $.ajax(options).done(function(data)) {
        var target = $a.parents("div.pagedList").attr("data-otf-target"); // generic way of doing this
        $(target).replaceWith(data);
    });
    return false;
}
```

## Security and ASP.NET MVC

### Authentication

There are 3 ways to identify a user in ASP.NET:
1. Forms authentication - the website provides a page with an input form, user enters username and password, application checks password - relies on cookies and SSL
2. OpenID / OAuth - rely on a third party to authenticate the user and then tell you who they are
3. Windows authentication - also know as "Integrated Auth", for intranets

#### Windows Authentication

* Changing VS generated forms authentication over to windows authentication is possible, but messy. Best to start again!
* IE will not work with "localhost" off the bat until you add localhost to the intranet sites list

#### Forms Authentication

* ASP.NET with forms authentication configured will automatically redirect to the configured login page if a user tries to access a restricted page
* ASP.NET sets an authentication cookie to track users authentication status
* In ASP.NET MVC 4 - project template automatically includes controllers, views and models.
    - The controller makes use of a class called `WebSecurity` from a Microsoft library named WebMatrix.
    - `WebSecurity` in turn talks to a component called `SimpleMembershipProvider`
* You can customise the information stored about a particular user
    - Inside the Filters folder - `InitializeSimpleMembershipAttribute.cs` - forms auth is initialised in a lazy manner in case you don't want to use forms auth
    - If you do want to use this, you can move the call to `WebSecurity.InitializeDatabaseConnection(...)` to the `Application_Start()` method and delete the filter
    - Also, you may want to change the `AccountModels.cs` file. 
        + Inside this file, there is a `UsersContext` class, which gives access to the `UsersProfile` table. However this table can simply be added to the `DbContext` for the application instead. 
        + Additionally move the `UserProfile.cs` file into the models folder and customise as required e.g. `string FavouriteRestaurant`
        + Add the `DbSet<UserProfile> ` to your existing DbContext class
        + Remove the `[InitializeSimpleMembership]` attribute fromt the `AccountController` class
        + Change any existing references to the generated DbContext to the existing DbContext class
        + Run `Update-Database` to create the `UserProfile` table (implicit migrations enabled)
* The database tables created and used by WebSecurity are prefixed with `webspages_`: `webpages_Membership`, `webpages_OAuthMembership`, `webpages_Roles`, `webpages_UsersInRoles`

### Authorisation

#### Seeding Membership

* Either SQL or use the `SimpleMembershipProvider` APIs (more robust) in the `Seed()` method
```
    WebSecurity.InitializeDatabaseConnection( ... )
    var roles = (SimpleRoleProvider)Roles.Provider; // use to check and create roles
    var membership = (SimpleMembershipProvider)Membership.Provider; // used to check and create users

    // add actual data checks and insert
```

* This will not work out of the box in library project rather than a real web project. Requires some configuration in the web.config. Explicitly configure the `<roleManager .../>` and the `<membership .../>`, clearing any previously configured providers and adding the simple membership ones
* `User.Identity.Name` to get a user's username
* `User.IsInRole("admin")` to check role membership

### Cross Site Request Forgery CSRF (C-Serf)

* This happens when a user who is authenticated on a particular application e.g. facebook to clicks on a link. This page then submits a form to facebook doing something malicious. Can also be used to send all cookies via javascript etc.
* In order to prevent this, need to ensure the user is clicking on a form that has been served to them by the correct web server
* In ASP.NET MVC this is achieved via an `AntiForgeryToken`.
    - On the form submit action add the attribute `[ValidateAntiForgeryToken` - this checks a `__RequestVerificationToken` field (which doesn't exist by default)
    - Add the verification token to the form using `Html.AntiForgeryToken()` somewhere on the form - this generates a cryptographically significant value is added both to the form and a cookie. It needs to match on both the form and in the cookie for MVC to allow the request. This works since browsers don't allow one site to set cookies for a different site

### OpenID / OAuth

* OIDC support is added to MVC via an open source project called DotNetOpenAuth: http://www.dotnetopenauth.net
* The `RegisterAuth()` method inside the `AuthConfig` class has various blocks of commented out code to register - most require some kind of configuration on the 3rd party, but otherwise support is out of the box
* Can either log in with an external account OR a local account - if you already have a local account, but now wish to link an external account, that is possible on the default "Manage Account" page

## ASP.NET MVC Infrastructure

### Caching

* `[OutputCache]` action filter will cache action results e.g. `[OutputCache(Duration=60, VaryByParam="none")]` (where duration is specified in seconds)
* Best strategory for caching is first gather metrics to know where caching would best be utilised
* Can also be used on child actions - so parts of the page can be cached, but not the whole page
* Other settings include:
    - `VaryByParam` will default to '*' caching for every permutation possible (which is usually what is wanted), "none" would always return the same results, "name1;name2" to vary by named parameters
    - `Location` defaults to anywhere - cached on the server, and the client can also cache the result, but can be more specific
    - `VaryByHeader` vary on a header e.g. `Accept-Language` to ensure cached English text is not returned to a browser requesting the page in German
    - `VaryByCustom` - override a method on Global.asax to create a custom caching logic
    - `SqlDependency` - cache until data in a sql server table changes - not widely used - restrictions on type of SQL query can be used
* Be careful if there are AJAX calls to populate content on the page - the response which will be cached may or may not be the full page and if the content is fetched differently the second time, this could lead to strange results. `VaryByHeader` can be used to vary with the `X-Requested-With` header which is different for AJAX requests
    - be aware that some browsers won't treat these any differently, additionally adding `Location = OutputCacheLocation.Server` fixes this
    - Alternatively can use a different action for the AJAX request
* Difficult to predict cache duration in development - put into production - add load - make adjustments - to help there is a `CacheProfile` attribute which names a profile which can then be defined in config (`<system.web><caching> ...`) - central place for all values to be defined as well as ability to update in production

### Localisation and Culture

* Two settings: 
    - `Thread.CurrentCulture` impacts fomatting e.g. for dates and currencies
    - `Thread.CurrentUICulture` impacts resource loading
* Properties can be set manually if the UI allows the user to select this manually OR ASP.NET can set these for you via the `Accept-Language` header - configured in web.config - `<system.web><globalization culture="auto" uiCulture="auto"/></system.web>`
* A resource file e.g. Strings.resx can have a localized version e.g. Strings.es.resx. The Build Action will be Embedded Resource by default.
* Resouces files can live within the web project, or a seperate library - simply add a .resx file - change the access modifier (drop down at the top of the resx editor) from internal to public - razor views are compiled into a different assembly than the web project and without the resx being public, they can't be seen by the views
* Data annotations can also use resources e.g. `[Required]` on a property would become `[Required(ErrorMessageResourceType=typeof(OdeToFood.Resources), ErrorMessageResourceString="RestaurantNameRequiredErrorMessage"])`

### Diagnostics

* ASP.NET Health Monitoring - use `<healthMonitorying enabled="true"><rules><add ...` - in the machine level web.config inside C:\windows\microsoft.net\framework\v4...\config\
    - Built in providers are the event log, sql server and wmi
    - `<eventMappings/>` section groups different types of events into buckets
    - `<rules/>` section adds mappings between events and providers - by default "All Errors" and "Failure Audits Default" go the the Event log
* log4net
* elmah
* P&P Application Logging Block

## Unit Testing with ASP.NET MVC

## Deployment and Configuration

