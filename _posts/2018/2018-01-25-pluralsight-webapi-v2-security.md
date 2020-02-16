---
layout: post
title: "Pluralsight: Web API v2 Security"
---
## Overview

* Lots of new functionality added in Web API v2
* In v1 security was mainly based on hosting specific features
* In v2 new hosting and authentication infrastructures, lots of options around authorisation

## HTTP Security Primer

### Transport security (securing over the wire)

* HTTP has no built in security
* HTTPS = HTTP over TLS
* TLS or SSL is a tunneling protocol where you can tunnel insecure protocols over a secure tunnel
* Features this gives us:
    - Server authentication - SSL handshake ensures you are talking to the right server
    - Integrity protection - want to make sure that when you send information to the server, no one can tamper with that message on the way
    - Replay protection - e.g. message to buy something can't be replayed so that you end up buying it multiple times
    - Confidentiality i.e. encryption
* Magic ingredient are the certificates, the X.509 certificates - owner, issuer, validity, public key - in the context of SSL, the certificate is typically issued to the web server
* The private key is not part of the certificate - should ideally never leave the server

### Simplified SSL handshake

All the gory details: http://www.moserware.com/2009/06/first-few-milliseconds-of-https.html

* Connect to an HTTPS website
* Server sends back certificate to the browser
    - Checks DNS name = server server certificate name
    - Do we trust the issuer?
    - Is the certificate still valid
    - Also checks a revocation list (CRL) i.e. blacklisted certificates to ensure it isn't on this list
* If everything ok, browser generates a session key (random key)
* To transmit this securely, it encrypts it with the public key from the SSL certificate - only the server with the private key can decrypt the session key and then communicate with the client
* From then all comms is symmetrically signed with the key

### Developers and SSL

If you Google SSL issues, you often get answers on how to ignore the errors. If you do this, it is like not using SSL at all - which can be very dangerous. e.g. don't use the ServicePointManager API allows you to ignore all validation errors

### Where to get Certificates from

1. Buy a certificate - choose a popular provider e.g. Verisign - prove your identity, that you own the domain, pay some money - they will send you a certificate and the corresponding private key
    - implicitly trusted by all clients
    - zero configuration on the client side
    - pay money
2. Corporate PKI - only for applications which are intranet facing or used by members of that company. Easy to set up using Windows Certificate Services.
3. Create yourself - create own certificate infrastructure by building your own issuer and then creating your own certificates - uses makecert.exe (openssl can be used on a mac)

#### Creating a Root Certificate

The following will create a root certificate - in order to create other certificates. This approach means you only need to trust this certificate, and you will then trust all other certificates created from this.

```
makecert.exe
    -r                  // self signed
    -n "CN=DevRoot"     // name
    -pe                 // exportable
    -sv DevRoot.pvk     // name of private key file
    -a sha1             // hashing algorithm
    -len 2048           // key length
    -b 01/22/2010       // valid from
    -e 01/22/2030       // valid to
    -cy authority       // certificate type
    DevRoot.cer         // name of certificate file
```

### Creating an SSL Certificate

```
makecert.exe
    -iv DevRoot.pvk     // file name of the root private key
    -ic DevRoot.cer     // file name of the root cer
    -n "CN=DevRoot"     // name
    -pe                 // exportable
    -sv web.local.pvk   // name of private key file
    -a sha1             // hashing algorithm
    -len 2048           // key length
    -b 01/22/2010       // valid from
    -e 01/22/2030       // valid to
    -sky exchange       // certificate type
    web.local.cer       // name of certificate file
    -eku 1.3.6.1.5.5.7.3.1 // extended key usage
```






### HTTP authentication framework (how do you submit credentials)
