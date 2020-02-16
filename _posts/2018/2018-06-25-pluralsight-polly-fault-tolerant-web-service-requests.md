---
layout: post
title: "Pluralsight: Polly Fault Tolerant Web Service Requests"
---
## Learning the Basics of the Polly Framework

### Resilience strategies

* Reactive - responds to a current problem
    - Retry - retries immediately
    - Wait and retry - wait before sending retry request
    - Circuit breaker - stop all requests to a fault service
    - Fallback - return default value (if request fails) - often used in combination with other policies
* Proactive - monitors for potential problems and acts ahead
    - Timeout - set a specific timeout rather than waiting for the default from the HttpClient
    - Caching - store a previous response and serve this
    - Bulkhead isolation - limit number of requests and queue of waiting requests

### Retry Policy

There are 2 parts: handler part - what to check for and the behaviour part - what to do if the criteria is met. A delegate can also be called prior to each retry.

NOTE: not recommended to instantiate in the constructor of the controller.. Better ways to share across controllers and across projects.

```
readonly RetryPolicy<HttpResponseMessage> _httpRetryPolicy;

public CatalogController()
{
    _httpRetryPolicy = Policy.HandleResult<HttpResponseMessage>(r => !r.IsSuccessStatusCode).RetryAsync(3, onRetry: (response, timespan) =>
    {
        if (response.Result.StatusCode == HttpStatusCode.Unauthorized)
        {
            PerformReauthorisaction();
        }
    });
}

public Task<IActionResult> GetOrders()
{
    // calling the remote service
    var response = await _httpRetryPolicy.ExecuteAsync(() => _httpClient.GetAsync(_endpoint));
}
```

NOTE: The `IAsyncPolicy` is useful for unit testing, but otherwise the concrete types are simpler for demonstration purposes

### Wait and Retry Policy

Wait before the next retry and also allow increasing the backoff between each subsequent request e.g. Ethernet uses an exponential backoff when collisions occur.

```
.WaitAndRetryAsync(3, retryAttempt => TimeSpan.FromSeconds(Math.Pow(2, retryAttempt)/2))
```

Can additionally add jitter i.e. randomness so that not all services are backing off and retrying at exactly the same time

### Fallback

Additionally declare a fallback policy and a meaningful default which the policy will return. Then wrap the currently wrapped call again.

`var response = await _httpFallbackPolicy.ExecuteAsync(() => _httpRetryPolicy.ExecuteAsync(() => _httpClient.GetAsync(_endpoint)));`




