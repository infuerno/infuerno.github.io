---
layout: post
title: "Pluralsight: Play by Play: ASP.NET Core 1.0 on any OS"
---
## Install and Run

1. Install ASP.NET Core
2. Install yo generator either globally or locally: `npm install generator-aspnet`
3. Create a folder for the project and run the generator `yo aspnet`
4. `cd` into the project folder, `dnu restore` to restore the nuget packages and `dnu web` to run the project 

## WebApi Controller

1. Create a new controller using the yo generator: `yo aspnet:WebApiController RunnersController`
2. Create a new model using the yo generator: `yo aspnet:Class Runners`
3. Write the Runners model
4. Implement the Get() and Get(id) controller methods
5. Remove the 451 reference in the project.json (or build with mono)
6. `dnu build`
7. `dnx web`
8. Test with http://localhost/api/runners and http://localhost/api/runners/1
9. Customise the JSON serialisation to be ProperCase on the server and camelCase on the client (in ConfigureServices, add the following onto the end of the `services.AddMvc()`: `.AddJsonOptions( options => options.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver());`

## Angular Application (take one)

1. `bower install angular`
2. Add script tags for angular.js to _Layout.cshtml
3. Add app.js and add script tag to _Layout.cshtml
4. Add angular js code to app.js and mark up to Index.cshtml

## Angular Application (take two)

1. `bower install angular`, `bower install angular-ui-router`
2. Add script tags for each to _Layout.cshtml
Add `app.module.js`, `app.config.js` files and implement including $locationProvider to use html5Mode, $urlRouterProvider to set a default route and $stateProvider to define the routes to the SPA html pages (e.g. / goes to app/home.html and /runners goes to app/runners.html)
3. Add a home.controller.js which does nothing
4. Add a runners.controller.js which calls the /api/runners endpoint and adds to the view model
5. Add a home.html page
6. Add a runners.html page which iterates around the runners to display them
7. Add the angular mark up to Index.cshtml to render the angular app (i.e. `<div ng-app="app"><ui-view></ui-viewv></div>`)
8. 