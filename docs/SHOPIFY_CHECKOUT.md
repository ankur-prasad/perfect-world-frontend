# Shopify Checkout Integration Guide

## Overview

This application now uses Shopify's native checkout system instead of a custom payment form. This ensures compliance with Shopify's API License and Terms of Use, and provides a secure, PCI-compliant checkout experience.

## How It Works

### 1. **Cart Management**
- Users add products to their cart (managed locally via `CartContext`)
- Cart data is stored in localStorage for persistence
- Cart items include: `variantId`, `productId`, `title`, `variant`, `price`, `image`, `quantity`

### 2. **Checkout Flow**
1. User clicks "Proceed to Checkout" from the cart page
2. App navigates to `/checkout` page
3. Checkout page displays order summary
4. User clicks "Proceed to Checkout" button
5. App calls `createCheckout()` from Shopify API
6. Shopify returns a checkout object with a `webUrl`
7. User is redirected to Shopify's hosted checkout page
8. User completes payment on Shopify
9. After successful payment, user is redirected back to your site

### 3. **Return URL Configuration**

You need to configure the return URL in your Shopify admin:

1. Go to **Settings** → **Checkout**
2. Under **Order status page**, configure:
   - **Additional scripts** (optional for tracking)
   - **Return to cart URL**: `https://yourdomain.com/cart`
   - **Order status page URL**: Configure to redirect to `https://yourdomain.com/order-success`

Alternatively, you can set the return URL when creating the checkout by adding it to the checkout object.

## API Permissions

Your Shopify app has the following Storefront API permissions:

### Checkout Permissions
- ✅ `unauthenticated_write_checkouts` - Create checkouts
- ✅ `unauthenticated_read_checkouts` - Read checkout data

### Product Permissions
- ✅ `unauthenticated_read_content`
- ✅ `unauthenticated_read_product_listings`
- ✅ `unauthenticated_read_product_inventory`
- ✅ `unauthenticated_read_product_pickup_locations`
- ✅ `unauthenticated_read_product_tags`
- ✅ `unauthenticated_read_selling_plans`
- ✅ `unauthenticated_read_bundles`
- ✅ `unauthenticated_read_shop_pay_installments_pricing`

### Customer Permissions
- ✅ `unauthenticated_write_customers`
- ✅ `unauthenticated_read_customers`
- ✅ `unauthenticated_read_customer_tags`

### Other Permissions
- ✅ `unauthenticated_read_metaobjects`
- ✅ `unauthenticated_write_bulk_operations`
- ✅ `unauthenticated_read_bulk_operations`

## Key Files

### `/src/pages/Checkout.tsx`
- Displays order summary
- Creates Shopify checkout
- Redirects to Shopify's hosted checkout

### `/src/pages/OrderSuccess.tsx`
- Success page after checkout completion
- Clears the cart
- Shows order confirmation

### `/src/utils/shopify.ts`
Main Shopify API functions:

#### `createCheckout(lineItems, options?)`
Creates a new checkout session.

**Parameters:**
- `lineItems`: Array of `{ variantId: string, quantity: number }`
- `options` (optional):
  - `email?: string` - Pre-fill customer email
  - `note?: string` - Add order note
  - `customAttributes?: Array<{ key: string, value: string }>` - Custom metadata

**Returns:** Checkout object with `webUrl` for redirect

**Example:**
```typescript
const checkout = await createCheckout(
  [
    { variantId: 'gid://shopify/ProductVariant/123', quantity: 2 },
    { variantId: 'gid://shopify/ProductVariant/456', quantity: 1 }
  ],
  {
    email: 'customer@example.com',
    note: 'Gift wrapping requested',
    customAttributes: [
      { key: 'source', value: 'web' }
    ]
  }
)

window.location.href = checkout.webUrl
```

#### `getCheckout(checkoutId)`
Retrieves checkout status by ID.

**Parameters:**
- `checkoutId`: Shopify checkout ID

