---
layout: post
title: "Pluralsight: ASP.NET MVC 5 Fundamentals"
---
## Introduction and Prerequisites

This course focuses on MVC 5 and VS 2013. Ensure already familiar with:

* [Building applications with ASP.NET MVC 4](https://www.pluralsight.com/courses/mvc4-building) covers MVC fundamentals (all relevant except security model)
* [ASP.NET MVC 4 Fundamentals](https://app.pluralsight.com/library/courses/mvc4/table-of-contents) (particularly checkout async and web API modules)

### What's new?

* OWIN and Katana - several ASP.NET features moved to Katana middleware
* Identity and Membership - new interface based Identity components - understand OAuth2, OIDC and local accounts
* Bootstrap 3
* WebAPI 2 - attribute routing - makes previously difficult routing scenarios easy - enable CORS - secure an API
* EF6 - async API - multiple DB contexts against a single database with different migrations - enums / drop down lists - logging with Glimpse
* SignalR - enables real time comms between browser and server
* VS 2013 - Browser Link - new Azure tooling

### Upgrading from MVC 4 to MVC 5

* Update the version of the .NET framework from 4 to at least 4.5
* Main action is then to update all the NuGet packages
    - Manage NuGet packages at the solution level
    - Microsoft.AspNet.Web.Helpers.Mvc has been renamed - uninstall and later reinstall (provides CAPTCHA and gravatars)
    - Can run "Update All" - may or may not work e.g. Bootstrap from v2 to v3 may break layout. Better to upgrade top level packages first
        + Microsoft ASP.NET MVC - update this first
        + EntityFramework - update next
        + Microsoft ASP.NET Web API 2 - then this
    - Will automatically update packages.config - NOTE Microsoft.AspNet.Razor and Microsoft.AspNet.WebPages both now at version 3.0.0
        + Three big version changes to remember: MVC from 4 to 5; Razor from 2 to 3; WebPages from 2 to 3
* Update Web.config (including any in Views folder)
    - key="webpages:Version" from 2.0.0.0 to 3.0.0.0
    - dependentAssembly System.Web.WebPages from 2.0.0.0 to 3.0.0.0
    - dependentAssembly System.Web.Mvc from 4.0.0.0 to 5.0.0.0
    - update any references in the pages section
* Reinstall ASP.NET Web Helpers Library (version 3.0.0)
* Update .csproj - edit and remove ProjectTypeGuid starting E3E, ending BE47
    
## OWIN and Katana

Not much has changed from MVC4 to MVC5, but the environment the MVC framework lives in has changed quite a bit. 
New project for ASP.NET called Katana which provides components based on a specification called OWIN.
Some features from ASP.NET have moved into OWIN middleware (with more features likely to move in the future)




## Identity and Security

### Forms based authentication

The "Individual User Accounts" option users stored accounts in a SQL server database.
In your application, `Request.IsAuthenticated` and `User.Identity` are populated by the framework.
The login url is specified in StartupAuth.cs
`[Authorize]` attribute can be applied to the controller or the class. If on the class, `[AllowAnonymous]` can override a class level `[Authorize]` attribute.
`[Authorize(Users="sallen")` or `[Authorize(Roles="admin,sales")]` to specify specific groups of users.

The `UserLogins` table stores information about 3rd party logins e.g. Facebook and Twitter

#### Microsoft.AspNet.Identity.Core

One of the nuget packages which gets installed automatically (and an assembly) - defines some core abstractions e.g. `IUser`, `IRole`. Abstractions for persisting user information are: `IUserStore` which needs to be able to create a user, delete a user and find a user by id; `IUserPasswordStore` and `IUserLoginStore` both inherit from `IUserStore` and add additional capabilities which must be provided. `UserManager` class takes an object which implements at least the `IUserStore` interface - this class provides the domain logic for managing users. The `UserManager` is what is needed inside an application that wants to manage users (not a user store). If you want to provide low level details of how to store users, then implement an `IUserStore` interface and then pass this to the `UserManager`

#### Microsoft.AspNet.Identity.EntityFramework

Provides concrete types which implement the interfaces above e.g. `IdentityUser : IUser` and `IdentityRole : IRole` - both Entities. It also contains a `UserStore` class which uses SQL server with Entity Framework. Instantiate this and give it to the `UserManager` to use this user store. When a `UserStore` is created it will need an Entity Framework data context. The assembly defines one you may want to use or inherit from called `IdentityDbContext`.

