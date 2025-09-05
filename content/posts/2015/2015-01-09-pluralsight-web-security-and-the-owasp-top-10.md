---
layout: post
title: "Pluralsight - Web Security and the OWASP Top 10"
---
## Who is OWASP?

OWASP is a not for project organisation which exists to promote web security. They are technology agnostic and contributed to selflessly by the security community.
Each year they realease a top 10 list of the most critical web application security risks.

## Injection

### Overview

Most common injection examples are SQL injections, but can also have e.g. LDAP injections.

Distinguish between trusted data and untrusted data. Taking the example of a GET request of `http://mysite.com/Widget?Id=1`, the trusted data is `http://mysite.com/Widget?Id=` and the untrusted data is `1`
We assume that the this translates to a SQL query of `SELECT * FROM Widget WHERE Id = 1`

### Mounting an attack

By changing the URL to `http://mysite.com/WidgetId=1 or 1=1` this could translate to a SQL query of `SELECT * FROM Widget WHERE Id = 1 or 1=1` which would in affect select all records from the Widget table.

Furthermore if the web page was written to just display all results from the database, then data that wasn't designed to be access has now been accessed.

### Common defences

* Whitelist untrusted data - a list of data known to be good, ensure incoming untrusted data adheres to expected patterns
* Parameterise SQL statements - seperate the query from the data
* Fine tune DB permissions - principle of least privilege

## Broken Authentication and Session Management

Each time a logged in user makes a request, it is authenticated. Each time them make a request, they are sending additional information which authenticates them. An attacker can hijack this information and impersonate the victim.

### Mounting an attack

* Steal the authentication cookie: physically from the user's PC, over an unencrypted network, by exploiting an XSS risk
* Steal the session id, which can often by in the URL rather than in a cookie: copied and pasted by the victim, retrieved from a log, sent via an insecure email
* Account management attack, brute force login, exploit passwork resest (secret q and a of famous person), discover weak credentials (e.g. 4 number pin easy to go through all options)

### Common defences

* Protect the cookies - it is usually cookies which persist the authenticated state of the user between each request. *Two fundamental steps*:
    - Ensure HttpOnly flag is set on the cookie (cannot be accessed through script)
    - Ensure the secure flag is set (can only be sent over HTTPS)
* Decrease the window of risk - expire session quickly (trade off on usability); rechallenge the user on key actions (e.g. ask for previous password on change of password - if a user has hijacked a session they won't be able to provide this)
* Harden account management - don't limit password lengths, don't limit password characters; lock out users after x failed password attempts (for e.g. 15 mins)

## Cross site scripting (XSS)

Reflected XSS: attacker gives the victim a url with an XSS payload (e.g. via bit.ly), user clicks on the link goes to the website and the XSS is reflected back in the page and is now loaded in the user's browser. After this client data may be sent back to the attacker (e.g. cookies)

Persistant XSS: the XSS payload has already been persisted to a database, user uses application, pulls data from data including XSS payload which is then streamed to the client browser.

### Mounting an attack

A search on http://www.mysite.com/Search?q=Lager often reflects the search term back to the browser `You searched for <strong>Lager</strong>`. Untrusted data in both the request and the response is the word "Lager". If this can be replaced by some script, this script can be used to pull out a user's cookies, posting them to a third party. If there are authentication cookies there, then these can possibly be used to hijack and authenticated session.

### Common defences

* Whitelist untrusted data
* Always encode output, including data from the database e.g. if the `<script>` tag is escaped, it will just be written to the browser rathen than actually running script.
* Encode for context - different encoding required for HTML / attributes / JavaScript / CSS (and use a trusted framework to do this)

## Insecure direct object references

A direct object reference is an observable key used to identify an individual database record. E.g. manually changing query string to gain access to data.

### Common defences

* Must have access controls in places, must expect these rules to be tested
* Use indirect maps, map actual keys to temporary ones - when done well, only exists for that user, for that session
* Avoid predictable keys like incrementing integers or natural keys (e.g. usernames)

### Security misconfiguration

Broad risk, covering a number of things. Basically an attacker gains access to an unsecured resource e.g. poorly secured admin page, web logs, internal error messages. This can be due to a number of things:
* Is the software out of date?
* Unnecessary features enabled?
* Default credentials?
* Internal implementation data exposed in error messages?
* Security settings not set to secure values?

### Common defences

* Harden the install, turn off unused features, apply principle of least privilege
* Tune the application to ensure it is production ready, defaults are often not good enough
* Ensure all packages are up to date, especially third party ones

e.g. google for `inurl:elmah.axd "error log for"` to find lots of elmah log details!

## Sensitive data exposure

E.g. logging in over HTTP is vulnerable to a MITM attack where an attacker can sniff the username and password and even manipulate HTTP data

* Insufficient use of SSL - login not loaded over SSL, cookies not sent over SSL, using mixed mode and loading the page over HTTPS but embedded javascript over HTTP, attacker can now manipulate the javascript and get the page to post to somewhere else
* Bad cryptography - storage of passwords, no encryption, symmetric encryption, poor protection of keys, weak algorithms
* Other risks - auto complete, disclosure via URL - sensitive data should not be sent in the URL, leaked data via logs

### Common defences

* Minimise sensitive data collection, if you don't need DOB, don't collect it
* Apply HTTPS *everywhere* - start with secure by default
* Use strong crypto storage

## Missing function level access control

E.g. Admin user logs into a web application, makes an authenticated request for a page, response contains link to admin in nav (which they are given since they are logged in as admin). However, link to the admin page works doesn't have any access control, attacker can gain URL and then gain access to admin page.

### Mounting an attack

* Does UI show navigation to unauthorised functions?
* Are server side authentication / authorisation checks missing?
* Are server side checks done on untrusted data?
* Are system or diagnostic resources (e.g. Elmah logs) accessible without proper authorisation?
* Will 'forced browsing' disclosed unsecured resources (e.g. by enumerating possible URLs)


### Common defences

* Define a clear authorisation model which uses roles
* Check for default framework resources (check with good automatic scanner / dynamic analysis security tool)
* Always test unprivileged roles e.g. capture and reply priviliged requests under an priviliged user

## Cross-site Request Forgery (CSRF / XSRF)

A user has to be tricked into submitting a "forged" request to a site which they are already authenticated on (e.g. via a live authentication cookie in their cookie store)
Imagine an attacker shares a malicious link with a user. User clicks a link and their site is loaded into the user's browser along with a malicious request which loads the target website. If the user has an authentication cookie for the target website this will automatically be sent with the request - however the contents of the request did not come from the user, but from the attacker. So if e.g. the request contains an amount of money to transfer to a bank account, the user can submit this to their own banking website unwittingly.

### Common defences

* MOST IMPORTANT: employ anti-forgery tokens - adds randomness to the request which the attacker can't discover
* Validate the referrer
* Native browser defences (e.g. cross origin resource sharing / COREs)

## Using Components with Known Vulnerabilities

### Common defences

* Know which libraries, components, version you are using, keep an inventory
* Keep abreast of updates and CVEs
* Keep components updated

## Unvalidated redirects and forwards

Attacker shares a URL with a redirect payload. User clicks on link to go to website, but is then redirected to a malicious website.
This situation exists where a website redirects to external sites via an internal page to e.g. log the page hits to the external sites. An attacker simply publishes his url with the redirect to the malicious site and the user doesn't notice.

### Common defences

* Whitelist the URLs which the redirect supports
* Use indirect references e.g. an ID in a database which then retrieves the actual URL to redirect to
* Check the referrer


