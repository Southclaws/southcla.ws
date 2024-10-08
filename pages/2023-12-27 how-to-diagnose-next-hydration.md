---
title: How to diagnose Hydration failed
subtitle: One of the most common root causes of the error "Hydration failed because the initial UI does not match what was rendered on the server" with Next.js
hero: "/images/2023-12-27 how-to-diagnose-next-hydration.png"
---

This happens when the server renders one tree and the client hydrates to a different tree.

```
Hydration failed because the initial UI does not match what was rendered on the server
```

The most common tutorials and even the Next.js docs talk about useEffect and mistakes relating to client/server code around interactive components.

https://nextjs.org/docs/messages/react-hydration-error

One of the lesser talked about causes of this is invalid HTML. Which is actually the #1 item in the list on Next.js docs.

## Why does invalid HTML cause this error?

Basically, browsers are really lenient about what they will render. So if you have invalid HTML, the browser will _not_ try to fix it for you but it _will_ try to render it for you.

But the Next.js server also pre-processes the static HTML that's delivered on the server render. When it does, it seems to clean up mistakes like this. When it finds a `\<p\>` nested within a `\<p\>` for example, it simply moves the child to a sibling.

For example, this is the resulting HTML rendered in the browser from a mistake I made in the [Storyden](https://github.com/Southclaws/storyden) codebase where I nested a button inside a menu trigger which is already a button:

```html
<button id="menu::R9mnnnjbqkq::trigger">
  <button class="button">
    <svg>...</svg>
  </button>
</button>
```

This is quite easy to find, React tells you with a nice message:

```
Warning: Expected server HTML to contain a matching <button> in <button>.
```

And the reason this causes the hydration error is because this issue is actually _"fixed"_ automatically on the server render. If you disable javascript in your browser and render the nested button, you'll see:

```html
<button id="menu::R9mnnnjbqkq::trigger"></button>
<button class="button">
  <svg>...</svg>
</button>
```

The child button (the one with the class) has been shifted out of the parent button and is now a sibling. It's also a sibling with no children so if you rendered this, it would be invisible. However, it can cause layout issues because if these buttons are inside a grid or a flex container then, as children, they will contribute to layout calculations.

![2023-12-27-11-49-46](/images/2023-12-27-11-49-46.png)

## Ark menus

> A side note about Ark menus.

In moving from Chakra to Ark, I ran in to a couple of instances where I forgot to mark a trigger as a child component. If you don't add `asChild`, then `MenuTrigger` in the below example becomes a `\<button\>` and obviously `\<MoreAction /\>` is a button already so you end up with a nested button.

Make sure you add the `asChild` prop if you're using an existing component as a button.

```diff
- <MenuTrigger>
+ <MenuTrigger asChild>
    <MoreAction />
  </MenuTrigger>
```

In Storyden, I don't construct icon-buttons ad-hoc, instead I keep them all in one place and use them as components. This keeps naming consistent and makes it easier to re-use semantically similar actions throughout the product. A "More" menu in the above example is always the same behaviour, appearance, ARIA roles, etc. and I can change it app-wide if I want.
