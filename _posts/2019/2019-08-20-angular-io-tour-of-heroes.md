---
layout: post
title: "Angular.io: Tour of Heroes"
---
## References

* Glossary - https://angular.io/guide/glossary
* Project file structure - https://angular.io/guide/file-structure

## Workspaces and Projects
### One application per workspace

Beginners and intermediate users are encouraged to use `ng new` to create a separate workspace for each project (where a project is an app, a library or a set of e2e tests).

### Multiple applications per workspace

Angular also supports workspaces with multiple projects. This type of development environment is suitable for advanced users who are developing shareable libraries, and for enterprises that use a "monorepo" development style, with a single repository and global configuration for all Angular projects.

To set up a monorepo workspace, you should skip the creating the root application. See https://angular.io/guide/file-structure#multiple-projects.

All projects within a workspace share a "CLI configuration context" e.g. `angular.json` containing config for build, serve and test tools (TSLint, Karma, Protractor). See https://angular.io/guide/workspace-config

In single application workspaces all source lives in `src`. In mulitiple project workspaces, each application sources files live in a `projects\[project-name]\src` folder.


## Binding

`[(ngModel)]` is Angular's two-way data binding syntax (import the `FormsModule`).

## Mock data

Define mock data in a seperate file with the contents `export const products = [{ ... }]`. This can then be imported where necessary and the const `products` used.

## Styling

Class bindings make it easy to add and remove CSS classes conditionally by adding `[class.some-css-class]="some-condition"` to the element to be styled.

## Pass data to child component

Use `@Input() hero: Hero` to define the input field on the child component. Embed the child component and pass the property from the parent using `<app-hero-detail [hero]="selectedHero"></app-hero-detail>`

## Providing a service

```typescript
@Injectable({
  providedIn: 'root',
})
```

When providing a service at the root level, Angular creates a **single, shared instance** of the HeroService and injects into any class that asks for it. Registering the provider in the @Injectable metadata also allows Angular to optimize an app by removing the service if it turns out not to be used after all.

## Observable data

When getting real heroes (data), asynchronous needs to be used to prevent locking the UI. Therefore `HeroService.getHeroes()` must have an asynchronous signature of some kind e.g. return `Observable`. When using the Angular `HttpClient.get` method, this returns an `Observable`.

```typescript
getHeroes(): Observable<Hero[]> {
  return of(HEROES);
}
```

The RxJS `of()` function `of(HEROES)` returns an `Observable<Hero[]>` that emits a **single value**, the array of mock heroes.

Consume the stream using an `async` pipe in the template e.g. `*ngFor="let hero of heroes | async` OR by subscribing to the stream in the `getHeroes` method.

```typescript
getHeroes(): void {
  this.heroService.getHeroes()
      .subscribe(heroes => this.heroes = heroes);
}
```

## Service in Service

Create a `MessageService`, which can be consumed by the `HeroesComponent`, by injecting it into a service it is already using, the `HeroService`
This is a typical "service-in-service" scenario: you inject the `MessageService` into the `HeroService` which is injected into the `HeroesComponent`.

## Use a service in a component template

Inject the service into the component constructor as `public` (not `private`) e.g. `constructor(public messageService: MessageService) { }`

## Routing best practices

In Angular, the best practice is to load and configure the router in a separate, top-level module that is dedicated to routing and imported by the root `AppModule`. By convention, the module class name is `AppRoutingModule` and it belongs in the `app-routing.module.ts` in the src/app folder.

Add using: `ng g m app-routing --flat --module=app`

The `AppRoutingModule` sets up the routes in the `imports` section, but also adds the `RoutingModule` to the `exports` section to ensure it can be used by the `AppModule`.

```typescript
@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot([
      { path: 'heroes', component: HeroesComponent },
      { path: 'hero/:id', component: HeroDetailComponent }
    ]),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
```

## Default route redirects to other route

`{ path: '', redirectTo: '/dashboard', pathMatch: 'full' }`

## Location service

The `Location` service in `@angular/common` gives access to the browser's location history to e.g. navigation back to the previous page e.g. `this.location.back()`

## Simulating a data server

* `npm install angular-in-memory-web-api`
* `ng generate service InMemoryData`


## HttpClient with optional type specifier

`HttpClient.get()` returns the body of the response as an untyped JSON object by default. Applying the optional type specifier, `<Hero[]>`, adds TypeScript capabilities reducing errors during compile time. 

NOTE: Other APIs may bury the data that you want within an object. You might have to dig that data out by processing the Observable result with the RxJS `map()` operator. There's an example of `map()` in the `getHeroNo404()` method included in the sample source code.

## Handling errors

`import { catchError, map, tap } from 'rxjs/operators';`

The `catchError` operators intercepts an observable which failed, passing it an error handler e.g. `catchError(this.handleError<Hero[]>('getHeroes', []))`

```typescript
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
```

## Tap into the Observable

The RxJS `tap()` operator, looks at the observable values, does something with the values, and then passes them along. The `tap()` callback doesn't touch the values themselves.

```typescript
getHeroes(): Observable<Hero[]> {
  return this.http.get<Hero[]>(this.heroesUrl)
    .pipe(
      tap(_ => this.log('fetched heroes')),
      catchError(this.handleError<Hero[]>('getHeroes', []))
    );
}
```

## Creating new objects

`let hero1 = { name: 'Wendy' } as Hero`
`let hero2: Hero = { id: null, name: 'Wendy' } // have to specify all properties`

## Event to capture user input

Use the `input` event to trigger on user input.

`<input #searchBox (input)="search(searchBox.value)" />`

## Naming convention for observables: `$`

Using `$`, at the end of a variable name, is a convention that indicates the variable is an Observable rather than a regular object or array. In the following, `heroes$` is of type `Observable<Hero[]>`:

`<li *ngFor="let hero of heroes$ | async">`

## RxJS `Subject`

A `Subject` is both a source of observable values and an `Observable` itself. You can subscribe to a `Subject` as you would any `Observable`. You can also push values into the observable using the `next(term)` method.

```typescript
  heroes$: Observable<Hero[]>;
  private searchTerms = new Subject<string>();

  constructor(private heroService: HeroService) {}

  // Every time the value of the input box changes, a search term is pushed into the observable stream
  // The observable emits a steady stream of search terms
  search(term: string): void {
    this.searchTerms.next(term);
  }

  // Passing a new term to the HeroService to search for every time the user entered a value, would create an excessive amount of HTTP requests.
  // ngOnInit therefore pipes the stream through a series of RxJS operators thereby reducing the number of calls to searchHeroes
  ngOnInit(): void {
    this.heroes$ = this.searchTerms.pipe(
      // wait until flow of new events pauses for 300 milliseconds before continuing
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: string) => this.heroService.searchHeroes(term)),
    );
  }
```

## `switchMap`

With the `switchMap` operator, every qualifying key event can trigger an HttpClient.get() method call. Even with a 300ms pause between requests, you could have multiple HTTP requests in flight and they may not return in the order sent.

`switchMap()` preserves the original request order while returning only the observable from the most recent HTTP method call. Results from prior calls are canceled and discarded.

Note that canceling a previous searchHeroes() Observable doesn't actually abort a pending HTTP request. Unwanted results are simply discarded before they reach your application code.
