---
layout: post
title: Treehouse DD Technology Foundations
tagline: Uncover the mystery
---
## Graphics Basics
### Raster vs Vector
#### Raster
Made up of lots of pixels
Does not retain appearance when zooming in 
Depends on resolution (e.g. dpi)
Images for the web only need to be 72dpi
Images for print need at least 150-300dpi

#### Vector
Made up of paths and mathematical formulas
Retains quality when zooming in
Does not need a particular resolution
Can only be used for print, must be converted to raster before being used on the web

For web, use vector as often as possible and convert to raster as late as possible to upload to the web

### Units and Increments
Points and picas are only used in print (as well as inches, centimetres etc).
Use **pixels** for web design.
Change the unit of measurement with Photoshop > Preferences > Units and Rulers
Window > Info shows the info panel which shows the  cursor position in pixels as well as the dimensions of any rectangular marquee.
Click and drag on the ruler to show vertical or horizontal guides.

### Saving for the web
Need the perfect balance of quality vs file size.
DO NOT use save as to save e.g. a jpeg version of your photoshop file. 
Use File > Save for Web and Devices.

In the Save for Web and Devices preview a tabbed panel has different options. 2-Up is handy.

* GIF: lossless, supports only 256 colours, supports transparency and animation
* PNG-8: lossless, does not support animation
* PNG-24: supports effects and drop shadows well, but has a large file size
* JPEG: lossy, does not support transparency
* WBMP: only supports black and white

Adjust the parameters and check the file size. Set the matte colour if the background colour is known to get dithered edges. This helps blend the edge to keep it softer. Custom presets can be created if you want to save the options selected (in the case of creating multiple images of the same type). Zoom in on the graphic to check for quality and any areas of distortion.

## DNS Basics
### Domain Name Rules
There are 3 different types of TLDs (top level domains):
1. Country code TLDs e.g. .uk, .us, .es
2. Generic TLDs e.g. .com, .org
3. Infrastructure TLDs

### DNS TTL and Propagation
Set a low TTL whilst developing and then a high TTL once in production. Reset to a low TTL if moving servers.

### Name Servers
Name servers give information about domain names. There are 2 different types: master (stores originals) and slave (stores copies).
`host -t ns example.com` will show the nameservers for a particular domain.

### DNS Hosting
Some registrars provide DNS hosting (e.g. namecheap.com and hover). This provides a quick and easy solution for setting up DNS. They are usually basic, but also free. Alternatively there are provides which can host your DNS for you (e.g. dnssimple, pointhq). One advantage of using a different provider is that you won't have to set up DNS again if you move name registrars. They have also recently started offering templates for external services to you domains e.g. google apps, github pages, CDNs. 

### Root servers
The root servers have details of where the name servers are. They keep track of the root zone, the authoritative list of the DNS servers for all TLDs. There are 13 root servers throughout the world. <http://www.iana.org/domains/root/db> lists all TLDs.

### A Records
**A Records** are the most common record returned by nameservers and map hostnames to IP addresses. There would be an A Record for every sub domain e.g. www, mail etc. An asterisk can also be used as a wildcard in place of specifying individual sub domains. AAAA records are used for IPv6 addresses.

### MX Records
**MX Records** are used to point to servers which accept email messages via SMTP. In simple cases MX Records specify just one server. In more complicated cases Primary and Backup servers can be specified.

### CNAME Records
Short for the Canonical Name record. Usually used for aliases. In the case of e.g. 5 subdomains, A Records could be used to point all 5 subdomains to the same server. Alternatively a CNAME record could point all subdomains to one subdomain e.g. www, and then use the web server to take care of name resolution. The advantage is just one record to update if IP addresses change. CNAME records are usually specified with a dot at the end since you have to specify the full domain (e.g. www.example.com.)

### FQDN
Fully qualified domain name. These end with a dot (e.g. www.example.com.)

### TXT Records
Text records can contain freeform text of any type. One type is a SPF Text Record (Sender Policy Framework). These are used to specify you can send email on your behalf, introduced to try and combat spam. DKIM (Domain Keys Identified Message) are used to associate a domain name to an email message by adding a DKIM signature field to the email's header. Some providers e.g. google ask you to add specific TXT records. This proves you own the domain since you can only add these records when owning a domain. Once verified by the external provider the TXT record can be safely deleted.

### PTR Records
Used for reverse DNS to check if the server name is actually associated with the IP address. The format is the IP address in reverse with in-addr.arpa e.g. if the domain name mail.example.com points to IP address 1.2.3.4, then the PTR Record is 4.3.2.1.in-addr.arpa

### SOA Records
Start of Authority record is the first record in the DNS zone file. It indicates that this name server is the best source for data within this domain. Contains information like how often the domain name is updated, who manages it etc. 

The format is: Source host contact email; serial number; refresh time in seconds; retry time; expire time; minimum TTL.

## Chrome Dev Tools Basics
### Elements panel
Use the magnifying glass to hover over elements on the web page, view their margin and padding and jump to the corresponding html.
Text and html can be edited, attributes can be edited or added, elements can be reordered by dragging and droping.

### Resources panel
Shows all resources loaded on the web page as well as local storage which can be modified.

### Network panel
Clear out captures by clicking the no entry sign at the bottom.
Cmd-Shift-R to do a hard reset on a mac.
304 - gets from cache

#### Timeline
Different colours in the timeline represent different types of assets: HTML - blue; CSS - green; images - purple;
Blue line represents when the DOM is loaded and therefore when the `loaded` event was fired.
Red line represents when everything has finished loading.

#### Optimisation
* Ensure there are no 404s or 500s.
* Minimise HTTP requests by combining images into sprites, combining js files and css files
* Minimse loading time by minifying css and js files

### Sources panel
Right click > Local modifications shows all modifications made.
Right click > Save as to save the files
Pause button at the bottom of the panel lets you toggle on javascript exceptions: grey - don't pause; blue - pause on all exceptions; burgundy - pause on all uncaught exceptions.

### Timeline panel
This panel shows the rendering performance of the page. Most screens will operate at 60hz so if a browser painting the page works at less than 60 fps due to complicated transitions, gradients, box shadows etc, then frames will be dropped.

### Profiles panel
Shows detailed information for profiling e.g. Javascript, heap size

### Audits panel
Some handy tips for optimising performance.

### Console
The console can be used to interact with the web page, DOM etc using javascript.
e.g. getElementById("intro"). Right click > Reveal in Elements Panel will open this in the Elements panel. A shorthand for the same thing is $("#intro") (similar to jquery syntax, alias for document.querySelector() function).

#### Using the console from Javascript
Messages can be logged using console.log(). 
Other functions detailed in the console api reference at https://developers.google.com/chrome-developer-tools/docs/console-api#consoledirxmlobject. 
Also see the command line api reference at <https://developers.google.com/chrome-developer-tools/docs/commandline-api>.
Check the console for any javascript error details.

#### Timing functions
By using console.time("NameOfMyTimer") to start a timer and console.timeEnd("NameOfMyTimer"), code can be timed.

#### Entering functions directly in the console
Functions can be entered directly in the console. Use Shift+Enter to move down a line.

### Adjusting settings



