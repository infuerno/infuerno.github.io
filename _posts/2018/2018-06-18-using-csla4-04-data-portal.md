---
layout: post
title: "Using CSLA 4 04 Data Portal Configuration"
---

## Chapter 1: Data Portal Deployment

Supports 1-, 2-, 3-, 4- tier deployments. CSLA is comprised of 5 logical layers: Interface, Interface Control, Business Logic, Data Access, Data Storage and Management. These 5 layers can be deployed physically into various configurations.

The data portal manages the movement of objects between the Business layer running on the "client" and the Business layer running on the "server". The Business layer therefore needs to be deployed to both.

The Local channel (local proxy) does not cross the network. Both server and client side components are run within the same AppDomain.

The other channels at the very least cross AppDomain or process boundaries. 

The WCF channel for .NET uses the `NetDataContractSerializer` provided by WCF. Any binding which uses synchronous communication can be used (i.e. not MSMQ, but HTTP, TCP, named pipes all ok). 

"Proxy" on the "Client". "Host" on the "Server". The data portal proxy on the client side loads the proxy based on the `CslaDataPortalProxy` configuration setting. The proxy in turn invokes the host (often running within IIS), and the host the server side components.

### 3-tier Deployment

Possible to use 3-tier deployment model for a web application - isolating the web server from the organisation's internal network.

* Browser - Interface
* Web server - Interface Control and Business Logic
* App server - Business Logic and Data Access
* SQL server - Data Storage and Management

The data portal is configured to run in *remote* mode, WCF channel is recommended.  

### Using the Local Channel

The `CslaDataPortalProxy` is set to `Local` by default so explicit configuration (AppSetting) is not required.

Objects are nevertheless serialized and deserialized which incurs some overhead. ALL KINDS OF SIDE EFFECTS - NOT RECOMMENDED unless you are willing to write extra application code to deal with certain new scenarios this will introduce. 

### Using the WCF Channel

A WCF Channel consists of a `WcfProxy` class running on the client and a `WcfPortal` class running on the server (which uses WCF under the hood). Three primary elements define the connection on both the client and the server: Address, Binding and Contract. e.g. example client configuration:

```
<client>
<endpoint name="BasicHttpBinding_IWcfPortal" address="http://localhost:21647/SlPortal.svc" binding="basicHttpBinding" contract="WcfPortal.IWcfPortal" />
</client>
```

: Address
Address where the service is hosted

: Binding
The address will depend on the binding used. Serveral bindings use HTTP, but also TCP sockets, named pipes (all synchronous) and MSMQ queues (async).
e.g. tcp binding: `tcp://myserver.mycompany.com:12004/WcfPortal.svc`

*The data portal needs SYNCHRONOUS bindings.*

: Contract

Defines operation contract - methods a service implements; data contracts - properties or parameters for the methods; fault contracts - messages returned in event of failure. When using the WCF data portal channel, the service contract is defined by CSLA .NET. The .NET contract (as opposed to the Silverlight one) is `IWcfPortal` from the `Csla.Server.Hosts` namespace. 

#### Customisations

* WCF message size limits on the server need to be increased to transfer the object graphs - at least 6 different attributes which may need to be increased on the server binding
* ASP.NET and IIS size limits also need increasing e.g. `<httpRuntime maxRequestLength="2147483647"/>`
* WCF size limits on the client may also need to be increased, as well as send and receive timeouts
* Return faults by setting a custom behaviour on the server (required for the data portal to operate correctly)

#### Troubleshooting

* WCF can be configured to write detailed information to a .NET trace listener using `system.diagnostics` configuration element

#### .NET Client Configuration

1. Configuration to use the WCF Channel is by the `CslaDataPortalProxy` app setting:
`<add key="CslaDataPortalProxy" value="Csla.DataPortalClient.WcfProxy, Csla" />`
2. URL of the server e.g. using the `CslaDataPortalUrl` app setting (uses wsHttpBinding with maximum message sizes) OR explicity specify the client WCF binding with endpoint name WcfDataPortal OR explicity in code.

#### Server Configuration (IIS and ASP.NET)

Any ASP.NET web project which can run in IIS. The following references must be added:

* Csla.dll
* Business libraries
* Data access libraries
* Any other libraries required by the server side code

WcfPortal.svc file is the endpoint for the .NET data portal and contains a line detailing the type which implements the service (and nothing else).

1. Configure an application in IIS
2. Increase the ASP.NET maximum request lengths (as per customisations above)
3. Add WCF serviceModel configuration section as detailed

