import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'

export default function Checkout() {
    const { cartTotal, clearCart } = useCart()
    const navigate = useNavigate()
    const [isProcessing, setIsProcessing] = useState(false)

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsProcessing(true)

        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000))

        clearCart()
        navigate('/shop') // Or a success page
        alert('Payment Successful! Thank you for your support.')
    }

    return (
        <div className="min-h-screen bg-white text-black flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-gray-50 p-8 rounded-2xl border border-gray-100 shadow-xl">
                <h1 className="text-3xl font-bold mb-8 text-center font-primary">Checkout</h1>
                <p className="text-center text-gray-500 mb-8">Total: ${cartTotal.toFixed(2)}</p>

                <form onSubmit={handlePayment} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                        <input type="text" placeholder="0000 0000 0000 0000" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5 bg-white" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Expiry</label>
                            <input type="text" placeholder="MM/YY" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5 bg-white" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">CVC</label>
                            <input type="text" placeholder="123" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5 bg-white" required />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isProcessing}
                        className="w-full py-4 bg-black text-white rounded-full font-bold hover:bg-gray-800 transition-colors disabled:opacity-50"
                    >
                        {isProcessing ? 'Processing...' : 'Pay Now'}
                    </button>
                </form>

                <button onClick={() => navigate('/cart')} className="w-full mt-4 text-gray-500 hover:text-black">
                    Back to Cart
                </button>
            </div>
        </div>
    )
}
