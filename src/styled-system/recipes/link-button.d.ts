/* eslint-disable */
import type { ConditionalValue } from '../types/index';
import type { DistributiveOmit, Pretty } from '../types/system-types';

interface LinkButtonVariant {
  variant: "outline"
}

type LinkButtonVariantMap = {
  [key in keyof LinkButtonVariant]: Array<LinkButtonVariant[key]>
}

export type LinkButtonVariantProps = {
  [key in keyof LinkButtonVariant]?: ConditionalValue<LinkButtonVariant[key]> | undefined
}

export interface LinkButtonRecipe {
  __type: LinkButtonVariantProps
  (props?: LinkButtonVariantProps): string
  raw: (props?: LinkButtonVariantProps) => LinkButtonVariantProps
  variantMap: LinkButtonVariantMap
  variantKeys: Array<keyof LinkButtonVariant>
  splitVariantProps<Props extends LinkButtonVariantProps>(props: Props): [LinkButtonVariantProps, Pretty<DistributiveOmit<Props, keyof LinkButtonVariantProps>>]
  getVariantProps: (props?: LinkButtonVariantProps) => LinkButtonVariantProps
}


export declare const linkButton: LinkButtonRecipe