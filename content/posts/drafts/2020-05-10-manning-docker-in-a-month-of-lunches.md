---
layout: post
title: "Manning: Docker in a Month of Lunches"
---

## References

* https://diamol.net/
* https://github.com/sixeyed/diamol

## Week 1: Understanding Docker containers and images
### 1 Before you begin

* Docker is a third option to either IaaS (VMs which are underutilised and expensive) or PaaS (cheaper but provider dependent)
* Docker is good for monoliths or modern applications
* New projects built on cloud native principles are greately accelerated by Docker
   - Typical architecture for microservices using Docker by WeaveWorks: https://github.com/microservices-demo
* The CNCF publishes a map of open-source projects you can use for everything from monitoring to message queues, and they're all available for free from Docker Hub
* Serverless platforms using Docker: Nuclio, OpenFaaS or Fn Project (even though Azure functions and AWS Lambda use containers under the hood, you can't just migrate your serverless code between providers)

#### Check installation
* `docker version`
* `docker-compose version`

#### Clean up
* Clean up ALL containers: `docker container rm -f $(docker container ls -aq)` or `d rm -f $(d ps -aq)`
* Clean up images: `docker image rm -f $(docker image ls -f reference='diamol/*' -q)` or 

### 2 Understanding Docker and running Hello World

* `docker container run diamol/ch02-hello-diamol` - run a container from the image `diamol/ch02-hello-diamol`
* "build, share and run" - package an application, publish it so its available to other users, anyone with access can run the application in a container
* docker containers provide a virtual environment with an IP address and a hostname (also the id of the container)
* IMPORTANT: containers do one thing and then EXIT (run batch processes this way) - containers only run when an application is running

```bash
docker container run --interactive --tty diamol/base # (docker run -it diamol/base)
docker container ls # list running containers (d ps)
docker container ls --all # list all containers (d ps -a)
docker container top [id] # show running processes within a container (d top [id])
docker container logs [id] # (d logs [id])
docker container inspect [id] # JSON output (automation friendly) (d inspect [id])
docker container run --detach --publish 8088:80 diamol/ch02-hello-diamol-web # (d run -d -p 8088:80 diamol/ch02-hello-diamol-web)
docker container stats [id]
docker container exec -it [id] sh # start interactive tty session on container (d exec -it [id] sh)
```

#### Understanding how Docker runs containers

The **Docker Engine** runs on the host machine either as a daemon on Linux or as a windows service on Windows. It includes a **REST API**. The command line tool is a **client** of the REST API and interfaces with it (local by default, but can be remote). In this way you can interact with Docker running on a build server, test or production servers. 

There are additional GUI clients available:
* Universal Control Plane (UCP): https://docs.docker.com/ee/ucp/
* Portainer: https://www.portainer.io/

The Docker Engine uses a component **containerd** to manage the containers, the development of which is overseen by CNCF.

### 3 Building your own Docker images

An image is similar to a zip file for an application. It is built from several layers. These are defined in a `Dockerfile` which IS your installation script.

```bash
docker image pull diamol/ch03-web-ping
docker container run -d --name web-ping diamol/ch03-web-ping
```

Aim to have a default set of configuration so that `docker container run` works fine with the default config. However, should also be able to pull config from the environment. Easiest way, common across lots of different platforms, is by using environment variables.

CICD pipelines should ALWAYS use the same image and just apply different env vars.

```bash
docker rm -f web-ping
docker container run --env TARGET=google.com diamol/ch03-web-ping
```

```dockerfile
FROM diamol/node
ENV TARGET="blog.sixeyed.com"
ENV METHOD="HEAD"
ENV INTERVAL="3000"
WORKDIR /web-ping
COPY app.js .
CMD ["node", "/web-ping/app.js"]
```

* FROM specifies the base image, the only _required_ command
* ENV sets values for environment variables
* WORKDIR creates a directory in the container image filesystem, and sets that to be the current working directory. The forward-slash syntax works for Linux and Windows containers, so this will create /web-ping on Linux and C:\web-ping on Windows.
* COPY copies files from relative to wherever the Dockerfile is running - "the context"
* CMD specifies the command to run when Docker starts a container from the image

```bash
docker image build --tag web-ping .
docker image ls "w*"
docker container run -e TARGET=docker.com -e INTERVAL=5000 web-ping
docker image history web-ping
docker system df
```

Docker images are built up in **layers**. Image layers can be shared between different images and different containers. This saves disk space as the common parts are shared. When listing images using `docker image ls`, the LOGICAL size of the images are shown. Check the real space used on disk with `docker system df`.

Every command, every line, creates a new layer. 

The **image layer cache** is used as long as nothing has changed for that layer. However as soon as something changes, docker evicts all following layers from the cache. Optimise image builds by moving lines which are more likely to change to the bottom and lines which are less likely to change to the top.

```bash
docker commit [id] [name] # create an image from a container
```

### 4 Packaging applications from source code into Docker images

Dockerfiles can replace a build server. Instead of the build server being the master of the version of SDKs etc required and each developer having to match that, this can instead be moved to within docker.

#### Multi-stage Dockerfile

```dockerfile
FROM diamol/base AS build-stage
RUN echo 'Building...' > /build.txt

FROM diamol/base AS test-stage
COPY --from=build-stage /build.txt /build.txt
RUN echo 'Testing...' >> /build.txt

FROM diamol/base
COPY --from=test-stage /build.txt /build.txt
CMD cat /build.txt
```

The 3 different stages do not have to relate to each other. Each layer is isolated and can use different base images. Only files from the final stage will be in the image.

* Build stage uses a base image with all the build tools.
* Test stage has no output, but if anything fails, the build of the image fails
* Final stage base image uses only the runtime

By adopting this methodology, you only ever need to install Docker locally, not maven, Java etc

Furthermore by splitting the build into multiple steps
1. Copy in a dependency list and get dependencies
2. Copy in the code and build
3. Copy the executables into the final base image
the build is faster because the dependency list doesn't change that much, so can be used from the cache AND the final image is smaller because the tools required to build the executables are not in the final runtime image.

* RUN similar to CMD, executes a command inside a container, output is saved inside the image layer. The commands need to exist in the referenced base image.
* EXPOSE informs Docker a port can be published
* ENTRYPOINT alternative to CMD

```bash
docker network create nat
docker container run --name iotd -d -p 8080:80 --network nat image-of-the-day
```

Create and manage virtual Docker networks using `docker network`. Containers can now be explicitly joined to the network and can access each other via their container names.

### 5 Sharing images with Docker Hub and other registries

There are 4 parts to an image name:
1. domain of the registry (defaults to Docker Hub if not included)
2. account / owner / organisation
3. application name
4. tag - used for versioning or variations

e.g. `diamol/golang` OR `mcr.microsoft.com/dotnet/aspnet:5.0`

![Anatomy of a docker image reference](https://www.dropbox.com/s/z9158pemmu81231/202102172211-anatomy-of-a-docker-image-reference.png?raw=1)

All image registries use the same API (based on the same open source project). If an image has a simple local name e.g. `image-gallery`, then it can't be push to a remote registry, since the organisation name is not known. Can use multiple aliases with images by applying multiple tags.

```bash
docker login --username infuerno
docker image tag image-gallery infuerno/image-gallery:v1
docker image push infuerno/image-gallery:v1
docker info
```

Docker image registry can be run locally, which can also be set up to by used as a proxy to mirror a remote registry

#### Using image tags effectively

Can apply multiple tags to an image and therefore achieve pulling images based on latest, major, minor or patch version:
* `:latest` applies to the latest version
* `:2` applies to the latest version for version 2
* `:2.1` applies to the latest version for version 2.1 (e.g. 2.1.114 or 2.1.117)
* `:2.1.114` finally identifies a specific patch version

#### Golden images

It is useful to maintain a curated set of golden images which mirror official images, but selectively based on local requirements. This helps ensure consistency.
* limit the versions people use
* restrict to only pulling images matching the golden images e.g. `diamol/*`
* can have friendlier tags that used by the original publisher
* are built in exactly the same way as normal images (e.g. could simply be a `FROM base` Dockerfile)

### 6 Using Docker Volumes for persistent storage

Although Docker is great for stateless applications, it can also support stateful applications IF NECESSARY (adds complications).

A container's disk is a **virtual** filesystem built up by merging all image layers together. Each container has a series of read only layers shared between multiple containers as well as a writeable layer. If you update a file in an image layer Docker uses a "copy-on-write" process to copy the updated file to the writeable layer and hide the original file from the virtual file system.  

```bash
# copy a file from a container to the host (or vice versa)
docker container cp rn1:/random/number.txt number1.txt
# restarting a container reruns the CMD (and here a new random number is written)
docker container start rn1
```

#### Docker Volumes

* **Volumes** are a first class Docker resource - a USB stick for containers. They exist independently of containers and have their own lifecycle, but they can be attached to containers.
* There are two ways to use volumes
  1. manually create and attach
  2. use the `VOLUME` instruction in the Dockerfile - creates a volume when you start the container using a random name - if the container is deleted, the volume isn't
* A container typically contains 3 different types of file system:
   1. Read only image layers
   2. Writeable layer
   3. Volume with persistent storage

```bash
docker container run --name todo1 -d -p 8010:80 diamol/ch06-todo-list
docker container inspect --format '{{.Mounts}}' todo1
docker volume ls
docker container exec todo1 ls //data
```

Can share volumes between containers using `volumes-from` flag (useful for debugging a running app).

```bash
# this new container will have its own volume
docker container run --name todo2 -d diamol/ch06-todo-list
# this container will share the volume from todo1
docker container run -d --name t3 --volumes-from todo1 diamol/ch06-todo-list
```

Typically this is NOT what you want to do. Apps that write data typically require exclusive access to files. Volumes are better used to preserve state between application upgrades. For this create a volume seperately.

```bash
docker volume create todo-list
docker container run -d -p 8011:80 -v todo-list:/data --name todo4 diamol/ch06-todo-list
```

#### Filesystem mounts

Used to surface an existing host directory inside the container = a "bind" mount. Useful if data is on a different machine.

```
docker container run --mount type=bind,source=./databases,target=/data -d -p 8012:80 diamol/ch06-todo-list
```

##### Security

Often linux containers run as root and windows containers as "ContainerAdministrator" so bear this in mind when mounting directories. Can also mount as readonly: `--mount type=bind,source=./config,target=/app/config,readonly`

##### Compatibility

Although the container sees a regular filesystem, a bind mount MAY not have all the usual features, depending on the actual storage. e.g. Azure Files SMB does not support symbolic links so e.g. the stock postgresql Docker image fails with this.

#### Summary

* Writeable layer - good for a cache but not much else
* Local bind mounts - share between host and container e.g. develop source code on host IDE and see changes in the container
* Distributed bind mounts - e.g. NFS - great BUT ORDERS OF MAGNITUDE SLOWER
* Volume mounts - share data between containers and other Docker managed resource. Various different types of volumes.
* Image layers - initial filesystem for a container. Read only and shared between containers.

## Week 2: Running distributed applications in containers
### 7 Running multi-container apps with Docker Compose
### 8 Supporting reliability with health checks and dependency checks
### 9 Adding observability with containerized monitoring
### 10 Running multiple environments with Docker Compose
### 11 Building and testing applications with Docker and Docker Compose
## Week 3: Running at scale with a container orchestrator
### 12 Understanding Orchestration: Docker Swarm and Kubernetes
### 13 Deploying distributed applications as stacks in Docker Swarm
### 14 Automating releases with upgrades and rollbacks
### 15 Configuring Docker for secure remote access and CI/CD
### 16 Building Docker images that run anywhere: Linux, Windows, Intel and Arm
## Week 4: Getting your containers ready for production
### 17 Optimizing your Docker images for size, speed and security
### 18 Application configuration management in containers
### 19 Writing and managing application logs with Docker
### 20 Controlling HTTP traffic to containers with a reverse proxy
### 21 Asynchronous communication with a message queue
### 22 Never the end

## Appendix

* Run a stock linux image in interactive mode: `docker run -t -d alpine` followed by `docker exec -it [id] sh` (see: https://stackoverflow.com/questions/30209776/docker-container-will-automatically-stop-after-docker-run-d)
* Mount the Docker host linux file system (in DockerDesktop.vhdx) inside this image: `docker run -t -d -v /var/lib/docker/volumes:/myvolumes alpine`