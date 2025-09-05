---
layout: post
title: "Microsoft Azure: AZ-204: Developing Solutions for Microsoft Azure"
---

## Learning Path: Create serverless applications

### Azure services for automating business processes

Business processes modelled in software are known as **workflows**. Azure includes 4 different technolgies to implement workflows which integrate different systems:

1. Logic Apps - design first for IT pros and developers - over 200 connectors
2. Microsoft Power Automate - build on top of logic apps - design first for non technical staff
3. WebJobs - continuous or triggered (schedule or manually) - code written in script or .NET using WebJobs SDK - only technology that permits developers to control retry policies - useful if deploying an Azure App Service anyway
4. Azure functions - cost effective if using the consumption plan

| &nbsp;                                    | Azure WebJobs                          | Azure Functions                        |
| ----------------------------------------- | -------------------------------------- | -------------------------------------- |
| Supported languages                       | C# if you are using the WebJobs SDK    | C#, Java, JavaScript, PowerShell, etc. |
| Automatic scaling                         | No                                     | Yes                                    |
| Development and testing in a browser      | No                                     | Yes                                    |
| Pay-per-use pricing                       | No                                     | Yes                                    |
| Integration with Logic Apps               | No                                     | Yes                                    |
| Package managers                          | NuGet if you are using the WebJobs SDK | Nuget and NPM                          |
| Can be part of an App Service application | Yes                                    | No                                     |
| Provides close control of JobHost         | Yes                                    | No                                     |

### Azure Functions

- Azure Functions support package managers e.g. NPM, NuGet
- Functions are "event driven", only running in response to an event
- Execution timeout is strict e.g. 5 minutes or 2.5 minutes when requiring an HTTP response
- Durable Functions - an option called Durable Functions allows you to orchestrate the executions of multiple functions without any timeout
- Execution frequency - while scaling, only one function app instance can be created every 10 seconds, for up to 200 total instances (each instance can service multiple concurrent executions). Different types of triggers have different scaling requirements, so research your choice of trigger and investigate its limits.
- Azure Functions use a storage account to log function executions, managing execution triggers. On a consumption plan the function code and configuration are also stored here.

#### Serverless

Serverless doesn't mean there are no servers - it just means the developer doesn't have to worry about servers. Instead, a cloud provider such as Azure, manages servers.

#### Bindings

The power of Azure Functions comes mainly from the integrations that it offers with a range of data sources and services, which are defined with bindings. With bindings, developers interact with other data sources and services without worrying about how the data flows to and from their function.

- Bindings are a declarative way to connect data and services to your function.
- Each binding has a direction code reads data from input bindings and writes data to output bindings
- Each function can have zero or more bindings to manage the input and output data processed by the function.
- A trigger is a special type of input binding that has the additional capability of initiating execution
- Every Azure Function must have exactly one trigger associated with it. If you want to use multiple triggers, you must create multiple functions.
- Unlike a trigger, a function can have multiple input and output bindings.

Possible bindings: https://docs.microsoft.com/en-us/azure/azure-functions/functions-triggers-bindings?tabs=csharp#supported-bindings

##### Binding configuration

Bindings require at least 3 properties:

1. Name - Defines the function parameter through which data is accessed. For example, in a queue input binding, this is the name of the function parameter that receives the queue message content.
2. Type - Identifies the type of binding, i.e., the type of data or service we want to interact with.
3. Direction - Indicates the direction data is flowing, i.e., is it an input or output binding?

Additionally, most binding types also need a fourth property:

4. Connection - Provides the name of an app setting key that contains the connection string. Bindings use connection strings stored in app settings to keep secrets out of the function code. This makes your code more configurable and secure.

Depending on the binding type, other properties may be required e.g. `path` property in a blob storage trigger.

Bindings are defined in the `function.json` configuration file.

##### Binding expressions

A binding expression is specialized text in `function.json`, function parameters, or code that is evaluated when the function is invoked to yield a value.

Most expressions are identified by wrapping them in curly braces except app setting binding expressions which are wrapped in percent signs. e.g. `%Environment%/newblob.txt`

