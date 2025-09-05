---
layout: post
title: "Horsdal: Microservices in .NET Core"
---
## About this book

Nancy and OWIN used extensively

12 chapters in 4 parts:

Part 1: Introduction
* Chapter 1: Introduction to microservices, Nancy and OWIN
* Chapter 2: Example of a complete microservice

Part 2: Design
* Chapter 3: Design of microservices system
* Chapter 4: Design of collaboration between microservices
* Chapter 5: Data storage
* Chapter 6: Robustness
* Chapter 7: Testing, complete system as well as individual services

Part 3: implementation of cross cutting concerns
* Chapter 8: OWIN middleware
* Chapter 9: Monitoring and logging
* Chapter 10: Security
* Chapter 11: Microservices platform and an example of using it

Part 4: Creating end user applications

### References

* GitHub repository for code samples using up to date releases of library frameworks: https://github.com/horsdal/microservices-in-dotnet- core
* Private forum: https://www.manning.com/books/microservices-in-net-core

# Part 1: Getting started with microservices

## Chapter 1: Microservices at a glance

A microservice is a service with ONE narrowly focussed capability. Break a system down to its capabilities and then implement each one as a seperate microservices. Each microsystem should:

* Run in a seperate process
* Be deployed on its own
* Have its own datastore
* Collaberate with other services to complete its own actions

HTTP is commonly used to collaberate, but a Service Bus or a binary protocol like Thrift can also be used. 

### Microservice characteristics

#### Responsibility for a single capability

Single responsibility which represents one capability. 

>Uncle Bob: Gather together the things that change for the same reasons. Separate those things that change for different reasons.

Two types of capability: business e.g. keep track of contents of basket or calculate prices and technical e.g. integration to a third party system

#### Individually deployable

This is important because trying to deploy all microservices or a group of them would be unwieldly. This affects the way microservices interact. Changes to a microservice’s interface usually must be backward compatible so that other existing microservices can continue to collaborate with the new version the same way they did with the old. Communication must also be robust and other microservices should expect other services to fail - either offering reduced functionality or longer processing times.

#### Consists of one or more processes

Reduces coupling / downtime between services. If the code of two microservices is running in the same process and one is redeployed how does the running code get replaced? Therefore microservices should run in their own processes. Microservices often need at least two processes to support code and data store. 

#### Own its own datastore

Each microservice is in charge of its own data and other services access only via the public API. Different database technologies can be used as appropriate (with the downside of choosing different technologies the overhead in support)

#### Maintainable by a small team

A team of 5 should be able to support several microservices, from developing, efactoring, deploying, running in production, testing, fixing bugs etc.

#### Replaceable

Be writeable from scratch in a reasonable time frame. 

### Costs and downsides of microservices

Microservices are distributed systems. They are harder to reason about, harder to test, communications is orders of magnitudes slower. There will be a complex production setup for a system comprised of microservices. 

The system should be sufficiently complex to justify the overhead.

Performance can be improved by using event-based asynchronous collaboration rather than synchronous remote calls, and storing copies of the same data in several microservices to ensure it’s available where it’s needed.

### Code reuse

Pulling common code out of different microservices into a reusable library incurs hidden costs. Dependencies increase and code navigation becomes slower. The reusable library must be developed with multiple use cases in mind. Introduces coupling and versioning considerations. 

>With these points in mind, be wary of code reuse and only judiciously attempt it. There is, however, a case to be made for reusing infrastructure code that implements technical concerns.

Reusing infrastructure code across services can greatly reduce the amount of effort required to write a new service.