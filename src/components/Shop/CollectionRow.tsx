import { motion } from 'framer-motion'
import type { ShopifyProduct } from '../../types/shopify.types'
import ProductCardWithColors from '../Product/ProductCardWithColors'
import { groupProductsByTypeForCollection, findColorSiblings } from '../../utils/productGrouping'

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
  allProducts,
}: CollectionRowProps) {
  // Group products by type (tshirt, hoodie, tote)
  const { tshirt, hoodie, tote } = groupProductsByTypeForCollection(products)

  // Find color siblings for each product type
  const tshirtSiblings = tshirt ? findColorSiblings(tshirt, allProducts) : []
  const hoodieSiblings = hoodie ? findColorSiblings(hoodie, allProducts) : []
  const toteSiblings = tote ? findColorSiblings(tote, allProducts) : []

  // Count how many product types we have
  const productCount = [tshirt, hoodie, tote].filter(Boolean).length

  // Determine grid columns based on product count (2-up on mobile to fill the screen)
  const gridCols = productCount === 3
    ? 'grid-cols-2 md:grid-cols-3'
    : productCount === 2
    ? 'grid-cols-2'
    : 'grid-cols-2 md:grid-cols-1'

  const maxWidth = productCount === 3 ? 'max-w-6xl' : 'max-w-4xl'

  return (
    <div id={collectionHandle} className="space-y-8 border-t-2 border-gray-200 pt-12 first:border-t-0 first:pt-0 scroll-mt-32">
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

      {/* Product Grid - Dynamic columns (T-shirt, Hoodie, Tote) */}
      <div className="flex justify-center">
        <div className={`grid ${gridCols} gap-3 sm:gap-5 md:gap-8 ${maxWidth} w-full`}>
          {tshirt && (
            <ProductCardWithColors
              product={tshirt}
              siblings={tshirtSiblings}
              isLightMode={true}
            />
          )}
          {hoodie && (
            <ProductCardWithColors
              product={hoodie}
              siblings={hoodieSiblings}
              isLightMode={true}
            />
          )}
          {tote && (
            <ProductCardWithColors
              product={tote}
              siblings={toteSiblings}
              isLightMode={true}
            />
          )}
        </div>
      </div>
    </div>
  )
}