### Triggers

- Timer triggers require 2 things:
  1. Timestamp parameter name - an identifier to access the parameter in code
  2. CRON schedule - `{second} {minute} {hour} {day} {month} {day of the week}` e.g. every 5 minutes = 0 `*/5 * * * *`
- Blob storage triggers define a path e.g. `samples-workitems/{name}` - here the container name is `samples-workitmes` which the trigger will monitor.
- Add a filter e.g. `samples-workitems/{name}.png` to limit which files trigger the function

### Durable Functions

Durable Functions enable performing long-lasting, stateful operations. Azure provides the infrastructure for maintaining state information, so they can be used to orchestrate a long-running workflow. This is useful when there is a manual approval process in the middle of custom business logic.

- Azure functions are stateless
- Durable functions can retain state between function calls
- Can chain functions together e.g. fan in, fan out pattern - call multiple functions in parallel and the combine all results
- Can orchestrate and coordinate functions

#### Function Types

- **Client** functions - trigger / entry point
- **Orchestrator** functions - use code to describe how actions are Implemented
- **Action** functions - basic units of work

#### Application Patterns

Also see: https://docs.microsoft.com/en-us/azure/azure-functions/durable/durable-functions-overview?tabs=csharp

- Function chaining - coordinate a chain of activities
- Fan in / fan out - call multiple activities in parallel
- Async HTTP APIs - HTTP trigger a long running process, return redirect to endpoint which can be polled to learn when process has finished
- Monitor - recurring process in a workflow - e.g. poll for a change in state
- Human interation - a process which requires manual intervention

#### Install an NPM package to a function

Function > App Service Editor > Console > wwwroot > `touch package.json` > `open package.json` > create a barebones `package.json` > save > console > `npm install durable-functions` > Overview > Restart function

#### Timers

Use durable timers in orchestrator functions instead of the setTimeout() and setInterval() functions.

Create a durable timer by calling the createTimer() method of the DurableOrchestrationContext. This method returns a task that resumes on a specified date and time.

```
const df = require("durable-functions");
const moment = require("moment");

module.exports = df.orchestrator(function*(context) {
    for (let i = 0; i < 10; i++) {
        const deadline = moment.utc(context.df.currentUtcDateTime).add(i, 'd');
        yield context.df.createTimer(deadline.toDate());
        yield context.df.callActivity("SendReminder");
    }
});
```

Always use currentUtcDateTime to obtain the current date and time, instead of Date.now or Date.UTC.

### Azure Functions Core Tools

Tools to develop functions locally and push to Azure.

- Generate the files and folders needed to develop functions locally
- Run functions locally to test and debug them
- Publish functions to Azure

Other Functions development tools, such as the Functions-related features in Visual Studio and the Azure Functions extension for Visual Studio Code, are built on top of the Core Tools.

- A **function app** is a collection of functions which share the same configuration.
- A **function project** is used to develop a function app locally.
- All functions need to have the correct configuration files. Use code generation from the core tools rather than writing from scratch.
  - `func init` creates a new function project with a `host.json` and `local.settings.json` (only applies to locally running functions)
  - `func new` creates a new function
  - `func start` to start the functions runtime locally for testing functions
  - `func start &> ~/output.txt &` to start function in the background (useful from within Azure cloud shell)
  - `pkill func` to stop the background process
  - `func azure functionapp publish <app_name>` to publish the function to azure - NOTE will DELETE any existing functions

### Structure of an Azure Function

- An Azure Function is implemented as a static class
- The class provides a static, asynchronous method named `Run`, which acts as the entry point for the function
- Parameters passed to the function provide the context for the trigger (e.g. `HttpRequest` for an HTTP trigger)
- Attributes of the `HttpTrigger` attribute define access level and accepted HTTP methods.

