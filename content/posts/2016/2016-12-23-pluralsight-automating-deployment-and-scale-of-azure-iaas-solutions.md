---
layout: post
title: "Pluralsight: Automating Deployment and Scale of Azure IaaS Solutions"
---
## The Need for Automation

Create templates and publish in service catalogs for someone else to deploy

* `Get-Process | Sort-Object`
* `Get-Process | Where-Object processname -eq "notepad" | Stop-Process`
* `Invoke-Command -ComputerName fileserver -ScriptBlock { Get-EventLog -LogName Security -Newest 10 }`

## Using PowerShell with Azure

PowerShell uses "least cognitive distance" naming convention, with all commands in the form Verb-Noun format

* `Get-Command -Module AzureRM.RedisCache`
* `Get-Command -Verb Get`
* `Get-Command -Noun Package` - useful for nuget management (or even `Get-Command -Module PackageManagement`)
* `Get-Module` - shows the PowerShell modules currently loaded
* `Get-Module -ListAvailable` - available on the system (not necessarily loaded)
* `Get-Module -ListAvailable | Where name -like 'microsoft*' | % { Get-Command -Module $_ }`

The `AzureRM` module is really just a wrapper around all the `AzureRM.*` modules.\

Modules are loaded dynamically as and when commands are used.
