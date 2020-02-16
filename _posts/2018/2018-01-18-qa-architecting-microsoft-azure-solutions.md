---
layout: post
title: "QA: Architecting Microsoft Azure Solutions"
---
## Module 1: Application Architecture Patterns in Azure
This module introduces and reviews common Azure patterns and architectures as prescribed by the Microsoft Patterns & Practices team. Each pattern is grouped into performance, resiliency, and scalability categories and described in the context of similar patterns within the category.

### Lessons

* Pattern Resources
*  Performance Patterns
* Resiliency Patterns
* Scalability Patterns
* Data Patterns

## Module 2: Deploying Resources with Azure Resource Manager
This module establishes a basic understanding of Azure Resource Manager and the core concepts of deployments, resources, templates, resource groups, and tags. The module will dive deeply into the automated deployment of resources using ARM templates.

### Lessons

* ARM Templates
* Role-Based Access Control (RBAC)
* Resource Policies
* Security
* Building Blocks

### Lab : Getting Started with Azure Resource Manager* 

* Create Resource Groups
* Deploy an Empty Template
* Deploy a Simple Template
* Cleanup Subscription

## Module 3: Building Azure IaaS-Based Server Applications
This module identifies workloads that are ideally deployed using Infrastructure-as-a-Service services in Azure. The module focuses on the VM Scale Sets and Virtual Machine services in Azure and how to best deploy workloads to these services using best practices and features such as Availability Sets.

### Lessons

* High Availability
* Templated Infrastructure
* Domain-Connected Machines

### Lab : Deploying Infrastructure Workloads to Azure* 

* Deploy a Virtual Machine using PowerShell DSC
* Deploy a Virtual Machine Scale Set using PowerShell DSC
* Cleanup Subscription

## Module 4: Creating Managed Server Applications in Azure
This module describes services that use infrastructure but manage the infrastructure on behalf of the user instead of obfuscating the infrastructure resources. The module focuses on infrastructure-backed PaaS options such as Azure Service Fabric, Container Service, and App Service Environments. The module will explore how to deploy custom workloads to these services such as an HPC batch processing task.

### Lessons

* Infrastructure-Backed Platform-as-a-Service (PaaS)
* High-Performance Compute (HPC)
* Migration

### Lab : Deploying Managed Server Workloads to Azure* 

* Create Azure Container Service Cluster
* Deploy Docker Image
* Cleanup Subscription

## Module 5: Authoring Serverless Applications in Azure
This module describes how solutions can leverage serverless application hosting services in Azure to host web applications, REST APIs, integration workflows and HPC workloads without the requirement to manage specific server resources. The module focuses on App Services-related components such as Web Apps, API Apps, Mobile Apps, Logic Apps, and Functions.

### Lessons

* Azure Web App
* Azure Functions
* Integration
* High Performance

### Lab : Deploying Serverless Workloads to Azure* 

* Create Web App
* Deploy Web App Code
* Deploy Function App and Code
* Cleanup Subscription

## Module 6: Backing Azure Solutions with Azure Storage
This module describes how many Azure services use the Azure Storage service as a backing store for other application solution in Azure. The module dives into critical considerations when using Azure Storage as a supplemental service for an all-up Azure solution.

### Lessons

* Pricing
* Blob Storage
* Files
* StorSimple

### Lab : Deploying Azure Storage to Support Other Workloads in Azure* 

* Create Required Resources for a Virtual Machine
* Create a VM With a Storage Account
* Create a VM With a Managed Disk
* Cleanup Subscription

## Module 7: Comparing Database Options in Azure
This module compares the various relational and non-relational data storage options available in Azure. Options are explored as groups such as relational databases (Azure SQL Database, MySQL, and PostgreSQL on Azure), non-relational (Azure Cosmos DB, Storage Tables), streaming (Stream Analytics) and storage (Data Factory, Data Warehouse, Data Lake).

### Lessons

* Relational
* NoSQL Services
* Azure Cosmos DB
* Data Storage
* Data Analysis

### Lab : Deploying Database Instances in Azure* 

* Deploy a CosmosDB Database Instance
* Validate the REST API
* Cleanup Subscription

## Module 8: Networking Azure Application Components
This module describes the various networking and connectivity options available for solutions deployed on Azure. The module explores connectivity options ranging from ad-hoc connections to long-term hybrid connectivity scenarios. The module also discusses some of the performance and security concerns related to balancing workloads across multiple compute instances, connecting on-premise infrastructure to the cloud and creating gateways for on-premise data.

### Lessons

* VNETs
* Load Balancing
* External Connectivity
* Hybrid Connectivity
* Lab : Deploying Network Components for Use in Azure Solutions* 

* Create an ARM Template for a Linux VM
* Duplicate the VM Resources
* Create a Load Balancer Resource
* Cleanup Subscription

## Module 9: Managing Security and Identity for Azure Solutions
This module discusses both security and identity within the context of Azure. For security, this module reviews the various options for monitoring security, the options available for securing data and the options for securing application secrets. For identity, this module focuses specifically on Azure Active Directory (Azure AD) and the various features available such as Multi-Factor Authentication (MFA), Managed Service Identity, Azure AD Connect, ADFS and Azure AD B2B/B2C.

### Lessons

* Security Monitoring
* Data Security
* Application Security Azure Active Directory (Azure AD)
* Hybrid Identity
* Azure AD Application Integration

### Lab : Deploying Services to Secure Secrets in Azure

* Deploy Key Vault using ARM Template
* Deploy Virtual Machine using Key Vault Secret
* Cleanup Subscription

## Module 10: Integrating SaaS Services Available on the Azure Platform
This module introduces multiple SaaS services available in Azure that are available for integration into existing Azure solutions. These services include Cognitive Services, Bot Service, Machine Learning and Media Services.

### Lessons

* Cognitive Services
* Bot Services
* Machine Learning
* Media Services

### Lab : Deploying Service Instances as Components of Overall Azure Solutions

* Deploy Function App and Cognitive Service using ARM Template
* Cleanup Subscription

## Module 11: Integrating Azure Solution Components using Messaging Services
This module describes and compares the integration and messaging services available for solutions hosted on the Azure platform. Messaging services described include Azure Storage Queues, Service Bus Queues, Service Bus Relay, IoT Hubs, Event Hubs, and Notification Hubs. Integration services include Azure Functions and Logic Apps.

### Lessons

* Event Messaging
* Integration
* IoT

### Lab : Deploying Messaging Components to Facilitate Communication Between Azure Resources

* Deploy Service Bus Namespace
* Deploy Logic App
* Cleanup Subscription

## Module 12: Monitoring and Automating Azure Solutions
This module covers the monitoring and automation solutions available after an Azure solution has been architected, designed and possibly deployed. The module reviews services that are used to monitor individual applications, the Azure platform, and networked components. This module also covers automation and backup options to enable business-continuity scenarios for solutions hosted in Azure.

### Lessons

* Application Monitoring
* Platform Monitoring
* Network Monitoring
* Alerting
* Backup
* Azure Automation
* Config Management
* Auto-Scale

### Lab : Deploying Configuration Management Solutions to Azure* 

* Deploy a Chef Management Server using ARM
* Configure Management Server
* Deploy a VM Scale Set using Chef-Configured VMs
* Cleanup Subscription

## Additional Reading

To help you prepare for this class, review the following resources:

https://azure.microsoft.com/en-us/documentation/
https://docs.microsoft.com/en-us/azure/architecture/patterns/
https://docs.microsoft.com/en-us/azure/architecture/