---
title: Structured errors in Go
subtitle: Bridge the gap between structured logging and errors in Go
hero: /structured-errors-in-go.png
date: 2023-01-09
---

This post documents a catalogue of experiments on the topic of error management in medium-sized Go programs, specifically HTTP APIs, with certain end goals in mind around ergonomics, syntactic salt and making the lives of everyone involved easier. The final result is a simple approach and a new library that I've been using in production for a couple of months now.

Error handling (or, more accurately, error _management_) has always ended up being a hot topic with Go. Most likely because of two things. Firstly, Go's early ideas about error handling – as with a lot of Go's design – chose to steer away from commonly found implementations such as exception handling and opted for a vastly simpler (at least from an implementation perspective) approach: return values. Secondly, the smallest, simplest form of an error in Go is a string of text. This leaves a lot of room for building on top of the simple concept of a string of text.

```go
type error interface {
    Error() string
}
```

Every Go programmer is familiar with this interface. The beauty in simplicity here is that any type that satisfies this interface is an error. This allows us to construct domain-specific types that satisfy our needs if those needs stretch beyond a simple string of text.

Okay, so you know that. I did the one thing I hate in articles about some topic and described the absolute basics of said topic despite the fact that whoever is reading this already knows all of that before getting to the _actual_ content.

## Structured logging

> (unrelated to lumberjack unions)

