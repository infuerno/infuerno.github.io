---
layout: post
title: "Udemy: Angular 10 - The Complete Guide"
---
# Section 1: Getting Started (38min)

* To install bootstrap: `npm install --save bootstrap@3`
* Update path to css files in `angular.json` i.e.

```
"styles": [
  "node_modules/boostrap/dist/css/bootstrap.min.css",
  "src/styles.css"
],
```

# Section 2: The Basics (1hr 54min)

## How an Angular App gets loaded and started
* The first file to be loaded is `main.ts`
* This in calls `platformBrowserDynamic().bootstrapModule(AppModule)`
* `AppModule` is defined in the imports as `import { AppModule } from './app/app.module';`
* Within `app.module.ts` the @NgModule directive has `AppComponent` in the `bootstrap` array
* At this point the `AppComponent` is parsed and the selector `app-root` is analysed
* Angular is now able to handle the `<app-root>` tag in the index.html

## Creating a New Component

* Create a subfolder in `app` for the component and name the folder the same as the component name e.g. `server`
* When choosing a selector - it must be unique. e.g. `app-server`
* Angular does not scan all files, so the new component MUST be registered with `AppModule`. It is registered in the `declarations` array. 
* A component HAS to have either a `templateUrl` property OR a `template` property specifying inline HTML
* The `styleUrl` property is optional, but styles can also be inline by instead using the `styles` property (array of strings)
* The `selectors` property works in a similar way to css selectors
    - The default `app-root` style expression needs to be represented by an element `<app-root></app-root>`
    - `[app-root]` can instead reference an attribute e.g. `<div app-root></div>`
    - `.app-root` can reference a class e.g. `<div class="app-root"></div>` 
    - Note: id doesn't work, nor :hover type psuedo etc

## Data Binding
* Output data: business logic (typescript) -> template (HTML)
    - String interpolation e.g. `{{data}}`
    - Property binding e.g. `[property]='data'` (square brackets around HTML attributes)
* Input data: template -> business logic
    - Event binding e.g. `(event)='expression'` e.g. a click event
* Two-way data binding
    - e.g. `[(ngModel)]='data'`

### String Interpolation
* `{% raw %}{{ }}{% endraw %}` - use a typescript expression between the curly braces e.g. the name of a property in the component class 
* Can alternatively add any expression which can in the end be interpreted as a string

### Property Binding
* Can often use either string interpolation OR property binding e.g. `<p>{{ allowNewServer }}<p>` OR `<p [innerText]='allowNewServer'></p>`
* Don't mix the two!
* Can bind to HTML elements (as above), but can also bind to directives and components

