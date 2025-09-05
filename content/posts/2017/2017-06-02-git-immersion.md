---
layout: post
title: "Git Immersion"
---

Reference: http://gitimmersion.com

Notes ONLY of parts which were a useful reminder (and only up to Lab 35 so far)

## Getting old versions

- `git checkout <hash>` to checkout a previous revision
- `git checkout master` by checking out a branch by name, you automatically go to the latest version of that branch

## Tagging versions

- `git tag v1` to tag the current version
- `git checkout v1^` (or `v1~1`) to checkout the version immediately prior to v1

## Undoing staged changes

- `git reset HEAD <filename>` will undo the staging of a file (but not the actual changes)
- `git checkout <filename>` to actually revert to the commited version once unstaged

## Undoing commited changes

There are several ways to achieve this. A safe way is to simply create a new commit that reverses the unwanted changes.

### Revert

- `git revert HEAD` will revert the last change, opening the editor
- `git revert HEAD --no-edit` will just revert it

NB you can only revert the last change this way. Reverting a second time will revert the revert!

### Removing commits

- `git reset <hash>` or `git reset <tag>` will reset the HEAD to that point removing subsequent commits
- Using `--hard` will also reset the files in the working directory

IF one of these commits was tagged, `git log --all` will show them, they aren't lost. However, any that aren't tagged will be removed when garbage collection is run.

_IMPORTANT_ Using `reset` on non local branches can be dangerous.

### Amending a commit

If it is a simple amendment, just stage and commit using the `--amend` flag when committing. Original commit note will also be replaced.

`git commit --amend -m "Add change, add additional amendment`

## Type and Dump

`git cat-file -t <hash>` to show the type of a particular entry
`git cat-file -p <hash>` to dump the detail of a particular entry

## Merge

Merge master branches into working branches regularly to pick up any changes. Ensure the working branch is checked out and use `git merge master`. NB produces ugly commit graphs.

### Conflicts

Any conflicts experienced when merging down from master need to be manually resolved and then committed in the working branch.

## Rebase

Instead of using `merge`, use `rebase` e.g. on the working branch, rebase from master using `git rebase master`. The result is the same, but the commit history is much cleaner (and not accurate). Since rebase messes with the commit branch, its fine for local short lived branches, but stick to `merge` for branches in a public repo.
