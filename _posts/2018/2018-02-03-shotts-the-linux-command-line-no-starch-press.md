---
layout: post
title: "Shotts, The Linux Command Line, No Starch Press"
---
## Learning the Shell

* `df` - free disk space
* `free` - free memory
* `date` - current date
* `cal` - show a calendar

User prompt ends with `$`, super user prompt ends with `#`

### Common ls Options
Option | Long Option | Description
---|---|---
-a | --all | all files, including hidden
-d | --directory | with -l show details about the directory rather than its contents
-F | --classify | append an indicator character to end of each item (e.g. forward slash if name is a directory).
-h | --human-readable | with -l display file sizes in human-readable format rather than in bytes
-l | | long format
-r | --reverse | display results in reverse order
-S | | sort results by file size
-t | | sort by modification time

### Fields in long listing

-rw-r--r-- 1 root root 453764 2012-04-03 11:05 oo-welcome.odt

1 = File's number of hard links (often 1)
root = user who owns the file
root = group who owns the file
453764 = size in bytes
2012-04-03 11:05 = last modified date

### Directories Found on Linux Systems

Directory | Comments
---|---
/ | root directory
/bin | binaries for the system to boot and run
/boot | Linux kernel (/boot/vmlinuz), initial RAM disk image (drivers needed at boot time), boot loader
/dev | list of all devices
/etc | system wide config files, shell scripts for starting system files
/lib | shared library files for core system programs
/lost+found | used in partial recovery situations, usually empty
/media | mount point for CD drives etc
/mnt | older systems manual mount point for removable drives
/opt | optional software
/proc | virtual file system maintained by the kernel - not a real files system - but all files are readable
/root | home directory for the root account
/sbin | system binaries
/tmp | temporary files
/usr | all programs and support files used by regular users
/usr/bin | binaries installed by the linux distro - usually 1000s of programs
/usr/lib | shared libraries for /usr/bin
/usr/local | system wide, but usually not via the linux distro, but via a sys admin user e.g. /usr/local/bin is where programs compiled from source usually go
/usr/sbin | more system binaries (TODO what is the difference between here and /sbin?)
/usr/share | shared data for programs in /usr/bin e.g. default config files, icons
/usr/share/doc | documentatino
/var | storage for data which is likely to change e.g. logs, databases, email
/var/log | log files - /var/log/messages is important

### Wildcards

* `*` any character
* `?` any single character
* `[characters]` any character in set 'characters'
* `[!characters]` any character NOT in set 'characters'
* `[[:class]]` any character of the specified class e.g. `[:alnum]`, `[:alpha]`, `[:digit]`, `[:lower]`, `[:upper]`

### Manipulating files
#### `cp`

* `cp -a item1 item2` additionally copy attributes including ownership and permissions (usually copies take on the default attributes of the user performing the copy)
* `cp -u item1 item2` copy only files which don't exist or are newer
* `cp -i item1 item2` interactive
* `cp -r item1 item2` recursive
* `cp -v item1 item2` verbose
* `cp file1 file2 dir1` copy file1 and file2 to dir1 (dir1 must exist)
* `cp dir1/* dir2` all files in dir1 are copied to dir2 (dir2 must exist)
* `cp -r dir1 dir2` recursively copy files in dir1 to dir2
    - IMPORTANT if dir2 exists, dir1 will be copied within it, if dir2 doesn't exist it will be created and will hold the same contents as dir1

#### `mv`

* `mv dir1 dir2` move dir1 and its contents to dir2
    - IMPORTANT if dir2 doesn't exists, dir1 will effectively be renamed dir2

#### `rf`

* `rf -f` ignore nonexistent files and do not prompt - TODO what does this mean?

### Commands

A command is one of:
* an executable binary or script
* a command built into the shell itself e.g. `cd` is a bash _shell builtin_
* a shell function - minature shell scripts incorporated into the environment
* an alias

