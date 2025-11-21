import { SHOPIFY } from './constants'
import type {
  ShopifyCollection,
  ShopifyProduct,
  GraphQLCollectionResponse,
  GraphQLProductResponse,
  GraphQLCheckoutResponse,
  GraphQLProductNode,
  GraphQLEdge,
  GraphQLImageNode,
  GraphQLVariantNode
} from '../types/shopify.types'

const domain = SHOPIFY.STORE_DOMAIN.replace(/^https?:\/\//, '').replace(/\/$/, '')
const STOREFRONT_API_URL = `https://${domain}/api/${SHOPIFY.STOREFRONT_API_VERSION}/graphql.json`

// Helper function to make Shopify API requests
async function shopifyFetch<T>(query: string, variables: Record<string, string | number | boolean | object> = {}): Promise<T> {
  try {
    const response = await fetch(STOREFRONT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY.STOREFRONT_API_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
    })

    if (!response.ok) {
      throw new Error(`Shopify API error: ${response.statusText}`)
    }

    const json = await response.json()

    if (json.errors) {
      console.error('Shopify GraphQL Errors:', json.errors)
      throw new Error(json.errors[0].message)
    }

    return json.data
  } catch (error) {
    console.error('Shopify API error details:', error)
    console.log('Store Domain:', SHOPIFY.STORE_DOMAIN)
    console.log('Token present:', !!SHOPIFY.STOREFRONT_API_TOKEN)
    throw error
  }
}

// Get products by collection handle
export async function getCollectionProducts(handle: string): Promise<ShopifyCollection> {
  const query = `
    query getCollectionProducts($handle: String!) {
      collectionByHandle(handle: $handle) {
        id
        title
        description
        products(first: 20) {
          edges {
            node {
              id
              title
              description
              handle
              availableForSale
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
                maxVariantPrice {
                  amount
                  currencyCode
                }
              }
              images(first: 5) {
                edges {
                  node {
                    url
                    altText
                  }
                }
              }
              variants(first: 10) {
                edges {
                  node {
                    id
                    title
                    priceV2 {
                      amount
                      currencyCode
                    }
                    availableForSale
                    selectedOptions {
                      name
                      value
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `

  const data = await shopifyFetch<GraphQLCollectionResponse>(query, { handle })

  if (!data.collectionByHandle) {
    throw new Error(`Collection with handle "${handle}" not found`)
  }

  const collection = data.collectionByHandle

  return {
    id: collection.id,
    title: collection.title,
    description: collection.description,
    handle,
    products: collection.products.edges.map((edge: GraphQLEdge<GraphQLProductNode>) => ({
      id: edge.node.id,
      title: edge.node.title,
      description: edge.node.description,
      handle: edge.node.handle,
      availableForSale: edge.node.availableForSale,
      priceRange: edge.node.priceRange,
      images: edge.node.images.edges.map((imgEdge: GraphQLEdge<GraphQLImageNode>) => imgEdge.node),
      variants: edge.node.variants.edges.map((varEdge: GraphQLEdge<GraphQLVariantNode>) => ({
        ...varEdge.node,
        price: varEdge.node.priceV2,
      })),
    })),
  }
}

// Get single product by handle
export async function getProduct(handle: string): Promise<ShopifyProduct> {
  const query = `
    query getProduct($handle: String!) {
      productByHandle(handle: $handle) {
        id
        title
        description
        handle
        availableForSale
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        images(first: 10) {
          edges {
            node {
              url
              altText
            }
          }
        }
        variants(first: 20) {
          edges {
            node {
              id
              title
              priceV2 {
                amount
                currencyCode
              }
              availableForSale
              selectedOptions {
                name
                value
              }
            }
          }
        }
      }
    }
  `

  const data = await shopifyFetch<GraphQLProductResponse>(query, { handle })

  if (!data.productByHandle) {
    throw new Error(`Product with handle "${handle}" not found`)
  }

  const product = data.productByHandle

  return {
    id: product.id,
    title: product.title,
    description: product.description,
    handle: product.handle,
    availableForSale: product.availableForSale,
    priceRange: product.priceRange,
    images: product.images.edges.map((edge: GraphQLEdge<GraphQLImageNode>) => edge.node),
    variants: product.variants.edges.map((edge: GraphQLEdge<GraphQLVariantNode>) => ({
      ...edge.node,
      price: edge.node.priceV2,
    })),
  }
}

// Create checkout
export async function createCheckout(lineItems: Array<{ variantId: string; quantity: number }>) {
  const query = `
    mutation checkoutCreate($input: CheckoutCreateInput!) {
      checkoutCreate(input: $input) {
        checkout {
          id
          webUrl
          lineItems(first: 10) {
            edges {
              node {
                id
                title
                quantity
                variant {
                  id
                  title
                  priceV2 {
                    amount
                    currencyCode
                  }
                  image {
                    url
                    altText
                  }
                }
              }
            }
          }
          subtotalPriceV2 {
            amount
            currencyCode
          }
        }
        checkoutUserErrors {
          message
          field
        }
      }
    }
  `

  const data = await shopifyFetch<GraphQLCheckoutResponse>(query, {
    input: {
      lineItems: lineItems.map((item) => ({
        variantId: item.variantId,
        quantity: item.quantity,
      })),
    },
  })

  if (data.checkoutCreate.checkoutUserErrors.length > 0) {
    throw new Error(data.checkoutCreate.checkoutUserErrors[0].message)
  }

  return data.checkoutCreate.checkout
}
