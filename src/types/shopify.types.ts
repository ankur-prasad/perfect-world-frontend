export interface ShopifyImage {
  url: string
  altText: string | null
}

export interface ShopifyMoney {
  amount: string
  currencyCode: string
}

export interface ShopifyPriceRange {
  minVariantPrice: ShopifyMoney
  maxVariantPrice?: ShopifyMoney
}

export interface ShopifyVariant {
  id: string
  title: string
  price: ShopifyMoney
  priceV2?: ShopifyMoney
  availableForSale: boolean
  selectedOptions?: Array<{
    name: string
    value: string
  }>
}

export interface ShopifyProduct {
  id: string
  title: string
  description: string
  handle: string
  priceRange: ShopifyPriceRange
  images: ShopifyImage[]
  variants: ShopifyVariant[]
  availableForSale: boolean
  collectionHandle?: string
  collectionName?: string
  collectionColor?: string
}

export interface ShopifyCollection {
  id: string
  title: string
  description: string
  handle: string
  products: ShopifyProduct[]
}

export interface CartItem {
  variantId: string
  productId: string
  productTitle: string
  variantTitle: string
  price: ShopifyMoney
  quantity: number
  image: string
}

export interface Checkout {
  id: string
  webUrl: string
  lineItems: CartItem[]
  subtotalPrice?: ShopifyMoney
}

// GraphQL response types
export interface GraphQLEdge<T> {
  node: T
}

export interface GraphQLImageNode {
  url: string
  altText: string | null
}

export interface GraphQLVariantNode {
  id: string
  title: string
  priceV2: ShopifyMoney
  availableForSale: boolean
  selectedOptions: Array<{
    name: string
    value: string
  }>
}

export interface GraphQLProductNode {
  id: string
  title: string
  description: string
  handle: string
  availableForSale: boolean
  priceRange: ShopifyPriceRange
  images: {
    edges: Array<GraphQLEdge<GraphQLImageNode>>
  }
  variants: {
    edges: Array<GraphQLEdge<GraphQLVariantNode>>
  }
}

export interface GraphQLCollectionResponse {
  collectionByHandle: {
    id: string
    title: string
    description: string
    products: {
      edges: Array<GraphQLEdge<GraphQLProductNode>>
    }
  }
}

export interface GraphQLProductResponse {
  productByHandle: GraphQLProductNode
}

export interface GraphQLCheckoutResponse {
  checkoutCreate: {
    checkout: {
      id: string
      webUrl: string
      lineItems: {
        edges: Array<{
          node: {
            id: string
            title: string
            quantity: number
            variant: {
              id: string
              title: string
              priceV2: ShopifyMoney
              image: GraphQLImageNode
            }
          }
        }>
      }
      subtotalPriceV2: ShopifyMoney
    }
    checkoutUserErrors: Array<{
      message: string
      field: string[]
    }>
  }
}
