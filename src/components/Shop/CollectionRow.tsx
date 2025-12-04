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
  collectionColor,
  products,
  allProducts,
}: CollectionRowProps) {
  // Group products by type (tshirt, hoodie, tote)
  const { tshirt, hoodie } = groupProductsByTypeForCollection(products)

  // Find color siblings for each product type
  const tshirtSiblings = tshirt ? findColorSiblings(tshirt, allProducts) : []
  const hoodieSiblings = hoodie ? findColorSiblings(hoodie, allProducts) : []

  return (
    <div className="space-y-8">
      {/* Collection Header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-primary">
          {collectionName}
        </h2>
        {/* Color accent bar */}
        <div
          className="w-24 h-1 mt-4 rounded-full"
          style={{ backgroundColor: collectionColor }}
        />
      </motion.div>

      {/* Product Grid - 2 columns centered (T-shirt and Hoodie) */}
      <div className="flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
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
        </div>
      </div>
    </div>
  )
}
