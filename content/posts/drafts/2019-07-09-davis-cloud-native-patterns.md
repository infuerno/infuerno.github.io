---
layout: post
title: "Davis: Cloud Native Patterns"
---
## References

* State of DevOps Report
* Source code: https://www.manning.com/books/cloud-native-patterns and https://github.com/cdavisafc/cloudnative-abundantsunshine
* Discussion forum: https://livebook.manning.com/#!/book/cloud-native-patterns

## Contents
### Part 1
* Chapter 1: The cloud-native model: apps/services, interactions, data p3
* Chapter 2: Patterns and practices used in production
* Chapter 3: Platforms supporting these patterns and practices

### Part 2
* Chapter 4: Interactions, introduction of event driven rather than request, response
* Chapter 5: Apps/services and data, deploy at scale, keep stateless
* Chapter 6: Apps/services configuration
* Chapter 7: Apps/services lifecycle, upgrades, rollbacks, blue/green upgrades
* Chapter 8: Interactions, service discovery and dynamic routing
* Chapter 9: Interactions, client side - retries
* Chapter 10: Interactions, service side - API gateways, circuit breakers
* Chapter 11: Observing behaviours and performance
* Chapter 12: Breaking up the monolithic database

# Part 1 The Cloud Native Context

>...operating cloud-native apps. I can hear some of you thinking “I’m dev—I don’t need to worry about that,” but please suspend your disbelief for a moment. The operational practices that deliver on some of your customers’ demands immediately translate to requirements on your software.

## Chapter 1 Defining "cloud-native"

* The applications you’re running on a particular infrastructure can be more stable than the infrastructure itself.
* Cloud-native software is designed to anticipate failure and remain stable even when the infrastructure it’s running on is experiencing outages or is otherwise changing.
* Three parts of cloud native software:
    - App - business logic - must be constructed so that upgrades and scaling is possible
    - Data - as with apps, must be decomposed and distributed
    - Interactions - communication between the apps and the data - many interaction patterns are completely new due to the extreme distribution which now exists
* Caching is a key pattern and technology in cloud-native software.
* Ultimately, treating state as an outcome of a series of events forms the core of the distributed data fabric.
* Accessing an app when it has multiple instances requires some type of routing system.
* Automatic retries are an essential pattern in cloud-native software, yet their use can wreak havoc on a system if not governed properly. Cir- cuit breakers are essential when automated retries are in place.
* Application metrics and logging, things we’ve been producing for decades, must be specialized for this new setting.
* Reasons for not going cloud-native:
    - IOT where there is no capacity to support any redundancy and the systems aren't critical e.g. rice cooker
    - Need complete consistency of data at all times e.g. a bank
    - The cost of rewriting is not worth the benefits OR no benefit to rewriting

## Chapter 3 The platform for cloud-native software

From the big cloud providers, we have Google App Engine, AWS Elastic Beanstalk, and Azure App Service (none of which are particularly widely adopted). Cloud Foundry is an open source cloud-native platform that has had remarkable penetration into large enterprises globally.

