import type { ShopifyProduct } from '../types/shopify.types'

// Color regex pattern matching ProductDetail.tsx
const COLOR_REGEX = / (Blue Soul|Bright Orange|Worker Blue|Heather Grey|Dark Blue|Light Blue|Royal Blue|Navy Blue|Midnight Blue|Forest Green|Kelly Green|Olive Green|Dark Green|Light Green|Heather Red|Dark Red|Light Red|Burgundy|Maroon|Indian Grey|Sky Blue|French Navy|Green Bay|Fiesta|Anthracite|Black|White|Blue|Red|Green|Yellow|Pink|Purple|Orange|Grey|Gray|Navy|Teal|Beige|Brown|Multi|Natural|Khaki|Charcoal|Cream|Ivory|Silver|Gold).*$/i

/**
 * Extract product type from title
 * Detects Hoodies and Totes explicitly, assumes rest are T-shirts if they have a color
 */
export function extractProductType(title: string): 'tshirt' | 'hoodie' | 'tote' | 'other' {
  const lowerTitle = title.toLowerCase()

  // Explicit type detection
  if (lowerTitle.includes('hoodie')) return 'hoodie'
  if (lowerTitle.includes('tote')) return 'tote'
  if (lowerTitle.includes('t-shirt') || lowerTitle.includes('tshirt')) return 'tshirt'

  // If it has a color in the title but no explicit type, assume it's a t-shirt
  // This handles cases like "WILD AT HEART Black" (t-shirt without explicit type)
  const hasColor = COLOR_REGEX.test(title)
  if (hasColor) return 'tshirt'

  return 'other'
}

/**
 * Extract color from product title
 */
export function extractColorFromTitle(title: string): string {
  const match = title.match(COLOR_REGEX)
  if (match && match[1]) {
    return match[1].trim()
  }
  return ''
}

/**
 * Extract base product name without color
 */
export function extractBaseName(title: string): string {
  return title.replace(COLOR_REGEX, '').trim()
}

/**
 * Find all color siblings of a product
 */
export function findColorSiblings(product: ShopifyProduct, allProducts: ShopifyProduct[]): ShopifyProduct[] {
  const baseName = extractBaseName(product.title)

  // Find all products with the same base name (case-insensitive)
  const siblings = allProducts.filter(p =>
    p.title.toLowerCase().startsWith(baseName.toLowerCase()) &&
    p.collectionHandle === product.collectionHandle
  )

  console.log(`Finding siblings for "${product.title}"`, {
    baseName,
    foundSiblings: siblings.map(s => s.title),
    totalProducts: allProducts.length
  })

  // Sort by title for consistent order
  return siblings.sort((a, b) => a.title.localeCompare(b.title))
}

/**
 * Group products by type for a collection
 * Prioritizes Black color variants when available
 */
export function groupProductsByTypeForCollection(products: ShopifyProduct[]): {
  tshirt: ShopifyProduct | null
  hoodie: ShopifyProduct | null
  tote: ShopifyProduct | null
} {
  const tshirts = products.filter(p => extractProductType(p.title) === 'tshirt')
  const hoodies = products.filter(p => extractProductType(p.title) === 'hoodie')
  const totes = products.filter(p => extractProductType(p.title) === 'tote')

  console.log('Grouping products by type:', {
    tshirts: tshirts.map(p => p.title),
    hoodies: hoodies.map(p => p.title),
    totes: totes.map(p => p.title)
  })

  // Helper to pick preferred color (Black first, then first available)
  const pickPreferredProduct = (productList: ShopifyProduct[]): ShopifyProduct | null => {
    if (productList.length === 0) return null

    // Try to find Black color
    const blackProduct = productList.find(p =>
      extractColorFromTitle(p.title).toLowerCase() === 'black'
    )

    return blackProduct || productList[0]
  }

  return {
    tshirt: pickPreferredProduct(tshirts),
    hoodie: pickPreferredProduct(hoodies),
    tote: pickPreferredProduct(totes),
  }
}
