---
layout: post
title: "Chris Richardson: Distributed Data Patterns for Microservices - RedisConf 2020 Takeaway"
---

## Module 1: Overview of the workshop

Lab guide (PDF) to set up local environment using github repo https://github.com/eventuate-tram/eventuate-tram-examples-customers-and-orders-redis

### Lab setup

Can either set up a development environment locally OR use docker to set up a development environment running in containers.

1. Clone repo
2. Build and start the **java-development** container using docker-compose: `docker-compose -p redisconf-2019 up -d --build java-development`
3. Get an interactive bash shell on the container: `docker exec -it redisconf-2019_java-development_1 bash`
4. Build and start services: `./gradlew buildAndStartServices`

### Lab tear down

1. Stop containers (running in the container!): `./gradlew composeDown`
2. Stop the java-development container: `docker-compose -p redisconf-2019 down`

### Useful links

- About Chris: https://chrisrichardson.net/about.html
- https://microservices.io/
- Book: https://microservices.io/book

## Module 2: Microservice Architecture Essentials

Watch JFokus 2020 conference talk: http://chrisrichardson.net/microservices/2020/02/04/jfokus-geometry-of-microservices.html

Referenced: https://medium.com/@copyconstruct/testing-in-production-the-safe-way-18ca102d0ef1

## Module 3: Transactions and queries in a microservice architecture

Short video outling challenges faced (< 5 mins)

- Ecommerce application with REST API with commands and queries
  - createCustomer(creditLimit)
  - createOrder(customerId, orderTotal)
  - findOrdersForCustomer(customerId)
  - findRecentCustomers()
- Implemented using Customer Service and Order Service (with respective DBs) and API Gateway
- Both the createOrder command and the 2 queries need data from both services, but since we need to ensure loose coupling, implementing this is not straightforwards

