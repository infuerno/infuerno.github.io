---
layout: post
title: "Manning: Kubernetes in a Month of Lunches"
---

## References

* Code: https://github.com/sixeyed/kiamol
* Documentation site: https://kubernetes.io/docs/home/ - covers everything from the architecture of the cluster, through guided walkthroughs and learning how to contribute to Kubernetes yourself
* Kubernetes API reference: https://kubernetes.io/docs/reference/generated/kubernetesapi/ https://kubernetes.io/docs/reference/using-api/
v1.19
* Twitter: @kubernetesio
* Founding members of the Kubernetes project and community:
  * Brendan Burns @brendandburns
  * Tim Hockin @thockin
  * Joe Beda @jbeda
  * Kelsey Hightower @kelseyhightower
* Author: @EltonStoneman, https://blog.sixeyed.com, https://youtube.com/eltonstoneman.

## 1 Before You Begin

>Kubernetes is hard. Even simple apps are deployed as multiple components, described in a custom file format which can easily span many hundreds of lines. Kubernetes brings infrastructure-level concerns like load-balancing networking, storage and compute into app configuration, which might be new concepts depending on your IT background. And Kubernetes is always expanding - there are new releases every quarter which often bring a ton of new functionality.

Cluster
: Set of servers all configured with a container runtime e.g. Docker

Kubernetes API
: Define apps in YAML files and send these to the API

Nodes
: Individual servers which in normal usage are ignored and the cluster treated as a single entity

Configuration
: The cluster has a distributed database to store config files for an application and secrets e.g. API keys

Storage
: Used to maintain data outside of containers = high availability for stateful apps

