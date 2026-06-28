import { motion } from 'framer-motion'
import type { ShopifyProduct } from '../../types/shopify.types'
import ProductCardWithColors from '../Product/ProductCardWithColors'
import { extractBaseName, extractColorFromTitle, extractProductType } from '../../utils/productGrouping'

interface CollectionRowProps {
  collectionName: string
  collectionHandle: string
  collectionColor: string
  products: ShopifyProduct[]
  allProducts: ShopifyProduct[]
}

export default function CollectionRow({
  collectionName,
  collectionHandle,
  collectionColor,
  products,
}: CollectionRowProps) {
  // Group products by unique base name
  const baseNameGroups = new Map<string, ShopifyProduct[]>()

  products.forEach(product => {
    const baseName = extractBaseName(product.title).toLowerCase()
    if (!baseNameGroups.has(baseName)) {
      baseNameGroups.set(baseName, [])
    }
    baseNameGroups.get(baseName)!.push(product)
  })

  // Define product type sorting order
  const TYPE_ORDER: Record<string, number> = {
    'tshirt': 1,
    'hoodie': 2,
    'oversized': 3,
    'tote': 3,
    'other': 4
  }

  const itemsToRender = Array.from(baseNameGroups.entries()).map(([_, groupProducts]) => {
    // Deduplicate groupProducts by product ID
    const uniqueGroupProducts = groupProducts.filter((product, index, self) =>
      self.findIndex((p) => p.id === product.id) === index
    )

    // Determine representative product (default to Black, then first available)
    const preferredColor = 'black'
    let representative = uniqueGroupProducts.find(p => extractColorFromTitle(p.title).toLowerCase() === preferredColor)
    if (!representative) {
      representative = uniqueGroupProducts[0]
    }

    return {
      product: representative,
      siblings: uniqueGroupProducts
    }
  }).sort((a, b) => {
    const typeA = extractProductType(a.product.title)
    const typeB = extractProductType(b.product.title)
    return (TYPE_ORDER[typeA] || 99) - (TYPE_ORDER[typeB] || 99)
  })

  // Count how many cards we will render
  const productCount = itemsToRender.length

  // Determine grid columns based on product count
  const gridCols = productCount >= 4
    ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
    : productCount === 3
    ? 'grid-cols-2 md:grid-cols-3'
    : productCount === 2
    ? 'grid-cols-2'
    : 'grid-cols-2 md:grid-cols-1'

  const maxWidth = productCount >= 3 ? 'max-w-6xl' : 'max-w-4xl'

  return (
    <div id={collectionHandle} className="space-y-8 scroll-mt-32">
      {/* Collection Header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-2xl md:text-4xl font-bold text-gray-900 font-primary my-4 md:my-6">
          {collectionName}
        </h2>
        {/* Color accent bar */}
        <div
          className="w-24 h-1 mt-4 rounded-full"
          style={{ backgroundColor: collectionColor }}
        />
      </motion.div>

      {/* Product Grid */}
      <div className="flex justify-center">
        <div className={`grid ${gridCols} gap-3 sm:gap-5 md:gap-8 ${maxWidth} w-full`}>
          {itemsToRender.map(({ product, siblings }) => (
            <ProductCardWithColors
              key={product.id}
              product={product}
              siblings={siblings}
              isLightMode={true}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
