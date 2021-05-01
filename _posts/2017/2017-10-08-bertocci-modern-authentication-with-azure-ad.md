---
layout: post
title: "Bertocci: Modern Authentication with Azure AD"
---

## References

* Book website: http://aka.ms/modauth
* Microsoft docs: http://aka.ms/aaddev
* Blog: www.cloudidentity.com
* Twitter: www.twitter.com/vibronet
* Code samples: http://aka.ms/modauth/files
* Book updates: http://www.cloudidentity.com/blog/books/book-updates/

## Related content

* May 2017 - The keys to the cloud: Use Microsoft identities to sign in and access API from your mobile and web apps: https://channel9.msdn.com/Events/Build/2017/B8084
* Sept 2017 - Office development: Authentication demystified: https://www.youtube.com/watch?v=DIgFbvnEItc&feature=youtu.be (1h 14m)

## Overview

First 4 chapters are an overview, last 6 more in depth

* Chapter 1: Walkthrough
* Chapter 2: History of identity mgmt
* Chapter 3: Intro to Azure AD and ADFS
* Chapter 4: Intro to developer libraries (1-4 online at: https://ptgmedia.pearsoncmg.com/images/9780735696945/samplepages/9780735696945.pdf)
* Chapter 5: In-depth walkthrough
* Chapter 6: In-depth Open ID and OAuth2
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

SAML and WS-Fed are supported in both Windows Server ADFS and Azure AD. Both emerged as solutions to cross-domain SSO.

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

Canonical OAuth2 flow:

![simplified-oauth2-canonical-flow.png](Simplified OAuth2 Canonical Flow)

1. User tries to access area of app A which requires access to resources R managed by app B
2. User is redirected to *authorisation endpoint*, "I'm coming from app A and wish to access R". User authenticates and grants access to R. Authorisation endpoint returns *code*.
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
3. If successful the token issued to the user is capable of obtaining a valid token from B and therefore must be a user of B.

The hack is dependent on some kind of API to test out the access token. This part is provider dependent and so will vary. (Facebook exposes entities via Graph, 23andMe exposes genome-related APIs and EventBrite event-organisation APIs.)

#### OpenID Connect

A formalisation of the pseudo sign-in pattern using OAuth. Implemented as extentions to OAuth2.

* Defines an authentication-request message type (on top of OAuth2's authorization requests)
* New token type, ID token, to communicate to the client identity information about the user
* A UserInfo endpoint to provide identity information following token acquisition
* Discovery metadata

Hybrid flow: 

Augments the canonical flow by returning the ID token with the authorisation code (the latter of which is opaque to everyone except the issuer). To make this viable requires specifying: format; encoding; information token should carry; checks needed to establish validity. JWT offers all this.
Once app A has validated the ID token they can stop there OR continue with OAuth2 to validate the code, get an access token and call any endpoints required (including the UserInfo endpoint).
If app A won't be using the code, the initial request can specify to the authorisation server not to bother including it. (Strictly, the specification dictates the use of the UserInfo endpoint, but in practice the ID token does contains claims about the user and the additional call is not made.)

Authorization code flow:

Similar to hybrid flow, but the ID token is returned with the Access Token, having been successfully swapped for the code returned via the client browser. Here the chances of the token having been tampered with are much less, so validation of the token is not necessary if the TLS channel the token is sent down server to server is itself valid. Token contents itself, e.g. the token was issued for your app, are all that is required to be verified.

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

Applications are in one of two possible roles:
1. Token requestors - applications which want to access resources and do so via a token
2. Resource protectors - applications which host resources which are protected by tokens

### Token requestors

#### Responsibilities

1. Acquire token(s) (potentially using UI/UX elements) from the IdP. This includes a request in the correct format for the chosen protocol specifying: client application, target resource, directory to be used. Parse the token from a response and handle possible error scenarios
2. Attach tokens to the requests sent to Resource Protectors - may or may not be the same protocol / mechanism for token acquisition. Must also select the correct token for the resource (if more than one token in play)
3. Store the token(s) and managed session related tasks e.g. token renewal operations

AD identity libraries cover 1. and 3. Resourse providers usually cover off 2. since this code would necessarily have to be in the language / framework of the resource rather than the IdP (with the exception of ADAL JS).

#### ADAL - Active Directory Authentication Library

Covers nearly all token requestor requirements. Only designed to request tokens from Active Directory and ADFS - not other IdPs. It is not a traditional protocol library, but tries to abstract away implementation details and provide primitives to request tokens without exposing the details of the actual protocol in use.

* ADAL .NET v1 - released September 2013, based on .NET 4.0, supports getting tokens from Azure AD, ADFS Win2012R2, ACS 2. Helps with flows often found server side such as **client-credential** and the **confidential-client authorization-code** grant.
* ADAL .NET v2 - released September 2014, based on .NET 4.5.x including async primitives. Newly supported authentication flows include: direct use of username-passwords for .NET native clients; WIA for federated tenants; on behalf of - allows user identity to flow through tiers (for
example, user1 calling service1, which in turn calls service2 on behalf of user1)
* ADAL .NET v3 - released ??, supports .NET core

### Resource protectors

Covers any piece of software which may be consumed by a remote client e.g. web applications serving UX elements to a browser, web API consumed by mobile apps or server processes.

Several things to do to authenticate an incoming request:

1. Read an IdP's metadata to configure itself
2. For unauthenticated requests for web apps, generate a sign-in message and redirect the client to the IdP
3. For authenticated requests, extract the token from the request and validate it
4. In web apps, create a session e.g. by issuing a session cookie

Often implemented using middleware, Microsoft has provided libraries for this kind of functionality for a long time including WSE and WCF. 

#### WIF - Windows Identity Foundation

First developer library for identity tasks with several libraries to represent protocol artefacts as well as HTTP modules to easily support claims based identity in ASP.NET applications.

Originally released out of band from .NET 3.5, they were eventually included in .NET 4.5 in mscorlib.dll. Most commonly used to secure ASP.NET app with WS-Federation by adding a series of `HttpModules`.

#### OWIN middleware for .NET 4.5.x, or Katana 3.x

In ASP.NET 4.6 most of the request processing was rewritten using OWIN. The AD libraries followed suite, with most of the resource protector components rewritten as OWIN middleware too.

#### TODO FINISH THIS SECTION

## Chapter 5. Getting started with web sign-on and Active Directory

The choice of "Web app / API" or "Native" client will affect the authentication flows available
* Web apps can be the recipient of redirect based protocols e.g. SAML, OIDC
* Web apps can be assigned secrets - native clients cannot be trusted to protect it

### Steps to configure a regular MVC web app to used OIDC with Azure AD:

1. Create a new MVC web application with no authentication
2. Install-Package Microsoft.Owin.Host.SystemWeb
3. Install-Package Microsoft.Owin.Security.Cookies
4. Install-Package Microsoft.Owin.Security.OpenIdConnect
5. Create a new app registration in Azure AD noting the client ID (application ID)
6. Enable the OWIN pipeline by adding a new "OWIN Startup class" called `Startup.cs` and add the partial keyword - this has the `OwinStartup` attribute which cases the `Configuration` method to be invoked at assembly load time
7. Configure the OpenID Connect middleware by adding a `Startup.Auth.cs` class to configure the OWIN authentication middleware (traditional to use seperate classes for each functional area and call from main Configure method)
    i. Add a `ConfigureAuth` method
    ii. Set the default authentication method to "Cookies"
    iii. Add Cookie Authentication to the OWIN pipeline
    iv. Add OpenIdConnect Authentication to the OWIN pipeline
    v. Call `ConfigureAuth` from the main `Configure` method
8. Add `Authorize` attributes to methods, classes, application as required

IMPORTANT: by default, the OpenID Connect middleware is configured to react to outgoing 401s by intercepting and transforming them in authentication requests

### Add explicit sign-in and sign-out links

The OWIN infrastructure offers two methods `Challenge` and `SignOut` to message the middlewares in the pipeline to trigger a sign in or sign out flow. The actual behaviour will depend on the middleware. 

```
public void SignIn()
{
    if (!Request.IsAuthenticated)
    {
        HttpContext.GetOwinContext().Authentication.Challenge(new
            AuthenticationProperties { RedirectUri = “/” },
            OpenIdConnectAuthenticationDefaults.AuthenticationType);
    }
}
```

```
public void SignOut()
{
    HttpContext.GetOwinContext().Authentication.SignOut(
        OpenIdConnectAuthenticationDefaults.AuthenticationType,
        CookieAuthenticationDefaults.AuthenticationType);
}
```

#### Distributed sign-out

The OpenID Connect middleware for ASP.NET 4.6 (that is to say, the one with package version 3.x.x) does not support distributed sign-out (unlike WS-Federation using WIF). Currently instead, OpenID Connect handles sessions via a combination of iframes and JavaScript client-side logic.

#### Switch from OIDC to WS-Fed (for running against an ADFS instance)

OIDC support for ADFS was only added to the ADFS in Windows Server 2016 (more in chapter 10). Currently switching the consuming app to WS-Fed is fairly simple anyway:

Update the `Startup.Auth` class to include the WS-Fed middleware rather than the OIDC middleware.

```
app.UseWsFederationAuthentication(new WsFederationAuthenticationOptions {
    Wtrealm = "http://myapp/whatever",
    MetadataAddress = "https://sts.contoso.com/federationmetadata/2007-06/federationmetadata.xml"
}
```

Update the SignIn and SignOut actions to reference WS-Fed instead:

```
public void SignIn()
{
    if (!Request.IsAuthenticated)
    {
        HttpContext.GetOwinContext().Authentication.Challenge(new
            AuthenticationProperties { RedirectUri = “/” },
            WsFederationAuthenticationDefaults.AuthenticationType);
    }
}
```

```
public void SignOut()
{
    HttpContext.GetOwinContext().Authentication.SignOut(
        WsFederationAuthenticationDefaults.AuthenticationType, CookieAuthenticationDefaults.AuthenticationType);
}
```

## Chapter 6. OpenID Connect and Azure AD web sign-on

### Recap

* Hybrid flow: OAuth 2.0 flow in which an Authorization Code is returned from the Authorization Endpoint, some tokens are returned from the Authorization Endpoint e.g. ID Token, and others are returned from the Token Endpoint e.g. Access Token.
* Authorization-code flow: OAuth 2.0 flow in which an Authorization Code is returned from the Authorization Endpoint and all tokens are returned from the Token Endpoint. Suitable for Clients that can securely maintain a Client Secret between themselves and the Authorization Server.
* Implicit flow: OAuth 2.0 flow in which all tokens are returned from the Authorization Endpoint and neither the Token Endpoint nor an Authorization Code are used.

### Specifications

Spec | URL | Notes
---|---|---
OpenID Connect Core 1.0 | http://openid.net/specs/openid-connect-core-1_0.html | Details the format of authentication request and response message for hybrid, authorization-code and implicit flows. Details the format of the `id_token` and how it should be validated. Lists the canonical claim types used to transmit attributes. By default the OpenID Connect OWIN middleware uses the hybrid flow. Also describes various other things including UserInfo endpoint.
OpenID Connect Discovery 1.0 | http://openid.net/specs/openid-connect-discovery-1_0.html | Describes ways for IdPs to describe their metadata - endpoints, identifiers, signing keys - so RPs can aquire information to generate AuthN requests and validate responses. OpenID Connect OWIN middleware leverages the discovery mechanism to minimise development tasks and keep metadata fresh.
OAuth2.0 Multiple Response Type 1.0 | http://openid.net/specs/oauth-v2-multiple-response-types-1_0.html | Which tokens should be returned in a response and how
OAuth2.0 Form Post Response Mode 1.0 | http://openid.net/specs/oauth-v2-form-post-response-mode-1_0.html | 
OpenID Connect Session Management 1.0 | http://openid.net/specs/openid-connect-session-1_0.html; http://openid.net/specs/openid-connect-logout-1_0.html | Defines how to monitor the End-User's login status on an ongoing status so the RP can log out an End-User who has logged out of the IdP. RP needs to know the session management related URLs (usually via discovery). Requires iframes and JavaScript, so difficult to manage via server side technologies. The draft "logout" spec uses more traditional means.
OAuth2 Authorization Framework | https://tools.ietf.org/html/rfc6749
OAuth2 Bearer Token Usage | https://tools.ietf.org/html/rfc6750
JSON Web Token (JWT) | https://tools.ietf.org/html/rfc7519 | Compact token format; two parts Base64URL encoded JSON; one part Base64URL encoded signature
JSON Web Signature (JWS) | https://tools.ietf.org/html/rfc7515 | How JWTs are signed
JSON Web Algorithms (JWA) | https://tools.ietf.org/html/rfc7518 | Possible values for algorithms for computing signatures etc

### OpenID Connect exchanges signing in with Azure AD

* GET to /Account/SignIn - activates the code to generate an authentication request
* 302 to Azure AD with OIDC authentication request message
    - Authorization endpoint starts with `https://login.microsoft.com/tenant-guid` followed by e.g. `/oauth2/authorize/` for oauth/oidc; `/saml2` for SAML
    - by default OWIN middleware sends parameter `response_type=code+id_token` i.e. hybrid flow
    - by default sends `response_mode=form_post`
    - `scope` indicates which resources an app is requesting access to e.g. `scope=openid+profile` - `openid` differentiates this as an OIDC request rather than an OAuth2 request; `profile` could alternatively be `email`, `address`, `phone` which are predefined sets of claims
    - `state` is a field the client can use to stuff anything it wants back when the authentication response is eventually returned (canonically used to prevent CSRF attacks)
    - `nonce` introduced by OpenID Connect to mitigate token replay attacks - stored in a cookie and then sent back by the browser for the server to compare the value in the token with the value stored in the cookie from the browser - a stoken id_token cannot pass this check
* Optional parameters not included by default:
    - `login_hint` - used for prepopulating the username text box
    - `prompt` - value of `login` will force reauthentiation; value of `none` will ensure reauthentication doesn't happen and will send failure if the user is now not authenticated; value of `select_account` will ask the user to select an account if multiple are currently logged in with
    - `domain_hint` introduced by Azure AD to specify the IdP to authenticate with
    - `resource` again Azure AD specific - tells Azure AD which resource you want a code / access token for e.g. Microsoft API, third-party API etc
* Potential call to discovery endpoint to get up to the minute information re validating tokens (recursive)
* Actual authentication UI will depend on current state of user e.g. cookie to indicate already authenticated etc
* Azure AD sends back to the browser with the `code`, `id_token`, `state`, `session_state` and various cookies
* Browser POSTs this form back to the application (using JavaScript), additionally sending the cookie with the `nonce`
* Server validates the nonce, and all the other goodies received from Azure AD and if everything ok, sets up a session
* Server response sets its own session cookie, invalidates the nonce cookie and 302 redirects to the initially requested page

![The web sign-in component of the OpenID Connect hybrid flow](TODO)

### JWT

The ID Token is in JWT format (as are all Azure AD Tokens).

The JWT is a compact token, designed to be transmitted in HTTP headers and URL query parameters. JWT in turn relies on JWS, JSON Web Signature which defines how to digitally sign an JSON payload (as well as attaching the info needed to validate the signature). JWT also relies on JWE for encrypting tokens - currently not supported by Azure AD.

JWTs have three parts, seen on the wire as three strings delineated by `.`s - Base64URL encoded (difference between Base64URL encoding and Base64 encoding is that it doesn't contain a trailing `=` sign)

1. JWS Protected Header - with token type, algorithm used for signing, key used for signing
2. JWS Payload - claims
3. JWS Signature - signature of the first two parts using the algorithm and key specified, Base64URL encoded - this party is actually binary

A valid signature indicates the token hasn't been tampered with in transport, but is only the beginning of the validation process e.g. key indicated (in `kid`) must also be one specified in the discovery document.

### ID Token (from Azure AD)

`iss` - issues of the token - OWIN middleware compares this value to the value of `issuer` from the discovery document and fails the authentication if not the same
`sub` - identifier of the user - unique and not reassignable
`aud` - i.e. the client the token was minted for
`exp` - expiry time
`nbf` - not valid before time
`iat` - issued at
`c_hash` - derived from the value of the authorization code
`acr` - level of assurance
`amr` - authentication method e.g. `pwd`
`email` - email address of the user
`given_name`, `family_name`, `name`, `nickname`
`oid` - object id - management operations on the caller (user) can use this id to identify this entity (why not use the `sub`??)
`pwd_exp` - password expiry time
`pwd_url` - url which provides password update functionality
`tid` - tenant identifier - same as the GUID in the endpoints and the value of `issuer` in the discovery document
`upn` - user principal name - can be reassigned - also not all flows yield a upn
`unique_name` - present for users even when the upn is not. If the upn _is_ present, it has the same value
`groups`, `roles` - multivalue types used to transmit group membership

### OpenID Connect exchanges for signing out from the app and Azure AD

* GET to /Account/SignOut
* 302 to Azure AD logout URL e.g. `https://login.microsoft.com/tenant-guid/oauth2/logout` 
  - as found in the discovery document under `end_session_endpoint`
  - parameter `post_logout_redirect_uri` indicates where to redirect the user after successful signout
  - browser is requested to invalidate the previously issued session cookie
  - `state` parameter can be used if required
  - `id_token_hint` contains the id_token received at authentication time to resolve any ambiguity with which account should be signed out of
* Azure AD does various redirects, cleans cookies etc before finally redirecting back to any specified URL

## Chapter 7. The OWIN OpenID Connect middleware

WIF was built on `HttpModule`, the extensibility technology de jour at the time. The current libraries are built on OWIN.

### OWIN

OWIN is an open standard: Open Web Interface for .NET, Microsoft is one of many contributors. OWIN suggests a way of building software modules (middlewares) which can process HTTP requests and responses. The modules are concatenated in a processing pipeline and at every instant, the state of an HTTP transaction is represented by the *environment dictionary*.

`IDictionary<string, object>`

Correspondingly, a middleware is simply a module which implements the interface: 

`Func<IDictionary<string, object>, Task>`

It receives the environment dictionary as input, acts on it and passes it to the next module in the pipeline. e.g. Logging middleware might read the dictionary and logs details from it, Authentication middleware might inspect the dictionary, finds a 401, change it to a 302 and update the response to include an authentication request. The dictionary acts to decouple the modules.

At startup the middleware pipeline is constructed and initialized depending on the modules and the order specified. OWIN details a generic mechanism. However, the ASP.NET implementation is only referenced here.

### Katana

Katana is Microsoft's .NET 4.5-based components which implement functionality in ASP.NET 4.6 based on the OWIN specification. Includes:

* base middleware classes
* framework for initializing the pipeline
* pipeline hosts for ASP.NET
* collection of middleware for all kinds of tasks

A `Startup` class decorated by the `assembly:OwinStartup` attribute initializes the OWIN pipeline when its `Configure` method is automatically invoked.

Alternative methods:
* have just one `Startup` class
* use the `OwinStartup` attribute (overrides if any other class is also named `Startup`)
* configure via appSettings e.g. `<add key="owin:appStartup" value="WebAppChapter5.Startup" />` (overrides both of the above)

The `Configure` methods signature is `public void Configure(IAppBuilder app)` and `IAppBuilder` used to support the initialization of the application is:

```
public interface IAppBuilder
{
    IDictionary<string, object> Properties {get; } // stores capability information from the server and host to reference if req

    object Build(Type returnType); // rarely called in code
    IAppBuilder New();
    IAppBuilder Use(object middleware, params object[] args); // use to add middleware to the pipeline
}
```

The `Properties` dictionary is used by the server (e.g. IIS Express) and host (e.g. `SystemWeb`) to store capability information and can be used by the Configure method. (`SystemWeb` is actually an `HttpModule`, a trick to integrate with the traditional `System.Web` pipeline). The host populates the `app` variable which gets passed to the `Configure` method (in Katana the implementation of `IAppBuilder` is a concrete type `AppBuilder`.

The non public `_middleware` property of `app` will gather references to the modules as they are added to the pipeline using `Use*`. `UseCookieAuthentication` is a convenience extension method which translates to `app.Use(typeof(CookieAuthenticationMiddleware), app, options)`.

Middleware only really needs to implement the `Func` interface, alternatively Katana offers base classes which follow more structured patterns e.g. the base class `OwinMiddleware` (NOTE has interop issues - do not use!).

```
public abstract class OwinMiddleware
{
    protected OwinMiddleware(OwinMiddleware next) { Next = next; }
    protected OwinMiddleware Next { get; set; }
    public abstract Task Invoke(IOwinContext context);
}
```

The `IOwinContext` is a convenience wrapper of the OWIN environment directory. Each module in the pipeline will be visited twice, once as the request is processed and once (in reverse) as the response is processed. Each module does work and then calls the next module in the pipeline. A module can decide to shortcut the remaining modules by not calling `Next`. Simple "debug" middlewares can be interleaved with the actual middlewares to inspect what is happening. e.g. 

```
app.Use(async (Context, next) => {
    // request processing - do something here e.g. `Debug.WriteLine(...)`
    await next.Invoke();
    // response processing - do something here e.g. `Debug.WriteLine(...)`
});
```

Disable chatty browserlink using `<add key="vs:EnableBrowserLink" value="false" />` if getting in the way. The `Context` object has several properties useful for inspecting during pipeline execution including `Authentication`, `Environment` - the so called environment dictionary, `Request` and `Response` and finally `TraceOutput`.

#### Authentication middleware

Protocol middlewares and cookie middlewares collaborate to determine authentication. Communication between the two middlewares is via the `AuthenticationManager` instance in the `Context`.

The cookie middleware is added to the pipeline in front of any protocol middlewares. By default, protocol middlewares are **Active** by default i.e. its option's `AuthenticationMode` property is set to `Active`. If multiple protocol middlewares are included, this behaviour may have to be tailored to ensure the correct middleware is triggered in the right situation.

A protocol middleware, having validated a request successfully will set `Context.Authentication` properties `AuthenticationResponseGrant`, `SignInEntry` and `User` to communicate to the cookie middleware. The cookie middleware specifically uses `AuthenticationResponseGrant`'s content to generate a session. 

The `AuthenticationResponseGrant.AuthenticationType` property can be set to `Cookies` by the protocol middleware if this was set as the default in the configuration e.g. `app.SetDefaultSignInAsAuthenticationType(CookieAuthenticationDefault.AuthenticationType)` (and not overriden by local overrides).

In further requests, the cookie middleware validates the cookie and rehydrates the corresponding `ClaimsPrincipal` to `Authentication.User`. This passes unchanged through the protocol middlewares.

`Challenge` works by setting the `Authentication.AuthenticationResponseChallenge` property to a value signifying the protocol middleware to use for signing in e.g. "OpenIdConnect" - this ensures this middleware is triggered even if set to the `AuthenticationMode` property is set to `Passive`.

Similarily `SignOut` works by setting the `Authencation.AuthenticationResponseRevoke` property - this time containing a collection of authentication types e.g. "Cookies" and "OpenIdConnect".

#### Diagnostic middleware

Katana provides diagnostics via NuGet package Microsoft.Owin.Diagnostics. Add the following to enable and configure right at the beginning of the main configuration routine (i.e. at the beginning of the pipeline):

```
app.UseErrorPage(new ErrorPageOptions() {
    ShowCookies = true,
    ShowEnvironment = true,
    ShowQuery = true,
    ShowExceptionDetails = true,
    ShowHeaders = true,
    ShowSourceCode = true,
    SourceCodeLineCount = 10
});
```

### OpenID Connect middleware

#### OpenIdConnectAuthenticationOptions

Out of the box, the defaults work well. However many options can be changed via the `OpenIdConnectAuthenticationOptions` class. Parameter names in the options class match protocol names, but with .NET consistent casing.

##### Application coords and request options

* `RedirectUri` by default is null, controls the value of the `redirect_uri` in the parameter. If multiple are registered the Azure AD will pick one slightly randomly.
* `PostLogoutRedirectUri` where to redirect the application following logout
* `ClientSecret` required to redeem an authorization code
* `ResponseType` e.g. "id_token", "code id_token" support automatics user sign in; "code" requires custom code
* `Resource` specific to Azure AD
* `Scope` the OAuth2 / OpenID Connect scope parameter

##### Authority coords and validation

By default middlewares obtain (most) validation coords by reference, via the metadata endpoint. There are configuration options for suppliers which supply metdata differently as well as the option to SUPPLY EVERYTHING MANUALLY for providers which don't provide metadata. 

The `ConfigurationManager` class retrieves, caches and refreshes validation settings retrieved via discovery.
* `Authority` - used by Azure AD, metadata URL is generated from this
* `Metadata` - for other providers, the URL of the metadata endpoint
* `BackchannelCertificateValidator`, `BackchannelHttpHandler`, `BackchannelTimeout` - for overriding default validation behaviour
* `OpenIdConfiguration` can be manually populated with coords if received out of band e.g. authZ endpoint, issuer value, signing keys
* `IConfigurationManager` can be overriden to completely customise logic

* `SecurityTokenHandlers` by default includes JWT handler
* `RefreshOnIssuerKeyNotFound` flag to refresh from metadata if cached keys don't match
* `CallbackPath` configure only one url to receive tokens (not necessarily recommended)
* `ProtocolValidator` by default contains an instance of `OpenIdConnectProtocolValidator` - static validations e.g. complying with current format as well as ensuring certain claims are present

##### Middleware mechanics

Other options for driving the general behaviour of the middleware;

* `SignInAsAuthenticationType` determines the value of `AuthenticationType` of the `ClaimsPrincipal` generated from the incoming token e.g. "Cookies"
* `AuthenticationType` identifies this middleware e.g. `OpenIdConnect`
* `AuthenticationMode` e.g. "Active" or "Passive"
* `UseTokenLifetime` will default a cookie middleware's session timeout to the length of validity of the `id_token` (defaults to 1 hour on Azure AD) - IMPORTANT - set this to FALSE if you want the use the session-duration settings on the `CookieMiddleware` instead
* `Caption` - use for the text for a button to show the user if there are mutliple possible middlewares for this user to sign on with

#### Notifications

### TokenValidationParameters

The last level to which things can be configured, the `OpenIdConnectAuthenticationOptions` property `TokenValidationParameters`. This is usually populated with metadata by the protocol middlewares in discovery, but properties can alternatively be specified manually.

Main validity checks include issuer, audience, signing key and validity interval. The `TokenValidationParameters` hold options to check the token against (validity interval is compared against the clock):

* `ValidIssuer` - was it issued by the authority you were expecting?
* `ValidAudience` - was it issued to you?
* `IssuerSigningKey` - the key with which the token as been signed

Both String and IEnumberable types exist of the latter two.

Validation flags allow the turning on and off of validation checks.

* `ValidateAudience` - compare the audience in the incoming token with the declared audience (the `clientId` for OpenIdConnect)
* `ValidateIssuer`
* `ValidateSigningKey` - is the key used for signing in the list of trusted keys?
* `ValidateLifetime` - enforce the validity interval declared in the token or ignore it (an intranet with an expired token which can't get access to the Azure AD on the internet to refresh it?)
* `RequireExpirationTime` - whether the application accepts tokens without expiration times..
* `RequireSignedTokens` - may be useful in development

Validators allow you to implement custom validation code e.g. managing a valid issues list in a more flexible way that allowed by the built in functionality.

### Sessions

Cookie middleware stores the full `ClaimsPrincipal` crafted from an incoming token. If additionally wanting to persist the actual token, a custom implementation of `IAuthenticationSessionStore` may be more appropriate so as not to bust the size of the cookie (i.e. store info server side and a reference to this in the cookie - wouldn't this be what they do anyway??). Be aware that this will be used everytime an authenticated request is received, so a 2-level cache where most data is in memory and look ups to a persistence layer used only where necessary.

## Chapter 8. Azure AD application model

Azure AD provides functionality to model users, organisations and applications. This chapter covers applications, specifically:

* how Azure AD represents applications and the constructs used
* mechanisms to provision applications beyond one's own organisation
* the consent framework
* roles, groups etc to control access

There is A LOT more in Azure AD than in ADFS, but the complication has been abstracted away.

### Application and Service Principal

Azure AD emerged from ADFS. Applications were initially based on the same model used there and used Service Principals. These were great for representing an appliation "instance", but not for the application itself.

* Applications are abstract, the Service Principal is a concrete instance in a specific directory. Each customer will need to have a seperate instance; Development, Staging and Production will also need to have seperate instances. However, all stem from the same abstract Application. 
* From the directory viewpoint, an application is just a client, also requiring access to certain resources under the directory's control. 

#### Application

Azure AD therefore defines a new entity: `Application`. This is the blueprint. A `ServicePrincipal` is created at runtime via **consent**. This involves a provisioning flow driven by consent.

NOTE: provision of an `Application` in its home tenant creates both an the `Application` AND the `ServicePrincipal`, so the experience between using an application as a home user will be different from using the application as a user in a different tenant.

https://graphexplorer.azurewebsites.net/ - easy interface to perform REST calls on Azure AD Graph API. Login to the tenant you wish to query.

* https://graph.windows.net/agdio.onmicrosoft.com/ for a list of objects
* https://graph.windows.net/agdio.onmicrosoft.com/applications for a list of application
* https://graph.windows.net/agdio.onmicrosoft.com/applications?$filter=appId+eq+'37741a71-4a76-4e63-a167-77e4a22fbba7' to filter to just one application

##### Protocol and authentication settings

* `appId` the client_id of the application
* `replyURLs` the multivalue property of possible allowed redirect URLs the client application is able to request
* `identifierURLs` various identification URLs you may want to assign to your application to override the directory assigned `appId`. Corresponds to the **realm** in SAML and WS-Federation. Corresponds to **audience** in OAuth2 when used by web APIs
* `publicClient` boolean value - security implications for each type
* `passwordCredentials`, `keyCredentials` for when the application is itself acting as a client
* `displayName` shown in e.g. consent prompts
* `homepage` landing page when e.g. listed in an app store - common to use an authenticated page in the app for this to ensure authentication flows through
* `samlMetadataUrl` for SAML implemenations - the metadata url
* `oauth2AllowImplicitFlow` false by default
* `oauth2AllowUrlPathMatching` deviate from the standard functionality that ALL redirect URLs must exist verbatim in the `replyURLs` collection
* `oauth2RequirePostResponse` by default all requests are expected via GET, setting this value to true relaxes this constraint
* `groupMembershipClaims` receive group membership for the user as claims - either `SecurityGroup` or `All`, default is null
* `appRoles` roles associated with the application
* `availableToOtherTenants` defaults to false, switch to true for multitenant apps. These applications have extra constraints - `identifierURLs` must now contain proper URLs with the hostname matching a domain registered in the tenant (coding changes also required if changing from line of business app to multitenant app)
* `knownClientApplications` in the case your "application" actually comprises of e.g. a client application AND a web API application (where the client application is used to access the web API application) then by storing the client_id of the web API application within the client's `knownClientApplications`, the user can be asked to consent to both applications having access at the same time and thus provision a ServicePrincipal for both at the get go.

##### Things you can do with the Application (besides signing in)

* `oauth2Permissions` a Application representing a web API must define at least one scope, otherwise and access token would be meaningless. Hence the default entry here for the scope `user_impersonation`
    - `id` unique identifier of the scope
    - `..Description` and `..Name` used in consent prompts
    - `type` if permission can by granted by any user (`User`), or only an admistrator (`Admin`)
    - `value` the name of the scope

##### Resources and permissions the Application needs to operate

* `requiredResourceAccess` - very powerful entry - define what resources an application may want to access - an access type of `Scope` defines that the application will access in a delegated way i.e. on behalf of a user (and the consent may have to be obtained either by an admin user or the user itself, as determined by the `type` entry on the corresponding `oauth2Permissions` entry). `Role` on the other hand means the application requires that access for its own identity (always requires admin consent).

NOTE in v1 of Azure AD, consent is only granted once for all permissions declared. If an extra permission is added, then the intial consent must be revoked and consent reacquired (v2 may change this).

#### Service Principal

https://graph.windows.net/agdio.onmicrosoft.com/servicePrincipals?$filter=publisherName+eq+'Agilisys Ltd'

The service principal entry looks similar to the application entry but is actually fairly different. 
* MISSING: flags defining protocol behaviour at runtime as well as `knownClientApplication` and `requiredResourceAccess`
* TRANSFERRED: `appId`; various optional URLs e.g. `errorUrl`, `logoutUrl`, `samlMetadataUrl`; `appRoles`, `oauth2Permissions` and credentials
* ADDITIONAL: `appOwnerTenantId`, `publisherName`; `servicePrincipalNames` = `identifierUrls` + `appId`; `appRoleAssignmentRequired` gate token issuance for specific users only; `tags` mainly used by the Azure portal

### Consent and delegated permissions

https://graph.windows.net/agdio.onmicrosoft.com/oauth2PermissionGrants

In order to keep track of which clients / users have access to which resources and with what permissions, Azure AD uses the `oauth2PermissionGrants` collection.

```
{
    "clientId": "b7a5bb5e-fb87-440c-bc97-c196d6f657a9",         /* Ag.MA.Users.ApiClient.Demo */
    "consentType": "AllPrincipals",
    "expiryTime": "2018-09-25T17:43:58.6786004",
    "objectId": "Xrult4f7DES8l8GW1vZXqac0-E01j1lBrS4WN9yfJ7g",
    "principalId": null,
    "resourceId": "4df834a7-8f35-4159-ad2e-1637dc9f27b8",      /* Windows Azure Active Directory */
    "scope": "User.Read",
    "startTime": "0001-01-01T00:00:00"
},
```

An example entry contains the following attributes:

* `clientId` the `objectId` from the `ServicePrincipal` representing the client
* `con`
* `principalId` the `objectId` from the `User`
* `resourceId` the `objectId` from the `ServicePrincipal` representing the source

appId | name
---|---
00000001-0000-0000-c000-000000000000 | Azure ESTS Service
00000002-0000-0000-c000-000000000000 | Windows Azure Active Directory
00000003-0000-0000-c000-000000000000 | Microsoft Graph 

https://msdn.microsoft.com/Library/Azure/Ad/Graph/howto/azure-ad-graph-api-permission-scopes
https://msdn.microsoft.com/Library/Azure/Ad/Graph/api/api-catalog


Revoke individual user consent by logging into https://myapps.microsoft.com/, choose the application you wish to revoke consent for and click "Remove".

If any of the resources your application requires admin access, then either this application cannot be accessed by regular users (they won't be able to obtain the requisite consent) OR an admin will initially be required to approve this on behalf of all users using the `promt=admin_consent` on the first request. 

* This will add a consent for `AllPrincipals` to the `oauth2PermissionGrants` collection
* Individual users will then not be shown consent prompts.
* If an administrator creates this application in the azure portal, then by default this consent is already provisioned (TO TEST - would this then save having to do the consent screen for client credential applications?)

### App user assignment

By default every user can request access to every application (and may or may not be granted access). An application can be configured to allow access to an explicit set of users only via the "User assignment required to access app" flag on the application configuration options on the Service Principal i.e. under Enterprise Applications. If the flag is turned on after provisioning, any user already given consent will automatically be in the list. 

Each time a user is explicity given access, an entry will be added to the `AppRoleAssignment` list of the `ServicePrincipal`. If the application employs specific roles, this will be recorded in this list. Possible values for `principalType` in this entry are `User`, `Group` and `ServicePrincipal` where this is assigned to a client application.

https://graph.windows.net/agd.io/servicePrincipals/42097f55-8474-4a07-b319-9b05715e7b55/appRoleAssignedTo

### App roles

Roles traditionally represent permissions grouping. These will be sent as claims in the token (in the id_token under the `roles` claim). Following the creation of roles, these can then be assigned to individual users. The `appRoles` section of the `Application` manifest is used to specifiy roles. The `allowMemberTypes` attribute can be set to one of `User` (can be assigned to users and groups).

In ASP.NET this claim can be utilised as the source for role information for `[Authorize]` etc functionality by adding the following to the identity pipeline. i.e. add the following to the OpenIDConnect initialization options: `TokenValidationParameters = new TokenValidationParameters { RoleClaimType = "roles" }`

### App permissions

When wanting to confer access rights to an application itself, app permissions are used. e.g. client credential flow. Whereas delegated permissions are represented via the `oauth2Permission` and `oauth2PermissionGrants`, application permissions are represented by the `appRoles` and the `appRoleAssignedTo`. In `appRoles` the type is set to `Application` in this use case. 

A client application declares in advance what permissions it requires - configurable via the azure portal which will explicity list any `appRoles` with the type `Application`. Once selected this is added to the application's `requiredResourceAccess` collection with a type of `Role` instead of `Scope`.

Consent is required as usual, but only admins can give this consent - via the `prompt=admin_consent` flag.

### Groups

Groups can be configured for users. Azure AD can also be configured to send group information for a user in the token via the `groupMembershipClaims` property in the `Application` object. Valid values are `SecurityGroup` or `All`. The groups are sent in the token as the `objectId`. Use the graph API to query information about the group.

https://www.youtube.com/watch?time_continue=633&v=cdoY_pnqPiA

## Chapter 9. Consuming and exposing a web API protected by Azure AD

### Consuming a web API protected by Azure AD

Tokens for accessing APIs can be extremely powerful, allowing the token holder to do any number of operations. 

#### Redeeming a code for an access token

Gaining a token in hybrid or authorization code flows requires the authorisation code to be redeemed for the access and refresh tokens (and indeed the id token if using authorisation code flow) via a server to server call. For Azure AD, this is via an authenticated POST to the authn server's token endpoint (authentication here uses the calling application's credentials e.g. client secret). In order for this call to be authorised, the application needs to have previously been setup to declare which permissions it needs and the user needs to have consented to them. In Azure AD, all applications are automatically given the authentication permission - "Sign in and access the user's profile". In Azure AD this also gives the application the right to query the graph API for the user's profile (writing to the user's profile via the Graph API requires application permissions to be previous configured and explicit consent from the user).

The application asking to read on the user's behalf also needs credentials. This is either via a `passwordCredential` - a string passed in the `client_secret` property of the request or via a `keyCredential` - the public key of an X.509 certificate, with the application holding the private key and signing a JWT assertion attached to the request to the token endpoint.

The `AuthenticationCodeReceived` notification is handled when configuring the OpenIdConnect middleware. The ADAL client libraries can be used to redeem the code. NOTE don't use the default cache settings for web applications - more later. ADAL will automatically take care of redeeming any refresh token for a new access token when they run out (by default issued for an hour). The `AuthenticationResult` holds the tokens as well as several other bits of metadata pertaining to the authentication e.g. `TenantId` - the id of the tenant where authentication was ultimately performed.

```
var context = new AuthenticationContext(_authority);
var credential = new ClientCredential(_clientId, _appKey);
var url = new Uri(HttpContext.Current.Request.Url.GetLeftPart(UriPartial.Path));

AuthenticationResult result = context.AcquireTokenByAuthorizationCode(_code, url, credential, _resourceId);
```

#### Using an access token

The most common way to use the access token is to attach it to the request in the Authorization HTTP header. If the bearer token is not attached or is not valid, the server will return a 401 Unauthorised (rather than the 302 that a web app may normally return).

Using cookies for protecting a web API is an anti-pattern. In this scenario, the whole application could be protected using OpenID or WS-Fed and once authenticated, the browser has the requisite cookie to make authenticated requests. The AJAX calls will then succeed if issued from the same browser. However, this doesn't work very well, since when the cookie expires, the middleware will issue a 302 which can't be exploited directly. 

As long access tokens for making API calls are retrieved via one of the `AuthenticationContext`s `AcquireToken*` methods, the ADAL library will take care of retrieving access tokens from the cache and getting fresh ones using the refresh tokens when required. 

```
var context = new AuthenticationContext(_authority);
var credential = new ClientCredential(_clientId, _appKey);

AuthenticationResult result = context.AcquireTokenSilent(_resourceId, credential, UserIdentifier.AnyUser);

// use result.AccessToken ... e.g. 

var client = new HttpClient();
client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", result.AccessToken);
var response = client.GetAsync(_apiUrl).Result;
if (response.IsSuccessStatusCode) {
    _log.Debug(response.Content.ReadAsStringAsync().Result);
}
```

`AcquireTokenSilent`'s parameters are similar to conditions which must hold true for the requested token, which the framework will check prior to calling the API: for the specified resource, for the specified client_id (passed in via the credential object) and for any user. The call to the token endpoint must be authenticated in the case of web apps, but will be unauthenticated in the case of native / public apps. There are overloads for both situations.

The "refresh token grant" OAuth2 flow is handled silently by ADAL whenever the access token has expired. 

* Generally Azure AD refresh tokens are valid for 14 days and new refresh tokens can be obtained up to 90 days from first issuance.
* Refresh tokens for Microsoft accounts last only 12 hours.
* Refresh tokens can be invalidated at any time e.g. when a user changes his / her password

To test access token expiry behaviour, debug and after instantiating the context, alter the value of `context.TokenCache["ExpiresOn"]` to a date in the past.

Multiresource Refresh Tokens
: The access token will be tied down to the actual resource requested, but the refresh token will be issued for all resources the user has permission to use / has granted consent for. This means that using `AcquireTokenSilent` to request access to a different resource after the first request, will also work fine. This is known as multiresource refresh tokens or MRRTs.

#### ADAL cache considerations for web applications

Originally designed to work for native clients e.g. running in isolation on a user's desktop or phone. The default ADAL cache is in-memory, relies on a static store available process wide. Therefore every AuthenticationContext instantiated will read and write against the same token cache. 

This can be an issue for web applications:
* Accessed by many users, isolation issues by using the same store, high volume of storage required, lookup times become slow
* Could be deployed on multiple noes where the cache needs to be shared
* Caches must survive process recycles

Recommendation is therefore to implement a custom cache to suit the architecture of the specific web application. To do this, create a custom cache derived from `TokenCache` with implementations for the 3 notifications it provides: `BeforeAccess`, `BeforeWrite` and `AfterAccess`. Pass an instance of this into the initialisation of the `AuthenticationContext` ensuring to always pass the same instance for the same user / same store.

Sample naive cache implementation given in the book. Samples online contain more complete solutions using EF. VS new project wizards also creates a custom cache class based on EF IF you tick the box to have Read Directory functionality.

#### When `AcquireTokenSilent` fails

Because:
* no tokens in the cache yet
* multiple cached tokens available - fails with `AdalException` of multiple_matching_tokens_detected - in this instance need to be more specific in the application code
    - may happen e.g. in on behalf of scenarios
    - may also happen due to cache being implemented incorrectly e.g. still using default cache with `UserIdentifier.AnyUser` and containing tokens for all concurrent users - instead use e.g. `new UserIdentifier(_email, UserIdentifierType.OptionalDisplayableId)`
* all tokes expired
    - in this case the tokens may have expired, but the session the user has with the app is still alive and the user can still use functionality on the app which doesn't require calling the API. https://klout.com is an example of how to handle this well (aggregatino of social media site)

### Accessing an API as an application: Client credentials

Configure your client app to list the API as a required resource, and trigger the minting of the consent by using `promt=admin_consent`. Requesting a token is now simply: `result = context.AcquireToken(resourceId, clientcredential)`. ADAL will automatically cache the access token and use it for all further requests to the API, as well as caching the client credential and using them to request a new access token when the current one expires.

### Accessing an API on behalf of another user: Raw OAuth2 Authorization Grant

Allowing an application to acquire and use an access token on behalf of another user requires the implementation of OAuth2 authorization grant flow. With ADAL currently you have to write code to:

1. receive the authorization code
2. validate messages

Detailed code at: https://github.com/Azure-Samples/active-directory-dotnet-webapp-webapi-oauth2-useridentity

### Exposing a protected web API

Web APIs are registered in Azure in exactly the same way as web apps. Additionally, they have to declare the permissions a client can request at consent time in terms of either:

* delegated permissions
* application permissions

In order to validate tokens, the `UseWindowsActiveDirectoryBearerAuthentication` middleware is added to the pipeline and configured with the token validation coords: `Tenant`, `Audience` in a corresponding options object. If `Tenant` is specified as e.g. abctenant.onmicrosoft.com, then this is automatically assumed to be associated with the Azure AD instance https://login.microsoftonline.com. Connect to a different instance by omitting the `Tenant` property and manually specifing the `MetadataAddress` property instead - NOTE: this needs to be the WS-Fed metadata URL. e.g. for the default Azure AD instance this translates to https://login.microsoftonline.com/abctenant.onmicrosoft.com/federationmetadata/2006/federationmetadata.xml.

Aside: Microsoft chose JWT as the format for access tokens simply because it is not only Microsoft which will be the receiver of those access tokens for their own APIs (as it would be for e.g. Facebook) but since developers can write their own APIs to be protected by Azure AD. The libraries to validate id_tokens can be repurposesed to also validate access tokens.

Aside 2: `UseWindowsActiveDirectoryBearerAuthentication` is simply an Azure AD specific wrapper around `UseOAuthBearerAuthentication` with specific ways to calculate the authority metadata. The latter class ultimately instantiates middleware which implements a generic JWT-based OAuth2 bearer interceptor and validator.

The `oAuth2Permissions` section in the `Application` object should contain an entry for each delegated permission or `scope` the web API should support. If an admin user hasn't already configured consent for `AllPrincipals` or this web API will be consumed across multiple tenants, then the user will need to additionally grant consent for the web API at the consent prompt.

#### Handling web API calls

In this example a web app will be the client calling the web API. In the web app registration in Azure, add permissions to call the web API in the "Permissions to other Applications" section (any app which has a Service Principal and some scopes or roles specified should appear). If you are signed in as an admin, the new permissions should be reflected in the Service Principal entry and consent entry straight away. If not, the current consent may need to be revoked and reobtained. Check the `oauth2PermissionGrants` to make sure.

    NOTE using fiddler with http://localhost sometimes doesn't work. Instead use http://localhost.fiddler

#### Exposing both a web UX and a web API from the same project

The web UX needs the `Cookie` and `OpenIdConnect` authentication middlewares; the web API needs the `BearerAuthentication` middleware. The solution is to add all three to the pipeline and configure the BearerAuthentication with a different `AuthenticationType` e.g. `OAuth2Bearer`.

Then decorate all API action methods with an additional attribute `[HostAuthentication("OAuth2Bearer")]`

#### A web API calling another API: Flowing the identity of the caller and using "on behalf of"

This requires "on-behalf-of" flow as defined by OAuth2 Token Exchange extensions. The first API needs to send the authority the access_token it received from the caller, sending its credentials and the second API as the resource it wants to call. It should then receive an access_token for the second API in return. 

This requires the first API to save the access_token it receives. Within the `TokenValidationParameters` the `SaveSigninToken` property can be set to true. For web APIs using `BearerAuthentication` this makes no difference, but the web UX projects, the token would be the id_token and would (by default) increase the session cookie size, so only turn on when required.

```
var bootstrapContext = ClaimsPrincipal.Current.Identities.First().BootstrapContext as System.IdentityModel.Tokens.BootstrapContext;
var accessTokenFromUser = bootstrapContext.Token;

// wrap the the original token augmented with token type and username of the original user
var userAssertion = new UserAssertion(accessTokenFromUser, "urn:ietf:params:oauth:grant-type:jwt-bearer", username);

var authContext = new AuthenticationContext(_authority);
var result = authContext.AcquireToken(_resource, _clientCredentials, userAssertion);
```

#### Protecting a web API with ADFS "3"

ADFS uses JWT format for access tokens too, so the ADAL bearer middleware can be almost repurposed as is. A new class `ActiveDirectoryFederatedServicesBearerAuthentication` is used instead, typically initialised with `Audience` and `MetaAddress` (WS-Fed metadata of the ADFS instance).

Applications need to be completely pre registered with ADFS by an administrator, potentially using PowerShell e.g. using `Add-ADFSRelyingPartyTrust` command.

ADFS "3" OAuth2 support is limited to public clients i.e. clients that do not have their own credentials. ADFS in Windows Server 2016, on the other hand, supports both types of clients.

## Chapter 10. ADFS in Windows Server 2016 Technical Preview 3

* Spin up a Windows 2016 server
* Add Roles and Features > Active Directory
* Promote server to Domain Controller
    - New forest e.g. `pasta.local`
    - DNS not necessary, but leaving it ticked is fine
* Create new self signed cert
* Add Roles and Features > ADFS
    - New federation service
    - Choose cert and name the service appropriately e.g. `bertocci.pasta.local`
    - Choose user to run the service (e.g. admininstrator - DEV only)
* Create test user
* Ensure port 443 is open on the NSG
* Add local hosts entry to public IP
* Check the equivalent url can be hit externally e.g. https://bertocci.pasta.local/

## Further reading

### Other platforms

* https://github.com/azuread/ ADAL libraries for other Java, Ruby, Python etc 
* https://github.com/azure-samples?query=active-directory comprehensive list of samples


### SPAs

AzureAD offers comprehensive support. As well as the source code and the samples
* http://www.cloudidentity.com/blog/tag/adaljs/
* Office API samples - SPAs are a popular way to consume Azure AD and the Office API

### Azure B2C

* http://aka.ms/b2c

### Azure AD vNext and convergence with Microsoft accounts

Next version of Azure AD will have several missing features especially the ability to get tokens from either Azure AD or Microsoft accounts using the same libraries. Static permissions and consent rules will also be overhauled.

* http://aka.ms/aadconvergence