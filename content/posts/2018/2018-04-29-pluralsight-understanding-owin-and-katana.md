---
layout: post
title: "Pluralsight: Understanding OWIN and Katana"
---
## What is OWIN?

Open Web Interface for .NET

    OWIN defines a standard interface between .NET web servers and web applications - www.owin.org

Abstract away the web server in a well defined way, so that web applications can be built to the abstraction and don't care which web server they are running on. .NET web applications were nearly always hosted on IIS (except e.g. ASP.NET Web API or Nancy FX).

In OWIN, the web server has been abstracted away to simply a dictionary and a delegate. Usually called the environment dictionary, or `AppFunc` and defined:

`using AppFunc = Func<IDictionary<string, object>, Task>`

Referencing it as `AppFunc` makes it easier throughout the code. The dictionary passed to the delegate includes all the information from the HttpRequest. Additionally the web server may expose functionality to the web application by inserting a delegate into the dictionary. The return `Task` is used to tell the server when the application has finished processing the request (so everything is asynchronous).

`var f = new AppFunc(environment => { return Task.FromResult(null); })`

### The Parts of OWIN

Host
: A process of some sort, SomeProcess.exe, which hosts all the other parts - a console app, windows server or even IIS - an is responsible for starting everything up.

Server
: Accepts incoming HTTP requests and returns HTTP responses (in IIS the host and server are in effect the same thing). Passes the request to the application using the AppFunc.

Pipeline of Middlewares
: A piece of middleware is code through which the request passes to and from the application. Can inspect and modify the incoming request and outgoing response (similar to HTTP module idea)

Application
: Responsible for generating the response (similar to HTTP handler idea)

Web Framework
: Often used to abstract away the pipeline of middlewares and application. In OWIN, a set of self-contained OWIN middlewares, plugging into the OWIN pipleline which expose a set of APIs for a developer to work with. 

### The Flow

The HTTP request is sent from the client, translated to the environment dictionary (along with a stream to hold the response, and another dictionary for the response headers), passed through the middleware to the application. The application generates a response, sets any response headers and THEN starts writing the response to the response stream.

The server is set up to be notified of the first write to the response stream. When it notices this, it crafts an HTTP response with the headers specified and sends it back to the client. The connection is kept open while the rest of the response is written to the stream and sent to the client.

The last middleware in the pipleline is passed the environment dictionary by the application, and the dictionary is returned back up the pipeline. The middlewares at this point CANNOT modify the response headers and can only append to the response stream. Finally the server receives the Task from the AppFunc, finalises the response to the client and closes the connection. 

### Environment Dictionary Keys

All prefixed with `owin.` to help avoid being overwritten by any custom keys e.g. `owin.RequestPath`, `owin.RequestBody`, `owin.ResponseStatusCode`. An `owin.Version` field defines the version supported by the server in case the application needs to check feature availability. The `server.OnSendingHeaders` key allows registering a callback just before the server sends the response headers back to the client to allow modifying the headers. 

