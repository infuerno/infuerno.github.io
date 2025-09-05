---
layout: post
title: "Pluralsight: Microsoft Azure for .NET Developers - Building Secure Services and Applications"
---
## Software Containers

### Why Containers?

VMs require memory to host both the OS and the Apps, time is required to boot the machine, space to hold the OS files. With multiple VMs on the same hardware this is all duplicated. Containers try to solve this problem. Instead of virtualizing the hardware, a container virtualizes the operating system. 

### Understanding Docker

https://docs.docker.com/engine/docker-overview/

Docker Host provides a REST API for managing containers. The API can be used by a CLI client e.g. `docker build`, `docker pull`, `docker run`. (Tools in VS can run these commands behind the scene.) Containers change how you develop, test and deploy an application. No longer deploy exes, zip files etc, but container images instead. The image will hold the application files as well as any dependencies. Docker uses the image to create the container which will run and host the application. Docker instantiates one or more containers using an image. A docker registery allows you to search and download images e.g. the base image your image relies upon. 

### Installing Docker for Windows

* Docker for Windows can run either windows OR linux containers.
* Swapping between the two gives different configuration options, a lot fewer for Windows (since this is simpler)
* To run linux containers, a running instance of a linux operating system is required. This is specified under Settings > Advanced (with linux containers configured).
* `docker version` - display version information as well as details of server and client.

### Using the Docker command line

* https://hub.docker.com
* https://hub.docker.com/_/microsoft-dotnet-core

### Creating Images from Containers

`docker pull microsoft/dotnet/core/sdk` - pull the latest image containing the sdk
`docker run -it --name firstapp [image-id]` - create a container and jump into an interactive prompt
`docker ps -a` - list all containers (running or stopped)
`docker commit d5 pluralsight:firstapp` - create an image FROM a container
`docker run 22 hello.cmd` (where `hello.cmd` is a simple batch script to run a console app)

### Dockerfile

A Dockerfile specifies an image to create from another base image, similar to above, but rather more polished! Uses `docker build`. From Visual Studio select "Add Docker Support" to generate a default DockerFile for an application. Following that RUN using Docker (rather than e.g. IIS Express) and VS will issue the requisite `docker build` command.

`docker build -f "amarula.api\Dockerfile" -t amarulaapi:dev --target base --label "com.microsoft.created-by=visual-studio" .`  
`docker run -dt -v "C:\Users\Claire\vsdbg\vs2017u5:/remote_debugger:rw" -v "C:\Users\Claire\Projects\GitLab\pluralsight-azure-dotnet-developers\amarula.api:/app" -v "C:\Users\Claire\AppData\Roaming\ASP.NET\Https:/root/.aspnet/https:ro" -v "C:\Users\Claire\AppData\Roaming\Microsoft\UserSecrets:/root/.microsoft/usersecrets:ro" -v "C:\Users\Claire\.nuget\packages\:/root/.nuget/fallbackpackages2" -v "C:\Program Files\dotnet\sdk\NuGetFallbackFolder:/root/.nuget/fallbackpackages" -e "DOTNET_USE_POLLING_FILE_WATCHER=1" -e "ASPNETCORE_ENVIRONMENT=Development" -e "ASPNETCORE_URLS=https://+:443;http://+:80" -e "ASPNETCORE_HTTPS_PORT=44311" -e "NUGET_PACKAGES=/root/.nuget/fallbackpackages2" -e "NUGET_FALLBACK_PACKAGES=/root/.nuget/fallbackpackages;/root/.nuget/fallbackpackages2" -p 9019:80 -p 44311:443 --entrypoint tail amarulaapi:dev -f /dev/null`

where:
* -d = detached mode
* -t = allocate a psuedo tty


Permissions window may pop up "Docker wants to share C:\ - allow?". Click allow. Then a firewall request to allow vpnkit.exe. Finally select to trust the ASP.NET core development certificate.

### Pushing Images to Docker

* Create a new repository on docker hub
* The name of the image being pushed needs to be username/repo-name. Either update the build process to ensure this is the name user OR create a tag for an existing image e.g. `docker tag dd7 infuerno/amarula`
* Push the image using `docker push infuerno/amarula`

### Evaluating Container Options

Many different approaches for running containers in Azure e.g. create VM running Windows Server with the Containers feature enabled. The "Container Instances" platform is the easiest way to get a container running in Azure - specify a few parameters in terms of memory etc and go. The "Container Service" handles more sophisticated options. 

Alternatively you can run a container inside an App Service using the "bring my own container" option.

### Running a Container in App Services