```csharp
public static class Function1
{
  [FunctionName("Function1")]
  public static async Task<IActionResult> Run(
    [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)] HttpRequest req,
    ILogger log)
  {
    log.LogInformation("C# HTTP trigger function processed a request.");

    string name = req.Query["name"];

    string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
    dynamic data = JsonConvert.DeserializeObject(requestBody);
    name = name ?? data?.name;

    return name != null
        ? (ActionResult)new OkObjectResult($"Hello, {name}")
        : new BadRequestObjectResult("Please pass a name on the query string or in the request body");
    }
  }
}
```

#### Function Apps

A Function App is the context under which an Azure Function runs. They specify:

- The operating system / runtime
- Resources available e.g. memory, computing

### SignalR

SignalR is an abstraction for a series of technologies that allows apps to enjoy two-way communication between the client and server. It handles connection management automatically, and allows broadcasting messages to all connected clients simultaneously, as well as sending messages to specific clients. The connection between the client and server is persistent, unlike a classic HTTP connection, which is re-established for each communication.

A key benefit of the abstraction provided by SignalR is the way it supports "transport" fallbacks. A transport is method of communicating between the client and server. SignalR connections begin with a standard HTTP request. As the server evaluates the connection, the most appropriate communication method (transport) is selected. Transports are chosen depending on the APIs available on the client.

For clients that support HTML 5, the WebSockets API transport is used by default. If the client doesn't support WebSockets, then SignalR falls back to Server Sent Events (also known as EventSource). For older clients, Ajax long polling or Forever Frame (IE only) is used to mimic a two-way connection.

#### Update polling app to use SignalR

The web client uses the SignalR client SDK to establish a connection to the server. By convention the connection is retrieved via a function name `negotiate`.

- Create an Azure Function with an HTTP trigger and add a SignalR inbound binding
- The connection info on the inbound binding is returned to the client with the HTTP response
- Create an Azure Function triggered by changes to Azure Cosmos DB
- Add the `feedPollDelay` setting - the function actually still polls Azure Cosmos DB!!!
- Add a SignalR output binding to this function to return updated stocks info (I guess the hubName must match that used in `negotiate`)
- Add code to the function to return stocks information from cosmosdb to SignalR, formatted as required for SignalR API
- Update the web application to add a reference to the signalr.js SDK on a CDN
- Update the JS app to no longer poll on a timer, but instead to set up a SignalR connection

### Azure API Management

Functions can be added to Azure API Management to be presented to users as part of a single API.

## Learning Path: Connect your services together

Azure provides several technologies tto communicate more reliably, including:

- Storage queues
- Event Hubs
- Event Grid
- Service Bus

### Events or Messages

- Messages contain the actual data. The sender has an expectation that the data will be received and processed
- Events are lightweight notifications which don't include the data, just the location. Additionally the sender has no expectations
- Events can be unrelated OR part of a series of related ordered series
- Components sending events are **publishers**, receivers are **subscribers**

### Messaging solutions

#### Azure Queue Storage

Queue storage uses Azure Storage to store large numbers of messages that can be securely accessed using a simple REST-based interface. Queues can contain millions of messages, limited only by the capacity of the storage account that owns it.

#### Azure Service Bus Queues

Service Bus is a message broker system intended for enterprise applications. Apps often have multiple communication protocols, different data contracts, higher security requirements.

#### Azure Service Bus Topics

Topics are like queues, but can have multiple subscribers. Internally, topics use queues. When you post to a topic, the message is copied and dropped into the queue for each subscription.

#### Azure Service Bus Relays

Performs synchronous two-way communication between applicaition, but DOESN'T have a temporary storage mechanism. Use to cross problematic network boundaries.

#### Delivery guarantees

- **At Least Once Delivery** - will be delivered to at least one component, but may be delivered more than once
- **At Most Once Delivery** - messages may not arrive, but no chance it will be delivered twice. "Automatic duplicate detection".
- **FIFO** - is the order guaranteed? If this is critical ensure FIFO delivery

#### Transactional support

If multiple messages must either succeed OR fail, then ensure transactions are supported. e.g. Order is sent AND credit card is billed.

#### Which to choose

