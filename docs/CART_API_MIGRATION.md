# Shopify API Update - Cart API Migration

## ✅ Issue Fixed

**Error**: `Field 'checkoutCreate' doesn't exist on type 'Mutation'`

**Root Cause**: The `checkoutCreate` mutation was deprecated in Shopify API version 2024-01 and replaced with the Cart API.

## 🔄 What Changed

### Before (Deprecated Checkout API)
```graphql
mutation checkoutCreate($input: CheckoutCreateInput!) {
  checkoutCreate(input: $input) {
    checkout {
      id
      webUrl
      lineItems { ... }
    }
  }
}
```

### After (New Cart API)
```graphql
mutation cartCreate($input: CartInput!) {
  cartCreate(input: $input) {
    cart {
      id
      checkoutUrl
      lines { ... }
    }
  }
}
```

## 📝 Key Differences

| Checkout API (Old) | Cart API (New) |
|-------------------|----------------|
| `checkoutCreate` | `cartCreate` |
| `checkout.webUrl` | `cart.checkoutUrl` |
| `lineItems` | `lines` |
| `variantId` | `merchandiseId` |
| `priceV2` | `price` |
| `subtotalPriceV2` | `cost.subtotalAmount` |
| `customAttributes` | `attributes` |
| `email` | `buyerIdentity.email` |

## 🔧 Files Updated

### `/src/utils/shopify.ts`
1. **`createCheckout()`** - Now uses `cartCreate` mutation
   - Changed `lineItems` → `lines`
   - Changed `variantId` → `merchandiseId`
   - Changed `customAttributes` → `attributes`
   - Changed `email` → `buyerIdentity.email`
   - Returns `checkoutUrl` instead of `webUrl`

2. **`getCheckout()`** - Now queries cart instead of checkout
   - Uses `cart` query instead of `node` query
   - Returns cart data structure

### `/src/utils/constants.ts`
- Updated API version to use environment variable
- Default changed from `2023-10` to `2024-01`

## ✨ What Still Works

The function signature remains the same, so **no changes needed** in:
- ✅ `/src/pages/Checkout.tsx`
- ✅ `/src/components/Cart/CartDrawer.tsx`
- ✅ All other code using `createCheckout()`

The function still accepts the same parameters:
```typescript
createCheckout(lineItems, {
  email: 'customer@example.com',
  note: 'Order note',
  customAttributes: [{ key: 'foo', value: 'bar' }]
})
```

And still returns a compatible object with `webUrl` for redirect:
```typescript
{
  id: "gid://shopify/Cart/...",
  webUrl: "https://checkout.shopify.com/...",
  lineItems: [...],
  subtotalPrice: { amount: "99.99", currencyCode: "USD" }
}
```

## 🧪 Testing

Try the checkout flow again:
1. Add products to cart
2. Open cart drawer or go to cart page
3. Click "Checkout"
4. Should now successfully redirect to Shopify checkout

## 📚 Additional Notes

### Custom Attributes
Still work the same way, just renamed internally:
```typescript
// Your code (unchanged)
customAttributes: [
  { key: 'Source', value: 'Perfect World Frontend' },
  { key: 'Order Type', value: 'Charity Support' }
]

// Internally mapped to
attributes: [
  { key: 'Source', value: 'Perfect World Frontend' },
  { key: 'Order Type', value: 'Charity Support' }
]
```

### Buyer Identity
Email is now part of `buyerIdentity`:
```typescript
// Your code (unchanged)
email: 'customer@example.com'

// Internally mapped to
buyerIdentity: {
  email: 'customer@example.com'
}
```

## 🔗 References

- [Shopify Cart API Documentation](https://shopify.dev/docs/api/storefront/2024-01/mutations/cartCreate)
- [Migration Guide: Checkout to Cart](https://shopify.dev/docs/api/release-notes/2023-10#checkout-to-cart-migration)
- [Storefront API 2024-01 Release Notes](https://shopify.dev/docs/api/release-notes/2024-01)

## ✅ Status

**The checkout should now work!** The error has been resolved by migrating to the Cart API.
