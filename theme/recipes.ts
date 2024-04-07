import { defineRecipe } from "@pandacss/dev";

const link = defineRecipe({
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
      backgroundColor: "accent.600",
      textDecoration: "underline",
    },
  },
});

export default { link };
