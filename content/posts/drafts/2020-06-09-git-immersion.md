---
layout: post
title: "Git Immersion"
---

## Recommended aliases for ~/.gitconfig

```
[alias]
  co = checkout
  ci = commit
  st = status
  br = branch
  hist = log --pretty=format:'%h %ad | %s%d [%an]' --graph --date=short
  type = cat-file -t
  dump = cat-file -p
```

## 12. Getting Old Versions

- Get by hash: `git checkout 431fdae`
- Tag: `git tag v1`
- Get by tag: `git checkout v1`
- Get parent of tag: `git checkout v1^` OR `git checkout v1~1`

## 14. Undo local changes BEFORE staging

- `git checkout hello.rb`

## 15. Undoing Staged Changes before committing

- `git reset HEAD hello.rb`
- and then to get back the original version (as before): `git checkout hello.rb`

## 16. Undoing Committed Changes (new commit)

- `git revert HEAD` to revert the last change (the HEAD) with a new commit
- `git revert bd1c629` to revert to a particular commit (may have to resolve conflicts)

## 17. Removing Commits from a Branch

Note `reset` is usually safe for local repositories but can be confusing if the branch is shared on a remote. Useful to set a tag to the current commit in case things go wrong e.g. `git tag oops`

- `git reset --hard v1` to reset the branch, using a tag or a hash (`--hard` specifies to also update the working directory)
- `git log --all` will show all the commits (they are still there. Commits that are unreferenced remain in the repository until the system runs the garbage collection software. Will be run on anything not tagged.)

## 19. Amending commits

- `git commit --amend -m "Amended commit message"`

## 23. Using `type` and `dump`

Query hashes in a commit history to check the `type` of object and the `dump` of the object.

- `git cat-file -t 88d698c` to display the type of object e.g. commit, tree, blob
- `git cat-file -d 88d698c` to display a "dump" of the object

## 27. Viewing diverging branches

- `git log --all` to view all branches, not just currently checked out one

![git log --all](https://www.dropbox.com/s/jthdzitim2qdnsi/Screenshot%202020-06-13%2021.31.01.png?raw=1)

## 28. Merging two divering branches

The mainline branch (master) should be merged into a topic (greet) regularly. However, the commit graph doesn't look good (see rebasing later).

- `git checkout greet`
- `git merge master` to merge any changes from master onto greet

![after merging](https://www.dropbox.com/s/qk4qrqnv6slqurd/Screenshot%202020-06-13%2021.34.00.png?raw=1)

## 36. Rebasing

Rebasing rewrites the commit history, so it is much cleaner, but since it is rewritten, shouldn't be used with anything but local branches.

- `git checkout greet`
- `git rebase master`
