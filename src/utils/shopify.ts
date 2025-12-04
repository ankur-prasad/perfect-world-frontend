import { SHOPIFY } from './constants'
import type {
  ShopifyCollection,
  ShopifyProduct,
  GraphQLCollectionResponse,
  GraphQLProductResponse,
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
    console.log('Shopify Fetch:', {
      url: STOREFRONT_API_URL,
      tokenPresent: !!SHOPIFY.STOREFRONT_API_TOKEN,
      tokenLength: SHOPIFY.STOREFRONT_API_TOKEN?.length
    })
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
              options {
                id
                name
                values
              }
              collections(first: 5) {
                edges {
                  node {
                    handle
                    title
                  }
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
      options: edge.node.options,
      images: edge.node.images.edges.map((imgEdge: GraphQLEdge<GraphQLImageNode>) => imgEdge.node),
      variants: edge.node.variants.edges.map((varEdge: GraphQLEdge<GraphQLVariantNode>) => ({
        ...varEdge.node,
        price: varEdge.node.priceV2,
      })),
      collections: edge.node.collections?.edges.map((colEdge) => colEdge.node) || [],
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
        options {
          id
          name
          values
        }
        collections(first: 10) {
          edges {
            node {
              handle
              title
            }
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
    options: product.options,
    images: product.images.edges.map((edge: GraphQLEdge<GraphQLImageNode>) => edge.node),
    variants: product.variants.edges.map((edge: GraphQLEdge<GraphQLVariantNode>) => ({
      ...edge.node,
      price: edge.node.priceV2,
    })),
    collections: product.collections.edges.map((edge: GraphQLEdge<{ handle: string; title: string }>) => edge.node),
  }
}

// Helper to ensure GID format
function formatGid(id: string | number): string {
  const idStr = String(id)
  if (idStr.startsWith('gid://')) return idStr
  return `gid://shopify/ProductVariant/${idStr}`
}

// Create checkout using Cart API (2024-01+)
export async function createCheckout(
  lineItems: Array<{ variantId: string; quantity: number }>,
  options?: {
    email?: string
    note?: string
    customAttributes?: Array<{ key: string; value: string }>
  }
) {
  const query = `
    mutation cartCreate($input: CartInput!) {
      cartCreate(input: $input) {
        cart {
          id
          checkoutUrl
          lines(first: 10) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    image {
                      url
                      altText
                    }
                    product {
                      title
                    }
                  }
                }
              }
            }
          }
          cost {
            subtotalAmount {
              amount
              currencyCode
            }
            totalAmount {
              amount
              currencyCode
            }
          }
        }
        userErrors {
          message
          field
        }
      }
    }
  `

  const input: any = {
    lines: lineItems.map((item) => ({
      merchandiseId: formatGid(item.variantId),
      quantity: item.quantity,
    })),
  }

  // Add optional parameters if provided
  if (options?.email) {
    input.buyerIdentity = { email: options.email }
  }
  if (options?.note) {
    input.note = options.note
  }
  if (options?.customAttributes && options.customAttributes.length > 0) {
    input.attributes = options.customAttributes
  }

  console.log('Cart Create Input:', JSON.stringify(input, null, 2))

  const data = await shopifyFetch<any>(query, { input })

  console.log('Cart Create Response:', JSON.stringify(data, null, 2))

  if (data?.cartCreate?.userErrors?.length > 0) {
    throw new Error(data.cartCreate.userErrors[0].message)
  }

  if (!data?.cartCreate?.cart) {
    throw new Error('Failed to create cart: Shopify returned no cart object. Check if Variant ID is valid and available in the Sales Channel.')
  }

  // Return in checkout-compatible format
  return {
    id: data.cartCreate.cart.id,
    webUrl: data.cartCreate.cart.checkoutUrl,
    lineItems: data.cartCreate.cart.lines,
    subtotalPrice: data.cartCreate.cart.cost.subtotalAmount,
  }
}

// Get cart by ID (replaces getCheckout for API 2024-01+)
export async function getCheckout(cartId: string) {
  const query = `
    query getCart($cartId: ID!) {
      cart(id: $cartId) {
        id
        checkoutUrl
        createdAt
        updatedAt
        lines(first: 10) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  product {
                    title
                  }
                }
              }
            }
          }
        }
        cost {
          subtotalAmount {
            amount
            currencyCode
          }
          totalAmount {
            amount
            currencyCode
          }
        }
      }
    }
  `

  const data = await shopifyFetch<any>(query, { cartId })
  return data.cart
}

// Associate customer to checkout (if you have customer accounts enabled)
export async function associateCustomerToCheckout(
  checkoutId: string,
  customerAccessToken: string
) {
  const query = `
    mutation checkoutCustomerAssociateV2($checkoutId: ID!, $customerAccessToken: String!) {
      checkoutCustomerAssociateV2(
        checkoutId: $checkoutId
        customerAccessToken: $customerAccessToken
      ) {
        checkout {
          id
          webUrl
        }
        checkoutUserErrors {
          message
          field
        }
      }
    }
  `

  const data = await shopifyFetch<any>(query, {
    checkoutId,
    customerAccessToken,
  })

  if (data.checkoutCustomerAssociateV2.checkoutUserErrors.length > 0) {
    throw new Error(data.checkoutCustomerAssociateV2.checkoutUserErrors[0].message)
  }

  return data.checkoutCustomerAssociateV2.checkout
}

// --- Customer Account API Helpers ---

export function generateCustomerAccountLoginUrl(redirectUri: string, state?: string) {
  const params = new URLSearchParams({
    client_id: SHOPIFY.CUSTOMER_ACCOUNT_API.CLIENT_ID,
    response_type: 'code',
    redirect_uri: redirectUri,
    scope: 'openid email',
  })

  if (state) {
    params.append('state', state)
  }

  return `${SHOPIFY.CUSTOMER_ACCOUNT_API.AUTH_URL}?${params.toString()}`
}

export function generateCustomerAccountLogoutUrl(postLogoutRedirectUri?: string) {
  const url = new URL(SHOPIFY.CUSTOMER_ACCOUNT_API.LOGOUT_URL)

  if (postLogoutRedirectUri) {
    url.searchParams.append('post_logout_redirect_uri', postLogoutRedirectUri)
    url.searchParams.append('client_id', SHOPIFY.CUSTOMER_ACCOUNT_API.CLIENT_ID)
  }

  return url.toString()
}

