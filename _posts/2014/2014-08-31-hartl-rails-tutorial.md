---
layout: post
category: 
tags: []
---

## Rails Tutorial

### Set up

* `rails new project_name` (or `rails new project_name --database=postgresql`)
* `cd project_name`
* `subl .` to open the new project directory in sublime text
* Edit the Gemfile
* `bundle install --without production`
* `bundle upgrade` to upgrade all gems to the most recent version
* `bundle install`
* Edit the .gitignore
* `git init`
* `git add -A`
* `git commit -m 'Initial commit'`
* Edit the README.rdoc and rename to README.md using `git mv`, commit changes
* `git remote add origin git@bitbucket.org:<username>/sample_app.git`
* `git push -u origin --all`
* `heroku create`
* `git push heroku master`

* `git checkout -f` to force checkout of files from repo, overwriting any local changes
* `git checkout -b new-branch` to create and switch to a new branch

### Branch, edit, commit, merge

* `git checkout -b new-branch-name`
* Edit
* `git commit -am 'Commit message'`
* `git push -u origin new-branch-name` to push new branch to bitbucket for first time (subsequent times can use `git push`)
* `git checkout master`
* `git merge new-branch-name`

### Heroku

* `heroku login`
* `heroku keys:add`
* `heroku create`
* `git push heroku master`
* `heroku open`
* `heroku logs`

### Generate 

* `rails generate controller ControllerName action1 action2`
* `rails destroy controller ControllerName action1 action2` to reverse the controller generation
* `rails generate model User name:string email:string`
* `rails destroy model User` to reverse the model generation
* `rake db:migrate`
* `rake db:rollback` to rollback the migration
* `rake db:migrate VERSION=0` to rollback to the version number specified (0 = right to the beginning)
