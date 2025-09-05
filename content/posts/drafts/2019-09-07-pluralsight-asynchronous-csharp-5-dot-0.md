---
layout: post
title: "Pluralsight: Asynchronous C# 5.0"
---
# DevExpress Webinars - Async from scratch, from a language lover's perspective

Also by Jon Skeet, about the same time (7 March 2011). URL: https://www.youtube.com/watch?v=HpA2x_JvLD4

```
```

* Task = future or promise in other languages.
* Asking a task for a result will block the current thread until the task is ready for its result.
* Methods return a `T`, but `async` methods are declared to return a `Task<T>`
* This is similar to iterator blocks where the yield return is of type `T`, but the method returns `IEnumerable<T>` (similar code under the hood). In async case instead of the caller asking for the next item, we are waiting for some other thing to come back to us.

```
IEnumerable<string> GetFoo()
{
    yield return "hello";
    yield return "world";
}
```


* Debug > Windows > Parallel Tasks (nothing)
* Debug > Windows > Parallel Stacks (nothing) - switch to frame - not sure why

* In forms / web / WPF when you return from await, `await` will ensure you are called back on the UI thread so you can interact with controls etc.
* `await` won't necessarily need to complete on a seperate thread IF there is no waiting to do
* AND therefore if you don't call `await`, but simply say `var x = t.Result` THEN you won't get any of the magic which decides if it needs to use a different thread etc to wait for the result - it will simply use the current thread and you'll be blocked.
* Think of three very different things:
    - The caller - gets to go off and do whatever it wants
    - The async method - ends up getting paused
    - The async operation / awaitable object - does whatever it needs to do to complete its work

```
// caller
static void PrintPageLength()
{
    Task<int> lengthTask = GetPageLengthAsync("http://csharpindepth.com");
    Console.WriteLine("Can continue doing other things here ....");
    Console.WriteLine(lengthTask.Result);
}
// async method
static async Task<int> GetPageLengthAsync(string url)
{
    Task<string> fetchTextTask = httpClient.GetStringAsync(url); // async operation
    int length = (await fetchTextTask).Length;
    return length;
}
```

* As far as the calling code is concerned, the async method is a normal method which happens to return a `Task` type. The fact that it may or may not do some async stuff is ignored (the `async` keyword is not really necessary, but helps as a visual clue for developers - and therefore incidentally not specified in interfaces or abstract classes)
* Can only await `await`able expressions. The **awaitable pattern** determines this. It codifies what is meant by an **asynchronous operation**. 


# Pluralsight - Asynchronous C# 5.0
## A Quick Tour of Async in C# 5


# Getting Started with Asynchronous Programming in .NET

## Asynchronous Programming in .NET Using Async and Await

* Covering console apps, ASP.NET, win forms, WFP, Xamarin etc
* `HttpClient` only allows asynchronous connections c.f. the legacy `WebClient`
* Suited for IO operations e.g. Disk, Web/API, Database or Memory
* Suffixing method names with `Async` is no longer a design guideline
* A **continuation** is all the code in a method which is executed AFTER an `await`ed operation completes
* Multiple `await` keywords in a method, will introduce multiple **continuation**s
* The `await` keyword introduces a **continuation** allowing us to get back to the original context (thread)
* If you don't use the `await` keyword and an exception occurs - that exception will be swallowed, swallowed by the `Task` which is a reference to the ongoing operation
* Exceptions occuring in `async void` methods cannot be caught - so ensure that code inside event handlers (or delegates) is super simple and cannot cause exceptions in itself
    - Avoid `async voic`
    - Await asynchronous operations
* Don't call `Result` or `Wait()` unless you are in the continuation after using `await`