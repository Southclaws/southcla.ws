import { defineConfig } from "@pandacss/dev";
import recipes from "./theme/recipes";
import { semanticTokens } from "./theme/semantic";
import { tokens } from "./theme/tokens";

export default defineConfig({
  presets: ["@pandacss/preset-base", "@pandacss/preset-panda"],
  preflight: true,
  include: ["./src/**/*.{js,jsx,ts,tsx}"],
  exclude: [],
  jsxFramework: "react",
  strictTokens: true,
  strictPropertyValues: true,
  // Panda 2 changed the default gap of these patterns from 10px to 8px, keep
  // the original spacing.
  patterns: {
    extend: {
      stack: { defaultValues: { gap: "10px" } },
      vstack: { defaultValues: { gap: "10px" } },
      hstack: { defaultValues: { gap: "10px" } },
      grid: {
        defaultValues: (props) => ({
          gap: props.columnGap || props.rowGap ? undefined : "10px",
        }),
      },
      wrap: {
        defaultValues: (props) => ({
          gap: props.columnGap || props.rowGap ? undefined : "10px",
        }),
      },
    },
  },
  theme: {
    recipes,
    extend: {
      semanticTokens,
      tokens,
    },
  },
  outdir: "src/styled-system",
  importMap: "@/styled-system",
});
