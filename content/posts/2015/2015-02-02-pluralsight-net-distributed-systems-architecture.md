---
layout: post
title: "Pluralsight - .NET Distributed Systems Architecture"
---
## Introduction

### What is a distributed system?

A distributed system is any application which involves two or more communicating processes. If any process becomes unavailable, then any dependent process operates in a state of reduced capability.

A good example of a distributed system is converting a console application with a call to library dll on the same computer to a call to a web service. The web service can be updated easily and also stats of the web service usage easily tracked.

### Why?

* One version of the truth (rather than having to synchronise e.g. stock levels in a warehousing system)
* Enforce uniform rules - business rules are implemented in one place rather than implemented several times in slightly different ways which hit problems 
* Agility - new UI created which calls back to shared business layer

#### Components

Security - authentication and authorisation need to be top of the list
Logging - must be implemented early on
Data - information between layers must only expose data required. Often need to expose different versions of the same objects
Business Logic - exposed via web service, queues etc
Connectivity - will have internal and external consumers - internal will likely use the same authentication system, external will likely have different authentication and be limited to HTTP

#### Security

Callers need to be authenticated to access the service and also the data provided by the service. Have a mechanism to translate the identities into a single principle you can trust. Given a trusted identity, authorisation rules can be applied.

Decide how group membership will be maintained. With AD? Temporal?

Authorisation will also be distributed and will depend on the components.

#### Logging

* Debugging distributed applications is hard
* Logs tell you what happened and when
* Numerous frameworks exist, log4net being a favourite example

#### Data

* Ownership of data typically belongs with the system which maintains the data
* Ideally local copies of data will not be kept, however you may need to maintain a copy if:
    - you need to join on it with local data
    - the store of record cannot support the number of connections required, too far away or over a slow connection
* If creating a copy, ensure you keep it updated in the following ways:
    - if data is stored in a file, only update when the file changes
    - if data is stored in a database, only updated the changed records
    - don't create bi-directional synchronisation, update the master and then receive the changes

 #### Business logic

Sharing logic between assemblies requires all assemblies to be tested and deployed as a unit when any changes are made
With larger components a distributed app or service is more manageable

#### Connectivity

On Microsoft platforms distributed systems expose components via COM+, .NET remoting, WCF.
Type of connectivity provided will limit consumers - provide mechanisms influenced by consumers

On service provider side:
* ensure service can close down any bad connections
* add throttling to limit callers to a fixed number of calls per unit of time
* maybe make services discoverable

On caller side:
* check for all errors
* handle time outs
* if services are discoverable have a mechanism in place to use this

#### Tools

* IIS - currently version 7.5, fully integrates ASP.NET into the processing pipeline - no need to write ISAPI extensions
    - more than just a host for UI, can also host workflows and webservices returning not just HTML, but also ADO.NET data sets, RSS and Atom feeds, ODATA, Json and Binary data
    - by default applications get recycled every 29 hours but is configurable
* WAS - Windows Process Activiation Service - introduced with Vista and Windows Server 2008 - provides a model to activate applications over MSMQ and TCP in the same way IIS has allowed activation of applications over HTTP for the last 10 years
    - IIS can host all kinds of application, WAS provides a mechanism to only activate those services when a request appears
    - WAS provides a mechanimsm to listen for messages over protocols other than HTTP
    - This works by first installing an adapter which handles activiation over a particular protocol - this adapter tells the WAS infrastructure it knows how to handle URLs with a particular scheme
    - Next someone installs an application. Then using appcmd.exe WAS is configured such that the application can receive messages on a set of URLs - the config is stored in applicationHost.config inside WAS
    - For WCF listeners the adapter is a service called net.msmq, net.pipe or net.tcp listener adapter
    - For HTTP, HTTP.SYS listens for requests
    - When a messages arrives the adapter receiving the request notifies WAS that a message has arrived
    - WAS checks the request and checks how to activate the service required, firing up a worker process if necessary
* MSMQ - distributed queuing system
	- supports one way messaging
	- messages can be stored either in memory or on disk
	- disk storage supports processing messages in the order in which they were received
* MS-DTC - handle transactions spanning machines
	- 
* WCF - set of class libraries providing uniform way of exposing messaging to .NET framework
* WF - set of class libraries for workflow
* SQL Server
* BizTalk


