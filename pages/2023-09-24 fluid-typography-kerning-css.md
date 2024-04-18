---
title: Fluid typography kerning in CSS
subtitle: Taking fluid typography one step further by meticulously controlling kerning pairs.
hero: /images/southclaws_purple_and_blue_mountain_scenery_behind_the_screen_i_31127cb3-ef1a-4226-8b16-15d10328e4f2.png
---

![2024-04-06-18-45-54](/images/2024-04-06-18-45-54.png)

a photo of me inspecting typography during a design review

There’s a special place in my heart for typography, it’s my favourite area of design. Signs, posters, magazine covers, books, movie intros, typography is everywhere. But I don’t work in those industries, I work in digital so there are extra considerations to think about on top of the already huge list of elements that matter when it comes to typesetting on the web.

Of the many shared aspects of real world and digital typography, kerning is often overlooked. In the web world, we call this letter-spacing which is sort of a catch-all for both kerning and tracking. It’s flexible enough to be used for both.

Every time I design and build a website for a client or a project, I spend a lot of time on the copy, the layout of the copy and the typesetting of the copy. Perhaps more than I should do, and perhaps it’s over the top, and in classic designer fashion only myself and other designers may notice or care, but nonetheless I will Patrick Bateman my way to find that perfect business card paper.

What this means in practice is I’m making use of many of the CSS tools at my disposal to tightly control the way text flows on the page. This includes favourites like `<wbr />`, `&nbsp;` and of course, fluid typography. But before we dive into fluid kerning, what actually is fluid typography?

## Fluid Typography

As with everything I’ve picked up over the years, I stand on the shoulders of giants, and these particular giants are Geoff Graham and Chris Coyier, the authors of [Fluid Typography](https://css-tricks.com/snippets/css/fluid-typography/) and [Simplified Fluid Typography](https://css-tricks.com/simplified-fluid-typography/) respectively, from my favourite website of my entire career.

Give the latter one a read for the most up to date approach using CSS “clamp” and if you want to peek into the past approaches, check out the former.

Essentially, the idea is that instead of setting static breakpoints at specific viewport widths, you utilise the vw unit to drive the size of your type in a dynamic fashion, such that it scales linearly against the viewport width. Then, `clamp()` is used to put a limit on the lower and upper bounds.

For example, say you have a mobile size of 375px (iPhone SE - my default mobile device to design against) and a desktop size of 1440px (a macbook - not sure which one, but it’s a pretty common size)

![2024-04-06-18-48-49](/images/2024-04-06-18-48-49.png)

So, if you set your font-size to 50vw, it’ll become 720px on a macbook screen.

![2024-04-06-18-49-02](/images/2024-04-06-18-49-02.png)

And it’ll be 188 (rounded up) on an iPhone SE screen.

This is useful because it gives us a linear scale with a fixed 0-100 space that maps to different sizes on different devices.

But obviously you don’t want to set your font size to 720px, in reality you want a much more manageable size. So we can pick a low value like 4vw which maps to 57.6px on a macbook and 15px on an iPhone.

The middle point might be a nice scale but 57.6 is quite big and 15 is quite small, so this is where `clamp()` comes in, which allows us to limit the value at some upper and lower bound:

```css
clamp(24px, 4vw, 48px);
```

Which gives us the same result, but once the screen size is beyond such that the output would be below 24px, it would just remain at 24px instead of scaling down. And the same for the upper bound, on a huge screen like a ultra-wide, it would max out at 48px instead of go to some insane value.

Okay, so that’s a crash course on fluid typography. It’s very satisfying in practice and allows you to support many devices without many breakpoints. But what’s fluid kerning?

## Fluid other things

Turns out you can apply this concept to any property that accepts pixels as a unit. Unfortunately, much to my disappointment, this does not work with `font-width` so I couldn’t play with variable weight typefaces 😢

I’ve been designing and building a new home page for myself recently, since my old one was built before I even did any design work (back in the days I was a Linux server admin) and it’s pretty boring.

Earlier in the year I came across this really nice pair of OFL typefaces designed for the Taiwan Space Agency called TASA Orbiter and TASA Explorer. Check them out [here](https://github.com/adrianzwz/TASA-Typeface-Collection/)! So I decided to use them for my personal site.

One thing I do a lot when designing a marketing site, landing page or even a wordmark is mess with the kerning to get things balanced. Most well designed typefaces have decent kerning but not every single letter pair will be perfectly balanced so it’s always worth experimenting. I only made one adjustment to my heading and that was to bring the K and E ever so slightly closer just to tighten up the perceived gap between the letters.

![2024-04-06-18-59-07](/images/2024-04-06-18-59-07.png)

> before and after, approximately 12 people on earth care about these kinds of tiny details and I am one of them.

Because I’ve already tightened up the tracking across the entire heading, the gap between the K and the E is more prominent. This is using the following CSS applied to only the K via a span tag:

```c
letter-spacing: -6px;
```

But, because I’m using fluid typography here, the font-size (and, maybe one day, the font-weight 🙏) scales linearly against the viewport size, so on mobile it looks like this:

![2024-04-06-18-59-45](/images/2024-04-06-18-59-45.png)

Which is pretty awful! This is because I’m using raw pixel values instead of anything else. Now I could use rem units here to solve this, which is perfectly acceptable. Using rem would use the `:root` element `font-size` (which is usually 16px and generally shouldn’t go lower than this for accessibility.)

But it turns out you can use the fluid typography trick too! Which also gives you finer grained control over the actual minimums and maximums as well as the actual scaling factor. So if I wanted the kerning to bottom out at a different point along the viewport width units scale than the font size, I can do that. Why would you want to do that? In the same way that rounded characters bleed above and below the x-height and baseline, kerning isn’t always an exact science and sometimes text can be more readable at a different size with a different kerning than just a straight up function of the font size itself (which you get quite easily from rem units.)

![2024-04-06-19-00-19](/images/2024-04-06-19-00-19.png)

So there you have it, meticulously crafted, fluidly scaling kerning pairs. Time consuming? Yes. Nobody will notice? Probably. Overkill? Definitely. But worth it.

![2024-04-06-19-00-32](/images/2024-04-06-19-00-32.png)

> Look at that subtle off-white coloring. The tasteful kerning of it. Oh my God, it even has fluid typography...
