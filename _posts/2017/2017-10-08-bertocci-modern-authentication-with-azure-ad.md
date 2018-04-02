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

The cookie middleware is added to the pipeline in front of any protocol middlewares. By default, protocol middlewares are **Active** by default i.e. its options `AuthenticationMode` property is set to `Active`. If multiple protocol middlewares are included, this behaviour may have to be tailored to ensure the correct middleware is trigger in the right situation.


## Chapter 9. Consuming and exposing a web API protected by Azure AD

### Consuming a web API protected by Azure AD

Token for accessing APIs can be extremely powerful, allowing the token holder to do any number of operations. Gaining a token in hybrid or authorization code flows requires the authorisation code to be redeemed for the access and refresh tokens (and indeed the id token if using authorisation code flow) via a server to server call.

For Azure AD, reading or writing to the user's profile via the Graph API requires explicit consent from the user. TODO more on this.

The application asking to read or write on the user's behalf also needs credentials. This is either via a `passwordCredential` - a string passed in the `client_secret` property of the request or via a `keyCredential` - the public key of an X.509 certificate, with the application holding the private key and signing a JWT assertion