---
layout: post
title: "Pluralsight: Angular Fundamentals"
---
# 1 Overview
## Prerequisites

* JavaScript course: JavaScript fundamentals ES6 (Scott Allen) 
* https://jcoop.io/angular-practice-exercises/ - practice exercises using Plunker

# 2 Getting Started with Angular

## TypeScript

* Strong typing e.g. `age: number`
* Interfaces to nail down types e.g. `interface ICat { name: string; age: number;}` 
* Optional types in an interface can be specified using `?` e.g. `interface ICat { name: string; age?: number;}` 
* Class properties can be explicitly declared

```javascript
class Cat {
  private name: string; // optional typescript declarations
  private color: string; // private property
  // just es6
  constructor(name) {
    this.name = name;
  }
  speak() { console.log(`My name is ${this.name}`)}
}
```

* Class members (properties and functions) are public by default (in both es6 and typescript). Add `private` to either a propery or a method
* Constructors have a shortcut
  * Use `constructor (private name, private color) { }` to create private member variables and bind them to the values passed in
  * Alternatively use `constructor (public name, public color) { }` to create public member vars instead

## AngularJS vs Angular
* AngularJS
    - MVC based - view and controller, view would refer to a controller
    - controller would expose models or objects representing the data
    - view was in control, it identified one or more controllers which controlled sections of the page
    - directives encapsulated display and functionality in a cohesive unit
* Angular
    - component based - component and associated template - 1 to 1 - seperate models
    - more similar to the directives that were in AngularJS

## Angular Conceptual Overview

* Root App component is always loaded first
* Router then checks the URL for any component which matches and loads this
  * Component's template is displayed in the browser
  * Component may load some data and give it to the template to be displayed
* Corresponding child components (and their children etc) are loaded
* Useful to think of an angular app as a tree
* When browsing to a new route - the Root App component remains, but the router loads a new component, children etc
* As a user browses and applications grow, this can be a lot to load into memory, **hence** Angular modules

### Modules

* Angular modules (not ES2015 modules) contain a number of routes and their component trees, which can be loaded independently
* Components, services, directives and pipes are registered within a module
  * then available for use by everything else in that module
  * everything, except services, are only available in that module
  * they must also be registered in another module if to be loaded in that module also
  * services (or providers), otoh, are registered in the root injector so available across modules

##  Angular CLI

* `ng new ng-fundamentals`
* `package.json`, `angular.json` - used by the CLI for various things including webpack builds

## Bootstrapping

* Webpack consults the `angular.json` config which references `src/main.ts` under the `main` attribute
* `main.ts` bootstraps `AppModule`
* `AppModule` boostraps `AppComponent`
* `AppComponent` has a selector `<app-root></app-root>` which is found in index.html

## @NgModule decorator
* `declarations:` - must declare components, pipes and directives
* `providers:` - used to declare services
* `imports:` - import other modules. Makes all of its declarations and providers available to this module

## Static files

In templates, static image files in the usual `src/assets` directory can be referenced using an absolute path e.g. `/assets/images/a.png`. This only works due to the `"assets"` array in the `angular.json` file containing the folder `src/assets` (where the path is relative to the angular.json file). Webpack then includes this directory in the app bundle.

Static CSS and JS files have a different convention. Separate `styles` and `scripts` attributes hold arrays with paths to these files. Add any others required, e.g. bootstrap, jquery to these arrays.

# 3 Communicating between Angular Components

* Templates can use the syntax `{{ varname }}` to reference any variable in the corresponding component class.
## Input Properties
* A property passed to the component is marked with `@Input` e.g. `@Input conference: any` to pass a conference object into the child component.
* In the parent component, pass the object in the HTML: `<app-event-thumbnail [conference]="conference"></app-event-thumbnail>` where `[conference]` is the name of the input properly and `"conference"` is the name of the variable in the parent class.

## Output Properties

