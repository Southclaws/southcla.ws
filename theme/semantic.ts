import { defineSemanticTokens } from "@pandacss/dev";
import { fontSizes, fonts } from "./fonts";

export const semanticTokens = defineSemanticTokens({
  fonts,
  fontSizes,
  spacing: {
    sm: {
      DEFAULT: { value: "{spacing.2}" },
      fluid: { value: "clamp(var(--spacing-2), 2vw, var(--spacing-48))" },
    },
    md: {
      DEFAULT: { value: "{spacing.4}" },
      fluid: { value: "clamp(var(--spacing-4), 4vw, var(--spacing-96))" },
    },
  },
  lineHeights: {
    headingFluid: { value: "calc(130px - clamp(0px, 6vw, 70px))" },
  },
  colors: {
    offwhite: {
      value: "{colors.offwhite.800}",
    },
    offblack: {
      value: "{colors.offblack.600}",
    },
    accent: {
      value: {
        base: "{colors.accent.500}",
        _osDark: "{colors.accent.800}",
      },
    },
    fg: {
      DEFAULT: {
        value: {
          base: "{colors.offblack}",
          _osDark: "{colors.offwhite}",
        },
      },
      muted: {
        value: {
          base: "{colors.offwhite.50}",
          _osDark: "{colors.offwhite.50}",
        },
      },
    },
    bg: {
      DEFAULT: {
        value: {
          base: "{colors.offwhite}",
          _osDark: "{colors.offblack}",
        },
      },
      muted: {
        value: {
          base: "{colors.offwhite.700}",
          _osDark: "{colors.offblack.500}",
        },
      },
    },
    link: {
      value: {
        base: "{colors.accent.500}",
        _osDark: "{colors.accent.800}",
      },
    },
  },
  borders: {
    dotted: {
      value: {
        width: "1",
        color: "{colors.fg.muted}",
        style: "dashed",
      },
    },
  },
});
