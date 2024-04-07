---
title: Wrapping errors in Go
subtitle: A new approach using function currying.
---

I've changed **all** error wrapping in two production codebases from this:

```go
if err != nil {
  return errors.Wrap(err, "failed to do a thing")
}
```

And this:

```go
if err != nil {
  return fmt.Errorf("failed to do a thing: %w", err)
}
```

And (ugh... yes this existed somewhere) this:

```go
if err != nil {
  return errors.Errorf("failed to do a thing: %v", err.Error())
}
```

With the following code:

```go
if err != nil {
  return fault.Wrap(err, fctx.With(ctx))
}
```

As well as configured the "wrapcheck" linter to warn developers about anything other than `fault.Wrap` at error handling sites.

And I'm going to tell you why this was the best thing I did to those codebases this year.

## Enter: Structured Errors

> doesn't have the same ring as sandman

For a little context, [it's worth skimming over the previous post](https://www.southcla.ws/go-structured-errors/), in which I covered the journey that lead to "structured errors" which plug nicely into structured logging.

During that journey, I wrote a library called "errctx", error context, which performed the simple task of facilitating decorating call trees with metadata, dumping that into an error and allowing that data to be pulled out at the other end and logged out. Without the need for a complex tracing system set up.

But this was only half of the solution. After errctx saw a little bit of widespread experimental use among packages, some patterns were emerging.

```go
if err != nil {
  return errctx.Wrap(err, ctx)
}
```

This works great, but I had also written a few other helpers to solve other problems as well. And of course I didn't want to entirely _lose_ the ability to decorate error chains with additional _written_ content. So with pkg/errors and my other wrapper library, things got very crowded:

```go
if err != nil {
  return errctx.Wrap(errtag.Wrap(errors.Wrap(err, "failed to do thing")))
}
```

And if you read the earlier post, you know how I feel about ergonomics. This is very far from ergonomic.

## Package surface bloat

However, there was a problem I wanted to avoid. That was writing a large monolithic library that solved only my exact problems. These kinds of libraries can be useful sometimes but they can also just become open source for the sake of open source. In other words, not actually useful for others to use.

I wanted to write something useful. Something that other engineers and products can benefit from. I wanted to solve the problem of making structured errors easy while also providing a simple interface.

## State of the art

The way "error wrapping" in Go has a very commonly used pattern. It's not a defined pattern but more of an idiom that everyone just follows loosely.

Let's look at this code again, it looks familiar...

```go
errctx.Wrap(errtag.Wrap(errors.Wrap(err, "failed to do thing")))
```

This code must be read from inside out. `err` starts its involvement in this tangled mess by being referenced in a new instance of a struct from [pkg/errors](https://github.com/pkg/errors/) called [`withMessage`](https://github.com/pkg/errors/blob/master/errors.go#L188) and then again into [`withStack`](https://github.com/pkg/errors/blob/master/errors.go#L192) and then it's returned and passed to `errtag.Wrap` which does the same thing into a struct named `withTag` (if memory serves) and then _again_ into a struct called `withContext`.

![2024-04-07-21-18-48](/images/2024-04-07-21-18-48.png)

Just because our _data structure_ is heavily nested, does not mean our code ergonomics need to echo that so explicitly. What we're actually doing is (conceptually, not in reality) creating immutable copies of the input with some additions.

The familiarity I pointed out earlier is that of HTTP middleware (or, really, any kind of middleware-esque data mutation pipeline)

Middleware essentially takes a request and creates a new request with some extra information tacked on. Again, conceptually, not all the time in reality.

But you don't set up middleware with a bunch of nested function calls do you?

## Functional programming in the wild

> yes, it actually happens sometimes!

How HTTP middleware is designed in most libraries and languages as a stored list of curried functions which are then _applied_ to each request. A curried function is basically a function where you've shuffled around the arguments so that you store some input parameters but return a new function that has not been called yet.

This technique allows you to specify _some_ parameters now and others _later_. This is powerful, especially when you have a common function signature and an uncommon set of additional parameters you want to provide.

Say you have this function, and you want to apply it to a whole bunch of input data. But your separator and your prefix never changes.

```go
func joinAndPrefix(strings []string, sep string, prefix string) string {
  return prefix + strings.Join(strings, sep)
}
```

In this example program, the input data is sort of like a conveyor belt of parameters as this function is repeatedly called with different inputs:

![2024-04-07-21-19-14](/images/2024-04-07-21-19-14.png)

a, b, c, d and e here are just different string slices, but the other params are always identical.

Since you're always going to pass, for example `","` as the separator and `"items: "` as the prefix, you can curry this function to make it more ergonomic and easier to test.

```go
func makeJoinAndPrefixer(sep string, prefix string) func([]string) string {
  return func(s []string) string {
    return prefix + strings.Join(s, sep)
  }
}
```

Now we can construct a function with, essentially what is, some pre-defined parameters:

```go
prefixer := makeJoinAndPrefixer(",", "items: ")
```

And apply that function to inputs, since the other two arguments are kind of stored _inside_ the function instance itself:

```go
prefixer([]string{"sword", "shield", "milk"})
// items: sword, shield, milk
```

![2024-04-07-21-21-02](/images/2024-04-07-21-21-02.png)

The separator and prefix are now stored inside the function, the only thing that now changes for each invocation of the function is the string slice parameter.

And, you can imagine this being very useful in a data pipeline, say you had a map/filter/reduce library ([such as this one I made quickly one day](https://github.com/Southclaws/dt)) you could easily pass this prefixer to the pipeline:

```go
data := [][]string{ ... }
newData := dt.Map(data, prefixer)
// newData = []string{ ... }
```

And if you have a well defined and understood function signature, such as `(http.ResponseWriter, *http.Request)` then this idea suddenly becomes extremely useful!

Think about it, you don't build middleware with dependencies by writing functions that look like this:

```go
func auth(w http.ResponseWriter, r *http.Request, a *authService, jwt *jwtDecoder, l *logger.Logger)
```

[https://github.com/Southclaws/dt](https://github.com/Southclaws/dt)

You'd write it like this:

```go
func auth(a *authService, jwt *jwtDecoder, l *logger.Logger) func(w http.ResponseWriter, r *http.Request)
```

(In reality it may look slightly different as you may be using a non-standard HTTP library like Echo, or the more commonly used middleware approach with `func (next http`**`.`**`Handler) http`**`.`**`Handler` but the fundamental concept is the same)

So, that's a lightning course on currying, named after Haskell Curry by Moses Schönfinkel. But how does that help us make error management more ergonomic?

## `func(error) error`

> (btw that's the mic-drop moment of this whole post)

Given that all these error libraries typically implement themselves as `Wrap(error, otherstuff...)` so if we want to combine many error wrappers together, all we need to do is _curry_ the functions!

Now, _any_ error library can be implemented as a series of simple decorators that contribute whatever information they need to the error chain. Instead of picking between a few huge batteries-included error libraries or composing a bunch of nested function calls, you can cleanly compose together small simple utilities.

```go
if err != nil {
  return fault.Wrap(err, fctx.With(ctx), ftag.With(ftag.InvalidInput))
}
```

Any wrapper from any library can be curried into a Fault decorator. Let's say you have a library for storing the current request ID into an error:

```go
func WithReq(id RequestID) func(error) error {
  return func(err error) error {
    return reqerr.Wrap(err, id)
  }
}
```

And now it can be added to a Fault error wrap site, alongside any other decorators you may need:

```go
if err != nil {
  return fault.Wrap(err, fctx.With(ctx), WithReq(requestID))
}
```

There's a lot you can do with such a simple interface. Fault comes with some utilities that provide Fault decorators to add useful metadata to your errors.

One of those is fctx, which allows you to annotate contexts with key-value metadata then copy that data into an error chain if something goes wrong. This means you can easily access information about a call tree in a structured, ergonomic way that plays well with structured logging tools. You can read more about that here:

[Structured Errors in Go](https://www.southcla.ws/go-structured-errors/)

Aside from fctx, there are two more utilities that you may find useful.

## fmsg - people-friendly error messaging

One of the major issues I've run into time and time again when building medium sized web applications is how to properly communicate various types of problem to end users. Developers are usually half-covered by scrappy `errors.Wrap(err, "failed to do xyz")` messages. It can get you pretty far with low effort. But you can't drop an all-lowercase, techno-jargon-laden, poorly-thought-out string of brain dump onto your end users. That's just rude.

There's a fantastic article written by Jenni Nadler about the massive undertaking at Wix to improve their error messaging to people who use their products. I'd recommend giving it a read:

[When life gives you lemons, write better error messages](https://wix-ux.com/when-life-gives-you-lemons-write-better-error-messages-46c5223e1a2f)

Many years ago, I wrote a little helper for an open source web project called `WithDescription`. (little did I know that I would copy-paste this helper into 7 other codebases after that...) and this helper basically wrapped an error in a very similar way to how pkg/errors did, but instead of one string of text it accepted two.

The second string was basically a message that would be sent to the API consumer with the intention that it would be displayed in the user interface so the user knew a little more about what went wrong.

```go
web.StatusNotFound(w, web.WithDescription(errors.New("not found"), "No posts were found with that ID"))
```

That helper wasn't really used much. It was [buried in a "utils" package](https://dave.cheney.net/2019/01/08/avoid-package-names-like-base-util-or-common) and I never remembered to use it.[¹](#side-note-1-forgetting-stuff)

So when I read Jenni's article I remembered this helper I wrote and the problem I was trying to solve and an evolution of this idea ended up being part of the early version of Fault.

### Writing for your audience

An astute reader may have noticed that Fault's `Wrap` function has no string message. This is because the return value, while satisfying the error interface, is nothing but an empty shell with the sole purpose being to hold an _actual_ error[²](side-note-2-error-containers).

```go
if err != nil {
  return fault.Wrap(err, fmsg.With("failed to order pizza"))
}
```

This is functionally equivalent to the `Wrap` of pkg/errors. It's designed for short simple sentences aimed at other developers to read. These messages are, as you would expect, accessible by the `.Error()` method. They are joined together with `": "` so when you handle the error, you can access (if you really want to) that oldschool 100 character mess.

But for prettier error messages, aimed at people _using_ your product, you can write:

```go
if err != nil {
  return fault.Wrap(err,
  	fmsg.WithDesc("failed to order pizza", "There was a problem ordering the pizza."))
}
```

And, you can add more messages further up the call tree.

```go
if err != nil {
  return fault.Wrap(err,
  	fmsg.WithDesc("failed to process cart", "Your basket could not be processed."))
}
```

Which looks a little something like this:

![2024-04-07-21-21-58](/images/2024-04-07-21-21-58.png)

When you handle the error, simply call `GetIssue` to access a string joined by spaces of all the human-readable messages in order of occurrence

```go
issue := GetIssue(err)
// Your basket could not be processed. There was a problem ordering the pizza.
```

This simple approach may not work for all cases, but for early-stage products that are growing in size rapidly, it's a game changer for user experience to be able to say _something_ instead of a generic "Oopsie! Something went wrong 🤪 pls contact support!"

## ftag - classify your error chains

Another issue we kept running into was error chains that expressed a particular _type_ of problem, but inferring all possible types of problems was not trivial with the bare bones Go standard library errors.

Well, I mean, it is but it involves either creating a number of custom error wrappers and searching for them with `errors.Is` or copious amounts of string pattern matching.

But the issue was, when a HTTP handler function handled an error, how was it meant to know which HTTP status code to send to the client? Now you can do approximately one status code with the Go standard library tools:

```go
if errors.Is(err, sql.ErrNoRows) {
  w.WriteHeader(http.StatusNotFound)
}
```

Which is fine if your only data source is SQL and your only possible type of response is 404 Not Found. But in real-world applications with all sorts of complex business logic happening, it's not always as simple as that.

For example, a resource being not found may actually be a business logic violation, a failed precondition, to borrow from gRPC's nomenclature. So if your query threw a "not found" but your service layer is built under the assumption that the resource _does exist_ and if it doesn't, that's not just a simple "not found" it's an internal server error. Suddenly your `errors.Is` isn't doing the right thing anymore.

![2024-04-07-21-23-38](/images/2024-04-07-21-23-38.png)

Now you're not alerting your team about 404 errors. Otherwise Slack would be full of alerts about requests to `/wp-admin`. So allowing "not found" errors to creep through your service layer means your users are going to find out about bugs before your engineering team does.

## Tag your error chains!

An "ftag", or, Fault tag, is just a simple string attached to an error chain. There's only ever one and the most recently added will overwrite the previous. The default is `Internal`

```go
if err != nil {
  return fault.Wrap(err, ftag.With(ftag.InvalidArgument))
}
```

The ftag library started life as "errtag" and it used an interface to describe a tag. But that was too awkward to use. Now, ftags are literally just simple strings. You can create your own, or you can use the built-in types which cover most common classes of problem that may occur:

Code here:

[Southclaws/fault/ftag](https://github.com/Southclaws/fault/tree/master/ftag)

## Map ftags to HTTP status codes

Now you've tagged all your error chains with the appropriate classification, you need to act upon it. Here's a simple helper that maps some of the ftag classifications to HTTP status codes:

```go
func statusFromErrorKind(k ftag.Kind) int {
	switch k {
	case ftag.InvalidArgument:
		return http.StatusBadRequest
	case ftag.NotFound:
		return http.StatusNotFound
	case ftag.AlreadyExists:
		return http.StatusConflict
	case ftag.PermissionDenied:
		return http.StatusForbidden
	case ftag.Unauthenticated:
		return http.StatusForbidden
	default:
		return http.StatusInternalServerError
	}
}
```

If you're using something like Echo with a top-level error handler, you can just call this there and set the response status code once. This means you don't have to write explicit repetitive error-handling code in every single handler.

## End goals

My ultimate end goal was to make my team members' lives easier by

- making errors structured like logs are
- making it hard to forget to add relevant information
- reducing the need for explicit branching during error handling

And so far, after about a month in two production codebases, I'm very pleased to report that error management has become boring and functional with minimal effort required.

But I'd also like to hear some feedback. The `func(error) error` interface feels so simple and useful to facilitate flexibility in implementing small simple composable error utilities. I'm wondering what else members of the Go community may do with this.

If you read this far, thanks! it's a stark contrast to [my low quality tweets](https://twitter.com/Southclaws).

Also, if you enjoy working on a codebase with high-quality error management (honestly, weirdly specific, but that's cool) [hit me up](https://www.vouch.works/southclaws) as we're hiring Go engineers!

## Appendix

> some notes on the above and the future of Fault

### Naming

The fault sub-packages were originalled named:

- errctx
- errkind
- errmsg
- errmeta (deleted)

And I made the decision to change the naming just to cut down on noise and play nicely with gopls giving suggestions. It sounds silly but just having the letter `f` being the go-to for Fault as well as Fault's decorator utilities is handy.

![2024-04-07-21-24-03](/images/2024-04-07-21-24-03.png)

### Helpful snippets

Here's a snippet I use constantly for quickly setting up an error wrap site with Fault and fctx:

```json
{
  "if err != nil": {
    "prefix": "iferr",
    "body": [
      "if err != nil {",
      "\treturn nil, fault.Wrap(err, fctx.With(ctx))",
      "}"
    ],
    "description": "Snippet for if err != nil"
  }
}
```

Given that 99% of the time, there's always a `context.Context` in scope, it saves time to just default to having an `fctx` in there.

That being said, if you're frequently using the same combination of decorators, it's probably worth writing a function that combines them:

```go
func W(err error, ctx context.Context, msg string) error {
  return fault.Wrap(err, fctx.With(ctx), fmsg.With(msg))
}
```

At the beginning of this article, I mentioned that I had configured a linter called "wrapcheck" to treat anything other than Fault as a warning. Here's how I did that using golangci-lint:

```yaml
linters-settings:
  wrapcheck:
    ignoreSigs:
      - fault.New(
      - fault.Newf(
      - fault.Wrap(
```

This means you cannot use `errors.New`, `errors.Errorf`, `fmt.Errorf`, `errors.Wrap`, or any other error library in your codebase by accident.

Not that it really matters, there's nothing about Fault's design that makes it not work with other error-wrapping libraries or root error constructors, it's just easier to stick to one wrapper with many small, simple use-case-specific decorators.

### Side note 1: Forgetting stuff

I mentioned earlier that I didn't use `WithDescription` because I simply forgot it existed. Part of why that happened I think was that for _so long_ my default was `errors.Wrap`. Typing that for almost a decade builds muscle memory. If I'm not hacking on a throwaway codebase, I typically would always wrap errors.

Now I should point out that this was slowly becoming blind faith. Instead of actively thinking about what context was necessary at any given error wrap site, I would just write "failed to _verb_ the _noun_".

Fault forces me to think again. If I'm sitting there, staring at:

```go
fault.Wrap(err,
```

I can't just default to a quote mark and a useless string of text that provides zero value to future readers of the error.

Do I have a `context.Context` in scope? Okay, `fctx.With(ctx)`.

Is this something the user can maybe action? Was their input wrong or is the program in an invalid state that the user can resolve themselves without contacting support? Okay, `fmsg.WithDesc`.

Is the problem that occurred here completely find with sending back a 500 Internal Server error or is there a more semantic classification of this problem? Okay, `ftag.With`.

### Side note 2: Error containers

When you wrap an error with Fault, you can pass nothing at all. And given that Fault provides no built-in way of adding a string message to the error, you might be wondering what Fault is doing in that case.

As with any error management library, you'll get some stack information to help you figure out where the problem is. Pretty standard stuff. See the Fault readme for information about that.

In this sense, a Fault error (the underlying type returned from `Wrap`) is more of an _error container_. It's not representative of any surface level error information but it's more of a metadata wrapper around the underlying error value. This kind of breaks a few assumptions around the error type. Such as the return value of the `.Error()` method.

![2024-04-07-21-24-23](/images/2024-04-07-21-24-23.png)

Calling `.Error()` on the outer-most error yields: "failed to perform task xyz: `<fctx>`: connection refused"

So what actually happens when you call `.Error()`? Fault walks the error chain and _skips over_ any Fault containers (of which there may be a few in the chain if you're wrapping every single error). The non-Fault errors then simply contribute to that boring `": "` separated joined string I mentioned earlier.

Though this does also introduce another problem for metadata providers. fmsg provides a string but fctx does not. So it simply returns `<fctx>` from the `.Error()` method.

I wasn't quite sure what to do for this case as I'm bordering what would be considered idiomatic usage of the `error` interface. This seems fine, given that I'm not actually making use of the output of `.Error()` anywhere, Fault provides a much more useful `Flatten` helper for getting a structured representation of an error chain.

But it's an opportunity for improvement before v1.0 for sure.
