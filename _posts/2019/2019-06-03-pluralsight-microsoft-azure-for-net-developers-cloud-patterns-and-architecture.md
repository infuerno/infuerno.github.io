---
layout: post
title: "Pluralsight: Microsoft Azure for .NET Developers - Cloud Patterns and Architecture"
---

* `amarula-rg`
* `amarula-serviceplan-eu` - service plan based in EU
* `amarula-serviceplan-us` - service plan based in US
* `amarula-traffic` - traffic manager
* `amarula-us` - app service
* `amarula-eu` - app service
* `amarula-redis` - redis cache

## Architecture in the Cloud

Patterns for building scalable cloud solutions

### An Overview of Azure Services

#### IaaS

* Compute - VMs and Containers
* Storage - BLOB, Files, Log files, Diagnostic files for other services
* Networking - Create private network inside of Azure; VPN to on premises network

#### PaaS

* Compute - Service Fabric (scalable microservices - low level services - useful for a large number of stateless services)
* Integration - Storage Queues, BizTalk services, Service Bus
* Media and CDN
* App Service - Web Apps, API Apps, Notification Hubs (SMS)
* Developer Services - Azure Devops, Azure SDK, Application Insights
* Analytics and IOT - HDInsight (Hadoop), Machine Learning (set up API), Data Factory (move large volumes of data)
* Data - SQL, Redis Cache, CosmosDB

#### Security and Management

* Azure AD, Azure Key Vault

### Basic API Design

* App Service can run on Windows and therefore IIS. Nevertheless can still run Node.JS, Ruby, PHP and Java. App Services for Linux can run all these stacks as well as .NET Core
* Advantages over VMs:
    * Instantaneous deployments
    * App Service Plan - can be scaled vertically and horizontally, also auto-scale configurations
    * Deployment slots (no downtime)
    * Storage account usually used for log files, diagnostic files
    * Blob storage can also be used for user uploads (can replicate / share access signatures)
    * Blob storange can also be used for static files e.g. CSS - can then be pushed to CDN

### Adding Authentication

* Can add various external identity providers e.g. Twitter, Facebook etc - middleware components for these. Simply register the application's URL with the identity provider. ASP.NET Identity can additionally be used to track who has registered for which account. 
* Azure AD for business / internal applications
* Azure AD B2C
* IdentityServer

### Sophisticated Web System

* App Service with App Service Plan with auto-scale in place
* Azure AD plugged in for authentication
* Asynchronous processing - use a storage account and message queues to manage - load levelling - helps cope with spikes in traffic by levelling the load and amorizing the request over a longer length of time e.g. heavy processing to manage a customer's order.
* Azure WebJobs and Azure Functions - good for executing code when a message appears in a queue, when a new blob appears in a storage account (Consumption Based app service plan)
* Blob storage for static content to push to a CDN (can pick up straight from the app service, but blob storage recommended)
* Azure Redis Cache - can hold cache for all services used - saves start up time
* Azure search - indexers which can crawl data in SQL, CosmosDB
* App Insights - has an API
* Azure Key Vault - protect access keys, passwords, certificates

### Adding Resilience and Availability

* Deploy the application across two different regions
* Azure Traffic Manager can be used to route requests to one region or the other. DNS name servers when queried return the IP address for a region, based on routing rules e.g. lowest latency (geographically closest), or specific geographic routing (requests from Europe go to the Europe data center). Alternatively can have active region and standby region.
* Geo replication for databases - primary for writes, replicated to multiple secondary for reads

### Managing APIs

* API Manager can provide API gateway capabilities as well as a unified API interface from a multitude of different services. 
* Can provide a developer portal - allow third parties to sign up to use the API

### Backend Architecture for Native Apps
 
* Azure Mobile SDK - will help synchronise data between local storage on the device and an API endpoint. Notification hubs for push messages.
* Microsoft Hockey App (now renamed Visual Studio App Centre) (with Azure DevOps) to push builds to devices

### DevOps with Containers and Kubernetes

* Push code to Azure DevOps and from there push to Azure Container Registry (or DockerHub)
* From there can push to App Service (Web App for Containers)
* OR set up own cluster using Azure Kubernetes Service (AKS)
* Azure Monitor to monitor deployments

