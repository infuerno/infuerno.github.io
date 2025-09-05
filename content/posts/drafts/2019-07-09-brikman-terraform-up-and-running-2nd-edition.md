---
layout: post
title: "Brikman: Terraform Up and Running 2nd Edition"
---
# Chapter 1: Why Terraform

>Software isn't _done_ until you ship it to the user.

>DevOps isn't the  name of a team or a job title or a particular technology. Instead its a set of processes, ideas and techniques. ... The goal of DevOps is to make software delivery vastly more efficient.

Four broad categories of IAC tools:
1. Ad hoc scripts - great for quick and dirty
2. Configuration management tools - e.g. Chef, Puppet, Ansible, SaltStack - designed to install and manage software on existing servers - on multiple servers
3. Server templating tools - alternative to config mgmt tools e.g. Docker (containers), Packer (typically prod images), Vagrant (typically dev images) - create an image containins OS, software, config - can use e.g. Ansible to install across all servers
4. Server provisioning tools - Terraform, CloudFormation, OpenStack Heat

A virtual machine (VM) emulates an entire computer system including hardware
- images only see 'virtualised hardware'
- running different OSs for each VM takes a lot of resources e.g. CPU, memory, startup time

A container emulate the user space of an OS
- a container engine creates different processes, mount points, networking
- isolation isn't as secure as VMs
- because the kernel and hardware are shared, your containers can boot up in milliseconds and have virtually no CPU or memory overhead.

Common pattern: Use Packer to create an AMI containing the Docker Engine, deploy to a cluster of servers in AWS, deploy Docker containers across the cluster.

Immutable infrastructure (e.g. using server images) - idea is it never changes - if you need to make changes, e.g. new version of the code - you create a new image.

## How Terraform Compares to Other Infrastructure as Code Tools

* Configuration management versus provisioning - tools fall into one category or the other, but some overlap - however common to a provisioning tool AND config mgmt tool
* Mutable infrastructure versus immutable infrastructure - generally better to use immutable approach, BUT might be a lot of overhead for minor changes
* Procedural language versus declarative language
* Master versus masterless - some tools require a master server, requires more infrastructure to deploy, maintain and secure
* Agent versus agentless - some tools require agents on each client machine to apply configs - bootstrapping is the most obvious issue
* Large community versus small community
* Mature versus cutting-edge

# Chapter 2. Getting Started with Terraform

    


