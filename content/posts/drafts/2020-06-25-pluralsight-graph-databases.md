---
layout: post
title: "Pluralsight: Introduction to Graph Databases, Cypher, Neo4j"
---

## What is a Graph Database?

* Relations are not first class citizens in a relational database
* A graph consists of `nodes` which are connected by directional `relationships` where a node is an entity e.g. customer, person, order; e.g. "Mark follows Joanna" where "Mark" and "Joanna" are `nodes` and "follows" is the `relation`
* Graphs are easily extendable
* Graphs support the human brain
* Graphs are whiteboard friendly
* Graphs remain performant for queries even with millions of nodes
* Graphs are very flexible because often don't use a fixed key map for the nodes
* Nodes and relationships can also contain `properties`
   - `Joanna`, `city='Salt Lake City', 'role='Manager'`
   - `works_for`, `since='2010-01-01'`
   - `Pluralsight`, `rocks='true'`
* Relationships are named and directed between exactly two nodes, a start node and an end node
* Relational database are not very good with highly related data, should consider each application seperately
* Graph databases are good for highly related data, have a schema-less approach - similar to document databases
* Queries are more like patterns and "brain friendly"
* Relational tables have `null`s, but graph database don't have this concept
* Relational databases need to use joins to query multiple tables, increasing query time exponentially, whereas relations are first class citizens of graph database and optimised to query through relations
* Relational database are good for reporting; good for calculations in one table e.g. sum, avergage
* Graph databases are good for retrieving related data
* Document databases encourage all related data to be stored in one entity and data to be duplicated where necessary e.g master data (e.g. product catalogue). Foreign keys and joins are supported, but will result in the same disadvantage as with relational databases

## Introducing Neo4j

* A Graph database
* ACID
* Implemented in Java, can be used in all OSes, but otherwise in most scenarios no Java skills required
* Enterprise features available supporting for big databases, larger cache, highly available cluster
* Comfortable with billions of entities
* REST API
* Neo4j supports more than one query language, but main and most powerful, **Cypher** was developed especially for Neo4j
* Editions (https://neo4j.com/subscriptions/#editions)
  - Community Edition - open source
  - Enterprise Edition with different licences e.g. commercial licence, developer licence (free)


## Querying Data with Cypher

## Manipulating Data with Cypher

## Using Neo4j's APIs



 