### Building for the IOT

* Event Hubs - designed to ingest events e.g. temperature readings. Built on top of Service Bus. Can use HTTPS as well as AMQP. 
* IoT hub - bidirectional communication with devices
* Stream Analytics for analysing data
* Data Lake or Data Warehouse for holding data - HDInsight 

### IaaS

* Public load balancer which distributes traffic to one of a set of web servers running in an Availability Set
* Web servers in turn communicate via an internal load balancer to a set of business services also running in an Availability Set
* Jump box to manage VPNs - potentially via a VPN Gateway

## Cloud Patterns for Resilency

Resilient applications have two important characteristics:
* High Availability - responsive and healthy for a substantive amount of time
* Disaster Recovery

One often influences the other. Resiliency is a trade off with cost and is therefore a business decision. Additional costs for resources, but also additional complexity which implicitily equals higher costs.

#### Redundant Storage

* LRS - locally redundant storage - copied to 3 different nodes locally
* GRS - geo redundant storage - copied to primary and secondary data centers

#### Availiability Sets for VMs

* Fault Domain
* Update Domain

#### Replication and Point in Time Restores

* Replication - high availability and disaster recovery for the data
* Point in Time Restore - for when the application writes bad data

#### App Services

* Geo Distributed using Traffic Manager

### SLAs

Microsoft publish the SLAs for Azure services: https://azure.microsoft.com/en-gb/support/legal/sla/. Need to recognise the conditions under which different SLAs are given e.g. VMs deployed in an Availability Set will have a different SLA to single instance VMs. 

### Connection Resiliency

* Retry a few times with a delay between e.g. 503 - Service Unavailable - worth retrying; 404 - not worth it
* Many different services have different retry policies which can be specified when creating a client from the appropriate SDK library
* ADO.NET doesn't include any retry logic (must write yourself), but EF6 and EF Core DO have retry logic e.g. 
```
services.AddDbContext<ApplicationContext>(options =>
{
    options.UseSqlServer(Configuration.GetConnectionString("default"))
    sqlOptions => sqlOptions.EnableRetryOnFailure());
});
```

### Graceful Degradation

When retry still isn't working. Need to provide the best experience when things have gone wrong in one part. 

The added complexity with add cost, but for example can add a ready only Redis Cache to have all data the main database has to at least service reads. CQRS and event sourcing pattern comes in handy here to give a structure and make resilient systems easier to implement. 

### Load Balancing

* Azure Load Balancer - layer 4 - transport layer load balancer. Sends all TCP packets for a single request to the same machine
* Azure Application Gateway - layer 7 - application level load balance - understands HTTP, HTTPS, WebSockets - can do SSL offloading, cookie based sessions, URL based routing
* Azure Traffic Manager - DNS lookups to distribute requests

### Azure Traffic Manager

A "profile" can be set to one of several Routing Methods:
* Performance - best latency
* Weighted - 10% to App A; 90% to App B; Good for AB testing
* Priority - Send all traffic to Priority 1 instance unless unavailable / unhealthy 
* Geographic - Allocate based on location of user
* Multivalue - ?
* Subnet - ?

### Azure Traffic Manager Endpoints

* Can change the routing method
* Can update the TTL - default is 60 seconds - lower the value, the quicker a client can cutover from a failing instance to a working instance in that event (however more DNS queries have to be done the lower the value - may make the application "slower" and also may cost more - DNS queries as charged pro rate)
* Endpoint manager settings need to be set properly to an address on the endpoint which is going to return a 200 status code - often set to a specific path e.g. `/monitor` - which could perform some additional checks e.g. database connectivity
* Set up endpoints and set endpoint type:
    * Azure endpoint - for anything Azure
    * External endpoint - anything else
    * Nested endpoint - another traffic manager profile
* https://www.whatsmydns.net - useful to check how it is resolving around the world
* SQL server options for resiliency
    * Just one SQL server means if EU region is down and the SQL server is in the EU region, the US app would also be having problems
    * Can geo-replicate the data from EU (write) to US (read only)
    * Build a caching layer
    * Use messaging, and message queues (only possible with async tasks)

