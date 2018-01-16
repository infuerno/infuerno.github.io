---
layout: post
category: 
tags: []
---

## Chapter 1: Introduction

* Primary focus is on architecture as a service to stakeholders
* Views are important to represent an architecture's complexity in a way stakeholders can understand
* Architecture must also define how a system provides required quality properties (scalability, resistence) as well as the structure by using perspectives

### Stakeholders
Stakeholders are the people affected by a system. These are not just the various different end users, but also managers with reporting requirements, IT support staff etc.
Stakeholders need to be clearly identified.

### Views
An architectural view is a description of _one aspect_ of a system's architecture. By showing an architecture via a number of distinct views the complexity can be understood, defined and communicated by selecting only certain aspects.
Template views, called architectural viewpoints, help to develop the views required by a specific architecture.

### Perspectives
Non-functional requirements = quality properties = cross cutting concerns are also important. Includes performance, security, availability, supportability, scalability etc.
The _architectural perspective_ is analogous to a viewpoint, but addresses quality properties rather than a certain aspect of the structure.

## Chapter 2: Software Architecture Concepts

This chapter defines some of the core concepts:
* software architecture
* architectural elements
* stakeholders
* architectural descriptions

### Software Architecture

Compture system = software + hardware
Architecture = set of fundamental properties of its elements and relationships + principles of design and evolution

#### System elements and relationships

Elements are the architecturally significant pieces that constitute a system (e.g. modules, components, partitions, subsystems).

Static structure = organisation of design time elements:
* software elements e.g. programs, oo classes, database sps
* data elements e.g. classes, db tables, data files
* hardware elements e.g. computers, network

Dynamic structure = organisation of run time elements, how the system works, how the system responds to stimuli. May be expressed by:
* flows of information
* execution of tasks (sequentially or in parallel)
* changes to data

For an example of the difference between a static structure and a dynamic structure, imagine a server / client architecture. In a static structure, there is just one client. In a dynamic structure they may be multiple instances of the client, and also explanations of how the client becomes active or inactive (e.g. user logging in, logging out)

#### Fundamental system properties

Manifested in two different ways:
1. Externally visible behaviour (what the system does) - external interactions form a similar set to dynamic structure considerations
2. Quality properties (how the system does it)

A *candidate architecture* is a particular arrangement of static and dynamic structures which has the potential to exhibit the two types of system properties.

#### Principles of design and evolution

A well structured and maintainable system has a consistent implementation with system wide conventions.
*Principles* are required to guide the system's design and evolution. 

### Architectural Elements

As above, an (architectural) element  is a piece from which systems are built. They should possess:
* Set of responsibilities
* Boundary
* Set of interfaces 

### Stakeholders

Software development is driven by the requirements of the users. This includes:
* End users of the system
* People who build the system
* Testers
* Operators
* People who have to support and repair the system
* People who enhance the system
* People who pay for the system

Some stakeholders are not interested in their role, so part of an architects role is to engage and galvanise all stakeholders.
Engaging with stakeholders, especially in the beginning, is often a process of discovery as well as capture. Many will not yet know what their requirements are.
Stakeholders requirements often conflict and an agreeable compromise has to be found.

### Architectural Descriptions

A set of products which document an architecture in a way its stakeholders can understand. A description must show the essence and the detail at the same time.
The architect writes the AD and is also one of its major users as a memory aid, a basis for analysis, a record of decisions etc.

### Further Reading
Bass, Clements and Kazman - Software Architecture in Practice: <http://www.informit.com/store/software-architecture-in-practice-9780321815736>
Shaw and Garlan - Introduction to Software Architecture: <https://www.cs.cmu.edu/afs/cs/project/vit/ftp/pdf/intro_softarch.pdf>
Fairbanks - Just Enough Software Architecure:
Gorton - Essential Software Architecure: 

Magazine: <http://www.crosstalkonline.org/>

## Chapter 3: Viewpoints and Views

It is not possible to capture the functional features and quality properties in a single comprehensible model understandable to its stakeholders. 
A complex system is more effectively described by a set of interrelated views.

### Architectural Views

An architectural view shows only certain aspects or elements, relevant to a particular concern or the concerns of a particular set of stakeholders.
The following should be considered when deciding what to include in a view:
* View scope - static, runtime? how elements are deployed? how elements intercommunicate?
* Element types - what architectural elements are you trying to show? individual servers? entire network segments?
* Audience - one stakeholder, a broad groups of stakeholders?
* Audience expertise
* Scope of concerns
* Level of detail

Only include information which:
1. Helps explain the architecture to the stakeholders
2. Demonstrates how the architecture satisfies their concerns

### Viewpoints

A viewpoint is a collection of patterns and templates to construct one type of view. It is akin to a class which is the blueprint used to construct an object. An AD based on viewpoints and views will include a number of views conforming to a specific viewpoint.

When developing a view, whether or not you are using  a formally defined viewpoint, be clear the concerns the view is addressing, the types of elements it presents and who the viewpoint is aimed at.

### The Benefits of using Viewpoints and Views
* Seperation of concerns
* Communication with stakeholders
* Management of complexity
* Improved developer focus

### Viewpoint Pitfalls
* Inconsistency - it is largely a manual process to ensure all views are consistent
* Fragmentation - each view is expensive to create and maintain and may be confusing if only showing one aspect, so views may be elimated or combined to reduce overhead and enhance understandability (without going too far the other way)

### Our Viewpoint Catalog


