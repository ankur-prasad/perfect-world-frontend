import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../../contexts/CartContext'
import { useState } from 'react'
import { createCheckout } from '../../utils/shopify'
import GlassyButton from '../ui/GlassyButton'

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

const formatPrice = (amount: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR' }).format(amount)

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart, cartCount, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart()
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)

  const handleCheckout = async () => {
    if (cart.length === 0) {
      setCheckoutError('Your cart is empty')
      return
    }

    setIsCheckingOut(true)
    setCheckoutError(null)

    try {
      // Convert cart items to Shopify checkout format
      const lineItems = cart.map((item) => ({
        variantId: item.variantId,
        quantity: item.quantity,
      }))

      // Create checkout using Shopify API
      const checkout = await createCheckout(lineItems)

      if (checkout && checkout.webUrl) {
        const hasRichInLifeProduct = cart.some((item) =>
          item.title.toLowerCase().includes('rich in life')
        )
        let redirectUrl = checkout.webUrl
        if (hasRichInLifeProduct) {
          const separator = redirectUrl.includes('?') ? '&' : '?'
          redirectUrl = `${redirectUrl}${separator}discount=RICH10`
        }
        // Redirect to Shopify checkout
        window.location.href = redirectUrl
      } else {
        throw new Error('Checkout created but no webUrl returned')
      }
    } catch (error) {
      console.error('Checkout error details:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      setCheckoutError(`Failed to proceed to checkout: ${errorMessage}`)
      setIsCheckingOut(false)
    }
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleBackdropClick}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Drawer */}
          <motion.div
            className="relative w-full max-w-md h-full bg-gradient-to-b from-gray-900 to-black shadow-2xl flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            {/* Spacer to clear header */}
            <div className="h-20 flex-shrink-0" />

            {/* Header */}
            <div className="p-6 mx-5 border-b border-white/10 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white font-primary">Your Cart</h2>
                <p className="text-sm text-gray-400">
                  {cartCount} {cartCount === 1 ? 'item' : 'items'}
                </p>
              </div>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6">
                    <svg
                      className="w-12 h-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 font-primary">Your cart is empty</h3>
                  <p className="text-gray-400 my-2.5">Add some products to get started</p>
                  <div className="flex justify-center w-full">
                    <GlassyButton
                      label="Continue Shopping"
                      onClick={onClose}
                      variant="light"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div
                      key={`${item.variantId}-${item.variant}`}
                      className="flex gap-4 p-4 bg-white/5 rounded-2xl"
                    >
                      {/* Product Image */}
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-white/10 flex-shrink-0">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-semibold mb-1 truncate">{item.title}</h4>
                        {item.variant !== 'Default Title' && (
                          <p className="text-sm text-gray-400 mb-2">{item.variant}</p>
                        )}

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.variantId, Math.max(0, item.quantity - 1))}
                            aria-label="Decrease quantity"
                            className="w-11 h-11 flex items-center justify-center rounded-lg bg-white/10 text-white text-lg hover:bg-white/20 active:bg-white/25 transition-colors"
                          >
                            −
                          </button>
                          <span className="text-white font-medium w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                            aria-label="Increase quantity"
                            className="w-11 h-11 flex items-center justify-center rounded-lg bg-white/10 text-white text-lg hover:bg-white/20 active:bg-white/25 transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Price & Remove */}
                      <div className="flex flex-col items-end justify-between">
                        <button
                          onClick={() => removeFromCart(item.variantId)}
                          aria-label={`Remove ${item.title} from cart`}
                          className="p-2 -m-2 text-gray-400 hover:text-red-400 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                        <p className="text-white font-bold">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* Clear Cart */}
                  <button
                    onClick={clearCart}
                    className="w-full py-2 text-sm text-red-400 hover:text-red-300 transition-colors"
                  >
                    Clear Cart
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-white/10 space-y-4">
                {/* Error Message */}
                {checkoutError && (
                  <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 text-sm">
                    {checkoutError}
                  </div>
                )}

                {/* Subtotal */}
                <div className="flex items-center justify-between text-lg">
                  <span className="text-gray-300">Subtotal</span>
                  <span className="text-2xl font-bold text-white">{formatPrice(cartTotal)}</span>
                </div>

                {/* Charitable Impact Note */}
                <p className="text-sm text-gray-400 text-center">
                  100% of profits support charitable causes
                </p>

                {/* Trust signals */}
                <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  <span>Secure checkout powered by Shopify · All major payment methods</span>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${isCheckingOut
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-white text-black hover:bg-gray-200'
                    }`}
                >
                  {isCheckingOut ? (
                    <span className="flex items-center justify-center gap-3">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    'Checkout'
                  )}
                </button>

                {/* Continue Shopping */}
                <div className="flex justify-center w-full">
                  <GlassyButton
                    label="Continue Shopping"
                    onClick={onClose}
                    variant="primary"
                    className="w-auto min-w-[200px]"
                    background="rgba(255, 255, 255, 0.1)"
                    hoverBackground="rgba(255, 255, 255, 0.2)"
                  />
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
