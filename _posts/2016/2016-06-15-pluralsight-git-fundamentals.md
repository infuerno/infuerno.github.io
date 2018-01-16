---
layout: post
title: "Pluralsight: Git Fundamentals"
---
## History

* 1st Generation - single file
* 2nd Generation - multiple file - centralized e.g. SVN, TFS
* 3rd Generation - works on change sets - distributed e.g. Git, Hg, Bazaar, BitKeeper

## Configuring Git

* System configuration using `git config --system` stored in /etc/gitconfig
* User configuration using `git config --global` stored in ~/.gitconfig
* Repo configuration using `git config` stored in .git/config in each repo

`git config --global --list` - see global configurations
`git config --global user.name "Claire Furney"` to configure the user name
`git config --global core.editor vim`
`git config --global help.autocorrect 1` to configure fuzzy matching on git commands
`git config --global color.ui auto`
`git config --global core.autocrlf input` can be one of `true|false|input` (generally set to `true` on Win and `input` on Mac OSX)
`git config --global alias.lga "log --graph --oneline --all --decorate"`

More specific override more general, so you can override certain settings just for a particular repo.

## Working Locally with Git

`git init` - initialise a new repo
`git add README.txt` - add a new file to be staged for commit
`git add -u` - stage any updated files (will notice updates or deletes, any files it already knows about)
`git add -A` - add all files including any untracked ones (careful not to add anything you don't want tracked)
`git log` - to show commit history
`git diff dd6819a..a15ec6b` - to diff two commits
`git diff HEAD~1..HEAD` to diff the penultimate commit (HEAD~1) and the latest commit (HEAD)

By staging and commiting in two parts, you can stage and commit different unrelated changes separately.

Use `rm` or `mv` as normal to delete or rename files, stage any changes and commit them, Git will recognise renames as such.

`git checkout README.txt` will by default checkout the HEAD version of a file and overwrite any local changes
`git reset --head` will checkout all changes from HEAD, overwriting any local changes
`git reset --soft HEAD~1` will checkout the HEAD~1 commit with the latest changes previously committed staged
`git reset --hard HEAD` will checkout the HEAD~1 commit and lose all previously committed changes

`git clean` cleans up a working copy and removes any unstaged files
`git clean -n` shows what if information
`git clean -f` forces the clean

## Working Remotely with Git

`git log --oneline` shows commit messages on one line
`git log --oneline | wc -l` pipes this into `wc` to count the number of commit messages (`-l` = number of lines)
`git log --oneline --graph` to show a simple graph of branches
`git log --oneline --all --decorate` to show any tags, labels
`git log origin/master` to show the logs 
`git shortlog` shows commits by author
`git shortlog -sne` shows summary (no commit msgs), numerically by number of commits, emails included
`git show HEAD` to show details of the last commit, use HEAD~1 or HEAD~10 or just the sha hash to show other commits

`git remote` to show your remotes
`git remote -v ` to show the details of the remotes

`git reflog` to show the log of where HEAD has been pointing

### Git Protocols

http(s) on ports 80 and 443 e.g. https://github.com/jquery/jquery.git - read/write; password for auth
git protocol on port 9418 e.g. git://github.com/jquery/jquery.git - read only; anonymous only
ssh on port 22 e.g. git@github.com:jquery/jquery.git - read/write; ssh keys for auth
file e.g. /Users/claire/repos/jquery - read/write; local only

### Branches

Branches are simply labels on the sha1 commits, but following along with more recent commits.

`git branch` shows the local branches
`git branch -r` shows the remote branches
`git branch -v`
`git remote add [remote-alias] [remote-url]` if you use the ssh version it will be able to push without creds if ssh keys have been set up
`git fetch`
`git merge origin/master` merge from origin/master in to current local branch - get a message fast-forward, then no merging / commiting needed to be done and git was able to just move the HEAD pointer to the latest commit
`git pull` will only work if you have already specified an upstream remote tracking branch
`git pull origin master` if you haven't specified the upstream branch - same as git fetch && git merge origin/master
`git remote rm origin` to remove a configured remote
`git branch feature1` to create a new feature1 branch
`git checkout feature1` to switch to it
`git checkout -b feature2` to create a new branch and switch to it
`git branch fix1 a15ec6b` to create a branch of a particular commit, and then `git checkout fix1`
`git branch -m fix1 bug1234` to rename a branch


### Tags

Tags are labels on the sha1 commits which never change (unlike branches).

`git tag v1.0`
`git tag -a v1.0` to add a message
`git tag -s v1.0` to sign a tag

### Stash

Useful way as a temporary holding area for changes you don't want to commit to a branch, but you don't want to lose.

`git stash` to rollback any uncommitted changes on the current branch and stash those changes
`git stash list` to list current stashes
`git stash apply` to reapply the uncommitted changes from the stash, stash stays in stash list
`git stash pop` to reapply the uncommitted changes from the stash, stash is removed from stash list
`git stash drop` to drop things from the stash list
`git stash branch feature3` to create a branch from a stash, stash is popped

### Merging

`git merge feature1` will merge the feature1 branch in the the current local branch
`git mergetool` to resolve any merge conflicts
`git diff --cached` compare the repo to the staging area

### Rebasing

`git rebase master` rebase your changes on top of master - useful after pulling in any recent repo changes to master. If there are any conflicts with this, then run `git mergetool` to resolve these
`git rebase --continue` to retry the rebase




