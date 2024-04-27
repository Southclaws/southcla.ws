---
title: Colour Ramps with Panda CSS
subtitle: Creating beautiful static CSS colour ramps automatically at build time with Panda CSS and Rampensau.
hero: "/images/Swatches Orange to Blue.webp"
---

Tailwind, Chakra, Panda, all these frameworks and more all come with colour tokens structured with a colour name and a number usually ranging from around 50 to 900 in increments of 100.

![size=small&caption="Some of Tailwind's colour tokens"](/images/2024-04-27-11-44-05.png)

![size=small&caption="Some of Chakra UI's colour tokens"](/images/2024-04-27-11-44-32.png)

And these are incredibly useful when getting started on a new project. No need to set up your own swatches for the basics.

Panda CSS also comes with a default theme with lots of colours following this convention of `colour.level` where lower levels are generally towards the lighter, pastel side and higher levels are more vibrant or darker.

https://panda-css.com/docs/customization/theme

## Skating your own ramp

The bundled colours in these frameworks are useful, but eventually you'll need to do your own. Whether it's a brand specific colour, a strict design system or you just have an eye for detail.

![size=small&caption="I skateboarded for about a year and I did not become cooler..."](/images/2024-04-27-12-04-22.png)

One way of doing this would be to simply loop through some hue values and generate a set of `hsl()` or `lch()` strings but you will run into differences with perceived lightness.

https://nerdy.dev/lch-luminance-vs-hsl-lightness

I used this looping technique with LCH on Storyden for the accent colour, the administrator can choose a hue to represent their site and the code generates a colour ramp for that hue. This colour can then be used in various places such as buttons and the ramp is used for different states (for example an active button may be darker and a hovered button may be lighter.)

```ts
const flatRamp = ramp.reduceRight((o, r, i) => {
  const [minL, maxL] = flatClampL;
  const [minC, maxC] = flatClampC;

  const L = minL + ((maxL - minL) / rampSize) * i * flatContrast;
  const C = minC + ((maxC - minC) / rampSize) * i;

  const fill = `oklch(${L}% ${C}% ${hue}deg)`;

  const text = readableColorWithFallback(
    parseColourWithFallback(fill).to("srgb").toString({ format: "hex" })
  );

  return {
    [`--accent-colour-flat-fill-${r}`]: fill,
    [`--accent-colour-flat-text-${r}`]: text,
    ...o,
  };
}, {});
```

But there are more reasons that even this code is going to be problematic, most importantly it's using `oklch` which is very new and won't be present in older browsers, leading to a fallback colour to be painted (which is going to be very ugly!)

Luckily there's a library for that!

## Rampensau

![caption="every time I hit the random button it's somehow beautiful"](/images/2024-04-27-12-32-11.png)

I came across this a while ago, it's a beautiful tool for making colour ramps using various parameters such as basic start/end, number of swatches, max lightness, etc. but it also has advanced features such as the curve function to use which is very useful for dealing with perceived lightness issues.

The best part is, it's also a JS library! That means you can import the code and generate these on the fly.

## Mixing in some Panda CSS

If you don't already know about Panda CSS, it's a static CSS generation tool that integrates nicely into your codebase to provide type safe code-generated design tokens allowing you to statically declare everything at build time.

The configuration is also a program in and of itself, so you can import JavaScript or TypeScript code to programmatically drive various design tokens for your site.

So let's take that ramp in the screenshot above and import the code:

```ts
const colours = generateColorRamp({
  total: 8,
  hStart: 214.716,
  hStartCenter: 0.5,
  hEasing: (x) => x,
  hCycles: 1.173,

  sRange: [0.852, 0.927],
  sEasing: (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2),
  lRange: [0.047, 0.979],
  lEasing: (x) => -(Math.cos(Math.PI * x) - 1) / 2,
});
```

The types this returns is a basic `[number, number, number][]` array which corresponds to HSL parameters.

Once you have the `colours` array you can turn that into a Panda-compatible token:

```ts
const entries = colours.map((color, idx) => {
  const index = idx === 0 ? "50" : idx * 100;
  return [
    `${index}`,
    {
      value: colorToCSS(color, "hsl"),
    },
  ];
});

const tokens = Object.fromEntries(entries);
```

If you inspect `tokens`, you'll see:

```js
{
  '50': { value: 'hsl(204 35% 40%)' },
  '100': { value: 'hsl(208 34.89026063100137% 39.24615775982386%)' },
  '200': { value: 'hsl(212 34.122085048010966% 37.075555538987224%)' },
  '300': { value: 'hsl(216 32.03703703703704% 33.75%)' },
  '400': { value: 'hsl(220 27.976680384087793% 29.670602220836635%)' },
  '500': { value: 'hsl(224 22.023319615912207% 25.329397779163376%)' },
  '600': { value: 'hsl(228 17.962962962962962% 21.250000000000004%)' },
  '700': { value: 'hsl(232 15.877914951989025% 17.92444446101278%)' },
  '800': { value: 'hsl(236 15.109739368998628% 15.753842240176146%)' },
  '900': { value: 'hsl(240 15% 15.000000000000002%)' }
}
```

Now all you need to do is assign that to a colour token in your Panda config:

```ts
import { defineConfig } from "@pandacss/dev";

export default defineConfig({
  theme: {
    extend: {
      tokens: {
        colors: {
          brand: tokens,
        },
      },
    },
  },
});
```

Now you'll be able to use these tokens in recipes, semantic tokens, JSX props, etc:

```tsx
<styled.p color="brand.500">
  this is the brand colour!
  <br />
  <styled.span color="brand.700">this is a bit darker</styled.span>
  <br />
  <styled.span color="brand.200">this is a bit lighter</styled.span>
</styled.p>
```

And whenever you want to play with the colours, you can just load up Rampensau's site and make more colour ramps!

https://meodai.github.io/rampensau/

I hope this was useful, happy colouring!

(By the way, there's a [secret page](/design) on this site that shows the colour ramps I'm using! You can also [browse the source code](https://github.com/Southclaws/southcla.ws).)
