import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCart } from '../contexts/CartContext'
import { usePageTitle } from '../hooks/usePageTitle'
import Navigation from '../components/Layout/Navigation'
import Footer from '../components/Layout/Footer'
import GlassyButton from '../components/ui/GlassyButton'

export default function Cart() {
    usePageTitle('Your Cart')
    const { cart, removeFromCart, updateQuantity, cartTotal } = useCart()

    const formatPrice = (amount: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR' }).format(amount)
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-white text-black">
            <Navigation isDarkContent={true} />

            <div className="pt-10 md:pt-32 pb-20 px-4 flex justify-center">
                <div className="w-full max-w-[1200px]">
                    <h1 className="text-4xl md:text-5xl font-bold mb-8 md:mb-12 font-primary">Your Cart</h1>

                    {cart.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-xl text-gray-500 mb-8">Your cart is empty.</p>
                            <GlassyButton
                                label="Continue Shopping"
                                to="/shop"
                                variant="primary"
                            />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                            <div className="lg:col-span-2 space-y-8">
                                {cart.map((item) => (
                                    <motion.div
                                        key={item.variantId}
                                        layout
                                        className="flex gap-6 p-6 bg-gray-50 rounded-2xl border border-gray-100"
                                    >
                                        <div className="w-24 h-32 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                        </div>

                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <div className="flex justify-between items-start">
                                                    <h3 className="text-lg font-bold">{item.title}</h3>
                                                    <button
                                                        onClick={() => removeFromCart(item.variantId)}
                                                        className="text-gray-400 hover:text-red-500 transition-colors"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>
                                                <p className="text-gray-500 text-sm">{item.variant}</p>
                                            </div>

                                            <div className="flex justify-between items-end">
                                                <div className="flex items-center gap-3 bg-white rounded-full px-3 py-1 border border-gray-200">
                                                    <button
                                                        onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                                                        className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-black"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="w-4 text-center text-sm font-medium">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                                                        className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-black"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <p className="font-bold text-lg">
                                                    {formatPrice(item.price * item.quantity)}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="lg:col-span-1">
                                <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 sticky top-32">
                                    <h2 className="text-2xl font-bold mb-6">Summary</h2>

                                    <div className="space-y-4 mb-8">
                                        <div className="flex justify-between text-gray-600">
                                            <span>Subtotal</span>
                                            <span>{formatPrice(cartTotal)}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-600">
                                            <span>Shipping</span>
                                            <span>Calculated at checkout</span>
                                        </div>
                                        <div className="h-px bg-gray-200 my-4" />
                                        <div className="flex justify-between text-xl font-bold">
                                            <span>Total</span>
                                            <span>{formatPrice(cartTotal)}</span>
                                        </div>
                                    </div>

                                    <div className="w-full">
                                        <GlassyButton
                                            label="Proceed to Checkout"
                                            onClick={() => navigate('/checkout')}
                                            variant="primary"
                                            className="w-full"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    )
}