Use Storage queues when you want a simple and easy-to-code queue system. For more advanced needs, use Service Bus queues. If you have multiple destinations for a single message, but need queue-like behavior, use topics.

Service Bus Queues support:

- At-Most-Once delivery guarantee
- At-Least-Once also supported
- FIFO guarantee
- Transactions
- Receiving messages without polling a queue
- Providing a role-based access model to the queues
- Larger message sizes: up to 256KB (standard) up to 1MB (premium)
- Ability to publish and consume batches of messages.

Queue storage supports:

- Only smaller message sizes, 64KB maximum
- Queues larger than 80GB
- An audit trail of messages that pass through the queues

Though distributed components can communicate directly, enhance reliability by using Azure Service Bus or Azure Event Grid.

#### Implementating Service Bus Queues

- Use NuGet package `Microsoft.Azure.ServiceBus` and class `QueueClient` for interacting with queues.
- An endpoint and an access key is required by both source and destination components - combined to form a `ConnectionString`
- Using `QueueClient.SendAsync()` ensures adding message to queues are asynchronous

##### Sending messages to queues

```csharp
var queueClient = new QueueClient(TextAppConnectionString, "PrivateMessageQueue");
string message = "Sure would like a large pepperoni!";
var encodedMessage = new Message(Encoding.UTF8.GetBytes(message));
await queueClient.SendAsync(encodedMessage);
```

##### Receiving messages from queues

```csharp
var queueClient = new QueueClient(TextAppConnectionString, "PrivateMessageQueue");
queueClient.RegisterMessageHandler(MessageHandler, messageHandlerOptions);

// within the MessageHandler method, process message and then call
await queueClient.CompleteAsync(message.SystemProperties.LockToken);
```

#### Implementing Service Bus Topics

- Use NuGet package `Microsoft.Azure.ServiceBus` and class `TopicClient` for sending to topics and `SubscriptionClient` for subscribing to a Topic.
- Use filters to subscribe only to certain message e.g. a StoreId
  - Boolean filters - all or nothing
  - SQL filters - similar to WHERE in SQL "a condition"
  - Correlation filters - **how is this different to a SQL filter?** "a set of conditions"

##### Sending messages to topics

```csharp
var topicClient = new TopicClient(TextAppConnectionString, "GroupMessageTopic");
string message = "Cancel! I can't believe you use canned mushrooms!";
var encodedMessage = new Message(Encoding.UTF8.GetBytes(message));
await topicClient.SendAsync(encodedMessage);
```

##### Subscribing to topics

```csharp
subscriptionClient = new SubscriptionClient(ServiceBusConnectionString, "GroupMessageTopic", "NorthAmerica");
subscriptionClient.RegisterMessageHandler(MessageHandler, messageHandlerOptions);

// within the MessageHandler method, process message and then call
await subscriptionClient.CompleteAsync(message.SystemProperties.LockToken);
```

#### Implementing Storage Queues

- Queues are only available as part of Azure general-purpose storage accounts (v1 or v2) NOT Blob storage accounts
- The Access tier setting (shown for StorageV2 accounts - cool or hot) applies only to Blob storage and does not affect queues
- Choose a location close to source or destination (or preferably both)
- Use secure transfer if sensitive information will be sent
- Use NuGet package `WindowsAzure.Storage`
  - `CloudStorageAccount` represents your Azure storage account
  - `CloudQueueClient` represents Azure Queue storage
  - `CloudQueue` represents one of your queue instances
  - `CloudQueueMessage` represents a message

#### Creating the queue, sending a message, receiving a message

```csharp
CloudStorageAccount account = CloudStorageAccount.Parse(connectionString);
CloudQueueClient client = account.CreateCloudQueueClient();
CloudQueue queue = client.GetQueueReference("myqueue");

// sender application should always be responsible for creating the queue
await queue.CreateIfNotExistsAsync();

// send a message
var message = new CloudQueueMessage("your message here");
await queue.AddMessageAsync(message);

// receive a message
CloudQueueMessage message = await queue.GetMessageAsync();
if (message != null)
{
    // process the message
    // ...
    await queue.DeleteMessageAsync(message);
}
```