(See http://owin.org/html/spec/owin-1.0.html for full list)

### Katana

Katana is an implementation of OWIN including other useful functionality. Developer friendly APIs. 

## Building a simple OWIN pipeline

1. Create empty MVC web application
2. `Install-Package Microsoft.Owin.Host.SystemWeb` - required to host an OWIN pipeline inside ASP.NET (also installs `Microsoft.Owin` - the Katana OWIN implementation as well as a package called `Owin`)
3. Create an entry point using `Startup.cs` and a method with signature `public static void Configuration(IAppBuilder app)` (if called anything else, need to be marked up with attributes / app settings). 
4. `IAppBuilder` is used to add middlewares to the OWIN pipeline using the `app.Use()` method.

```
public static void Configuration(IAppBuilder app)
{
    // ctx is an IOwinContext (wrapper around the environment dict), next is another delegate Func<Task>, a Task should be returned
    app.Use(async (ctx, next) => {
        await ctx.Response.WriteAsync("HelloWorld");
    });
}
```

Note: In VS 2015 add the `async` keyword, or the `return Task` statement to get intellisense. `ctx.Response` is a shortcut

## Creating middleware with OWIN

Delegate based middleware (such as above) can be packaged up for reuse by encapsulating in their own classes. One way is to create a class inheriting from a base class called `Microsoft.Owin.OwinMiddleware` - however this is Katana specific. Instead simply use the `AppFunc` pattern thus:

```
using AppFunc = Func<IDictionary<string, object>, Task>;
public class MyMiddleware
{
    AppFunc _next;
    public MyMiddleware(AppFunc next)
    {
        _next = next;
    }

    // create a way for this middleware to be invoked
    // mark with the async keyword, so we don't need to manually take care of returning a task
    public async Task Invoke(IDictionary<string, object> environment)
    {
        // ctx not supplied by default - could alternatively just use (string)environemnt["owin.RequestPath"]
        var ctx = new OwinContext(environment); 

        Debug.WriteLine("Incoming request: " + ctx.Request.Path);
        await _next(environment);
        Debug.WriteLine("Outgoing response: " + ctx.Request.Path);
    }
}
```

In Startup.cs just use `app.Use<MyMiddleware>();` to add to pipeline. Add an options class with properties for anything that can be configured e.g. `MyMiddlewareOptions`..

```
public class MyMiddlewareOptions
{
    public Action<IOwinContext> OnIncomingRequest { get; set; }
    public Action<IOwinContext> OnOutgoingResponse { get; set; }
}
```

Add to middleware by adding a second parameter to the middleware's constructor e.g. `public MyMiddleware(AppFunc next, MyMiddlewareOptions options)`. Store this globally and set a default behaviour (if required) in the case any options are null.

In the `Startup` class, update `app.Use<MyMiddleware>()` to include the options required e.g. 

```
app.Use<MyMiddleware>(new MyMiddlewareOptions()
{
    OnIncomingRequest = (ctx) =>
    {
        var watch = new Stopwatch();
        watch.Start();
        ctx.Environment["DebugStopwatch"] = watch;
    },
    OnOutgoingResponse = (ctx) =>
    {
        var watch = (Stopwatch)ctx.Environment["DebugStopwatch"];
        watch.Stop();
        Debug.WriteLine("Time elapsed: " + watch.ElapsedMilliseconds + " ms");
    }
});
```

Create an extensions method for an app.UseXXX experience which in turn calls the `app.Use<T>()` method. Potentially use the namespace of the original class being overloaded to aid intellisense.

```
namespace Owin
{
    public static class MyMiddlewareExtensions
    {
        public static void UseMyMiddleware(this IAppBuilder app, MyMiddlewareOptions options)
        {
            if (options == null)
                options = new MyMiddlewareOptions();
            app.Use<MyMiddleware>(options);
        }
    }
}
```

## Integrating Frameworks

Only certain frameworks will be able to integrate as an OWIN middleware e.g. Nancy FX or ASP.NET Web API. MVC is not available as OWIN middleware due to its dependency on IIS (although ASP.NET, MVC and Katana work well together and is a very common way to deploy Katana).

### Nancy FX

`Install-Package Nancy.Owin` to install the Nancy FX framework.

Create a new module which inherits from `NancyModule`. The `NancyModule` base class contains a dictionary for each of the HTTP verbs. Register routes to the dictionary along with the delegate which will handle the request e.g. `Get["/nancy"] = x => { return "Hello world!";}`

By default Nancy will now process all requests and any middleware after it in the pipeline will not get a chance to execute. Using the `app.Map()` method isn't helpful since Nancy bases its routing on the OWIN environment variable `owin.RequestPath` and ignores the `owin.RequestPathBase` value (populated by the Map method). Instead use the `NancyOptions` to provide a delegate to the PerformPassThrough action to route all requests on through the pipeline in the case of a NotFound from Nancy.

### ASP.NET Web API

`Install-Package Microsoft.AspNet.WebApi.Owin` to install ASP.NET web API.

1. Create a new controller, inheriting from `ApiController`
2. Add a method returning `IHttpActionResult`
3. Mark up the method with the `[HttpGet]` attribute if the method is not called `Get`, markup the class and / or methods with `[Route]` or `[RoutePrefix]` attributes if the class name doesn't correspond to the URL. 
4. Add the WebApi to the middleware pipeline having called the `MapHttpAttributeRoutes` on the configuration to the middleware to ensure all routes specified will be delivered by this middleware.

```
var config = new HttpConfiguration();
config.MapHttpAttributeRoutes();
app.UseWebApi(config);
```

### ASP.NET MVC

MVC acts as the application at the end of the middleware pipeline.

`Install-Package Microsoft.AspNet.Mvc`

1. Create a new controller, inheriting from System.Web.Mvc.Controller
2. Add an action method with return type `ActionResult` with body `return View();`
3. Create a corresponding view
4. Add `@inherits System.Web.Mvc.WebViewPage` at the top of the view due to the usual wire up code missing from the web.config having added the NuGet packages manually
5. In Application_Start within Global.asax.cs, add a default route:

```
RouteTable.Routes.MapRoute(name: "Default", 
   url: "{controller}/{action}", 
   defaults: new {controller = "Home", action = "Index"} );
```

6. Ensure that requests which are handled can pass through the middleware pipeline to be handed off to ASP.NET MVC.

## Securing OWIN Pipelines

Katana is most commonly used to integrate authentication into web applications. Most Microsoft written authentication is currently being implemented as Katana middleware. 

### Securing ASPNET MVC

Add cookie authentication middleware to the pipeline.

```
app.UseCookieAuthentication(new CookieAuthenticationOptions()
{
    AuthenticationType = "ApplicationCookie",
    LoginPath = new Microsoft.Owin.PathString("/Auth/Login")
});
```

Authenticate the user with whatever method is required, create an identify for the user and then sign in the user using the new identity.

```
// create a new object which represents the user who just logged in
// lots of overloads for ClaimsIdentity, but will use the overload which takes a
// string AuthenticationType needs to match the authentication we have chosen to use
var identity = new ClaimsIdentity("ApplicationCookie");
identity.AddClaims(new List<Claim>{
    new Claim(ClaimTypes.NameIdentifier, model.UserName),
    new Claim(ClaimTypes.Name, model.UserName)
});
// sign in the user
HttpContext.GetOwinContext().Authentication.SignIn(identity);
```

Add logout using `HttpContext.GetOwinContext().Authentication.SignOut()`

### Securing Nancy

1. First `Install-Package Nancy.MSOwinSecurity`
2. Add the following line to the module constructor: `this.RequiresMSOwinAuthentication()`
3. To write out e.g. the user's name, use `Context.GetMSOwinUser().Identity.Name`

### Accessing the logged in user details from middleware

```
app.Use(async (ctx, next) => {
    if (ctx.Authentication.User.Identity.IsAuthenticated)
        Debug.WriteLine("User" + ctx.Authentication.User.Identity.Name);
    else
        Debug.WriteLine("User not authenticated");
    await next();
});
```

## Integrating Social Media Authentication

### Setup
Twitter doesn't accept localhost logins, so modify the hosts file to add a dummy host entry pointing to 127.0.0.1 and configure the application to run in IIS to utilise the host name.

### Adding Facebook Authentication

https://developers.facebook.com/apps

1. `Install-Package Microsoft.Owin.Security.Facebook`
2. Add middleware including AppId, AppSecret and SignInAsAuthenticationType as "ApplicationCookie" to ensure that by signing in to facebook, they are in effect signed into the app. It would be more usual to use a seperate cookie to log the user in and then in a seperate step transfer the user from being a socially logged in user to be a proper web application user.
3. Add a `LoginFacebook` action on the `Auth` controller:

```
    HttpContext.GetOwinContext().Authentication.Challenge(new AuthenticationProperties()
    {
        RedirectUri = "/secret",
    }, "Facebook");

    // this HttpUnauthorizedResult will be picked up by the cookie authentication middleware
    // which will create the challenge and send it to the browser
    return new HttpUnauthorizedResult();
```
3. Set up application in Facebook, setting redirect url to https://air-2013.local:4433/signin-facebook
4. Add "Login to facebook" link to redirect to the LoginFacebook action method

### Adding Twitter Authentication

Add in as for facebook. 

To ease the adding of multiple links to the login page, add a `List<AuthenticationDescription> AuthProviders` property to the `LoginModel` and set it using:

```
model.AuthProviders = HttpContext.GetOwinContext()
    .Authentication.GetAuthenticationTypes(x => !String.IsNullOrWhiteSpace(x.Caption))
    .ToList();
```

Then on the view, iterate around these to write out links for each:

```
    @foreach(var provider in Model.Providers)
    {
        <div>
            @Html.ActionLink("Login with " + provider.Caption, "SocialLogin", new {id = provider.AuthenticationType})
        </div>
    }
```

## Hosting an OWIN Pipeline

### Hosting in a console application

Note MVC can't be self hosted, since it is not OWIN compatible.

1. Create a console app
2. `Install-Package Microsoft.Owin.Selfhost`
3. Add a `Starup` class with a `Configuration` method and add required middleware
4. Use instructions from readme.txt to add server start up to the `Main` method

```
using (WebApp.Start<Startup>("http://localhost:12345"))
{
    Console.WriteLine("Listening to 12345");
    Console.WriteLine("Press any key to end ...");
    Console.ReadLine();
}
```

5. Serve static files using `Install-Package Microsoft.Owin.StaticFiles` and add it to the pipeline: `app.UseStaticFiles()` (need to ensure files are where the server expects to find them e.g. set the Build Action to Copy to Output)

### Hosting in memory for Unit Testing

1. Create a unit test project, update a test method signature to return `async Task` rathern than void
2. Reference the project you want to test
3. `Install-Package Microsoft.Owin.Testing`
4. Copy in the boilerplate code from the readme.txt, replacing the inline pipeline implementation with the type of the Startup class in the other project e.g. `Startup` and adding an appropriate assert statement
5. (optional) Refactor the creation of the server to a helper method:

```
private async Task<T> CallServer<T>(Func<HttpClient, Task<T>> callback)
{
    using (var server = TestServer.Create<Startup>())
    {
        return await callback(server.HttpClient);
    }
}
```

with example usage:

```
[Test]
public async Task OwinReturnsCorrectContentTypeOnRequestToJpg()
{
    var contentType = await CallServer(async client =>
    {
        var response = await client.GetAsync("/xhost-a-very-dangerous-program.png");
        return response.Content.Headers.ContentType.MediaType;

    });
    Assert.AreEqual("image/png", contentType);
}
```

