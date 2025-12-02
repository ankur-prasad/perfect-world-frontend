import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
    {
        question: "How much of the profit is actually donated?",
        answer: "100%. We are committed to total transparency. Every cent of profit from your purchase goes directly to the project associated with the item."
    },
    {
        question: "Where are your products made?",
        answer: "We partner with ethical manufacturers who prioritize fair labor practices and sustainable production methods. Quality and conscience go hand in hand."
    },
    {
        question: "Can I choose which project my money supports?",
        answer: "Yes! Each collection is tied to a specific cause. By choosing a product from that collection, you are directly supporting that specific initiative."
    },
    {
        question: "Is shipping sustainable?",
        answer: "We strive to use plastic-free, recycled, and biodegradable packaging whenever possible. We are constantly working to minimize our carbon footprint."
    },
    {
        question: "How can I get more involved?",
        answer: "Beyond purchasing, you can spread the word, follow us on social media, or volunteer with our partner organizations. Every action counts."
    }
];

export default function FAQ() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    return (
        <section className="min-h-screen bg-gray-50 text-black relative z-10 flex items-center py-20">
            <div className="flex justify-center w-full">
                <div className="w-full px-4 max-w-[1200px]">
                    <motion.h2
                        className="text-5xl md:text-6xl font-bold mb-20 text-center"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        Frequently Asked Questions
                    </motion.h2>

                    <div className="space-y-6">
                        {faqs.map((faq, index) => (
                            <motion.div
                                key={index}
                                className="border border-gray-200 rounded-xl bg-white overflow-hidden"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <button
                                    onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                                    className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                                >
                                    <span className="text-2xl font-semibold">{faq.question}</span>
                                    <span className={`transform transition-transform duration-300 ${activeIndex === index ? 'rotate-180' : ''}`}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="6 9 12 15 18 9"></polyline>
                                        </svg>
                                    </span>
                                </button>

                                <AnimatePresence>
                                    {activeIndex === index && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                        >
                                            <div className="px-8 pb-8 text-lg text-gray-700 leading-relaxed">
                                                {faq.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
