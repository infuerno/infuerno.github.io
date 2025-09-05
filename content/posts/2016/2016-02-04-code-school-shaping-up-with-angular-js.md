---
layout: post
title: "CodeSchool - Shaping up with Angular.JS"
---

## References

<https://docs.angularjs.org/api>

## Overview

Angular is a client-side JavaScript framework for adding interactivity to HTML. We add behaviour to the HTML using `directives`.

Directives
: a marker on an HTML tag that tells Angular to run or reference some JavaScript code.

Modules
: Encapsulates separate pieces of an Angular application, and defines dependencies.

app.js : `var app = angular.module('store', [])`
index.html : `<html ng-app="store">` Runs this module when the document loads. The HTML inside the element with the `ng-app` tag then gets treated as an Angular app.

Expressions
: Insert dynamic values into your HTML e.g. `I am {% raw %}{{4 + 6}}{% endraw %}`, `{% raw %}{{"hello" + " you"}}{% endraw %}`

Controllers
: Define application behaviour by defining functions and values

```js
app.controller('StoreController', function() {
    this.product = gem;
});

var gem = {...} // js object
```

- Enclose all JavaScript inside an enclosure to be safe. e.g. `(function() { [code here] })();`
- Controller names are always in CapitalCase and use the word Controller.
- Specify the name of the controller and an anonymous function (the constructor).
- `product` is a property of the controller.
- Use the `ng-controller` directive to attach the controller to an HTML element.

```html
<div ng-controller="StoreController as store">
	<h1>{% raw %}{{ store.product.name }}{% endraw %}</h1>
</div>
```

## Built-In Directives

### ng-app

### ng-controller

### ng-show

Element will be shown if the expression is true e.g. `<button ng-show="store.product.isInStock">Add to Cart</button>`

### ng-hide

Element will not be shown if the expression is true e.g. `<div ng-hide="store.product.isInStock"> ... </div>`

### ng-repeat

Use to iterate over an array e.g. `<div ng-repeat="product in store.products"> ... </div>`

### ng-src

Images cannot be used via the `<img src="expression">` method, since the browser will try to load the image before the expression is evaluated. Instead use the `ng-src` directive. e.g. `<img ng-src="{% raw %}{{product.images[0]}}{% endraw %}" />`

### ng-click

Is evaluated when an element is clicked on. This can be used to change the page when someone clicks on certain elements. This is an example of two-way data binding. e.g. `<a ng-click="product.selectTab(1)">product 1</a>`

### ng-init

Lets you initialise variables to an initial value. e.g. `<div ng-init="tab = 1"`>
NOTE: great for prototyping, but is usually handled inside a controller.

### ng-class

Apply the specified css class tag to an element if the expression evaluates to true.
`<li ng-class="{ active:tab === 1 }">`

### ng-model

Binds the HTML element value to a property, so you can have two way binding e.g. type in one field and see the contents written to another field. Initialise any variables being used either with `ng-init` or better still using a property of a controller.

### ng-submit

Call a function when a form is submitted. e.g. `ng-submit="reviewCtrl.addReview(product)"`

### ng-include

Extract commonly included HTML snippets into separate files. e.g. `<h3 ng-include="'product-title.html'"></h3>` will insert the contents of the file `product-title.html` inside the `<h3>` tags. `ng-include` expects a variable, so to pass in a file name instead, be sure to use single quotes.

Since this file won't be loaded until it is requested via ajax, it will be missing when the page initially loads. Instead of using `ng-include` a _custom directive_ can be used instead.

## Filters

Often used in the form: `{% raw %}{{ data | filter:options }}{% endraw %}`

- `{% raw %}{{ store.product.price | currency }}{% endraw %}`
- `{% raw %}{{ '13885234525' | date:'MM\dd\yyyy @ h:mma'}}{% endraw %}`
- `{% raw %}{{ productArray | limitTo:3 }}{% endraw %}`
- `{% raw %}{{ productArray | orderBy:'-price' }}{% endraw %}` (use the -ve sign to indicate descending order)

## Forms

- Add `novalidate` to the `<form>` tag to turn off HTML validations.
- Add `required` attributes to any fields which are mandatory.
- `nameOfForm.$valid` is a special property which indicates if the form is currently valid or not. AND this value with the method called to submit the form, to ensure this method is never called if the form is not valid.
- `ng-pristine`, `ng-dirty`, `ng-invalid`, `ng-valid` are classes which are automatically applied to form fields and can be used to style them according to whether they are valid / invalid.
- Use the `type` attribute to indicate which type of field it is e.g. `type="email"`, `type="url"`, `type="number"`

## Custom Directives

Template-expanding directives are the simplest - they define a custom tag or attribute which is expanded or replaced (can contain Controller logic if needed). e.g. `<product-title></product-title>`
Directives can also be used for:

1. Expressing complex UI
2. Calling events and registering event handlers
3. Reusing common components

```js
app.directive("productTitle", function () {
	return {
		// A configuration object defining how your directive will work
		restrict: "E",
		templateUrl: "product-title.html",
	};
});
```

- The HTML version `product-title` translates to the camelCase version `productTitle` in JavaScript
- Don't use self-closing tags with custom elements, some browsers don't like them
- Use Element directives for UI widgets and Attribute directives for mixin behaviours, like a tooltip.

### Using controllers inside custom directives

Inside the `app.directive` function definition, use the `controller` attribute to specify the controller constructor functionality. Then use the `controllerAs` attribute to specify the alias for the controller.

```js
app.directive("productTitle", function () {
	return {
		// A configuration object defining how your directive will work
		restrict: "E",
		templateUrl: "product-title.html",
		controller: function () {},
		controllerAs: "panels",
	};
});
```

## Services

Angular comes with several built in services e.g. `$http` to fetch JSON data from a web service, `$log` to log messages to the script console, `$filter` an array using the filter service.
`$http` can either be used as a function itself, specifying all attributes internally OR use one of the shortcut methods e.g. `$http.get`. Both methods return a `Promise` object. which allows you to do callbacks on it e.g. `.success()` or `.error()`

To use a service, use the service name as the first item in an array, and then pass this service in to the controllers constructor method. This is implicit Dependency Injection.

```js
app.controller("SomeController", ["$http", function ($http) {}]);

app.controller("SomeController", ["$http", "$log", function ($http, $log) {}]);
```

When Angular loads it creates something called an `Injector`. When the built-in services load, they register with the Injector as being available libraries. Then when our application loads, it registers the controller with the Injector, telling it that when it gets executed, it is going to need the `$log` and `$http` services. When the page loads and the controller gets used, the Inject grabs the services the controller needs and passes them in as arguments.

```js
app.controller('StoreController', ['$http', function($http) {
    this.products = ???;
    $http.get('/products.json').success(function(data) {
        ??? = data;
    });
}]);
```

In the code above, if we try to assign the data to this.products, it will fail, since `this` inside the service is `$http`. Instead, we need to capture the controller (`this`) in a variable and use this in the success callback method. Initialise products to an empty array, so that when the page loads there won't be errors.

```js
app.controller("StoreController", [
	"$http",
	function ($http) {
		var store = this;
		store.products = [];
		$http.get("/products.json").success(function (data) {
			store.products = data;
		});
	},
]);
```
