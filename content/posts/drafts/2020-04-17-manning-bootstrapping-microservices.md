---
layout: post
title: "Manning: Bootstrapping Microservices with Docker, Kubernetes and Terraform"
---

# 1 Why microservices

> A microservice is a tiny and independent software process that runs on its own deployment schedule and can be updated independently.

> A microservices application is an application composed of many small collaborating services. Traditionally this is known as a distributed application or a system whose components live in separate processes and communicate via the network. 

There aren't many hard and fast rules that I follow, but I feel these few are especially important:

1. Don’t over design it or try and future proof, start with a simple design for your application.
2. Apply continuous refactoring during development to keep it as simple as it can be.
3. Let a good design emerge naturally.

> Microservices should be loosely coupled (the connections between services should be minimal and that they shouldn’t share information unless necessary) and highly cohesive (all the code in a microservice should belong together)

> There is a coding principle that seems like it might be under attack by microservices. Many developers live by the motto don’t repeat yourself (DRY). But in the world of microservices it might be that we are developing a higher tolerance for duplicated code than used to be considered acceptable. However, there are good ways to share code between microservices and we aren’t simply going to throw-out DRY.

# 2 Creating your first microservice

1. Create a new node project using `npm init -y` (`-y` avoids all the questions)
2. Install express `npm install express` (`--save` no longer required)
3. Create `index.js` and code as required
4. Run the application using `node index.js`

For production use `npm install --only=production` to avoid installing "dev dependences". Also add a script to `package.json` called `start` to run `node index.js`. Can now start the application using `npm start` (convention).

## Live reload

1. `npm install --save-dev nodemon` (automatically restarts service when changes detected)
2. Run using `nodemon index.js` or create a `start-dev` script and run with `npm run start-dev` (only `npm start` and `npm test` are specially bootstrapped and don't require the `run` command)

# 3 Publishing your first microservice

Use Docker to:
* Package the microservice in a Docker image;
* Publish the image to a private container registry; and
* Run the microservice in a container

## Dockerfile

* `FROM` defines the base image e.g. `FROM node:12.16.2-alpine` 
* `COPY` copies files into the image e.g. `COPY package*.json ./`
* `RUN` runs software within the image to make changes e.g. `RUN npm install --only=production`
* `CMD` sets the command which is invoked when the container is instantiated e.g. `CMD npm start`

Note: `alpine` images are compact and useful for production (e.g. 100MB cf 1GB)

## Package the image

`docker build -t bootstrapping-microservices --file Dockerfile .`

## Instantiate the image as a container

`docker run -d -p 3000:3000 video-streaming` (general format: `docker run -d p <host-port>:<container-port> <image-name>`)

* `-d` detached mode (runs in the background so doesn't tie up the terminal BUT can't see the logs)
* `-p 3000:3000` binds host port 3000 to container port 3000
* `video-streaming` name of the image
* `-e` to specify environment vars e.g. to pass in the path to an externally mounted volume containing the videos

## Check the logs

`docker logs <container-id>`

## Publish to a container registry

To push an image to your private container registry you must first tag it with the URL of your registry.

* Create a new container registry on Azure
* Enable the admin user
* Login to the registry e.g. `docker login <registry-url> --username <username> --password-stdin`
* Tag the existing image (strange, but "this is the way its done") e.g. `docker tag <existing-image> <registry-url>/<image-name>:<version>`
* Push the image to the registry e.g. `docker push <registry-url>/<image-name>:<version>`

## Cleaning up locally

1. Stop running containers: `docker ps` to list running and stopped; `docker stop 168` to stop container `168`
2. Delete stopped containers: `docker container rm 168`
3. Delete image with no containers: `docker image rm 168` or `docker rmi 168` (use `--force` if the same image id is tagged in multiple repositories)

## Test the published image

Should now be able to instantiate a container directly from the image published on the registry.

* Use `docker run` to run the published image locally: `docker run -d -p <host-port>:<container-port> <registry-url>/<image-name>:<version>`
Online documentation: https://docs.docker.com/engine/reference/commandline/docker/

## Make a change to the published image

1. Build: `docker build -t video-streaming .`
2. Tag: `docker tag video-streaming manning.azurecr.io/video-streaming:latest`
3. Push: `docker push manning.azurecr.io/video-streaming:latest` (two tags locally now reference the same image with `latest`, previous one from the remote repo no longer tagged `latest`)
4. Run: `docker run -d -p 3000:3000 manning.azurecr.io/video-streaming:latest` (or simply `video-streaming:latest` or even `video-streaming`)

# 4 Data management for microservices

Will add 2 further microservices (and hence containers) - one for video storage (Azure storage) and one for database storage (MongoDB). Will also use Docker-Compose to orchestrate the build and deployment for development. (Kubernetes requires at least one master and one node and therefore more suited to production scenarios.)

`docker-compose --version`

The Docker-Compose file is a script that specifies how to compose an application from multiple Docker containers e.g. `docker-compose.yaml`.




# 5 Communication between microservices

# 6 Creating your production environment

# 7 Continuous delivery

# 8 Keeping your microservices working

# 9 Exploring Flixtube

# 10 Our future is scalable





https://www.dclibrary.org/safaribooks
https://login.dclibrary.idm.oclc.org/login?qurl=http%3a%2f%2fproquestpubliclibrary.safaribooksonline.com
Did you include every number?

    Library cards have 14 digits.
    DC One Cards have 12 digits.

21172096089208
PIN is usually the last 4 numbers of the card number

