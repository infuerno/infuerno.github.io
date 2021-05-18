---
layout: post
title: ".NET Conf Microservices 2020 - Workshop"
---

## Resources

- To read: https://azure.microsoft.com/en-gb/blog/microservices-an-application-revolution-powered-by-the-cloud/
- To watch: Avoiding Microservice Megadisasters: https://www.youtube.com/watch?v=gfh-VCTwMw8
- Book: https://www.amazon.co.uk/Art-Immutable-Architecture-Management-Distributed/dp/1484259548
- To read: https://docs.microsoft.com/en-us/dotnet/architecture/microservices/multi-container-microservice-net-applications/implement-api-gateways-with-ocelot
- To watch: https://www.youtube.com/watch?v=wR9zxqB_r-0&list=PL03Lrmd9CiGcg2_VkY3AdZs3-bR9jzu4J&index=8&t=0s&app=desktop
- To watch: https://www.youtube.com/watch?v=V_m1i1MkG4Q OR https://www.infoq.com/presentations/kubernetes-yaml/

## Workshop Module 1: Introducing Microservices

Define microservices: What are they? How do they work? Benefits and challenges? Problems they solve. Identity systems that would warrant this architectural approach.

## Workshop Module 2: Modeling Microservices

Examine best practices for scoping microservices. What are the drivers for partitioning them? How granular should they be? Greenfield systems as well as approaches to replatforming brownfield monolithic systems into a microservice architecture.

## Workshop Module 3: Architecting Microservices

Explore microservice architecture, characteristics and design. Emphasis is on widely-accepted patterns and principles. Coverage includes service design, DDD, backing services, observability, resiliency, idempotency, and decoupled configuration.

### Domain Architectures

#### Anemic Domain Model

A single microservice could be developed in a single assembly using the Anemic Domain Model approach:

- One (or a few) business classes containing all business rules
- Many entity classes only containing state (getters and setters)
- Can still have logically seperate layers for API (controllers), Domain (business classes), Data Access (repository classes)

#### Domain Model

Alternatively, for anything not super simple use a regular Domain Model approach:

- Multiple assemblies for physical seperation
- Application layer - Ordering.Api - service endpoints, commands and command handlers, queries
- Domain model layer - Ordering.Domain - domain aggregates, domain entities with data and behaviour
- Infrastructure layer - Ordering.Infrastructure - data persistence and repositories

#### Domain Entity pattern

- Entity classes have both state and behaviour
- Improves maintainability, testability, data integrity

#### Domain Aggregates pattern

