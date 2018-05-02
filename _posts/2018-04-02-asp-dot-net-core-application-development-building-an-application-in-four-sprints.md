---
layout: post
title: "ASP.NET Core Application Development: Building an application in four sprints"
---
# Part 1: Alpine Ski House

## References

* Example project: https://github.com/AspNetMonsters/AlpineSkiHouse

## Chapter 1: How we got here

### ASP.NET MVC

#### Editor and View templates

The power of user controls not initially available in MVC, but rectified by the introduction of **editor and view templates**. Fantasic and underused. Allows you to assign a template to a view in a model. When Razor needs to show an editor or view for a particular field, checks for a special template.

```
@Html.DisplayFor(model => model.StartDate)
@Html.EditorFor(model => model.StartDate)
```

Either defined by convention OR by annotating a field in the model with a UIHint

#### Filters

A filter is an annotation either to a controller or an action method and can intercept and change any request, adding or updating data or changing the flow of the request. Often used by security e.g. `[Authorize]`.

#### Middleware

Middleware, built on the OWIN standard, largely replaces custom IIS modules.

### Web API

* Initially used WCF with a set of rational default, but subsequently morphed into vanilla Web API project
* Very similar to MVC project, but with Views and other UI elements missing. Action names in Controllers correspond to HTTP verbs e.g. Get() and Post().
* Like WCF, supports self hosting, so possible to bin deploy.
* One of the first open source projects from Microsoft
* Much of the functionality is mirrored in ASP.NET MVC, can bend MVC controllers to perform as Web API
* Can by used alongside ASP.NET MVC in the same project

### ASP.NET Core

* Next evolution
* Not only open source, but developed using GitHub. See https://github.com/aspnet/home
* Far more reaching modernization effort designed to make ASP.NET competitive with other popular web frameworks e.g. Node, Elixr, Go
* Goes hand in hand with modernisation efforts on .NET runtime: .NET Core
* Worthy of at least one book!!!!

## Chapter 2: Influences

### Rails

* Rails emerged from the 37 signals company in the early 2000s, used to build Basecamp and open sourced by its creators
* Revolutionary at the time, despite MVC being a pattern from the 70s
* Highly opinionated using convention over configuration which ASP.NET also utilised e.g.
    - any public method returning an `ActionResult` is a public endpoint
    - `Index` method is default route for a controller
    - `View` method without arguments uses naming rules to locate .cshtml file to render
* Routing was fundamental to Rails - flexible URLs
* `ActiveRecord` models which were used from UI to database

### Node.js

* Event-driven, multi-platform, single-threaded runtime for JavaScript
* Many tools in ASP.NET core build process actually use Node
* Influential in the development of ASP.NET's web socket implementation, SignalR
    - popularised the idea of server push and WebSockets for real time communication using `socket.io` package

### Angular and React
### Open source
### OWIN


