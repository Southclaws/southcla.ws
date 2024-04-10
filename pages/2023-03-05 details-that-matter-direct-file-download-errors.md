---
title: "Details that matter: Direct file download errors"
subtitle: How to gracefully handle errors when your customers load files directly from your API.
hero: /images/2024-04-08-17-46-17.png
---

You’ve probably seen this from time to time when interacting with online services. This happens when the software behind the site hits a problem and does not have a backup plan. “500 Internal Server Error” is a particular category of error defined in the [HTTP specification](https://datatracker.ietf.org/doc/html/rfc7231#section-6.6.1).

The vast majority of the time, these kinds of errors happen on requests to backend services rather than frontend services – the systems that do business logic rather than the systems that render web pages. So, with a lot of modern web applications being built on the frontend-backend separation of concerns model, you don’t see this kind of last-resort, white screen, Courier New typeface error code.

This is because you’ll be accessing a frontend that’s performing these requests to the backend elsewhere. Whether that’s on the server during the HTML page render or on the browser via a `fetch` function call.

But there are cases where users will be bypassing this safety net and their browser will make direct requests to the backend. These cases are usually to download or view files.

![2024-04-08-17-48-25](/images/2024-04-08-17-48-25.png)

All browsers have the capability to preview certain file formats such as images, audio, video and PDF files. So online services often serve these files with a HTTP header in the response: `Content-Disposition: inline` which instructs the requesting browser to render the file (if possible) in the browser’s window, instead of immediately downloading the file to the device.

And this is one of the requirements of building an investment technology platform that occasionally has to provide legal documents to customers. The nature of [Odin’s](https://www.joinodin.com/) business, unfortunately, involves lots of PDF files because apparently, lawyers can’t get enough of 1993’s smash hit Portable Document Format.

Now, Odin is a heavily product-driven company, and I am very proud to be part of a team that cares deeply about the details when it comes to all aspects of a customer’s experience when using the platform. This care also means we have to embrace the fact that problems will occur, so we apply the same strict process of design and consideration to the unhappy path as we would the happy path.

![2024-04-08-17-48-34](/images/2024-04-08-17-48-34.png)

> No bare courier new allowed, we’re doing full HTML errors.

This is what the backend service kicks back if it runs into an error during a direct file access request. Sure, it’s not using our designer’s beautiful design system or colours and there isn’t a squircle in sight, but it’s infinitely better than a tiny monospace cryptic phrase in the top left corner.

The error response is simply some hand-written HTML that the server responds with when it catches an unrecoverable error. There’s also a correlation ID and a link for customer support in there.

Building this in Go

---

_You can apply this idea to any stack, if Go isn’t your thing you can safely stop reading here, the rest of the post will dive into some code to implement this idea into a real-world application._

First of all, we need some HTML.

```html
<body>
  <main style="text-align: center;">
    <img src="https://your.company/logo.png" width="360px" />

    <h1>A problem occurred while satisfying the request</h1>

    <p>%s</p>
  </main>
</body>
```

Next, we format this string with the underlying error message. And _**no**_ that does not mean simply calling `err.Error()` and dumping whatever random assortment of strings it spits out into your error. Your customers deserve better than that.

[When life gives you lemons, write better error messages.](https://wix-ux.com/when-life-gives-you-lemons-write-better-error-messages-46c5223e1a2f)

Fortunately, [Fault](https://github.com/Southclaws/fault) is there to help with its end-user-specific error messaging helper. For more on that, check out the big post I wrote on why Fault exists:

And the last piece of the puzzle is to remember to set the correct header. You don’t need to worry about [Content Disposition](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Disposition) because HTML is by default rendered (otherwise the web wouldn’t be the web!) all you need is `text/html` as the [Content-Type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type) and your error message game will immediately be stepped up with minimal effort!

---

If you enjoyed this post, consider subscribing! I write about building products with a balance between the technology behind them, the design that goes into them and the cultural and political effects surrounding it all.
