import { memo, splitProps } from '../helpers.mjs';
import { createRecipe, mergeRecipes } from './create-recipe.mjs';

const linkButtonFn = /* @__PURE__ */ createRecipe('link-button', {}, [])

const linkButtonVariantMap = {
  "variant": [
    "outline"
  ]
}

const linkButtonVariantKeys = Object.keys(linkButtonVariantMap)

export const linkButton = /* @__PURE__ */ Object.assign(memo(linkButtonFn.recipeFn), {
  __recipe__: true,
  __name__: 'linkButton',
  __getCompoundVariantCss__: linkButtonFn.__getCompoundVariantCss__,
  raw: (props) => props,
  variantKeys: linkButtonVariantKeys,
  variantMap: linkButtonVariantMap,
  merge(recipe) {
    return mergeRecipes(this, recipe)
  },
  splitVariantProps(props) {
    return splitProps(props, linkButtonVariantKeys)
  },
  getVariantProps: linkButtonFn.getVariantProps,
})