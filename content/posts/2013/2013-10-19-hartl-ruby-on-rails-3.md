---
layout: post
---
##Chapter 1 From Zero to Deploy

> You can think of Ruby on Rails Tutorial as a video game where you are the main character, and where you level up as a Rails developer in each chapter. (The exercises are the minibosses.)

> The large number of Rails programmers also makes it easier to handle the inevitable application errors: the “Google the error message” algorithm nearly always produces a relevant blog post or discussion-forum thread.

> In the process of getting your development environment up and running, you may find that you spend a lot of time getting everything just right. The learning process for editors and IDEs is particularly long; you can spend weeks on TextMate or Vim tutorials alone. If you’re new to this game, I want to assure you that spending time learning tools is normal. Everyone goes through it. Sometimes it is frustrating, and it’s easy to get impatient when you have an awesome web app in your head and you just want to learn Rails already, but have to spend a week learning some weird ancient Unix editor just to get started. But a craftsman has to know his tools; in the end the reward is worth the effort.

### Other resources

To learn ruby first, try the book [Beginning Ruby](http://www.amazon.co.uk/Beginning-Ruby-Novice-Professional-Experts/dp/1430223634) by Peter Cooper.

Following completion of this tutorial the following are recommended:

* [The Well-Grounded Rubyist](http://www.amazon.co.uk/Well-Grounded-Rubyist-Get-ebook-FREE/dp/1933988657) by David A. Black
* [Eloquent Ruby](http://www.amazon.co.uk/Eloquent-Ruby-Addison-Wesley-Professional/dp/0321584104) by Russ Olsen 
* The Ruby Way by Hal Fulton

Further rails specific resources include:
* RailsCasts by Ryan Bates: Excellent (mostly) free Rails screencasts
* PeepCode: Excellent commercial screencasts
* Code School: Interactive programming courses
* Rails Guides: Good topical and up-to-date Rails references

### Scaffolding
* 15-minute weblog video by Rails creator David Heinemeier Hansson
* Now updated as the 15-minute weblog using Rails 2 by Ryan Bates

### Setting up Ruby and Rails

Gems
: Ruby programs are typically distributed via gems, which are self-contained packages of Ruby code. 

Gemsets
: Self-contained bundles of gems to overcome conflicts between different versions of gems

RubyGems
: Package manager for Ruby projects

### Creating a new rails app

    rails new <app-name>        // creates basic rails app directory structure and files
    bundle install              // installs all gems required in the Gemfile
    bundle install --without production     // without anything marked as production
    rails server                // run the rails app

### Configuring a Git repository

    git init                        // configure a git repository in the current directory
    pico .gitignore                 // check .gitignore
    git add .                       // add all files to Git recursively to a _staging_ area
    git status                      // check all files that have been staged
    git commit -m "Initial commit"  // commit the files

**Note:** This commits to the local git repository. `git push` can be used to push to a remote repository.

    git log                         // show log messages

### Push to GitHub

Create the empty repository on GitHub.

    git remote add origin https://github.com/xubik/first_app.git
    git push -u origin master

### Using Git - branch, edit, commit, merge

#### Branch

In order to make changes a good workflow initially involves branching the master branch and working on a copy.

    git checkout -b modify-readme   // make a new branch called modifiy-readme and switch to it
    git branch                      // lists all branches, current branch is denoted with a *

#### Edit

Make necessary changes to file. If adding new files, renaming or deleting files, be careful that all are staged in the next step.

#### Commit

    git add .                       // add all changed files to staging
    git rm README.rdoc              // delete a file to staging
    git commit -m "Improve README"  // commit all changes to local branch

#### Merge

The changes on the local branch can now be merged back to master. First make the master the working branch, and then merge the changes.

    git checkout master             // make master the working branch
    git merge modify-readme

If you no longer need the top branch, it can be deleted.

    git branch -d modify-readme     // delete a branch

If you mess up a branch you can use -D which will delete a branch even when changes have not been merged.

    git checkout -b topic-branch
    <really screw up the branch>
    git add .
    git commit -a -m "Screwed up"
    git checkout master
    git branch -D topic-branch

### Deploy to Heroku

#### Install the Heroku Toolbelt

Don't use the gem, this has been deprecated. Download and install the toolbelt.

#### Authenticate with Heroku

    heroku login

#### Create a place on Heroku to host the application

    heroku create

#### Deploy the application

    git push heroku master

The application should now be visible at the url displayed at the create step. Or use `heroku open`.

#### Rename

On create a random name will be assigned. This can be renamed to give a .herokuapp.com sub domain url. The name must not already be in use.

    heroku rename railstutorial

##Chapter A A Demo App







