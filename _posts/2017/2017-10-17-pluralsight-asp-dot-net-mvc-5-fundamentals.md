---
layout: post
title: "Pluralsight - ASP.NET MVC 5 Fundamentals"
---
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

