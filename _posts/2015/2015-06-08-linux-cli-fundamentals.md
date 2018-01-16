---
layout: post
title: "Linux CLI Fundamentals"
---
* vi is vim - on most systems vi is symlinked to vim - vim = vi improved
* modal editor - there are 3 modes of operation: 
  * command mode
  * edit mode - type ESC to go back to command mode
  * last line mode - type : to enter from command mode

## Basic commands

### Opening and closing a file

    $ vi newfile       # to create a new file
    :q                 # to enter last line mode and then quit
    :q!                # to enter last line mode and quit without making any changes (e.g. if you have edited a file)

### Editing and saving a file

    $ vi newfile    
    i                  # to enter insert mode
    [enter text]
    ESC                # to return to command mode
    :                  # to enter last line mode
    w                  # to save
    x or wq            # to save and exit

### Ways to enter insert mode

    $ vi newfile
    i                  # insert at cursor position
    I                  # insert at start of current line
    a                  # append to cursor position
    o                  # insert line below
    O                  # insert line above

### Miscellaneous commands in command mode

    x                  # delete the character under the cursor
    dw                 # delete the word under the cursor
    u                  # undo

### Line navigation

    7G                 # go to line 7
    7gg                # go to line 7
    w                  # forwards one word
    b                  # backwards one word
        


