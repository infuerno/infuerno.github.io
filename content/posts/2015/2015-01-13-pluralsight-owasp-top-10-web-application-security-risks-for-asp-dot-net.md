---
layout: post
title: "Pluralsight - OWASP Top 10 Web Application Security Risks for ASP.NET"
---
## Injection

## XSS

### Output encode for the correct context
Ensure strings are output encoded correctly to mitigate XSS risks. Different outputs need to be encoded differently. Different outputs are required for: CSS, HTML, HTML attribute, HTML form URL, JavaScript, LDAP distinguished name, LDAP filter, URL, URL path, XML, XML attribute.

For example <i>Lager</i> is encoded in the following different ways:

Context | Encoded String
---|---
HTML | &lt;i&gt;Lager&lt;/i&gt;
JavaScript | \x3ci\x3eLager\x3c\x2fi\x3e
CSS | \00003Ci\00003ELager\00003C\00002F

### AntiXss Framework

In .NET applications the AntiXss framework contains some useful functions for output encoding HTML (in the `System.Web.Security.AntiXss` namespace)

    var searchTerm = Request.QueryString["q"];
    uxSearchTerm.Text = AntiXssEncoder.HtmlEncode(searchTerm, true); // use named entities

In order to output encode untrused data for the JavaScript context an additional library from NuGet is required also called AntiXss (also contains HTML encoders for pre 4.5 users)

    <script type="text/javascript">
        var q =  <% Microsoft class="Security Application Encoder JavaScriptEncoder(Request.QueryString["q"]) %>
    </script>

### Automatic output encoding

In ASP.NET web forms, the first example above, the label control's text attribute did not implement output encoding. This had to be added explicitly. However some controls and attributes do automatically include output encoding. Test this by outputting e.g. <i>Lager</i> and check if it is encoded correctly or not. 

In ASP.NET MVC the razor view engine automatically HTML encodes all output by default. The HtmlHelper (`@Html.Label("<i>Lager</i>")`) also encodes output. In order to stop the output encoding you need to use the Raw Html Helper (`@Html.Raw("<i>Lager</i>")`)

### Request validation

Explicitly whitelist data using a regex.

    if (!Regex.IsMatch(searchTerm, @"^[\p{L} \.\-]+$")) {
        throw new ApplicationException("Search term not allowed");
    }

ASP.NET by default uses RequestValidation which checks all untrused data for XSS. This can be configured in the web.config in the pages element:

    <pages validateRequest="false" />

On occasion, you may wish to POST html tags e.g. in a rich text editor. You can turn it off at the page level if necessary using `ValidateRequest="false"` in the page declaration of the code behind. (requestValidationMode needs to be set to 2.0 for this to work.)

As of .NET 4.5 the validation can only be turned off per control, but not per page. To do this:
1. Ensure requestValidationMode ( attribute of <system.web><httpRuntime> ) is set to 4.5
2. On the individual control set `ValidateRequestMode` attribute to `Disabled`

Additionally to access potentially dangerous query string requests use `Request.Unvalidated.QueryString`. In this way you can bespoke the request handling.

In ASP.NET MVC the `[AllowHtml]` attribute can be used to decorate the field in a model to e.g. allow special characters like `<` and `>` in a password field.

IMPORTANT. Always code as though request validation doesn't exist.

### Reflected XSS v Persisted XSS

So far all XSS examples have been reflected XSS. However, there may be persistant XSS in the database. In order to mitigate the risk of this running on the page, all data should be output encoded (e.g. using AntiXss.HtmlEncode at bind time)

### Browser behaviour

Different browsers may have their own defences against XSS. For example IE will post a message "Internet Explorer has modified this page to help prevent cross-site scripting" in the event of a potentially dangerous payload." This behaviour can be controlled via the use of custom headers e.g. in the web.config of the application.

    <system.webServer>
        <httpProtocol>
            <customHeaders>
                <clear/>
                <add name="X-XSS-Protection" value="0">
            </customHeaders>
        </httpProtocol>
    </system.webServer>

### Payload obfuscation

In order to...

## Broken Authentication and Session Management

### Don't store session IDs in the URL

When session id are stored in the URL, the session can easily be hijacked by sharing in the URL e.g. sending a link in an email, from proxy logs, from a browser history
Never have sensitive data in the URL even over HTTPS requests.
Usual method is to store the session id in a cookie - if cookies aren't enabled in the browser, this is a big security risk for session persistence.