* Similarly children can declare output properties which allow communication back to the parent using `@Output` properties.
* A common pattern is to use an EventEmitter, since often Output properties are used to convey that an event has occured e.g. `@Output eventClick = new EventEmitter()`
* A function e.g. `handleClick` is called when the button is clicked e.g. `<button (click)="handleClick()">`
* This function uses the property to emit an event e.g. `handleClick(): void { this.eventClick.emit('foo'); }`
* Capture the event in the parent component e.g. `<app-event-thumbnail (eventClick)="handleChildClick()"></app-event-thumbnail>`

## Template Variables

* A further way to access public child properties from the parent
* In the HTML which embeds the child component via the selector, assign a local reference or template variable e.g. `<event-summary #summary></event-summary>`
* This reference can then be used anywhere on the parent component to called **public methods** on the embedded child component e.g. `<button (click)="summary.logFoo()">Log</button>`
* Template variables can also be used to bind to any **public property** on a child component e.g. on the parent component use: `{{summary.someProperty}}`

## Styling

* http://getbem.com/introduction/
* http://smacss.com/

# 4 Exploring the Angular Template Syntax

## Interpolation, Property Bindings and Expressions

Both interpolation and property binding are used to bind data from the component to the template.
* Interpolation - simply display the data e.g. `<h2>{{user.name}}</h2>`
* Property binding - bind the data to a property of a DOM element e.g. `<img [src]="user.imageUrl"`

### Property Binding expression restrictions

Property binding uses an **expression**

Both of these use expressions (`user.name`; `user.imageUrl`) to define the value. There is some flexibility and also some restrictions in this.
* CAN use a calculation e.g. `2+2`
* CAN use a function e.g. `gotIt()`
* CAN'T use assignment operators e.g. `=`, `+=` etc
* CAN'T use `new`
* CAN'T use expression chaining with `;`
* CAN'T access anything on the global namespace e.g. `console`, `window`
* SHOULDN'T have side effects - Angular applications should have a uni-directional data flow - changing the state of the application while evaluating an expression will have nasty side effects
* SHOULD be fast (will be called often)
* SHOULD be simple
* SHOULD be idempotent - should always return the same result - mainly realised by the expression not having side effects

## Event Binding statement restrictions

Event binding uses an **statement**

* CAN use `=`, but no others e.g. `+=`
* CAN chain
* CAN'T use `new`
* CAN'T access anything on the global namespace e.g. `console`, `window`
* USUALLY have side effects
* USUALLY not idempotent (since they have side effects)
* USUALLY not fast

