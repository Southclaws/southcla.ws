import { defineConfig } from "@pandacss/dev";
import recipes from "./theme/recipes";
import { semanticTokens } from "./theme/semantic";
import { tokens } from "./theme/tokens";

export default defineConfig({
  preflight: true,
  include: ["./src/**/*.{js,jsx,ts,tsx}"],
  exclude: [],
  jsxFramework: "react",
  strictTokens: true,
  strictPropertyValues: true,
  theme: {
    recipes,
    extend: {
      semanticTokens,
      tokens,
    },
  },
  outdir: "src/styled-system",
});
