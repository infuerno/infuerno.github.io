---
layout: post
title: "Pluralsight: Architecting Azure Solutions (70-534): Infrastructure and Networking"
---
## Azure Data Centres
https://azurespeedtest.azurewebsites.net - speed test to show closest data centre
https://azure.microsoft.com/en-gb/regions/services/ - shows the services available in each data centre - some services not available - check first

### Affinity groups
Resources placed in the same affinity group are placed in proximity to each other in an Azure data centre. This minimises latency.
Modular blade server either in _compute_ or _storage_ role. There are approximately 40 to 50 blade servers in each rack. Each rack has a special switch on top which connects to aggregation switches to ensure connectivity between each rack. Some racks have a fabric controller which provisions new VMs, heals VMs etc. Racks are organised into 20 rack groups called a stamp or a cluster. All hardware in a stamp uses the same processor generation. All resources in the same affinity group use the same stamp.

### Further reading
Mastering Microsoft Azure Infrastructure Services by John Savill

## Regions

A region (e.g. Europe North) will have multiple data centres in close proximity.
Some regions can only be used by customers with a billing address in those regions (e.g. Australian regions)

### Regional datacentres

Datacentres are divided into clusters of 20 racks. Each rack functions as a fault domain.  *Availability sets*  keep virtual machines available during downtime. This needs to be designed by the customer. Availability sets need to be configured for each tier of the application to qualify for the 99.95% Azure SLA.

## Azure Active Directory

Reference: Pluralsight: Extending Active Directory to the Cloud by Russell Smith

### AD DS on IaaS

Simplest way to have active directory in Azure. Basically Active Directory on a VM running as a domain controller in the cloud.
* Create an Azure network
* Configure a Site to Azure VPN
* Configure a static IP address on the Azure network
* Deploy a Windows Server VM
* Promote to Domain Controller
When does this way, the cloud just becomes another AD site. BUT this is less necessary with Azure AD.

### Azure AD

Azure AD is a Directory server for Azure services and applications, but running as a service rather than a VM.

Azure AD is available in 3 editions:
* Free: comes with Office 365, Microsoft Intune, not used with Azure
* Basic: group based management, self service password reset, AD application proxy, access to Azure Console
* Premium: multi-factor authentication, Microsoft Identity Manager use rights, passord reset write back, access to Azure Console, Health reports

Supports multiple directories, and a single directory can support multiple domains (actually "domain names", rather than domains, which can be associated with that directory)

### Directory Synchronisation

Allows you to synchronise users and groups from on premise AD to Azure AD. 
Done using "Azure AD Connect". Previous to July 2015, DirSync, Azure AD Sync.
Install Azure AD Connect on a domain controller. Enter credentials for Azure (an account which only has access to one directory, if there are multiple) and credentials for the local domain (no doubt a domain admin is required).

## Azure AD Domain Services (October 2015 Public Preview)

Azure hosted AD for use with applications and VMs. Replacement for an Azure hosted DC VM. Can function as a full DNS server. Works with Azure AD Connect.
So you no longer need to have a DC in Azure - you can use Azure AD DS as a service.
1. In the Directory - click Enable Domain Services for this directory - need to select an existing Virtual Network to project this into, click save
2. An IP is assigned as a DNS server - represents the domain controller
3. Go to the virtual network and enter the DNS server IP as the DNS server
4. Create a VM, ensure it is created as part of the same Virtual Network used above
5. Log on as the local administrator (still a standalone virtual machine at this point in time)
6. Check ipconfig / all to ensure the DNS server is correct
7. PC -> Properties -> Advanced System Settings -> Computer Name -> Change -> Enter domain name e.g. ps.microsofton.com -> enter account with domain admin privileges

## Static IP Addresses

### References

Pluralsight: Connecting PowerShell to your Azure Subscription by Russell Smith
Pluralsight: Applied Windows Azure by Vishwas Lele
Pluralsight: Microsoft Azure for Enterprises: What and Why by David Chappell
Pluralsight: Implementing Cloud Service for Azure Infrastructure (70-533) by Razi Rais

### Internal IP address

`$Vm = Get-AzureVm -ServiceName vm1 -Name vm1`
`SetAzureStaticVNetIP -Vm $Vm -IPAddress 10.0.0.10 | Update-AzureVm`

Triggering an update of the VM reboots it

### Reserved Public IP Address

Can only do via PowerShell, only 20 per subscription, assigned to the service NOT the individual VM, costs money

`New-AzureReservedIP -ReservedIPName res-ip-001 -Location "Central-US"`

### Instance Level Public IP Address

A public IP address which can be assigned to a VM or role instance, formerly known as a PIP (Public IP), 5 per subscription, cannot reserve it, just get it when assigned to the VM, doen't replace the Virtual IP assigned to a service (?). VM will always have that public IP address assigned to it. Again, costs money.

`Set-AzurePublicIP`

## Azure ACLs (old way)

Allows you to block or allow IPv4 address ranges to a particular endpoint. 50 rules allowed per endpoint. Only inbound.

`Set-AzureAclConfig -AddRule`

## Network Security Groups (new way)

Contain both inbound and outbound rules to allow or deny traffic based on:

* Traffic direction
* Protocol
* Source address and port
* Destination address and port

Traffic must match an Allow rule for it to be permitted. (Different from ACLs.)
Not supported on the same VM instance with Azure ACLs.

Source and destination prefix:
* IP Address e.g. 192.168.0.1
* Range e.g. 192.168.15.0/24
* Default tag e.g. VIRTUAL_NETWORK, AZURE_LOADBALANCER, INTERNET

### Default rules

NSGs contain *default* rules which cannot be deleted, but have the lowest possible priority. There are 3 default inbound rules and 3 default outbound rules.

### Associations

* NSG to VM
* NSG to NIC on a VM (if multiple NICs on a VM)
* NSG to Subnet - applies to all VMs on an Azure Subnet
* Can only apply one NSG to a VM, to a NIC or to a Subnet. If there are NSGs applied to a VM, its NIC and the Subnet it is in, then all three NSGs will come into play in that order
* Conversely, the same NSG can be applied to multiple resources

## VMs

### IaaS VM Limits

* Maximum of 50 Azure VMs per "cloud service"
* Maximum of 150 input endpoints per "cloud service"
* 100 VMs per availability set

### Key VM IaaS questions

* CPU / RAM / NIC / Temp disk / Data disk requirements
* Cache size
* Max data disk IOPS/Bandwidth

Basic Tier: A-Series - good for POCs
Standard Tier: A-Series - last 4 (A8 to A11) have better hardware (though not SSDs)
Standard Tier: D-Series - Faster processors, higher memory-to-core ratio and an SSD temp disk, OS still on regular HDD
Standard Tier: Dv2-Series - 35% faster processor than D-Series
Standard Tier: DS-Series - High perforance, low latency, SSDs for VM disk

