---
layout: post
title: "Manning: Azure in a Month of Lunches 2nd Edition"
---
## Resources

VS Code extension which allows you to open your Azure cloud shell within VS Code: Azure Account

## Chapter 1 Before you begin {#2020-05-10}

* [Azure Quickstart templates](https://github.com/Azure/azure-quickstart-templates)
* [Azure CLI](https://github.com/Azure/azure-cli)
* [Azure CLI online](https://shell.azure.com)
* [Azure DevOps utilities](https://github.com/Azure/azure-devops-utils)
* [Learn Azure in a Month of Lunches book resources](https://github.com/fouldsy/azuremol-samples-2nd-ed)
* [Azure Documentation](https://docs.microsoft.com/en-gb/azure)
* [Virtual tour of Microsoft's datacenters](https://azure.microsoft.com/en-gb/global-infrastructure/)

# Part 1 Azure Core Services
## Chapter 2 Creating a virtual machine

* Use Azure cloud shell to store SSH keys for VMs
    - creates a resource group, storage account and fileshare: https://docs.microsoft.com/en-us/azure/cloud-shell/persisting-shell-storage
* `ssh-keygen` to generate a new ssh public private keypair
* `cat .ssh/id_rsa.pub`
* `sudo apt install -y lamp-server^` to install a full LAMP stack

## Chapter 3 Azure Web Apps

>If you want to be really cool and run your web application in containers, there’s also Web Apps for Containers that lets you run native Docker containers for Linux.

>Deployment slots provide a staged environment for your web application. You can push new versions of your app to a deployment slot and get them running using environmental variables or database connections, without impacting the live site. When you’re happy with how things look and feel in a deployment slot, you can switch this version to the live site in an instant. The previously live site then switches in to a deployment slot of its own, providing an archived version; or, if needed, you can flip the app back to production.

>The number of available deployment slots varies based on the tier of web app you select. A larger number of deployment slots enables multiple staged versions to be in use by different developers as they stage and test their own updates.

* App Service includes Web Apps, Mobile Apps, API Apps, and Logic Apps
* The App Service Plan offers 4 main service tiers
    - Free / Shared: No options for deploying different staged versions, routing of traffic or backups
    - Basic: SSL. No backups or scaling
    - Standard: Daily backups, automatic scaling, deployment slots, Traffic Manager - suitable for low demand apps
    - Premium: More frequent backups, instance scaling, more deployment slots - ideal for production workloads
* App Service Environments enable completely isolating web apps, firewalls, VPN connectivity
* Deployment credentials are required to deploy to a web apps
    - User level - deployment access to all applications
    - Application level - deployment access to just that application
* Get a URL for a git repository endpoint to clone and push to for web app deployment: `az webapp deployment source config-local-git`

### Logs

* Application and server logs are available via FTP or live stream
    - App Service > Monitoring > App Service Logs
        - Configure Application logging to the file system
        - Configure Web server logging to the file system, retention 7 days
    - App Service > Monitoring > Log Stream
        - Choose between application OR server logs
    - Access logs via FTP

## Chapter 4 Intro to Azure Storage

### Unmanaged disks

* Storage account with virtual disks (limit)
* Manually move custom disk images to create VMs in different regions

### Managed disks

* No need for storage accounts
* Up to 50,000 disks per subscription
* Can create VMs from a custom image across regions
* Create and use snapshots of disks
* Encryption at rest
* Disks up to 64TiB in size

### Ephemeral OS disks

* A managed disk of sorts, but local to the underlying Azure host and therefore fast
* Data may not persist during VM reboots
* Needs to be big enough for the OS image e.g. DSv3 has 172 GB so is the first in the series big enough for Windows OS (127GB image). Linux images are only 30GB.
* See: https://docs.microsoft.com/en-us/azure/virtual-machines/windows/ephemeral-os-disks

### Temporary disks

Every VM has a temporary disk, designed for scratch space or application caches.

### Data disks

Regular disks which follow the VM round the data centre.

### Azure storage

Four different types of storage:

1. Blob storage - for unstructured data e.g. images and documents
2. Table storage - NoSQL data store using key-value (as does Redis)
3. Queue storage - "Azure Queues"
4. File storage - SMB file share

## Chapter 5 Azure Networking basics

* NICs and Public IP addresses can be created seperately and then "associated"
* NSGs can be created seperately and then associated to one to many subnets 

### SSH agent

* An SSH agent stores your SSH keys and forwards them as needed. Necessary to securely remote from a jump box VM to a web VM without storing the SSH private key on the jump box
* Run the SSH agent within the cloud shell to utilize this:
    - `eval $(ssh-agent)` to start the SSH agent
    - `ssh-add` to add your ssh keys
    - SSH using `-A` e.g. `ssh -A claire@52.169.159.247`

# Part 2 High Availability and Scale
## Chapter 6 Azure Resource Manager

* Resource groups can be used to group by:
    - application i.e. one rg encompassing all resources in an application
    - function e.g. one rg for vnets, subnets and nics; another for VMs and storage
* 4 security roles:
    - Owner - complete control
    - Contributer - complete control EXCEPT security and role assignments
    - Reader
    - User access administrator - security and role assignments
* Also resource specific roles - useful to assign these role per resource group or subscription to grant access to specific types of resources only

### ARM templates

* Parameters: prompted for when running e.g. user credentials, VM name, DNS label
* Variables: can have a default value, can be adjusted with each deployment, useful to extract into one place and then use in various templates, rather than hardcoding everywhere e.g. VM size, vnet name
* Functions: over 50. Includes `length`, `equals`, `or`, `trim`
    - The `copy` function controls the number of instances created. Use `copyIndex()` to get the index of the current iteration.

```
{
    "apiVersion": "2019-04-01",
    "type": "Microsoft.Network/publicIPAddresses",
    "name": "[concat('publicip', copyIndex())]",
    "copy": {
        "count": 2
    }
    "location": "eastus",
    "properties": {
        "publicIPAllocationMethod": "dynamic",
    }
}
```

### Tools to create ARM templates

* Quick start templates: https://github.com/Azure/azure-quickstart-templates
* VS Code with the extension "Azure Resource Manager Tools"
* Visual Studio

## Chapter 7 High availability and redundancy

* Availability zones
    - physically seperate data centers - using seperate power, network and cooling
    - 3 zones are provided (where supported by a region)
    - different zones within a region have staggered update cycles
    - network resources e.g. public IPs, load balances run ACROSS zones
    - zonal services e.g. VMs and load balancers run in a particular zone
    - zone redundant services e.g. storage and SQL have data distributed across zones
    - only available for some services and some regions
    - standard tier (not basic) is required
* Availability sets
    - proven, reliable, available across all regions
    - resources are created across logical groups called _fault domains_ and _update domains_. Azure data centres are logically divided into update domains and fault domains. Azure will allocate VMs into appropriate domains. 
* Fault domains
    - contain hardware which shares common power or networking equipment
    - can specify between 2 and 3 fault domains when creating an availability set
* Update domains
    - logical grouping for maintenance. Fault domains are further divided into update domains.
    - can specify up to 20 update domains. Doesn't make sense to specify any more update domains than the number of VMs in the availability set
    - update and fault domain numbering is zero based
* When creating VMs in an availability set, they are equally distributed across fault and update domains

## Chapter 8 Load-balancing applications
## Chapter 9 Applications that scale
## Chapter 10 Global databases with Cosmos DB
## Chapter 11 Managing network traffic and routing
## Chapter 12 Monitoring and troubleshooting

# Part 3 Secure by Default
## Chapter 13 Backup, recovery, and replication
## Chapter 14 Data encryption
## Chapter 15 Securing information with Azure Key Vault
## Chapter 16 Azure Security Center and updates

# Part 4 The Cool Stuff
## Chapter 17 Machine learning and artificial intelligence
## Chapter 18 Azure Automation
## Chapter 19 Azure containers
## Chapter 20 Azure and the Internet of Things
## Chapter 21 Serverless computing

# Appendix

```
az network nsg create \
--resource-group rg-azuremol-ch5 \
--name nsg-azuremol-ch5-remote

az network nsg rule create \
--resource-group rg-azuremol-ch5 \
--nsg-name nsg-azuremol-ch5-remote \
--name allowssh \
--protocol tcp \
--priority 100 \
--destination-port-range 22 \
--access allow

az network vnet subnet create \
--resource-group rg-azuremol-ch5 \
--vnet-name vnet-azuremol-ch5 \
--name snet-remote \
--address-prefix 10.1.2.0/24 \
--network-security-group nsg-azuremol-ch5-remote

az network public-ip create \
--resource-group rg-azuremol-ch5 \
--name pip-azuremol-ch5-remote

az vm create \
--resource-group rg-azuremol-ch5 \
--name vm-azuremol-ch5-web \
--nics nic-01-ch5 \
--image UbuntuLTS \
--size Standard_B1ms \
--admin-username claire \
--generate-ssh-keys

az vm create \
--resource-group rg-azuremol-ch5 \
--name vm-azuremol-ch5-remote \
--vnet-name vnet-azuremol-ch5 \
--subnet snet-remote \
--nsg nsg-azuremol-ch5-remote \
--public-ip-address pip-azuremol-ch5-remote \
--image UbuntuLTS \
--size Standard_B1ms \
--admin-username claire \
--generate-ssh-keys
```




