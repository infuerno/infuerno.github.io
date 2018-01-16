---
layout: post
title: "Pluralsight - Linux Installation and Configuration"
---
## Introduction

: Linux
Kernel or core software

: Distribution
e.g. Suse, Redhat, Ubunto

* `uname -r` will report the kernel version
* `lsb_release -a` will usually report the release

* `ctrl-shift-+` to enlarge the font
* `ctrl-l` clear screen
* `ctrl-d` exit terminal

* `free` to give you memory usage
* `free -m` to give memory usage in bytes

## Determine Hardware Settings

Physical consoles are number tty1 to tty6. Psuedo terminals represent logical terminals such as GUI or X-Terminals and those made from SSH clients.

* `tty` to show which terminal you are connected to
* `who` or `w` to show people connected to the terminals 
* `ctrl-alt-f1` to go to tty1 etc or `sudo chvt 1` from a terminal
* `ctrl-alt-f7` to return to the graphical environment (or `sudo chvt 7`)

### Resource Interrogation

* `lsusb`, `lspci`, `lsscsi` to list the contents of various buses
* `free` shows memory available
* `uname` to interrogate the kernel
* `uptime` to see how long the system has been running
* `hwinfo` shows information on the hardware

### Pseudo File Systems

These "file systems" contain information about the currently running system. It only exists while the system is running and only in RAM.
* `/dev` the actual devices as they are connected and can be created dynamically
* `/sys` has metadata about these devices
* `/proc` information about the current control set / running processes
  - e.g. `/proc/meminfo` shows full version of the info from `free`
  - e.g. `/proc/interrupts` shows interrupts to the processor; indexes 1-15 are hardware interrupts, above 15 are software interrupts; number of interrupts per second is a useful indication of how busy a cpu is
    - `head -n 10 /proc/interrupts` shows just the first 10 entries
    - `watch -n1 head -n 10 /proc/interrupts` will show you a watch which refreshes every second
  - e.g. `/proc/<number>` represents a running process; 1 is always the `init` process; this list the resources this process is currently using

* `ps` shows the process of the current shell
* `alt-f2` to open a graphical application finder

## Managing the Boot Loader and Understanding Run Levels

* `shutdown -r now` to reboot the system immediately
* `shutdown -r +5` to reboot in 5 minutes time
* `shutdown -r 18:27` to reboot in 5 minutes time
* `shutdown -r +5 &` to background this job
* `shutdown -c` to cancel any shutdown jobs
* `shutdown -h` to poweroff or halt the system

* `jobs` to show a list of background jobs
* `fg` to bring any background jobs to the foreground

* `runlevel` to show the current run level, or `who -r`
* `init 6` will also reboot

### Bootloader

The bootloader or bootstrap file is responsible for loading the kernel into memory. It may be located on the network (PXE boot) or in the master boot record.

* GRUB Legacy is used on many enterprise systems
* GRUB2 will utlimately replace this
* EXTLINUX e.g. as used by Citrix Xen Server
* LILO older bootloader

At the grub boot menu enter `e` to edit an entry or `c` to go to a grub command line

### Run Levels and Init

There are usually 6 run levels: 0 (Halt); 1 (Single User - root only); 2 (Multi-user, no network or GUI - though Ubuntu tends to use 2 for normal mode); 3 (Multi-user, no GUI); 4 is not implemented; 5 (Multi-user); 6 (Reboot)

When the system boots the init daemon reads a file to find the default run level. The old SysV init scripts used to work with `/etc/inittab` to specify the default run level and then directories such as /etc/rc3.d for the service scripts.

Newer distros use `upstart` and the `/etc/init` directory. e.g. on Ubuntu the default run level is set in `/etc/init/rc-sysinit.conf`

The boot menu can be configured by editing the `/etc/boot/menu.lst` file. Further command line options can be specified here, or after the boot menu has loaded e.g. `3` to enter run level 3; `init=/bin/bash` to just load up bash (handy for resetting a root password if unknown since this will automatically log you in)

### Service Control

* `service <name> start|stop|restart|status` (links to the service scripts in `/etc/init.d`)
* `chkconfig` on Red Hat, SUSE and CentOS machines this will allow you to set the auto start options for a service e.g. `chkconfig <name> off` to remove a service from auto starting (this is actually just creating and removing symbolic links from the individual run level directories)
* `update-rc.d` on Debian and Ubuntu machines e.g. `rc-update.d <name> defaults` to enable, `rc-update.d <name> remove` to disable
* `netstat -antl`

## Software and Package Management

### Red Hat / CentOS / Fedora 

* .rpm files and software management
* YUM repos