#### ASP.NET Session Persistence options

UseUri				Always use the URL regardless of device support
UseCookies			Always use cookies regardless of device support
UseDeviceProfile	ASP.NET determines if cookies are *supported* (which won't work if they have been disabled)
AutoDetect			ASP.NET determins if cookies are *enabled*

### Don't roll your own

Developers frequently build custom authentication and session management schemes. Since building this correctly is hard, these often have flaws. Finding the flaws can be difficult since each implemenation is unique.

#### ASP.NET Membership provider

With a blank application and a blank database, all that is required is to add the database details to the web.config and the application will automatically create the necessary tables on first run.

With such a ready and easy to use authentication system, there is no need to create your own.

### Session and Forms timeout

* Session timeout is 20 minutes by default (just persists state between requests)
* Forms timeout is 30 minutes by default (involves authentication) - BUT the VS templates set it to 2 days
* Forms can have:
	- a *sliding expiration* (default) which means they will timeout x minutes after the last request
	- a *fixed expiration* which means they will alwasys be timed out after a certain amount of time

### Other broken authentication patterns

* Credentials should always be stored in a cryptographically secure way
* Robust minimum passwords
* Never send a password by email
* Protect session id cookies (e.g. ensure no XSS possibility, use HTTPS)

## Insecure direct object references

Scenario: web application which asks you to log in and then uses your username via an insecure web service to retrieve personal details. Using Fiddler to inspect any traffic shows a simple REST service with a query parameter of first name. Enumerating possible first names leads to other existing users and possible to retrieve their personal details.

Often exploited by someone who is already authenticated, but trying to access someone else's details.
Often exploited through automation and brute force.

### Implement correct access controls

This is 95% of the problem and is the main solution.

	if (User.Identity.Name != userNameRequested)
	{
		throw new ApplicationException("Not authorised");
	}

	// useful to have the functionality to be able to pass in the username (e.g. may be called by admin also)
	if (User.Identity.Name != userNameRequested && !User.IsInRole("Admin"))
	{
		throw new ApplicationException("Not authorised");
	}

### Implement a indirect object reference map

Numberous ways to store the map. Good for banks, but may be overkill for an average line of business web application. Are there multiple web front ends? Performance overhead?

Important principles:
* The map is temporary
* The map is user specific
* The indirect reference is random

Using session state automatically satifies the first two principles.

Example class to implement an indirect object map using string extension methods.

	public static class IndirectMap
	{
		public static string GetIndirectRef(this string directRef)
		{
			var map = (Dictionary<string, string>)HttpContext.Current.Session["Map"];
			return map == null ? AddDirectRef(directRef) : map[directRef];
		}

		public static string GetDirectRef(this string indirectRef)
		{
			var map = HttpContext.Current.Session["Map"];
			if (map == null)
			{
				throw new ApplicationException("No map found");
			}
			return ((Dictionary<string, string>)map)[indirectRef];
		}

		private static string AddDirectRef(string directRef)
		{

			var indirectRef = HttpServerUtility.UrlEncode(buff);

			var map = (Dictionary<string, string>)HttpContext.Current.Session["Map"];
			if (map == null)
			{
				map = new Dictionary<string, string>();
			}
			map.Add(new DicionaryEntry<string, string> {directRef, indirectRef});
			map.Add(new DicionaryEntry<string, string> {indirectRef, directRef});

			return indirectRef;
		}
	}

### Obfuscation via discoverable surrogate keys

Natural keys like names are vulnerable to enumeration, as are integers which can be easily enumerated. Keys like GUIDs are not easy to obfuscate, so although a direct reference are very difficult to enumerate. However this is only "security through obscurity". Importantly access controls are still required.

## Cross-site Request Forgery (CSRF / XSRF)

### Example

<https://nakedsecurity.sophos.com/2012/10/01/hacked-routers-brazil-vb2012/>

### Tasks

1. Download and run http://csrf application
2. Submit an update status request and study main POST request in browser network tools, find the authentication cookie and the status update
3. Download http://evilsite and browse to http://evilsite/Winner.html
4. Check back in the csrf application and notice that the evilsite has managed to trick the user into unknowingly submit a status update to the csrf site
5. Study the evilsite submission via the browser network tools to understand how this happened.
6. Notice also that the status update includes a link to evilsite. This has been rendered as HTML due to a lack of output encoding. This will propogate the attack further

* URL encode the whole query string
* Use a service like bit.ly or tinyurl
