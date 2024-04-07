import { defineTokens } from "@pandacss/dev";
import { ramp } from "./colours";

const colours = {
  offwhite: ramp(40, {
    hCycles: 0.012,
    hStartCenter: 0.9,
    minLightness: 0.6,
    maxLightness: 1,
    minSaturation: 0,
    maxSaturation: 0.3,
  }),
  offblack: ramp(222, {
    hCycles: -0.1,
    hStartCenter: 0.5,
    minLightness: 0.4,
    maxLightness: 0.15,
    minSaturation: 0.35,
    maxSaturation: 0.15,
  }),
  accent: ramp(15, {
    hCycles: 0.09,
    hStartCenter: 0.1,
    minLightness: 0.02,
    maxLightness: 0.98,
    minSaturation: 0.23,
    maxSaturation: 0.8,
  }),
};

export const tokens = defineTokens({
  fonts: {
    orbiter: { value: "var(--font-orbiter)" },
    inter: { value: "var(--font-inter)" },
    hedvig: { value: "var(--font-hedvig)" },
  },
  colors: colours,
});
