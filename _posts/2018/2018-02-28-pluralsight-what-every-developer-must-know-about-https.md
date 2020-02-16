---
layout: post
title: "Pluralsight: What Every Developer Must Know About HTTPS"
---
## Securing An Application

### Redirect from HTTP to HTTPS and HSTS

* If you type an address into the browser and you don't specify the scheme, the browser defaults to HTTP
* A simple 301 redirect from the HTTP scheme to the HTTPS scheme is problematic - this initial request can be compromised in an MitM attack
* Solution is HTTP Strict Transport Security or HSTS
    - When HSTS is enabled, a response header is sent `strict-transport-security` which has a `max-age` attribute with a value in seconds which indicates how long the browser should always use HTTPS for requests to this domain rather than HTTP
    - Requests to HTTP are now indicated as 307 Internal Redirect (rather than 301) which are internally redirected by the browser
* The first request is the problem since this will still be vulnerable to attack until the browser received the STS response header. This can be resolved by including two extra directives `includeSubDomains` and `preload` and registering the website to https://hstspreload.org - these sites are then hardcoded into the browser to be preloaded

### Content Security Policy

Can often be implented as either HTTP headers or meta tags e.g. `<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">`

* `upgrade-insecure-requests` - https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/upgrade-insecure-requests - will cause any active or passive content loaded in the markup using the HTTP scheme to instead be upgraded to use the HTTPS scheme - useful when transitioning a site from HTTP to HTTPS when some assets may still be referenced using HTTP
* `block-all-mixed-content` - https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/block-all-mixed-content - ensures any passive or active content referenced over HTTP is blocked from loading - useful when a site has fully transitioned to HTTPS to ensure the browser does not report an error by trying to load mixed content
* `Referrer-Policy` - https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy - when redirecting from an HTTPS site to an HTTP site, it is important to ensure there is no sensitive information included in the redirect URL. This header helps enforce this.

## Beyond the Basics

SNI
: Server Name Indication - allows multiple certs on the same IP address

SAN
: Subject Alternative Name - multiple domain names on one certificate a la Cloudflare

PFS
: Perfect Forward Secrecy - ??

DNSSEC
: DNS Security Extensions - protecting against the forgergy of DNS records - v. important

DANE
: DNS Based Authentication of Named Entities - specify certificate keys at the DNS level - helps with the compromised of a CA a la Diginotar which also requires DNSSEC

CAA
: Certificate Authority Authorisation - DNS record to help ensure a certificate is issued by the correct site. Example set up for Gandi: https://wiki.gandi.net/en/ssl/caa

CRL
: Certificate Revocation List - maintained by the CA - has all the certs they've had to revoke.

OCSP
: Online Certificate Status Protocol - alternative to CRL - allows real time querying of revocation lists. Instead of a client browser doing the query - the site itself can do the query and include the results with the TLS handshake - aka OCSP stapling

PKP
: Public Key Pinning - a client has a list of public keys it can accept

### Other reasons to adopt HTTPS

* Bump in SEO: https://webmasters.googleblog.com/2014/08/https-as-ranking-signal.html
* Brottli compression: https://opensource.googleblog.com/2015/09/introducing-brotli-new-compression.html