* rpm database at `/var/lib/rpm`
* `rpm -qa` to list all rpms installed on a device
* `rpm -i <name>` to install an rpm
* `rpm -e <name>` to remove an rpm
* `yum` allows you to install from a repo without knowing path to file or dependencies e.g. `yum install <packagename>`
* `rpm -qpi <name>` where q=query, p=package (rather than something installed), i=info to get package information
* `rpm -qpl <name>` where l=list to show which files will be installed
* `rpm -i !$` to install (where `!$` is the last argument given in the history)
* `rpm -ql` will then list files in the installed package by querying the rpm database
* `rpm -qf $(which nmap)` where f=file will tell you which package a file comes from (with $() feeding the result from the parentheses to the rpm -qf command)

The problem with installing packages this way is that you need to first locate the rpm file in order to install it. Furthermore, if the rpm has any dependencies, these will need to be downloaded and installed alongside. The YUM repos answers these issues by resolving any dependencies.

### Debian / Ubuntu

* .deb files and dpkg software management
* `dpkg-reconfigure` to reconfigure the package if allowed
* apt repos

* deb database at `/var/lib/dpkg`
* `dpkg -L` to list all debs installed
* `dpkg -i <name>` to install
* `dpkg -r <name>` to remove a package

* `apt-get update` to update the local cache at /var/cache/apt/archives
* `apt-cache search <query>` to search the cache
* `apt-cache pkgnames <query>` to seach just the package names in the cache
* /etc/apt/sources.list contains the urls to the deb package sources

### SUSU / openSUSE 
* .rpm files and software management
* zypper repos

## Management of Shared Software Libraries

Developers can make use of shared libraries to stop code duplication
DLLs in Windows, .so or .ko in Linux

* `.so` are standard modules used by user space programs
* `.ko` are kernel modules used by the kernel or privileged programs

* `ldd /bin/ls` to list shared libraries for ls
* `lsmod` to list loaded kernel modules
* `/etc/ld/so.conf` maintains PATH to search for modules

So, for example, `ls`, `grep`, and `cat` all need to access the file system and will all use `libc.so.6` in order to do that.

* `/etc/ld.so.conf` maintains the system path to the shared libraries. 
* Run `ldconfig` to rebuild this path if the conf file is changed.
* `ldconfig -p` to list all modules in the module path

To test libraries under development, create a new directory to hold the libraries and set the LD_LIBRARY_PATH variable. Reviewing with `ldd` will reveal that the system will check the LD_LIBRARY_PATH location first for any modules required. Unset a variable with `unset` e.g. `unset LD_LIBRARY_PATH`

* `lsmod` lists all loaded modules (which checks is a more convenient way to check `/proc/modules`)
* `modprobe` can be used to load and unload modules
* `modprobe -r <module>` to unload a module (using `rmmod`)
* `modprobe <module>` to load a module (using `insmod`)
* `modprobe -v <module>` to load a module and include dependencies and path to the actual module loaded
* `modinfo -d <module>` to show a short description of the module
* `modinfo <module>` to show complete information
* `modinfo -p <module>` to show possible parameters

To load a module with additional paramters, create a .conf file in `/etc/module.d/` according to the documentation

`/etc/modprobe.d/blacklist.conf` lists any modules which should never be loaded

## Linux File System

A disk is often partitioned.

An MBR partition table allows for a maximum of 4 Primary partitions per disk and a maximum of 2TB per partition. One of the primary partitions can be a logical partitions and with a maximum of 15 partitions in total. (Uses `msdos` as the partition label.)

A GPT partition table - GUID partition table allows partitions of up to 8ZB in size and a maximum of 128 partitions. (Uses `gpt` as the partition label.)

Partitions are then formatted using file systems.

### Creating partitions

* `fdisk` - used both in windows and linux
* `fdisk -l` to list the partitions and information
* `parted /dev/sda print` does the same
* parted - supports both MBR and GPT partition tables
* gdisk - replaces fdisk
* lsblk - reports partitions
* `parted /dev/sdb mklabel gpt` to create a gpt partion table on the /dev/sdb device

### Choosing a file system

For general use ext4. This is a journaled file system which maintains a journal of transactions. If the system crashes the journal can be checked to find out which files were in use and only the integrity of these files need be checked. This is a good choice for small files e.g. 4K, but not for bigger files e.g. 1GB.

XFS will be the default on Red Hat 7 and is designed for large files and for robustness. `mkfs` is used to make the file systems.

### Creating file systems

`mkfs` is used to create file systems. Use tab completion on `mkfs.` to see the different possibilities. Packages may need to be installed e.g. XFS.
When creating a file system, one parameter which can be set is the block size. e.g. 4096 bytes. If you try to save a 1KB file it will be saved to a 4K block and the rest of the space will be empty. If you save an 8K file, it will be saved to 2 4K blocks and may be fragmented. 

* `mkfs.ext4 -b 4096 /dev/sdb`
* `mkfs.xfs -b size=64k /dev/sdb` - block size will be set in bytes, but can conveniently be specified in kB

### Mounting file systems

