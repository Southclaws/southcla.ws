---
title: How does YouTube's blurry background work?
date: 2023-12-12T07:24:30Z
---

If you've watched a YouTube video recently, on web or the mobile app, you might have noticed that behind the video there's a slight splash of colour behind the video that spreads all the way up to the search bar.

![2023-12-12-07-30-32](/images/2023-12-12-07-30-32.png)

It's a nice effect, and it's not just a static image, it feels like a video but it's not that either. So what is it?

It gradually changes colour in the background, so if you leave a video playing or skip to a later part with different colours, you'll notice the background change to match. Pretty cool!

![2023-12-12-07-33-41](/images/2023-12-12-07-33-41.png)

## `id="cinematics"`

After deleting every element from the inspector, I found that the element that was responsible for the effect was a `div` with an `id` of `cinematics`.

![2023-12-12-07-35-51](/images/2023-12-12-07-35-51.png)

And if you play the video with the actual video container hidden with `display: none;` you'll see that the "cinematics" effect isn't a video at all, it's a series of blurred images fading between each other.

<video src="/images/yt-cinematics-1.mov" controls />

This isn't an `<img>` or even a `<video>` it's actualy two `<canvas>` elements on top of each other!

The canvas on top plays this, which fades from black to colour every 5 seconds.

<video src="/images/yt-cinematics-2.mov" controls />

And the canvas underneath that plays this, which is the exact same as the sequence above but without the fades and 5 seconds ahead.

<video src="/images/yt-cinematics-3.mov" controls />

When played on top of each other, the effect is these 5 second thumbnail-like images are fading between each other.

Here's the HTML of these elements:

```html
<div
  style="
    position: absolute;
    inset: 0px;
    pointer-events: none;
    transform: scale(1.5, 2);
  "
>
  <canvas
    width="110"
    height="75"
    style="position: absolute; width: 100%; height: 100%"
  />
  <canvas
    width="110"
    height="75"
    style="position: absolute; width: 100%; height: 100%; opacity: 1"
  />
</div>
```

## Rationale

I think its done this way for a few reasons:

- playing the video twice, one blurred, would put strain on the client device to blur the video - blurring things is actually quite computationally expensive, especially for devices that can't use hardware accelleration to do it.
- similarly, producing a video with this content on the YouTube server at the time of upload would be expensive and the file would be large and yet another thing to download alongside the main video.
- the effect is actually quite subtle, so it's not worth the effort to make it a video, it's just a nice touch.

And how it's working beyond the `<canvas>` I think:

- when the video is uploaded, YouTube grabs a small amount of dominant colours every 5 seconds - 32 is my guess (a 4 \* x grid)
- when someone loads a video page, this data is also loaded - it would be very small, 4 bytes per colour (RGBA) _ 32 colours _ (seconds of video / 5 seconds) = 7kb for a 5 minute video roughly.
- the `<canvas>` elements are both drawn from the same data, but one is offset by 5 seconds.

And notable things:

- if you skip to any point in the video, the effect transitions smoothly to whatever colours are closest to the point you skipped at.
- if you skip to the end of the video, the effect transitions smoothly to black.
- the first 5 seconds of the bottom canvas is black then cuts to colour after this, because the top canvas fades from black, the first 5 seconds are just a fade from black to colour.

## How to do it yourself

Now I'm not going to give a full tutorial here (i'm going to work shortly) but I'll drop some signposts!

Based on browsing the code for 5 minutes, they're using [CanvasRenderingContext2D + blur](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/filter):

```js
function bBc() {
  return (
    !("filter" in CanvasRenderingContext2D.prototype) ||
    H("kevlar_watch_cinematics_css_blur")
  );
}
```

And blurring by about 40px:

```js
var cBc = function (a) {
  a.ambientV2Container
    ? hBc(a)
    : (Hh(a.container, {
        position: "absolute",
        top: "0",
        left: "0",
        right: "0",
        bottom: "0",
        "pointer-events": "none",
        transform: "scale(" + iBc(a) + ", " + jBc(a) + ")",
      }),
      bBc() &&
        Hh(
          a.container,
          "filter",
          "blur(" + zl("cinematic_watch_css_filter_blur_strength", 40) + "px)"
        ));
};
```

I'd recommend [MDN's Canvas tutorial](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial) to get to grips with the basics of canvas. It's a very powerful tool and pretty much powers any highly interactive web experience from image editors to 3D rendering.
