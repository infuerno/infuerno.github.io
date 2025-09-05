---
layout: post
title: "CodeSchool - Staying sharp with Angular.JS"
---
## Note on setting app module to a variable

Using the following code is bad practice:

```
var app = angular.module('app', [ ]);
app.directive('productTitle', function() { ... });
```

Better to do this:

```
angular.module('app')
    .directive('productTitle', function() { ... });
```

## Routes

There are 4 steps to using routes
1. Use ngView i.e in the main index.html have a div marked up `<div ng-view></div>` where all the contents will go
2. Load the ngRoute library by declaring it as a dependency 
3. Import the ngRoute module by adding javascript src mark up
4. Define the route in routes.js