![Architecture](https://www.dropbox.com/s/ss70yvncmfb14kj/transactions-and-queries-in-a-microservices-architecture.png?raw=1)

### Transactions

Need to ensure the customer has enough credit, create the order, decrement the customers credit atomically. In a monolith or within a microservices application can simply wrap everything in a transaction. In a microservices architecture this is not possible.

Can't use traditional distributed transaction i.e. 2PC / XA, since this requires tight runtime coupling which then reduces availability.

### Queries

Queries which span services is also challenging, since can't simply JOIN across databases.

## Module 4: Overview of the SAGA pattern

Must use the SAGA pattern instead of traditional distributed transactions. Short video (approx 12 mins)

### Introduction to SAGAs

Idea is from a paper written in 1987. Split up the whole transaction into series of local transactions. For example:

1. createOrder() in OrderService creates the order in a PENDING state
2. reserveCredit() in CustomerService
3. approveOrder() in OrderService updates state to APPROVED

### Rolling back with compensating transactions

When a business validation fails in a transaction, can simply "rollback" the transaction with a single statement. However, not possible in a SAGA. Therefore developer needs to write specific compensating transactions which explicitly undoes what has already been done previously.

Each local transaction e.g. T1, T2, T3 needs to have a corresponding compensating transaction e.g. C1, C2, C3. Therefore if T2 fails then C1 needs to be run to undo T1. Need to write the logic to coordinate this.

1. createOrder() in OrderService creates the order in a PENDING state
2. reserveCredit() in CustomerService **FAIL**
3. rejectOrder() in OrderService updates state to **REJECTED**

Example of a semantic undo.

#### Challenges

- Compensating transactions can NEVER fail - no concept of compensating the compensating transaction. Therefore write them so they will always succeed.
- Implementation of the undo needs to be carefully considered. Can't simply restore an object to its original state since it may have been modified by another transaction in the interim. Sometimes easy, sometimes not. Also need to consider transactions which can't be undone e.g. sending an email.

### Implementing updates which can't be undone

Useful to _categorise_ transactions to help solve these kind of problems.

1. **Compensatable transactions** - can be easily undone with a compensating transaction
2. **Retriable transactions** - guaranteed to succeed (i.e. no business rules preventing success)
3. **Pivot transations** - neither compensatable OR retriable
   - since NOT retriable => all transactions preceding it MUST be compensatable
   - since NOT compensatable => all transactions following MUST be retriable (so they will never fail and need to pivot transaction to be rolled back)
   - only ONE pivot transation in a SAGA

Therefore SAGAs can be thought of in three phases:

1. Compensatable transactions
2. Pivot transaction (GO / NO GO)
3. Retriable transactions (great for actions which can't be undone)

Can therefore reorder steps e.g. place what would otherwise be a complex undo compensation transaction AFTER the pivot, therefore removing the need to write it

### SAGAs are not ACID (no Isolation)

ACD, but not I. Therefore steps of 2 concurrently executing SAGAs _may_ be interleaved.

1. Create Order SAGA: Customer creates an order - createOrder() is called, order 1 = PENDING, reserveCreditEvent emitted
2. Cancel Order SAGA: Customer cancels order - cancelOrder() is called, releaseCreditEvent emitted
3. Create Order SAGA: Customer service received reserveCredit, but fails due to insufficient credit
4. Cancel Order SAGA: Customer service received releaseCredit, **releases credit which was never reserved**

The Cancel Order SAGA does a "dirty" read resulting in a data inconsistency.

### Countermeasures

- Design technique to make SAGAs more "ACID"ic e.g. semantic lock - application level lock on an object that is being updated. If a lock had been applied to the order in the PENDING state, it couldn't have been read by the Cancel Order SAGA until its state had been finalised

### Further reading

- https://microservices.io/patterns/data/saga.html
- https://chrisrichardson.net/post/microservices/2019/07/09/developing-sagas-part-1.html
  - References talk at MicroCPH in May 2019: https://microservices.io/microservices/sagas/2019/07/09/microcph-sagas.html - first half covers roughly what is covered here, but a little more detail
- Chapter 4 of the Manning Microservice Patterns book

## Module 5: SAGA communication and orchestration

### Communication between SAGA participants

How do to two services communicate?

- BAD: Synchronous REST services
  - Runtime coupling
  - If a service fails after sending a message but before receiving a response various inconsistencies (e.g. credit is reserved for an order which is never created)
- GOOD: Message broker with "at least once" delivery
  - Should also implement ordered delivery
  - Should also have a mechanism to increase consumers WHILST still preserving ordering e.g. Apache Kafka consumer group; ActiveMQ message group

### Transactional messaging

A single service needs to both update its database AND send a message to the next participant in an atomic transaction i.e. neither part should fail.

1. If update the database first and THEN send the message, if the service crashes after updating the databse, the message will never be sent
2. If update the database and try to send the message during the database transaction. However if the database transaction doesn't commit but the message IS sent, then have an issue the other way round. Also tightly couples the database TO the message broker.

Therefore, need to use a transactional messaging system.

#### Option 1: Event Sourcing pattern

Uses an event store for persistence. An event store is a hybrid of a databsae and a message broker. A service persists a domain object in the event store as a sequence of events. Other services consume the events. This way the event in the `OrderService` of the order being created is both the database update AND the message to the `CustomerService`, hence atomic. See Chapter 6 of the book!

#### Option 2: Transaction Outbox pattern

A service sends a message by inserting it into an OUTBOX table. Hence the database update is completed within a transaction (to the ORDERS table and the OUTBOX table). A seperate message relay process retrieves messages from the OUTBOX table and sends them to the message broker.

To get the messages from the OUTBOX table:

1. Transaction log tailing. Use a database specific APi to read the databases transaction log looking for inserts into the OUTBOX table (e.g. MySQL binlog; Postgres WAL; AWS DynamoDB table streams; MongoDB change streams). Very efficient.
2. Periodically query the OUTBOX table using a flag "IsSent" to keep track of rows successfully sent. Latency is higher because polling has to be periodic.

### How SAGAs affect API design

Ideally APIs should not wait for a whole SAGA to complete before replying. However, this puts the onus on the client to poll for the outcome of the SAGA. This polling should be invisible to the user e.g. server could use websockets to notify the client. Will often complete within 100ms, so user won't even notice. UI could anyway display a "processing" popup in case of a longer delay.

### Overview of different coordination mechanisms

The application must contain logic which defines each SAGA, which steps to execute and any rollbacks required. Two approaches:

1. Choreography: distributed decision making - logic is distributed amongst the participants
2. Orchestration: centralised decision making - logic is centralised within a SAGA orchestrator

#### Choreography = event driven approach

Services publish events stating what they **have done** which are consumed by other services.

#### Orchestrator = central async request/response

Orchestrator invokes each particpant in turn using asynchronous request / response.

### Further reading

- Event Sourcing: https://microservices.io/patterns/data/event-sourcing.html
- Transactional Outbox: https://microservices.io/patterns/data/transactional-outbox.html
- Log Tailing: https://microservices.io/patterns/data/transaction-log-tailing.html
- API Composition: https://microservices.io/patterns/data/api-composition.html
- CQRS Pattern: https://microservices.io/patterns/data/cqrs.html
- Chapter 7 of the book!

## Module 6: Using choreography-based SAGAs

![Choreography based SAGA example](https://www.dropbox.com/s/m9lsmtrejk0hzgv/choreography-based-saga.png?raw=1)

### Advantages

- Simple to implement, especially if already using event sourcing
- Reduces runtime coupling

### Disadvantages

- Decentralised implementation - hard to understand, so good for simple SAGAs, but potentially not for complex ones
- Risk of excessive design time coupling - services need to know about each other events and may need to change both when events are changed

### Considerations

- How much data to publish in the event? Minimal OR Enriched
  - Minimal e.g. `OrderCreated` event could just contain the `OrderId`. Event structure is lightweight and stable, but consumer needs to fetch the data it needs AND data **could** have changed since the event being published
  - Enriched requires the event structure to be more complex and less stable. However just `OrderId`, `CustomerId` and `OrderTotal` should be all that is required (for the `OrderCreated` event), so not THAT complex! **Therefore enriched is generally preferable.**
- NOTE: message channels are typically named after the domain aggregate emitting the event e.g. `OrderService` publishes events to the order events channel.

## Module 7: Using orchestration-based SAGAs

The SAGA orchestrator implements a state machine with each reply triggering a state transition.

1. SAGA is created, invokes first participant, persists state in DB, waits for a reply
2. Reply has the SAGA ID (a correlation ID)
3. SAGA instance is loaded from the database and passed the message, message triggers a state transition which causes the SAGA to send a message to the next participant, again persisted to the DB etc

In a specific example the `OrderService` would still receive the initial order request, but would instead create a `CreateOrderSaga` instance. The order would be created as a result of the message sent from the `CreateOrderSaga`. This would be a local operation with the ID returned in response to the initial request. Following this the CreateOrderSaga would send a message to the Customer command channel (point to point, NOT pubsub). A message would be received on the SAGA reply channel (again point to point).

![Orchestration based saga](https://www.dropbox.com/s/k3fxtbu5pa262ee/orchestration-based-saga.png?raw=1)

### Advantages

- Centralised logic
- State of a SAGA lives in the database, so can easily query (note, should however be extremely short lived)
- Reduced design time coupling, Customer Service knows less

### Disadvantages

- Yet another class - may garner too much logic
- Often need a framework to implent state machines (however these frameworks DO exist!)

### Message design

- Command message
  - Header: `Type` (command to invoke), `ReplyTo` (the reply channel), `SagaId`
  - Payload: command arguments
- Reply message
  - Header: `Type` (reply type), `SagaId`
  - Payload: results, if any (often empty, the `Type` usually surfices)

### Considerations

## Module 8: Querying in a microservice architecture

Queries which span services in a microservices architecture are always challenging. Two key patterns: API composition (simple) and CQRS (more complex, but more powerful). Use the API composition pattern when possible.

### API Composition

Initiate sub queries on the services which own the needed data and merge the results. Main disadvantage is that some queries may be too inefficient e.g. due to too many network round trips.

### CQRS

Supports a view database specifically designed to support one or more queries. The replica database is kept up to date using events.

## Module 9: Implementing queries using CQRS

In a nutshell:

- Services which update data, publish events
- Event handlers subscribe to the events and update the view (replicate database)

CQRS splits the data model into two, a command side model used for commands and query side data model used only for queries

![CQRS](https://www.dropbox.com/s/m08yzcklih5bcp2/Screenshot%202020-06-14%2014.46.18.png?raw=1)

In microservices it is less strict and the command side model is often used for a service's local queries too. The query side data model's main purpose here is for queries which span multiple command side data models or services.

Services publish events, typically domain events. As in choreography based SAGAs, events are typcially published using either Event Sourcing OR the Transactional Outbox pattern.

Views are replicas and are therefore disposable. They can be rebuilt either by replaying events OR more traditional ETL.

The Redis example uses a `HASH` to store customer data, with fields for `id`, `name`, `creditList` and `orders`. Data can be efficiently received from a single call to `HGETALL`.

### Advantages

- Code is simpler and more maintainable (though potential for code duplication)
- Can have multiple denormalised views
- Necessage when using Event sourcing

### Disadvantages

- Complex
- Storage costs for replicated data
- Eventually consistent due to heavily asynchronous architecture

### Implementations

Aside from the data source, 3 code modules are required:

1. Data access
2. Event handlers to update the databases
3. Query API to query the database

### Considerations for event handlers

- Event handlers MUST be idempotent. If not inheritently idempotent, track received event IDs.
- Must deal with concurrent updates e.g. using application side optimistic locking or using database specific mechanism
- Must deal with out of order events e.g. `OrderCreated` followed by `CustomerCreated`. Event handler for `OrderCreated` can't assume customer already exists and event handler for `CustomerCreated` can't assume customer doesn't already exist!

### Database technology choice

- Choose a database optimised for querying, but be wary of introducing too many database technologies into the organisation.
- The schema must support both queries and updates
- The event may not contain the PK of the record to be updated, so schema must support update based on a FK (think Redis)
- CQRS views can usually make the most of NoSQL database advantages (high performance, scalability) without being affected by the drawbacks (limited transactions, complex querying capability)
- SQL database may be a good choice if also wanting to use for BI
- Can use multiple CQRS views using multiple database technologies to optimise each type of query required e.g. document database, text database AND graph database (note Redis can be used for all three!)

### Relationship between CQRS views and services

Three options to consider to expose a CQRS view via a service:

1. Dedicated service e.g. OrderHistory service
2. Part of the service which owns the data stored in the view. Useful when the command side "source of truth" database doesn't support the query e.g. `RestaurantService` which in addition to a MySQL database, maintains an Elastic search database for geo and text based "nearest" queries
3. Command side replica in another service. Useful when the data doesn't change much. e.g. OrderService has replica of customer `availableCredit` information (surely this changes a lot?!)

### Eventual consistency

There is lag before the view is updated following a command. Therefore if a client issues a query immediately after a command, stale data may be returned resulting in a confusing user experience.

One solution is for the browser NOT to immediately issue a query, but use the response to update its local view model. Added benefit is the elimination of an extra server round trip.

Alternative solution is to use aggregate version numbers. A new version number for the aggregate is returned with the initial response. If the browser queries and gets an older version number for the aggregate, it knows this data must be stale. If it is still stale, it can periodically query until the data is fresh.

## Module 10: Eventuate and Redis

- Eventuate - distributed data management platform for microservices.
- Eventuate Tram - transactional messaging framework, one of the main parts

## Module 11: Eventuate and Redis Lab

