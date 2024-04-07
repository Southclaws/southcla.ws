// NOTE: types do not work for this package, despite being written in TS...
const { generateColorRamp, colorToCSS } = require("rampensau");

export type Options = {
  hCycles: number;
  hStartCenter: number;
  minLightness: number;
  maxLightness: number;
  minSaturation: number;
  maxSaturation: number;
};

export function ramp(
  hStart: number,
  {
    hCycles,
    hStartCenter,
    minLightness,
    maxLightness,
    minSaturation,
    maxSaturation,
  }: Options
) {
  const colours: [number, number, number][] = generateColorRamp({
    total: 10,

    hStart,
    hStartCenter,
    hCycles,

    lRange: [minLightness, maxLightness],
    sRange: [minSaturation, maxSaturation],

    hEasing: (x: number) => x,
    sEasing: (x: number) =>
      x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2,
    lEasing: (x: number) => -(Math.cos(Math.PI * x) - 1) / 2,
  });

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

  return tokens;
}
