---
layout: post
title: "dockr.ly/windows-workshop"
---

## dockr.ly/windows-workshop

only install docker - windows service / linux daemon
run your distributed apps in containers - own ip addresses / registry
but processes actually run as processes on the server

Dockerfile: deployment script
Image: packaged application
Registry: image store - special kind of server which understands images
Container: running application

1 x windows licence - 8 VMs - 40 containers

move the same container from one server to another

security: provenance and trust - scan the image and check for any vulnerabilities - various suppliers - open format - sign the image with a digital signature - can then ensure that

build / ship / run

- docker image build -\> output is an image (wherever you ran the command)
- docker image push -\> either to hub.docker.com or any other registry
- docker container run - pass it the image name

host operating system needs to match the docker image operating system / container file system

docker is written in Go

when running command line - talking to a docker API
group a set of servers running docker as a cluster as a swarm
