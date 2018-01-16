---
layout: post
title: "Pluralsight: Introduction to OAuth2, OpenID Connect and JSON Web Tokens (JWT)"
---
## Overview

### OAuth2

OAuth is for delegated authorisation. An application needs to access a back end service. Pop up a login dialog and user password and use this to authenticate on the back end service. This only works if you have a uniform authentication mechanism. OAuth2 is about requesting an access token from an authorisation server and then using this access token to talk to a back end service.

###  OpenID Connect

Conversely this solves a different problem for authentication. Application might not need to talk to a back end service, but does need to know who the user is, so needs to talk to an authentication server, type in the password at this server which allows it to validate your identity.

### JSON Web Token

Emerging standard. OpenID Connect mandates the use of this format. OAuth2 doesn't require it, but recommends it.

## Producing and consuming tokens in .NET

Microsoft Library on Nuget: Microsoft.IdentityModel.Tokens.JWT

### Producing

```
var token = new JWTSecurityToken(
	issuer: "http://myissuer",
	audience: "http://myresource",
	claims: GetClaims(),
	signingCredentials: GetKey(),
	validFrom: DateTime.UtcNow,
	validTo: DateTime.UtcNow.AddHours(1)
);

var tokenString = new JWTSecurityTokenHandler().WriteToken(token);
```

### Consuming

```
// retrieve the token from e.g. HTTP header
var token = new JWTSecurityToken(tokenString);

// validate token
var validationParams = new TokenValidationParamters {
	ValidIssuer = "http://myissuer",
	AllowedAudience = "http://myresource",
	SigningToken = GetSigningKey()
};
var handler = new JWTSecurityTokenHandler();
var principal = handler.ValidateToken(token, validationParams);
```

## What is OAuth2

An open protocol to allow *secure authorization* using a simple and standard method from web, mobile and desktop applications.
Problem: there is a human user who wants to access data
There is a different between a resource owner (a human) and a client (an application the human is using). This client application may have been written by a third party vendor which is not fully trusted.
Master key: full access to a resource e.g. main password
Valet parking key: restricted access to a resource e.g. an access token

### Players

4 players:
1. Resource Owner "owns a resource" on a...
2. Resource Server which trusts a...
3. Authorisation Server
4. Client. Can be trusted / partially trusted e.g. written by a third party as well as public (runs on a mobile device) or confidential (runs on a trusted server)

A Resource Owner uses a client, the client is previously registered with the Authorisation server and the Authorisation server authorises the client and issues a limited access key. With this key, the client can access the resource.

### Trust Zones

The Resource Server and Authorisation server belong to one zone and there is tight coupling between these two: the Authorization Server knows about the resources that you want to protect and the Resource Server knows how to validate the client access tokens it receives. 

The Resource Owner and Resource Server have a trust relationship with each other.

The client is not necessarily part of any Trust Zone (although could be made so in the Trusted Client scenario). This is different to other mechanisms e.g. WS-Trust where the client was always a trusted client.

### Flows

With User Interaction
* Authorization Code Flow - tends to be used with classically web server rendered applications. A web application client requests authorisation, requests a token, accesses a resource.
* Implicit Flow - used with native / local clients - request authorization and token together, access resource.
 
No User Interaction
* Resource Owner Password Credential Flow - for trusted clients, request a token using resource owner credentials and then access resource (closest to enterprice, where the client collects the master key and uses this to access the resource)
* Client Credential Flow - Client to server communication, a token is requested using the client credentials and then access is granted to the resource (no resource owner involved)







