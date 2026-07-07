// Perfect World is a print-on-demand brand — every piece is made when it's
// ordered, so nothing is ever truly "sold out". Shopify's `availableForSale`
// reflects *stocked inventory*, which reads false for made-to-order items and
// made the whole storefront show "Sold Out". We therefore treat every product
// and variant the Storefront API returns (they're already active + published)
// as purchasable.
//
// To go back to respecting Shopify inventory, flip MADE_TO_ORDER to false.
export const MADE_TO_ORDER = true

interface HasAvailability {
  availableForSale?: boolean
}

/** Is this product purchasable? Always true while MADE_TO_ORDER is on. */
export function isProductAvailable(product?: HasAvailability | null): boolean {
  if (MADE_TO_ORDER) return true
  return !!product?.availableForSale
}

/** Is this variant purchasable? Always true while MADE_TO_ORDER is on. */
export function isVariantAvailable(variant?: HasAvailability | null): boolean {
  if (MADE_TO_ORDER) return true
  return !!variant?.availableForSale
}
