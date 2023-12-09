import { defineConfig, defineRecipe } from "@pandacss/dev";

export default defineConfig({
  preflight: true,
  include: ["./src/**/*.{js,jsx,ts,tsx}"],
  exclude: [],
  jsxFramework: "react",
  strictTokens: true,
  theme: {
    recipes: {
      link: defineRecipe({
        className: "link",
        base: {
          color: "bg",
          backgroundColor: "link",
          borderRadius: "md",
          paddingY: "1",
          paddingX: "2",
          fontWeight: "semibold",
          width: "min",
          _hover: {
            backgroundColor: "accent.900",
            textDecoration: "underline",
          },
        },
      }),
    },
    extend: {
      semanticTokens: {
        fonts: {
          heading: { value: "{fonts.orbiter}" },
          body: { value: "{fonts.inter}" },
        },
        fontSizes: {
          header: {
            value:
              "clamp(var(--font-sizes-heading1-min), var(--font-scale), 5.61rem)",
          },
          heading1: {
            DEFAULT: { value: "2.027rem" },
            min: { value: "2.027rem" },
            max: { value: "2.986rem" },
          },
          heading2: {
            DEFAULT: { value: "1.802rem" },
            min: { value: "1.802rem" },
            max: { value: "2.488rem" },
          },
          heading3: {
            DEFAULT: { value: "1.602rem" },
            min: { value: "1.602rem" },
            max: { value: "2.074rem" },
          },
          heading4: {
            DEFAULT: { value: "1.424rem" },
            min: { value: "1.424rem" },
            max: { value: "1.728rem" },
          },
          heading5: {
            DEFAULT: { value: "1.266rem" },
            min: { value: "1.266rem" },
            max: { value: "1.44rem" },
          },
          heading6: {
            DEFAULT: { value: "1.125rem" },
            min: { value: "1.125rem" },
            max: { value: "1.2rem" },
          },
          body: {
            DEFAULT: { value: "1rem" },
            min: { value: "1rem" },
            max: { value: "1.1rem" },
          },
          small: {
            DEFAULT: { value: "0.9rem" },
            min: { value: "0.9rem" },
            max: { value: "0.95rem" },
          },
        },
        spacing: {
          md: {
            DEFAULT: { value: "{spacing.4}" },
            fluid: { value: "clamp(var(--spacing-4), 4vw, var(--spacing-96))" },
          },
        },
        lineHeights: {
          headingFluid: { value: "calc(130px - clamp(0px, 6vw, 70px))" },
        },
        colors: {
          fg: {
            DEFAULT: {
              value: {
                base: "{colors.offblack}",
                _osDark: "{colors.offwhite}",
              },
            },
            muted: {
              value: {
                base: "{colors.offblack.muted}",
                _osDark: "{colors.offwhite.muted}",
              },
            },
            subtle: {
              value: {
                base: "{colors.offblack.subtle}",
                _osDark: "{colors.offwhite.subtle}",
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
                base: "{colors.offwhite.muted}",
                _osDark: "{colors.offblack.muted}",
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
              color: "{colors.fg.subtle}",
              style: "dashed",
            },
          },
        },
      },
      tokens: {
        fonts: {
          orbiter: { value: "var(--font-orbiter)" },
          inter: { value: "var(--font-inter)" },
        },
        colors: {
          offwhite: {
            DEFAULT: { value: "hsla(40, 100%, 99%, 1)" },
            muted: { value: "hsla(40, 100%, 99%, 0.66)" },
            subtle: { value: "hsla(40, 100%, 99%, 0.1)" },
          },
          offblack: {
            DEFAULT: { value: "hsla(222, 18%, 25%, 1)" },
            muted: { value: "hsla(222, 18%, 25%, 0.66)" },
            subtle: { value: "hsla(222, 18%, 25%, 0.1)" },
          },
          accent: {
            "50": {
              value: "hsl(28deg 50% 95%)",
              description: "Silver Bird",
            },
            "100": {
              value: "hsl(64deg 31% 12%)",
              description: "Burrito",
            },
            "200": {
              value: "hsl(60deg 32% 15%)",
              description: "Crepe",
            },
            "300": {
              value: "hsl(56deg 32% 20%)",
              description: "Packing Paper",
            },
            "400": {
              value: "hsl(52deg 33% 28%)",
              description: "Salted Capers",
            },
            "500": {
              value: "hsl(48deg 35% 36%)",
              description: "Garden Weed",
            },
            "600": {
              value: "hsl(44deg 37% 46%)",
              description: "Reptile Revenge",
            },
            "700": {
              value: "hsl(40deg 40% 57%)",
              description: "Jungle King",
            },
            "800": {
              value: "hsl(36deg 43% 69%)",
              description: "Graphite",
            },
            "900": {
              value: "hsl(32deg 46% 82%)",
              description: "Underworld",
            },
          },
        },
      },
    },
  },
  outdir: "src/styled-system",
});