## Chapter 2: Data Portal Configuration Reference

List of all the appSettings that can be applied either client or server side for the data portal.

## Chapter 3: Serialization

Standard .NET serializer with 100% fidelity is `NetDataContractSerializer` (NDCS) replacing the previous `BinaryFormatter`. Although WCF defaults to the NDCS, CSLA defaults to the `BinaryFormatter` "for all operations outside the channel" - what does this mean? Does it use it or not? The `CslaSerializationFormatter` can use used to override the default.

## Chapter 4: Custom Data Portal Proxies

Useful for advanced scenarios. 
* Client proxy has a couple of use cases when a custom data portal proxy implementation may be required e.g. multiple server hosts (covered in further detail in this section)
* Custom server host implementations are rare - on your own for this

## Chapter 5: Authentication Models

In .NET the principal object is attached to the current thread or `HttpContext` object. CSLA.NET supports 3 authentication models:

1. Custom authentication
2. ASP.NET Memberhip Provider authentication
3. Windows authentication


### Custom Authentication

Use custom authentication when you want to authenticate users against your own database, LDAP etc rather than using their windows credential. To implement a custom principal - generally only need to implement Login and Logout operations. 

#### Custom Principal

* `BeginLogin` and `Login` methods take username and password, but details will vary depending on how you need to authenticate
* Both example methods invoke factory methods on the custom identity class
* No exception is thrown if the username or password is incorrect - the identity object returned will have `IsAuthenticated` set to false and the principal will contain no roles.
* `Load` method only requires the username - used by e.g. ASP.NET to load the principal on each request once already authenticated (by calling an equivalent method on the custom identity class)

#### Custom Identity

* Adding lots of properties to the custom identity has a performance impact
    - either add to a custom object on the LocalContext dictionary class (doesn't flow through)
    - or load each time on the application server
* Identity data access code needs to
    - verify identity
    - load roles
    - load any extra profile

#### Application Server Configuration

Discussion of how to implement loading the principal on the server EACH TIME

#### Client Application Configuration - ASP.NET Applications

ASP.NET provides support for authentication, including managing an encrypted user token in a cookie (or URL). The encrypted token minimally contains the username and the expiration time and (optionally contains roles, but not usually due to cookie size). ASP.NET creates a principal and identity from the authentication token, but this is minimal and doesn't contain roles or any other profile attributes. The `CustomPrincipal` required by the application needs to be make available for each request.

* Stateless applications - use the username from the authentication token (ASP.NET out of the box identity) to load the principal using the `Load` method of the `CustomPrincipal`.
* Stateful applications - keep the principal in Session - may or may not provide better performance

In the `Application_AcquireRequestState` in the `Global.asax.cs` the real custom principal loaded via `CustomPrincipal.Load()` (which in turn sets the `Csla.ApplicationContext.User`) or via `CustomPrincipal.Login()`

### Membership Provider Authentication

`CustomPrincipal` is same as above. `CustomIdentity` is similar. The data access is implemented using the "encapsulated invoke model" (see Data Access book).

* Data access code uses types from System.Web.Security - FULL .NET FRAMEWORK.
* However `Library.Net` targets the Client Profile - WHY? So to workaround the DAL provider needs to be DYNAMICALLY loaded. 
* A DalManager is used to dynamically load these types.
* DataPortal_Fetch methods in the CustomIdentity call the DalManager to get the dynamically loaded implementation of the dal (IIdentityDal)
* The IIdentityDal wraps calls to the MembershipProvider
* Two calls are made to membership `Membership.VerifyUser(u, p)` and then `Membership.GetUser(u)` - HOW DOES THE INCREMENT / AUTO LOCK OUT WORK
* GetRolesForUser uses `Roles.Provider.GetRolesForUser` rather than `Roles.GetRolesForUser` due to a bug presumably in .NET 4 - how do we specify the Application here? Rather than have to define two / three different connection strings and therefore providers?

### Windows Authentication

For ASP.NET applications using CSLA, the application must simply be configured not to perform any explicity authentication or impersonation



Why do we need to use ASP.NET membership? We simply need to store or update the id_token / user profile. From the graph API this has a distinct set of fields, and any custom ones can go into a custom table...?

BUT if we then need to support BOTH with ASP.NET membership AND without it??

We DO need to ensure that CSLA membership principal is instantiated properly from the regular Principal


Use the Membership Roles Provider with Windows Authentication.
Screens to administer will still remain within MABO (along with Q1, Q2)


