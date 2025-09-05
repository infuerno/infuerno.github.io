---
layout: post
title: "Asynchronous Programming Succinctly"
---
## Chapter 1 Getting Started

* Any process that accesses the UI thread (UI-related tasks usually share a **single** thread) will be blocked in a synchronous application.

### Writing async methods

The `async` and `await` keywords are used to denote asynchronous methods:
* The `async` modifier must be used in the method signature
* Return type must be `Task<T>`, `Task` or `void` (event handlers only)
* Has to contain at least one `await`
* (optional) Name should end in `Async` e.g. `GetBrokenLinksAsync`

NOTE: methods are not awaitable - types are awaitable. Hence you await a `Task<TResult>` or a `Task`

```
        private async void btnName_Click(object sender, EventArgs e)
        {
            string text = await ReadTextAsync();
            lblName.Text += text;
        }

        private async Task<string> ReadTextAsync()
        {
            await Task.Delay(TimeSpan.FromSeconds(4));
            return "ola!";
        }
```

NOTE: don't return `void` unless creating an async event handler e.g. btnName_Click above. Methods should return `Task` if they return nothing or `Task<T>` if they return a value

### Avoid deadlocks

Deadlocks can occur if mixing synchronous and asynchronous code. If a method calls an asynchronous method, but does not await the result (i.e. calls it synchronously) a deadlock can occur.

This is due to contexts:
* A windows form application uses a UI thread = UI context
* An ASP.NET application has an ASP.NET request context
* If neither, the thread pool context is used

A method run on a button click which is not itself an asynchronous method, but which calls an asynchronous method will block the UI context thread. However when the async method it is calling is ready to return, it will wait patiently for the UI context so it can finish - it continues on the same context which started it. Deadlock.

Two solutions:
1. Use `async` all the way down
2. `Use ConfigureAwait(false)` - tells the async method not to resume on the context

## Chapter 2 How Do I Use Async

For a method returning `Task<T>`, call the method as any other that returns a value, but additionally `await`ing it:

    `int age = await GetAge(birthday);`

Alternatively, define the task and then await it in two seperate lines:

```
    Task<int> ageTask = GetAge(birthday);
    int age = await ageTask;

```

Use async with the factory pattern to create a new object asynchronously:

```
    private async Task<Person> CreatePerson(string firstName, string lastName, DateTime dateofbirth) {
        // process which creates a person and requires something asynchronous
        return person;
    }

    Person person = await CreatePerson("Dirk", "Gently", new DateTime(1975, 1, 1));
```


### Cancel an async task

Cancelling async tasks requires a CancellationToken object to be passed to the async method. If the async method is cancelled, it throws an `OperationCancelledException`.

* Instantiate a CancellationTokenSource object in the top most method e.g. `var cancelSource = new CancellationTokenSource`
* Filter a token down through the async methods e.g. `cancelSource.Token`
* Cancel the task by calling `Cancel()` on the cancel source object e.g. `cancelSource.Cancel()`
* Ensure the `cancelSource` is set to null at the end (why?)

### Cancel after a specific time

If no response has been received after a specific time, this allows us to cancel the task. In a similay way to above, explicitly call `cancelSource.CancelAfter(3000)` prior to calling the async method and passing in a token.

### Await in catch and finally

Also possible. e.g. call a web page and if not returned, load from back up.

### Abstract classes and interfaces

Abstract methods and interface methods are declared to return either `Task` or `Task<T>` as approprirate, but the `async` keyword is not used. When overriding or implementing the method, just need to add the `async` keyword.

## Chapter 3 Real World Examples

Bake in asynchronous functionality from the start. In particular consider reporting progress to the user. Use the `IProgress` interface with the Windows Progress bar in a win forms application to do this. 

### Displaying the progress of an async method

Use an `IProgress<T>` parameter to your async method to be able to report on progress via the `progress.Report(value)` method. The `IProgress<T>` allows you to defined a callback method which is run each time `.Report()` is called, passing in the value supplied to the callback method.

```
    var progress = new Progress<int>(percent =>
    {
        prgProgress.Value = percent;
        lblProgress.Text = $"Processing... {percent}% done";
    });
```

### Pausing the progress of an async method

`Task.Delay()` can be used to pause a task e.g. `Task.Delay(TimeSpan.FromSeconds(2))`. A cancellation token can additionally be passed to the `Delay` method e.g. `Task.Delay(TimeSpan.FromSeconds(2), cancelToken)`.

### Using Task.WhenAll() to wait for all tasks to complete

Add all tasks as parameters to the Task.WhenAll method where a Task is an async method returning a Task e.g.

```
private async Task DoSomething() { await ..... };
private async Task DoSomethingElse() { await ..... };

await Task.WhenAll(DoSomething(), DoSomethingElse());
```

Methods which return a `Task<T>` can be used with `Task.WhenAll()` and the return values available in a return type of array of type T i.e. `T[]`

Tasks can alternatively be added to a list of type `List<Task>` and passed to the `Task.WhenAll()` method.

### Using Task.WhenAny() to wait for any tasks to complete

Once one task completes, the others can be cancelled. Instantiate a new `CancellationTokenSource`, pass a token into each async method. When one method has returned, just called `Cancel()` on the `CancellationTokenSource` object.

### Process tasks as they complete

1. Add tasks to a list
2. Use `Task.WhenAny()` which will return the first task to finish
3. Remove from the list of tasks (otherwise the same task will just be processed multiple times)
4. Process the result as necessary
5. Keep going with the next task

## Chapter 4 Use SemaphoreSlim to access shared data

`SemaphoreSlim` is a lighter version of the `Semaphore` class and is intended for use in a local app because it can be used only as a local Semaphore.

1. Initialise a semaphore e.g. `var sem = new SemaphoreSlim(1)`
2. Get a lock on the semaphore e.g. `await sem.WaitAsync()`
3. Access the shared resource
4. Release the lock e.g. `sem.Release()` - potentially as the finally part of a try catch.

## Chapter 5 Unit Tests and async and await