![Basic Kubernetes Resources](https://www.dropbox.com/s/gm1jhu0l4nnhs9d/202102042032-basic-kubernetes-resources.png?raw=1)

## 2 Running containers in Kubernetes with Pods and Deployments

### How Kubernetes runs and manages containers

* Containers run in **pods**, normally one container per pod, sometimes multiple
* All containers in a pod are part of the same virtual environment:
  * each pod has an IP address assigned e.g. 10.1.0.36
  * all containers in a pod share this same network address
  * containers can communicate to other containers in the same pod using `localhost`
  * pods can communicate to other pods in the same cluster via IP address
* Kubernetes does not manage the containers, instead passing that responsiblity to the container runtime (e.g. Docker). **Kubernetes manages pods.**

```bash
# run a pod with a single container;
# the restart flag tells Kubernetes to create just the pod and no other resources
kubectl run hello-kiamol --image=kiamol/ch02-hello-kiamol --restart=Never
# list all the pods in the cluster
kubectl get pods
# show detailed information about the pod
kubectl describe pod hello-kiamol
# specify custom columns in the output
kubectl get pod hello-kiamol -o customcolumns= NAME:metadata.name,NODE_IP:status.hostIP,POD_IP:status.podIP
# specify a JSONPath query in the output
kubectl get pod hello-kiamol -o jsonpath='{.status.containerStatuses[0].containerID}'
```

* Pods are allocated to one **node** when they're created
* The node is responsible for managing the pod and its containers via the container runtime using a known API called the **Container Runtime Interface (CRI)**.

```bash
kubectl port-forward pod/hello-kiamol 8080:80
```

## Running pods with controllers

Pods are primitive resources, normally not run directly. If the node goes down, the pod is lost.

Controllers
: Resources which manager other resources. They work with the Kubernetes API to watch the current state of the system, compare it to the desired state of its resources and make any changes necessary

Deployment
: Controller resource for managing pods. If a node goes offline, a deployment will create a new pod on another node. 

```bash
# create a deployment called "hello-kiamol-2"
kubectl create deployment hello-kiamol-2 --image=kiamol/ch02-hello-kiamol
# print the labels which the deployment adds to the pod
kubectl get deploy hello-kiamol-2 -o jsonpath='{.spec.template.metadata.labels}'
# list pods which have that matching label
kubectl get pods -l app=hello-kiamol-2
```

The deployment keeps track of its resources via **labels**. This is a common Kubernetes pattern. Using labels keeps the resources loosely coupled. The deployment selector label is `app`.

* Trick the deployment by changing the app label. 
* Useful technique for debugging - pod is removed from the controller, but the deployment creates a new pod in its place to keep the app up and running.
* Update it back to force the deployment to readopt the resource

```bash
# list all pods, showing the pod name and labels
kubectl get pods -o custom-columns=NAME:metadata.name,LABELS:metadata.labels
# update the "app" label for the deployment's pod
kubectl label pods -l app=hello-kiamol-2 --overwrite app=hello-kiamol-x
# fetch pods again
kubectl get pods -o custom-columns=NAME:metadata.name,LABELS:metadata.labels
```

Similarily, port forwarding should be done at the deployment level.

```bash
kubectl port-forward deploy/hello-kiamol-2 8080:80
```

### Defining deployments in application manifests

Kubernetes **manifests** are a complete description of an application. They can be versioned and
tracked in source control and will result in the same deployment on any Kubernetes cluster.

Manifests are **declarative**.

#### pod.yaml

```yaml
# always specify the version of the Kubernetes API and the type of resource
apiVersion: v1
kind: Pod
# metadata for the resource includes the name (mandatory) and labels (optional)
metadata:
  name: hello-kiamol-3
# minimum spec for a pod is the container(s) to run, with container name and image
spec:
  containers:
    - name: web
      image: kiamol/ch02-hello-kiamol
```

```bash
# deploy the application from the manifest file
kubectl apply -f pod.yaml
# alternatively deploy via a remote file
kubectl apply -f https://raw.githubusercontent.com/sixeyed/kiamol/master/ch02/pod.yaml
```
#### deployment.yaml

```yaml
# deployments are part of the "apps" version 1 API spec
apiVersion: apps/v1
kind: Deployment
# the deployment needs a name
metadata:
  name: hello-kiamol-4
# the spec includes the label selector the deployment uses
# to find its own managed resources - here we are using the "app" label,
# but this could be any combination of key-value pairs
spec:
  selector:
    matchLabels:
      app: hello-kiamol-4
  # the template is used when the deployment creates pods
  template:
    # pods in a deployment don’t have a name,
    # but they need to specify labels which match the selector
    metadata:
      labels:
        app: hello-kiamol-4
    # the pod spec lists the container name and image
    spec:
      containers:
        - name: web
          image: kiamol/ch02-hello-kiamol
```

### Working with applications in pods

Although you can create or run containers directly, kubectl still lets you run commands in containers, view application logs and copy files.

#### Run command in a pod
```bash
# check the internal IP address of a pod
kubectl get pod hello-kiamol -o customcolumns=NAME:metadata.name,POD_IP:status.podIP
# run an interactive shell command in the pod
kubectl exec -it hello-kiamol -- sh
# inside the pod check the IP address
hostname -i
# test the web app
wget -O - http://localhost | head -n 4
```

#### View logs

```bash
# print latest container logs from Kubernetes:
kubectl logs --tail=2 hello-kiamol
```

Refer to pods created via deployments using `deploy` or labels

```bash
# make a call to the web app inside a container
kubectl exec deploy/hello-kiamol-4 -- sh -c 'wget -O - http://localhost > /dev/null'
# and check that pod’s logs:
kubectl logs --tail=1 -l app=hello-kiamol-4
```

#### Accessing a container's file system

Kubectl lets you copy files between your local machine and containers in pods.

```bash
# create the local directory:
mkdir -p /tmp/kiamol/ch02
# copy the web page from the pod:
kubectl cp hello-kiamol:/usr/share/nginx/html/index.html /tmp/kiamol/ch02/index.html
# check the local file contents:
cat /tmp/kiamol/ch02/index.html
```
This can be done either locally or remotely and is bi-directional.

#### Deleting pods, deployments

```bash
kubectl delete pods --all
```

Controllers clean up their resources when they get deleted, so removing a deployment is like a cascading delete which removes all the deployment’s pods too.

```bash
kubectl delete deploy --all
# check all resources
kubectl get all
```

## 3 Connecting Pods over the Network with Services

Pods communicate using standard TCP and UDP networking protocols, both using IP addresses
to route traffic. However, IP addresses change when pods are replaced, so Kubernetes provides a
network address discovery mechanism with **services**.

Services route traffic between pods, into pods from outside the cluster and from pods to external systems. 

### How Kubernetes routes network traffic

```bash
# check the IP address of the second pod
kubectl get pod -l app=sleep-2 -o jsonpath='{.items[0].status.podIP}'
# use that address to ping the second pod from the first
kubectl exec deploy/sleep-1 -- ping -c 2 $(kubectl get pod -l app=sleep-2 -o jsonpath='{.items[0].status.podIP}')
```

IP addresses change. The internet solved this using DNS. Likewise Kubernetes uses the same system. A Kubernetes cluster has a DNS server built in mapping service names to IP addresses. 

Creating a service, effectively registers the associated pod with the DNS server, using an IP address which is static for the life of the service. **Services** are abstractions over pods and their network addresses. Similar to deployments, services are loosely coupled to pods using labels.

```yaml
# sleep2-service.yaml
apiVersion: v1 # services use the core v1 API
kind: Service
metadata:
  name: sleep-2 # the name of a service is used as the DNS domain name
# the specification requires a selector and a list of ports
spec:
  type: ClusterIP # can be omitted since it is the default
  selector:
    app: sleep-2 # matches all pods with an 'app' label set to 'sleep-2'
  ports:
    - port: 80 # listen on port 80 and send to port 80 on the pod
```

Other pods can now refer to the `sleep-2` pod using the service's DNS name i.e. `sleep-2`. 

**NOTE** ping won't work using the service name because although pods support ICMP, services only support TCP and UDP.

### Routing traffic between pods

The default type of service is `ClusterIP`. These services create cluster wide addresses which can be used internally.

### Routing external traffic into pods
 
LoadBalancer
: LoadBalancer **services** route external traffic from any node into a matching pod. There may be many pods which have a matching label selector, deployed across multiple nodes. Kubernetes takes care of the routing to a matching node.

```yaml
# web-service.yaml
apiVersion: v1
kind: Service
metadata:
  name: numbers-web
spec:
  type: LoadBalancer
  selector:
    app: numbers-web
  ports:
   - port: 8080 # listen on port 8080
     targetPort: 80 # send to port 80 on the pod
```

Checking the service `kubectl get svc numbers-web` shows the **EXTERNAL-IP** which can be used to access the service - will be different when using Docker Desktop, KinD or managed K8s cluster in the cloud. This is due to the extension points in Kubernetes being implemented in different ways for different distributions. 

NodePort
: NodePort is another **service** which can listen for traffic coming into the cluster and redirect it to a pod. NodePorts don’t require an external load balancer - *every node in the cluster* listens on the port specified in the service, and sends traffic to the target port on the pod. 

NodePorts have several disadvantages:
* A different port is required for each service
* Nodes themselves need to be publically accessible
* No load balancing across a multi-node cluster
* Different levels of support in individual distributions - don't work so well in KinD
* Typically DON'T use NodePorts in production - since it’s better to keep manifests consistent across environments, not much point using in development either

### Routing traffic outside Kubernetes

Some serivces, e.g. typically databases, are managed outside of a Kubernetes cluster, but can still use Kubernetes DNS for these external services. 

ExternalName
: ExternalName **services** allow using local names in application pods with the DNS server resolving the local name to a fully-qualified external name when the pod makes a lookup request. They are implemented using CNAMEs.

```yaml
# api-service-externalName.yaml
apiVersion: v1
kind: Service
metadata:
  name: numbers-api
spec:
  type: ExternalName
  externalName: raw.githubusercontent.com
```

NOTE. For straight TCP requests, ExternalName is fine, but for HTTP requests where the hostname is often additionally specified in an HTTP Header, this will not usually match (unless extra 'hacky' code is added), therefore best for non HTTP services.

Headless
: A "headless" service allows routing to an external IP address, rather than domain name. It is defined as a `ClusterIP` but **without** a corresponding label. Instead it is deployed with an **endpoint** resource, which defines the IP addresses to resolve.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: numbers-api
spec:
  type: ClusterIP # no 'selector' field makes this a headless service
  ports:
    - port: 80
---
kind: Endpoints # the endpoint is a separate resource
apiVersion: v1
metadata:
  name: numbers-api
subsets:
  - addresses:
      - ip: 192.168.123.234 # it has a static list of IP addresses
    ports:
      - port: 80 # and the ports they listen on
```

```bash
# check the endpoint:
kubectl get endpoints numbers-api
```

### Understanding Kubernetes service resolution

![](https://www.dropbox.com/s/jhjhlicmaqfdujk/202102122011-kubernetes-service-resolution.png?raw=1)

The `ClusterIP` address is a virtual IP address which doesn't actually exist. It is assigned to a service and never changes and is mapped by **kube-proxy** to the real IP address of the endpoint.

Namespace
: Every Kubernetes resource lives inside a namespace, a resource which is used to group other resources.

Namespaces are used in DNS resolution. Within a namespace services are available using simple unqualified names e.g. `numbers-api`. They are accessible from a different namespace using a FQDN e.g. `numbers-api.default.svc.cluster.local` (where the namespace here is `default`).

## Appendix

Short name | Full name
--|--
csr | certificatesigningrequests
cs | componentstatuses
cm | configmaps
ds | daemonsets
deploy | deployments
ep | endpoints
ev | events
hpa | horizontalpodautoscalers
ing | ingresses
limits | limitranges
ns | namespaces
no | nodes
pvc	| persistentvolumeclaims
pv | persistentvolumes
po | pods
pdb | poddisruptionbudgets
psp | podsecuritypolicies
rs | replicasets
rc | replicationcontrollers
quota | resourcequotas
sa | serviceaccounts
svc | services