### Event Binding
* Can bind to all the events available to the HTML element (remove the "on" at the beginning) e.g. `(click)`, `(mouseEnter)` etc
* Google for a complete list of properties and events for a particular HTML element (e.g. on the MDN site: https://developer.mozilla.org/en-US/docs/Web/API/Element)
* The `input` event is available on `<input>` HTML elements and is fired whenever the value changes e.g. on every keystroke
* `$event` is a special variable which holds the data which was captured about the event e.g. the click event's data contains the co-ordinates
* `event.target` references the HTML element which this input event was fired on (which in turn has a `value` property containing the text of the element)
* If the value is saved to a local variable, this can be referenced by a read only HTML element, thereby achieving a two-way binding effect..

### Two Way Data Binding
* The `FormsModule` is required for two way binding (enabling the `ngModel` directive)
* Combine property and event binding
* Instead of `<input type="text" (input)="onUpdateServerName($event)">` use `<input type="text" [(ngModel)]="serverName">`

## Directives
* Can build own directives, typically using attribute selectors e.g. `<p appTurnGreen>my app</p>`
* Then `@Directive({selector:'[appTurnGreen]'}) export class TurnGreenDirective { ... }` etc
* Built in directives include `*ngIf`, `*ngFor` - the `*` indicates it is a structural direction which changes the structure of the DOM
    - `*ngIf` can be used with `else` by using `<ng-template #ref>` where #ref is used to reference the template in the else e.g. `<p *ngIf="xx; else #ref">` 
    - `ngStyle` is a directive. We can bind to a property of this directive using `[ngStyle]` in order to apply styles conditionally. This property requires an object to bind to, so can use e.g. `<p [ngStyle]="{backgroundColor: getColor()}">`
    - `ngClass` works similarly to `ngStyle`, binding to a property which also takes an object i.e. using `[ngClass]="{}"` where the keys are the css class names and the values are the conditions
    - `*ngFor` iterates around a collection e.g. `<li *ngFor="let item of items">{{ item }}</li>`
    - Can additionally get the index of the item e.g. `<li *ngFor="let item of items; let i = index">{{ item }} {{ i }}</li>`

# Section 4: Debugging (12min)

## Sourcemaps
Use the chrome developer tools to step through your typescript files, by going to the 'Sources' tab and then the webpack node. Under `.` are all the original typescript source code files which can be used to place breakpoints.

## Augury
Chrome extension which shows component map / routes / module dependencies

# Section 5: Components & Databinding Deep Dive (1hr 25min)

* HTML elements - native properties and events
* Directives - custom properties and events e.g. `ngStyle`, `ngClass`
* Components - custom properties and events

## Binding to Custom Properties

* Add `@Input()` to a child component property to allow a parent component to *bind* to this property
* Expose a different name to the parent by using e.g. `@Input('srvElement')`
* Pass the value in from the parent on the selector e.g. `<add-server-detail [srvElement]="element"></add-server-detail>`

## Binding to Custom Events

* Add `@Output()` to a child component property to allow emitting an event from this property - must be of type `EventEmitter` e.g. `@Output() serverCreated = new EventEmitter<Server>();`
* Expose a different name to the parent by using e.g. `@Output('srvCreated')`
* Call `emit` on this property when the event is to be triggered e.g. `this.serverCreated.emit(server);`
* Bind to this event on the parent e.g. `<server-add (serverCreated)="onServerCreated($event)"></server-add>`

NOTE: components talking to each other via custom properties and events can start to become cumbersome, especially if not "next" to each other. Services is an alternative to decouple.

## View Encapsulation

* Angular achieves view encapsulation by appending an attribute e.g. `_ngcontent-ejo-1` to each element in a component. This emulates the concept of Shawdow DOM (not yet available in all browsers).
* This behaviour can be overriden by adding the property `encapsulation` to the `@Component` directive.
    - The default value is `ViewEncapulation.Emulated`
    - Set it to `ViewEncapsulation.None` to ensure encapsulation attributes are NOT added. Any styles defined in this component will now be applied globally (probably NOT what you want!).
    - Set it to `ViewEncapsulation.Native` to use Shadow DOM technology.

## Local References in Templates

* Use local references e.g. `#newServerName` on any HTML element in a template to then reference it by anywhere else e.g. `(click)="onServerCreate(newServerName.value)"` (Note - the whole element is referenced, hence may want to only pass e.g. `.value`)

# Section 6: Course Project - Components & Databinding (31min)
# Section 7: Directives Deep Dive (47min)
# Section 8: Course Project - Directives (7min)
# Section 9: Using Services & Dependency Injection (44min)
# Section 10: Course Project - Services & Dependency Injection (31min)
# Section 11: Changing Pages with Routing (2hr 18min)
# Section 12: Course Project - Routing (46min)
# Section 13: Understanding Observables (45min)
# Section 14: Course Project - Observables (6min)
# Section 15: Handling Forms in Angular Apps (2hr 3min)
# Section 16: Course Project - Forms (1hr 15min)
# Section 17: Using Pipes to Transform Output (37min)
# Section 18: Making Http Requests (1hr 41min)
# Section 19: Course Project - Http (34min)
# Section 20: Authentication & Route Protection in Angular (2hr 12min)
# Section 21: Dynamic Components (38min)
# Section 22: Angular Modules & Optimizing Angular Apps (1hr 37min)
# Section 23: Deploying an Angular App (18min)
# Section 24: Bonus: Working with NgRx in our Project (8hr 33min)
# Section 25: Bonus: Angular Universal (47min)
# Section 26: Angular Animations (39min)
# Section 27: Adding Offline Capabilities with Service Workers (27min)
# Section 28: A Basic Introduction to Unit Testing in Angular Apps (45min)
# Section 29: Angular Changes & New Features (28min)
# Section 30: Course Roundup (2min)
# Section 31: Custom Project & Workflow Setup (51min)
# Section 32: Bonus: TypeScript Introduction (for Angular 2 Usage)