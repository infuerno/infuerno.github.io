---
layout: post
title: "Fowler - Patterns of Enterprise Application Architecture"
---
## 

>This is a book on enterprise application design. Enterprise applications are about the display, manipulation and storage of large amounts of often complex data and the support or automation of often complex data and the support or automation of business processes with that data. Examples include reservation systems, financial systems, supply chain systems, and many others that run modern business.

### Architecture

* Disagreement over exactly what it means
* Highest level breakdown of a system into its parts
* Decisions that are hard to change
* Often multiple architectures within a system and what is architecturally significant changes over time
* Subjective - shared understanding of the expert developers
* The decisions that you wish to get right early on
* The important stuff

### Enterprise Applications

* Often have complex data, illogical business rules
* Include: payroll, shipping, insurance, foreign exchange
* Don't include: fuel injection system, word processors, operating systems, telephone switches
* Usually involve persistent data, a lot of it, requiring concurrent access
* Often have to integrate with other enterprise applications

### Kinds of Enterprise Application

* B2C online retailer - high volume of users, needs to be scalable. But fairly straightforward domain logic - order capture, pricing calculation, shipping notification, simple database
* Leasing agreement automation - fewer users but more complicated business logic - monthly bills, early returns, late payments, many arbirary rules. Consequently the UI is more complex, the database is more complex. 
* Expense tracking system - few users, simple logic and data requirements. Application may grow in the future - need to get the right balance of appropriate architecture for now but allow change in the future. 

### Performance

General advice is to build, measure, then optimise - however some thinking about performance up front is inevitable - e.g. sensible to minimise remote calls. Can be measured in:
* Reponse time - time user has to wait to get a response
* Responsiveness - time user has to wait to get see any kind of acknowledgement (e.g. file upload bar is responsive even if response time is the same)
* Latency - time to wait for remote calls
* Throughput - "stuff"/time e.g. copying a file may specify througput in bytes/second - transactions per second is a common measure (tps)
* Load - often number of users
* Efficiency - performance/resources
* 
