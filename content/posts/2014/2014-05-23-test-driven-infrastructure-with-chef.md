---
layout: post
category: 
tags: []
---

## Chapter 3: An introduction to Chef

### Exercise 1: Install Chef

Omnibus installer: installs chef on a server, client or node.

chef-apply: allows a single recipe to be run from the command line

chef-solo: limited chef client which uses locally stored cookbooks to apply to its own node.
* can retrieve cookbooks from local directory or from a remote url (common)
* node-specific attributes are not retrieved from chef, but most be located in a local file, remote url etc
* data bags, roles, environments are all located in default locations locally
* Opscode docs: <http://docs.opscode.com/chef_solo.html>

chef-client:

chef-shell:

knife: 