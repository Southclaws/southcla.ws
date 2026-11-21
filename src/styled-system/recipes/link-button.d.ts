import type { ConditionalValue } from '../types/system';
import type { ConfigRecipeRuntimeFn, RecipeVariantMap } from '../types/recipe';

export type LinkButtonVariant = {
  variant?: "outline"
}

export type LinkButtonVariantProps = {
  [K in keyof LinkButtonVariant]?: ConditionalValue<LinkButtonVariant[K]>
}

export type LinkButtonVariantMap = RecipeVariantMap<LinkButtonVariant>

export type LinkButtonRecipe = ConfigRecipeRuntimeFn<LinkButtonVariantProps, LinkButtonVariantMap>

export declare const linkButton: LinkButtonRecipe;