* `type` shows which of the 4 a particular command is e.g. `type cd` gives `cd is a shell builtin`
* `which` shows the location of an executable (doesn't necessarily work for shell builtins)
* `help` help command for shell builtins e.g. `help cd`
* `--help` often supported by executable programs to show similar usage information e.g. `mkdir --help`
* `man` display a commands man page - if no section is specified the first section available is shown - most likely section 1 - to show a specific section use e.g. `man 5 passwd` - man pages are stored in `/usr/share/man` under the appropriate section diretory
    Section | Contents
    ---|---
    1 | User commands
    2 | Programming interfaces for kernel system calls
    3 | Programming interfaces to the C library
    4 | Special files such as device nodes and drivers
    5 | File formats e.g. `man 5 passwd`
    6 | Games and amusements such as screensavers
    7 | Miscellaneous
    8 | System administrator commands e.g. `man mount`
* `apropos` search man titles and descriptions for a keyword or similar term (`man -k` does the same thing)
* `whatis` matches man titles and descirption for a keyword exactly
* `info` GNU alternative to `man` e.g. `info ls` - tree-structured - most commands are in the coreutils.info
* `alias name='string'` set up an alias - remove with `unalias` - `alias` on its own lists all defined aliases


### I/O Redirection

`stdout`, `stderr` and `stdin` can be thought of as files where the output for `stdout` and `stderr` is by default connected to the screen and the input for `stdin` is, by default, connected to the keyboard. These can be redirected using I/O redirection.

* `ls -l /usr/bin > ls-output.txt` redirects stdout to a file (if any errors these still go to stderr, which by default is still printed to the screen - in this case the file will be created or truncated before the error happens since > replaces content rather than appending content)
* `>>` appends content e.g. `ls -l /usr/bin >> ls-output.txt`
* File descriptors can alternatively be used to redirect stdin, stdout and stderr (and is the only way to redirect stderr). These are 0, 1 and 2 respectively. `2>` redirects stderr e.g. `ls -l /usr/idontexist 2> ls-error.txt`
* `2>&1` redirects stderr to file descriptor 1 i.e. stdout so `ls -l /bin/usr > ls-output.txt 2>&1` will redirect stdout to a file and then stderr to the same destination i.e. also a file
* `&>` shorthand for `2>&1` (recent versions of bash only)
* `2> /dev/null` to discard anything sent to stderr
* `cat` concatenates files and can be used with redirection to rejoin files which have been split e.g. `cat movie.00* > movie.mp4` (crucially for this wildcards expand in sorted order)
* `cat` without any arguments uses stdin - ctrl-d (EOF) to terminate
* `<` redirects stdin e.g. `cat < lazy-dog.txt` redirects the file lazy-dog.txt to stdin with the result that `cat` prints the contents of the file (`cat` uses stdin when no arguments are passed)
* `|` pipes the standard output of one command to the standard input of another command
    - e.g. `ls -l /usr/bin | less`
* `uniq` removes duplicates from a `sort`ed list
* `uniq -d` only displays duplicates from a `sort`ed list
* `wc` prints line, word and byte counts (all 3, tab seperated)
    - without arguments uses stdin (so often used at the end of a pipeline to count things)
* `grep pattern [files...]` where pattern is a regex
    - option `-i` ignores case
    - option `-v` prints lines which DON'T match
* `tail -f [file]` to tail a file real time
* `tee` reads from stdin and redirects to stdout AND files (hence a T on the pipeline)
    - e.g. `ls /usr/bin | tee ls.txt | grep zip` will capture the output of `ls /usr/bin` to a file as well as passing it into `grep zip`

## Configuration and the Environment

### A Gentle Introduction to VI

* Most commands can be prefixed with a number e.g. `5j` to move down 5 lines
* `u` undo
* `a` append after end of word
* `A` append to end of current line
* `o` open a line below the current line
* `O` open a line above the current line
* `G` go to the last line in the document
* `dd` cut the current line
* `dw` cut to start of next word
* `d$` cut to end of line
* `d0` cut to beginning of line 
* `p` paste after current line
* `P` paste before current line
* `yy` 'yank' the current line (i.e. copy) - then similar combinations to cut

 

