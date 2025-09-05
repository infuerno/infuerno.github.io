---
layout: post
title: "Pivotal - Migrating to Cloud-Native Application Architectures"
---
## Overview

Companies like Square, Uber, Netflix, Airbnb, and Tesla...

Eventually we can measure the answer to Lean guru Mary Poppen‐dick’s question, “How long would it take your organization to deploy a change that involves just one single line of code?” in minutes or seconds.

### Speed

How do we go fast and safe?

#### Visibility

Our architectures must provide us with the tools necessary to see failure when it happens. We need the ability to measure everything, establish a profile for “what’s normal,” detect devia‐ tions from the norm (including absolute values and rate of change), and identify the components contributing to those deviations. Feature-rich metrics, monitoring, alerting, and data visualization frameworks and tools are at the heart of all cloud- native application architectures.

#### Fault Isolation

Limit the risk associated with failure, by limiting the scope of components or features that could be affected by a failure. Monolithic application architectures often possess this type of failure mode. Cloud-native application architectures often employ micro services. By composing systems from microservices, we can limit the scope of a failure in any one microservice to just that microservice, but only if combined with fault tolerance.

#### Fault Tolerance

Prevent a failure in one component cascading failures into other components. Mike Nygard described several fault tolerance patterns in his book Release It! (Pragmatic Programmers), the most popular being the circuit breaker.

#### Automated Recover

Cloud-native application architectures don’t wait for manual intervention when certain well known recovery actions can be attempted e.g. a service restart. Instead, they employ automated detection and recovery.

### Scale

- Use public cloud services to scale horizontally when required (more servers rather than larger servers)
- Use containers rather than virtual servers
- Architect applications to ensure state management does not depend on traditional vertical scaling methods e.g. clustered sessions and file systems
- Keep the application essentially stateless using in-memory data grids, caches and persistent object stores to instead manage state
- Use external state managers (variety offered by cloud infrastructure providers)

### Mobile Support
The API Gateway pattern helps support a multitude of mobile devices by transferring the burden of service aggregation.

## Defining Cloud Native Architectures

### Twelve Factor Applications (12factor.net)

Collection of patterns focusing on speed, scale and safety by:

- declarative configuration
- stateless processes
- loose coupling to the deployment environment

An “app” in this context is a single deployable unit (not a whole system).

The twelve factors:

- Codebase - tracked as one application in version control
- Dependences - specified using bundler, nugget package.config etc
- Config - difference between deployment environments is injected via system level variables
- Backing services - treated as resources, consumed identically
- Build, release, run - three distinct stages where release = built artefact + config
- Processes - app is completely stateless - state is externalised to backing service (e.g. cache)
- Port binding - app exports any services via port binding (??)
- Concurrency - scale out horizontally
- Disposability
- Environment Parity - CD enabled by keeping Dev / Prod as similar as possible
- Logs - treat as event streams which are analysed via central services
- Admin - tasks such as db migrations are executed as one-off processes

### Microservices

Independently deployable services which "do one thing well". They usually represent a business capability or the smallest unit of service that delivers a business value.

Microservice architectures enable speed, safety and scale in the following ways:
- Changes can be deployed independently
- Developers can develop independently
- New developers can ramp up faster due to only having to learn one area of code
- Adoption of new technology is easier
- Individual components can be scaled independently as required

### Self-Service Agile Infrastructure

IAAS allows us to provision virtual servers using APIs. Newer platforms allow deploying application and backing services without having to think down to the server level. These platforms also provide a wide range of supporting services including: automated scaling, application health management, aggregation of logs and metrics

### API-Based Collaboration

Sole mode of interaction between services is via published and version APIs (typically REST style).

### Anti-fragility

A la Netflix Simian Army project and its Chaos Monkey.

## Changes

### Cultural Change

### Organizational Change

Teams based around business capabilities, supported by a platform operations team which provides an API for the business capability teams to get infrastructure and application services as required. All too often the development teams are organised around agile principles, but getting it into production proceeds in traditional release cycles - 'waterscrumfall'.

### Technical Change

#### Decomposing Monoliths

Problems with typical n-tier monolithic applications that they often make certain assumptions about the deployment environment including: mounted file shares, config files in known locations etc. This is because they are often deployed to long-lived architecture.

#### Decomposing Data

Data needs to be composed into bounded contexts where the internal domain model is consistent and each concept has a consistent meaning. Business capable teams are then aligned to the bounded contexts and build microservices to deliver those business capabilities. 

Microservices - primarily a business specification
Twelve Factor apps - primarily a technical specification

Define bounded contexts - assign them a set of business capabilities - commission a business capability team - have them build a twelve factor app.

Bounded contexts are coupled with _database per service_ pattern - either a single schema within a multi-tenant cluster, or a dedicated database. Only one application is able to gain access to a logical data store. All external access must be via well-defined business APIs. Different persistence mechanisms can then be chosen as appropriate. NOTE: In order to ask cross context questions, data must often be recomposed via event-driven techniques.

#### Containers

LXC, Docker, Rocket object instantiated via a scheduling solution e.g. Kubernetes, Marathon, or Lattice. Application developers must become skilled at packaging their applications into containers.

## Migration Cookbook

### Decomposition

* Build new features as microservices rather than attempting to extract them
* Anti-corruptions layers help the new microservices communicate with the monolith. This can be divided into sub modules which are typically:
    - Facade - simplifies the process of integrating, does NOT change the model (system integration)
    - Adapter - new service interface which can communicate with the new facade / monolith (protocol translation)
    - Translator - model translation
* Identify bounded contexts within the monolith to extract this functionality as a microservice
* Where old code is stable and unchanging with the anti-corruptions layers easy to maintain, leave this code as is

### Distributed Systems

* Versioned and distributed configurations are necessary including full auditability of changes and refresh without restarting e.g. Spring Cloud contains a Config Server (http://cloud.spring.io/spring-cloud-config/) which uses a REST API backed by a git repo. Changes in config can be pushed to the git repo. Applications can then be instructed to update their configurations via e.g. Spring Cloud Bus (send one message to the bus to update all participating applications, the bus broadcasts a message to each application to update its config)
* Distributed systems require ways to discover available API endpoints. Services are often seperated into frontend and backend. A service registry then sits between the frontend and backend services and provides a list of all backend services to the frontend, making them available via load balancing. SOAs often employ a form of service registry / use Service Locator / Dependency Injection patterns.
* Round-robin load balancing 





