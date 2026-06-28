# Shopify Checkout - Quick Reference

> **Note**: This integration uses Shopify's **Cart API** (2024-01+), which replaced the deprecated Checkout API. See `CART_API_MIGRATION.md` for details.

## ✅ What's Implemented

### Pages
- **`/checkout`** - Order summary and checkout initiation
- **`/order-success`** - Post-purchase confirmation page
- **`/cart`** - Shopping cart (existing)

### API Functions (`src/utils/shopify.ts`)
```typescript
// Create checkout and redirect to Shopify
createCheckout(lineItems, options?)

// Get checkout status
getCheckout(checkoutId)

// Associate customer (if using customer accounts)
associateCustomerToCheckout(checkoutId, customerAccessToken)
```

## 🔄 User Flow

1. **Browse & Add to Cart** → Products added to local cart
2. **View Cart** (`/cart`) → Review items, adjust quantities
3. **Proceed to Checkout** (`/checkout`) → See order summary
4. **Click "Proceed to Checkout"** → Redirect to Shopify
5. **Complete Payment** → On Shopify's secure checkout
6. **Return to Site** (`/order-success`) → Confirmation & cart cleared

## 🔑 Environment Setup

```env
VITE_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
VITE_SHOPIFY_STOREFRONT_TOKEN=your-token-here
VITE_SHOPIFY_API_VERSION=2024-01
```

## 📝 Custom Order Attributes

Each order includes:
- **Source**: "Perfect World Frontend"
- **Order Type**: "Charity Support"
- **Supported Projects**: List of products/collections
- **Note**: Thank you message

These appear in Shopify admin under order details.

## 🧪 Testing

### Test Credit Card (Shopify Test Mode)
```
Card: 4242 4242 4242 4242
Expiry: Any future date
CVC: Any 3 digits
```

### Test Flow
```bash
# 1. Start dev server
npm run dev

# 2. Navigate to shop
http://localhost:5173/shop

# 3. Add products to cart
# 4. Go to cart → checkout
# 5. Complete test payment on Shopify
# 6. Verify redirect to success page
```

## ⚙️ Shopify Admin Configuration

### Required Settings
1. **Settings → Checkout**
   - Enable "Automatically fulfill orders"
   - Set return URL to your domain

2. **Settings → Apps and sales channels**
   - Create custom app (if not done)
   - Enable Storefront API
   - Grant required permissions

### Permissions Needed
- ✅ `unauthenticated_write_checkouts`
- ✅ `unauthenticated_read_checkouts`
- ✅ `unauthenticated_read_product_listings`
- ✅ `unauthenticated_read_customers`
- ✅ `unauthenticated_write_customers`

## 🎨 Customization Examples

### Add Customer Email
```typescript
const checkout = await createCheckout(lineItems, {
  email: 'customer@example.com'
})
```

### Add Custom Note
```typescript
const checkout = await createCheckout(lineItems, {
  note: 'Gift wrapping requested'
})
```

### Add Custom Attributes
```typescript
const checkout = await createCheckout(lineItems, {
  customAttributes: [
    { key: 'Gift Message', value: 'Happy Birthday!' },
    { key: 'Delivery Instructions', value: 'Leave at door' }
  ]
})
```

## 🚨 Common Issues

| Issue | Solution |
|-------|----------|
| "Failed to create checkout" | Check variant IDs are valid Shopify GIDs |
| Redirect not working | Verify no popup blockers, check webUrl |
| Cart not clearing | Ensure `/order-success` route is accessible |
| API errors | Verify environment variables are set |
| Products not loading | Check Storefront API permissions |

## 📊 Order Tracking

### In Shopify Admin
1. Go to **Orders**
2. Click on an order
3. Scroll to **Additional details**
4. See custom attributes and notes

### Via API (Future Enhancement)
```typescript
// Get checkout status
const checkout = await getCheckout(checkoutId)
console.log(checkout.completedAt) // null if not completed
```

## 🔐 Security Checklist

- ✅ No credit card data in frontend
- ✅ All payments on Shopify's servers
- ✅ API token in environment variables
- ✅ HTTPS in production
- ✅ Storefront API token (safe for frontend)
- ✅ PCI compliance handled by Shopify

## 📈 Next Steps

### Immediate
- [ ] Test checkout flow end-to-end
- [ ] Configure Shopify return URL
- [ ] Test with real products

### Production
- [ ] Set up Shopify webhooks
- [ ] Configure email notifications
- [ ] Add analytics tracking
- [ ] Set up shipping rates
- [ ] Configure tax settings

### Optional
- [ ] Add discount codes
- [ ] Implement customer accounts
- [ ] Add gift card support
- [ ] Multi-currency support
- [ ] Abandoned cart recovery

## 📚 Documentation

- Full guide: `SHOPIFY_CHECKOUT.md`
- Shopify API: https://shopify.dev/api/storefront
- Checkout API: https://shopify.dev/api/storefront/latest/mutations/checkoutCreate
