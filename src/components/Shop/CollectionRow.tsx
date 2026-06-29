import { motion } from 'framer-motion'
import type { ShopifyProduct } from '../../types/shopify.types'
import ProductCardWithColors from '../Product/ProductCardWithColors'
import { extractBaseName, extractColorFromTitle, extractProductType, getPreferredColorForCollection } from '../../utils/productGrouping'

interface CollectionRowProps {
  collectionName: string
  collectionHandle: string
  collectionColor: string
  products: ShopifyProduct[]
  allProducts: ShopifyProduct[]
}

const SUBTITLES: Record<string, string> = {
  'one-world': 'aiding Ukrainian children with Care In action',
  'one world': 'aiding Ukrainian children with Care In action',
  'wild-at-heart': 'supporting elephant conservation through Elephants for Africa',
  'wild at heart': 'supporting elephant conservation through Elephants for Africa',
  'talk-about-it': 'destigmatizing mental health with the Mental Health Initiative',
  'talk about it': 'destigmatizing mental health with the Mental Health Initiative',
  'frontpage': 'Protecting our climate and reforesting trees with Plant-For-The-Planet',
  'cool-down': 'Protecting our climate and reforesting trees with Plant-For-The-Planet',
  'cool down': 'Protecting our climate and reforesting trees with Plant-For-The-Planet',
  'endangered-oceans': 'protecting and supporting coral restoration with SECORE International',
  'endangered oceans': 'protecting and supporting coral restoration with SECORE International',
  'rich-in-life': 'Empowering communities in rural South America through Mission Positivity',
  'rich in life': 'Empowering communities in rural South America through Mission Positivity'
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
    'tote': 4,
    'other': 5
  }

  const itemsToRender = Array.from(baseNameGroups.entries()).map(([_, groupProducts]) => {
    // Deduplicate groupProducts by color name to prevent duplicates (e.g. 2 French Navy hoodies)
    const uniqueGroupProducts: ShopifyProduct[] = []
    groupProducts.forEach(product => {
      const colorName = extractColorFromTitle(product.title).toLowerCase()
      const existingIndex = uniqueGroupProducts.findIndex(
        p => extractColorFromTitle(p.title).toLowerCase() === colorName
      )
      if (existingIndex === -1) {
        uniqueGroupProducts.push(product)
      } else {
        if (product.availableForSale && !uniqueGroupProducts[existingIndex].availableForSale) {
          uniqueGroupProducts[existingIndex] = product
        }
      }
    })

    // Determine representative product (default to preferred color, then Black, then first available)
    const preferredColor = getPreferredColorForCollection(collectionHandle)
    let representative = uniqueGroupProducts.find(p => extractColorFromTitle(p.title).toLowerCase() === preferredColor)
    if (!representative) {
      representative = uniqueGroupProducts.find(p => extractColorFromTitle(p.title).toLowerCase() === 'black')
    }
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
        <h2 className="text-2xl md:text-4xl font-bold text-gray-900 font-primary my-2 md:my-4">
          {collectionName}
        </h2>
        {SUBTITLES[collectionHandle.toLowerCase()] && (
          <p className="text-sm md:text-base text-gray-500 mt-1 max-w-2xl font-light">
            {SUBTITLES[collectionHandle.toLowerCase()]}
          </p>
        )}
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