Create a web app as usual, but choosing docker configuration options as per the image. NOTE: the service will be running behind a proxy server running in the App Service itself. The App Service can take care of TLS communication. In order to have a certificate installed in the container, the code to force HTTPS redirection (and HSTS) can therefore be removed.

### Setting up Continuous Deployment

* Restart the web app to force it to fetch the latest image from docker hub. Alternatively, set up a web hook to detect changes in docker hub and automatically update - copy the webhook detailed in the app service to docker hub.

## Cloud Automation

* One account -> one or more subscriptions (e.g. to segregate different business functions)
* Subscription -> one or more resource groups -> one or more resources
* Resource groups are powerful: a logical container, a security boundary, a unit of deployment - generally group things which have the same lifecycle

Azure Resource Manager (ARM) is the service responsible for provisioning resources. Provides an HTTP based API which is used by the portal, powershell, VS etc. ARM templates can be used to create resources. ARM also supports policies and auditing. Can also enforce naming conventions. 

Resource Manager communicates via Resource Providers to create the actual resources. Each resource has a resource provider which know all the low level detail. e.g. `Microsoft.Compute` is the resource provider for VMs and Availability Sets.

### Tags

Key-value pairs. Can be applied to resource groups as well as resources. e.g. assign `department : engineering` OR `contact : james@abc.com`. Useful on large subscriptions especially for billing purposes. Possible to search for resources by tags. Policies can be applied to enforce tagging. 

### Enforcing Policies

Policy is about governing the resources in an Azure Subscription. When resources are created or updated, they are compliant with organisational policy e.g. all resouces must be created in UK South. 

There are lots of built in policies: Policy -> Authoring -> Definitions. Strange JSON to define the policy (which can also be custom authored). Policies can take paramters

* Audit policies - check resources for invalid states and report
* Enforce policies - ensure resources cannot be created / updated unless they meet the required policy

Need to "assign" a policy for it to have an effect. Can be set at a subscription OR resource group level (or "Management Group" level - Management Groups are used to group subscriptions).

Policies apply despite the user. To restrict users, use RBAC. 

### Managing Access and Locks

Each resource has an "IAM" blade to assign access. Access permissions flow down from subscriptions to resource groups and then to resources. Access is assigned using "Roles" which have a set of "Permissions" which are grouped by Resource Provider and define Read, Write, Delete, Other Actions on individual objects.

Locks prevent accidents. Useful for automated deployments. Locks are of type Read-only (no updates) or Delete. In order to e.g. delete a resource group that has a Delete lock on it, the Lock first needs to be deleted (only "owners" have permission to do this).

### Using Automation and Scripts

Each resource has a further blade common across all: Export template (was Automation script). This displays the ARM template which can be used to recreate the resource. The template automatically parameterises certain attributes e.g. name, but anything can be parameterised e.g. location. Values can use operation e.g. `concat`. A `dependsOn` section for a resource shows dependencies. Script files are also provided to deploy the template via a script. 

Note: The generated parameters file uses strange names e.g. `sites_amarula_name` containing the original VALUE instead of e.g. `site_name`. Best to update. 

### Using Azure Resource Explorer

https://resources.azure.com

### Creating Resource Groups

Use VS to create a new project of type "Azure Resource Group". Then select a template e.g. Blank Template OR Web app; The collection of files generated mimic the template exported for a resource from the portal. Various things are included out of the box. Remove things not required by deleting in the explorer, add extra things by using the wizard.

The project can be checked into source control and deployed automatically via Azure Devops. 

For a web app, configuration settings would need to be specified in the resource templates. However, we need to avoid checking these into source control and store them in Azure Key Vault instead.

### Storing secrets in Azure Key Vault

When creating a key vault, by default only the user creating the key vault is given access via an "Access Policy". Applications "service principals" can be added here. Under "Advanced access policies", tick the box to allow ARM to access the key vault. ARM can then access the key vault to grab a secret at resource deployment time (rather than directly putting the secret into the template).

Alternatively, instead of the ARM template populating a config setting on the app service and the app service reading from config, the application itself could be given access to the key vault and read the secret directly from there.

### Using Secrets in Templates

1. In the ARM template, add a new parameter: `"secretValue": {"type": "securestring"}`
2. Again in the ARM template, update the value of the application setting to use the parameter e.g. `[parameters('secretValue')]`
3. In the parameters.json, add a new section to set a reference to the key vault and secret containing the actual value:

```
"secretValue": { 
    "reference": { 
        "keyVault": { 
            "id": "/long/resource/string/from/properties/pane"
        }
        "secretName": "Secret"
    }
}
```

