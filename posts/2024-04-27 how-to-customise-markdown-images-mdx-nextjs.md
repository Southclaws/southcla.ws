---
title: How to customise image layouts in Markdown with Next.js
subtitle: Enabling sizes, alignment, captions and more for images in Markdown documents using Next.js and next-mdx-remote.
hero: /images/2024-04-27-13-37-10.png
---

Markdown has somehow become the defacto document standard in the tech world. It's quite simple, has no real specification (as far as I know) but despite that has become a success for blogs (like this one) technical documentation and even entire websites.

But formatting options are quite limited - by design. You can do the basics like bold, italics, etc. but no colours, no highlights and certainly no alignment or advanced layouts.

Traditionally, "Word Processing" or digital documents have provided all of these features as well as many more.

![2024-04-27-13-47-50](/images/2024-04-27-13-47-50.png)

HTML lets you do most of this, sometimes with a bit of fighting against CSS, but for the most part you can essentially construct almost any layout you can imagine using the tools of the web.

Markdown is significantly disadvantaged due to its syntax, which isn't a bad thing, Markdown is actually readable when in its non-rendered form (plain text) while HTML is far from that. But we can balance that readability with new functionality without harming the plain-text version or the ease of authorship (like how I'm writing this into a plain text document without the need for a Word equivalent.)

## The tools at play

Next.js is in the title so that one is obvious.

For this blog and content-heavy sites I build, I use Hashicorp's Next.js MDX library:

https://github.com/hashicorp/next-mdx-remote/

Which is amazingly useful and a must-have if you're building a Next.js site with Markdown. This is what it looks like:

```tsx
// Read the text from a Markdown file, or a database, or whatever.
const source = await readFile(fullpath);

// Parse the text into a structure
const { content, frontmatter } = await compileMDX({
  source,
  options: {
    parseFrontmatter: true,
  },

  // Customise what your p tags, h tags, a tags, etc should render as.
  components: {
    img: (props) => <MyCustomImage {...props} />
  }
});

// Pass the structured content and metadata to a React component and render it
<h1>{frontmatter.title}</h1>
<article>{content}</article>
```

I'm also using Panda CSS but that's largely irrelevant here, you can use any styling tool you like as next-mdx-remote provides you the ability to set class names and custom component overrides for any block or inline element.

## Hacking markdown

In the example above, I've shown you can also override any of the regular HTML components with your own React components. For this, we'll override `img` and provide our own.

```js
components: {
  img: (props) => <MyCustomImage {...props} />;
}
```

What we're going to do is provide a way for our Markdown code to specify an image size and a float alignment property without introducing any custom parsing logic or new syntax.

If I write the following Markdown:

```markdown
![this is my alt text](/this-is-my-image.png)
```

Then the `MyCustomImage` component receives the following props:

```json
{
  "src": "/this-is-my-image.png",
  "alt": "this is my alt text"
}
```

The alt text is the key here, it doesn't _need_ to be used for alt text, it can be used as a portal from Markdown world to React world!

What if we passed in a URL-encoded string?

```markdown
![size=small&align=right&alt="this is my alt text"](/this-is-my-image.png)
```

Then, within `MyCustomImage` we can parse the `alt` prop with `URLSearchParams`:

```ts
const options = new URLSearchParams(alt);
```

We can then read the values in `options` and do what we need:

```ts
const size = options.get("size");
const align = options.get("align");
const alt = options.get("alt");
```

And we still have the ability to use alt text for accessibility purposes, which is neat.

Here's an example, the following Markdown:

```markdown
![size=small&align=right&caption="isn't this neat?"](/images/2024-04-27-14-12-15.png)
```

Renders the following image:

![size=small&align=right&caption="isn't this neat?"](/images/2024-04-27-14-12-15.png)

Due to the following rules:

- `options.size` drives the max-width
- `options.align` drives the container's align-items property
  - `left` maps to `start`
  - `center` maps to `center`
  - `right` maps to `end`
- `options.caption` renders a `<p>` below with the caption text
  - I'm also re-using the caption for the `<img>` alt-text value.

Annoyingly, because of the resulting HTML structure from MDX, you can't use float layouts for laying images beside and interspersed with text easily. This is because for float layouts to work, the image needs to be placed either immediately beside or inside the paragraph you want to intersperse with, and MDX currently renders them as completely separate paragraph elements:

```html
<p>
    <div >
        <img alt="isn't this neat?" src="/images/2024-04-27-14-12-15.png">
        <aside>isn't this neat?</aside>
    </div>
</p>
<p>
    The text in the paragraph
</p>
```

There will be a workaround for this but it would likely involve messing with the underlying AST.

Anyway, that's the trick, and you could use this for anything really such as adding links to images or applying effects.

However, it's worth considering that there's a limit when it comes to readability and at some point, you might be best to just set up a custom component and use that in your document.