- Group related entities into an aggregate e.g. `Order Aggregate` contains `Order` (aggregate root = only one) and `OrderDetail` (child entity)
- Each aggregate is self contained
- Only communicate via the root, the root exposes members which access both root and children (typically don't reference children directly)

![Domain Aggregates pattern](https://www.dropbox.com/s/lvx1440w0qkq4d2/eshop-on-containers-ddd-5000ft.png?raw=1)

### Backing Services

Ancillary resources e.g.

- Data stores
- Message brokers
- Distributed caches
- Monitoring
- Identity services

Should be able to attach / detach without code changes i.e. plug and play using Strategy pattern

- Reference infrastructure via an interface
  - e.g. `IEventBus` which has `Publish` and `Subscribe` methods available in the `EventBus` asseumbly
- `Startup.cs` -> `ConfigureServices` -> `services.RegisterEventBus` - defined in an extension class BUT THEN hardcoded to the chosen implementation (!)
- Use repository to separate business layer from database implementation (and then `MockRepository` for testing e.g. using Moq: `Mock<IBasketRepository>`)

### Observability

- Choose an observability platform (App Insights - built in correlation)
- Choose a framework (Serilog, can be plugged in to Insights)
- Distributed tracking and correlation tokens - generated at the gateway - passed to each service - ensure included with each logged event - also useful for timing operations

### Correlation ID generation

- Could use GUIDs, but better to use something more meaningful e.g. Service-Date-Time-Random
- Check Twitter Snowflake project (https://developer.twitter.com/en/docs/basics/twitter-ids)
- Shouldn't need to explicity pass along - use middleware OnActionExecuting etc
- Aspect orient the correlation ID
- https://github.com/stevejgordon/CorrelationId

### API Gateway pattern

- Client communicates only with the gateway
- Keep gateway close to services to reduce latency (all in Azure network)
- Ensure availability - e.g. multiple instances with a load balancer
- Beware of overly ambitious gateway - consider exposing multiple gateways (Backends for Frontends) e.g. IoS gateway, Web App gateway
- Offload cross cutting concerns from backend services TO the gateway e.g.
  - Service discovery, correlation, response caching, resiliency logic, metering, throttling, SSL termination, protocol translation
  - Will ALWAYS be some cross cutting concerns in the back end e.g. always going to authenticate, always going to authorise, always going to log

#### API Gateway options

##### Azure API Management

- Developer portal, publishing portal
- Apply policies to endpoints to affect behaviour
  - several prebuilt, can apply to inbound, outbound or invoked on error
  - restrict access, throttle calls, caching, transform e.g. XML to JSON

##### Azure Application Gateway

- Simple gateway requirements
- Includes URL routing, SSL termination, firewall

##### Ocelot

##### Azure Front Door

##### Envoy

## Workshop Module 4: Microservice Communication

We explore how clients communicate with microservices and how microservices collaborate among one another. Request/response, publish/subscribe, gRPC, API Gateways, and more. Emphasis is on the trade-offs among messaging patterns.

Two approaches to communications, solution will depend on the message type

- Synchronous request / responses
- Asynchronous pub / sub model

### Message types

- Query, client needs response - use synchronous (using async / await to avoid blocking threads)
  - However avoid deep chaining among microservices
  - Aggregator pattern - seperate microservice which orchestrates calls to multiple other microservices so that calls aren't "chained" between microservices - still synchronous - so consider using gRPC instead of HTTP
    - https://github.com/uw-labs/bloomrpc
    - https://docs.microsoft.com/en-us/aspnet/core/tutorials/grpc/grpc-start?view=aspnetcore-3.0&tabs=visual-studio
  - Request / Reply pattern (Sync over Async) - client synchronous, but backend services use queues to communicate - decouples calls between backend services
  - Have read only copy of data in service which needs it to save lookups (Materialized View pattern: https://docs.microsoft.com/en-us/azure/architecture/patterns/materialized-view)
- Command, client needs to perform an action - use asynchronous
  - Producer and consumer - produce messages and place on a queue e.g. Order Service - consume message from a queue e.g. Shipping Service
- Event, client reacts to something that has happened in another service
  - Publisher and subscriber - publish event when state change or action occurs - use topic - one bus, multiple message types, subscribers subcribe to receive the message types they are interested - topic uses filtering rules

## Workshop Module 5: Distributed Data

We consider best practices for managing distributed data following the widely-accepted Database per Microservice pattern. Emphasis is on managing consistency when implementing cross-service queries and transactions. Coverage of Materialized View Patterns, Sagas, CQRS, and Event Sourcing. Discussion of relational and No-SQL Options in Azure.

## Workshop Module 6: Deploying Microservices to Kubernetes

We deploy a set of containerized microservices to Azure Kubernetes Service. Emphasis is on the orchestration and management features of Kubernetes along with decision of criteria of when to use it.

### Container Management

Containers need to:

- Discover and talk to each other e.g. REST / gRPC
- Sometimes manage state
- Upgrade with zero downtime
- Scale in/out on demand

Orchestration helps with this!

### Orchestration

Large containerized workloads required automated management or **orchestration** including provisioning, service discovery, networking, scaling, upgrades, failover, monitoring, affinity (provision nearby or far apart)

### Kubernetes

- Control plane - deploy Master
- Data plane - deploy Worker nodes which run the work loads
- Docker for the container runtime
- Kubectl - CLI for K8s
- Pods, Deployments, Services
- Also Volumes, Namespaces, Labels and Selectors
- Networking infrastructure
  Or can use Azure Kubernetes Service (AKS)

https://docs.microsoft.com/en-us/azure/architecture/reference-architectures/containers/aks-microservices/aks-microservices


NDC Sidney 2019 :Dissecting Kubernetes (K8s) - An Intro to Main Components - Joshua Sheppard The speaker (Joshua Sheppard) runs every single part of Kube on Vagrant and "handle manual file changes on Kubelet / Control plane ....)