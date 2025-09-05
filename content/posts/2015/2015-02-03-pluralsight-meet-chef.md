---
layout: post
title: "Pluralsight - Meet Chef"
---
## Introduction

Chef is a ruby framework for automating, reusing and documenting server configuration.

An important idea is *idempotence* meaning you can run a script several times, but if it has already been run, it won't change anything

Adam Wiggans: <http://12factor.net/>

Other tools: Puppet, CFEngine

## Terminology

:node
A host where the chef client will run

:Chef client
The comman line program that configures the servers. You will often log into the server and run the client from the command line on that node.

:Chef server
Stores information about the nodes. REST based.

:Chef solo
A standalone version of the client which doesn't use a server

:recipes
A single file of Ruby code that contains commands to run on a node

:resources
A node's resouces includes files, directories, users and services

:cookbook
A collection of recipes

:roles
Concept chef uses to group specific functionality e.g. web role, database role

:runlist
An array of recipes and roles defining what gets run on that server

:attributes
variables which get passed into recipes and templates e.g. version of software to install

:template
erb file similar to a rails view usually used to create and update configuration files

:notification
When a resouce is changed it can trigger an update in another resource

## Using VirtualBox and Vagrant

1. git clone 
2. `cd` into directory
3. `vagrant up` to download the .box image, configure and start it
4. `vagrant ssh` to ssh into the server as the vagrant user
5. `ruby -v` and `gem -v` to check that ruby and rubygems are both installed

## Writing a simple cookbook and recipe

1. Create a directory for the cookbook (Nginx)
2. Create directories for recipes, attributes and templates
3. Create a default.rb in the recipes directory - default recipe is a good place to set up the service or process and master configuration template - a default recipe shouldn't do much more than this
4. First need to install the nginx package itself e.g. with debian this would be `apt-get nginx`. The chef directive `package "nginx"` will figure out how to install this package on this os. Specify a version if really necessary.
5. Secondly we want to start, stop and restart the nginx server, so need to install as a service. This can be done using the chef directive `service "nginx"`.
6. We also want to get the status, start and reload the service, so it must support these.
7. We also want the service to "be started" when the os boots and also when chef runs. Normally need to check run levels etc, but with chef the `action` directive can be passed an array with `:enable` to make sure it is started when the os starts and `:start` to ensure chef will start nginx if it isn't already running
8. To configure the .conf file for nginx, it is best to start with the default .conf. For this it may be necessary to manually install nginx to see this default file, then write the chef recipe to modify it, then run the whole chef install to check it all works correctly - good to use virtual machines in this instance. The `template` block can take further directives to e.g. restart the service anytime the config file is updated

## Running chef

1. Install chef solo using a ruby gem `gem install chef --no-rdoc --no-ri`
2. Run `chef-solo`

### Attributes

Attributes or variables are applied according to a hierarchy.

Cookbook > Environment > Role > Node

1. Cookbook attributes give good default attributes e.g. 5 worker processes for Nginx
2. Environment attributes can override this, e.g. 1 worker process for a development environment
3. Role attributes override environment attributes - a web server may actually need 6 worker process for Nginx to handle all the requests
4. Finally node attributes override everything else, e.g. web server 42 is older and should only define 2 worker processes

Default > Normal / (Set) > Override > Automatic

Most people name their cookbook attribute files `default.rb` but this could get confusing with all the other things called default. All files in a cookbook get loaded, so you are free to call your file anything you like.

This file contains cookbook default attributes. Default attributes are usually all that is required.

Attributes can be defined using ruby symbols, strings or dot notation:
    
    default[:nginx][:worker_processes] = 4
    default["nginx"][:worker_processes] = 4
    default.nginx[:worker_processes] = 4

This attribute can be referred to in the template file using the following syntax:

    <%= @node[:nginx][:worker_processes] %>

The @node object holds all the attributes, defined either on a cookbook, environment, role or node.

An alternative is to define the variable directly in the recipe in the parameters which get passed to the template. HOWEVER, default attributes are preferred over variables.

    template "/etc/nginx/nginx.conf" do
        source "nginx.conf.erb" # chef will automatically look for this, so this is not required unless we are not using the default
        notifies :reload, "service[nginx]"
        variables :user => "www-data"
    end

Try not to go overboard replacing all values in template files with attributes. Defaults are often good enough.

### Providers and Resources

Seldomly used, but useful for auxillary configurations e.g. nginx virtual hosts. Used to create LWRPs (Light Weight Resource Providers). 

## Add an SSH key to a Virtual Server

Copy your own ssh key (in ~/.ssh/) to the clipboard `pbcopy < ~/.ssh/id_rsa.pub` and paste it into the authorised keys on the vagrant box (in ~/.ssh/authorized_keys)

## Write a recipe (everything required for serving a rails app)

Deploying rails app requires many config files (Nginx virtual hosts file, app server config file such as Passenger or Unicorn). This will be done with a single recipe.

### Check the unicorn recipe

The unicorn recipe does 3 things:
1. Installs the unicorn gem package via chef (could also be done using the rails app itself and bundler)
2. Creates a directory to store unicorn configuration files
3. Installs a cookbook file i.e. a static file, stored in the cookbook which can be copied to the node

### Write the rails recipe

1. Create a directory for the cookbook (Rails)
2. Create directories for recipes, attributes and templates
3. Create a default recipe which will need to:
    i. run the Nginx and Unicorn installers - `include_recipe "nginx"`
    ii. create a metadata file to define dependencies (similar to bundler) - typically only used in chef server, but good practise to include for chef solo too
    iii. include bundler and create some directories
    iv. configure the unicorn app server
    v. configure nginx to serve the application as a virtual host