## Cloud Microservices

### Using HttpClient to call a Web API

In .NET Core 2.1 and above the `HttpClientFactory` was introduced (to solve issues with misuse of `HttpClient`. The factory can be registered with the DI container on startup for different endpoints, and then injected into classes as required.

```
// define a "named" client withih Startup.ConfigureServices()
services.AddHttpClient("pricing", client => {
    client.BaseAddress = new Uri(Configuration["PricingApi"]);
});

// within the controller
private HttpClient _client;
public HomeController(IHttpClientFactory factory)
{
    _client = factory.CreateClient("pricing");
}

public async Task<IActionResult> Index()
{
    var response = await _client.GetAsync("/api/values");
    var content = await response.Content.ReadAsStringAsync();
    var model = JsonConvert.DeserializeObject<string[]>(content);
    return View(model);
}
```

### Making HttpClient More Resilient

Possible to use a "typed" version rather than a "named" version. See https://www.c-sharpcorner.com/article/create-a-typed-httpclient-with-httpclientfactory-in-asp-net-core/

Polly is a useful library which can add e.g. circuit breaker patterns to provide more resiliency. The NuGet package `Microsoft.Extensions.Http.Polly` provides extensions that work with the `HttpClientFactory` to easily provide transient fault handling.

```
// define a "named" client withih Startup.ConfigureServices()
services.AddHttpClient("pricing", client => {
    client.BaseAddress = new Uri(Configuration["PricingApi"]);
})
// need to worry about network blips with microservices
.AddTransientHttpErrorPolicy(builder => {
    builder.RetryAsync(retryCount: 3);
});
```

### Understanding Container Orchestration

Containers and a container orchestration can make a microservices based system easy to create, deploy and operate. Popular orchestrators include Docker Compose and Kubernetes. Either of these can be used in Azure. Docker Compose is a little easier and simpler to use. 

1. Right click on project and select "Container Orchestrator Support". This will add a DockerFile to the project, but will additionally a new project will be added called `docker-compose`
2. Repeat this for all projects. 

The new `docker-compose` project will be selected as the Startup Project. 

### Taking Advantage of Container Networking

Orchestrators allow you to configure the networking between containers. Without further configuration, Docker Compose will create a default network with hostnames set to the name of the container.

List ports which containers are using using `ps`. `0.0.0.0:44311->443/tcp` indicates that 443 inside the host is mapped to 44311 outside the host. 

### Microservices in Azure

* VMs with Kubernetes etc installed
* Azure Kubernetes Service - platform for creating clusters where you can manage, deploy and operate containers
* App Services for containers - not as flexible and configurable as Kubernets, but straightforward and can use Docker Compose configuration
* Microsoft Service Fabric - runtime technology allowing distribution of microservices across nodes in a cluster; ALSO a programming model with its own SDK; ALSO understands how to run containers
* Azure Container instances

### Creating an Azure Container Registry

* Private registery which is fast since geographically close to App Service
* Container registeries > Add > Disable Admin User > Standard (determines storage space, replication etc = 100GB)
    * Check login server under "Access Keys"

### Pushing images to Azure Container Registry

Want to be able to `docker push` our own images to the an Azure Container Registry we have created.

* Images need to be prefixed with the login server name
* Instead of "tagging" images to get the correct name, Docker Compose can be configured to build the image with the correct name
* Update the `image` name inside the Docker Compose file and build in release mode
* `az login` to login to Azure
* `az acr login --name amarula-registry` to login to the Azure Container Registry
* `docker push amarua-registry.azurecr.io/amarula-pricing-api`

### Orchestrating

* Enable the admin user on the ACR. Currently, a linux based app service needs a username and password to authenticate and pull images from the ACR (will probably be resolved when Managed Service Identities are available for Linux based app services)
* Create a new app service, choose to publish a Docker Image, select Docker Compose, select Azure Container Registry (this will add Application Settings to the Web App to point to the ACR along with a username and password)
* Add `depends_on` information to the Docker Compose to define any dependencies e.g. `depends_on - "amarula-pricing-api"`
* Add `ports` - in App Services only one container can be bound to the public IP (no such restriction with Kubernetes) - by default App Services will check containers to see which one exposes port 80 or 8080 to the host e.g. `ports: - "80:80"`
* Upload the Docker Compose YAML file (be aware that not all features are supported by App Services)

### Troubleshooting Web Apps for Containers

* Turn on App Service Logging, use the live Log Stream, update configuration under Container Settings

## Cloud Identity

* Azure AD








