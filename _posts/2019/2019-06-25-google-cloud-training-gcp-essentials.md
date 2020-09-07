---
layout: post
title: "Google Cloud Training: GCP Essentials"
---
https://google.qwiklabs.com/quests/23

# A Tour of Qwiklabs and the Google Cloud Platform

A **GCP Project** is an organizing entity for your Google Cloud resources. It often contains resources and services e.g. a pool of virtual machines, a set of databases, and a network that connects them with one another. Projects also contain settings and permissions, which specify security rules and who has access to what resources.

* More information on all GCP services: https://cloud.google.com/docs/overview/cloud-platform-services#top_of_page
* API Design Guide: https://cloud.google.com/apis/design/ - used internally by Google and published to help everyone
* APIs Explorer: https://developers.google.com/apis-explorer/#p/ - browse all APIs easily

# Creating a Virtual Machine

### Activate Google Cloud Shell

**Google Cloud Shell** is a virtual machine that is loaded with development tools. It offers a persistent 5GB home directory and runs on the Google Cloud. Google Cloud Shell provides command-line access to your GCP resources. See: https://cloud.google.com/sdk/gcloud

### Understanding Regions and Zones

A region is a specific geographical location where you can run your resources. Each region has one or more zones. Resources that live in a zone are referred to as **zonal** resources. Virtual machine instances and persistent disks live in a zone. To attach a persistent disk to a virtual machine instance, both resources must be in the same zone. Similarly, if you want to assign a static IP address to an instance, the instance must be in the same region as the static IP. See: https://cloud.google.com/compute/docs/regions-zones/

### SSH

See: https://cloud.google.com/compute/docs/instances/connecting-to-instance

1. Create new configuration for authentication: `gcloud config configurations create qwiklabs-gcp-8fa25fcdb0d890b7`
2. Initialise configuration: `gcloud init` and choose 1 to reinitialize
3. SSH using `gcloud compute ssh gcelab2 --zone us-central1-c`

### Create a VM

* `gcloud compute instances create gcelab2 --machine-type n1-standard-2 --zone us-central1-c`
* `gcloud compute instances create --help`
* `gcloud config set compute/zone` - set default zone to save entering each time
* `gcloud config set compute/region` - set default region

# Getting Started with Cloud Shell & gcloud

* List configurations: `gcloud config list`
* List of all possible configurations: `gcloud config list --all`
* Make a bucket: `gsutil mb gs://unique-name-hippo`
* List buckets (etc): `gsutil ls`
* Copy a file to a bucket: `gsutil cp test.dat gs://unique-name-hippo`

# Kubernetes Engine: Qwik Start

The Google Kubernetes Engine (GKE) environment consists of multiple machines (specifically Google Compute Engine instances) grouped together to form a container cluster.

* https://cloud.google.com/container-registry/ - google container registry
* https://console.cloud.google.com/gcr/images/google-samples/GLOBAL - samples inc hello-app

A cluster consists of at least one cluster master machine and multiple worker machines called nodes.
* Create a cluster: `gcloud container clusters create [CLUSTER-NAME]`
* Get credentials for the cluster: `gcloud container clusters get-credentials [CLUSTER-NAME]`

The **Deployment** object is used for deploying stateless applications like web servers.
* Creates a new Deployment `hello-server` from the `hello-app` container image: `kubectl run hello-server --image=gcr.io/google-samples/hello-app:1.0 --port 8080`
* Inspect a deployment: `kubectl get deployment hello-server`

The **Service** object define rules and load balancing for accessing your application from the Internet
* creates a Service to expose the application to external traffic: `kubectl expose deployment hello-server --type="LoadBalancer"` (creates a Compute Engine load balancer for the container)
* Inspect a service: `kubectl get service hello-server` 
* Clean up: `gcloud container clusters delete [CLUSTER-NAME]`

# Set Up Network and HTTP Load Balancers

* Network load balancer (L3) see: https://cloud.google.com/compute/docs/load-balancing/network/
* HTTP load balancer (L7) see: https://cloud.google.com/compute/docs/load-balancing/http/

First need to create a cluster of machines. This can be achieve using **instance templates**.

* Create a `startup.sh` script to install nginx and alter the default index.html to display the hostname
* Create an instance template: `gcloud compute instance-templates create nginx-template --metadata-from-file startup-script=startup.sh`
* Create a **target pool**: `gcloud compute target-pools create nginx-pool`
* Create a managed instance group using the instance template:
```
gcloud compute instance-groups managed create nginx-group \
         --base-instance-name nginx \
         --size 2 \
         --template nginx-template \
         --target-pool nginx-pool
```
* Configure a firewall to access the machines on port 80: 

### Network Load Balancer

Allows load balancing based on IP protocol data e.g. address, port, protocol type. Additional options at packet level available which isn't available for HTTP load balancing. 

```
gcloud compute forwarding-rules create nginx-lb \
         --region us-central1 \
         --ports=80 \
         --target-pool nginx-pool
```

* List the forwarding rules to see the LB IP address: `gcloud compute forwarding-rules list`

### HTTP Load Balancer

![Basic HTTP Load Balancer](https://cloud.google.com/load-balancing/images/basic-http-load-balancer.svg)

Allows load balancing based on URL routes. Requests are always routed the the instance closest to the user. 

* Create a health check: `gcloud compute http-health-checks create http-basic-check` to verify instances are responding to HTTP traffic
* Define an HTTP service and map a port name to the correct port for the instance group: `gcloud compute instance-groups managed set-named-ports nginx-group --named-ports http:80`
* Create a backend service and add the instance group to the backend service
* Create a URL map to map all incoming requests to all the instances
* Create an HTTP proxy to route requests to the URL map
* Create a global forwarding rule to route incoming requests to the proxy




