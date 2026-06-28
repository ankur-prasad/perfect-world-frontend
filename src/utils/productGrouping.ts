import type { ShopifyProduct } from '../types/shopify.types'

// Color regex pattern matching ProductDetail.tsx
// Updated to handle tote bag color formats like "Blue Soul" at the end
const COLOR_REGEX = / (Blue Soul|Bright Orange|Worker Blue|Heather Grey|Dark Blue|Light Blue|Royal Blue|Navy Blue|Midnight Blue|Forest Green|Kelly Green|Olive Green|Dark Green|Light Green|Heather Red|Dark Red|Light Red|Burgundy|Maroon|Indian Grey|Sky Blue|French Navy|Green Bay|Fiesta|Anthracite|Black|White|Blue|Red|Green|Yellow|Pink|Purple|Orange|Grey|Gray|Navy|Teal|Beige|Brown|Multi|Natural|Khaki|Charcoal|Cream|Ivory|Silver|Gold)$/i

const KNOWN_COLORS = [
  'blue soul', 'bright orange', 'worker blue', 'heather grey', 'dark blue',
  'light blue', 'royal blue', 'navy blue', 'midnight blue', 'forest green',
  'kelly green', 'olive green', 'dark green', 'light green', 'heather red',
  'dark red', 'light red', 'burgundy', 'maroon', 'indian grey', 'sky blue',
  'french navy', 'green bay', 'fiesta', 'anthracite', 'black', 'white',
  'blue', 'red', 'green', 'yellow', 'pink', 'purple', 'orange', 'grey',
  'gray', 'navy', 'teal', 'beige', 'brown', 'multi', 'natural', 'khaki',
  'charcoal', 'cream', 'ivory', 'silver', 'gold', 'mocha', 'red brown', 'red-brown'
]

/**
 * Extract collection key from title
 */
export function getCollectionKey(title: string): string {
  const lower = title.toLowerCase()
  if (lower.includes('rich in life')) return 'RICH IN LIFE'
  if (lower.includes('wild at heart')) return 'WILD AT HEART'
  if (lower.includes('endangered oceans')) return 'ENDANGERED OCEANS'
  if (lower.includes('one world')) return 'ONE WORLD'
  if (lower.includes('cool down')) return 'COOL DOWN'
  if (lower.includes('talk about it')) return 'TALK ABOUT IT'
  if (lower.includes('embroidered logo')) return 'Embroidered Logo'
  return ''
}

/**
 * Extract product type from title
 * Detects Hoodies, Totes, and Oversized explicitly, assumes rest are T-shirts if they have a color
 */
