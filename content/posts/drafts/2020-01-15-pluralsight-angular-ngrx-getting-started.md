---
layout: post
title: "Pluralsight: Entity Framework in the Enterprise"
---
## Refereces

* Angular Getting Started: 
* Angular First Look: Differences between Ng1 and Ng2 https://app.pluralsight.com/library/courses/angular-2-first-look/table-of-contents
* Angular Component Communication: https://app.pluralsight.com/library/courses/angular-component-communication/table-of-contents
* Blog post: https://blogs.msmvps.com/deborahk/angular-ngrx-getting-started-problem-solver/
* GitHub repo: 

# Introduction

* Manages state and interactions with that state for Angular apps using the Redux pattern
* State can include:
    - information about the view - whether to show or hide elements
    - user information e.g. user's name and roles
    - entity data e.g. product information originally retrieved from and stored on a backend server
    - user input selection

![Redux pattern](https://www.dropbox.com/s/tkd3tk5ai9t1ty6/pluralsight-ngrx-redux-pattern.png?raw=1)

1. User clicks on a tick box on the view to display product codes (if they browse away from this page, we forget their previous choice, so instead store this)
2. **View** uses event binding to notify the component of the **User Event**
3. **Component** creates an **action** representing that **event**, including a payload - in this case a boolean representing the state of the tick box
4. The **Component** **dispatch**es the Action to a dispatcher function called a **reducer**
5. The **Reducer** uses the **action** AND the **current state** to define **new state**. It updates the store with the **new state**.
6. The **Store** is single, in memory, client side, state container containing application state while the application is running. The state is immutable.
7. Compnents subscribe to the **store** using a **selector**. The **selector** knows how to locate and return information from the store. 
8. When new state is replaced in the store, the component is notified of the state and bound values in the view are updated.
9. If a user browses away and back, the component resubscribes and gets the current state from the store. The view is then updated with the retained user's selection. 

Can be used for more complex interactions e.g.

* Multiple component communication
* Loading data from a backend server
* Create, update and delete operations

## Why use NgRx

### State everywhere

Without NgRx, usually have many services each holding little bits of state. With NgRx, this can be replaced by a single store.

### Getting data again and again

Without NgRx, often have services which call backend APIs and components which call the service ngOnInit() to retrieve the data. If a user browses away and then back, this often results in another call to the backend API. If the data doesn't change that much, no need to keep getting the data. Instead of manually implementing a cache, with NgRx, the store can hold the data intead. 

### Complex component interactions

Without NgRx, a user interaction can result in multiple components needing to be updated. May need to closely couple the components in order to ensure all components correctly get the information required. With NgRx when a user selects a product, the component dispatches an action with the current product as the payload. The reducer uses this, with the current state to create new state. The store retains the current product. Any component can subsribe to the current product selectors to receive changes in state. This decouples the component from each other. The components are also decoupled from the store. They don't update the store, but instead dispatch actions, in turn used by reducers to update the store. Components don't read from the store, the subscribe to the store via a selector to receieve state change notifications. The state is the single source of truth

### Tooling

Has good debug tooling for troubleshooting.

### Don't use NgRx if

* New to Angular - concentrate on Angular and RxJS Observables first
* Simple application - extra code probably not worth it
* Team already has a good pattern - no need to change if a good state management pattern is already in place

# Sample Application

![Sample Application](https://www.dropbox.com/s/qcrk6w5hxjyjkfa/pluralsight-sample-application-architecture.png?raw=1)

# The Redux Pattern

* This pattern is implemented in almost all front end frameworks: React has Redux (the library); Vue has Vux; Angular has NgRx
* A predictable state container for JS applications
* Redux, the library, was the first to implement the pattern, was based on Facebook's lux library and is now the dominant state management pattern for SPAs

## Characteristics

* Single source of truth
* State is read only - only way to change it is to dispatch an action
* Changes to the store are made using reducers using pure functions

## Different parts

* The store is simply a JS object
* Example actions: Login action (after a login form submission); Toggle side menu action (after a button click); Retrive data action (on initialisation of a component); Start a global spinner action (when saving data)
* Actions are JS objects with a `type` (string) and (optional) `payload` (any type) e.g. 
```
{
    type: 'LOGIN',
    payload: {username: 'duncan', password: 'secret'}
}
```
* Example reducers (change the state): Set `userDetails` property (on login); Toggle `sideMenuVisible` property to true on button click; Set successfully retrieved data on component initialization; Set `globalSpinnerVisible` property true while saving data
* Not all dispatched actions can update the store via a reducer, since some actions have side effects. Side effects are managed using NgRx Effects library
* Reducers are pure functions i.e. no side effects and don't depend on anything outside of the function
* Advantages include:
    - centralized immutable state, repeatable trail of state changes
    - Using pure functions to change state enables time travel debugging, record / replay / hot reloading
    - Easy to rehydrate application state from storage
    - Easier to implement Angular change detection strategy called OnPush
    - Writing unit tests easier. Good tooling (history of state changes etc)
    - Simpler component communication. 

# First Look at NgRx

The sample application makes use of Angular in-memory-web-api https://github.com/angular/in-memory-web-api. This is the same library used by the Angular documentation. It supports basic CRUD operations. 
Often a good idea to layout out the store in a hierarchy e.g. following the feature modules in an application. Each feature section of JSON is sometimes known as a **slice**.

In the `AppModule` add an import to `StoreModule` and in the `imports` array add the `StoreModule` calling the `forRoot` method and passing in the root reducer i.e. `StoreModule.forRoot(reducer)` This associates the reducer with the store and registers the state container with the application. There will be multiple reducers for each area of the application e.g. `Root Reducer`, `Products Reducer`, `Users Reducer` etc. This makes it easier to build, maintain and test. Also state is not created for a module which is not loaded. 

Feature Module State Composition - allow composing application state from feature module reducers. Add additional reducers to each feature module using `StoreModule.forFeature('products', reducer)` where 'products' is the name of the feature slice and the reducer which manages that feature's slice of state. Repeat this for all modules using the store.

Note. All looks very similar to router code e.g.  `RouterModule.forRoot(appRoutes)` and `RouterModule.forChild(productRoutes)`.

Can furthermore defines even fine grained reducers for sub slices of state e.g. `Product List Reducer` and `Product Data Reducer`. These reducers are aggregated for their associated feature. Useful when a single feature has a lot of state. Initialisation in this scenario:

```
StoreModule.forFeature('products',
    {
        productList: listReducer,
        productData: dataReducer
    }
)
```

When dealing with reducers which only work on slices, only the slice of data is sent to the reducer. The reducer takes and copy, applies any changes and then replaces this slice back in the store. There is no mechanism to stop code updating the store directly, need to stick to the patterns. IF wanting something explicit, could use e.g. `ngrx-store-freeze library`.

To subscribe to state changes either use the stores `select` method e.g. `this.store.select('products')` OR since the store is an observable can instead use the pipe method and the ngrx `select` operator: `this.store.pipe(select('products'))`. The advantage of the operator is that we can add further pipeable operators as needed to shape the results required by the component. 

Both the select method and the select operator return a slice of state as an observable. To be notified of changes to the state, subscribe to this observable. i.e. `this.store.pipe(select('products')).subscribe(products => this.displayCode = products.showProductCode);`. This gets the WHOLE slice of state and can be improved (later). The first argument to the subscribe method is a "next" function. 

Need to also unsubscribe from observables in the ngOnDestroy method. One way is to keep track of the subscription in a variable. However using effects is a better way (unsubscribe strategies later).

Don't track events local to a component, unless those events change data which must be tracked after the component is destroyed.

Actions are passed to ALL reducers and processed by any matching case statements. 

Subscribing to the store is often done in ngOnInit.

# Developer Tools and Debugging
# Strongly Typing the State
# Strongly Typing Actions with Action Creators
# Working with Effects
# Performing Update Operations
# Architectural Considerations
# Final Words
