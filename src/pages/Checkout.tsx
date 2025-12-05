import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCart } from '../contexts/CartContext'
import { createCheckout } from '../utils/shopify'
import Navigation from '../components/Layout/Navigation'
import Footer from '../components/Layout/Footer'

export default function Checkout() {
    const { cart, cartTotal } = useCart()
    const navigate = useNavigate()
    const [isProcessing, setIsProcessing] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        // Redirect to cart if empty
        if (cart.length === 0) {
            navigate('/cart')
        }
    }, [cart, navigate])

    const handleCheckout = async () => {
        setIsProcessing(true)
        setError(null)

        try {
            // Convert cart items to Shopify line items format
            const lineItems = cart.map((item) => ({
                variantId: item.variantId,
                quantity: item.quantity,
            }))

            console.log('Creating checkout with line items:', lineItems)

            // Create Shopify checkout
            const checkout = await createCheckout(lineItems)

            console.log('Checkout created:', checkout)

            // Redirect to Shopify's hosted checkout page
            if (checkout.webUrl) {
                window.location.href = checkout.webUrl
            } else {
                throw new Error('No checkout URL received from Shopify')
            }
        } catch (err) {
            console.error('Checkout error:', err)
            setError(
                err instanceof Error
                    ? err.message
                    : 'Failed to create checkout. Please try again.'
            )
            setIsProcessing(false)
        }
    }

    if (cart.length === 0) {
        return null // Will redirect via useEffect
    }

    return (
        <div className="min-h-screen bg-white text-black">
            <Navigation isDarkContent={true} />

            <div className="pt-32 pb-20 px-4 flex justify-center">
                <div className="w-full max-w-[800px]">
                    <h1 className="text-4xl md:text-5xl font-bold mb-12 font-primary">Checkout</h1>

                    {/* Order Summary */}
                    <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 mb-8">
                        <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

                        <div className="space-y-4 mb-6">
                            {cart.map((item) => (
                                <div key={item.variantId} className="flex gap-4 pb-4 border-b border-gray-200 last:border-0">
                                    <div className="w-20 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold">{item.title}</h3>
                                        <p className="text-sm text-gray-500">{item.variant}</p>
                                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-2 pt-4 border-t-2 border-gray-200">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>${cartTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Shipping</span>
                                <span>Calculated at checkout</span>
                            </div>
                            <div className="flex justify-between text-xl font-bold pt-2">
                                <span>Total</span>
                                <span>${cartTotal.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-xl mb-6"
                        >
                            <p className="font-semibold mb-1">Checkout Error</p>
                            <p className="text-sm">{error}</p>
                        </motion.div>
                    )}

                    {/* Checkout Info */}
                    <div className="bg-blue-50 border border-blue-200 text-blue-900 px-6 py-4 rounded-xl mb-8">
                        <p className="text-sm">
                            You'll be redirected to Shopify's secure checkout page to complete your purchase.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-4">
                        <button
                            onClick={handleCheckout}
                            disabled={isProcessing}
                            className={`w-full py-5 rounded-full font-bold text-xl transition-all ${
                                isProcessing
                                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                    : 'bg-black text-white hover:bg-gray-800'
                            }`}
                        >
                            {isProcessing ? (
                                <span className="flex items-center justify-center gap-3">
                                    <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
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
                                    Creating Checkout...
                                </span>
                            ) : (
                                'Proceed to Checkout'
                            )}
                        </button>

                        <button
                            onClick={() => navigate('/cart')}
                            disabled={isProcessing}
                            className="w-full py-5 rounded-full font-bold text-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all disabled:opacity-50"
                        >
                            Back to Cart
                        </button>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}
