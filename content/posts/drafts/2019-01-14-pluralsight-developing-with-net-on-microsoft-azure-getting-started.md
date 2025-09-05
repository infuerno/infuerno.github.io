---
layout: post
title: "Pluralsight: Developing with .NET on Microsoft Azure - Getting Started"
---

* `shaken-rg` - resource group
* `shaken-serviceplan` - app service plan
* `shaken` - app service
* slots - `shaken` and `shaken-staging`
* `shaken-insights` - Application Insights
* `shakendb` - sql database
* `shaken.database.windows.net` - sql server


## Foundational Concepts

Azure CLI tools now cross platform at version 2

* `az login` to open a browser to login
* `az account set -s [subscription-name]` to set a subscription
* `az vm start --resource-group docker-rg --name docker` to start a VM

The CLI additionally has query syntax e.g.
* `az account list-locations --query [].name`

## Building Web Applications and APIs

* App Services support various Web, API, Logic and Mobile applications (Logic apps look like they have been split away now)
* Various preconfigured options e.g. WordPress on Linux
* Need to choose OS - either Windows or Linux
* Service Plans - App Services are deployed to an App Service Plan. App Service Plans describe the performance characteristics of the service. Multiple services can be deployed to the same App Service Plan (i.e. the applications are deployed together onto the same machine).
  * App Service Plans can be scaled UP just like VMs.
  * They can also be scaled OUT by increasing the number of instances of a plan - can be configured to scale out or in in response to the load

### Creating a web app via the CLI

* `az group create -n shaken-rg --location uksouth`
* `az appservice plan create --resource-group shaken-rg --name shaken-plan --sku S1`
* `az webapp -g shaken-rg -p shaken-plan -n shaken`

### Deploying a web app to an Azure App Services

Various options including:
* FTP to push a published version to Azure
* Upload a zip file
* VS - right click on project - publish - simple wizard
* From a source code repo e.g. GitHub OR hosted in the App Service itself

To use a local repo:
* Create a git repo inside the App Service itself via the App Service > Deployment Center option.
* Ensure Deployment Credentials are setup
* Add the specified url as a remote in your git repo
* Push!

Azure uses git hooks to take additional actions following push including attempting to recognise the type of application (e.g. .net core; nodejs) and then building and deploying the application.

## Monitoring and Scaling Web applications

### Understanding deployment slots

* Slots are similar to having another app service but instead based on an existing app service. Once configured additional slots will have their own url e.g. https://shaken-staging.azurewebsites.net.
* Different slots can have different Application settings (which will automatically override any settings specified in a config file).
* A git repository additionally needs to be provisioned for the slot with separate remote url and credentials.
* Following that running applications can be "swapped" between environments either via the web portal or the CLI.
* `az webapp deployment slot swap -g shaken-rg -n shaken --slot staging --target-slot production`

### Monitoring App Service applications

On the Overview of the App Service there are several metrics dashboards. Otherwise the "Monitor" resource allows you to build various different metrics dashboards.

App Services: Requests, Requests  in Application Queue
App Service Plans: CPU percentage; Memory percentage; Http Queue length

CPU percentage which is spiking e.g. over 90% means there is too much load, maybe too many app services deployed to a single app service plan.

#### Alerts

Alerts can be set up watch a metric and email, text or phone if something is out of normal range. (Alerts can also be set up for activities on the portal e.g. a VM is created.)

#### Scaling

Azure offers both horizontal and vertical scaling. Vertical scaling is moving the application to a bigger or small server (App Service Plan). Horizontal scaling is increasing the number of applications servicing the load. In general horizontal scaling is preferred. Stateless web apps are therefore preferred.

Various parameters available to indicate when to scale out or in, and thresholds.

#### Using Application Insights

Diagnostic logs are logs that the application or the web server produces. Can be turned on or off (i.e. anything written to System.Diagnostic). Can choose where to store them.

Application Insights can store information about every request, how long they took, how long database calls took etc. Need to install the necessary packages for your chosen language (by default these days).

To add see: https://github.com/Microsoft/ApplicationInsights-aspnetcore/wiki/Getting-Started-for-a-ASP.NET-CORE-2.0-WebApp

1. Create Application Insights on Azure and get the key
2. Add key to appSettings.config
3. if Aspnet.Core.All metapackage is not installed add NuGet package
4. Add to OWIN pipeline

#### Advanced tools

Go to Developer Tools > Advanced = Project Kudu. LOTS of stuff available e.g. https://shaken.scm.azurewebsites.net

#### Remote debugging

In visual studio, use "Cloud Explorer" to connect to azure and find the App Service. Set breakpoints in your code then attach to the remote process to remotely debug it. (May have to turn off "Just my code").


## Using Cloud databases

### Azure SQL
Azure SQL databases need to be associated with an Azure SQL server - which is merely a container with an admin login to connect to database.

SQL elatic pools are useful if managing multiple databases.

Azure SQL database performance is measured in DTUs - data throughput unit - blended mix of CPU, memory and IO. Configured at the database level (not the server level).
* 5 DTUs - Basic Tier - up to 2GB, no concurrent users
* 10 DTUs - Standard Tier - up to 250GB - adequate for 25,000 page views per day with a few database queries per page view.
* Lots of tools to monitor DTU usage.

### Azure Cosmos DB

Azure Costmos DB account > database > collection - collections hold the "documents" and can hold any kind of data - one collection can hold all kinds of different information of difference formats. May seperate into high performance collection (accessed frequently) and low performance colllection.

* Storage capacity can either be fixed (cheaper) or unlimited. With unlimited a "document" needs to be specified which will be used to partition the data.
* Throughput measured in RU/s - 1RU = fetching 1KB over HTTP. Minimum possible is 400 RUs = 400KB per second.
* `Install-Package Microsoft.Azure.DocumentDB.Core` (Cosmos DB was formerly called Document DB)
* Connect using a URL e.g. https://shaken.documents.azure.com and a key (either read or read-write)

## Cloud Storage

* Blob Storage = binary large object. Block blob - good for streaming; Page blob - good for random access reads and writes; Append blob - e.g. for logs
* Table Storage = key, value pairs
* Queue Storange = for messaging
* File Storage
* Disk Storage = for data disks

A Shared Access Signature gives limited permissions to a shared container. These can be created in code, so can generate a Shared Access Signature, append it to a URL (it can be used in this way) and give this URL to the user. A Shared Access Policy can be built to specify the exact parameters required e.g. permissions (read), start time, end time.

## Functions

When creating a "Function App" in Azure, need to specify either an App Service Plan OR a Consumption Plan. 

App service plans need to be paid for whether the functions are running or not and also don't automatically scale up or down unless set up to do so. Consumption plans are pro rata the usage (number of times the function runs, resources used etc), with a generous free quota.

A storage account is also required for "book keeping" 

A Function App can contain:
* functions
* proxies - sits between a client and a backend service - can change the incoming request or outgoing response
* slots

Authorisation can be set to:
* Anonymous - no auth required
* Function - set at the Function level
* Admin - set at the Function App level

v1 - Full .NET Framework  
v2 - .NET Core (currently in preview)

Functions can be developed with the Azure portal or locally. Once developed locally, they become read only on the portal