Event binding expressions often have side effects (and therefore aren't idempotent), often make AJAX calls (so not fast), but they should still be simple

## Hiding Content

* `*ngIf` completely removes elements from the DOM
* Alternatively to show and hide elements temporarily, bind to the "hidden" DOM property (must ensure to use the "safe-navigation operator" in this instance)
* Choosing the best option aids performance
* `ngSwitch` requires that the type of the switch var and the the type of the case vars match
```javascript
<div [ngSwitch]="event.time">
  <div *ngSwitchCase="'8:00 am'">Early Start</div>
  <div *ngSwitchCase="'9:00 am'">Late Start</div>
  <div *ngSwitchDefault>Normal Start</div>
</div>
```

## Styling Content

There are two main ways to add styles to HTML elements conditionally:

* Class bindings is good for adding single classes e.g. `<div [class.green]="event.startTime === '8am'">` will add the css `class="green"` to this element if the condition is true
* `ngClass` is more useful for adding multiple classes. It takes an object where the keys are the names of the classes and the values are the conditional expressions e.g. `<div [ngClass]="{green: event.startTime === '8am', bold: event.startTime === '8am'}">`
  * Replace too much logic in templates with calls to functions in the component
  * Instead of returning an object can also return a string with class names e.g. `'green bold'` OR an array with class names e.g. `['green', 'bold']`.
* If seperate static classes are also applied to the element, this all works fine together e.g. `<div class="well" [ngClass]="getStartTimeClass()">`
* `ngStyle` can be also used to apply single styles
  * `<div [style.color]="event?.time === '8.00 am' ? 'green' : 'black'">`
  * `<div [ngStyle]="{'color': event?.time === '8.00 am' ? 'green' : 'black', 'font-weight': event?.time === '8.00 am' ? 'bold' : 'normal'}>`
  * `<div [ngStyle]="getStartTimeStyle()")>`

# 5 Creating Reusable Angular Services

* Use the`@Injectable` decorator for services (only strictly necessary IF a service has its own dependencies which need to be injected - e.g. an HTTP service)
* Register the service with the AppModule as a provider
* Call the service in `ngOnInit` - to get typescript compilation, mark this class as implementing `ngOnInit`

## Wrapping third party services

### Install third party service
* `npm install toastr --save`
* Add any CSS or JS files to the `angular.json`
* The `toastr` object is now available globally and can be used as is (need `declare let toastr` in any files to ensure Angular doesn't complain)

### Wrap the service
* Create a service to wrap the third party service `ng g s shared/toastr`
* Add a reference in this Typescript service file to the variable on the global scope: `declare let toastr`(so Typescript doesn't complain)
* Implement methods in the service to wrap the third party service
* Inject the service as required into components, and call the methods

## Holding State

* Covered in a later module - services can also be used to hold state for an application.

# 6 Routing and Navigation Pages

In modern app a single page e.g. index.html is loaded into the browser. From then, even though the URL changes and the back and forward buttons work, there is only actually a single page. There is A LOT which goes into making this work, abstracted away by frameworks like Angular.

## Using multiple "pages"

### Setup

* Useful to define routes in a separate file `routes.ts`

```javascript
export const appRoutes: Routes = [
    { path: 'events', component: EventsListComponent },
    { path: 'events/:id', component: EventDetailsComponent },
    { path: '', redirectTo: 'events', pathMatch: 'full' }
]
```
* the last route is a redirect route and requires the `pathMatch` property which cal be either `full` - must fully match or `prefix` - starts with this
* Reference this in the `AppModule`, where the `RoutesModule` is imported

```javascript
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes)
  ],
```

* Ensure the base href tag in index.html exists and is correct when using routing: ` <base href="/">`

### Use
* Inject the `ActivatedRoute` service and get a parameter in a route using `activatedRoute.snapshot.params["id"]`
* Use `routeLink` in a template to link to a route e.g. `[routerLink]="['events', event.id]"
* Navigate programatically using the `Router` service e.g. `router.navigate(['events'])`

## Guarding against Route Activation or Deactivation

If a user manually enters a URL containing a non existent ID for a details page, a route guard can ensure the details page is not displayed.

Conversely, if a user tries to navigate away from a page, a route guard can ensure they are warned before continuing e.g. if they have unsaved data.

* Can specify a service OR a function when defining `canActivate` and `canDeactivate` in routes config
* When specifying a function, use a string in the route to give a name of the "event" and then in the AppModule providers, map the event to the function e.g. `{ provide: 'CanDeactivateCreateEvent', useValue: checkDirtyState }`
* Function can simply be provided inline in the `AppModule` for the time being e.g. `export function checkDirtyState()`.
* By default the component is passed as the first argument to the function which is specified to be called by the `canDeactivate` function.

## Preloading Data for Components

When the page loads and the data pops in afterwards, this can look awkward. Resolve route handlers can help by waiting for the data to load before displaying the component. 

* Add a service, a resolver, which implements `Resolve`from `@angular/router`
* Implement the `resolve()` function, ensuring it returns an observable to Angular so that it can see when it finishes e.g. `this.eventService.getEvents().pipe(map(e => e));`
* Adjust the route definition to include an implementation for `resolve` e.g. `resolve: { events: EventListResolverService }`i.e. before resolving this route call the `EventListResolverService` and when that service finishes and returns some data, add the data to the route as a property named `events` and continue
* Angular will delay loading the component until the data has been fetched and will add the data to the route. Retrieve in the component from the activated route snapshot e.g. `this.events = this.activatedRoute.snapshot.data['events'];`

## Styling Active Links

* Use `routerLinkActive="active"` to add the class `active` to `[routerLink]` for hrefs which match. This uses a "startsWith" match by default, so either need to be careful how routes are defined OR apply the binding `[routerLinkActiveOptions]="{exact: true}"` to exactly match a particular `routerLink`. 

## Lazy Loading Feature Modules

By organising related feature functionality under a seperate feature module, performance can be gained via automatic lazy loading.

* Import `CommonModule` rather than `BrowserModule`

* When importing `RouterModule` call `forChild` instead of `forRoot`when defining routes. Ensure the route is defined relatively

* Define when features modules should be lazy loaded in the main modules router config using `loadChilder`:

```javascript
// when the path starts with 'user', load the UserModule from this path
{
  path: 'user', 
  loadChildren: () => import('./user/user.module')
    .then((m) => m.UserModule)
},
```

## Organising Exports with Barrels

* Can add an `index.ts` inside sub folders and from there export components e.g. `export * from './event.service'`
* Sub folders index files can be reexported at top level folders e.g. 
`export * from '/shared/index'`
* Components can then be imported in a less verbose way e.g. 
`import { EventsListComponent, EventsDetailsComponent, EventsThumbnailComponent } from './events/index'`

# 7 Collecting Data with Angular Forms and Validation

## Forms

There are 2 choices for forms:

1. Template based forms are good for simple use cases, but all the logic is in the form, cross field validation is more difficult, can't unit test logic
2. Model based / reactive forms all logic in the component instead

## Template based forms

* At its simplest, can wire up an input box using `<input (input)="userName=$event.target.value" ..../>`
* Better to use `(ngModel)` event bindings
  * Note: often see two way binding using `[(ngModel)]` - e.g. to edit an existing object. Only use this where required, otherwise use a one way binding e.g. on a login form
  * `name` attribute is additionally required, typically set to the same value, but not always

* Get access to the form by adding a local template reference to the `<form>` e.g. `#loginForm="ngForm"`. Use this in the form submit handler
* Using the directive `(ngSubmit)` on the `<form>` is better than simply wiring up `(submit)` since it takes care of e.g. not submitting the form to the server.
  * `(ngSubmit)="login(loginForm.value)"` (only want the `value` of the form, not the whole form object)
* `loginForm.value` contains a dictionary of form values. Note, still need to have variables in the component to hold these values
* Use `ngModelGroup` to next a group of fields e.g. the `location` part of an `event` e.g. `<div ngModelGroup="location">`
* Add a preview for an image by adding an `<img>` tag and setting the value to the value of the image field 
* Use `ngModelGroup` on a div in the form to map all child fields to properties within sub object e.g. `<div ngModelGroup="location">`

### Validating template based forms

The form and its controls have various states accessible via the local loginForm reference variable e.g. `loginForm.valid`, `loginForm.controls.username.valid`. 

* In the module import the `FormsModule`
* Use the states to e.g. disable the submit button: `[disabled]="loginForm.invalid"`
* Disable HTML5 validation by adding the `novalidate` boolean attribute to the `<form>` tag
* Add attributes to form elements for validation e.g. `required`; `pattern="[A-Za-z]*"`
* Ensure validation messages are shown when form controls are dirty, but input is still not valid e.g. `<em *ngIf="loginForm.controls.password?.invalid && loginForm.controls.password?.dirty">Required</em>`

## Model driven / Reactive forms

* In the module import the `ReactiveFormsModule` (as well as the `FormsModule`)
* In the component in `ngOnInit`, create a `FormGroup` for the form and a `FormControl` for each control

```javascript
profileForm: FormGroup;    
ngInit() {
  this.profileForm = new FormGroup({
    firstName: new FormControl(this.authService.currentUser.firstName),
    lastName: new FormControl(this.authService.currentUser.lastName)
  });
}
```

* Wire up in the HTML

```html
<form [formGroup]="profileForm" autocomplete="off" novalidate>
	<input formControlName="firstName" id="firstName" type="text" ...
...
```

* Implement submission of the form using `ngSubmit` e.g. `(ngSubmit)="save(profileForm.value)"`

### Validating model driven forms

The main benefit is that the validation can be placed in the component, thereby increasing the testability. This is especially helpful for larger forms with more complex validation rules.

* The second parameter of the `FormControl` constructor allows specifying validation rules e.g. `Validators.required`. Now the `valid` property on the `FormGroup` form is available and rolls up all validation errors from each control
* To write a unit test: instantiate the component, stub the auth service to return true or false for `valid`, call `saveProfile()` method on the component and check using a mock if the profile on the auth service is updated or not. Can also test the validity of the form by exercising the individual form controls and their individual states to ensure the logic is correct.
* Pass multiple validators using an array e.g. `[Validators.required, Validators.pattern('[a-zA-Z].*')]`
* Check which validators is failing using e.g. `profileForm.controls.firstName.errors.pattern` or `profileForm.controls.firstName.errors.required`
* Angular documentation details different kinds of validators, can create custom validators if required

## Custom validators

A validator is simply a function which either returns `null` if no validation issues found, or returns an object with the details of the errors.

```javascript
// version 1 (hard coded 'foo')
// a function which takes in a form control and returns an object (of any shape)
private restrictedWords(control: FormControl): {[key: string] : any} {
  return control.value.inclues('foo')
    ? {'restrictedWords': 'foo'}
    : null;
}

// version 2 (validator accepts an array of restricted words)
// the restrictedWords function returns a function which will be added to the Validators array
private restrictedWords(words) {
  return (control: FormControl): {[key: string]: any} => {
    if (!words) return null;
    let invalidWords = words
      .map(w => control.value.includes(w) ?  w : null)
      .filter(w => w != null); // filter out the nulls from the map
    return invalidWords && invalidWords.length > 0
      ? {'restrictedWords': invalidWords.join(', ')}
      : null;
  }
}
```

# Reusing Components with Content Projection

* Content projection: a component with some kind of visual wrapper (Container), but the content is decided by the developer (Content) e.g. using a wrapper like a dialog box with cancel and save buttons and positioning logic and reuse it with different types of content.

* Multiple slot content projection: multiple variable contents are wrapped in a single container and displayed e.g. side by side, down the page etc

* Indicate the place to project content using `<ng-content>` tag in the container component

```html  
<!-- session-list.component.html -->
<div class="row" *ngFor="let session of sessions">
    <div class="col-md-10">
        <app-collapsible-well [title]="session.name">
            <h6>{{session.presenter}}</h6>
            <span>Duration: {{session?.duration}}</span>
            <span>Level: {{session?.level}}</span>
            <p>{{session.abstract}}</p>
        </app-collapsible-well>
    </div>
</div>
  
<!-- collapsible-well.component.html -->
<div (click)="toggleContent()" class="well pointable">
    <h4 class="well-title">{{title}}</h4>
    <ng-content *ngIf="visible"></ng-content>
</div>
```

* The collapsible well can be used with **any** component, not just within the session list component. 

* To project multiple content areas and maintain more control over how e.g. the title is displayed as well as the body, additionally use an `ng-content` tag to display the title HTML. Use `select=""` on each ng-content tag to indicate which content will go where (the contents of which can be any selector e.g. id selector, class selector or attribute selector)

```html
<!-- session-list.component.html -->
<div class="row" *ngFor="let session of sessions">
    <div class="col-md-10">
        <app-collapsible-well>
            <div well-title>
                {{session.name}}
                <i class="glyphicon glyphicon-fire" *ngIf="session.voters.length > 3" style="color: red;"></i>
            </div>
            <div well-body>
                <h6>{{session.presenter}}</h6>
                <span>Duration: {{session?.duration}}</span>
                <span>Level: {{session?.level}}</span>
                <p>{{session.abstract}}</p>
            </div>
        </app-collapsible-well>
    </div>
</div>

<!-- collapsible-well.component.html -->
<div (click)="toggleContent()" class="well pointable">
    <h4>
        <ng-content select="[well-title]"></ng-content>
    </h4>
    <ng-content select="[well-body]" *ngIf="visible"></ng-content>
</div>
```

# Displaying Data with Pipes

Ng2's pipes are similiar to ng1's filters. However ng1's filters were used for formatting, sorting and filtering data. In ng 2, pipes are only used for formatting due to performance reasons.

## Built in pipes

{% raw %}
* `{{ event.name | uppercase }}`
* `{{ event.date | date }}` gives Sep 26, 2019

Add further functionality using parameters to the pipe added after a `:` e.g. the `date` pipe takes a string parameter

* `{{ event.date | date:'short' }}` gives 26/9/2019, 12:00 AM
* `{{ event.date | date:'shortDate' }}` gives 26/9/2019
* `{{ event.date | date:'y-M-d' }}` gives 2019-9-26
{% endraw %}

## Custom pipes

Create a pipe and implement the `transform()` function according to the inputs, logic and outputs required

## Filtering and sorting data

### Mutability, identity (reference type) and primitive (value type)

An important concept is mutability. Objects and arrays in JavaScript are mutable - they can change anytime without changing their identity. If there is a pipe on an array to e.g. sort it, then every time there is a change to an array, Angular needs to know about it and check if anything has changed. This can be expensive. Therefore pipes in Ng2 only trigger a change when the identity of the source data has changed. Therefore only primitive types, strings, numbers etc can be used with pipes.

### Impure pipes

Impure pipes run on EVERY cycle of the change detection algorithm (the same as Ng1's filters). This is NO LONGER RECOMMENDED. Instead, it is recommended to do it within the component which uses the data.

### Example of filtering data

For example, displaying a subset of data depending on the selection of a number 'filter' buttons.

* One approach is to to pass the value of the button currently selected to the child component displaying all the data, as well as the full list of data.
* The child component stores the full list locally e.g. `@Input sessions: ISession[]` as well as the value of the filter e.g. `@Input filterBy: string`
* The child implements `ngOnChanges` so that every time a different filter button is selected, the value of `filterBy` will change, `ngOnChanges` will fire and filtering logic in this method can be used to populate a list of `filteredSessions: ISession[]`, the array actually passed to the template

# Understanding Angular's Dependency Injection

* Regular dependency injection
* Dealing with things which aren't simple services using the `InjectionToken` and `@Inject()` decorator - allow registering with the DI system in various ways
* Altenative provider methods

## Using Third Party Global services

The `toastr` service was previously wrapped in an angular service and its 4 methods reimplemented, so that it could be injected easily, and the `toastr` object on the global `window` obscured from the rest of the code. However, providing implementations for all functionality of a third party library in this way is not practical.

## Angular Dependency Injection Lookup

Angular uses the service **types** e.g. `AuthService` as the key to look up the instance of the service and inject it into components where required.

## InjectionToken

The `InjectionToken` creates a key for the dependency injection registry in order to provide the lookup to locate the instance of a service required.

```
import {InjectionToken} from '@angular/core'
declare let toastr: any
export let TOASTR_TOKEN = new InjectionToken
```

# Creating Directives and Advanced Components in Angular

45 mins - thur

# More Components and Custom Validators

35 mins - thur

# Communicating with the Server Using HTTP, Observables, and Rx

1 hour 7 mins - fri

# Unit Testing Your Angular Code

36 mins - sat

# Testing Angular Components with Integrated Tests

29 mins - sat

# Taking an Angular App to Production

32 mins - sun