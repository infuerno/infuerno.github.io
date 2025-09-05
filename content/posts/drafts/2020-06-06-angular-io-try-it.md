---
layout: post
title: "Angular.io: Try It"
---
## Deployment

1. Create a new firebase project (via browser)
2. Add @angular/fire schematics to handle the deployment `ng add @angular/fire`
3. Build locally `ng build --prod`
4. Deploy `ng deploy`

## In-app navigation

1. Create a new component
2. Add a route for the new component to `RouterModule.forRoot` array in the app.module.ts
3. Use the `routerLink` directive and an array of URL segments to create the href
4. In the new component, inject `ActivatedRoute`
5. Can use `activatedRoute.snapshot.paramMap.get('id')` but may miss url changes. Should therefore subscribe to the `paramMap`


