---
layout: post
title: "Pluralsight - Web Debugging by Example"
---
## Automating Memory Dump Generation

1. Open performance monitor to set up collection of a new data set
2. Create a new user defined data collector set
3. Choose performance counter alert
4. Identify performance counter to monitor e.g. Processor > % processor time to monitor CPU usage
5. Once created, drill down to the actual data collector set and set the Alert Task to run a scheduled task by just entering the name. Also check the Alert Sample Interval on the first page is appropriate.
6. Create a scheduled task as defined to e.g. do a memory dump using `adplus` e.g. `adplus -quiet -hang -pn w3wp.exe -o c:\temp`, send an email
  - Ensure the memory dump doesn't exacerbate the resource being monitored and if necessary stop the data collection using `logman` e.g. `logman stop "CPU Spike Alert"`

## Debugging Web Server CPU Spikes

<https://msdn.microsoft.com/en-us/windows/hardware/hh852365>

* WinDbg - graphical interface debugger
* cdb - command line debugger - can generate memory dumps

Download and install the Windows 7 SDK. This will create a DTW directory (Debugging Tools for Windows) in the Program Files directory with a number of tools. `adplus.vbs` is a script which calls `cdb.exe` to perform a memory dump

Use adplus to create a memory dump and then open in windbg.

`!runaway` will list all threads and memory usage in time wrt process uptime
`.time` to give system and process uptime stats
`~17s` will set the context to the thread id 17
`k` to dump the native call stack (in context of previously set thread)
`!clrstack` to show managed code (NOTE this command is available in the sos dll so needs to be loaded using `.loadby sos clr`)
`!name2ee * [modulename].[symbolname]` e.g. RandomBehaviour.SpinLoop will enumerate through all assemblies (as indicated by the *) 
`!savemodule 00ed5560 c:\temp\buggy-code.dll` will save the dll to file so it can be loaded by e.g. .NET reflector and the reflected code analysed
    


