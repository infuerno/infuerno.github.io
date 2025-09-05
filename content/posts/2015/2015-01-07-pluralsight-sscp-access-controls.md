---
layout: post
title: "Pluralsight - SSCP Access Controls"
---
## Logical Access Controls

### Access Control Subjects and Objects

Access Control *Subjects* are anything that will be accessing a resource on a network. This is generally a user, but can also be apps, web services, computers (e.g. laptops on a corporate network) and networks (which can be both subjects and objects) etc. 

Access Control *Objects* are the resources accessed by those subjects. For example files, databases, apps (which need controlled access), web services, networks, facilities.

### Identification, Authentication and Authorization

Identification
: saying who you are.

Authentication
: identification with proof.

Authorization
: verifying you have permission to do something (typically after authentification).

### Access Control Systems

These systems tie these three things together. Examples include:
* Airports are a type of access control system to only allow the right people onto flights. 
* Security clearance levels and the system which assigns levels
* Car licence plates, police officers to check
* Credit cards, signature checking if you need to sign

### Access Control System Properties

Password complexity and changes required
Easily forged subjects aren't allowed - e.g. IP addresses (though much easier to forge now), currency
Object owners determine object permissions - often when you create a file, you will have full permissions to it
Secure by default - all object access is denied by default
User IDs cannot be transferred
Subject and object access can be audited - nowadays most system allow you to enable audit logging