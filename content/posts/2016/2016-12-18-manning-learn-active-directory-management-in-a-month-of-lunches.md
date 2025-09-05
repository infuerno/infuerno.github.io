---
layout: post
title: "Manning: Learn Active Directory Management in a Month of Lunches"
---
## Chapter One: Before you begin

Active Directory (AD) provides a centralized service that links all of those machines and enables a user to log on and access any of them provided they have been granted permission to do so. 

Active Directory is part of the class of products known as *Directory Services*. Other products in this category include Novell’s eDirectory and Red Hat’s Directory Server. Some applications, such as Lotus (now IBM) Domino, have their own built-in Directory Service. 

### Authentication

* Logging on to the domain, not an individual computer.
* Active Directory uses the Kerberos protocol for authentication.
* Time synchronization within Active Directory is important because the time stamp is used during the authentication process. If a PC’s time is more than five minutes different from the domain controller, the authentication attempt will be rejected.

### Authorisation

When you log on a token is created on your local machine containing group memberships, privileges and rights. This token is presented to resources you are trying to access. If you attempt to access a resource on a remote machine, a local access token is created on that machine

### Definitions

:Forest
The whole Active Directory. Can contain one or more domains arranged in trees. The forest is named after the first domain created (the root domain). All domains in a forest share a common Configuration container and a common schema. Most organisations have a single forest.

:Domain
Container for users, computers, groups etc. Has a FQ DNS name as its unique identifier. Domains can be arranged in hierarchies. Most organisations only require a single domain.

:Organisational Unit (OU)
A container within a domain. Used to control the delegation of admin privileges and the application of group policy. 

:Containers
Other containers created with a domain include:
* Built-in - stores a number of default groups
* Users - stores other default groups e.g. Domain Admins, Enterprise Admins, Schema Admins, default location for new user accounts
* Computers - default location for new computer acccounts
* Group policy CANT be applied to a container
* Child OUs CANT be created in a container

## Chapter Two: Creating user accounts

### Users

Active Directory Administrative Center (ADAC) can be used to create user accounts. It calls PowerShell cmdlets under the hood.
Active Directory Users and Computers (ADUC) is older that ADAC and serves a similar purpose. 
PowerShell module ActiveDirectory with elevated privileges can be used: `Import-Module ActiveDirectory`

:samAccountName
Mandatory for creating a new users, must be unique across the forest, used to create the UPN (User Principal Name - looks like an email and can be used for logging in instead of a login ID)

:Name
Also mandatory. Must be unique across the OU or container

:Password
Not mandatory when using ADAC or PowerShell, but the user account won't be enabled

:Container
Will default to the Users container if not specified

:Protect from Accidental Deletion (PAD) setting
Denies permission to delete the object to the Everyone group. Advised to be used where required.

```
$SecurePassword = Read-Host "Password" -AsSecureString
New-ADUser -Name "Clive Green" -SamAccountName clive.green `
-UserPrincipalName "clive.green@lab.local" -AccountPassword $SecurePassword -Path"cn=Users,dc=Lab,dc=local" ` -Enabled:$True
```

### User creation from a template

In reality, creating users requires adding more information e.g. Group Membership, Home-drive paths, Logon script, Manager, Telephone numbers. An existing user account can be used as a "template" OR an account can be created to be used as a template. ADAC can't be used to create an account from a template, so ADUC should be used by right clicking on an existing user and selecting "Copy".

PowerShell is also possible using `New-ADUser` with the `-Instance` parameter set to a user object (using `Get-ADUser`). The `-Properties` parameter needs a list of properties to be copied e.g. memberof, office. However, group memberships or other multivalue attributes cannot be copied, so this method may not be advised.

### User bulk creation

Use a .csv file to hold data and a script to call `New-ADUser` e.g. `Import-Csv names.csv | % { New-ADUser ...}`

### Managed Service Accounts

Introduced in Windows 2008 R2, used to run services such as SQL, IIS, Express. 

* PowerShell is recommended (ADAC doesn't have this, ADUC doesn't implement properly).
* Windows 2012 requires a Microsoft Key Distribution Service root (use `Add-KdsRootKey -EffectiveImmediately`)
* Default approach is to create a managed service group which can be used on multiple machines e.g. `New-ADServiceAccount -Name SvcAccount -DNSHostName SvcAccount@domain.local -Enabled $True`
* Alternatively, for a single machine use: `New-ADServiceAccount -Name SvcAccount -RestrictToSingleComputer -Enabled $True`

## Chapter Three: Managing user accounts

### Update

The Attribute Editor can be enabled in ADUC from the View menu.
Attributes can be single value (e.g. homePhone) or multi-value (e.g. otherHomePhone).
The cmdlet `Set-ADUser` can be used to update attributes. 
Use the `-Identity` parameter to specify the user to modify. Use with either the samAccountName value or distinguished name. 
Update single value attributes by specifying the value.
Update multi-value attributes using one of `-Remove`, `-Add`, `-Replace`, `-Clear`
`Set-ADUser` can be combined with `Get-ADUser` to copy properties from one account to another:

```
$Source = Get-ADUser -Identity bgreen -Properties OfficePhone, otherTelephone
Set-ADUser -Identity bgreen -OfficePhone $($Source.OfficePhone) -Replace @{otherTelephone = $($Source.otherTelephone)}
```

Accounts can be disabled or deleted (removed). Removed accounts are added to the recycled bin OR tombstoned (archived and fully deleted at a later date).

## Chapter Four: Managing groups