* `mount` to mount a file system
* `umount` to unmount a file system - can do this by mount point or by device name
* To mount file systems on boot, add entries to `/etc/fstab`
* `mount -a` to mount any file systems which should be mounted
* `mount -o remount /data` to remount a file system which is already mounted (e.g. after changes to `/etc/fstab`)
* `blkid /dev/sdb1` shows the UUID of a block which can alternatively be used to mount (or put into fstab)
* [NOTE: in vi using `r ! <command>` will insert the result of a command into the document]

## Virtual Memory and File System Tools

* A swap file can be a disk partion or a swap file (less performant).
* Swap partitions can be created in the same way as creating normal partions e.g. using fdisk, parted or gdisk
* Once created the system may need to be rebooted in order to synchronise (or use `partprobe` as a shortcut to synchronise).
* To format the swap partition use `mkswap` e.g. `mkswap /dev/sdb3`.
* Mount the swap partition using `swapon` e.g. `swapon /dev/sdb3` (options priority `-p` flag)
* Use `swapon -s` to report on the swap space status
* Remove the swap partition using `swapoff` e.g. `swapoff /dev/sdb3`
* Again use `fstab` to ensure swap partitions are mounted all the time.
* Use `swapon -a` to mount any swap file systems which should be mounted.

## Tools

* `df` shows disk usage, use with `-h` flag to make more readable, `-l` limits the information to local disks
* `du` shows disk usage of particular directories, again use with `-h` for more readable output

## Controlling Access to File Systems

### Permissions

Permission can be set using symbolic notation (`chmod g+x file1`) or octal notation (`chmod 777 file1`) to the user, the group or others.

* `chmod` - change mode
* `chown` - change owner, must be done as root
* `chgrp` - change group, must be done as root e.g. `chgrp users /data`
* `stat` - view file permissions by looking directly at the inode (instead of using `ls -l`)
* `umask` - control default permissions by specifying the default mask e.g. `umask 002` sets permissions to remove write permissions for others; `umask 077` sets default to remove all permissions for group and others
* `id` - shows the group the current user belongs to e.g. `uid=1000(jharvard) gid=1000(students) groups=1000(students)`
* `mkdir -p data/dir{1,2,3}` - create directories `data/dir1`, `data/dir2`, `data/dir3`
* `ls -ld .` to show the permissions of a directory (execute permissions are included by default since you need these permissions to enter a directory)
* File creation and deletion permissions are controlled by the permission on the directory
* The sticky bit is a permission bit which can be set on a directory that allows only the owner of a file within the directory (or root) to delete or rename the file. i.e. you can't create or rename a file created by some other user. It is set using the first index in the 4 octal indexes (e.g. `chmod 1755 dir1`) or by using `t` (e.g. chmod +t dir1). When showing permissions using `ls -ld` the final bit (shows execute for others) is either `T` if execute NOT set, but sticky bit is set OR `t` if execute and sticky bit set.

### Hard and Soft (Symbolic or Sym) Links

A filename links through to an inode which is the actual entry in the file system which contains metadata including a pointer to where the data is physically held on disk. A file has at least one name, but can have more than on name and will then have more than 1 hard link (count of hard links is shown in the `ls -l` listing).

The `ls -ld` long directory listing shows the number of hard links to that directory (the directory name itself, the `.` within the directory and the `..` within all the sub directories). (A quick way to count the number of sub directories is to substract 2 from the link count! To verify use `find . -maxdepth 1 -type d` to display all the subdirectories and pipe this through to `wc -l`)

Soft links on the other hand have seperate inodes, but the data pointer points through to the same place on the physical disk

* `ln file3 file4` creates a hard link from file3 to file4 the names file3 and file4 point at the same inode
* `ls -li` shows the long listing including the inode number which shows that this is now the same for file2 and file4
* `ln -s file3 file5` creates a soft / symbolic link from file3 to file5 where a seperate inode is created for file5, but the data points a the same place as for the inode for file3

### Implementing Quotas

Limits can be set in terms of blocks (space) or inodes (number of files). There are soft and hard limits. The soft limit can be exceeded, but by default only for 7 days.

`vi +?<searchterm> <filename>` to open a file in vi and go directly to that line for editing
`dd if=/dev/zero of=/data/file1 count=1 bs=1024M` to create a file reading from `/dev/zero` which is a stream of 0s, and writing one file of size 1GB

`quotacheck -cu /data` to create user quota files for the /data file system. This will create an aquota.user file in the root of the file system, which is the quota database
`repquota -auv` reports the quota usage
`quotaon /dev/sdb1` will enable running the quota check continuously (which would happen on boot by default)
`edquota -u claire` will open an editor to allow editing the quota limits
`setquota -u claire 20000 25000 0 0 /dev/sdb1` allows setting quota limits in a one line command
`edquota -t` to edit the grace period of the soft limit








