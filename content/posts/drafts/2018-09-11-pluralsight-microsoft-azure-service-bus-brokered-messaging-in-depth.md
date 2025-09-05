---
layout: post
title: "Pluralsight: Microsoft Azure Service Bus Brokered Messaging In-depth"
---
## Understanding the Azure Service Bus

### Microsoft Azure Service Bus

* Relay Service - allows clients to expose endpoints in the cloud - service hosts behind a firewall make a secure connection to the relay which exposes an endpoint accessible to clients over the internet - calls to the endpoint are relayed to the service behind the firewall - cost effective way to expose services
* Brokered Messaging - durable entities such as queues and topics to be created an hosted in Azure - THIS COURSE
* Notification Hubs - allow messages to be broadcast to a number of devices
* Event Hubs - provide telemetry services on a massive scale

### Asynchronous Messaging Scenarios

Various challenges with asynchronous processing, handling varying loads and also connectivity between hybrid systems.

* Enterprise Service Bus - interaction and communication in SOA - "Enterprise Silver Bullet" - focussed on request / response service opersations
* Message Bus - common data model, common command set and messaging infrastructure - focussed on asynchronous processing
* Internet Service Bus - many capabilities of previous two, but hosted in the cloud

Capabilities include:
* Communication
* Load levelling - bus acts as a buffer - if average load exceeds capacity of one service, can have multiple services to service
* High availability - bus acts as storage if some applications are unavailable
* Temporal decoupling - messages can be sent and processed at different times

### Azure Service Bus Brokered Messaging

Service Bus Namespace holds the queues, topics etc
* Queues - provide a point to point messaging channels for FIFO processing pattern
* Topics and Subscriptions - pub sub - a single message can be broadcast to many subscribers, often more versatile - subscriptions can additionally use filters

* 2 protocols are supported
 - AMQP - open messaging protocol, default used by SDK, supported by many applications and libraries
 - HTTP - where firewalls may limit connectivity

### Azure Service Bus SDK

`Install-Package WindowsAzure.ServiceBus`

Common classes:
* `NamespaceManager` - manage entities within a namespace - create update and delete queues, topics etc
* `MessagingFactory` - factory class to create clients
* `QueueClient` - send and receive from queues
* `TopicClient` - send to a topic
* `SubscriptionClient` - receive from a subscription, manager filter rules
* `BrokeredMessage` - represents a message transmitted