### Load Levelling
 
* Storage queues - reliable, persistent, support HTTP based interface
* Service Bus queues - not only queues. Has other features e.g. transactions, duplicate message detection, poison messaging handling, expiration, batching. Can help communicate through firewalls and reach endpoints which are hidden by NATs. 
    * Queue - brokered communication
    * Topics - similar to a queue with multiple subscribers
    * Relays - synchronous two way communication - firewall, dynamic IP, hidden by NAT

### Azure Service Bus

* First need to create a namespace
* Queues have various configurations:
    * Max queue size - default 1 GB
    * Message TTL - default 14 days - after this messages are delete (or dead lettered)
    * Lock duration - default 30 seconds when a reading process tries to read a message
    * Enable duplicate detection
    * Enable dead lettering on expiration
    * Enable session (for dealing with groups of related message)
    * Enable partitioning - ???
* Usual to create separate policies for reading and writing


Metrics shown on summary:
* Active message count - number of messages in the queue
* Scheduled message count
* Dead-letter message count
* Transfer message count
* Transfer dead-letter message count

### Testing

Important to simulate sceanrios for the resilience that is in place to ensure it works.

### Monitoring

Despite the in built diagnostics - need to add logging and instrumentation. Have alerts set up - be on the look out for unusual behaviour. Web logs, database logs, OS performance counters

## Cloud Patterns for Scalability

Performance is usually thought of as the speed with which ONE request can be actioned.

Scalability, on the other hand, is how well an application copes with 1000s of requests.

### A Sample Architecture

* Azure Traffic Manager - route requests to multiple app service deployments. The app service themselves can use auto scaling
* API Gateway - optimise API endpoints
* CDN
* Partition blob storage
* CQRS pattern - one approach to reading data, a different approach to writing data
* Use service bus and functions for back end processing
* Partition SQL data
* Application Insights for monitoring

### The Importance of Partitioning

Data storage is often a bottleneck. 

* **Vertical partioning**   
Can be used to divide atributes of data which are more often referenced from attributes of data which are more seldomly referenced. The data attributes which are referenced more often can then use premium storage / caching / replication.
* **Horizontal partioning**  
Popular approach to scaling data - e.g. range partitioning - all customers for A-M go to one database, N-Z to another; temporal partitioning - all orders for this month to one database, all orders for last month to a database; hashing partitioning - decided based on hash value
* **Functional partitioning**
Different data sets in different data sources. Also easy to then store one set of data in a relational database and one set in a document database.

Will complicate the design and will be difficult to join data or transactions across the partitions, but needed to be able to scale this aspect.

### Azure SQL Sharding

Each database has the same _schema_, but with different records inside. Can shard on a range (as above) or a tenant id if hosting for different tenants. One extra database is the "shard map manager" which contains all the metadata about how to reach all the metadata in the shard set of databases. 

The database for each tenant can furthermore be scaled vertically (increase the capacity for a busy tenant etc).

Databases can also be placed into an elastic pool. Azure provides "elastic" tools to manage and work with shard sets. E.g. Elastic database job allows executing SQL commands against all the databases in the shard set, elastic query for querying for all data. 

Most database technologies in Azure have a partitioning strategy e.g. CosmosDB

### Understanding the CAP Theorum

Useful in thinking about designing the qualities of distributed systems.

* C = Consistent - every read will see the most recent data - e.g. system uses a relational database with ACID transactions
* A = Availability - every request receives a response - diffificult to have 100% availability, but can aim for e.g. 99.9%, can design for high availability when it is demanded by the business
* P = Partition Tolerance - a request will receive a reponse even when parts of the system are not able to communicate normally (a "network" partition) - usually expanded to mean not just network failures, but server failures or server out for patching

Put forward by Eric Brewer who stated that a distributed system can only have 2 of the 3 guarantees. Therefore need to find which 2 qualities are most important. 