### Azure Event Grid

Good for a publisher with many subscribers e.g. upload a music file, notify any potentially interested subscribers.

Azure Event Grid is a fully-managed event routing service running on top of Azure Service Fabric. It distributes events from different sources (blob storage, media services) to differnt handlers (functions, webhooks).

#### Terminology

An **event** occurs at an **event source** e.g. Azure Storage is the event source for "blob created" events. An event publisher is the user or organisation who publishes the events e.g. Microsoft. the terms publisher and event source are often used interchangeably.

The source publishes it to a **topic**. Topics are created for groups of different categories of events e.g. user events and orders events. System topics are provided by Azure and can be subscribed to (not shown in a subscription). Custom topics are for applications and for third parties (visible in the subscription).

The events are routed according to **subscriptions** and sent to **event handlers** or subscribers.

![Azure Event Grid](https://docs.microsoft.com/en-gb/learn/modules/choose-a-messaging-model-in-azure-to-connect-your-services/media/4-event-grid.png)

Many different Azure services can generate events.

Events are JSON messages with a particular format.

```json
[
  {
    "topic": string,
    "subject": string,
    "id": string,
    "eventType": string,
    "eventTime": string,
    "data":{
      object-unique-to-each-publisher
    },
    "dataVersion": string,
    "metadataVersion": string
  }
]
```

#### Reasons to choose Event Grid

- simple
- has advanced filtering
- fan out - subscribe to an unlimited number of endpoints
- reliable - retries delivery for up to 24 hours
- pay per event

### Azure Event Hubs

Useful for handling a massive number of events e.g. millions of events per second. Optimised for extremely high throughput, a large number of publishers, subscribers and resiliency.

As events are received, they are divided into **partitions** or buffers. By default events stay in the buffers for 24 hours if subscribers are not yet ready to receive them. Events can be sent immediatey to Azure Data Lake or Blob storage for immediate persistence. Events publishers can be authorised with tokens.

An event is a small packet of information (a datagram) that contains a notification. Events can be published individually, or in batches, but a single publication (individual or batch) can't exceed 1 MB.

Event publishers are any app or device that can send out events using either HTTPS or AMQP 1.0.

Event subscribers are apps that use one of two supported programmatic methods to receive and process events from an Event Hub. Either:

1. `EventHubReceiver` - A simple method that provides limited management options
2. `EventProcessorHost` - Built on top of `EventHubReceiver` providing a simpler interface with some automated options e.g. distribute multiple instances across partitions

Multiple **consumer groups** can be used if required to process the events and provide different views.

Pricing: Basic, Standard, and Dedicated - differing in terms of supported connections, number of consumer groups and throughput. Defined at the Event Hub namespace level. Configure different hubs for different throughput requirements.

#### Reasons to choose Event Hub

- supports authenticating a large number of publishers
- streams of events need to be saved to Blob Storage or Data Lake
- you need aggregation or analytics on the event stream
- reliable messaging or resiliency

## Learning Path: Store data in Azure

- "Azure Storage": Azure Blobs, Azure Files, Azure Queues, and Azure Tables
- A storage account groups these 4 services together and applies various settings including: location, performance (standard - normal HDD; premium - faster SSD), replication, access tier (hot or cold)
- May need multiple storage accounts for different business activities which require different attributes
- StorageV2 allows all storage types; Storage and Blob are both legacy types
- Storage account names must be GLOBALLY UNIQUE (not just your resource group or subscription)
- A single Azure subscription can host up to 200 storage accounts, each of which can hold 500 TB of data
- Data is automatically encrypted with 256-bit AES cypher
- Storage Analytics service logs record each request in real time and can be searched
- VHDs for VMs are encrypted using Azure Disk Encryption (**BitLocker** for Windows images, **dm-crypt** for Linux). Azure Key Vault stores the keys automatically to help control and manage the disk-encryption keys and secrets.

### Azure Blobs

There are 3 kinds of blobs:

1. Block blobs - text or binary files designed to be read from beginning to end e.g. images - files larger than 100MB must be uploaded in "blocks"
2. Page blobs - random access blobs - usually for backing storage for VHDs
3. Append blobs - similar to block blobs, but optimized for append e.g. logging

Standard pattern using continuation tokens to get all resources:

```csharp
BlobContinuationToken continuationToken = null;
BlobResultSegment resultSegment = null;

do
{
    resultSegment = await container.ListBlobsSegmentedAsync(continuationToken);

    // Do work here on resultSegment.Results

    continuationToken = resultSegment.ContinuationToken;
} while (continuationToken != null);
```

- Code defensively, use leases to managed concurrent blob access. Use streams instead of in memory structures like byte arrays or strings.

CODE BELOW FROM: git clone https://github.com/MicrosoftDocs/mslearn-store-data-in-azure.git

```csharp
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using System.Linq;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;

namespace FileUploader.Models
{
    public class BlobStorage : IStorage
    {
        private readonly AzureStorageConfig storageConfig;

        public BlobStorage(IOptions<AzureStorageConfig> storageConfig)
        {
            this.storageConfig = storageConfig.Value;
        }

        public Task Initialize()
        {
            var container = GetContainerReference();
            return container.CreateIfNotExistsAsync();
        }

       // The stream-based upload code shown here is more efficient than reading the file into a byte array
       // before sending it to Azure Blob storage. However, the ASP.NET Core IFormFile technique you use to
       // get the file from the client is not a true end-to-end streaming implementation, and is only
       // appropriate for handling uploads of small files.
        public Task Save(Stream fileStream, string name)
        {
            var container = GetContainerReference();
            var blockBlob = container.GetBlockBlobReference(name);
            return blockBlob.UploadFromStreamAsync(fileStream);
        }

        public async Task<IEnumerable<string>> GetNames()
        {
            List<string> names = new List<string>();

            var container = GetContainerReference();
            BlobContinuationToken continuationToken = null;
            BlobResultSegment resultSegment = null;

            do
            {
                resultSegment = await container.ListBlobsSegmentedAsync(continuationToken);

                // Get the name of each blob.
                names.AddRange(resultSegment.Results.OfType<ICloudBlob>().Select(b => b.Name));

                continuationToken = resultSegment.ContinuationToken;
            } while (continuationToken != null);

            return names;
        }

        public Task<Stream> Load(string name)
        {
            var container = GetContainerReference();
            return container.GetBlobReference(name).OpenReadAsync();
        }

        private CloudBlobContainer GetContainerReference()
        {
            var account = CloudStorageAccount.Parse(storageConfig.ConnectionString);
            var client = account.CreateCloudBlobClient();
            return client.GetContainerReference(storageConfig.FileContainerName);
        }
    }
}
```

### Azure Files

Files shares using SMB for e.g. multiple VMs to access shared files, storing log files etc

### Azure Queues

Use queues to loosely connect parts of an appication together.

## Learning Path: Deploy a website with Azure virtual machines

- Azure reserves the first four addresses and the last address in each subnet for its use.
- Types of VM:
  - General-purpose VMs with a balanced CPU-to-memory ratio e.g. low to medium traffic web servers
  - Compute optimised VMs with a high CPU-to-memory ratio e.g. medium traffic web servers, batch processors, application servers, network appliances
  - Memory optimised VMs with a high memory-to-CPU ratio e.g. database servers, caches, in-memory analytics
  - Storage optimised VMs with a high disk throughput and IO e.g. database servers
  - GPU VMs
  - High performance computes

| What?                                         | Typical tasks                                                                                                           | Sizes                          |
| --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| General use computing/web                     | Testing and development, small to medium databases, or low to medium traffic web servers                                | B, Dsv3, Dv3, DSv2, Dv2        |
| Heavy computational tasks                     | Medium traffic web servers, network appliances, batch processes, and application servers                                | Fsv2, Fs, F                    |
| Large memory usage                            | Relational database servers, medium to large caches, and in-memory analytics                                            | Esv3, Ev3, M, GS, G, DSv2, Dv2 |
| Data storage and processing                   | Big data, SQL, and NoSQL databases that need high disk throughput and I/O                                               | Ls                             |
| Heavy graphics rendering or video editing ... | ... as well as model training and inferencing (ND) with deep learning                                                   | NV, NC, NCv2, NCv3, ND         |
| High-performance computing (HPC)              | Your workloads need the fastest and most powerful CPU virtual machines with optional high-throughput network interfaces | H                              |

- VMs can be resized while running if the new size is available in the same cluster (needs a reboot)
- VMs can be resized to any size if stopped and deallocated

### Azure Automation Services

Instead of using PowerShell, Azure CLI etc to manage VMs, may using higher-level services such as Azure Automation Services to help operate from a higher level.

Allows automating frequent, time-consuming, and error-prone management tasks

#### Process Automation

If a VM is monitored for a specific error event, process automation allows setting up watcher tasks that can respond to events that may occur in the datacenter.

#### Configuration Management

Used to track software updates that become available for the OS. Microsoft Endpoint Configuration Manager is used to manage a company's PC, servers, and mobile devices. Extend this support to Azure VMs with Configuration Manager.

#### Update Management

Manage updates and patches for VMs. Assess the status of available updates, schedule installation, review deployment results to verify updates were applied successfully. Update management incorporates services that provide process and configuration management. Enable update management for a VM directly from the Azure Automation account. Can also allow update management for a single virtual machine from the virtual machine pane in the portal.

### Manage availability

- An **availability set** is a set of VMs which are not all upgraded at the same time. These VMs should perform identical functionalities and have the same software installed.
- Create availability sets and deploy VMs to them
- For VMs in an Availability Set, Azure guarantees to spread them across **Fault Domains** and **Update Domains**
- A **Fault Domain** is equivalent to a rack which may fail. The first two VMs in an Availability Set are deployed to 2 different Fault Domains.

![Fault Domains](https://docs.microsoft.com/en-us/learn/modules/intro-to-azure-virtual-machines/media/5-fault-domains.png)

- Azure **Site Recovery** allows replication of virtual or physical machines from a primary location to a secondary location; it keeps your workloads available in an outage.
- **Azure Backup** is a backup as a service offering that protects physical or virtual machines no matter where they reside: on-premises or in the cloud. It utilizes several components that you download and deploy to each computer you want to back up.

### Install an SSH key on an existing Linux VM

`ssh-copy-id -i ~/.ssh/id_rsa.pub azureuser@myserver`

### Some linux commands

- `ls -la /` to show the root of the disk
- `ps -l` to show all the running processes
- `dmesg` to list all the kernel messages
- `lsblk` to list all the block devices - here you will see your drives

### Initialize the extra data disk

- Identify the disk e.g. using `lsblk`
- Create a new primary partition: `(echo n; echo p; echo 1; echo ; echo ; echo w) | sudo fdisk /dev/sdc`
- Write a filesystem: `sudo mkfs -t ext4 /dev/sdc1`
- Mount the drive to the file system: `sudo mkdir /data && sudo mount /dev/sdc1 /data`

### Check status of service e.g. Apache

`sudo systemctl status apache2 --no-pager`

## Learning Path: Manage resources in Azure

There are3 approaches to deploying cloud resources: public, private and hybrid cloud
![](https://www.dropbox.com/s/vlq41zb7eu6ml3d/azure-private-public-cloud.png?raw=1)

### Private cloud

- Not the same as simply an on premise data centre
- Uses an abstraction platform to provide cloud-like services such as Kubernetes clusters or a complete cloud environment like **Azure Stack**.

### Hybrid cloud

- Useful if already have on premises infrastructure or have highly sensitive data not willing to store off site
- Could use hybrid for migration approach or for segmenting to keep the sensitive data private or for getting bursts of compute when local resources maxxed out

### Azure CLI

- `az find [term]` e.g. `az find blob` to show hints of most popular commands
- `az group list --output table` - list resources groups output as a table
- `az group list --query "[?name == 'batman']"` - filtered by name
  - NOTE. The query is formatted using JMESPath,a standard query language for JSON requests. Learn more at https://jmespath.org/.

### Azure PowerShell

- `Get-Help Get-ChildItem -detailed` to show the help file for a cmdlet
- `Get-Module` list loaded modules

  - Note. In October 2018 the AzureRM module was replaced with the Az module. The Az module ships with backwards compatibility with the AzureRM module so the `-AzureRM` cmdlet format should work. Nevertheless should transition to the Az module and use the -Az commands going forward.

- `Install-Module -Name Az -AllowClobber -SkipPublisherCheck` install the Az module (requires elevated session)
- `Update-Module -Name Az` to update the module if already installed
- `Import-Module Az` to load the Az module (by default only core modules are loaded)
- `Connect-AzAccount` to login
- `Get-AzContext` to show which subscription is active
- `Select-AzSubscription -SubscriptionId '53dde41e-916f-49f8-8108-558036f826ae'` to set a different subscription as active

### Manage costs

Total Cost of Ownership Calculator: https://azure.microsoft.com/en-gb/pricing/tco/calculator/

1. Define workloads of current on premise solution: Servers, Databases, Storage, Networking
2. Adjust assumptions: software licenses, electricity, IT administration

### Resource Groups

- Resource groups cannot be nested
- Tags on resource groups do not apply to any of the contained resources
- Only certain resources can be moved between resource groups: https://docs.microsoft.com/en-us/azure/azure-resource-manager/management/move-support-resources
- Use the Azure REST API: `validate move` e.g.

```
POST https://management.azure.com/subscriptions/<your-subscription-id>/resourceGroups/<your-source-group>/validateMoveResources?api-version=2019-05-10
Authorization: Bearer <your-access-token>
Content-type: application/json
```

with the following JSON body

```
{
 "resources": ["<your-resource-id-1>", "<your-resource-id-2>", "<your-resource-id-3>"],
 "targetResourceGroup": "/subscriptions/<your-subscription-id>/resourceGroups/<your-target-group>"
}
```

Alternatively submit using Azure CLI:

```
az rest --method post /
   --uri https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/<your-source-group>/validateMoveResources?api-version=2019-05-10 /
   --body "{\"resources\": [\"<your-resource-id-1>\", \"<your-resource-id-2>\", \"<your-resource-id-3>\"], \"targetResourceGroup\": \"/subscriptions/<your-subscription-id>/resourceGroups/<your-target-group>\"}"
```

## Learning Path: Deploy a website to Azure with Azure App Service

### Install `dotnet` cli in the cloud Shell

```
wget -q -O - https://dot.net/v1/dotnet-install.sh | bash -s -- --version 3.1.102
export PATH="~/.dotnet:$PATH"
echo "export PATH=~/.dotnet:\$PATH" >> ~/.bashrc
```

### Manual deployment
* `git push` to the appropriate git repo for your web app
* `az webapp up` packages the app and deploys it (can also create a new web app if necessary)
* `az webapp deployment source config-zip` send zip of files to an app service (can also use curl to access zip deploy)

```
dotnet publish -o pub
cd pub
zip -r site.zip *
az webapp deployment source config-zip \
    --src site.zip \
    --resource-group learn-c5f54c43-2def-448d-b6b8-25db523f586f \
    --name <your-app-name>
```
<!-- - Prepare your development environment for Azure development
- Host a web application with Azure App service
- Publish a web app to Azure with Visual Studio
- Stage a web app deployment for testing and rollback by using App Service deployment slots
- Scale an App Service web app to efficiently meet demand with App Service scale up and scale out
- Deploy and run a containerized web app with Azure App Service -->

## Learning Path: Secure your cloud data

- Security, responsibility, and trust in Azure
- Top 5 security items to consider before pushing to production
- Configure security policies to manage data
- Secure your Azure Storage account
- Configure and manage secrets in Azure Key Vault
- Secure your Azure resources with role-based access control (RBAC)
- Secure your Azure SQL Database
