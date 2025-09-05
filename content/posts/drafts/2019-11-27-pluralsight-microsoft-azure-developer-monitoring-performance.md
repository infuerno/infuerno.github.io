---
layout: post
title: "Pluralsight: Microsoft Azure Developer: Monitoring Performance"
---
# Foundational Concepts

Azure Monitor is a complete solution.

Data captured are either metrics OR logs. Use Metrics Explorer OR Log Analytics

## Data sources

* Application monitoring data - your code
* Guest OS monitoring data - CPU usage, memory
* Azure resource data - e.g. CosmosDB available storage
* Azure subscription data - e.g. cost to date

## Insight offerings

* Application Insights specialises in monitoring web applications
* Container Insights is for containers including container logs
* VM Insights for VMs
* Network Insights

## Visualisation
Dashboards, custom Log Views (which can also be added to a dashboard) and Power BI can be used to visualise the data. Power BI can be configured to import data from Log Analytics

## Integration

* Stream to event hubs before publishing to an external provider
* Use Logic Apps to automate transformation and publication  
* Ingest and Export APIs

## Sample Application Architecture

![Sample Application Architecture](https://www.dropbox.com/s/0b43x5z3s7apekd/Screenshot%202019-11-27%2023.19.52.png?raw=1)
