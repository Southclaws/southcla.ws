---
title: How to implement server side logout in Next.js app directory
subtitle: It's more complicated than it should be! How to use revalidate and cache-control headers to implement a /logout page in Next.js app directory.
hero: /images/2024-10-02-18-51-15.png
---

I recently rewrote a couple naively implemented "logout"/"sign out" buttons in Next.js applications (both using the "App directory" setup) and it took enough frustration, digging and non-obvious documentation to convince me I needed to write a short guide for anyone else unfortunate enough to get trapped in this enigma.

## Standard setup

I build all sites and apps with the most securely configured cookies by default, no local storage Authorization bearer tokens, cookies use what browsers are already good at without the need to reinvent the wheel. It's very rare you actually need to take full control of session tokens with custom fetch headers and local storage implementations. Use-cases exist, but with additional contextual and specific requitements.

I also have very bad internet, so I frequently interact with pages before JS has loaded. Logging out is an absolute basic fundamental and should not require me to wait (sometimes tens of) seconds before I can action it.

So the solution needs to:

1. Work with server-side cookies, no JavaScript cookie access or client-side logic
2. Correctly flush the cache and trigger revalidation

## What you're here for, the solution

No recipe-blog-life-story for SEO, here's the solution, I'll leave my yapping for after.

### Don't use Next.js `<Link>`

Before you get to the actual handler, please be aware that you _cannot_ use the Next.js `next/link` anchor tag to link to `/logout`. The reason for this is, in Next.js' infinite wisdom, `<Link>` tags are clever and will trip you up. Don't get me wrong, their functionality is amazing at providing smooth app experiences, but they should only be used for navigating between pages in the authenticated experience. In order for `/logout` to work, we need a normal HTML page transition that triggers a full page reload.

