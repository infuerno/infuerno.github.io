---
layout: post
title: "Bertocci - Modern Authentication with Azure AD"
---

## References

* Book website: http://aka.ms/modauth
* Microsoft docs: http://aka.ms/aaddev
* Blog: www.cloudidentity.com
* Twitter: www.twitter.com/vibronet
* Code samples: http://aka.ms/modauth/files
* Book updates: http://www.cloudidentity.com/blog/books/book-updates/

## Overview

First 4 chapters are an overview, last 6 more in depth

* Chapter 1: walkthrough
* Chapter 2: history of identity mgmt
* Chapter 3: intro to Azure AD and ADFS
* Chapter 4: intro to developer libraries (1-4 online at: https://ptgmedia.pearsoncmg.com/images/9780735696945/samplepages/9780735696945.pdf)
* Chapter 5: in-depth walkthrough
* Chapter 6: in-depth Open ID and OAuth2
* Chapter 7: OWIN middleware; (online at: https://www.microsoftpressstore.com/articles/article.aspx?p=2473126)
* Chapter 8: Azure AD application model (online at: https://www.microsoftpressstore.com/articles/article.aspx?p=2473127)
* Chapter 9: Web APIs
* Chapter 10: Windows Server 2016 and ADFS


## Chapter 1. Your first Activity Directory app

The .NET framework has a specific class to represent the identity of the authenticated caller: `ClaimsPrincipal` in `System.Security.Claims` in the mscorlib dll. All other principal class derive from `ClaimsPrincipal` - so this object should always be populated in the case of an authenticated user to an .NET application.

```
    var cp = ClaimsPrincipal.Current;
    string welcome = $"Welcome {cp.FindFirst(ClaimTypes.GivenName).Value} {cp.FindFirst(ClaimTypes.Surname).Value}";
```

`ClaimsPrincipal` has a static property `Current` which retrieves the current instance of `ClaimsPrincipal` from either `Thread.CurrentPrincipal` or ??? `HttpContext.Current.User.ClaimsPrincipal` ??? via a delegate, `ClaimsPrincipalSelector` to customise this.

The `ClaimTypes` collection abstracts away the horrendously long key names for common claim types.

Not all information is provided at authentication time in the claims. For further information about the user, the Directory Graph API is provided.

## Chapter 2. Identity protocols and application types

### Pre-claims authentication techniques

#### Passwords, profile stores and individual applications

A brute force approach is to maintain a user profile store listing the attributes of each user. The problem is then simply how to correlate the current request to the correct user profile. Passwords are a crude mechanism to deal with this scenario. The application associates the secret string to a set of attributes defining the user for its purposes. (In reality a username is additionally used.) 

It is an attractive option even today, since it is relatively straight forward with existing libraries and gives complete control over the relationship with the user.

#### Domains, integration authentication and applications on an intranet

Activity Directory centralised the user-profile storage and credential-verification functions for intranet applications. This mechanism was made possible by the Domain Controller. A perfect solution where the computer and user are intranet based and always joined to a domain. The problem is that this is not necessarily always the case.

### Claims-based identity

Cross-company collaberation solutions was the natural follow up to the local network era where Company A's users wanted access to an application exposed by Company B. The same problem was exposed when hosting applications off-premise. Claims-based identity is a set of concepts common to many of the identity protocols that emerged to try and solve these issues. The main traits can be found in all modern protocols. 

#### Identity providers: DCs for the internet

Multiple authorities run by business entities, scoped to a specific user population (does this mean each user is serviced by one and only one, or multiple?). IPs or IdPs (later to be called Authorities).

An application _trusts_ a given IdP if the application believes what a given IdP says about a user (a *Relying Party*).

To achieve extending one authority's scope beyond infrastructural boundaries:

1. The IdP needs to be easily identifiable - unique identifiers, specific endpoints and public/private key pairs: metadata
2. Tokens to represent the authentication outcome which can be unambiguously tied back to the IdP by signatures. The signature is verified using the contents of the message (the token) AND the public key. If the verification is successful this means the token:
    + has come from IdP - signature could only be produced by someone with the private key i.e. the IdP
    + hasn't been tampered with - since the signature is based on the contents of the message (token)

*Claims* are user attributes which have been serialized into a signed token and issued by an IdP e.g. the user's surname. For all applications trusting the IdP - this becomes THE TRUTH. This concept is _pivotal_ and so provides the name to the whole approach.

#### Claims-oriented protocols

These are the ingredients, now here is how it works (in general terms, disregarding protocol specific variations).

##### Generic flow

1. Application reads an IdP's metadata (typically out of band, but not always)
2. The user authenticates and obtains a token (web apps: typically 302 to IdP, sign in, 302 back with token; clients and APIs will obtain a token differently e.g. by contacting the IdP for a token server to server)
3. Client sends the token to the app and the app validates the token
4. (Optional) Application establishes a session (to remove the need for the token dance with every request)

SAML and WS-Fed are supported in both Windows Server AD and Azure AD. Both emerged as solutions to cross-domain SSO.

The usual approach (non claims) to authentication is to validate credentials once and then use a session cookie. This works well until your application includes solutions hosted on different domains. Several SSO solutions have been developed to overcome the shortcomings of domain-bound cookies.

##### SAML

SAML tokens can be sent across domains and be used to initialize a session with a new domain. Tokens are known as _assertions_. SAML is XML based which makes it verbose. SAML defines lots of different *messages* to support various sign-in flows. The Single Logout category of messages provide a mechanism to propogate sign-out to all applications. 

##### WS-Federation

The WS-* (WS-Star) specifications aimed to define how communications could operate regardless of software stack or location: WS-ReliableMessaging, WS-Trust, WS-Security were all concerned with web services communications. Microsoft implementations tried to follow WS-*: WCF is largely based on WS-* and ADFS supports WS-Trust. WS-Federation was concerned with federated access and a small part of the specification covered browser based comms. This particular part is usually what is referred to as WS-Federation now and is still widely in use today.
It implements the generic flow with a significantly simpler set of messages than SAML. IP (role) and STS (software component to issue tokens) and RP (web app which consumes tokens issued by the STS). There is no mandated token type - SAML format is usually used. It defines messages supporting standard sign-in and distributed sign-out. Unlike SAML, messages are not signed - only the token is.

### Modern apps and protocols

Both SAML and WS-Federation are robust, production-grade implementations for cross domain authentiation. However they aren't flexible enough to cover the many different use cases required by the applications being built today e.g. accessing APIs and access delegation.

#### Access delegation

A particular integration flow whereby resources on one application need to be accessed by another application became very common place in the mid-2000s with the growth of sites like Facebook, Twitter, LinkedIn etc. 

Anti-pattern, just ask a user for their credentials for another web app and masquerade as them

OAuth then tried to resolve this - first with OAuth 1.0, then OAuth WRAP and finally OAuth 2. The architecture and the protocols define how to expose your resources for delegated access as well as how to access a different suppliers resources as a client.

#### OAuth2 and web applications

* For applications wishing to expose resources via APIs to third parties, OAuth describes an architecture for delegated access
* For applications that require access to resources managed by a different application, OAuth provides the mean to securely access that application

Canonical flow:

1. User tries to access area of app A which requires access to resources R managed by app B
2. User is redirected to *authorisation endpoint*, "I'm coming from app A and wish to access R". User authenticates and grants access to R. authorisation endpoint returns *code*.
3. Code is passed back to app A via the browser.
4. App A presents the code to the *token endpoint* with evidence that is is in fact app A (e.g. password)
5. Token endpoint validates the request and returns an *access token* (may also return other things here e.g. refresh token)
6. App A uses the access token to request R from App B

This is *profoundly* different from the issues which had so far been addressed by SAML and WS-Fed. Identity is no longer at the centre. There are two applications involved, not just one, with the user involved initially to set up the delegation, but then stepping back.

##### OAuth2 and Claims

OAuth2 and claims-based identity patterns have very little in common. There were many gaps in the specification and vendors filled these in differently each time.

#### Layering web sign-in on OAuth

The cross-domain single sign-on still existed. OpenID hadn't yet managed to offer a compelling solution, but the big providers were also ideal identity sources and already offered delegated access. People figured out a way to leverage OAuth for a poor-man's sign-on protocol. 

Poor-man's sign-on flow using OAuth:

1. User tries to sign in to app A, A triggers an authorization flow (steps 1-5 above) toward app B
2. A uses the access token to call any API on app B (useful if there is one with identity info, but anything will do)
3. If successful the token is user is capable of obtaining a valid token from B and therefore must be a user of B.

The hack is dependent on some kind of API to test out the access token. This part is provider dependent and so will vary. (Facebook exposes entities via Graph, 23andMe exposes genome-related APIs and EventBrite event-organisation APIs.)

#### OpenID Connect

A formalisation of the pseudo sign-in pattern using OAuth. Implemented as extentions to OAuth2.

* Defines an authentication-request message type (on top of OAuth2's authorization requests)
* New token, ID token, to communicate to the client identity information about the user
* A UserInfo endpoint to provider identity information following token acquisition
* Discovery metadata

Hybrid flow: 

Augments the canonical flow by returning the ID token with the authorisation code (the latter of which is opaque to everyone except the issuer). To make this viable requires specifying: format; encoding; information token should carry; checks needed to establish validity. JWT offers all this.
Once app A has validated the ID token they can stop there OR continue with OAuth2 to validate the code, get an access token and call any endpoints required (including the UserInfo endpoint).
If app A won't be using the code, the initial request can specify to the authorisation server not to bother including it. (Strictly, the specification dictates the use of the UserInfo endpoint, but in practice the ID token does contains claims about the user and the additional call is not made.)

Authorization code flow:

Similar to hybrid flow, but the ID token is return with the Access Token, having been successfully swapped for the code returned via the client browser. Here the chances of the token having been tampered with are much less, so validation of the token is not necessary if the TLS channel the token is sent down server to server is itself valid. Token contents itself, e.g. the token was issued for your app, are all that is required to be verified.

#### On-Behalf-Of Grant

An OAuth2 flow which describes how to request a token on behalf of a caller without showing any further consent prompts. Flow proceeds:

1. API A is accessed via user token U.
2. A then requests a token for API B from the Authorization Server, presenting U and identification of API A (e.g. shared secret)
3. AS issues token T allowing API A to access API B with the same rights as he user who originally sent token U.
4. A access B with T

#### Client Credentials Grant

Accessing a resource with no user in sight e.g. windows service. The claims in any token issued will describe the client application itself.

#### Implicit Grant

Used in SPAs (Single Page Applications). Applications can request an access token directly from the authorisation endpoint. The token is returned in a URI fragment (a string following a `#` symbol in a URI). The token can be stored in local storage and then attached to requests, much like a browser send the appropriate cookies with each request.

#### Native Clients

Utilise the OAuth type flows by presenting a browser window (disguised as the native app) for credentials and consent. The Microsoft ADAL library for requesting tokens has built in ability when used in a native app to display the browser surface relevant to that device.

Alternatively, in the next iteration a _hero app_ only concerned with acquiring tokens takes care of authentication and shares this with other apps.

## Chapter 3. Introducing Azure AD and Azure ADFS

### ADFS

Allows users in an on premise AD to access applications published on the internet via their domain credentials. Navigating to the app on the internet will bounce the user to authenticate against the local ADFS pages, a token will be issued and forwarded to the app, the app will validate the token and sign in the user.

ADFS v2 is an out of band download for Windows 2008 R2. 

ADFS "v3" ships with Windows 2012 R2 and is a superset of ADFS v2 adding OAuth2 authorization code grant for public clients. 

ADFS with Windows 2016 supports many more flows than previously including a decent set of OAuth2 and OpenID Connect flows.

### Azure AD

Originally developed for Office 365 workloads to support cloud based Active Directory functionality, subsequently also offered for use with a customer's own applications.

* Helps with application provisioning and directory enquiries which are more difficult with an on premise ADFS instance.
* Offers a full range of protocols: SAML, WS-Fed, OpenID Connect and OAuth2
* The *Directory Graph API* allows querying and manipulating directory entries via REST

Each tenant comes with

* default domain e.g. tenantname.onmicrosoft.com
* further registered domains e.g. dot.kitchen
* a tenantID - a GUID

Any of these can be used to locate the various endpoints e.g. for OAuth2 https://login.microsoft.com/dot.kitchen/oauth2/authorize

There are seperate sets of endpoints for

* OAuth2 (and hence OpenID Connect)
* SAML sign-in, sign-out and metadata
* WS-Fed metadata

#### Application model

Azure AD models applications in 2 main ways (see Chapter 8 for more):

* Identify the application - i.e. authentication protocols it supports
* Handle user consent when a token is requested including dynamic app configuration across clients

#### Directory Graph API

OData3 compliant REST interface to manipulate entities in the Azure AD Tenant including users, groups and applications (see Chapter 9).

#### Directory sync

AD Tenants can be set up to sync back to an on premise AD. There are two different configurations: 

* Federated tenants - only users are synced, credentials and attributes remain on premise and use ADFS, authentication therefore relies on the on prem ADFS
* Managed tenants - users and creds are synced so the Azure AD can handle authentication requests without references to the on prem installation

#### Application proxy

Only offered by the paid tiers of Azure AD (Basic and Premium). Allows intranet apps to be accessed by clients running outside of the network without having to reconfigure the application at all to use claims based identities. Useful for legacy applications.

## Chapter 4. Introducing the identity developer libraries

: Token requestors
Applications which need to securely access resources

Applications need to obtain the token in the first place (potentially using UI/UX elements). This includes a request in the correct format for the chosen protocol specifying: client application, target resource, directory to be used. 


: Resource protectors
Applications which protect the resource itself