export function extractProductType(title: string): 'tshirt' | 'hoodie' | 'tote' | 'oversized' | 'other' {
  const lowerTitle = title.toLowerCase()

  // Explicit type detection
  if (lowerTitle.includes('hoodie')) return 'hoodie'
  if (lowerTitle.includes('tote')) return 'tote'
  if (lowerTitle.includes('oversized') || lowerTitle.includes('oversize')) return 'oversized'
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
  const lower = title.toLowerCase()

  // 1. Try regex match at the end
  const match = title.match(COLOR_REGEX)
  if (match && match[1]) {
    const matchedColor = match[1].trim()
    return matchedColor.charAt(0).toUpperCase() + matchedColor.slice(1)
  }

  // 2. Fallback: Scan title for any color name in our KNOWN_COLORS list
  for (const colorKey of KNOWN_COLORS) {
    if (lower.includes(colorKey)) {
      return colorKey
        .split(/[ -]/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    }
  }

  return ''
}

/**
 * Extract base product name without color
 */
export function extractBaseName(title: string): string {
  const lower = title.toLowerCase()
  const collectionKey = getCollectionKey(title)

  if (collectionKey) {
    // Rich in Life Oversized Shirt is treated separately
    if (collectionKey === 'RICH IN LIFE' && (lower.includes('oversized') || lower.includes('oversize'))) {
      return 'RICH IN LIFE Organic Oversized Shirt'
    }

    if (lower.includes('hoodie')) {
      return `${collectionKey} Organic Hoodie`
    }
    if (lower.includes('tote')) {
      return `${collectionKey} Organic Tote Bag`
    }
    return `${collectionKey} Organic T-Shirt`
  }

  return title.replace(COLOR_REGEX, '').trim()
}

/**
 * Find all color siblings of a product
 */
export function findColorSiblings(product: ShopifyProduct, allProducts: ShopifyProduct[]): ShopifyProduct[] {
  const baseName = extractBaseName(product.title)

  // Find all products with the same base name (case-insensitive) AND same product type
  const productType = extractProductType(product.title)

  // First, find all products with same base name and type
  const candidates = allProducts.filter(p => {
    const siblingBaseName = extractBaseName(p.title)

    if (siblingBaseName.toLowerCase() !== baseName.toLowerCase()) return false
    if (p.collectionHandle !== product.collectionHandle) return false
    if (extractProductType(p.title) !== productType) return false

    return true
  })

  // Group by color and take one representative per color
  const colorGroups = new Map<string, ShopifyProduct>()

  candidates.forEach(p => {
    const color = extractColorFromTitle(p.title).toLowerCase()
    // Only add if we haven't seen this color yet, or if this is the current product
    if (!colorGroups.has(color) || p.id === product.id) {
      colorGroups.set(color, p)
    }
  })

  const siblings = Array.from(colorGroups.values())

  // For products with only one unique color, don't show color selector
  if (siblings.length <= 1) {
    return []
  }

  // Sort by title for consistent order
  return siblings.sort((a, b) => a.title.localeCompare(b.title))
}

/**
 * Group products by type for a collection
 * Prioritizes specific colors for certain products, then Black, then first available
 */
export function groupProductsByTypeForCollection(products: ShopifyProduct[]): {
  tshirt: ShopifyProduct | null
  hoodie: ShopifyProduct | null
  tote: ShopifyProduct | null
} {
  const tshirts = products.filter(p => extractProductType(p.title) === 'tshirt')
  const hoodies = products.filter(p => extractProductType(p.title) === 'hoodie')
  const totes = products.filter(p => extractProductType(p.title) === 'tote' || extractProductType(p.title) === 'oversized')

  // Preferred colors for specific products (case-insensitive)
  const PREFERRED_COLORS: Record<string, string> = {
    'wild at heart': 'indian grey',
    'endangered oceans': 'worker blue',
    'one world': 'sky blue',
    'cool down': 'green bay',
    'talk about it': 'fiesta'
  }

  // Helper to pick preferred product
  const pickPreferredProduct = (productList: ShopifyProduct[], isHoodie: boolean = false): ShopifyProduct | null => {
    if (productList.length === 0) return null

    // 1. Check for specific preferred color based on base name (skip for hoodies)
    if (!isHoodie) {
      for (const product of productList) {
        const baseName = extractBaseName(product.title).toLowerCase()

        // Check if any key in PREFERRED_COLORS is contained in baseName
        const matchedKey = Object.keys(PREFERRED_COLORS).find(key => baseName.includes(key))

        if (matchedKey) {
          const preferredColor = PREFERRED_COLORS[matchedKey]
          const color = extractColorFromTitle(product.title).toLowerCase()
          if (color === preferredColor) return product
        }
      }
    }

    // 2. Fallback to Black
    const blackProduct = productList.find(p =>
      extractColorFromTitle(p.title).toLowerCase() === 'black'
    )
    if (blackProduct) return blackProduct

    // 3. Fallback to first available
    return productList[0]
  }

  return {
    tshirt: pickPreferredProduct(tshirts),
    hoodie: pickPreferredProduct(hoodies, true),
    tote: pickPreferredProduct(totes),
  }
}
