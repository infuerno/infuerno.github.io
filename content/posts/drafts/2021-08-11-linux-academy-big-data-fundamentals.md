---
layout: post
title: "Linux Academy: Big Data Fundamentals"
---

## Terminology (32:31)

Big Data
: a data set is considered "big data" when it is too **big** or **complex** to be **stored** or **analysed** by **traditional data systems**

Structured data
: Typically stored in rows and columns. Approx 10% of data

Semi-structured data
: Has some level of organisation, with some processing can be stored in a traditional database - CSV, YAML and JSON. Most NoSQL databases are considered semi-structure. Elastic Search and MongoDB. Approx 10% of data.

Unstructured data
: No structure e.g. documents, images, videos, emails. Approx 80% of data.

### 3 Vs / 7 Vs

- Volume - the quantity of the data
- Velocity - how quickly the data is processed - events per second (eps) - 10 to 25,000 events per second - eps is often variable - go for maximum plus a bit more
- Variety - how diverse is the data - segment data according to different types of data
- Veracity - reliability of the data source (not the data)
- Variability - how consistent / inconsistent is the data - sometimes flux in velocity is considered under variability
- Visualisation - - how easily can the data be visualised - helps to know questions you want to be asking of the data. If you want to change - can either go back to the data source and have the data created differently OR go back to the data processing and have the data mutated differently
- Value - easy to get carried away with collecting data

## Architecture (30:53)

### Data Ingestion

One of the hardest things to work out is collecting all the data.

- Push the data from the device creating it to the data pipeline (always better)
- Polling proxy which polls and endpoint for data

Sources include:

- End User Devices: IOT devices, Phones, computers, POS register
- Servers: web server access logs, application logs, system logs, resource metrics
- Cloud: logs, metrics
- Network devices: firewalls, routers
- Applications: status, usage
- Storage systems: status, usage

#### Queue

Very common to use a **queue** as the first step in the pipeline

- great for managing back pressure when there is a burst of data and the generation of data is faster than the processing speed e.g. can use Kafka

#### Data Processor

- data processors which collect the data - multiple if necessary
- format, clean, enrich e.g. enrich IP addresses
- can be very CPU intensive

#### Data Storage and Analytics

- may be multiple tools
- assuming the storage can keep up with the influx of data, index it for fast search etc - can then start asking questions of the data

### Parallel Computing

- Traditionally have a single database even if clustered
- Parallel computing can scale horizontally - job goes to cluster management node - disperses the work to multiple nodes - gathers results and returns

### Storage

- With traditional storage have an active node and passive node - all write actions go to the active node - read operations prefer the active node, but can use the passive node
- With big data need to use distributed storage. There will be management, but ultimately the data is broken up
  - 3 nodes - one node is primary for a certain chunk of data - other nodes have a replication of that chunk of data (up to n-1)

### Cluster Management

![Cluster management](https://www.dropbox.com/s/rcp2rylfm1dxl0g/202108142023-Cluster%20Management%20-%20A%20Cloud%20Guru.png?raw=1)

Two types of nodes:

- Worker nodes - clustered for high availability and redundancy
- Master / coordination nodes - should also cluster these so if the Elected Master fails there is no single point of failure
  - Keeps track of nodes in the cluster - disk usage - which data each node has - if this data is master or replica
  - Route search requests to the appropriate nodes e.g. data on 3 nodes, gets data from each node, merges it and sends it back
  - Usually smaller and less compute intensive than worker / storage nodes
  - Some older technologies don't have clustering capability e.g. HDFS

## Technologies (28:55)

### HDFS / Hadoop

- Hadoop Distributed File System - designed to run on older hardware. Very scalable. It is highly fault tolerant, but not the main (master) node - which is problematic. Just need to make sure there is a queue buffering the data.
- Used for **storing** large amounts of data either structured or unstructured. Other tools e.g. MapReduce or Spark can then do data analysis on this stored data.
- Main node keeps track of all the data nodes
- Main node keeps a file registry - knows where all the files are on each of the nodes
- Files are broken up into blocks and stored in such a way that there is a replica on a different node and if anyone one node goes down, the file can be recovered from the remaining nodes
- Earliest and most ubiquitous technology - still a major player

### MapReduce

- One of the earliest data analysis technologies built on top of Hadoop
- Processing technique which maps a set of data by filtering or sorting and THEN reducing each set of data e.g. counting, averaging, searching etc
- Jobs are written in Java
- Highly scalable - ask all pieces of data the same question at the same time, merge results etc
- There are more stages than Map and Reduce
- Example
  - Data spread out across 5 nodes
  - Question asked to 5 nodes
  - Data output from each node
  - Sort the data from each node
  - Reduce the data to the final output

### Spark

- More modern and recent technology, an adaption of HDFS and MapReduce taken a bit further
- Very flexible and adaptable for anything in terms of cluster computing
- Apache open source project
- One popular capability is its in-memory data processing - makes processing MUCH faster
- Works with lots of other technologies e.g. HDFS, Elasticsearch, Kafka
- One of the reasons it became popular due to how easily it worked with HDFS
  - Deploy Spark worker nodes to HDFS data nodes
  - HDFS main node managing HDF data nodes
  - Spark cluster managing managing the worker nodes
  - Since the worker nodes and data nodes are the same nodes can leverage Spark on top of HDFS very easily

![Simple Spark Deployment](https://www.dropbox.com/s/dx13fev6k0gpkpq/202108142057-Spark%20-%20A%20Cloud%20Guru.png?raw=1)

#### How it works

The **driver** asks the question to the **cluster manager** which in terms asks all the **worker** nodes. The worker nodes uses whatever storage technology is in use e.g. HDFS, Elasticsearch etc to answer the question. Importantly each worker node also has a **cache** of the most frequently asked questions. returns the results ot the driver

### Elasticsearch

- Both a data storage AND a data analysis technology
- Used for super fast search
- Great for NoSQL database, everything stored is in semi-structured format
- Great for data analytics
- Became popular in the usecase of logging aggregation - made a good storage and analytic tool in a log analytic pipeline

#### How it works

- Master nodes are culsterable with one being the "elected master" which manages the data nodes
- Stores data in indexes (comparable to a table in traditional databases)
- Each index is a collection of documents, spread out into shards e.g. index of 1,000,000 documents - third in Primary Shard 1, third in Primary Shard 2 and third in Primary Shard 3 - search all documents by searching each shard at the same time

![Elasticsearch example](https://www.dropbox.com/s/ednm3e697edoqq1/202108142127-Elasticsearch%20-%20A%20Cloud%20Guru.png?raw=1)

- Shards can also be used for replication as well as performance e.g. all documents on Primary Shard 1, and then all documents also on two Replica Shard 1s held on different nodes
  - e.g. 25 nodes, index comprised of 5 shards each with 3 degrees of replication - so 20 shards in total, easily spread out across the 25 nodes
- Great for highly variable data e.g. index per application for log data
- Elasticsearch can do everything - but often combined with Kibana to visualise the analysis

### Kafka

- Data streaming technology i.e. data storage where the data is kept in a specific order as it is produced

### MongoDB

## Use Cases (19:51)