The full page reload is actually what makes `revalidatePath` work as expected. Without this, yes the page _is_ revalidated, but if you [check the docs](https://nextjs.org/docs/app/api-reference/functions/revalidatePath) for this API, it notes that it only takes effect on the _next_ page load. Since you're (probably) already within a Layout component and not moving to a different layout component, it won't refresh. This is the bit that took me ages to realise.

```html
<a href="/logout">Logout</a>
```

### Route handler

`app/logout/route.ts`: which maps to `https://yoursite.com/logout`

```ts
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// Your frontend's address: http://localhost:3000 or https://my.production.domain.com
const WEB_ADDRESS = process.env.NEXT_PUBLIC_WEB_ADDRESS;

// Your cookie's name, usually specified by the backend.
const cookieName = "my-app-session";

export async function GET() {
  // Tell Next.js to purge the entire cache, no stale data should stay after the redirect back to the index page.
  revalidatePath("/", "layout");

  // You can redirect back to the index, or to another page such as /login
  const destination = `${WEB_ADDRESS}/`;

  // Clear the session cookie explicitly. Generally this can be done by just
  // using Set-Cookie: <cookie-name>=; but Next.js gives us an API to do it.
  cookies().delete(cookieName);

  return NextResponse.redirect(destination, {
    headers: {
      // Some browsers accept this directive to clear cookies and other data.
      "Clear-Site-Data": `"*"`,

      // Next.js accepts this directive to clear its own client fetch cache.
      "Cache-Control": "no-store",
    },
  });
}
```

## Why and how I got here

The apps I'm working on make use of a few Next.js features that made this whole ordeal more confusing than it should be. Regardless, the solution above will work for all scenarios, but I'm documenting how I got here for:

1. if any poor victims of Next.js are desperately searching the same keywords I was, and;
2. there were many red herrings along the way, and a lack of clear documentation or examples made it difficult to determine the root cause

### Parallel routes and conditional auth-based rendering

I make use of parallel routes in order to provide a different experience for the `/` index page based on whether or not you're logged in. A fairly standard approach ranging from changing a navigation item between "Login/Sign up" and "Your dashboard/profile/account/etc" to rendering an entirely different page, much like Linear.app, Vercel.com and GitHub.com - visiting the `/` index page on these sites will either drop you onto their marketing landing page or your account's dashboard, ther'es no separate `/dashboard` route, it's all on the home page.

Which is a nice user experience, I log in once and then always navigate to the root when I need to use the tool.

This throws a bit of a spanner in the works for revalidation, and was a source of a bit of confusion.

So, to refresh on [Next.js documentation](https://nextjs.org/docs/app/building-your-application/routing/parallel-routes), here's the deal:

You have a root `layout.tsx` and two folders, `@authenticated` and `@guest`. The guest route renders your marketing site, and the authenticated route renders your dashboard/feed/whatever logged-in users see.

Next.js will scan the root `app/` folder for folders prefixed with `@` and pass them as `ReactNode` props to the root layout.

```tsx
export default async function RootLayout({
  guest,
  authenticated,
}: Readonly<{
  guest: React.ReactNode;
  authenticated: React.ReactNode;
}>) ...
```

And then you conditionally render these based on some logic, most likely a call to your API to check if the user is logged in. You can also check if a cookie is present and skip the API call, but this can cause issues because a cookie being _present_ does not necessarily mean a _session_ is present. A cookie can contain anything, usually some sort of encrypted or signed token. But you really need to actually talk to the API to _validate_ that token, it may have expired, become malformed or become invalid by some other means.

```tsx
...
  const session = getSession();

  // Valid session? Show the user their dashboard
  if (session) {
    return <main>{authenticated}</main>
  }

  // No session? Show the marketing/landing page.
  return <main>{guest}</main>
}
```

Why this is relevant to the logout debacle is for two reasons:

1. Revalidation: This root layout will not re-validate unless you fully refresh the app
2. Parallel rendering: You may see a blank page if this branching logic gets confused

So, a brief overview of the footguns.

#### Revalidation

When you call `revalidatePath("/", "layout")` in the `/logout` handler, you might, as I did, expect this to trigger this root layout to re-render and this call `getSession` again, fail and render the guest route. This was not the case, _sometimes_... I thought I had cracked it at one point, but it turns out caching is hard (who knew!?) so sometimes this would work, other times it wouldn't.

Dropping a `console.log` into this root layout will confirm it doesn't re-render. Even if the `/logout` handler redirected to a different page, such as `/login` it would usually not cause a re-render. The times when it does re-render are simply due to timing out the max-age, pure fluke.

This is something that threw me off the trail of using `<a>` instead of `<Link>`, I thought `revalidatePage` was not working because in my mind, I _was_ navigating to the page again, because a 307 redirect in my mind means "Navigate the browser to this route".

What was actually happening was, Next.js was receiving that header, after not actually changing the underlying browser page being rendered and simply doing absolutely nothing. The browser did what it was told to: delete the cookie. But Next.js was going "I'm already at `/` so I won't do anything". This caused the root layout to remain unaffected and thus never checked the session and never re-rendered the guest content.

#### Parallel

Parallel routes are weird. They're quite useful for advanced page transitions and conditional routing, but they only work at the root level (for now) and hold confusing semantics that go against common expectations for how browsers work (a common theme with Next.js...)

In combination with the revalidation issues, this was another layer of red herring causing the browser's URL bar to change to `/login` but no content to change.

![the browser address bar showing /login but the page content did not change](<public/2024-10-02 how-to-implement-logout-nextjs-cache-revalidate/image-3.png>)

Essentially, what I understand happened was because that root layout never revalidated, it was still on the `@authenticated` parallel route, and `/login` does not exist within that folder. So, for unknown reasons, it simply kept the same page rendered (the `/` index), changed the browser's address bar to show `/login` and went to sleep.

![network tab of dev tools showing two requests, one to logout and one to the index page](<public/2024-10-02 how-to-implement-logout-nextjs-cache-revalidate/image-1.png>)

All the while, the network tab of developer tools showed everything as expected, a GET to `/logout`, a redirect header, a `GET` to `/login` but... wait

![network tab of dev tools showing the content-type header as text/x-component](<public/2024-10-02 how-to-implement-logout-nextjs-cache-revalidate/image.png>)

What on earth is `text/x-component`?

![the response body of the text/x-component request shows some proprietary Next.js format data](<public/2024-10-02 how-to-implement-logout-nextjs-cache-revalidate/image-2.png>)

That's not a HTML page, that's a Next.js internal thing, it's _describing_ a page, but it's not an actual page.

From what I can gather, this was Next.js skipping an unnecessary page transition as well as getting confused with parallel routes due to the root layout continuing to render a route group that did not contain a `/login` route, because that only exists within `@guest`.

### Blessing, curse, pick your poison, in too deep to quit?

(not relevant, but also not quite a rant about Next.js)

I love Next.js, I've used it since almost the first release, it changed how I build websites and webapps and solved enough of the React boilerplate back then (~2016/7 I think?) that it allowed me to focus on design, experience and product.

All the companies I've worked with, products I've built, I've used, recommended or migrated to Next.js and every time it's been a positive choice for everyone involved.

But, and I echo the sentiment of much of the major discourse I see around the product, it's getting _really_ complicated. App directory was a big step towards that complication.

And I like the app-directory setup, it's a mental model I can get behind. Metadata, opengraph, caching, swr, are all tools I use on every product I build and it's all very easy once you figure out the weirdness. And that's the problematic part that's making me recommend Next.js to others less and less.

#### Abstractions leakier than a screen door on a submarine

After so many years of using this framework, I'm still hit with poorly written (or empty) error messages, compiled JS stack traces that are completely useless to me, lack of context and generally just leaky abstractions all around.

React is an abstraction over HTML, and Next.js is an abstraction over React. On top of that you've got TypeScript, JSX and polyfill/ES version transpilation. A lot gets lost in translation and invalid states are too easy to get into.

And then on top of all of that, the novel behaviours and APIs that Next.js provides need to be thoroughly documented because Vercel has seemingly infinite [innovation tokens](https://mcfunley.com/choose-boring-technology). And when you end up in a rabbithole of 3 very specific Next.js-only scenarios, all working together in subtle ways to fuck your day up, [a 4,000 word essay on cache logic](https://nextjs.org/docs/app/building-your-application/caching) is not really what you have the energy to sit down and absorb.

Documenting software is hard, I'm not criticising the Next.js team because the documentation is actually very good. But there are enough permutations of new behaviours, leaky abstractions, intertwining systems that the underlying surface area becomes so complex that you simply cannot document every possible case. And at that point, perhaps the system itself is just _too complex_.

I love Next.js, or at least I've developed stockholm syndrome because I don't have the time or energy to framework-hop. I'm in too deep.
