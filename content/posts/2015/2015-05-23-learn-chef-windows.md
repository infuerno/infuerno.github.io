---
layout: post
title: "Learn Chef Windows"
---
## Set up

Install the chef-dk from <https://downloads.chef.io/chef-dk/>
Install git.

## Configure a resource

* Use powershell as the shell, run as Administrator
* Create a directory `chef-repo` at the root of the home directory and cd into it
* Create recipes written in ruby to manage resources
* Resources e.g. `file`s have a default action, and recipes declare what state a resource should be in (but not how to achieve that state). In the sample recipe below, the default action for a file is `:create` so doesn't need to be specifed in this instance.

    file 'C:\Users\Administrator\chef-repo\settings.ini' do
        action :create
        content 'greeting=hello world'
    end

* Use `chef-apply <filename>` to run a recipe directly
* Resources are applied in the order in the recipe, so order is important
* Actions are applied in the order stated, so order is important
* Resource attributes are an example where order doesn't matter

    file 'C:\temp\settings.ini' do
        action :create
        mode '0755'
        group 'root'
        owner 'root'
    end

## Using cookbooks

* Create a directory `cookbooks` and cd into it
* Use `chef generate cookbook <cookbookname>` to create a new cookbook
* Use `tree /F` to view the directory contents
* Use `chef generate template <cookbookname> <templatename>` to create templates (e.g. index.html.erb), created under templates/default
* Use `chef generate template <cookbookname> <recipename>` to create recipes
* Use `chef-client` to run the cookbook

    `chef-client --local-mode --runlist 'recipe[cookbookname]` # runs the default recipe in a cookbook
    `chef-client --local-mode --runlist 'recipe[cookbookname::recipename]` # to run a specific recipe
    `chef-client -z -o <cookbookname>`