I won't do that here, promise. You all know what structured logging is. It's basically a standard concept in most medium and larger systems. As [Brandon Willett writes](https://www.willett.io/posts/precepts/), **Structured logs are non-negotiable**.

So what does this have to do with error handling? Well, first of all, let's define _error handling_ by showing what it's not:

```go
data, err := service.GetAccount(...)
if err != nil {
    return nil, err
}
```

This is not error handling. Nothing about this code is handling anything. This is I-don't-know-what-to-do-with-this-error-so-you-deal-with-it.

And this is fine and this is still one part of what I call error _management_ because there are a few different key events during the lifecycle of an error.

```go
data, err := service.GetAccount(...)
if err != nil {
    return nil, errors.Wrap(err, "failed to get account")
}
```

This is somewhat more involved, and arguably, more useful error management. We're now annotating the error with a bit more context. So when we finally _handle_ the error, we will see the original error that `GetAccount` produced as well as some _context_ relevant to the caller of `GetAccount`.

And this is _error management_ for a lot of Go code. Glueing strings together is – a lot of the time – _all you need_.

```go
data, err := service.GetThing(id)
if err != nil {
    return nil, errors.Wrapf(err, "failed to get account: %v", id)
}
```

So now, let's say the implementation of `GetAccount` accesses a database and the database is offline, we would see something like:

```
failed to get account: 59: database connection refused
```

The actual _handling_ of this error occurs elsewhere. I'm willing to bet that within the majority of cases, where the service is some form of HTTP based API, the error handling happens near the service boundary.

The service boundary for a HTTP server is a route handler. The typical approach is:

1. there's an error! oh no
2. log.Error
3. http.StatusInternalServerError
4. the user tweets the error screen to your company account and everyone is slightly less happy

Step 2 is what we're interested in here. _Handling_ an error in this example means we tell someone about it. That someone is, again, in the majority of cases, probably a log aggregator and an alerting system and, eventually, a human.

Now, log aggregators are incredibly powerful. You can filter based on the service, the account that made the request, the trace ID, the filename that the log entry originated from, the region the service is running in, and infinitely more options. This is extremely useful for diagnosing issues at scale.

But you can only do all of that stuff if you _actually_ structure your log entries. And this is not very structured:

```json
{
  "message": "failed to get account: 59: database connection refused",
  "level": "error",
  "file": "api/get_user.go:56"
}
```

I can't filter all logs by account "59". Well, I can, I can search for the string of text "account: 59" but that won't help when developers use slightly different wording in their messages. Strings of text are for humans to read after all.

In a perfect world, it would be nice to do this:

```json
{
  "message": "failed to get account: 59: database connection refused",
  "level": "error",
  "file": "api/get_user.go:56",
  "account_id": "59"
}
```

Which you can do with any structured logging library, but there's a wide gap between your error value and your `log.Info` call. You can solve this by creating a custom type that satisfies the `error` interface:

```go
type AccountError {
  message   string
  AccountID int
}

func (a *AccountError) Error() string {
  return a.message
}
```

Then, when you handle the error, you can check if the error is of this type and pull out the account ID for logging.

```go
var ae *AccountError
if errors.As(err, &ae) {
  // add ae.AccountID to the structured logging call
}
```

That's a lot of work, imagine doing that on a large system with many different kinds of resources, many different kinds of metadata you want to include with logs. It would be easier if you could just store a `map[string]string` of metadata and log that, right?

## The importance of being ergonomic

> (not a yoga ad)

One thing I've noticed throughout my career in myself, coworkers and open source collaborators I've worked with is that if you make good things hard to do, people won't do them.

Take testing as an example. I wrote a bunch of C++ early on in my software authorship and writing tests for C++ is a whole ordeal. You need a completely separate independent tool to handle the dance of compiling and linking your code as a separate binary with a bunch of extra tooling, macros and functions to facilitate telling the test system where your test functions are.

Compare that to Go where 1. it's built into the toolchain and 2. you literally just add "\_test" to your filename. This is so simple that it removes all barriers to writing tests. Easy to write means developers actually do it early instead of ending every PR with a commit titled "add tests".

I've still never written a single C++ test, I couldn't get the tooling to work with my CMake setup and my compiler configuration so I gave up. Not ergonomic.

## The ergonomics of errors

When it comes to errors, Go does have a fairly ergonomic mechanism. You write a message, maybe add another message, you read it later in the logs and figure out what went wrong. It's easy to create errors and it's easy to add context to error chains.

With custom error structs however, it's a lot of writing to create your own error type and thus it becomes more of a burden to encourage your team members to do this. I've worked in codebases where there are a couple of custom errors for special cases but most of the time it ends up just being `errors.Wrap(err, "thing failed to do stuff")` which, the majority of the time, I do not find that it adds value to the diagnostic process when things go wrong.

The key is to build this concept into your entire codebase so it doesn't get forgotten. If every single instance of error handling does X, Y and Z then when new developers join your team, they will notice that and follow convention.

## Design

So we want ergonomics? Let's start from the top. Forget implementation details, we care about the `user experience` of our error management solution. Treat your libraries like products and your team as end-users and you'll have a happy team.

What we want is:

1. to decorate errors with metadata
2. to easily access that metadata when it comes to logging the problem or sending a response to the client.
3. make it stupid simple

So I'm going to copy the popular Go structured logging library, Logrus, for this example. It's widely used so it's probably doing something right when it comes to ease-of-use.

```go
log.WithFields(log.Fields{
  "event": event,
  "topic": topic,
  "key": key,
}).Fatal("Failed to send event")
```

What we want is something similar to this. Let's sketch it out:

```go
if err != nil {
  return Wrap(err, Fields{
    "event": event,
    "topic": topic,
    "key": key,
  })
}
```

Looks good! We're wrapping the error and the wrapper function takes a second argument that a developer _must_ fill with a `Fields` object.

And at the other end, we just need to easily pull out the data in a form that's simple to pass directly to a call to our logging library:

```go
if err != nil {
  metadata := GetErrorFields(err)
  log.WithFields(metadata).Error("failed to handle request")
  w.Write(http.StatusInternalServerError)
  return
}
```

Perfect! We now have structured errors, compatible with structured logging. It's low effort to use and the benefits when diagnosing issues are huge.

And I actually wrote this in early 2022 for [Odin's](https://joinodin.com) codebase because problems were becoming increasingly difficult to diagnose due to poor error messages. The logging helper was added to one slice of the application to try it out. It made diagnosing bugs both at development time and in production vastly simpler since I had decorated many of our error returns with additional contextual metadata to aid searching in Datadog.

But the problem here is there was still an immense amount of manual work required to add all these bits of metadata to error returns. One call to `Wrap` is fine but if you have a complex piece of business logic with 10 or more `if err != nil`'s scattered around, it suddenly becomes a lot of work and that hurts the ergonomics.

## Bridging the context gap

I've been using this word _context_ quite a bit already throughout this article. This word is defined by Oxford as:

> the circumstances that form the setting for an event, statement, or idea, and in terms of which it can be fully understood.

Go's adequately named "context" library does exactly this for call trees. It's a tool that's widely used for cancelling or giving deadlines to long-running operations but it can also be used to store information and carry that information throughout a call tree.

Now this powerful functionality is not to be taken lightly. Contexts involve a few allocations when reading or writing information (many more than passing arguments or accessing receivers) and from a core software engineering standpoint, contexts can serve to hide information as it's essentially a black box. You cannot iterate contexts and print out their contents. You must _know_ what you're looking for via a "context key."

So while I'm advocating for careful and considerate use of Go's context library, I'm also saying [stuff it full of as much metadata as you can find](https://isburmistrov.substack.com/p/all-you-need-is-wide-events-not-metrics). But seriously, as long as your actual business logic isn't dependent on the content of a context, I have found the tool quite useful for storing metadata about a call tree or an operation that can be accessed for non-business logic related operations such as logging and error management.

In reality, this looks like this:

```go
ctx = WithMetadata(ctx, "account_id", accountID)

...

if err != nil {
  return Wrap(err, ctx)
}

...

metadata := GetErrorFields(err)
// map[string]any{"account_id": 59}
```

Contexts only accrue information as they descend into a call tree. Once you return from a function where a context has been wrapped with any of the "With" APIs you often see in Go (`WithDeadline`, `WithTimeout` and my addition above, `WithMetadata`) that information is freed. So you can't do this:

```go
func Y(ctx context.Context) {
  ctx = context.WithValue(ctx, "key", "value")
  ...
}

func X(ctx context.Context) {
  Y(ctx)

  ctx.Value("key") // nothing, nil, zilch, it's gone
}
```

This is because when you "wrap" a context, you're creating a copy which is only sticking around for the duration of that stack frame. Once you return from a function you lose your modified context. There's no two-way state manipulation (a good thing) so you can't decorate a call tree on the way down and then read that information back at the top.

## Errors are context in reverse

Hot take. But if you squint a bit, errors are basically contexts but they operate on the ascending side of the call tree, not the descending side.

Contexts accrue information as they descend the call tree and errors accrue information as they ascend the call tree.

This means that, if you want to store structured metadata in a context, that information is only useful if you pass it to an error so that metadata can ride the call tree ascension like a rollercoaster all the way up to the top where it's actually useful.

![2024-04-07-17-08-55](/images/2024-04-07-17-08-55.png)

> The Von-Neumann architecture is basically a rollercoaster. You can either go up or down and usually, if you're going backwards there's a small chance shit hit the fan. (by [Meg Boulden / Unsplash](https://unsplash.com/@mboulden?utm_source=ghost&utm_medium=referral&utm_campaign=api-credit))

## Putting it all together

Okay it's about time we had some code. We need a context key, a helper to top up a context with some metadata and another helper to get it out again.

```go
type contextKey struct{}

func WithMeta(ctx context.Context, kv ...string) context.Context {
	var data map[string]string

	// overwrite any existing context metadata
	if meta, ok := ctx.Value(contextKey{}).(map[string]string); ok {
		data = meta
	} else {
		data = make(map[string]string)
	}

	l := len(kv)
	for i := 0; i < l; i += 2 {
		k := kv[i]
		v := kv[i+1]

		data[k] = v
	}

	return context.WithValue(ctx, contextKey{}, data)
}
```

Because we intend to call this multiple times during a call tree, any successive calls to wrapped contexts will already contain metadata. Now I've opted for an extremely simple approach of essentially copying all the fields, if there are any, into the newly wrapped context. This could be an opportunity for memory usage optimisation but that's for another day.

Now we need to wrap errors and store the context's metadata hash table into the error, simple stuff.

```go
type withContext struct {
	cause error
	meta  map[string]string
}

// Omitted: the error implementation that actually makes this an error.

func Wrap(err error, ctx context.Context) error {
	meta, ok := ctx.Value(contextKey{}).(map[string]string)
	if !ok {
		return err
	}

	return &withContext{err, meta}
}
```

And finally, a way to get the metadata information (or a zero-value) out of any error value.

```go
func Unwrap(err error) map[string]string {
	values := map[string]string{}

	for err != nil {
		if f, ok := err.(*withContext); ok {
			if m := f.meta; m != nil {
				for k, v := range m {
					values[k] = v
				}
			}
		}

		err = errors.Unwrap(err)
	}

	if len(values) == 0 {
		return nil
	}

	return values
}
```

Because errors in Go are essentially nested within each other like Russian dolls, we need to iterate the tree of errors by repeatedly calling `errors.Unwrap(err)` which is pretty much how many error management code works. We're basically searching through the chain for an instance of the type we're interested in.

Lots of error code does this repeated unwrapping, which sounds like it could be a performance concern in larger applications but there's an argument to be made that if your error handling code is your biggest performance concern then you need to either 1. stop causing so many errors or 2. use a different language!

## Things to watch out for

Great power, great responsibility and all that. As with any kind of logging system that's moving information from your application to a third party you must _must_ **must** avoid including any sort of PII (personally identifiable information) in your context, errors and logs unless you want to fail your SOC2 certification.

When decorating errors, the same rules as using logging applies. There are many great articles on this topic, but in summary, avoid:

- Email addresses
- Names, even if just first name
- Any form of institutional identifier such as social security, financial, healthcare numbers.
- Any kind of public social media handle
- (hopefully extremely obvious) bank information like credit card numbers or routing+account numbers

Some tips for what metadata can be included and will help you when diagnosing issues:

- Anonymous internal unique identifiers of any kind (user IDs, account IDs, company IDs...) any of them you have available, stick them in your context. You'll thank yourself later.
- Relevant timestamps. Obviously you have the timestamp of the log entry already but if you have any other timestamps available that are relevant to your business domain, include them so you can perform time-range queries.
- Slugs are often useful if you have non-technical/QA looking at your logs. Slugs are human-readable URL friendly names often used for things like blog posts or public resources (like a GitHub repository or a customer's subdomain)

And of course, you'll still run the risk of some developers using different naming conventions to other developers in key names, `user_id` vs `userID` for example. So establish a convention and stick to it. Use a centralised package of const strings and custom types to cause compiler errors if you need to. Make mistakes difficult.

## Here's one I made earlier

> (brits older than 25 who used to watch cbbc, iykyk)

Of course, it wouldn't be a technical article if I wasn't going to shill something I made. All of the above was essentially the experimental journey I went through to improve how errors work in a number of codebases I maintain and operate in production settings.

I've used those learnings to write (and rewrite about 3 times, based on feedback from many a Go engineer) a fairly simple but also pluggable error management library which includes the structured errors functionality discussed in this post as well as some other useful tools.

[https://github.com/Southclaws/fault](https://github.com/Southclaws/fault)

Now, because of the way this library is architected, you can just use the error context utility called [fctx](https://github.com/Southclaws/fault/blob/master/README.md#fctx) on its own as it satisfies the Fault wrapper interface as well as the commonly used `Wrap(error, stuff...)` pattern used in many libraries.

There will also be a future post diving deeper into some of the technical bits and rationale behind Fault and how I use it in production systems. So keep an eye out for that!

If you made it this far, thank you for reading! I hope this helps you navigate Go errors in larger applications. Feedback on the concepts and writing is greatly appreciated so [feel free to tweet me](https://twitter.com/Southclaws).