**Returns:** Checkout object with status

#### `associateCustomerToCheckout(checkoutId, customerAccessToken)`
Associates a logged-in customer to a checkout (requires customer accounts).

## Environment Variables

Make sure your `.env` file has the following:

```env
VITE_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
VITE_SHOPIFY_STOREFRONT_TOKEN=your-storefront-access-token
VITE_SHOPIFY_API_VERSION=2024-01
```

## Testing the Integration

### 1. **Test Mode**
Use Shopify's test mode for development:
- Enable test mode in Shopify admin
- Use test credit card: `4242 4242 4242 4242`
- Any future expiry date
- Any 3-digit CVC

### 2. **Test Flow**
1. Add products to cart
2. Go to cart page
3. Click "Proceed to Checkout"
4. Verify order summary is correct
5. Click "Proceed to Checkout" again
6. Should redirect to Shopify checkout
7. Complete test payment
8. Should return to your success page

## Customization Options

### Custom Attributes
You can add custom data to orders:

```typescript
const checkout = await createCheckout(lineItems, {
  customAttributes: [
    { key: 'project_support', value: 'Plant-For-The-Planet' },
    { key: 'gift_message', value: 'Happy Birthday!' }
  ]
})
```

### Pre-fill Customer Email
If you have the customer's email (e.g., from a newsletter signup):

```typescript
const checkout = await createCheckout(lineItems, {
  email: userEmail
})
```

### Order Notes
Add special instructions:

```typescript
const checkout = await createCheckout(lineItems, {
  note: 'Please use eco-friendly packaging'
})
```

## Post-Purchase Flow

### Option 1: URL Parameters (Current)
After successful checkout, Shopify can redirect to:
```
https://yourdomain.com/order-success?order_id=123&checkout_id=abc
```

### Option 2: Webhooks (Recommended for Production)
For production, set up Shopify webhooks to handle order events:

1. **Orders/Create** - Triggered when order is created
2. **Checkouts/Create** - Triggered when checkout is created
3. **Checkouts/Update** - Triggered when checkout is updated

You'll need a backend server to receive webhooks.

## Cart Persistence

The cart is stored in localStorage and persists across sessions. It's only cleared when:
1. User completes checkout (on success page)
2. User manually clears cart
3. User removes all items

## Security Notes

✅ **What's Secure:**
- All payment processing happens on Shopify's PCI-compliant servers
- No credit card data touches your application
- Shopify handles fraud detection and prevention
- SSL/TLS encryption for all API calls

⚠️ **Important:**
- Never store credit card information
- Always use HTTPS in production
- Keep your Storefront API token secure (use environment variables)
- The Storefront API token is safe to use in frontend code (it's read-only for most operations)

## Troubleshooting

### "Failed to create checkout"
- Check that all variant IDs are valid Shopify GIDs
- Verify products are available for sale
- Check API token permissions

### Redirect not working
- Verify Shopify checkout settings
- Check that webUrl is being returned from API
- Ensure no popup blockers are interfering

### Cart not clearing after purchase
- Check that OrderSuccess page is being reached
- Verify clearCart() is being called
- Check browser console for errors

## Next Steps

### For Production:
1. Set up Shopify webhooks for order tracking
2. Configure proper return URLs in Shopify admin
3. Add order confirmation emails (handled by Shopify)
4. Set up analytics tracking on checkout
5. Test with real payment methods
6. Configure shipping rates in Shopify admin
7. Set up tax calculations in Shopify admin

### Optional Enhancements:
- Add discount code support
- Implement customer accounts
- Add shipping address validation
- Support multiple currencies
- Add gift card support
- Implement abandoned cart recovery

## Resources

- [Shopify Storefront API Docs](https://shopify.dev/api/storefront)
- [Checkout API Reference](https://shopify.dev/api/storefront/latest/mutations/checkoutCreate)
- [Shopify API License](https://shopify.dev/api/usage/api-license)
