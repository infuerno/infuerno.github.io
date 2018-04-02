---
layout: post
title: "Martin: Agile Principles, Patterns, and Practices in C#"
---
# Section I: Agile Development

## Chapter 1. Agile Practices

>Many of us have lived through the nightmare of a project with no practices to guide it. The lack of effective practices leads to unpredictability, repeated error, and wasted effort. Customers are disappointed by slipping schedules, growing budgets, and poor quality. Developers are disheartened by working ever-longer hours to produce ever-poorer software.

### Agile Manifesto

* Individuals and Interactions over Processes and Tools - people and teams are important
* Working Software over Comprehensive Documentation - documentation is important, human readable documents that describe the system and the rationale for decisions is important. Maintain a short rationale and structure document, BUT keep it to short salient points, no more than 1 to 2 dozen pages. Transfer knowledge by working closely with people using the minimal documentation for the rationale and the code for the actual information
* Customer Collaboration over Contract Negotiation
* Responding to Change over Following a Plan

### Principles
* Satisfy the customer through early and continuous delivery of valuable software
* Welcome changing requirements, even late in development
* Deliver working software frequently, from a couple of weeks to a couple of months
* Business people and developers must work together *daily*
* Build projects around motivated individuals - trust them to get the job done
* The most efficient and effective method of conveying information to and within a development team is *face-to-face* conversation
* Working software is the primary measure of progress - how much software meets the customer's need (not what phase etc)
* Agile processes promote sustainable development - a marathon, not a 100m sprint - work at a rate to maintain high-quality standards for the duration of the project
* Continuous attention to technical excellence and good design enhances agility - commitment to producing only the highest quality code
* Simplicity "the art of maximizing the amount of work not done" is essential - don't anticipate tomorrow's problems
* The best architectures, requirements, and designs emerge from self-organizing teams - no team member is solely responsible for the architecture, the requirements or the tests
* Regular reflection on how to become more effective

## Chapter 2. Overview of Extreme Programming

* The "customer" is the person or group that defines or prioritises the features - they should be close, work in the same room or within 100 feet
* A "user story" represents an ongoing discussion about a requirement
* The "iteration plan" is a short plan for the next e.g. 2 weeks of users stories selected by the customer totally no more than the budget set by the developers - it is not change during this time
* The "release plan" for the next six iterations / three months - a priorised collection of users stories - NOT case in stone - the business change change the release content at any time
* "Acceptance tests" are the details for the user stories written either just before or during development. Written in a scripting language by BAs and testers i.e. automated. These tests become the true requirements document for the project. Every detail about every feature is described. Once it passes it is never allowed to fail again - they are run several times a day - if a test fails, it is not allowed to go unworking for longer than a few hours.
* "Pair programming" - two people coding intensely together, pairs swapped every few hours, with everyone on the team working together at least once during the iteration
* "TDD" results in a complete body of unit tests, makes the code more modular (has to be written so it can be tested)

## Chapter 3. Planning

>Many developers find it helpful to use "perfect programming hours" as their task points

## Chapter 4. Testing

Unit tests drive the architecture at a class and module level, exposing areas which ought to be decoupled. The need to isolate the module under test forces us to decouple in ways that are beneficial to the structure of the whole program.

Acceptance tests are black box tests (where unit tests are white box tests), written by people who don't know the internals of the system e.g. custoemr, BAs, testers, QAs. Writing acceptance tests has a profound effect on the architecture. The system needs to be decoupled at the high architecture level e.g. UI decoupled from business rules.

## Chapter 5. Refactoring

A module has three functions:

1. The function it performs while executing - reason for existence
2. To afford change - all modules will change, responsibility of the developers to ensure future changes will be simple to make
3. To communicate to its readers - readily understandable - a module which isn't readable is broken and needs to be fixed.

>It takes something more than just principles and patterns to make a module that is easy to read and change. It takes attention. It takes discipline. It takes a passion for creating beauty.

## Chapter 6. A Programming Episode

# Section II. Agile Design


