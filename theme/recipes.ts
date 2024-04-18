import { defineRecipe } from "@pandacss/dev";

const linkButton = defineRecipe({
  className: "link-button",
  base: {
    color: "bg",
    backgroundColor: "link",
    borderRadius: "md",
    paddingY: "1",
    paddingX: "2",
    fontWeight: "semibold",
    width: "min",
    _hover: {
      textDecoration: "underline",
    },
  },
  variants: {
    variant: {
      outline: {
        backgroundColor: "transparent",
        border: "1px solid",
        borderColor: "link",
        color: "link",
        _hover: {
          textDecoration: "none",
          backgroundColor: "link",
          color: "bg",
        },
      },
    },
  },
});

export default {
  linkButton,
};
