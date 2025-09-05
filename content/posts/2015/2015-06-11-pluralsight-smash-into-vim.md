---
layout: post
title: "Pluralsight - Smash into Vim"
---
## Philosophy

There are 5 modes:
* Normal / Command mode - Vim starts in this mode
* Insert
* Visual
* Replace
* Command-line

d2w
delete - two - words
operator - count - motion    

### Help

`:h <term>` e.g. `:h movement`
`:bd` to exit (`b`uffer `d`delete)

### Conventions

* Upper case commands are usually supersized versions of their lower case counterparts
  - `i` inserts text at the cursor, `I` inserts text at the start of the line
  - `w` moves the cursor forward one word, `W` moves the cursor forward to the next space

## The Basics

`h` left
`j` down
`k` up
`l` right, `6l` right 6 letters

`yy` yank line
`p` paste below cursor
`P` paste above cursor
`i` insert text before cursor
`a` append text after cursor

`fN` jump forward to first `N`
`3fN` jump forward to third `N`
`w` forward one word
`3w` forward three words
`b` back one word
`cw` change word
`3cw` change 3 words
`u` undow
`ctrl-R` redo

`:w` write
`:w!` write without confirmation
`:q` quit
`:q!` quit without confirmation
`:wq` write and quit

Vim comes with syntax highlighting of over 500 file types. 
Use `Ctrl-c` or `Ctrl-[` as equivalent keys to `Esc` OR just use `Alt` plus the normal modifier which will automatically put you back in normal mode.

`:w !sudo tee %` will allow you sudo rights to write to a file you didn't open with sudo permissions - `!` executes a shell command, and `%` expands to the current filename (i.e. `:w !sudo tee example.conf` -> `cat example.conf | sudo tee example.conf` meaning editor contents are piped to the file example.conf with root permissions)