* **Intersection CA (Consistency / Availability)**  
Every request will receive a response, and every response includes the latest data but e.g. updating the data may be unavailable (so the request to UPDATE would not get a response??). This intersection is difficult for cloud systems, because high availability usually means caching, queuing etc which means the latest data may not be available.
* **Intersection CP (Consistency / Partition Tolerance)**  
If there is a problem, the system will stop processing requests to ensure consistency
* **Intersection AP (Availability / Partition Tolerance)**  
Highly available and resilient to failures and as such, there is some inconsistence - e.g. be eventually consistent

The choices will depend on the business. Also, some parts of the system can be different.

### Common Application Patterns

* Partioning at the data layer
* CQRS - code to write data and code to read data are different

### Configuring and Using Redis Cache

The `StackExchange.Redis` nuget package (included in the meta package `Microsoft.AspNetCore.App`) contains a client for interacting with a redis cache. This can be done via specifically interacting to redis OR via `IDistributedCache`

```
// establish connection
var connectionString = "amarula-redis.redis.cache.win ... Connect=False";
var connection = ConnectionMultiplexer.Connect(connectionString);
_redis = connection.GetDatabase();

// get a STRING
var greeting = _redis.StringGet("greeting");

// set a STRING
_redis.StringSet("greeting", greeting);

```

```
public CacheController(IDistributedCache cache)
{
    _cache = cache;

    // get a STRING
    var greeting = _cache_.GetString("greeting");

    // set a STRING
    _redis.SetString("greeting", greeting);    
}

// in Startup.ConfigureServices
public void ConfigureServices(IServiceCollection services)
{
    services.AddDistributedRedisCache(options => {
        options.Configuration = "amarula-redis.redis.cache.win ... Connection=False";
    })
}

```

### The Role of CDNs

Azure CDN has support for SSL and custom domains. Can cache content from web app, blob storage or any web location.

1. Set up a CDN profile which allows working with one or more endpoints (which can be set up to ANY web content).
2. Set up an endpoint for e.g. `amarula-traffic` - Azure Traffic Manager. When the CDN is initially queried it won't have the asset and will query it from the associated endpoint. Thereafter it will be cached. (Current the web app option doesn't work well with traffic manager so choose custom)

### Azure API Gateway

* Important if you want to charge money for use of your API.
* Add cross cutting concerns e.g. rate limit throttling, response caching to tune performance
* Portal to login, create access keys, view documentation etc
* In Azure there are several important parts:
    * APIs - manage collection of APIs - can be App Services / Functions / own data centre
    * Products - each API will be placed into a "product". Clients then register for access to products
        * Starter - default included product which limits rate of requests
        * Unlimited - default included product which doesn't limit number / rate of requests
    * Subscriptions - manage any subscription
* API Gateway has ability to modify incoming requests as well as outgoing response e.g. add caching, add additional headers, serve static mock responses rather than hitting the actual API. 
* Policies allow you to apply rate limits, whitelist IP addresses, transform JSON to XML (all availble in pre built policies). Can even write some simple C# code into the policy to be evaluated at runtime.

## Cloud Patterns for Testing

### Requirements

* Know why are we load testing?
    * e.g. How many concurrent users can we support?
    * Need qualatitive goals - e.g. average response time must be less than 750 ms.
* Need a test environment. Also need machines to generate load against the test environment (e.g. to simulate 100,000 users)
* Software to monitor the application, not only the response times, but also find the bottlenecks e.g. was the web server out of memory, database reached a utilisation limit

### Simple URL Testing

Can set up a simple load test on an Azure App service iteslf. App Service > Performance Test.

Visual Studio Enterprise has tooling to perform more sophisticated tests including HTTP POSTs and paramteters.

### Prepare a web application for testing

* Install Application Insights to the web application.
    * Connected Services > Add Connected Service > Monitoring with Application Insights.
    * Installs necessary NuGet packages
    * Attempts to connect to existing "insight" resource / or create one
    * Add the necessary application key
    * Add .UseApplicationInsights() to the WebHostBuilder creation
* Consider adding config settings to turn features on an off
    * e.g. caching to make it easier to do load testing (e.g. with and without caching)
    * two different approaches to a database query

## Creating a Web Test

* Add "Web Performance and Load Test project" (under Test section)
* File will be added with the extension `.webtest`









* A = Atomic - 
* C = Consistent - 
* I = 
* D = Durable