---
layout: post
title: "Essential Docker for ASP.NET Core MVC"
---

## Quick Reference

* `docker images` - list images
* `docker build` - create a custom image from a base image via a Dockerfile
* `docker rmi` - delete an image

* `docker ps -a` - list containers
* `docker run` - creates and runs the specified image as a container (downloads it if not found and it can)
* `docker create` - creates the container from the image



## Chapter 1 Understanding Docker

### Consistency Problem

* Differences in environment cause the application to behave differently e.g. no reverse proxy in development
* Differences in dependencies on version of dev tools e.g. .NET version
* Differences in the way the solution is deployed
* Ensuring all servers for an application are configured consistently

#### With Docker

* Development image - differs only by containing compiler and debugger
* Production image - omits dev tools and has compiled version of classes

### Responsiveness Problem

* ASP.NET applications historically struggle to provision the right amount of capacity to deal with their workload

#### With Docker

* The container provides a lightweight wrapper around the application. The application can be scaled horizontally by adding further containers when required.

### Containers v VMs

* Containers only isolate applications but otherwise still depend on the underlying machine - linux containers can only run on linux VMs, windows on windows
* A single server can run more containers than VMs - fewer resources are spent on low level OS tasks

### Limitations

* Containers work best for MVC applications which are stateless - any state data needs to be stored in such a way that it is accessible from each container (another container running redis?)
* If an application can't be scaled via duplication the benefits of using containers diminishes
* Linux has mature support for Docker, but only Windows Server 2016 and Windows 10 (pre release versions only) support Docker
* .NET Core and ASP.NET Core both work on Linux and Linux containers are **recommended**

### Other containerisation options

* Open Container Initiative aims to standardise the use of containers
* Main Docker competitor is `rkt` produced by CoreOS

## Chapter 2 Essential Docker Quick Reference

### Images

The Docker image used to deploy ASP.NET Core applications does not contain the .NET Core compiler so the application must be compiled with all dependencies. Within the project folder of the application run to publish the output artefacts to a folder called `dist`.

`dotnet publish --framework netcoreapp1.1 --configuration Release --output dist`

Use `docker build` to build the image from a Docker file e.g. `docker build . -t apress/exampleapp -f Dockerfile` where `.` indicates the current directory as the working directory; `-t` is the name of the image; `-f` specifies the Docker file

Command | Description
---|---
`docker build` | This command processes a Docker file and creates an image.
`docker images` | This command lists the images that are available on the local system. The `-q` argument returns a list of unique IDs that can be used with the docker rmi command to remove all images.
`docker pull` | This command downloads an image from a repository (often don't need to run explicitly)
`docker push` | This command publishes an image to a repository. You may have to authenticate with the repository using the `docker login` command.
`docker tag` | This command is used to associate an (alternative) name with an image.
`docker rmi` | This command removes images from the local system (specifying the image ID). The -f argument can be used to remove images for which containers exist. To remove all images use `docker rmi -f $(docker images -q)` to pump all images IDs to the `rmi` command.
`docker inspect` | Displays details about the image  

Useful prebuilt images include images containing: ASP.NET Core runtime; .NET Core runtime; .NET Core SDK (for development); MySQL; HAProxy, useful as a load balancer / configured to respond to containers starting and stopping

Docker files contain a series of commands including:

* FROM - specify base image;
* WORKDIR - change the working dir for subsequent commands;
* COPY - add files to become part of the container's file system; 
* RUN - execute command e.g download dependencies
* EXPOSE - expose a port from the container
* ENV - create environment vars
* VOLUME - 
* ENTRYPOINT - the application to be run

### Containers

Containers are created from an image and used to execute an application in isolation. 

* Create using `docker create` and start using `docker start` - or create and start using `docker run` e.g. `docker run -p 4000:80 --name exampleApp4000 apress/exampleapp`. 
* Arguments passed in allow containers from the same image to be configured differently
    * `--env` or `-e` for environment vars;
    * `--publish` or `-p` to map a port;
    * `--network` to join a container to a software defined network;
    * `--rm` to remove a container when it stops
    * `--volume` or `-v` to define a directory on the host available on the container's filesystem

Other useful commands include:

* `docker ps` to list containers
* `docker logs` to inspect the logs
* `docker exec` to execute a command inside the container

### Volumes

Volumes allow data files to be stored outside of a container, which means they are not deleted when the container is deleted or updated. 

* Volumes are created using `docker volume create` and assigned a name e.g. `
docker volume create --name productdata`
* The name is applied in the `docker create` command e.g. `docker run --name mysql -v productdata:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=mysecret -e
bind-address=0.0.0.0 mysql:8.0.0`

### Software-Defined Networks

Software-defined networks are used to connect containers together, using networks that are created and managed using Docker.

* Create using `docker network create backend`
* Join a container to a network using the `--network` parameter of the `docker create` command or the `docker network connect` command
* Use `ls` and `rm` to list and remove networks

### Compose

Docker Compose is used to describe complex applications that require multiple containers, volumes, and software-defined networks, using the YAML format.

* Compose files are processed using the `docker-compose build` command e.g. `docker-compose -f docker-compose.yml build`
* Use `docker-compose up` to create the containers, networks and volumes specified

Other useful commands include:

* `docker-compose stop` to stop containers created from services in a compose file
* `docker-compose down` to stop and delete containers, networks and volumes
* `docker-compose scale` to scale the number of containers running
* `docker-compose ps` to list the containers created

### Swarm

A Docker swarm is a cluster of servers that run containers. Worker nodes run the containers and manager nodes distribute the containers between nodes.

* `docker swarm init` from a manager node
* `docker swarm join` from a worker node (using details output in previous command)
* Compose files can be used to define the services in a swarm
* Use `docker stack deploy` to deploy such an application e.g. `docker stack deploy --compose-file docker-compose-swarm.yml exampleapp` (where `exampleapp` gets used a s prefix to the names)

## Chapter 4 Docker Images and Containers

* `docker logs` to see the last set of logs from a container (whether still running or stopped)
* `docker logs -f` to see continuous output
* `docker cp host-file exampleApp3000:/app/` to copy files into a container (use with caution)
* `docker diff` to see differences between a container and the image it was created from (A=added; C=changed; D=deleted)
* `docker exec exampleApp3000 [command]` to execute a command in a container
* `docker exec -it exampleApp3000 /bin/bash` to start an interactive shell (Bash is included in aspnetcore images)
* `apt update && apt install vim` to install packages

### Creating Images from Modified Containers

Either run an existing container, or run a dynamic container from an image using:

`docker run -it microsoft/dotnet:2.1-aspnetcore-runtime /bin/bash` to create a container, start it and enter an interactive shell

Make any changes and exit. After exiting run `docker ps -a` to see the container. The name will be randomly generated for the container in this last case. See https://github.com/moby/moby/blob/master/pkg/namesgenerator/names-generator.go

Create a new image from the container using `docker commit`:

`docker commit hungry_torvalds infuerno/dotnet:2.1-aspnetcore-runtime`

### Publishing Images

* `docker login -u username -p password`
* `docker push username/image:version`
* `docker logout`

## Chapter 5 Docker Volumes and Networks

* Volumes - allow important data to exist outside of the container, allow changing or upgrading containers without loosing data
* Networks - IP docker networks for container communication on a single server (between servers only IF a cluster is used)

* `docker volume create --name testdata` - create a new volume
* `docker run --name vtest2 -v testdata:/data infuerno/vtest` - create a container which maps the volume `testdata` to `/data`
