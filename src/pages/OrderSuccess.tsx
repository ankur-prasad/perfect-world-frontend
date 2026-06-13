import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import Navigation from '../components/Layout/Navigation'
import Footer from '../components/Layout/Footer'

export default function OrderSuccess() {
    const [searchParams] = useSearchParams()
    const { clearCart } = useCart()
    const orderId = searchParams.get('order_id')
    const checkoutId = searchParams.get('checkout_id')

    // Clear cart when user lands on success page
    useEffect(() => {
        clearCart()
    }, [clearCart])

    return (
        <div className="min-h-screen bg-white text-black">
            <Navigation isDarkContent={true} />

            <div className="pt-12 md:pt-32 pb-20 px-4 flex justify-center">
                <div className="w-full max-w-2xl text-center">
                    {/* Success Icon */}
                    <div className="mb-8 flex justify-center">
                        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                            <svg
                                className="w-12 h-12 text-green-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </div>
                    </div>

                    {/* Success Message */}
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 font-primary">
                        Thank You for Your Purchase!
                    </h1>
                    <p className="text-xl text-gray-600 mb-8">
                        Your order has been successfully placed.
                    </p>

                    {/* Order Details */}
                    {(orderId || checkoutId) && (
                        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 mb-8">
                            <h2 className="text-lg font-semibold mb-2">Order Details</h2>
                            {orderId && (
                                <p className="text-gray-600">
                                    Order ID: <span className="font-mono text-sm">{orderId}</span>
                                </p>
                            )}
                            {checkoutId && (
                                <p className="text-gray-600">
                                    Checkout ID: <span className="font-mono text-sm">{checkoutId}</span>
                                </p>
                            )}
                        </div>
                    )}

                    {/* Impact Message */}
                    <div className="bg-blue-50 p-8 rounded-2xl border border-blue-100 mb-8">
                        <h2 className="text-2xl font-bold mb-3">Making a Difference</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Your purchase directly supports our mission to create positive change in the world.
                            You'll receive a confirmation email shortly with your order details and tracking information.
                        </p>
                    </div>

                    {/* Next Steps */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold mb-4">What's Next?</h3>
                        <div className="grid md:grid-cols-3 gap-4 mb-8">
                            <div className="bg-gray-50 p-6 rounded-xl">
                                <div className="text-3xl mb-2">📧</div>
                                <h4 className="font-semibold mb-1">Check Your Email</h4>
                                <p className="text-sm text-gray-600">
                                    Order confirmation sent
                                </p>
                            </div>
                            <div className="bg-gray-50 p-6 rounded-xl">
                                <div className="text-3xl mb-2">📦</div>
                                <h4 className="font-semibold mb-1">Track Your Order</h4>
                                <p className="text-sm text-gray-600">
                                    Shipping updates coming soon
                                </p>
                            </div>
                            <div className="bg-gray-50 p-6 rounded-xl">
                                <div className="text-3xl mb-2">🌍</div>
                                <h4 className="font-semibold mb-1">See Your Impact</h4>
                                <p className="text-sm text-gray-600">
                                    Learn about the projects you support
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/shop"
                            className="px-12 py-5 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition-colors"
                        >
                            Continue Shopping
                        </Link>
                        <Link
                            to="/projects"
                            className="px-12 py-5 bg-gray-100 text-black rounded-full font-semibold hover:bg-gray-200 transition-colors"
                        >
                            Explore Our Projects
                        </Link>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}
